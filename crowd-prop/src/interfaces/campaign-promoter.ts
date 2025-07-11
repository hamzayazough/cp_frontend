import { AdvertiserType } from "@/app/enums/advertiser-type";
import {
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
  budgetHeld: number;
  spentBudget: number;
  targetAudience?: string;
  preferredPlatforms?: SocialPlatform[]; // Preferred platforms for the campaign

  requirements?: string[];
  createdAt: Date;
  deadline: string;
  startDate: string;
  isPublic: boolean; // Indicates if the campaign is visible to all promoters or if the advertiser has selected a specific promoter

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
  expectedDeliverables?: Deliverable[];
  expertiseRequired?: string;
  meetingCount?: number;
  maxBudget: number;
  minBudget: number;
  promoterLinks?: string[]; // Promoter added links for the campaign (example Instagram post, TikTok video, drive doc, etc.) Promoter can add new links, update or delete existing ones
}

export interface SellerCampaignDetails extends BaseCampaignDetails {
  type: CampaignType.SELLER;
  sellerRequirements?: Deliverable[];
  deliverables?: Deliverable[];
  fixedPrice?: number;
  maxBudget: number;
  minBudget: number;
  promoterLinks?: string[]; // Promoter added links for the campaign (example Instagram post, TikTok video, drive doc, etc.) Promoter can add new links, update or delete existing ones
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
  totalEarned: number; // PromoterCampaign.earnings
  viewsGenerated: number; //from PromoterCampaign
  projectedTotal: number;
}

export interface CampaignPromoter {
  id: string;
  title: string;
  type: CampaignType;
  mediaUrl?: string; // URL to the S3 campaign media (image/video)
  status: PromoterCampaignStatus; // PromoterCampaign.status
  description: string; // from Campaign
  advertiser: Advertiser;
  campaign: CampaignDetailsUnion;
  earnings: Earnings; // money earned by the promoter for now by this campaign
  tags: AdvertiserType[]; //getting them from Advertiser user -> user.advertiserType
}
