import {
  NotificationSystemType,
  NotificationTypeConfig,
  NotificationRoute,
  Notification,
} from "@/app/interfaces/notification-system";
import {
  NotificationPriority,
  NotificationCategory,
  NotificationTypes,
} from "@/app/enums/notification";
import { routes } from "@/lib/router";

// Notification Type Configurations
export const NOTIFICATION_TYPE_CONFIGS: Record<
  NotificationSystemType,
  NotificationTypeConfig
> = {
  [NotificationTypes.PAYOUT_PROCESSED]: {
    type: NotificationTypes.PAYOUT_PROCESSED,
    label: "Payment Processed",
    description: "Your earnings have been processed and transferred",
    icon: "💰",
    color: "text-green-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.CAMPAIGN_APPROVED]: {
    type: NotificationTypes.CAMPAIGN_APPROVED,
    label: "Campaign Approved",
    description: "Your campaign has been approved and is now live",
    icon: "✅",
    color: "text-green-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.CAMPAIGN_REJECTED]: {
    type: NotificationTypes.CAMPAIGN_REJECTED,
    label: "Campaign Rejected",
    description: "Your campaign submission needs attention",
    icon: "❌",
    color: "text-red-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.APPLICATION_APPROVED]: {
    type: NotificationTypes.APPLICATION_APPROVED,
    label: "Application Approved",
    description: "Your campaign application has been accepted",
    icon: "🎉",
    color: "text-green-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.APPLICATION_REJECTED]: {
    type: NotificationTypes.APPLICATION_REJECTED,
    label: "Application Rejected",
    description: "Your campaign application was not accepted",
    icon: "😞",
    color: "text-red-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },
  [NotificationTypes.EARNINGS_UPDATE]: {
    type: NotificationTypes.EARNINGS_UPDATE,
    label: "Earnings Updated",
    description: "Your earnings have been updated",
    icon: "📈",
    color: "text-blue-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },
  [NotificationTypes.MESSAGE_RECEIVED]: {
    type: NotificationTypes.MESSAGE_RECEIVED,
    label: "New Message",
    description: "You have received a new message",
    icon: "💬",
    color: "text-blue-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
    autoMarkAsRead: true,
  },
  [NotificationTypes.CAMPAIGN_DEADLINE]: {
    type: NotificationTypes.CAMPAIGN_DEADLINE,
    label: "Campaign Deadline",
    description: "Campaign deadline is approaching",
    icon: "⏰",
    color: "text-orange-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.SYSTEM_ANNOUNCEMENT]: {
    type: NotificationTypes.SYSTEM_ANNOUNCEMENT,
    label: "System Announcement",
    description: "Important platform announcement",
    icon: "📢",
    color: "text-purple-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: false,
  },
  [NotificationTypes.PAYMENT_REMINDER]: {
    type: NotificationTypes.PAYMENT_REMINDER,
    label: "Payment Reminder",
    description: "Payment action required",
    icon: "💳",
    color: "text-orange-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.PROFILE_UPDATE_REQUIRED]: {
    type: NotificationTypes.PROFILE_UPDATE_REQUIRED,
    label: "Profile Update Required",
    description: "Please update your profile information",
    icon: "👤",
    color: "text-yellow-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },
  [NotificationTypes.SECURITY_ALERT]: {
    type: NotificationTypes.SECURITY_ALERT,
    label: "Security Alert",
    description: "Important security notification",
    icon: "🔒",
    color: "text-red-600",
    priority: NotificationPriority.URGENT,
    showInDropdown: true,
  },
};

// Notification Category Mappings
export const NOTIFICATION_CATEGORIES_MAP: Record<
  NotificationSystemType,
  NotificationCategory
> = {
  [NotificationTypes.PAYOUT_PROCESSED]: NotificationCategory.PAYMENT,
  [NotificationTypes.PAYMENT_REMINDER]: NotificationCategory.PAYMENT,
  [NotificationTypes.CAMPAIGN_APPROVED]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.CAMPAIGN_REJECTED]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.APPLICATION_APPROVED]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.APPLICATION_REJECTED]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.EARNINGS_UPDATE]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.CAMPAIGN_DEADLINE]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.MESSAGE_RECEIVED]: NotificationCategory.COMMUNICATION,
  [NotificationTypes.SYSTEM_ANNOUNCEMENT]: NotificationCategory.SYSTEM,
  [NotificationTypes.PROFILE_UPDATE_REQUIRED]: NotificationCategory.ACCOUNT,
  [NotificationTypes.SECURITY_ALERT]: NotificationCategory.ACCOUNT,
};

// Notification Routes Configuration
export const NOTIFICATION_ROUTES: Record<
  NotificationSystemType,
  NotificationRoute
