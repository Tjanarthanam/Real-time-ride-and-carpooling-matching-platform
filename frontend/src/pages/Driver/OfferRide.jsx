import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { offerRide } from '../../api/rideApi';
import { findRoutes, FARE_PER_KM } from '../../api/routingApi';
import LocationAutocomplete from '../../components/LocationAutocomplete';

// Renders the candidate routes on a Leaflet map (loaded via CDN in index.html).
// Leaflet isn't an npm dependency here, so we read it off `window.L`.
function RouteMap({ routes, selectedIndex }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    let cancelled = false;

    function waitForLeaflet(attempt = 0) {
      if (cancelled) return;
      if (window.L) {
        initMap();
        return;
      }
      if (attempt > 50) return; // ~5s — Leaflet script failed to load
      setTimeout(() => waitForLeaflet(attempt + 1), 100);
    }

    function initMap() {
      if (!containerRef.current || mapRef.current) return;
      mapRef.current = window.L.map(containerRef.current);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
      drawRoutes();
    }

    waitForLeaflet();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function drawRoutes() {
    if (!mapRef.current || !window.L) return;
    layersRef.current.forEach((layer) => mapRef.current.removeLayer(layer));
    layersRef.current = [];

    routes.forEach((route, i) => {
      const isSelected = i === selectedIndex;
      const line = window.L.polyline(route.coordinates, {
        color: isSelected ? '#2563eb' : '#94a3b8',
        weight: isSelected ? 5 : 3,
        opacity: isSelected ? 1 : 0.6,
      }).addTo(mapRef.current);
      layersRef.current.push(line);
    });

    const startMarker = window.L.marker(routes[0].coordinates[0]).addTo(mapRef.current);
    const endMarker = window.L.marker(routes[0].coordinates[routes[0].coordinates.length - 1]).addTo(mapRef.current);
    layersRef.current.push(startMarker, endMarker);

    const bounds = window.L.latLngBounds(routes.flatMap((r) => r.coordinates));
    mapRef.current.fitBounds(bounds, { padding: [30, 30] });
  }

  // Redraw whenever the selected route changes (map already initialized)
  useEffect(() => {
    if (mapRef.current) drawRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, routes]);

  return <div ref={containerRef} className="w-full h-full min-h-[320px]" />;
}

