import apiClient from './axiosClient';

// GET /api/notifications  (current user's notifications, newest first)
export function getMyNotifications() {
  return apiClient.get('/notifications');
}
