
import React, { useState, useEffect, useRef } from 'react';
import { Lock, ArrowRight, AlertCircle, ScanEye, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface LoginPageProps {
  onNavigate: (view: 'signup' | 'landing') => void;
}

// Hyperspace Starfield Background with Interactive Parallax
const Starfield = ({ speed = 5 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse to -1 to 1
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      z: Math.random() * width,
      pz: 0
    }));

    let currentSpeed = speed;

    const animate = () => {
      // Accelerate towards target speed
      currentSpeed += (speed - currentSpeed) * 0.05;

      ctx.fillStyle = '#050713';
      ctx.fillRect(0, 0, width, height);
      
      // Calculate parallax offset based on mouse position
      // Using a small factor so it feels deep
      const offsetX = mouseRef.current.x * 100;
      const offsetY = mouseRef.current.y * 100;

      const cx = width / 2;
      const cy = height / 2;

      stars.forEach(star => {
        star.z -= currentSpeed;
        if (star.z <= 0) {
          star.x = Math.random() * width - width / 2;
          star.y = Math.random() * height - height / 2;
          star.z = width;
          star.pz = width;
        }

        // Apply parallax: stars closer (smaller z) move more
        const parallaxX = offsetX * (100 / star.z);
        const parallaxY = offsetY * (100 / star.z);

        const x = ((star.x + parallaxX) / star.z) * width + cx;
        const y = ((star.y + parallaxY) / star.z) * height + cy;
        
        const size = Math.max(0, (1 - star.z / width) * (currentSpeed > 20 ? 1 : 3));

        // Draw star
        const alpha = Math.max(0, 1 - star.z / width);
        ctx.fillStyle = `rgba(0, 245, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw trail - longer trails at higher speeds
        if (star.pz > 0 && star.z < width) {
           const px = ((star.x + parallaxX) / star.pz) * width + cx;
           const py = ((star.y + parallaxY) / star.pz) * height + cy;
           ctx.beginPath();
           ctx.strokeStyle = `rgba(0, 245, 255, ${alpha * (currentSpeed > 20 ? 0.8 : 0.5)})`;
           ctx.lineWidth = size * (currentSpeed > 20 ? 2 : 1);
           ctx.moveTo(x, y);
           ctx.lineTo(px, py);
           ctx.stroke();
        }
        
        star.pz = star.z;
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [speed]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40" />;
};

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Mouse tracking for spotlight and tilt
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // New: Interpolate spotlight position as well
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    let animationFrameId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      targetMouseX = x;
      targetMouseY = y;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const limit = 8; 
      targetX = -((y - centerY) / centerY) * limit;
      targetY = ((x - centerX) / centerX) * limit;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
      // Don't reset mouse spotlight instantly, let it linger or move to center
      const rect = card.getBoundingClientRect();
      targetMouseX = rect.width / 2;
      targetMouseY = rect.height / 2;
    };

    const animate = () => {
      // Lerp factor
      const ease = 0.1;
      
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      
      // Smooth spotlight
      currentMouseX += (targetMouseX - currentMouseX) * ease;
      currentMouseY += (targetMouseY - currentMouseY) * ease;

      card.style.setProperty('--mouse-x', `${currentMouseX}px`);
      card.style.setProperty('--mouse-y', `${currentMouseY}px`);
      card.style.transform = `perspective(1000px) rotateX(${currentX.toFixed(3)}deg) rotateY(${currentY.toFixed(3)}deg)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    // Attach listeners
    window.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    // Start loop
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStatus('authenticating');
    
    try {
      await login(email, password);
      setStatus('success');
    } catch (err: any) {
      setTimeout(() => {
        setStatus('error');
        // If AuthContext threw the specific "First create account", show it. 
        // Otherwise default to generic error.
        setErrorMsg(err.message || "Access Denied: Verification failed.");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#020410]">
      {/* Accelerate stars on success */}
      <Starfield speed={status === 'success' ? 50 : 5} />
      
      {/* Decorative Floor Grid */}
      <div className="absolute inset-0 bg-grid-moving opacity-10 pointer-events-none transform perspective-1000 rotate-x-60 scale-150 origin-bottom"></div>

      <div className="w-full max-w-md relative z-10 perspective-1000">
        
        {/* --- SPOTLIGHT CARD --- */}
        <div 
          ref={cardRef}
          className={`
            spotlight-card rounded-2xl p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] 
            transition-all duration-700 ease-in-out backdrop-blur-xl bg-black/80 will-change-transform
            ${status === 'success' ? 'scale-[2] opacity-0 blur-lg pointer-events-none' : 'scale-100 opacity-100'}
          `}
        >
          {/* Border Beam */}
          <div className="absolute inset-0 border-beam pointer-events-none opacity-50"></div>

          {/* Header */}
          <div className="text-center mb-10 relative z-20">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#0a0e17] border border-cyan-500/20 mb-6 group relative overflow-hidden shadow-lg shadow-cyan-900/20">
                <Lock size={32} className={`text-cyan-400 relative z-10 transition-transform duration-500 ${status === 'authenticating' ? 'animate-bounce' : 'group-hover:scale-110'}`} />
                {/* Internal Glow */}
                <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl animate-pulse"></div>
             </div>
             
             <div>
               <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                 <span className="glitch-text inline-block cyber-shine" data-text="SYSTEM ACCESS">SYSTEM ACCESS</span>
               </h2>
               <p className="text-gray-400 text-sm font-mono tracking-wide mt-2">
                 Identify yourself, Operator.
               </p>
             </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-20">
            <div className="input-group relative group">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1 group-focus-within:text-cyan-400 transition-colors">Operator ID</label>
              <div className="relative overflow-hidden rounded-xl transition-all duration-300 ring-0 group-focus-within:ring-2 group-focus-within:ring-cyan-500/50 group-focus-within:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                 <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'authenticating'}
                    className="w-full bg-[#0a0e17] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:bg-[#0f1420] transition-colors"
                    placeholder="name@corp.net"
                 />
                 {/* Scanning Line Effect */}
                 <div className="input-scan-line"></div>
              </div>
            </div>
            
            <div className="input-group relative group">
              <div className="flex justify-between items-center mb-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-cyan-400 transition-colors">Passkey</label>
                 <button type="button" className="text-[10px] text-cyan-500 hover:text-cyan-300 font-mono uppercase tracking-wider">
                    Reset Protocol?
                 </button>
              </div>
              <div className="relative overflow-hidden rounded-xl transition-all duration-300 ring-0 group-focus-within:ring-2 group-focus-within:ring-cyan-500/50 group-focus-within:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                 <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={status === 'authenticating'}
                    className="w-full bg-[#0a0e17] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:bg-[#0f1420] transition-colors"
                    placeholder="••••••••"
                 />
                 <div className="input-scan-line"></div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-red-400 text-xs flex flex-col gap-2 animate-pop-in">
                <div className="flex items-center gap-3">
                  <AlertCircle size={16} className="shrink-0" />
                  <span className="font-mono font-bold">{errorMsg}</span>
                </div>
                {errorMsg.toLowerCase().includes("create account") && (
                   <button 
                     type="button"
                     onClick={() => onNavigate('signup')}
                     className="ml-7 text-left text-cyan-400 hover:text-white underline underline-offset-4 decoration-dashed"
                   >
                     Go to Registration →
                   </button>
                )}
              </div>
            )}

            <div className="pt-4">
              <Button 
                type="submit" 
                className={`w-full py-4 text-base tracking-widest font-bold group relative overflow-hidden transition-all duration-300
                  ${status === 'authenticating' ? 'bg-cyan-900/50 text-cyan-200 cursor-wait' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)]'}
                `}
                disabled={status === 'authenticating'}
                withParticles={status !== 'authenticating'}
              >
                <div className="relative z-10 flex items-center gap-2">
                  {status === 'authenticating' ? (
                     <>
                       <ScanEye className="animate-spin" size={20} /> VERIFYING...
                     </>
                  ) : (
                     <>
                       INITIATE HANDSHAKE <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                     </>
                  )}
                </div>
              </Button>
            </div>
          </form>

        </div>

        {/* Footer Navigation */}
        <div className="text-center mt-8 text-sm text-gray-500 relative z-20 transition-opacity duration-300" style={{ opacity: status === 'success' ? 0 : 1 }}>
           <span>New to the system? </span>
           <button 
             onClick={() => onNavigate('signup')}
             className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-all ml-1"
           >
             Create Identity
           </button>
           <div className="mt-4">
              <button onClick={() => onNavigate('landing')} className="text-xs text-gray-700 hover:text-gray-500 font-mono transition-colors">
                  [ TERMINATE SESSION ]
              </button>
           </div>
        </div>

      </div>

      {/* --- SUCCESS OVERLAY --- */}
      {status === 'success' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
          <div className="text-center transform scale-110">
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_150px_#22c55e] animate-[pop-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
              <CheckCircle2 size={64} className="text-black" />
            </div>
            <h2 className="text-6xl font-black text-white mb-4 tracking-tighter glitch-text" data-text="ACCESS GRANTED" style={{ textShadow: '0 0 50px rgba(34, 197, 94, 0.5)' }}>
              ACCESS GRANTED
            </h2>
            <div className="inline-block px-4 py-2 bg-black/50 border border-green-500/30 rounded-lg backdrop-blur-md mt-4">
                <p className="text-green-400 font-mono text-sm animate-pulse tracking-widest uppercase">
                Redirecting to Mainframe...
                </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;
