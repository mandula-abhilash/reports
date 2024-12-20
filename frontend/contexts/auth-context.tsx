"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  tokens: number;
  loading: boolean;
  tokenLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tokenLoading, setTokenLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchTokens = useCallback(async () => {
    if (!user) return;

    try {
      setTokenLoading(true);
      const response = await fetch("/api/wallet", {
        credentials: "include",
      });
      const data = await response.json();
      if (data?.balance !== undefined) {
        setTokens(data.balance);
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
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const data = await response.json();
        
        if (isMounted && data?.user) {
          setUser(data.user);
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

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setUser(data.user);
      router.push("/dashboard");
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
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}