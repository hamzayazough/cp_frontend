import {
  CampaignStatus,
  CampaignType,
  SalesTrackingMethod,
  Deliverable,
  MeetingPlan,
} from "../enums/campaign-type";
import { AdvertiserType } from "../enums/advertiser-type";
import { SocialPlatform } from "../enums/social-platform";

// Base Campaign interface - now abstract, not used directly
export interface BaseCampaign {
  title: string;
  description: string;
  advertiserTypes?: AdvertiserType[];
  isPublic: boolean;
  expiryDate?: Date;
  mediaUrl?: string;

  requirements?: string[];
  targetAudience?: string;
  preferredPlatforms?: SocialPlatform[];
  deadline: Date;
  startDate: Date;

  //set by server
  id?: string;
  status?: CampaignStatus;
  createdAt?: Date;
  updatedAt?: Date;
  advertiserId?: string;
  discordInviteLink?: string;
}

export interface VisibilityCampaign extends BaseCampaign {
  type: CampaignType.VISIBILITY;
  cpv: number;
  maxViews?: number;
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
  isPublic: false;
}

export interface SellerCampaign extends BaseCampaign {
  type: CampaignType.SELLER;
  sellerRequirements?: Deliverable[];
  deliverables?: Deliverable[];
  maxBudget: number;
  minBudget: number;
  isPublic: false;
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
  isPublic: false;
  minFollowers?: number;
}

export type Campaign =
  | VisibilityCampaign
  | ConsultantCampaign
  | SellerCampaign
  | SalesmanCampaign;

// Form data interface for campaign creation wizard
export interface CampaignFormData {
  // Basic Info (matches base Campaign interface)
  title: string;
  description: string;
  type: CampaignType | null;
  expiryDate: Date | null;
  mediaUrl?: string; // Optional to match Campaign interface
  advertiserTypes: AdvertiserType[]; // Required array for selection

  // VISIBILITY Campaign fields (matches VisibilityCampaign)
  cpv?: number; // Required when type is VISIBILITY, but optional in form until validation
  maxViews?: number | null; // Optional in both
  trackUrl?: string; // Required when type is VISIBILITY, but optional in form until validation

  // CONSULTANT Campaign fields (matches ConsultantCampaign)
  expectedDeliverables?: Deliverable[]; // Required when type is CONSULTANT
  meetingCount?: number | null; // Optional in both
  referenceUrl?: string; // Optional - provided by promoter after selection
  maxBudget?: number; // Required when type is CONSULTANT
  minBudget?: number; // Required when type is CONSULTANT
  deadline?: Date | null; // Optional in both

  // SELLER Campaign fields (matches SellerCampaign)
  sellerRequirements?: Deliverable[]; // Optional in both
  deliverables?: Deliverable[]; // Optional in both
  meetingPlan?: MeetingPlan | null; // Optional in both
  // Note: Using same budget field names as consultant since they map to maxBudget/minBudget
  sellerMaxBudget?: number; // Maps to maxBudget for seller campaigns
  sellerMinBudget?: number; // Maps to minBudget for seller campaigns

  // SALESMAN Campaign fields (matches SalesmanCampaign)
  commissionPerSale?: number; // Required when type is SALESMAN
  trackSalesVia?: SalesTrackingMethod | null; // Required when type is SALESMAN
  codePrefix?: string; // Optional in both

  // UI-only fields (not sent to backend)
  file?: File | null; // For potential file uploads in certain campaign types
  isPublic: boolean; // Determines if campaign is public or private
}
