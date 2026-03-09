import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useMutation } from '@tanstack/react-query';
import { Play, Loader2, Terminal, Code2, ChevronDown, Plus, Trash2, CheckCircle2, XCircle, Keyboard, BookOpen } from 'lucide-react';
import { ideApi } from '@/services/api';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

type LangKey = 'python' | 'javascript' | 'typescript' | 'java' | 'cpp' | 'rust' | 'ruby' | 'swift';

const LANGUAGES: Record<LangKey, { label: string; file: string; monacoLang: string; starter: string }> = {
  python: {
    label: 'Python 3.10', file: 'solution.py', monacoLang: 'python',
    starter: `# CodeMate IDE – Python\n\ndef solution():\n    # Write your code here\n    print("Hello, World!")\n    return "Done"\n\nsolution()\n`,
  },
  javascript: {
    label: 'JavaScript (Node.js)', file: 'solution.js', monacoLang: 'javascript',
    starter: `// CodeMate IDE – JavaScript\n\nfunction solution() {\n    // Write your code here\n    console.log("Hello, World!");\n    return "Done";\n}\n\nsolution();\n`,
  },
  typescript: {
    label: 'TypeScript', file: 'solution.ts', monacoLang: 'typescript',
    starter: `// CodeMate IDE – TypeScript\n\nfunction solution(): string {\n    // Write your code here\n    console.log("Hello, World!");\n    return "Done";\n}\n\nsolution();\n`,
  },
  java: {
    label: 'Java 17', file: 'Solution.java', monacoLang: 'java',
    starter: `// CodeMate IDE – Java\n\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n`,
  },
  cpp: {
    label: 'C++17', file: 'solution.cpp', monacoLang: 'cpp',
    starter: `// CodeMate IDE – C++\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n`,
  },
  rust: {
    label: 'Rust', file: 'solution.rs', monacoLang: 'rust',
    starter: `// CodeMate IDE – Rust\n\nfn main() {\n    println!("Hello, World!");\n}\n`,
  },
  ruby: {
    label: 'Ruby 3.2', file: 'solution.rb', monacoLang: 'ruby',
    starter: `# CodeMate IDE – Ruby\n\ndef solution\n  puts "Hello, World!"\n  "Done"\nend\n\nsolution\n`,
  },
  swift: {
    label: 'Swift 5.9', file: 'solution.swift', monacoLang: 'swift',
    starter: `// CodeMate IDE – Swift\n\nfunc solution() -> String {\n    print("Hello, World!")\n    return "Done"\n}\n\nprint(solution())\n`,
  },
};

const SHORTCUTS = [
  { key: 'Ctrl + Enter', desc: 'Run Code' },
  { key: 'Ctrl + /', desc: 'Toggle Comment' },
  { key: 'Ctrl + Z', desc: 'Undo' },
  { key: 'Shift + Alt + F', desc: 'Format Document' },
  { key: 'Ctrl + D', desc: 'Multi-select' },
];

const SNIPPETS: Record<string, { label: string; code: string }[]> = {
  python: [
    { label: 'Two Sum (HashMap)', code: 'def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target-n], i]\n        seen[n] = i' },
    { label: 'Binary Search', code: 'def binary_search(arr, target):\n    l, r = 0, len(arr) - 1\n    while l <= r:\n        m = (l + r) // 2\n        if arr[m] == target: return m\n        elif arr[m] < target: l = m + 1\n        else: r = m - 1\n    return -1' },
  ],
  javascript: [
    { label: 'Two Sum (Map)', code: 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        if (map.has(target - nums[i])) return [map.get(target - nums[i]), i];\n        map.set(nums[i], i);\n    }\n}' },
  ],
};

interface TestCase { id: string; input: string; expected: string; status?: 'pass' | 'fail' | 'pending' }

// ─── PortalDropdown ──────────────────────────────────────────────────────────
// Renders the dropdown via a React portal into document.body so it always
// appears above Monaco Editor (which sets z-index internally) and escapes
// any parent with overflow:hidden.
interface PortalDropdownProps {
  trigger: React.ReactElement;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
  minWidth?: number;
}

const PortalDropdown: React.FC<PortalDropdownProps> = ({ trigger, isOpen, onToggle, onClose, children, minWidth = 220 }) => {
  const btnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  const dropdown = isOpen ? ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.15 }}
        style={{ position: 'absolute', top: pos.top, left: pos.left, minWidth, zIndex: 9999 }}
        className="bg-card border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {children}
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <div ref={btnRef} style={{ position: 'relative', display: 'inline-block' }}>
      {React.cloneElement(trigger, { onClick: onToggle })}
      {dropdown}
    </div>
  );
};

