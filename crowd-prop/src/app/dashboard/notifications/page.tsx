"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useNotifications from "@/hooks/useNotificationSystem";
import NotificationList from "@/components/ui/NotificationList";
import {
  getNotificationsByCategory,
  NOTIFICATION_TYPE_CONFIGS,
} from "@/app/const/notification-constants";
import { NotificationCategory } from "@/app/enums/notification";
import {
  NotificationFilters,
  Notification,
  NotificationSystemType,
} from "@/app/interfaces/notification-system";
import {
  getNotificationRoute,
  shouldAutoMarkAsRead,
} from "@/app/const/notification-constants";
import {
  CheckIcon,
  TrashIcon,
  FunnelIcon,
  BellIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    filters,
    fetchNotifications,
    markAsRead,
    markAsClicked,
    markAsDismissed,
    markAllAsRead,
    deleteDismissed,
    setFilters,
    clearError,
  } = useNotifications();

  const [selectedCategory, setSelectedCategory] = useState<
    NotificationCategory | "all"
  >("all");
  const [showDismissed, setShowDismissed] = useState(false);
  const [selectedType, setSelectedType] = useState<
    NotificationSystemType | "all"
  >("all");

  // Filter notifications based on selected category and type
  const filteredNotifications = notifications.filter((notification) => {
    if (!showDismissed && notification.dismissedAt) return false;

    if (selectedCategory !== "all") {
      const categoryMap = {
        [NotificationCategory.PAYMENT]: [
          NotificationTypes.PAYOUT_PROCESSED,
          NotificationTypes.PAYMENT_RECEIVED,
          NotificationTypes.PAYMENT_SENT,
          NotificationTypes.PAYMENT_FAILED,
          NotificationTypes.STRIPE_ACCOUNT_VERIFIED,
          NotificationTypes.STRIPE_ACCOUNT_ISSUE,
          NotificationTypes.WALLET_BALANCE_LOW,
        ],
        [NotificationCategory.CAMPAIGN]: [
          NotificationTypes.CAMPAIGN_CREATED,
          NotificationTypes.CAMPAIGN_APPLICATION_RECEIVED,
          NotificationTypes.CAMPAIGN_APPLICATION_ACCEPTED,
          NotificationTypes.CAMPAIGN_APPLICATION_REJECTED,
          NotificationTypes.CAMPAIGN_WORK_SUBMITTED,
          NotificationTypes.CAMPAIGN_WORK_APPROVED,
          NotificationTypes.CAMPAIGN_WORK_REJECTED,
          NotificationTypes.CAMPAIGN_DETAILS_CHANGED,
          NotificationTypes.CAMPAIGN_ENDING_SOON,
          NotificationTypes.CAMPAIGN_ENDED,
          NotificationTypes.CAMPAIGN_EXPIRED,
          NotificationTypes.CAMPAIGN_BUDGET_INCREASED,
          NotificationTypes.CAMPAIGN_DEADLINE_EXTENDED,
          NotificationTypes.PROMOTER_JOINED_CAMPAIGN,
        ],
        [NotificationCategory.COMMUNICATION]: [
          NotificationTypes.NEW_MESSAGE,
          NotificationTypes.NEW_CONVERSATION,
          NotificationTypes.MEETING_SCHEDULED,
          NotificationTypes.MEETING_REMINDER,
          NotificationTypes.MEETING_CANCELLED,
          NotificationTypes.MEETING_RESCHEDULED,
        ],
        [NotificationCategory.SYSTEM]: [
          NotificationTypes.SYSTEM_MAINTENANCE,
          NotificationTypes.FEATURE_ANNOUNCEMENT,
        ],
        [NotificationCategory.ACCOUNT]: [
          NotificationTypes.ACCOUNT_VERIFICATION_REQUIRED,
          NotificationTypes.ACCOUNT_VERIFIED,
          NotificationTypes.PROFILE_INCOMPLETE,
          NotificationTypes.SECURITY_ALERT,
        ],
      };

      if (
        !categoryMap[selectedCategory]?.includes(notification.notificationType)
      ) {
        return false;
      }
    }

    if (
      selectedType !== "all" &&
      notification.notificationType !== selectedType
    ) {
      return false;
    }

    return true;
  });

  const categorizedNotifications = getNotificationsByCategory(
    filteredNotifications
  );

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as clicked and read if needed
      await markAsClicked(notification.id);

      if (
        !notification.readAt &&
        shouldAutoMarkAsRead(notification.notificationType)
      ) {
        await markAsRead(notification.id);
      }

      // Navigate to the appropriate route
      const route = getNotificationRoute(notification);
      router.push(route);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteDismissed = async () => {
    try {
      await deleteDismissed();
    } catch (error) {
      console.error("Error deleting dismissed notifications:", error);
    }
  };

  const handleRefresh = () => {
    fetchNotifications(filters);
  };

  const updateFilters = (newFilters: Partial<NotificationFilters>) => {
    setFilters(newFilters);
    fetchNotifications({ ...filters, ...newFilters });
  };

  const categoryLabels = {
    all: "All Notifications",
    [NotificationCategory.PAYMENT]: "Payments & Earnings",
    [NotificationCategory.CAMPAIGN]: "Campaigns",
    [NotificationCategory.COMMUNICATION]: "Messages",
    [NotificationCategory.SYSTEM]: "System",
    [NotificationCategory.ACCOUNT]: "Account",
  };

  const getUnreadCountForCategory = (
    category: NotificationCategory | "all"
  ) => {
    if (category === "all") return unreadCount;

    return (
      categorizedNotifications[category]?.filter((n) => !n.readAt).length || 0
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BellIcon className="h-8 w-8 mr-3 text-blue-600" />
                Notifications
              </h1>
              <p className="mt-2 text-gray-600">
                Stay updated with your campaign activities, payments, and
                messages
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                title="Refresh notifications"
              >
                <ArrowPathIcon
                  className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Mark all read ({unreadCount})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-red-800">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Categories
                </h3>
                <div className="space-y-2">
                  {Object.entries(categoryLabels).map(([category, label]) => {
                    const count = getUnreadCountForCategory(
                      category as NotificationCategory | "all"
                    );
                    return (
                      <button
                        key={category}
                        onClick={() =>
                          setSelectedCategory(
                            category as NotificationCategory | "all"
                          )
                        }
                        className={`w-full text-left p-2 rounded-lg transition-colors ${
                          selectedCategory === category
                            ? "bg-blue-100 text-blue-800"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{label}</span>
                          {count > 0 && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              {count}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Type</h3>
                <select
                  value={selectedType}
                  onChange={(e) =>
                    setSelectedType(
                      e.target.value as NotificationSystemType | "all"
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Types</option>
                  {Object.values(NOTIFICATION_TYPE_CONFIGS).map((config) => (
                    <option key={config.type} value={config.type}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show Dismissed Toggle */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showDismissed}
                    onChange={(e) => setShowDismissed(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Show dismissed
                  </span>
                </label>
              </div>

              {/* Delete Dismissed Button */}
              {notifications.some((n) => n.dismissedAt) && (
                <button
                  onClick={handleDeleteDismissed}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Clear dismissed
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {selectedCategory === "all" ? (
                <NotificationList
                  notifications={filteredNotifications}
                  loading={loading}
                  onNotificationClick={handleNotificationClick}
                  onMarkAsRead={markAsRead}
                  onDismiss={markAsDismissed}
                  showPagination={true}
                />
              ) : (
                <div>
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">
                      {categoryLabels[selectedCategory]}
                    </h3>
                  </div>
                  <NotificationList
                    notifications={filteredNotifications}
                    loading={loading}
                    onNotificationClick={handleNotificationClick}
                    onMarkAsRead={markAsRead}
                    onDismiss={markAsDismissed}
                  />
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateFilters({ page: pagination.page - 1 })}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => updateFilters({ page: pagination.page + 1 })}
                    disabled={!pagination.hasNext}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
