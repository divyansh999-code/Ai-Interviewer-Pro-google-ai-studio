
import React, { useEffect, useState } from 'react';
import { generateLiveFeedback } from '../services/liveInterviewService';
import { LiveFeedbackReport } from '../types';
import { 
  ArrowLeft, Sparkles, AlertCircle, Download, Share2, 
  CheckCircle, TrendingUp, Activity, Zap, BookOpen, Layers, Terminal, ChevronDown, Check
} from 'lucide-react';
import Button from './ui/Button';
import { Typewriter } from './ui/Typography';

interface LiveReportPageProps {
  resumeText: string;
  difficulty: string;
  transcript: { role: 'user' | 'model', text: string }[];
  cachedReport?: LiveFeedbackReport | null;
  onReportGenerated?: (report: LiveFeedbackReport) => void;
  onBack: () => void;
}

// --- VISUALIZATION COMPONENTS ---

const ScoreDial = ({ score }: { score: number }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    // Animate stroke after mount
    setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference);
    }, 500);
  }, [score, circumference]);
  
  return (
    <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      
      <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
        <circle cx="50%" cy="50%" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
        <circle 
          cx="50%" cy="50%" r={radius} 
          stroke="url(#scoreGradient)" 
          strokeWidth="6" 
          fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-[2000ms] ease-out"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c4b5fd" /> {/* Violet 300 */}
            <stop offset="100%" stopColor="#f472b6" /> {/* Pink 400 */}
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tighter animate-[scale-in_0.5s_ease-out]">{score}</span>
        <span className="text-[10px] md:text-xs text-indigo-200/60 uppercase tracking-[0.3em] font-medium mt-2">Overall Score</span>
      </div>
    </div>
  );
};

