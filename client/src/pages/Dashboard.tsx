import React, { useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, friendsApi } from '@/services/api';
import {
  BrainCircuit, Sparkles, Terminal,
  Flame, Trophy, Zap, Target, Swords, Globe2, Star,
  CheckCircle2, Clock, Cpu, ChevronRight, Activity,
  Play, Users, TrendingUp, ArrowRight, Calendar, Loader2
} from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell
} from 'recharts';

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ───────────────────────────────────────────────────────────────

const DAILY_CHALLENGE = {
  title: 'LRU Cache Design',
  difficulty: 'medium' as const,
  category: 'System Design',
  xpReward: 150,
  solvedCount: 3421,
};

const activityData = [
  { name: 'Mon', problems: 4 }, { name: 'Tue', problems: 7 }, { name: 'Wed', problems: 2 },
  { name: 'Thu', problems: 9 }, { name: 'Fri', problems: 12 }, { name: 'Sat', problems: 5 }, { name: 'Sun', problems: 8 }
];

const radarData = [
  { subject: 'Algorithms', A: 120, fullMark: 150 },
  { subject: 'Data Structs', A: 98, fullMark: 150 },
  { subject: 'Sys Design', A: 86, fullMark: 150 },
  { subject: 'Databases', A: 99, fullMark: 150 },
  { subject: 'Math', A: 85, fullMark: 150 },
  { subject: 'Concurrency', A: 65, fullMark: 150 },
];

const QUICK_ACTIONS = [
  { icon: Play, label: 'Start Coding', path: '/ide', gradient: 'from-blue-600 to-cyan-500', shadow: 'shadow-blue-500/30' },
  { icon: Trophy, label: 'Join Contest', path: '/contests', gradient: 'from-yellow-500 to-orange-500', shadow: 'shadow-yellow-500/30' },
  { icon: Swords, label: 'DSA Battle', path: '/battle', gradient: 'from-rose-600 to-pink-500', shadow: 'shadow-rose-500/30' },
  { icon: Zap, label: 'Random Problem', path: '/test', gradient: 'from-purple-600 to-violet-500', shadow: 'shadow-purple-500/30' },
];

const featureCards = [
  { icon: BrainCircuit, label: 'AI Interviews', path: '/interview', color: 'blue', desc: 'Google-style interview rounds with real-time AI feedback.' },
  { icon: Terminal, label: 'Interactive IDE', path: '/ide', color: 'purple', desc: 'Code in 8 languages directly in your browser.' },
  { icon: Swords, label: 'DSA Battles', path: '/battle', color: 'rose', desc: 'Challenge friends to fast-paced coding battles.' },
  { icon: Globe2, label: 'Global Contests', path: '/contests', color: 'indigo', desc: 'Compete in live, highly competitive hackathons.' },
  { icon: Sparkles, label: 'AI Mentor', path: '/mentor', color: 'teal', desc: '24/7 personal DSA guidance and logic hints.' },
  { icon: Cpu, label: 'Algo Visualizer', path: '/visualizer', color: 'cyan', desc: 'Watch algorithms animate step-by-step.' },
];

const iconColorMap: Record<string, string> = {
  blue: 'text-blue-400', purple: 'text-purple-400', teal: 'text-teal-400',
  rose: 'text-rose-400', indigo: 'text-indigo-400', cyan: 'text-cyan-400',
};

const DIFF_DOT: Record<string, string> = {
  easy: 'bg-emerald-500',
  medium: 'bg-yellow-500',
  hard: 'bg-rose-500',
};

// ─── Lightweight CSS Hero Backdrop ─────────────────────────────────────────────
// GPU-cheap animated backdrop (no WebGL / Three.js). Renders an aurora gradient,
// a subtle grid, and a few drifting orbs — a fraction of the cost of a WebGL scene.

const HeroBackdrop: React.FC = React.memo(() => (
  <div className="absolute inset-0 w-full h-full overflow-hidden">
    <div className="hero-aurora absolute inset-0" />
    <div className="absolute inset-0 bg-grid-pattern opacity-[0.06]" />
    <div className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px] animate-float" />
    <div className="absolute -bottom-1/4 -right-1/4 w-[55%] h-[55%] rounded-full bg-accent/15 blur-[120px] animate-float-slow" />
    <div className="absolute top-1/3 right-1/4 w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px] animate-pulse-slow" />
  </div>
));
HeroBackdrop.displayName = 'HeroBackdrop';

