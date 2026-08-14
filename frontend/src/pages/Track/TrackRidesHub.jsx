import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import { getMyBookings } from '../../api/bookingApi';
import { getMyRides } from '../../api/rideApi';

export default function TrackRidesHub() {
  const role = (localStorage.getItem('role') || '').toUpperCase();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        if (role === 'DRIVER') {
          const res = await getMyRides();
          setItems(res.data || []);
        } else {
          const res = await getMyBookings();
          setItems(res.data || []);
        }
      } catch (err) {
        setError('Could not load your rides. Is the backend running?');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [role]);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pt-28 pb-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
            <Navigation size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Live ride tracking
          </h1>
          <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
            {role === 'DRIVER'
              ? 'Select a ride below to share your live location with passengers.'
              : 'Select a ride below to follow your driver in real time.'}
          </p>
        </div>

        {loading && <p className="text-sm text-slate-400 font-semibold text-center py-6">Loading your rides…</p>}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="text-sm text-slate-400 font-semibold text-center py-6">
            {role === 'DRIVER' ? "You haven't published any rides yet." : "You don't have any bookings yet."}
          </p>
        )}

        <div className="space-y-3">
          {items.map((item) => {
            const rideId = item.rideId || item.id;
            return (
              <Link
                key={rideId}
                to={`/track/${rideId}`}
                className="flex items-center justify-between p-5 bg-white border-2 border-slate-100 hover:border-blue-500/50 rounded-2xl transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-slate-900 tracking-tight">
                      {item.source} <span className="text-slate-400 font-normal mx-2">→</span> {item.destination}
                    </p>
                    <p className="text-sm text-slate-400 font-bold mt-1">{item.travelDate}</p>
                  </div>
                </div>
                <span className="text-sm font-black text-blue-600">Track live →</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
