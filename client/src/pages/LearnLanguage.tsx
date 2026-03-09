import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import {
    Menu, ChevronLeft, ChevronRight, Play, CheckCircle2,
    Lock, Zap, Clock, Code2, Terminal, RefreshCw, Trophy,
    BookOpen, ChevronDown, ChevronUp, Lightbulb, X, RotateCcw,
    Award
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { learningApi } from '@/services/api';
import JS_CURRICULUM, { Module, Lesson } from '@/data/jsCurriculum';

// ─── Language config ───────────────────────────────────────────────────────────

const LanguageConfig: Record<string, { name: string; monacoLanguage: string; icon: React.FC<any>; color: string; accentClass: string }> = {
    python: { name: 'Python', monacoLanguage: 'python', icon: Terminal, color: 'text-blue-500', accentClass: 'from-blue-500 to-cyan-500' },
    javascript: { name: 'JavaScript', monacoLanguage: 'javascript', icon: Code2, color: 'text-yellow-400', accentClass: 'from-yellow-400 to-orange-500' },
    typescript: { name: 'TypeScript', monacoLanguage: 'typescript', icon: Code2, color: 'text-blue-600', accentClass: 'from-blue-500 to-indigo-600' },
    java: { name: 'Java', monacoLanguage: 'java', icon: Terminal, color: 'text-orange-500', accentClass: 'from-orange-500 to-amber-500' },
    cpp: { name: 'C++', monacoLanguage: 'cpp', icon: Terminal, color: 'text-indigo-500', accentClass: 'from-indigo-500 to-purple-600' },
    rust: { name: 'Rust', monacoLanguage: 'rust', icon: Terminal, color: 'text-orange-600', accentClass: 'from-orange-600 to-red-700' },
    ruby: { name: 'Ruby', monacoLanguage: 'ruby', icon: Terminal, color: 'text-red-500', accentClass: 'from-red-500 to-rose-600' },
    swift: { name: 'Swift', monacoLanguage: 'swift', icon: Terminal, color: 'text-orange-400', accentClass: 'from-orange-400 to-yellow-500' },
};

// ─── JS Lesson Content View ────────────────────────────────────────────────────

interface JSLessonViewProps {
    module: Module;
    lesson: Lesson;
    monacoLang: string;
    onComplete: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    hasNext: boolean;
    hasPrev: boolean;
    isCompleted: boolean;
}

const JSLessonView: React.FC<JSLessonViewProps> = ({
    module, lesson, monacoLang, onComplete, onNext, onPrev, hasNext, hasPrev, isCompleted
}) => {
    const [editorCode, setEditorCode] = useState(lesson.codeExample);
    const [exerciseCode, setExerciseCode] = useState(lesson.exerciseStarter);
    const [output, setOutput] = useState('');
    const [exerciseOutput, setExerciseOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isRunningExercise, setIsRunningExercise] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [activeTab, setActiveTab] = useState<'example' | 'exercise'>('example');

    useEffect(() => {
        setEditorCode(lesson.codeExample);
        setExerciseCode(lesson.exerciseStarter);
        setOutput('');
        setExerciseOutput('');
        setShowHint(false);
        setActiveTab('example');
    }, [lesson.id]);

    const runCode = async (code: string, isExercise: boolean) => {
        if (isExercise) setIsRunningExercise(true);
        else setIsRunning(true);

        // Simulate code output for display
        try {
            const lines: string[] = [];
            const fakeConsole = {
                log: (...args: any[]) => lines.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
                error: (...args: any[]) => lines.push('ERROR: ' + args.join(' ')),
                warn: (...args: any[]) => lines.push('WARN: ' + args.join(' ')),
            };

            // Safe evaluation using Function constructor
            const fn = new Function('console', code);
            fn(fakeConsole);

            const result = lines.join('\n') || '(no output)';
            if (isExercise) setExerciseOutput(result);
            else setOutput(result);
        } catch (err: any) {
            const msg = `❌ ${err.message}`;
            if (isExercise) setExerciseOutput(msg);
            else setOutput(msg);
        } finally {
            if (isExercise) setIsRunningExercise(false);
            else setIsRunning(false);
        }
    };

    return (
        <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 pb-24"
        >
            {/* Lesson Header */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 p-6 bg-black/30">
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color === 'text-yellow-400' ? 'from-yellow-400/5' : 'from-purple-500/5'} to-transparent pointer-events-none`} />
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 bg-white/5 ${module.color}`}>
                        {module.icon} Module {module.number}
                    </span>
                    <span className="text-xs text-white/40 flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        <Clock size={11} /> {lesson.estimatedMinutes} min
                    </span>
                    <span className="text-xs text-yellow-400 font-bold flex items-center gap-1.5 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                        <Zap size={11} /> +{lesson.xp} XP
                    </span>
                    {isCompleted && (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                            <CheckCircle2 size={11} /> Completed
                        </span>
                    )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 leading-tight">{lesson.title}</h1>
                <p className="text-white/50 text-base leading-relaxed">{lesson.description}</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2">
                {(['example', 'exercise'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={clsx(
                            'px-4 py-2 rounded-xl text-sm font-bold transition-all',
                            activeTab === tab
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-white/40 hover:text-white hover:bg-white/5 border border-white/5'
                        )}
                    >
                        {tab === 'example' ? '📖 Learn' : '💡 Practice'}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'example' ? (
                    <motion.div key="example" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                        {/* Markdown Content */}
                        <div className="rounded-2xl border border-white/8 bg-black/30 p-6 lg:p-8">
                            <div className="prose dark:prose-invert max-w-none
                                prose-headings:text-white prose-headings:font-black
                                prose-h2:text-2xl prose-h3:text-xl prose-h3:text-yellow-300
                                prose-p:text-zinc-300 prose-p:leading-relaxed
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-white prose-strong:font-bold
                                prose-code:text-yellow-300 prose-code:bg-yellow-400/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm before:prose-code:content-none after:prose-code:content-none
                                prose-pre:bg-[#0d0f1a] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-4
                                prose-ul:text-zinc-300 prose-li:marker:text-primary prose-li:my-1
                                prose-table:text-sm prose-th:text-white prose-th:bg-white/5 prose-td:text-zinc-300 prose-td:border-white/10 prose-th:border-white/10
                                prose-blockquote:border-l-yellow-400 prose-blockquote:bg-yellow-400/5 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-xl prose-blockquote:text-zinc-300
                            ">
                                <ReactMarkdown>{lesson.content}</ReactMarkdown>
                            </div>
                        </div>

                        {/* Interactive Code Example */}
                        <div className="rounded-2xl border border-white/8 overflow-hidden shadow-xl">
                            <div className="flex items-center justify-between px-5 py-3 bg-[#0d0f1a] border-b border-white/8">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/70" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                                    </div>
                                    <span className="text-white/40 text-xs font-mono ml-2">example.js</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setEditorCode(lesson.codeExample)} className="p-1.5 text-white/30 hover:text-white/60 transition-colors" title="Reset">
                                        <RotateCcw size={13} />
                                    </button>
                                    <button
                                        onClick={() => runCode(editorCode, false)}
                                        disabled={isRunning}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg text-xs font-bold transition-all"
                                    >
                                        {isRunning ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} className="fill-current" />}
                                        Run
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#0a0c14]">
                                <div className="h-[280px] border-b lg:border-b-0 lg:border-r border-white/8">
                                    <Editor
                                        height="100%"
                                        language={monacoLang}
                                        theme="vs-dark"
                                        value={editorCode}
                                        onChange={v => setEditorCode(v || '')}
                                        options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 12 }, scrollBeyondLastLine: false, lineNumbers: 'on' }}
                                    />
                                </div>
                                <div className="h-[280px] p-4 font-mono text-sm overflow-y-auto">
                                    <div className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                                        <Terminal size={12} /> Console Output
                                    </div>
                                    {output ? (
                                        <motion.pre key="out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`whitespace-pre-wrap text-sm ${output.startsWith('❌') ? 'text-red-400' : 'text-emerald-300'}`}>
                                            {output}
                                        </motion.pre>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-white/20 gap-2">
                                            <Play size={24} className="opacity-30" />
                                            <p className="text-xs">Click Run to execute</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="exercise" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                        {/* Exercise prompt */}
                        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <BookOpen size={16} className="text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-purple-300 mb-2">💡 Your Challenge</h3>
                                    <p className="text-white/70 text-sm leading-relaxed">{lesson.exercise}</p>
                                </div>
                            </div>
                        </div>

                        {/* Hint toggle */}
                        <button
                            onClick={() => setShowHint(h => !h)}
                            className="flex items-center gap-2 text-sm text-yellow-400/70 hover:text-yellow-400 transition-colors"
                        >
                            <Lightbulb size={15} />
                            {showHint ? 'Hide Hint' : 'Show Hint'}
                        </button>
                        <AnimatePresence>
                            {showHint && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                    className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-3 text-sm text-yellow-200/70 overflow-hidden"
                                >
                                    💡 Look at the code example above for the pattern. Start small — get one thing working first, then build on it.
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Exercise editor */}
                        <div className="rounded-2xl border border-white/8 overflow-hidden shadow-xl">
                            <div className="flex items-center justify-between px-5 py-3 bg-[#0d0f1a] border-b border-white/8">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/70" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                                    </div>
                                    <span className="text-white/40 text-xs font-mono ml-2">practice.js</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setExerciseCode(lesson.exerciseStarter)} className="p-1.5 text-white/30 hover:text-white/60 transition-colors" title="Reset">
                                        <RotateCcw size={13} />
                                    </button>
                                    <button
                                        onClick={() => runCode(exerciseCode, true)}
                                        disabled={isRunningExercise}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500 text-purple-400 hover:text-white rounded-lg text-xs font-bold transition-all"
                                    >
                                        {isRunningExercise ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} className="fill-current" />}
                                        Test
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#0a0c14]">
                                <div className="h-[320px] border-b lg:border-b-0 lg:border-r border-white/8">
                                    <Editor
                                        height="100%"
                                        language={monacoLang}
                                        theme="vs-dark"
                                        value={exerciseCode}
                                        onChange={v => setExerciseCode(v || '')}
                                        options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 12 }, scrollBeyondLastLine: false }}
                                    />
                                </div>
                                <div className="h-[320px] p-4 font-mono text-sm overflow-y-auto">
                                    <div className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                                        <Terminal size={12} /> Your Output
                                    </div>
                                    {exerciseOutput ? (
                                        <motion.pre key="eout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`whitespace-pre-wrap text-sm ${exerciseOutput.startsWith('❌') ? 'text-red-400' : 'text-cyan-300'}`}>
                                            {exerciseOutput}
                                        </motion.pre>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-white/20 gap-2">
                                            <Code2 size={24} className="opacity-30" />
                                            <p className="text-xs">Write your solution above and hit Test</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-white/8">
                <button
                    onClick={onPrev}
                    disabled={!hasPrev}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold"
                >
                    <ChevronLeft size={16} /> Previous
                </button>

                {!isCompleted ? (
                    <button
                        onClick={onComplete}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        <CheckCircle2 size={16} /> Mark Complete & Earn {lesson.xp} XP
                    </button>
                ) : (
                    <button
                        onClick={onNext}
                        disabled={!hasNext}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-black text-sm hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        Next Lesson <ChevronRight size={16} />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const LearnLanguage: React.FC = () => {
    const { langId } = useParams<{ langId: string }>();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedModuleId, setSelectedModuleId] = useState(JS_CURRICULUM[0].id);
    const [selectedLessonId, setSelectedLessonId] = useState(JS_CURRICULUM[0].lessons[0].id);
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([JS_CURRICULUM[0].id]));
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

    // Backend topic state (for non-JS languages)
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    const config = LanguageConfig[langId || 'javascript'] || LanguageConfig['javascript'];
    const isJavaScript = langId === 'javascript';

    const { data, isLoading } = useQuery({
        queryKey: ['learning', langId],
        queryFn: () => learningApi.getTopics(langId || 'javascript'),
        enabled: !!langId && !isJavaScript,
    });

    const topics = data?.topics || [];
    const currentTopic = topics.find((t: any) => t._id === selectedTopicId) || topics[0];

    useEffect(() => {
        if (topics.length > 0 && !selectedTopicId) setSelectedTopicId(topics[0]._id);
    }, [topics]);



    // JS curriculum helpers
    const currentModule = JS_CURRICULUM.find(m => m.id === selectedModuleId) || JS_CURRICULUM[0];
    const currentLesson = currentModule.lessons.find(l => l.id === selectedLessonId) || currentModule.lessons[0];

    const allLessons = JS_CURRICULUM.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })));
    const currentIdx = allLessons.findIndex(l => l.id === selectedLessonId);
    const hasNext = currentIdx < allLessons.length - 1;
    const hasPrev = currentIdx > 0;

    const selectLesson = (moduleId: string, lessonId: string) => {
        setSelectedModuleId(moduleId);
        setSelectedLessonId(lessonId);
    };

    const goNext = () => {
        if (hasNext) {
            const next = allLessons[currentIdx + 1];
            selectLesson(next.moduleId, next.id);
            setExpandedModules(prev => new Set([...prev, next.moduleId]));
        }
    };

    const goPrev = () => {
        if (hasPrev) {
            const prev = allLessons[currentIdx - 1];
            selectLesson(prev.moduleId, prev.id);
            setExpandedModules(prev2 => new Set([...prev2, prev.moduleId]));
        }
    };

    const handleJSComplete = () => {
        setCompletedLessons(prev => new Set([...prev, selectedLessonId]));
        toast.success(`🎉 Lesson complete! +${currentLesson.xp} XP`);
        if (hasNext) setTimeout(goNext, 800);
    };

    const totalLessons = allLessons.length;
    const completedCount = completedLessons.size;
    const progressPct = (completedCount / totalLessons) * 100;

    if (isLoading && !isJavaScript) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // ── JS Course UI ──
    if (isJavaScript) {
        return (
            <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-3xl border border-white/10 shadow-2xl relative bg-[#080910]">

                {/* Collapsible Sidebar */}
                <AnimatePresence initial={false}>
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 300, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
                            className="flex flex-col h-full bg-[#0c0e16] border-r border-white/5 shrink-0 overflow-hidden"
                        >
                            {/* Sidebar header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0a0c13]">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                                        <span className="text-black text-xs font-black">JS</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-sm leading-tight">JavaScript</p>
                                        <p className="text-white/30 text-[10px]">Complete Course</p>
                                    </div>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className="p-1.5 text-white/30 hover:text-white/60 rounded-lg hover:bg-white/5 transition-all">
                                    <X size={15} />
                                </button>
                            </div>

                            {/* Progress */}
                            <div className="px-4 py-3 border-b border-white/5">
                                <div className="flex justify-between text-xs mb-2 text-white/40 font-semibold">
                                    <span>Progress</span>
                                    <span className="text-primary">{completedCount}/{totalLessons} lessons</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPct}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>

                            {/* Module list */}
                            <div className="flex-1 overflow-y-auto py-2 space-y-1 px-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                                {JS_CURRICULUM.map(mod => {
                                    const isExpanded = expandedModules.has(mod.id);
                                    const modCompleted = mod.lessons.filter(l => completedLessons.has(l.id)).length;

                                    return (
                                        <div key={mod.id}>
                                            {/* Module header */}
                                            <button
                                                onClick={() => setExpandedModules(prev => {
                                                    const s = new Set(prev);
                                                    s.has(mod.id) ? s.delete(mod.id) : s.add(mod.id);
                                                    return s;
                                                })}
                                                className={clsx(
                                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all",
                                                    "hover:bg-white/5",
                                                    selectedModuleId === mod.id ? "bg-white/5" : ""
                                                )}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-base">{mod.icon}</span>
                                                    <div className="text-left">
                                                        <p className="text-xs font-black text-white/80 leading-tight">{mod.title}</p>
                                                        <p className="text-[10px] text-white/30">{modCompleted}/{mod.lessons.length} done</p>
                                                    </div>
                                                </div>
                                                {isExpanded ? <ChevronUp size={13} className="text-white/30" /> : <ChevronDown size={13} className="text-white/30" />}
                                            </button>

                                            {/* Lessons */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden ml-2 pl-3 border-l border-white/5 mt-1 mb-1 space-y-0.5"
                                                    >
                                                        {mod.lessons.map(lesson => {
                                                            const done = completedLessons.has(lesson.id);
                                                            const active = selectedLessonId === lesson.id;
                                                            return (
                                                                <button
                                                                    key={lesson.id}
                                                                    onClick={() => selectLesson(mod.id, lesson.id)}
                                                                    className={clsx(
                                                                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all text-xs",
                                                                        active
                                                                            ? "bg-primary/15 text-primary border border-primary/20"
                                                                            : "text-white/40 hover:text-white hover:bg-white/5"
                                                                    )}
                                                                >
                                                                    <div className={clsx(
                                                                        "w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0",
                                                                        done ? "bg-emerald-500/20 border-emerald-500/50" : active ? "border-primary/50" : "border-white/10"
                                                                    )}>
                                                                        {done ? <CheckCircle2 size={10} className="text-emerald-400" /> : null}
                                                                    </div>
                                                                    <span className="truncate font-medium">{lesson.title}</span>
                                                                    <span className="ml-auto text-[10px] text-yellow-400/60">+{lesson.xp}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Completion badge */}
                            {completedCount === totalLessons && (
                                <div className="p-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
                                        <Award size={20} className="text-yellow-400" />
                                        <div>
                                            <p className="text-xs font-black text-yellow-300">Course Complete!</p>
                                            <p className="text-[10px] text-yellow-400/60">You've mastered JavaScript</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main content */}
                <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
                    {/* Top bar */}
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5 bg-[#0a0c13] shrink-0">
                        {!sidebarOpen && (
                            <button onClick={() => setSidebarOpen(true)} className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                                <Menu size={18} />
                            </button>
                        )}
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-white/30 text-sm">{currentModule.icon}</span>
                            <span className="text-white/30 text-sm">→</span>
                            <span className="text-white text-sm font-bold truncate">{currentLesson.title}</span>
                        </div>
                        <div className="ml-auto flex items-center gap-3">
                            <span className="text-xs text-white/30">Lesson {currentIdx + 1}/{totalLessons}</span>
                        </div>
                    </div>

                    {/* Lesson content */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                        <div className="max-w-4xl mx-auto">
                            <JSLessonView
                                module={currentModule}
                                lesson={currentLesson}
                                monacoLang="javascript"
                                onComplete={handleJSComplete}
                                onNext={goNext}
                                onPrev={goPrev}
                                hasNext={hasNext}
                                hasPrev={hasPrev}
                                isCompleted={completedLessons.has(selectedLessonId)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Non-JS: Backend-driven UI (other languages) ──

    if (!topics.length) {
        return (
            <div className="flex flex-col h-[80vh] items-center justify-center text-center space-y-4">
                <Trophy className="w-16 h-16 text-zinc-400" />
                <h2 className="text-2xl font-bold">No Content Available</h2>
                <p className="text-zinc-500">The curriculum for {config.name} is currently under construction.</p>
                <button onClick={() => navigate('/paths')} className="text-primary hover:underline">
                    Return to Learning Paths
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-3rem)] overflow-hidden rounded-3xl glass-surface border border-white/10 shadow-2xl relative">
            <AnimatePresence initial={false}>
                {sidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 300, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="border-r border-border bg-card flex flex-col h-full shrink-0"
                    >
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <config.icon className={clsx("w-5 h-5", config.color)} />
                                <span className="font-bold">{config.name} Tutorial</span>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-muted rounded text-muted-foreground">
                                <ChevronLeft size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
                            {topics.map((topic: any, idx: number) => (
                                <button
                                    key={topic._id}
                                    onClick={() => { if (topic.unlocked) setSelectedTopicId(topic._id); }}
                                    disabled={!topic.unlocked}
                                    className={clsx(
                                        "w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-all text-sm border border-transparent",
                                        !topic.unlocked && "opacity-40 cursor-not-allowed",
                                        selectedTopicId === topic._id
                                            ? "glass-card shadow-cyber border-primary/30 text-white"
                                            : "hover:bg-white/5 hover:border-white/10 text-zinc-400 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className="text-xs opacity-70 w-4">{idx + 1}.</span>
                                        <span className="truncate">{topic.title}</span>
                                    </div>
                                    {topic.completed ? <CheckCircle2 size={16} className="text-emerald-500/50" /> : !topic.unlocked ? <Lock size={14} className="text-muted-foreground" /> : null}
                                </button>
                            ))}
                        </div>
                        <div className="p-5 border-t border-white/5 bg-black/20">
                            <div className="flex justify-between items-center text-xs text-white/50 font-bold uppercase mb-3">
                                <span>Progress</span>
                                <span className="text-primary">{topics.filter((t: any) => t.completed).length} / {topics.length}</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000"
                                    style={{ width: `${(topics.filter((t: any) => t.completed).length / topics.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative bg-black/40">
                {!sidebarOpen && (
                    <div className="h-14 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center px-4 gap-3 shrink-0">
                        <button onClick={() => setSidebarOpen(true)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground">
                            <Menu size={18} />
                        </button>
                        <div className="flex items-center gap-2 font-medium">
                            <config.icon className={clsx("w-4 h-4", config.color)} />
                            {config.name} Tutorial
                        </div>
                    </div>
                )}
                {currentTopic ? (
                    <div className={clsx("flex-1 overflow-y-auto p-4 lg:p-8", !sidebarOpen && "pt-16")}>
                        <div className="max-w-4xl mx-auto space-y-10 pb-24">
                            <div>
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <div className="flex flex-wrap items-center gap-4 text-sm mb-6 border-b border-white/10 pb-6">
                                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-zinc-300 font-medium border border-white/10">
                                            <Clock size={14} className="text-blue-400" /> {currentTopic.estimatedTime} mins
                                        </span>
                                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 font-bold border border-yellow-500/20">
                                            <Zap size={14} /> {currentTopic.pointsReward} XP
                                        </span>
                                    </div>
                                    <h1 className="text-4xl lg:text-5xl font-black mb-5 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">{currentTopic.title}</h1>
                                    <p className="text-xl text-zinc-400 leading-relaxed max-w-3xl">{currentTopic.description}</p>
                                </motion.div>
                            </div>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="prose dark:prose-invert max-w-none prose-headings:text-white prose-p:text-zinc-300 prose-code:text-primary-400 prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md before:prose-code:content-none after:prose-code:content-none prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl"
                            >
                                <ReactMarkdown>{currentTopic.content}</ReactMarkdown>
                            </motion.div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default LearnLanguage;
