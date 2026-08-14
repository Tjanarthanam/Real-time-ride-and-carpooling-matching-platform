import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import SignIn from "./pages/Auth/signIn";
import SignUp from "./pages/Auth/signUp";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import SearchRide from "./pages/Passenger/SearchRide";
import Dashboard from "./pages/Passenger/Dashboard";
import PaymentHistory from "./pages/Passenger/PaymentHistory";
import PassengerProfile from "./pages/Passenger/PassengerProfile";

import OfferRide from "./pages/Driver/OfferRide";
import DDashboard from "./pages/Driver/DDashboard";
import DriverRideHistory from "./pages/Driver/DriverRideHistory";
import DriverEarnings from "./pages/Driver/DriverEarnings";
import DriverProfile from "./pages/Driver/DriverProfile";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminSignIn from "./pages/Admin/AdminSignin";

import Chat from "./pages/Chat/Chat";
import Support from "./pages/Support";

import TrackRidesHub from "./pages/Track/TrackRidesHub";
import LiveTrackingMap from "./pages/Track/LiveTrackingMap";
import SOSButton from "./components/Safety/SOSButton";
import AboutUs from "./pages/AboutUs";
import Safety from "./pages/Safety";

export default function App() {
  return (
    <Router>
      <div className="w-full min-h-screen flex flex-col bg-[#F8FAFC] font-sans antialiased">

        {/* Global Navbar */}
        <Navbar />

        <div className="flex-1">
          <Routes>

            {/* ================= PUBLIC ROUTES ================= */}

            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin/signin" element={<AdminSignIn />} />
            <Route path="/admin/login" element={<AdminSignIn />} />
            <Route path="/support" element={<Support />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/safety" element={<Safety />} />

            {/* ================= PASSENGER ROUTES ================= */}

            <Route
              path="/searchride"
              element={
                <ProtectedRoute allowedRoles={["PASSENGER", "DRIVER"]}>
                  <SearchRide />
                </ProtectedRoute>
              }
            />

            <Route
              path="/passenger/dashboard"
              element={
                <ProtectedRoute allowedRoles={["PASSENGER"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/passenger/payment-history"
              element={
                <ProtectedRoute allowedRoles={["PASSENGER"]}>
                  <PaymentHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/passenger/profile"
              element={
                <ProtectedRoute allowedRoles={["PASSENGER"]}>
                  <PassengerProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["PASSENGER", "DRIVER"]}>
                  <PassengerProfile />
                </ProtectedRoute>
              }
            />

            {/* ================= DRIVER ROUTES ================= */}

            <Route
              path="/driver/dashboard"
              element={
                <ProtectedRoute allowedRoles={["DRIVER"]}>
                  <DDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/offerRide"
              element={
                <ProtectedRoute allowedRoles={["DRIVER"]}>
                  <OfferRide />
                </ProtectedRoute>
              }
            />

            <Route
              path="/driver/profile"
              element={
                <ProtectedRoute allowedRoles={["DRIVER"]}>
                  <DriverProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/driver/ride-history"
              element={
                <ProtectedRoute allowedRoles={["DRIVER"]}>
                  <DriverRideHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/driver/payment-history"
              element={
                <ProtectedRoute allowedRoles={["DRIVER"]}>
                  <DriverEarnings />
                </ProtectedRoute>
              }
            />

            {/* ================= ADMIN ROUTES ================= */}

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* ================= LIVE TRACKING ================= */}

            <Route
              path="/track"
              element={
                <ProtectedRoute allowedRoles={["PASSENGER", "DRIVER"]}>
                  <TrackRidesHub />
                </ProtectedRoute>
              }
            />

            <Route
              path="/track/:rideId"
              element={
                <ProtectedRoute allowedRoles={["PASSENGER", "DRIVER"]}>
                  <LiveTrackingMap />
                </ProtectedRoute>
              }
            />

            {/* ================= CHAT ================= */}

            <Route
              path="/chat"
              element={
                <ProtectedRoute allowedRoles={["PASSENGER", "DRIVER"]}>
                  <Chat />
                </ProtectedRoute>
              }
            />

            {/* ================= FALLBACK ================= */}

            <Route path="*" element={<Landing />} />

          </Routes>
        </div>

        {/* Floating emergency SOS button */}
        <SOSButton />

      </div>
    </Router>
  );
}