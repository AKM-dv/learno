import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome, {user?.username}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
          <p className="text-gray-600">
            Your admin dashboard is being built. Soon you'll be able to:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>• Manage users and coaches</li>
            <li>• Approve coach applications</li>
            <li>• View platform analytics</li>
            <li>• Handle withdrawals</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;