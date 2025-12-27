import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Medal, Award, Crown, User } from 'lucide-react';
import { leaderboardApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: leaderboardApi.getLeaderboard,
  });

  const { data: userRank } = useQuery({
    queryKey: ['userRank'],
    queryFn: leaderboardApi.getUserRank,
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400 dark:text-gray-500" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600 dark:text-amber-500" />;
    return <span className="text-gray-600 dark:text-gray-400 font-bold">#{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    if (rank === 2) return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    if (rank === 3) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Leaderboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Top performers in the community
        </p>
      </div>

      {/* User Rank Card */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 border-2 border-primary-200 dark:border-primary-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your Rank</h3>
                  <p className="text-gray-600 dark:text-gray-400">Keep climbing!</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">#{userRank.rank}</p>
                <p className="text-gray-600 dark:text-gray-400">{userRank.user.points} points</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Top 3 Podium */}
      {leaderboard && leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 0, 2].map((index) => {
            const player = leaderboard[index];
            const rank = index + 1;
            return (
              <motion.div
                key={player._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn('p-6 text-center border-2', getRankColor(rank))}>
                  <div className="flex justify-center mb-3">{getRankIcon(rank)}</div>
                  <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-bold text-xl">
                      {player.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{player.name}</h3>
                  <p className="text-primary-600 dark:text-primary-400 font-bold">{player.points} pts</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Level {player.level}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full Leaderboard */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">All Rankings</h2>
        <div className="space-y-2">
          {leaderboard?.map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = user && entry._id === user._id;
            return (
              <motion.div
                key={entry._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'flex items-center justify-between p-4 rounded-lg border transition-all',
                  getRankColor(rank),
                  isCurrentUser && 'ring-2 ring-primary-500'
                )}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    {getRankIcon(rank)}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-bold">
                      {entry.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {entry.name}
                      {isCurrentUser && (
                        <Badge variant="info" size="sm" className="ml-2">You</Badge>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Level {entry.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{entry.points} pts</p>
                  {entry.badges && entry.badges.length > 0 && (
                    <div className="flex items-center space-x-1 mt-1">
                      {entry.badges.slice(0, 3).map((_badge: string, i: number) => (
                        <Award key={i} className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;


