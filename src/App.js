// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/public/Home';

// Auth pages
import LoginSelection from './pages/auth/LoginSelection';
import StudentLogin from './pages/auth/StudentLogin';
import CoachLogin from './pages/auth/CoachLogin';
import AdminLogin from './pages/auth/AdminLogin';
import Register from './pages/auth/Register';

// Dashboard pages
import UserDashboard from './pages/user/Dashboard';
import CoachDashboard from './pages/coach/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';


import Seminars from './pages/public/Seminars';
import SeminarDetail from './pages/public/SeminarDetail';



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              
              {/* Login Routes */}
              <Route path="/login" element={<LoginSelection />} />
              <Route path="/student/login" element={<StudentLogin />} />
              <Route path="/coach/login" element={<CoachLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Registration Routes */}
              <Route path="/register" element={<Register />} />
              <Route path="/student/register" element={<Register />} />
              <Route path="/coach/register" element={<Register />} />
              <Route path="/seminars" element={<Seminars />} />
<Route path="/seminar/:id" element={<SeminarDetail />} />

<Route 
  path="/coach/dashboard" 
  element={
    <ProtectedRoute allowedRoles={['coach']}>
      <CoachDashboard />
    </ProtectedRoute>
  } 
/>
              
              {/* Protected User Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Coach Routes */}
              <Route 
                path="/coach/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['coach']}>
                    <CoachDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;