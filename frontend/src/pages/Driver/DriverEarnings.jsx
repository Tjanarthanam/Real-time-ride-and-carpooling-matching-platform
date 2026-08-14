// // import React, { useState } from 'react';
// // import { Wallet, Car, TrendingUp, Calendar, ArrowUpRight, ShieldCheck } from 'lucide-react';

// // export default function DriverEarnings() {
// //   // Demo State: Change totalRides to 0 to see the "Blank / New Driver State"
// //   // When totalRides > 0, it automatically displays full analytics
// //   const [earningsData, setEarningsData] = useState({
// //     totalRides: 0,
// //     totalEarnings: 0,
// //     rideHistory: [
// //       // Example structure once rides are completed:
// //       // {
// //       //   id: 'TRIP-1024',
// //       //   date: '2026-07-28',
// //       //   route: 'Bengaluru → Mysuru',
// //       //   passengers: 3,
// //       //   fare: 1200,
// //       //   status: 'Completed'
// //       // }
// //     ]
// //   });

// //   const isBlankState = earningsData.totalRides === 0;

// //   return (
// //     <div className="w-full min-h-screen bg-[#F8FAFC] pt-28 pb-16 px-6 sm:px-10 lg:px-16">
// //       <div className="max-w-6xl mx-auto space-y-8">
        
// //         {/* Header Title */}
// //         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
// //           <div>
// //             <h1 className="text-3xl font-black text-slate-950 tracking-tight">Driver Earnings</h1>
// //             <p className="text-sm font-semibold text-slate-500 mt-1">
// //               Track your trip performance and total revenue earned
// //             </p>
// //           </div>

// //           <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-xl text-emerald-800 text-xs font-bold">
// //             <ShieldCheck size={18} className="text-emerald-600" />
// //             <span>Secure Direct Payout Active</span>
// //           </div>
// //         </div>

// //         {/* ========================================================= */}
// //         {/* TOP SUMMARY CARDS (TOTAL RIDES & TOTAL EARNINGS)          */}
// //         {/* ========================================================= */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
// //           {/* Card 1: Total Completed Rides */}
// //           <div className="bg-white border-2 border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex items-center justify-between">
// //             <div>
// //               <span className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-1">
// //                 Total Rides Completed
// //               </span>
// //               <h2 className="text-4xl font-black text-slate-900">
// //                 {isBlankState ? '--' : `${earningsData.totalRides} Trips`}
// //               </h2>
// //               <p className="text-xs font-bold text-slate-400 mt-2">
// //                 {isBlankState ? 'No rides published or finished yet' : 'Lifetime completed trips'}
// //               </p>
// //             </div>
// //             <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
// //               <Car size={28} />
// //             </div>
// //           </div>

// //           {/* Card 2: Total Earnings */}
// //           <div className="bg-white border-2 border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex items-center justify-between">
// //             <div>
// //               <span className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-1">
// //                 Total Earnings
// //               </span>
// //               <h2 className="text-4xl font-black text-emerald-600">
// //                 {isBlankState ? '--' : `₹${earningsData.totalEarnings.toLocaleString('en-IN')}`}
// //               </h2>
// //               <p className="text-xs font-bold text-slate-400 mt-2">
// //                 {isBlankState ? 'Start offering rides to begin earning' : 'Net payout received'}
// //               </p>
// //             </div>
// //             <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
// //               <Wallet size={28} />
// //             </div>
// //           </div>

// //         </div>

// //         {/* ========================================================= */}
// //         {/* CONDITIONAL BODY CONTENT: BLANK STATE vs RIDE HISTORY      */}
// //         {/* ========================================================= */}
// //         {isBlankState ? (
          
