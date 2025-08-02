import { SocialPlatform } from "../enums/social-platform";
import { AdvertiserType } from "../enums/advertiser-type";
import { Language } from "../enums/language";

export type UserRole = "ADVERTISER" | "PROMOTER" | "ADMIN";

export interface CreateUserDto {
  firebaseUid: string;
  email: string;
  name: string;
  bio: string;
  role: UserRole | null;

  tiktokUrl: string;
  instagramUrl: string;
  snapchatUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  websiteUrl: string;

  // Profile images
  avatarUrl?: string;
  backgroundUrl?: string;
  usedCurrency: "USD" | "CAD";
  advertiserDetails?: AdvertiserDetailsDto;
  promoterDetails?: PromoterDetailsDto;
  country: string;
}

export interface AdvertiserDetailsDto {
  companyName: string;
  advertiserTypes: AdvertiserType[];
  companyWebsite: string;
}

export interface PromoterDetailsDto {
  location: string;
  languagesSpoken: Language[];
  skills: string[];
  isBusiness: boolean;
  businessName?: string;
  followerEstimates?: FollowerEstimateDto[];
  works?: PromoterWorkDto[];
}

export interface FollowerEstimateDto {
  platform: SocialPlatform;
  count: number;
}

export interface PromoterWorkDto {
  title: string;
  description?: string;
  mediaUrl: string;
}
