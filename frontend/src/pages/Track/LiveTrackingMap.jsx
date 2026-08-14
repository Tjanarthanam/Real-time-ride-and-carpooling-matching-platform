import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Navigation, AlertTriangle } from 'lucide-react';
import { getLocation, updateLocation, updateRideStatus } from '../../api/locationApi';
import SOSButton from '../../components/Safety/SOSButton';

export default function LiveTrackingMap() {
  const { rideId } = useParams();
  const role = (localStorage.getItem('role') || '').toUpperCase();

  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [sharing, setSharing] = useState(false);
  const watchIdRef = useRef(null);

  // Poll the backend every 5s for the latest driver position
  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await getLocation(rideId);
        if (!cancelled) {
          setLocation(res.data);
          setError('');
        }
      } catch (err) {
        if (!cancelled) setError('Could not load live location for this ride.');
      }
    }

    poll();
    const interval = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [rideId]);

  // Driver-only: push live GPS position from the browser
  const startSharing = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }
    setSharing(true);
    updateRideStatus(rideId, 'IN_PROGRESS').catch(() => {});
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        updateLocation(rideId, pos.coords.latitude, pos.coords.longitude).catch(() => {});
      },
      () => setError('Could not access device location. Please allow location permissions.'),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
  };

  const stopSharing = () => {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setSharing(false);
    updateRideStatus(rideId, 'COMPLETED').catch(() => {});
  };

  const hasCoords = location && location.currentLatitude != null && location.currentLongitude != null;
  const mapSrc = hasCoords
    ? `https://maps.google.com/maps?q=${location.currentLatitude},${location.currentLongitude}&z=15&output=embed`
    : null;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pt-28 pb-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link to="/track" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">← Back to my rides</Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
              Ride #{rideId} — live location
            </h1>
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-slate-100 text-xs font-black text-slate-700 uppercase tracking-wide">
            <span className={`w-2 h-2 rounded-full ${location?.status === 'IN_PROGRESS' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            {location?.status || 'Waiting for driver'}
          </span>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="w-full h-[420px] bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          {mapSrc ? (
            <iframe
              title="Live ride location"
              src={mapSrc}
              className="w-full h-full border-0"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3">
              <MapPin className="w-8 h-8" />
              <p className="text-sm font-semibold">Waiting for the driver to start sharing their location…</p>
            </div>
          )}
        </div>

        {role === 'DRIVER' && (
          <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Share your live location</p>
                <p className="text-xs text-slate-400 font-semibold">Passengers on this ride will see your position update automatically.</p>
              </div>
            </div>
            {!sharing ? (
              <button
                onClick={startSharing}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition"
              >
                Start sharing
              </button>
            ) : (
              <button
                onClick={stopSharing}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition"
              >
                Stop &amp; mark completed
              </button>
            )}
          </div>
        )}

        <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-2.5 bg-amber-100 rounded-xl text-amber-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-amber-800">
            Feeling unsafe on this trip? Use the SOS button in the corner of your screen to alert RideTogether safety dispatch immediately with your location.
          </p>
        </div>
      </div>

      <SOSButton rideId={rideId} latitude={location?.currentLatitude} longitude={location?.currentLongitude} />
    </div>
  );
}
