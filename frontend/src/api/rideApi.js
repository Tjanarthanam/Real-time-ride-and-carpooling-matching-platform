import apiClient from './axiosClient';

// GET /api/rides/search?source=&destination=&date=&seats=
export function searchRides({ source, destination, date, seats }) {
  return apiClient.get('/rides/search', {
    params: { source, destination, date, seats },
  });
}

// POST /api/rides/offer
export function offerRide({ source, destination, travelDate, travelTime, availableSeats, fare, genderPreference }) {
  return apiClient.post('/rides/offer', {
    source,
    destination,
    travelDate,
    travelTime,
    availableSeats,
    fare,
    genderPreference,
  });
}

// GET /api/rides/my-rides  (driver's own published rides)
export function getMyRides() {
  return apiClient.get('/rides/my-rides');
}
