import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Hash, Search, Users, Smile, Reply, X, Loader2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

// ─── Types ─────────────────────────────────────────────────────────────────
interface Message {
    _id?: string;
    id?: string;
    room?: string;
    sender?: string | { _id: string; name?: string };
    senderName?: string;
    content: string;
    createdAt?: string | Date;
    time?: string;
    isMe?: boolean;
    reactions?: Record<string, number>;
    replyTo?: string;
}

interface Room {
    id: string;
    name: string;
    type: 'dm' | 'group' | 'coding-room';
    friendId?: string;
    unread?: number;
}

const EMOJI_REACTIONS = ['👍', '🔥', '❤️', '🎉', '😂', '👏'];

const STATIC_ROOMS: Room[] = [
    { id: 'group_general', name: '# general', type: 'group', unread: 0 },
    { id: 'group_algorithms', name: '# algorithms', type: 'group', unread: 0 },
    { id: 'group_javascript', name: '# javascript', type: 'group', unread: 0 },
    { id: 'group_python', name: '# python', type: 'group', unread: 0 },
];

const formatTime = (date?: string | Date): string => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ─── Message Bubble ─────────────────────────────────────────────────────────
const MessageBubble: React.FC<{
    msg: Message;
    isMe: boolean;
    onReact: (msgId: string, emoji: string) => void;
    onReply: (msg: Message) => void;
}> = ({ msg, isMe, onReact, onReply }) => {
    const msgId = msg._id || msg.id || '';
    const senderName = msg.senderName || (typeof msg.sender === 'string' ? msg.sender : msg.sender?.name) || 'Unknown';

    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`group flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {!isMe && (
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0 mb-1">
                    {senderName.charAt(0).toUpperCase()}
                </div>
            )}

            <div className={`relative max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {!isMe && (
                    <span className="text-[10px] text-muted-foreground ml-1">{senderName}</span>
                )}
                <div className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-card border border-border text-foreground rounded-tl-sm'
                    }`}>
                    {msg.content}

                    {/* Emoji reaction picker (on hover) */}
                    <div className={`absolute -top-8 ${isMe ? 'right-0' : 'left-0'} hidden group-hover:flex gap-1 bg-card border border-border rounded-xl p-1 shadow-lg z-10`}>
                        {EMOJI_REACTIONS.map(e => (
                            <button
                                key={e}
                                type="button"
                                onClick={() => msgId && onReact(msgId, e)}
                                className="text-sm hover:scale-125 transition-transform p-0.5"
                            >
                                {e}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => onReply(msg)}
                            className="text-xs text-muted-foreground hover:text-primary px-1.5 transition-colors"
                            title="Reply"
                        >
                            <Reply size={12} />
                        </button>
                    </div>
                </div>

                {/* Reactions */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {Object.entries(msg.reactions).map(([emoji, count]) => (
                            <span key={emoji} className="text-[11px] px-1.5 py-0.5 bg-muted rounded-full border border-border cursor-pointer hover:bg-muted/80">
                                {emoji} {count}
                            </span>
                        ))}
                    </div>
                )}

                <span className={`text-[10px] text-muted-foreground ${isMe ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.createdAt) || msg.time}
                </span>
            </div>
        </motion.div>
    );
};

