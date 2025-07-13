import { CampaignStatus, CampaignType } from "../enums/campaign-type";
import { SaleVerificationStatus } from "../enums/sale-verification-status-type";
import { SocialPlatform } from "../enums/social-platform";
import { PromoterCampaignStatus } from "../interfaces/promoter-campaign";
import {
  AdvertiserCampaign,
  AdvertiserCampaignDetails,
  AdvertiserCampaignListResponse,
  AdvertiserDashboardSummary,
  CampaignBudgetAllocation,
  CampaignSalesRecord,
  CampaignViewStats,
  PromoterApplication,
  AdvertiserCampaignSortField,
} from "../interfaces/advertiser-campaign";

export enum PayoutStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
}

// Mock Advertiser Campaigns
export const MOCK_ADVERTISER_CAMPAIGNS: AdvertiserCampaign[] = [
  {
    id: "campaign-1",
    title: "Summer Fashion Collection 2024",
    description:
      "Promote our latest summer fashion collection to Gen Z audience",
    type: CampaignType.VISIBILITY,
    status: CampaignStatus.ACTIVE,
    isPublic: true,
    mediaUrl: "https://example.com/summer-fashion.jpg",
    startDate: new Date("2024-06-01"),
    deadline: new Date("2024-08-31"),
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-07-10"),
    maxViews: 100000,
    cpv: 0.05,
    trackingLink: "https://fashionbrand.com/summer?ref=campaign1",
    currentViews: 45230,
    preferredPlatforms: [SocialPlatform.TIKTOK, SocialPlatform.INSTAGRAM],
    targetAudience: "Fashion-conscious Gen Z, ages 16-25",
    requirements: [
      "Post during peak hours",
      "Use provided hashtags",
      "Tag brand account",
    ],
    minFollowers: 5000,
    totalBudget: 5000,
    allocatedAmount: 4500,
    spentAmount: 2261.5,
    remainingAmount: 2238.5,
    isFunded: true,
    fundedAt: new Date("2024-05-20"),
    stripePaymentIntentId: "pi_1234567890",
    totalPromoters: 18,
    activePromoters: 12,
    completedPromoters: 6,
    discordInviteLink: "https://discord.gg/fashionbrand",
    promoterLinks: [
      "https://tiktok.com/@influencer1/video/123",
      "https://instagram.com/p/ABC123/",
    ],
  },
  {
    id: "campaign-2",
    title: "Tech Product Launch Consultation",
    description:
      "Seeking tech influencers for product launch consultation meetings",
    type: CampaignType.CONSULTANT,
    status: CampaignStatus.ACTIVE,
    isPublic: false,
    startDate: new Date("2024-07-01"),
    deadline: new Date("2024-09-30"),
    createdAt: new Date("2024-06-10"),
    updatedAt: new Date("2024-07-12"),
    maxBudget: 3000,
    minBudget: 1500,
    preferredPlatforms: [SocialPlatform.YOUTUBE, SocialPlatform.TWITTER],
    targetAudience: "Tech reviewers and early adopters",
    requirements: ["Experience with tech reviews", "Available for video calls"],
    minFollowers: 10000,
    totalBudget: 8000,
    allocatedAmount: 6000,
    spentAmount: 2200,
    remainingAmount: 3800,
    isFunded: true,
    fundedAt: new Date("2024-06-15"),
    totalPromoters: 1,
    activePromoters: 1,
    completedPromoters: 0,
    discordInviteLink: "https://discord.gg/techlaunch",
    ongoingPromoter: {
      id: "promoter-2",
      name: "Tech Mike",
      avatarUrl: "https://example.com/avatars/mike.jpg",
      status: "ONGOING",
      joinedAt: new Date("2024-07-10"),
      meetingsCompleted: 2,
      totalMeetings: 5,
      nextMeetingDate: new Date("2024-07-20"),
    },
  },
  {
    id: "campaign-3",
    title: "E-commerce Sales Commission",
    description:
      "Earn commission for every sale you generate through your content",
    type: CampaignType.SALESMAN,
    status: CampaignStatus.ACTIVE,
    isPublic: true,
    startDate: new Date("2024-07-15"),
    deadline: new Date("2024-12-31"),
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-07-12"),
    commissionPerSale: 15.5,
    preferredPlatforms: [SocialPlatform.INSTAGRAM, SocialPlatform.YOUTUBE],
    targetAudience: "Lifestyle and product review influencers",
    minFollowers: 2000,
    totalBudget: 10000,
    allocatedAmount: 8000,
    spentAmount: 1240,
    remainingAmount: 6760,
    isFunded: true,
    fundedAt: new Date("2024-07-10"),
    totalPromoters: 25,
    activePromoters: 20,
    completedPromoters: 5,
  },
  {
    id: "campaign-4",
    title: "Brand Storytelling Project",
    description:
      "Create compelling brand story content for our new product line",
    type: CampaignType.SELLER,
    status: CampaignStatus.PAUSED,
    isPublic: false,
    startDate: new Date("2024-08-01"),
    deadline: new Date("2024-10-31"),
    createdAt: new Date("2024-07-20"),
    updatedAt: new Date("2024-07-25"),
    maxBudget: 5000,
    minBudget: 2500,
    preferredPlatforms: [SocialPlatform.INSTAGRAM, SocialPlatform.TIKTOK],
    targetAudience: "Creative content creators and storytellers",
    requirements: ["Portfolio of brand collaborations", "High engagement rate"],
    minFollowers: 8000,
    totalBudget: 12000,
    allocatedAmount: 8000,
    spentAmount: 0,
    remainingAmount: 8000,
    isFunded: true,
    fundedAt: new Date("2024-07-22"),
    totalPromoters: 0,
    activePromoters: 0,
    completedPromoters: 0,
    pendingApplicationsCount: 0,
  },
  {
    id: "campaign-5",
    title: "Product Review Campaign",
    description: "Seeking honest product reviews from lifestyle influencers",
    type: CampaignType.SELLER,
    status: CampaignStatus.ACTIVE,
    isPublic: false,
    startDate: new Date("2024-07-01"),
    deadline: new Date("2024-09-15"),
    createdAt: new Date("2024-06-20"),
    updatedAt: new Date("2024-07-12"),
    maxBudget: 4000,
    minBudget: 2000,
    preferredPlatforms: [SocialPlatform.INSTAGRAM, SocialPlatform.TIKTOK],
    targetAudience: "Lifestyle and beauty influencers",
    requirements: ["High engagement rate", "Previous brand collaborations"],
    minFollowers: 5000,
    totalBudget: 6000,
    allocatedAmount: 4000,
    spentAmount: 1200,
    remainingAmount: 2800,
    isFunded: true,
    fundedAt: new Date("2024-06-25"),
    totalPromoters: 1,
    activePromoters: 1,
    completedPromoters: 0,
    ongoingPromoter: {
      id: "promoter-3",
      name: "Emma Rodriguez",
      avatarUrl: "https://example.com/avatars/emma.jpg",
      status: "ONGOING",
      joinedAt: new Date("2024-07-05"),
      deliverables: ["Unboxing video", "Instagram posts", "Stories series"],
      deliverableProgress: "2/3 completed",
    },
  },
  {
    id: "campaign-6",
    title: "Affiliate Marketing Program",
    description: "Join our affiliate program and earn commission on every sale",
    type: CampaignType.SALESMAN,
    status: CampaignStatus.ACTIVE,
    isPublic: false,
    startDate: new Date("2024-06-15"),
    deadline: new Date("2024-12-31"),
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-07-12"),
    commissionPerSale: 20.0,
    preferredPlatforms: [SocialPlatform.YOUTUBE, SocialPlatform.INSTAGRAM],
    targetAudience: "Fitness and lifestyle content creators",
    minFollowers: 3000,
    totalBudget: 15000,
    allocatedAmount: 10000,
    spentAmount: 3600,
    remainingAmount: 6400,
    isFunded: true,
    fundedAt: new Date("2024-06-10"),
    totalPromoters: 1,
    activePromoters: 1,
    completedPromoters: 0,
    ongoingPromoter: {
      id: "promoter-4",
      name: "Fitness Alex",
      avatarUrl: "https://example.com/avatars/alex.jpg",
      status: "ONGOING",
      joinedAt: new Date("2024-06-20"),
      salesGenerated: 18,
      totalCommission: 3600.0,
    },
  },
  {
    id: "campaign-7",
    title: "Creative Consultation Needed",
    description: "Looking for creative input on our new marketing campaign",
    type: CampaignType.CONSULTANT,
    status: CampaignStatus.ACTIVE,
    isPublic: false,
    startDate: new Date("2024-07-10"),
    deadline: new Date("2024-08-31"),
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-07-12"),
    maxBudget: 2500,
    minBudget: 1000,
    preferredPlatforms: [SocialPlatform.INSTAGRAM, SocialPlatform.TIKTOK],
    targetAudience: "Creative directors and content strategists",
    requirements: [
      "Portfolio of successful campaigns",
      "Available for weekly calls",
    ],
    minFollowers: 1000,
    totalBudget: 5000,
    allocatedAmount: 2500,
    spentAmount: 0,
    remainingAmount: 2500,
    isFunded: true,
    fundedAt: new Date("2024-07-05"),
    totalPromoters: 0,
    activePromoters: 0,
    completedPromoters: 0,
    pendingApplicationsCount: 3,
  },
];

