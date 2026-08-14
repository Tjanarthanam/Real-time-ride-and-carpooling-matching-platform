import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8081/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT token (saved at login) to every outgoing request.
// Without this, every protected endpoint (rides, bookings, notifications)
// rejects the request with a 401/403 even though the user is logged in.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
