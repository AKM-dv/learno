// src/services/authService.js
import api from './api';

export const authService = {
  login: async (email, password, userType) => {
    const response = await api.post('/auth/login', {
      email,
      password,
      user_type: userType
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify-token');
    return response.data;
  },

  forgotPassword: async (email, userType) => {
    const response = await api.post('/auth/forgot-password', {
      email,
      user_type: userType
    });
    return response.data;
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    const response = await api.post('/auth/reset-password', {
      token,
      new_password: newPassword,
      confirm_password: confirmPassword
    });
    return response.data;
  }
};