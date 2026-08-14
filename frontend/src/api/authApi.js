import apiClient from './axiosClient';

// Email verification / OTP
export const sendOtp = (email) => apiClient.post('/auth/send-otp', { email });
export const verifyOtp = (email, otpCode) => apiClient.post('/auth/verify-otp', { email, otpCode });

// Forgot / reset password
export const forgotPassword = (email) => apiClient.post('/auth/forgot-password', { email });
export const resetPassword = (email, otpCode, newPassword) =>
  apiClient.post('/auth/reset-password', { email, otpCode, newPassword });
