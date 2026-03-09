import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trophy, Calendar, Users, Clock, ChevronRight, Zap, Star, Globe2, Play, RefreshCw, X, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { contestApi } from '@/services/api';
import toast from 'react-hot-toast';

// Dummy data for leaderboard and past contests
const LIVE_LEADERBOARD = [
    { rank: 1, name: 'Fatima Noor', solved: 4, time: '24:11', score: 2800 },
    { rank: 2, name: 'Rahul Sharma', solved: 4, time: '31:45', score: 2650 },
    { rank: 3, name: 'Liu Wei', solved: 3, time: '18:02', score: 2100 },
    { rank: 4, name: 'Sara Ahmed', solved: 3, time: '22:30', score: 2020 },
    { rank: 142, name: 'You', solved: 2, time: '41:08', score: 1200 },
];

const PAST_CONTESTS = [
    { id: 'p1', title: 'Weekly Contest 382', myRank: 142, participants: 14200, solvedOf: '3/4', rating: '+25', date: '2026-03-02' },
    { id: 'p2', title: 'CodeMate Hackathon I', myRank: 34, participants: 960, solvedOf: '5/5', rating: '+68', date: '2026-02-18' },
    { id: 'p3', title: 'Daily Warmup #40', myRank: 9, participants: 310, solvedOf: '3/3', rating: '+42', date: '2026-02-10' },
];

const TYPE_STYLE: Record<string, string> = {
    regular: 'bg-primary/10 text-primary border-primary/20',
    hackathon: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    daily: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
};
const TYPE_LABEL: Record<string, string> = {
    regular: 'Weekly Contest',
    hackathon: '⚡ Hackathon',
    daily: '☀️ Daily',
};

function formatTime(secs: number) {
    if (secs < 0) return '0m 00s';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
}

