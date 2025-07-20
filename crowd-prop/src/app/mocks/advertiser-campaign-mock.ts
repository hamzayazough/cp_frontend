import {
  CampaignStatus,
  CampaignType,
  MeetingPlan,
  Deliverable,
  SalesTrackingMethod,
  PromoterCampaignStatus,
} from "../enums/campaign-type";
import { SocialPlatform } from "../enums/social-platform";
import { AdvertiserType } from "../enums/advertiser-type";
import {
  CampaignAdvertiser,
  AdvertiserCampaignListResponse,
  AdvertiserDashboardSummary,
  PromoterApplicationInfo,
  AdvertiserCampaignSortField,
  AdvertiserVisibilityCampaignDetails,
  AdvertiserConsultantCampaignDetails,
  AdvertiserSalesmanCampaignDetails,
} from "../interfaces/campaign/advertiser-campaign";
import { Promoter } from "../interfaces/user";
import { CampaignDeliverable } from "../interfaces/campaign-work";

// Mock Promoters
const MOCK_PROMOTERS: Promoter[] = [
  {
    id: "promoter-1",
    email: "maya.chen@example.com",
    name: "Maya Chen",
    createdAt: "2024-01-15T10:00:00Z",
    avatarUrl: "https://example.com/avatars/maya.jpg",
    bio: "Creative strategist with 8 years experience in brand campaigns. I've helped launch 50+ successful marketing initiatives.",
    rating: 4.7,
    tiktokUrl: "https://tiktok.com/@mayacreative",
    instagramUrl: "https://instagram.com/mayacreative",
    youtubeUrl: "https://youtube.com/mayacreative",
    works: [],
    location: "Los Angeles, CA",
    languagesSpoken: [],
    followersEstimate: [],
    skills: ["Creative Strategy", "Brand Campaigns", "Content Creation"],
  },
  {
    id: "promoter-2",
    email: "alex.rodriguez@example.com",
    name: "Alex Rodriguez",
    createdAt: "2024-02-20T14:30:00Z",
    avatarUrl: "https://example.com/avatars/alex.jpg",
    bio: "Tech influencer and consultant specializing in SaaS and startup growth strategies.",
    rating: 4.9,
    tiktokUrl: "https://tiktok.com/@alextech",
    instagramUrl: "https://instagram.com/alextech",
    twitterUrl: "https://twitter.com/alextech",
    works: [],
    location: "San Francisco, CA",
    languagesSpoken: [],
    followersEstimate: [],
    skills: ["SaaS Marketing", "Growth Strategy", "Tech Consulting"],
  },
  {
    id: "promoter-3",
    email: "sarah.johnson@example.com",
    name: "Sarah Johnson",
    createdAt: "2024-03-10T09:15:00Z",
    avatarUrl: "https://example.com/avatars/sarah.jpg",
    bio: "Marketing specialist with expertise in multi-platform campaigns and audience engagement.",
    rating: 4.6,
    instagramUrl: "https://instagram.com/sarahmarketing",
    youtubeUrl: "https://youtube.com/sarahmarketing",
    works: [],
    location: "New York, NY",
    languagesSpoken: [],
    followersEstimate: [],
    skills: [
      "Multi-platform Marketing",
      "Audience Engagement",
      "Campaign Strategy",
    ],
  },
];

// Mock Promoter Application Info
const MOCK_PROMOTER_APPLICATIONS: PromoterApplicationInfo[] = [
  {
    promoter: MOCK_PROMOTERS[0],
    status: PromoterCampaignStatus.AWAITING_REVIEW,
  },
  {
    promoter: MOCK_PROMOTERS[1],
    status: PromoterCampaignStatus.AWAITING_REVIEW,
  },
  {
    promoter: MOCK_PROMOTERS[2],
    status: PromoterCampaignStatus.AWAITING_REVIEW,
  },
];