// ─── Chat Page ──────────────────────────────────────────────────────────────
const Chat: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    const qc = useQueryClient();

    const [search, setSearch] = useState('');
    const [input, setInput] = useState('');
    const [replyTo, setReplyTo] = useState<Message | null>(null);
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    // Fetch dynamic rooms from API (includes DMs with friends)
    const { data: roomData } = useQuery({
        queryKey: ['chatRooms'],
        queryFn: chatApi.getRooms,
        retry: 1,
    });

    const allRooms: Room[] = roomData?.rooms?.length
        ? roomData.rooms
        : STATIC_ROOMS;

    // Pre-select room from navigation state (e.g., from Friends page)
    const navState = location.state as { friendId?: string; name?: string } | null;

    const [activeRoom, setActiveRoom] = useState<Room>(() => {
        if (navState?.friendId) {
            return STATIC_ROOMS.find(r => r.friendId === navState.friendId) || STATIC_ROOMS[0];
        }
        return STATIC_ROOMS[0];
    });

    // Cleanup initial room selection when allRooms loads
    useEffect(() => {
        if (roomData?.rooms) {
            const currentInAll = allRooms.find(r => r.id === activeRoom.id);
            if (!currentInAll && navState?.friendId) {
                const targetRoom = allRooms.find(r => r.friendId === navState.friendId);
                if (targetRoom) setActiveRoom(targetRoom);
            }
        }
    }, [roomData]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Initialize socket
    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const socket = io(API_URL);
        socketRef.current = socket;

        socket.on('receive_message', (data: Message) => {
            // Only add message if it belongs to current room
            if (data.room === activeRoom.id) {
                qc.setQueryData<Message[]>(['messages', activeRoom.id], prev => {
                    const exists = prev?.some(m => (m._id || m.id) === (data._id || data.id));
                    if (exists) return prev;
                    return [...(prev || []), data];
                });
                scrollToBottom();
            }
        });

        socket.emit('join_room', activeRoom.id);

        return () => {
            socket.disconnect();
        };
    }, [activeRoom.id, qc, scrollToBottom]);

    // Fetch messages for active room
    const { data: messages = [], isLoading: loadingMessages } = useQuery<Message[]>({
        queryKey: ['messages', activeRoom.id],
        queryFn: () => chatApi.getMessages(activeRoom.id),
        retry: 1,
    });

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    const sendMutation = useMutation({
        mutationFn: chatApi.sendMessage,
        onSuccess: (newMsg) => {
            // Socket emission usually handled by backend, but we can emit if needed
            // For now, let's assume backend emits 'receive_message' to everyone in room including sender
            if (socketRef.current) {
                socketRef.current.emit('send_message', { ...newMsg, room: activeRoom.id });
            }

            qc.setQueryData<Message[]>(['messages', activeRoom.id], prev => {
                const exists = prev?.some(m => (m._id || m.id) === (newMsg._id || newMsg.id));
                if (exists) return prev;
                return [...(prev || []), newMsg];
            });
            setInput('');
            setReplyTo(null);
            scrollToBottom();
        },
        onError: () => toast.error('Failed to send message'),
    });

    const reactionMutation = useMutation({
        mutationFn: ({ id, emoji }: { id: string; emoji: string }) => chatApi.addReaction(id, emoji),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['messages', activeRoom.id] }),
    });

    const handleSend = () => {
        if (!input.trim()) return;
        sendMutation.mutate({
            room: activeRoom.id,
            content: input.trim(),
            replyTo: replyTo?._id,
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const filteredRooms = allRooms.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    const dmRooms = filteredRooms.filter(r => r.type === 'dm');
    const groupRooms = filteredRooms.filter(r => r.type === 'group');

    return (
        <div className="flex h-[calc(100vh-5rem)] rounded-2xl border border-border overflow-hidden bg-card shadow-2xl">
            {/* Sidebar */}
            <div className="w-64 shrink-0 border-r border-border flex flex-col bg-card/80">
                <div className="p-4 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground mb-3">Messages</h2>
                    <div className="relative">
                        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-muted border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-4">
                    {/* DMs */}
                    {dmRooms.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-1">Direct Messages</p>
                            {dmRooms.map(room => (
                                <button
                                    key={room.id}
                                    type="button"
                                    onClick={() => setActiveRoom(room)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${activeRoom.id === room.id
                                        ? 'bg-primary/10 text-primary font-semibold'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                >
                                    <Avatar name={room.name} size="sm" />
                                    <span className="text-xs truncate flex-1">{room.name}</span>
                                    {room.unread ? <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">{room.unread}</span> : null}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Groups */}
                    {groupRooms.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-1">Channels</p>
                            {groupRooms.map(room => (
                                <button
                                    key={room.id}
                                    type="button"
                                    onClick={() => setActiveRoom(room)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all text-sm ${activeRoom.id === room.id
                                        ? 'bg-primary/10 text-primary font-semibold'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                >
                                    <Hash size={14} />
                                    <span className="text-xs truncate flex-1">{room.name.replace('# ', '')}</span>
                                    {room.unread ? <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">{room.unread}</span> : null}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main chat */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Chat Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card/60 backdrop-blur-sm shrink-0">
                    <div className="flex items-center gap-3">
                        {activeRoom.type === 'dm' ? (
                            <Avatar name={activeRoom.name} size="sm" />
                        ) : (
                            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Hash size={14} className="text-primary" />
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-foreground text-sm">{activeRoom.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                                {activeRoom.type === 'dm' ? 'Direct message' : 'Group channel'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users size={16} className="text-muted-foreground" />
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                    {loadingMessages ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                                {activeRoom.type === 'dm' ? <Avatar name={activeRoom.name} size="md" /> : <Hash size={24} className="text-muted-foreground" />}
                            </div>
                            <p className="font-semibold text-foreground">{activeRoom.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">No messages yet. Say hello! 👋</p>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {messages.map((msg, i) => {
                                const senderId = typeof msg.sender === 'object' ? msg.sender?._id : msg.sender;
                                const isMe = msg.isMe || senderId === user?._id;
                                return (
                                    <MessageBubble
                                        key={msg._id || msg.id || i}
                                        msg={msg}
                                        isMe={isMe}
                                        onReact={(id, emoji) => reactionMutation.mutate({ id, emoji })}
                                        onReply={setReplyTo}
                                    />
                                );
                            })}
                        </AnimatePresence>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Reply preview */}
                <AnimatePresence>
                    {replyTo && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-5 py-2 border-t border-border bg-muted/50 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Reply size={12} className="text-primary" />
                                <span className="text-primary font-semibold">Replying to</span>
                                <span className="text-foreground truncate max-w-[300px]">{replyTo.content}</span>
                            </div>
                            <button type="button" onClick={() => setReplyTo(null)} className="text-muted-foreground hover:text-foreground"><X size={13} /></button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input */}
                <div className="px-4 py-3 border-t border-border bg-card/60 backdrop-blur-sm shrink-0">
                    <div className="flex items-end gap-2 bg-muted rounded-2xl border border-border p-2 pr-3">
                        <button
                            type="button"
                            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                            className="p-1.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
                        >
                            <Smile size={18} />
                        </button>

                        {/* Emoji quick-add */}
                        <AnimatePresence>
                            {emojiPickerOpen && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0, y: 10 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="absolute bottom-20 left-16 bg-card border border-border rounded-2xl p-3 shadow-xl flex gap-2 z-20"
                                >
                                    {['😀', '🔥', '💡', '✅', '❌', '🚀', '🎉', '💻', '🤔', '👍', '👎', '❤️'].map(e => (
                                        <button
                                            key={e}
                                            type="button"
                                            onClick={() => { setInput(p => p + e); setEmojiPickerOpen(false); }}
                                            className="text-xl hover:scale-125 transition-transform"
                                        >{e}</button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`Message ${activeRoom.name}...`}
                            rows={1}
                            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[22px] max-h-32 py-1"
                            style={{ height: 'auto' }}
                            onInput={e => {
                                const t = e.target as HTMLTextAreaElement;
                                t.style.height = 'auto';
                                t.style.height = Math.min(t.scrollHeight, 128) + 'px';
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!input.trim() || sendMutation.isPending}
                            className="p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-all shrink-0 shadow-md"
                        >
                            {sendMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5 text-center">Enter to send · Shift+Enter for new line</p>
                </div>
            </div>
        </div>
    );
};

export default Chat;
