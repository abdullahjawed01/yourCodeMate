import React, { useState, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Code, Lock, CheckCircle, Zap, Star, Trophy } from 'lucide-react';
import { testApi } from '@/services/api';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { Badge } from '@/components/ui/Badge';

// --- 3D Tilt Card Component ---
const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

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
      className={cn("relative h-full transition-all duration-200 ease-out", className)}
    >
      <div
        style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
        className="absolute inset-4 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      <div
        className="relative h-full glass-card rounded-xl p-6 border border-white/10 shadow-xl overflow-hidden group"
        style={{ transform: "translateZ(50px)" }}
      >
        {children}
      </div>
    </motion.div>
  );
};

const CodingTests: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({});

  const { data: tests, isLoading } = useQuery({
    queryKey: ['tests'],
    queryFn: testApi.getUserTests,
  });

  const testTitles = useMemo(() => {
    return tests?.map(t => t.title) || [];
  }, [tests]);

  const filteredTests = useMemo(() => {
    if (!tests) return [];

    return tests.filter((test) => {
      // Search filter
      const matchesSearch = !searchQuery ||
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Difficulty filter
      const matchesDifficulty = !filters.difficulty ||
        filters.difficulty.length === 0 ||
        filters.difficulty.includes(test.difficulty);

      // Status filter
      const matchesStatus = !filters.status ||
        filters.status.length === 0 ||
        (filters.status.includes('completed') && test.completed) ||
        (filters.status.includes('unlocked') && test.unlocked && !test.completed) ||
        (filters.status.includes('locked') && !test.unlocked);

      // Level filter
      const matchesLevel = (!filters.minLevel || test.unlockLevel >= filters.minLevel) &&
        (!filters.maxLevel || test.unlockLevel <= filters.maxLevel);

      return matchesSearch && matchesDifficulty && matchesStatus && matchesLevel;
    });
  }, [tests, searchQuery, filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          <p className="text-white/70 animate-pulse">Initializing Neural Interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 min-h-screen">
      {/* Ambient Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between border-b border-white/10 pb-6"
      >
        <div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-200 to-primary-400 mb-2 tracking-tight">
            Challenge Arena
          </h1>
          <p className="text-lg text-white/60 font-light">Prove your mastery. Ascend the leaderboard.</p>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-sm text-primary-300 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
          <Zap className="w-4 h-4 fill-current" />
          <span>{filteredTests?.length} Active Nodes</span>
        </div>
      </motion.div>

      {/* Advanced Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AdvancedSearch
          onSearch={setSearchQuery}
          onFilterChange={setFilters}
          suggestions={testTitles}
          placeholder="Search by protocol name or description..."
        />
      </motion.div>

      {/* Tests Grid - 3D Enabled */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
        {filteredTests?.map((test, index) => (
          <Link
            key={test._id}
            to={test.unlocked ? `/tests/${test._id}` : '#'}
            className={cn("block h-full group", !test.unlocked && "cursor-not-allowed opacity-70")}
          >
            <TiltCard>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 group-hover:border-primary/50 transition-colors">
                  {test.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : !test.unlocked ? (
                    <Lock className="w-6 h-6 text-white/40" />
                  ) : (
                    <Code className="w-6 h-6 text-primary-400" />
                  )}
                </div>
                {test.unlocked && (
                  <Badge variant={test.difficulty === 'easy' ? 'success' : test.difficulty === 'medium' ? 'warning' : 'danger'} className="shadow-lg">
                    {test.difficulty}
                  </Badge>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors group-hover:text-glow">
                {test.title}
              </h3>

              <p className="text-sm text-white/60 line-clamp-2 mb-6 h-10">
                {test.description}
              </p>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center space-x-2 text-sm text-white/50">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>{test.maxScore} XP</span>
                </div>

                {!test.unlocked && (
                  <div className="flex items-center space-x-1 text-xs text-yellow-500/80 bg-yellow-500/10 px-2 py-1 rounded">
                    <Lock className="w-3 h-3" />
                    <span>Lvl {test.unlockLevel}</span>
                  </div>
                )}

                {test.unlocked && !test.completed && (
                  <span className="text-xs font-semibold text-primary-400 group-hover:translate-x-1 transition-transform">
                    ENGAGE &rarr;
                  </span>
                )}
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tr-xl pointer-events-none" />
            </TiltCard>
          </Link>
        ))}
      </div>

      {filteredTests?.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
          <div className="relative inline-block">
            <Code className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Void Detected</h3>
          <p className="text-white/50">No challenges found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CodingTests;