// Mock Campaigns
export const MOCK_ADVERTISER_CAMPAIGNS: CampaignAdvertiser[] = [
  // Visibility Campaign
  {
    id: "campaign-1",
    title: "Summer Fashion Collection 2024",
    type: CampaignType.VISIBILITY,
    mediaUrl: "https://example.com/summer-fashion.jpg",
    status: CampaignStatus.ACTIVE,
    description:
      "Promote our latest summer fashion collection to Gen Z audience",
    campaign: {
      type: CampaignType.VISIBILITY,
      maxViews: 100000,
      currentViews: 45230,
      cpv: 0.05,
      minFollowers: 5000,
      trackingLink: "https://fashionbrand.com/summer?ref=campaign1",
      budgetHeld: 5000,
      spentBudget: 2261.5,
      targetAudience: "Fashion-conscious Gen Z, ages 16-25",
      preferredPlatforms: [SocialPlatform.TIKTOK, SocialPlatform.INSTAGRAM],
      requirements: [
        "Post during peak hours",
        "Use provided hashtags",
        "Tag brand account",
      ],
      createdAt: new Date("2024-05-15"),
      deadline: "2024-08-31",
      startDate: "2024-06-01",
      isPublic: true,
      discordInviteLink: "https://discord.gg/summer2024",
    } as AdvertiserVisibilityCampaignDetails,
    performance: {
      totalViewsGained: 45230,
    },
    tags: [AdvertiserType.CLOTHING, AdvertiserType.BEAUTY],
    promoters: [],
  },

  // Consultant Campaign with Applications
  {
    id: "campaign-7",
    title: "Creative Consultation Needed",
    type: CampaignType.CONSULTANT,
    mediaUrl: "https://example.com/creative-consultation.jpg",
    status: CampaignStatus.ACTIVE,
    description: "Looking for creative input on our new marketing campaign",
    campaign: {
      type: CampaignType.CONSULTANT,
      meetingPlan: MeetingPlan.WEEKLY,
      expectedDeliverables: [
        {
          id: "deliverable-1",
          campaignId: "campaign-7",
          deliverable: Deliverable.CONTENT_PLAN,
          isSubmitted: false,
          isFinished: false,
          createdAt: new Date("2024-06-30"),
          updatedAt: new Date("2024-06-30"),
          promoterWork: [],
        },
      ] as CampaignDeliverable[],
      expertiseRequired: "Creative Strategy, Brand Development",
      meetingCount: 4,
      maxBudget: 5000,
      minBudget: 1000,
      budgetHeld: 5000,
      spentBudget: 0,
      targetAudience: "Creative professionals with marketing experience",
      preferredPlatforms: [SocialPlatform.INSTAGRAM, SocialPlatform.TIKTOK],
      requirements: [
        "Minimum 3 years experience",
        "Portfolio of previous work",
        "Available for weekly meetings",
      ],
      createdAt: new Date("2024-06-30"),
      deadline: "2024-08-30",
      startDate: "2024-07-01",
      isPublic: false,
      discordInviteLink: "https://discord.gg/creative2024",
    } as AdvertiserConsultantCampaignDetails,
    performance: {},
    tags: [AdvertiserType.CONSULTING, AdvertiserType.TECH],
    promoters: MOCK_PROMOTER_APPLICATIONS,
  },

  // Salesman Campaign
  {
    id: "campaign-3",
    title: "Affiliate Marketing Program",
    type: CampaignType.SALESMAN,
    mediaUrl: "https://example.com/affiliate-program.jpg",
    status: CampaignStatus.ACTIVE,
    description: "Join our affiliate program and earn commission on every sale",
    campaign: {
      type: CampaignType.SALESMAN,
      commissionPerSale: 50,
      trackSalesVia: SalesTrackingMethod.COUPON_CODE,
      codePrefix: "AFFILIATE",
      minFollowers: 1000,
      budgetHeld: 12000,
      spentBudget: 0,
      targetAudience: "Affiliate marketers and influencers",
      preferredPlatforms: [
        SocialPlatform.INSTAGRAM,
        SocialPlatform.TIKTOK,
        SocialPlatform.YOUTUBE,
      ],
      requirements: [
        "Minimum 1000 followers",
        "Previous affiliate experience preferred",
        "Active engagement with audience",
      ],
      createdAt: new Date("2024-07-19"),
      deadline: "2024-12-31",
      startDate: "2024-07-20",
      isPublic: true,
      discordInviteLink: "https://discord.gg/affiliate2024",
    } as AdvertiserSalesmanCampaignDetails,
    performance: {
      totalSalesMade: 0,
    },
    tags: [AdvertiserType.ECOMMERCE, AdvertiserType.TECH],
    promoters: [],
  },
];

// Mock Campaign Filters
export const MOCK_CAMPAIGN_FILTERS = {
  statuses: [
    CampaignStatus.ACTIVE,
    CampaignStatus.PAUSED,
    CampaignStatus.ENDED,
  ],
  types: [
    CampaignType.VISIBILITY,
    CampaignType.CONSULTANT,
    CampaignType.SALESMAN,
    CampaignType.SELLER,
  ],
};

// Helper function to get applications by campaign ID
export const getApplicationsByCampaignId = (
  campaignId: string
): PromoterApplicationInfo[] => {
  const campaign = MOCK_ADVERTISER_CAMPAIGNS.find((c) => c.id === campaignId);
  return campaign?.promoters || [];
};

