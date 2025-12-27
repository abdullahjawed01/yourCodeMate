import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';
import { Zap, Target, Trophy, TrendingUp } from 'lucide-react';
import { AnimatedNumber } from './ui/AnimatedCounter';
import { FuturisticCard } from './ui/FuturisticCard';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

export const RealTimeStats: React.FC = () => {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getDashboard,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const stats = [
    {
      label: 'Points',
      value: dashboard?.points || 0,
      icon: Zap,
      color: 'text-yellow-400',
      bgGradient: 'from-yellow-500/20 to-yellow-600/20',
    },
    {
      label: 'Level',
      value: dashboard?.level || 1,
      icon: Target,
      color: 'text-primary-400',
      bgGradient: 'from-primary-500/20 to-primary-600/20',
    },
    {
      label: 'Badges',
      value: dashboard?.badges?.length || 0,
      icon: Trophy,
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/20 to-purple-600/20',
    },
    {
      label: 'Completed',
      value: dashboard?.tests?.filter((t) => t.completed).length || 0,
      icon: TrendingUp,
      color: 'text-green-400',
      bgGradient: 'from-green-500/20 to-green-600/20',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} hover={false}>
            <div className="h-24 bg-white/5 animate-pulse rounded" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <FuturisticCard
              glow
              holographic
              className={`bg-gradient-to-br ${stat.bgGradient} border-cyan-400/30 relative overflow-hidden`}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={cn('w-8 h-8', stat.color)} />
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp className="w-6 h-6 text-white/40" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1 neon-cyan">
                  <AnimatedNumber value={stat.value} />
                </p>
                <p className="text-cyan-400/80 text-sm">{stat.label}</p>
              </div>
            </FuturisticCard>
          </motion.div>
        );
      })}
    </div>
  );
};
