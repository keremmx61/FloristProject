import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7011/api", // Backend portunu kontrol et
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request:", config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  error => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => {
    console.log("Response:", response.status, response.data);
    return response;
  },
  error => {
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export default api;