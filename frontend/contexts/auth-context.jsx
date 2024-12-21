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
import { useToast } from "@/components/ui/use-toast";

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
  const [tokenLoading, setTokenLoading] = useState(false);
  const { toast } = useToast();

  const fetchTokens = useCallback(async () => {
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
  }, [user]);

  const clearAuthData = () => {
    setUser(null);
    setTokens(0);
  };

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await checkSession();
        const userData = response?.data?.user;
        if (isMounted && userData) {
          setUser(userData);
        } else if (isMounted) {
          clearAuthData();
        }
      } catch (error) {
        if (isMounted) {
          clearAuthData();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchTokens();
    }
  }, [user, fetchTokens]);

  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials);
      if (response?.user) {
        setUser(response.user);

        if (!response.user.hasReceivedWelcomeBonus) {
          try {
            await creditWelcomeBonus();
            await markBonusReceived();
            toast({
              title: "Welcome Bonus",
              description: "You've received 50 tokens as a welcome bonus!",
            });
          } catch (error) {
            console.error("Failed to credit welcome bonus:", error);
          }
        }

        return { user: response.user };
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      clearAuthData();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      clearAuthData();
    } catch (error) {
      console.error("Logout failed:", error);
      clearAuthData();
    }
  };

  const value = {
    user,
    tokens,
    loading,
    tokenLoading,
    login,
    logout,
    fetchTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