const Contests: React.FC = () => {
    const queryClient = useQueryClient();
    const [now, setNow] = useState(Date.now());
    const [selectedContest, setSelectedContest] = useState<any>(null);

    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    const { data: contests = [], isLoading } = useQuery({
        queryKey: ['contests'],
        queryFn: contestApi.getContests,
    });

    const joinMutation = useMutation({
        mutationFn: contestApi.joinContest,
        onSuccess: () => {
            toast.success('Successfully registered for the contest!');
            queryClient.invalidateQueries({ queryKey: ['contests'] });
            setSelectedContest(null);
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to join contest');
        }
    });

    const activeContests = useMemo(() => {
        return contests.filter((c: any) => new Date(c.startTime).getTime() <= now && new Date(c.endTime).getTime() > now);
    }, [contests, now]);

    const upcomingContests = useMemo(() => {
        return contests.filter((c: any) => new Date(c.startTime).getTime() > now);
    }, [contests, now]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                    <Globe2 size={28} className="text-primary" /> Contests & Hackathons
                </h1>
                <p className="text-muted-foreground mt-1">Compete live, improve your rating, win prizes</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Contests Joined" value="8" icon={<Trophy size={16} className="text-yellow-500" />} variant="gold" />
                <StatCard label="Best Rank" value="#9" icon={<Star size={16} className="text-primary" />} variant="primary" />
                <StatCard label="Rating" value="1482" icon={<Zap size={16} className="text-purple-500" />} />
                <StatCard label="Participated" value="3" sublabel="This month" />
            </div>

            <Tabs defaultTab="active">
                <TabList>
                    <Tab id="active" icon={<Play size={14} />} badge={activeContests.length}>Live Now</Tab>
                    <Tab id="upcoming" icon={<Calendar size={14} />} badge={upcomingContests.length}>Upcoming</Tab>
                    <Tab id="past" icon={<Clock size={14} />}>Past</Tab>
                </TabList>

                {/* LIVE */}
                <TabPanel id="active">
                    {activeContests.map((c: any) => {
                        const endsIn = Math.floor((new Date(c.endTime).getTime() - now) / 1000);
                        return (
                            <motion.div key={c._id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                                className="rounded-2xl border border-primary/40 bg-primary/5 neon-border p-6 mb-6"
                            >
                                <div className="flex flex-col lg:flex-row gap-6 justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE
                                            </span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${TYPE_STYLE['regular']}`}>{TYPE_LABEL['regular']}</span>
                                        </div>
                                        <h2 className="text-2xl font-black text-foreground">{c.title}</h2>
                                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Users size={13} />{(c.participants?.length || 0).toLocaleString()} participants</span>
                                            <span className="flex items-center gap-1"><Trophy size={13} />{c.problems?.length || 0} problems</span>
                                            <span className="flex items-center gap-1"><Star size={13} />Hard</span>
                                        </div>
                                    </div>
                                    <div className="text-center lg:text-right">
                                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Time Remaining</p>
                                        <p className={`text-4xl font-black font-mono ${endsIn < 600 ? 'timer-critical' : 'text-primary'}`}>
                                            {formatTime(endsIn)}
                                        </p>
                                        <button
                                            onClick={() => setSelectedContest(c)}
                                            className="mt-3 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors mx-auto lg:ml-auto lg:mr-0">
                                            <Play size={15} /> Enter Contest
                                        </button>
                                    </div>
                                </div>
                                {/* Live Leaderboard */}
                                <div className="mt-6 rounded-xl border border-border overflow-hidden">
                                    <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center justify-between">
                                        <span className="text-xs font-bold text-foreground">Live Leaderboard</span>
                                        <span className="text-xs text-muted-foreground">Top 5 shown</span>
                                    </div>
                                    <div className="divide-y divide-border">
                                        {LIVE_LEADERBOARD.map((e, i) => (
                                            <div key={i} className={`flex items-center justify-between px-4 py-2.5 text-sm ${e.name === 'You' ? 'bg-primary/5 ring-1 ring-inset ring-primary/20' : 'hover:bg-muted/30 transition-colors'}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-7 text-center font-black ${e.rank === 1 ? 'text-yellow-500' : e.rank === 2 ? 'text-gray-400' : e.rank === 3 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                                                        {e.rank <= 3 ? ['🥇', '🥈', '🥉'][e.rank - 1] : `#${e.rank}`}
                                                    </span>
                                                    <Avatar name={e.name} size="xs" />
                                                    <span className={`font-semibold ${e.name === 'You' ? 'text-primary' : 'text-foreground'}`}>{e.name}</span>
                                                </div>
                                                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                                    <span>{e.solved} solved</span>
                                                    <span>{e.time}</span>
                                                    <span className="font-bold text-foreground">{e.score}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </TabPanel>

                {/* UPCOMING */}
                <TabPanel id="upcoming">
                    <div className="space-y-4">
                        {upcomingContests.map((c: any, i: number) => {
                            const startsIn = Math.floor((new Date(c.startTime).getTime() - now) / 1000);
                            return (
                                <motion.div key={c._id}
                                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                    className="rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${TYPE_STYLE['regular']}`}>{TYPE_LABEL['regular']}</span>
                                            </div>
                                            <h3 className="font-bold text-foreground">{c.title}</h3>
                                            <div className="flex gap-4 mt-1.5 text-xs text-muted-foreground">
                                                <span><Users size={11} className="inline mr-1" />{(c.participants?.length || 0).toLocaleString()} registered</span>
                                                <span><Trophy size={11} className="inline mr-1" />{c.problems?.length || 0} problems</span>
                                                <span><Star size={11} className="inline mr-1" />Hard</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Starts in</p>
                                                <p className="font-bold text-foreground font-mono">{formatTime(startsIn)}</p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedContest(c)}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary text-primary font-semibold text-sm hover:bg-primary/10 transition-colors">
                                                Register <ChevronRight size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </TabPanel>

                {/* PAST */}
                <TabPanel id="past">
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="px-4 py-3 border-b border-border bg-muted/30">
                            <span className="text-sm font-bold text-foreground">My Contest History</span>
                        </div>
                        <div className="divide-y divide-border">
                            {PAST_CONTESTS.map((c: any, i: number) => (
                                <motion.div key={c.id}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                    className="flex items-center justify-between px-4 py-4 hover:bg-muted/30 transition-colors"
                                >
                                    <div>
                                        <p className="font-semibold text-foreground">{c.title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{c.date} · {c.solvedOf} problems solved</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-lg font-black text-foreground">#{c.myRank}</p>
                                            <p className="text-xs text-muted-foreground">/{c.participants.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right min-w-[60px]">
                                            <p className={`font-bold text-sm ${c.rating.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{c.rating}</p>
                                            <p className="text-xs text-muted-foreground">rating</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </TabPanel>
            </Tabs>

            <AnimatePresence>
                {selectedContest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
                        >
                            <button onClick={() => setSelectedContest(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-full bg-primary/10 text-primary">
                                    <Trophy size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-foreground">{selectedContest.title}</h2>
                            </div>

                            <div className="space-y-4 mb-6 text-sm text-foreground">
                                <div className="flex justify-between py-2 border-b border-border/50">
                                    <span className="text-muted-foreground font-semibold">Start Time</span>
                                    <span className="font-bold">{new Date(selectedContest.startTime).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border/50">
                                    <span className="text-muted-foreground font-semibold">End Time</span>
                                    <span className="font-bold">{new Date(selectedContest.endTime).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border/50">
                                    <span className="text-muted-foreground font-semibold">Problems</span>
                                    <span className="font-bold">{selectedContest.problems?.length || 0}</span>
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-4">
                                    <h4 className="flex items-center gap-2 font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                                        <AlertTriangle size={16} /> Contest Rules
                                    </h4>
                                    <ul className="list-disc pl-5 space-y-1 text-xs text-yellow-800 dark:text-yellow-300">
                                        <li>Plagiarism or sharing solutions will result in an immediate ban.</li>
                                        <li>Your code will be run against hidden test cases.</li>
                                        <li>Rank is determined by score and time of completion.</li>
                                        <li>Good luck and have fun!</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setSelectedContest(null)} className="flex-1 py-2.5 rounded-xl border border-border font-bold text-muted-foreground hover:bg-muted transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => joinMutation.mutate(selectedContest._id)}
                                    disabled={joinMutation.isPending}
                                    className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 flex justify-center items-center gap-2 transition-colors disabled:opacity-60"
                                >
                                    {joinMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirm & Enter'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Contests;
