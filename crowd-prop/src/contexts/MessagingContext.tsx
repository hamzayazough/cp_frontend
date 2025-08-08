"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { useMessaging } from "@/hooks/useMessaging";
import messagingService from "@/services/messaging.service";
import {
  MessageResponse,
  MessageThreadResponse,
  NotificationPayload,
} from "@/interfaces/messaging";

interface MessagingContextType {
  // Connection state
  isConnected: boolean;

  // Data
  threads: MessageThreadResponse[];
  unreadCount: number;

  // Loading states
  isLoadingThreads: boolean;

  // Error state
  error: string | null;

  // Methods
  refreshThreads: () => Promise<void>;
  markThreadAsRead: (threadId: string) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(
  undefined
);

interface MessagingProviderProps {
  children: ReactNode;
}

export const MessagingProvider: React.FC<MessagingProviderProps> = ({
  children,
}) => {
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);

  // Get Firebase auth state and token
  useEffect(() => {
    const getFirebaseToken = async (user: User) => {
      try {
        const token = await user.getIdToken();
        setFirebaseToken(token);
      } catch (error) {
        console.error("Failed to get Firebase token:", error);
        setFirebaseToken(null);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getFirebaseToken(user);
      } else {
        setFirebaseToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Initialize messaging hook
  const {
    isConnected,
    threads,
    unreadCount,
    isLoadingThreads,
    error,
    loadThreads,
    markAsRead,
    refreshThreads,
  } = useMessaging(firebaseToken, {
    autoConnect: true, // Always connect when token is available
  });

  // Load threads when connected
  useEffect(() => {
    if (isConnected && firebaseToken) {
      loadThreads();
    }
  }, [isConnected, firebaseToken, loadThreads]);

  // Set up global message notifications
  useEffect(() => {
    if (!isConnected) return;

    // Handle new messages globally
    const handleNewMessage = (message: MessageResponse) => {
      console.log("📨 New message received globally:", message);

      // Show browser notification if permission granted
      if (Notification.permission === "granted") {
        new Notification("New Message", {
          body: `${message.sender?.username || "Someone"}: ${message.content}`,
          icon: "/cp_logo.png",
        });
      }
    };

    // Handle general notifications
    const handleNotification = (notification: NotificationPayload) => {
      console.log("📢 Global notification:", notification);
    };

    // Register event listeners
    messagingService.onNewMessage(handleNewMessage);
    messagingService.onNotification(handleNotification);

    return () => {
      // Cleanup event listeners
      messagingService.offNewMessage(handleNewMessage);
    };
  }, [isConnected]);

  // Mark thread as read method
  const markThreadAsRead = (threadId: string) => {
    markAsRead(threadId);
  };

  const contextValue: MessagingContextType = {
    // Connection state
    isConnected,

    // Data
    threads,
    unreadCount,

    // Loading states
    isLoadingThreads,

    // Error state
    error,

    // Methods
    refreshThreads,
    markThreadAsRead,
  };

  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
    </MessagingContext.Provider>
  );
};

// Hook to use messaging context
export const useMessagingContext = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error(
      "useMessagingContext must be used within a MessagingProvider"
    );
  }
  return context;
};
