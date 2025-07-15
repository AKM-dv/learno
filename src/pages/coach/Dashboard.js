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


// Add this after the imports, before CoachDashboard component
// Custom validation hook
const useFormValidation = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Validation functions
  const validateField = (name, value, allValues = values) => {
    const rules = validationRules[name];
    if (!rules) return '';

    for (const rule of rules) {
      const error = rule(value, allValues);
      if (error) return error;
    }
    return '';
  };

  // Validate all fields
  const validateForm = (valuesToValidate = values) => {
    const newErrors = {};
    let formIsValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, valuesToValidate[field], valuesToValidate);
      if (error) {
        newErrors[field] = error;
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  };

  // Handle field change
  const handleChange = (name, value) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);

    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value, newValues);
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    // Check overall form validity
    setTimeout(() => validateForm(newValues), 0);
  };

  // Handle field blur
  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateForm,
    setValues
  };
};

// Validation rules
const seminarValidationRules = {
  title: [
    (value) => !value ? 'Title is required' : '',
    (value) => value && value.length < 5 ? 'Title must be at least 5 characters' : '',
    (value) => value && value.length > 100 ? 'Title must be less than 100 characters' : ''
  ],
  description: [
    (value) => !value ? 'Description is required' : '',
    (value) => value && value.length < 20 ? 'Description must be at least 20 characters' : ''
  ],
  category: [
    (value) => !value ? 'Category is required' : ''
  ],
  date: [
    (value) => !value ? 'Date is required' : '',
    (value) => {
      if (!value) return '';
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate < today ? 'Date cannot be in the past' : '';
    }
  ],
  time: [
    (value) => !value ? 'Time is required' : ''
  ],
  duration_minutes: [
    (value) => !value ? 'Duration is required' : '',
    (value) => value && (isNaN(value) || parseInt(value) < 30) ? 'Duration must be at least 30 minutes' : ''
  ],
  venue: [
    (value) => !value ? 'Venue is required' : ''
  ],
  price: [
    (value) => !value ? 'Price is required' : '',
    (value) => value && (isNaN(value) || parseFloat(value) < 0) ? 'Price must be positive' : ''
  ],
  max_seats: [
    (value) => !value ? 'Maximum seats is required' : '',
    (value) => value && (isNaN(value) || parseInt(value) < 1) ? 'Must have at least 1 seat' : ''
  ]
};

import api from '../../services/api';

const CoachDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [seminars, setSeminars] = useState([]);
  const [earnings, setEarnings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateSeminar, setShowCreateSeminar] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
