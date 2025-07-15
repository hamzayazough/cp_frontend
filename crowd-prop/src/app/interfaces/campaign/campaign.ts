import {
  CampaignStatus,
  CampaignType,
  SalesTrackingMethod,
  Deliverable,
  MeetingPlan,
} from "../../enums/campaign-type";
import { AdvertiserType } from "../../enums/advertiser-type";
import { SocialPlatform } from "../../enums/social-platform";

// Base Campaign interface - now abstract, not used directly
export interface BaseCampaign {
  title: string;
  description: string;
  advertiserTypes?: AdvertiserType[];
  isPublic: boolean;
  mediaUrl?: string; // URL to uploaded media file

  requirements?: string[];
  targetAudience?: string;
  preferredPlatforms?: SocialPlatform[];
  deadline: Date; // When the campaign should be deactivated and no longer visible to promoters
  startDate: Date;

  //set by server
  id?: string;
  status?: CampaignStatus;
  createdAt?: Date;
  updatedAt?: Date;
  advertiserId?: string;
  discordInviteLink?: string;
  budgetAllocated?: number;
}

export interface VisibilityCampaign extends BaseCampaign {
  type: CampaignType.VISIBILITY;
  cpv: number;
  maxViews: number;
  trackingLink: string;
  minFollowers?: number;
  currentViews?: number;
}

export interface ConsultantCampaign extends BaseCampaign {
  type: CampaignType.CONSULTANT;
  meetingPlan: MeetingPlan;
  expertiseRequired?: string;
  expectedDeliverables: Deliverable[];
  meetingCount: number;
  maxBudget: number;
  minBudget: number;
  // isPublic is always false for consultant campaigns - inherited from BaseCampaign
}

export interface SellerCampaign extends BaseCampaign {
  type: CampaignType.SELLER;
  sellerRequirements: Deliverable[];
  deliverables: Deliverable[];
  maxBudget: number;
  minBudget: number;
  // isPublic is always false for seller campaigns - inherited from BaseCampaign
  minFollowers?: number;

  // new
  needMeeting: boolean; // If true, the promoter needs to have a meeting with the advertiser before starting the campaign
  meetingPlan: MeetingPlan; // If needMeeting is true, this will contain the meeting plan details
  meetingCount: number; // Number of meetings required for the campaign
}

export interface SalesmanCampaign extends BaseCampaign {
  type: CampaignType.SALESMAN;
  commissionPerSale: number;
  trackSalesVia: SalesTrackingMethod;
  codePrefix?: string;
  // isPublic is always false for salesman campaigns - inherited from BaseCampaign
  minFollowers?: number;
}

export type Campaign =
  | VisibilityCampaign
  | ConsultantCampaign
  | SellerCampaign
  | SalesmanCampaign;
