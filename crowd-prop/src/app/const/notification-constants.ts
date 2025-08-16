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
  // Campaign related
  [NotificationTypes.CAMPAIGN_CREATED]: {
    type: NotificationTypes.CAMPAIGN_CREATED,
    label: "Campaign Created",
    description: "Your campaign has been created successfully",
    icon: "🚀",
    color: "text-blue-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },
  [NotificationTypes.CAMPAIGN_APPLICATION_RECEIVED]: {
    type: NotificationTypes.CAMPAIGN_APPLICATION_RECEIVED,
    label: "New Application",
    description: "You have received a new campaign application",
    icon: "📝",
    color: "text-blue-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.CAMPAIGN_APPLICATION_ACCEPTED]: {
    type: NotificationTypes.CAMPAIGN_APPLICATION_ACCEPTED,
    label: "Application Accepted",
    description: "Your campaign application has been accepted",
    icon: "🎉",
    color: "text-green-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.CAMPAIGN_APPLICATION_REJECTED]: {
    type: NotificationTypes.CAMPAIGN_APPLICATION_REJECTED,
    label: "Application Rejected",
    description: "Your campaign application was not accepted",
    icon: "😞",
    color: "text-red-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },
  [NotificationTypes.CAMPAIGN_WORK_SUBMITTED]: {
    type: NotificationTypes.CAMPAIGN_WORK_SUBMITTED,
    label: "Work Submitted",
    description: "Campaign work has been submitted for review",
    icon: "📤",
    color: "text-blue-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },
  [NotificationTypes.CAMPAIGN_WORK_APPROVED]: {
    type: NotificationTypes.CAMPAIGN_WORK_APPROVED,
    label: "Work Approved",
    description: "Your campaign work has been approved",
    icon: "✅",
    color: "text-green-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.CAMPAIGN_WORK_REJECTED]: {
    type: NotificationTypes.CAMPAIGN_WORK_REJECTED,
    label: "Work Rejected",
    description: "Your campaign work needs revision",
    icon: "❌",
    color: "text-red-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.CAMPAIGN_DETAILS_CHANGED]: {
    type: NotificationTypes.CAMPAIGN_DETAILS_CHANGED,
    label: "Campaign Updated",
    description: "Campaign details have been updated",
    icon: "📝",
    color: "text-orange-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },
  [NotificationTypes.CAMPAIGN_ENDING_SOON]: {
    type: NotificationTypes.CAMPAIGN_ENDING_SOON,
    label: "Campaign Ending Soon",
    description: "Campaign deadline is approaching",
    icon: "⏰",
    color: "text-orange-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.CAMPAIGN_ENDED]: {
    type: NotificationTypes.CAMPAIGN_ENDED,
    label: "Campaign Ended",
    description: "Campaign has reached its deadline",
    icon: "🏁",
    color: "text-gray-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },
  [NotificationTypes.CAMPAIGN_EXPIRED]: {
    type: NotificationTypes.CAMPAIGN_EXPIRED,
    label: "Campaign Expired",
    description: "Campaign has expired without completion",
    icon: "⏱️",
    color: "text-red-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },
  [NotificationTypes.CAMPAIGN_BUDGET_INCREASED]: {
    type: NotificationTypes.CAMPAIGN_BUDGET_INCREASED,
    label: "Budget Increased",
    description: "Campaign budget has been increased",
    icon: "💰",
    color: "text-green-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },
  [NotificationTypes.CAMPAIGN_DEADLINE_EXTENDED]: {
    type: NotificationTypes.CAMPAIGN_DEADLINE_EXTENDED,
    label: "Deadline Extended",
    description: "Campaign deadline has been extended",
    icon: "📅",
    color: "text-blue-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },
  [NotificationTypes.PROMOTER_JOINED_CAMPAIGN]: {
    type: NotificationTypes.PROMOTER_JOINED_CAMPAIGN,
    label: "Promoter Joined",
    description: "A promoter has joined your campaign",
    icon: "👋",
    color: "text-green-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },

  // Payment related
  [NotificationTypes.PAYMENT_RECEIVED]: {
    type: NotificationTypes.PAYMENT_RECEIVED,
    label: "Payment Received",
    description: "You have received a payment",
    icon: "💰",
    color: "text-green-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.PAYMENT_SENT]: {
    type: NotificationTypes.PAYMENT_SENT,
    label: "Payment Sent",
    description: "Your payment has been sent",
    icon: "💸",
    color: "text-blue-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },
  [NotificationTypes.PAYMENT_FAILED]: {
    type: NotificationTypes.PAYMENT_FAILED,
    label: "Payment Failed",
    description: "A payment transaction has failed",
    icon: "❌",
    color: "text-red-600",
    priority: NotificationPriority.URGENT,
    showInDropdown: true,
  },
  [NotificationTypes.PAYOUT_PROCESSED]: {
    type: NotificationTypes.PAYOUT_PROCESSED,
    label: "Payout Processed",
    description: "Your earnings have been processed and transferred",
    icon: "💰",
    color: "text-green-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.STRIPE_ACCOUNT_VERIFIED]: {
    type: NotificationTypes.STRIPE_ACCOUNT_VERIFIED,
    label: "Payment Account Verified",
    description: "Your payment account has been verified",
    icon: "✅",
    color: "text-green-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.STRIPE_ACCOUNT_ISSUE]: {
    type: NotificationTypes.STRIPE_ACCOUNT_ISSUE,
    label: "Payment Account Issue",
    description: "There's an issue with your payment account",
    icon: "⚠️",
    color: "text-red-600",
    priority: NotificationPriority.URGENT,
    showInDropdown: true,
  },
  [NotificationTypes.WALLET_BALANCE_LOW]: {
    type: NotificationTypes.WALLET_BALANCE_LOW,
    label: "Low Wallet Balance",
    description: "Your wallet balance is running low",
    icon: "🪫",
    color: "text-orange-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },

  // Messaging related
  [NotificationTypes.NEW_MESSAGE]: {
    type: NotificationTypes.NEW_MESSAGE,
    label: "New Message",
    description: "You have received a new message",
    icon: "💬",
    color: "text-blue-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
    autoMarkAsRead: true,
  },
  [NotificationTypes.NEW_CONVERSATION]: {
    type: NotificationTypes.NEW_CONVERSATION,
    label: "New Conversation",
    description: "A new conversation has been started",
    icon: "💬",
    color: "text-blue-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },

  // Meeting related
  [NotificationTypes.MEETING_SCHEDULED]: {
    type: NotificationTypes.MEETING_SCHEDULED,
    label: "Meeting Scheduled",
    description: "A new meeting has been scheduled",
    icon: "📅",
    color: "text-blue-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.MEETING_REMINDER]: {
    type: NotificationTypes.MEETING_REMINDER,
    label: "Meeting Reminder",
    description: "You have an upcoming meeting",
    icon: "⏰",
    color: "text-orange-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.MEETING_CANCELLED]: {
    type: NotificationTypes.MEETING_CANCELLED,
    label: "Meeting Cancelled",
    description: "A meeting has been cancelled",
    icon: "❌",
    color: "text-red-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },
  [NotificationTypes.MEETING_RESCHEDULED]: {
    type: NotificationTypes.MEETING_RESCHEDULED,
    label: "Meeting Rescheduled",
    description: "A meeting has been rescheduled",
    icon: "📅",
    color: "text-orange-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },

  // Account related
  [NotificationTypes.ACCOUNT_VERIFICATION_REQUIRED]: {
    type: NotificationTypes.ACCOUNT_VERIFICATION_REQUIRED,
    label: "Verification Required",
    description: "Please verify your account to continue",
    icon: "🔍",
    color: "text-orange-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.ACCOUNT_VERIFIED]: {
    type: NotificationTypes.ACCOUNT_VERIFIED,
    label: "Account Verified",
    description: "Your account has been successfully verified",
    icon: "✅",
    color: "text-green-600",
    priority: NotificationPriority.HIGH,
    showInDropdown: true,
  },
  [NotificationTypes.PROFILE_INCOMPLETE]: {
    type: NotificationTypes.PROFILE_INCOMPLETE,
    label: "Complete Your Profile",
    description: "Please complete your profile information",
    icon: "👤",
    color: "text-yellow-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: true,
  },

  // System related
  [NotificationTypes.SYSTEM_MAINTENANCE]: {
    type: NotificationTypes.SYSTEM_MAINTENANCE,
    label: "System Maintenance",
    description: "Scheduled system maintenance notification",
    icon: "🔧",
    color: "text-purple-600",
    priority: NotificationPriority.MEDIUM,
    showInDropdown: false,
  },
  [NotificationTypes.FEATURE_ANNOUNCEMENT]: {
    type: NotificationTypes.FEATURE_ANNOUNCEMENT,
    label: "New Feature",
    description: "A new feature has been released",
    icon: "🎉",
    color: "text-purple-600",
    priority: NotificationPriority.LOW,
    showInDropdown: false,
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
  // Campaign related
  [NotificationTypes.CAMPAIGN_CREATED]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.CAMPAIGN_APPLICATION_RECEIVED]:
    NotificationCategory.CAMPAIGN,
  [NotificationTypes.CAMPAIGN_APPLICATION_ACCEPTED]:
    NotificationCategory.CAMPAIGN,
  [NotificationTypes.CAMPAIGN_APPLICATION_REJECTED]:
    NotificationCategory.CAMPAIGN,
  [NotificationTypes.CAMPAIGN_WORK_SUBMITTED]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.CAMPAIGN_WORK_APPROVED]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.CAMPAIGN_WORK_REJECTED]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.CAMPAIGN_DETAILS_CHANGED]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.CAMPAIGN_ENDING_SOON]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.CAMPAIGN_ENDED]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.CAMPAIGN_EXPIRED]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.CAMPAIGN_BUDGET_INCREASED]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.CAMPAIGN_DEADLINE_EXTENDED]: NotificationCategory.CAMPAIGN,
  [NotificationTypes.PROMOTER_JOINED_CAMPAIGN]: NotificationCategory.CAMPAIGN,

  // Payment related
  [NotificationTypes.PAYMENT_RECEIVED]: NotificationCategory.PAYMENT,
  [NotificationTypes.PAYMENT_SENT]: NotificationCategory.PAYMENT,
  [NotificationTypes.PAYMENT_FAILED]: NotificationCategory.PAYMENT,
  [NotificationTypes.PAYOUT_PROCESSED]: NotificationCategory.PAYMENT,
  [NotificationTypes.STRIPE_ACCOUNT_VERIFIED]: NotificationCategory.PAYMENT,
  [NotificationTypes.STRIPE_ACCOUNT_ISSUE]: NotificationCategory.PAYMENT,
  [NotificationTypes.WALLET_BALANCE_LOW]: NotificationCategory.PAYMENT,

  // Messaging related
  [NotificationTypes.NEW_MESSAGE]: NotificationCategory.COMMUNICATION,
  [NotificationTypes.NEW_CONVERSATION]: NotificationCategory.COMMUNICATION,

  // Meeting related
  [NotificationTypes.MEETING_SCHEDULED]: NotificationCategory.COMMUNICATION,
  [NotificationTypes.MEETING_REMINDER]: NotificationCategory.COMMUNICATION,
  [NotificationTypes.MEETING_CANCELLED]: NotificationCategory.COMMUNICATION,
  [NotificationTypes.MEETING_RESCHEDULED]: NotificationCategory.COMMUNICATION,

  // Account related
  [NotificationTypes.ACCOUNT_VERIFICATION_REQUIRED]:
    NotificationCategory.ACCOUNT,
  [NotificationTypes.ACCOUNT_VERIFIED]: NotificationCategory.ACCOUNT,
  [NotificationTypes.PROFILE_INCOMPLETE]: NotificationCategory.ACCOUNT,

  // System related
  [NotificationTypes.SYSTEM_MAINTENANCE]: NotificationCategory.SYSTEM,
  [NotificationTypes.FEATURE_ANNOUNCEMENT]: NotificationCategory.SYSTEM,
  [NotificationTypes.SECURITY_ALERT]: NotificationCategory.ACCOUNT,
};

// Notification Routes Configuration
export const NOTIFICATION_ROUTES: Record<
  NotificationSystemType,
  NotificationRoute
> = {
  // Campaign related routes
  [NotificationTypes.CAMPAIGN_CREATED]: {
    type: NotificationTypes.CAMPAIGN_CREATED,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.CAMPAIGN_APPLICATION_RECEIVED]: {
    type: NotificationTypes.CAMPAIGN_APPLICATION_RECEIVED,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.CAMPAIGN_APPLICATION_ACCEPTED]: {
    type: NotificationTypes.CAMPAIGN_APPLICATION_ACCEPTED,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.CAMPAIGN_APPLICATION_REJECTED]: {
    type: NotificationTypes.CAMPAIGN_APPLICATION_REJECTED,
    getRoute: () => routes.dashboardExplore,
  },
  [NotificationTypes.CAMPAIGN_WORK_SUBMITTED]: {
    type: NotificationTypes.CAMPAIGN_WORK_SUBMITTED,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.CAMPAIGN_WORK_APPROVED]: {
    type: NotificationTypes.CAMPAIGN_WORK_APPROVED,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.CAMPAIGN_WORK_REJECTED]: {
    type: NotificationTypes.CAMPAIGN_WORK_REJECTED,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.CAMPAIGN_DETAILS_CHANGED]: {
    type: NotificationTypes.CAMPAIGN_DETAILS_CHANGED,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.CAMPAIGN_ENDING_SOON]: {
    type: NotificationTypes.CAMPAIGN_ENDING_SOON,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.CAMPAIGN_ENDED]: {
    type: NotificationTypes.CAMPAIGN_ENDED,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.CAMPAIGN_EXPIRED]: {
    type: NotificationTypes.CAMPAIGN_EXPIRED,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.CAMPAIGN_BUDGET_INCREASED]: {
    type: NotificationTypes.CAMPAIGN_BUDGET_INCREASED,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.CAMPAIGN_DEADLINE_EXTENDED]: {
    type: NotificationTypes.CAMPAIGN_DEADLINE_EXTENDED,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },
  [NotificationTypes.PROMOTER_JOINED_CAMPAIGN]: {
    type: NotificationTypes.PROMOTER_JOINED_CAMPAIGN,
    getRoute: (notification: Notification) =>
      notification.campaignId
        ? routes.dashboardCampaignDetails(notification.campaignId)
        : routes.dashboardCampaigns,
  },

  // Payment related routes
  [NotificationTypes.PAYMENT_RECEIVED]: {
    type: NotificationTypes.PAYMENT_RECEIVED,
    getRoute: () => routes.dashboardEarnings,
  },
  [NotificationTypes.PAYMENT_SENT]: {
    type: NotificationTypes.PAYMENT_SENT,
    getRoute: () => routes.dashboardEarnings,
  },
  [NotificationTypes.PAYMENT_FAILED]: {
    type: NotificationTypes.PAYMENT_FAILED,
    getRoute: () => routes.dashboardEarnings,
  },
  [NotificationTypes.PAYOUT_PROCESSED]: {
    type: NotificationTypes.PAYOUT_PROCESSED,
    getRoute: () => routes.dashboardEarnings,
  },
  [NotificationTypes.STRIPE_ACCOUNT_VERIFIED]: {
    type: NotificationTypes.STRIPE_ACCOUNT_VERIFIED,
    getRoute: () => routes.dashboardEarnings,
  },
  [NotificationTypes.STRIPE_ACCOUNT_ISSUE]: {
    type: NotificationTypes.STRIPE_ACCOUNT_ISSUE,
    getRoute: () => routes.dashboardEarnings,
  },
  [NotificationTypes.WALLET_BALANCE_LOW]: {
    type: NotificationTypes.WALLET_BALANCE_LOW,
    getRoute: () => routes.dashboardEarnings,
  },

  // Messaging related routes
  [NotificationTypes.NEW_MESSAGE]: {
    type: NotificationTypes.NEW_MESSAGE,
    getRoute: () => routes.dashboardMessages,
  },
  [NotificationTypes.NEW_CONVERSATION]: {
    type: NotificationTypes.NEW_CONVERSATION,
    getRoute: () => routes.dashboardMessages,
  },

  // Meeting related routes
  [NotificationTypes.MEETING_SCHEDULED]: {
    type: NotificationTypes.MEETING_SCHEDULED,
    getRoute: () => routes.dashboard,
  },
  [NotificationTypes.MEETING_REMINDER]: {
    type: NotificationTypes.MEETING_REMINDER,
    getRoute: () => routes.dashboard,
  },
  [NotificationTypes.MEETING_CANCELLED]: {
    type: NotificationTypes.MEETING_CANCELLED,
    getRoute: () => routes.dashboard,
  },
  [NotificationTypes.MEETING_RESCHEDULED]: {
    type: NotificationTypes.MEETING_RESCHEDULED,
    getRoute: () => routes.dashboard,
  },

  // Account related routes
  [NotificationTypes.ACCOUNT_VERIFICATION_REQUIRED]: {
    type: NotificationTypes.ACCOUNT_VERIFICATION_REQUIRED,
    getRoute: () => routes.dashboardProfile,
  },
  [NotificationTypes.ACCOUNT_VERIFIED]: {
    type: NotificationTypes.ACCOUNT_VERIFIED,
    getRoute: () => routes.dashboard,
  },
  [NotificationTypes.PROFILE_INCOMPLETE]: {
    type: NotificationTypes.PROFILE_INCOMPLETE,
    getRoute: () => routes.dashboardProfile,
  },

  // System related routes
  [NotificationTypes.SYSTEM_MAINTENANCE]: {
    type: NotificationTypes.SYSTEM_MAINTENANCE,
    getRoute: () => routes.dashboard,
  },
  [NotificationTypes.FEATURE_ANNOUNCEMENT]: {
    type: NotificationTypes.FEATURE_ANNOUNCEMENT,
    getRoute: () => routes.dashboard,
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
  const config = NOTIFICATION_TYPE_CONFIGS[type];

  // Fallback for unknown notification types
  if (!config) {
    return {
      type: type,
      label: "Notification",
      description: "You have a new notification",
      icon: "🔔",
      color: "text-gray-600",
      priority: NotificationPriority.MEDIUM,
      showInDropdown: true,
    };
  }

  return config;
};

export const getNotificationCategory = (
  type: NotificationSystemType
): NotificationCategory => {
  return NOTIFICATION_CATEGORIES_MAP[type] || NotificationCategory.SYSTEM;
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
    if (categorized[category]) {
      categorized[category].push(notification);
    } else {
      // Fallback to SYSTEM category if category is somehow still undefined
      categorized[NotificationCategory.SYSTEM].push(notification);
    }
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
