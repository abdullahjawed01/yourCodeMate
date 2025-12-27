import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, TrendingUp, AlertCircle, Code2 } from 'lucide-react'; // Fixed imports
import { testApi } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const Tests: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const { data: tests, isLoading, error } = useQuery({
    queryKey: ['tests'],
    queryFn: testApi.getAllTests,
  });

  const filteredTests = tests?.filter((test) => {
    const matchesSearch =
      !searchQuery ||
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty = difficultyFilter === 'all' || test.difficulty === difficultyFilter;

    return matchesSearch && matchesDifficulty;
  });

  const difficultyColors = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger',
  } as const;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400">Loading tests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Tests
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : 'Failed to load tests. Please try again.'}
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    );
  }

  if (!tests || tests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 max-w-md w-full text-center">
          <Code2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Tests Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There are no coding tests available at the moment.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Coding Tests
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Practice and improve your coding skills with our curated challenges
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty:</span>
            {(['all', 'easy', 'medium', 'hard'] as const).map((difficulty) => (
              <Button
                key={difficulty}
                variant={difficultyFilter === difficulty ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setDifficultyFilter(difficulty)}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results count */}
      {filteredTests && filteredTests.length > 0 && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredTests.length} of {tests.length} tests
        </p>
      )}

      {/* Tests Grid */}
      {filteredTests && filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map((test, index) => (
            <motion.div
              key={test._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                hover
                clickable
                onClick={() => navigate(`/tests/${test._id}`)}
                className="p-6 h-full flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {test.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {test.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Badge variant={difficultyColors[test.difficulty] || 'default'}>
                      {test.difficulty}
                    </Badge>
                    {test.estimatedTime && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{test.estimatedTime}min</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>{test.maxScore} pts</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Tests Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </Card>
      )}
    </div>
  );
};

export default Tests;