// //           /* ======================================================= */
// //           /* 1. START TIME / BLANK STATE UI                          */
// //           /* ======================================================= */
// //           <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
// //             <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mb-6">
// //               <TrendingUp size={36} />
// //             </div>
// //             <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
// //               No Earnings Recorded Yet
// //             </h3>
// //             <p className="text-slate-500 font-medium text-sm max-w-md mb-8 leading-relaxed">
// //               You haven't completed any rides as a driver yet. Once passengers book seats on your route and complete the trip, your revenue summary will appear here.
// //             </p>
// //             <a
// //               href="/OfferRide"
// //               className="bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition transform active:scale-95 inline-flex items-center gap-2"
// //             >
// //               <span>Publish Your First Ride</span>
// //               <ArrowUpRight size={18} />
// //             </a>
// //           </div>

// //         ) : (

// //           /* ======================================================= */
// //           /* 2. POPULATED STATE TABLE (WHEN DRIVER HAS EARNINGS)     */
// //           /* ======================================================= */
// //           <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
// //             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
// //               <h3 className="text-lg font-black text-slate-900">Trip Earnings Breakdown</h3>
// //               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
// //                 Latest Completed Trips
// //               </span>
// //             </div>

// //             <div className="overflow-x-auto">
// //               <table className="w-full text-left border-collapse">
// //                 <thead>
// //                   <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
// //                     <th className="py-4 px-6">Trip ID</th>
// //                     <th className="py-4 px-6">Date</th>
// //                     <th className="py-4 px-6">Route</th>
// //                     <th className="py-4 px-6">Passengers</th>
// //                     <th className="py-4 px-6 text-right">Fare Earned</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
// //                   {earningsData.rideHistory.map((ride) => (
// //                     <tr key={ride.id} className="hover:bg-slate-50/50 transition">
// //                       <td className="py-4 px-6 font-mono text-slate-500">{ride.id}</td>
// //                       <td className="py-4 px-6 font-bold text-slate-900">{ride.date}</td>
// //                       <td className="py-4 px-6 font-bold text-slate-900">{ride.route}</td>
// //                       <td className="py-4 px-6">{ride.passengers} Seat(s)</td>
// //                       <td className="py-4 px-6 text-right font-black text-emerald-600">
// //                         +₹{ride.fare}
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>

// //         )}

// //       </div>
// //     </div>
// //   );
// // }


// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Wallet,
//   Car,
//   TrendingUp,
//   ArrowUpRight,
//   ShieldCheck,
//   QrCode,
//   Plus,
//   Trash2,
//   CheckCircle2,
//   Loader2,
//   AlertCircle,
//   Upload,
// } from 'lucide-react';

// export default function DriverEarnings() {
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);

//   // Authentication & Authorization Check
//   const token = localStorage.getItem('token');
//   const rawRole = localStorage.getItem('role') || '';
//   const userRole = rawRole.toString().toLowerCase().trim();

//   // Component States
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState('');
  
//   // Earnings State
//   const [earningsData, setEarningsData] = useState({
//     totalRides: 0,
//     totalEarnings: 0,
//     rideHistory: [],
//   });

//   // Scanner State (Multiple Scanners Support)
//   const [scanners, setScanners] = useState([]);
//   const [scannerTitle, setScannerTitle] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);

//   useEffect(() => {
//     // Redirect non-drivers or unauthenticated users
//     if (!token || userRole !== 'driver') {
//       navigate('/signin');
//       return;
//     }

//     // Fetch Driver Earnings & Saved Scanners from Backend API
//     const fetchEarningsAndScanners = async () => {
//       try {
//         setLoading(true);

//         // Fetch Earnings API
//         const earningsRes = await fetch('http://localhost:5000/api/driver/earnings', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (earningsRes.ok) {
//           const data = await earningsRes.json();
//           setEarningsData(data);
//         }

//         // Fetch Scanners API
//         const scannerRes = await fetch('http://localhost:5000/api/driver/scanners', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (scannerRes.ok) {
//           const scannerData = await scannerRes.json();
//           setScanners(scannerData.scanners || scannerData || []);
//         }
//       } catch (err) {
//         console.error('Error fetching driver data:', err);
//         setError('Failed to load dashboard data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEarningsAndScanners();
//   }, [token, userRole, navigate]);

