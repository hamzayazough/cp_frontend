"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import AuthErrorModal from "@/components/ui/AuthErrorModal";
import { setGlobalAuthErrorHandler } from "@/services/http.service";
import { setGlobalSocketErrorHandler } from "@/services/messaging.service";

interface ErrorHandlerContextType {
  showAuthError: () => void;
  hideAuthError: () => void;
}

const ErrorHandlerContext = createContext<ErrorHandlerContextType | undefined>(
  undefined
);

export function useErrorHandler() {
  const context = useContext(ErrorHandlerContext);
  if (context === undefined) {
    throw new Error(
      "useErrorHandler must be used within an ErrorHandlerProvider"
    );
  }
  return context;
}

interface ErrorHandlerProviderProps {
  children: React.ReactNode;
}

export function ErrorHandlerProvider({ children }: ErrorHandlerProviderProps) {
  const [showAuthErrorModal, setShowAuthErrorModal] = useState(false);

  const showAuthError = () => {
    setShowAuthErrorModal(true);
  };

  const hideAuthError = () => {
    setShowAuthErrorModal(false);
  };

  const handleReload = () => {
    window.location.reload();
  };

  // Set up global error handlers
  useEffect(() => {
    setGlobalAuthErrorHandler(showAuthError);
    setGlobalSocketErrorHandler(showAuthError);
  }, []);

  return (
    <ErrorHandlerContext.Provider value={{ showAuthError, hideAuthError }}>
      {children}
      <AuthErrorModal
        isOpen={showAuthErrorModal}
        onClose={hideAuthError}
        onReload={handleReload}
      />
    </ErrorHandlerContext.Provider>
  );
}
