import apiClient from './axiosClient';

// POST /api/emergency/trigger
export function triggerEmergencyAlert({ rideId, latitude, longitude, note, emergencyContactEmail }) {
  return apiClient.post('/emergency/trigger', {
    rideId,
    latitude,
    longitude,
    note,
    emergencyContactEmail,
  });
}

// GET /api/emergency/my
export function getMyEmergencyAlerts() {
  return apiClient.get('/emergency/my');
}
