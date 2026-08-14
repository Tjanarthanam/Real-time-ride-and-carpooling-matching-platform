import apiClient from './axiosClient';

// Fare policy: ₹5 per kilometre, rounded to the nearest rupee (kept in sync
// with RouteServiceImpl on the backend so the UI copy matches).
export const FARE_PER_KM = 5;

// Geocodes the pickup/drop place names and returns up to a few candidate
// driving routes between them.
//
// All the actual third-party map calls (Nominatim for geocoding, OSRM for
// routing) now happen on the backend — see RouteController /
// RouteServiceImpl — so the browser only ever talks to our own API. This
// also means the backend can try several routing strategies (default,
// avoid-motorway, avoid-toll) and merge the results before responding,
// which surfaces alternate routes far more reliably than a single OSRM
// "alternatives=true" call did.
//
// Returns: { pickup: {lat, lon, displayName}, drop: {...}, routes: [{ distanceKm, durationMin, fare, coordinates }] }
export async function findRoutes(pickup, drop) {
  try {
    const { data } = await apiClient.get('/routes/search', {
      params: { pickup, drop },
    });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Could not find routes between those locations.';
    throw new Error(message, { cause: error });
  }
}

// As-you-type location autocomplete. Returns [] on any failure so a slow or
// unreachable map service never blocks typing — it just means no dropdown.
export async function suggestLocations(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const { data } = await apiClient.get('/routes/suggest', { params: { query } });
    return data || [];
  } catch (error) {
    return [];
  }
}
