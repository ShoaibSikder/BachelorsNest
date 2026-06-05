import axios from "axios";
import API_BASE_URL from "../config";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  // Don't add auth header for login/token endpoints
  const isAuthEndpoint = config.url?.includes("token");

  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If there's no response, it's a network error
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/token/refresh/`,
          { refresh: refreshToken },
        );

        const newAccessToken = response.data.access;

        localStorage.setItem("access_token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    // For all other errors (including 400, 500, etc.), just pass them through
    return Promise.reject(error);
  },
);

export default api;
