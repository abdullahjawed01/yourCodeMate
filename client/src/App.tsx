import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageTransition } from '@/components/PageTransition';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Existing pages
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const LearnLanguage = lazy(() => import('@/pages/LearnLanguage'));
const IDE = lazy(() => import('@/pages/IDE'));
const AIMentor = lazy(() => import('@/pages/AIMentor'));
const Interview = lazy(() => import('@/pages/Interview'));
const CodingTests = lazy(() => import('@/pages/CodingTests'));
const TestDetail = lazy(() => import('@/pages/TestDetail'));
const LearningPaths = lazy(() => import('@/pages/LearningPaths'));
const Progress = lazy(() => import('@/pages/Progress'));
const RouteList = lazy(() => import('@/pages/RouteList'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));

// New pages
const Profile = lazy(() => import('@/pages/Profile'));
const Friends = lazy(() => import('@/pages/Friends'));
const CodingBattle = lazy(() => import('@/pages/CodingBattle'));
const Chat = lazy(() => import('@/pages/Chat'));
const Achievements = lazy(() => import('@/pages/Achievements'));
const Community = lazy(() => import('@/pages/Community'));
const Contests = lazy(() => import('@/pages/Contests'));
const AlgorithmVisualizer = lazy(() => import('@/pages/AlgorithmVisualizer'));
const Collaborate = lazy(() => import('@/pages/Collaborate'));

import { ScrollToTop } from '@/components/ScrollToTop';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Loading Fallback Component
const RouteLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Core */}
            <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><PageTransition><Progress /></PageTransition></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><PageTransition><Leaderboard /></PageTransition></ProtectedRoute>} />

            {/* Learn */}
            <Route path="/learn/:langId" element={<ProtectedRoute><PageTransition><LearnLanguage /></PageTransition></ProtectedRoute>} />
            <Route path="/paths" element={<ProtectedRoute><PageTransition><LearningPaths /></PageTransition></ProtectedRoute>} />
            <Route path="/visualizer" element={<ProtectedRoute><PageTransition><AlgorithmVisualizer /></PageTransition></ProtectedRoute>} />

            {/* Compete */}
            <Route path="/test" element={<ProtectedRoute><PageTransition><CodingTests /></PageTransition></ProtectedRoute>} />
            <Route path="/tests/:id" element={<ProtectedRoute><PageTransition><TestDetail /></PageTransition></ProtectedRoute>} />
            <Route path="/battle" element={<ProtectedRoute><PageTransition><CodingBattle /></PageTransition></ProtectedRoute>} />
            <Route path="/contests" element={<ProtectedRoute><PageTransition><Contests /></PageTransition></ProtectedRoute>} />

            {/* AI Tools */}
            <Route path="/ide" element={<ProtectedRoute><PageTransition><IDE /></PageTransition></ProtectedRoute>} />
            <Route path="/collab" element={<ProtectedRoute><PageTransition><Collaborate /></PageTransition></ProtectedRoute>} />
            <Route path="/collab/:roomId" element={<ProtectedRoute><Collaborate /></ProtectedRoute>} />
            <Route path="/mentor" element={<ProtectedRoute><PageTransition><AIMentor /></PageTransition></ProtectedRoute>} />
            <Route path="/interview" element={<ProtectedRoute><PageTransition><Interview /></PageTransition></ProtectedRoute>} />

            {/* Social */}
            <Route path="/friends" element={<ProtectedRoute><PageTransition><Friends /></PageTransition></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><PageTransition><Chat /></PageTransition></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><PageTransition><Community /></PageTransition></ProtectedRoute>} />

            {/* Profile */}
            <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute><PageTransition><Achievements /></PageTransition></ProtectedRoute>} />

            {/* Misc */}
            <Route path="/routes" element={<PageTransition><RouteList /></PageTransition>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
