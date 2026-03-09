import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Trophy, Search, TrendingUp } from 'lucide-react';
import { leaderboardApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// ─── Types ─────────────────────────────────────────────────────────────────
interface LeaderboardEntry {
  _id: string;
  name: string;
  email?: string;
  points: number;
  level: number;
  streak?: number;
  badges?: string[];
  rank?: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────
const TABS = ['Global', 'Weekly', 'Rising'];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.5)]"><span className="text-lg">🥇</span></div>;
  if (rank === 2) return <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300/20 border border-gray-400/50 shadow-[0_0_15px_rgba(156,163,175,0.5)]"><span className="text-lg">🥈</span></div>;
  if (rank === 3) return <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-600/20 border border-amber-600/50 shadow-[0_0_15px_rgba(217,119,6,0.5)]"><span className="text-lg">🥉</span></div>;
  return <span className="text-white/40 font-mono font-bold text-sm w-8 text-center">#{rank}</span>;
};

const getRankBg = (rank: number): string => {
  if (rank === 1) return 'glass-card-premium glow-gold border-yellow-500/50 bg-gradient-to-t from-yellow-900/30 to-yellow-500/5';
  if (rank === 2) return 'glass-card-premium shadow-cyber border-gray-300/40 bg-gradient-to-t from-gray-800/40 to-gray-400/5';
  if (rank === 3) return 'glass-card-premium glow-bronze border-amber-600/40 bg-gradient-to-t from-amber-900/30 to-amber-600/5';
  return 'glass-card border-white/5 hover:border-white/15 bg-white/[0.02]';
};

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const slideIn = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

// ─── Podium Card ───────────────────────────────────────────────────────────
const PodiumCard: React.FC<{ player: LeaderboardEntry; rank: number; delay: number }> = ({ player, rank, delay }) => {
  const heights = ['h-56', 'h-44', 'h-36'];
  const colors = ['text-yellow-400', 'text-gray-300', 'text-amber-500'];
  const rings = ['ring-yellow-500/50', 'ring-gray-400/40', 'ring-amber-600/40'];
  const avatarSize = rank === 1 ? 'w-16 h-16 text-2xl' : 'w-12 h-12 text-lg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -10, scale: 1.05 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      className={`relative flex flex-col items-center justify-end pb-6 px-4 rounded-t-3xl border border-b-0 ${getRankBg(rank)} ${heights[rank - 1]} overflow-hidden group transition-all duration-300`}
    >
      {/* Dynamic Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className={`absolute inset-0 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none ${rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-gray-300' : 'bg-amber-500'}`} />

      {/* avatar */}
      <div className={`absolute -top-8 flex flex-col items-center gap-1`}>
        <div className="mb-1">{getRankIcon(rank)}</div>
        <div className={`${avatarSize} rounded-full bg-black/70 border-2 ring-2 ${rings[rank - 1]} border-white/10 flex items-center justify-center font-black ${colors[rank - 1]}`}>
          {player.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="text-center">
        <h3 className="font-bold text-white text-sm truncate max-w-[100px]">{player.name}</h3>
        <span className={`text-xs font-semibold ${colors[rank - 1]}`}>{player.points.toLocaleString()} PTS</span>
        <div className="mt-1 text-[10px] text-white/40">LVL {player.level}</div>
      </div>
    </motion.div>
  );
};

