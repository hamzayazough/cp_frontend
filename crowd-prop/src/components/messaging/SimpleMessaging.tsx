"use client";

import { useState, useEffect } from "react";
import { useMessaging } from "@/hooks/useMessaging";
import { MessageThreadResponse } from "@/interfaces/messaging";
import { auth } from "@/lib/firebase";

interface SimpleMessagingProps {
  currentUser: {
    id: string;
    firebaseUid: string;
    name: string;
  };
}

export default function SimpleMessaging({ currentUser }: SimpleMessagingProps) {
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);

  // Get Firebase token
  useEffect(() => {
    const getFirebaseToken = async () => {
      if (auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken();
          setFirebaseToken(token);
        } catch (error) {
          console.error("Failed to get Firebase token:", error);
        }
      }
    };

    getFirebaseToken();
  }, []);

  // Initialize messaging
  const {
    isConnected,
    threads,
    messages,
    isLoadingThreads,
    error,
    loadThreads,
  } = useMessaging(firebaseToken, {
    autoConnect: true,
  });

  // Load threads on mount
  useEffect(() => {
    if (firebaseToken && currentUser) {
      loadThreads();
    }
  }, [firebaseToken, currentUser, loadThreads]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>

      {/* Connection Status */}
      <div className="mb-4 flex items-center space-x-2">
        <div
          className={`h-2 w-2 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-sm text-gray-600">
          {isConnected ? "Connected to messaging service" : "Disconnected"}
        </span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 mb-4 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoadingThreads && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      )}

      {/* Threads List */}
      {!isLoadingThreads && (
        <div className="space-y-4">
          {threads.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No conversations yet. Start messaging when you apply to campaigns!
            </p>
          ) : (
            threads.map((thread) => {
              const otherParticipant =
                thread.promoter?.id === currentUser.id
                  ? thread.advertiser
                  : thread.promoter;

              return (
                <div
                  key={thread.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {otherParticipant?.username || "Unknown User"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Campaign: {thread.campaign?.title || "No campaign"}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Last message:{" "}
                        {new Date(thread.lastMessageAt).toLocaleDateString()}
                      </p>
                    </div>
                    {(thread.unreadCount || 0) > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* API Status */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Integration Status</h4>
        <div className="space-y-1 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Threads loaded:</span>{" "}
            {threads.length}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Total messages:</span>{" "}
            {messages.length}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">WebSocket:</span>{" "}
            {isConnected ? "Connected" : "Disconnected"}
          </p>
        </div>
      </div>
    </div>
  );
}
