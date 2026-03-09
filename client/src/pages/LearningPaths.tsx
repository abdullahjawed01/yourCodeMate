import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, CheckCircle, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import InteractiveBackground from '@/components/InteractiveBackground';
import { TiltCard } from '@/components/ui/TiltCard';

const COURSES = [
  {
    id: 'python', title: 'Python Mastery', badge: 'Beginner Friendly', badgeColor: 'border-blue-500/20 text-blue-400 bg-blue-500/10',
    icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg',
    bg: 'from-blue-500/20 to-cyan-500/10', ring: 'ring-blue-500/20', glow: 'bg-blue-500/20', blur: 'bg-blue-500/5',
    colorHover: 'group-hover:text-blue-500', textIcon: 'text-blue-500',
    desc: 'Master Python from scratch. Learn syntax, data structures, and advanced concepts through interactive lessons.'
  },
  {
    id: 'javascript', title: 'JavaScript Mastery', badge: 'Web Development', badgeColor: 'border-yellow-500/20 text-yellow-500 bg-yellow-500/10',
    icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg',
    bg: 'from-yellow-500/20 to-orange-500/10', ring: 'ring-yellow-500/20', glow: 'bg-yellow-500/20', blur: 'bg-yellow-500/5',
    colorHover: 'group-hover:text-yellow-500', textIcon: 'text-yellow-500',
    desc: 'The language of the web. Learn modern ES6+, DOM manipulation, async programming, and more with hands-on practice.'
  },
  {
    id: 'typescript', title: 'TypeScript Pro', badge: 'Type-Safe Web', badgeColor: 'border-blue-400/20 text-blue-400 bg-blue-400/10',
    icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg',
    bg: 'from-blue-600/20 to-blue-400/10', ring: 'ring-blue-400/20', glow: 'bg-blue-600/20', blur: 'bg-blue-600/5',
    colorHover: 'group-hover:text-blue-400', textIcon: 'text-blue-400',
    desc: 'Add static typing to JavaScript. Master interfaces, generics, utility types, and strict compilation.'
  },
  {
    id: 'cpp', title: 'C++ Systems', badge: 'High Performance', badgeColor: 'border-indigo-500/20 text-indigo-400 bg-indigo-500/10',
    icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg',
    bg: 'from-indigo-500/20 to-purple-500/10', ring: 'ring-indigo-500/20', glow: 'bg-indigo-500/20', blur: 'bg-indigo-500/5',
    colorHover: 'group-hover:text-indigo-400', textIcon: 'text-indigo-500',
    desc: 'Master memory management, pointers, STL, and object-oriented concepts for systems programming.'
  },
  {
    id: 'java', title: 'Java Enterprise', badge: 'Scalable Architecture', badgeColor: 'border-red-500/20 text-red-500 bg-red-500/10',
    icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg',
    bg: 'from-red-500/20 to-orange-500/10', ring: 'ring-red-500/20', glow: 'bg-red-500/20', blur: 'bg-red-500/5',
    colorHover: 'group-hover:text-red-500', textIcon: 'text-red-500',
    desc: 'Strongly typed OOP language. Learn Multithreading, Streams, and scalable backend architecture.'
  },
  {
    id: 'rust', title: 'Rust Safety', badge: 'Memory Safe', badgeColor: 'border-orange-600/20 text-orange-600 bg-orange-600/10',
    icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/rust/rust-original.svg',
    bg: 'from-orange-600/20 to-red-600/10', ring: 'ring-orange-600/20', glow: 'bg-orange-600/20', blur: 'bg-orange-600/5',
    colorHover: 'group-hover:text-orange-500', textIcon: 'text-orange-600',
    desc: 'Learn the strict borrowing system, lifetimes, and blazing fast systems programming.'
  },
  {
    id: 'ruby', title: 'Ruby Elegant', badge: 'Rapid Development', badgeColor: 'border-pink-600/20 text-pink-500 bg-pink-600/10',
    icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/ruby/ruby-original.svg',
    bg: 'from-pink-600/20 to-rose-500/10', ring: 'ring-pink-600/20', glow: 'bg-pink-600/20', blur: 'bg-pink-600/5',
    colorHover: 'group-hover:text-pink-500', textIcon: 'text-pink-500',
    desc: 'Focus on simplicity and programmer productivity. Learn elegant Ruby syntax and conventions.'
  },
  {
    id: 'swift', title: 'Swift iOS', badge: 'Apple Ecosystem', badgeColor: 'border-orange-500/20 text-orange-400 bg-orange-500/10',
    icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/swift/swift-original.svg',
    bg: 'from-orange-500/20 to-amber-500/10', ring: 'ring-orange-500/20', glow: 'bg-orange-500/20', blur: 'bg-orange-500/5',
    colorHover: 'group-hover:text-orange-400', textIcon: 'text-orange-500',
    desc: 'Build stunning, high-performance native applications across the Apple ecosystem.'
  }
];

const LearningPaths: React.FC = () => {
  return (
    <div className="relative min-h-screen pb-20">
      <InteractiveBackground />

      <div className="flex flex-col items-center text-center space-y-4 mb-16 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg inline-flex relative"
        >
          <div className="absolute inset-0 bg-primary blur-xl opacity-50 rounded-2xl" />
          <BookOpen className="w-8 h-8 relative z-10" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Interactive Courses
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg">
          Master 8+ programming languages through structured, interactive, W3Schools-like modules ranging from zero to Hero.
        </p>
        <div className="flex items-center gap-2 text-sm font-semibold text-orange-500 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full">
          <Flame size={16} /> Expanding Ecosystem
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-1000 max-w-[1400px] mx-auto px-4">
        {COURSES.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.1, type: "spring", stiffness: 100 }}
            className="h-full"
          >
            <Link to={`/learn/${course.id}`} className="block h-full group relative">
              <div className={`absolute inset-0 ${course.blur} filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <TiltCard glowColor={course.glow} className="p-6 h-full flex flex-col border border-border/50 bg-card/60 backdrop-blur-md shadow-lg group-hover:border-border transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.bg} flex items-center justify-center shadow-lg ring-1 ${course.ring} group-hover:scale-110 transition-transform duration-300`}>
                    <img src={course.icon} alt={course.title} className="w-10 h-10 drop-shadow-md"
                      onError={(e) => {
                        // Fallback to plain icon if original svg fails
                        e.currentTarget.src = course.icon.replace('-original', '-plain').replace('-plain', '-original');
                      }} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${course.badgeColor}`}>
                    {course.badge}
                  </span>
                </div>
                <h3 className={`text-2xl font-black mb-3 ${course.colorHover} transition-colors text-foreground`}>{course.title}</h3>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed flex-1">
                  {course.desc}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground">
                    <CheckCircle className={`w-4 h-4 ${course.textIcon}`} />
                    <span>65+ Interactive Modules</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${course.textIcon} font-bold tracking-wide group-hover:translate-x-1 transition-transform text-sm`}>
                    <span>Learn</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </TiltCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LearningPaths;
