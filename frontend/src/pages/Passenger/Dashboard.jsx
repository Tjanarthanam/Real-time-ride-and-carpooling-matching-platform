// import React from 'react';
// import { Link } from 'react-router-dom';
// import {
//   Car,
//   Calendar,
//   CheckCircle2,
//   IndianRupee,
//   Search,
//   Bookmark,
//   Heart,
//   MapPin,
//   Bell,
//   Clock,
//   Wallet,
//   Footprints,
//   Leaf,
//   Star,
// } from 'lucide-react';

// // ---- Mock data (replace with real API data from rideApi.js / bookingApi.js / userApi.js) ----
// const user = { name: 'Utkarsh', role: 'Passenger' };

// const stats = [
//   { label: 'Total Rides Booked', value: 15, icon: Car, color: 'blue' },
//   { label: 'Upcoming Trips', value: 2, icon: Calendar, color: 'green' },
//   { label: 'Completed Trips', value: 13, icon: CheckCircle2, color: 'purple' },
//   { label: 'Money Saved', value: '₹2,450', sub: 'vs solo travel', icon: IndianRupee, color: 'orange' },
// ];

// const upcomingRide = {
//   from: 'Bangalore',
//   to: 'Mysore',
//   date: '28 Jul 2025',
//   time: '09:00 AM',
//   driver: 'Ramesh Kumar',
//   car: 'KA01AB1234',
//   seat: 2,
//   status: 'Confirmed',
// };

// const quickActions = [
//   { label: 'Find Ride', icon: Search, path: '/passenger/search-ride', color: 'blue' },
//   { label: 'My Bookings', icon: Bookmark, path: '/passenger/bookings', color: 'green' },
//   { label: 'Saved Routes', icon: Heart, path: '/passenger/saved-routes', color: 'purple' },
//   { label: 'Nearby Rides', icon: MapPin, path: '/passenger/nearby-rides', color: 'orange' },
// ];

// const recentBookings = [
//   { from: 'Bangalore', to: 'Mysore', date: '28 Jul 2025', driver: 'Ramesh Kumar', amount: '₹350', status: 'Confirmed' },
//   { from: 'Whitefield', to: 'Electronic City', date: '25 Jul 2025', driver: 'Suresh Babu', amount: '₹120', status: 'Completed' },
// ];

// const notifications = [
//   { icon: CheckCircle2, color: 'text-green-500', title: 'Ride Confirmed', desc: 'Your ride to Mysore is confirmed.', time: '10:30 AM' },
//   { icon: Clock, color: 'text-blue-500', title: 'Driver Updated Time', desc: 'Pickup time changed to 9:15 AM.', time: 'Yesterday' },
//   { icon: IndianRupee, color: 'text-orange-500', title: 'Payment Successful', desc: '₹350 paid for Bangalore → Mysore.', time: 'Yesterday' },
//   { icon: Bell, color: 'text-purple-500', title: 'Ride Reminder', desc: 'Your ride is tomorrow at 9:00 AM.', time: '1 day ago' },
// ];

// const ratingBreakdown = [
//   { stars: 5, count: 8 },
//   { stars: 4, count: 3 },
//   { stars: 3, count: 1 },
//   { stars: 2, count: 0 },
//   { stars: 1, count: 0 },
// ];

// const colorMap = {
//   blue: 'bg-blue-50 text-blue-600',
//   green: 'bg-green-50 text-green-600',
//   purple: 'bg-purple-50 text-purple-600',
//   orange: 'bg-orange-50 text-orange-600',
// };

// const statusColorMap = {
//   Confirmed: 'bg-green-100 text-green-700',
//   Completed: 'bg-blue-100 text-blue-700',
//   Cancelled: 'bg-rose-100 text-rose-700',
// };

// export default function Dashboard() {
//   const totalReviews = ratingBreakdown.reduce((sum, r) => sum + r.count, 0);
//   const maxCount = Math.max(...ratingBreakdown.map((r) => r.count), 1);

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
//       {/* Top bar */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">
//             Welcome back, {user.name} 👋
//           </h1>
//           <p className="text-slate-500 mt-1">Ready for your next journey?</p>
//         </div>
//         <div className="flex items-center gap-5">
//           <button className="relative p-2 rounded-full hover:bg-slate-100">
//             <Bell size={22} className="text-slate-600" />
//             <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-rose-500 rounded-full">
//               3
//             </span>
//           </button>
//           <div className="flex items-center gap-2">
//             <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
//               {user.name[0]}
//             </div>
//             <div className="text-sm leading-tight">
//               <p className="font-semibold text-slate-800">{user.name}</p>
//               <p className="text-slate-400">{user.role}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main column */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Stat cards */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//             {stats.map(({ label, value, sub, icon: Icon, color }) => (
//               <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
//                 <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colorMap[color]}`}>
//                   <Icon size={18} />
//                 </div>
//                 <p className="text-xs font-semibold text-slate-500">{label}</p>
//                 <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
//                 {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
//               </div>
//             ))}
//           </div>

