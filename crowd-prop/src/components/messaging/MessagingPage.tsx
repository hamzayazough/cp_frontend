import React, { useState, useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuth";
import { MessageThreadList } from "@/components/messaging/MessageThreadList";
import { MessageThread } from "@/components/messaging/MessageThread";
import { MessageThreadResponse } from "@/interfaces/messaging";

interface MessagingPageProps {
  initialThreadId?: string;
  campaignId?: string;
}

export const MessagingPage: React.FC<MessagingPageProps> = ({ campaignId }) => {
  const { user } = useAuthGuard();
  const [selectedThread, setSelectedThread] =
    useState<MessageThreadResponse | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);

  // Get Firebase token
  useEffect(() => {
    const getToken = async () => {
      if (user) {
        try {
          // You'll need to import this from your auth service
          // const token = await authService.getCurrentUserToken();
          // setFirebaseToken(token);

          // For now, we'll use a placeholder
          // You should implement getting the actual Firebase token
          setFirebaseToken("firebase-token-placeholder");
        } catch (error) {
          console.error("Failed to get Firebase token:", error);
        }
      }
    };

    getToken();
  }, [user]);

  // Handle responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle thread selection
  const handleThreadSelect = (thread: MessageThreadResponse) => {
    setSelectedThread(thread);
  };

  // Handle back navigation on mobile
  const handleBackToList = () => {
    setSelectedThread(null);
  };

  if (!user || !token) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Please log in to access messages.</div>
      </div>
    );
  }

  // Mobile view: show either list or thread
  if (isMobileView) {
    return (
      <div className="h-screen flex flex-col">
        {selectedThread ? (
          <div className="flex flex-col h-full">
            {/* Mobile header with back button */}
            <div className="border-b border-gray-200 p-4 bg-white flex items-center">
              <button
                onClick={handleBackToList}
                className="mr-3 text-blue-600 hover:text-blue-800"
              >
                ← Back
              </button>
              <h1 className="text-lg font-semibold">Messages</h1>
            </div>
            <div className="flex-1">
              <MessageThread
                threadId={selectedThread.id}
                firebaseToken={token}
                currentUserId={user.id}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="border-b border-gray-200 p-4 bg-white">
              <h1 className="text-lg font-semibold">Messages</h1>
            </div>
            <div className="flex-1">
              <MessageThreadList
                firebaseToken={token}
                currentUserId={user.id}
                onThreadSelect={handleThreadSelect}
                selectedThreadId={selectedThread?.id}
                campaignId={campaignId}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop view: show both list and thread side by side
  return (
    <div className="h-screen flex">
      {/* Thread List Sidebar */}
      <div className="w-1/3 min-w-80 border-r border-gray-200">
        <MessageThreadList
          firebaseToken={token}
          currentUserId={user.id}
          onThreadSelect={handleThreadSelect}
          selectedThreadId={selectedThread?.id}
          campaignId={campaignId}
        />
      </div>

      {/* Message Thread Content */}
      <div className="flex-1">
        {selectedThread ? (
          <MessageThread
            threadId={selectedThread.id}
            firebaseToken={token}
            currentUserId={user.id}
          />
        ) : (
          <div className="flex justify-center items-center h-full bg-gray-50">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-600">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