// ─── Leaderboard Page ──────────────────────────────────────────────────────
const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Global');
  const [search, setSearch] = useState('');

  const { data: rawLeaderboard, isLoading, isError } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: leaderboardApi.getLeaderboard,
    retry: 1,
  });

  const { data: userRankData } = useQuery({
    queryKey: ['userRank'],
    queryFn: leaderboardApi.getUserRank,
    enabled: !!user,
    retry: 1,
  });

  const leaderboard: LeaderboardEntry[] = (rawLeaderboard as LeaderboardEntry[] | undefined) || [];
  const rankInfo = userRankData as { rank: number; user: { name: string; level: number; points: number; _id: string } } | undefined;

  // Filter by search
  const filtered = leaderboard.filter((e: LeaderboardEntry) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  // Rising: sorted by streak
  const displayList: LeaderboardEntry[] = tab === 'Rising'
    ? [...filtered].sort((a, b) => (b.streak || 0) - (a.streak || 0))
    : filtered;

  // Top 3 for podium
  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative p-8 rounded-3xl glass-card-premium border border-primary/20 shadow-cyber-strong overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={18} className="text-yellow-400" />
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Live Rankings</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
            Global{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-primary">
              Leaderboard
            </span>
          </h1>
          <p className="text-white/50 max-w-md">
            Top {leaderboard.length} developers in the CodeMate network. Compete, solve, and climb the ranks.
          </p>
        </div>
      </motion.div>

      {/* User's own rank card */}
      {rankInfo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="p-5 rounded-2xl glass-card border-primary/40 bg-primary/10 flex items-center justify-between gap-6 shadow-cyber"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-xl text-primary">
              {rankInfo.user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-white">{rankInfo.user.name} <span className="text-primary/70 font-normal text-sm">(You)</span></p>
              <p className="text-xs text-white/50">Level {rankInfo.user.level} · {rankInfo.user.points.toLocaleString()} pts</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-primary">#{rankInfo.rank}</p>
            <p className="text-xs text-white/40">Global rank</p>
          </div>
        </motion.div>
      )}

      {/* Podium */}
      {!isLoading && top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mt-8 items-end">
          {/* order: 2nd, 1st, 3rd */}
          {([1, 0, 2] as const).map((idx) => (
            <PodiumCard key={top3[idx]?._id} player={top3[idx]!} rank={idx + 1} delay={idx * 0.1} />
          ))}
        </div>
      )}

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center bg-card/40 border border-white/10 rounded-xl p-1 gap-1">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === t
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
            >
              {t === 'Rising' && <TrendingUp size={12} className="inline mr-1.5" />}
              {t}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search developers..."
            className="pl-9 pr-4 py-2 rounded-xl bg-card/40 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/40 w-64"
          />
        </div>
      </div>

      {/* Rankings List */}
      <div className="rounded-3xl glass-surface shadow-lg overflow-hidden border border-white/10">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">System Rankings</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 font-semibold">
            {displayList.length} devs
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              <p className="text-white/50 animate-pulse">Compiling global ranks...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-white/40">Could not load leaderboard. Check your connection.</p>
          </div>
        ) : displayList.length === 0 ? (
          <div className="text-center py-20 text-white/40">No results for "{search}"</div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="divide-y divide-white/5"
          >
            <AnimatePresence>
              {displayList.map((entry: LeaderboardEntry, index: number) => {
                const rank = tab === 'Rising'
                  ? index + 1
                  : (entry.rank || index + 1);
                const isMe = user && entry._id === user._id;
                return (
                  <motion.div
                    key={entry._id}
                    variants={slideIn}
                    layout
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.08)' }}
                    onClick={() => navigate(`/profile/${entry._id}`)}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 transition-all duration-300 group gap-4 border-l-4 cursor-pointer ${isMe
                      ? 'border-l-primary bg-primary/10 shadow-cyber relative z-10'
                      : 'border-l-transparent hover:border-l-accent-neon hover:shadow-cyber'
                      }`}
                  >
                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                      <div className="w-8 flex justify-center shrink-0">
                        {getRankIcon(rank)}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-black/80 to-primary/20 border border-white/10 flex items-center justify-center font-black text-white text-lg shrink-0 overflow-hidden shadow-inner">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-base truncate">{entry.name}</span>
                          {isMe && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-black uppercase tracking-wider">You</span>}
                        </div>
                        <p className="text-xs text-white/50 flex items-center gap-2 mt-1">
                          <span className="bg-white/5 px-2 py-0.5 rounded-md">Lvl {entry.level}</span>
                          {(entry.streak || 0) > 0 && (
                            <span className="text-orange-400 flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                              <Flame size={12} /> {entry.streak} Day Streak
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-[4.5rem] sm:pl-0">
                      <div className="text-left sm:text-right min-w-[70px]">
                        <p className="font-black text-primary text-xl flex items-center sm:justify-end gap-1.5 drop-shadow-md">
                          <Zap size={16} className="text-yellow-400" />
                          {entry.points.toLocaleString()}
                        </p>
                        <div className="w-full bg-black/60 rounded-full h-1.5 mt-2 overflow-hidden border border-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (entry.points / 10000) * 100)}%` }} // Arbitrary XP scale for progress bar effect
                            transition={{ duration: 1, delay: index * 0.05 }}
                            className="bg-gradient-to-r from-accent-neon to-primary h-full rounded-full"
                          />
                        </div>
                        <p className="text-[10px] text-white/40 uppercase font-semibold tracking-wider mt-1">XP Progress</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
