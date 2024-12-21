import api from "@/services/axiosInstance";

import { LoginCredentials, RegisterCredentials, User } from "@/types/auth";

export async function loginUser(credentials: LoginCredentials) {
  const response = await api.post("/api/auth/login", credentials);
  // Extract user from the nested data structure
  return { user: response.data.data.user };
}

export async function registerUser(credentials: RegisterCredentials) {
  const response = await api.post("/api/auth/register", credentials);
  return response.data;
}

export async function logoutUser() {
  const response = await api.post("/api/auth/logout");
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/api/auth/session");
  // Handle the session response format
  return { user: response.data.data?.user || null };
}

export async function verifyEmail(token: string) {
  const response = await api.get(`/api/auth/verify-email?token=${token}`);
  return response.data;
}
