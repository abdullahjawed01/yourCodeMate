import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Target, Award, Zap, Code2, Activity, TrendingUp, Calendar, BrainCircuit, Timer, Flame } from 'lucide-react';
import { progressApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, CartesianGrid
} from 'recharts';

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const slideUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

const ACTIVITY_DATA = Array.from({ length: 14 * 7 }, (_, i) => ({
  date: i,
  count: Math.random() > 0.4 ? Math.floor(Math.random() * 8) : 0,
}));

const CONTEST_DATA = [
  { name: 'Weekly 1', rating: 1200 },
  { name: 'Weekly 2', rating: 1350 },
  { name: 'Biweekly 1', rating: 1310 },
  { name: 'Weekly 3', rating: 1480 },
  { name: 'Weekly 4', rating: 1520 },
  { name: 'Biweekly 2', rating: 1610 },
  { name: 'Weekly 5', rating: 1750 },
];

const SKILL_DATA = [
  { subject: 'Arrays', A: 90, fullMark: 100 },
  { subject: 'Strings', A: 85, fullMark: 100 },
  { subject: 'Linked List', A: 70, fullMark: 100 },
  { subject: 'Trees', A: 80, fullMark: 100 },
  { subject: 'DP', A: 60, fullMark: 100 },
  { subject: 'Graphs', A: 65, fullMark: 100 },
  { subject: 'Math', A: 95, fullMark: 100 },
];

