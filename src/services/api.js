// src/services/api.js - COMPLETE Enhanced API with better error handling
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response time
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
    
    return response;
  },
  (error) => {
    const duration = new Date() - error.config?.metadata?.startTime;
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, error);

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        
        case 403:
          // Forbidden
          console.error('Access denied');
          break;
        
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        
        case 422:
          // Validation error
          console.error('Validation error:', data);
          break;
        
        case 429:
          // Rate limited
          console.error('Too many requests');
          break;
        
        case 500:
          // Server error
          console.error('Server error');
          break;
        
        default:
          console.error(`HTTP ${status} Error:`, data);
      }
      
      // Enhance error object with user-friendly messages
      error.userMessage = getUserFriendlyMessage(status, data);
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.message);
      error.userMessage = 'Unable to connect to the server. Please check your internet connection.';
    } else {
      // Something else happened
      console.error('Error:', error.message);
      error.userMessage = 'An unexpected error occurred. Please try again.';
    }

    return Promise.reject(error);
  }
);

// Helper function to get user-friendly error messages
const getUserFriendlyMessage = (status, data) => {
  const message = data?.message || data?.error;
  
  switch (status) {
    case 400:
      return message || 'Invalid request. Please check your input.';
    case 401:
      return 'Please log in to continue.';
    case 403:
      return 'You don\'t have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 422:
      return message || 'Please check your input and try again.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Our team has been notified.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return message || 'An error occurred. Please try again.';
  }
};

// API helper functions with better error handling
export const apiHelpers = {
  // Generic request wrapper
  async request(method, url, data = null, config = {}) {
    try {
      const response = await api({
        method,
        url,
        data,
        ...config
      });
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return { 
        success: false, 
        error: error.userMessage || error.message,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  },

  // GET request
  async get(url, config = {}) {
    return this.request('GET', url, null, config);
  },

  // POST request
  async post(url, data, config = {}) {
    return this.request('POST', url, data, config);
  },

  // PUT request
  async put(url, data, config = {}) {
    return this.request('PUT', url, data, config);
  },

  // DELETE request
  async delete(url, config = {}) {
    return this.request('DELETE', url, null, config);
  },

  // Upload file with progress
  async upload(url, formData, onProgress = null) {
    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.userMessage || error.message,
        details: error.response?.data
      };
    }
  },

  // Retry mechanism for failed requests
  async withRetry(requestFn, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await requestFn();
        if (result.success) {
          return result;
        }
        
        // Don't retry for client errors (4xx)
        if (result.status >= 400 && result.status < 500) {
          return result;
        }
        
        if (attempt === maxRetries) {
          return result;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      } catch (error) {
        if (attempt === maxRetries) {
          return { 
            success: false, 
            error: error.userMessage || error.message 
          };
        }
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  },

  // Batch requests
  async batch(requests) {
    try {
      const responses = await Promise.allSettled(
        requests.map(req => this.request(req.method, req.url, req.data, req.config))
      );
      
      return responses.map((response, index) => ({
        id: requests[index].id || index,
        success: response.status === 'fulfilled',
        data: response.status === 'fulfilled' ? response.value : null,
        error: response.status === 'rejected' ? response.reason : null
      }));
    } catch (error) {
      return requests.map((req, index) => ({
        id: req.id || index,
        success: false,
        error: error.message
      }));
    }
  }
};

// Connection status checker
export const checkConnection = async () => {
  try {
    const response = await api.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch {
    return false;
  }
};

// Cache mechanism for frequently accessed data
class APICache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
  }

  set(key, data, ttl = 300000) { // 5 minutes default TTL
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now() + ttl);
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    
    const timestamp = this.timestamps.get(key);
    if (Date.now() > timestamp) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }
}

export const apiCache = new APICache();

