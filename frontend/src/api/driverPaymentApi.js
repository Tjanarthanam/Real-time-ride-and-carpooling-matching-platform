import api from "./axiosClient";

export const getDriverPayments = () => {
    return api.get("/payments/driver-history");
};