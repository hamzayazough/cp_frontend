import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useMessaging } from "@/hooks/useMessaging";
import { MessageThreadResponse } from "@/interfaces/messaging";

interface MessageThreadListProps {
  firebaseToken: string;
  currentUserId: string;
  onThreadSelect: (thread: MessageThreadResponse) => void;
  selectedThreadId?: string;
  campaignId?: string;
}

export const MessageThreadList: React.FC<MessageThreadListProps> = ({
  firebaseToken,
  currentUserId,
  onThreadSelect,
  selectedThreadId,
  campaignId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    threads,
    unreadCount,
    isLoadingThreads,
    error,
    loadThreads,
    clearError,
  } = useMessaging(firebaseToken, {
    autoConnect: true,
  });

  // Load threads on mount
  useEffect(() => {
    if (firebaseToken) {
      loadThreads(1, 50, campaignId);
    }
  }, [firebaseToken, campaignId, loadThreads]);

  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getOtherParticipant = (thread: MessageThreadResponse) => {
    // Return the participant who is not the current user
    if (thread.promoter?.id === currentUserId) {
      return thread.advertiser;
    }
    return thread.promoter;
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

  // Filter threads based on search term
  const filteredThreads = threads.filter((thread) => {
    if (!searchTerm) return true;

    const otherParticipant = getOtherParticipant(thread);
    const searchLower = searchTerm.toLowerCase();

    return (
      thread.campaign?.title?.toLowerCase().includes(searchLower) ||
      thread.subject?.toLowerCase().includes(searchLower) ||
      otherParticipant?.username?.toLowerCase().includes(searchLower)
    );
  });

  const handleRefresh = () => {
    loadThreads(1, 50, campaignId);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
            <button
              onClick={handleRefresh}
              className="text-gray-600 hover:text-gray-800 p-1"
              disabled={isLoadingThreads}
            >
              {isLoadingThreads ? "↻" : "⟲"}
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 mx-4 mt-4 rounded-md">
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

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {isLoadingThreads && threads.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading conversations...</div>
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">
              {searchTerm
                ? "No conversations match your search"
                : "No conversations yet"}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredThreads.map((thread) => {
              const otherParticipant = getOtherParticipant(thread);
              const isSelected = thread.id === selectedThreadId;
              const hasUnread = (thread.unreadCount || 0) > 0;

              return (
                <div
                  key={thread.id}
                  onClick={() => onThreadSelect(thread)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {otherParticipant?.profilePictureUrl ? (
                        <Image
                          src={otherParticipant.profilePictureUrl}
                          alt={otherParticipant.username || "User avatar"}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {otherParticipant?.username
                              ?.charAt(0)
                              ?.toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Thread Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`text-sm font-medium text-gray-900 truncate ${
                            hasUnread ? "font-semibold" : ""
                          }`}
                        >
                          {otherParticipant?.username || "Unknown User"}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {hasUnread && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              {thread.unreadCount}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatLastMessageTime(thread.lastMessageAt)}
                          </span>
                        </div>
                      </div>

                      {thread.campaign && (
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          Campaign: {thread.campaign.title}
                        </p>
                      )}

                      <p
                        className={`text-sm text-gray-600 mt-1 truncate ${
                          hasUnread ? "font-medium" : ""
                        }`}
                      >
                        {getLastMessagePreview(thread)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