//           {/* Upcoming ride + Quick actions */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="font-bold text-slate-800">Upcoming Ride</h2>
//                 <Link to="/passenger/bookings" className="text-sm font-semibold text-blue-600 hover:underline">
//                   View Details
//                 </Link>
//               </div>
//               <div className="flex gap-4">
//                 <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
//                   <Car size={28} className="text-slate-500" />
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex justify-between items-start">
//                     <p className="font-semibold text-slate-900">
//                       {upcomingRide.from} → {upcomingRide.to}
//                     </p>
//                     <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColorMap[upcomingRide.status]}`}>
//                       {upcomingRide.status}
//                     </span>
//                   </div>
//                   <p className="text-sm text-slate-500 mt-1">
//                     {upcomingRide.date} • {upcomingRide.time}
//                   </p>
//                   <p className="text-sm text-slate-500">Driver: {upcomingRide.driver}</p>
//                   <p className="text-sm text-slate-500">
//                     {upcomingRide.car} • Seat: {upcomingRide.seat}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//               <h2 className="font-bold text-slate-800 mb-4">Quick Actions</h2>
//               <div className="grid grid-cols-2 gap-3">
//                 {quickActions.map(({ label, icon: Icon, path, color }) => (
//                   <Link
//                     key={label}
//                     to={path}
//                     className={`flex flex-col items-center justify-center gap-2 rounded-xl py-4 font-semibold text-sm hover:opacity-80 transition ${colorMap[color]}`}
//                   >
//                     <Icon size={20} />
//                     {label}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Recent bookings */}
//           <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-bold text-slate-800">Recent Bookings</h2>
//               <Link to="/passenger/bookings" className="text-sm font-semibold text-blue-600 hover:underline">
//                 View All
//               </Link>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-slate-400 border-b border-slate-100">
//                     <th className="pb-2 font-semibold">From</th>
//                     <th className="pb-2 font-semibold">To</th>
//                     <th className="pb-2 font-semibold">Date</th>
//                     <th className="pb-2 font-semibold">Driver</th>
//                     <th className="pb-2 font-semibold">Amount</th>
//                     <th className="pb-2 font-semibold">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {recentBookings.map((b, i) => (
//                     <tr key={i} className="border-b border-slate-50 last:border-0">
//                       <td className="py-3 font-medium text-slate-800">{b.from}</td>
//                       <td className="py-3 text-slate-600">{b.to}</td>
//                       <td className="py-3 text-slate-600">{b.date}</td>
//                       <td className="py-3 text-slate-600">{b.driver}</td>
//                       <td className="py-3 text-slate-600">{b.amount}</td>
//                       <td className="py-3">
//                         <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColorMap[b.status]}`}>
//                           {b.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Wallet / Activity / Ratings */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//               <p className="text-sm font-semibold text-slate-500 mb-2">Wallet Balance</p>
//               <div className="flex items-center gap-2 mb-3">
//                 <Wallet size={18} className="text-blue-600" />
//                 <p className="text-2xl font-bold text-slate-900">₹520.00</p>
//               </div>
//               <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition mb-2">
//                 Add Money
//               </button>
//               <Link to="/passenger/payments" className="text-sm font-semibold text-blue-600 hover:underline">
//                 View Transaction History
//               </Link>
//             </div>