> = {
  [NotificationTypes.PAYOUT_PROCESSED]: {
    type: NotificationTypes.PAYOUT_PROCESSED,
    getRoute: () => routes.dashboardEarnings,
  },
  [NotificationTypes.CAMPAIGN_APPROVED]: {
    type: NotificationTypes.CAMPAIGN_APPROVED,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.CAMPAIGN_REJECTED]: {
    type: NotificationTypes.CAMPAIGN_REJECTED,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.APPLICATION_APPROVED]: {
    type: NotificationTypes.APPLICATION_APPROVED,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.APPLICATION_REJECTED]: {
    type: NotificationTypes.APPLICATION_REJECTED,
    getRoute: () => routes.dashboardExplore,
  },
  [NotificationTypes.EARNINGS_UPDATE]: {
    type: NotificationTypes.EARNINGS_UPDATE,
    getRoute: () => routes.dashboardEarnings,
  },
  [NotificationTypes.MESSAGE_RECEIVED]: {
    type: NotificationTypes.MESSAGE_RECEIVED,
    getRoute: () => routes.dashboardMessages,
  },
  [NotificationTypes.CAMPAIGN_DEADLINE]: {
    type: NotificationTypes.CAMPAIGN_DEADLINE,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.SYSTEM_ANNOUNCEMENT]: {
    type: NotificationTypes.SYSTEM_ANNOUNCEMENT,
    getRoute: () => routes.dashboard,
  },
  [NotificationTypes.PAYMENT_REMINDER]: {
    type: NotificationTypes.PAYMENT_REMINDER,
    getRoute: () => routes.dashboardEarnings,
  },
  [NotificationTypes.PROFILE_UPDATE_REQUIRED]: {
    type: NotificationTypes.PROFILE_UPDATE_REQUIRED,
    getRoute: () => routes.dashboardProfile,
  },
  [NotificationTypes.SECURITY_ALERT]: {
    type: NotificationTypes.SECURITY_ALERT,
    getRoute: () => routes.dashboardSettings,
  },
};

// Utility Functions
export const getNotificationConfig = (
  type: NotificationSystemType
): NotificationTypeConfig => {
  return NOTIFICATION_TYPE_CONFIGS[type];
};

export const getNotificationCategory = (
  type: NotificationSystemType
): NotificationCategory => {
  return NOTIFICATION_CATEGORIES_MAP[type];
};

export const getNotificationRoute = (notification: Notification): string => {
  const routeConfig = NOTIFICATION_ROUTES[notification.notificationType];
  return routeConfig ? routeConfig.getRoute(notification) : routes.dashboard;
};

export const getNotificationsByCategory = (
  notifications: Notification[]
): Record<NotificationCategory, Notification[]> => {
  const categorized: Record<NotificationCategory, Notification[]> = {
    [NotificationCategory.PAYMENT]: [],
    [NotificationCategory.CAMPAIGN]: [],
    [NotificationCategory.COMMUNICATION]: [],
    [NotificationCategory.SYSTEM]: [],
    [NotificationCategory.ACCOUNT]: [],
  };

  notifications.forEach((notification) => {
    const category = getNotificationCategory(notification.notificationType);
    categorized[category].push(notification);
  });

  return categorized;
};

export const shouldShowInDropdown = (type: NotificationSystemType): boolean => {
  return NOTIFICATION_TYPE_CONFIGS[type]?.showInDropdown ?? true;
};

export const shouldAutoMarkAsRead = (type: NotificationSystemType): boolean => {
  return NOTIFICATION_TYPE_CONFIGS[type]?.autoMarkAsRead ?? false;
};

// Priority ordering for sorting
export const PRIORITY_ORDER: Record<NotificationPriority, number> = {
  [NotificationPriority.URGENT]: 4,
  [NotificationPriority.HIGH]: 3,
  [NotificationPriority.MEDIUM]: 2,
  [NotificationPriority.LOW]: 1,
};

export const sortNotificationsByPriority = (
  notifications: Notification[]
): Notification[] => {
  return [...notifications].sort((a, b) => {
    const priorityA =
      NOTIFICATION_TYPE_CONFIGS[a.notificationType]?.priority ||
      NotificationPriority.LOW;
    const priorityB =
      NOTIFICATION_TYPE_CONFIGS[b.notificationType]?.priority ||
      NotificationPriority.LOW;

    const orderA = PRIORITY_ORDER[priorityA];
    const orderB = PRIORITY_ORDER[priorityB];

    if (orderA !== orderB) {
      return orderB - orderA; // Higher priority first
    }

    // If same priority, sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

// Default pagination settings
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
  maxLimit: 100,
};

export const DEFAULT_FILTERS = {
  page: 1,
  limit: 20,
};
