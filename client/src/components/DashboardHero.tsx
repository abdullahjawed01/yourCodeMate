import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHero = ({ userName }: { userName: string }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-border/50 glass-card-premium min-h-[500px] flex items-center mb-12 shadow-cyber-strong">

      {/* Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 z-[1] bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background via-background/80 to-transparent z-[2]" />

      <div className="relative z-10 px-8 md:px-16 w-full max-w-7xl mx-auto py-16 pointer-events-none">

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-neon/30 bg-accent-neon/10 text-accent-neon text-sm font-medium mb-8 backdrop-blur-md shadow-cyber pointer-events-auto"
        >
          <Zap size={16} className="fill-current animate-pulse" />
          <span className="tracking-wide uppercase text-xs">Awwwards Winning Interface</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 text-white drop-shadow-2xl"
        >
          Welcome to the<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-neon via-blue-400 to-primary">Future, {userName}.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-blue-100/70 mb-12 max-w-2xl font-light tracking-wide leading-relaxed"
        >
          Your daily mission: Write code that matters. Navigate the 3D landscape of logic and build something incredible.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-6 pointer-events-auto"
        >
          <Link to="/ide" className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-bold tracking-widest uppercase text-black transition-all duration-300 bg-accent-neon hover:bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-neon focus:ring-offset-black shadow-cyber hover:shadow-cyber-strong hover:-translate-y-1">
            Initialise Space
            <Terminal className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/paths" className="group inline-flex items-center justify-center px-10 py-4 text-sm font-bold tracking-widest uppercase text-white transition-all duration-300 bg-transparent border-2 border-white/20 rounded-lg hover:border-white hover:bg-white/10 focus:outline-none hover:-translate-y-1 backdrop-blur-sm">
            Explore Paths
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHero;
