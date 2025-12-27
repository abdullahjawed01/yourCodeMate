import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Play, Loader2, Terminal, Code2 } from 'lucide-react';
import { ideApi } from '@/services/api';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const IDE: React.FC = () => {
  const [language, setLanguage] = useState<'python' | 'javascript'>('python');
  const [code, setCode] = useState(`# Welcome to CodeMate IDE
# Write your Python code here and click Run to execute

def hello_world():
    print("Hello, World!")
    return "Code executed successfully!"

hello_world()
`);

  // Update default code when language changes
  const handleLanguageChange = (newLang: 'python' | 'javascript') => {
    setLanguage(newLang);
    if (newLang === 'python') {
      setCode(`# Welcome to CodeMate IDE
# Write your Python code here and click Run to execute

def hello_world():
    print("Hello, World!")
    return "Code executed successfully!"

hello_world()
`);
    } else {
      setCode(`// Welcome to CodeMate IDE
// Write your JavaScript code here and click Run to execute

function helloWorld() {
    console.log("Hello, World!");
    return "Code executed successfully!";
}

helloWorld();
`);
    }
  };

  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const runMutation = useMutation({
    mutationFn: (data: { code: string; language: string }) => ideApi.runCode(data),
    onSuccess: (data) => {
      setOutput(data.output || "Process finished with no output.");
      setIsRunning(false);
      toast.success('Execution complete');
    },
    onError: (error: any) => {
      setOutput(error.response?.data?.output || error.message || 'Execution failed');
      setIsRunning(false);
      toast.error('Execution failed');
    },
  });

  const handleRun = () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }
    setIsRunning(true);
    setOutput('');
    runMutation.mutate({ code, language });
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Terminal className="text-primary-600 dark:text-primary-400" />
            CodeMate IDE
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Write and execute real code securely.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as 'python' | 'javascript')}
            className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="python">Python 3.10</option>
            <option value="javascript">JavaScript (Node.js)</option>
          </select>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={clsx(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:active:scale-100",
              "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isRunning ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Editor */}
        <div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <Code2 className="w-4 h-4" />
              <span>{language === 'python' ? 'main.py' : 'index.js'}</span>
            </div>
            <span className="text-xs text-zinc-400">{language === 'python' ? 'Python 3.10' : 'Node.js v18'}</span>
          </div>
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              defaultLanguage={language}
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16 },
                smoothScrolling: true,
              }}
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-50 overflow-hidden shadow-sm">
          <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <Terminal className="w-4 h-4" />
              <span>Console Output</span>
            </div>
            {output && (
              <button
                onClick={() => setOutput('')}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-auto custom-scrollbar">
            {output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                <Play className="w-12 h-12 mb-4 opacity-20" />
                <p>Run your code to see output here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDE;
