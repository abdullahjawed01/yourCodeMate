import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Play, Loader2, Terminal, Code2 } from 'lucide-react';
import { ideApi } from '@/services/api';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

import { useTheme } from '@/contexts/ThemeContext';

const IDE: React.FC = () => {
  const { theme } = useTheme();
  const [language, setLanguage] = useState<'python' | 'javascript'>('python');
  const [code, setCode] = useState(`# Welcome to CodeMate IDE
# Write your Python code here and click Run to execute

def hello_world():
    print("Hello, World!")
    return "Code executed successfully!"

hello_world()
`);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (newLang: 'python' | 'javascript') => {
    setLanguage(newLang);
    setCode(
      newLang === 'python'
        ? `# Welcome to CodeMate IDE
# Write your Python code here and click Run to execute

def hello_world():
    print("Hello, World!")
    return "Code executed successfully!"

hello_world()
`
        : `// Welcome to CodeMate IDE
// Write your JavaScript code here and click Run to execute

function helloWorld() {
    console.log("Hello, World!");
    return "Code executed successfully!";
}

helloWorld();
`
    );
  };

  const runMutation = useMutation({
    mutationFn: (data: { code: string; language: string }) =>
      ideApi.runCode(data),
    onSuccess: (data) => {
      setOutput(data.output || 'Process finished with no output.');
      setIsRunning(false);
      toast.success('Execution complete');
    },
    onError: (error: any) => {
      setOutput(
        error.response?.data?.output ||
          error.message ||
          'Execution failed'
      );
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
    <div className="h-full w-full flex flex-col gap-6 min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
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
            onChange={(e) =>
              handleLanguageChange(
                e.target.value as 'python' | 'javascript'
              )
            }
            className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="python">Python 3.10</option>
            <option value="javascript">JavaScript (Node.js)</option>
          </select>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className={clsx(
              'flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50',
              'bg-primary text-primary-foreground hover:bg-primary/90'
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

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
        {/* Editor */}
        <div className="flex flex-col rounded-xl overflow-hidden glass-card shadow-xl min-h-0">
          <div className="px-4 py-3 border-b bg-muted/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs uppercase">
                {language === 'python' ? 'main.py' : 'index.js'}
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(v) => setCode(v || '')}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                fontLigatures: true,
              }}
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col rounded-xl overflow-hidden glass-card shadow-xl min-h-0">
          <div className="px-4 py-3 border-b bg-muted/50 flex justify-between">
            <span className="font-mono text-xs uppercase">Console</span>
            {output && (
              <button
                onClick={() => setOutput('')}
                className="text-xs hover:text-destructive"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex-1 p-4 overflow-auto font-mono text-sm">
            {output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="h-full flex items-center justify-center opacity-40">
                Run your code to see output
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDE;
