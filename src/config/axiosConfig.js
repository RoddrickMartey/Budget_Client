import axios from "axios";

const API = axios.create({
  baseURL: "https://budget-api-002e.onrender.com/api", // Adjust base URL as needed
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach token to request headers if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Adjust if using AsyncStorage for React Native
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Authentication Routes
export const loginUser = async (userData) => {
  const response = await API.post("/user/login", userData);
  return response.data;
};
export const logoutUser = async () => await API.post("/user/logout");

// Transaction Routes
export const getUserTransactions = async () => {
  const response = await API.get("/user/transactions");
  return response.data.transactions;
};

export const getAllUserTransactions = async () => {
  const response = await API.get("/user/all/transactions");
  return response.data.transactions;
};

export const createTransaction = async (transactionData) => {
  const response = await API.post("/user/transactions", transactionData);
  return response.data.balance;
};
export const deleteTransaction = async (transactionId) => {
  const response = await API.delete(`/user/transactions/${transactionId}`);
  return response.data.balance;
};
export const reset = async () => {
  const response = await API.post("/user/reset");
  console.log(response.data);

  return response.data.user;
};

export default API;
