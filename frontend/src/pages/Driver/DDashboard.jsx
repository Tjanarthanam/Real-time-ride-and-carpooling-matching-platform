import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Calendar,
  CheckCircle2,
  Clock3,
  PlusCircle,
  MessageCircle,
  Wallet,
  Headphones,
  Bell,
  Star,
} from 'lucide-react';
import { getMyRides } from '../../api/rideApi';
import { getDriverRequests, acceptBooking, rejectBooking } from '../../api/bookingApi';
import { getMyNotifications } from '../../api/notificationApi';

// ---- Local-only extras ----
// Rides and booking requests now come from the real backend (see
// fetchDashboardData below). Vehicle details and ratings have no backend
// endpoint yet, so they stay as local placeholders for now.
const STORAGE_KEY = 'driverDashboardExtras';

const emptyExtras = {
  vehicle: {
    model: '',
    number: '',
    seats: 0,
  },
  avgRating: 0,
  totalReviews: 0,
};

function loadExtras() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...emptyExtras, ...JSON.parse(raw) } : emptyExtras;
  } catch {
    return emptyExtras;
  }
}

const quickActions = [
  { label: 'Offer a Ride', icon: PlusCircle, path: '/offerRide', color: 'blue' },
  { label: 'Messages', icon: MessageCircle, path: '/chat', color: 'green' },
  { label: 'Earnings', icon: Wallet, path: '/Driver/payment-History', color: 'purple' },
  { label: 'Support', icon: Headphones, path: '/support', color: 'orange' },
];

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
};

const statusColorMap = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-rose-100 text-rose-700',
};

