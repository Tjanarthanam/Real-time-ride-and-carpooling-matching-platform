import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logos/logo.png';
import ThemeToggle from '../ThemeToggle';

import {
  LayoutDashboard,
  Search,
  Bookmark,
  Car,
  History,
  Wallet,
  User,
  Headphones,
  LogOut,
  ChevronDown,
  MessageCircle,
  Navigation,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Scroll effect listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Close profile dropdown when page route changes
  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);

  // 3. Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Safety', path: '/safety' },
    { name: 'Contact Us', path: '/support' },
  ];

  // Check login status & read role with lowercase normalization
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const rawRole = localStorage.getItem('role') || 'passenger';
  const userRole = rawRole.toString().toLowerCase().trim(); // 'driver', 'passenger', or 'admin'

  // Dynamic menu configurations for Driver vs Passenger vs Admin
  const driverMenuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/driver/dashboard" },
    { label: "Offer Ride", icon: Car, path: "/offerRide" },
    { label: "Messages", icon: MessageCircle, path: "/chat" },
    { label: "Ride History", icon: History, path: "/driver/ride-history" },
    { label: "Payment History", icon: Wallet, path: "/driver/payment-history" },
    { label: "Track Ride", icon: Navigation, path: "/track" },
    { label: "Profile", icon: User, path: "/driver/profile" },
    { label: "Support", icon: Headphones, path: "/support" },
  ];

  const passengerMenuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/passenger/dashboard" },
    { label: "Search Ride", icon: Search, path: "/searchride" },
    { label: "Messages", icon: MessageCircle, path: "/chat" },
    { label: "Payment History", icon: Wallet, path: "/passenger/payment-history" },
    { label: "Track Ride", icon: Navigation, path: "/track" },
    { label: "Profile", icon: User, path: "/passenger/profile" },
    { label: "Support", icon: Headphones, path: "/support" },
  ];

  const adminMenuItems = [
    { label: "Admin Portal", icon: ShieldCheck, path: "/admin" },
    { label: "Support", icon: Headphones, path: "/support" },
  ];

  // Select the appropriate menu items based on the active role
  const profileMenuItems =
    userRole === 'admin'
      ? adminMenuItems
      : userRole === 'driver'
      ? driverMenuItems
      : passengerMenuItems;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsProfileOpen(false);
    window.location.href = '/signin';
  };

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 border-b border-slate-800 shadow-xl py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="w-full mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex justify-between items-center h-20">

          {/* Logo Brand Container */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="block">
              <img
                src={logoImg}
                alt="RideTogether Logo"
                className="h-[64px] sm:h-[72px] w-auto object-contain select-none"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.parentNode.innerHTML = `
                    <span class="font-black text-3xl tracking-tighter italic ${isScrolled ? 'text-white' : 'text-slate-900'}">
                      Ride<span class="text-blue-600">Together</span>
                    </span>
                  `;
                }}
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-10 items-center">
            {navLinks.map(({ name, path }) => {
              const isInternalRoute = path.startsWith('/');
              const LinkComponent = isInternalRoute ? Link : 'a';
              const linkProps = isInternalRoute ? { to: path } : { href: path };

              return (
                <LinkComponent
                  key={name}
                  {...linkProps}
                  className="relative font-bold text-lg py-2 transition-colors duration-150 group"
                >
                  <span className={`transition-colors duration-150 ${
                    isScrolled ? 'text-slate-200 hover:text-white' : 'text-slate-900 hover:text-blue-600'
                  } ${!isScrolled && 'drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]'}`}>
                    {name}
                  </span>
                  <span className={`absolute bottom-[-2px] left-0 w-full h-[3px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out ${
                    isScrolled ? 'bg-white' : 'bg-blue-600'
                  }`} />
                </LinkComponent>
              );
            })}
            {userRole === 'admin' && (
              <Link
                to="/admin"
                className="relative font-extrabold text-lg py-2 text-purple-600 hover:text-purple-500 transition-colors"
              >
                Admin Portal
              </Link>
            )}
          </div>

          {/* Auth / Profile Dropdown Section */}
          <div className="flex items-center space-x-6">
            <ThemeToggle isScrolled={isScrolled} />
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                {/* Profile Trigger Button */}
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className={`flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl text-base shadow-md transition duration-200 transform active:scale-95 cursor-pointer ${
                    isScrolled
                      ? 'bg-white text-slate-900 hover:bg-slate-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <User size={20} />
                  <span className="hidden sm:inline capitalize">
                    {userRole === 'admin' ? 'Admin Account' : userRole === 'driver' ? 'Driver Account' : 'Passenger Account'}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    
                    {/* Header showing Active Role */}
                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Account Type</span>
                      <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        userRole === 'admin' ? 'bg-purple-100 text-purple-800' :
                        userRole === 'driver' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {userRole}
                      </span>
                    </div>

                    {/* Links */}
                    <div className="py-2">
                      {profileMenuItems.map(({ label, icon: Icon, path }) => (
                        <Link
                          key={label}
                          to={path}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-slate-700 font-semibold hover:bg-slate-50 hover:text-blue-600 transition-colors duration-150"
                        >
                          <Icon size={18} />
                          <span>{label}</span>
                        </Link>
                      ))}

                      <div className="my-1 border-t border-slate-100" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-rose-600 font-semibold hover:bg-rose-50 transition-colors duration-150 cursor-pointer text-left"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/signin"
                  className={`font-bold text-lg transition duration-150 ${
                    isScrolled ? 'text-slate-300 hover:text-white' : 'text-slate-900 hover:text-blue-700'
                  } ${!isScrolled && 'drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]'}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className={`font-bold px-6 py-2.5 rounded-xl text-base shadow-md transition duration-200 transform active:scale-95 ${
                    isScrolled
                      ? 'bg-white text-slate-900 hover:bg-slate-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}