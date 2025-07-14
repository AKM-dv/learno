// src/components/layout/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, BookOpen, ChevronDown, GraduationCap, Shield } from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.user_type === 'admin') return '/admin/dashboard';
    if (user?.user_type === 'coach') return '/coach/dashboard';
    return '/dashboard';
  };

  const getUserTypeDisplay = () => {
    if (user?.user_type === 'admin') return 'Admin';
    if (user?.user_type === 'coach') return 'Coach';
    return 'Student';
  };

  const getUserTypeIcon = () => {
    if (user?.user_type === 'admin') return <Shield className="h-4 w-4" />;
    if (user?.user_type === 'coach') return <GraduationCap className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Learno</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/seminars" className="text-gray-700 hover:text-blue-600 transition-colors">
              Seminars
            </Link>
            <Link to="/coaches" className="text-gray-700 hover:text-blue-600 transition-colors">
              Coaches
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <Link
                  to={getDashboardLink()}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {getUserTypeIcon()}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-gray-500">{getUserTypeDisplay()}</span>
                  </div>
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-md hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                
                {/* Login Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowLoginDropdown(!showLoginDropdown);
                      setShowRegisterDropdown(false);
                    }}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <span>Login</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {showLoginDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/student/login"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        <User className="h-4 w-4 text-blue-600" />
                        <span>Student Login</span>
                      </Link>
                      <Link
                        to="/coach/login"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        <GraduationCap className="h-4 w-4 text-green-600" />
                        <span>Coach Login</span>
                      </Link>
                      <Link
                        to="/admin/login"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        <Shield className="h-4 w-4 text-purple-600" />
                        <span>Admin Login</span>
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-50"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        View All Options
                      </Link>
                    </div>
                  )}
                </div>

                {/* Register Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowRegisterDropdown(!showRegisterDropdown);
                      setShowLoginDropdown(false);
                    }}
                    className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <span>Register</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {showRegisterDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/student/register"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setShowRegisterDropdown(false)}
                      >
                        <User className="h-4 w-4 text-blue-600" />
                        <span>Join as Student</span>
                      </Link>
                      <Link
                        to="/coach/register"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                        onClick={() => setShowRegisterDropdown(false)}
                      >
                        <GraduationCap className="h-4 w-4 text-green-600" />
                        <span>Apply as Coach</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showLoginDropdown || showRegisterDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowLoginDropdown(false);
            setShowRegisterDropdown(false);
          }}
        ></div>
      )}
    </header>
  );
};

export default Header;