//   // Handle File Selection
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setFilePreview(URL.createObjectURL(file));
//     }
//   };

//   // Upload/Add Scanner Action
//   const handleAddScanner = async (e) => {
//     e.preventDefault();
//     if (!selectedFile || !scannerTitle.trim()) {
//       setError('Please provide a scanner label and upload an image.');
//       return;
//     }

//     try {
//       setIsUploading(true);
//       setError(null);

//       const formData = new FormData();
//       formData.append('title', scannerTitle);
//       formData.append('scannerImage', selectedFile);

//       // Backend API Call to Upload Scanner
//       const response = await fetch('http://localhost:5000/api/driver/scanners/upload', {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (!response.ok) throw new Error('Upload failed');

//       const newScanner = await response.json();
//       setScanners((prev) => [...prev, newScanner.scanner || newScanner]);

//       // Reset form
//       setScannerTitle('');
//       setSelectedFile(null);
//       setFilePreview(null);
//       setSuccessMsg('Payment scanner added successfully!');
//       setTimeout(() => setSuccessMsg(''), 3000);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to upload scanner. Please try again.');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Delete Scanner Action
//   const handleDeleteScanner = async (scannerId) => {
//     try {
//       setError(null);
//       const response = await fetch(`http://localhost:5000/api/driver/scanners/${scannerId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error('Delete failed');

//       setScanners((prev) => prev.filter((s) => (s._id || s.id) !== scannerId));
//       setSuccessMsg('Scanner deleted successfully.');
//       setTimeout(() => setSuccessMsg(''), 3000);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to delete scanner.');
//     }
//   };

//   const isBlankState = earningsData.totalRides === 0;

//   if (!token || userRole !== 'driver') return null;

//   return (
//     <div className="w-full min-h-screen bg-[#F8FAFC] pt-28 pb-16 px-6 sm:px-10 lg:px-16">
//       <div className="max-w-6xl mx-auto space-y-8">
        
//         {/* Header Title */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-black text-slate-950 tracking-tight">Driver Earnings</h1>
//             <p className="text-sm font-semibold text-slate-500 mt-1">
//               Track your trip performance and manage your payout payment scanners
//             </p>
//           </div>

//           <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-xl text-emerald-800 text-xs font-bold">
//             <ShieldCheck size={18} className="text-emerald-600" />
//             <span>Direct Payout Active</span>
//           </div>
//         </div>

//         {/* Notifications */}
//         {error && (
//           <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
//             <AlertCircle size={20} className="text-rose-600 flex-shrink-0" />
//             <span>{error}</span>
//           </div>
//         )}

//         {successMsg && (
//           <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
//             <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
//             <span>{successMsg}</span>
//           </div>
//         )}

//         {/* Top Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white border-2 border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex items-center justify-between">
//             <div>
//               <span className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-1">
//                 Total Rides Completed
//               </span>
//               <h2 className="text-4xl font-black text-slate-900">
//                 {isBlankState ? '--' : `${earningsData.totalRides} Trips`}
//               </h2>
//               <p className="text-xs font-bold text-slate-400 mt-2">
//                 {isBlankState ? 'No rides finished yet' : 'Lifetime completed trips'}
//               </p>
//             </div>
//             <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
//               <Car size={28} />
//             </div>
//           </div>

//           <div className="bg-white border-2 border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex items-center justify-between">
//             <div>
//               <span className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-1">
//                 Total Earnings
//               </span>
//               <h2 className="text-4xl font-black text-emerald-600">
//                 {isBlankState ? '--' : `₹${earningsData.totalEarnings.toLocaleString('en-IN')}`}
//               </h2>
//               <p className="text-xs font-bold text-slate-400 mt-2">
//                 {isBlankState ? 'Start offering rides to begin earning' : 'Net payout received'}
//               </p>
//             </div>
//             <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
//               <Wallet size={28} />
//             </div>
//           </div>
//         </div>

