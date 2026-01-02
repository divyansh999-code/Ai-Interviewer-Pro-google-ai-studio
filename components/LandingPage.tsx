
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Upload, Clock, ChevronDown, Terminal, 
  CheckCircle2, Star, AlertCircle, Shield, Zap, Check,
  Crosshair, Grid, Cpu, Activity, CornerDownRight, Sparkles
} from 'lucide-react';
import FeaturesBento from './FeaturesBento';
import ProcessFlow from './ProcessFlow';
import Footer from './Footer';
import { SplitText, GradientText, RevealText, Keyword, DropCap, Typewriter } from './ui/Typography';

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigate?: (view: any) => void;
}

// --- SYSTEMATIC VISUAL COMPONENTS ---

// 1. Technical Overlay (Crosshairs & Rulers)
const TechnicalOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden text-gray-300 dark:text-gray-700/20">
       {/* Corner Crosshairs */}
       <div className="absolute top-8 left-8"><div className="crosshair"></div></div>
       <div className="absolute top-8 right-8"><div className="crosshair"></div></div>
       <div className="absolute bottom-8 left-8"><div className="crosshair"></div></div>
       <div className="absolute bottom-8 right-8"><div className="crosshair"></div></div>

       {/* Vertical Dashed Lines (Rule of Thirds + Center) */}
       <div className="absolute top-0 bottom-0 left-[25%] border-l border-dashed border-gray-200 dark:border-white/5 hidden md:block"></div>
       <div className="absolute top-0 bottom-0 right-[25%] border-r border-dashed border-gray-200 dark:border-white/5 hidden md:block"></div>
       
       {/* Central Axis Line (The Spine) */}
       <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
       
       {/* Floating Axis Labels */}
       <div className="absolute top-1/2 left-4 -translate-y-1/2 font-mono text-[10px] uppercase rotate-[-90deg] text-gray-400 dark:text-gray-600">
          Y-Axis / Scroll Velocity
       </div>
       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase bg-white dark:bg-[#050713] px-2 z-10 text-gray-400 dark:text-gray-600">
          X-Axis / Interaction Plane
       </div>
    </div>
  );
};

// 2. Geometric Hero Background
const GeometricHeroBg = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-gray-50 dark:bg-[#0a0e27] transition-colors duration-500">
            {/* Perspective Grid Floor - Centered */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[60vh] perspective-grid opacity-10 dark:opacity-30 mask-radial-center"></div>
            
            {/* Symmetrical Data Streams */}
            <div className="absolute top-0 left-[10%] w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"></div>
            <div className="absolute top-0 right-[10%] w-[1px] h-full bg-gradient-to-b from-transparent via-purple-500/10 to-transparent"></div>
        </div>
    )
}

