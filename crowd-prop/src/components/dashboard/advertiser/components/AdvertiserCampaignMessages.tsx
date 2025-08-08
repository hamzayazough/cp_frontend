"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useMessaging } from "@/hooks/useMessaging";
import { MessageThreadResponse } from "@/interfaces/messaging";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import messagingService from "@/services/messaging.service";

interface AdvertiserCampaignMessagesProps {
  campaignId: string;
  campaignTitle?: string; // Optional campaign title for better UX
}

export default function AdvertiserCampaignMessages({
  campaignId,
  campaignTitle,
}: AdvertiserCampaignMessagesProps) {
  const [messageInput, setMessageInput] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const [campaignThread, setCampaignThread] =
    useState<MessageThreadResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [createThreadError, setCreateThreadError] = useState<string | null>(
    null
  );

  // Get Firebase auth state (simplified - backend handles user ID conversion)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const token = await user.getIdToken();
          setFirebaseToken(token);
        } catch (error) {
          console.error("Failed to get Firebase token:", error);
        }
      } else {
        setFirebaseToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Initialize messaging
  const {
    isConnected,
    threads,
    messages,
    typingUsers,
    isLoadingMessages,
    isSendingMessage,
    error,
    sendMessage,
    joinThread,
    leaveThread,
    loadMessages,
    loadThreads,
    getCampaignThread,
  } = useMessaging(firebaseToken, {
    autoConnect: true,
  });

  // Get campaign-specific thread
  const getCampaignThreadHandler = useCallback(async () => {
    try {
      const thread = await getCampaignThread(campaignId);
      if (thread) {
        setCampaignThread(thread);
      }
      // If thread is null, that's fine - it just means no thread exists yet
    } catch (error) {
      console.error("Failed to get campaign thread:", error);
      // Don't set error state here since missing thread is normal
    }
  }, [getCampaignThread, campaignId]);

  // Find or get thread for this campaign using the new endpoint
  useEffect(() => {
    if (firebaseToken && isConnected) {
      // Load threads filtered by this campaign ID
      loadThreads(undefined, undefined, campaignId);
      // Also try to get the campaign-specific thread
      getCampaignThreadHandler();
    }
  }, [
    firebaseToken,
    isConnected,
    loadThreads,
    getCampaignThreadHandler,
    campaignId,
  ]);

  // Look for existing thread for this campaign
  useEffect(() => {
    if (threads.length > 0) {
      // Find thread by campaign ID
      const existingThread = threads.find(
        (thread) => thread.campaignId === campaignId
      );

      if (existingThread) {
        setCampaignThread(existingThread);
      }
    }
  }, [threads, campaignId]);

  // Join the thread and load messages when thread is found
  useEffect(() => {
    if (campaignThread && isConnected) {
      joinThread(campaignThread.id);
      loadMessages(campaignThread.id);

      return () => {
        leaveThread(campaignThread.id);
      };
    }
  }, [campaignThread, isConnected, joinThread, leaveThread, loadMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Get campaign-specific messages and sort them by creation time (oldest first)
  const campaignMessages = campaignThread
    ? messages
        .filter((msg) => msg.threadId === campaignThread.id)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
    : [];

  // Handle sending message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !campaignThread || !currentUser) return;

    try {
      await sendMessage(campaignThread.id, messageInput.trim());
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle creating new thread (simplified - backend handles user ID)
  const handleCreateThread = async () => {
    if (!currentUser || !firebaseToken) return;

    setIsCreatingThread(true);
    setCreateThreadError(null);
    try {
      // Backend automatically determines advertiserId from Firebase token
      const newThread = await messagingService.createThread({
        campaignId,
      });

      setCampaignThread(newThread);
      // Refresh threads to get the updated list for this campaign
      loadThreads(undefined, undefined, campaignId);
    } catch (error) {
      console.error("Failed to create thread:", error);
      setCreateThreadError(
        error instanceof Error ? error.message : "Failed to create thread"
      );
    } finally {
      setIsCreatingThread(false);
    }
  };

  // Format message time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show error state
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-700"
        >
          Try again
        </button>
      </div>
    );
  }

  // Show loading state
  if (!isConnected || isLoadingMessages) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading messages...</p>
      </div>
    );
  }

  // Show empty state if no thread exists
  if (!campaignThread) {
    return (
      <div className="text-center py-8">
        <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No messages yet
        </h3>
        <p className="text-gray-600 mb-4">
          Start a conversation with the promoters about{" "}
          {campaignTitle || "this campaign"}
        </p>

        {createThreadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-800">
            Failed to create thread: {createThreadError}
          </div>
        )}

        <button
          onClick={() => {
            setCreateThreadError(null);
            handleCreateThread();
          }}
          disabled={isCreatingThread || !currentUser}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCreatingThread ? "Creating..." : "Start Conversation"}
        </button>
      </div>
    );
  }

  // Show messages interface
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 rounded-full p-2">
            <UserIcon className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Campaign Discussion</h3>
            <p className="text-sm text-gray-500">
              {campaignTitle || "Campaign Discussion"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-gray-500">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
          <button className="p-1 hover:bg-gray-100 rounded">
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {campaignMessages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No messages in this conversation yet.
            </p>
          </div>
        ) : (
          campaignMessages.map((message) => {
            // For advertisers, we'll assume they are the sender when senderType is 'ADVERTISER'
            const isOwnMessage = message.senderType === "ADVERTISER";

            return (
              <div
                key={message.id}
                className={`flex items-end space-x-2 ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar for other users (left side) */}
                {!isOwnMessage && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {message.sender?.username?.charAt(0).toUpperCase() || "P"}
                    </span>
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {!isOwnMessage && (
                    <p className="text-xs font-medium mb-1 opacity-75">
                      {message.sender?.username || "Promoter"}
                    </p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>

                {/* Avatar for own messages (right side) */}
                {isOwnMessage && (
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {currentUser?.displayName?.charAt(0).toUpperCase() || "A"}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {typingUsers.size > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-600">
                {Array.from(typingUsers).join(", ")}{" "}
                {typingUsers.size === 1 ? "is" : "are"} typing...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: "40px", maxHeight: "120px" }}
              disabled={!isConnected || isSendingMessage}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || !isConnected || isSendingMessage}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>

        {!isConnected && (
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
            <p className="text-yellow-800 text-xs">
              Disconnected from server. Trying to reconnect...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