// ─── Animated Counter ─────────────────────────────────────────────────────────

const AnimatedCounter: React.FC<{ to: number; duration?: number; suffix?: string }> = ({ to, duration = 1.5, suffix = '' }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString() + suffix);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, to, { duration, ease: 'easeOut' });
    return controls.stop;
  }, [to]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};


const heatColor = (v: number) => {
  if (v === 0) return 'bg-white/5 border-white/5';
  if (v === 1) return 'bg-emerald-900/60 border-emerald-800/40';
  if (v === 2) return 'bg-emerald-700/70 border-emerald-600/40';
  if (v === 3) return 'bg-emerald-500/80 border-emerald-400/40';
  return 'bg-emerald-400 border-emerald-300/50';
};

const GitHubHeatmap: React.FC<{ data: number[] }> = ({ data }) => {
  const weeks = useMemo(() => {
    const result: number[][] = [];
    for (let w = 0; w < 52; w++) result.push(data.slice(w * 7, w * 7 + 7));
    return result;
  }, [data]);

  return (
    <div className="flex gap-[3px] overflow-x-auto scrollbar-none pb-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((val, di) => (
            <div
              key={di}
              title={`${val} submissions`}
              className={`w-[10px] h-[10px] rounded-sm border transition-all duration-200 hover:scale-125 cursor-pointer ${heatColor(val)}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  // Real statistical data fetching
  const { data: dbData, isLoading: dbLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getDashboard(),
    enabled: !!user,
  });

  // Real friends (silentFail so a hiccup never redirects). Powers the dev feed.
  const { data: friendsData } = useQuery({
    queryKey: ['dashboard-friends'],
    queryFn: () => friendsApi.getFriends(),
    enabled: !!user,
    retry: 0,
    staleTime: 60_000,
  });
  const friends = (friendsData?.friends ?? []) as Array<{
    _id: string; name: string; level?: number; points?: number; streak?: number;
  }>;

  // Recommended problems derived from the user's REAL unlocked-but-unsolved tests.
  const recommended = useMemo(() => {
    const tests = (dbData?.tests ?? []) as any[];
    return tests
      .filter((t) => t.unlocked && !t.completed)
      .slice(0, 4)
      .map((t) => ({
        id: String(t._id),
        title: t.title as string,
        difficulty: (t.difficulty as string) || 'medium',
        category: (Array.isArray(t.tags) && t.tags[0]) || 'Practice',
        xp: (t.maxScore as number) || 50,
      }));
  }, [dbData]);

  // Merge context user with freshly fetched dashboard data
  const streak = dbData?.streak ?? user?.streak ?? 0;
  const level = dbData?.level ?? user?.level ?? 1;
  const points = dbData?.points ?? user?.points ?? 0;

  const safeLevel = Math.max(1, level);
  const xpForNext = safeLevel * 500;
  const xpPct = Math.min(100, Math.max(0, ((points % xpForNext) / xpForNext) * 100));

  // Calculate completed tests from dashboard data if available
  const solved = dbData?.tests?.filter((t: any) => t.completed).length ?? user?.solvedTests?.length ?? 0;
  const rank = dbData?.rank ?? user?.rank ?? 'Novice';
  // `rank` may be a numeric leaderboard position or a named tier (e.g. "Novice").
  const rankIsNumeric = typeof rank === 'number' || /^\d+$/.test(String(rank));
  const rankLabel = rankIsNumeric ? `Rank #${rank}` : String(rank);

  const heatmapData = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < 365; i++) arr.push(Math.random() < 0.15 ? Math.floor(Math.random() * 4) : 0);
    return arr;
  }, []);

  const longestStreak = useMemo(() => Math.max(streak, Math.floor(streak * 1.2)), [streak]);

  const statsRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const recommRef = useRef<HTMLDivElement>(null);
  const featRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run animations when loading states are resolved
    if (authLoading || (dbLoading && !isError)) return;

    const ctx = gsap.context(() => {
      // 1. Hero Content (Immediate)
      gsap.fromTo(heroContentRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
      );

      // 2. Quick Actions (Fast stagger, no ScrollTrigger for top element)
      const actionChildren = actionsRef.current?.children;
      if (actionChildren && actionChildren.length > 0) {
        gsap.fromTo(actionChildren,
          { opacity: 0, scale: 0.9, y: 15 },
          { opacity: 1, scale: 1, y: 0, stagger: 0.05, duration: 0.4, ease: 'back.out(1.5)', delay: 0.3 }
        );
      }

      // 3. Stat Cards (Staggered entry)
      const statChildren = statsRef.current?.children;
      if (statChildren && statChildren.length > 0) {
        gsap.fromTo(statChildren,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out', delay: 0.5 }
        );
      }

      // 4. Heatmap & Others (With once:true ScrollTrigger)
      if (heatmapRef.current) {
        gsap.fromTo(heatmapRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: heatmapRef.current, start: 'top 95%', once: true }
          }
        );
      }
    });

    return () => ctx.revert();
  }, [authLoading, dbLoading, isError]);

  const diffPieData = [
    { name: 'Easy', value: Math.max(1, Math.round(solved * 0.45)), color: '#10b981' },
    { name: 'Medium', value: Math.max(1, Math.round(solved * 0.38)), color: '#f59e0b' },
    { name: 'Hard', value: Math.max(1, Math.round(solved * 0.17)), color: '#ef4444' },
  ];

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-white/40 font-mono animate-pulse uppercase tracking-[0.2em] text-xs">Syncing Core Systems...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24 overflow-x-hidden relative">

      {/* ── HERO SECTION ── */}
      <div className="relative min-h-[560px] flex items-center rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(99,102,241,0.12)]">
        {/* Animated CSS Background */}
        <div className="absolute inset-0 z-0">
          <HeroBackdrop />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a]/90 via-[#0d0d20]/80 to-[#0a0a1a]/90 z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[2]" />

        {/* Floating symbols */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          {['{', '}', '()', '=>', '[]', '</>', 'fn', '//'].map((sym, i) => (
            <div
              key={i}
              className="absolute font-mono text-white/[0.06] font-black select-none"
              style={{
                fontSize: `${40 + i * 15}px`,
                left: `${8 + i * 12}%`,
                top: `${10 + (i % 3) * 30}%`,
                animation: `float${(i % 3) + 1} ${6 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.7}s`,
              }}
            >
              {sym}
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div ref={heroContentRef} className="relative z-10 w-full px-8 lg:px-16 py-16">
          <div className="max-w-3xl">
            {/* Status badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {streak > 0 && (
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 backdrop-blur-sm">
                  <Flame size={15} className="text-orange-400 animate-pulse" />
                  <span className="text-sm font-bold text-orange-400">{streak} Day Streak</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 backdrop-blur-sm">
                <Trophy size={13} className="text-primary" />
                <span className="text-sm font-bold text-primary">Level {level} · {rankLabel}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-sm">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">{solved} Problems Solved</span>
              </div>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-4 leading-[1.05] tracking-tight">
              Welcome back,<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                {user?.name?.split(' ')[0] || 'Developer'}
              </span>
              <span className="text-white">.</span>
            </h1>
            <p className="text-lg text-white/50 mb-10 max-w-lg leading-relaxed">
              Your coding journey continues. Keep grinding to reach Diamond League and unlock exclusive achievements.
            </p>

            {/* XP Bar */}
            <div className="max-w-sm">
              <div className="flex justify-between text-xs font-semibold mb-2 text-white/60">
                <span className="flex items-center gap-1.5"><Zap size={12} className="text-yellow-400" />Level {level} → {level + 1}</span>
                <span className="text-white/80">{points % xpForNext} / {xpForNext} XP</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 1.8, ease: 'easeOut', delay: 0.6 }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div>
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Zap size={18} className="text-yellow-400" /> Quick Actions
        </h2>
        <div ref={actionsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.path} to={action.path}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${action.gradient} ${action.shadow} shadow-lg border border-white/10 cursor-pointer group`}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/10 blur-xl group-hover:bg-white/20 transition-colors" />
                  <Icon size={22} className="text-white mb-3 relative z-10" />
                  <p className="text-sm font-black text-white relative z-10">{action.label}</p>
                  <ArrowRight size={14} className="text-white/60 mt-1 group-hover:translate-x-1 transition-transform relative z-10" />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div>
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-400" /> Your Stats
        </h2>
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Problems Solved', value: solved, icon: CheckCircle2, color: 'emerald', glow: 'shadow-emerald-500/20' },
            { label: 'Current Streak', value: streak, icon: Flame, color: 'orange', suffix: 'd', glow: 'shadow-orange-500/20' },
            { label: 'Global Rank', value: rank, icon: Globe2, color: 'blue', prefix: rankIsNumeric ? '#' : '', glow: 'shadow-blue-500/20' },
            { label: 'Battles Won', value: (user as any)?.battlesWon ?? 0, icon: Swords, color: 'rose', glow: 'shadow-rose-500/20' },
            { label: 'Total XP', value: points, icon: Zap, color: 'yellow', glow: 'shadow-yellow-500/20' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            const colorMap: Record<string, string> = {
              emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
              orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
              blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
              rose: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
              yellow: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
            };
            return (
              <motion.div
                key={i}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`relative overflow-hidden rounded-2xl border border-white/8 bg-black/40 backdrop-blur-xl p-5 shadow-xl ${stat.glow} group cursor-default`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
                <div className={`inline-flex p-2 rounded-xl border mb-3 ${colorMap[stat.color]}`}>
                  <Icon size={16} />
                </div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="text-3xl font-black text-white">
                  {typeof stat.value === 'number'
                    ? <>{stat.prefix}<AnimatedCounter to={stat.value || 0} />{stat.suffix}</>
                    : <>{stat.prefix}{stat.value}{stat.suffix}</>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── ACTIVITY GRAPH + DIFFICULTY PIE ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Activity graph */}
        <div className="xl:col-span-2 rounded-2xl border border-white/8 bg-black/40 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Activity size={16} className="text-primary" /> Weekly Activity
            </h3>
            <Link to="/progress" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-semibold transition-colors">
              Full analytics <ChevronRight size={13} />
            </Link>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#444" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#333" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(10,10,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="problems" stroke="#6366f1" strokeWidth={3} fill="url(#areaGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty pie */}
        <div className="rounded-2xl border border-white/8 bg-black/40 backdrop-blur-xl p-6">
          <h3 className="text-base font-black text-white flex items-center gap-2 mb-5">
            <Target size={16} className="text-purple-400" /> Difficulty Split
          </h3>
          <div className="flex flex-col items-center gap-4">
            <div className="w-[140px] h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={diffPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none">
                    {diffPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(10,10,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 w-full">
              {diffPieData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-white/60">{d.name}</span>
                  </div>
                  <span className="font-bold text-white">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── GITHUB STREAK HEATMAP ── */}
      <div ref={heatmapRef} className="rounded-2xl border border-white/8 bg-black/40 backdrop-blur-xl p-6 shadow-cyber-light">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Calendar size={16} className="text-emerald-400" /> Coding Productivity
          </h3>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-black text-orange-400">{streak}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Current</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-400">{longestStreak}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Longest</p>
            </div>
          </div>
        </div>
        <GitHubHeatmap data={heatmapData} />
        <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-white/30">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map(l => (
            <div key={l} className={`w-2.5 h-2.5 rounded-sm border ${heatColor(l)}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* ── SKILL RADAR + DAILY CHALLENGE ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Radar */}
        <div className="rounded-2xl border border-white/8 bg-black/40 backdrop-blur-xl p-6">
          <h3 className="text-base font-black text-white flex items-center gap-2 mb-4">
            <BrainCircuit size={16} className="text-purple-400" /> Skill Matrix
          </h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Challenge */}
        <div className="xl:col-span-2 rounded-2xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 backdrop-blur-xl p-6 relative overflow-hidden group hover:border-yellow-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-yellow-500/15 transition-colors" />
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <Star size={18} className="text-black" />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Daily Mission</p>
                <p className="text-sm font-black text-white">Complete it to earn XP</p>
              </div>
            </div>
            <span className="text-xs text-white/40 flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              <Clock size={10} /> 6h 24m
            </span>
          </div>
          <h3 className="text-2xl font-black text-white mb-3">{DAILY_CHALLENGE.title}</h3>
          <div className="flex flex-wrap items-center gap-2 mb-5 text-sm">
            <span className={`diff-${DAILY_CHALLENGE.difficulty} px-3 py-1 rounded-full text-xs font-bold uppercase`}>{DAILY_CHALLENGE.difficulty}</span>
            <span className="text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/5">{DAILY_CHALLENGE.category}</span>
            <span className="text-yellow-400 font-bold flex items-center gap-1"><Zap size={12} />+{DAILY_CHALLENGE.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/test" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 text-black text-sm font-black hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20">
              Start Mission <ChevronRight size={15} />
            </Link>
            <p className="text-xs text-white/30">{DAILY_CHALLENGE.solvedCount.toLocaleString()} solved today</p>
          </div>
        </div>
      </div>

      {/* ── FRIEND ACTIVITY FEED + RECOMMENDED ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Friends (real data) */}
        <div className="rounded-2xl border border-white/8 bg-black/40 backdrop-blur-xl p-6">
          <h3 className="text-base font-black text-white flex items-center gap-2 mb-5">
            <Users size={16} className="text-blue-400" /> Your Friends
          </h3>
          <div ref={feedRef} className="space-y-3">
            {friends.length > 0 ? (
              friends.slice(0, 5).map((f) => {
                const hue = (f.name?.charCodeAt(0) ?? 65) * 7 % 360;
                return (
                  <Link key={f._id} to={`/profile/${f._id}`}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                    >
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center font-black text-xs text-white"
                        style={{ backgroundColor: `hsl(${hue} 60% 35%)` }}
                      >
                        {f.name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-semibold truncate">{f.name}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">
                          Level {f.level ?? 1} · {(f.points ?? 0).toLocaleString()} pts
                        </p>
                      </div>
                      {(f.streak ?? 0) > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-orange-400 font-bold flex-shrink-0">
                          <Flame size={11} />{f.streak}
                        </span>
                      )}
                    </motion.div>
                  </Link>
                );
              })
            ) : (
              <div className="flex flex-col items-center text-center py-8 px-4">
                <Users size={28} className="text-white/20 mb-3" />
                <p className="text-sm text-white/60 font-semibold">No friends yet</p>
                <p className="text-xs text-white/30 mt-1">Connect with other developers to see them here.</p>
              </div>
            )}
          </div>
          <Link to="/friends" className="mt-4 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-semibold transition-colors">
            {friends.length > 0 ? 'Manage friends' : 'Find developers'} <ArrowRight size={12} />
          </Link>
        </div>

        {/* Recommended Problems */}
        <div ref={recommRef} className="rounded-2xl border border-white/8 bg-black/40 backdrop-blur-xl p-6">
          <h3 className="text-base font-black text-white flex items-center gap-2 mb-5">
            <Target size={16} className="text-emerald-400" /> Recommended for You
          </h3>
          <div className="space-y-3">
            {recommended.length > 0 ? (
              recommended.map((p) => (
                <Link key={p.id} to={`/tests/${p.id}`}>
                  <motion.div
                    whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.04)' }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${DIFF_DOT[p.difficulty] ?? 'bg-zinc-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">{p.title}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest truncate">{p.category}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-yellow-400 font-bold flex-shrink-0">
                      <Zap size={11} />+{p.xp}
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center text-center py-8 px-4">
                <Target size={28} className="text-white/20 mb-3" />
                <p className="text-sm text-white/60 font-semibold">You're all caught up</p>
                <p className="text-xs text-white/30 mt-1">Solve more to unlock new challenges.</p>
              </div>
            )}
          </div>
          <Link to="/test" className="mt-4 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-semibold transition-colors">
            See all problems <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* ── ECOSYSTEM TOOLKIT ── */}
      <div ref={featRef}>
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Cpu size={18} className="text-cyan-400" /> Ecosystem Toolkit
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {featureCards.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className="feat-card">
                <TiltCard className="p-5 h-full bg-black/40 backdrop-blur-xl border border-white/8 rounded-2xl relative overflow-hidden group hover:border-white/15 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-5 blur-[40px] rounded-full" />
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-xl bg-white/5 border border-white/8 ${iconColorMap[item.color]} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={18} />
                    </div>
                    <h3 className="font-black text-white text-sm">{item.label}</h3>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                  <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/15 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all duration-300" />
                </TiltCard>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
