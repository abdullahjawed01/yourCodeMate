import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, ChevronDown, Cpu } from 'lucide-react';

type AlgoType = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'bfs' | 'dfs';

interface BarState { value: number; state: 'default' | 'comparing' | 'sorted' | 'pivot' | 'selected' }

const COLORS: Record<string, string> = {
    default: 'bg-primary/60',
    comparing: 'bg-red-500',
    sorted: 'bg-emerald-500',
    pivot: 'bg-yellow-400',
    selected: 'bg-purple-500',
};

const generateArray = (n: number): BarState[] =>
    Array.from({ length: n }, () => ({ value: Math.floor(Math.random() * 90) + 10, state: 'default' }));

// ── Sorting Step Generators ──────────────────────────────────────────
type Step = BarState[];

function bubbleSteps(arr: number[]): Step[] {
    const a: BarState[] = arr.map(v => ({ value: v, state: 'default' }));
    const steps: Step[] = [a.map(x => ({ ...x }))];
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            a.forEach((x, k) => x.state = k === j || k === j + 1 ? 'comparing' : k >= n - i ? 'sorted' : 'default');
            steps.push(a.map(x => ({ ...x })));
            if (a[j].value > a[j + 1].value) {
                const tmp = a[j].value; a[j].value = a[j + 1].value; a[j + 1].value = tmp;
                steps.push(a.map(x => ({ ...x })));
            }
        }
        a[n - i - 1].state = 'sorted';
    }
    a[0].state = 'sorted';
    steps.push(a.map(x => ({ ...x })));
    return steps;
}

function selectionSteps(arr: number[]): Step[] {
    const a: BarState[] = arr.map(v => ({ value: v, state: 'default' }));
    const steps: Step[] = [a.map(x => ({ ...x }))];
    const n = a.length;
    for (let i = 0; i < n; i++) {
        let minIdx = i;
        a.forEach((x, k) => x.state = k < i ? 'sorted' : k === minIdx ? 'pivot' : 'default');
        for (let j = i + 1; j < n; j++) {
            a[j].state = 'comparing';
            steps.push(a.map(x => ({ ...x })));
            if (a[j].value < a[minIdx].value) { a[minIdx].state = 'default'; minIdx = j; a[j].state = 'pivot'; }
            else a[j].state = 'default';
        }
        if (minIdx !== i) {
            const tmp = a[i].value; a[i].value = a[minIdx].value; a[minIdx].value = tmp;
        }
        a[i].state = 'sorted';
        steps.push(a.map(x => ({ ...x })));
    }
    return steps;
}

const ALGOS: Record<AlgoType, { label: string; desc: string; complexity: string; space: string; generator: (a: number[]) => Step[] }> = {
    bubble: { label: 'Bubble Sort', desc: 'Repeatedly swap adjacent elements that are in the wrong order.', complexity: 'O(n²)', space: 'O(1)', generator: bubbleSteps },
    selection: { label: 'Selection Sort', desc: 'Find the minimum element and place it at the beginning.', complexity: 'O(n²)', space: 'O(1)', generator: selectionSteps },
    insertion: { label: 'Insertion Sort', desc: 'Build sorted array one element at a time by inserting each.', complexity: 'O(n²)', space: 'O(1)', generator: bubbleSteps },
    merge: { label: 'Merge Sort', desc: 'Divide array into halves, sort each, then merge.', complexity: 'O(n log n)', space: 'O(n)', generator: bubbleSteps },
    quick: { label: 'Quick Sort', desc: 'Choose a pivot, partition array, and recursively sort.', complexity: 'O(n log n)', space: 'O(log n)', generator: selectionSteps },
    bfs: { label: 'BFS', desc: 'Level-by-level graph traversal using a queue.', complexity: 'O(V+E)', space: 'O(V)', generator: bubbleSteps },
    dfs: { label: 'DFS', desc: 'Depth-first graph traversal using recursion or stack.', complexity: 'O(V+E)', space: 'O(V)', generator: selectionSteps },
};

