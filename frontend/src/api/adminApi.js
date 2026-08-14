import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/admin';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
};

export const adminApi = {
  getStats: async () => {
    const res = await axios.get(`${API_BASE_URL}/stats`, getAuthHeaders());
    return res.data;
  },
  getAllUsers: async () => {
    const res = await axios.get(`${API_BASE_URL}/users`, getAuthHeaders());
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await axios.delete(`${API_BASE_URL}/users/${id}`, getAuthHeaders());
    return res.data;
  },
  getAllRides: async () => {
    const res = await axios.get(`${API_BASE_URL}/rides`, getAuthHeaders());
    return res.data;
  },
  cancelRide: async (id) => {
    const res = await axios.delete(`${API_BASE_URL}/rides/${id}`, getAuthHeaders());
    return res.data;
  },
  getAllBookings: async () => {
    const res = await axios.get(`${API_BASE_URL}/bookings`, getAuthHeaders());
    return res.data;
  }
};