import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchRides } from '../../api/rideApi';
import { bookRide } from '../../api/bookingApi';
import { joinWaitlist } from '../../api/waitlistApi';
import LocationAutocomplete from '../../components/LocationAutocomplete';

// Local YYYY-MM-DD for "today", used as the real default instead of a
// hardcoded date — new Date().toISOString() would shift by the browser's
// UTC offset and can land on the wrong day.
function todayLocalISO() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().split('T')[0];
}

export default function SearchRide() {
  // Use a proper Date object reference to manage months and years dynamically
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: todayLocalISO(), // Default selected string value — always "today", not a fixed date
    passengers: '1'
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  // Real search results coming back from GET /api/rides/search
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Per-ride booking state, keyed by ride id, so each card can show its own
  // "Booking..." / success / error state independently.
  const [bookingState, setBookingState] = useState({});

  // "Suggestion" panel: when a search comes back empty, let the passenger
  // join a waitlist and get notified automatically once a driver posts a
  // matching ride (email + in-app notification, see /api/waitlist).
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false);
  const [waitlistMessage, setWaitlistMessage] = useState(null);

  // Close calendar if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  // Calendar Calculation Core Logic
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth(); // 0-indexed (6 = July)

  const monthName = currentCalendarDate.toLocaleString('en-US', { month: 'long' });
  
  // Get first day of the current month (e.g., 0 = Sunday, 1 = Monday...)
  const firstDayIndex = new Date(year, month, 1).getDay();
  
  // Get total number of days in the current month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Navigation controller to switch months seamlessly
  const handleNextMonth = () => {
    setCurrentCalendarDate(new Date(year, month + 1, 1));
  };

  const handlePrevMonth = () => {
    setCurrentCalendarDate(new Date(year, month - 1, 1));
  };

  const selectDate = (day) => {
    const selectedDateObj = new Date(year, month, day);
    // Convert local date safely to YYYY-MM-DD
    const offset = selectedDateObj.getTimezoneOffset();
    const localDate = new Date(selectedDateObj.getTime() - (offset * 60 * 1000));
    const dateString = localDate.toISOString().split('T')[0];

    setSearchParams({ ...searchParams, date: dateString });
    setShowCalendar(false);
  };

  // Helper to format date display labels inside the main bar input
  const getFormattedDateLabel = (dateStr) => {
    if (!dateStr) return 'Select date';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchParams.from || !searchParams.to || !searchParams.date) return;

    setIsSearching(true);
    setSearchError('');
    setHasSearched(true);
    setWaitlistMessage(null);
    try {
      const response = await searchRides({
        source: searchParams.from,
        destination: searchParams.to,
        date: searchParams.date,
        seats: searchParams.passengers,
      });
      setResults(response.data);
    } catch (error) {
      if (error.request) {
        setSearchError('Could not reach the server. Is the backend running on port 8081?');
      } else {
        setSearchError('Something went wrong while searching for rides.');
      }
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookRide = async (rideId) => {
    setBookingState((prev) => ({ ...prev, [rideId]: { status: 'booking' } }));
    try {
      const response = await bookRide({ rideId, seatsToBook: Number(searchParams.passengers) });
      setBookingState((prev) => ({ ...prev, [rideId]: { status: 'success', message: response.data } }));
    } catch (error) {
      const message = error.response?.data || 'Could not book this ride. Please try again.';
      setBookingState((prev) => ({ ...prev, [rideId]: { status: 'error', message } }));
    }
  };

  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    if (!waitlistEmail) return;

    setIsJoiningWaitlist(true);
    setWaitlistMessage(null);
    try {
      const response = await joinWaitlist({
        source: searchParams.from,
        destination: searchParams.to,
        travelDate: searchParams.date,
        email: waitlistEmail,
      });
      setWaitlistMessage({ type: 'success', text: response.data?.message || "You're on the list! We'll email you the moment a matching ride is posted." });
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data;
      setWaitlistMessage({ type: 'error', text: typeof backendMessage === 'string' ? backendMessage : 'Could not join the waitlist. Please try again.' });
    } finally {
      setIsJoiningWaitlist(false);
    }
  };

  // Check if a specific grid day is the currently selected date
  const isSelectedDay = (day) => {
    const checkDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return searchParams.date === checkDateStr;
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-500/10 flex flex-col justify-between">
      
      {/* MAIN CONTAINER */}
      <div className="w-full max-w-[1340px] mx-auto px-6 pt-36 pb-20 flex-1 flex flex-col items-center">
        
        {/* LARGE PAGE TITLE */}
        <h1 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tight text-center mb-12">
          Find a ride
        </h1>

        {/* SEARCH BAR PANEL CONTAINER */}
        <form 
          onSubmit={handleSearchSubmit}
          className="w-full bg-white border-2 border-slate-200/90 shadow-[0_15px_45px_rgba(0,0,0,0.03)] rounded-3xl lg:rounded-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-y-4 lg:gap-y-0 items-center mb-16 relative"
        >
          {/* FROM FIELD */}
          <div className="lg:col-span-3 px-6 py-2 border-b lg:border-b-0 lg:border-r-2 border-slate-100 flex flex-col justify-center">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">From</label>
            <LocationAutocomplete
              name="from"
              value={searchParams.from}
              onChange={(val) => setSearchParams({ ...searchParams, from: val })}
              placeholder="City, station, place"
              inputClassName="w-full bg-transparent text-lg md:text-xl font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* TO FIELD */}
          <div className="lg:col-span-3 px-6 py-2 border-b lg:border-b-0 lg:border-r-2 border-slate-100 flex flex-col justify-center">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">To</label>
            <LocationAutocomplete
              name="to"
              value={searchParams.to}
              onChange={(val) => setSearchParams({ ...searchParams, to: val })}
              placeholder="City, station, place"
              inputClassName="w-full bg-transparent text-lg md:text-xl font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* STYLED CALENDAR TRIGGER BLOCK */}
          <div className="lg:col-span-3 px-6 py-2 border-b lg:border-b-0 lg:border-r-2 border-slate-100 flex flex-col justify-center relative">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Date</label>
            <div 
              onClick={() => setShowCalendar(!showCalendar)}
              className="relative flex items-center justify-between w-full cursor-pointer select-none"
            >
              <span className="text-lg md:text-xl font-bold text-slate-900">
                {getFormattedDateLabel(searchParams.date)}
              </span>
              <div className="text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0V7.5m18 11.25V7.5M3.75 11.25h16.5m-16.5 3.75h16.5M7.5 15h.008v.008H7.5V15Zm0 3h.008v.008H7.5V18Zm3.75-3h.008v.008h-.008V15Zm0 3h.008v.008h-.008V18Zm3.75-3h.008v.008h-.008V15Zm0 3h.008v.008h-.008V18Zm3.75-3h.008v.008h-.008V15Z" />
                </svg>
              </div>
            </div>

            {/* FULLY DYNAMIC CALENDAR DROPDOWN GRID OVERLAY */}
            {showCalendar && (
              <div 
                ref={calendarRef}
                className="absolute top-full left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0 mt-4 bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl p-6 w-[360px] z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* Header Row: Previous, Month/Year Label, and Next */}
                <div className="flex items-center justify-between mb-6 px-1">
                  <button 
                    type="button" 
                    onClick={handlePrevMonth}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                  </button>
                  
                  <h3 className="text-xl font-black text-[#0A162F]">
                    {monthName} <span className="text-slate-400 font-medium text-base ml-1">{year}</span>
                  </h3>
                  
                  <button 
                    type="button" 
                    onClick={handleNextMonth}
                    className="text-blue-600 hover:text-blue-700 transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5l6 6m0 0l-6 6m6-6H3" />
                    </svg>
                  </button>
                </div>

                {/* Weekdays Grid Row Header */}
                <div className="grid grid-cols-7 text-center mb-3">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <span key={d} className="text-xs font-bold text-[#0A162F] tracking-wide uppercase opacity-60">{d}</span>
                  ))}
                </div>

                {/* Dynamic Days Processing Matrix Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Generate empty space layout blocks for previous month overflow offsets */}
                  {Array.from({ length: firstDayIndex }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="h-10"></div>
                  ))}

                  {/* Render the actual numerical days for this specific month dynamically */}
                  {Array.from({ length: totalDaysInMonth }, (_, idx) => idx + 1).map((day) => {
                    const active = isSelectedDay(day);
                    return (
                      <button
                        key={`day-${day}`}
                        type="button"
                        onClick={() => selectDate(day)}
                        className={`flex items-center justify-center h-10 w-full text-sm font-bold rounded-xl transition-all ${
                          active 
                            ? "border-2 border-blue-600 text-[#0A162F] font-black bg-blue-50/20 shadow-sm"
                            : "border border-slate-100/70 text-[#0A162F] hover:border-blue-600 hover:text-blue-600"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* PASSENGERS SELECTOR & SEARCH BUTTON BLOCK */}
          <div className="lg:col-span-3 pl-6 pr-2 py-1 flex items-center justify-between gap-4 w-full">
            <div className="flex flex-col justify-center w-full relative group">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Passengers</label>
              <div className="relative w-full flex items-center">
                <select
                  name="passengers"
                  value={searchParams.passengers}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-lg md:text-xl font-bold text-slate-900 focus:outline-none cursor-pointer appearance-none pr-8 z-10"
                >
                  <option value="1">1 passenger</option>
                  <option value="2">2 passengers</option>
                  <option value="3">3 passengers</option>
                  <option value="4">4 passengers</option>
                </select>
                <div className="absolute right-2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* ACTION SUBMIT BUTTON */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-black text-base h-14 px-8 rounded-2xl lg:rounded-full transition duration-150 flex items-center justify-center shadow-lg shadow-blue-600/20 active:scale-95 shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* SEARCH RESULTS LIST */}
        <div className="w-full max-w-[960px] mr-auto pl-2">
          <h2 className="text-lg font-black text-slate-950 tracking-tight mb-5">
            {hasSearched ? 'Available rides' : 'Search for a ride to get started'}
          </h2>

          {isSearching && (
            <p className="text-sm text-slate-400 font-semibold py-4">Searching for rides…</p>
          )}

          {searchError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {searchError}
            </div>
          )}

          {!isSearching && !searchError && hasSearched && results.length === 0 && (
            <div className="p-6 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
              <p className="text-sm text-slate-400 font-semibold mb-4">
                No rides found for that route, date, and seat count. Try adjusting your search — or get notified the moment one shows up.
              </p>

              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                </div>
                <p className="text-sm font-black text-slate-900">Suggestion: join the waiting list</p>
              </div>

              <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={isJoiningWaitlist}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition shrink-0"
                >
                  {isJoiningWaitlist ? 'Joining…' : 'Notify me'}
                </button>
              </form>

              {waitlistMessage && (
                <p className={`text-xs font-semibold mt-3 ${waitlistMessage.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
                  {waitlistMessage.text}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            {results.map((ride) => {
              const booking = bookingState[ride.id];
              return (
                <div
                  key={ride.id}
                  className="flex items-center justify-between p-5 bg-white border-2 border-slate-100 hover:border-slate-200/60 rounded-2xl transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.321-5.028a3.75 3.75 0 0 0-3.69-3.513H7.072a3.75 3.75 0 0 0-3.69 3.513l-.321 5.028a1.125 1.125 0 0 0 1.09 1.124H6.375m11.75-4.5H3.75m16.5-3H3.75m16.5 3v-2.25A2.25 2.25 0 0 0 18 6.375H6A2.25 2.25 0 0 0 3.75 8.625V10.5" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight">
                        {ride.source} <span className="text-slate-400 font-normal mx-2">→</span> {ride.destination}
                      </p>
                      <p className="text-sm text-slate-400 font-bold mt-1">
                        {ride.travelDate} • {ride.travelTime} • Driver: {ride.driverName}
                      </p>
                      <p className="text-sm text-slate-500 font-bold mt-1">
                        {ride.availableSeats} seat(s) left • ₹{ride.fare} per seat
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      disabled={booking?.status === 'booking' || booking?.status === 'success'}
                      onClick={() => handleBookRide(ride.id)}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition"
                    >
                      {booking?.status === 'booking' ? 'Booking…' : booking?.status === 'success' ? 'Requested' : 'Book'}
                    </button>
                    {booking?.message && (
                      <p className={`text-xs font-semibold max-w-[220px] text-right ${booking.status === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
                        {booking.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER BLOCK */}
      <footer className="w-full bg-[#0B0F19] text-slate-400 py-16 border-t border-slate-900 mt-auto">
        <div className="w-full mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-white font-black text-2xl tracking-tight">RideTogether</h3>
            <p className="text-sm leading-relaxed font-medium">Connecting commuters globally to optimize everyday transit channels safely and affordably.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li><Link to="/find-ride" className="hover:text-blue-400 transition-colors">Find a Ride</Link></li>
              <li><Link to="/signup" className="hover:text-blue-400 transition-colors">Offer a Ride</Link></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Our Services</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">About</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li><a href="#why-us" className="hover:text-blue-400 transition-colors">Why Choose Us</a></li>
              <li><a href="#faqs" className="hover:text-blue-400 transition-colors">FAQs</a></li>
              <li><a href="#privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <p className="text-sm font-semibold">support@ridetogether.in</p>
            <p className="text-xs text-slate-500 mt-2">© 2026 RideTogether Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
    </div>
  );
}