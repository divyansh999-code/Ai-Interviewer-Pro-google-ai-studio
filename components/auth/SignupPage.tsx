
import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, Shield, ArrowRight, AlertCircle, Cpu, Check } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { GradientText } from '../ui/Typography';

interface SignupPageProps {
  onNavigate: (view: 'login' | 'landing') => void;
}

// Purple Warp Background with Parallax
const WarpField = ({ speed = 3 }) => {
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

    const stars = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2,
      speed: Math.random() * 3 + 1,
      depth: Math.random() // for parallax
    }));

    let currentSpeedMultiplier = 1;

    const animate = () => {
      // Accelerate logic
      if (speed > 10) {
          currentSpeedMultiplier += 0.2;
      }

      ctx.fillStyle = '#050713';
      ctx.fillRect(0, 0, width, height);
      
      const offsetX = mouseRef.current.x * 50; // Max horizontal shift
      
      stars.forEach(star => {
        star.y += star.speed * (speed > 10 ? currentSpeedMultiplier : 1);
        if (star.y > height) star.y = 0;

        const effectiveSpeed = star.speed * (speed > 10 ? currentSpeedMultiplier : 1);
        
        // Parallax shift based on depth
        const x = star.x + (offsetX * star.depth);

        ctx.fillStyle = `rgba(168, 85, 247, ${Math.random() * 0.5 + 0.5})`; // Purple tint
        ctx.beginPath();
        ctx.arc(x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Trail - gets longer with speed
        ctx.fillStyle = `rgba(168, 85, 247, 0.1)`;
        const trailLength = effectiveSpeed * 5;
        ctx.fillRect(x, star.y - trailLength, star.size, trailLength);
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

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'registering' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mouse tracking for spotlight
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // New: Interpolate spotlight
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
      // Reset spotlight to center on leave
      const rect = card.getBoundingClientRect();
      targetMouseX = rect.width / 2;
      targetMouseY = rect.height / 2;
    };

    const animate = () => {
      const ease = 0.1;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      
      // Interpolate spotlight position
      currentMouseX += (targetMouseX - currentMouseX) * ease;
      currentMouseY += (targetMouseY - currentMouseY) * ease;

      card.style.setProperty('--mouse-x', `${currentMouseX}px`);
      card.style.setProperty('--mouse-y', `${currentMouseY}px`);
      card.style.transform = `perspective(1000px) rotateX(${currentX.toFixed(3)}deg) rotateY(${currentY.toFixed(3)}deg)`;
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
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

    // Validation
    if (password !== confirmPassword) {
      setErrorMsg("Error: Security keys do not match.");
      setStatus('error');
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Error: Key strength insufficient (min 6 chars).");
      setStatus('error');
      return;
    }

    setStatus('registering');
    
    try {
      await signup(name, email, password);
      setStatus('success');
    } catch (err) {
      setTimeout(() => {
        setStatus('error');
        setErrorMsg("Registration Failed: Network uplink timeout.");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#020410]">
      <WarpField speed={status === 'success' ? 20 : 3} />
      
      {/* Decorative Floor Grid */}
      <div className="absolute inset-0 bg-grid-moving opacity-10 pointer-events-none transform perspective-1000 rotate-x-60 scale-150 origin-bottom" style={{ backgroundImage: 'linear-gradient(to right, rgba(168,85,247,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(168,85,247,0.1) 1px, transparent 1px)' }}></div>

      <div className="w-full max-w-md relative z-10 perspective-1000">
        
        {/* --- SPOTLIGHT CARD --- */}
        <div 
          ref={cardRef}
          className={`
            spotlight-card rounded-2xl p-8 border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.3)] 
            transition-all duration-700 ease-in-out backdrop-blur-xl bg-black/80 will-change-transform
            ${status === 'success' ? 'scale-[2] opacity-0 blur-lg pointer-events-none' : 'scale-100 opacity-100'}
          `}
          style={{ '--neon-cyan': '#a855f7' } as any} // Override spotlight color
        >
          {/* Border Beam - Purple Theme */}
          <div className="absolute inset-0 border-beam pointer-events-none opacity-50" style={{ '--neon-cyan': '#a855f7' } as any}></div>

          {/* Header */}
          <div className="text-center mb-8 relative z-20">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#0a0e17] border border-purple-500/20 mb-6 group relative overflow-hidden shadow-lg shadow-purple-900/20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <UserPlus size={32} className={`text-purple-400 relative z-10 transition-transform duration-500 ${status === 'registering' ? 'scale-110' : ''}`} />
             </div>
             
             <div>
               <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                 <span className="glitch-text inline-block cyber-shine" data-text="NEW OPERATOR" style={{ '--neon-cyan': '#a855f7' } as any}>NEW OPERATOR</span>
               </h2>
               <p className="text-gray-400 text-sm font-mono tracking-wide mt-2">
                 Initialize identity protocol.
               </p>
             </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-20">
            <div className="input-group relative group">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1 group-focus-within:text-purple-400 transition-colors">Operator Name</label>
               <div className="relative overflow-hidden rounded-xl transition-all duration-300 ring-0 group-focus-within:ring-2 group-focus-within:ring-purple-500/50 group-focus-within:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={status === 'registering'}
                    className="w-full bg-[#0a0e17] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:bg-[#0f1420] transition-colors"
                    placeholder="John Doe"
                  />
                  <div className="input-scan-line" style={{ background: 'linear-gradient(90deg, transparent, #a855f7, transparent)' }}></div>
               </div>
            </div>
            
            <div className="input-group relative group">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1 group-focus-within:text-purple-400 transition-colors">Contact Uplink</label>
               <div className="relative overflow-hidden rounded-xl transition-all duration-300 ring-0 group-focus-within:ring-2 group-focus-within:ring-purple-500/50 group-focus-within:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'registering'}
                    className="w-full bg-[#0a0e17] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:bg-[#0f1420] transition-colors"
                    placeholder="email@domain.com"
                  />
                  <div className="input-scan-line" style={{ background: 'linear-gradient(90deg, transparent, #a855f7, transparent)' }}></div>
               </div>
            </div>
            
            <div className="input-group relative group">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1 group-focus-within:text-purple-400 transition-colors">Security Key</label>
               <div className="relative overflow-hidden rounded-xl transition-all duration-300 ring-0 group-focus-within:ring-2 group-focus-within:ring-purple-500/50 group-focus-within:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={status === 'registering'}
                    className="w-full bg-[#0a0e17] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:bg-[#0f1420] transition-colors"
                    placeholder="Min 6 chars"
                  />
                  <div className="input-scan-line" style={{ background: 'linear-gradient(90deg, transparent, #a855f7, transparent)' }}></div>
               </div>
            </div>

            <div className="input-group relative group">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1 group-focus-within:text-purple-400 transition-colors">Confirm Key</label>
               <div className="relative overflow-hidden rounded-xl transition-all duration-300 ring-0 group-focus-within:ring-2 group-focus-within:ring-purple-500/50 group-focus-within:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={status === 'registering'}
                    className={`w-full bg-[#0a0e17] border rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:bg-[#0f1420] transition-colors ${password !== confirmPassword && confirmPassword ? 'border-red-500/50' : 'border-white/10'}`}
                    placeholder="Re-enter password"
                  />
                  <div className="input-scan-line" style={{ background: 'linear-gradient(90deg, transparent, #a855f7, transparent)' }}></div>
               </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-center gap-3 animate-pop-in">
                <AlertCircle size={16} className="shrink-0" />
                <span className="font-mono">{errorMsg}</span>
              </div>
            )}

            <div className="pt-4">
              <Button 
                type="submit" 
                className={`w-full py-4 text-base tracking-widest font-bold group relative overflow-hidden transition-all duration-300
                  ${status === 'registering' ? 'bg-purple-900/50 text-purple-200 cursor-wait' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'}
                `}
                disabled={status === 'registering'}
                withParticles={status !== 'registering'}
              >
                <div className="relative z-10 flex items-center gap-2">
                  {status === 'registering' ? (
                     <>
                       <Cpu className="animate-spin" size={20} /> ENCRYPTING...
                     </>
                  ) : (
                     <>
                       ESTABLISH IDENTITY <Shield size={18} className="group-hover:scale-110 transition-transform" />
                     </>
                  )}
                </div>
              </Button>
            </div>
          </form>

        </div>

        {/* Footer Navigation */}
        <div className="text-center mt-8 text-sm text-gray-500 relative z-20 transition-opacity duration-300" style={{ opacity: status === 'success' ? 0 : 1 }}>
           <span>Existing operator? </span>
           <button 
             onClick={() => onNavigate('login')}
             className="text-purple-400 hover:text-purple-300 font-bold hover:underline transition-all ml-1"
           >
             Access System
           </button>
        </div>

      </div>

      {/* --- SUCCESS OVERLAY --- */}
      {status === 'success' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
          <div className="text-center transform scale-110">
            <div className="w-32 h-32 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_150px_#a855f7] animate-[pop-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
              <Check size={64} className="text-white" />
            </div>
            <h2 className="text-6xl font-black text-white mb-4 tracking-tighter glitch-text" data-text="IDENTITY VERIFIED" style={{ textShadow: '0 0 50px rgba(168, 85, 247, 0.5)' }}>
              IDENTITY VERIFIED
            </h2>
            <div className="inline-block px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg backdrop-blur-md mt-4">
                <p className="text-purple-400 font-mono text-sm animate-pulse tracking-widest uppercase">
                Initializing Workspace...
                </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SignupPage;