//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//               <p className="text-sm font-semibold text-slate-500 mb-3">Your Activity</p>
//               <div className="grid grid-cols-3 gap-2 text-center">
//                 <div>
//                   <Footprints size={18} className="mx-auto text-blue-500 mb-1" />
//                   <p className="font-bold text-slate-900">520 km</p>
//                   <p className="text-xs text-slate-400">Distance</p>
//                 </div>
//                 <div>
//                   <Clock size={18} className="mx-auto text-orange-500 mb-1" />
//                   <p className="font-bold text-slate-900">18 hrs</p>
//                   <p className="text-xs text-slate-400">Hours Saved</p>
//                 </div>
//                 <div>
//                   <Leaf size={18} className="mx-auto text-green-500 mb-1" />
//                   <p className="font-bold text-slate-900">42 kg</p>
//                   <p className="text-xs text-slate-400">CO2 Reduced</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//               <p className="text-sm font-semibold text-slate-500 mb-2">Your Ratings</p>
//               <div className="flex items-center gap-2 mb-3">
//                 <Star size={20} className="text-yellow-400 fill-yellow-400" />
//                 <p className="text-2xl font-bold text-slate-900">4.6</p>
//               </div>
//               <p className="text-xs text-slate-400 mb-3">Based on {totalReviews} reviews</p>
//               <div className="space-y-1">
//                 {ratingBreakdown.map(({ stars, count }) => (
//                   <div key={stars} className="flex items-center gap-2 text-xs">
//                     <span className="w-2 text-slate-500">{stars}</span>
//                     <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-yellow-400"
//                         style={{ width: `${(count / maxCount) * 100}%` }}
//                       />
//                     </div>
//                     <span className="w-4 text-slate-400">{count}</span>
//                   </div>
//                 ))}
//               </div>
//               <Link to="/passenger/reviews" className="text-sm font-semibold text-blue-600 hover:underline block mt-2">
//                 View All Reviews
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Right column */}
//         <div className="space-y-6">
//           <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-bold text-slate-800">Notifications</h2>
//               <Link to="/passenger/notifications" className="text-sm font-semibold text-blue-600 hover:underline">
//                 View All
//               </Link>
//             </div>
//             <div className="space-y-4">
//               {notifications.map(({ icon: Icon, color, title, desc, time }, i) => (
//                 <div key={i} className="flex gap-3">
//                   <Icon size={18} className={`${color} flex-shrink-0 mt-0.5`} />
//                   <div className="flex-1">
//                     <div className="flex justify-between">
//                       <p className="text-sm font-semibold text-slate-800">{title}</p>
//                       <p className="text-xs text-slate-400 whitespace-nowrap ml-2">{time}</p>
//                     </div>
//                     <p className="text-xs text-slate-500">{desc}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white">
//             <h2 className="font-bold text-lg mb-2">Share Rides, Save More!</h2>
//             <p className="text-sm text-indigo-100">
//               Travel together and save money while reducing pollution.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//next ver pay

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getMyBookings } from '../../api/bookingApi';
// import { getMyNotifications } from '../../api/notificationApi';
// import {
//   Car,
//   Calendar,
//   CheckCircle2,
//   Search,
//   MessageCircle,
//   Heart,
//   MapPin,
//   Bell,
//   Clock,
//   Wallet,
//   Footprints,
//   Leaf,
//   Star,
// } from 'lucide-react';

// // ---- Storage key + default (empty) shape ----
// // Bookings and notifications now come from the real backend
// // (see fetchDashboardData below). Wallet / activity / ratings have no
// // backend support yet, so they stay as local placeholders for now.
// const STORAGE_KEY = 'passengerDashboardExtras';

// const emptyExtras = {
//   wallet: 0,
//   activity: {
//     distanceKm: 0,
//     hoursSaved: 0,
//     co2Kg: 0,
//   },
//   ratingBreakdown: [
//     { stars: 5, count: 0 },
//     { stars: 4, count: 0 },
//     { stars: 3, count: 0 },
//     { stars: 2, count: 0 },
//     { stars: 1, count: 0 },
//   ],
//   avgRating: 0,
// };

// function loadExtras() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     return raw ? { ...emptyExtras, ...JSON.parse(raw) } : emptyExtras;
//   } catch {
//     return emptyExtras;
//   }
// }

// function saveExtras(extras) {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(extras));
//   } catch {
//     // storage unavailable — fail silently, state still updates in memory
//   }
// }

// const quickActions = [
//   { label: 'Find Ride', icon: Search, path: '/SearchRide', color: 'blue' },
//   { label: 'Messages', icon: MessageCircle, path: '/chat', color: 'green' },
//   { label: 'Saved Routes', icon: Heart, path: '/passenger/saved-routes', color: 'purple' },
//   { label: 'Nearby Rides', icon: MapPin, path: '/passenger/nearby-rides', color: 'orange' },
// ];

// const colorMap = {
//   blue: 'bg-blue-50 text-blue-600',
//   green: 'bg-green-50 text-green-600',
//   purple: 'bg-purple-50 text-purple-600',
//   orange: 'bg-orange-50 text-orange-600',
// };

// const statusColorMap = {
//   PENDING: 'bg-amber-100 text-amber-700',
//   CONFIRMED: 'bg-green-100 text-green-700',
//   REJECTED: 'bg-rose-100 text-rose-700',
// };

// export default function Dashboard() {
//   const [bookings, setBookings] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadError, setLoadError] = useState('');
//   const [extras, setExtras] = useState(emptyExtras);
//   const userName = localStorage.getItem('userName') || 'there';