//         {/* ========================================================= */}
//         {/* PAYMENT SCANNERS & BANK QR CODES SECTION                   */}
//         {/* ========================================================= */}
//         <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
//             <div>
//               <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
//                 <QrCode className="text-blue-600" size={22} />
//                 <span>Payment QR Scanners</span>
//               </h3>
//               <p className="text-xs font-semibold text-slate-500 mt-0.5">
//                 Upload your bank or UPI QR code scanner so passengers can pay you directly
//               </p>
//             </div>
//             <span className="text-xs font-black uppercase px-3 py-1 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 self-start sm:self-auto">
//               {scanners.length} Scanner{scanners.length !== 1 ? 's' : ''} Active
//             </span>
//           </div>

//           {/* Upload New Scanner Form */}
//           <form onSubmit={handleAddScanner} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
//             <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
//               Add New Scanner
//             </h4>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
//                   Scanner Label (e.g., GPay, PhonePe, Paytm)
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="e.g. Google Pay / HDFC Bank"
//                   value={scannerTitle}
//                   onChange={(e) => setScannerTitle(e.target.value)}
//                   className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
//                   Select QR Code Image
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   ref={fileInputRef}
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current?.click()}
//                   className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition"
//                 >
//                   <Upload size={16} />
//                   <span className="truncate">{selectedFile ? selectedFile.name : 'Choose QR Image'}</span>
//                 </button>
//               </div>
//             </div>

//             {/* Preview & Submit */}
//             {filePreview && (
//               <div className="flex items-center gap-4 pt-2">
//                 <img src={filePreview} alt="Scanner Preview" className="w-16 h-16 rounded-lg object-cover border border-slate-300" />
//                 <span className="text-xs font-bold text-slate-500">Ready to upload</span>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={isUploading}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-3 rounded-xl transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
//             >
//               {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
//               <span>{isUploading ? 'Uploading...' : 'Upload & Add Scanner'}</span>
//             </button>
//           </form>

//           {/* List of Scanners */}
//           {scanners.length === 0 ? (
//             <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
//               <QrCode size={32} className="text-slate-300 mx-auto mb-2" />
//               <p className="text-sm font-bold text-slate-600">No payment scanners added yet</p>
//               <p className="text-xs font-medium text-slate-400">Add a scanner above so passengers can scan and pay easily.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
//               {scanners.map((scanner) => {
//                 const sId = scanner._id || scanner.id;
//                 return (
//                   <div
//                     key={sId}
//                     className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col items-center justify-between space-y-3 relative group"
//                   >
//                     <div className="w-full flex items-center justify-between border-b border-slate-100 pb-2">
//                       <span className="text-xs font-black text-slate-900 truncate">{scanner.title}</span>
//                       <button
//                         onClick={() => handleDeleteScanner(sId)}
//                         className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition"
//                         title="Delete Scanner"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>

