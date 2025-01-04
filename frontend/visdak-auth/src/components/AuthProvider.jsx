"use client";

import { createContext, useContext, useEffect } from "react";

import { useAuth } from "../hooks/useAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children, config }) {
  const auth = useAuth();

  useEffect(() => {
    if (config?.baseURL) {
      authAxios.defaults.baseURL = config.baseURL;
    }
    auth.checkSession();
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