//   // Load real bookings + notifications from the backend on mount, then
//   // keep refreshing in the background so updates show up without a reload.
//   useEffect(() => {
//     let isMounted = true;
//     async function fetchDashboardData() {
//       setLoadError('');
//       try {
//         const [bookingsRes, notificationsRes] = await Promise.all([
//           getMyBookings(),
//           getMyNotifications(),
//         ]);
//         if (!isMounted) return;
//         setBookings(bookingsRes.data);
//         setNotifications(notificationsRes.data);
//       } catch (error) {
//         if (!isMounted) return;
//         setLoadError(
//           error.request
//             ? 'Could not reach the server. Is the backend running on port 8081?'
//             : 'Could not load your dashboard data.'
//         );
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     }
//     fetchDashboardData();
//     const interval = setInterval(fetchDashboardData, 15000);
//     window.addEventListener('focus', fetchDashboardData);
//     return () => {
//       isMounted = false;
//       clearInterval(interval);
//       window.removeEventListener('focus', fetchDashboardData);
//     };
//   }, []);

//   // Local-only extras (wallet / activity / ratings) — no backend support yet
//   useEffect(() => {
//     setExtras(loadExtras());
//   }, []);

//   useEffect(() => {
//     saveExtras(extras);
//   }, [extras]);

//   const handleAddMoney = () => {
//     const input = window.prompt('Enter amount to add (₹):', '');
//     const amount = Number(input);
//     if (!input || isNaN(amount) || amount <= 0) return;

//     setExtras((prev) => ({
//       ...prev,
//       wallet: prev.wallet + amount,
//     }));
//   };

//   const todayStr = new Date().toISOString().split('T')[0];
//   const sortedBookings = [...bookings].sort((a, b) => (a.travelDate < b.travelDate ? -1 : 1));
//   const upcomingRide = sortedBookings.find(
//     (b) => b.travelDate >= todayStr && b.bookingStatus !== 'REJECTED'
//   ) || null;
//   const recentBookings = [...bookings].reverse().slice(0, 8);

//   const stats = {
//     totalRidesBooked: bookings.length,
//     pendingRequests: bookings.filter((b) => b.bookingStatus === 'PENDING').length,
//     confirmedRides: bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length,
//   };

//   const { wallet, activity, ratingBreakdown, avgRating } = extras;
//   const totalReviews = ratingBreakdown.reduce((sum, r) => sum + r.count, 0);
//   const maxCount = Math.max(...ratingBreakdown.map((r) => r.count), 1);

//   const statCards = [
//     { label: 'Total Bookings', value: stats.totalRidesBooked, icon: Car, color: 'blue' },
//     { label: 'Pending Requests', value: stats.pendingRequests, icon: Calendar, color: 'orange' },
//     { label: 'Confirmed Rides', value: stats.confirmedRides, icon: CheckCircle2, color: 'purple' },
//   ];

//   return (
//     // pt-28 / lg:pt-32 pushes content below the fixed Navbar (h-20 + py-4 padding ≈ 112px)
//     <div className="min-h-screen bg-slate-50 px-6 lg:px-8 pt-28 lg:pt-32 pb-8">
//       {/* Top bar */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">
//             Welcome back, {userName} 👋
//           </h1>
//           <p className="text-slate-500 mt-1">Ready for your next journey?</p>
//         </div>
//         <button className="relative p-2 rounded-full hover:bg-slate-100">
//           <Bell size={22} className="text-slate-600" />
//           {notifications.length > 0 && (
//             <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-rose-500 rounded-full">
//               {notifications.length}
//             </span>
//           )}
//         </button>
//       </div>

//       {isLoading && (
//         <p className="text-sm text-slate-400 font-semibold mb-6">Loading your dashboard…</p>
//       )}
//       {loadError && (
//         <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
//           {loadError}
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main column */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Stat cards */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//             {statCards.map(({ label, value, sub, icon: Icon, color }) => (
//               <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
//                 <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colorMap[color]}`}>
//                   <Icon size={18} />
//                 </div>
//                 <p className="text-xs font-semibold text-slate-500">{label}</p>
//                 <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
//                 {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
//               </div>
//             ))}
//           </div>

//           {/* Upcoming ride + Quick actions */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="font-bold text-slate-800">Upcoming Ride</h2>
//                 <Link to="/passenger/bookings" className="text-sm font-semibold text-blue-600 hover:underline">
//                   View Details
//                 </Link>
//               </div>

