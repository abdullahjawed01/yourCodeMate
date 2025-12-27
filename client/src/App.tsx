import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import PythonLearning from '@/pages/PythonLearning';
import JavascriptLearning from '@/pages/JavascriptLearning';
import IDE from '@/pages/IDE';
import AIMentor from '@/pages/AIMentor';
import Interview from '@/pages/Interview';
import CodingTests from '@/pages/CodingTests';
import TestDetail from '@/pages/TestDetail';
import LearningPaths from '@/pages/LearningPaths';
import Progress from '@/pages/Progress';
import RouteList from '@/pages/RouteList';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/python" element={<ProtectedRoute><PythonLearning /></ProtectedRoute>} />
        <Route path="/javascript" element={<ProtectedRoute><JavascriptLearning /></ProtectedRoute>} />
        <Route path="/tests/:id" element={<ProtectedRoute><TestDetail /></ProtectedRoute>} />
        <Route path="/test" element={<ProtectedRoute><CodingTests /></ProtectedRoute>} />
        <Route path="/ide" element={<ProtectedRoute><IDE /></ProtectedRoute>} />
        <Route path="/mentor" element={<ProtectedRoute><AIMentor /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
        <Route path="/paths" element={<ProtectedRoute><LearningPaths /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
        <Route path="/routes" element={<RouteList />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
