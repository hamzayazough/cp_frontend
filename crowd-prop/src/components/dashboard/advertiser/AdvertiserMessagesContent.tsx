"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useMessaging } from "@/hooks/useMessaging";
import { MessageThreadResponse } from "@/interfaces/messaging";
import { auth } from "@/lib/firebase";
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

export default function AdvertiserMessagesContent() {
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] =
    useState<MessageThreadResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get Firebase token and user ID
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
    currentUserType: "ADVERTISER",
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
  const threadMessages = useMemo(() => {
    return selectedThread
      ? messages
          .filter((msg) => msg.threadId === selectedThread.id)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
      : [];
  }, [selectedThread, messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  // Handle thread selection
  const handleThreadSelect = async (thread: MessageThreadResponse) => {
    console.log("🎯 Selecting thread:", {
      threadId: thread.id,
      unreadCount: thread.unreadCount,
    });
    setSelectedThread(thread);
    joinThread(thread.id);
    loadMessages(thread.id);

    // Mark thread as read when selecting it
    console.log("📖 Calling markAsRead for thread:", thread.id);
    try {
      await markAsRead(thread.id);
      console.log("✅ Successfully marked thread as read");
    } catch (error) {
      console.error("❌ Failed to mark thread as read:", error);
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
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex h-full w-full">
        {/* Threads Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>

            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Connection Status */}
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-xs text-gray-600">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingThreads ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-gray-500">Loading conversations...</div>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-gray-500">No conversations yet</div>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = selectedThread?.id === thread.id;
                return (
                  <div
                    key={thread.id}
                    onClick={() => handleThreadSelect(thread)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isSelected ? "bg-blue-50 border-blue-200" : ""
                    } ${
                      (thread.unreadCount || 0) > 0
                        ? "border-l-4 border-l-orange-500 bg-orange-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {thread.promoter?.username
                              ?.charAt(0)
                              .toUpperCase() || "P"}
                          </span>
                        </div>
                        <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {thread.promoter?.username || "Promoter"}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatThreadTime(
                              thread.lastMessageAt || thread.createdAt
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-gray-600">
                            {thread.subject || "Campaign Discussion"}
                          </p>
                          {(thread.unreadCount || 0) > 0 && (
                            <span className="text-xs text-orange-600 font-semibold">
                              {thread.unreadCount} new message
                              {(thread.unreadCount || 0) > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate pr-2">
                            {thread.messages && thread.messages.length > 0
                              ? thread.messages[0].content
                              : "No messages yet"}
                          </p>
                        </div>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Private
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedThread ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {selectedThread.promoter?.username
                          ?.charAt(0)
                          ?.toUpperCase() || "P"}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedThread.promoter?.username || "Promoter"}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-600">
                          {selectedThread.subject || "Campaign Discussion"}
                        </p>
                        <span className="text-gray-400">•</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Private
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
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
                            className={`px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-900 border border-gray-200"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p
                            className={`text-xs text-gray-500 mt-1 ${
                              isOwnMessage ? "text-right" : "text-left"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                            {isOwnMessage && (
                              <span className="ml-2">
                                {message.isRead ? "✓✓" : "✓"}
                              </span>
                            )}
                          </p>
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

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <textarea
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-black"
                      rows={1}
                      style={{ minHeight: "40px", maxHeight: "120px" }}
                      disabled={!isConnected || isSendingMessage}
                      onFocus={async () => {
                        // Mark thread as read when user focuses on input
                        if (selectedThread) {
                          try {
                            await markAsRead(selectedThread.id);
                            console.log(
                              "✅ Marked thread as read on input focus"
                            );
                          } catch (error) {
                            console.error(
                              "❌ Failed to mark thread as read on focus:",
                              error
                            );
                          }
                        }
                      }}
                      onKeyPress={async (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          const content = (
                            e.target as HTMLTextAreaElement
                          ).value.trim();
                          if (content && selectedThread) {
                            await sendMessage(selectedThread.id, content);
                            (e.target as HTMLTextAreaElement).value = "";
                          }
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={async () => {
                      const textarea = document.querySelector("textarea");
                      const content = textarea?.value.trim();
                      if (content && selectedThread) {
                        await sendMessage(selectedThread.id, content);
                        if (textarea) textarea.value = "";
                      }
                    }}
                    disabled={!isConnected || isSendingMessage}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Press Enter to send, Shift + Enter for new line
                  </p>
                  {!isConnected && (
                    <p className="text-xs text-red-600">
                      Disconnected. Please check your connection.
                    </p>
                  )}
                </div>
              </div>
            </>
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
    </div>
  );
}
