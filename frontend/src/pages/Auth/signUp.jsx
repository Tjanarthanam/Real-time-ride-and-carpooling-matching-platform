import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosClient';
import { sendOtp, verifyOtp } from '../../api/authApi';

// Validation rules shared by the form fields below.
const NAME_REGEX = /^[A-Za-z][A-Za-z .'-]{1,49}$/; // 2-50 letters, spaces, apostrophes, hyphens
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=]).{8,}$/; // strong password
const LICENSE_REGEX = /^[A-Za-z]{2}[A-Za-z0-9-]{4,13}$/; // e.g. DL0420231234567 - 2 letters + 6-15 chars total
const VEHICLE_MODEL_REGEX = /^[A-Za-z0-9 .-]{3,50}$/;

export default function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState('passenger');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    gender: 'Male',
    password: '',
    // Driver-specific fields
    licenseNumber: '',
    vehicleModel: '',
    vehicleNumber: '',
    totalSeats: '4', 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Signup workflow step: fill the form, then verify the email OTP that was
  // sent automatically when the account was created.
  const [step, setStep] = useState('form'); // 'form' | 'verify'
  const [otp, setOtp] = useState('');
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Mobile number: digits only, capped at 10 characters as the backend requires.
    if (name === 'mobileNumber') {
      setFormData({ ...formData, mobileNumber: value.replace(/\D/g, '').slice(0, 10) });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // Client-side validation mirroring the backend's rules, so users get
  // instant feedback instead of a round-trip error.
  const validate = () => {
    if (!NAME_REGEX.test(formData.fullName.trim())) {
      return 'Full name should be 2-50 letters and may include spaces, apostrophes or hyphens.';
    }
    if (!EMAIL_REGEX.test(formData.email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (formData.mobileNumber.replace(/\D/g, '').length !== 10) {
      return 'Mobile number must be exactly 10 digits.';
    }
    if (!PASSWORD_REGEX.test(formData.password)) {
      return 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character.';
    }
    if (role === 'driver') {
      if (!LICENSE_REGEX.test(formData.licenseNumber.trim())) {
        return 'Driving License ID must start with 2 letters, followed by 4-13 letters/numbers (e.g. DL0420231234567).';
      }
      if (!VEHICLE_MODEL_REGEX.test(formData.vehicleModel.trim())) {
        return 'Vehicle model must be 3-50 characters (letters, numbers and spaces).';
      }
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    // Backend requires the phone number as exactly 10 digits
    const cleanedPhone = formData.mobileNumber.replace(/\D/g, '').slice(-10);

    const payload = {
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: cleanedPhone,
      gender: formData.gender,
      password: formData.password,
      role: role.toUpperCase(),
      licenseNumber: role === 'driver' ? formData.licenseNumber.trim() : undefined,
      vehicleInfo: role === 'driver' ? `${formData.vehicleModel.trim()} (${formData.totalSeats} seats)` : undefined,
      vehicleNumber: role === 'driver' ? formData.vehicleNumber.trim() : undefined,
    };

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/auth/register', payload);

      // Backend returns a plain string; "Email already exists" is a handled
      // business case, not an HTTP error, so we need to check the text.
      if (response.data === 'Email already exists') {
        setErrorMessage('An account with this email already exists.');
        return;
      }

      // Registration triggers a welcome/verification OTP email automatically
      // (see AuthController#register) - move to the verify-email step instead
      // of signing in right away.
      setSuccessMessage(`Account created! We sent a 6-digit code to ${payload.email}.`);
      setStep('verify');
    } catch (error) {
      if (error.response?.data) {
        // Validation errors from @Valid come back as a field->message map
        const data = error.response.data;
        const message = typeof data === 'string'
          ? data
          : Object.values(data).join(' ');
        setErrorMessage(message || 'Registration failed. Please check your details.');
      } else if (error.request) {
        setErrorMessage('Could not reach the server. Is the backend running on port 8081?');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setOtpSubmitting(true);
    try {
      await verifyOtp(formData.email.trim(), otp.trim());
      setSuccessMessage('Email verified! Redirecting to sign in...');
      setTimeout(() => navigate('/signin'), 1500);
    } catch (error) {
      const data = error.response?.data;
      const message = typeof data === 'string' ? data : data?.message;
      setErrorMessage(message || 'Invalid or expired code. Please try again.');
    } finally {
      setOtpSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setResending(true);
    try {
      await sendOtp(formData.email.trim());
      setSuccessMessage('A new code has been sent to your email.');
    } catch (error) {
      const data = error.response?.data;
      const message = typeof data === 'string' ? data : data?.message;
      setErrorMessage(message || 'Could not resend the code. Please try again shortly.');
    } finally {
      setResending(false);
    }
  };

  return (
    /* UNIVERSAL SPACING: This viewport calculation guarantees identical margin rules and comfort room from the header for both Passenger and Driver modes */
    <div className="w-full min-h-[calc(144vh-80px)] flex items-center justify-center bg-slate-50/70 px-4 py-16 font-sans selection:bg-blue-500/10">
      
      {/* MATCHING CARD WRAPPER: Fixed width parameter preserved for both roles */}
      <div className="w-full max-w-[640px] bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-8 md:p-10 transition-all duration-300">
        
        {/* HEADING SECTION */}
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Your <span className="text-blue-600 font-extrabold">Account</span>
          </h1>
        </div>

        {/* ROLE SWITCH PILL */}
        {step === 'form' && (
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.321-5.028a3.75 3.75 0 0 0-3.69-3.513H7.072a3.75 3.75 0 0 0-3.69 3.513l-.321 5.028a1.125 1.125 0 0 0 1.09 1.124H6.375m11.75-4.5H3.75m16.5-3H3.75m16.5 3v-2.25A2.25 2.25 0 0 0 18 6.375H6A2.25 2.25 0 0 0 3.75 8.625V10.5" />
            </svg>
            Driver
          </button>
        </div>
        )}

        {/* FEEDBACK BANNERS */}
        {errorMessage && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
            {successMessage}
          </div>
        )}

        {/* REGISTRATION FORM */}
        {step === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm shadow-sm"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
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
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm shadow-sm"
              />
            </div>
          </div>

          {/* Mobile Number & Gender Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mobile Number</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="mobileNumber"
                  required
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm shadow-sm"
                />
              </div>
            </div>

            {/* Gender Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gender</label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm shadow-sm appearance-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC DRIVER SECURITY & SEAT SECTION */}
          {role === 'driver' && (
            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200/60">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Security & Vehicle Specifications</span>
              </div>

              {/* Driving License Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Driving License ID</label>
                <input
                  type="text"
                  name="licenseNumber"
                  required={role === 'driver'}
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="DL-XXXXXXXXXXXXX"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all text-sm shadow-sm"
                />
                <p className="text-[10px] text-slate-400 font-medium">Must start with 2 letters, e.g. DL0420231234567</p>
              </div>

              {/* Vehicle Number Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Vehicle Number</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  required={role === 'driver'}
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. KA-01-AB-1234"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all text-sm shadow-sm"
                />
              </div>

              {/* Grid Box for Vehicle Model & Available Seats Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Vehicle Model</label>
                  <input
                    type="text"
                    name="vehicleModel"
                    required={role === 'driver'}
                    value={formData.vehicleModel}
                    onChange={handleInputChange}
                    placeholder="Toyota Camry"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all text-sm shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Offer Seat Capacity</label>
                  <div className="relative">
                    <select
                      name="totalSeats"
                      value={formData.totalSeats}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition-all text-sm shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="1">1 Passenger Seat</option>
                      <option value="2">2 Passenger Seats</option>
                      <option value="3">3 Passenger Seats</option>
                      <option value="4">4 Passenger Seats</option>
                      <option value="5">5+ Passenger Seats</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
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
            <p className="text-[10px] text-slate-400 font-medium">
              At least 8 characters, with an uppercase letter, a lowercase letter, a number and a special character.
            </p>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md shadow-blue-600/10 transition duration-200 flex items-center justify-center gap-2 text-sm tracking-wide"
          >
            {isSubmitting ? 'Creating Account...' : `Register as ${role === 'passenger' ? 'Passenger' : 'Driver'}`}
          </button>
        </form>
        )}

        {/* EMAIL OTP VERIFICATION STEP */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-slate-500 font-medium text-center -mt-2 mb-2">
              Enter the 6-digit code sent to <span className="font-bold text-slate-700">{formData.email}</span> to verify your account.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">6-Digit Code</label>
              <input
                type="text"
                inputMode="numeric"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-center text-xl tracking-widest text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={otpSubmitting || otp.length !== 6}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md shadow-blue-600/10 transition duration-200 flex items-center justify-center gap-2 text-sm tracking-wide"
            >
              {otpSubmitting ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="flex items-center justify-between text-xs font-semibold pt-1">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className="text-blue-600 hover:text-blue-700 disabled:text-slate-300 transition-colors"
              >
                {resending ? 'Resending...' : 'Resend code'}
              </button>
              <Link to="/signin" className="text-slate-400 hover:text-slate-600 transition-colors">
                Verify later &amp; sign in
              </Link>
            </div>
          </form>
        )}

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 font-medium text-xs md:text-sm">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors ml-1">Sign In</Link>
          </p>
        </div>

      </div>
    </div>
  );
}