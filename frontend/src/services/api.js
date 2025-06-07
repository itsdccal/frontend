import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const login = async (data) => {
  try {
    const response = await api.post("/login", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const register = async (data) => {
  try {
    const response = await api.post("/register", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUsers = async (params) => {
  try {
    const response = await api.get("/users", { params });
    return response.data; 
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserDetail = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data; 
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createReport = async (formData) => {
  try {
    const response = await api.post("/reports", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data; 
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
