import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://laporpak-production.up.railway.app/api",
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

export const getAllReports = async (params = {}) => {
  try {
    const response = await api.get("/reports", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getReportDetail = async (id) => {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProfile = async (id, data) => {
  try {
    const response = await api.put(`/users/${id}/profile`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const changePassword = async (id, data) => {
  try {
    const response = await api.put(`/users/${id}/password`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateReportStatus = async (id, statusData) => {
  try {
    const response = await api.put(`/reports/${id}`, statusData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteReport = async (id) => {
  try {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addStaff = async (staffData, token = null) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '', 
      },
    };

    const response = await api.post('/staff', staffData, config);

    return response.data; 
  } catch (error) {
    throw error.response?.data || error; 
  }
};

export const updateStaff = async (id, staffData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      },
    };

    const response = await api.put(`/staff/${id}`, staffData, config);

    return response.data; 
  } catch (error) {
    throw error.response?.data || error; 
  }
};

export const deleteStaff = async (id, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await api.delete(`/staff/${id}`, config);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error('Gagal menghapus staff: Respons tidak valid.');
    }
  } catch (error) {
    throw error.response?.data || error.message || error; 
  }
};

export default api;