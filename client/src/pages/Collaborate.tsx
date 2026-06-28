import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor, { OnMount } from '@monaco-editor/react';
import { SocketIOProvider } from 'y-socket.io';
import * as Y from 'yjs';
import {
  Users, Check, Play, Loader2, ArrowLeft, Wifi, WifiOff,
  Plus, LogIn, Code2, Share2, Terminal, ChevronDown, Sparkles,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ideApi } from '@/services/api';
import { YjsMonacoBinding } from '@/lib/yjsMonacoBinding';
import { generateRoomId, makeIdentity, type CollabUser } from '@/lib/collab';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const LANGUAGES: { key: string; label: string; monaco: string; starter: string }[] = [
  { key: 'javascript', label: 'JavaScript', monaco: 'javascript', starter: '// Collaborate in real time!\nconsole.log("Hello, team 👋");\n' },
  { key: 'typescript', label: 'TypeScript', monaco: 'typescript', starter: '// Collaborate in real time!\nconst greet = (name: string): string => `Hello, ${name}`;\nconsole.log(greet("team"));\n' },
  { key: 'python', label: 'Python', monaco: 'python', starter: '# Collaborate in real time!\nprint("Hello, team 👋")\n' },
  { key: 'java', label: 'Java', monaco: 'java', starter: 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, team");\n    }\n}\n' },
  { key: 'cpp', label: 'C++', monaco: 'cpp', starter: '#include <iostream>\nint main() {\n    std::cout << "Hello, team" << std::endl;\n    return 0;\n}\n' },
  { key: 'rust', label: 'Rust', monaco: 'rust', starter: 'fn main() {\n    println!("Hello, team");\n}\n' },
  { key: 'ruby', label: 'Ruby', monaco: 'ruby', starter: 'puts "Hello, team 👋"\n' },
  { key: 'swift', label: 'Swift', monaco: 'swift', starter: 'print("Hello, team")\n' },
];

interface Peer {
  clientID: number;
  user: CollabUser;
}

// ─── Lobby ─────────────────────────────────────────────────────────────────────

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const create = () => navigate(`/collab/${generateRoomId()}`);
  const join = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = code.trim();
    if (!raw) return toast.error('Enter a room code or invite link');
    // Accept a full link or a bare id.
    const id = raw.includes('/collab/') ? raw.split('/collab/')[1].split(/[?#]/)[0] : raw;
    navigate(`/collab/${id.trim()}`);
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles size={14} /> Live Collaboration
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Code together, in real time</h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Spin up a shared room and pair-program with live cursors, presence, a shared language,
          and one-click code execution — powered by Yjs over WebSockets.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        <motion.button
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          onClick={create}
          className="group text-left p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-cyber transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="text-white" />
          </div>
          <h2 className="text-lg font-bold mb-1">Create a room</h2>
          <p className="text-sm text-muted-foreground">Generate a fresh session and share the invite link with anyone.</p>
        </motion.button>

        <motion.form
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={join}
          className="p-6 rounded-2xl border border-border bg-card"
        >
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
            <LogIn className="text-foreground" />
          </div>
          <h2 className="text-lg font-bold mb-1">Join a room</h2>
          <p className="text-sm text-muted-foreground mb-3">Paste an invite link or enter a room code.</p>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="swift-fox-1a2b"
              className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
              Join
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

// ─── Room ──────────────────────────────────────────────────────────────────────

const Room: React.FC<{ roomId: string }> = ({ roomId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();

  const identity = useMemo<CollabUser>(() => makeIdentity(user?.name), [user?.name]);
  const ydoc = useMemo(() => new Y.Doc(), [roomId]);

  const [provider, setProvider] = useState<SocketIOProvider | null>(null);
  const [connected, setConnected] = useState(false);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [language, setLanguage] = useState('javascript');
  const [langOpen, setLangOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  const seededRef = useRef(false);

  // ── Provider lifecycle ──
  useEffect(() => {
    const p = new SocketIOProvider(API_URL, roomId, ydoc, { autoConnect: true });
    p.awareness.setLocalStateField('user', identity);
    setProvider(p);

    setConnected(p.socket.connected);
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    p.socket.on('connect', onConnect);
    p.socket.on('disconnect', onDisconnect);

    const syncPeers = () => {
      const list: Peer[] = [];
      p.awareness.getStates().forEach((state, clientID) => {
        const u = (state as { user?: CollabUser }).user;
        if (u) list.push({ clientID, user: u });
      });
      setPeers(list);
    };
    p.awareness.on('change', syncPeers);
    syncPeers();

    return () => {
      p.awareness.off('change', syncPeers);
      p.socket.off('connect', onConnect);
      p.socket.off('disconnect', onDisconnect);
      p.destroy();
      ydoc.destroy();
      setProvider(null);
      setConnected(false);
    };
  }, [roomId, ydoc, identity]);

  // ── Shared language (Yjs map) ──
  useEffect(() => {
    const cfg = ydoc.getMap('config');
    const update = () => {
      const l = cfg.get('language');
      if (typeof l === 'string') setLanguage(l);
    };
    cfg.observe(update);
    update();
    return () => cfg.unobserve(update);
  }, [ydoc]);

  const changeLanguage = useCallback((key: string) => {
    ydoc.getMap('config').set('language', key);
    setLangOpen(false);
  }, [ydoc]);

  // ── Bind Monaco <-> Yjs once both editor and provider are ready ──
  useEffect(() => {
    if (!provider || !editorReady || !editorRef.current || !monacoRef.current) return;
    const ytext = ydoc.getText('monaco');
    const binding = new YjsMonacoBinding(ytext, editorRef.current, monacoRef.current, provider.awareness);

    // Seed starter content only once, and only if we're the first one in (empty doc).
    if (!seededRef.current) {
      seededRef.current = true;
      const onSync = (isSynced: boolean) => {
        if (isSynced && ytext.length === 0) {
          const starter = LANGUAGES.find((l) => l.key === language)?.starter ?? '';
          if (starter) ytext.insert(0, starter);
        }
      };
      provider.on('sync', onSync);
    }

    return () => binding.destroy();
  }, [provider, editorReady, ydoc, language]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setEditorReady(true);
  };

  // ── Run ──
  const runMutation = useMutation({
    mutationFn: (data: { code: string; language: string }) => ideApi.runCode(data),
    onSuccess: (data) => {
      setOutput(data.output || 'Process finished with no output.');
      setShowOutput(true);
    },
    onError: (error: any) => {
      setOutput(error.response?.data?.output || error.message || 'Execution failed');
      setShowOutput(true);
    },
  });

  const handleRun = () => {
    const code = ydoc.getText('monaco').toString();
    if (!code.trim()) return toast.error('Nothing to run yet');
    setShowOutput(true);
    setOutput('Running…');
    runMutation.mutate({ code, language });
  };

  const copyInvite = async () => {
    const link = `${window.location.origin}/collab/${roomId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Invite link copied');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('Could not copy link');
    }
  };

  const langInfo = LANGUAGES.find((l) => l.key === language) ?? LANGUAGES[0];

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Top bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => navigate('/collab')} className="p-2 rounded-xl border border-border hover:bg-muted transition-colors" title="Leave room">
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
            <Code2 size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm truncate">{roomId}</p>
            <div className="flex items-center gap-1.5 text-[11px]">
              {connected ? (
                <><Wifi size={11} className="text-emerald-500" /><span className="text-emerald-500 font-semibold">Connected</span></>
              ) : (
                <><WifiOff size={11} className="text-amber-500" /><span className="text-amber-500 font-semibold">Connecting…</span></>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Presence */}
        <div className="flex items-center -space-x-2 mr-1">
          <AnimatePresence>
            {peers.slice(0, 5).map((p) => (
              <motion.div
                key={p.clientID}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                title={p.user.name}
                className="w-8 h-8 rounded-full border-2 border-card flex items-center justify-center text-[11px] font-bold text-white shadow"
                style={{ backgroundColor: p.user.color }}
              >
                {p.user.name.charAt(0).toUpperCase()}
              </motion.div>
            ))}
          </AnimatePresence>
          {peers.length > 5 && (
            <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[11px] font-bold">
              +{peers.length - 5}
            </div>
          )}
          <div className="ml-3 hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <Users size={14} /> {peers.length}
          </div>
        </div>

        {/* Language */}
        <div className="relative">
          <button onClick={() => setLangOpen((o) => !o)} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-muted transition-colors">
            {langInfo.label} <ChevronDown size={14} className={clsx('transition-transform', langOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 mt-2 w-44 max-h-72 overflow-auto rounded-xl border border-border bg-popover shadow-xl z-50 p-1"
              >
                {LANGUAGES.map((l) => (
                  <button key={l.key} onClick={() => changeLanguage(l.key)}
                    className={clsx('w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors', l.key === language && 'bg-primary/10 text-primary font-semibold')}>
                    {l.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={copyInvite} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-muted transition-colors">
          {copied ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Invite'}</span>
        </button>

        <button onClick={handleRun} disabled={runMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-[0_0_15px_rgba(16,185,129,0.25)]">
          {runMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} className="fill-current" />}
          <span className="hidden sm:inline">Run</span>
        </button>
      </div>

      {/* Editor + output */}
      <div className="flex-1 min-h-0 rounded-2xl border border-border overflow-hidden bg-card flex flex-col">
        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            language={langInfo.monaco}
            defaultValue=""
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            onMount={handleMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontLigatures: true,
              tabSize: 2,
              wordWrap: 'on',
              padding: { top: 14 },
            }}
          />
        </div>

        <AnimatePresence>
          {showOutput && (
            <motion.div
              initial={{ height: 0 }} animate={{ height: 180 }} exit={{ height: 0 }}
              className="border-t border-border bg-background/60 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/60">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Terminal size={14} /> Output
                </div>
                <button onClick={() => setShowOutput(false)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                  Hide
                </button>
              </div>
              <pre className="p-4 text-sm font-code whitespace-pre-wrap overflow-auto h-[136px] text-foreground/90">{output}</pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────

const Collaborate: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  return roomId ? <Room key={roomId} roomId={roomId} /> : <Lobby />;
};

export default Collaborate;
