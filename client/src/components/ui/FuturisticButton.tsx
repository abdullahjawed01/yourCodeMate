// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

interface FuturisticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

export const FuturisticButton: React.FC<FuturisticButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  glow = true,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group';

  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 focus:ring-cyan-500 shadow-lg shadow-cyan-500/50',
    secondary: 'bg-white/10 text-white border border-cyan-400/30 hover:bg-white/20 hover:border-cyan-400/50 focus:ring-cyan-500',
    outline: 'bg-transparent text-cyan-400 border-2 border-cyan-500 hover:bg-cyan-500/10 focus:ring-cyan-500',
    ghost: 'bg-transparent text-white/70 hover:bg-white/5 hover:text-white focus:ring-cyan-500',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-500 shadow-lg shadow-red-500/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        glow && variant === 'primary' && 'pulse-glow',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Animated gradient background */}
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />

      {/* Content */}
      <span className={cn('relative z-10 flex items-center space-x-2', isLoading && 'opacity-0')}>
        {children}
      </span>

      {/* Loading spinner */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Loader2 className="w-5 h-5 animate-spin text-white" />
        </motion.div>
      )}

      {/* Glow effect */}
      {glow && variant === 'primary' && (
        <div className="absolute inset-0 rounded-lg bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </motion.button>
  );
};


