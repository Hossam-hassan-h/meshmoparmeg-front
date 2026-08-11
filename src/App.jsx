import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Login, Register } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { VideoPlayer } from './pages/VideoPlayer';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#2563EB] selection:text-white">
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0F172A',
                color: '#FFFFFF',
                borderRadius: '1rem',
                fontSize: '14px',
                fontWeight: '500',
              },
            }}
          />
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Catalog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/course/:id" element={<VideoPlayer />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/manage-users" element={<AdminDashboard />} />
                <Route path="/admin/create-course" element={<AdminDashboard />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}
