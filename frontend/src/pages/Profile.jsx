import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  FileText,
  Car,
  ShieldCheck,
  Camera,
  CheckCircle2,
  Save,
  Edit3,
  X,
  Loader2,
  MapPin,
} from 'lucide-react';

export default function Profile() {
  // Read Role and Auth Token from LocalStorage
  const token = localStorage.getItem('token');
  const rawRole = localStorage.getItem('role') || 'passenger';
  const userRole = rawRole.toString().toLowerCase().trim();
  const isDriver = userRole === 'driver';

  // Toggle View vs Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Form & View State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    city: '',
    licenseId: '',
    vehicleModel: '',
    vehicleNumber: '',
  });

  // Load User Details on Mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        // Fetch from localStorage cache or backend API
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setFormData({
          fullName: savedUser.fullName || savedUser.name || 'John Doe',
          email: savedUser.email || 'user@example.com',
          phone: savedUser.phone || '9876543210',
          gender: savedUser.gender || 'Male',
          city: savedUser.city || 'Bengaluru',
          licenseId: savedUser.licenseId || (isDriver ? 'DL-1420110012345' : ''),
          vehicleModel: savedUser.vehicleModel || (isDriver ? 'Swift Dzire' : ''),
          vehicleNumber: savedUser.vehicleNumber || (isDriver ? 'KA 01 AB 1234' : ''),
        });
        if (savedUser.avatarUrl) setAvatarPreview(savedUser.avatarUrl);

      } catch (error) {
        console.error('Failed to load user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, isDriver]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };

  // Save Changes
  const handleSubmit = (e) => {
    e.preventDefault();

    // Update LocalStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem(
      'user',
      JSON.stringify({ ...currentUser, ...formData, avatarUrl: avatarPreview })
    );

    setIsEditing(false); // Return to details view
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 size={36} className="text-blue-600 animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-500">Loading profile details...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pt-28 pb-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight">
              My Profile
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              {isEditing ? 'Editing account details' : 'Your account details and driver credentials'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-black uppercase px-3.5 py-1.5 rounded-xl border ${
              isDriver ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-blue-100 text-blue-900 border-blue-200'
            }`}>
              {isDriver ? 'Driver' : 'Passenger'}
            </span>

            {/* Edit / Cancel Toggle Button */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <X size={15} />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Success Alert */}
        {isSaved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-sm">
            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {/* Main Card Container */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          
          {/* Circular Image Header */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-md bg-slate-100 flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={56} className="text-slate-400" />
                )}
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full shadow-lg transition transform active:scale-90 cursor-pointer"
                  title="Upload Photo"
                >
                  <Camera size={18} />
                </button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <h2 className="text-2xl font-black text-slate-900">{formData.fullName || 'User Name'}</h2>
            <p className="text-xs font-semibold text-slate-400 capitalize">{userRole} Account</p>
          </div>

          <hr className="border-slate-100" />

          {/* ========================================================= */}
          {/* VIEW MODE: SHOW ALL DETAILS CLEARLY                        */}
          {/* ========================================================= */}
          {!isEditing ? (
            <div className="space-y-8">
              
              {/* Personal Details View */}
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <User className="text-blue-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Full Name</p>
                      <p className="text-sm font-extrabold text-slate-900">{formData.fullName || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <Phone className="text-blue-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Phone Number</p>
                      <p className="text-sm font-extrabold text-slate-900">{formData.phone || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3 sm:col-span-2">
                    <Mail className="text-blue-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Email Address</p>
                      <p className="text-sm font-extrabold text-slate-900">{formData.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <User className="text-blue-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Gender</p>
                      <p className="text-sm font-extrabold text-slate-900">{formData.gender}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <MapPin className="text-blue-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">City</p>
                      <p className="text-sm font-extrabold text-slate-900">{formData.city || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver Details View */}
              {isDriver && (
                <div>
                  <h3 className="text-xs font-black uppercase text-amber-600 tracking-wider mb-4 flex items-center gap-1.5">
                    <ShieldCheck size={16} />
                    <span>Driver & Vehicle Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/80 flex items-center gap-3 sm:col-span-2">
                      <FileText className="text-amber-700 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-[10px] font-black uppercase text-amber-700/70">Driving License ID</p>
                        <p className="text-sm font-black text-slate-900">{formData.licenseId || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Car className="text-slate-700 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Vehicle Model</p>
                        <p className="text-sm font-extrabold text-slate-900">{formData.vehicleModel || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Car className="text-slate-700 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Vehicle Number</p>
                        <p className="text-sm font-black text-slate-900 uppercase">{formData.vehicleNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Update Trigger */}
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black py-4 rounded-2xl shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Edit3 size={18} />
                <span>Update Profile Details</span>
              </button>

            </div>
          ) : (

            /* ========================================================= */
            /* EDIT MODE: FORM TO INPUT NEW DETAILS                     */
            /* ========================================================= */
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xs font-black uppercase text-blue-600 tracking-wider">
                Edit Personal Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:outline-none transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:outline-none transition cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:outline-none transition"
                  />
                </div>
              </div>

              {isDriver && (
                <>
                  <hr className="border-slate-100 my-4" />
                  <h3 className="text-xs font-black uppercase text-amber-600 tracking-wider">
                    Edit Driver Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Driving License ID</label>
                      <input
                        type="text"
                        name="licenseId"
                        value={formData.licenseId}
                        onChange={handleChange}
                        required={isDriver}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Vehicle Model</label>
                      <input
                        type="text"
                        name="vehicleModel"
                        value={formData.vehicleModel}
                        onChange={handleChange}
                        required={isDriver}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Vehicle Number</label>
                      <input
                        type="text"
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        required={isDriver}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:outline-none transition uppercase"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 flex items-center gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition active:scale-[0.98] flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}