// Mock Promoter Applications
export const MOCK_PROMOTER_APPLICATIONS: PromoterApplication[] = [
  {
    id: "app-1",
    promoterId: "promoter-1",
    promoterName: "Sarah Johnson",
    promoterAvatarUrl: "https://example.com/avatars/sarah.jpg",
    promoterRating: 4.8,
    applicationMessage:
      "I love fashion and have great engagement with my Gen Z audience!",
    status: PromoterCampaignStatus.ONGOING,
    appliedAt: new Date("2024-07-05"),
    reviewedAt: new Date("2024-07-06"),
    socialMediaLinks: {
      tiktokUrl: "https://tiktok.com/@sarahjohnson",
      instagramUrl: "https://instagram.com/sarahjohnson",
    },
    followerCounts: {
      [SocialPlatform.TIKTOK]: 25000,
      [SocialPlatform.INSTAGRAM]: 18000,
    },
  },
  {
    id: "app-2",
    promoterId: "promoter-2",
    promoterName: "Tech Mike",
    promoterAvatarUrl: "https://example.com/avatars/mike.jpg",
    promoterRating: 4.9,
    applicationMessage:
      "Tech expert with 5+ years of review experience. Available for consultation calls.",
    status: PromoterCampaignStatus.AWAITING_REVIEW,
    appliedAt: new Date("2024-07-10"),
    socialMediaLinks: {
      youtubeUrl: "https://youtube.com/@techmike",
      twitterUrl: "https://twitter.com/techmike",
    },
    followerCounts: {
      [SocialPlatform.YOUTUBE]: 45000,
      [SocialPlatform.TWITTER]: 12000,
    },
  },
  // Applications for "Creative Consultation Needed" campaign (campaign-7)
  {
    id: "app-7-1",
    promoterId: "promoter-creative-1",
    promoterName: "Maya Chen",
    promoterAvatarUrl: "https://example.com/avatars/maya.jpg",
    promoterRating: 4.7,
    applicationMessage:
      "Creative strategist with 8 years experience in brand campaigns. I've helped launch 50+ successful marketing initiatives for tech and lifestyle brands. Available for weekly strategy sessions and can provide detailed campaign frameworks.",
    status: PromoterCampaignStatus.AWAITING_REVIEW,
    appliedAt: new Date("2024-07-08"),
    campaignId: "campaign-7",
    proposedRate: 150,
    availability: "10-15 hours per week",
    previousWorkExamples: [
      "Nike Air Max Campaign Strategy",
      "Spotify Wrapped Creative Direction",
      "Tesla Model Y Launch Framework",
    ],
    socialMediaLinks: {
      instagramUrl: "https://instagram.com/mayacreative",
      tiktokUrl: "https://tiktok.com/@mayastrategist",
    },
    followerCounts: {
      [SocialPlatform.INSTAGRAM]: 35000,
      [SocialPlatform.TIKTOK]: 12000,
    },
  },
  {
    id: "app-7-2",
    promoterId: "promoter-creative-2",
    promoterName: "Alex Rivera",
    promoterAvatarUrl: "https://example.com/avatars/alex-rivera.jpg",
    promoterRating: 4.9,
    applicationMessage:
      "Award-winning creative director with portfolio including Nike, Spotify, and Airbnb campaigns. I specialize in multi-platform storytelling and viral content strategies. Can dedicate 10-15 hours per week for strategic consultation.",
    status: PromoterCampaignStatus.AWAITING_REVIEW,
    appliedAt: new Date("2024-07-09"),
    campaignId: "campaign-7",
    proposedRate: 250,
    availability: "15-20 hours per week",
    previousWorkExamples: [
      "Airbnb 'Belong Anywhere' Campaign",
      "Nike 'Just Do It' Refresh Strategy",
      "Spotify Artist Discovery Initiative",
    ],
    socialMediaLinks: {
      instagramUrl: "https://instagram.com/alexcreates",
      youtubeUrl: "https://youtube.com/@alexrivera",
      twitterUrl: "https://twitter.com/alexrivera",
    },
    followerCounts: {
      [SocialPlatform.INSTAGRAM]: 85000,
      [SocialPlatform.YOUTUBE]: 45000,
      [SocialPlatform.TWITTER]: 25000,
    },
  },
  {
    id: "app-7-3",
    promoterId: "promoter-creative-3",
    promoterName: "Jordan Kim",
    promoterAvatarUrl: "https://example.com/avatars/jordan.jpg",
    promoterRating: 4.6,
    applicationMessage:
      "Content strategist and former agency creative with experience at Ogilvy and Wieden+Kennedy. I focus on data-driven creative strategies and have successfully increased engagement rates by 300%+ across multiple campaigns. Looking forward to collaborating!",
    status: PromoterCampaignStatus.AWAITING_REVIEW,
    appliedAt: new Date("2024-07-11"),
    campaignId: "campaign-7",
    proposedRate: 120,
    availability: "8-12 hours per week",
    previousWorkExamples: [
      "Old Spice Viral TikTok Campaign",
      "Wendy's Twitter Roast Strategy",
      "Apple iPhone Launch Content Framework",
    ],
    socialMediaLinks: {
      instagramUrl: "https://instagram.com/jordankim_creative",
      tiktokUrl: "https://tiktok.com/@jordankim",
    },
    followerCounts: {
      [SocialPlatform.INSTAGRAM]: 28000,
      [SocialPlatform.TIKTOK]: 15000,
    },
  },
];

