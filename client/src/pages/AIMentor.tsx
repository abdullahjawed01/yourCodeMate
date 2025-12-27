import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { aiMentorApi } from '@/services/api';
import toast from 'react-hot-toast';
// @ts-ignore
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';

const AIMentor: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: "Hello! I'm your AI Coding Mentor. \n\nI can help you with:\n- Debugging code\n- Explaining concepts\n- Architecture advice\n- Best practices\n\nWhat are you working on today?" }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: (data: { question: string }) => aiMentorApi.askMentor(data),
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    },
    onError: () => {
      setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, but I encountered an error. Please try asking again." }]);
      toast.error('Failed to get response');
    }
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || mutation.isPending) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    mutation.mutate({ question: userMsg });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
          <Bot size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold">AI Mentor</h1>
          <p className="text-zinc-500 text-sm">Powered by Llama 3 on Groq</p>
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "flex gap-4 max-w-3xl",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} className="text-indigo-500" />}
              </div>

              <div className={clsx(
                "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                msg.role === 'user'
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-tl-none"
              )}>
                <ReactMarkdown
                  className={clsx("prose max-w-none text-sm", msg.role === 'user' ? "prose-invert" : "dark:prose-invert")}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}

          {mutation.isPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                <Loader2 size={16} className="animate-spin text-indigo-500" />
              </div>
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-sm text-zinc-500">
                <span>Thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about code, errors, or concepts..."
            className="w-full pl-4 pr-12 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || mutation.isPending}
            className="absolute right-2 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-center text-zinc-400 mt-2">
          AI responses may vary. Always double-check critical code.
        </p>
      </form>
    </div>
  );
};

export default AIMentor;
