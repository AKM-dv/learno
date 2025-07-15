// src/components/layout/Header.js - Mobile Responsive Version
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  User, 
  BookOpen, 
  ChevronDown, 
  GraduationCap, 
  Shield,
  Menu,
  X
} from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowMobileMenu(false);
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

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/seminars", label: "Seminars" },
    { to: "/coaches", label: "Coaches" }
  ];

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Learno</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 bg-gray-50 px-3 py-2 rounded-md transition-colors"
                >
                  {getUserTypeIcon()}
                  <span className="text-sm font-medium">{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-600">{getUserTypeDisplay()}</p>
                    </div>
                    <Link
                      to={getDashboardLink()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Desktop Login Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 bg-gray-50 px-3 py-2 rounded-md transition-colors"
                  >
                    <span>Login</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showLoginDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <Link
                        to="/student/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        Student Login
                      </Link>
                      <Link
                        to="/admin/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        Admin Login
                      </Link>
                    </div>
                  )}
                </div>

                {/* Desktop Register Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowRegisterDropdown(!showRegisterDropdown)}
                    className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <span>Sign Up</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showRegisterDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <Link
                        to="/student/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowRegisterDropdown(false)}
                      >
                        Register as Student
                      </Link>
                      <Link
                        to="/coach/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowRegisterDropdown(false)}
                      >
                        Apply as Coach
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowMobileMenu(false)} />
          
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">Learno</span>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4">
              {isAuthenticated ? (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {getUserTypeIcon()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-600">{getUserTypeDisplay()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      to={getDashboardLink()}
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Dashboard
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Navigation Links */}
                  <div className="space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Auth Section */}
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Login</p>
                      <div className="space-y-2">
                        <Link
                          to="/student/login"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          Student Login
                        </Link>
                        <Link
                          to="/coach/login"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          Coach Login
                        </Link>
                        <Link
                          to="/admin/login"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          Admin Login
                        </Link>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Sign Up</p>
                      <div className="space-y-2">
                        <Link
                          to="/student/register"
                          className="block w-full bg-blue-600 text-white text-center px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          Register as Student
                        </Link>
                        <Link
                          to="/coach/register"
                          className="block w-full bg-green-600 text-white text-center px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          Apply as Coach
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showLoginDropdown || showRegisterDropdown || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowLoginDropdown(false);
            setShowRegisterDropdown(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;