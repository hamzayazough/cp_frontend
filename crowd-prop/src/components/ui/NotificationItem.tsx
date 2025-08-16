"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NotificationItemProps } from "@/app/interfaces/notification-system";
import {
  getNotificationConfig,
  getNotificationRoute,
  shouldAutoMarkAsRead,
} from "@/app/const/notification-constants";
import {
  EyeIcon,
  XMarkIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function NotificationItem({
  notification,
  onRead,
  onDismiss,
  onClick,
  showActions = true,
  compact = false,
}: NotificationItemProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const config = getNotificationConfig(notification.notificationType);
  const isUnread = !notification.readAt;
  const isDismissed = !!notification.dismissedAt;

  const handleClick = async () => {
    if (isDismissed || isLoading) return;

    setIsLoading(true);

    try {
      // Auto-mark as read if configured
      if (isUnread && shouldAutoMarkAsRead(notification.notificationType)) {
        await onRead(notification.id);
      }

      if (onClick) {
        onClick(notification);
      } else {
        // Navigate to the appropriate route
        const route = getNotificationRoute(notification);
        router.push(route);
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onRead(notification.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onDismiss(notification.id);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)}d ago`;

      return date.toLocaleDateString();
    } catch {
      return "Recently";
    }
  };

  const getPriorityIndicator = () => {
    if (config?.priority === "urgent") {
      return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div
      className={`
        group relative border-b border-gray-100 transition-all duration-200
        ${isDismissed ? "opacity-50" : ""}
        ${isUnread ? "bg-blue-50" : "bg-white"}
        ${!isDismissed ? "hover:bg-gray-50 cursor-pointer" : ""}
        ${compact ? "p-3" : "p-4"}
        ${isLoading ? "opacity-70" : ""}
      `}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      {isUnread && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
      )}

      <div className={`flex items-start space-x-3 ${isUnread ? "ml-4" : ""}`}>
        {/* Icon/Emoji */}
        <div className="flex-shrink-0 mt-1">
          <span className="text-lg">{config?.icon || "🔔"}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">              <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className={`text-sm font-medium ${config?.color || "text-gray-600"} truncate`}>
                  {notification.title}
                </h4>
                {getPriorityIndicator()}
              </div>

              <p
                className={`text-sm text-gray-600 mt-1 ${
                  compact ? "line-clamp-1" : "line-clamp-2"
                }`}
              >
                {notification.message}
              </p>

              {/* Metadata */}
              {notification.metadata && !compact && (
                <div className="mt-2 space-y-1">
                  {notification.metadata.campaignTitle && (
                    <p className="text-xs text-gray-500">
                      Campaign: {notification.metadata.campaignTitle}
                    </p>
                  )}
                  {notification.metadata.amount && (
                    <p className="text-xs text-gray-500">
                      Amount: {notification.metadata.currency || "$"}
                      {notification.metadata.amount}
                    </p>
                  )}
                </div>
              )}

              {/* Timestamp */}
              <p className="text-xs text-gray-400 mt-2">
                {formatTime(notification.createdAt)}
              </p>
            </div>

            {/* Actions */}
            {showActions && !isDismissed && (
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {isUnread && (
                  <button
                    onClick={handleMarkAsRead}
                    className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                    title="Mark as read"
                    disabled={isLoading}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                )}

                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                  title="Dismiss"
                  disabled={isLoading}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>

                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
        </div>
      )}
    </div>
  );
}
