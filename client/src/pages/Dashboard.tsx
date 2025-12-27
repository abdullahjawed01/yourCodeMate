import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target, Code, CheckCircle, ArrowRight } from 'lucide-react';
import { dashboardApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { TiltCard } from '@/components/ui/TiltCard';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn } from '@/utils/cn';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Points',
      value: dashboardData?.points || 0,
      icon: Zap,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      label: 'Level',
      value: dashboardData?.level || 1,
      icon: Target,
      color: 'text-primary-600 dark:text-primary-400',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      label: 'Badges',
      value: dashboardData?.badges?.length || 0,
      icon: Trophy,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Completed',
      value: dashboardData?.tests?.filter((t) => t.completed).length || 0,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  const difficultyColors = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger',
  } as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Continue your coding journey</p>
      </div>

      {/* Stats Grid */}
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
              <TiltCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('p-3 rounded-lg', stat.bg)}>
                    <Icon className={cn('w-6 h-6', stat.color)} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-100 mb-1 text-glow">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      {/* Available Tests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Available Tests
          </h2>
          <Link
            to="/test"
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {dashboardData?.tests && dashboardData.tests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.tests.slice(0, 6).map((test, index) => (
              <motion.div
                key={test._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/tests/${test._id}`} className="block h-full cursor-pointer">
                  <TiltCard className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-100 flex-1 group-hover:text-primary-300 transition-colors">
                        {test.title}
                      </h3>
                      {test.completed && (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {test.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant={difficultyColors[test.difficulty] || 'default'}>
                        {test.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        {test.maxScore} pts
                      </span>
                    </div>
                  </TiltCard>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No tests available</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
