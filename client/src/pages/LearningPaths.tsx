import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TiltCard } from '@/components/ui/TiltCard';

const LearningPaths: React.FC = () => {

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Learning Paths</h1>
          <p className="text-white/60">Choose your path to mastery</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-1000">
        {/* Python Path */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="h-full"
        >
          <Link to="/python" className="block h-full group">
            <TiltCard glowColor="bg-blue-500/20" className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-shadow">
                  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="Python" className="w-10 h-10" />
                </div>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/20">
                  Beginner Friendly
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors text-glow">Python Mastery</h3>
              <p className="text-white/60 mb-8 leading-relaxed">
                Master Python from scratch. Learn syntax, data structures, and advanced concepts through interactive lessons and challenges.
              </p>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center space-x-2 text-sm text-white/50">
                  <CheckCircle className="w-4 h-4" />
                  <span>Structured Curriculum</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-400 font-bold tracking-wide group-hover:translate-x-1 transition-transform">
                  <span>START JOURNEY</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </TiltCard>
          </Link>
        </motion.div>

        {/* JavaScript Path */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          <Link to="/javascript" className="block h-full group">
            <TiltCard glowColor="bg-yellow-500/20" className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)] group-hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] transition-shadow">
                  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="JavaScript" className="w-10 h-10" />
                </div>
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-semibold border border-yellow-500/20">
                  Web Development
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors text-glow">JavaScript Mastery</h3>
              <p className="text-white/60 mb-8 leading-relaxed">
                The language of the web. Learn modern ES6+, DOM manipulation, async programming, and more with hands-on practice.
              </p>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center space-x-2 text-sm text-white/50">
                  <CheckCircle className="w-4 h-4" />
                  <span>Interactive Labs</span>
                </div>
                <div className="flex items-center space-x-2 text-yellow-500 font-bold tracking-wide group-hover:translate-x-1 transition-transform">
                  <span>START JOURNEY</span>
                  <ArrowRight className="w-4 h-4" />
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
