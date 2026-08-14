import apiClient from './axiosClient';

// POST /api/waitlist/join
export function joinWaitlist({ source, destination, travelDate, email }) {
  return apiClient.post('/waitlist/join', {
    source,
    destination,
    travelDate,
    email,
  });
}

// GET /api/waitlist/my
export function getMyWaitlists() {
  return apiClient.get('/waitlist/my');
}

// DELETE /api/waitlist/:id
export function cancelWaitlist(id) {
  return apiClient.delete(`/waitlist/${id}`);
}
