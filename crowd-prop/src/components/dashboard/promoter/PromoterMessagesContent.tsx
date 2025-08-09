"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { routes } from "@/lib/router";
import { useMessaging } from "@/hooks/useMessaging";
import { MessageThreadResponse, MessageResponse } from "@/interfaces/messaging";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface PromoterMessagesContentProps {
  currentUser: {
    id: string;
    firebaseUid: string;
    name: string;
  } | null;
}

// Keep existing imports and component setup, but integrate with real messaging API

export default function PromoterMessagesContent({
  currentUser,
}: PromoterMessagesContentProps) {
  const [selectedThread, setSelectedThread] =
    useState<MessageThreadResponse | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get Firebase token and user ID
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

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        getFirebaseToken();
      } else {
        setFirebaseToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Initialize messaging for this component
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
    leaveThread,
    sendTyping,
    markAsRead,
    loadThreads,
    loadMessages,
    clearError,
  } = useMessaging(firebaseToken, {
    autoConnect: true,
    currentUserType: "PROMOTER",
  });

  // Load threads on mount
  useEffect(() => {
    if (firebaseToken && currentUser) {
      loadThreads();
    }
  }, [firebaseToken, currentUser, loadThreads]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join/leave thread when selection changes
  useEffect(() => {
    if (selectedThread && isConnected) {
      joinThread(selectedThread.id);
      markAsRead(selectedThread.id);
      loadMessages(selectedThread.id);

      return () => {
        leaveThread(selectedThread.id);
      };
    }
  }, [
    selectedThread,
    isConnected,
    joinThread,
    leaveThread,
    markAsRead,
    loadMessages,
  ]);

  // Filter threads based on search
  const filteredThreads = threads.filter((thread) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const otherParticipant =
      thread.promoter?.id === currentUser?.id
        ? thread.advertiser
        : thread.promoter;

    return (
      thread.campaign?.title?.toLowerCase().includes(searchLower) ||
      thread.subject?.toLowerCase().includes(searchLower) ||
      otherParticipant?.username?.toLowerCase().includes(searchLower)
    );
  });

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedThread || isSendingMessage) return;

    try {
      // Clear typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      sendTyping(selectedThread.id, false);

      // Send message via HTTP API for immediate response
      await sendMessage(selectedThread.id, messageInput.trim());
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Handle typing indicator
  const handleTypingChange = (value: string) => {
    setMessageInput(value);

    if (!selectedThread) return;

    if (value.trim() && !typingTimeoutRef.current) {
      sendTyping(selectedThread.id, true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(selectedThread.id, false);
      typingTimeoutRef.current = null;
    }, 1000);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // Less than a week
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getCampaignTypeColor = (isPublic: boolean) => {
    return isPublic
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";
  };

  const getOtherParticipant = (thread: MessageThreadResponse) => {
    return thread.promoter?.id === currentUser?.id
      ? thread.advertiser
      : thread.promoter;
  };

  const getLastMessagePreview = (thread: MessageThreadResponse) => {
    if (!thread.messages || thread.messages.length === 0) {
      return "No messages yet";
    }

    const lastMessage = thread.messages[0];
    const maxLength = 50;

    if (lastMessage.content.length > maxLength) {
      return lastMessage.content.substring(0, maxLength) + "...";
    }

    return lastMessage.content;
  };

  // Filter messages for selected thread and sort them by creation time (oldest first)
  const threadMessages = selectedThread
    ? messages
        .filter((msg) => msg.threadId === selectedThread.id)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
    : [];

  const getTypingText = () => {
    const typingUsersList = Array.from(typingUsers).filter(
      (userId) => userId !== currentUser?.id
    );
    if (typingUsersList.length === 0) return "";
    if (typingUsersList.length === 1) return "Someone is typing...";
    return `${typingUsersList.length} people are typing...`;
  };

  if (!currentUser || !firebaseToken) {
    return (
      <div className="flex h-[calc(100vh-12rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-center items-center w-full">
          <div className="text-gray-500">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Sidebar - Message Threads */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-3 m-4 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-red-800 text-sm">{error}</p>
                <button
                  onClick={clearError}
                  className="text-red-800 hover:text-red-900 px-2"
                >
                  ×
                </button>
              </div>
            </div>
          )}

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

          {isLoadingThreads && filteredThreads.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-500">Loading conversations...</div>
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-500">No conversations yet</div>
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const otherParticipant = getOtherParticipant(thread);
              const isSelected = selectedThread?.id === thread.id;

              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
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
                          {otherParticipant?.username
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </span>
                      </div>
                      {/* Always show active indicator for now since we don't have online status */}
                      <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {otherParticipant?.username || "Unknown User"}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(thread.lastMessageAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-600">
                          {thread.campaign?.title || "No campaign"}
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
                          {getLastMessagePreview(thread)}
                        </p>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCampaignTypeColor(
                            thread.campaign?.isPublic ?? true
                          )}`}
                        >
                          {thread.campaign?.isPublic ? "Public" : "Private"}
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              {(() => {
                const otherParticipant = getOtherParticipant(selectedThread);
                return (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {otherParticipant?.username
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {otherParticipant?.username || "Unknown User"}
                        </h2>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-600">
                            {selectedThread.campaign?.title || "No campaign"}
                          </p>
                          <span className="text-gray-400">•</span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCampaignTypeColor(
                              selectedThread.campaign?.isPublic ?? true
                            )}`}
                          >
                            {selectedThread.campaign?.isPublic
                              ? "Public"
                              : "Private"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedThread.campaign && (
                        <Link
                          href={routes.dashboardCampaignDetails(
                            selectedThread.campaign.id
                          )}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <InformationCircleIcon className="h-5 w-5" />
                        </Link>
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {isLoadingMessages && threadMessages.length === 0 ? (
                <div className="flex justify-center items-center h-32">
                  <div className="text-gray-500">Loading messages...</div>
                </div>
              ) : threadMessages.length === 0 ? (
                <div className="flex justify-center items-center h-32">
                  <div className="text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                </div>
              ) : (
                threadMessages.map((message: MessageResponse) => {
                  // Check both senderType and senderId as fallback since server might set incorrect senderType
                  const isOwn =
                    message.senderType === "PROMOTER" ||
                    message.senderId === currentUser?.id;
                  const otherParticipant = selectedThread
                    ? getOtherParticipant(selectedThread)
                    : null;

                  return (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* Avatar for other users only (left side) */}
                      {!isOwn && (
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {otherParticipant?.username
                              ?.charAt(0)
                              ?.toUpperCase() || "A"}
                          </span>
                        </div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`max-w-xs lg:max-w-md ${
                          isOwn ? "ml-auto" : ""
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwn
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-900 border border-gray-200"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p
                          className={`text-xs text-gray-500 mt-1 ${
                            isOwn ? "text-right" : "text-left"
                          }`}
                        >
                          {formatTimestamp(message.createdAt)}
                          {isOwn && (
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
              {getTypingText() && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-2xl text-sm italic">
                    {getTypingText()}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={messageInput}
                    onChange={(e) => handleTypingChange(e.target.value)}
                    placeholder="Type your message..."
                    rows={1}
                    disabled={
                      !selectedThread || !isConnected || isSendingMessage
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={
                    !messageInput.trim() ||
                    !selectedThread ||
                    !isConnected ||
                    isSendingMessage
                  }
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
  );
}
