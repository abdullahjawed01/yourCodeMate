import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Route, Lock, Unlock, Shield, Loader2 } from 'lucide-react';
import api from '@/utils/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RouteInfo {
  method: string;
  path: string;
  description: string;
  auth: boolean;
  admin?: boolean;
}

const RouteList: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: routeData, isLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const response = await api.get('/routes');
      return response.data;
    },
  });

  useEffect(() => {
    if (!isLoading && routeData && containerRef.current) {
      const categories = containerRef.current.querySelectorAll('.route-category-card');

      categories.forEach((card) => {
        const items = card.querySelectorAll('.route-item');

        gsap.fromTo(card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        if (items.length > 0) {
          gsap.fromTo(items,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              stagger: 0.05,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 75%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoading, routeData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-400 mx-auto mb-4" />
          <p className="text-white/70">Loading routes...</p>
        </div>
      </div>
    );
  }

  const groupedRoutes = routeData?.routes?.reduce((acc: Record<string, RouteInfo[]>, route: RouteInfo) => {
    const category = route.path.split('/')[1] || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(route);
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-8 pb-20" ref={containerRef}>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex mb-12 items-center space-x-6 bg-card/30 p-8 rounded-3xl border border-border/50 backdrop-blur-md shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent-neon flex items-center justify-center shadow-cyber relative z-10 transform group-hover:rotate-12 transition-transform duration-500">
          <Route className="w-8 h-8 text-black" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-foreground tracking-tight mb-2">API Documentation</h1>
          <p className="text-muted-foreground text-lg">System architecture exposed ({routeData?.total || 0} active endpoints)</p>
          <div className="inline-block px-3 py-1 mt-3 bg-black/40 border border-white/10 rounded-md font-code text-sm text-accent-neon">
            {routeData?.baseUrl || 'http://localhost:5000'}
          </div>
        </div>
      </motion.div>

      {Object.entries(groupedRoutes).map(([category, routes]) => (
        <div key={category} className="route-category-card opacity-0">
          <Card className="p-6 md:p-8 backdrop-blur-md bg-card/40 border-border/40 shadow-xl overflow-hidden relative">

            {/* Decorative background glow for cards */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-2xl font-bold text-foreground mb-6 capitalize flex items-center gap-3">
              <span className="w-2 h-8 rounded-full bg-accent-neon inline-block" />
              {category === 'auth' ? 'Authentication' :
                category === 'test' ? 'Tests' :
                  category === 'admin' ? 'Admin' :
                    category === 'ai' ? 'AI Features' :
                      category === 'dashboard' ? 'Dashboard' :
                        category === 'progress' ? 'Progress' :
                          category === 'leaderboard' ? 'Leaderboard' :
                            category === 'interview' ? 'Interview' :
                              category === 'hint' ? 'Hints' :
                                category === 'recommend' ? 'Recommendations' :
                                  category === 'gamification' ? 'Gamification' :
                                    category === 'path' ? 'Learning Paths' :
                                      category === 'mentor' ? 'AI Mentor' :
                                        category === 'ide' ? 'IDE' :
                                          category === 'users' ? 'Users' :
                                            category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
            <div className="space-y-4">
              {(routes as RouteInfo[]).map((route, index) => (
                <div
                  key={`${route.method}-${route.path}-${index}`}
                  className="route-item opacity-0 p-5 bg-black/20 rounded-xl border border-white/5 hover:border-accent-neon/50 hover:bg-black/40 transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <div className="flex items-center space-x-4 flex-1">
                      <Badge variant={route.method === 'GET' ? 'info' : route.method === 'POST' ? 'success' : route.method === 'PUT' ? 'warning' : 'danger'} className="text-xs font-bold tracking-widest px-3 py-1 bg-opacity-20 border-opacity-50 min-w-[70px] text-center justify-center">
                        {route.method}
                      </Badge>
                      <code className="text-accent-neon font-code text-sm md:text-base group-hover:text-white transition-colors">
                        {route.path}
                      </code>
                    </div>
                    <div className="flex items-center space-x-3">
                      {route.auth && (
                        <Badge variant="warning" size="sm" className="flex items-center space-x-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-500 border-amber-500/20">
                          <Lock className="w-3.5 h-3.5" />
                          <span className="text-xs tracking-wider uppercase font-semibold">Auth</span>
                        </Badge>
                      )}
                      {!route.auth && (
                        <Badge variant="success" size="sm" className="flex items-center space-x-1.5 px-2.5 py-1 bg-green-500/10 text-green-500 border-green-500/20">
                          <Unlock className="w-3.5 h-3.5" />
                          <span className="text-xs tracking-wider uppercase font-semibold">Public</span>
                        </Badge>
                      )}
                      {route.admin && (
                        <Badge variant="danger" size="sm" className="flex items-center space-x-1.5 px-2.5 py-1 bg-red-500/10 text-red-500 border-red-500/20">
                          <Shield className="w-3.5 h-3.5" />
                          <span className="text-xs tracking-wider uppercase font-semibold">Admin</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm ml-[86px] leading-relaxed border-l border-border/30 pl-4">{route.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default RouteList;
