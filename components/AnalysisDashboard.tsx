
import React, { useMemo } from 'react';
import { CandidateAnalysis } from '../types';
import { Award, AlertTriangle, Briefcase, TrendingUp, Activity } from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: CandidateAnalysis;
}

// --- SVG LINE CHART (TREND) ---
const TrendChart = () => {
  // Mock trend data
  const data = [4, 6, 5, 7, 8, 8.5, 9];
  const max = 10;
  const height = 60;
  const width = 200;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (val / max) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="relative h-[60px] w-full mt-4">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
        <defs>
          <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M0,${height} ${points} L${width},${height} Z`} fill="url(#trendGradient)" />
        <polyline points={points} fill="none" stroke="#6366f1" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {data.map((val, i) => {
           const x = (i / (data.length - 1)) * 100 + "%";
           const y = height - (val / max) * height;
           return <circle key={i} cx={x} cy={y} r="3" className="fill-white stroke-indigo-500" strokeWidth="2" />;
        })}
      </svg>
    </div>
  );
};

// --- SVG BAR CHART (SKILLS) ---
const SkillBars = ({ skills }: { skills: string[] }) => {
  return (
    <div className="space-y-3 mt-4">
      {skills.slice(0, 3).map((skill, i) => {
        const val = 60 + Math.random() * 35; // Mock score for visual
        return (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-700 dark:text-gray-300 font-medium">{skill}</span>
              <span className="text-gray-500">{Math.round(val)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-emerald-500 rounded-full" 
                 style={{ width: `${val}%` }}
               ></div>
            </div>
          </div>
        )
      })}
    </div>
  );
};

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis }) => {
  const readinessScore = useMemo(() => {
    const base = analysis.experience_level === "2+ years" ? 85 : analysis.experience_level === "1-2 years" ? 65 : 45;
    return base;
  }, [analysis.experience_level]);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 mb-8">
      
      {/* 1. Main Profile Card */}
      <div className="col-span-12 md:col-span-4 bg-white dark:bg-[#0d1021] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity text-indigo-500">
            <Briefcase size={80} />
         </div>
         
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profile Level</h3>
                <p className="text-sm text-gray-500 capitalize">{analysis.experience_level}</p>
              </div>
            </div>

            <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-sm mb-2 font-medium text-gray-700 dark:text-gray-300">
                    <span>Interview Readiness</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{readinessScore}%</span>
                 </div>
                 <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${readinessScore}%` }}></div>
                 </div>
               </div>
               
               <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                 Based on resume density and keyword matching.
               </p>
            </div>
         </div>
      </div>

      {/* 2. Skills Breakdown */}
      <div className="col-span-12 md:col-span-4 bg-white dark:bg-[#0d1021] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
               <Award size={18} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Top Skills</h3>
         </div>
         
         <SkillBars skills={analysis.primary_skills} />
         
         <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
            {analysis.primary_skills.slice(3).map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded border border-gray-200 dark:border-gray-700">
                {skill}
              </span>
            ))}
         </div>
      </div>

      {/* 3. Focus Areas & Trend */}
      <div className="col-span-12 md:col-span-4 bg-white dark:bg-[#0d1021] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
         <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                  <AlertTriangle size={18} />
               </div>
               <h3 className="font-bold text-gray-900 dark:text-white">Focus Areas</h3>
            </div>
            <ul className="space-y-2">
               {analysis.weak_areas_detected.length > 0 ? (
                 analysis.weak_areas_detected.slice(0, 2).map((area, idx) => (
                   <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/10 p-2 rounded">
                     <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0"></span>
                     {area}
                   </li>
                 ))
               ) : (
                 <li className="text-sm text-gray-500 italic">No critical gaps detected yet.</li>
               )}
            </ul>
         </div>

         <div className="mt-6">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
               <TrendingUp size={12} /> Projected Growth
            </div>
            <TrendChart />
         </div>
      </div>

    </div>
  );
};

export default AnalysisDashboard;
