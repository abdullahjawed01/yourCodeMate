import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Route, Lock, Unlock, Shield, Loader2 } from 'lucide-react';
import api from '@/utils/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface RouteInfo {
  method: string;
  path: string;
  description: string;
  auth: boolean;
  admin?: boolean;
}

const RouteList: React.FC = () => {
  const { data: routeData, isLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const response = await api.get('/routes');
      return response.data;
    },
  });

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
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
          <Route className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">API Routes</h1>
          <p className="text-gray-600 dark:text-gray-400">All available endpoints ({routeData?.total || 0} routes)</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Base URL: {routeData?.baseUrl || 'http://localhost:5000'}</p>
        </div>
      </motion.div>

      {Object.entries(groupedRoutes).map(([category, routes], categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 capitalize">
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
            <div className="space-y-3">
              {(routes as RouteInfo[]).map((route, index) => (
                <motion.div
                  key={`${route.method}-${route.path}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3 flex-1">
                      <Badge variant={route.method === 'GET' ? 'info' : route.method === 'POST' ? 'success' : route.method === 'PUT' ? 'warning' : 'danger'}>
                        {route.method}
                      </Badge>
                      <code className="text-primary-600 dark:text-primary-400 font-mono text-sm">{route.path}</code>
                    </div>
                    <div className="flex items-center space-x-2">
                      {route.auth && (
                        <Badge variant="warning" size="sm" className="flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span>Auth</span>
                        </Badge>
                      )}
                      {!route.auth && (
                        <Badge variant="success" size="sm" className="flex items-center space-x-1">
                          <Unlock className="w-3 h-3" />
                          <span>Public</span>
                        </Badge>
                      )}
                      {route.admin && (
                        <Badge variant="danger" size="sm" className="flex items-center space-x-1">
                          <Shield className="w-3 h-3" />
                          <span>Admin</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm ml-20">{route.description}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default RouteList;
