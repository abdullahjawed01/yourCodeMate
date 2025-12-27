import React from 'react';
import { motion } from 'framer-motion';
import { Code, Target, Users, Zap, Award, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const About: React.FC = () => {
  const features = [
    {
      icon: Code,
      title: 'Interactive Coding',
      description: 'Practice with real coding challenges and get instant feedback.',
    },
    {
      icon: Target,
      title: 'Goal-Oriented Learning',
      description: 'Set goals, track progress, and unlock new challenges as you grow.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Learn alongside peers, compete on leaderboards, and share achievements.',
    },
    {
      icon: Zap,
      title: 'AI-Powered',
      description: 'Get personalized explanations, hints, and mentorship from AI.',
    },
    {
      icon: Award,
      title: 'Gamification',
      description: 'Earn points, badges, and level up as you master new concepts.',
    },
    {
      icon: BookOpen,
      title: 'Structured Paths',
      description: 'Follow curated learning paths from beginner to advanced levels.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            About CodeMate
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Empowering developers to master coding through AI-powered learning and practice.
          </p>
        </motion.div>
      </div>

      {/* Mission */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          CodeMate is dedicated to making coding education accessible, engaging, and effective. 
          We believe that everyone can learn to code with the right tools, guidance, and practice. 
          Our platform combines AI-powered mentorship, interactive challenges, and gamification 
          to create a comprehensive learning experience that adapts to your pace and style.
        </p>
      </Card>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-6 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Users', value: '10K+' },
          { label: 'Coding Tests', value: '500+' },
          { label: 'Topics Covered', value: '50+' },
          { label: 'Success Rate', value: '95%' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Team/Values */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Our Values
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Excellence
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We strive for the highest quality in our content, platform, and user experience.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Innovation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We leverage cutting-edge AI technology to provide personalized learning experiences.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Community
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We believe in the power of learning together and supporting each other's growth.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default About;


