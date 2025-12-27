import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Lock, CheckCircle2, Clock, Zap,
    ArrowRight, Play, Trophy, ChevronDown, Code2
} from 'lucide-react';
import { javascriptApi } from '@/services/api';
// @ts-ignore
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const JavascriptLearning: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedTopic, setSelectedTopic] = useState<any>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['javascriptTopics'],
        queryFn: javascriptApi.getTopics,
    });

    const completeMutation = useMutation({
        mutationFn: (topicId: string) => javascriptApi.completeTopic(topicId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['javascriptTopics'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Topic completed! Points earned!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to complete topic');
        },
    });

    const topics = data?.topics || [];
    const progress = data?.progress || { totalPoints: 0, hintsUnlocked: 0 };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-500">Loading JS journey...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-zinc-950 p-8 lg:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Code2 size={240} />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-2 text-zinc-900 font-bold mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                            <Trophy size={18} />
                            <span>Web Development Track</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                            Master JavaScript
                        </h1>
                        <p className="text-zinc-900/80 text-lg mb-8 leading-relaxed font-medium">
                            The language of the web. Learn modern ES6+, DOM manipulation, and asynchronous programming.
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                <div className="p-2 bg-zinc-900/10 rounded-lg">
                                    <Zap className="w-5 h-5 text-zinc-900" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{progress.totalPoints}</div>
                                    <div className="text-xs text-zinc-800 font-semibold opacity-70">Total Points</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                <div className="p-2 bg-zinc-900/10 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-zinc-900" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {topics.filter((t: any) => t.completed).length}/{topics.length}
                                    </div>
                                    <div className="text-xs text-zinc-800 font-semibold opacity-70">Topics Completed</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic: any, index: number) => (
                    <motion.div
                        key={topic._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={clsx(
                            "group relative flex flex-col justify-between p-6 rounded-xl border transition-all duration-300",
                            "bg-card hover:shadow-xl hover:-translate-y-1",
                            topic.unlocked
                                ? "border-zinc-200 dark:border-zinc-800 cursor-pointer"
                                : "border-zinc-200 dark:border-zinc-800 opacity-60 bg-zinc-50 dark:bg-zinc-900/50 cursor-not-allowed",
                            topic.isCurrent && "ring-2 ring-yellow-500 ring-offset-2 dark:ring-offset-zinc-900"
                        )}
                        onClick={() => {
                            if (topic.unlocked) setSelectedTopic(topic);
                            else toast.error("Complete previous topics to unlock");
                        }}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={clsx(
                                    "p-3 rounded-lg",
                                    topic.completed ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400" :
                                        topic.unlocked ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                                )}>
                                    {topic.completed ? <CheckCircle2 size={20} /> :
                                        topic.unlocked ? <BookOpen size={20} /> : <Lock size={20} />}
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                                    <Clock size={12} />
                                    <span>{topic.estimatedTime}m</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                                {topic.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {topic.description}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                            <div className="flex items-center gap-1 text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                <Zap size={14} />
                                <span>{topic.pointsReward} pts</span>
                            </div>
                            {topic.unlocked && (
                                <div className="text-yellow-600 dark:text-yellow-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Start <ArrowRight size={14} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Slide-over / Modal for Content */}
            <AnimatePresence>
                {selectedTopic && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTopic(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedTopic.title}</h2>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1"><Clock size={14} /> {selectedTopic.estimatedTime} mins</span>
                                        <span className="flex items-center gap-1 text-yellow-500"><Zap size={14} /> {selectedTopic.pointsReward} Points</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedTopic(null)}
                                    className="p-2 hover:bg-muted rounded-full"
                                >
                                    <ChevronDown size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="prose dark:prose-invert max-w-none">
                                    <ReactMarkdown>{selectedTopic.content}</ReactMarkdown>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-border bg-muted/20 flex justify-end gap-4">
                                <button
                                    onClick={() => setSelectedTopic(null)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    Close
                                </button>
                                {!selectedTopic.completed ? (
                                    <button
                                        onClick={() => completeMutation.mutate(selectedTopic._id)}
                                        disabled={completeMutation.isPending}
                                        className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        {completeMutation.isPending ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <CheckCircle2 size={18} />}
                                        Mark as Complete
                                    </button>
                                ) : (
                                    <div className="flex gap-4">
                                        <div className="px-6 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium flex items-center gap-2">
                                            <CheckCircle2 size={18} /> Completed
                                        </div>
                                        {selectedTopic.testId && (
                                            <button
                                                onClick={() => navigate(`/tests/${selectedTopic.testId}`)}
                                                className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
                                            >
                                                <Play size={18} /> Take Test
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JavascriptLearning;