//               {upcomingRide ? (
//                 <div className="flex gap-4">
//                   <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
//                     <Car size={28} className="text-slate-500" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start">
//                       <p className="font-semibold text-slate-900">
//                         {upcomingRide.source} → {upcomingRide.destination}
//                       </p>
//                       <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColorMap[upcomingRide.bookingStatus]}`}>
//                         {upcomingRide.bookingStatus}
//                       </span>
//                     </div>
//                     <p className="text-sm text-slate-500 mt-1">
//                       {upcomingRide.travelDate} • {upcomingRide.travelTime}
//                     </p>
//                     <p className="text-sm text-slate-500">Driver: {upcomingRide.driverName}</p>
//                     <p className="text-sm text-slate-500">
//                       Seats: {upcomingRide.seatsBooked} • ₹{upcomingRide.totalAmount}
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center py-6">
//                   <p className="text-sm text-slate-400">No upcoming rides yet.</p>
//                   <Link to="/SearchRide" className="text-sm font-semibold text-blue-600 hover:underline">
//                     Find a ride
//                   </Link>
//                 </div>
//               )}
//             </div>

//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//               <h2 className="font-bold text-slate-800 mb-4">Quick Actions</h2>
//               <div className="grid grid-cols-2 gap-3">
//                 {quickActions.map(({ label, icon: Icon, path, color }) => (
//                   <Link
//                     key={label}
//                     to={path}
//                     className={`flex flex-col items-center justify-center gap-2 rounded-xl py-4 font-semibold text-sm hover:opacity-80 transition ${colorMap[color]}`}
//                   >
//                     <Icon size={20} />
//                     {label}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Recent bookings */}
//           <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-bold text-slate-800">Recent Bookings</h2>
//               <Link to="/passenger/bookings" className="text-sm font-semibold text-blue-600 hover:underline">
//                 View All
//               </Link>
//             </div>

//             {recentBookings.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="text-left text-slate-400 border-b border-slate-100">
//                       <th className="pb-2 font-semibold">From</th>
//                       <th className="pb-2 font-semibold">To</th>
//                       <th className="pb-2 font-semibold">Date</th>
//                       <th className="pb-2 font-semibold">Driver</th>
//                       <th className="pb-2 font-semibold">Amount</th>
//                       <th className="pb-2 font-semibold">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {recentBookings.map((b) => (
//                       <tr key={b.bookingId} className="border-b border-slate-50 last:border-0">
//                         <td className="py-3 font-medium text-slate-800">{b.source}</td>
//                         <td className="py-3 text-slate-600">{b.destination}</td>
//                         <td className="py-3 text-slate-600">{b.travelDate}</td>
//                         <td className="py-3 text-slate-600">{b.driverName}</td>
//                         <td className="py-3 text-slate-600">₹{b.totalAmount}</td>
//                         <td className="py-3">
//                           <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColorMap[b.bookingStatus]}`}>
//                             {b.bookingStatus}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-sm text-slate-400 text-center py-6">No bookings yet — your rides will show up here.</p>
//             )}
//           </div>

//           {/* Wallet / Activity / Ratings */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//               <p className="text-sm font-semibold text-slate-500 mb-2">Wallet Balance</p>
//               <div className="flex items-center gap-2 mb-3">
//                 <Wallet size={18} className="text-blue-600" />
//                 <p className="text-2xl font-bold text-slate-900">₹{wallet.toFixed(2)}</p>
//               </div>
//               <button
//                 onClick={handleAddMoney}
//                 className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition mb-2"
//               >
//                 Add Money
//               </button>
//               <Link to="/passenger/payments" className="text-sm font-semibold text-blue-600 hover:underline">
//                 View Transaction History
//               </Link>
//             </div>

