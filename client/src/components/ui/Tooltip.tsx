import React, { useState, useRef } from 'react';
import { cn } from '@/utils/cn';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, side = 'top', className }) => {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const show = () => {
        timeoutRef.current = setTimeout(() => setVisible(true), 300);
    };
    const hide = () => {
        clearTimeout(timeoutRef.current);
        setVisible(false);
    };

    const positionClasses: Record<string, string> = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
        >
            {children}
            {visible && (
                <div
                    className={cn(
                        'absolute z-50 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none',
                        'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900',
                        'shadow-lg border border-white/10 dark:border-zinc-900/10',
                        'animate-in fade-in-0 zoom-in-95 duration-150',
                        positionClasses[side],
                        className
                    )}
                    role="tooltip"
                >
                    {content}
                </div>
            )}
        </div>
    );
};
