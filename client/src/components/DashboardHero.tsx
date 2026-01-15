import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHero = ({ userName }: { userName: string }) => {
  return (
    <div className="relative w-full py-8 md:py-12 overflow-hidden">
      <div className="relative z-10 max-w-6xl">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
        >
            <Zap size={14} className="fill-current" />
            <span>AI-Powered Learning Era</span>
        </motion.div>
        
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
        >
          Welcome back, <br/>
          <span className="text-primary">{userName}</span>.
        </motion.h1>

        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
        >
          Your daily mission: Write code that matters. Pick up where you left off or start a new challenge.
        </motion.p>
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4"
        >
           <Link to="/ide" className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 bg-primary rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1">
              Open IDE
              <Terminal className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </Link>
           <Link to="/paths" className="group inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-foreground transition-all duration-200 bg-card border border-border/50 rounded-full hover:bg-muted focus:outline-none hover:shadow-md hover:-translate-y-1">
              View Paths
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform opacity-50" />
           </Link>
        </motion.div>
      </div>

      {/* Decorative Hero Elements */}
      <motion.div 
         animate={{ rotate: 360 }}
         transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
         className="absolute top-10 right-0 md:right-[-5%] w-[400px] h-[400px] border border-dashed border-primary/20 rounded-full opacity-30 pointer-events-none"
      />
      <motion.div 
         animate={{ rotate: -360 }}
         transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
         className="absolute top-20 right-10 md:right-[5%] w-[300px] h-[300px] border border-dashed border-accent/20 rounded-full opacity-30 pointer-events-none"
      />
    </div>
  );
};

export default DashboardHero;
