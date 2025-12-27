// @ts-nocheck
import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const spring = useSpring(0, { duration: duration * 1000 });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={className}>
      {prefix}
      {useTransform(spring, (val) => val.toFixed(decimals))}
      {suffix}
    </motion.span>
  );
};

export const AnimatedNumber: React.FC<AnimatedCounterProps> = AnimatedCounter;
