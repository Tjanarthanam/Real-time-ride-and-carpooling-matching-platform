import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

// Where to send an already-signed-in user who tries to open a page that
// isn't meant for their role (e.g. a passenger opening /offerRide).
const roleHomePath = (role) => {
  switch (role) {
    case "driver":
      return "/driver/dashboard";
    case "admin":
      return "/admin";
    default:
      return "/passenger/dashboard";
  }
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toString().toLowerCase().trim();

  // Not signed in at all - instead of silently rendering the protected page
  // (previous behaviour) or bouncing straight to /signin, show a small
  // choice screen so the visitor can pick Sign In or Sign Up.
  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-sm p-8 text-center space-y-6">
          <h2 className="text-2xl font-black text-slate-900">Sign in to continue</h2>
          <p className="text-slate-500 font-medium text-sm">
            You need an account to access this page. Sign in if you already have one, or create a new account to get started.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/signin"
              state={{ from: location }}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              <LogIn size={18} /> Sign In
            </Link>
            <Link
              to="/signup"
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl transition-colors"
            >
              <UserPlus size={18} /> Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Signed in, but this page isn't meant for their role - send them to
  // their own dashboard instead of showing them someone else's page.
  if (allowedRoles.length > 0 && !allowedRoles.map((r) => r.toLowerCase()).includes(role)) {
    return <Navigate to={roleHomePath(role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
