import api from "./axiosClient";

export const getMyRides = () => {
    return api.get("/rides/my-rides");
};