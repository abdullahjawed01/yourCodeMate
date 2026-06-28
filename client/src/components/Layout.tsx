import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Code2, Terminal, User, LogOut,
  ChevronLeft, ChevronRight, Menu, GraduationCap, BrainCircuit,
  Trophy, MessageSquare, Swords, Star, Users,
  Cpu, Globe2, Flame, Sparkles, BarChart3, ShieldCheck, Share2
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Avatar } from "./ui/Avatar";

interface SidebarItemProps {
  icon: any;
  label: string;
  path: string;
  active: boolean;
  collapsed: boolean;
  badge?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, path, active, collapsed, badge }) => (
  <Link
    to={path}
    aria-label={label}
    aria-current={active ? "page" : undefined}
    className={clsx(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
      active
        ? "bg-primary text-primary-foreground font-semibold shadow-md glow-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
  >
    <Icon size={18} className="min-w-[18px] shrink-0" />
    {!collapsed && (
      <span className="whitespace-nowrap overflow-hidden text-sm transition-all duration-300 flex-1">
        {label}
      </span>
    )}
    {!collapsed && badge !== undefined && badge > 0 && (
      <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-foreground/20 text-primary-foreground">
        {badge}
      </span>
    )}
    {collapsed && (
      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10 transition-all duration-150">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-zinc-900" />
      </div>
    )}
  </Link>
);

const SidebarSection: React.FC<{ label: string; collapsed: boolean; children: React.ReactNode }> = ({ label, collapsed, children }) => (
  <div className="space-y-0.5">
    {!collapsed && (
      <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
        {label}
      </p>
    )}
    {collapsed && <div className="h-2" />}
    {children}
  </div>
);

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const xp = user?.xp ?? (user?.points ?? 0);
  const level = user?.level ?? 1;
  const xpForNextLevel = level * 200;
  const xpPct = Math.min(100, (xp % xpForNextLevel) / xpForNextLevel * 100);
  const streak = user?.streak ?? 0;

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth < 1024) setCollapsed(true); };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="h-screen w-full bg-background flex relative overflow-hidden">
      {/* Skip to content (keyboard / screen-reader accessibility) */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={clsx("absolute inset-0 bg-grid-pattern transition-opacity duration-500", theme === 'dark' ? "opacity-[0.05]" : "opacity-[0.02]")} />
        <div className={clsx("absolute top-[-10%] left-[-20%] w-[50vw] h-[50vh] rounded-full blur-[120px] transition-colors duration-500", theme === 'dark' ? "bg-primary/10 opacity-20" : "bg-blue-100/20 opacity-30")} />
        <div className={clsx("absolute bottom-[-10%] right-[-20%] w-[50vw] h-[50vh] rounded-full blur-[120px] transition-colors duration-500", theme === 'dark' ? "bg-accent/10 opacity-20" : "bg-teal-100/20 opacity-30")} />
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={clsx(
          "fixed lg:relative top-0 left-0 z-50 h-screen bg-card border-r border-border flex flex-col shadow-xl lg:shadow-none",
          !mobileOpen && "-translate-x-full lg:translate-x-0",
          mobileOpen && "translate-x-0",
          "transition-transform duration-200 lg:transition-none"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-3 border-b border-border/50 shrink-0 bg-black/20">
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-3 px-2 py-1 transition-all group">
              <div className="w-9 h-9 flex items-center justify-center relative shadow-cyber">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-purple-600 rounded-xl rounded-tr-sm rotate-3 group-hover:rotate-6 transition-transform blur-[2px] opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-purple-600 rounded-xl rounded-tr-sm" />
                <div className="absolute inset-[1px] bg-black/60 rounded-xl rounded-tr-sm backdrop-blur-xl" />
                <Code2 size={18} className="text-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
              <div className="flex flex-col -gap-1">
                <span className="font-black text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400 drop-shadow-sm leading-none">CodeMate</span>
                <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] opacity-80 mt-0.5">Ecosystem</span>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="w-full flex justify-center py-2">
              <div className="w-10 h-10 flex items-center justify-center relative shadow-cyber group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-purple-600 rounded-xl rounded-tr-sm rotate-3 group-hover:rotate-12 transition-transform blur-[2px] opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-purple-600 rounded-xl rounded-tr-sm" />
                <div className="absolute inset-[1px] bg-black/60 rounded-xl rounded-tr-sm backdrop-blur-xl" />
                <Code2 size={20} className="text-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className="hidden lg:flex w-6 h-6 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors ml-1"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-none">
          <SidebarSection label="Main" collapsed={collapsed}>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" active={isActive('/dashboard')} collapsed={collapsed} />
            <SidebarItem icon={Trophy} label="Leaderboard" path="/leaderboard" active={isActive('/leaderboard')} collapsed={collapsed} />
            <SidebarItem icon={BarChart3} label="Progress" path="/progress" active={isActive('/progress')} collapsed={collapsed} />
          </SidebarSection>

          <SidebarSection label="Compete" collapsed={collapsed}>
            <SidebarItem icon={ShieldCheck} label="Coding Tests" path="/test" active={isActive('/test')} collapsed={collapsed} />
            <SidebarItem icon={Swords} label="DSA Battles" path="/battle" active={isActive('/battle')} collapsed={collapsed} />
            <SidebarItem icon={Globe2} label="Contests" path="/contests" active={isActive('/contests')} collapsed={collapsed} />
          </SidebarSection>

          <SidebarSection label="Learn" collapsed={collapsed}>
            <SidebarItem icon={Code2} label="JavaScript" path="/learn/javascript" active={isActive('/learn/javascript')} collapsed={collapsed} />
            <SidebarItem icon={Code2} label="TypeScript" path="/learn/typescript" active={isActive('/learn/typescript')} collapsed={collapsed} />
            <SidebarItem icon={Terminal} label="Python" path="/learn/python" active={isActive('/learn/python')} collapsed={collapsed} />
            <SidebarItem icon={Terminal} label="C++" path="/learn/cpp" active={isActive('/learn/cpp')} collapsed={collapsed} />
            <SidebarItem icon={Terminal} label="Java" path="/learn/java" active={isActive('/learn/java')} collapsed={collapsed} />
            <SidebarItem icon={GraduationCap} label="Learning Paths" path="/paths" active={isActive('/paths')} collapsed={collapsed} />
            <SidebarItem icon={Cpu} label="Algorithm Visualizer" path="/visualizer" active={isActive('/visualizer')} collapsed={collapsed} />
          </SidebarSection>

          <SidebarSection label="AI Tools" collapsed={collapsed}>
            <SidebarItem icon={Terminal} label="IDE" path="/ide" active={isActive('/ide')} collapsed={collapsed} />
            <SidebarItem icon={Share2} label="Collaborate" path="/collab" active={isActive('/collab')} collapsed={collapsed} />
            <SidebarItem icon={BrainCircuit} label="AI Interviewer" path="/interview" active={isActive('/interview')} collapsed={collapsed} />
            <SidebarItem icon={Sparkles} label="AI Mentor" path="/mentor" active={isActive('/mentor')} collapsed={collapsed} />
          </SidebarSection>

          <SidebarSection label="Social" collapsed={collapsed}>
            <SidebarItem icon={Users} label="Friends" path="/friends" active={isActive('/friends')} collapsed={collapsed} />
            <SidebarItem icon={MessageSquare} label="Chat" path="/chat" active={isActive('/chat')} collapsed={collapsed} badge={3} />
            <SidebarItem icon={Globe2} label="Community" path="/community" active={isActive('/community')} collapsed={collapsed} />
          </SidebarSection>

          <SidebarSection label="Profile" collapsed={collapsed}>
            <SidebarItem icon={User} label="My Profile" path="/profile" active={isActive('/profile')} collapsed={collapsed} />
            <SidebarItem icon={Star} label="Achievements" path="/achievements" active={isActive('/achievements')} collapsed={collapsed} />
          </SidebarSection>
        </div>

        {/* User Footer */}
        <div className="p-4 pb-6 border-t border-border bg-muted/20 shrink-0 min-h-0">
          {/* XP Bar */}
          {!collapsed && (
            <div className="mb-3 px-1">
              <div className="flex justify-between items-center text-[10px] text-muted-foreground mb-1">
                <span className="font-semibold">Level {level}</span>
                <span>{xp % xpForNextLevel} / {xpForNextLevel} XP</span>
              </div>
              <div className="xp-bar-track h-1.5">
                <div className="xp-bar h-1.5" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          )}
          <div className={clsx("flex items-center gap-2.5 py-1", collapsed && "justify-center")}>
            <Avatar name={user?.name} src={user?.avatar} size="sm" />
            {!collapsed && (
              <div className="flex-1 overflow-hidden min-w-0">
                <p className="text-sm font-semibold truncate text-foreground leading-tight">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Flame size={10} className="streak-fire flex-shrink-0" />
                  <span className="text-[10px] text-muted-foreground truncate">{streak} day streak</span>
                </div>
              </div>
            )}
            {!collapsed && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={handleLogout} aria-label="Log out" className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors">
                  <LogOut size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col z-10 min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center px-4 justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} aria-label="Open navigation menu" className="p-2 -ml-1 rounded-xl hover:bg-muted text-zinc-400 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-purple-600 rounded-md rotate-3 blur-[1px] opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-purple-600 rounded-md" />
                <div className="absolute inset-[1px] bg-black/60 rounded-md backdrop-blur-xl" />
                <Code2 size={12} className="text-white relative z-10" />
              </div>
              <span className="font-black text-base text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">CodeMate</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                <Flame size={12} className="text-orange-500 animate-pulse" />
                <span className="text-xs font-bold text-orange-500">{streak}</span>
              </div>
            )}
            <Link to="/profile" className="flex items-center justify-center relative ml-1 p-0.5 rounded-full bg-gradient-to-br from-primary to-accent">
              <div className="p-0.5 bg-black rounded-full">
                <Avatar name={user?.name} src={user?.avatar} size="xs" />
              </div>
            </Link>
          </div>
        </header>

        {/* Desktop Top Bar */}
        <div className="hidden lg:flex h-18 border-b border-white/5 bg-black/20 backdrop-blur-xl px-6 items-center justify-end gap-5 shrink-0 shadow-sm">
          {streak > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <Flame size={14} className="text-orange-500 drop-shadow-md animate-pulse" />
              <span className="text-sm font-bold text-orange-500 tracking-wide">{streak} day streak</span>
            </div>
          )}
          <div className="w-px h-6  bg-white/10" />
          <Link to="/profile" className="flex items-center my-2  gap-3 px-3  py-1.5 rounded-full glass-card border border-transparent hover:border-white/10 hover:shadow-cyber transition-all group">
            <div className="relative p-0.5  rounded-full bg-gradient-to-br from-primary/50 to-accent/50 group-hover:from-primary group-hover:to-accent transition-all duration-300">
              <div className="bg-black rounded-full  p-0.5">
                <Avatar name={user?.name} src={user?.avatar} size="xs"  />
              </div>
            </div>
            {user?.name && <span className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">{user.name}</span>}
          </Link>
        </div>

        {/* Page Content */}
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-custom p-4 lg:p-6 focus:outline-none">
          <div className="w-full h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
