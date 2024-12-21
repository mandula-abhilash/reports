"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  checkSession,
  login as loginApi,
  logout as logoutApi,
  markBonusReceived,
} from "@/lib/api/auth";
import { creditWelcomeBonus, getWalletBalance } from "@/lib/api/wallet";
import { WelcomeBonusModal } from "@/components/welcome-bonus-modal";

const defaultContext = {
  user: null,
  tokens: 0,
  loading: true,
  login: async () => {},
  logout: async () => {},
  fetchTokens: async () => {},
};

const AuthContext = createContext(defaultContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const fetchTokens = useCallback(async () => {
    if (!user) return;
    try {
      const walletData = await getWalletBalance();
      if (walletData?.balance !== undefined) {
        setTokens(walletData.balance);
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    }
  }, [user]);

  const clearAuthData = () => {
    setUser(null);
    setTokens(0);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkSession();
        const userData = response?.data?.user;
        if (userData) {
          setUser(userData);
          const walletData = await getWalletBalance();
          setTokens(walletData?.balance || 0);
        } else {
          clearAuthData();
        }
      } catch (error) {
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials);
      if (response?.user) {
        setUser(response.user);

        // Get initial token balance
        const walletData = await getWalletBalance();
        setTokens(walletData?.balance || 0);

        if (!response.user.hasReceivedWelcomeBonus) {
          try {
            await creditWelcomeBonus();
            await markBonusReceived();
            // Update tokens after welcome bonus
            const updatedWallet = await getWalletBalance();
            setTokens(updatedWallet?.balance || 0);
            setShowWelcomeModal(true);
          } catch (error) {
            console.error("Failed to credit welcome bonus:", error);
          }
        }

        return { user: response.user };
      }
      throw new Error("Login failed");
    } catch (error) {
      clearAuthData();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAuthData();
    }
  };

  const value = {
    user,
    tokens,
    loading,
    login,
    logout,
    fetchTokens,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <WelcomeBonusModal
        open={showWelcomeModal}
        onOpenChange={setShowWelcomeModal}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
