import React, { useState, useEffect, useRef } from "react";
import { useMessaging } from "@/hooks/useMessaging";

interface MessageThreadProps {
  threadId: string;
  firebaseToken: string;
  currentUserId: string;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  threadId,
  firebaseToken,
  currentUserId,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isConnected,
    messages,
    currentThread,
    typingUsers,
    isLoadingMessages,
    isSendingMessage,
    error,
    sendMessage,
    joinThread,
    leaveThread,
    sendTyping,
    markAsRead,
    loadMessages,
    loadThread,
    clearError,
  } = useMessaging(firebaseToken, {
    autoConnect: true,
    autoJoinThread: threadId,
  });

  // Load thread and messages on mount
  useEffect(() => {
    if (threadId && firebaseToken) {
      loadThread(threadId);
      loadMessages(threadId);
    }
  }, [threadId, firebaseToken, loadThread, loadMessages]);

  // Join/leave thread
  useEffect(() => {
    if (isConnected && threadId) {
      joinThread(threadId);
      markAsRead(threadId);

      return () => {
        leaveThread(threadId);
      };
    }
  }, [isConnected, threadId, joinThread, leaveThread, markAsRead]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing indicators
  const handleTypingChange = (value: string) => {
    setNewMessage(value);

    if (value.trim() && !isTyping) {
      setIsTyping(true);
      sendTyping(threadId, true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(threadId, false);
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSendingMessage) return;

    try {
      // Clear typing indicator immediately
      if (isTyping) {
        setIsTyping(false);
        sendTyping(threadId, false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }

      // Send via WebSocket for real-time delivery
      sendMessage(threadId, newMessage.trim());
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const getTypingText = () => {
    const typingUsersList = Array.from(typingUsers).filter(
      (userId) => userId !== currentUserId
    );
    if (typingUsersList.length === 0) return "";
    if (typingUsersList.length === 1) return "Someone is typing...";
    return `${typingUsersList.length} people are typing...`;
  };

  // Filter messages for current thread
  const threadMessages = messages.filter((msg) => msg.threadId === threadId);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {currentThread?.subject ||
                currentThread?.campaign?.title ||
                "Message Thread"}
            </h2>
            {currentThread?.campaign && (
              <p className="text-sm text-gray-600">
                Campaign: {currentThread.campaign.title}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-600">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 mx-4 mt-4 rounded-md">
          <div className="flex items-center justify-between">
            <p className="text-red-800 text-sm">{error}</p>
            <button
              className="text-red-800 hover:text-red-900 px-2"
              onClick={clearError}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
          threadMessages.map((message) => {
            const isOwn = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {!isOwn && message.sender && (
                    <div className="text-xs text-gray-600 mb-1">
                      {message.sender.username}
                    </div>
                  )}
                  <div className="break-words">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      isOwn ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {formatMessageTime(message.createdAt)}
                    {isOwn && (
                      <span className="ml-2">
                        {message.isRead ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {getTypingText() && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm italic">
              {getTypingText()}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleTypingChange(e.target.value)
            }
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={!isConnected || isSendingMessage}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected || isSendingMessage}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSendingMessage ? "Sending..." : "Send"}
          </button>
        </div>
        {!isConnected && (
          <p className="text-sm text-red-600 mt-2">
            Disconnected. Please check your connection.
          </p>
        )}
      </div>
    </div>
  );
};
