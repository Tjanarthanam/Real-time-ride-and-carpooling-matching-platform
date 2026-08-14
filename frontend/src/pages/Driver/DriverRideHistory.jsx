// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   History,
//   MapPin,
//   Calendar,
//   Clock,
//   User,
//   CheckCircle2,
//   Search,
//   IndianRupee,
//   Phone,
//   Loader2,
//   AlertCircle,
// } from 'lucide-react';

// export default function DriverRideHistory() {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [rides, setRides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Authentication & Authorization Check
//   const token = localStorage.getItem('token');
//   const rawRole = localStorage.getItem('role') || '';
//   const userRole = rawRole.toString().toLowerCase().trim();

//   useEffect(() => {
//     // 1. Redirect to Sign In if no token or user is not a driver
//     if (!token || userRole !== 'driver') {
//       navigate('/signin');
//       return;
//     }

//     // 2. Fetch driver's real completed rides from Backend API
//     const fetchDriverHistory = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch('http://localhost:5000/api/driver/ride-history', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to load ride history');
//         }

//         const data = await response.json();
//         // Expects array of completed rides from backend API
//         setRides(data.rides || data || []);
//       } catch (err) {
//         console.error('Error fetching driver history:', err);
//         setError('Unable to fetch ride history. Please check your connection.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDriverHistory();
//   }, [token, userRole, navigate]);

//   // Filter rides based on search input
//   const filteredRides = rides.filter((ride) => {
//     const search = searchTerm.toLowerCase();
//     return (
//       ride.passengerName?.toLowerCase().includes(search) ||
//       ride.pickup?.toLowerCase().includes(search) ||
//       ride.destination?.toLowerCase().includes(search) ||
//       ride.id?.toLowerCase().includes(search) ||
//       ride._id?.toLowerCase().includes(search)
//     );
//   });

//   if (!token || userRole !== 'driver') {
//     return null; // Prevents render glitch before redirect
//   }

//   return (
//     <div className="w-full min-h-screen bg-[#F8FAFC] pt-28 pb-16 px-6 sm:px-10 lg:px-16">
//       <div className="max-w-5xl mx-auto space-y-8">
        
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <div className="flex items-center gap-2">
//               <History className="text-blue-600" size={28} />
//               <h1 className="text-3xl font-black text-slate-950 tracking-tight">
//                 Driver Ride History
//               </h1>
//             </div>
//             <p className="text-sm font-semibold text-slate-500 mt-1">
//               Your real-time record of completed trips and earnings
//             </p>
//           </div>

//           <span className="self-start sm:self-auto text-xs font-black uppercase px-3.5 py-1.5 bg-amber-100 text-amber-900 border border-amber-200 rounded-xl flex items-center gap-1.5">
//             <CheckCircle2 size={16} className="text-amber-700" />
//             <span>Driver Portal</span>
//           </span>
//         </div>

//         {/* Search Input */}
//         <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
//           <Search size={20} className="text-slate-400 flex-shrink-0" />
//           <input
//             type="text"
//             placeholder="Search by passenger, route, or ride ID..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full text-sm font-bold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
//           />
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
//             <AlertCircle size={20} className="text-rose-600 flex-shrink-0" />
//             <span>{error}</span>
//           </div>
//         )}

//         {/* State Handler: Loading */}
//         {loading ? (
//           <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 flex flex-col items-center justify-center space-y-3">
//             <Loader2 size={36} className="text-blue-600 animate-spin" />
//             <p className="text-sm font-bold text-slate-500">Fetching completed rides...</p>
//           </div>
//         ) : filteredRides.length === 0 ? (
          
//           /* State Handler: Empty History */
//           <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 space-y-3">
//             <History size={48} className="text-slate-300 mx-auto" />
//             <h3 className="text-lg font-black text-slate-800">No completed rides found</h3>
//             <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">
//               Once you accept and complete trips as a driver, your history and earnings will automatically appear here.
//             </p>
//           </div>
//         ) : (

//           /* Rides List */
//           <div className="space-y-4">
//             {filteredRides.map((ride) => {
//               const rideId = ride.id || ride._id;
//               return (
//                 <div
//                   key={rideId}
//                   className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:border-blue-500/40 transition duration-200 space-y-6"
//                 >
//                   {/* Card Top Banner */}
//                   <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
//                     <div className="flex items-center gap-3">
//                       <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
//                         #{rideId?.toString().slice(-6)}
//                       </span>
//                       <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
//                         <Calendar size={14} className="text-slate-400" />
//                         <span>{ride.date || 'N/A'}</span>
//                         <span className="text-slate-300">•</span>
//                         <Clock size={14} className="text-slate-400" />
//                         <span>{ride.time || 'N/A'}</span>
//                       </div>
//                     </div>

//                     <span className="text-xs font-black uppercase px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-xl flex items-center gap-1">
//                       <CheckCircle2 size={14} />
//                       {ride.status || 'Completed'}
//                     </span>
//                   </div>

