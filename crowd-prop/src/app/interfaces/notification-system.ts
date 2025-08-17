import { NotificationTypes } from "@/app/enums/notification";

export type NotificationSystemType = NotificationTypes;

export interface NotificationMetadata {
  amount?: number;
  currency?: string;
  campaignTitle?: string;
  campaignId?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  period?: string;
  category?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  actionUrl?: string;
  actionLabel?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  userId: string;
  notificationType: NotificationSystemType;
  title: string;
  message: string;
  metadata?: NotificationMetadata;
  campaignId?: string;
  campaign?: {
    id: string;
    title: string;
  };
  readAt?: string | null;
  clickedAt?: string | null;
  dismissedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  unread?: boolean;
  notificationType?: NotificationSystemType;
  campaignId?: string;
}

// API Response Interfaces
export interface GetNotificationsResponse {
  notifications: Notification[];
  pagination: NotificationPagination;
  totalUnread: number;
}

export interface GetUnreadCountResponse {
  count: number;
}

export interface NotificationActionResponse {
  success: boolean;
  message: string;
}

export interface MarkAllAsReadResponse {
  success: boolean;
  markedCount: number;
  message: string;
}

export interface DeleteDismissedResponse {
  success: boolean;
  deletedCount: number;
  message: string;
}

// UI State Interfaces
export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: NotificationPagination | null;
  filters: NotificationFilters;
}

export interface NotificationContextType extends NotificationState {
  fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAsClicked: (notificationId: string) => Promise<void>;
  markAsDismissed: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteDismissed: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  setFilters: (filters: Partial<NotificationFilters>) => void;
  clearError: () => void;
}

// Component Props Interfaces
export interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onClick?: (notification: Notification) => void;
  onViewRelatedContent?: (notification: Notification) => void;
  showActions?: boolean;
  compact?: boolean;
}

export interface NotificationListProps {
  notifications: Notification[];
  loading?: boolean;
  onNotificationClick?: (notification: Notification) => void;
  onViewRelatedContent?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  showPagination?: boolean;
  compact?: boolean;
}

export interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAll: () => void;
  maxItems?: number;
}

export interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  showZero?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "danger";
}

export interface NotificationFiltersProps {
  filters: NotificationFilters;
  onFiltersChange: (filters: Partial<NotificationFilters>) => void;
  availableTypes: NotificationSystemType[];
}

// Utility Types
export interface NotificationTypeConfig {
  type: NotificationSystemType;
  label: string;
  description: string;
  icon: string;
  color: string;
  priority: "low" | "medium" | "high" | "urgent";
  autoMarkAsRead?: boolean;
  showInDropdown?: boolean;
}

export interface NotificationRoute {
  type: NotificationSystemType;
  getRoute: (notification: Notification) => string;
}
