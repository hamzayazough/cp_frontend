import { CampaignType, CampaignStatus } from "../enums/campaign-type";
import { SaleVerificationStatus } from "../enums/sale-verification-status-type";
import { SocialPlatform } from "../enums/social-platform";
import { PromoterCampaignStatus } from "./promoter-campaign";

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

// Single advertiser campaign interface
export interface AdvertiserCampaign {
  // Basic campaign info
  id: string;
  title: string;
  description: string;
  type: CampaignType;
  status: CampaignStatus;
  isPublic: boolean;
  mediaUrl?: string;

  // Dates
  startDate: Date;
  deadline: Date;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Campaign-specific fields
  maxViews?: number; // For VISIBILITY campaigns
  cpv?: number; // Cost per view for VISIBILITY campaigns
  trackingLink?: string; // For VISIBILITY campaigns
  currentViews?: number; // Current view count

  maxBudget?: number; // For CONSULTANT/SELLER campaigns
  minBudget?: number; // For CONSULTANT/SELLER campaigns
  commissionPerSale?: number; // For SALESMAN campaigns

  // Social and targeting
  preferredPlatforms?: SocialPlatform[];
  targetAudience?: string;
  requirements?: string[];
  minFollowers?: number;

  // Budget and financial tracking
  totalBudget: number;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  isFunded: boolean;
  fundedAt?: Date;
  stripePaymentIntentId?: string;

  // Performance metrics
  totalPromoters: number; // Number of promoters who joined
  activePromoters: number; // Currently active promoters
  completedPromoters: number; // Promoters who completed the campaign

  // Additional fields
  discordInviteLink?: string;
  promoterLinks?: string[]; // Links submitted by promoters

  // Private campaign management
  ongoingPromoter?: OngoingPromoter; // For private campaigns with selected promoter
  pendingApplicationsCount?: number; // For private campaigns awaiting promoter selection
}

// Ongoing promoter information for private campaigns
export interface OngoingPromoter {
  id: string;
  name: string;
  avatarUrl?: string;
  status: string; // PromoterCampaignStatus but avoiding circular import
  joinedAt: Date;

  // Campaign-specific information
  // For CONSULTANT campaigns
  meetingsCompleted?: number;
  totalMeetings?: number;
  nextMeetingDate?: Date;

  // For SALESMAN campaigns
  salesGenerated?: number;
  totalCommission?: number;

  // For SELLER campaigns
  deliverables?: string[];
  deliverableProgress?: string;
}

// Related DTOs for API responses
export interface AdvertiserCampaignDetails extends AdvertiserCampaign {
  // Additional details for single campaign view
  promoterApplications?: PromoterApplication[];
  viewStatistics?: CampaignViewStats;
  salesRecords?: CampaignSalesRecord[];
  budgetAllocations?: CampaignBudgetAllocation[];
}

// Promoter application for campaigns
export interface PromoterApplication {
  id: string;
  promoterId: string;
  promoterName: string;
  promoterAvatarUrl?: string;
  promoterRating?: number;
  applicationMessage?: string;
  status: PromoterCampaignStatus;
  appliedAt: Date;
  reviewedAt?: Date;
  campaignId?: string; // Added to link applications to specific campaigns
  socialMediaLinks?: {
    tiktokUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    twitterUrl?: string;
  };
  followerCounts?: {
    [key in SocialPlatform]?: number;
  };
  // Additional details for application review
  proposedRate?: number;
  availability?: string;
  previousWorkExamples?: string[];
}

// Campaign statistics for analytics
export interface CampaignViewStats {
  totalViews: number;
  uniqueViews: number;
  totalClicks: number;
  conversionRate: number;
  dailyStats: {
    date: Date;
    views: number;
    clicks: number;
  }[];
}

export interface CampaignSalesRecord {
  id: string;
  promoterId: string;
  promoterName: string;
  saleAmount: number;
  commissionRate: number;
  commissionEarned: number;
  saleDate: Date;
  trackingCode?: string;
  verificationStatus: SaleVerificationStatus;
  verifiedAt?: Date;
}

export interface CampaignBudgetAllocation {
  id: string;
  promoterId?: string;
  promoterName?: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  status: PayoutStatus;
  createdAt: Date;
  fundedAt?: Date;
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
  campaigns: AdvertiserCampaign[];
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

// Dashboard summary for advertiser
export interface AdvertiserDashboardSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  draftCampaigns: number;

  // Financial summary
  totalSpent: number;
  totalAllocated: number;
  remainingBudget: number;
  monthlySpend: number;

  // Performance metrics
  totalViews: number;
  totalClicks: number;
  averageCTR: number;
  totalSales: number;
  totalRevenue: number;

  // Recent activity
  recentApplications: PromoterApplication[];
  recentCompletions: {
    campaignId: string;
    campaignTitle: string;
    promoterName: string;
    completedAt: Date;
    earnings: number;
  }[];

  // Trending campaigns
  topPerformingCampaigns: {
    id: string;
    title: string;
    views: number;
    ctr: number;
    activePromoters: number;
  }[];
}

export interface UpdateCampaignRequest {
  id: string;
  title?: string;
  description?: string;
  deadline?: Date;
  status?: CampaignStatus;

  // Update targeting
  preferredPlatforms?: SocialPlatform[];
  targetAudience?: string;
  requirements?: string[];
  minFollowers?: number;
}

export interface FundCampaignRequest {
  campaignId: string;
  amount: number;
  stripePaymentMethodId: string;
}

export interface ReviewPromoterApplicationRequest {
  applicationId: string;
  status: PromoterCampaignStatus;
  reviewMessage?: string;
}
