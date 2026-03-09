import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { testApi, aiApi } from '@/services/api';
import toast from 'react-hot-toast';
import {
    Swords, Zap, Timer, Target, Users, Play, Code2,
    CheckCircle2, Clock, TrendingUp, Share2
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

type BattleMode = 'speed' | 'accuracy' | 'timed';
type BattleStatus = 'lobby' | 'active' | 'finished';

const SAMPLE_PROBLEM = {
    title: 'Two Sum',
    difficulty: 'easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    testCases: [
        { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]' },
        { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]' },
    ],
};

const MODES: Array<{ id: BattleMode; label: string; icon: React.ReactNode; desc: string; colorClass: string }> = [
    { id: 'speed', label: 'Speed Mode', icon: <Zap size={24} />, desc: 'First correct solution wins. Code fast!', colorClass: 'battle-speed border' },
    { id: 'accuracy', label: 'Accuracy Mode', icon: <Target size={24} />, desc: 'Most optimized O(n) solution wins.', colorClass: 'battle-accuracy border' },
    { id: 'timed', label: 'Time Contest', icon: <Timer size={24} />, desc: 'Solve 3 problems in 30 minutes.', colorClass: 'battle-timed border' },
];

const MOCK_OPPONENT = { name: 'Sara Ahmed', level: 8, streak: 12, rank: 89 };

const BattleTimer: React.FC<{ seconds: number; critical?: boolean }> = ({ seconds, critical }) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return (
        <span className={`font-mono text-3xl font-black ${critical ? 'timer-critical' : 'text-foreground'}`}>
            {m}:{s}
        </span>
    );
};

