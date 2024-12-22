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

    // When a 401 error occurs:
    if (error.response && error.response.status === 401) {
      originalRequest._retry = true;
      try {
        // 1. First try to get a new access token using the refresh token
        await api.post("/api/auth/refresh-token");

        // 2. After getting new tokens, retry the original failed request
        const response = await api(originalRequest);

        // 3. Return the response from the retried request
        return response;
      } catch (refreshError) {
        // If refresh token fails, redirect to login
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