const IDE: React.FC = () => {
  const { theme } = useTheme();
  const [lang, setLang] = useState<LangKey>('python');
  const [code, setCode] = useState(LANGUAGES.python.starter);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: 'tc1', input: '[2,7,11,15]\n9', expected: '[0,1]', status: undefined },
    { id: 'tc2', input: '[3,2,4]\n6', expected: '[1,2]', status: undefined },
  ]);
  const [activePanel, setActivePanel] = useState<'output' | 'tests'>('output');

  const langInfo = LANGUAGES[lang];

  const handleLangChange = (l: LangKey) => {
    setLang(l);
    setCode(LANGUAGES[l].starter);
    setOutput('');
    setShowLangMenu(false);
  };

  const runMutation = useMutation({
    mutationFn: (data: { code: string; language: string }) => ideApi.runCode(data),
    onSuccess: (data) => {
      setOutput(data.output || 'Process finished with no output.');
      setIsRunning(false);
      toast.success('Execution complete');
    },
    onError: (error: any) => {
      setOutput(error.response?.data?.output || error.message || 'Execution failed');
      setIsRunning(false);
      toast.error('Execution failed');
    },
  });

  const handleRun = useCallback(() => {
    if (!code.trim()) { toast.error('Please write some code first'); return; }
    setIsRunning(true);
    setOutput('');
    setActivePanel('output');
    runMutation.mutate({ code, language: lang });
  }, [code, lang]);

  const handleRunTests = () => {
    setActivePanel('tests');
    setTestCases(tc => tc.map(t => ({ ...t, status: 'pending' })));
    // Simulate test results
    setTimeout(() => {
      setTestCases(tc => tc.map((t, i) => ({ ...t, status: i === 0 ? 'pass' : 'fail' })));
      toast.success('Tests completed');
    }, 1200);
  };

  const addTestCase = () => {
    setTestCases(tc => [...tc, { id: `tc${Date.now()}`, input: '', expected: '', status: undefined }]);
  };
  const removeTestCase = (id: string) => setTestCases(tc => tc.filter(t => t.id !== id));

  return (
    <div className={clsx('flex flex-col gap-4', 'h-full min-h-0')}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 shrink-0 glass-card-premium p-4 rounded-3xl shadow-cyber" style={{ background: 'linear-gradient(135deg, rgba(20,20,30,0.6) 0%, rgba(30,30,40,0.4) 100%)' }}>
        <div className="flex items-center gap-3">
          <Terminal className="text-primary w-6 h-6 drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
          <div>
            <h1 className="text-lg font-black text-foreground leading-none">CodeMate IDE</h1>
            <p className="text-[10px] text-muted-foreground">Write, run, and test real code</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 px-4">
          {/* Language Picker — portal-based to avoid overflow:hidden clipping */}
          <PortalDropdown
            trigger={
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-muted transition-colors"
              >
                <Code2 size={14} className="text-primary" />
                {langInfo.label}
                <ChevronDown size={13} />
              </button>
            }
            isOpen={showLangMenu}
            onToggle={() => setShowLangMenu(d => !d)}
            onClose={() => setShowLangMenu(false)}
          >
            {(Object.keys(LANGUAGES) as LangKey[]).map(l => (
              <button key={l} onClick={() => handleLangChange(l)}
                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors ${lang === l ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'}`}
              >
                {LANGUAGES[l].label}
              </button>
            ))}
          </PortalDropdown>

          {/* Run Tests */}
          <button onClick={handleRunTests} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-muted transition-colors">
            <CheckCircle2 size={14} className="text-emerald-500" /> Run Tests
          </button>

          {/* Snippets — also portal-based */}
          <PortalDropdown
            trigger={
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-muted transition-colors">
                <BookOpen size={14} /> Snippets
              </button>
            }
            isOpen={showSnippets && !!SNIPPETS[lang]}
            onToggle={() => setShowSnippets(d => !d)}
            onClose={() => setShowSnippets(false)}
          >
            {(SNIPPETS[lang] ?? []).map((s, i) => (
              <button key={i} onClick={() => { setCode(code + '\n\n' + s.code); setShowSnippets(false); }}
                className="w-full px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors text-foreground"
              >
                {s.label}
              </button>
            ))}
          </PortalDropdown>

          {/* Shortcuts */}
          <button onClick={() => setShowShortcuts(d => !d)} className="p-2 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground">
            <Keyboard size={15} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleRun} disabled={isRunning}
            className={clsx(
              'flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-cyber glow-button active:scale-95 disabled:opacity-50 overflow-hidden relative group',
              'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {isRunning ? <Loader2 className="animate-spin w-4 h-4 z-10 relative" /> : <Play className="w-4 h-4 fill-current z-10 relative" />}
            <span className="z-10 relative">{isRunning ? 'Running…' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Shortcuts Panel */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="rounded-xl border border-border bg-card/50 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-wrap gap-6">
              {SHORTCUTS.map(s => (
                <div key={s.key} className="flex items-center gap-2 text-xs">
                  <kbd className="px-2 py-0.5 rounded bg-muted border border-border font-mono font-bold text-foreground">{s.key}</kbd>
                  <span className="text-muted-foreground">{s.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-0 overflow-hidden">
        {/* Editor (3 cols) */}
        <div className="lg:col-span-3 flex flex-col rounded-3xl overflow-hidden glass-card-premium shadow-cyber min-h-[400px] hover:shadow-cyber-strong transition-all duration-300 border border-white/5">
          <div className="px-5 py-3 border-b border-white/10 bg-black/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-sm">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">{langInfo.file}</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={langInfo.monacoLang}
              value={code}
              onChange={v => setCode(v || '')}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                fontLigatures: true,
                tabSize: 2,
                wordWrap: 'on',
                snippetSuggestions: 'top',
                wordBasedSuggestions: 'allDocuments',
                parameterHints: { enabled: true },
                formatOnType: true,
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>
        </div>

        {/* Right Panel (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          {/* Panel Tabs */}
          <div className="flex gap-1 rounded-2xl glass-card p-1.5 shrink-0 shadow-inner border border-white/5">
            <button onClick={() => setActivePanel('output')}
              className={clsx('flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors', activePanel === 'output' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50')}
            >
              Console
            </button>
            <button onClick={() => setActivePanel('tests')}
              className={clsx('flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors', activePanel === 'tests' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50')}
            >
              Test Cases
            </button>
          </div>

          {/* Output Console */}
          {activePanel === 'output' && (
            <div className="flex-1 flex flex-col rounded-3xl overflow-hidden glass-card-premium shadow-cyber min-h-[300px] hover:shadow-cyber-strong transition-all duration-300 border border-white/5 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <div className="px-5 py-3 border-b border-white/10 bg-black/20 flex justify-between items-center shrink-0 relative z-10">
                <span className="font-mono text-xs text-white/70 uppercase font-bold tracking-wider">Output</span>
                {output && (
                  <button onClick={() => setOutput('')} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                    Clear
                  </button>
                )}
              </div>
              <div className="flex-1 p-5 overflow-auto font-mono text-sm relative z-10">
                <AnimatePresence mode="popLayout">
                  {output ? (
                    <motion.pre
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="whitespace-pre-wrap text-white/90"
                    >
                      {output}
                    </motion.pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 gap-2">
                      <Terminal size={28} />
                      <p className="text-sm">Run your code to see output</p>
                      <p className="text-xs">Ctrl + Enter to run</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Test Cases */}
          {activePanel === 'tests' && (
            <div className="flex-1 flex flex-col rounded-3xl overflow-hidden glass-card-premium shadow-cyber min-h-[300px] hover:shadow-cyber-strong transition-all duration-300 border border-white/5 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
              <div className="px-5 py-3 border-b border-white/10 bg-black/20 flex justify-between items-center shrink-0 relative z-10">
                <span className="font-mono text-xs text-white/70 uppercase font-bold tracking-wider">Test Cases</span>
                <button onClick={addTestCase} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">
                  <Plus size={12} /> Add
                </button>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-custom p-4 space-y-4 relative z-10">
                <AnimatePresence>
                  {testCases.map((tc, i) => (
                    <motion.div key={tc.id}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className={clsx(
                        'rounded-2xl border p-4 space-y-3 transition-colors glass-card',
                        tc.status === 'pass' && 'border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
                        tc.status === 'fail' && 'border-red-500/40 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
                        !tc.status && 'border-white/10 bg-white/5 hover:border-white/20',
                      )}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground">Case {i + 1}</span>
                        <div className="flex items-center gap-2">
                          {tc.status === 'pass' && <CheckCircle2 size={13} className="text-emerald-500" />}
                          {tc.status === 'fail' && <XCircle size={13} className="text-red-500" />}
                          <button onClick={() => removeTestCase(tc.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-semibold mb-0.5">Input</p>
                        <textarea value={tc.input}
                          onChange={e => setTestCases(tcs => tcs.map(t => t.id === tc.id ? { ...t, input: e.target.value } : t))}
                          className="w-full text-xs font-mono bg-transparent border border-border rounded-lg px-2 py-1.5 text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/40"
                          rows={2}
                        />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-semibold mb-0.5">Expected Output</p>
                        <input value={tc.expected}
                          onChange={e => setTestCases(tcs => tcs.map(t => t.id === tc.id ? { ...t, expected: e.target.value } : t))}
                          className="w-full text-xs font-mono bg-transparent border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="p-4 border-t border-white/10 shrink-0 relative z-10 bg-black/20">
                <button onClick={handleRunTests} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 size={16} /> Run All Tests
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDE;
