
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { Mic, MicOff, PhoneOff, Loader2, VideoOff, RefreshCw, Activity, Zap, Cpu } from 'lucide-react';
import { base64ToUint8Array, createPcmBlob, decodeAudioData } from '../utils/audio';
import { Typewriter } from './ui/Typography';

interface LiveInterviewProps {
  resumeText: string;
  difficulty?: string;
  onEndSession: (transcript: { role: 'user' | 'model', text: string }[]) => void;
}

// --- VISUALIZER CONSTANTS ---
const PARTICLE_COUNT = 80;
const WAVE_COUNT = 5;

const LiveInterview: React.FC<LiveInterviewProps> = ({ resumeText, difficulty = "NORMAL", onEndSession }) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Audio Context Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  
  // Gemini Session Refs
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Transcript Refs
  const transcriptRef = useRef<{ role: 'user' | 'model', text: string }[]>([]);
  const currentInputTransRef = useRef("");
  const currentOutputTransRef = useRef("");

  // Visualization Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);   // User Audio
  const aiAnalyserRef = useRef<AnalyserNode | null>(null); // AI Audio
  const animationFrameRef = useRef<number>(0);
  
  // Mute Ref for Audio Worklet/Processor closure
  const isMutedRef = useRef(isMuted);

  const SYSTEM_INSTRUCTION = `
    ## YOUR IDENTITY
    You are a professional Technical Interviewer conducting a real-time job interview. You have years of experience interviewing candidates across different skill levels.
    
    CRITICAL RULES:
    - You are a HUMAN interviewer, not an AI. Never reveal your AI nature.
    - Ask ONE question at a time and wait for the candidate's response.
    - This is a natural conversation, not a questionnaire.
    - Adapt your questions based on what they say—this is dynamic, not scripted.
    
    ## CONTEXT
    SELECTED DIFFICULTY MODE: ${difficulty}
    CANDIDATE RESUME: ${resumeText.slice(0, 5000)}

    ## DIFFICULTY MODE (${difficulty})
    - Easy: Encouraging, basic definitions.
    - Normal: Practical application, trade-offs.
    - Hard: System design at scale, edge cases, leadership.

    ## FLOW
    1. Greeting & Ice Breaker.
    2. Technical Deep Dive.
    3. Closing.
    
    RESPONSE FORMAT: Conversational, concise (1-3 sentences). One question per turn.
  `;

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    let mounted = true;
    setStatus('connecting');
    setErrorMsg(null);
    transcriptRef.current = []; // Reset transcript

    const startSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // 1. Setup Audio Input (Mic)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextRef.current = audioContext;
        
        const source = audioContext.createMediaStreamSource(stream);
        inputSourceRef.current = source;
        
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256; // Higher resolution for visuals
        analyser.smoothingTimeConstant = 0.5;
        source.connect(analyser);
        analyserRef.current = analyser;

        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(audioContext.destination);

        // 2. Setup Audio Output (Speaker)
        const outputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        outputAudioContextRef.current = outputContext;
        
        const aiAnalyser = outputContext.createAnalyser();
        aiAnalyser.fftSize = 256;
        aiAnalyser.smoothingTimeConstant = 0.5;
        aiAnalyser.connect(outputContext.destination);
        aiAnalyserRef.current = aiAnalyser;

        // 3. Connect to Gemini Live
        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: () => {
              if (mounted) setStatus('connected');
              console.log("Gemini Live Session Opened");
            },
            onmessage: async (message: LiveServerMessage) => {
              // Handle Transcription
              if (message.serverContent?.outputTranscription) {
                currentOutputTransRef.current += message.serverContent.outputTranscription.text;
              } else if (message.serverContent?.inputTranscription) {
                currentInputTransRef.current += message.serverContent.inputTranscription.text;
              }

              if (message.serverContent?.turnComplete) {
                 const userText = currentInputTransRef.current.trim();
                 const modelText = currentOutputTransRef.current.trim();
                 
                 if (userText) transcriptRef.current.push({ role: 'user', text: userText });
                 if (modelText) transcriptRef.current.push({ role: 'model', text: modelText });
                 
                 currentInputTransRef.current = "";
                 currentOutputTransRef.current = "";
                 
                 console.log("Turn Complete. History:", transcriptRef.current);
              }

              // Handle Audio
              const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (base64Audio) {
                try {
                  const audioData = base64ToUint8Array(base64Audio);
                  nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputContext.currentTime);
                  const audioBuffer = await decodeAudioData(audioData, outputContext);
                  const sourceNode = outputContext.createBufferSource();
                  sourceNode.buffer = audioBuffer;
                  sourceNode.connect(aiAnalyser); // Connect to visualizer
                  sourceNode.start(nextStartTimeRef.current);
                  nextStartTimeRef.current += audioBuffer.duration;
                  
                  sourcesRef.current.add(sourceNode);
                  sourceNode.onended = () => sourcesRef.current.delete(sourceNode);
                } catch (e) {
                  console.error("Audio decode error", e);
                }
              }
            },
            onclose: () => {
              if (mounted) setStatus('disconnected');
            },
            onerror: (err) => {
              console.error("Gemini Live Error", err);
              if (mounted) {
                setStatus('error');
                setErrorMsg(err instanceof Error ? err.message : String(err));
              }
            }
          },
          config: {
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            },
            systemInstruction: SYSTEM_INSTRUCTION,
          }
        });
        
        sessionPromiseRef.current = sessionPromise;

        // 4. Input Processing Loop
        processor.onaudioprocess = (e) => {
          if (isMutedRef.current) return;
          const inputData = e.inputBuffer.getChannelData(0);
          sessionPromiseRef.current?.then(session => {
            const pcmBlob = createPcmBlob(inputData);
            session.sendRealtimeInput({ media: pcmBlob });
          }).catch(() => {});
        };

        // Initialize Canvas Visualizer
        initVisualizer();

      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err.message || "Failed to initialize audio.");
      }
    };

    startSession();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [retryCount]);

  // --- ADVANCED CANVAS VISUALIZER ---
  const initVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Visualizer State
    let particles: {x: number, y: number, r: number, a: number, v: number}[] = [];
    for(let i=0; i<PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * rect.width,
            y: Math.random() * rect.height,
            r: Math.random() * 2,
            a: Math.random(),
            v: Math.random() * 0.5 + 0.1
        });
    }

    let time = 0;
    
    // Smooth Transition Values
    let smoothUserVol = 0;
    let smoothAiVol = 0;

    const render = () => {
        const width = rect.width;
        const height = rect.height;
        const cx = width / 2;
        const cy = height / 2;

        ctx.clearRect(0, 0, width, height);

        // Get Audio Data
        let userVol = 0;
        let aiVol = 0;
        
        if (analyserRef.current) {
            const data = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(data);
            userVol = data.reduce((a, b) => a + b) / data.length;
        }
        
        if (aiAnalyserRef.current) {
            const data = new Uint8Array(aiAnalyserRef.current.frequencyBinCount);
            aiAnalyserRef.current.getByteFrequencyData(data);
            aiVol = data.reduce((a, b) => a + b) / data.length;
        }

        // Smooth Interpolation
        smoothUserVol += (userVol - smoothUserVol) * 0.1;
        smoothAiVol += (aiVol - smoothAiVol) * 0.1;

        // Determine dominant state for coloring
        // User speaking -> Cyan/Emerald | AI Speaking -> Purple/Pink | Idle -> Blue
        const isAiTalking = smoothAiVol > 10;
        const isUserTalking = smoothUserVol > 10;

        let r, g, b;
        if (isAiTalking) { // Purple/Pink
            r = 168 + (smoothAiVol * 2); 
            g = 85; 
            b = 247 + (smoothAiVol);
        } else if (isUserTalking) { // Cyan/Emerald
            r = 6; 
            g = 182 + (smoothUserVol * 2); 
            b = 212 + smoothUserVol;
        } else { // Idle Deep Blue
            r = 99; g = 102; b = 241;
        }

        const baseColor = `rgba(${r}, ${g}, ${b}`;
        
        // 1. Draw Particles (Background)
        particles.forEach(p => {
            p.y -= p.v + (smoothAiVol + smoothUserVol) * 0.05; // Move faster with sound
            if (p.y < 0) p.y = height;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * (1 + (smoothAiVol/50)), 0, Math.PI * 2);
            ctx.fillStyle = `${baseColor}, ${p.a * 0.5})`;
            ctx.fill();
        });

        // 2. Draw Concentric Waves
        const maxRadius = Math.min(width, height) * 0.4;
        
        // Central Glow
        const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxRadius);
        gradient.addColorStop(0, `${baseColor}, 0.8)`);
        gradient.addColorStop(0.5, `${baseColor}, 0.1)`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, maxRadius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Dynamic Waveforms
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        // Draw multiple overlapping sine waves
        for (let w = 0; w < WAVE_COUNT; w++) {
            ctx.beginPath();
            
            // AI Waves (Center)
            if (isAiTalking || (!isUserTalking && !isAiTalking)) {
                const radius = 50 + (w * 15) + (smoothAiVol * 0.5);
                const amplitude = (smoothAiVol * 0.5) * ((w+1)/WAVE_COUNT);
                const speed = time * (w + 1) * 0.05;
                
                ctx.strokeStyle = `${baseColor}, ${1 - w/WAVE_COUNT})`;
                
                for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
                    const waveOffset = Math.sin(angle * 5 + speed) * amplitude;
                    const noise = Math.cos(angle * 12 - speed) * (amplitude * 0.5);
                    const x = cx + Math.cos(angle) * (radius + waveOffset + noise);
                    const y = cy + Math.sin(angle) * (radius + waveOffset + noise);
                    
                    if (angle === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            }

            // User Waves (Outer Ring Reaction)
            if (isUserTalking) {
                 const radius = 120 + (w * 20) + (smoothUserVol * 0.8);
                 const amplitude = (smoothUserVol * 0.8);
                 // Faster ripple
                 const ripple = Math.sin(time * 0.1 - (w * 0.5)) * 10; 

                 ctx.strokeStyle = `rgba(6, 182, 212, ${0.5 - w/10})`;
                 
                 ctx.beginPath();
                 ctx.arc(cx, cy, radius + ripple, 0, Math.PI*2);
                 ctx.stroke();
            }
        }

        // 3. Central "Core" Logic
        const coreSize = 30 + (smoothAiVol * 0.5) + (smoothUserVol * 0.2);
        ctx.shadowBlur = 30;
        ctx.shadowColor = `${baseColor}, 1)`;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy, coreSize * 0.3, 0, Math.PI * 2); // Solid white core
        ctx.fill();
        ctx.shadowBlur = 0;

        time += 1;
        animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const cleanup = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    
    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      inputSourceRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }
    
    if (audioContextRef.current?.state !== 'closed') audioContextRef.current?.close();
    if (outputAudioContextRef.current?.state !== 'closed') outputAudioContextRef.current?.close();
    
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) { }
    });
    sourcesRef.current.clear();
  };

  const handleEndCall = () => {
    // Capture final incomplete turns if any
    const finalUser = currentInputTransRef.current.trim();
    const finalModel = currentOutputTransRef.current.trim();
    if (finalUser) transcriptRef.current.push({ role: 'user', text: finalUser });
    if (finalModel) transcriptRef.current.push({ role: 'model', text: finalModel });

    cleanup();
    onEndSession(transcriptRef.current);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020410] flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* 1. Cinematic Background */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020410] to-[#020410]"></div>
          <div className="absolute inset-0 bg-grid-small opacity-10"></div>
          {/* Animated Stars */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
      </div>

      {/* 2. Header HUD */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-20 pointer-events-none">
         <div className="flex items-center gap-4 animate-slide-up-fade">
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg">
                <Cpu size={18} className="text-cyan-400 md:w-5 md:h-5" />
             </div>
             <div>
                <h1 className="text-white font-bold text-sm md:text-lg tracking-tight">AI Interviewer <span className="text-cyan-400">Pro</span></h1>
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${status === 'connected' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500'}`}></div>
                   <span className="text-[10px] md:text-xs text-gray-400 font-mono uppercase tracking-wider">
                      {status === 'connected' ? 'Secure Link Active' : 'Initializing...'}
                   </span>
                </div>
             </div>
         </div>

         <div className="flex flex-col items-end gap-2 animate-slide-up-fade delay-100 hidden sm:flex">
             <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
                MODE: <span className="text-white font-bold">{difficulty}</span>
             </div>
             <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 flex items-center gap-2">
                <Activity size={12} className="text-purple-400" /> 
                LATENCY: <span className="text-emerald-400">14ms</span>
             </div>
         </div>
      </div>

      {/* 3. Main Visualizer Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pb-20 md:pb-0">
         
         {/* Error State */}
         {status === 'error' && (
           <div className="absolute z-50 bg-red-950/80 border border-red-500/30 p-6 rounded-2xl backdrop-blur-xl max-w-md text-center animate-pop-in mx-4">
              <Zap size={32} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Connection Interrupted</h3>
              <p className="text-red-200 text-sm mb-6">{errorMsg || "Unable to establish audio stream."}</p>
              <button 
                onClick={() => setRetryCount(c => c + 1)}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold transition-all flex items-center gap-2 mx-auto"
              >
                 <RefreshCw size={16} /> Retry Uplink
              </button>
           </div>
         )}

         {/* The Canvas Visualizer */}
         <div className="relative w-full max-w-3xl h-[50vh] md:aspect-video flex items-center justify-center">
            <canvas 
              ref={canvasRef}
              className="w-full h-full"
              style={{ filter: 'blur(0px)' }} // Ensures sharp rendering
            />
            
            {/* Overlay Text for Status (Connecting...) */}
            {status === 'connecting' && (
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                     <Loader2 size={48} className="text-cyan-400 animate-spin" />
                     <span className="text-cyan-300 font-mono text-sm tracking-[0.2em] animate-pulse">ESTABLISHING NEURAL LINK...</span>
                  </div>
               </div>
            )}
         </div>

         {/* Transcript / Hints Area */}
         <div className="absolute bottom-32 md:bottom-32 w-full max-w-xl px-4 md:px-6 text-center">
             {status === 'connected' && (
               <div className="bg-black/40 backdrop-blur-sm border border-white/5 p-4 rounded-xl shadow-2xl transform transition-all hover:scale-105">
                 <p className="text-gray-300 text-sm md:text-lg font-light leading-relaxed">
                   <Typewriter text="I'm listening. Tell me about your background." delay={500} speed={40} />
                 </p>
               </div>
             )}
         </div>

      </div>

      {/* 4. Glass Control Bar */}
      <div className="absolute bottom-6 md:bottom-8 z-30 pointer-events-auto w-full flex justify-center px-4">
         <div className="flex items-center gap-3 md:gap-4 p-2 pl-4 md:pl-6 pr-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl max-w-full overflow-x-auto">
            
            <div className="flex items-center gap-2 md:gap-4 mr-2 md:mr-4 shrink-0">
               {/* Signal Strength Indicators */}
               <div className="flex items-end gap-1 h-4">
                  <div className="w-1 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1 h-4 bg-emerald-500 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1 h-2 bg-emerald-500/30 rounded-full"></div>
               </div>
               <span className="text-[10px] md:text-xs text-gray-400 font-mono uppercase hidden sm:inline">Audio Active</span>
            </div>

            {/* Mute Button */}
            <button 
               onClick={() => setIsMuted(!isMuted)}
               className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 border shrink-0 ${
                 isMuted 
                   ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                   : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
               }`}
               title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
            >
               {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Video Button (Disabled visual) */}
            <button className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed shrink-0">
               <VideoOff size={18} />
            </button>

            {/* End Call Button */}
            <button 
               onClick={handleEndCall}
               className="h-10 md:h-12 px-4 md:px-6 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold tracking-wide shadow-lg shadow-red-900/40 transition-all flex items-center gap-2 group shrink-0"
            >
               <PhoneOff size={16} className="group-hover:rotate-90 transition-transform" />
               <span className="text-xs md:text-base">END<span className="hidden sm:inline"> SESSION</span></span>
            </button>
         </div>
      </div>
      
    </div>
  );
};

export default LiveInterview;
