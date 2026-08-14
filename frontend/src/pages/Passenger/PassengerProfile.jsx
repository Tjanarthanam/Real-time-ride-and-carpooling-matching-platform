import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  CheckCircle2,
  Save,
  Edit3,
  X,
  Loader2,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import {
  getPassengerProfile,
  updatePassengerProfile,
} from "../../api/passengerProfileApi";

export default function PassengerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Custom Modal State (Replaces native browser alert)
  const [showModal, setShowModal] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "Male",
    role: "PASSENGER",
  });

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getPassengerProfile();
      const profile = response.data || {};

      setFormData({
        fullName: profile.name || profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || profile.phoneNumber || "",
        gender: profile.gender || "Male",
        role: profile.role || "PASSENGER",
      });
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const currentStoredEmail = localStorage.getItem("email");
    const isEmailChanged =
      formData.email.trim().toLowerCase() !==
      currentStoredEmail?.trim().toLowerCase();

    try {
      await updatePassengerProfile({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        role: formData.role,
      });

      // Show sleek custom modal instead of ugly native browser alert
      if (isEmailChanged) {
        setShowModal(true);
        return;
      }

      setIsEditing(false);
      setIsSaved(true);

      await fetchUserProfile();

      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Failed to update profile. Please try again.");
      }
    }
  };

  const handleModalProceed = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 size={36} className="text-blue-600 animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pt-28 pb-16 px-6 sm:px-10 lg:px-16 relative">
      
      {/* ================= STYLISH CUSTOM ALERT MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 transform transition-all scale-100">
            
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                Security Session Refresh
              </h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Your email address was updated successfully to{" "}
                <span className="text-blue-600 font-bold">{formData.email}</span>.
                Please sign in again to generate your new secure access token.
              </p>
            </div>

            <button
              onClick={handleModalProceed}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <LogOut size={16} />
              <span>Sign In with New Email</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-950">My Profile</h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              {isEditing
                ? "Editing account details"
                : "Your personal account information"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-black uppercase px-3.5 py-1.5 rounded-xl border ${
                formData.role === "ADMIN"
                  ? "bg-purple-100 text-purple-900 border-purple-200"
                  : formData.role === "DRIVER"
                  ? "bg-amber-100 text-amber-900 border-amber-200"
                  : "bg-blue-100 text-blue-900 border-blue-200"
              }`}
            >
              {formData.role}
            </span>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
              >
                <Edit3 size={15} />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setErrorMessage("");
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition"
              >
                <X size={15} />
                Cancel
              </button>
            )}
          </div>
        </div>

        {isSaved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-2xl flex items-center gap-3">
            <CheckCircle2 size={20} />
            <span className="text-sm font-bold">
              Profile updated successfully!
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl text-sm font-bold">
            {errorMessage}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-slate-100 overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={55} className="text-slate-400" />
                )}
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-md"
                >
                  <Camera size={18} />
                </button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <h2 className="text-2xl font-black mt-4 text-slate-900">
              {formData.fullName || "User Profile"}
            </h2>

            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">
              {formData.role} Account
            </p>
          </div>

          {!isEditing ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <User className="text-blue-600" size={20} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">
                        Full Name
                      </p>
                      <p className="text-sm font-extrabold text-slate-800">
                        {formData.fullName || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <Phone className="text-blue-600" size={20} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">
                        Phone Number
                      </p>
                      <p className="text-sm font-extrabold text-slate-800">
                        {formData.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3 sm:col-span-2">
                    <Mail className="text-blue-600" size={20} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">
                        Email Address
                      </p>
                      <p className="text-sm font-extrabold text-slate-800">
                        {formData.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <User className="text-blue-600" size={20} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">
                        Gender
                      </p>
                      <p className="text-sm font-extrabold text-slate-800">
                        {formData.gender}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
              >
                <Edit3 size={18} />
                Update Profile Details
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xs font-black uppercase text-blue-600 tracking-wider">
                Edit Personal Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 mt-6 cursor-pointer shadow-md transition"
              >
                <Save size={18} />
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}