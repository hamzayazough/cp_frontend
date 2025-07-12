import { AdvertiserType } from "@/app/enums/advertiser-type";
import {
  CampaignType,
  Deliverable,
  MeetingPlan,
  SalesTrackingMethod,
} from "@/app/enums/campaign-type";
import { SocialPlatform } from "@/app/enums/social-platform";
import { PromoterCampaignStatus } from "../promoter-campaign";

export interface Advertiser {
  id: string;
  companyName: string;
  profileUrl?: string;
  rating: number;
  verified: boolean;
  description: string;
  website: string;
  advertiserTypes: AdvertiserType[];
}

export interface BaseCampaignDetails {
  id: string;
  advertiser: Advertiser;
  title: string;
  type: CampaignType;
  mediaUrl?: string; // URL to the S3 campaign media (image/video)
  status: PromoterCampaignStatus; // PromoterCampaign.status
  description: string; // from Campaign
  targetAudience?: string;
  preferredPlatforms?: SocialPlatform[]; // Preferred platforms for the campaign
  requirements?: string[];
  createdAt: Date;
  deadline: string;
  startDate: string;
  isPublic: boolean;
  tags: AdvertiserType[]; //getting them from Advertiser user -> user.advertiserType
}

export interface ConsultantCampaign extends BaseCampaignDetails {
  type: CampaignType.CONSULTANT;
  meetingPlan: MeetingPlan;
  expectedDeliverables?: Deliverable[];
  expertiseRequired?: string; // a requirement
  meetingCount: number;
  maxBudget: number;
  minBudget: number;
}

export interface VisibilityCampaign extends BaseCampaignDetails {
  type: CampaignType.VISIBILITY;
  maxViews: number;
  currentViews: number;
  cpv: number;
  minFollowers?: number; // a requirement
}

export interface SellerCampaign extends BaseCampaignDetails {
  type: CampaignType.SELLER;
  sellerRequirements?: Deliverable[];
  deliverables?: Deliverable[];
  maxBudget: number;
  minBudget: number;
  minFollowers?: number; // a requirement
  needMeeting: boolean; // If true, the promoter needs to have a meeting with the advertiser before starting the campaign
  meetingPlan: MeetingPlan; // If needMeeting is true, this will contain the meeting plan details
  meetingCount: number;
}

export interface SalesmanCampaign extends BaseCampaignDetails {
  type: CampaignType.SALESMAN;
  commissionPerSale: number;
  trackSalesVia: SalesTrackingMethod;
  codePrefix?: string;
  refLink?: string;
  minFollowers?: number; // a requirement
}

export type CampaignUnion =
  | VisibilityCampaign
  | ConsultantCampaign
  | SellerCampaign
  | SalesmanCampaign;

export interface ExploreCampaignResponse {
  campaigns: CampaignUnion[];
  page: number;
  totalPages: number;
  totalCount: number;
  sortBy: string; // sorting criteria used
  searchTerm: string; // search term used for filtering
  typeFilter: CampaignType[]; // type filter used for filtering
  advertiserTypes: AdvertiserType[]; // Advertiser types used for filtering
}
