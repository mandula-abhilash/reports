import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Exclude certain endpoints from interceptor logic
    const excludedUrls = ["/api/auth/refresh-token", "/api/auth/session"];
    if (
      excludedUrls.some((url) => originalRequest.url.includes(url)) ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      originalRequest._retry = true;
      try {
        await api.post("/api/auth/refresh-token");
        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
