import { create } from "zustand";

import * as authApi from "../api/auth";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export function useAuth() {
  const { user, loading, error, setUser, setLoading, setError } =
    useAuthStore();

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await authApi.logout();
      setUser(null);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.checkSession();
      setUser(response?.data?.user || null);
      return response;
    } catch (error) {
      setError(error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkSession,
  };
}
