import React, { useState } from 'react';
import { AlertTriangle, X, Loader2, CheckCircle2 } from 'lucide-react';
import { triggerEmergencyAlert } from '../../api/emergencyApi';

/**
 * Floating SOS button. Renders nothing when the user is signed out or an ADMIN.
 * On trigger it grabs the browser's current GPS position (falling back to
 * the ride's last known coordinates, if provided) and posts an emergency
 * alert to /api/emergency/trigger, which emails RideTogether safety
 * dispatch + the rider's own emergency contact and notifies the other
 * party on the ride in-app.
 */
export default function SOSButton({ rideId, latitude, longitude }) {
  const token = localStorage.getItem('token');
  const role = (localStorage.getItem('role') || '').toUpperCase();

  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  // Hide button completely if user is logged out OR logged in as ADMIN
  if (!token || role === 'ADMIN') return null;

  const resetAndClose = () => {
    setOpen(false);
    setStatus('idle');
    setNote('');
  };

  const getCurrentPosition = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: latitude ?? null, longitude: longitude ?? null });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => resolve({ latitude: latitude ?? null, longitude: longitude ?? null }),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });

  const handleTrigger = async () => {
    setStatus('sending');
    setErrorMsg('');
    try {
      const coords = await getCurrentPosition();
      await triggerEmergencyAlert({
        rideId: rideId ? Number(rideId) : null,
        latitude: coords.latitude,
        longitude: coords.longitude,
        note,
        emergencyContactEmail: contactEmail || undefined,
      });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      const backendMessage = err.response?.data?.message || err.response?.data;
      setErrorMsg(typeof backendMessage === 'string' ? backendMessage : 'Could not send the alert. Please call your local emergency number directly.');
    }
  };

  return (
    <>
      {/* Floating trigger */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black text-sm px-5 py-3.5 rounded-full shadow-lg shadow-red-600/30 transition-transform duration-150 active:scale-95"
        >
          <AlertTriangle className="w-5 h-5" />
          SOS
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[320px] bg-white border-2 border-red-100 rounded-3xl shadow-2xl shadow-red-900/10 p-5 transition-opacity duration-150">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <p className="text-sm font-black text-slate-900">Emergency SOS</p>
            </div>
            <button onClick={resetAndClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {status === 'sent' ? (
            <div className="flex flex-col items-center text-center py-4 gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <p className="text-sm font-bold text-slate-900">Alert sent</p>
              <p className="text-xs text-slate-400 font-semibold">
                RideTogether safety dispatch has been notified with your location.
              </p>
              <button onClick={resetAndClose} className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700">
                Close
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-400 font-semibold mb-3">
                This will immediately share your live location with RideTogether safety dispatch{rideId ? ' and the other party on this ride' : ''}.
              </p>

              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Emergency contact email (optional)"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-400 mb-2"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's happening? (optional)"
                rows={2}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-400 mb-3 resize-none"
              />

              {status === 'error' && (
                <p className="text-xs font-semibold text-red-600 mb-2">{errorMsg}</p>
              )}

              <button
                type="button"
                disabled={status === 'sending'}
                onClick={handleTrigger}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-black text-sm py-3 rounded-xl transition"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending alert…
                  </>
                ) : (
                  'Send SOS alert now'
                )}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}