import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosClient';
import ForgotPassword from './ForgotPassword';


export default function SignIn() {

  const navigate = useNavigate();
  const [role, setRole] = useState('passenger');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (location.hash === '#forgot') {
    return <ForgotPassword />;
  }
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/auth/login', {
        email: formData.email,
        password: formData.password,
        role: role.toUpperCase(),
      });

      const { token, role: userRole, email } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('userName', email ? email.split('@')[0] : '');

      navigate(userRole === 'DRIVER' ? '/offerRide' : '/SearchRide');
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.request) {
        setErrorMessage('Could not reach the server. Is the backend running on port 8081?');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    // This padding-top ensures the card sits comfortably below your header navbar
    <div className="w-full min-h-[calc(120vh-80px)] flex items-center justify-center bg-slate-50/70 px-4 py-16 font-sans selection:bg-blue-500/10">
      
      {/* WIDER, CLEAN PROFESSIONAL CARD WRAPPER */}
      <div className="w-full max-w-[640px] bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-8 md:p-10 transition-all duration-300">
        
        {/* HEADING SECTION */}
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sign In to Your <span className="text-blue-600 font-extrabold">Account</span>
          </h1>
        </div>

        {/* REFINED TOGGLE SWITCHER PILL */}
        <div className="w-full bg-slate-100 p-1.5 rounded-xl flex border border-slate-200/40 mb-6">
          <button
            type="button"
            onClick={() => setRole('passenger')}
            className={`w-1/2 py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              role === 'passenger'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {/* SVG Passenger Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            Passenger
          </button>
          <button
            type="button"
            onClick={() => setRole('driver')}
            className={`w-1/2 py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              role === 'driver'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {/* SVG Driver/Car Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.321-5.028a3.75 3.75 0 0 0-3.69-3.513H7.072a3.75 3.75 0 0 0-3.69 3.513l-.321 5.028a1.125 1.125 0 0 0 1.09 1.124H6.375m11.75-4.5H3.75m16.5-3H3.75m16.5 3v-2.25A2.25 2.25 0 0 0 18 6.375H6A2.25 2.25 0 0 0 3.75 8.625V10.5" />
            </svg>
            Driver
          </button>
        </div>

        {/* FEEDBACK BANNER */}
        {errorMessage && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {/* INPUT FORM FIELDS */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {/* Email SVG Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@company.com"
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm shadow-sm"
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <a href="#forgot" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</a>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {/* Lock SVG Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-800 focus:outline-none select-none transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md shadow-blue-600/10 transition duration-200 flex items-center justify-center gap-2 text-sm tracking-wide"
          >
            {isSubmitting ? 'Signing In...' : `Sign In as ${role === 'passenger' ? 'Passenger' : 'Driver'}`}
          </button>
        </form>

        {/* Signup Route Footer Links */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 font-medium text-xs md:text-sm">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors ml-1">Sign Up</Link>
          </p>
        </div>

      </div>
    </div>
  );
}