import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Globe2, MessageSquare, TrendingUp, Code2, ThumbsUp,
    Eye, Tag, Search, Plus, X, Loader2, Reply,
    ChevronRight, Trash2, Send
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { communityApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

// ─── Types ─────────────────────────────────────────────────────────────────
interface Post {
    _id: string;
    title: string;
    content: string;
    type: 'discussion' | 'solution' | 'code_review';
    tags: string[];
    upvoteCount: number;
    replyCount: number;
    views: number;
    isUpvoted: boolean;
    author: { _id: string; name: string; level: number; points: number };
    createdAt: string;
    code?: string;
    language?: string;
    replies?: { _id: string; content: string; author: { name: string; level: number }; createdAt: string }[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const timeSince = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
};

const LANG_COLORS: Record<string, string> = {
    Python: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'C++': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    JavaScript: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    TypeScript: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
    Java: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Rust: 'bg-orange-700/20 text-orange-600 border-orange-700/30',
    Go: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

const POST_TYPES = [
    { value: 'discussion', label: 'Discussion', icon: '💬', color: 'text-blue-400' },
    { value: 'solution', label: 'Solution', icon: '✅', color: 'text-emerald-400' },
    { value: 'code_review', label: 'Code Review', icon: '🔍', color: 'text-purple-400' },
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'top', label: 'Most Viewed' },
    { value: 'hot', label: 'Most Upvoted' },
];

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'C++', 'Java', 'Rust', 'Go', 'Swift', 'Ruby'];

// ─── New Post Modal ─────────────────────────────────────────────────────────
const NewPostModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({ title: '', content: '', type: 'discussion', code: '', language: 'JavaScript' });
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [hasCode, setHasCode] = useState(false);

    const mutation = useMutation({
        mutationFn: communityApi.createPost,
        onSuccess: () => {
            toast.success('Post created! 🎉');
            onSuccess();
            onClose();
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to create post'),
    });

    const addTag = () => {
        const t = tagInput.trim().replace(/^#/, '');
        if (t && !tags.includes(t) && tags.length < 5) {
            setTags(prev => [...prev, t]);
            setTagInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
        if (e.key === 'Backspace' && !tagInput && tags.length) setTags(prev => prev.slice(0, -1));
    };

    const handleSubmit = () => {
        if (!form.title.trim() || !form.content.trim()) {
            toast.error('Title and content are required');
            return;
        }
        mutation.mutate({ ...form, tags, code: hasCode ? form.code : undefined });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                    <h2 className="text-lg font-black text-foreground">Create New Post</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground w-8 h-8 rounded-xl hover:bg-muted flex items-center justify-center transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Post Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            {POST_TYPES.map(pt => (
                                <button
                                    key={pt.value}
                                    onClick={() => setForm(f => ({ ...f, type: pt.value }))}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${form.type === pt.value
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border bg-card hover:bg-muted text-muted-foreground'
                                        }`}
                                >
                                    <span>{pt.icon}</span>
                                    <span>{pt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Title *</label>
                        <input
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            placeholder="A clear and descriptive title..."
                            className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                            maxLength={200}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Content *</label>
                        <textarea
                            value={form.content}
                            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                            placeholder="Explain your question, solution, or request for review..."
                            rows={5}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-none"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground select-none">
                            <div
                                onClick={() => setHasCode(h => !h)}
                                className={`w-10 h-5 rounded-full transition-colors relative ${hasCode ? 'bg-primary' : 'bg-muted border border-border'}`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${hasCode ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </div>
                            Include code snippet
                        </label>

                        <AnimatePresence>
                            {hasCode && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-3 space-y-2 overflow-hidden"
                                >
                                    <select
                                        value={form.language}
                                        onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                                        className="px-3 py-1.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    >
                                        {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                    <textarea
                                        value={form.code}
                                        onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                                        placeholder="Paste your code here..."
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-black/50 text-emerald-400 font-mono text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Tags (up to 5)</label>
                        <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-border bg-muted/50 min-h-[42px]">
                            {tags.map(t => (
                                <span key={t} className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-primary/15 text-primary border border-primary/25">
                                    #{t}
                                    <button onClick={() => setTags(prev => prev.filter(x => x !== t))} className="hover:text-red-400 transition-colors"><X size={10} /></button>
                                </span>
                            ))}
                            <input
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={addTag}
                                placeholder={tags.length < 5 ? 'Add tag...' : 'Max 5 tags'}
                                disabled={tags.length >= 5}
                                className="flex-1 min-w-[80px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                            />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">Press Enter or comma to add a tag</p>
                    </div>
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
                    <p className="text-xs text-muted-foreground">Be respectful and helpful 🤝</p>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={mutation.isPending || !form.title.trim() || !form.content.trim()}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            Publish Post
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Post Card ───────────────────────────────────────────────────────────────
const PostCard: React.FC<{
    post: Post;
    onUpvote: (id: string) => void;
    onExpand: (post: Post) => void;
    onDelete: (id: string) => void;
    userId?: string;
}> = ({ post, onUpvote, onExpand, onDelete, userId }) => {
    const typeConfig: Record<string, { label: string; color: string; icon: string }> = {
        discussion: { label: 'Discussion', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: '💬' },
        solution: { label: 'Solution', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: '✅' },
        code_review: { label: 'Code Review', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', icon: '🔍' },
    };
    const tc = typeConfig[post.type] || typeConfig['discussion'];
    const isHot = post.upvoteCount > 10 || post.views > 100;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group cursor-pointer"
            onClick={() => onExpand(post)}
        >
            <div className="flex items-start gap-3">
                <Avatar name={post.author?.name || '?'} size="sm" className="shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tc.color}`}>{tc.icon} {tc.label}</span>
                        {isHot && <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">🔥 Hot</span>}
                    </div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1 line-clamp-2">{post.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {post.tags?.slice(0, 4).map(tag => (
                            <span key={tag} className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary/80 border border-primary/15">
                                <Tag size={8} />{tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => onUpvote(post._id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all font-semibold ${post.isUpvoted ? 'text-primary bg-primary/15 scale-105' : 'hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        <ThumbsUp size={12} /> {post.upvoteCount}
                    </button>
                    <span className="flex items-center gap-1"><Reply size={10} />{post.replyCount}</span>
                    <span className="flex items-center gap-1"><Eye size={10} />{post.views}</span>
                    {userId && post.author?._id === userId && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(post._id); }}
                            className="text-muted-foreground hover:text-red-400 transition-colors p-1 rounded"
                        >
                            <Trash2 size={11} />
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground">
                    by <span className="text-primary/80 font-medium">{post.author?.name}</span> · {timeSince(post.createdAt)}
                </p>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                    Open <ChevronRight size={10} />
                </span>
            </div>
        </motion.div>
    );
};

// ─── Post Detail Modal ────────────────────────────────────────────────────────
const PostDetailModal: React.FC<{ post: Post; onClose: () => void; onUpvote: (id: string) => void }> = ({ post, onClose, onUpvote }) => {
    const [replyContent, setReplyContent] = useState('');
    const queryClient = useQueryClient();

    const replyMutation = useMutation({
        mutationFn: (content: string) => communityApi.addReply(post._id, content),
        onSuccess: () => {
            toast.success('Reply posted!');
            setReplyContent('');
            queryClient.invalidateQueries({ queryKey: ['community-posts'] });
        },
        onError: () => toast.error('Failed to post reply'),
    });

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 shrink-0">
                    <div className="flex items-center gap-3">
                        <Avatar name={post.author?.name} size="sm" />
                        <div>
                            <p className="text-sm font-bold text-foreground">{post.author?.name}</p>
                            <p className="text-[11px] text-muted-foreground">Level {post.author?.level} · {timeSince(post.createdAt)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground w-8 h-8 rounded-xl hover:bg-muted flex items-center justify-center transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    <div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {post.tags?.map(t => (
                                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">#{t}</span>
                            ))}
                        </div>
                        <h2 className="text-xl font-black text-foreground mb-3">{post.title}</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {post.code && (
                        <div className="rounded-xl border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${LANG_COLORS[post.language || ''] || 'bg-muted text-foreground border-border'}`}>{post.language}</span>
                            </div>
                            <pre className="p-4 text-xs font-mono text-emerald-400 bg-black/60 overflow-x-auto whitespace-pre-wrap">{post.code}</pre>
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-2 border-t border-border">
                        <button
                            onClick={() => onUpvote(post._id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${post.isUpvoted ? 'text-primary bg-primary/15' : 'text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            <ThumbsUp size={14} /> {post.upvoteCount} upvotes
                        </button>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye size={12} />{post.views} views</span>
                    </div>

                    {/* Replies */}
                    {(post.replies?.length || 0) > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                <Reply size={14} className="text-primary" />
                                {post.replies?.length} Replies
                            </h3>
                            {post.replies?.map(r => (
                                <div key={r._id} className="flex gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                                    <Avatar name={r.author?.name} size="xs" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-foreground">{r.author?.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{timeSince(r.createdAt)}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{r.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reply Input */}
                <div className="shrink-0 px-6 py-4 border-t border-border bg-muted/20">
                    <div className="flex gap-2">
                        <textarea
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                            placeholder="Write a helpful reply..."
                            rows={2}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (replyContent.trim()) replyMutation.mutate(replyContent.trim()); }
                            }}
                        />
                        <button
                            onClick={() => replyContent.trim() && replyMutation.mutate(replyContent.trim())}
                            disabled={!replyContent.trim() || replyMutation.isPending}
                            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {replyMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Main Community Page ─────────────────────────────────────────────────────
const Community: React.FC = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [showNewPost, setShowNewPost] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');
    const [activeTab, setActiveTab] = useState('discussions');

    const typeFromTab: Record<string, string> = {
        discussions: 'discussion', solutions: 'solution', reviews: 'code_review', trending: 'all'
    };
    const currentType = activeTab === 'trending' ? 'all' : typeFromTab[activeTab] || 'all';
    const currentSort = activeTab === 'trending' ? 'hot' : sort;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['community-posts', currentType, search, currentSort],
        queryFn: () => communityApi.getPosts({ type: currentType === 'all' ? undefined : currentType, search: search || undefined, sort: currentSort }),
        retry: 1,
    });

    const { data: statsData } = useQuery({
        queryKey: ['community-stats'],
        queryFn: communityApi.getStats,
        retry: 1,
    });

    const upvoteMutation = useMutation({
        mutationFn: communityApi.upvotePost,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community-posts'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: communityApi.deletePost,
        onSuccess: () => {
            toast.success('Post deleted');
            queryClient.invalidateQueries({ queryKey: ['community-posts'] });
        },
        onError: () => toast.error('Failed to delete post'),
    });

    const posts: Post[] = (data as any)?.posts || [];
    const stats = statsData as any;

    const handleUpvote = (id: string) => {
        if (!user) { toast.error('Login to upvote'); return; }
        upvoteMutation.mutate(id);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            <AnimatePresence>
                {showNewPost && (
                    <NewPostModal
                        onClose={() => setShowNewPost(false)}
                        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['community-posts'] })}
                    />
                )}
                {selectedPost && (
                    <PostDetailModal
                        post={selectedPost}
                        onClose={() => setSelectedPost(null)}
                        onUpvote={handleUpvote}
                    />
                )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                    <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                        <Globe2 size={28} className="text-primary" />
                        Community Hub
                    </h1>
                    <p className="text-muted-foreground mt-1">Discuss problems, share solutions, and grow together</p>
                </div>
                <button
                    onClick={() => { if (!user) { toast.error('Login to post'); return; } setShowNewPost(true); }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
                >
                    <Plus size={15} /> New Post
                </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Discussions', value: stats?.discussions ?? '—', icon: '💬', color: 'from-blue-500/10 to-transparent border-blue-500/20' },
                    { label: 'Solutions', value: stats?.solutions ?? '—', icon: '✅', color: 'from-emerald-500/10 to-transparent border-emerald-500/20' },
                    { label: 'Code Reviews', value: stats?.reviews ?? '—', icon: '🔍', color: 'from-purple-500/10 to-transparent border-purple-500/20' },
                ].map(s => (
                    <div key={s.label} className={`rounded-xl border bg-gradient-to-r ${s.color} p-3 text-center`}>
                        <div className="text-xl mb-0.5">{s.icon}</div>
                        <p className="text-lg font-black text-foreground">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</p>
                        <p className="text-[11px] text-muted-foreground">{s.label}</p>
                    </div>
                ))}
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search discussions, solutions, reviews..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
                <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            </div>

            <Tabs defaultTab="discussions" onChange={(id: string) => setActiveTab(id)}>
                <TabList>
                    <Tab id="discussions" icon={<MessageSquare size={14} />}>Discussions</Tab>
                    <Tab id="solutions" icon={<Code2 size={14} />}>Solutions</Tab>
                    <Tab id="reviews" icon={<Eye size={14} />}>Code Reviews</Tab>
                    <Tab id="trending" icon={<TrendingUp size={14} />}>Trending</Tab>
                </TabList>

                {['discussions', 'solutions', 'reviews', 'trending'].map(tab => (
                    <TabPanel key={tab} id={tab}>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : isError ? (
                            <div className="text-center py-16">
                                <p className="text-muted-foreground">Could not load posts. Make sure the backend is running.</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-16 space-y-3">
                                <div className="text-5xl">📭</div>
                                <p className="text-muted-foreground font-semibold">No posts yet</p>
                                <p className="text-sm text-muted-foreground/70">
                                    {search ? `No results for "${search}"` : 'Be the first to start a discussion!'}
                                </p>
                                <button
                                    onClick={() => { if (!user) { toast.error('Login to post'); return; } setShowNewPost(true); }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/10 transition-colors mt-2"
                                >
                                    <Plus size={13} /> Create Post
                                </button>
                            </div>
                        ) : (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                                className="space-y-3"
                            >
                                <AnimatePresence mode="popLayout">
                                    {posts.map(post => (
                                        <PostCard
                                            key={post._id}
                                            post={post}
                                            onUpvote={handleUpvote}
                                            onExpand={setSelectedPost}
                                            onDelete={(id) => deleteMutation.mutate(id)}
                                            userId={user?._id}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </TabPanel>
                ))}
            </Tabs>
        </div>
    );
};

export default Community;
