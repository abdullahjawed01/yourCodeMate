import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import InteractiveBackground from '@/components/InteractiveBackground';
import { TiltCard } from '@/components/ui/TiltCard';

const LearningPaths: React.FC = () => {

  return (
    <div className="relative min-h-screen pb-20">
      <InteractiveBackground />
      
      <div className="flex flex-col items-center text-center space-y-4 mb-16 pt-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="p-3 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg inline-flex"
        >
          <BookOpen className="w-8 h-8" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Learning Paths
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg">
            Choose your specialization and master the craft through structured, interactive modules.
        </p>
      </div>

      {/* Connection Line SVG */}
      <svg className="absolute top-[280px] left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 hidden md:block pointer-events-none opacity-20" viewBox="0 0 800 100">
         <path 
            d="M 200,80 C 400,80 400,20 600,20" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeDasharray="4 4"
            className="text-primary animate-pulse"
         />
      </svg>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-1000">
        {/* Python Path */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="h-full"
        >
          <Link to="/python" className="block h-full group relative">
             <div className="absolute inset-0 bg-blue-500/5 filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <TiltCard glowColor="bg-blue-500/20" className="p-8 h-full border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center shadow-lg ring-1 ring-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="Python" className="w-12 h-12 drop-shadow-md" />
                </div>
                <span className="px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-500/20 uppercase tracking-widest">
                  Beginner Friendly
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-500 transition-colors">Python Mastery</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                Master Python from scratch. Learn syntax, data structures, and advanced concepts through interactive lessons.
              </p>
              <div className="flex items-center justify-between mt-auto pt-8 border-t border-border/50">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground/80">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span>Structured Curriculum</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-500 font-bold tracking-wide group-hover:translate-x-2 transition-transform">
                  <span>START JOURNEY</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </TiltCard>
          </Link>
        </motion.div>

        {/* JavaScript Path */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          <Link to="/javascript" className="block h-full group relative">
             <div className="absolute inset-0 bg-yellow-500/5 filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <TiltCard glowColor="bg-yellow-500/20" className="p-8 h-full border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/10 flex items-center justify-center shadow-lg ring-1 ring-yellow-500/20 group-hover:scale-110 transition-transform duration-300">
                  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="JavaScript" className="w-12 h-12 drop-shadow-md" />
                </div>
                <span className="px-4 py-1.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-bold border border-yellow-500/20 uppercase tracking-widest">
                  Web Development
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-4 group-hover:text-yellow-500 transition-colors">JavaScript Mastery</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                The language of the web. Learn modern ES6+, DOM manipulation, async programming, and more with hands-on practice.
              </p>
              <div className="flex items-center justify-between mt-auto pt-8 border-t border-border/50">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground/80">
                  <CheckCircle className="w-5 h-5 text-yellow-500" />
                  <span>Interactive Labs</span>
                </div>
                <div className="flex items-center space-x-2 text-yellow-500 font-bold tracking-wide group-hover:translate-x-2 transition-transform">
                  <span>START JOURNEY</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </TiltCard>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LearningPaths;
