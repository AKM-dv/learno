// src/App.js - Updated with Error Boundaries
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/public/Home';

// Import Error Boundaries
import ErrorBoundary, { RouteErrorBoundary, NetworkErrorBoundary } from './components/common/ErrorBoundary';

// Auth pages
import LoginSelection from './pages/auth/LoginSelection';
import StudentLogin from './pages/auth/StudentLogin';
import CoachLogin from './pages/auth/CoachLogin';
import AdminLogin from './pages/auth/AdminLogin';
import Register from './pages/auth/Register';

// Public pages
import Seminars from './pages/public/Seminars';
import SeminarDetail from './pages/public/SeminarDetail';
import Coaches from './pages/public/Coaches';

// Dashboard pages
import UserDashboard from './pages/user/Dashboard';
import CoachDashboard from './pages/coach/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <NetworkErrorBoundary>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <ErrorBoundary>
                <Header />
              </ErrorBoundary>
              
              <main>
                <Routes>
                  {/* Public Routes */}
                  <Route 
                    path="/" 
                    element={
                      <RouteErrorBoundary>
                        <Home />
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/seminars" 
                    element={
                      <RouteErrorBoundary>
                        <Seminars />
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/seminar/:id" 
                    element={
                      <RouteErrorBoundary>
                        <SeminarDetail />
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/coaches" 
                    element={
                      <RouteErrorBoundary>
                        <Coaches />
                      </RouteErrorBoundary>
                    } 
                  />
                  
                  {/* Login Routes */}
                  <Route 
                    path="/login" 
                    element={
                      <RouteErrorBoundary>
                        <LoginSelection />
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/student/login" 
                    element={
                      <RouteErrorBoundary>
                        <StudentLogin />
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/coach/login" 
                    element={
                      <RouteErrorBoundary>
                        <CoachLogin />
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/admin/login" 
                    element={
                      <RouteErrorBoundary>
                        <AdminLogin />
                      </RouteErrorBoundary>
                    } 
                  />
                  
                  {/* Registration Routes */}
                  <Route 
                    path="/register" 
                    element={
                      <RouteErrorBoundary>
                        <Register />
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/student/register" 
                    element={
                      <RouteErrorBoundary>
                        <Register />
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/coach/register" 
                    element={
                      <RouteErrorBoundary>
                        <Register />
                      </RouteErrorBoundary>
                    } 
                  />
                  
                  {/* Protected User Routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <RouteErrorBoundary>
                        <ProtectedRoute allowedRoles={['user']}>
                          <UserDashboard />
                        </ProtectedRoute>
                      </RouteErrorBoundary>
                    } 
                  />
                  
                  {/* Protected Coach Routes */}
                  <Route 
                    path="/coach/dashboard" 
                    element={
                      <RouteErrorBoundary>
                        <ProtectedRoute allowedRoles={['coach']}>
                          <CoachDashboard />
                        </ProtectedRoute>
                      </RouteErrorBoundary>
                    } 
                  />
                  
                  {/* Protected Admin Routes */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <RouteErrorBoundary>
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      </RouteErrorBoundary>
                    } 
                  />
                </Routes>
              </main>
              
              <ErrorBoundary>
                <Footer />
              </ErrorBoundary>
            </div>
          </Router>
        </AuthProvider>
      </NetworkErrorBoundary>
    </ErrorBoundary>
  );
}

export default App;