// Cached API wrapper
export const cachedApi = {
  async get(url, config = {}, ttl = 300000) {
    const cacheKey = `${url}_${JSON.stringify(config)}`;
    const cached = apiCache.get(cacheKey);
    
    if (cached) {
      console.log(`📦 Cache hit: ${url}`);
      return cached;
    }
    
    const result = await apiHelpers.get(url, config);
    if (result.success) {
      apiCache.set(cacheKey, result, ttl);
    }
    
    return result;
  },

  // Invalidate cache for specific patterns
  invalidate(pattern) {
    for (const key of apiCache.cache.keys()) {
      if (key.includes(pattern)) {
        apiCache.delete(key);
      }
    }
  }
};

// Real-time connection monitor
export class ConnectionMonitor {
  constructor() {
    this.isOnline = navigator.onLine;
    this.listeners = new Set();
    this.init();
  }

  init() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notify('online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notify('offline');
    });

    // Periodic connectivity check
    setInterval(async () => {
      const wasOnline = this.isOnline;
      this.isOnline = await checkConnection();
      
      if (wasOnline !== this.isOnline) {
        this.notify(this.isOnline ? 'online' : 'offline');
      }
    }, 30000); // Check every 30 seconds
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(status) {
    this.listeners.forEach(callback => callback(status));
  }
}

export const connectionMonitor = new ConnectionMonitor();

// API endpoints organized by feature
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password'
  },
  
  user: {
    profile: '/user/profile',
    updateProfile: '/user/update-profile',
    seminars: '/user/seminars',
    payments: '/user/payments'
  },
  
  coach: {
    profile: '/coach/profile',
    stats: '/coach/stats',
    seminars: '/coach/seminars',
    createSeminar: '/coach/create-seminar',
    updateSeminar: (id) => `/coach/seminars/${id}`,
    deleteSeminar: (id) => `/coach/seminars/${id}`,
    earnings: '/coach/earnings'
  },
  
  admin: {
    stats: '/admin/stats',
    users: '/admin/users',
    coaches: '/admin/coaches',
    seminars: '/admin/seminars',
    payments: '/admin/payments',
    approveCoach: (id) => `/admin/approve-coach/${id}`,
    rejectCoach: (id) => `/admin/reject-coach/${id}`
  },
  
  public: {
    seminars: '/public/seminars',
    seminar: (id) => `/public/seminar/${id}`,
    coaches: '/public/coaches',
    search: '/public/search',
    categories: '/public/categories'
  },
  
  payment: {
    createOrder: '/payment/create-order',
    verify: '/payment/verify',
    webhook: '/payment/webhook'
  }
};

// Specialized API functions for common operations
export const authAPI = {
  async login(email, password, userType) {
    return apiHelpers.post(endpoints.auth.login, { email, password, user_type: userType });
  },

  async register(userData) {
    return apiHelpers.post(endpoints.auth.register, userData);
  },

  async logout() {
    const result = await apiHelpers.post(endpoints.auth.logout);
    // Clear local storage regardless of API response
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    apiCache.clear();
    return result;
  },

  async refreshToken() {
    return apiHelpers.post(endpoints.auth.refresh);
  }
};

export const userAPI = {
  async getProfile() {
    return cachedApi.get(endpoints.user.profile, {}, 60000); // Cache for 1 minute
  },

  async updateProfile(data) {
    const result = await apiHelpers.put(endpoints.user.updateProfile, data);
    if (result.success) {
      apiCache.invalidate('profile');
    }
    return result;
  },

  async getSeminars() {
    return cachedApi.get(endpoints.user.seminars, {}, 30000);
  },

  async getPayments() {
    return cachedApi.get(endpoints.user.payments, {}, 30000);
  }
};

