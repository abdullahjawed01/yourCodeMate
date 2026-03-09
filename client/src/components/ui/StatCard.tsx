import React from 'react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    variant?: 'default' | 'primary' | 'accent' | 'gold' | 'danger';
    className?: string;
    animated?: boolean;
    sublabel?: string;
}

const variantStyles: Record<string, string> = {
    default: 'border-border/50 bg-card/80 glass-card',
    primary: 'border-primary/40 bg-primary/10 glass-card-premium shadow-cyber',
    accent: 'border-accent/40 bg-accent/10 glass-card-premium shadow-cyber-strong text-accent-neon',
    gold: 'border-yellow-500/40 bg-yellow-500/10 glass-card-premium glow-gold',
    danger: 'border-destructive/40 bg-destructive/10 glass-card-premium text-destructive',
};

const valueColor: Record<string, string> = {
    default: 'text-foreground',
    primary: 'text-primary cyber-glow',
    accent: 'text-accent cyber-glow-accent',
    gold: 'text-yellow-500 cyber-glow',
    danger: 'text-destructive',
};

export const StatCard: React.FC<StatCardProps> = ({
    label, value, icon, trend, trendValue, variant = 'default', className, animated = true, sublabel
}) => {
    return (
        <motion.div
            initial={animated ? { opacity: 0, y: 15, scale: 0.95 } : {}}
            animate={animated ? { opacity: 1, y: 0, scale: 1 } : {}}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
                'rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 relative overflow-hidden group',
                variantStyles[variant],
                className
            )}
        >
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
                {icon && (
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', variantStyles[variant])}>
                        {icon}
                    </div>
                )}
            </div>
            <div className="flex items-end gap-2">
                <span className={cn('text-2xl font-black tracking-tight', valueColor[variant])}>{value}</span>
                {trend && trendValue && (
                    <span
                        className={cn(
                            'text-xs font-bold mb-1 flex items-center gap-0.5',
                            trend === 'up' && 'text-emerald-500',
                            trend === 'down' && 'text-red-500',
                            trend === 'neutral' && 'text-muted-foreground'
                        )}
                    >
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
                    </span>
                )}
            </div>
            {sublabel && <p className="text-[11px] text-muted-foreground">{sublabel}</p>}
        </motion.div>
    );
};
