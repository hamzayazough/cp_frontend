import { AdvertiserType } from "../enums/advertiser-type";
import { Language } from "../enums/language";
import { AdvertiserWork } from "./advertiser-work";
import { FollowerEstimate } from "./follower-estimate";
import { PromoterWork } from "./promoter-work";

export type UserRole = "ADVERTISER" | "PROMOTER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  isSetupDone: boolean;

  avatarUrl?: string; // Profile picture (S3 URL)
  backgroundUrl?: string; // Background banner (S3 URL)
  bio?: string;
  rating?: number;

  // Social Media Links
  tiktokUrl?: string;
  instagramUrl?: string;
  snapchatUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string; // Personal or company website

  // Stripe / Financial
  stripeAccountId?: string;
  walletBalance?: number;

  // Role-specific fields
  advertiserDetails?: AdvertiserDetails;
  promoterDetails?: PromoterDetails;
  usedCurrency?: "USD" | "CAD";
  country: string;
}

// Advertiser-specific data
export interface AdvertiserDetails {
  companyName: string;
  advertiserTypes: AdvertiserType[]; // e.g., ["CLOTHING", "EDUCATION"]
  companyWebsite?: string;
  verified?: boolean;
  advertiserWork?: AdvertiserWork[]; // Example products or services offered
  discordChannelUrl?: string;
}

// 📣 Promoter-specific data
export interface PromoterDetails {
  works: PromoterWork[]; // List of past projects (mp4, images)
  location?: string;
  languagesSpoken?: Language[];
  followersEstimate?: FollowerEstimate[];
  skills?: string[];
  verified?: boolean;
  totalSales?: number;
  numberOfCampaignDone?: number;
  totalViewsGenerated?: number;
  isBusiness: boolean;
  businessName?: string;
}

export interface Advertiser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  avatarUrl?: string; // Profile picture (S3 URL)
  backgroundUrl?: string; // Background banner (S3 URL)
  bio?: string;
  rating?: number;

  companyName: string;
  advertiserTypes: AdvertiserType[];
  companyWebsite?: string;
  verified?: boolean;
  advertiserWork?: AdvertiserWork[];
}

export interface Promoter {
  id: string;
  email: string;
  name: string;
  createdAt: string;

  avatarUrl?: string; // Profile picture (S3 URL)
  backgroundUrl?: string; // Background banner (S3 URL)
  bio?: string;
  rating?: number;

  // Social Media Links
  tiktokUrl?: string;
  instagramUrl?: string;
  snapchatUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  works: PromoterWork[]; // List of past projects (mp4, images)
  location?: string;
  languagesSpoken?: Language[];
  followersEstimate?: FollowerEstimate[];
  skills?: string[];
  verified?: boolean;
  totalSales?: number;
  numberOfCampaignDone?: number;
  numberOfVisibilityCampaignDone?: number;
  numberOfSellerCampaignDone?: number;
  numberOfSalesmanCampaignDone?: number;
  numberOfConsultantCampaignDone?: number;
  totalViewsGenerated?: number;
  isBusiness: boolean;
  businessName?: string;
  country: string;
}
