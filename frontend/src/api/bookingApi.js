import apiClient from './axiosClient';

// POST /api/bookings/book  (passenger requests a seat)
export function bookRide({ rideId, seatsToBook }) {
  return apiClient.post('/bookings/book', { rideId, seatsToBook });
}

// GET /api/bookings/my-bookings  (passenger's own bookings)
export function getMyBookings() {
  return apiClient.get('/bookings/my-bookings');
}

// GET /api/bookings/driver-requests  (driver's incoming requests for their rides)
export function getDriverRequests() {
  return apiClient.get('/bookings/driver-requests');
}

// PUT /api/bookings/{id}/accept
export function acceptBooking(bookingId) {
  return apiClient.put(`/bookings/${bookingId}/accept`);
}

// PUT /api/bookings/{id}/reject
export function rejectBooking(bookingId) {
  return apiClient.put(`/bookings/${bookingId}/reject`);
}