export const coachAPI = {
  async getStats() {
    return cachedApi.get(endpoints.coach.stats, {}, 60000);
  },

  async getSeminars() {
    return cachedApi.get(endpoints.coach.seminars, {}, 30000);
  },

  async createSeminar(data) {
    const result = await apiHelpers.upload(endpoints.coach.createSeminar, data);
    if (result.success) {
      apiCache.invalidate('seminars');
      apiCache.invalidate('stats');
    }
    return result;
  },

  async updateSeminar(id, data) {
    const result = await apiHelpers.put(endpoints.coach.updateSeminar(id), data);
    if (result.success) {
      apiCache.invalidate('seminars');
    }
    return result;
  },

  async deleteSeminar(id) {
    const result = await apiHelpers.delete(endpoints.coach.deleteSeminar(id));
    if (result.success) {
      apiCache.invalidate('seminars');
      apiCache.invalidate('stats');
    }
    return result;
  },

  async getEarnings() {
    return cachedApi.get(endpoints.coach.earnings, {}, 60000);
  },

  async requestWithdrawal(amount) {
    const result = await apiHelpers.post('/coach/request-withdrawal', { amount });
    if (result.success) {
      apiCache.invalidate('earnings');
    }
    return result;
  }
};

export const adminAPI = {
  async getStats() {
    return cachedApi.get(endpoints.admin.stats, {}, 60000);
  },

  async getUsers() {
    return cachedApi.get(endpoints.admin.users, {}, 30000);
  },

  async getCoaches() {
    return cachedApi.get(endpoints.admin.coaches, {}, 30000);
  },

  async getSeminars() {
    return cachedApi.get(endpoints.admin.seminars, {}, 30000);
  },

  async getPayments() {
    return cachedApi.get(endpoints.admin.payments, {}, 30000);
  },

  async approveCoach(id) {
    const result = await apiHelpers.post(endpoints.admin.approveCoach(id));
    if (result.success) {
      apiCache.invalidate('coaches');
      apiCache.invalidate('stats');
    }
    return result;
  },

  async rejectCoach(id) {
    const result = await apiHelpers.post(endpoints.admin.rejectCoach(id));
    if (result.success) {
      apiCache.invalidate('coaches');
      apiCache.invalidate('stats');
    }
    return result;
  }
};

export const publicAPI = {
  async getSeminars(params = {}) {
    const url = `${endpoints.public.seminars}?${new URLSearchParams(params)}`;
    return cachedApi.get(url, {}, 120000); // Cache for 2 minutes
  },

  async getSeminar(id) {
    return cachedApi.get(endpoints.public.seminar(id), {}, 300000); // Cache for 5 minutes
  },

  async getCoaches(params = {}) {
    const url = `${endpoints.public.coaches}?${new URLSearchParams(params)}`;
    return cachedApi.get(url, {}, 300000);
  },

  async search(query, filters = {}) {
    const params = { q: query, ...filters };
    const url = `${endpoints.public.search}?${new URLSearchParams(params)}`;
    return apiHelpers.get(url); // Don't cache search results
  },

  async getCategories() {
    return cachedApi.get(endpoints.public.categories, {}, 600000); // Cache for 10 minutes
  },

  async getSeminarReviews(id, params = {}) {
    const url = `/public/seminar/${id}/reviews?${new URLSearchParams(params)}`;
    return cachedApi.get(url, {}, 300000);
  }
};

export const paymentAPI = {
  async createOrder(seminarId) {
    return apiHelpers.post(endpoints.payment.createOrder, { seminar_id: seminarId });
  },

  async verifyPayment(paymentData) {
    const result = await apiHelpers.post(endpoints.payment.verify, paymentData);
    if (result.success) {
      // Clear relevant caches after successful payment
      apiCache.invalidate('seminars');
      apiCache.invalidate('user');
      apiCache.invalidate('payments');
    }
    return result;
  }
};

// Global error handler for unhandled API errors
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.response) {
    console.error('Unhandled API Error:', event.reason);
    // You can show a global notification here
  }
});

// Health check function
export const healthCheck = {
  async check() {
    try {
      const response = await api.get('/health', { timeout: 5000 });
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        latency: response.headers['x-response-time'] || 'unknown'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  },

  // Start periodic health checks
  startMonitoring(interval = 60000) { // Check every minute
    return setInterval(async () => {
      const health = await this.check();
      console.log('Health check:', health);
      
      if (health.status === 'unhealthy') {
        // Dispatch custom event for health status change
        window.dispatchEvent(new CustomEvent('api-health-change', { 
          detail: health 
        }));
      }
    }, interval);
  }
};

// Export the main api instance as default
export default api;