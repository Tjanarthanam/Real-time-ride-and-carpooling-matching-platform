// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8081/api/payments",
// });

// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export const makePayment = (paymentData) =>
//   API.post("/pay", paymentData);

// export const getPaymentHistory = () =>
//   API.get("/history");


import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081/api/payments",
});

// Add JWT Token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Make Payment
export const makePayment = (paymentData) => {
  return API.post("/pay", paymentData);
};

// Payment History
export const getPaymentHistory = () => {
  return API.get("/history");
};