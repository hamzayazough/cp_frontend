import { AdvertiserType } from "@/app/enums/advertiser-type";
import {
  CampaignType,
  Deliverable,
  MeetingPlan,
  SalesTrackingMethod,
} from "@/app/enums/campaign-type";
import { SocialPlatform } from "@/app/enums/social-platform";
import { PromoterCampaignStatus } from "@/app/interfaces/promoter-campaign";
import { CampaignDeliverable } from "@/app/interfaces/campaign-work";
import { CampaignMedia } from "./campaign-media";

export interface Advertiser {
  id: string; // Optional ID for the advertiser
  companyName: string;
  profileUrl?: string;
  rating: number;
  verified: boolean;
  description: string;
  website: string;
  advertiserTypes: AdvertiserType[];
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
  discordThreadUrl?: string; // Optional Discord thread URL for campaign discussions
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
  meetingPlan: MeetingPlan;
  expectedDeliverables?: CampaignDeliverable[];
  expertiseRequired?: string;
  meetingCount: number;
  maxBudget: number;
  minBudget: number;
}

export interface SellerCampaignDetails extends BaseCampaignDetails {
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
  mediaUrls?: CampaignMedia[];
  status: PromoterCampaignStatus; // PromoterCampaign.status
  description: string; // from Campaign
  advertiser: Advertiser;
  campaign: CampaignDetailsUnion;
  earnings: Earnings; // money earned by the promoter for now by this campaign
  tags: AdvertiserType[]; //getting them from Advertiser user -> user.advertiserType
  meetingDone?: boolean; // Indicates if the meeting is done for campaigns that require it. from PromoterCampaign
}
