"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  NotificationDropdownProps,
  Notification,
} from "@/app/interfaces/notification-system";
import { notificationSystemService } from "@/services/notification-system.service";
import { getNotificationRoute } from "@/app/const/notification-constants";
import NotificationList from "./NotificationList";

export default function NotificationDropdown({
  isOpen,
  onClose,
  onViewAll,
  maxItems = 5,
}: NotificationDropdownProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDropdownNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationSystemService.getDropdownNotifications(
        maxItems
      );
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch dropdown notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [maxItems]);

  useEffect(() => {
    if (isOpen) {
      fetchDropdownNotifications();
    }
  }, [isOpen, fetchDropdownNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationSystemService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, readAt: new Date().toISOString() }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await notificationSystemService.markAsDismissed(id);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Failed to dismiss notification:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Close the dropdown first
    onClose();
    
    // Mark as read if it's unread
    if (!notification.readAt) {
      handleMarkAsRead(notification.id);
    }
    
    // Navigate to the appropriate route
    const route = getNotificationRoute(notification);
    router.push(route);
  };

  const handleViewAll = () => {
    onViewAll();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 max-h-96 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          <NotificationList
            notifications={notifications}
            loading={loading}
            onMarkAsRead={handleMarkAsRead}
            onDismiss={handleDismiss}
            onNotificationClick={handleNotificationClick}
            compact={true}
          />
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleViewAll}
              className="w-full py-3 px-4 text-sm text-blue-600 hover:text-blue-500 font-medium hover:bg-gray-100 transition-colors"
            >
              View all notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
}