const InteractiveRadarChart = ({ data }: { data: { category: string, score: number }[] }) => {
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    setTimeout(() => setReveal(true), 800);
  }, []);
  
  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
    const r = (d.score / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="relative w-full aspect-square md:h-[320px] flex items-center justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-[300px] mx-auto overflow-visible">
        {/* Background Web */}
        {[0.25, 0.5, 0.75, 1].map((scale, idx) => (
          <polygon 
            key={idx}
            points={data.map((_, i) => {
              const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
              const r = radius * scale;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}
        
        {/* Data Shape */}
        <polygon 
          points={points} 
          fill="rgba(167, 139, 250, 0.15)" 
          stroke="#a78bfa" 
          strokeWidth="2" 
          className={`drop-shadow-[0_0_15px_rgba(167,139,250,0.3)] transition-all duration-[1500ms] ease-out ${reveal ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          style={{ transformOrigin: 'center' }}
        />
        
        {/* Interactive Dots & Labels */}
        {data.map((d, i) => {
           const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
           const x = center + (radius + 35) * Math.cos(angle);
           const y = center + (radius + 20) * Math.sin(angle);
           const pointX = center + ((d.score/100)*radius) * Math.cos(angle);
           const pointY = center + ((d.score/100)*radius) * Math.sin(angle);
           
           return (
             <g key={i} className="group">
                <circle 
                  cx={pointX} cy={pointY} r="4" 
                  className={`fill-white transition-opacity duration-1000 delay-[${1000+i*100}ms] ${reveal ? 'opacity-100' : 'opacity-0'}`} 
                />
                
                {/* Tooltip on Hover */}
                <foreignObject x={pointX - 25} y={pointY - 35} width="50" height="30" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   <div className="bg-white text-indigo-900 text-xs font-bold px-2 py-1 rounded text-center shadow-lg">{d.score}</div>
                </foreignObject>

                <text 
                  x={x} y={y} 
                  textAnchor="middle" 
                  alignmentBaseline="middle" 
                  className="fill-indigo-200/50 text-[10px] uppercase font-bold tracking-wider font-mono group-hover:fill-white transition-colors cursor-default"
                >
                  {d.category}
                </text>
             </g>
           );
        })}
      </svg>
    </div>
  );
};

// --- MAIN PAGE ---

const LiveReportPage: React.FC<LiveReportPageProps> = ({ resumeText, difficulty, transcript, cachedReport, onReportGenerated, onBack }) => {
  const [report, setReport] = useState<LiveFeedbackReport | null>(cachedReport || null);
  const [loading, setLoading] = useState(!cachedReport);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'roadmap'>('overview');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (cachedReport) {
        setReport(cachedReport);
        setLoading(false);
        return;
    }

    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await generateLiveFeedback(resumeText, difficulty, transcript);
        setReport(data);
        if (onReportGenerated) onReportGenerated(data);
      } catch (err) {
        setError("Failed to analyze interview session.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [resumeText, difficulty, transcript, cachedReport]);

  const handleDownload = () => {
    if (!report) return;

    const date = new Date().toISOString().split('T')[0];
    const markdownContent = `
# AI Interviewer Pro - Performance Report
Date: ${date}
Difficulty: ${difficulty}

## Executive Summary
**Overall Score:** ${report.overallScore}/100
**Hiring Recommendation:** ${report.hiringRecommendation}

${report.summary}

## Category Breakdown
${report.categoryScores.map(c => `- **${c.category}:** ${c.score}/100`).join('\n')}

## Key Strengths
${report.strengths.map(s => `- ${s}`).join('\n')}

## Areas for Improvement
${report.weaknesses.map(w => `- ${w}`).join('\n')}

## Transcript Analysis
${report.transcriptAnalysis.map((t, i) => `
### Q${i + 1}: ${t.question}
- **Candidate Response:** ${t.candidateResponseSummary}
- **Evaluation:** ${t.evaluation}
- **Feedback:** ${t.feedback}
- **Optimization:** ${t.improvementTip}
`).join('\n')}

## Strategic Roadmap
${report.roadmap.map(phase => `
### ${phase.phase}
${phase.tasks.map(t => `- ${t}`).join('\n')}
`).join('\n')}
    `.trim();

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${date}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!report) return;
    
    const shareData = {
      title: 'AI Interviewer Pro Result',
      text: `I just scored ${report.overallScore}/100 on my AI technical interview mock! Hiring Verdict: ${report.hiringRecommendation}.`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center text-white font-sans">
        <div className="relative w-40 h-40 mb-10">
           <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-[60px] animate-pulse"></div>
           {/* Geometric Loader */}
           <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
           <div className="absolute inset-4 border border-t-purple-500/50 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <Terminal className="text-white/50 animate-pulse" size={32} />
           </div>
        </div>
        <h2 className="text-2xl font-serif font-light mb-3 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">Processing Interview Data</h2>
        <div className="flex gap-2 items-center text-xs text-gray-500 font-mono uppercase tracking-[0.2em]">
           <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
           Analyzing Audio Stream...
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans">
        <div className="bg-red-950/20 border border-red-500/20 p-10 rounded-2xl max-w-lg text-center backdrop-blur-md">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-6" />
          <h3 className="text-xl font-serif text-white mb-2">Generation Failed</h3>
          <p className="text-gray-400 mb-8 font-light text-sm">{error}</p>
          <Button onClick={onBack} variant="secondary" className="border-red-500/30 hover:bg-red-950/30 text-red-200">Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-900/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[100px]"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
         <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
               <div className="p-2 rounded-full border border-white/10 group-hover:bg-white/10 transition-colors">
                  <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
               </div>
               <span className="font-mono text-xs tracking-widest uppercase hidden sm:inline">Exit Report</span>
            </button>
            <div className="flex items-center gap-4">
               <button 
                 onClick={handleDownload}
                 className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" 
                 title="Download MD"
               >
                 <Download size={18} />
               </button>
               <button 
                 onClick={handleShare}
                 className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                 title="Share Result"
               >
                 {isCopied ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} />}
                 {isCopied && <span className="text-xs text-emerald-400 font-mono hidden md:inline">COPIED</span>}
               </button>
            </div>
         </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-10 md:gap-16 mb-12 md:mb-20 animate-slide-up-fade">
           
           <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left w-full">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-indigo-900/20">
                 <Activity size={12} className="animate-pulse" /> Interview Analysis
              </div>
              
              <div>
                <h1 className="text-4xl md:text-7xl font-serif text-white tracking-tight leading-[1.1] mb-4 md:mb-6">
                   Performance <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 italic pr-2">Evaluation</span>
                </h1>
                <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6 md:mb-8 mx-auto md:mx-0"></div>
                <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed font-light mx-auto md:mx-0">
                   <Typewriter text={report.summary} speed={20} delay={500} />
                </p>
              </div>
              
              <div className="flex justify-center md:justify-start pt-4">
                 <div className={`px-6 md:px-8 py-3 md:py-4 rounded-2xl border backdrop-blur-md flex items-center gap-4 ${
                    report.hiringRecommendation === 'YES' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200' :
                    report.hiringRecommendation === 'NO' ? 'bg-red-500/5 border-red-500/20 text-red-200' :
                    'bg-amber-500/5 border-amber-500/20 text-amber-200'
                 }`}>
                    <div>
                       <div className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-1">Hiring Verdict</div>
                       <div className="text-xl md:text-2xl font-serif">{report.hiringRecommendation}</div>
                    </div>
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border ${
                       report.hiringRecommendation === 'YES' ? 'bg-emerald-500/20 border-emerald-500/30' :
                       report.hiringRecommendation === 'NO' ? 'bg-red-500/20 border-red-500/30' :
                       'bg-amber-500/20 border-amber-500/30'
                    }`}>
                       {report.hiringRecommendation === 'YES' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    </div>
                 </div>
              </div>
           </div>

           <div className="relative">
              <ScoreDial score={report.overallScore} />
           </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="sticky top-16 md:top-24 z-30 flex justify-center mb-8 md:mb-16 pointer-events-none">
           <div className="inline-flex bg-[#0a0a0a]/80 p-1 md:p-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl pointer-events-auto overflow-x-auto max-w-full">
              {[
                { id: 'overview', label: 'Overview', icon: Layers },
                { id: 'transcript', label: 'Transcript', icon: BookOpen },
                { id: 'roadmap', label: 'Roadmap', icon: TrendingUp },
              ].map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-500 shrink-0 ${
                     activeTab === tab.id 
                       ? 'bg-white text-black shadow-lg transform scale-105' 
                       : 'text-gray-500 hover:text-white hover:bg-white/5'
                   }`}
                 >
                    <tab.icon size={12} className="md:w-3.5 md:h-3.5" /> {tab.label}
                 </button>
              ))}
           </div>
        </div>

        {/* CONTENT AREA */}
        <div className="min-h-[600px] animate-slide-up-fade" key={activeTab}>
           
           {/* VIEW 1: OVERVIEW */}
           {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 
                 {/* Left: Radar */}
                 <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 p-6 md:p-10 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                       <Activity size={180} />
                    </div>
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-lg md:text-xl font-serif text-white flex items-center gap-3">
                          <Zap size={20} className="text-amber-400" /> Skill Topology
                       </h3>
                    </div>
                    <InteractiveRadarChart data={report.categoryScores} />
                 </div>

                 {/* Right: Lists */}
                 <div className="space-y-6">
                    <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 p-6 md:p-8 shadow-xl hover:border-emerald-500/20 transition-colors group">
                       <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Key Strengths
                       </h3>
                       <div className="flex flex-wrap gap-3">
                          {report.strengths.map((str, i) => (
                             <span key={i} className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-900/10 border border-emerald-500/10 text-emerald-200 text-xs md:text-sm rounded-lg font-medium group-hover:bg-emerald-900/20 transition-colors">
                                {str}
                             </span>
                          ))}
                       </div>
                    </div>

                    <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 p-6 md:p-8 shadow-xl hover:border-red-500/20 transition-colors group">
                       <h3 className="text-xs font-bold text-red-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Critical Gaps
                       </h3>
                       <div className="flex flex-wrap gap-3">
                          {report.weaknesses.map((weak, i) => (
                             <span key={i} className="px-3 py-1.5 md:px-4 md:py-2 bg-red-900/10 border border-red-500/10 text-red-200 text-xs md:text-sm rounded-lg font-medium group-hover:bg-red-900/20 transition-colors">
                                {weak}
                             </span>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {/* VIEW 2: TRANSCRIPT */}
           {activeTab === 'transcript' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                 {report.transcriptAnalysis.map((item, idx) => (
                    <div key={idx} className="group bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300">
                       
                       <div className="p-6 md:p-8">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                             <h4 className="text-base md:text-lg font-serif text-white/90">
                                <span className="text-indigo-500/50 font-sans mr-4 text-sm font-bold tracking-widest">0{idx + 1}</span>
                                {item.question}
                             </h4>
                             <div className={`self-start md:self-auto shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                item.evaluation === 'STRONG' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                item.evaluation === 'ADEQUATE' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                item.evaluation === 'WEAK' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                'bg-red-500/10 border-red-500/20 text-red-400'
                             }`}>
                                {item.evaluation}
                             </div>
                          </div>
                          
                          <div className="pl-4 border-l-2 border-white/5 ml-2 mb-6">
                             <p className="text-gray-400 text-sm italic leading-relaxed">"{item.candidateResponseSummary}"</p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                             <div>
                                <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Critique</h5>
                                <p className="text-sm text-gray-300 leading-relaxed font-light">{item.feedback}</p>
                             </div>
                             <div className="bg-indigo-900/10 -m-4 p-4 rounded-xl border border-indigo-500/10">
                                <h5 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                   <Sparkles size={10} /> Optimization
                                </h5>
                                <p className="text-sm text-indigo-100/80 leading-relaxed font-light">{item.improvementTip}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           )}

           {/* VIEW 3: ROADMAP */}
           {activeTab === 'roadmap' && (
              <div className="max-w-3xl mx-auto">
                 <div className="relative space-y-12">
                    {/* Central Line */}
                    <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent opacity-30"></div>

                    {report.roadmap.map((phase, idx) => (
                       <div key={idx} className="relative pl-16 md:pl-20">
                          {/* Timeline Node */}
                          <div className="absolute left-0 top-0 w-14 h-14 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 shadow-xl">
                             <div className="text-lg font-serif font-bold text-white">{idx + 1}</div>
                          </div>
                          
                          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-indigo-500/20 transition-colors group">
                             <h3 className="text-lg md:text-xl font-serif text-white mb-6 flex items-center gap-3">
                                {phase.phase}
                             </h3>
                             <ul className="space-y-4">
                                {phase.tasks.map((task, i) => (
                                   <li key={i} className="flex items-start gap-4 text-gray-400 group-hover:text-gray-300 transition-colors">
                                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500/50 shrink-0"></div>
                                      <p className="text-sm leading-relaxed">{task}</p>
                                   </li>
                                ))}
                             </ul>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}

        </div>

      </div>
    </div>
  );
};

export default LiveReportPage;