// Mock Campaign View Statistics
export const MOCK_CAMPAIGN_VIEW_STATS: CampaignViewStats = {
  totalViews: 45230,
  uniqueViews: 38420,
  totalClicks: 2840,
  conversionRate: 6.28,
  dailyStats: [
    { date: new Date("2024-07-08"), views: 2150, clicks: 145 },
    { date: new Date("2024-07-09"), views: 2890, clicks: 198 },
    { date: new Date("2024-07-10"), views: 3240, clicks: 215 },
    { date: new Date("2024-07-11"), views: 2680, clicks: 178 },
    { date: new Date("2024-07-12"), views: 3120, clicks: 204 },
  ],
};

// Mock Sales Records
export const MOCK_SALES_RECORDS: CampaignSalesRecord[] = [
  {
    id: "sale-1",
    promoterId: "promoter-3",
    promoterName: "Emma Rodriguez",
    saleAmount: 89.99,
    commissionRate: 15.5,
    commissionEarned: 13.95,
    saleDate: new Date("2024-07-10"),
    trackingCode: "EMMA123",
    verificationStatus: SaleVerificationStatus.VERIFIED,
    verifiedAt: new Date("2024-07-11"),
  },
  {
    id: "sale-2",
    promoterId: "promoter-4",
    promoterName: "Alex Chen",
    saleAmount: 156.5,
    commissionRate: 15.5,
    commissionEarned: 24.26,
    saleDate: new Date("2024-07-12"),
    trackingCode: "ALEX456",
    verificationStatus: SaleVerificationStatus.PENDING,
  },
];

