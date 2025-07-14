// src/pages/public/SeminarDetail.js
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
  ArrowLeft
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
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Fetch seminar details
  const fetchSeminarDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/public/seminar/${id}`);
      
      if (response.data.success) {
        setSeminar(response.data.data);
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
  }, [id]);

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

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      navigate('/student/login');
      return;
    }

    if (user?.user_type !== 'user') {
      alert('Only students can book seminars');
      return;
    }

    setBookingLoading(true);
    
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
          amount: amount * 100,
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
                razorpay_signature: response.razorpay_signature
              });

              if (verifyResponse.data.success) {
                alert('Booking successful! Welcome to the seminar.');
                navigate('/dashboard');
              } else {
                alert('Payment verification failed. Please contact support.');
              }
            } catch (error) {
              alert('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email
          },
          theme: {
            color: "#2563eb"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Booking failed:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Booking failed. Please try again.');
      }
    } finally {
      setBookingLoading(false);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seminar not found</h2>
          <button
            onClick={() => navigate('/seminars')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Browse Seminars
          </button>
        </div>
      </div>
    );
  }

  const priceInfo = formatPrice(seminar.price, seminar.early_bird_price, seminar.early_bird_deadline);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/seminars')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Seminars
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Seminar Image */}
            <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg h-64 flex items-center justify-center mb-6">
              {seminar.seminar_image ? (
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${seminar.seminar_image}`}
                  alt={seminar.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <BookOpen className="h-24 w-24 text-blue-600" />
              )}
            </div>

            {/* Title and Basic Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{seminar.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                      {seminar.seats_available > 0 ? (
                        <span className="text-green-600">{seminar.seats_available} left</span>
                      ) : (
                        <span className="text-red-600">Fully Booked</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              {seminar.avg_rating > 0 && (
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-lg font-medium">{seminar.avg_rating}</span>
                  <span className="text-gray-600 ml-2">({seminar.review_count} reviews)</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Seminar</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{seminar.description}</p>
            </div>

            {/* What You'll Learn */}
            {seminar.what_you_learn && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
                <div className="space-y-2">
                  {seminar.what_you_learn.split('\n').map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {seminar.requirements_text && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <div className="space-y-2">
                  {seminar.requirements_text.split('\n').map((item, index) => (
                    <div key={index} className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coach Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About the Coach</h2>
              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 rounded-full p-3">
                  <User className="h-8 w-8 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{seminar.coach_name}</h3>
                  {seminar.specialization && (
                    <p className="text-blue-600 mb-2">{seminar.specialization}</p>
                  )}
                  {seminar.experience_years && (
                    <p className="text-gray-600 mb-2">{seminar.experience_years} years experience</p>
                  )}
                  {seminar.bio && (
                    <p className="text-gray-700">{seminar.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
                  {reviewStats && (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 mr-1" />
                        <span className="text-lg font-semibold">{reviewStats.avg_rating}</span>
                      </div>
                      <span className="text-gray-600">({reviewStats.total_reviews} reviews)</span>
                    </div>
                  )}
                </div>

                {/* Rating Distribution */}
                {reviewStats && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Rating Distribution</h3>
                    {[5, 4, 3, 2, 1].map(rating => {
                      const count = reviewStats.rating_distribution[rating] || 0;
                      const percentage = reviewStats.total_reviews > 0 ? (count / reviewStats.total_reviews) * 100 : 0;
                      
                      return (
                        <div key={rating} className="flex items-center mb-2">
                          <span className="text-sm text-gray-600 w-6">{rating}</span>
                          <Star className="h-4 w-4 text-yellow-400 mr-2" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Review List */}
                <div className="space-y-4">
                  {reviews.slice(0, showAllReviews ? reviews.length : 3).map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <div className="bg-gray-100 rounded-full p-2 mr-3">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{review.user_name}</p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.review_text && (
                        <p className="text-gray-700 ml-11">{review.review_text}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Show More Reviews Button */}
                {reviews.length > 3 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              
              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold text-gray-900">₹{priceInfo.current}</span>
                  {priceInfo.isEarlyBird && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Early Bird
                    </span>
                  )}
                </div>
                
                {priceInfo.isEarlyBird && (
                  <div className="space-y-1">
                    <p className="text-lg text-gray-500 line-through">₹{priceInfo.original}</p>
                    <p className="text-green-600 text-sm font-medium">
                      Save ₹{priceInfo.savings}! Limited time offer
                    </p>
                  </div>
                )}
              </div>

              {/* Seminar Status */}
              <div className="mb-6">
                {seminar.seats_available > 0 ? (
                  <div className="flex items-center text-green-600 mb-2">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">{seminar.seats_available} seats available</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 mb-2">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Fully booked</span>
                  </div>
                )}
              </div>

              {/* Booking Button */}
              <button
                onClick={handleBookNow}
                disabled={bookingLoading || seminar.seats_available <= 0}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {bookingLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : seminar.seats_available <= 0 ? (
                  'Fully Booked'
                ) : (
                  'Book Now'
                )}
              </button>

              {!isAuthenticated && (
                <p className="text-sm text-gray-600 text-center mt-3">
                  You need to <span className="text-blue-600 font-medium">login</span> to book this seminar
                </p>
              )}

              {/* Quick Info */}
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{seminar.duration_minutes} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Students:</span>
                  <span className="font-medium">{seminar.max_seats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{seminar.category || 'General'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeminarDetail;