// src/pages/coach/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Star, 
  Plus,
  Calendar,
  Clock,
  MapPin,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Award,
  Settings,
  Upload,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const CoachDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [seminars, setSeminars] = useState([]);
  const [earnings, setEarnings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateSeminar, setShowCreateSeminar] = useState(false);

  // Fetch coach stats
  const fetchStats = async () => {
    try {
      const response = await api.get('/coach/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Fetch coach seminars
  const fetchSeminars = async () => {
    try {
      const response = await api.get('/coach/seminars');
      if (response.data.success) {
        setSeminars(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch seminars:', error);
    }
  };

  // Fetch earnings
  const fetchEarnings = async () => {
    try {
      const response = await api.get('/coach/earnings');
      if (response.data.success) {
        setEarnings(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchSeminars(),
        fetchEarnings()
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Coach Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user?.name}! Manage your seminars and track your performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateSeminar(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Seminar</span>
              </button>
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
                <p className="text-2xl font-bold text-gray-900">{stats.total_seminars || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_students || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.total_earnings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avg_rating || 0}</p>
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
                { id: 'earnings', label: 'Earnings', icon: DollarSign },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-green-500 text-green-600'
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
                
                {/* Recent Seminars */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Seminars</h3>
                  {seminars.slice(0, 3).length > 0 ? (
                    <div className="space-y-4">
                      {seminars.slice(0, 3).map((seminar) => (
                        <div key={seminar.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{seminar.title}</h4>
                              <p className="text-sm text-gray-600">
                                {formatDate(seminar.date)} at {formatTime(seminar.time)}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(seminar.status)}`}>
                              {seminar.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No seminars yet</h3>
                      <p className="text-gray-600 mb-4">Create your first seminar to start teaching</p>
                      <button
                        onClick={() => setShowCreateSeminar(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Create Seminar
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100">Available Balance</p>
                          <p className="text-2xl font-bold">₹{earnings.available_balance || 0}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-blue-200" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100">This Month</p>
                          <p className="text-2xl font-bold">{seminars.filter(s => s.status === 'upcoming').length}</p>
                          <p className="text-green-100 text-sm">Upcoming Seminars</p>
                        </div>
                        <Calendar className="h-8 w-8 text-green-200" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100">Total Students</p>
                          <p className="text-2xl font-bold">{stats.total_students || 0}</p>
                        </div>
                        <Users className="h-8 w-8 text-purple-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Seminars Tab */}
            {activeTab === 'seminars' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Seminars</h3>
                  <button
                    onClick={() => setShowCreateSeminar(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create New Seminar</span>
                  </button>
                </div>

                {seminars.length > 0 ? (
                  <div className="space-y-4">
                    {seminars.map((seminar) => (
                      <SeminarCard 
                        key={seminar.id} 
                        seminar={seminar} 
                        onUpdate={fetchSeminars}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        getStatusColor={getStatusColor}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No seminars created yet</h3>
                    <p className="text-gray-600 mb-6">Start sharing your knowledge by creating your first seminar</p>
                    <button
                      onClick={() => setShowCreateSeminar(true)}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                    >
                      Create Your First Seminar
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <EarningsTab earnings={earnings} />
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <CoachSettings user={user} />
            )}
          </div>
        </div>
      </div>

      {/* Create Seminar Modal */}
      {showCreateSeminar && (
        <CreateSeminarModal 
          onClose={() => setShowCreateSeminar(false)}
          onSuccess={() => {
            setShowCreateSeminar(false);
            fetchSeminars();
          }}
        />
      )}
    </div>
  );
};

// Seminar Card Component
const SeminarCard = ({ seminar, onUpdate, formatDate, formatTime, getStatusColor }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleCancelSeminar = async (seminarId) => {
    if (window.confirm('Are you sure you want to cancel this seminar?')) {
      try {
        const response = await api.post(`/coach/cancel-seminar/${seminarId}`);
        if (response.data.success) {
          alert('Seminar cancelled successfully');
          onUpdate();
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        alert('Failed to cancel seminar');
      }
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="text-lg font-semibold text-gray-900">{seminar.title}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(seminar.status)}`}>
              {seminar.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(seminar.date)} at {formatTime(seminar.time)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{seminar.venue}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>{seminar.seats_booked || 0}/{seminar.max_seats} seats</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>₹{seminar.price}</span>
            </div>
          </div>

          {showDetails && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md">
              <p className="text-gray-700 mb-2">{seminar.description}</p>
              {seminar.category && (
                <p className="text-sm text-gray-600">Category: {seminar.category}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          Created on {formatDate(seminar.created_at)}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
          {seminar.status === 'upcoming' && (
            <>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleCancelSeminar(seminar.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Earnings Tab Component
const EarningsTab = ({ earnings }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
      
      {/* Earnings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-gray-900">₹{earnings.available_balance || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Withdrawals</p>
              <p className="text-2xl font-bold text-gray-900">₹{earnings.pending_withdrawals || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Withdrawn</p>
              <p className="text-2xl font-bold text-gray-900">₹{earnings.total_withdrawn || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">₹{earnings.total_earnings || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Request Withdrawal</h4>
        <WithdrawalForm availableBalance={earnings.available_balance || 0} />
      </div>
    </div>
  );
};

// Withdrawal Form Component
const WithdrawalForm = ({ availableBalance }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || amount < 100) {
      setMessage('Minimum withdrawal amount is ₹100');
      return;
    }

    if (amount > availableBalance) {
      setMessage('Amount exceeds available balance');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/coach/request-withdrawal', { amount: parseFloat(amount) });
      
      if (response.data.success) {
        setMessage('Withdrawal request submitted successfully!');
        setAmount('');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to request withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          Withdrawal Amount (₹)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="100"
          max={availableBalance}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter amount to withdraw"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Available: ₹{availableBalance} | Minimum: ₹100
        </p>
      </div>

      {message && (
        <div className={`text-sm mb-4 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !amount}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Request Withdrawal'}
      </button>
    </form>
  );
};

// Coach Settings Component
const CoachSettings = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    specialization: '',
    experience_years: ''
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
      const response = await api.put('/coach/profile', formData);

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
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Web Development, Data Science"
            />
          </div>

          <div>
            <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              id="experience_years"
              name="experience_years"
              value={formData.experience_years}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Tell students about yourself, your experience, and expertise..."
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
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

// Create Seminar Modal Component
const CreateSeminarModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    duration_minutes: '',
    venue: '',
    price: '',
    early_bird_price: '',
    early_bird_deadline: '',
    max_seats: '',
    requirements_text: '',
    what_you_learn: ''
  });
  const [seminarImage, setSeminarImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSeminarImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const submitData = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      // Append image if selected
      if (seminarImage) {
        submitData.append('seminar_image', seminarImage);
      }

      const response = await api.post('/coach/create-seminar', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMessage('Seminar created successfully!');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setMessage(response.data.message || 'Failed to create seminar');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create seminar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Seminar</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Seminar Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter an engaging title for your seminar"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe what your seminar is about, who it's for, and what students will gain"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select a category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Design">Design</option>
                    <option value="Finance">Finance</option>
                    <option value="Personal Development">Personal Development</option>
                    <option value="Business">Business</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="seminar_image" className="block text-sm font-medium text-gray-700 mb-1">
                    Seminar Image
                  </label>
                  <input
                    type="file"
                    id="seminar_image"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Schedule & Venue */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Schedule & Venue</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    id="duration_minutes"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    min="30"
                    max="480"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 120"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
                  Venue *
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Online (Zoom), Conference Hall, IT Park Chandigarh"
                  required
                />
              </div>
            </div>

            {/* Pricing & Capacity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Pricing & Capacity</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Regular price"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="max_seats" className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Seats *
                  </label>
                  <input
                    type="number"
                    id="max_seats"
                    name="max_seats"
                    value={formData.max_seats}
                    onChange={handleChange}
                    min="1"
                    max="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="early_bird_price" className="block text-sm font-medium text-gray-700 mb-1">
                    Early Bird Price (₹)
                  </label>
                  <input
                    type="number"
                    id="early_bird_price"
                    name="early_bird_price"
                    value={formData.early_bird_price}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Discounted price"
                  />
                </div>

                <div>
                  <label htmlFor="early_bird_deadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Early Bird Deadline
                  </label>
                  <input
                    type="date"
                    id="early_bird_deadline"
                    name="early_bird_deadline"
                    value={formData.early_bird_deadline}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Content Details</h3>
              
              <div>
                <label htmlFor="what_you_learn" className="block text-sm font-medium text-gray-700 mb-1">
                  What You'll Learn
                </label>
                <textarea
                  id="what_you_learn"
                  name="what_you_learn"
                  value={formData.what_you_learn}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="List the key learning outcomes (one per line)&#10;e.g.:&#10;Build dynamic web applications&#10;Master React hooks and state management&#10;Deploy applications to production"
                />
              </div>

              <div>
                <label htmlFor="requirements_text" className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  id="requirements_text"
                  name="requirements_text"
                  value={formData.requirements_text}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="List any prerequisites or requirements (one per line)&#10;e.g.:&#10;Basic HTML and CSS knowledge&#10;Laptop with code editor installed&#10;Willingness to learn"
                />
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`text-sm p-3 rounded-md ${
                message.includes('success') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {message.includes('success') ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  )}
                  {message}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Seminar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;