// Mock Budget Allocations
export const MOCK_BUDGET_ALLOCATIONS: CampaignBudgetAllocation[] = [
  {
    id: "budget-1",
    promoterId: "promoter-1",
    promoterName: "Sarah Johnson",
    allocatedAmount: 500,
    spentAmount: 226.15,
    remainingAmount: 273.85,
    status: PayoutStatus.ACTIVE,
    createdAt: new Date("2024-07-06"),
    fundedAt: new Date("2024-07-06"),
  },
  {
    id: "budget-2",
    promoterId: "promoter-2",
    promoterName: "Tech Mike",
    allocatedAmount: 1500,
    spentAmount: 0,
    remainingAmount: 1500,
    status: PayoutStatus.ACTIVE,
    createdAt: new Date("2024-07-10"),
    fundedAt: new Date("2024-07-10"),
  },
];

// Mock Campaign Details (extended campaign with additional data)
export const MOCK_CAMPAIGN_DETAILS: AdvertiserCampaignDetails = {
  ...MOCK_ADVERTISER_CAMPAIGNS[0],
  promoterApplications: MOCK_PROMOTER_APPLICATIONS,
  viewStatistics: MOCK_CAMPAIGN_VIEW_STATS,
  salesRecords: MOCK_SALES_RECORDS,
  budgetAllocations: MOCK_BUDGET_ALLOCATIONS,
};

