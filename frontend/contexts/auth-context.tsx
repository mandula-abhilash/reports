"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { AuthState, LoginCredentials, User } from "@/types/auth";
import { getCurrentUser, loginUser, logoutUser } from "@/lib/api/auth";
import { getWalletBalance } from "@/lib/api/wallet";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  tokens: 0,
  loading: true,
  tokenLoading: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();
  const { toast } = useToast();

  const fetchTokens = useCallback(async () => {
    if (!state.user) return;

    try {
      setState((prev) => ({ ...prev, tokenLoading: true }));
      const { balance } = await getWalletBalance();
      setState((prev) => ({ ...prev, tokens: balance }));
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setState((prev) => ({ ...prev, tokenLoading: false }));
    }
  }, [state.user]);

  const clearAuthData = () => {
    setState((prev) => ({ ...prev, user: null, tokens: 0 }));
  };

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { user } = await getCurrentUser();

        if (isMounted && user) {
          setState((prev) => ({ ...prev, user }));
        } else if (isMounted) {
          clearAuthData();
        }
      } catch (error) {
        if (isMounted) {
          clearAuthData();
        }
      } finally {
        if (isMounted) {
          setState((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (state.user) {
      fetchTokens();
    }
  }, [state.user, fetchTokens]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const { user } = await loginUser(credentials);
      if (!user) {
        throw new Error("Login failed - No user data received");
      }
      setState((prev) => ({ ...prev, user }));
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      clearAuthData();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      clearAuthData();
      router.push("/login");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      clearAuthData();
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Please try again later.",
      });
    }
  };

  const value = {
    ...state,
    login,
    logout,
    fetchTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
