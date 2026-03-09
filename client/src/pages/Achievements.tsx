import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Flame, Trophy, Award, Lock } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';

const BADGES = [
    { id: 'b1', title: 'First Blood', desc: 'Solved your first problem', icon: '🎯', rarity: 'common', unlocked: true, xp: 50, unlockedAt: '2026-01-15' },
    { id: 'b2', title: 'Streak Master', desc: 'Maintained a 7-day streak', icon: '🔥', rarity: 'rare', unlocked: true, xp: 150, unlockedAt: '2026-02-03' },
    { id: 'b3', title: 'Algorithm Master', desc: 'Solved 50 algorithm problems', icon: '🧠', rarity: 'epic', unlocked: true, xp: 400, unlockedAt: '2026-03-01' },
    { id: 'b4', title: 'Speed Solver', desc: 'Solve 10 problems in 24 hours', icon: '⚡', rarity: 'rare', unlocked: false, xp: 200 },
    { id: 'b5', title: 'Bug Hunter', desc: 'Completed 5 debug challenges', icon: '🐛', rarity: 'common', unlocked: true, xp: 75, unlockedAt: '2026-01-28' },
    { id: 'b6', title: 'DSA Legend', desc: 'Solve 200 DSA problems', icon: '👑', rarity: 'legendary', unlocked: false, xp: 1000 },
    { id: 'b7', title: 'Contest Finalist', desc: 'Reach Top 100 in a contest', icon: '🏆', rarity: 'epic', unlocked: false, xp: 500 },
    { id: 'b8', title: 'Code Reviewer', desc: 'Give 10 peer code reviews', icon: '🔎', rarity: 'common', unlocked: true, xp: 80, unlockedAt: '2026-02-11' },
    { id: 'b9', title: 'Polyglot', desc: 'Solve problems in 5 languages', icon: '🌐', rarity: 'rare', unlocked: false, xp: 250 },
    { id: 'b10', title: 'Hackathon Hero', desc: 'Win a hackathon event', icon: '🦸', rarity: 'legendary', unlocked: false, xp: 800 },
    { id: 'b11', title: 'Problem Crusher', desc: 'Solve 100 total problems', icon: '💪', rarity: 'epic', unlocked: false, xp: 600 },
    { id: 'b12', title: 'Battle Champion', desc: 'Win 25 coding battles', icon: '⚔️', rarity: 'epic', unlocked: false, xp: 450 },
];

const STREAK_DAYS = Array.from({ length: 28 }, (_, i) => ({
    day: i,
    active: [0, 1, 2, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].includes(i),
}));

const LEVELS = [
    { level: 1, name: 'Novice', xp: 0, color: 'text-gray-400' },
    { level: 2, name: 'Apprentice', xp: 200, color: 'text-green-400' },
    { level: 3, name: 'Coder', xp: 500, color: 'text-blue-400' },
    { level: 4, name: 'Developer', xp: 1000, color: 'text-purple-400' },
    { level: 5, name: 'Engineer', xp: 1800, color: 'text-yellow-400' },
    { level: 6, name: 'Architect', xp: 3000, color: 'text-orange-400' },
    { level: 7, name: 'Expert', xp: 5000, color: 'text-red-400' },
    { level: 8, name: 'Master', xp: 8000, color: 'text-pink-400' },
];

const RARITY_COLORS: Record<string, string> = {
    common: 'border-gray-400/40 bg-gray-400/5',
    rare: 'border-blue-400/40 bg-blue-400/5',
    epic: 'border-purple-400/40 bg-purple-400/5',
    legendary: 'border-yellow-400/40 bg-yellow-400/5 glow-gold',
};
const RARITY_LABEL: Record<string, string> = {
    common: 'text-gray-400', rare: 'text-blue-400', epic: 'text-purple-400', legendary: 'text-yellow-400',
};

