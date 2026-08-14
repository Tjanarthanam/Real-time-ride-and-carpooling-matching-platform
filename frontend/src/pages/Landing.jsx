import React, { useState, useEffect } from 'react';
import { getPublicFeedback } from '../api/feedbackApi';
import backCarImg from '../assets/images/background.png';
import carImg from '../assets/images/car2.avif';
import bikeImg from '../assets/images/bick2.jpg';
import parcelImg from '../assets/images/parcel.jpg';
import img1 from '../assets/images/af.webp';
import Map from '../assets/images/map.png';
import navigation from '../assets/images/navigation.webp';
import notification from '../assets/images/notification.webp';
import realChat from '../assets/images/real-chat.webp';
import Rating from '../assets/images/Reting.webp';
import car3d from '../assets/images/car4.jpg';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

  // Signed-out visitors see both CTAs (clicking either one prompts them to
  // sign in / sign up, handled by ProtectedRoute). Once signed in, only show
  // the action that's relevant to that role - passengers don't offer rides,
  // drivers don't search for rides.
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const currentRole = (localStorage.getItem('role') || '').toLowerCase().trim();
  const showSearchRide = !isLoggedIn || currentRole !== 'driver';
  const showOfferRide = !isLoggedIn || currentRole !== 'passenger';
  const showBothCtas = showSearchRide && showOfferRide;

  // Real testimonials left by both drivers and passengers via the feedback
  // form on the Support page — see GET /api/feedback/public.
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getPublicFeedback()
      .then((res) => {
        if (!cancelled) setTestimonials(res.data || []);
      })
      .catch(() => {
        if (!cancelled) setTestimonials([]);
      });
    return () => { cancelled = true; };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const services = [
    {
      title: 'Car Sharing',
      desc: 'Split travel fuel costs and enjoy comfortable intercity travel tracks.',
      imgSrc: carImg,
      alt: 'Car Sharing'
    },
    {
      title: 'Bike Pooling',
      desc: 'Beat peak traffic congestion with fast and budget-friendly single commutes.',
      imgSrc: bikeImg,
      alt: 'Bike Pooling'
    },
    {
      title: 'Parcel Delivery',
      desc: 'Send intra-city packages fast using efficient, pre-existing shared routes.',
      imgSrc: parcelImg,
      alt: 'Parcel Delivery'
    }
  ];

  const faqs = [
    {
      q: "What is car pooling?",
      a: "Car pooling (also called carpooling or ride sharing) is the practice of sharing a car journey with other travelers heading the same way. Instead of driving alone, you share the ride and split the fuel and toll costs. RideTogether connects drivers with empty seats to passengers looking for affordable rides."
    },
    {
      q: "How does RideTogether work?",
      a: "It's simple: Drivers post their upcoming ride with route, date, time, and price per seat. Riders search for rides matching their route and book a seat. Both parties connect via in-app chat, meet at the pickup point, and travel together. After the ride, they can leave reviews."
    },
    {
      q: "Is carpooling safe in India?",
      a: "RideTogether prioritizes safety with verified user profiles, phone verification, ratings & reviews system, and in-app chat. You can view a driver's or rider's profile, past reviews, and verification status before booking. We recommend sharing your ride details with a trusted contact."
    },
    {
      q: "How much does car pooling cost?",
      a: "Car pooling on RideTogether is significantly cheaper than traditional cab services — typically 50-70% less. Drivers set their own price per seat, which usually covers fuel and toll costs shared among passengers. The platform is completely free to use."
    },
    {
      q: "Which cities does RideTogether cover?",
      a: "RideTogether covers 50+ cities across India including Delhi, Mumbai, Bangalore, Pune, Hyderabad, Chennai, Jaipur, Ahmedabad, Chandigarh, Kolkata, and many more. Popular routes include Delhi to Jaipur, Mumbai to Pune, Bangalore to Chennai, Delhi to Chandigarh, and Hyderabad to Bangalore."
    },
    {
      q: "Can I offer a ride as a driver?",
      a: "Yes! If you're driving between cities or have a daily commute with empty seats, you can post your ride on RideTogether. Set your route, departure time, available seats, and price. You'll earn money by sharing your journey and help reduce traffic and pollution."
    }
  ];

  return (
    <div className="w-full flex flex-col bg-[#F8FAFC]">
      
{/* SECTION 1: HERO VIEWPORT - TEXT SITS DIRECTLY ON THE BACKGROUND */}
      <div 
        className="w-full min-h-screen bg-cover bg-center flex items-center justify-center px-6 sm:px-10 lg:px-16 pt-24" 
        style={{ backgroundImage: `url(${backCarImg})` }}
      >
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center z-10 py-16">
          <div className="max-w-3xl space-y-6 select-none">
            
            {/* Main Header Heading with a subtle clean text-drop shadow for high readability */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
              RideTogether <br className="hidden sm:block"/>
              Carpooling Platform
            </h1>
            
            
            {/* Action Flow Links */}
            { <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-md mx-auto">
              {showSearchRide && (
                <Link 
                  to="/searchride" 
                  className={`${showBothCtas ? 'w-full sm:w-1/2' : 'w-full sm:w-2/3'} bg-blue-600 hover:bg-blue-700 text-white font-black text-xl py-4 px-6 rounded-2xl shadow-xl shadow-blue-600/20 transition duration-200 text-center block transform hover:-translate-y-0.5 active:scale-95`}
                >
                  Find a Ride
                </Link>
              )}
              {showOfferRide && (
                <Link 
                  to="/offerRide" 
                  className={`${showBothCtas ? 'w-full sm:w-1/2' : 'w-full sm:w-2/3'} bg-[#0B0F19] hover:bg-black text-white font-black text-xl py-4 px-6 rounded-2xl shadow-xl transition duration-200 text-center block transform hover:-translate-y-0.5 active:scale-95`}
                >
                  Offer a Ride
                </Link>
              )}
            </div> }

          </div>
        </div>
      </div>

      {/* SECTION 2: SERVICES SHOWCASE */}
      <div id="services" className="w-full bg-white py-24 border-b border-slate-100">
        <div className="w-full mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-16 text-left">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Our Services</h2>
            <div className="w-24 h-[5px] bg-blue-600 mt-3 rounded-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((item, index) => (
              <div key={index} className="group bg-slate-50 border border-slate-200/60 p-8 rounded-3xl flex justify-between items-center gap-6 shadow-sm min-h-[160px] hover:shadow-md transition-shadow">
                <div className="space-y-2 flex-1">
                  <h3 className="text-2xl font-black text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 font-bold text-sm leading-snug max-w-[180px] sm:max-w-none">{item.desc}</p>
                </div>
                <div className="w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 flex items-center justify-center bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
                  <img src={item.imgSrc} alt={item.alt} className="w-full h-full object-contain select-none transform transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: HOW CAR POOLING WORKS */}
      <div className="w-full bg-[#F1F5F9] py-24 text-slate-900 relative overflow-hidden border-b border-slate-200">
        <div className="w-full mx-auto px-6 sm:px-10 lg:px-16 text-center relative">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-slate-900">How Car Pooling Works on RideTogether</h2>
          <p className="text-slate-500 font-bold mb-16 text-lg">Three simple steps to find or offer a carpool ride</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/20">1</div>
              <h4 className="text-xl font-black text-slate-900">Post or Search a Ride</h4>
              <p className="text-slate-600 font-semibold text-sm leading-relaxed max-w-xs">Drivers post routes with custom dates and seats. Riders query by destination parameters instantly.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/20">2</div>
              <h4 className="text-xl font-black text-slate-900">Connect & Book a Seat</h4>
              <p className="text-slate-600 font-semibold text-sm leading-relaxed max-w-xs">Instantly reserve seats, chat via native secure messaging channels, and coordinate your meet points.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/20">3</div>
              <h4 className="text-xl font-black text-slate-900">Travel Together & Save</h4>
              <p className="text-slate-600 font-semibold text-sm leading-relaxed max-w-xs">Meet at designated hubs, split transport costs seamlessly, and rate your matched commute circle.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: PLATFORM FEATURES */}
      <div className="w-full bg-white py-24 text-slate-900 border-b border-slate-100">
        <div className="w-full mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-slate-900">Everything You Need for Car Pooling & Ride Sharing</h2>
          <p className="text-slate-500 font-bold mb-16 text-lg">A complete carpooling platform designed for safe and convenient shared travel</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: 'Smart Route Matching', desc: 'Find carpool rides along your exact route with intelligent origin-destination matching algorithms.', imgSrc: Map },
              { title: 'Real-time Chat', desc: 'Message drivers and riders instantly. Coordinate pickup spots and travel itinerary structures seamlessly.', imgSrc: realChat },
              { title: 'Verified & Safe Rides', desc: 'Phone-verified corporate profiles with rating score histories. Travel with extreme structural peace of mind.', imgSrc: img1 },
              { title: 'Instant Notifications', desc: 'Get notified via mobile alerts about booking confirmations, real-time tracking logs, and updates.', imgSrc: notification },
              { title: 'Navigation Ready', desc: 'One-tap map system utilities for drivers to route safely to designated user pick points.', imgSrc: navigation },
              { title: 'Affordable Ride Sharing', desc: 'Set custom prices per seat with zero hidden platform charges. Make intra-city movement accessible.', imgSrc: Rating }
            ].map((feat, i) => (
              <div key={i} className="bg-[#F8FAFC] border border-slate-200/60 p-8 rounded-2xl text-left space-y-4 hover:border-blue-500/40 transition-colors shadow-sm">
                <div className="bg-blue-50 border border-blue-100 w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden p-2">
                  <img src={feat.imgSrc} alt={feat.title} className="w-full h-full object-contain" />
                </div>
                <h4 className="text-lg font-black text-slate-900">{feat.title}</h4>
                <p className="text-slate-600 font-semibold text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 5: POPULAR TRACK ROUTINGS */}
      <div className="w-full bg-[#F8FAFC] py-24 text-slate-900 border-b border-slate-200">
        <div className="w-full mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-slate-900">Popular Car Pooling Routes</h2>
          <p className="text-slate-500 font-bold mb-16 text-lg">Find affordable shared rides across premium intercity commute pathways</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              'Mumbai to Pune Carpool', 'Delhi to Jaipur Carpool', 'Bangalore to Chennai Carpool',
              'Ahmedabad to Mumbai Carpool', 'Hyderabad to Vijayawada Carpool', 'Pune to Goa Carpool'
            ].map((route, i) => (
              <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl text-left flex gap-4 items-start hover:border-blue-500/30 transition-all shadow-sm hover:shadow-md">
                <div className="bg-blue-50 w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                  <img src={car3d} alt="Car Icon" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900">{route}</h4>
                  <p className="text-slate-500 font-medium text-xs leading-relaxed">Find verified daily commuter circles along this highway run. Share fuel charges and commute securely.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 6: WHY CHOOSE CAR POOLING */}
      <div id="why-us" className="w-full bg-white py-24 text-slate-900 border-b border-slate-200">
        <div className="w-full mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-slate-900">Why Choose Car Pooling with RideTogether?</h2>
          <p className="text-slate-500 font-bold mb-16 text-lg">India's most trusted carpooling and ride sharing platform</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto mt-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-md text-white">💰</div>
              <h4 className="text-xl font-black text-slate-900">Save Up to 70% on Travel</h4>
              <p className="text-slate-600 font-semibold text-sm leading-relaxed max-w-xs">Car pooling is the cheapest way to travel between cities. Share fuel and toll costs with fellow travelers and save significantly compared to booking a full cab or bus ticket.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center text-2xl shadow-md text-white">🌱</div>
              <h4 className="text-xl font-black text-slate-900">Eco-Friendly & Sustainable</h4>
              <p className="text-slate-600 font-semibold text-sm leading-relaxed max-w-xs">Every shared ride reduces carbon emissions. By carpooling instead of driving alone, you help reduce traffic congestion and air pollution across Indian cities.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-600 flex items-center justify-center text-2xl shadow-md text-white">🛡️</div>
              <h4 className="text-xl font-black text-slate-900">Safe & Verified Community</h4>
              <p className="text-slate-600 font-semibold text-sm leading-relaxed max-w-xs">All users are phone-verified with ratings and reviews. Our carpooling community ensures safe, comfortable, and trustworthy shared rides across India.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 7: FREQUENTLY ASKED QUESTIONS */}
      <div id="faqs" className="w-full bg-[#F1F5F9] py-24 text-slate-900">
        <div className="w-full mx-auto px-6 sm:px-10 lg:px-16 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-slate-900">Frequently Asked Questions About Car Pooling</h2>
            <p className="text-slate-500 font-bold text-lg">Everything you need to know about carpooling on RideTogether</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                onMouseEnter={() => setOpenFaq(index)}
                onMouseLeave={() => setOpenFaq(null)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-200"
              >
                <div className="w-full p-6 text-left flex justify-between items-center font-black text-slate-900 text-base sm:text-lg select-none cursor-pointer">
                  <span>{openFaq === index ? '▼' : '▶'} {faq.q}</span>
                </div>
                {openFaq === index && (
                  <div className="px-6 pb-6 pt-2 text-slate-600 font-semibold text-sm sm:text-base leading-relaxed border-t border-slate-100 bg-slate-50/50 transition-all">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 7b: TESTIMONIALS FROM REAL DRIVERS & PASSENGERS */}
      {testimonials.length > 0 && (
        <div className="w-full bg-white py-24 text-slate-900">
          <div className="w-full mx-auto px-6 sm:px-10 lg:px-16 max-w-6xl">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="text-xs font-black uppercase text-blue-600 tracking-widest block mb-3">
                What Our Community Says
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-slate-900">
                Feedback from Drivers &amp; Passengers
              </h2>
              <p className="text-slate-500 font-bold text-lg">
                Real reviews shared by people who ride and drive with RideTogether
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="bg-[#F8FAFC] border-2 border-slate-100 rounded-3xl p-7 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < item.rating ? 'text-amber-400' : 'text-slate-200'}>★</span>
                    ))}
                  </div>
                  <p className="text-slate-700 font-semibold text-sm leading-relaxed flex-1">
                    "{item.comments}"
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="font-black text-slate-900 text-sm">{item.reviewerName}</span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      item.role === 'DRIVER' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.role === 'DRIVER' ? 'Driver' : 'Passenger'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PREMIUM DARK FOOTER SECTION */}
      <footer className="w-full bg-[#0B0F19] text-slate-400 py-16 border-t border-slate-900">
        <div className="w-full mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-white font-black text-2xl tracking-tight">RideTogether</h3>
            <p className="text-sm leading-relaxed font-medium">Connecting commuters globally to optimize everyday transit channels safely and affordably.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li><Link to="/signup" className="hover:text-blue-400 transition-colors">Find a Ride</Link></li>
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