// Helper function to get filtered campaigns
export const getFilteredCampaigns = (
  campaigns: CampaignAdvertiser[],
  filters: {
    status?: CampaignStatus[];
    type?: CampaignType[];
    searchQuery?: string;
    isPublic?: boolean;
  }
): CampaignAdvertiser[] => {
  return campaigns.filter((campaign) => {
    if (filters.status && !filters.status.includes(campaign.status)) {
      return false;
    }
    if (filters.type && !filters.type.includes(campaign.type)) {
      return false;
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (
        !campaign.title.toLowerCase().includes(query) &&
        !campaign.description.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (
      filters.isPublic !== undefined &&
      campaign.campaign.isPublic !== filters.isPublic
    ) {
      return false;
    }
    return true;
  });
};

// Helper function to sort campaigns
export const sortCampaigns = (
  campaigns: CampaignAdvertiser[],
  sortBy: AdvertiserCampaignSortField,
  sortOrder: "asc" | "desc" = "desc"
): CampaignAdvertiser[] => {
  return [...campaigns].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortBy) {
      case AdvertiserCampaignSortField.TITLE:
        aValue = a.title;
        bValue = b.title;
        break;
      case AdvertiserCampaignSortField.STATUS:
        aValue = a.status;
        bValue = b.status;
        break;
      case AdvertiserCampaignSortField.CREATED_AT:
        aValue = a.campaign.createdAt;
        bValue = b.campaign.createdAt;
        break;
      case AdvertiserCampaignSortField.DEADLINE:
        aValue = new Date(a.campaign.deadline);
        bValue = new Date(b.campaign.deadline);
        break;
      case AdvertiserCampaignSortField.TOTAL_BUDGET:
        aValue = a.campaign.budgetHeld;
        bValue = b.campaign.budgetHeld;
        break;
      case AdvertiserCampaignSortField.SPENT_AMOUNT:
        aValue = a.campaign.spentBudget;
        bValue = b.campaign.spentBudget;
        break;
      case AdvertiserCampaignSortField.CURRENT_VIEWS:
        aValue =
          a.campaign.type === CampaignType.VISIBILITY
            ? (a.campaign as AdvertiserVisibilityCampaignDetails).currentViews
            : 0;
        bValue =
          b.campaign.type === CampaignType.VISIBILITY
            ? (b.campaign as AdvertiserVisibilityCampaignDetails).currentViews
            : 0;
        break;
      default:
        aValue = a.campaign.createdAt;
        bValue = b.campaign.createdAt;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

// Mock Dashboard Summary
export const MOCK_ADVERTISER_DASHBOARD_SUMMARY: AdvertiserDashboardSummary = {
  totalCampaigns: 3,
  activeCampaigns: 3,
  completedCampaigns: 0,
  draftCampaigns: 0,
  totalSpent: 2261.5,
  totalAllocated: 22000,
  remainingBudget: 19738.5,
  monthlySpend: 1200,
  totalViews: 45230,
  totalSales: 0,
  totalRevenue: 0,
  // Percentage changes for stats cards
  campaignsPercentageChange: 12.0,
  spendPercentageChange: 8.2,
  viewsPercentageChange: 15.3,
  salesPercentageChange: 18.5,
  recentApplications: MOCK_PROMOTER_APPLICATIONS,
  recentCompletions: [],
  topPerformingCampaigns: [
    {
      id: "campaign-1",
      title: "Summer Fashion Collection 2024",
      views: 45230,
      sales: 0,
      activePromoters: 0,
    },
  ],
};

// Mock Campaign List Response
export const MOCK_CAMPAIGN_LIST_RESPONSE: AdvertiserCampaignListResponse = {
  campaigns: MOCK_ADVERTISER_CAMPAIGNS,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 3,
    hasNext: false,
    hasPrev: false,
  },
  summary: {
    totalActiveCampaigns: 3,
    totalCompletedCampaigns: 0,
    totalSpentThisMonth: 1200,
    totalAllocatedBudget: 22000,
    totalRemainingBudget: 19738.5,
  },
};

// Export all mocks
export const ADVERTISER_CAMPAIGN_MOCKS = {
  campaigns: MOCK_ADVERTISER_CAMPAIGNS,
  campaignListResponse: MOCK_CAMPAIGN_LIST_RESPONSE,
  dashboardSummary: MOCK_ADVERTISER_DASHBOARD_SUMMARY,
  promoterApplications: MOCK_PROMOTER_APPLICATIONS,
  filters: MOCK_CAMPAIGN_FILTERS,
  helpers: {
    getFilteredCampaigns,
    sortCampaigns,
    getApplicationsByCampaignId,
  },
};