//                     <div className="w-32 h-32 bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-center">
//                       <img
//                         src={scanner.imageUrl || scanner.url}
//                         alt={scanner.title}
//                         className="w-full h-full object-contain rounded-lg"
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Trip Breakdown or Blank State */}
//         {isBlankState ? (
//           <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
//             <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mb-6">
//               <TrendingUp size={36} />
//             </div>
//             <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
//               No Earnings Recorded Yet
//             </h3>
//             <p className="text-slate-500 font-medium text-sm max-w-md mb-8 leading-relaxed">
//               You haven't completed any rides as a driver yet. Once passengers book seats on your route and complete the trip, your revenue summary will appear here.
//             </p>
//             <a
//               href="/OfferRide"
//               className="bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition transform active:scale-95 inline-flex items-center gap-2"
//             >
//               <span>Publish Your First Ride</span>
//               <ArrowUpRight size={18} />
//             </a>
//           </div>
//         ) : (
//           <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
//             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//               <h3 className="text-lg font-black text-slate-900">Trip Earnings Breakdown</h3>
//               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
//                 Latest Completed Trips
//               </span>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
//                     <th className="py-4 px-6">Trip ID</th>
//                     <th className="py-4 px-6">Date</th>
//                     <th className="py-4 px-6">Route</th>
//                     <th className="py-4 px-6">Passengers</th>
//                     <th className="py-4 px-6 text-right">Fare Earned</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
//                   {earningsData.rideHistory.map((ride) => (
//                     <tr key={ride.id || ride._id} className="hover:bg-slate-50/50 transition">
//                       <td className="py-4 px-6 font-mono text-slate-500">{ride.id || ride._id}</td>
//                       <td className="py-4 px-6 font-bold text-slate-900">{ride.date}</td>
//                       <td className="py-4 px-6 font-bold text-slate-900">{ride.route}</td>
//                       <td className="py-4 px-6">{ride.passengers} Seat(s)</td>
//                       <td className="py-4 px-6 text-right font-black text-emerald-600">
//                         +₹{ride.fare}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  Car,
  Calendar,
  CreditCard,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { getDriverPayments } from "../../api/driverPaymentApi";

