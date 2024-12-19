import api from "@/services/axiosInstance";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials) {
  const response = await api.post("/api/auth/login", credentials);
  return response.data;
}

export async function register(credentials: RegisterCredentials) {
  const response = await api.post("/api/auth/register", credentials);
  return response.data;
}

export async function logout() {
  const response = await api.post("/api/auth/logout");
  return response.data;
}