// Mock Campaign List Response with Pagination
export const MOCK_CAMPAIGN_LIST_RESPONSE: AdvertiserCampaignListResponse = {
  campaigns: MOCK_ADVERTISER_CAMPAIGNS,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 7,
    hasNext: false,
    hasPrev: false,
  },
  summary: {
    totalActiveCampaigns: 6,
    totalCompletedCampaigns: 0,
    totalSpentThisMonth: 8741.5,
    totalAllocatedBudget: 39500,
    totalRemainingBudget: 30758.5,
  },
};

// Mock Dashboard Summary
export const MOCK_ADVERTISER_DASHBOARD_SUMMARY: AdvertiserDashboardSummary = {
  totalCampaigns: 7,
  activeCampaigns: 6,
  completedCampaigns: 0,
  draftCampaigns: 1,

  // Financial summary
  totalSpent: 8741.5,
  totalAllocated: 39500,
  remainingBudget: 30758.5,
  monthlySpend: 8741.5,

  // Performance metrics
  totalViews: 45230,
  totalClicks: 2840,
  averageCTR: 6.28,
  totalSales: 26,
  totalRevenue: 3846.49,

  // Recent activity
  recentApplications: MOCK_PROMOTER_APPLICATIONS.slice(0, 3),
  recentCompletions: [
    {
      campaignId: "campaign-1",
      campaignTitle: "Summer Fashion Collection 2024",
      promoterName: "Jessica Martinez",
      completedAt: new Date("2024-07-08"),
      earnings: 180.25,
    },
    {
      campaignId: "campaign-2",
      campaignTitle: "Tech Product Launch Consultation",
      promoterName: "David Kim",
      completedAt: new Date("2024-07-05"),
      earnings: 2200,
    },
  ],

  // Trending campaigns
  topPerformingCampaigns: [
    {
      id: "campaign-1",
      title: "Summer Fashion Collection 2024",
      views: 45230,
      ctr: 6.28,
      activePromoters: 12,
    },
    {
      id: "campaign-3",
      title: "E-commerce Sales Commission",
      views: 28450,
      ctr: 4.2,
      activePromoters: 20,
    },
  ],
};

