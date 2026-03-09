import React from 'react';
import { cn } from '@/utils/cn';

interface ProgressBarProps {
    value: number; // 0-100
    max?: number;
    label?: string;
    sublabel?: string;
    variant?: 'xp' | 'primary' | 'accent' | 'gold' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    animated?: boolean;
    className?: string;
}

const variantClasses: Record<string, string> = {
    xp: 'xp-bar',
    primary: 'bg-primary',
    accent: 'bg-accent',
    gold: 'rank-gold',
    danger: 'bg-destructive',
};

const sizeClasses: Record<string, string> = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    label,
    sublabel,
    variant = 'xp',
    size = 'md',
    showLabel = true,
    animated = true,
    className,
}) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className={cn('w-full space-y-1', className)}>
            {(label || sublabel) && showLabel && (
                <div className="flex items-center justify-between text-xs">
                    {label && <span className="text-muted-foreground font-medium">{label}</span>}
                    {sublabel && <span className="font-bold text-foreground">{sublabel}</span>}
                </div>
            )}
            <div className={cn('xp-bar-track w-full', sizeClasses[size])}>
                <div
                    className={cn(
                        variantClasses[variant],
                        sizeClasses[size],
                        animated && 'transition-all duration-1000 ease-out',
                        variant !== 'xp' && 'rounded-full'
                    )}
                    style={{ width: `${pct}%` }}
                />
            </div>
            {showLabel && (
                <p className="text-right text-[10px] text-muted-foreground font-mono">
                    {Math.round(pct)}%
                </p>
            )}
        </div>
    );
};