//                   {/* Route Overview */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
//                     <div className="flex items-start gap-3">
//                       <MapPin size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
//                       <div>
//                         <p className="text-[10px] font-black uppercase text-slate-400">Pickup</p>
//                         <p className="text-sm font-extrabold text-slate-900">{ride.pickup}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <MapPin size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
//                       <div>
//                         <p className="text-[10px] font-black uppercase text-slate-400">Destination</p>
//                         <p className="text-sm font-extrabold text-slate-900">{ride.destination}</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Passenger Details & Earnings */}
//                   <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold">
//                         <User size={20} />
//                       </div>
//                       <div>
//                         <p className="text-sm font-black text-slate-900">{ride.passengerName || 'Passenger'}</p>
//                         {ride.passengerPhone && (
//                           <a
//                             href={`tel:${ride.passengerPhone}`}
//                             className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
//                           >
//                             <Phone size={12} />
//                             <span>{ride.passengerPhone}</span>
//                           </a>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-6">
//                       {ride.distance && (
//                         <div className="text-right">
//                           <p className="text-[10px] font-black uppercase text-slate-400">Distance</p>
//                           <p className="text-sm font-extrabold text-slate-800">{ride.distance}</p>
//                         </div>
//                       )}

//                       <div className="text-right pl-4 border-l border-slate-200">
//                         <p className="text-[10px] font-black uppercase text-slate-400">Fare Earned</p>
//                         <p className="text-lg font-black text-emerald-600 flex items-center justify-end">
//                           <IndianRupee size={16} />
//                           <span>{ride.fareEarned || ride.fare || 0}</span>
//                         </p>
//                       </div>
//                     </div>

//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo } from "react";
import {
  History,
  MapPin,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Search,
  IndianRupee,
  Phone,
  Loader2,
  AlertCircle,
  Car,
  Users,
  Route,
} from "lucide-react";

import { getMyRides } from "../../api/driverRideApi";

