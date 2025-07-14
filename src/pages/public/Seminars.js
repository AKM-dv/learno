    // src/pages/public/Seminars.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  IndianRupee,
  ChevronDown,
  X,
  BookOpen
} from 'lucide-react';
import api from '../../services/api';

const Seminars = () => {
  // State management
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    dateFrom: '',
    dateTo: '',
    coachId: ''
  });

  // Fetch seminars
  const fetchSeminars = async (page = 1, resetData = false) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.category && { category: filters.category }),
        ...(filters.minPrice && { min_price: filters.minPrice }),
        ...(filters.maxPrice && { max_price: filters.maxPrice }),
        ...(filters.dateFrom && { date_from: filters.dateFrom }),
        ...(filters.dateTo && { date_to: filters.dateTo }),
        ...(filters.coachId && { coach_id: filters.coachId })
      });

      const response = await api.get(`/public/seminars?${params}`);
      
      if (response.data.success) {
        if (resetData || page === 1) {
          setSeminars(response.data.data.seminars);
        } else {
          setSeminars(prev => [...prev, ...response.data.data.seminars]);
        }
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch seminars:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search seminars
  const searchSeminars = async (query) => {
    if (!query.trim()) {
      fetchSeminars(1, true);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/public/search-seminars?q=${encodeURIComponent(query)}&page=1&limit=${pagination.limit}`);
      
      if (response.data.success) {
        setSeminars(response.data.data);
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/public/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Effects
  useEffect(() => {
    fetchSeminars();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSeminars(1, true);
  }, [filters]);

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    searchSeminars(searchQuery);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      dateFrom: '',
      dateTo: '',
      coachId: ''
    });
    setSearchQuery('');
  };

  const loadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchSeminars(pagination.page + 1);
    }
  };

  // Helper functions
  const formatPrice = (price, earlyBirdPrice, earlyBirdDeadline) => {
    const today = new Date();
    const deadline = earlyBirdDeadline ? new Date(earlyBirdDeadline) : null;
    
    if (earlyBirdPrice && deadline && today <= deadline) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-green-600">₹{earlyBirdPrice}</span>
          <span className="text-sm text-gray-500 line-through">₹{price}</span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Early Bird</span>
        </div>
      );
    }
    
    return <span className="text-lg font-bold text-gray-900">₹{price}</span>;
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Discover Amazing Seminars
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn from expert coaches and expand your knowledge with our curated collection of seminars
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search seminars, topics, or coaches..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter Toggle */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.category} value={category.category}>
                      {category.category} ({category.seminar_count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="₹ 0"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="₹ 10000"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <X className="h-4 w-4" />
                <span>Clear All Filters</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {pagination.total > 0 ? (
              <>Showing {seminars.length} of {pagination.total} seminars</>
            ) : (
              <>No seminars found</>
            )}
          </p>
        </div>

        {/* Seminars Grid */}
        {loading && seminars.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : seminars.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {seminars.map((seminar) => (
                <div key={seminar.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  {/* Seminar Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-t-lg flex items-center justify-center">
                    {seminar.seminar_image ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${seminar.seminar_image}`}
                        alt={seminar.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <BookOpen className="h-16 w-16 text-blue-600" />
                    )}
                  </div>

                  {/* Seminar Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {seminar.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {seminar.description}
                    </p>

                    {/* Coach Info */}
                    <div className="flex items-center mb-3">
                      <div className="bg-gray-100 rounded-full p-1 mr-2">
                        <Users className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">{seminar.coach_name}</span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center mb-3">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">{formatDate(seminar.date)}</span>
                      <Clock className="h-4 w-4 text-gray-500 ml-4 mr-2" />
                      <span className="text-sm text-gray-600">{formatTime(seminar.time)}</span>
                    </div>

                    {/* Venue */}
                    {seminar.venue && (
                      <div className="flex items-center mb-3">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">{seminar.venue}</span>
                      </div>
                    )}

                    {/* Rating */}
                    {seminar.avg_rating > 0 && (
                      <div className="flex items-center mb-3">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          {seminar.avg_rating} ({seminar.review_count} reviews)
                        </span>
                      </div>
                    )}

                    {/* Price & Seats */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {formatPrice(seminar.price, seminar.early_bird_price, seminar.early_bird_deadline)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {seminar.seats_available > 0 ? (
                          <span className="text-green-600">{seminar.seats_available} seats left</span>
                        ) : (
                          <span className="text-red-600">Full</span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/seminar/${seminar.id}`}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {pagination.page < pagination.pages && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More Seminars</span>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No seminars found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Seminars;