const Achievements: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
    const currentLevel = 4;
    const currentXP = 1280;
    const nextLevelXP = LEVELS[currentLevel]?.xp ?? 1800;
    const xpPct = (currentXP / nextLevelXP) * 100;
    const streak = 7;
    const unlockedCount = BADGES.filter(b => b.unlocked).length;

    const filtered = BADGES.filter(b =>
        filter === 'all' ? true : filter === 'unlocked' ? b.unlocked : !b.unlocked
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                    <Star size={28} className="text-yellow-500" /> Achievements
                </h1>
                <p className="text-muted-foreground mt-1">Track your progress, earn badges, and level up</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Badges Earned" value={`${unlockedCount}/${BADGES.length}`} icon={<Award size={16} className="text-yellow-500" />} variant="gold" />
                <StatCard label="Current Level" value={`Lv.${currentLevel}`} icon={<Trophy size={16} className="text-primary" />} variant="primary" />
                <StatCard label="Current Streak" value={`${streak} days`} icon={<Flame size={16} className="text-orange-500" />} variant="accent" />
                <StatCard label="Total XP" value={currentXP.toLocaleString()} icon={<Zap size={16} className="text-primary" />} />
            </div>

            {/* Level Progress */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="rounded-2xl border border-border bg-card p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Level Progression</h2>
                        <p className="text-sm text-muted-foreground">Current: <span className={`font-bold ${LEVELS[currentLevel - 1]?.color}`}>{LEVELS[currentLevel - 1]?.name}</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-foreground">Level {currentLevel}</p>
                        <p className="text-xs text-muted-foreground">{currentXP} / {nextLevelXP} XP</p>
                    </div>
                </div>
                <div className="xp-bar-track h-3 mb-4">
                    <motion.div className="xp-bar h-3"
                        initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                </div>
                <div className="flex justify-between overflow-x-auto scrollbar-none gap-1">
                    {LEVELS.map(l => (
                        <div key={l.level} className={`flex flex-col items-center text-center min-w-[60px] ${l.level <= currentLevel ? '' : 'opacity-30'}`}>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black mb-1 ${l.level < currentLevel ? 'bg-primary border-primary text-primary-foreground' : l.level === currentLevel ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>
                                {l.level < currentLevel ? '✓' : l.level}
                            </div>
                            <p className={`text-[10px] font-semibold ${l.color}`}>{l.name}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Streak Calendar */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                className="rounded-2xl border border-border bg-card p-6"
            >
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Flame size={18} className="animate-streak" /> {streak}-Day Streak
                </h2>
                <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                        <p key={d} className="text-[10px] text-muted-foreground text-center font-semibold">{d}</p>
                    ))}
                    {STREAK_DAYS.map((d) => (
                        <div key={d.day}
                            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${d.active ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground'}`}
                        >
                            {d.active ? '🔥' : ''}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-orange-500" /><span>Solved</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-muted border border-border" /><span>Missed</span></div>
                </div>
            </motion.div>

            {/* Badges */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><Award size={18} className="text-yellow-500" /> Badge Collection</h2>
                    <div className="flex gap-2">
                        {(['all', 'unlocked', 'locked'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map((b, i) => (
                        <motion.div key={b.id}
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                            whileHover={b.unlocked ? { scale: 1.03, y: -2 } : {}}
                            className={`rounded-2xl border p-5 flex flex-col items-center text-center gap-2 transition-all ${RARITY_COLORS[b.rarity]} ${!b.unlocked ? 'badge-locked' : ''}`}
                        >
                            <div className="text-5xl">{b.icon}</div>
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${RARITY_LABEL[b.rarity]}`}>{b.rarity}</p>
                            <p className="text-sm font-bold text-foreground leading-tight">{b.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                            <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                <Zap size={11} /> +{b.xp} XP
                            </div>
                            {b.unlocked
                                ? <p className="text-[10px] text-emerald-500 font-semibold">✓ Earned {b.unlockedAt}</p>
                                : <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1"><Lock size={10} /> Locked</p>
                            }
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Achievements;