export default function DriverRideHistory() {

  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {

    async function loadRides() {

      try {

        setLoading(true);

        const response = await getMyRides();

console.log("My Rides API Response:", response.data);

const data = Array.isArray(response.data)
    ? response.data
    : response.data.rides || [];

setRides(data);
setFilteredRides(data);

      } catch (err) {

        console.error(err);

        setError("Unable to load your rides.");

      } finally {

        setLoading(false);

      }

    }

    loadRides();

  }, []);

  useEffect(() => {

    const keyword = searchTerm.toLowerCase();

    setFilteredRides(

      rides.filter((ride) =>

        String(ride.id || "")
          .toLowerCase()
          .includes(keyword)

        ||

        String(ride.source || "")
          .toLowerCase()
          .includes(keyword)

        ||

        String(ride.destination || "")
          .toLowerCase()
          .includes(keyword)

      )

    );

  }, [searchTerm, rides]);

  const totalRides = rides.length;

  const totalSeats = useMemo(() => {

    return rides.reduce(
      (sum, ride) => sum + (ride.availableSeats || 0),
      0
    );

  }, [rides]);

  const today = new Date();

  const upcomingRides = rides.filter((ride) => {

    if (!ride.travelDate) return false;

    return new Date(ride.travelDate) >= today;

  }).length;

  const completedRides = rides.filter((ride) => {

    if (!ride.travelDate) return false;

    return new Date(ride.travelDate) < today;

  }).length;

    return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white pt-28 pb-10 px-6">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 mb-8">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

            <div className="flex items-center gap-5">

              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">

                <History
                  size={34}
                  className="text-blue-600"
                />

              </div>

              <div>

                <h1 className="text-4xl font-bold text-slate-800">

                  Driver Ride History

                </h1>

                <p className="text-slate-500 mt-2">

                  Manage every ride you've offered from one place.

                </p>

              </div>

            </div>

            <div className="bg-green-100 text-green-700 px-5 py-3 rounded-2xl font-semibold">

              Driver Portal

            </div>

          </div>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

          {/* Total Rides */}

          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-slate-500 text-sm">

                  Total Rides

                </p>

                <h2 className="text-4xl font-bold mt-2">

                  {totalRides}

                </h2>

              </div>

              <div className="bg-blue-100 p-4 rounded-2xl">

                <Car
                  size={30}
                  className="text-blue-600"
                />

              </div>

            </div>

          </div>

          {/* Upcoming */}

          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-slate-500 text-sm">

                  Upcoming

                </p>

                <h2 className="text-4xl font-bold mt-2 text-orange-500">

                  {upcomingRides}

                </h2>

              </div>

              <div className="bg-orange-100 p-4 rounded-2xl">

                <Calendar
                  size={30}
                  className="text-orange-500"
                />

              </div>

            </div>

          </div>

          {/* Completed */}

          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-slate-500 text-sm">

                  Completed

                </p>

                <h2 className="text-4xl font-bold mt-2 text-green-600">

                  {completedRides}

                </h2>

              </div>

              <div className="bg-green-100 p-4 rounded-2xl">

                <CheckCircle2
                  size={30}
                  className="text-green-600"
                />

              </div>

            </div>

          </div>

          {/* Seats */}

          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-slate-500 text-sm">

                  Available Seats

                </p>

                <h2 className="text-4xl font-bold mt-2 text-purple-600">

                  {totalSeats}

                </h2>

              </div>

              <div className="bg-purple-100 p-4 rounded-2xl">

                <Users
                  size={30}
                  className="text-purple-600"
                />

              </div>

            </div>

          </div>

        </div>

        {/* Search */}

        <div className="bg-white rounded-2xl shadow-md p-5 mb-8">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-3.5 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by Ride ID, Source or Destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

        </div>

                {/* Loading */}

        {loading ? (

          <div className="bg-white rounded-3xl shadow-lg p-16 text-center">

            <Loader2
              size={40}
              className="animate-spin text-blue-600 mx-auto mb-4"
            />

            <h3 className="text-xl font-bold text-slate-700">

              Loading your rides...

            </h3>

            <p className="text-slate-500 mt-2">

              Please wait while we fetch your ride history.

            </p>

          </div>

        ) : error ? (

          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">

            <AlertCircle
              size={42}
              className="text-red-600 mx-auto mb-4"
            />

            <h3 className="text-2xl font-bold text-red-700">

              {error}

            </h3>

          </div>

        ) : filteredRides.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-lg p-16 text-center">

            <History
              size={55}
              className="mx-auto text-slate-300 mb-5"
            />

            <h3 className="text-2xl font-bold text-slate-700">

              No Rides Found

            </h3>

            <p className="text-slate-500 mt-3">

              Your offered rides will appear here.

            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {filteredRides.map((ride) => (

              <div
                key={ride.id}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden"
              >

                {/* Top */}

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">

                  <div>

                    <h2 className="text-white font-bold text-xl">
    Ride #{String(ride.id).padStart(4, "0")}
</h2>

                    <p className="text-blue-100 text-sm">

                      {ride.source} → {ride.destination}

                    </p>

                  </div>

                  <span className="bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold">

                    {new Date(ride.travelDate) >= new Date()
    ? "Upcoming"
    : "Completed"}

                  </span>

                </div>

                <div className="p-6">

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Source */}

                    <div className="flex items-start gap-3">

                      <MapPin
                        className="text-blue-600 mt-1"
                        size={20}
                      />

                      <div>

                        <p className="text-xs text-slate-500">

                          Source

                        </p>

                        <h4 className="font-bold text-slate-800">

                          {ride.source}

                        </h4>

                      </div>

                    </div>

                    {/* Destination */}

                    <div className="flex items-start gap-3">

                      <Route
                        className="text-green-600 mt-1"
                        size={20}
                      />

                      <div>

                        <p className="text-xs text-slate-500">

                          Destination

                        </p>

                        <h4 className="font-bold text-slate-800">

                          {ride.destination}

                        </h4>

                      </div>

                    </div>

                    {/* Date */}

                    <div className="flex items-start gap-3">

                      <Calendar
                        className="text-orange-500 mt-1"
                        size={20}
                      />

                      <div>

                        <p className="text-xs text-slate-500">

                          Travel Date

                        </p>

                        <h4 className="font-bold text-slate-800">

                          {new Date(ride.travelDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
})}

                        </h4>

                      </div>

                    </div>

                    {/* Seats */}

                    <div className="flex items-start gap-3">

                      <Users
                        className="text-purple-600 mt-1"
                        size={20}
                      />

                      <div>

                        <p className="text-xs text-slate-500">

                          Available Seats

                        </p>

                        <h4 className="font-bold text-slate-800">

                          {ride.availableSeats}

                        </h4>

                      </div>

                    </div>

                  </div>

                  <div className="mt-8 flex flex-wrap justify-between items-center border-t pt-5">

                    <div className="flex items-center gap-2 text-green-600">

                      <IndianRupee size={20} />

                      <span className="font-bold">

                        {/* Fare: ₹ {ride.fare ?? "N/A"} */}
                        <span className="text-slate-500 font-medium">
    Fare details will be available soon.
</span>
                      </span>

                    </div>

                    <button
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                    >

                      View Details

                    </button>

                  </div>

                </div>

              </div>

            ))}

                      </div>

        )}

        {/* Footer */}

        <div className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-lg p-8 text-white">

          <div className="flex items-center gap-5">

            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">

              <History size={30} />

            </div>

            <div>

              <h2 className="text-2xl font-bold">

                Keep Your Ride History Organized

              </h2>

              <p className="text-blue-100 mt-2 max-w-3xl">

                Every ride you offer is securely recorded. Use your ride
                history to track upcoming trips, monitor completed journeys,
                and manage your driving activity efficiently.

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}