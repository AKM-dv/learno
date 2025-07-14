// src/pages/auth/Register.js - Updated version
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Eye, EyeOff, UserPlus, User, GraduationCap } from 'lucide-react';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();

  // Determine user type from route
  const getUserTypeFromRoute = () => {
    if (location.pathname.includes('/coach/')) return 'coach';
    if (location.pathname.includes('/student/')) return 'user';
    return 'user'; // Default to user
  };

  const userType = getUserTypeFromRoute();
  const isCoachRegistration = userType === 'coach';

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    userType: userType
  });

  // Update userType when route changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, userType: getUserTypeFromRoute() }));
  }, [location.pathname]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  // Form validation
  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        contact_number: formData.contactNumber,
        user_type: formData.userType
      });

      if (result.success) {
        setSuccess(result.message);
        // Redirect to appropriate login page after 2 seconds
        setTimeout(() => {
          if (isCoachRegistration) {
            navigate('/coach/login');
          } else {
            navigate('/student/login');
          }
        }, 2000);
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic styling based on user type
  const getColors = () => {
    if (isCoachRegistration) {
      return {
        gradient: 'from-green-50 to-emerald-100',
        primary: 'green-600',
        primaryHover: 'green-700',
        primaryLight: 'green-50',
        icon: 'green-600',
        focus: 'green-500'
      };
    }
    return {
      gradient: 'from-blue-50 to-indigo-100',
      primary: 'blue-600',
      primaryHover: 'blue-700',
      primaryLight: 'blue-50',
      icon: 'blue-600',
      focus: 'blue-500'
    };
  };

  const colors = getColors();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.gradient} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className={`bg-${colors.primaryLight} p-3 rounded-full`}>
              {isCoachRegistration ? (
                <GraduationCap className={`h-8 w-8 text-${colors.icon}`} />
              ) : (
                <User className={`h-8 w-8 text-${colors.icon}`} />
              )}
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isCoachRegistration ? 'Become a Coach' : 'Join as Student'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isCoachRegistration 
              ? 'Share your knowledge and earn money' 
              : 'Start your learning journey today'
            }
          </p>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
            
            {/* Success Message */}
            {success && (
              <div className={`bg-${colors.primaryLight} border border-${colors.primary} text-${colors.primary} px-4 py-3 rounded-md text-sm`}>
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-2">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${colors.focus} focus:border-${colors.focus}`}
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${colors.focus} focus:border-${colors.focus}`}
                placeholder="Enter your email"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor="contactNumber" className="text-sm font-medium text-gray-700 block mb-2">
                Contact Number
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${colors.focus} focus:border-${colors.focus}`}
                placeholder="Enter your contact number"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${colors.focus} focus:border-${colors.focus} pr-10`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${colors.focus} focus:border-${colors.focus} pr-10`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Coach Notice */}
            {isCoachRegistration && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                <p className="text-sm text-yellow-700">
                  <strong>Note for Coaches:</strong> Your account will need admin approval before you can start creating seminars.
                </p>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="text-sm text-gray-600">
              By registering, you agree to our{' '}
              <a href="/terms" className={`text-${colors.primary} hover:text-${colors.primaryHover}`}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className={`text-${colors.primary} hover:text-${colors.primaryHover}`}>
                Privacy Policy
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-${colors.primary} hover:bg-${colors.primaryHover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${colors.focus} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isCoachRegistration ? 'Apply as Coach' : 'Create Student Account'}
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to={isCoachRegistration ? '/coach/login' : '/student/login'}
              className={`font-medium text-${colors.primary} hover:text-${colors.primaryHover}`}
            >
              Sign in here
            </Link>
          </p>
          <div className="text-sm text-gray-500">
            <Link to="/login" className="text-gray-600 hover:text-gray-800">
              ← Back to login options
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;