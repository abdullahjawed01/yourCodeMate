import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Users, Search, UserPlus, MessageSquare, Flame, Trophy,
    X, Check, Zap, UserMinus
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { friendsApi } from '@/services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Friend {
    _id: string;
    name: string;
    email?: string;
    points: number;
    level: number;
    streak: number;
    badges?: string[];
}

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

const FriendCard: React.FC<{
    friend: Friend;
    onMessage: (id: string, name: string) => void;
    onRemove: (id: string) => void;
}> = ({ friend, onMessage, onRemove }) => (
    <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-border/80 bg-card p-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group"
    >
        <div className="flex items-start gap-3">
            <Avatar name={friend.name} size="md" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="font-bold text-foreground truncate">{friend.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">Level {friend.level} · {friend.points.toLocaleString()} XP</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    {friend.streak > 0 && <span className="flex items-center gap-1"><Flame size={10} className="text-orange-500" />{friend.streak}d</span>}
                    <span className="flex items-center gap-1"><Trophy size={10} className="text-yellow-500" />{friend.points.toLocaleString()} pts</span>
                </div>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onMessage(friend._id, friend.name)}
                    className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/25 transition-colors"
                    title="Send message"
                >
                    <MessageSquare size={13} />
                </button>
                <button
                    onClick={() => onRemove(friend._id)}
                    className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500/20 transition-colors"
                    title="Remove friend"
                >
                    <UserMinus size={13} />
                </button>
            </div>
        </div>
    </motion.div>
);

const Friends: React.FC = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: socialData, isLoading } = useQuery({
        queryKey: ['friends'],
        queryFn: friendsApi.getFriends,
        retry: 1,
    });

    const { data: suggestionsRaw } = useQuery({
        queryKey: ['suggestions'],
        queryFn: friendsApi.getSuggestions,
        retry: 1,
    });

    const friends: Friend[] = (socialData as any)?.friends || [];
    const requests: Friend[] = (socialData as any)?.friendRequests || [];
    const sentRequests: Friend[] = (socialData as any)?.friendRequestsSent || [];
    const suggestions: Friend[] = (suggestionsRaw as any) || [];

    const sendRequestMutation = useMutation({
        mutationFn: friendsApi.sendRequest,
        onSuccess: () => { toast.success('Friend request sent!'); queryClient.invalidateQueries({ queryKey: ['suggestions'] }); },
        onError: () => toast.error('Request failed'),
    });

    const acceptMutation = useMutation({
        mutationFn: friendsApi.acceptRequest,
        onSuccess: () => { toast.success('Friend added!'); queryClient.invalidateQueries({ queryKey: ['friends'] }); },
        onError: () => toast.error('Could not accept'),
    });

    const declineMutation = useMutation({
        mutationFn: friendsApi.declineRequest,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['friends'] }); },
    });

    const removeMutation = useMutation({
        mutationFn: friendsApi.removeFriend,
        onSuccess: () => { toast.success('Friend removed'); queryClient.invalidateQueries({ queryKey: ['friends'] }); },
    });

    const handleMessage = (friendId: string, name: string) => {
        navigate('/chat', { state: { friendId, name } });
    };

    const filtered = friends.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                    <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                        <Users size={28} className="text-primary" />
                        Developer Network
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {isLoading ? 'Loading...' : `${friends.length} friends · ${requests.length} pending · ${sentRequests.length} sent`}
                    </p>
                </div>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search developers..."
                        className="pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 w-64"
                    />
                </div>
            </motion.div>

            <Tabs defaultTab="friends">
                <TabList>
                    <Tab id="friends" icon={<Users size={14} />} badge={friends.length}>My Friends</Tab>
                    <Tab id="requests" icon={<UserPlus size={14} />} badge={requests.length}>Requests</Tab>
                    <Tab id="discover" icon={<Search size={14} />}>Discover</Tab>
                </TabList>

                <TabPanel id="friends">
                    {isLoading ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            Loading friends...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground font-semibold">
                                {search ? `No friends matching "${search}"` : "You haven't added any friends yet"}
                            </p>
                            <p className="text-sm text-muted-foreground/70 mt-2">Discover developers in the Discover tab</p>
                        </div>
                    ) : (
                        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map(f => (
                                <FriendCard key={f._id} friend={f} onMessage={handleMessage} onRemove={(id) => removeMutation.mutate(id)} />
                            ))}
                        </motion.div>
                    )}
                </TabPanel>

                <TabPanel id="requests">
                    <div className="space-y-3">
                        {requests.length === 0 ? (
                            <p className="text-center py-12 text-muted-foreground">No pending requests</p>
                        ) : (
                            requests.map(r => (
                                <motion.div
                                    key={r._id}
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar name={r.name} size="md" />
                                        <div>
                                            <p className="font-bold text-foreground">{r.name}</p>
                                            <p className="text-xs text-muted-foreground">Level {r.level} · {(r.points || 0).toLocaleString()} XP</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => acceptMutation.mutate(r._id)}
                                            disabled={acceptMutation.isPending}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                                        >
                                            <Check size={13} /> Accept
                                        </button>
                                        <button
                                            onClick={() => declineMutation.mutate(r._id)}
                                            disabled={declineMutation.isPending}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-50"
                                        >
                                            <X size={13} /> Decline
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </TabPanel>

                <TabPanel id="discover">
                    <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {suggestions.length === 0 ? (
                            <p className="col-span-full text-center py-12 text-muted-foreground">No suggestions right now</p>
                        ) : (
                            suggestions.map(s => (
                                <motion.div
                                    key={s._id}
                                    variants={fadeUp}
                                    className="rounded-2xl border border-border bg-card p-4 flex flex-col items-center text-center gap-3 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                                >
                                    <Avatar name={s.name} size="lg" />
                                    <div>
                                        <p className="font-bold text-foreground">{s.name}</p>
                                        <p className="text-xs text-muted-foreground">Level {s.level}</p>
                                        <div className="flex items-center justify-center gap-2 mt-1 text-xs text-muted-foreground">
                                            {s.streak > 0 && <span className="flex items-center gap-1"><Flame size={10} className="text-orange-500" />{s.streak}d</span>}
                                            <span className="flex items-center gap-1"><Zap size={10} />{(s.points || 0).toLocaleString()} XP</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => sendRequestMutation.mutate(s._id)}
                                        disabled={sendRequestMutation.isPending || sentRequests.some(r => r._id === s._id)}
                                        className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold transition-colors disabled:opacity-50 ${sentRequests.some(r => r._id === s._id)
                                                ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                                                : 'border-primary/40 text-primary hover:bg-primary/10'
                                            }`}
                                    >
                                        {sentRequests.some(r => r._id === s._id) ? (
                                            <>
                                                <Check size={13} /> Sent
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus size={13} /> Add Friend
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default Friends;
