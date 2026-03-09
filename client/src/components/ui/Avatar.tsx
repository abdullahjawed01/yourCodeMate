import React from 'react';
import { cn } from '@/utils/cn';
import { User } from 'lucide-react';

interface AvatarProps {
    name?: string;
    src?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    online?: boolean;
    rank?: number;
    className?: string;
}

const sizeMap = {
    xs: { outer: 'w-6 h-6', text: 'text-[10px]', dot: 'w-1.5 h-1.5' },
    sm: { outer: 'w-8 h-8', text: 'text-xs', dot: 'w-2 h-2' },
    md: { outer: 'w-10 h-10', text: 'text-sm', dot: 'w-2.5 h-2.5' },
    lg: { outer: 'w-14 h-14', text: 'text-lg', dot: 'w-3 h-3' },
    xl: { outer: 'w-20 h-20', text: 'text-2xl', dot: 'w-3.5 h-3.5' },
};

const getRankRing = (rank?: number) => {
    if (!rank) return '';
    if (rank === 1) return 'ring-2 ring-yellow-400 glow-gold';
    if (rank === 2) return 'ring-2 ring-gray-400 glow-silver';
    if (rank === 3) return 'ring-2 ring-amber-500 glow-bronze';
    if (rank <= 10) return 'ring-2 ring-purple-500';
    if (rank <= 50) return 'ring-2 ring-primary';
    return 'ring-1 ring-border';
};

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', online, rank, className }) => {
    const sizes = sizeMap[size];
    const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '';

    return (
        <div className={cn('relative inline-flex shrink-0', className)}>
            <div
                className={cn(
                    'rounded-full flex items-center justify-center font-bold transition-all',
                    'bg-gradient-to-br from-primary/20 to-accent/20 text-foreground border border-border',
                    sizes.outer,
                    sizes.text,
                    getRankRing(rank)
                )}
            >
                {src ? (
                    <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
                ) : initials ? (
                    <span>{initials}</span>
                ) : (
                    <User className="w-1/2 h-1/2 text-muted-foreground" />
                )}
            </div>
            {online !== undefined && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 rounded-full border-2 border-background',
                        sizes.dot,
                        online ? 'bg-emerald-500' : 'bg-muted-foreground'
                    )}
                />
            )}
        </div>
    );
};
