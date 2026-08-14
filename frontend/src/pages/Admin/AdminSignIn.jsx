import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const loginPayload = {
      email: email.trim(),
      password: password,
      role: 'ADMIN'
    };

    try {
      let response;
      try {
        response = await axios.post('http://localhost:8081/api/auth/login', loginPayload);
      } catch (firstErr) {
        if (firstErr.response && (firstErr.response.status === 404 || firstErr.response.status === 405)) {
          response = await axios.post('http://localhost:8081/api/auth/signin', loginPayload);
        } else {
          throw firstErr;
        }
      }

      const data = response.data;
      const token = data.token || data.jwt || data.accessToken;
      const userRole = data.role || data.user?.role || 'ADMIN';

      if (userRole !== 'ADMIN') {
        setError('Access Denied: This account does not have Administrator privileges.');
        setLoading(false);
        return;
      }

      localStorage.clear();
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'ADMIN');
      localStorage.setItem('user', JSON.stringify(data.user || { email, role: 'ADMIN', name: 'System Admin' }));

      window.location.href = '/admin';
    } catch (err) {
      console.error('Admin Login Error:', err);
      if (err.response) {
        const status = err.response.status;
        if (status === 400 || status === 401 || status === 404) {
          setError('Invalid email or password. Please check your credentials.');
        } else {
          setError('Login failed. Please verify your credentials and try again.');
        }
      } else {
        setError('Failed to connect to backend server. Make sure Spring Boot is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-100 p-4 pt-20">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-lg">
        <div className="text-center mb-6">
          <span className="bg-purple-100 text-purple-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            System Control
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-3">Admin Portal Login</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Authorized Personnel Only
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3.5 rounded-xl mb-4 text-center break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@carpooling.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-600 pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded focus:outline-none"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition shadow-md text-sm mt-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}