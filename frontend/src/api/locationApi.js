import apiClient from './axiosClient';

// POST /api/rides/{rideId}/location  (driver pushes their current position)
export function updateLocation(rideId, latitude, longitude) {
  return apiClient.post(`/rides/${rideId}/location`, { latitude, longitude });
}

// GET /api/rides/{rideId}/location  (poll the driver's live position)
export function getLocation(rideId) {
  return apiClient.get(`/rides/${rideId}/location`);
}

// PUT /api/rides/{rideId}/status?status=IN_PROGRESS|COMPLETED
export function updateRideStatus(rideId, status) {
  return apiClient.put(`/rides/${rideId}/status`, null, { params: { status } });
}
