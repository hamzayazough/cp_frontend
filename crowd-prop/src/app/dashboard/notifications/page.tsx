"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { routes } from "@/lib/router";
import useNotifications from "@/hooks/useNotificationSystem";
import NotificationList from "@/components/ui/NotificationList";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { UserRole } from "@/app/interfaces/user";
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

// Extended User interface to include custom claims
interface ExtendedUser extends User {
  customClaims?: {
    role: UserRole;
  };
}

// Authenticated notifications content component
function NotificationsContent({ user }: { user: User }) {
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
          "PAYOUT_PROCESSED",
          "PAYMENT_RECEIVED", 
          "PAYMENT_SENT",
          "PAYMENT_FAILED",
          "STRIPE_ACCOUNT_VERIFIED",
          "STRIPE_ACCOUNT_ISSUE",
          "WALLET_BALANCE_LOW",
        ],
        [NotificationCategory.CAMPAIGN]: [
          "CAMPAIGN_CREATED",
          "CAMPAIGN_APPLICATION_RECEIVED",
          "CAMPAIGN_APPLICATION_ACCEPTED",
          "CAMPAIGN_APPLICATION_REJECTED",
          "CAMPAIGN_WORK_SUBMITTED",
          "CAMPAIGN_WORK_APPROVED",
          "CAMPAIGN_WORK_REJECTED",
          "CAMPAIGN_DETAILS_CHANGED",
          "CAMPAIGN_ENDING_SOON",
          "CAMPAIGN_ENDED",
          "CAMPAIGN_EXPIRED",
          "CAMPAIGN_BUDGET_INCREASED",
          "CAMPAIGN_DEADLINE_EXTENDED",
          "PROMOTER_JOINED_CAMPAIGN",
        ],
        [NotificationCategory.COMMUNICATION]: [
          "NEW_MESSAGE",
          "NEW_CONVERSATION",
          "MEETING_SCHEDULED",
          "MEETING_REMINDER",
          "MEETING_CANCELLED",
          "MEETING_RESCHEDULED",
        ],
        [NotificationCategory.SYSTEM]: [
          "SYSTEM_MAINTENANCE",
          "FEATURE_ANNOUNCEMENT",
        ],
        [NotificationCategory.ACCOUNT]: [
          "ACCOUNT_VERIFICATION_REQUIRED",
          "ACCOUNT_VERIFIED",
          "PROFILE_INCOMPLETE",
          "SECURITY_ALERT",
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

      // Navigate to the notification details page
      router.push(routes.dashboardNotificationDetails(notification.id));
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const handleViewRelatedContent = async (notification: Notification) => {
    try {
      // Mark as clicked and read if needed
      await markAsClicked(notification.id);

      if (
        !notification.readAt &&
        shouldAutoMarkAsRead(notification.notificationType)
      ) {
        await markAsRead(notification.id);
      }

      // Navigate to the appropriate route based on notification type
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
    <DashboardLayout
      userRole={(user as ExtendedUser).customClaims?.role || 'PROMOTER' as UserRole}
      userName={user.displayName || undefined}
      userEmail={user.email || undefined}
      userAvatar={user.photoURL || undefined}
    >
      <div className="max-w-4xl mx-auto">
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
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-700"
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
                  onViewRelatedContent={handleViewRelatedContent}
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
                    onViewRelatedContent={handleViewRelatedContent}
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
    </DashboardLayout>
  );
}

// Main page component with authentication handling
export default function NotificationsPage() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Handle authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setFirebaseUser(authUser);
      
      if (!authUser) {
        router.push('/auth');
      }
      
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Don't render anything while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!firebaseUser) {
    return null;
  }

  // Render the authenticated content
  return <NotificationsContent user={firebaseUser} />;
}
