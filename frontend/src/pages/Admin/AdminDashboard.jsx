import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDrivers: 0,
    publishedRides: 0,
    totalBookings: 0,
    platformRevenue: 0
  });

  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Auto-refresh timestamp state
  const [lastUpdated, setLastUpdated] = useState('');

  // Custom Styled Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm',
    onConfirm: null
  });

  // Core Data Fetch Function
  const fetchAdminData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError('');
    try {
      const statsData = await adminApi.getStats();
      const usersData = await adminApi.getAllUsers();
      const ridesData = await adminApi.getAllRides();
      const bookingsData = await adminApi.getAllBookings();

      setStats(statsData || {});
      setUsers(Array.isArray(usersData) ? usersData : []);
      setRides(Array.isArray(ridesData) ? ridesData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      
      // Update last refreshed time
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch admin dashboard data:', err);
      if (!isSilent) {
        setError('Failed to load admin data from server. Please ensure backend is running.');
      }
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  // Initial Fetch & Instant 3-Second Polling + Tab Focus Sync
  useEffect(() => {
    fetchAdminData();

    // ⚡ Auto-refresh every 3 seconds for near-instant live updates
    const autoRefreshInterval = setInterval(() => {
      fetchAdminData(true);
    }, 3000);

    // ⚡ Instant refresh when switching back to the browser tab
    const handleFocus = () => fetchAdminData(true);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(autoRefreshInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const openConfirmModal = (title, message, onConfirmCallback) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type: 'confirm',
      onConfirm: onConfirmCallback
    });
  };

  const openAlertModal = (title, message) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type: 'alert',
      onConfirm: () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
    });
  };

  // 1. DELETE USER WITH IMMEDIATE REFRESH
  const handleDeleteUser = (userId, userEmail) => {
    if (userEmail === 'admin@carpooling.com' || userEmail.includes('admin')) {
      openAlertModal('Security Warning', 'You cannot delete the system administrator account.');
      return;
    }

    openConfirmModal(
      'Confirm User Removal',
      `Are you sure you want to remove user #${userId} (${userEmail})? This will automatically clear their associated rides and bookings.`,
      async () => {
        setActionLoading(true);
        try {
          await adminApi.deleteUser(userId);
          await fetchAdminData(true); // Instant Sync
          setModalConfig({ isOpen: false });
          openAlertModal('Success', 'User successfully removed from the platform.');
        } catch (err) {
          console.error('Delete user error:', err);
          setModalConfig({ isOpen: false });
          const errorMsg = err.response?.data?.error || 'Failed to delete user from the database.';
          openAlertModal('Error', errorMsg);
        } finally {
          setActionLoading(false);
        }
      }
    );
  };

  // 2. CANCEL RIDE WITH IMMEDIATE REFRESH
  const handleCancelRide = (rideId) => {
    openConfirmModal(
      'Confirm Ride Cancellation',
      `Are you sure you want to force-cancel ride #${rideId}?`,
      async () => {
        setActionLoading(true);
        try {
          await adminApi.cancelRide(rideId);
          await fetchAdminData(true); // Instant Sync
          setModalConfig({ isOpen: false });
          openAlertModal('Success', 'Ride successfully cancelled.');
        } catch (err) {
          console.error('Cancel ride error:', err);
          setModalConfig({ isOpen: false });
          const errorMsg = err.response?.data?.error || 'Failed to cancel this ride.';
          openAlertModal('Error', errorMsg);
        } finally {
          setActionLoading(false);
        }
      }
    );
  };

  // Helper to accurately extract booking amount
  const calculateBookingAmount = (b) => {
    if (b.amount && Number(b.amount) > 0) return b.amount;
    if (b.totalPrice && Number(b.totalPrice) > 0) return b.totalPrice;
    if (b.fare && Number(b.fare) > 0) return b.fare;
    if (b.ride && b.ride.fare) {
      const seats = b.seatsBooked || b.seats || 1;
      return Number(b.ride.fare) * seats;
    }
    return 0;
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6 pt-24 relative">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header & Live Sync Indicator */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm gap-4">
          <div>
            <span className="bg-purple-100 text-purple-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Platform Overview & Moderation Controls
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">System Administrator Portal</h1>
          </div>

          <div className="flex items-center h-full">
            {lastUpdated && (
              <span className="text-xs font-bold text-slate-600 flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                Live Sync • {lastUpdated}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm font-bold text-center">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Users</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalUsers || users.length}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Active Drivers</p>
            <h3 className="text-3xl font-black text-blue-600 mt-1">{stats.activeDrivers || 0}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Published Rides</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.publishedRides || rides.length}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Bookings</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalBookings || bookings.length}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-bold text-slate-400 uppercase">Platform Revenue</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">₹{stats.platformRevenue || 0}</h3>
          </div>
        </div>

        {/* Tabs Selection */}
        <div className="flex space-x-2 bg-white p-2 rounded-2xl border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            User Management ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('rides')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'rides' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            All Rides ({rides.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'bookings' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Booking Logs ({bookings.length})
          </button>
        </div>

        {/* Tab 1: User Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">User ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {users.length > 0 ? (
                    users.map((u, idx) => (
                      <tr key={u.id || idx} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 text-slate-400 font-bold">#{u.id}</td>
                        <td className="p-4 font-bold text-slate-900">{u.name}</td>
                        <td className="p-4 text-slate-600">{u.email}</td>
                        <td className="p-4 text-slate-600">{u.phone || 'N/A'}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                            u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                            u.role === 'DRIVER' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role || 'PASSENGER'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {u.role === 'ADMIN' || u.email === 'admin@carpooling.com' ? (
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">Protected</span>
                          ) : (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-1.5 rounded-xl transition shadow-sm"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400 font-semibold">No registered users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: All Rides */}
        {activeTab === 'rides' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Ride ID</th>
                    <th className="p-4">Driver</th>
                    <th className="p-4">Route</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Seats Left</th>
                    <th className="p-4">Fare</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {rides.length > 0 ? (
                    rides.map((r, idx) => (
                      <tr key={r.id || idx} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 text-slate-400 font-bold">#{r.id}</td>
                        <td className="p-4 font-bold text-slate-900">{r.driver?.name || 'Driver'}</td>
                        <td className="p-4 font-bold text-slate-900">{r.source} → {r.destination}</td>
                        <td className="p-4 text-slate-600">{r.travelDate || 'N/A'} {r.travelTime ? `@ ${r.travelTime}` : ''}</td>
                        <td className="p-4">
                          <span className={`font-bold ${r.availableSeats === 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                            {r.availableSeats === 0 ? '0 (Full)' : r.availableSeats}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-emerald-600">₹{r.fare || 0}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleCancelRide(r.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-1.5 rounded-xl transition shadow-sm"
                          >
                            Cancel Ride
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400 font-semibold">No published rides found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Booking Logs */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Passenger</th>
                    <th className="p-4">Ride ID</th>
                    <th className="p-4">Seats Booked</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {bookings.length > 0 ? (
                    bookings.map((b, idx) => (
                      <tr key={b.id || idx} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 text-slate-400 font-bold">#{b.id}</td>
                        <td className="p-4 font-bold text-slate-900">{b.passenger?.name || b.passengerName || 'Passenger'}</td>
                        <td className="p-4 text-slate-600 font-bold">#{b.ride?.id || b.rideId || 'N/A'}</td>
                        <td className="p-4 font-bold text-slate-700">
                          {b.seatsBooked || b.seats || 1} seat(s)
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                            b.bookingStatus === 'CONFIRMED' || b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                            b.bookingStatus === 'PENDING' || b.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {b.bookingStatus || b.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-emerald-600">
                          ₹{calculateBookingAmount(b)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400 font-semibold">No booking records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* CUSTOM STYLED MODAL POPUP */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-black text-slate-900 mb-2">{modalConfig.title}</h3>
            <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">{modalConfig.message}</p>
            
            <div className="flex space-x-3 justify-end">
              {modalConfig.type === 'confirm' && (
                <button
                  disabled={actionLoading}
                  onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
              <button
                disabled={actionLoading}
                onClick={modalConfig.onConfirm}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : modalConfig.type === 'confirm' ? 'Confirm' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}