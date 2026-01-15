import { BrainCircuit, Sparkles, Terminal, GraduationCap, ShieldCheck, Rocket } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { TiltCard } from '@/components/ui/TiltCard';

import InteractiveBackground from '@/components/InteractiveBackground';
import DashboardHero from '@/components/DashboardHero';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="relative">
      <InteractiveBackground />
      
      <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <DashboardHero userName={user?.name || 'Developer'} />

        {/* Feature Toolkit Header */}
        <div className="border-b border-border/50 pb-4">
          <h2 className="text-3xl font-bold tracking-tight">Feature Toolkit</h2>
          <p className="text-muted-foreground">Everything you need to master your coding career</p>
        </div>

        {/* Why Your CodeMate? - Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/interview">
            <TiltCard className="p-6 border-l-4 border-l-blue-500 h-full overflow-hidden relative group cursor-pointer transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                  <BrainCircuit size={24} />
                </div>
                <h3 className="font-bold text-lg">AI Technical Interviews</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Practice real-world interview scenarios with our advanced AI. Get instant, detailed feedback on your solutions and communication skills.
              </p>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <BrainCircuit size={80} />
              </div>
            </TiltCard>
          </Link>

          <Link to="/ide">
            <TiltCard className="p-6 border-l-4 border-l-purple-500 h-full overflow-hidden relative group cursor-pointer transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                  <Terminal size={24} />
                </div>
                <h3 className="font-bold text-lg">Interactive IDE</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Write, compile, and execute Python and JavaScript code directly in your browser. A secure environment with real-time output.
              </p>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Terminal size={80} />
              </div>
            </TiltCard>
          </Link>

          <Link to="/mentor">
            <TiltCard className="p-6 border-l-4 border-l-teal-500 h-full overflow-hidden relative group cursor-pointer transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-teal-500/10 text-teal-500">
                  <Sparkles size={24} />
                </div>
                <h3 className="font-bold text-lg">AI Coding Mentor</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Stuck on a bug? Need a concept explained? Our AI Mentor is available 24/7 to guide you through your coding journey and best practices.
              </p>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles size={80} />
              </div>
            </TiltCard>
          </Link>

          <Link to="/paths">
            <TiltCard className="p-6 border-l-4 border-l-amber-500 h-full overflow-hidden relative group cursor-pointer transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                  <GraduationCap size={24} />
                </div>
                <h3 className="font-bold text-lg">Structured Paths</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Follow curated roadmaps for Frontend, Backend, and Fullstack development. Each path is optimized for career success.
              </p>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <GraduationCap size={80} />
              </div>
            </TiltCard>
          </Link>

          <Link to="/test">
            <TiltCard className="p-6 border-l-4 border-l-indigo-500 h-full overflow-hidden relative group cursor-pointer transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-bold text-lg">Skill Validation</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Earn points, unlock badges, and validate your skills through consistent practice. Showcase your achievements on your profile.
              </p>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck size={80} />
              </div>
            </TiltCard>
          </Link>

          <Link to="/about">
            <TiltCard className="p-6 border-l-4 border-l-rose-500 h-full overflow-hidden relative group cursor-pointer transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
                  <Rocket size={24} />
                </div>
                <h3 className="font-bold text-lg">Career Growth</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your CodeMate is built by developers for developers. We focus on the skills that actually matter in the modern tech industry.
              </p>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Rocket size={80} />
              </div>
            </TiltCard>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Your CodeMate. All rights reserved.
          </p>
          <p className="text-xs font-medium text-zinc-400">
            Founded by <span className="text-primary">Abdullah Jawed</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
