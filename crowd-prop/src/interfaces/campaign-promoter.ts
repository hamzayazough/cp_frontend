import {
  CampaignStatus,
  CampaignType,
  Deliverable,
  MeetingPlan,
  SalesTrackingMethod,
} from "@/app/enums/campaign-type";
import { SocialPlatform } from "@/app/enums/social-platform";

export interface Advertiser {
  name: string;
  profileUrl?: string;
  rating: number;
  verified: boolean;
  description: string;
  website: string;
}

export interface BaseCampaignDetails {
  budget: number;
  spentBudget: number;
  targetAudience?: string;
  platforms?: SocialPlatform[];
  requirements?: string[];
  createdAt: Date;
  deadline?: string;
  startDate?: string;
  isPublic: boolean; // Indicates if the campaign is visible to all promoters or if the advertiser has selected a specific promoter

  preferredPlatforms?: SocialPlatform[]; // Preferred platforms for the campaign

  PromoterLinks?: string[]; // Promoter added links for the campaign (example Instagram post, TikTok video, drive doc, etc.) Promoter can add new links, update or delete existing ones
  discordInviteLink: string; // Discord invite link for the campaign.
}

export interface VisibilityCampaignDetails extends BaseCampaignDetails {
  type: CampaignType.VISIBILITY;
  maxViews: number;
  currentViews: number; // Added to track the number of views generated so far (FOR PROMOTER ONLY)
  cpv: number;
  minFollowers?: number;
  trackingLink: string;
}

export interface ConsultantCampaignDetails extends BaseCampaignDetails {
  type: CampaignType.CONSULTANT;
  meetingPlan?: MeetingPlan;
  deliverables?: Deliverable[];
  expertiseRequired?: string;
  meetingCount?: number;
  maxBudget: number;
  minBudget: number;
}

export interface SellerCampaignDetails extends BaseCampaignDetails {
  type: CampaignType.SELLER;
  deliverables?: Deliverable[];
  deadlineStrict?: boolean;
  sellerRequirements?: Deliverable[];
  fixedPrice?: number;
  maxBudget: number;
  minBudget: number;
}

export interface SalesmanCampaignDetails extends BaseCampaignDetails {
  type: CampaignType.SALESMAN;
  commissionPerSale: number;
  trackSalesVia: SalesTrackingMethod;
  codePrefix?: string;
  refLink?: string;
  minFollowers?: number;
}

export type CampaignDetailsUnion =
  | VisibilityCampaignDetails
  | ConsultantCampaignDetails
  | SellerCampaignDetails
  | SalesmanCampaignDetails;

export interface Earnings {
  totalEarned: number;
  viewsGenerated: number;
  averageCPV: number;
  projectedTotal: number;
}

export interface CampaignPromoter {
  id: string;
  title: string;
  type: CampaignType;
  mediaUrl?: string; // URL to the S3 campaign media (image/video)
  status: CampaignStatus;
  description: string;
  advertiser: Advertiser;
  campaign: CampaignDetailsUnion;
  earnings: Earnings; // money earned by the promoter for now by this campaign
  tags: string[];
  joinedDate: string;
  lastActivity: string;
}