const HeroSection = () => {
  return (
    <section 
      id="hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20"
    >
      <GeometricHeroBg />
      <TechnicalOverlay />

      {/* Main Content - Strictly Centered */}
      <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center relative">
        
        {/* Creator Attribution Badge */}
        <div className="relative z-30 mb-8 animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
           <div className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 dark:bg-[#0a0e27]/80 border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-md cursor-default">
              
              {/* Background Glow on Hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-500" />
              
              <Sparkles size={14} className="text-cyan-500 animate-pulse relative z-10" />
              
              <span className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold relative z-10">
                 Created by
              </span>
              
              <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-purple-600 to-cyan-600 dark:from-cyan-400 dark:via-purple-400 dark:to-cyan-400 bg-[length:200%_auto] animate-[gradient-flow_3s_linear_infinite] relative z-10">
                 Divyansh Khandal
              </span>
           </div>
        </div>

        {/* Headline with Geometric Brackets */}
        <div className="relative mb-8 group w-full max-w-6xl animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
           <span className="absolute -left-4 md:-left-16 top-0 text-gray-300 dark:text-gray-700 text-4xl md:text-8xl font-thin opacity-50 select-none group-hover:text-cyan-500/50 transition-colors duration-500">{'{'}</span>
           
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] text-gray-900 dark:text-white mx-auto z-10 relative text-shadow-glow flex flex-wrap justify-center gap-x-3 md:gap-x-5 gap-y-2">
             {["Master", "the", "Technical", "Interview"].map((word, i) => (
                <span key={i} className="whitespace-nowrap">
                   <SplitText delay={300 + (i * 50)} text={word} />
                </span>
             ))}
           </h1>
           
           <span className="absolute -right-4 md:-right-16 bottom-0 text-gray-300 dark:text-gray-700 text-4xl md:text-8xl font-thin opacity-50 select-none group-hover:text-cyan-500/50 transition-colors duration-500">{'}'}</span>
        </div>

        <div className="animate-slide-up-fade" style={{ animationDelay: '0.5s' }}>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
            Generate <span className="text-gray-900 dark:text-white font-semibold">perfectly tailored</span> interview questions based on your resume. 
            Engineered for <span className="text-cyan-600 dark:text-cyan-400 font-mono">precision</span> and <span className="text-purple-600 dark:text-purple-400 font-mono">performance</span>.
          </p>
        </div>

      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
         <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-cyan-500 to-transparent"></div>
         <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-500 uppercase tracking-widest animate-pulse">Scroll</span>
      </div>
    </section>
  );
};

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center mb-20 relative">
    <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 w-px h-20 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent -z-10"></div>
    <div className="inline-block bg-gray-50 dark:bg-[#050713] px-4 relative z-10 transition-colors duration-500">
       <span className="text-cyan-600 dark:text-cyan-500 font-mono text-xs uppercase tracking-[0.2em] mb-2 block">{subtitle}</span>
       <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight uppercase font-mono">
         {title}
       </h2>
       {/* Decorative Side Lines */}
       <div className="absolute top-1/2 left-full w-20 h-px bg-gradient-to-r from-gray-300 dark:from-gray-800 to-transparent"></div>
       <div className="absolute top-1/2 right-full w-20 h-px bg-gradient-to-l from-gray-300 dark:from-gray-800 to-transparent"></div>
    </div>
  </div>
);

const ProblemSection = () => (
  <section className="py-32 bg-white dark:bg-[#0a0e27] border-y border-gray-200 dark:border-gray-800 relative transition-colors duration-500">
    <div className="absolute inset-0 bg-grid-small opacity-[0.03] pointer-events-none"></div>
    <div className="container mx-auto px-4 relative z-10">
      
      <div className="max-w-5xl mx-auto border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#050713] shadow-2xl transition-colors duration-500">
        {/* Header Bar */}
        <div className="h-10 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 transition-colors duration-500">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
           </div>
           <div className="text-xs font-mono text-gray-500 uppercase">System_Diagnostics.log</div>
           <div className="w-4"></div>
        </div>

        <div className="grid md:grid-cols-2">
           {/* Left Panel: The Error */}
           <div className="p-12 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 relative overflow-hidden group transition-colors duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <AlertCircle size={100} className="text-red-500" />
              </div>
              <div className="relative z-10">
                 <div className="text-red-600 dark:text-red-500 font-mono text-xs mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-sm animate-pulse"></span> ERROR: TRADITIONAL_PREP_FAILED
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Glitch</h3>
                 <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-mono text-sm">
                    &gt; Executing LeetCode... <span className="text-green-600 dark:text-green-500">SUCCESS</span><br/>
                    &gt; Memorizing Patterns... <span className="text-green-600 dark:text-green-500">SUCCESS</span><br/>
                    &gt; Explaining approach... <span className="text-red-600 dark:text-red-500 font-bold bg-red-100 dark:bg-red-500/10 px-1">CRITICAL FAILURE</span>
                 </p>
                 <p className="mt-4 text-gray-500 dark:text-gray-500 text-sm">
                    Generic questions do not compile with your specific resume data. System freeze imminent.
                 </p>
              </div>
           </div>

           {/* Right Panel: The Fix */}
           <div className="p-12 relative overflow-hidden group bg-cyan-50 dark:bg-cyan-900/5 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Cpu size={100} className="text-cyan-600 dark:text-cyan-500" />
              </div>
              <div className="relative z-10">
                 <div className="text-cyan-600 dark:text-cyan-500 font-mono text-xs mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-sm"></span> PATCH_AVAILABLE: V2.5.0
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Solution</h3>
                 <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-mono text-sm">
                    &gt; Initializing Runtime Environment...<br/>
                    &gt; Loading Resume Data... <span className="text-cyan-600 dark:text-cyan-500">COMPLETE</span><br/>
                    &gt; Generating Tailored Scenarios... <span className="text-cyan-600 dark:text-cyan-500">COMPLETE</span>
                 </p>
                 <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm border-l-2 border-cyan-500 pl-4">
                    You need a runtime environment that mirrors reality. Tailored inputs. Real-time debugging. Zero latency learning.
                 </p>
              </div>
           </div>
        </div>
      </div>

    </div>
  </section>
);

