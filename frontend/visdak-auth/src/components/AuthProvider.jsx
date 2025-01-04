"use client";

import { createContext, useContext, useEffect } from "react";

import { WelcomeBonusModal } from "@/components/welcome-bonus-modal";

import { useAuth } from "../hooks/useAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuth();
  const {
    user,
    checkSession,
    fetchTokens,
    showWelcomeModal,
    setShowWelcomeModal,
  } = auth;

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTokens();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
      <WelcomeBonusModal
        open={showWelcomeModal}
        onOpenChange={(isOpen) => {
          setShowWelcomeModal(isOpen);
          if (!isOpen) {
            fetchTokens();
          }
        }}
      />
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
