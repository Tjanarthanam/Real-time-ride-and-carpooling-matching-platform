import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Heart, 
  PhoneCall, 
  AlertTriangle, 
  Lock, 
  UserCheck, 
  Sparkles, 
  Car, 
  FileText, 
  CheckCircle2, 
  Radio, 
  MapPin, 
  Clock, 
  ShieldAlert,
  ArrowRight,
  Ambulance,
  Phone
} from 'lucide-react';

export default function Safety() {
  const emergencyHelplines = [
    {
      number: '112',
      title: 'National Emergency Number',
      desc: 'All-in-one unified emergency hotline for immediate assistance across India.',
      badge: 'Single Emergency Hotline',
      color: 'from-rose-500 to-red-600',
      icon: ShieldAlert,
    },
    {
      number: '181',
      title: 'Women Helpline',
      desc: '24x7 dedicated emergency support hotline for female commuters & women safety.',
      badge: '24/7 Female Safety',
      color: 'from-pink-500 to-purple-600',
      icon: Heart,
    },
    {
      number: '100',
      title: 'Police Emergency Response',
      desc: 'Direct hotline to local police control rooms for urgent law & security support.',
      badge: 'Police Control',
      color: 'from-blue-600 to-indigo-700',
      icon: PhoneCall,
    },
    {
      number: '108',
      title: 'Medical Ambulance Helpline',
      desc: 'Instant emergency medical assistance and road ambulance dispatch.',
      badge: 'Medical Care',
      color: 'from-emerald-500 to-teal-600',
      icon: Ambulance,
    },
    {
      number: '1033',
      title: 'Highway Emergency Hotline',
      desc: 'NHAI National Highway helpline for breakdown assistance and highway accidents.',
      badge: 'NHAI Highway Patrol',
      color: 'from-amber-500 to-orange-600',
      icon: AlertTriangle,
    },
  ];

  const safetyPillars = [
    {
      icon: UserCheck,
      title: '100% Verified Profiles',
      desc: 'Mandatory Government ID, Driving License & Verification for all registered drivers & riders.',
    },
    {
      icon: Radio,
      title: 'Real-time GPS Tracking',
      desc: 'Live trip tracking with automatic route divergence detection & continuous location sharing.',
    },
    {
      icon: ShieldCheck,
      title: 'Women-First Safety Protocol',
      desc: 'Exclusive female rider/driver ride filters, verified female badges & specialized safety checks.',
    },
    {
      icon: FileText,
      title: 'Accident Coverage Cover',
      desc: 'Complimentary trip accident insurance up to ₹5,00,000 covering medical expenses & assistance.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/20 text-slate-900 pt-28 pb-20">
      
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* HERO INTRO HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-black uppercase tracking-wider">
            <Sparkles size={16} /> Safety & Protection Standard
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Your Safety is Our <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Highest Priority</span>
          </h1>

          <p className="text-base sm:text-lg font-medium text-slate-600 leading-relaxed">
            Welcome to the Antigravity Carpooling Safety Portal. We combine state-of-the-art emergency SOS response, verified rider profiles, female safety protocols, and comprehensive accident insurance for every journey.
          </p>
        </div>

        {/* 24/7 EMERGENCY HELPLINES GRID (112, 100, 108, 1033, 181) */}
        <div className="mb-20 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-rose-600 flex items-center gap-1.5">
                <AlertTriangle size={16} /> Immediate Assistance
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-1">
                Emergency National Helplines
              </h2>
            </div>
            <p className="text-xs font-semibold text-slate-500 max-w-md">
              One-touch direct dialing to official national emergency services available 24 hours a day, 7 days a week.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyHelplines.map((item) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={item.number}
                  className="group relative bg-white border border-slate-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-gradient-to-r ${item.color} shadow-sm`}>
                        {item.badge}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:scale-110 transition-transform">
                        <IconComp size={20} />
                      </div>
                    </div>

                    <div>
                      <div className="text-4xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.number}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {item.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100">
                    <a
                      href={`tel:${item.number}`}
                      className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                    >
                      <Phone size={14} /> Call {item.number} Now
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FEMALE SAFETY & WOMEN-FIRST CARPOOLING */}
        <div className="mb-20 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-slate-100 border border-pink-200 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 border border-pink-300 text-pink-700 text-xs font-black uppercase tracking-wider">
                <Heart size={14} className="text-pink-500" /> Dedicated Women Safety
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Female Commuter Safety & <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Women-Only Rides</span>
              </h2>

              <p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed">
                Antigravity provides an empowered, secure environment designed specifically for female travelers. Female passengers can filter search results to ride exclusively with verified female drivers and fellow female commuters.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 bg-white/90 p-4 rounded-2xl border border-pink-200 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Female-Only Filter</h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Filter rides to view rides hosted by female drivers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/90 p-4 rounded-2xl border border-pink-200 shadow-sm">
                  <PhoneCall className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">181 Women Helpline Integration</h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Direct 1-click speed dial to official 181 Helpline.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="tel:181"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/20 transition-all flex items-center gap-2"
                >
                  <Phone size={16} /> Dial 181 Women Helpline
                </a>
                <Link
                  to="/SearchRide"
                  className="px-6 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 border border-slate-200 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
                >
                  Find Women Rides <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-white border border-pink-200 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
                <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mx-auto border border-pink-200">
                  <ShieldCheck size={36} />
                </div>
                <h3 className="text-lg font-black text-slate-900">Pink Shield Protection</h3>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  All female members receive live route safety tracking, 24x7 emergency SOS contact notifications, and trusted profile identity verification.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-4 py-2 rounded-xl bg-pink-50 text-pink-700 text-xs font-black border border-pink-200">
                    ✓ Verified Female Badge Enabled
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ACCIDENT SAFETY & TRIP INSURANCE */}
        <div className="mb-20 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center justify-center gap-1.5">
              <FileText size={16} /> Financial Protection & Care
            </span>
            <h2 className="text-3xl font-black text-slate-900">
              Accident Safety & Trip Insurance Cover
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Every confirmed ride booked through Antigravity is protected by comprehensive accident insurance cover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900">₹5,00,000 Accidental Cover</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Coverage for hospitalisation expenses, emergency medical treatments, and accidental injury compensation during trip duration.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900">24/7 Roadside Assistance</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Instant towing, flat tire support, engine breakdown care, and replacement transport arrangements via Highway Patrol 1033.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Vehicle Fitness Checks</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Strict vehicle registration checks, valid Pollution Under Control (PUC) standards, and driver license verification before ride listing.
              </p>
            </div>
          </div>
        </div>

        {/* CORE SAFETY PILLARS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Built-in Safety Infrastructure
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              End-to-end security measures guarding every mile of your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyPillars.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <IconComponent size={20} />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}