import React, { useState } from 'react';
import { PhoneCall, Mail, Headphones, ShieldCheck, Copy, Check, Star, MessageSquareHeart } from 'lucide-react';
import { submitFeedback } from '../api/feedbackApi';

export default function Support() {
  const [copiedText, setCopiedText] = useState('');

  // Feedback form
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [feedbackState, setFeedbackState] = useState({ status: 'idle', message: '' });

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setFeedbackState({ status: 'error', message: 'Please select a star rating.' });
      return;
    }
    setFeedbackState({ status: 'sending', message: '' });
    try {
      await submitFeedback({ rating, comments });
      setFeedbackState({ status: 'success', message: 'Thanks for your feedback! Our team will review it shortly.' });
      setRating(0);
      setComments('');
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data;
      setFeedbackState({ status: 'error', message: typeof backendMessage === 'string' ? backendMessage : 'Could not submit feedback right now. Please try again.' });
    }
  };

  const supportContacts = {
    tollFree1: '9340470097',
    tollFree2: '7200625559',
    email: 'RideTogetherSupport756@gmail.com'
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pt-28 pb-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
            <Headphones size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Help & Customer Support
          </h1>
          <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
            Have questions about a trip, booking, or account? Reach out directly to our official support team anytime.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* TOLL-FREE NUMBERS CARD */}
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition">
            <div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <PhoneCall size={24} />
              </div>
              <span className="text-xs font-black uppercase text-blue-600 tracking-widest block mb-1">
                Toll-Free Helplines
              </span>
              <h2 className="text-xl font-black text-slate-900 mb-2">Call Us Directly</h2>
              <p className="text-xs font-medium text-slate-400 mb-6">
                Available for urgent ride inquiries, emergency support, and immediate driver or passenger help.
              </p>

              {/* Phone List */}
              <div className="space-y-3">
                {[supportContacts.tollFree1, supportContacts.tollFree2].map((num, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 px-4">
                    <a 
                      href={`tel:${num}`} 
                      className="font-black text-slate-900 text-base sm:text-lg hover:text-blue-600 transition"
                    >
                      +91 {num}
                    </a>
                    <button
                      onClick={() => handleCopy(num)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 p-2 rounded-xl transition flex items-center gap-1 shadow-xs"
                      title="Copy Number"
                    >
                      {copiedText === num ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={`tel:${supportContacts.tollFree1}`}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl text-center shadow-lg shadow-blue-600/10 transition active:scale-[0.98] block text-sm"
            >
              Call Helpline Now
            </a>
          </div>

          {/* EMAIL SUPPORT CARD */}
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition">
            <div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Mail size={24} />
              </div>
              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest block mb-1">
                Official Email Support
              </span>
              <h2 className="text-xl font-black text-slate-900 mb-2">Send an Email</h2>
              <p className="text-xs font-medium text-slate-400 mb-6">
                For non-urgent issues, payment concerns, feedback, or general administrative questions.
              </p>

              {/* Email Address Container */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 px-4 overflow-hidden">
                <a 
                  href={`mailto:${supportContacts.email}`} 
                  className="font-bold text-slate-900 text-xs sm:text-sm truncate hover:text-emerald-600 transition"
                >
                  {supportContacts.email}
                </a>
                <button
                  onClick={() => handleCopy(supportContacts.email)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 p-2 rounded-xl transition flex-shrink-0 ml-2 shadow-xs"
                  title="Copy Email"
                >
                  {copiedText === supportContacts.email ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <a
              href={`mailto:${supportContacts.email}`}
              className="mt-8 w-full bg-slate-950 hover:bg-slate-900 text-white font-black py-4 rounded-xl text-center shadow-lg shadow-slate-950/10 transition active:scale-[0.98] block text-sm"
            >
              Compose Email
            </a>
          </div>

        </div>

        {/* Safety Note Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 bg-white/10 text-emerald-400 rounded-2xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h3 className="font-black text-base text-white">RideTogether Safety Assurance</h3>
              <p className="text-xs font-medium text-slate-400 mt-1">
                Always verify drivers and passenger identity details before beginning any trip.
              </p>
            </div>
          </div>
        </div>

        {/* FEEDBACK CARD */}
        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center">
              <MessageSquareHeart size={24} />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-pink-600 tracking-widest block mb-1">
                We'd love to hear from you
              </span>
              <h2 className="text-xl font-black text-slate-900">Share Your Feedback</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">Whether you ride or drive with RideTogether, we want to hear from you.</p>
            </div>
          </div>

          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2 block">
                Rate your experience
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1"
                  >
                    <Star
                      size={28}
                      className={(hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2 block">
                Comments (optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                placeholder="Tell us what went well or what we can improve..."
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-400 resize-none"
              />
            </div>

            {feedbackState.message && (
              <p className={`text-xs font-semibold ${feedbackState.status === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
                {feedbackState.message}
              </p>
            )}

            <button
              type="submit"
              disabled={feedbackState.status === 'sending'}
              className="w-full sm:w-auto bg-slate-950 hover:bg-slate-900 disabled:bg-slate-400 text-white font-black py-4 px-8 rounded-xl text-center shadow-lg shadow-slate-950/10 transition active:scale-[0.98] text-sm"
            >
              {feedbackState.status === 'sending' ? 'Submitting…' : 'Submit Feedback'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}