const CodingBattle: React.FC = () => {
    const [status, setStatus] = useState<BattleStatus>('lobby');
    const [mode, setMode] = useState<BattleMode | null>(null);
    const [timer, setTimer] = useState(30 * 60);
    const [myProgress, setMyProgress] = useState(0);
    const [opponentProgress, setOpponentProgress] = useState(0);
    const [myCode, setMyCode] = useState('def twoSum(nums, target):\n    # Your solution here\n    pass');
    const [submitted, setSubmitted] = useState(false);
    const [winner, setWinner] = useState<'me' | 'opponent' | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval>>();

    const { data: tests } = useQuery({ queryKey: ['tests'], queryFn: testApi.getUserTests });
    const activeTest = tests && tests.length > 0 ? tests[0] : SAMPLE_PROBLEM;

    const submitMutation = useMutation({
        mutationFn: (data: { testId: string; code: string; language: string }) =>
            aiApi.evaluateCode({ code: data.code, testId: data.testId }),
        onSuccess: (data) => {
            setSubmitted(true);
            setMyProgress(100);
            clearInterval(intervalRef.current);
            const score = data.score || 0;
            const iWin = score >= 80 && opponentProgress < 85;
            setWinner(iWin ? 'me' : 'opponent');
            setTimeout(() => setStatus('finished'), 800);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Submission failed');
        },
    });

    useEffect(() => {
        if (status === 'active') {
            intervalRef.current = setInterval(() => {
                setTimer(t => {
                    if (t <= 0) { clearInterval(intervalRef.current); return 0; }
                    return t - 1;
                });
                // Simulate opponent typing
                setOpponentProgress(p => Math.min(95, p + Math.random() * 2));
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [status]);

    const startBattle = () => {
        if (!mode || !isConfirmed) return;
        setStatus('active');
        setTimer(30 * 60);
        setMyProgress(0);
        setOpponentProgress(0);
        setSubmitted(false);
        setWinner(null);
    };

    const handleSubmit = () => {
        if (myCode.trim() === '' || myCode.includes('pass') || myCode.trim() === 'def twoSum(nums, target):\\n    # Your solution here\\n    pass') {
            toast.error('Code cannot be empty. Please write a valid solution.');
            return;
        }
        if (activeTest && '_id' in activeTest) {
            submitMutation.mutate({ testId: activeTest._id as string, code: myCode, language: 'python' });
        } else {
            toast.error('No database test found to execute against.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                    <Swords size={28} className="text-primary" /> DSA Battle Arena
                </h1>
                <p className="text-muted-foreground mt-1">Challenge developers to real-time competitive coding matches</p>
            </motion.div>

            <AnimatePresence mode="wait">
                {/* ── LOBBY ── */}
                {status === 'lobby' && (
                    <motion.div key="lobby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                        {/* Mode Selection */}
                        <div>
                            <h2 className="text-lg font-bold text-foreground mb-4">Choose Battle Mode</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {MODES.map(m => (
                                    <motion.button
                                        key={m.id}
                                        onClick={() => setMode(m.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-6 rounded-2xl text-left transition-all duration-200 ${m.colorClass} ${mode === m.id ? 'ring-2 ring-primary shadow-lg' : ''}`}
                                    >
                                        <div className="text-primary mb-3">{m.icon}</div>
                                        <h3 className="font-bold text-lg text-foreground mb-1">{m.label}</h3>
                                        <p className="text-sm text-muted-foreground">{m.desc}</p>
                                        {mode === m.id && (
                                            <div className="mt-3 flex items-center gap-1 text-primary text-xs font-bold">
                                                <CheckCircle2 size={13} /> Selected
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Matchmaking */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Quick Match */}
                            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                                <h3 className="font-bold text-foreground flex items-center gap-2"><Users size={16} className="text-primary" /> Quick Match</h3>
                                <p className="text-sm text-muted-foreground">Get matched with a random opponent of similar rank</p>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                                    <Avatar name="Random Player" size="sm" />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">???? Player</p>
                                        <p className="text-xs text-muted-foreground">Similar rank · Searching…</p>
                                    </div>
                                    <div className="ml-auto flex gap-1">
                                        {[0, 1, 2].map(i => (
                                            <div key={i} className="typing-dot w-2 h-2 rounded-full bg-primary" />
                                        ))}
                                    </div>
                                </div>
                                <label className="flex items-start gap-3 mt-4 mb-2 cursor-pointer group">
                                    <div className="relative flex items-center justify-center mt-0.5">
                                        <input type="checkbox" checked={isConfirmed} onChange={e => setIsConfirmed(e.target.checked)} className="peer appearance-none w-5 h-5 border-2 border-primary/50 rounded bg-card checked:bg-primary checked:border-primary transition-all cursor-pointer" />
                                        <CheckCircle2 size={14} className="absolute text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                                    </div>
                                    <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                                        I confirm I am ready to enter the battle. Entering matchmaking may affect my global rating.
                                    </span>
                                </label>
                                <button
                                    disabled={!mode || !isConfirmed}
                                    onClick={startBattle}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Play size={16} /> Find Match
                                </button>
                            </div>

                            {/* Challenge Friend */}
                            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                                <h3 className="font-bold text-foreground flex items-center gap-2"><Share2 size={16} className="text-primary" /> Challenge Friend</h3>
                                <p className="text-sm text-muted-foreground">Invite a specific friend to a battle</p>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                                    <Avatar name={MOCK_OPPONENT.name} size="sm" online />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{MOCK_OPPONENT.name}</p>
                                        <p className="text-xs text-muted-foreground">Level {MOCK_OPPONENT.level} · #{MOCK_OPPONENT.rank}</p>
                                    </div>
                                    <div className="ml-auto online-dot" />
                                </div>
                                <button
                                    disabled={!mode}
                                    onClick={startBattle}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-primary text-primary font-bold hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Swords size={16} /> Challenge
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── ACTIVE BATTLE ── */}
                {status === 'active' && (
                    <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        {/* Battle HUD */}
                        <div className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/5 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <Avatar name="Me" size="sm" />
                                <div>
                                    <p className="text-sm font-bold text-foreground">You</p>
                                    <p className="text-xs text-primary font-semibold">{Math.round(myProgress)}% done</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1 justify-center"><Clock size={11} /> Time Left</p>
                                <BattleTimer seconds={timer} critical={timer < 60} />
                            </div>
                            <div className="flex items-center gap-3 text-right">
                                <div>
                                    <p className="text-sm font-bold text-foreground">{MOCK_OPPONENT.name}</p>
                                    <p className="text-xs text-red-400 font-semibold">{Math.round(opponentProgress)}% done</p>
                                </div>
                                <Avatar name={MOCK_OPPONENT.name} size="sm" online />
                            </div>
                        </div>

                        {/* Progress Bars */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-border bg-card p-3">
                                <p className="text-xs text-muted-foreground mb-2 font-semibold">Your Progress</p>
                                <div className="xp-bar-track h-3">
                                    <motion.div className="xp-bar h-3" animate={{ width: `${myProgress}%` }} transition={{ duration: 0.3 }} />
                                </div>
                            </div>
                            <div className="rounded-xl border border-border bg-card p-3">
                                <p className="text-xs text-muted-foreground mb-2 font-semibold">{MOCK_OPPONENT.name}'s Progress</p>
                                <div className="xp-bar-track h-3">
                                    <motion.div className="h-3 rounded-full bg-red-400" animate={{ width: `${opponentProgress}%` }} transition={{ duration: 0.5 }} />
                                </div>
                            </div>
                        </div>

                        {/* Problem + Editor */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Problem Statement */}
                            <div className="rounded-2xl border border-border bg-card p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="diff-easy px-2 py-0.5 rounded-md text-xs font-semibold">{activeTest.difficulty}</span>
                                    <h3 className="font-bold text-foreground">{activeTest.title}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{activeTest.description}</p>
                                {activeTest.testCases?.map((ex: any, i: number) => (
                                    <div key={i} className="rounded-xl bg-muted/50 p-3 text-xs font-mono mb-2">
                                        <p className="text-muted-foreground">Input: {ex.input}</p>
                                        <p className="text-foreground">Output: {ex.expectedOutput || ex.output}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Code Editor Simulation */}
                            <div className="rounded-2xl border border-border bg-card flex flex-col">
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                                    <Code2 size={14} className="text-primary" />
                                    <span className="text-xs font-mono text-muted-foreground">solution.py</span>
                                </div>
                                <textarea
                                    value={myCode}
                                    onChange={e => { setMyCode(e.target.value); setMyProgress(Math.min(90, myProgress + 5)); }}
                                    className="flex-1 p-4 font-mono text-sm bg-transparent text-foreground resize-none focus:outline-none min-h-[200px]"
                                    spellCheck={false}
                                />
                                <div className="px-4 py-3 border-t border-border flex justify-end gap-2">
                                    <button onClick={() => setMyProgress(Math.min(90, myProgress + 10))}
                                        className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                                        Run Tests
                                    </button>
                                    <button onClick={handleSubmit} disabled={submitted || submitMutation.isPending}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                        <CheckCircle2 size={14} /> {submitMutation.isPending ? 'Validating...' : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── FINISHED ── */}
                {status === 'finished' && (
                    <motion.div key="finished" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-16 space-y-6 text-center">
                        <motion.div
                            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-7xl"
                        >
                            {winner === 'me' ? '🏆' : '😤'}
                        </motion.div>
                        <div>
                            <h2 className="text-4xl font-black gradient-text">{winner === 'me' ? 'Victory!' : 'Defeat'}</h2>
                            <p className="text-muted-foreground mt-2">
                                {winner === 'me' ? 'Excellent! You solved it first and earned +25 XP' : 'Close battle! Keep practicing to improve your speed.'}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                            <div className="rounded-2xl border border-border bg-card p-4">
                                <p className="text-2xl font-black text-primary">+{winner === 'me' ? 25 : 5}</p>
                                <p className="text-xs text-muted-foreground">XP Earned</p>
                            </div>
                            <div className="rounded-2xl border border-border bg-card p-4">
                                <p className="text-2xl font-black text-foreground">{winner === 'me' ? '#↑3' : '#↓2'}</p>
                                <p className="text-xs text-muted-foreground">Rank Change</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setStatus('lobby')} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors">
                                Battle Again
                            </button>
                            <button className="px-6 py-2.5 rounded-xl border border-border font-bold hover:bg-muted transition-colors">
                                View Leaderboard
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Recent Battles */}
            {status === 'lobby' && (
                <div>
                    <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-primary" /> Recent Battles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { opponent: 'Zara Ali', mode: 'speed', result: 'won', time: '4m 23s', xp: '+25' },
                            { opponent: 'Omar Khan', mode: 'accuracy', result: 'lost', time: '8m 11s', xp: '+5' },
                            { opponent: 'Fatima Noor', mode: 'timed', result: 'won', time: '28m 02s', xp: '+40' },
                        ].map((b, i) => (
                            <div key={i} className={`rounded-2xl border p-4 ${b.result === 'won' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${b.result === 'won' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                                        {b.result === 'won' ? '🏆 Won' : '😤 Lost'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{b.mode}</span>
                                </div>
                                <p className="font-semibold text-foreground">vs {b.opponent}</p>
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>{b.time}</span>
                                    <span className="text-yellow-500 font-bold flex items-center gap-1"><Zap size={10} />{b.xp} XP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodingBattle;