export default function DriverEarnings() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const response = await getDriverPayments();

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setPayments(data);
      setFilteredPayments(data);

    } catch (err) {
      console.error(err);
      setError("Unable to load driver earnings.");
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
  const keyword = search.trim().toLowerCase();

  setFilteredPayments(
    payments.filter((payment) => {

      // If user entered only numbers,
      // search only Payment ID and Ride ID.
      if (/^\d+$/.test(keyword)) {
        return (
          String(payment.paymentId).includes(keyword) ||
          String(payment.rideId).includes(keyword)
        );
      }

      // Otherwise search passenger name.
      return payment.passengerName
        .toLowerCase()
        .includes(keyword);

    })
  );
}, [search, payments]);

  const totalEarnings = useMemo(() => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const totalTrips = payments.length;

  const monthlyEarnings = useMemo(() => {

    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    return payments
      .filter((p) => {

        const d = new Date(p.paymentDate);

        return (
          d.getMonth() === month &&
          d.getFullYear() === year
        );

      })
      .reduce((sum, p) => sum + p.amount, 0);

  }, [payments]);

  const averageFare =
    totalTrips === 0
      ? 0
      : totalEarnings / totalTrips;

      return (
  <div className="min-h-screen bg-slate-100 pt-28 pb-12 px-6">
    <div className="max-w-7xl mx-auto">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">

        <div>

          <h1 className="text-4xl font-black text-slate-900">
            Driver Earnings
          </h1>

          <p className="text-slate-500 mt-2">
            Track all completed ride payments and earnings.
          </p>

        </div>

        <div className="mt-4 lg:mt-0 bg-green-100 text-green-700 px-5 py-3 rounded-xl font-bold flex items-center gap-2">

          <Wallet size={22} />

          Earnings Dashboard

        </div>

      </div>

      {/* ================= LOADING ================= */}

      {loading && (

        <div className="bg-white rounded-3xl p-16 flex justify-center">

          <Loader2
            size={40}
            className="animate-spin text-blue-600"
          />

        </div>

      )}

      {/* ================= ERROR ================= */}

      {!loading && error && (

        <div className="bg-red-100 text-red-700 rounded-2xl p-5 flex items-center gap-3">

          <AlertCircle />

          {error}

        </div>

      )}

      {/* ================= CONTENT ================= */}

      {!loading && !error && (

        <>

          {/* ================= SUMMARY CARDS ================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

            {/* Total Earnings */}

            <div className="bg-white rounded-3xl shadow-sm p-6">

              <div className="flex justify-between">

                <div>

                  <p className="text-slate-400 text-sm font-bold uppercase">
                    Total Earnings
                  </p>

                  <h2 className="text-3xl font-black text-green-600 mt-3">

                    ₹ {totalEarnings.toLocaleString("en-IN")}

                  </h2>

                </div>

                <Wallet
                  size={34}
                  className="text-green-600"
                />

              </div>

            </div>

            {/* Trips */}

            <div className="bg-white rounded-3xl shadow-sm p-6">

              <div className="flex justify-between">

                <div>

                  <p className="text-slate-400 text-sm font-bold uppercase">
                    Completed Trips
                  </p>

                  <h2 className="text-3xl font-black mt-3">

                    {totalTrips}

                  </h2>

                </div>

                <Car
                  size={34}
                  className="text-blue-600"
                />

              </div>

            </div>

            {/* Monthly */}

            <div className="bg-white rounded-3xl shadow-sm p-6">

              <div className="flex justify-between">

                <div>

                  <p className="text-slate-400 text-sm font-bold uppercase">
                    This Month
                  </p>

                  <h2 className="text-3xl font-black mt-3 text-purple-600">

                    ₹ {monthlyEarnings.toLocaleString("en-IN")}

                  </h2>

                </div>

                <Calendar
                  size={34}
                  className="text-purple-600"
                />

              </div>

            </div>

            {/* Average Fare */}

            <div className="bg-white rounded-3xl shadow-sm p-6">

              <div className="flex justify-between">

                <div>

                  <p className="text-slate-400 text-sm font-bold uppercase">
                    Average Fare
                  </p>

                  <h2 className="text-3xl font-black mt-3 text-orange-500">

                    ₹ {averageFare.toFixed(2)}

                  </h2>

                </div>

                <CreditCard
                  size={34}
                  className="text-orange-500"
                />

              </div>

            </div>

          </div>

          {/* ================= SEARCH ================= */}

          <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">

            <div className="relative">

              <Search
                className="absolute left-4 top-3.5 text-slate-400"
                size={20}
              />

              <input
                type="text"
                placeholder="Search by Payment ID, Ride ID or Passenger..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full border rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

          </div>

                    {/* ================= PAYMENT TABLE ================= */}

          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b">

              <h2 className="text-xl font-bold">
                Payment History
              </h2>

            </div>

            {filteredPayments.length === 0 ? (

              <div className="py-16 text-center">

                <CreditCard
                  size={55}
                  className="mx-auto text-slate-300 mb-4"
                />

                <h3 className="text-xl font-bold text-slate-700">
                  No Payments Found
                </h3>

                <p className="text-slate-500 mt-2">
                  No payment matches your search.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="min-w-full">

                  <thead className="bg-slate-100">

                    <tr>

                      <th className="px-6 py-4 text-left">
                        Payment ID
                      </th>

                      <th className="px-6 py-4 text-left">
                        Ride ID
                      </th>

                      <th className="px-6 py-4 text-left">
                        Passenger
                      </th>

                      <th className="px-6 py-4 text-left">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-left">
                        Method
                      </th>

                      <th className="px-6 py-4 text-left">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left">
                        Date
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredPayments.map((payment) => (

                      <tr
                        key={payment.paymentId}
                        className="border-b hover:bg-slate-50"
                      >

                        <td className="px-6 py-4 font-semibold">
                          #{payment.paymentId}
                        </td>

                        <td className="px-6 py-4">
                          {payment.rideId}
                        </td>

                        <td className="px-6 py-4">
                          {payment.passengerName}
                        </td>

                        <td className="px-6 py-4 font-bold text-green-600">
                          ₹ {payment.amount.toLocaleString("en-IN")}
                        </td>

                        <td className="px-6 py-4">

                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">

                            {payment.paymentMethod}

                          </span>

                        </td>

                        <td className="px-6 py-4">

                          {payment.paymentStatus === "SUCCESS" ? (

                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">

                              <CheckCircle size={16} />

                              SUCCESS

                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">

                              <XCircle size={16} />

                              FAILED

                            </span>

                          )}

                        </td>

                        <td className="px-6 py-4">

                          {new Date(
                            payment.paymentDate
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </>

      )}

    </div>

  </div>

);
}