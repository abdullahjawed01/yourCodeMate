import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, friendsApi } from '@/services/api';
import toast from 'react-hot-toast';
import {
    MapPin, Github, Linkedin, Globe2, Flame, Trophy, Zap, Target,
    CheckCircle2, Code2, Users, Star, TrendingUp, Award, Calendar,
    ExternalLink, UserPlus, MessageSquare, Share2, Edit2, X, Loader2
} from 'lucide-react';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';

// ─── Mock Data ────────────────────────────────────────────────────
const MOCK_HEATMAP = Array.from({ length: 52 * 7 }, (_, i) => ({
    day: i,
    count: Math.random() < 0.6 ? Math.floor(Math.random() * 5) : 0,
}));

const MOCK_SOLVED = [
    { id: '1', title: 'Two Sum', difficulty: 'easy', category: 'Arrays', lang: 'Python', solvedAt: '2026-03-08', runtime: '52ms', memory: '14.2MB' },
    { id: '2', title: 'Valid Parentheses', difficulty: 'easy', category: 'Stack', lang: 'JavaScript', solvedAt: '2026-03-07', runtime: '48ms', memory: '12.1MB' },
    { id: '3', title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', category: 'Sliding Window', lang: 'Python', solvedAt: '2026-03-06', runtime: '72ms', memory: '16.8MB' },
    { id: '4', title: 'Maximum Subarray', difficulty: 'medium', category: 'Dynamic Programming', lang: 'C++', solvedAt: '2026-03-05', runtime: '28ms', memory: '10.5MB' },
    { id: '5', title: 'Merge k Sorted Lists', difficulty: 'hard', category: 'Linked List', lang: 'Java', solvedAt: '2026-03-04', runtime: '92ms', memory: '44.2MB' },
];

const MOCK_SUBMISSIONS = [
    { id: 's1', title: 'Two Sum', status: 'Accepted', lang: 'Python', time: '52ms', mem: '14.2MB', date: '2026-03-08 14:32' },
    { id: 's2', title: 'Two Sum', status: 'Wrong Answer', lang: 'Python', time: '-', mem: '-', date: '2026-03-08 14:28' },
    { id: 's3', title: 'Valid Parentheses', status: 'Accepted', lang: 'JavaScript', time: '48ms', mem: '12.1MB', date: '2026-03-07 11:15' },
    { id: 's4', title: 'Longest Substring', status: 'Time Limit Exceeded', lang: 'Python', time: '>2000ms', mem: '-', date: '2026-03-06 09:44' },
    { id: 's5', title: 'Longest Substring', status: 'Accepted', lang: 'Python', time: '72ms', mem: '16.8MB', date: '2026-03-06 10:01' },
];

const MOCK_BADGES: Array<{ id: string; title: string; desc: string; icon: string; rarity: 'common' | 'rare' | 'epic' | 'legendary'; unlocked: boolean; xp: number }> = [
    { id: 'b1', title: 'First Blood', desc: 'Solve your first problem', icon: '🎯', rarity: 'common', unlocked: true, xp: 50 },
    { id: 'b2', title: 'Streak Master', desc: 'Maintain a 7-day streak', icon: '🔥', rarity: 'rare', unlocked: true, xp: 150 },
    { id: 'b3', title: 'Algorithm Master', desc: 'Solve 50 algorithm problems', icon: '🧠', rarity: 'epic', unlocked: true, xp: 400 },
    { id: 'b4', title: 'Speed Solver', desc: 'Solve 10 problems in 24h', icon: '⚡', rarity: 'rare', unlocked: false, xp: 200 },
    { id: 'b5', title: 'Bug Hunter', desc: 'Find the bug in 5 debug challenges', icon: '🐛', rarity: 'common', unlocked: true, xp: 75 },
    { id: 'b6', title: 'DSA Legend', desc: 'Solve 200 DSA problems', icon: '👑', rarity: 'legendary', unlocked: false, xp: 1000 },
    { id: 'b7', title: 'Contest Finalist', desc: 'Reach top 100 in a contest', icon: '🏆', rarity: 'epic', unlocked: false, xp: 500 },
    { id: 'b8', title: 'Code Reviewer', desc: 'Give 10 peer code reviews', icon: '🔎', rarity: 'common', unlocked: true, xp: 80 },
];


const MOCK_CONTESTS = [
    { id: 'c1', title: 'Weekly Contest 382', rank: 142, solved: 3, outOf: 4, rating: '+25', date: '2026-03-02' },
    { id: 'c2', title: 'CodeForces Round 920', rank: 891, solved: 2, outOf: 6, rating: '-12', date: '2026-02-25' },
    { id: 'c3', title: 'CodeMate Hackathon I', rank: 34, solved: 5, outOf: 5, rating: '+68', date: '2026-02-18' },
];

const LANG_COLORS: Record<string, string> = {
    Python: 'bg-blue-500', JavaScript: 'bg-yellow-500', 'C++': 'bg-purple-500',
    Java: 'bg-orange-500', TypeScript: 'bg-cyan-500', Rust: 'bg-red-500',
};
const RARITY_COLORS: Record<string, string> = {
    common: 'border-gray-400/40 bg-gray-400/5',
    rare: 'border-blue-400/40 bg-blue-400/5',
    epic: 'border-purple-400/40 bg-purple-400/5',
    legendary: 'border-yellow-400/40 bg-yellow-400/5',
};
const RARITY_TEXT: Record<string, string> = {
    common: 'text-gray-400', rare: 'text-blue-400', epic: 'text-purple-400', legendary: 'text-yellow-400',
};

// ─── Sub Components ────────────────────────────────────────────────
const ContributionHeatmap: React.FC = () => {
    const weeks = useMemo(() => {
        const result: Array<typeof MOCK_HEATMAP> = [];
        for (let w = 0; w < 52; w++) result.push(MOCK_HEATMAP.slice(w * 7, w * 7 + 7));
        return result;
    }, []);
    return (
        <div>
            <div className="flex gap-[3px] overflow-x-auto scrollbar-none pb-2">
                {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                        {week.map((cell, di) => (
                            <div key={di} className={`heatmap-cell heatmap-${Math.min(4, cell.count)}`} title={`${cell.count} submissions`} />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map(l => <div key={l} className={`heatmap-cell heatmap-${l} !w-2.5 !h-2.5`} />)}
                <span>More</span>
            </div>
        </div>
    );
};

const DifficultyDonut: React.FC<{ easy: number; medium: number; hard: number }> = ({ easy, medium, hard }) => {
    const total = easy + medium + hard;
    const easyPct = (easy / total) * 100;
    const medPct = (medium / total) * 100;
    const r = 40; const circ = 2 * Math.PI * r;
    let offset = 0;
    const segments = [
        { pct: easyPct, color: '#10b981', label: 'Easy', count: easy },
        { pct: medPct, color: '#f59e0b', label: 'Medium', count: medium },
        { pct: (hard / total) * 100, color: '#ef4444', label: 'Hard', count: hard },
    ];
    const rendered = segments.map((seg) => {
        const len = (seg.pct / 100) * circ;
        const el = (
            <circle key={seg.label} cx="50" cy="50" r={r} fill="none" stroke={seg.color} strokeWidth="10"
                strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-offset} style={{ transition: 'all 1s ease' }}
            />
        );
        offset += len;
        return el;
    });
    return (
        <div className="flex items-center gap-6">
            <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                {rendered}
            </svg>
            <div className="space-y-2">
                {segments.map(s => (
                    <div key={s.label} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className="font-bold text-foreground">{s.count}</span>
                    </div>
                ))}
                <div className="text-xs text-muted-foreground font-semibold pt-1 border-t border-border">
                    Total: {total} solved
                </div>
            </div>
        </div>
    );
};

const EditProfileModal = ({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: any }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        avatar: user?.avatar || '',
        bio: user?.bio || '',
        country: user?.country || '',
        github: user?.github || '',
        linkedin: user?.linkedin || ''
    });

    const mutation = useMutation({
        mutationFn: userApi.updateProfile,
        onSuccess: () => {
            toast.success('Profile updated successfully');
            queryClient.invalidateQueries({ queryKey: ['me'] });
            // In a real app we'd trigger an auth context refetch here, window.location.reload() works as a simple fallback
            window.location.reload();
        },
        onError: () => toast.error('Failed to update profile')
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-card border border-border rounded-3xl shadow-xl overflow-hidden"
            >
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <h2 className="text-xl font-bold">Edit Profile</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors"><X size={18} /></button>
                </div>
                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Name</label>
                            <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" placeholder="Your Name" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Avatar URL</label>
                            <input value={formData.avatar} onChange={e => setFormData({ ...formData, avatar: e.target.value })} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" placeholder="https://image-url.com/..." />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Bio / Headline</label>
                        <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none" rows={3} placeholder="Tell us about yourself..." />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Country</label>
                        <input value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" placeholder="e.g. United States" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">GitHub URL</label>
                            <input value={formData.github} onChange={e => setFormData({ ...formData, github: e.target.value })} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" placeholder="https://github.com/..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">LinkedIn URL</label>
                            <input value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" placeholder="https://linkedin.com/..." />
                        </div>
                    </div>
                </div>
                <div className="p-5 border-t border-border flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2 rounded-xl text-sm font-semibold hover:bg-muted transition-colors">Cancel</button>
                    <button onClick={() => mutation.mutate(formData as any)} disabled={mutation.isPending} className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 flex items-center gap-2 transition-colors">
                        {mutation.isPending && <Loader2 size={16} className="animate-spin" />} Save Changes
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// ─── Main Profile page ──────────────────────────────────────────────
const Profile: React.FC = () => {
    const { user: authUser } = useAuth();
    const { userId } = useParams<{ userId?: string }>();
    const navigate = useNavigate();
    const isOwnProfile = !userId || userId === authUser?._id;
    const [isEditing, setIsEditing] = useState(false);

    const { data: profileUser, isLoading } = useQuery({
        queryKey: ['profile', userId],
        queryFn: () => userApi.getUserProfile(userId!),
        enabled: !isOwnProfile && !!userId
    });

    const { data: socialData } = useQuery({
        queryKey: ['friends', authUser?._id],
        queryFn: friendsApi.getFriends,
        enabled: !!authUser
    });

    const displayUser = isOwnProfile ? authUser : profileUser;
    const queryClient = useQueryClient();

    const friendsList = (socialData as any)?.friends || [];
    const sentRequests = (socialData as any)?.friendRequestsSent || []; // Will need to update backend to send this or calculate it

    const isFriend = !isOwnProfile && friendsList.some((f: any) => f._id === userId);
    const iSentRequest = !isOwnProfile && sentRequests?.some((r: any) => r._id === userId); // sent to them

    const sendRequestMutation = useMutation({
        mutationFn: friendsApi.sendRequest,
        onSuccess: () => {
            toast.success('Friend request sent!');
            queryClient.invalidateQueries({ queryKey: ['friends'] });
        },
        onError: () => toast.error('Failed to send request')
    });

    if (isLoading && !isOwnProfile) {
        return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
    }

    if (!displayUser) {
        return <div className="text-center py-20 text-muted-foreground">User not found.</div>;
    }

    const name = displayUser.name || 'DevUser';
    const level = displayUser.level ?? 4;
    const streak = displayUser.streak ?? 7;
    const points = displayUser.points ?? 1280;
    const rank = displayUser.rank ?? 247;
    // rank may be a numeric leaderboard position or a named tier (e.g. "Gold").
    const rankIsNumeric = typeof rank === 'number' || /^\d+$/.test(String(rank));
    const rankLabel = rankIsNumeric ? `#${rank}` : String(rank);
    const accuracy = displayUser.accuracy ?? 78;
    const langStats: Record<string, number> = displayUser.languageStats ?? { Python: 18, JavaScript: 12, 'C++': 6, Java: 5, TypeScript: 3 };
    const totalLang = Object.values(langStats).reduce((a, b) => a + b, 0) || 1;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            {/* Profile Hero */}
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative rounded-3xl glass-card-premium overflow-hidden group shadow-cyber-strong"
            >
                {/* Cover */}
                <div className="h-40 bg-gradient-to-r from-primary/40 via-purple-500/30 to-accent-neon/20 relative transition-all duration-500 group-hover:from-primary/50 group-hover:via-purple-500/40 group-hover:to-accent-neon/30">
                    <div className="absolute inset-0 bg-grid-pattern opacity-30 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-4">
                        <Avatar name={name} src={displayUser?.avatar} size="xl" rank={rank} className="ring-4 ring-background" />
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h1 className="text-2xl font-black text-foreground">{name}</h1>
                                <Badge variant="info" className="text-xs">Level {level}</Badge>
                                {streak > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                                        <Flame size={11} className="animate-streak" />
                                        <span className="text-xs font-bold text-orange-500">{streak} day streak</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{displayUser?.bio || 'Competitive programmer & DSA enthusiast. Building skills one problem at a time.'}</p>
                            <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                                {displayUser?.country && <span className="flex items-center gap-1"><MapPin size={11} />{displayUser.country}</span>}
                                <span className="flex items-center gap-1"><Globe2 size={11} />joined {(displayUser as any)?.createdAt ? new Date((displayUser as any).createdAt).getFullYear() : '2025'}</span>
                                {displayUser?.github && <a href={displayUser.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors"><Github size={11} />GitHub</a>}
                                {displayUser?.linkedin && <a href={displayUser.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors"><Linkedin size={11} />LinkedIn</a>}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                            {isOwnProfile ? (
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                                    <Edit2 size={14} /> Edit Profile
                                </button>
                            ) : (
                                <>
                                    {!isFriend ? (
                                        <button
                                            onClick={() => sendRequestMutation.mutate(userId!)}
                                            disabled={sendRequestMutation.isPending || iSentRequest}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                                        >
                                            <UserPlus size={14} /> {iSentRequest ? 'Request Sent' : 'Add Friend'}
                                        </button>
                                    ) : (
                                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-sm font-semibold">
                                            <CheckCircle2 size={14} /> Friends
                                        </button>
                                    )}
                                    <button
                                        onClick={() => navigate('/chat', { state: { friendId: userId, name: displayUser.name } })}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-muted transition-colors"
                                    >
                                        <MessageSquare size={14} /> Message
                                    </button>
                                </>
                            )}
                            <button onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success('Profile link copied!');
                            }} className="flex items-center gap-1.5 p-2 px-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm font-semibold text-muted-foreground">
                                <Share2 size={15} /> <span className="hidden sm:inline">Share</span>
                            </button>
                        </div>
                    </div>
                    {/* Stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatCard label="Global Rank" value={rankLabel} variant="gold" icon={<Trophy size={15} className="text-yellow-500" />} animated={false} />
                        <StatCard label="Problems Solved" value={MOCK_SOLVED.length} variant="accent" icon={<CheckCircle2 size={15} className="text-emerald-500" />} animated={false} />
                        <StatCard label="Accuracy" value={`${accuracy}%`} icon={<Target size={15} className="text-purple-500" />} animated={false} />
                        <StatCard label="Total XP" value={points.toLocaleString()} variant="primary" icon={<Zap size={15} className="text-primary" />} animated={false} />
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultTab="overview">
                <TabList className="glass-card border-none rounded-2xl p-1 gap-1 shadow-inner backdrop-blur-md">
                    <Tab id="overview" icon={<TrendingUp size={14} />}>Overview</Tab>
                    <Tab id="solved" icon={<CheckCircle2 size={14} />}>Solved</Tab>
                    <Tab id="submissions" icon={<Code2 size={14} />}>Submissions</Tab>
                    <Tab id="achievements" icon={<Star size={14} />}>Achievements</Tab>
                    <Tab id="friends" icon={<Users size={14} />}>Friends</Tab>
                    <Tab id="contests" icon={<Trophy size={14} />}>Contests</Tab>
                </TabList>

                {/* Overview Tab */}
                <TabPanel id="overview">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Heatmap */}
                        <div className="lg:col-span-2 rounded-3xl glass-card-premium p-6 shadow-cyber hover:shadow-cyber-strong transition-all duration-300">
                            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                <Calendar size={18} className="text-primary" /> Contribution Activity
                            </h3>
                            <ContributionHeatmap />
                        </div>
                        {/* Difficulty Donut */}
                        <div className="rounded-3xl glass-card-premium p-6 shadow-cyber flex flex-col items-center justify-center">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 w-full">
                                <Target size={18} className="text-purple-400" /> Topic Split
                            </h3>
                            <DifficultyDonut easy={18} medium={15} hard={8} />
                        </div>
                        {/* Language Stats */}
                        <div className="lg:col-span-2 rounded-3xl glass-card-premium p-6 shadow-cyber hover:shadow-cyber-strong transition-all duration-300">
                            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                <Code2 size={18} className="text-primary" /> Language Mastery
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(langStats).map(([lang, count]) => (
                                    <div key={lang} className="flex items-center gap-3">
                                        <span className="text-sm text-foreground w-24 font-medium shrink-0">{lang}</span>
                                        <div className="flex-1 xp-bar-track h-2">
                                            <motion.div
                                                className={`h-2 rounded-full ${LANG_COLORS[lang] || 'bg-primary'}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(count / totalLang) * 100}%` }}
                                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-foreground w-6 text-right">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Rank Card */}
                        <div className="rounded-3xl border border-yellow-500/30 bg-yellow-500/10 glass-card-premium p-6 flex flex-col gap-4 justify-between shadow-cyber glow-gold relative overflow-hidden group hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] transition-all">
                            <div className="absolute right-0 bottom-0 w-32 h-32 bg-yellow-500/20 blur-3xl group-hover:bg-yellow-500/30 transition-colors pointer-events-none" />
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 relative z-10">
                                <Trophy size={18} className="text-yellow-500" /> Competitive Rank
                            </h3>
                            <div className="relative z-10 mt-2">
                                <p className="text-6xl font-black gradient-text-gold tracking-tighter drop-shadow-md">{rankLabel}</p>
                                <p className="text-xs text-yellow-500/70 mt-1 uppercase tracking-widest font-bold">Global Leaderboard</p>
                            </div>
                            <div className="space-y-2.5 text-sm mt-4 relative z-10 bg-black/40 p-3 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center"><span className="text-white/60 text-xs uppercase font-bold">Contest Rating</span><span className="font-black text-white">{displayUser?.contestRating ?? 1482}</span></div>
                                <div className="flex justify-between items-center"><span className="text-white/60 text-xs uppercase font-bold">Best Rank</span><span className="font-black text-yellow-400">#34</span></div>
                                <div className="flex justify-between items-center"><span className="text-white/60 text-xs uppercase font-bold">Contests</span><span className="font-black text-white">{MOCK_CONTESTS.length}</span></div>
                            </div>
                        </div>
                    </div>
                </TabPanel>

                {/* Solved Problems Tab */}
                <TabPanel id="solved">
                    <div className="rounded-3xl glass-surface shadow-xl overflow-hidden border border-white/10">
                        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
                            <span className="text-sm font-bold text-white flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> {MOCK_SOLVED.length} Problems Solved</span>
                            <div className="flex gap-2">
                                {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
                                    <button key={d} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${d === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                                        {d.charAt(0).toUpperCase() + d.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="divide-y divide-white/5">
                            {MOCK_SOLVED.map(p => (
                                <div key={p.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors group cursor-pointer border-l-2 border-l-transparent hover:border-l-primary">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{p.title}</p>
                                            <p className="text-xs text-muted-foreground">{p.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className={`diff-${p.difficulty} px-2 py-0.5 rounded-md font-semibold`}>{p.difficulty}</span>
                                        <span className="hidden sm:block font-mono">{p.lang}</span>
                                        <span className="hidden md:block">{p.runtime}</span>
                                        <span className="hidden md:block">{p.memory}</span>
                                        <span>{p.solvedAt}</span>
                                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabPanel>

                {/* Submissions Tab */}
                <TabPanel id="submissions">
                    <div className="rounded-3xl glass-surface shadow-xl overflow-hidden border border-white/10">
                        <div className="p-5 border-b border-white/5 bg-black/20">
                            <span className="text-sm font-bold text-white flex items-center gap-2"><Code2 size={16} className="text-primary" /> {MOCK_SUBMISSIONS.length} Recent Submissions</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {MOCK_SUBMISSIONS.map(s => {
                                const statusColor =
                                    s.status === 'Accepted' ? 'text-emerald-400' :
                                        s.status === 'Wrong Answer' ? 'text-red-400' : 'text-amber-400';
                                return (
                                    <div key={s.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors border-l-2 border-l-transparent hover:border-l-primary cursor-pointer">
                                        <div>
                                            <p className="text-sm font-bold text-white">{s.title}</p>
                                            <p className={`text-xs font-semibold ${statusColor}`}>{s.status}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="font-mono">{s.lang}</span>
                                            <span>{s.time}</span>
                                            <span>{s.mem}</span>
                                            <span>{s.date}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </TabPanel>

                {/* Achievements Tab */}
                <TabPanel id="achievements">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {MOCK_BADGES.map(b => (
                            <motion.div key={b.id} whileHover={b.unlocked ? { scale: 1.05, y: -5 } : {}}
                                className={`rounded-3xl border glass-card p-5 flex flex-col items-center gap-2 text-center transition-all ${RARITY_COLORS[b.rarity]} ${!b.unlocked && 'opacity-50 grayscale'}`}
                            >
                                <div className="text-4xl">{b.icon}</div>
                                <p className={`text-xs font-bold uppercase tracking-wide ${RARITY_TEXT[b.rarity]}`}>{b.rarity}</p>
                                <p className="text-sm font-bold text-foreground">{b.title}</p>
                                <p className="text-xs text-muted-foreground">{b.desc}</p>
                                <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                    <Zap size={11} /> +{b.xp} XP
                                </div>
                                {b.unlocked && <Award size={14} className="text-yellow-500 drop-shadow-md" />}
                                {!b.unlocked && <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">🔒 Locked</span>}
                            </motion.div>
                        ))}
                    </div>
                </TabPanel>

                {/* Friends Tab */}
                <TabPanel id="friends">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {friendsList.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-muted-foreground">
                                No friends added yet.
                            </div>
                        ) : (
                            friendsList.map((f: any) => (
                                <div key={f._id} className="rounded-3xl glass-card border border-white/5 p-5 hover:border-primary/40 hover:shadow-cyber transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="relative">
                                            <Avatar name={f.name} size="md" />
                                            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${f.online ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-base">{f.name}</p>
                                            <p className="text-xs text-white/50 font-medium">Level {f.level} · {f.points} XP</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-white/70 bg-white/5 px-2 py-1 rounded-lg border border-white/10"><Flame size={14} className="text-orange-500" />{f.streak || 0} streak</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate('/chat', { state: { friendId: f._id, name: f.name } })}
                                                className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 font-semibold hover:bg-primary/20 transition-colors shadow-sm"
                                            >
                                                <MessageSquare size={13} />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/profile/${f._id}`)}
                                                className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors shadow-sm text-xs"
                                            >
                                                Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </TabPanel>

                {/* Contests Tab */}
                <TabPanel id="contests">
                    <div className="rounded-3xl glass-surface shadow-xl overflow-hidden border border-white/10">
                        <div className="p-5 border-b border-white/5 bg-black/20">
                            <span className="text-sm font-bold text-white flex items-center gap-2"><Trophy size={16} className="text-yellow-500" /> Contest History</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {MOCK_CONTESTS.map(c => (
                                <div key={c.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors border-l-2 border-l-transparent hover:border-l-primary cursor-pointer group">
                                    <div>
                                        <p className="font-bold text-white group-hover:text-primary transition-colors">{c.title}</p>
                                        <p className="text-xs text-white/50 mt-1 font-medium">{c.date} · Solved {c.solved}/{c.outOf}</p>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-right">
                                            <p className="font-black text-white text-lg">#{c.rank}</p>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-0.5">Rank</p>
                                        </div>
                                        <div className="text-right w-16">
                                            <p className={`font-black text-lg drop-shadow-md ${c.rating.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{c.rating}</p>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-0.5">Rating</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabPanel>
            </Tabs>
            <AnimatePresence>
                {isEditing && (
                    <EditProfileModal isOpen={isEditing} onClose={() => setIsEditing(false)} user={authUser} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
