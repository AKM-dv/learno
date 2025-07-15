// src/components/layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">Learno</span>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering learners through quality seminars and expert coaching.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/seminars" className="text-gray-400 hover:text-white transition-colors">
                  Seminars
                </Link>
              </li>
              <li>
                <Link to="/coaches" className="text-gray-400 hover:text-white transition-colors">
                  Coaches
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>Email: support@learno.com</p>
              <p>Phone: +1 234 567 8900</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2025 Learno. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;