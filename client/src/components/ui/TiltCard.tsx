import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/utils/cn';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
    children,
    className,
    glowColor = "bg-primary/20"
}) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 }); // Elastic feel
    const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
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
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn("relative h-full transition-all duration-200 ease-out", className)}
        >
            <div
                style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
                className={cn(
                    "absolute inset-4 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    glowColor
                )}
            />
            <div
                className="relative h-full glass-card rounded-xl shadow-lg border-white/20 dark:border-white/5 overflow-hidden group"
                style={{ transform: "translateZ(20px)" }}
            >
                {children}
            </div>
        </motion.div>
    );
};
