import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useTheme } from '../../contexts/ThemeContext';

interface FuturisticCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  holographic?: boolean;
  scanLine?: boolean;
  cyberGrid?: boolean;
  onClick?: () => void;
}

export const FuturisticCard: React.FC<FuturisticCardProps> = ({
  children,
  className,
  glow = false,
  holographic = false,
  scanLine = false,
  cyberGrid = false,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { theme } = useTheme();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  // Tone down rotation for light mode/cleaner feel
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={cn(
        'relative rounded-2xl p-6 transition-all duration-300',
        theme === 'dark' 
          ? 'glass border border-white/10' 
          : 'bg-white border border-slate-100 shadow-lg hover:shadow-xl',
        
        // Effects only active in dark mode or if explicitly enabled and beneficial
        theme === 'dark' && glow && 'pulse-glow',
        theme === 'dark' && holographic && 'holographic',
        theme === 'dark' && scanLine && 'scan-line',
        theme === 'dark' && cyberGrid && 'cyber-grid',
        
        isHovered && theme === 'dark' && 'border-cyan-400/50 shadow-neon-cyan',
        isHovered && theme === 'light' && 'border-slate-200 ring-2 ring-primary/5',
        
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Glow effect - Theme aware */}
      {theme === 'dark' && glow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-xl" />
      )}

      {/* Holographic overlay - Only for dark mode */}
      {theme === 'dark' && holographic && (
        <div className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-pink-500/10 rounded-2xl" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Corner accents - Theme aware */}
      {theme === 'dark' && (
        <>
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-400/30 rounded-tl-2xl opacity-0 hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-pink-400/30 rounded-br-2xl opacity-0 hover:opacity-100 transition-opacity" />
        </>
      )}
    </motion.div>
  );
};