const [imageError, setImageError] = useState('');
const [uploadProgress, setUploadProgress] = useState(0);
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
// Replace the existing CreateSeminarModal component in src/pages/coach/Dashboard.js with this enhanced version
// COMPLETE CreateSeminarModal Component with Full Validation
const CreateSeminarModal = ({ onClose, onSuccess }) => {
  
  // Form validation integration
  const {
    values: formData,
    errors,
    touched,
    isValid,
    handleChange: handleValidatedChange,
    handleBlur,
    validateForm
  } = useFormValidation(
    {
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
    },
    seminarValidationRules
  );
  
  const [seminarImage, setSeminarImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Updated handleChange function
  const handleChange = (e) => {
    handleValidatedChange(e.target.name, e.target.value);
  };

  // Enhanced image validation and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError('');
    
    if (!file) {
      setSeminarImage(null);
      setImagePreview(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageError('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setImageError('Image size should be less than 5MB');
      return;
    }

    // Validate image dimensions
    const img = new Image();
    img.onload = function() {
      const minWidth = 400;
      const minHeight = 300;
      
      if (this.width < minWidth || this.height < minHeight) {
        setImageError(`Image should be at least ${minWidth}x${minHeight} pixels`);
        setSeminarImage(null);
        setImagePreview(null);
        return;
      }

      // If all validations pass, set the image
      setSeminarImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    };
    
    img.onerror = function() {
      setImageError('Invalid image file');
      setSeminarImage(null);
      setImagePreview(null);
    };
    
    img.src = URL.createObjectURL(file);
  };

  // Remove image
  const removeImage = () => {
    setSeminarImage(null);
    setImagePreview(null);
    setImageError('');
    // Reset file input
    const fileInput = document.getElementById('seminar_image');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation check
    if (!validateForm()) {
      setMessage('Please fix all errors before submitting');
      return;
    }
    
    setLoading(true);
    setMessage('');
    setUploadProgress(0);

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
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
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
      setUploadProgress(0);
    }
  };

  // Form completion percentage
  const requiredFields = ['title', 'description', 'category', 'date', 'time', 'duration_minutes', 'venue', 'price', 'max_seats'];
  const filledRequiredFields = requiredFields.filter(field => formData[field]).length;
  const completionPercentage = Math.round((filledRequiredFields / requiredFields.length) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Seminar</h2>
              {/* Form completion progress */}
              <div className="mt-2">
                <div className="text-sm text-gray-600 mb-1">
                  Form completion: {completionPercentage}%
                </div>
                <div className="w-64 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
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
                <div className="relative">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={() => handleBlur('title')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                      touched.title && errors.title 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : touched.title && !errors.title && formData.title
                          ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                          : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                    }`}
                    placeholder="Enter an engaging title for your seminar"
                    required
                  />
                  {/* Validation icon */}
                  {touched.title && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {errors.title ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : formData.title ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : null}
                    </div>
                  )}
                </div>
                {touched.title && errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                  {formData.description && (
                    <span className="text-gray-500 text-xs ml-2">
                      ({formData.description.length}/1000)
                    </span>
                  )}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={() => handleBlur('description')}
                  rows={4}
                  maxLength={1000}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    touched.description && errors.description 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : touched.description && !errors.description && formData.description
                        ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                        : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                  }`}
                  placeholder="Describe what your seminar is about, who it's for, and what students will gain"
                  required
                />
                {touched.description && errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      onBlur={() => handleBlur('category')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                        touched.category && errors.category 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : touched.category && !errors.category && formData.category
                            ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                      }`}
                      required
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
                    {touched.category && (
                      <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
                        {errors.category ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : formData.category ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  {touched.category && errors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Enhanced Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seminar Image
                  </label>
                  
                  {!imagePreview ? (
                    <div className="relative">
                      <input
                        type="file"
                        id="seminar_image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <label
                        htmlFor="seminar_image"
                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                      >
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload image</span>
                        <span className="text-xs text-gray-500 mt-1">JPG, PNG or WebP (max 5MB)</span>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-full h-32 border border-gray-300 rounded-md overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="mt-2 text-xs text-gray-600">
                        {seminarImage?.name} ({(seminarImage?.size / (1024 * 1024)).toFixed(2)} MB)
                      </div>
                    </div>
                  )}

                  {imageError && (
                    <div className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {imageError}
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Recommended: 800x600px or larger for best quality
                  </div>
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
                  <div className="relative">
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      onBlur={() => handleBlur('date')}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                        touched.date && errors.date 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : touched.date && !errors.date && formData.date
                            ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                      }`}
                      required
                    />
                    {touched.date && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {errors.date ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : formData.date ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  {touched.date && errors.date && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.date}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      onBlur={() => handleBlur('time')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                        touched.time && errors.time 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : touched.time && !errors.time && formData.time
                            ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                      }`}
                      required
                    />
                    {touched.time && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {errors.time ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : formData.time ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  {touched.time && errors.time && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.time}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="duration_minutes"
                      name="duration_minutes"
                      value={formData.duration_minutes}
                      onChange={handleChange}
                      onBlur={() => handleBlur('duration_minutes')}
                      min="30"
                      max="480"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                        touched.duration_minutes && errors.duration_minutes 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : touched.duration_minutes && !errors.duration_minutes && formData.duration_minutes
                            ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                      }`}
                      placeholder="e.g., 120"
                      required
                    />
                    {touched.duration_minutes && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {errors.duration_minutes ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : formData.duration_minutes ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  {touched.duration_minutes && errors.duration_minutes && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.duration_minutes}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
                  Venue *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    onBlur={() => handleBlur('venue')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                      touched.venue && errors.venue 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : touched.venue && !errors.venue && formData.venue
                          ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                          : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                    }`}
                    placeholder="e.g., Conference Room A, Building 123 or Online via Zoom"
                    required
                  />
                  {touched.venue && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {errors.venue ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : formData.venue ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : null}
                    </div>
                  )}
                </div>
                {touched.venue && errors.venue && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.venue}
                  </p>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Pricing & Capacity</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Regular Price (₹) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      onBlur={() => handleBlur('price')}
                      min="0"
                      step="1"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                        touched.price && errors.price 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : touched.price && !errors.price && formData.price
                            ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                      }`}
                      placeholder="e.g., 1500"
                      required
                    />
                    {touched.price && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {errors.price ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : formData.price ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  {touched.price && errors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="max_seats" className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Seats *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="max_seats"
                      name="max_seats"
                      value={formData.max_seats}
                      onChange={handleChange}
                      onBlur={() => handleBlur('max_seats')}
                      min="1"
                      max="1000"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                        touched.max_seats && errors.max_seats 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : touched.max_seats && !errors.max_seats && formData.max_seats
                            ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                      }`}
                      placeholder="e.g., 50"
                      required
                    />
                    {touched.max_seats && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {errors.max_seats ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : formData.max_seats ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  {touched.max_seats && errors.max_seats && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.max_seats}
                    </p>
                  )}
                </div>

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
                    onBlur={() => handleBlur('early_bird_price')}
                    min="0"
                    step="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 1200"
                  />
                  {touched.early_bird_price && errors.early_bird_price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.early_bird_price}
                    </p>
                  )}
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
                    onBlur={() => handleBlur('early_bird_deadline')}
                    min={new Date().toISOString().split('T')[0]}
                    max={formData.date}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {touched.early_bird_deadline && errors.early_bird_deadline && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.early_bird_deadline}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Additional Details</h3>
              
              <div>
                <label htmlFor="what_you_learn" className="block text-sm font-medium text-gray-700 mb-1">
                  What You'll Learn
                </label>
                <textarea
                  id="what_you_learn"
                  name="what_you_learn"
                  value={formData.what_you_learn}
                  onChange={handleChange}
                  onBlur={() => handleBlur('what_you_learn')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="List key learning outcomes (one per line)&#10;e.g.:&#10;Build dynamic web applications&#10;Master React hooks and state management&#10;Deploy applications to production"
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
                  onBlur={() => handleBlur('requirements_text')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="List any prerequisites or requirements (one per line)&#10;e.g.:&#10;Basic HTML and CSS knowledge&#10;Laptop with code editor installed&#10;Willingness to learn"
                />
              </div>
            </div>

            {/* Upload Progress */}
            {loading && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

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
                disabled={loading}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || imageError || !isValid}
                className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center ${
                  loading || imageError || !isValid
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Creating...'}
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