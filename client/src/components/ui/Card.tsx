// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  clickable = false,
  className,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover || clickable ? { y: -2 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
        'shadow-sm',
        hover && 'hover:shadow-md transition-shadow',
        clickable && 'cursor-pointer hover:border-primary-300 dark:hover:border-primary-600',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