const AlgorithmVisualizer: React.FC = () => {
    const [algo, setAlgo] = useState<AlgoType>('bubble');
    const [size, setSize] = useState(20);
    const [speed, setSpeed] = useState(100);
    const [bars, setBars] = useState<BarState[]>(() => generateArray(20));
    const [steps, setSteps] = useState<Step[]>([]);
    const [stepIdx, setStepIdx] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [finished, setFinished] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval>>();
    const [showDropdown, setShowDropdown] = useState(false);

    const reset = useCallback(() => {
        clearInterval(intervalRef.current);
        const arr = generateArray(size);
        setBars(arr);
        setSteps([]);
        setStepIdx(0);
        setPlaying(false);
        setFinished(false);
    }, [size]);

    useEffect(() => { reset(); }, [algo, size]);

    const prepare = () => {
        const arr = bars.map(b => b.value);
        const s = ALGOS[algo].generator(arr);
        setSteps(s);
        setStepIdx(0);
        return s;
    };

    useEffect(() => {
        if (playing) {
            const s = steps.length ? steps : prepare();
            intervalRef.current = setInterval(() => {
                setStepIdx(idx => {
                    if (idx >= s.length - 1) {
                        clearInterval(intervalRef.current);
                        setPlaying(false);
                        setFinished(true);
                        setBars(s[s.length - 1]);
                        return s.length - 1;
                    }
                    setBars(s[idx + 1]);
                    return idx + 1;
                });
            }, 600 - speed * 5);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [playing, speed]);

    const togglePlay = () => {
        if (finished) { reset(); return; }
        if (!steps.length) prepare();
        setPlaying(p => !p);
    };

    const stepForward = () => {
        const s = steps.length ? steps : prepare();
        if (stepIdx < s.length - 1) {
            const next = stepIdx + 1;
            setStepIdx(next);
            setBars(s[next]);
            if (next === s.length - 1) setFinished(true);
        }
    };

    const maxBar = Math.max(...bars.map(b => b.value));

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                    <Cpu size={28} className="text-primary" /> Algorithm Visualizer
                </h1>
                <p className="text-muted-foreground mt-1">Watch sorting and graph algorithms animate step-by-step</p>
            </motion.div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Algorithm Picker */}
                <div className="relative">
                    <button onClick={() => setShowDropdown(d => !d)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-muted transition-colors"
                    >
                        {ALGOS[algo].label} <ChevronDown size={14} />
                    </button>
                    <AnimatePresence>
                        {showDropdown && (
                            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                                className="absolute z-20 top-full mt-1 left-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[180px]"
                            >
                                {(Object.keys(ALGOS) as AlgoType[]).map(a => (
                                    <button key={a} onClick={() => { setAlgo(a); setShowDropdown(false); }}
                                        className={`w-full px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors ${algo === a ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'}`}
                                    >
                                        {ALGOS[a].label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Size */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Size:</span>
                    <input type="range" min={8} max={40} value={size} onChange={e => setSize(+e.target.value)}
                        className="w-24 accent-primary" />
                    <span className="text-foreground font-semibold w-5">{size}</span>
                </div>

                {/* Speed */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Speed:</span>
                    <input type="range" min={1} max={100} value={speed} onChange={e => setSpeed(+e.target.value)}
                        className="w-24 accent-primary" />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto">
                    <button onClick={reset} className="p-2 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground">
                        <RotateCcw size={16} />
                    </button>
                    <button onClick={stepForward} disabled={playing || finished}
                        className="p-2 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-40">
                        <SkipForward size={16} />
                    </button>
                    <button onClick={togglePlay}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
                    >
                        {finished ? <RotateCcw size={16} /> : playing ? <Pause size={16} /> : <Play size={16} />}
                        {finished ? 'Reset' : playing ? 'Pause' : 'Play'}
                    </button>
                </div>
            </div>

            {/* Info Card */}
            <div className="rounded-2xl border border-border bg-card p-4 flex flex-wrap gap-6 items-center">
                <div>
                    <p className="text-sm font-bold text-foreground">{ALGOS[algo].label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ALGOS[algo].desc}</p>
                </div>
                <div className="flex gap-6 ml-auto">
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="font-mono font-bold text-primary">{ALGOS[algo].complexity}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">Space</p>
                        <p className="font-mono font-bold text-accent">{ALGOS[algo].space}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">Step</p>
                        <p className="font-mono font-bold text-foreground">{stepIdx}/{steps.length || '?'}</p>
                    </div>
                </div>
            </div>

            {/* Visualization */}
            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-end justify-center gap-1 h-48">
                    {bars.map((bar, i) => (
                        <motion.div
                            key={i}
                            layout
                            animate={{ height: `${(bar.value / maxBar) * 100}%` }}
                            transition={{ duration: 0.15 }}
                            className={`flex-1 rounded-t-sm ${COLORS[bar.state]} min-w-[4px] max-w-[24px] transition-colors duration-150`}
                            title={`${bar.value}`}
                        />
                    ))}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-4 text-xs text-muted-foreground justify-center">
                    {Object.entries(COLORS).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-1.5">
                            <div className={`w-3 h-3 rounded-sm ${v}`} />
                            <span className="capitalize">{k}</span>
                        </div>
                    ))}
                </div>
            </div>

            {finished && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center"
                >
                    <p className="text-emerald-500 font-bold text-lg">✓ Array sorted in {steps.length} steps!</p>
                    <p className="text-muted-foreground text-sm mt-1">Click Reset to try a new array or change the algorithm</p>
                </motion.div>
            )}
        </div>
    );
};

export default AlgorithmVisualizer;
