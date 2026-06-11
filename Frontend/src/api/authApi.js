import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signup = (userData) => {
  return API.post("/auth/signup", userData);
};

export const login = (credentials) => {
  return API.post("/auth/login", credentials);
};

export default API;