export default function Dashboard() {
  const [rides, setRides] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionState, setActionState] = useState({}); // bookingId -> 'working' | 'error'
  const [extras] = useState(loadExtras());
  const userName = localStorage.getItem('userName') || 'there';

  const fetchDashboardData = useCallback(async () => {
    setLoadError('');
    try {
      const [ridesRes, requestsRes, notificationsRes] = await Promise.all([
        getMyRides(),
        getDriverRequests(),
        getMyNotifications(),
      ]);
      setRides(ridesRes.data);
      setBookingRequests(requestsRes.data);
      setNotifications(notificationsRes.data);
    } catch (error) {
      setLoadError(
        error.request
          ? 'Could not reach the server. Is the backend running on port 8081?'
          : 'Could not load your dashboard data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    window.addEventListener('focus', fetchDashboardData);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', fetchDashboardData);
    };
  }, [fetchDashboardData]);

  const handleAccept = async (bookingId) => {
    setActionState((prev) => ({ ...prev, [bookingId]: 'working' }));
    try {
      await acceptBooking(bookingId);
      await fetchDashboardData();
    } catch {
      setActionState((prev) => ({ ...prev, [bookingId]: 'error' }));
    }
  };

  const handleReject = async (bookingId) => {
    setActionState((prev) => ({ ...prev, [bookingId]: 'working' }));
    try {
      await rejectBooking(bookingId);
      await fetchDashboardData();
    } catch {
      setActionState((prev) => ({ ...prev, [bookingId]: 'error' }));
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const sortedRides = [...rides].sort((a, b) => (a.travelDate < b.travelDate ? -1 : 1));
  const upcomingRide = sortedRides.find((r) => r.travelDate >= todayStr) || null;
  const pendingRequests = bookingRequests.filter((r) => r.status === 'PENDING');

  const stats = {
    ridesOffered: rides.length,
    upcomingRides: rides.filter((r) => r.travelDate >= todayStr).length,
    pendingRequests: pendingRequests.length,
    confirmedBookings: bookingRequests.filter((r) => r.status === 'CONFIRMED').length,
  };

  const { vehicle, avgRating, totalReviews } = extras;

  const statCards = [
    { label: 'Rides Offered', value: stats.ridesOffered, icon: Car, color: 'blue' },
    { label: 'Upcoming Rides', value: stats.upcomingRides, icon: Calendar, color: 'green' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: Clock3, color: 'orange' },
    { label: 'Confirmed Bookings', value: stats.confirmedBookings, icon: CheckCircle2, color: 'purple' },
  ];

  return (
    // pt-28 / lg:pt-32 pushes content below the fixed Navbar (h-20 + py-4 padding ≈ 112px)
    <div className="min-h-screen bg-slate-50 px-6 lg:px-8 pt-28 lg:pt-32 pb-8">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-slate-500 mt-1">Ready to offer a ride today?</p>
        </div>
        <button className="relative p-2 rounded-full hover:bg-slate-100">
          <Bell size={22} className="text-slate-600" />
          {notifications.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-rose-500 rounded-full">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      {isLoading && (
        <p className="text-sm text-slate-400 font-semibold mb-6">Loading your dashboard…</p>
      )}
      {loadError && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colorMap[color]}`}>
                  <Icon size={18} />
                </div>
                <p className="text-xs font-semibold text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
              </div>
            ))}
          </div>

          {/* Upcoming ride + Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-slate-800">Upcoming Ride</h2>
              </div>

              {upcomingRide ? (
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Car size={28} className="text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {upcomingRide.source} → {upcomingRide.destination}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {upcomingRide.travelDate} • {upcomingRide.travelTime}
                    </p>
                    <p className="text-sm text-slate-500">
                      Seats available: {upcomingRide.availableSeats} • ₹{upcomingRide.fare}/seat
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-400">No upcoming rides yet.</p>
                  <Link to="/offerRide" className="text-sm font-semibold text-blue-600 hover:underline">
                    Offer a ride
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h2 className="font-bold text-slate-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map(({ label, icon: Icon, path, color }) => (
                  <Link
                    key={label}
                    to={path}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl py-4 font-semibold text-sm hover:opacity-80 transition ${colorMap[color]}`}
                  >
                    <Icon size={20} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent rides */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-800">Your Offered Rides</h2>
            </div>

            {rides.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 border-b border-slate-100">
                      <th className="pb-2 font-semibold">From</th>
                      <th className="pb-2 font-semibold">To</th>
                      <th className="pb-2 font-semibold">Date</th>
                      <th className="pb-2 font-semibold">Seats Available</th>
                      <th className="pb-2 font-semibold">Fare/Seat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...rides].reverse().slice(0, 8).map((r) => (
                      <tr key={r.id} className="border-b border-slate-50 last:border-0">
                        <td className="py-3 font-medium text-slate-800">{r.source}</td>
                        <td className="py-3 text-slate-600">{r.destination}</td>
                        <td className="py-3 text-slate-600">{r.travelDate}</td>
                        <td className="py-3 text-slate-600">{r.availableSeats}</td>
                        <td className="py-3 text-slate-600">₹{r.fare}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">No rides yet — your offered rides will show up here.</p>
            )}
          </div>

          {/* Booking requests */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-800">Booking Requests</h2>
            </div>

            {bookingRequests.length > 0 ? (
              <div className="space-y-3">
                {bookingRequests.map((r) => (
                  <div
                    key={r.bookingId}
                    className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-100"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {r.passengerName} <span className="text-slate-400 font-normal">wants {r.seatsBooked} seat(s)</span>
                      </p>
                      <p className="text-sm text-slate-500">
                        {r.source} → {r.destination} • {r.travelDate}
                      </p>
                      <p className="text-sm text-slate-500">₹{r.totalAmount} total</p>
                    </div>

                    {r.status === 'PENDING' ? (
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(r.bookingId)}
                            disabled={actionState[r.bookingId] === 'working'}
                            className="text-sm font-bold px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(r.bookingId)}
                            disabled={actionState[r.bookingId] === 'working'}
                            className="text-sm font-bold px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 disabled:bg-rose-25 text-rose-600 transition"
                          >
                            Reject
                          </button>
                        </div>
                        {actionState[r.bookingId] === 'error' && (
                          <p className="text-xs text-red-600 font-semibold">Action failed. Try again.</p>
                        )}
                      </div>
                    ) : (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColorMap[r.status]}`}>
                        {r.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">No booking requests yet.</p>
            )}
          </div>

          {/* Vehicle + Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm font-semibold text-slate-500 mb-3">Vehicle Details</p>
              {vehicle.model ? (
                <div className="space-y-1 text-sm text-slate-700">
                  <p><span className="text-slate-400">Model:</span> {vehicle.model}</p>
                  <p><span className="text-slate-400">Number:</span> {vehicle.number}</p>
                  <p><span className="text-slate-400">Seats:</span> {vehicle.seats}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-400 mb-1">No vehicle added yet.</p>
                  <Link to="/driver/profile" className="text-sm font-semibold text-blue-600 hover:underline">
                    Add vehicle details
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm font-semibold text-slate-500 mb-2">Your Rating</p>
              <div className="flex items-center gap-2 mb-1">
                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                <p className="text-2xl font-bold text-slate-900">{avgRating.toFixed(1)}</p>
              </div>
              <p className="text-xs text-slate-400">Based on {totalReviews} reviews</p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-800">Notifications</h2>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((n) => (
                  <div key={n.notificationId} className="flex gap-3">
                    <Bell size={18} className={`${n.status ? 'text-slate-400' : 'text-blue-600'} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{n.message}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(n.notificationTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">No notifications yet.</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
            <h2 className="font-bold text-lg mb-2">Earn More, Drive Smart!</h2>
            <p className="text-sm text-emerald-100">
              Offer more rides and help fellow travellers while earning on your daily commute.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}