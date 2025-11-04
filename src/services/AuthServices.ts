import api from './Api';
import type { ApiResponse, AuthResponse, LoginForm, RegisterForm } from '../types/Index';

export const authService = {
  // Register new user
  register: async (data: RegisterForm): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data!;
  },

  // Login user
  login: async (data: LoginForm): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data!;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Update profile
  updateProfile: async (data: { username?: string; avatar?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data.data;
  },

  // Get user stats
  getStats: async () => {
    const response = await api.get('/auth/stats');
    return response.data.data;
  },

  // Change password
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/auth/password', data);
    return response.data;
  },
  // Add these methods:

// Verify email with OTP
verifyEmail: async (otp: string) => {
  const response = await api.post('/auth/verify-email', { otp });
  return response.data;
},

// Resend verification OTP
resendVerificationOTP: async () => {
  const response = await api.post('/auth/resend-verification');
  return response.data;
},

// Request password reset
forgotPassword: async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
},

// Reset password with OTP
resetPassword: async (email: string, otp: string, newPassword: string) => {
  const response = await api.post('/auth/reset-password', { email, otp, newPassword });
  return response.data;
},

// Upload avatar
uploadAvatar: async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await api.post('/auth/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
},
};