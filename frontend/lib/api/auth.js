import api from "../axiosInstance";

export async function login(credentials) {
  const response = await api.post("/api/auth/login", credentials);
  return { user: response.data.data.user };
}

export async function logout() {
  const response = await api.post("/api/auth/logout");
  return response.data;
}

export async function checkSession() {
  const response = await api.get("/api/auth/session");
  return response.data;
}

export async function verifyEmail(token) {
  const response = await api.post(`/api/auth/verify-email`, { token });
  return response.data;
}
