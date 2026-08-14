import api from "./axiosClient";

// Get Driver Profile
export const getProfile = () => {
    return api.get("/profile");
};

// Update Driver Profile
export const updateProfile = (profileData) => {
    return api.put("/profile", profileData);
};