//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//               <p className="text-sm font-semibold text-slate-500 mb-3">Your Activity</p>
//               <div className="grid grid-cols-3 gap-2 text-center">
//                 <div>
//                   <Footprints size={18} className="mx-auto text-blue-500 mb-1" />
//                   <p className="font-bold text-slate-900">{activity.distanceKm} km</p>
//                   <p className="text-xs text-slate-400">Distance</p>
//                 </div>
//                 <div>
//                   <Clock size={18} className="mx-auto text-orange-500 mb-1" />
//                   <p className="font-bold text-slate-900">{activity.hoursSaved} hrs</p>
//                   <p className="text-xs text-slate-400">Hours Saved</p>
//                 </div>
//                 <div>
//                   <Leaf size={18} className="mx-auto text-green-500 mb-1" />
//                   <p className="font-bold text-slate-900">{activity.co2Kg} kg</p>
//                   <p className="text-xs text-slate-400">CO2 Reduced</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//               <p className="text-sm font-semibold text-slate-500 mb-2">Your Ratings</p>
//               <div className="flex items-center gap-2 mb-3">
//                 <Star size={20} className="text-yellow-400 fill-yellow-400" />
//                 <p className="text-2xl font-bold text-slate-900">{avgRating.toFixed(1)}</p>
//               </div>
//               <p className="text-xs text-slate-400 mb-3">Based on {totalReviews} reviews</p>
//               <div className="space-y-1">
//                 {ratingBreakdown.map(({ stars, count }) => (
//                   <div key={stars} className="flex items-center gap-2 text-xs">
//                     <span className="w-2 text-slate-500">{stars}</span>
//                     <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-yellow-400"
//                         style={{ width: `${(count / maxCount) * 100}%` }}
//                       />
//                     </div>
//                     <span className="w-4 text-slate-400">{count}</span>
//                   </div>
//                 ))}
//               </div>
//               <Link to="/passenger/reviews" className="text-sm font-semibold text-blue-600 hover:underline block mt-2">
//                 View All Reviews
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Right column */}
//         <div className="space-y-6">
//           <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-bold text-slate-800">Notifications</h2>
//               <Link to="/passenger/notifications" className="text-sm font-semibold text-blue-600 hover:underline">
//                 View All
//               </Link>
//             </div>

//             {notifications.length > 0 ? (
//               <div className="space-y-4">
//                 {notifications.map((n) => (
//                   <div key={n.notificationId} className="flex gap-3">
//                     <Bell size={18} className={`${n.status ? 'text-slate-400' : 'text-blue-600'} flex-shrink-0 mt-0.5`} />
//                     <div className="flex-1">
//                       <p className="text-sm font-semibold text-slate-800">{n.message}</p>
//                       <p className="text-xs text-slate-400 mt-0.5">
//                         {new Date(n.notificationTime).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-slate-400 text-center py-6">No notifications yet.</p>
//             )}
//           </div>

//           <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white">
//             <h2 className="font-bold text-lg mb-2">Share Rides, Save More!</h2>
//             <p className="text-sm text-indigo-100">
//               Travel together and save money while reducing pollution.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings } from '../../api/bookingApi';
import { getPaymentHistory } from "../../api/paymentApi";
import { getMyNotifications } from '../../api/notificationApi';
import PaymentModal from '../../components/PaymentModal';

import {
  Car,
  Calendar,
  CheckCircle2,
  Search,
  MessageCircle,
  Heart,
  MapPin,
  Bell,
  Clock,
  Wallet,
  Footprints,
  Leaf,
  Star,
} from 'lucide-react';

const STORAGE_KEY = 'passengerDashboardExtras';

const emptyExtras = {
  wallet: 0,
  activity: {
    distanceKm: 0,
    hoursSaved: 0,
    co2Kg: 0,
  },
  ratingBreakdown: [
    { stars: 5, count: 0 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ],
  avgRating: 0,
};

function loadExtras() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...emptyExtras, ...JSON.parse(raw) } : emptyExtras;
  } catch {
    return emptyExtras;
  }
}

function saveExtras(extras) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(extras));
  } catch {
    // Ignore storage errors
  }
}

