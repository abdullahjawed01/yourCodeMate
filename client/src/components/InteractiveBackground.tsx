import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Lightweight, GPU-cheap animated background.
 *
 * Previously this rendered a full Three.js / react-three-fiber WebGL scene
 * (hundreds of instanced meshes + sparkles with `mix-blend-screen`), which was
 * a major performance drain on lower-end devices. It has been replaced with a
 * pure CSS + Framer Motion implementation that costs a fraction of the GPU/CPU
 * while keeping the same futuristic aesthetic.
 */
const InteractiveBackground = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Base + aurora gradient */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />
      <div className="hero-aurora absolute inset-0 opacity-60" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]" />

      {/* Ambient parallax glows */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vh] rounded-full blur-[100px] bg-primary/20 opacity-40 animate-float"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vh] rounded-full blur-[100px] bg-accent/10 opacity-40 animate-float-slow"
      />

      {/* Floating geometric accents */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[20%] left-[15%] w-12 h-12 border-2 border-primary/20 rounded-xl"
      />
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -180] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[60%] right-[15%] w-8 h-8 border border-accent/30 rounded-full"
      />
      <motion.div
        animate={{ x: [0, 40, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[20%] left-[30%] w-64 h-1 bg-primary/20 rounded-full blur-md"
      />
    </div>
  );
};

export default InteractiveBackground;