const Progress: React.FC = () => {
  const { user } = useAuth();
  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: progressApi.getProgress,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-white/50 animate-pulse font-mono flex items-center gap-2"><Activity size={16} /> Compiling Analytics...</p>
        </div>
      </div>
    );
  }

  // Derived Stats
  const totalSolved = user?.solvedTests?.length || 142;
  const targetTotal = 500;

  const difficultyData = [
    { name: 'Easy', value: Math.floor(totalSolved * 0.5), color: '#10b981' },   // emerald
    { name: 'Medium', value: Math.floor(totalSolved * 0.35), color: '#eab308' },// yellow
    { name: 'Hard', value: Math.floor(totalSolved * 0.15), color: '#ef4444' },  // red
  ];

  const pointsTimeline = [
    { month: 'Jan', points: 1200 }, { month: 'Feb', points: 1900 }, { month: 'Mar', points: 2800 },
    { month: 'Apr', points: 3400 }, { month: 'May', points: 4100 }, { month: 'Jun', points: (progress?.points || 4280) },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity size={20} className="text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Analytics Center</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Performance <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">Report</span>
          </h1>
          <p className="text-white/50 mt-2 max-w-xl text-lg">Detailed breakdown of your problem-solving metrics, contest ratings, and algorithmic skill tree.</p>
        </div>
        <div className="flex bg-card/20 border border-white/10 px-6 py-4 rounded-3xl shadow-cyber glass-card backdrop-blur-md items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30 shadow-inner group">
            <Timer size={24} className="text-primary group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-[11px] text-white/50 uppercase font-bold tracking-widest mb-1">Total Time Coded</p>
            <p className="font-black text-white text-2xl leading-none flex items-baseline gap-1">
              124<span className="text-primary text-sm">hrs</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Top Overview KPI Cards */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Points', value: progress?.points || 4280, icon: <Zap size={20} className="text-yellow-400" />, desc: 'Top 12% globally', bg: 'bg-yellow-500/10' },
          { label: 'Problems Solved', value: totalSolved, icon: <Code2 size={20} className="text-emerald-400" />, desc: `${targetTotal - totalSolved} to next badge`, bg: 'bg-emerald-500/10' },
          { label: 'Current Streak', value: `${user?.streak || 12} Days`, icon: <TrendingUp size={20} className="text-orange-400" />, desc: 'Personal best: 24', bg: 'bg-orange-500/10' },
          { label: 'Badges Unlocked', value: progress?.badges?.length || 8, icon: <Award size={20} className="text-purple-400" />, desc: 'Latest: Algorithm Master', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <motion.div key={i} variants={slideUp} className="glass-card-premium border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-all shadow-cyber hover:shadow-cyber-strong group relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-3xl opacity-20 ${stat.bg} group-hover:opacity-50 transition-all duration-500`} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={`p-4 rounded-2xl ${stat.bg} border border-white/10 shadow-inner`}>{stat.icon}</div>
            </div>
            <div className="relative z-10">
              <p className="text-xs text-white/50 uppercase font-black tracking-widest mb-1.5">{stat.label}</p>
              <p className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-md">{stat.value}</p>
              <p className="text-xs font-bold text-primary/80">{stat.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Charts Row */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Points Growth Over Time (Area Chart) */}
        <motion.div variants={slideUp} className="lg:col-span-2 glass-card-premium border-white/10 rounded-3xl p-6 shadow-cyber relative overflow-hidden group hover:shadow-cyber-strong transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/30 transition-colors duration-500" />
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
            <TrendingUp size={18} className="text-primary" /> Experience Growth
          </h3>
          <div className="w-full h-[280px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pointsTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(5, 10, 20, 0.9)', borderColor: 'rgba(0, 240, 255, 0.3)', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="points" stroke="#00f0ff" strokeWidth={3} fillOpacity={1} fill="url(#colorPoints)" activeDot={{ r: 6, fill: '#00f0ff', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Problems by Difficulty (Pie Chart) */}
        <motion.div variants={slideUp} className="glass-card-premium border-white/10 rounded-3xl p-6 shadow-cyber flex flex-col items-center">
          <h3 className="text-lg font-bold text-white mb-2 self-start flex items-center gap-2">
            <Target size={18} className="text-purple-400" /> Solved by Difficulty
          </h3>
          <div className="w-full h-[220px] mt-4 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={difficultyData} innerRadius={65} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(5, 10, 20, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full flex justify-between mt-6 px-4">
            {difficultyData.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 shadow-inner" style={{ backgroundColor: `${item.color}20` }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                </div>
                <span className="text-xs font-bold text-white/50">{item.name}</span>
                <span className="text-xl font-black text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>

      {/* Secondary Charts Row */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Contest Rating (Line Chart) */}
        <motion.div variants={slideUp} className="glass-card-premium border-white/10 rounded-3xl p-6 shadow-cyber">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" /> Contest Rating
            </h3>
            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 text-xs font-bold rounded-xl tracking-wider shadow-[0_0_10px_rgba(234,179,8,0.2)]">Knight Rank</span>
          </div>
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CONTEST_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(5, 10, 20, 0.9)', borderColor: 'rgba(234, 179, 8, 0.3)', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="rating" stroke="#eab308" strokeWidth={3} dot={{ fill: '#eab308', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#fff', stroke: '#eab308' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Skill Graph (Radar Chart) */}
        <motion.div variants={slideUp} className="glass-card-premium border-white/10 rounded-3xl p-6 shadow-cyber flex flex-col items-center">
          <h3 className="text-lg font-bold text-white mb-2 self-start flex items-center gap-2">
            <BrainCircuit size={18} className="text-blue-400" /> Algorithm Mastery
          </h3>
          <div className="w-full h-[250px] mt-2 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SKILL_DATA}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff80', fontSize: 11, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Proficiency" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(5, 10, 20, 0.9)', borderColor: 'rgba(59, 130, 246, 0.3)', borderRadius: '12px', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      {/* Submission Heatmap */}
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.div variants={slideUp} className="glass-card-premium border-white/10 rounded-3xl p-8 shadow-cyber relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                <Calendar size={22} className="text-emerald-400" /> Daily Submissions
              </h3>
              <span className="text-sm text-white/50 font-semibold">{totalSolved} submissions in the last 98 days</span>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Flame size={24} className="text-emerald-400" />
            </div>
          </div>

          <div className="overflow-x-auto pb-6 scrollbar-none relative z-10 w-full flex justify-center">
            <div className="flex gap-2 min-w-max">
              {Array.from({ length: 14 }, (_, week) => (
                <div key={week} className="flex flex-col gap-2">
                  {Array.from({ length: 7 }, (_, day) => {
                    const cell = ACTIVITY_DATA[week * 7 + day];
                    let bg = 'bg-white/5';
                    let ring = 'hover:ring-white/30';
                    if (cell.count > 0 && cell.count <= 2) { bg = 'bg-emerald-900/50 border border-emerald-800/60'; ring = 'hover:ring-emerald-500/50'; }
                    else if (cell.count > 2 && cell.count <= 5) { bg = 'bg-emerald-600/70 border border-emerald-500/60 shadow-[0_0_8px_rgba(52,211,153,0.3)]'; ring = 'hover:ring-emerald-400/70'; }
                    else if (cell.count > 5) { bg = 'bg-emerald-400 border border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.6)]'; ring = 'hover:ring-emerald-300'; }

                    return (
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        key={day}
                        className={`w-5 h-5 rounded-md ${bg} transition-all duration-200 hover:ring-2 ${ring} cursor-pointer`}
                        title={`${cell.count} submissions`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px] text-white/40 font-bold uppercase tracking-wider justify-end relative z-10">
            <span>Less</span>
            <div className="flex gap-1.5">
              <div className="w-3.5 h-3.5 rounded-sm bg-white/5" />
              <div className="w-3.5 h-3.5 rounded-sm bg-emerald-900/50 border border-emerald-800/60" />
              <div className="w-3.5 h-3.5 rounded-sm bg-emerald-600/70 border border-emerald-500/60" />
              <div className="w-3.5 h-3.5 rounded-sm bg-emerald-400 border border-emerald-300 shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
            </div>
            <span>More</span>
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
};

export default Progress;
