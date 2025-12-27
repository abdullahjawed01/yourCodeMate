import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Code } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Moon, Sun } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="relative group">
          <div className="absolute inset-[-4px] rounded-2xl bg-gradient-to-r from-primary-500/50 to-purple-600/50 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <div className="relative glass-card bg-black rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)]"
              >
                <Code className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Welcome to CodeMate
              </h1>
              <p className="text-gray-400">Initialize your session to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <Input
                  type="email"
                  label=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<Mail className="w-5 h-5 text-primary-400" />}
                  placeholder="Enter your email"
                  className="bg-white/5 border-white/10 focus:border-primary-500/50 text-white placeholder:text-gray-500 h-12"
                />

                <Input
                  type="password"
                  label=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  icon={<Lock className="w-5 h-5 text-primary-400" />}
                  placeholder="Enter your password"
                  className="bg-white/5 border-white/10 focus:border-primary-500/50 text-white placeholder:text-gray-500 h-12"
                />
              </div>

              <Button type="submit" isLoading={loading} className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary-600 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-300">
                Initialize Session
              </Button>
            </form>

            <div className="mt-8 text-center border-t border-white/5 pt-6">
              <p className="text-sm text-gray-400">
                New to the network?{' '}
                <Link
                  to="/register"
                  className="text-primary-400 hover:text-primary-300 font-bold transition-colors hover:underline"
                >
                  Deploy new user
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