const quickActions = [
  { label: 'Find Ride', icon: Search, path: '/SearchRide', color: 'blue' },
  { label: 'Messages', icon: MessageCircle, path: '/chat', color: 'green' },
  { label: 'Saved Routes', icon: Heart, path: '/passenger/saved-routes', color: 'purple' },
  { label: 'Nearby Rides', icon: MapPin, path: '/passenger/nearby-rides', color: 'orange' },
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

  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [extras, setExtras] = useState(emptyExtras);
  const [paidBookings, setPaidBookings] = useState([]);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const userName = localStorage.getItem('userName') || 'there';

  const openPaymentModal = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

    // ===========================
  // Load Dashboard Data
  // ===========================
  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      setLoadError('');

      try {
        const [bookingsRes, notificationsRes, paymentsRes] = await Promise.all([
    getMyBookings(),
    getMyNotifications(),
    getPaymentHistory(),
]);

        if (!isMounted) return;

        setBookings(bookingsRes.data);
        setNotifications(notificationsRes.data);
        setPaidBookings(
    paymentsRes.data.map(payment => payment.bookingId)
);
      } catch (error) {
        if (!isMounted) return;

        setLoadError(
          error.request
            ? 'Could not reach the server. Is the backend running on port 8081?'
            : 'Could not load your dashboard data.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 15000);

    window.addEventListener('focus', fetchDashboardData);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', fetchDashboardData);
    };
  }, []);

  // ===========================
  // Load Local Extras
  // ===========================
  useEffect(() => {
    setExtras(loadExtras());
  }, []);

  useEffect(() => {
    saveExtras(extras);
  }, [extras]);

  // ===========================
  // Wallet
  // ===========================
  const handleAddMoney = () => {
    const input = window.prompt(
      'Enter amount to add (₹):',
      ''
    );

    const amount = Number(input);

    if (!input || isNaN(amount) || amount <= 0) {
      return;
    }

    setExtras((prev) => ({
      ...prev,
      wallet: prev.wallet + amount,
    }));
  };

  // ===========================
  // Booking Calculations
  // ===========================
  const todayStr = new Date().toISOString().split('T')[0];

  const sortedBookings = [...bookings].sort((a, b) =>
    a.travelDate < b.travelDate ? -1 : 1
  );

  const upcomingRide =
    sortedBookings.find(
      (b) =>
        b.travelDate >= todayStr &&
        b.bookingStatus !== 'REJECTED'
    ) || null;

  const recentBookings = [...bookings]
    .reverse()
    .slice(0, 8);

  const stats = {
    totalRidesBooked: bookings.length,
    pendingRequests: bookings.filter(
      (b) => b.bookingStatus === 'PENDING'
    ).length,

    confirmedRides: bookings.filter(
      (b) => b.bookingStatus === 'CONFIRMED'
    ).length,
  };

  const {
    wallet,
    activity,
    ratingBreakdown,
    avgRating,
  } = extras;

  const totalReviews = ratingBreakdown.reduce(
    (sum, r) => sum + r.count,
    0
  );

  const maxCount = Math.max(
    ...ratingBreakdown.map((r) => r.count),
    1
  );

  const statCards = [
    {
      label: 'Total Bookings',
      value: stats.totalRidesBooked,
      icon: Car,
      color: 'blue',
    },
    {
      label: 'Pending Requests',
      value: stats.pendingRequests,
      icon: Calendar,
      color: 'orange',
    },
    {
      label: 'Confirmed Rides',
      value: stats.confirmedRides,
      icon: CheckCircle2,
      color: 'purple',
    },
  ];

    return (
    <div className="min-h-screen bg-slate-50 px-6 lg:px-8 pt-28 lg:pt-32 pb-8">

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Ready for your next journey?
          </p>
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
        <p className="text-sm text-slate-400 font-semibold mb-6">
          Loading your dashboard...
        </p>
      )}

      {loadError && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">

          {/* Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            {statCards.map(({ label, value, icon: Icon, color }) => (

              <div
                key={label}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
              >

                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colorMap[color]}`}
                >
                  <Icon size={18} />
                </div>

                <p className="text-xs font-semibold text-slate-500">
                  {label}
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {value}
                </p>

              </div>

            ))}

          </div>

          {/* Upcoming Ride */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

              <div className="flex justify-between items-center mb-4">

                <h2 className="font-bold text-slate-800">
                  Upcoming Ride
                </h2>

                <Link
                  to="/passenger/bookings"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  View Details
                </Link>

              </div>

              {upcomingRide ? (

                <div className="flex gap-4">

                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center">

                    <Car
                      size={28}
                      className="text-slate-500"
                    />

                  </div>

                  <div className="flex-1">

                    <div className="flex justify-between">

                      <p className="font-semibold text-slate-900">

                        {upcomingRide.source} → {upcomingRide.destination}

                      </p>

                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColorMap[upcomingRide.bookingStatus]}`}
                      >
                        {upcomingRide.bookingStatus}
                      </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-2">
                      {upcomingRide.travelDate} • {upcomingRide.travelTime}
                    </p>

                    <p className="text-sm text-slate-500">
                      Driver : {upcomingRide.driverName}
                    </p>

                    <p className="text-sm text-slate-500">
                      Seats : {upcomingRide.seatsBooked}
                    </p>

                    <p className="text-sm font-semibold text-blue-700">
                      ₹ {upcomingRide.totalAmount}
                    </p>

                  </div>

                </div>

              ) : (

                <div className="text-center py-8">

                  <p className="text-slate-500">
                    No Upcoming Ride
                  </p>

                </div>

              )}

            </div>

                        {/* Quick Actions */}

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

              <h2 className="font-bold text-slate-800 mb-4">
                Quick Actions
              </h2>

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

          {/* Recent Bookings */}

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

            <div className="flex justify-between items-center mb-4">

              <h2 className="font-bold text-slate-800">
                Recent Bookings
              </h2>

            </div>

            {recentBookings.length > 0 ? (

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead>

                    <tr className="text-left text-slate-400 border-b border-slate-100">

                      <th className="pb-2">From</th>
                      <th className="pb-2">To</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Driver</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Action</th>

                    </tr>

                  </thead>

                  <tbody>

                    {recentBookings.map((b) => (

                      <tr
                        key={b.bookingId}
                        className="border-b border-slate-100"
                      >

                        <td className="py-3 font-medium">
                          {b.source}
                        </td>

                        <td className="py-3">
                          {b.destination}
                        </td>

                        <td className="py-3">
                          {b.travelDate}
                        </td>

                        <td className="py-3">
                          {b.driverName}
                        </td>

                        <td className="py-3">
                          ₹{b.totalAmount}
                        </td>

                        <td className="py-3">

                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColorMap[b.bookingStatus]}`}
                          >
                            {b.bookingStatus}
                          </span>

                        </td>

                        <td className="py-3">

                          {/* {b.bookingStatus === "CONFIRMED" ? (

                            <button
                              onClick={() => openPaymentModal(b)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                            >
                              Pay Now
                            </button>

                          ) : b.bookingStatus === "PENDING" ? (

                            <span className="text-amber-600 font-semibold">
                              Waiting
                            </span>

                          ) : (

                            <span className="text-slate-400">
                              --
                            </span>

                          )} */}

                          {paidBookings.includes(b.bookingId) ? (

    <span className="text-green-700 font-semibold">
        Paid
    </span>

) : b.bookingStatus === "CONFIRMED" ? (

    <button
        onClick={() => openPaymentModal(b)}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
    >
        Pay Now
    </button>

) : b.bookingStatus === "PENDING" ? (

    <span className="text-amber-600 font-semibold">
        Waiting
    </span>

) : (

    <span className="text-slate-400">
        --
    </span>

)}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            ) : (

              <div className="text-center py-8 text-slate-500">

                No bookings available.

              </div>

            )}

            
            
          </div>

                  </div>

        {/* Right Section */}
        <div className="space-y-6">

          {/* Wallet */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

            <div className="flex justify-between items-center mb-4">

              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Wallet size={20} />
                Wallet
              </h2>

              <button
                onClick={handleAddMoney}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
              >
                Add Money
              </button>

            </div>

            <p className="text-3xl font-bold text-green-600">
              ₹ {wallet}
            </p>

          </div>

          {/* Activity */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

            <h2 className="font-bold text-slate-800 mb-4">
              Your Activity
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Footprints size={16} />
                  Distance
                </span>

                <span>{activity.distanceKm} km</span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  Time Saved
                </span>

                <span>{activity.hoursSaved} hrs</span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Leaf size={16} />
                  CO₂ Saved
                </span>

                <span>{activity.co2Kg} kg</span>
              </div>

            </div>

          </div>

          {/* Ratings */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

            <div className="flex items-center gap-2 mb-4">
              <Star className="text-yellow-500" size={20} />
              <h2 className="font-bold text-slate-800">
                Ratings
              </h2>
            </div>

            <p className="text-3xl font-bold">
              {avgRating.toFixed(1)}
            </p>

            <p className="text-sm text-slate-500 mb-4">
              {totalReviews} Reviews
            </p>

            {ratingBreakdown.map((r) => (

              <div
                key={r.stars}
                className="flex items-center gap-2 mb-2"
              >

                <span className="w-5 text-sm">
                  {r.stars}
                </span>

                <div className="flex-1 bg-slate-200 rounded-full h-2">

                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${(r.count / maxCount) * 100}%`,
                    }}
                  />

                </div>

                <span className="text-xs">
                  {r.count}
                </span>

              </div>

            ))}

          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

            <h2 className="font-bold text-slate-800 mb-4">
              Notifications
            </h2>

            {notifications.length > 0 ? (

              notifications.slice(0, 5).map((n) => (

                <div
                  key={n.notificationId}
                  className="border-b last:border-none py-3"
                >
                  <p className="text-sm text-slate-700">
                    {n.message}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {n.createdAt}
                  </p>

                </div>

              ))

            ) : (

              <p className="text-slate-400">
                No notifications.
              </p>

            )}

          </div>

        </div>

      </div>

      {showPaymentModal && selectedBooking && (

        // <PaymentModal
        //   booking={selectedBooking}
        //   onClose={() => setShowPaymentModal(false)}
        //   onSuccess={() => {
        //     setShowPaymentModal(false);
        //   }}
        // />

        <PaymentModal
    booking={selectedBooking}
    onClose={() => setShowPaymentModal(false)}
    onSuccess={async () => {

        setShowPaymentModal(false);

        const bookingsRes = await getMyBookings();
        setBookings(bookingsRes.data);

        const paymentsRes = await getPaymentHistory();
        setPaidBookings(
            paymentsRes.data.map(payment => payment.bookingId)
        );
    }}
/>

      )}

    </div>
  );
}