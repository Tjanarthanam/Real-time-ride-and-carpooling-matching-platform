import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

import { getProfile, updateProfile } from "../../api/profileApi";
export default function DriverProfile() {

  const isDriver = true;
  const userRole = "driver";

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState(null);

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "Male",
    licenseId: "",
    vehicleModel: "",
    vehicleNumber: "",
  });

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      const response = await getProfile();
      const profile = response.data;

      setFormData({
        fullName: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        gender: profile.gender || "Male",
        licenseId: profile.licenseNumber || "",
        vehicleModel: profile.vehicleModel || "",
        vehicleNumber: profile.vehicleNumber || "",
      });
    } catch (error) {
      console.error("Failed to load profile", error);
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

    try {
      await updateProfile({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        licenseNumber: formData.licenseId,
        vehicleModel: formData.vehicleModel,
        vehicleNumber: formData.vehicleNumber,
      });

      setIsEditing(false);

      setIsSaved(true);

      await fetchUserProfile();

      setTimeout(() => {
        setIsSaved(false);
      }, 3000);

    } catch (error) {
      console.error("Update failed", error);
    }
  };

if (loading) {
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
      <Loader2 size={36} className="text-blue-600 animate-spin mb-3" />
      <p className="text-sm font-bold text-slate-500">
        Loading profile details...
      </p>
    </div>
  );
}

return (
  <div className="w-full min-h-screen bg-[#F8FAFC] pt-28 pb-16 px-6 sm:px-10 lg:px-16">
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-black text-slate-950">
            My Profile
          </h1>

          <p className="text-sm font-semibold text-slate-500 mt-1">
            {isEditing
              ? "Editing account details"
              : "Your account details and driver credentials"}
          </p>
        </div>

        <div className="flex items-center gap-3">

          <span className="text-xs font-black uppercase px-3.5 py-1.5 rounded-xl border bg-amber-100 text-amber-900 border-amber-200">
            Driver
          </span>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md flex items-center gap-2"
            >
              <Edit3 size={15} />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2"
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
          <span>Profile updated successfully!</span>
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
                className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-2"
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

          <h2 className="text-2xl font-black mt-4">
            {formData.fullName}
          </h2>

          <p className="text-xs text-slate-400 uppercase">
            Driver Account
          </p>

        </div>

                {!isEditing ? (
          <div className="space-y-8">

            {/* Personal Information */}
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
                    <p className="text-sm font-extrabold">
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
                    <p className="text-sm font-extrabold">
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
                    <p className="text-sm font-extrabold">
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
                    <p className="text-sm font-extrabold">
                      {formData.gender}
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Driver Information */}

            <div>

              <h3 className="text-xs font-black uppercase text-amber-600 tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck size={16} />
                Driver & Vehicle Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 sm:col-span-2 flex items-center gap-3">
                  <FileText className="text-amber-700" size={20} />
                  <div>
                    <p className="text-[10px] font-black uppercase text-amber-700">
                      Driving License
                    </p>
                    <p className="text-sm font-black">
                      {formData.licenseId || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <Car className="text-slate-700" size={20} />
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Vehicle Model
                    </p>
                    <p className="text-sm font-black">
                      {formData.vehicleModel || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <Car className="text-slate-700" size={20} />
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Vehicle Number
                    </p>
                    <p className="text-sm font-black uppercase">
                      {formData.vehicleNumber || "N/A"}
                    </p>
                  </div>
                </div>

              </div>

            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2"
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

            </div>

            <hr className="border-slate-100" />

            <h3 className="text-xs font-black uppercase text-amber-600 tracking-wider">
              Driver Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div className="sm:col-span-2">

                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Driving License Number
                </label>

                <input
                  type="text"
                  name="licenseId"
                  value={formData.licenseId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />

              </div>

              <div>

                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Vehicle Model
                </label>

                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />

              </div>

              <div>

                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Vehicle Number
                </label>

                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl uppercase"
                  required
                />

              </div>

            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 mt-6"
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