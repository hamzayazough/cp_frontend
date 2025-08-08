"use client";

import { useState, useEffect } from "react";
import { useMessaging } from "@/hooks/useMessaging";
import { MessageThreadResponse } from "@/interfaces/messaging";
import { auth } from "@/lib/firebase";
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default function AdvertiserMessagesContent() {
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] =
    useState<MessageThreadResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get Firebase token
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
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
    isLoadingThreads,
    isLoadingMessages,
    isSendingMessage,
    error,
    sendMessage,
    joinThread,
    loadMessages,
    loadThreads,
    markAsRead,
  } = useMessaging(firebaseToken, {
    autoConnect: true,
  });

  // Load threads on mount
  useEffect(() => {
    if (firebaseToken && isConnected) {
      loadThreads();
    }
  }, [firebaseToken, isConnected, loadThreads]);

  // Filter threads based on search
  const filteredThreads = threads.filter(
    (thread) =>
      thread.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.promoter?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      thread.advertiser?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Get messages for selected thread
  const threadMessages = selectedThread
    ? messages
        .filter((msg) => msg.threadId === selectedThread.id)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
    : [];

  // Handle thread selection
  const handleThreadSelect = (thread: MessageThreadResponse) => {
    setSelectedThread(thread);
    joinThread(thread.id);
    loadMessages(thread.id);

    // Mark thread as read
    if (thread.unreadCount && thread.unreadCount > 0) {
      markAsRead(thread.id);
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

  // Format thread time
  const formatThreadTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
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
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-200px)]">
      <div className="flex h-full">
        {/* Threads Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Campaign Messages
              </h2>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                title="New Message"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingThreads ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="text-center py-8">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  No conversations yet
                </h3>
                <p className="text-xs text-gray-500">
                  Conversations about your campaigns will appear here
                </p>
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => handleThreadSelect(thread)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedThread?.id === thread.id
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {thread.promoter?.username?.charAt(0).toUpperCase() ||
                          "P"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {thread.subject || "Campaign Discussion"}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatThreadTime(
                            thread.lastMessageAt || thread.createdAt
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {thread.promoter?.username || "Promoter"}
                      </p>
                      {thread.messages && thread.messages.length > 0 && (
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {thread.messages[0].content}
                        </p>
                      )}
                      {thread.unreadCount && thread.unreadCount > 0 && (
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-blue-600 font-medium">
                            {thread.unreadCount} new message
                            {thread.unreadCount > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {selectedThread.promoter?.username
                        ?.charAt(0)
                        .toUpperCase() || "P"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {selectedThread.subject || "Campaign Discussion"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedThread.promoter?.username || "Promoter"}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-xs text-gray-500">
                      {isConnected ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : threadMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No messages in this conversation yet.
                    </p>
                  </div>
                ) : (
                  threadMessages.map((message) => {
                    const isOwnMessage = message.senderType === "ADVERTISER";

                    return (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          isOwnMessage ? "justify-end" : "justify-start"
                        }`}
                      >
                        {/* Avatar for other users only (left side) */}
                        {!isOwnMessage && (
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {message.sender?.username
                                ?.charAt(0)
                                .toUpperCase() || "P"}
                            </span>
                          </div>
                        )}

                        {/* Message bubble */}
                        <div
                          className={`max-w-xs lg:max-w-md ${
                            isOwnMessage ? "ml-auto" : ""
                          }`}
                        >
                          <div
                            className={`px-4 py-2 rounded-lg ${
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
                        </div>
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
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <textarea
                      placeholder="Type your message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={1}
                      style={{ minHeight: "40px", maxHeight: "120px" }}
                      disabled={!isConnected || isSendingMessage}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          const content = (
                            e.target as HTMLTextAreaElement
                          ).value.trim();
                          if (content && selectedThread) {
                            sendMessage(selectedThread.id, content);
                            (e.target as HTMLTextAreaElement).value = "";
                          }
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const textarea = document.querySelector("textarea");
                      const content = textarea?.value.trim();
                      if (content && selectedThread) {
                        sendMessage(selectedThread.id, content);
                        if (textarea) textarea.value = "";
                      }
                    }}
                    disabled={!isConnected || isSendingMessage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
