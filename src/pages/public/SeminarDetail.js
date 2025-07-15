// src/pages/public/SeminarDetail.js - Enhanced Payment Integration
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  IndianRupee,
  BookOpen,
  User,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const SeminarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [seminar, setSeminar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  // Fetch seminar details
  const fetchSeminarDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/public/seminar/${id}`);
      
      if (response.data.success) {
        setSeminar(response.data.data);
        
        // Check if user is already registered
        if (isAuthenticated && user?.user_type === 'user') {
          checkRegistrationStatus();
        }
      } else {
        navigate('/seminars');
      }
    } catch (error) {
      console.error('Failed to fetch seminar details:', error);
      navigate('/seminars');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already registered
  const checkRegistrationStatus = async () => {
    try {
      const response = await api.get('/user/seminars');
      if (response.data.success) {
        const userSeminars = response.data.data;
        const isAlreadyRegistered = userSeminars.some(
          (userSeminar) => userSeminar.id === parseInt(id)
        );
        setIsRegistered(isAlreadyRegistered);
      }
    } catch (error) {
      console.error('Failed to check registration status:', error);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const response = await api.get(`/public/seminar/${id}/reviews?limit=5`);
      
      if (response.data.success) {
        setReviews(response.data.data.reviews);
        setReviewStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSeminarDetails();
      fetchReviews();
    }
  }, [id, isAuthenticated]);

  // Helper functions
  const formatPrice = (price, earlyBirdPrice, earlyBirdDeadline) => {
    const today = new Date();
    const deadline = earlyBirdDeadline ? new Date(earlyBirdDeadline) : null;
    
    if (earlyBirdPrice && deadline && today <= deadline) {
      return {
        current: earlyBirdPrice,
        original: price,
        isEarlyBird: true,
        savings: price - earlyBirdPrice
      };
    }
    
    return {
      current: price,
      original: null,
      isEarlyBird: false,
      savings: 0
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
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

  // Payment handling
  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate('/student/login');
      return;
    }

    if (user?.user_type !== 'user') {
      setPaymentError('Only students can register for seminars');
      return;
    }

    if (isRegistered) {
      setPaymentError('You are already registered for this seminar');
      return;
    }

    if (seminar.seats_available <= 0) {
      setPaymentError('This seminar is fully booked');
      return;
    }

    setShowPaymentModal(true);
    setPaymentError('');
  };

  const processPayment = async () => {
    setPaymentLoading(true);
    setPaymentError('');
    
    try {
      // Create payment order
      const response = await api.post('/payment/create-order', {
        seminar_id: seminar.id
      });

      if (response.data.success) {
        const { order_id, amount, key_id } = response.data.data;
        
        // Initialize Razorpay
        const options = {
          key: key_id,
          amount: amount * 100, // Convert to paise
          currency: "INR",
          name: "Learno",
          description: seminar.title,
          order_id: order_id,
          handler: async function (response) {
            try {
              // Verify payment
              const verifyResponse = await api.post('/payment/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                seminar_id: seminar.id
              });

              if (verifyResponse.data.success) {
                setShowPaymentModal(false);
                setIsRegistered(true);
                // Update seats available
                setSeminar(prev => ({
                  ...prev,
                  seats_available: prev.seats_available - 1
                }));
                
                // Show success message
                alert('🎉 Registration successful! Welcome to the seminar.');
                
                // Redirect to dashboard after a delay
                setTimeout(() => {
                  navigate('/dashboard');
                }, 2000);
              } else {
                setPaymentError('Payment verification failed. Please contact support.');
              }
            } catch (error) {
              setPaymentError('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.contact_number || ''
          },
          notes: {
            seminar_id: seminar.id,
            user_id: user?.id
          },
          theme: {
            color: "#2563eb"
          },
          modal: {
            ondismiss: function() {
              setPaymentLoading(false);
              setShowPaymentModal(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', function (response) {
          setPaymentError(`Payment failed: ${response.error.description}`);
          setPaymentLoading(false);
        });
        
        rzp.open();
      } else {
        setPaymentError(response.data.message || 'Failed to create payment order');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      if (error.response?.data?.message) {
        setPaymentError(error.response.data.message);
      } else {
        setPaymentError('Payment failed. Please try again.');
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!seminar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Seminar not found</h2>
          <button
            onClick={() => navigate('/seminars')}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to seminars
          </button>
        </div>
      </div>
    );
  }

  const priceInfo = formatPrice(seminar.price, seminar.early_bird_price, seminar.early_bird_deadline);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Seminar Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  {seminar.category}
                </span>
                {priceInfo.isEarlyBird && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    Early Bird Special
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{seminar.title}</h1>
              
              {/* Key Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(seminar.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{formatTime(seminar.time)} ({seminar.duration_minutes} mins)</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Venue</p>
                    <p className="font-medium">{seminar.venue}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Seats Available</p>
                    <p className="font-medium">
                      {seminar.seats_available > 0 ? 
                        `${seminar.seats_available} seats left` : 
                        'Fully Booked'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Coach Info */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{seminar.coach_name}</p>
                  <p className="text-sm text-gray-600">Instructor</p>
                </div>
                {seminar.avg_rating && (
                  <div className="flex items-center ml-auto">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">{seminar.avg_rating}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Seminar</h2>
              <p className="text-gray-700 leading-relaxed">{seminar.description}</p>
            </div>

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{review.user_name}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{review.review_text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <IndianRupee className="h-6 w-6 text-gray-600" />
                  <span className="text-3xl font-bold text-gray-900">
                    {priceInfo.current}
                  </span>
                  {priceInfo.original && (
                    <span className="text-lg text-gray-500 line-through">
                      ₹{priceInfo.original}
                    </span>
                  )}
                </div>
                {priceInfo.isEarlyBird && (
                  <p className="text-green-600 text-sm font-medium">
                    Save ₹{priceInfo.savings} with Early Bird pricing!
                  </p>
                )}
              </div>

              {/* Registration Status */}
              {isRegistered ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">Already Registered</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    You're all set for this seminar!
                  </p>
                </div>
              ) : (
                <>
                  {/* Error Message */}
                  {paymentError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <span className="text-red-800 text-sm">{paymentError}</span>
                      </div>
                    </div>
                  )}

                  {/* Register Button */}
                  <button
                    onClick={handleRegisterClick}
                    disabled={seminar.seats_available <= 0 || paymentLoading}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      seminar.seats_available <= 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {seminar.seats_available <= 0 ? 'Fully Booked' : 'Register Now'}
                  </button>
                </>
              )}

              {/* Security Note */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Secure payment powered by Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Payment</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Seminar:</span>
                <span className="font-medium">{seminar.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">₹{priceInfo.current}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{formatDate(seminar.date)}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={paymentLoading}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={processPayment}
                disabled={paymentLoading}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {paymentLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Proceed to Pay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeminarDetail;