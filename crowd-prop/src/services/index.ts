// HTTP Service - Base service for all API communications
export { HttpService, httpService } from "./http.service";
export type { RequestConfig, ApiResponse } from "./http.service";

// Authentication Service - Authentication and user account management
export { AuthService, authService } from "./auth.service";
export type {
  AuthResponse,
  ProfileResponse,
  UsernameCheckResponse,
  UserByIdResponse,
} from "./auth.service";

// User Service - User management and profile operations
export { UserService, userService } from "./user.service";
export type {
  CreateUserRequest,
  UpdateUserRequest,
  UserProfileResponse,
} from "./user.service";

// Stripe Service - Stripe Connect and payment operations
export { stripeService } from "./stripe.service";

// Campaign Work - Campaign work management
export type {
  CampaignWork,
  CampaignWorkComment,
} from "../app/interfaces/campaign-work";

// Promoter Service - Promoter dashboard and campaign management
export { PromoterService, promoterService } from "./promoter.service";
export type {
  PromoterDashboardData,
  PromoterStats,
  PromoterActiveCampaign,
  PromoterSuggestedCampaign,
  PromoterTransaction,
  PromoterMessage,
  PromoterWallet,
  GetPromoterDashboardRequest,
  GetPromoterDashboardResponse,
} from "../app/interfaces/dashboard/promoter-dashboard";

// Advertiser Service - Advertiser dashboard and campaign management
export { advertiserService } from "./advertiser.service";
export type {
  AdvertiserDashboardData,
  AdvertiserStats,
  AdvertiserActiveCampaign,
  AdvertiserTransaction,
  AdvertiserMessage,
  AdvertiserWallet,
  GetAdvertiserDashboardRequest,
  GetAdvertiserDashboardResponse,
} from "../app/interfaces/dashboard/advertiser-dashboard";

// Advertiser Payment Service - Payment management for advertisers
export { advertiserPaymentService } from "./advertiser-payment.service";

// Notification Service - Notification preferences and settings management
export {
  NotificationService,
  notificationService,
} from "./notification.service";

// Notification System Service - In-app notification management
export {
  NotificationSystemService,
  notificationSystemService,
} from "./notification-system.service";

// Import service instances separately for the services object
import { httpService } from "./http.service";
import { authService } from "./auth.service";
import { userService } from "./user.service";
import { promoterService } from "./promoter.service";
import { advertiserService } from "./advertiser.service";
import { stripeService } from "./stripe.service";
import { notificationService } from "./notification.service";
import { notificationSystemService } from "./notification-system.service";

// Re-export commonly used service instances for convenience
export const services = {
  http: httpService,
  auth: authService,
  user: userService,
  promoter: promoterService,
  advertiser: advertiserService,
  stripe: stripeService,
  notification: notificationService,
  notificationSystem: notificationSystemService,
} as const;
