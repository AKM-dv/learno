// src/pages/user/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Star, 
  TrendingUp, 
  Award, 
  User,
  Settings,
  CreditCard,
  Bell,
  Search,
  Filter,
  Eye,
  MessageSquare
} from 'lucide-react';
import api from '../../services/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [userSeminars, setUserSeminars] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/user/dashboard-summary');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  // Fetch user seminars
  const fetchUserSeminars = async () => {
    try {
      const response = await api.get('/user/seminars');
      if (response.data.success) {
        setUserSeminars(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user seminars:', error);
    }
  };

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    try {
      const response = await api.get('/payment/history');
      if (response.data.success) {
        setPaymentHistory(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDashboardData(),
        fetchUserSeminars(),
        fetchPaymentHistory()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const upcomingSeminars = dashboardData?.upcoming_seminars || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">Track your learning journey and manage your seminars</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/seminars"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Browse Seminars</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Seminars</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_registrations || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed_seminars || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcoming_seminars || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.total_spent || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'seminars', label: 'My Seminars', icon: Calendar },
                { id: 'payments', label: 'Payment History', icon: CreditCard },
                { id: 'profile', label: 'Profile Settings', icon: Settings }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Upcoming Seminars */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Seminars</h3>
                  {upcomingSeminars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {upcomingSeminars.map((seminar) => (
                        <div key={seminar.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-semibold text-gray-900 mb-2">{seminar.title}</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{formatDate(seminar.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{formatTime(seminar.time)}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              <span>{seminar.coach_name}</span>
                            </div>
                          </div>
                          <Link
                            to={`/seminar/${seminar.id}`}
                            className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming seminars</h3>
                      <p className="text-gray-600 mb-4">Discover and register for amazing seminars</p>
                      <Link
                        to="/seminars"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Browse Seminars
                      </Link>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      to="/seminars"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <Search className="h-8 w-8 text-blue-600 mr-4" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Browse Seminars</h4>
                        <p className="text-sm text-gray-600">Discover new learning opportunities</p>
                      </div>
                    </Link>

                    <button
                      onClick={() => setActiveTab('seminars')}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                    >
                      <Calendar className="h-8 w-8 text-green-600 mr-4" />
                      <div>
                        <h4 className="font-semibold text-gray-900">My Seminars</h4>
                        <p className="text-sm text-gray-600">Manage your registrations</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('profile')}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                    >
                      <User className="h-8 w-8 text-purple-600 mr-4" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Update Profile</h4>
                        <p className="text-sm text-gray-600">Manage your account settings</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* My Seminars Tab */}
            {activeTab === 'seminars' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Seminars</h3>
                  <Link
                    to="/seminars"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                    Browse More Seminars
                  </Link>
                </div>

                {userSeminars.length > 0 ? (
                  <div className="space-y-4">
                    {userSeminars.map((seminar) => (
                      <div key={seminar.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{seminar.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(seminar.status)}`}>
                                {seminar.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{formatDate(seminar.date)} at {formatTime(seminar.time)}</span>
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                <span>{seminar.coach_name}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>{seminar.duration_minutes} minutes</span>
                              </div>
                            </div>

                            <p className="text-gray-700 mb-4">{seminar.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="text-sm text-gray-600">
                            Registered on {formatDate(seminar.registered_at)}
                          </div>
                          <div className="flex items-center space-x-3">
                            <Link
                              to={`/seminar/${seminar.id}`}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              View Details
                            </Link>
                            {seminar.status === 'completed' && (
                              <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                                <Star className="h-4 w-4 mr-1" />
                                Add Review
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No seminars yet</h3>
                    <p className="text-gray-600 mb-6">Start your learning journey by registering for a seminar</p>
                    <Link
                      to="/seminars"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                      Browse Seminars
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Payment History Tab */}
            {activeTab === 'payments' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment History</h3>
                
                {paymentHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Seminar
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment ID
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{payment.seminar_title}</div>
                                <div className="text-sm text-gray-500">{payment.coach_name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(payment.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{payment.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(payment.payment_status)}`}>
                                {payment.payment_status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.razorpay_payment_id || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payment history</h3>
                    <p className="text-gray-600">Your payment history will appear here after you register for seminars</p>
                  </div>
                )}
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
                <UserProfileForm user={user} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// User Profile Form Component
const UserProfileForm = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contactNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.put('/user/update-profile', {
        name: formData.name,
        contact_number: formData.contactNumber
      });

      if (response.data.success) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number
          </label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your contact number"
          />
        </div>

        {message && (
          <div className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default UserDashboard;