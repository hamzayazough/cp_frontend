"use client";

import React from "react";
import {
  NotificationListProps,
  Notification,
} from "@/app/interfaces/notification-system";
import NotificationItem from "./NotificationItem";
import {
  sortNotificationsByPriority,
  shouldShowInDropdown,
} from "@/app/const/notification-constants";

export default function NotificationList({
  notifications,
  loading = false,
  onNotificationClick,
  onViewRelatedContent,
  onMarkAsRead,
  onDismiss,
  showPagination = false,
  compact = false,
}: NotificationListProps) {
  const handleMarkAsRead = async (id: string) => {
    if (onMarkAsRead) {
      await onMarkAsRead(id);
    }
  };

  const handleDismiss = async (id: string) => {
    if (onDismiss) {
      await onDismiss(id);
    }
  };

  const handleViewRelatedContent = (notification: Notification) => {
    if (onViewRelatedContent) {
      onViewRelatedContent(notification);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  // Filter and sort notifications
  const filteredNotifications = compact
    ? notifications.filter((n) => shouldShowInDropdown(n.notificationType))
    : notifications;

  const sortedNotifications = sortNotificationsByPriority(
    filteredNotifications
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (sortedNotifications.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-4">🔔</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No notifications
        </h3>
        <p className="text-sm text-gray-500">
          {compact
            ? "All caught up!"
            : "You're all caught up! New notifications will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {sortedNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRead={handleMarkAsRead}
          onDismiss={handleDismiss}
          onClick={handleNotificationClick}
          onViewRelatedContent={handleViewRelatedContent}
          compact={compact}
          showActions={!compact}
        />
      ))}

      {showPagination && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500 text-center">
            Showing {sortedNotifications.length} notifications
          </p>
        </div>
      )}
    </div>
  );
}
