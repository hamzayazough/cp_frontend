import { useState, useEffect, useCallback, useRef } from "react";
import { notificationSystemService } from "@/services/notification-system.service";
import {
  NotificationState,
  NotificationFilters,
  NotificationContextType,
} from "@/app/interfaces/notification-system";
import { DEFAULT_FILTERS } from "@/app/const/notification-constants";

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: null,
  filters: DEFAULT_FILTERS,
};

export const useNotifications = (): NotificationContextType => {
  const [state, setState] = useState<NotificationState>(initialState);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPollTimeRef = useRef<string>(new Date().toISOString());

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const setFilters = useCallback((newFilters: Partial<NotificationFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  }, []);

  const fetchNotifications = useCallback(
    async (filters?: NotificationFilters) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const filtersToUse = filters || state.filters;
        const response = await notificationSystemService.getNotifications(
          filtersToUse
        );

        setState((prev) => ({
          ...prev,
          notifications: response.notifications,
          pagination: response.pagination,
          unreadCount: response.totalUnread,
          loading: false,
          filters: filtersToUse,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch notifications",
          loading: false,
        }));
      }
    },
    [state.filters]
  );

  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await notificationSystemService.getUnreadCount();
      setState((prev) => ({ ...prev, unreadCount: count }));
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationSystemService.markAsRead(notificationId);

      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, readAt: new Date().toISOString() }
            : notification
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark notification as read",
      }));
    }
  }, []);

  const markAsClicked = useCallback(async (notificationId: string) => {
    try {
      await notificationSystemService.markAsClicked(notificationId);

      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                clickedAt: new Date().toISOString(),
                readAt: notification.readAt || new Date().toISOString(),
              }
            : notification
        ),
        unreadCount: prev.notifications.find(
          (n) => n.id === notificationId && !n.readAt
        )
          ? Math.max(0, prev.unreadCount - 1)
          : prev.unreadCount,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark notification as clicked",
      }));
    }
  }, []);

  const markAsDismissed = useCallback(async (notificationId: string) => {
    try {
      await notificationSystemService.markAsDismissed(notificationId);

      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, dismissedAt: new Date().toISOString() }
            : notification
        ),
        unreadCount: prev.notifications.find(
          (n) => n.id === notificationId && !n.readAt
        )
          ? Math.max(0, prev.unreadCount - 1)
          : prev.unreadCount,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to dismiss notification",
      }));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationSystemService.markAllAsRead();

      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((notification) => ({
          ...notification,
          readAt: notification.readAt || new Date().toISOString(),
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark all notifications as read",
      }));
    }
  }, []);

  const deleteDismissed = useCallback(async () => {
    try {
      await notificationSystemService.deleteDismissedNotifications();

      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.filter(
          (notification) => !notification.dismissedAt
        ),
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete dismissed notifications",
      }));
    }
  }, []);

  const startPolling = useCallback((intervalMs: number = 30000) => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    pollIntervalRef.current = setInterval(async () => {
      try {
        const newNotifications =
          await notificationSystemService.pollForNewNotifications(
            lastPollTimeRef.current
          );

        if (newNotifications.length > 0) {
          setState((prev) => ({
            ...prev,
            notifications: [...newNotifications, ...prev.notifications],
            unreadCount:
              prev.unreadCount +
              newNotifications.filter((n) => !n.readAt).length,
          }));

          lastPollTimeRef.current = new Date().toISOString();
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, intervalMs);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchNotifications();
    refreshUnreadCount();
    startPolling();

    return () => {
      stopPolling();
    };
  }, [fetchNotifications, refreshUnreadCount, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    ...state,
    fetchNotifications,
    markAsRead,
    markAsClicked,
    markAsDismissed,
    markAllAsRead,
    deleteDismissed,
    refreshUnreadCount,
    setFilters,
    clearError,
  };
};

export default useNotifications;