const ComparisonSection = () => (
  <section id="comparison" className="py-32 bg-gray-50 dark:bg-[#050713] relative transition-colors duration-500">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    
    <div className="container mx-auto px-4 relative z-10">
      <SectionHeader title="System_Comparison" subtitle="Benchmark Results" />
      
      {/* Tech Spec Sheet Table - Centered and Rigid */}
      <div className="max-w-6xl mx-auto border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0e27] shadow-[0_0_50px_rgba(0,0,0,0.05)] dark:shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-colors duration-500">
        {/* Header Row */}
        <div className="grid grid-cols-4 bg-gray-100 dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800 text-xs font-mono uppercase tracking-wider text-gray-500">
           <div className="p-6 border-r border-gray-200 dark:border-gray-800 flex items-center">Module / Feature</div>
           <div className="p-6 border-r border-gray-200 dark:border-gray-800 text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-50 dark:bg-cyan-900/20 flex items-center gap-2">
              <Terminal size={14} /> AI Interviewer Pro
           </div>
           <div className="p-6 border-r border-gray-200 dark:border-gray-800 flex items-center">Paid Coaching</div>
           <div className="p-6 flex items-center">LeetCode Only</div>
        </div>
        
        {[
          { feature: "Resume Parsing Engine", ai: "TRUE", paid: "FALSE", lc: "FALSE" },
          { feature: "Voice I/O Latency", ai: "< 200ms", paid: "Variable", lc: "N/A" },
          { feature: "Weakness Detection", ai: "AUTOMATED", paid: "MANUAL", lc: "NULL" },
          { feature: "Difficulty Curve", ai: "ADAPTIVE", paid: "STATIC", lc: "MANUAL" },
          { feature: "Cost Efficiency", ai: "MAXIMUM", paid: "LOW", lc: "MEDIUM" },
          { feature: "System Availability", ai: "99.99%", paid: "SCHEDULED", lc: "99.99%" },
        ].map((row, idx) => (
          <div key={idx} className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-mono group">
             <div className="p-5 border-r border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors flex items-center gap-3">
                <CornerDownRight size={12} className="text-gray-400 dark:text-gray-600 group-hover:text-cyan-500" />
                {row.feature}
             </div>
             <div className="p-5 border-r border-gray-200 dark:border-gray-800 text-cyan-600 dark:text-cyan-300 font-bold bg-cyan-50/50 dark:bg-cyan-900/5 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/10 transition-colors flex items-center">
                {row.ai === "TRUE" ? <Check size={16} /> : row.ai}
             </div>
             <div className="p-5 border-r border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-600 flex items-center">{row.paid}</div>
             <div className="p-5 text-gray-500 dark:text-gray-600 flex items-center">{row.lc}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const UrgencySection = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <section className="py-32 bg-white dark:bg-[#0a0e27] relative border-t border-gray-200 dark:border-gray-800 overflow-hidden transition-colors duration-500">
    {/* Animated Background Lines */}
    <div className="absolute inset-0">
       <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 dark:via-red-900/50 to-transparent"></div>
       <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 dark:via-red-900/50 to-transparent"></div>
    </div>

    <div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center">
      <div className="inline-block border border-red-500/50 bg-red-50 dark:bg-red-900/10 px-6 py-2 text-red-600 dark:text-red-400 text-xs font-mono uppercase mb-12 tracking-widest animate-pulse rounded">
         Warning: Timeline Critical
      </div>
      
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row justify-between items-start gap-0 relative mb-16 border-t border-gray-200 dark:border-gray-800 pt-12 transition-colors duration-500">
         
         {[
           { label: "PREP START", date: "JAN 01", status: "complete" },
           { label: "APPLICATIONS", date: "FEB 15", status: "active" },
           { label: "INTERVIEWS", date: "MAR 01", status: "pending" },
           { label: "OFFER", date: "APR 15", status: "locked" }
         ].map((item, i) => (
           <div key={i} className="relative z-10 flex flex-col items-center flex-1 group">
              {/* Connector Line */}
              {i !== 3 && <div className="hidden md:block absolute top-1.5 left-[50%] w-full h-px bg-gray-200 dark:bg-gray-800 -z-10 group-hover:bg-gray-300 dark:group-hover:bg-gray-700 transition-colors"></div>}
              
              <div className={`w-4 h-4 bg-white dark:bg-[#0a0e27] border-2 ${item.status === 'complete' ? 'border-green-500 bg-green-500' : item.status === 'active' ? 'border-cyan-500 animate-pulse' : 'border-gray-300 dark:border-gray-700'} mb-6 relative z-20 transition-colors duration-500`}>
                 {item.status === 'active' && <div className="absolute inset-0 border-2 border-cyan-500 rounded-sm animate-ping"></div>}
              </div>
              
              <div className="text-xs font-mono text-gray-500 mb-2">{item.date}</div>
              <div className={`text-lg font-bold uppercase font-mono tracking-tighter ${item.status === 'active' ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400'}`}>{item.label}</div>
           </div>
         ))}
      </div>
      
      <button 
        onClick={onGetStarted}
        className="group relative px-12 py-6 bg-transparent border border-gray-900 dark:border-white/20 text-gray-900 dark:text-white font-mono uppercase tracking-[0.2em] hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300"
      >
        <span className="relative z-10">Synchronize_Schedule</span>
        <div className="absolute inset-0 bg-gray-900 dark:bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
      </button>
    </div>
  </section>
);

const FaqSection = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { q: "System Compatibility?", a: "Works on all modern browsers. Optimized for Chrome/Edge/Safari." },
    { q: "Data Retention Policy?", a: "Resume data is processed in ephemeral RAM. We do not store your PII." },
    { q: "Is coding experience required?", a: "Yes. Basic syntax knowledge (Python/JS/Java/C++) is prerequisite." },
  ];

  return (
    <section id="faq" className="py-32 bg-gray-50 dark:bg-[#050713] border-t border-gray-200 dark:border-gray-800 transition-colors duration-500">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeader title="Knowledge_Base" subtitle="FAQ" />
        
        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div key={idx} className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0e27] hover:border-cyan-500/30 transition-colors duration-300">
              <button 
                className="w-full flex justify-between items-center p-6 text-left group"
                onClick={() => toggleFaq(idx)}
              >
                <div className="flex items-center gap-6">
                   <span className="font-mono text-sm text-gray-400 dark:text-gray-600 group-hover:text-cyan-600 dark:group-hover:text-cyan-500 transition-colors">0{idx+1}</span>
                   <span className="font-bold text-sm md:text-base text-gray-700 dark:text-gray-300 font-mono uppercase tracking-wide group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item.q}</span>
                </div>
                <div className={`transition-transform duration-200 text-cyan-600 dark:text-cyan-500 ${openFaq === idx ? 'rotate-180' : ''}`}>
                  <ChevronDown size={16} />
                </div>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 text-sm text-gray-600 dark:text-gray-400 font-mono border-t border-gray-100 dark:border-gray-800/50 mt-2 ml-12 border-l border-gray-200 dark:border-gray-800 pl-6">
                  {`> ${item.a}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- MAIN LANDING PAGE COMPONENT ---

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onNavigate }) => {
  return (
    <div className="font-sans text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#050713] selection:bg-cyan-200 dark:selection:bg-cyan-500 selection:text-black scroll-smooth transition-colors duration-500">
      <HeroSection />
      <ProblemSection />
      <div id="how-it-works"><ProcessFlow /></div>
      <div id="features"><FeaturesBento /></div>
      <ComparisonSection />
      <UrgencySection onGetStarted={onGetStarted} />
      <FaqSection />
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;
