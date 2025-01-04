"use client";

import { create } from "zustand";

import * as authApi from "../api/auth";
import { creditWelcomeBonus, getWalletBalance } from "../api/wallet";

const useAuthStore = create((set) => ({
  user: null,
  tokens: 0,
  loading: true,
  tokenLoading: false,
  error: null,
  showWelcomeModal: false,
  setUser: (user) => set({ user }),
  setTokens: (tokens) => set({ tokens }),
  setLoading: (loading) => set({ loading }),
  setTokenLoading: (tokenLoading) => set({ tokenLoading }),
  setError: (error) => set({ error }),
  setShowWelcomeModal: (show) => set({ showWelcomeModal: show }),
}));

export function useAuth() {
  const {
    user,
    tokens,
    loading,
    tokenLoading,
    showWelcomeModal,
    setUser,
    setTokens,
    setLoading,
    setTokenLoading,
    setError,
    setShowWelcomeModal,
  } = useAuthStore();

  const clearAuthData = () => {
    setUser(null);
    setTokens(0);
  };

  const fetchTokens = async () => {
    if (!user) return;

    try {
      setTokenLoading(true);
      const walletData = await getWalletBalance();
      if (walletData?.balance !== undefined) {
        setTokens(walletData.balance);
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setTokenLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login(credentials);

      if (response?.user) {
        setUser(response.user);

        if (!response.user.hasReceivedWelcomeBonus) {
          try {
            await creditWelcomeBonus();
            await fetchTokens();
            await authApi.markBonusReceived();
            setShowWelcomeModal(true);
          } catch (error) {
            console.error("Failed to credit welcome bonus:", error);
          }
        } else {
          await fetchTokens();
        }

        return { user: response.user };
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      clearAuthData();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authApi.logout();
      clearAuthData();
    } catch (error) {
      console.error("Logout failed:", error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      setLoading(true);
      const response = await authApi.checkSession();
      const userData = response?.data?.user;

      if (userData) {
        setUser(userData);
        await fetchTokens();
      } else {
        clearAuthData();
      }

      return response;
    } catch (error) {
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    tokens,
    loading,
    tokenLoading,
    showWelcomeModal,
    login,
    logout,
    checkSession,
    fetchTokens,
    setShowWelcomeModal,
  };
}
