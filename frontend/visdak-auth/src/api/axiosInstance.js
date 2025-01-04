import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Response interceptor for handling errors and token refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Exclude certain endpoints from interceptor logic
    const excludedUrls = [
      "/api/auth/refresh-token",
      "/api/auth/session",
      "/api/auth/login",
    ];
    if (
      !originalRequest.url ||
      excludedUrls.some((url) => originalRequest.url.includes(url)) ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token
        await api.post("/api/auth/refresh-token");

        // Retry the original request
        const response = await api(originalRequest);
        return response;
      } catch (refreshError) {
        // If refreshing fails, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
