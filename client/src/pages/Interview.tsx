import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Briefcase, Play, Send,
  Loader2, Award
} from 'lucide-react';
import { interviewApi } from '@/services/api';
import toast from 'react-hot-toast';
import clsx from 'clsx';
// @ts-ignore
import ReactMarkdown from 'react-markdown';

const Interview: React.FC = () => {
  const [stage, setStage] = useState<'setup' | 'active' | 'feedback'>('setup');
  const [config, setConfig] = useState({ role: 'frontend', level: 'junior' });
  const [session, setSession] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<any>(null);

  // Start Interview
  const startMutation = useMutation({
    mutationFn: (data: any) => interviewApi.startInterview(data),
    onSuccess: (data) => {
      setSession(data);
      setStage('active');
      toast.success('Interview started!');
    },
    onError: () => toast.error('Failed to start interview')
  });

  // Submit Answer
  const submitMutation = useMutation({
    mutationFn: (data: any) => interviewApi.submitAnswer(data),
    onSuccess: (data) => {
      setFeedback(data);
      setStage('feedback');
    },
    onError: () => toast.error('Failed to submit answer')
  });

  const handleStart = () => {
    startMutation.mutate(config);
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    submitMutation.mutate({
      sessionId: session._id || session.sessionId,
      answer
    });
  };

  const handleNextQuestion = () => {
    // Ideally fetch next question or reset for demo loop
    // For now, let's reset to setup or re-trigger start for infinite mode
    setStage('setup');
    setAnswer('');
    setFeedback(null);
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Technical Interview</h1>
        <p className="text-zinc-500 max-w-lg mx-auto">
          Practice real-world interview scenarios with our AI interviewer.
          Get instant feedback on your answers.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card glass-card rounded-2xl p-8 shadow-xl w-full backdrop-blur-md"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Target Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {['frontend', 'backend', 'fullstack'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setConfig({ ...config, role })}
                      className={clsx(
                        "p-3 rounded-lg border text-sm font-medium capitalize transition-all duration-200 hover:scale-105 active:scale-95",
                        config.role === role
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary shadow-lg shadow-primary/10"
                          : "border-border hover:bg-muted bg-background/50"
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Experience Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {['junior', 'mid', 'senior'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setConfig({ ...config, level })}
                      className={clsx(
                        "p-3 rounded-lg border text-sm font-medium capitalize transition-all duration-200 hover:scale-105 active:scale-95",
                        config.level === level
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary shadow-lg shadow-primary/10"
                          : "border-border hover:bg-muted bg-background/50"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={startMutation.isPending}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {startMutation.isPending ? <Loader2 className="animate-spin" /> : <Play size={20} />}
                Start Session
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid gap-6"
          >
            {/* AI Question Bubble */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shrink-0 shadow-lg text-white ring-4 ring-background">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="bg-card/80 backdrop-blur-md border border-border/60 p-6 rounded-2xl rounded-tl-none shadow-sm flex-1 glass-card">
                <h3 className="text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">Interviewer</h3>
                <div className="prose dark:prose-invert max-w-none text-lg">
                  {session?.questions?.[0]?.question || session?.question}
                </div>
              </div>
            </div>

            {/* Answer Box */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl glass-card">
              <label className="block text-sm font-medium mb-4 flex items-center gap-2">
                <User size={16} /> Your Answer
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full h-48 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none font-mono text-sm"
                placeholder="Type your explanation or code here..."
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim() || submitMutation.isPending}
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {submitMutation.isPending ? "Evaluating..." : "Submit Answer"}
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'feedback' && feedback && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 w-full"
          >
            <div className="glass-card rounded-2xl p-8 shadow-2xl text-center overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />

              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6 relative">
                <Award className={clsx("w-10 h-10", feedback.score >= 70 ? "text-green-500" : "text-yellow-500")} />
                <div className="absolute -bottom-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                  {feedback.score}/100
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4">Feedback Received</h2>

              <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-6 text-left mb-6 border border-zinc-100 dark:border-zinc-800">
                <ReactMarkdown className="prose dark:prose-invert text-sm">
                  {feedback.feedback}
                </ReactMarkdown>
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all"
              >
                Continue to Next Question
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Interview;
