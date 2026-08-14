import apiClient from './axiosClient';

// POST /api/feedback/submit
export function submitFeedback({ rideId, rating, comments }) {
  return apiClient.post('/feedback/submit', { rideId, rating, comments });
}

// GET /api/feedback/my
export function getMyFeedback() {
  return apiClient.get('/feedback/my');
}

// GET /api/feedback/public — no auth required, powers the landing page testimonials
export function getPublicFeedback() {
  return apiClient.get('/feedback/public');
}
