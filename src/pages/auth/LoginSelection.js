// src/pages/auth/LoginSelection.js
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, GraduationCap, Shield, ArrowRight } from 'lucide-react';

const LoginSelection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
            Welcome to Learno
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose your login type to access your account
          </p>
        </div>

        {/* Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          
          {/* Student Login */}
          <Link
            to="/student/login"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-2 border-transparent hover:border-blue-200 transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Student</h3>
              <p className="text-gray-600 mb-4">
                Access your learning dashboard, view registered seminars, and track your progress.
              </p>
              <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                <span className="font-medium">Student Login</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Coach Login */}
          <Link
            to="/coach/login"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-2 border-transparent hover:border-green-200 transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Coach</h3>
              <p className="text-gray-600 mb-4">
                Manage your seminars, view student registrations, and track your earnings.
              </p>
              <div className="flex items-center justify-center text-green-600 group-hover:text-green-700">
                <span className="font-medium">Coach Login</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Admin Login */}
          <Link
            to="/admin/login"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-2 border-transparent hover:border-purple-200 transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Admin</h3>
              <p className="text-gray-600 mb-4">
                Platform administration, manage users, approve coaches, and view analytics.
              </p>
              <div className="flex items-center justify-center text-purple-600 group-hover:text-purple-700">
                <span className="font-medium">Admin Login</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Registration Links */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Don't have an account?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/student/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 text-center font-medium"
            >
              Register as Student
            </Link>
            <Link
              to="/coach/register"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 text-center font-medium"
            >
              Apply as Coach
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;