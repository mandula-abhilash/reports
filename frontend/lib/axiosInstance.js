import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  credentials: "include",
});

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
        if (
          typeof window !== "undefined" &&
          !originalRequest.url.includes("/api/auth/")
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
