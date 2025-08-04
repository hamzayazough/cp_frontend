import {
  CampaignType,
  Deliverable,
  MeetingPlan,
  SalesTrackingMethod,
  PromoterCampaignStatus,
} from "@/app/enums/campaign-type";
import { SocialPlatform } from "@/app/enums/social-platform";
import { CampaignStatus } from "@/app/enums/campaign-type";
import { Promoter } from "../user";
import { AdvertiserType } from "@/app/enums/advertiser-type";
import { ApplicationStatus } from "../campaign-application";
import { CampaignDeliverable } from "@/app/interfaces/campaign-work";
import { AdvertiserCampaignStatus } from "../dashboard/advertiser-dashboard";
import { CampaignMedia } from "./campaign-media";

export enum AdvertiserCampaignSortField {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  TITLE = "title",
  STATUS = "status",
  DEADLINE = "deadline",
  TOTAL_BUDGET = "totalBudget",
  SPENT_AMOUNT = "spentAmount",
  TOTAL_PROMOTERS = "totalPromoters",
  CURRENT_VIEWS = "currentViews",
}

export interface PromoterApplicationInfo {
  promoter: Promoter;
  applicationStatus: ApplicationStatus;
  applicationMessage?: string;
}

export interface ChosenPromoterInfo {
  promoter: Promoter;
  status: PromoterCampaignStatus;

  // If promoter is in ONGOING or COMPLETED status
  viewsGenerated?: number; // For VISIBILITY campaigns
  joinedAt?: Date; // **If promoter get accepted only. So when not in AWAITING_REVIEW. When the promoter joined the campaign (ONGOING)
  earnings?: number;

  // if campaign is CONSULTANT or SELLER + is in ONGOING or COMPLETED
  numberMeetingsDone?: number; // Number of meetings done by the promoter
  budgetAllocated: number; // Amount currently reserved/held from advertiser
}

export interface AdvertiserBaseCampaignDetails {
  budgetHeld: number;
  spentBudget: number;
  targetAudience?: string;
  preferredPlatforms?: SocialPlatform[]; // Preferred platforms for the campaign

  requirements?: string[];
  createdAt: Date;
  deadline: string;
  startDate: string;
  isPublic: boolean; // Indicates if the campaign is visible to all promoters or if the advertiser has selected a specific promoter
  budgetAllocated: number;

  discordInviteLink: string; // Discord invite link for the campaign.
}

export interface AdvertiserVisibilityCampaignDetails
  extends AdvertiserBaseCampaignDetails {
  type: CampaignType.VISIBILITY;
  maxViews: number;
  currentViews: number; // Added to track the number of views generated so far (FOR PROMOTER ONLY)
  cpv: number;
  minFollowers?: number;
  trackingLink: string;
}

export interface AdvertiserConsultantCampaignDetails
  extends AdvertiserBaseCampaignDetails {
  type: CampaignType.CONSULTANT;
  meetingPlan: MeetingPlan;
  expectedDeliverables?: CampaignDeliverable[];
  expertiseRequired?: string;
  meetingCount: number;
  maxBudget: number;
  minBudget: number;
}

export interface AdvertiserSellerCampaignDetails
  extends AdvertiserBaseCampaignDetails {
  type: CampaignType.SELLER;
  sellerRequirements?: Deliverable[];
  deliverables?: CampaignDeliverable[];
  fixedPrice?: number;
  maxBudget: number;
  minBudget: number;
  minFollowers?: number;

  //new
  needMeeting: boolean; // If true, the promoter needs to have a meeting with the advertiser before starting the campaign
  meetingPlan: MeetingPlan; // If needMeeting is true, this will contain the meeting plan details
  meetingCount: number;
}

export interface AdvertiserSalesmanCampaignDetails
  extends AdvertiserBaseCampaignDetails {
  type: CampaignType.SALESMAN;
  commissionPerSale: number;
  trackSalesVia: SalesTrackingMethod;
  codePrefix?: string;
  refLink?: string;
  minFollowers?: number;
}

export type AdvertiserCampaignDetailsUnion =
  | AdvertiserVisibilityCampaignDetails
  | AdvertiserConsultantCampaignDetails
  | AdvertiserSellerCampaignDetails
  | AdvertiserSalesmanCampaignDetails;

export interface CampaignPerformance {
  totalViewsGained?: number;
  totalSalesMade?: number;
}

export interface CampaignAdvertiser {
  id: string;
  title: string;
  type: CampaignType;
  mediaUrls?: CampaignMedia[]; // List of campaign media (images/videos/documents)
  status: AdvertiserCampaignStatus;
  description: string; // from Campaign
  campaign: AdvertiserCampaignDetailsUnion;
  performance: CampaignPerformance; // money earned by the promoter for now by this campaign
  tags: AdvertiserType[]; //getting them from Advertiser user -> user.advertiserType
  meetingDone?: boolean; // Indicates if the meeting is done for campaigns that require it. from PromoterCampaign

  applicants?: PromoterApplicationInfo[];
  chosenPromoters?: ChosenPromoterInfo[]; // Promoter who have been selected for the campaign
}

// Pagination and filtering interfaces
export interface AdvertiserCampaignListRequest {
  // Pagination
  page?: number;
  limit?: number;

  // Filtering
  status?: CampaignStatus[];
  type?: CampaignType[];
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  budgetRange?: {
    minBudget?: number;
    maxBudget?: number;
  };
  searchQuery?: string; // Search in title, description
  isPublic?: boolean;

  // Sorting
  sortBy?: AdvertiserCampaignSortField;
  sortOrder?: "asc" | "desc";
}

export interface AdvertiserCampaignListResponse {
  campaigns: CampaignAdvertiser[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: {
    totalActiveCampaigns: number;
    totalCompletedCampaigns: number;
    totalSpentThisMonth: number;
    totalAllocatedBudget: number;
    totalRemainingBudget: number;
  };
}

export interface FundCampaignRequest {
  campaignId: string;
  amount: number;
  stripePaymentMethodId: string;
}

export interface ReviewPromoterApplicationRequest {
  campaignId: string;
  applicationId: string;
  action: "ACCEPTED" | "REJECTED";
}
