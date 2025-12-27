import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, TrendingUp, Target } from 'lucide-react';
import { recommendationApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export const AISuggestions: React.FC = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { data: recommendation } = useQuery({
    queryKey: ['recommendation', user?._id],
    queryFn: () => recommendationApi.getRecommendation(user!._id),
    enabled: !!user?._id,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    // Generate AI-powered suggestions based on user progress
    if (user) {
      const generated = [
        `Based on your level ${user.level}, try medium difficulty challenges`,
        `You're ${100 - (user.points % 100)} points away from level ${user.level + 1}`,
        `Complete 3 more tests to unlock the "Persistent Coder" badge`,
      ];
      setSuggestions(generated);
    }
  }, [user]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-primary-400" />
        <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
      </div>

      <AnimatePresence>
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover={false} className="p-4">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-sm flex-1">{suggestion}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {recommendation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden"
        >
          <Card className="p-6 bg-gradient-to-br from-primary-500/20 to-purple-600/20 border-primary-500/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-primary-400" />
                <h4 className="text-lg font-semibold text-white">Recommended for You</h4>
              </div>
              <TrendingUp className="w-5 h-5 text-primary-400" />
            </div>
            <h5 className="text-xl font-bold text-white mb-2">{recommendation.title}</h5>
            <p className="text-white/70 mb-4 line-clamp-2">{recommendation.description}</p>
            <Link to={`/tests/${recommendation._id}`}>
              <Button size="sm">Start Challenge</Button>
            </Link>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
