"use client";

import { useEffect, useState } from "react";
import { useMessagingContext } from "@/contexts/MessagingContext";
import { MessageThreadResponse } from "@/interfaces/messaging";

export default function MessagingTestPage() {
  // Use the global messaging context
  const {
    isConnected,
    threads,
    unreadCount,
    isLoadingThreads,
    error,
    refreshThreads,
  } = useMessagingContext();

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    // Test loading threads
    const testMessaging = async () => {
      try {
        console.log("🔄 Testing messaging context...");
        await refreshThreads();
        console.log("✅ Messaging context test completed");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setLocalError(errorMessage);
        console.error("❌ Messaging context test failed:", err);
      }
    };

    // Only test if connected
    if (isConnected) {
      testMessaging();
    }
  }, [isConnected, refreshThreads]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Messaging Service Test</h1>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Connection Status:</h2>
        <div
          className={`inline-block px-3 py-1 rounded ${
            isConnected
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          <h3 className="font-semibold">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-blue-100 p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">Service Features Available:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>✅ WebSocket connection to backend</li>
          <li>✅ REST API calls for threads and messages</li>
          <li>✅ Real-time message sending/receiving</li>
          <li>✅ Typing indicators</li>
          <li>✅ Read receipts</li>
          <li>✅ React hook for easy state management</li>
        </ul>
      </div>

      <div className="bg-yellow-100 p-4 rounded">
        <h3 className="font-semibold mb-2">
          To Use in Your Existing Components:
        </h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            Import the <code>useMessaging</code> hook
          </li>
          <li>Replace mock data with real API calls</li>
          <li>Add WebSocket listeners for real-time updates</li>
          <li>Use the messaging service methods</li>
        </ol>
      </div>
    </div>
  );
}