// Mock data for filtering and sorting
export const MOCK_CAMPAIGN_FILTERS = {
  statuses: [
    CampaignStatus.ACTIVE,
    CampaignStatus.PAUSED,
    CampaignStatus.COMPLETED,
    CampaignStatus.EXPIRED,
    CampaignStatus.DRAFT,
  ],
  types: [
    CampaignType.VISIBILITY,
    CampaignType.CONSULTANT,
    CampaignType.SALESMAN,
    CampaignType.SELLER,
  ],
  sortFields: [
    AdvertiserCampaignSortField.CREATED_AT,
    AdvertiserCampaignSortField.UPDATED_AT,
    AdvertiserCampaignSortField.TITLE,
    AdvertiserCampaignSortField.STATUS,
    AdvertiserCampaignSortField.DEADLINE,
    AdvertiserCampaignSortField.TOTAL_BUDGET,
    AdvertiserCampaignSortField.SPENT_AMOUNT,
    AdvertiserCampaignSortField.TOTAL_PROMOTERS,
    AdvertiserCampaignSortField.CURRENT_VIEWS,
  ],
};

// Helper function to get filtered campaigns
export const getFilteredCampaigns = (
  campaigns: AdvertiserCampaign[],
  filters: {
    status?: CampaignStatus[];
    type?: CampaignType[];
    searchQuery?: string;
  }
): AdvertiserCampaign[] => {
  return campaigns.filter((campaign) => {
    if (filters.status && !filters.status.includes(campaign.status)) {
      return false;
    }
    if (filters.type && !filters.type.includes(campaign.type)) {
      return false;
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        campaign.title.toLowerCase().includes(query) ||
        campaign.description.toLowerCase().includes(query)
      );
    }
    return true;
  });
};

// Helper function to sort campaigns
export const sortCampaigns = (
  campaigns: AdvertiserCampaign[],
  sortBy: AdvertiserCampaignSortField,
  sortOrder: "asc" | "desc" = "desc"
): AdvertiserCampaign[] => {
  return [...campaigns].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case AdvertiserCampaignSortField.CREATED_AT:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case AdvertiserCampaignSortField.UPDATED_AT:
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
        break;
      case AdvertiserCampaignSortField.TITLE:
        aValue = a.title;
        bValue = b.title;
        break;
      case AdvertiserCampaignSortField.DEADLINE:
        aValue = new Date(a.deadline).getTime();
        bValue = new Date(b.deadline).getTime();
        break;
      case AdvertiserCampaignSortField.TOTAL_BUDGET:
        aValue = a.totalBudget;
        bValue = b.totalBudget;
        break;
      case AdvertiserCampaignSortField.SPENT_AMOUNT:
        aValue = a.spentAmount;
        bValue = b.spentAmount;
        break;
      case AdvertiserCampaignSortField.TOTAL_PROMOTERS:
        aValue = a.totalPromoters;
        bValue = b.totalPromoters;
        break;
      case AdvertiserCampaignSortField.CURRENT_VIEWS:
        aValue = a.currentViews || 0;
        bValue = b.currentViews || 0;
        break;
      default:
        aValue = a.createdAt;
        bValue = b.createdAt;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

// Helper function to get applications by campaign ID
export const getApplicationsByCampaignId = (
  campaignId: string
): PromoterApplication[] => {
  // Map campaign IDs to their specific applications
  const campaignApplicationMap: { [key: string]: string[] } = {
    "campaign-7": ["app-7-1", "app-7-2", "app-7-3"], // Creative Consultation Needed
  };

  const applicationIds = campaignApplicationMap[campaignId] || [];
  return MOCK_PROMOTER_APPLICATIONS.filter((app) =>
    applicationIds.includes(app.id)
  );
};

// Export all mocks
export const ADVERTISER_CAMPAIGN_MOCKS = {
  campaigns: MOCK_ADVERTISER_CAMPAIGNS,
  campaignDetails: MOCK_CAMPAIGN_DETAILS,
  campaignListResponse: MOCK_CAMPAIGN_LIST_RESPONSE,
  dashboardSummary: MOCK_ADVERTISER_DASHBOARD_SUMMARY,
  promoterApplications: MOCK_PROMOTER_APPLICATIONS,
  viewStats: MOCK_CAMPAIGN_VIEW_STATS,
  salesRecords: MOCK_SALES_RECORDS,
  budgetAllocations: MOCK_BUDGET_ALLOCATIONS,
  filters: MOCK_CAMPAIGN_FILTERS,
  helpers: {
    getFilteredCampaigns,
    sortCampaigns,
    getApplicationsByCampaignId,
  },
};
