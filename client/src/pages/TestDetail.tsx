import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Lightbulb, CheckCircle, XCircle, Loader2, Brain, TrendingUp, Zap } from 'lucide-react';
import { testApi, hintApi, aiApi, pythonApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const TestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [code, setCode] = useState('// Write your solution here\n');
  const [language, setLanguage] = useState('javascript');
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [showAIExplanation, setShowAIExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');

  const { data: test, isLoading } = useQuery({
    queryKey: ['test', id],
    queryFn: () => testApi.getTestById(id!),
    enabled: !!id,
  });

  const submitMutation = useMutation({
    mutationFn: (data: { testId: string; code: string; language: string }) =>
      aiApi.evaluateCode({ code: data.code, testId: data.testId }),
    onSuccess: (data) => {
      setSubmissionResult(data);
      toast.success(`Solution submitted! Score: ${data.score}/${test?.maxScore || 100}`);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      queryClient.invalidateQueries({ queryKey: ['pythonTopics'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Submission failed');
    },
  });

  const explainMutation = useMutation({
    mutationFn: (data: { code: string }) => aiApi.explainCode(data),
    onSuccess: (data) => {
      setAiExplanation(data.explanation);
      setShowAIExplanation(true);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to get explanation');
    },
  });

  const hintMutation = useMutation({
    mutationFn: (testId: string) => hintApi.getHint({ testId }),
    onSuccess: (data) => {
      setHint(data.hint);
      setShowHint(true);
      toast.success('Hint unlocked!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to get hint');
    },
  });

  const hintMutationPython = useMutation({
    mutationFn: (testId: string) => pythonApi.useHint(testId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pythonTopics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      // Call standard hint mutation after verifying/deducting via python path
      if (test?._id) hintMutation.mutate(test._id);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to unlock hint');
    },
  });

  const handleSubmit = () => {
    if (!test || !code.trim()) {
      toast.error('Please write some code first');
      return;
    }
    submitMutation.mutate({ testId: test._id, code, language });
  };

  const handleGetHint = () => {
    if (!test) return;
    // Try Python API first (for learning system), fallback to regular hint API
    const usePythonHint = window.location.pathname.includes('/python') ||
      window.location.pathname.includes('/tests');
    if (usePythonHint) {
      hintMutationPython.mutate(test._id);
    } else {
      if (user && user.points < test.hintCost) {
        toast.error(`You need ${test.hintCost} points to unlock this hint`);
        return;
      }
      hintMutation.mutate(test._id);
    }
  };

  const handleGetAIExplanation = () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }
    explainMutation.mutate({ code });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Test not found</p>
        <Button onClick={() => navigate('/test')} className="mt-4">
          Back to Tests
        </Button>
      </div>
    );
  }

  const difficultyColors = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger',
  } as const;

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/test')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tests
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{test.title}</h1>
            <Badge className={cn('border', difficultyColors[test.difficulty] || 'default')}>
              {test.difficulty}
            </Badge>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{test.description}</p>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Test Cases</h3>
            {test.testCases.map((testCase, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Input:</p>
                <code className="text-gray-900 dark:text-gray-100 text-sm font-mono">{testCase.input}</code>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 mt-2">Expected Output:</p>
                <code className="text-gray-900 dark:text-gray-100 text-sm font-mono">{testCase.expectedOutput}</code>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleGetHint}
              disabled={hintMutation.isPending || hintMutationPython.isPending}
              isLoading={hintMutation.isPending || hintMutationPython.isPending}
              variant="outline"
              size="sm"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Get Hint ({test.hintCost} pts)
            </Button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Max Score: <span className="font-semibold text-gray-900 dark:text-gray-100">{test.maxScore}</span>
            </div>
          </div>

          {showHint && hint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Hint</h4>
              </div>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">{hint}</p>
            </motion.div>
          )}
        </Card>

        {/* Code Editor */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Code Editor</h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <Editor
              height="400px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleGetAIExplanation}
              isLoading={explainMutation.isPending}
              variant="outline"
              className="flex-1"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Explanation
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={submitMutation.isPending}
              className="flex-1"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* AI Feedback Section */}
      <AnimatePresence>
        {submissionResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  Submission Result
                </h3>
                <Badge
                  variant={submissionResult.score >= 80 ? 'success' : submissionResult.score >= 50 ? 'warning' : 'danger'}
                >
                  Score: {submissionResult.score}/{test.maxScore}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Feedback
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                    {submissionResult.feedback}
                  </p>
                </div>

                {submissionResult.improvements && submissionResult.improvements.length > 0 && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Suggested Improvements
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-yellow-800 dark:text-yellow-200">
                      {submissionResult.improvements.map((improvement: string, index: number) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {submissionResult.isNewCompletion && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 text-green-900 dark:text-green-100">
                      <Zap className="w-5 h-5" />
                      <span className="font-semibold">
                        🎉 New completion! Points earned. Level: {submissionResult.newLevel}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Explanation Modal */}
      {showAIExplanation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAIExplanation(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                AI Code Explanation
              </h3>
              <button
                onClick={() => setShowAIExplanation(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {aiExplanation}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TestDetail;