export default function OfferRide() {
  // 1. Auth Status Check (Checks if user token exists in localStorage)
  const isLoggedIn = !!localStorage.getItem('token');

  // Form states with pickup, drop, date, seats capacity
  const [routeParams, setRouteParams] = useState({
    pickup: '',
    drop: '',
    date: new Date().toISOString().split('T')[0], // Defaults to today's date (YYYY-MM-DD)
    time: '09:00',
    genderPreference: 'ANY', // 'ANY' | 'FEMALE_ONLY'
    seats: 1,
  });

  const TIME_PRESETS = ['08:00', '09:30', '17:00', '18:30'];

  const formatTimeLabel = (t) => {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
  };

  const [step, setStep] = useState('form'); // 'form' | 'routes'
  const [isFindingRoutes, setIsFindingRoutes] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [routeOptions, setRouteOptions] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  const [isPublishing, setIsPublishing] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null); // { type: 'success' | 'error', text }

  const handleInputChange = (e) => {
    setRouteParams({ ...routeParams, [e.target.name]: e.target.value });
  };

  // Passenger seat count increment/decrement handler
  const handleSeatChange = (delta) => {
    setRouteParams((prev) => ({
      ...prev,
      seats: Math.max(1, Math.min(8, prev.seats + delta)) // Keeps seats between 1 and 8
    }));
  };

  // Step 1 -> geocode both locations and fetch route options between them
  const handleFindRoutes = async (e) => {
    e.preventDefault();
    if (!routeParams.pickup || !routeParams.drop || !routeParams.date) return;

    setIsFindingRoutes(true);
    setRouteError('');
    try {
      const { routes } = await findRoutes(routeParams.pickup, routeParams.drop);

      setRouteOptions(routes);
      setSelectedRouteIndex(0);
      setStep('routes');
    } catch (error) {
      setRouteError(error.message || 'Could not find routes between those locations.');
    } finally {
      setIsFindingRoutes(false);
    }
  };

  // Step 2 -> publish the ride using the selected route's auto-calculated fare
  const handlePublishRide = async () => {
    const selectedRoute = routeOptions[selectedRouteIndex];
    if (!selectedRoute) return;

    setIsPublishing(true);
    setSubmitMessage(null);
    try {
      const response = await offerRide({
        source: routeParams.pickup,
        destination: routeParams.drop,
        travelDate: routeParams.date,
        travelTime: routeParams.time,
        genderPreference: routeParams.genderPreference,
        availableSeats: Number(routeParams.seats),
        fare: selectedRoute.fare,
      });
      setSubmitMessage({ type: 'success', text: response.data });
      setRouteParams((prev) => ({ ...prev, pickup: '', drop: '' }));
      setStep('form');
      setRouteOptions([]);
    } catch (error) {
      const text = error.response?.data || 'Could not publish this ride. Please try again.';
      setSubmitMessage({ type: 'error', text });
    } finally {
      setIsPublishing(false);
    }
  };

  // ==========================================
  // VIEW 1: NOT LOGGED IN - REGISTRATION WALL
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.04)] rounded-3xl p-8 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight mb-3">Become a Driver</h2>
          <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
            You need to create a driver account or login to list dynamic route trip paths and share empty transit seats.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/signup" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-600/10 transition block text-center">
              Register Now
            </Link>
            <Link to="/signin" className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-4 rounded-xl transition block text-center">
              Sign In to Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ROUTE SELECTION SPLIT SCREEN
  // ==========================================
  if (step === 'routes') {
    const selectedRoute = routeOptions[selectedRouteIndex];
    return (
      <div className="w-full min-h-screen bg-white flex flex-col pt-20 animate-in fade-in duration-300">
        {/* Top Control Sticky Sub-Bar */}
        <div className="w-full border-b border-slate-200 bg-slate-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase text-blue-600 tracking-widest block">Selected Path & Trip Info</span>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              {routeParams.pickup} <span className="text-slate-400 font-normal">→</span> {routeParams.drop}
            </h2>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              📅 Date: <span className="text-slate-900">{routeParams.date}</span> &nbsp;|&nbsp; 👥 Seats Offered: <span className="text-slate-900">{routeParams.seats} passenger seat(s)</span>
            </p>
          </div>
          <button
            onClick={() => setStep('form')}
            className="text-sm font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-4 py-2 rounded-xl transition shadow-sm"
          >
            Change Details
          </button>
        </div>

        {/* Dynamic Split Frame View */}
        <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

          {/* Left Column: Route options with auto-calculated fare */}
          <div className="lg:col-span-5 border-r border-slate-200 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            <h3 className="text-md font-black text-slate-900 tracking-tight uppercase mb-2">Select a Route</h3>
            <p className="text-xs text-slate-400 font-medium -mt-2 mb-2">
              Fare is calculated automatically at ₹{FARE_PER_KM} per km based on the route distance.
            </p>

            {routeOptions.map((route, i) => (
              <div
                key={i}
                onClick={() => setSelectedRouteIndex(i)}
                className={`p-5 bg-white border-2 rounded-2xl cursor-pointer transition-all ${
                  selectedRouteIndex === i
                    ? "border-blue-600 ring-2 ring-blue-600/5 shadow-md"
                    : "border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-black text-slate-900 text-base">
                    {i === 0 ? 'Fastest Route' : `Alternative Route ${i}`}
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                    ₹{route.fare}/seat
                  </span>
                </div>
                <div className="flex gap-4 text-xs font-black text-slate-700">
                  <span className="flex items-center gap-1"><span className="text-slate-400 font-normal">Time:</span> {Math.round(route.durationMin)} min</span>
                  <span className="flex items-center gap-1"><span className="text-slate-400 font-normal">Distance:</span> {route.distanceKm.toFixed(1)} km</span>
                </div>
              </div>
            ))}

            {submitMessage && submitMessage.type === 'error' && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                {submitMessage.text}
              </div>
            )}

            <button
              onClick={handlePublishRide}
              disabled={isPublishing || !selectedRoute}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black py-4 rounded-xl transition shadow-lg shadow-blue-600/10 mt-6 active:scale-[0.98]"
            >
              {isPublishing ? 'Publishing…' : `Confirm & Publish Ride — ₹${selectedRoute?.fare ?? 0}/seat`}
            </button>
          </div>

          {/* Right Column: Real route map (Leaflet + OpenStreetMap, no API key needed) */}
          <div className="lg:col-span-7 bg-slate-100 min-h-[400px] lg:min-h-0 relative">
            <RouteMap routes={routeOptions} selectedIndex={selectedRouteIndex} />
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: LOGGED IN - FORM ENTRY POINT
  // ==========================================
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-6 pt-24 pb-12">
      <div className="w-full max-w-xl bg-white border-2 border-slate-200/90 shadow-[0_15px_45px_rgba(0,0,0,0.03)] rounded-3xl p-8 md:p-10">

        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">Offer a ride</h2>
          <p className="text-sm font-semibold text-slate-400 mt-1">Specify your route and trip schedule to match travelers</p>
        </div>

        {submitMessage && submitMessage.type === 'success' && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm font-medium bg-emerald-50 border border-emerald-200 text-emerald-700">
            {submitMessage.text}
          </div>
        )}

        {routeError && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 border border-red-200 text-red-700">
            {routeError}
          </div>
        )}

        <form onSubmit={handleFindRoutes} className="space-y-6">
          {/* PICK-UP FIELD */}
          <div className="flex flex-col">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Pick-up Location</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <LocationAutocomplete
                name="pickup"
                value={routeParams.pickup}
                onChange={(val) => setRouteParams({ ...routeParams, pickup: val })}
                placeholder="Enter city, terminal address, or station"
                inputClassName="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-4 pl-12 pr-4 text-base font-bold text-slate-900 placeholder-slate-400 outline-none transition"
              />
            </div>
          </div>

          {/* DROP FIELD */}
          <div className="flex flex-col">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Drop Location</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <LocationAutocomplete
                name="drop"
                value={routeParams.drop}
                onChange={(val) => setRouteParams({ ...routeParams, drop: val })}
                placeholder="Enter destination terminal address, or city"
                inputClassName="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-4 pl-12 pr-4 text-base font-bold text-slate-900 placeholder-slate-400 outline-none transition"
              />
            </div>
          </div>

          {/* PASSENGER PREFERENCE */}
          <div className="flex flex-col">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Passenger Preference</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRouteParams({ ...routeParams, genderPreference: 'ANY' })}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm transition ${
                  routeParams.genderPreference === 'ANY'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                Any Rider
              </button>
              <button
                type="button"
                onClick={() => setRouteParams({ ...routeParams, genderPreference: 'FEMALE_ONLY' })}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm transition ${
                  routeParams.genderPreference === 'FEMALE_ONLY'
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
                    : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Female Rider Only
              </button>
            </div>
          </div>

          {/* DEPARTURE SCHEDULE TIME */}
          <div className="flex flex-col">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Departure Schedule Time</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="time"
                name="time"
                value={routeParams.time}
                onChange={(e) => setRouteParams({ ...routeParams, time: e.target.value })}
                className="bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 outline-none transition cursor-pointer"
              />
              <div className="flex flex-wrap gap-2">
                {TIME_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRouteParams({ ...routeParams, time: preset })}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition ${
                      routeParams.time === preset
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {formatTimeLabel(preset)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DATE AND SEATS CAPACITY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* DATE PICKER CALENDAR */}
            <div className="flex flex-col">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Departure Date</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                </div>
                <input
                  type="date"
                  name="date"
                  required
                  min={new Date().toISOString().split('T')[0]} // Prevents picking past dates
                  value={routeParams.date}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition cursor-pointer"
                />
              </div>
            </div>

            {/* PASSENGER SEAT CAPACITY SELECTOR */}
            <div className="flex flex-col">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Available Seats</label>
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-2.5 px-4 h-[58px]">
                <div className="flex items-center gap-2 text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-5 h-5 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <span className="text-sm font-black text-slate-900">{routeParams.seats} {routeParams.seats === 1 ? 'Seat' : 'Seats'}</span>
                </div>

                {/* Counter buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSeatChange(-1)}
                    disabled={routeParams.seats <= 1}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 transition"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSeatChange(1)}
                    disabled={routeParams.seats >= 8}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isFindingRoutes}
            className="w-full bg-slate-950 hover:bg-slate-900 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition shadow-lg shadow-slate-950/10 mt-4 active:scale-[0.99]"
          >
            {isFindingRoutes ? 'Finding routes…' : 'Check Available Routes'}
          </button>
        </form>

      </div>
    </div>
  );
}
