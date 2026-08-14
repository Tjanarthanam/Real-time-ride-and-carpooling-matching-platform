import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../../api/authApi';

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  // Tracking the workflow step: 'email' or 'reset'
  const [step, setStep] = useState('email'); 
  
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // STEP 1: Requesting Reset Token OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await forgotPassword(email);

      // On success, advance layout window step
      setMessage({ type: 'success', text: 'A secure 6-digit verification code was sent to your email.' });
      setStep('reset');
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data;
      setMessage({ type: 'error', text: typeof backendMessage === 'string' ? backendMessage : 'Something went wrong. Please check your email address.' });
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verifying OTP and updating Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      setLoading(false);
      return;
    }

    try {
      await resetPassword(email, formData.otp, formData.newPassword);
      
      setMessage({ type: 'success', text: 'Password reset successful! Redirecting to login...' });
      
      // Take them to login panel after short delay
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data;
      setMessage({ type: 'error', text: typeof backendMessage === 'string' ? backendMessage : 'Invalid or expired OTP token.' });
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] font-sans flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-3xl p-8 md:p-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Block */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">
            {step === 'email' ? 'Forgot password?' : 'Reset password'}
          </h2>
          <p className="text-sm font-semibold text-slate-400 mt-2 leading-relaxed">
            {step === 'email' 
              ? "No worries, enter your email and we'll send you an OTP to reset your credentials." 
              : `Enter the code sent to ${email} to secure your profile.`
            }
          </p>
        </div>

        {/* Global Feedback Banner Notification Messaging */}
        {message.text && (
          <div className={`p-4 rounded-xl text-xs font-bold mb-6 animate-in fade-in duration-150 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
          }`}>
            {message.text}
          </div>
        )}

        {/* ========================================== */}
        {/* STEP 1: REQUESTING LINK / CODE FORM */}
        {/* ========================================== */}
        {step === 'email' ? (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div className="flex flex-col">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 17.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition shadow-lg shadow-blue-600/10 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                'Send Verification Code'
              )}
            </button>
          </form>
        ) : (
          /* ========================================== */
          /* STEP 2: VERIFY OTP AND CHANGE CREDS FORM */
          /* ========================================== */
          <form onSubmit={handleResetPassword} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
            {/* OTP Token Block */}
            <div className="flex flex-col">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">6-Digit OTP</label>
              <input
                type="text"
                name="otp"
                required
                maxLength="6"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder="000000"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-3.5 px-4 text-center text-xl font-black tracking-widest text-slate-900 placeholder-slate-300 outline-none transition"
              />
            </div>

            {/* New Password Input Box */}
            <div className="flex flex-col">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                required
                minLength="6"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none transition"
              />
            </div>

            {/* Confirm Password Input Box */}
            <div className="flex flex-col">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black py-4 rounded-xl transition shadow-lg shadow-slate-950/10 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        )}

        {/* Back navigation footer shortcuts */}
        <div className="text-center mt-8 pt-4 border-t border-slate-100">
          <Link to="/login" className="text-xs font-black text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to login portal
          </Link>
        </div>

      </div>
    </div>
  );
}