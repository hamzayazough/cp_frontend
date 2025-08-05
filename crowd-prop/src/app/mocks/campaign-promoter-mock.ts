import {
  CampaignPromoter,
  VisibilityCampaignDetails,
  ConsultantCampaignDetails,
  SellerCampaignDetails,
  SalesmanCampaignDetails,
} from "@/app/interfaces/campaign/promoter-campaign-details";
import {
  CampaignDeliverable,
  CampaignWork,
} from "@/app/interfaces/campaign-work";
import {
  CampaignType,
  MeetingPlan,
  Deliverable,
  SalesTrackingMethod,
} from "../enums/campaign-type";
import { SocialPlatform } from "../enums/social-platform";
import { PromoterCampaignStatus } from "../interfaces/promoter-campaign";
import { AdvertiserType } from "../enums/advertiser-type";

export const MOCK_CAMPAIGN_PROMOTER1: CampaignPromoter = {
  id: "1",
  title: "KeepFit Health App Promotion",
  type: CampaignType.VISIBILITY,
  mediaUrls: undefined,
  status: PromoterCampaignStatus.ONGOING,
  description:
    "Help us promote our revolutionary health and fitness app to reach health-conscious millennials and Gen Z.",
  advertiser: {
    id: "1",
    companyName: "HealthTech Inc.",
    profileUrl: undefined,
    rating: 4.8,
    verified: true,
    description:
      "Leading health technology company focused on making fitness accessible to everyone.",
    website: "https://healthtech.com",
    advertiserTypes: [
      AdvertiserType.EVENTS,
      AdvertiserType.SPORTS,
      AdvertiserType.TECH,
      AdvertiserType.HEALTH,
    ],
  },
  campaign: {
    type: CampaignType.VISIBILITY,
    budgetHeld: 10000,
    spentBudget: 2000,
    maxViews: 200000,
    currentViews: 12700,
    cpv: 0.75,
    minFollowers: 1000,
    trackingLink: "https://crowdprop.com/r/keepfit-abc123",
    targetAudience: "Health-conscious millennials and Gen Z",
    preferredPlatforms: [SocialPlatform.INSTAGRAM, SocialPlatform.TIKTOK],
    requirements: [
      "Minimum 1K engaged followers",
      "Health/Fitness content niche",
      "Authentic engagement rate >3%",
      "Must disclose sponsored content",
    ],
    createdAt: new Date("2025-06-01"),
    deadline: "2025-07-15",
    startDate: "2025-06-01",
    isPublic: true,
    discordInviteLink: "https://discord.gg/example",
  } as VisibilityCampaignDetails,
  earnings: {
    totalEarned: 635,
    viewsGenerated: 12700,
    projectedTotal: 850,
  },
  tags: [
    AdvertiserType.EVENTS,
    AdvertiserType.SPORTS,
    AdvertiserType.TECH,
    AdvertiserType.HEALTH,
  ],
};

export const MOCK_CAMPAIGN_PROMOTER2: CampaignPromoter = {
  id: "2",
  title: "Digital Marketing Strategy Consultation",
  type: CampaignType.CONSULTANT,
  mediaUrls: undefined,
  status: PromoterCampaignStatus.ONGOING,
  description:
    "Looking for an experienced digital marketing consultant to help develop a comprehensive marketing strategy for our e-commerce platform.",
  advertiser: {
    id: "2",
    companyName: "TechStart Solutions",
    profileUrl: undefined,
    rating: 4.6,
    verified: true,
    description:
      "Innovative e-commerce platform startup focused on sustainable products.",
    website: "https://techstartsolutions.com",
    advertiserTypes: [
      AdvertiserType.EVENTS,
      AdvertiserType.SPORTS,
      AdvertiserType.TECH,
      AdvertiserType.HEALTH,
    ],
  },
  campaign: {
    type: CampaignType.CONSULTANT,
    budgetHeld: 5000,
    spentBudget: 0,
    maxBudget: 5000,
    minBudget: 2500,
    meetingPlan: MeetingPlan.WEEKLY,
    expectedDeliverables: [
      {
        id: "deliverable-consultant-1",
        campaignId: "2",
        deliverable: Deliverable.CONTENT_PLAN,
        isSubmitted: true,
        isFinished: false,
        createdAt: new Date("2025-06-15"),
        updatedAt: new Date("2025-07-01"),
        promoterWork: [],
      },
      {
        id: "deliverable-consultant-2",
        campaignId: "2",
        deliverable: Deliverable.WEEKLY_REPORT,
        isSubmitted: false,
        isFinished: false,
        createdAt: new Date("2025-06-15"),
        updatedAt: new Date("2025-06-15"),
        promoterWork: [],
      },
    ] as CampaignDeliverable[],
    expertiseRequired: "Digital Marketing, E-commerce, Social Media Strategy",
    meetingCount: 8,
    targetAudience: "E-commerce businesses, Sustainable product retailers",
    preferredPlatforms: [
      SocialPlatform.LINKEDIN,
      SocialPlatform.INSTAGRAM,
      SocialPlatform.OTHER,
    ],
    requirements: [
      "Minimum 5 years digital marketing experience",
      "E-commerce platform expertise",
      "Proven track record with startups",
      "Available for weekly meetings",
    ],
    createdAt: new Date("2025-06-15"),
    deadline: "2025-08-30",
    startDate: "2025-07-01",
    isPublic: true,
    discordInviteLink: "https://discord.gg/consultant-example",
  } as ConsultantCampaignDetails,
  earnings: {
    totalEarned: 0,
    viewsGenerated: 0,
    projectedTotal: 5000,
  },
  tags: [
    AdvertiserType.EVENTS,
    AdvertiserType.SPORTS,
    AdvertiserType.TECH,
    AdvertiserType.HEALTH,
  ],
};

export const MOCK_CAMPAIGN_PROMOTER3: CampaignPromoter = {
  id: "3",
  title: "E-commerce Store Creation & Sales",
  type: CampaignType.SELLER,
  mediaUrls: undefined,
  status: PromoterCampaignStatus.ONGOING,
  description:
    "Looking for a skilled promoter to create and manage a complete e-commerce store for our handmade jewelry business, including product photography, store setup, and initial sales.",
  advertiser: {
    id: "3",
    companyName: "Artisan Jewelry Co.",
    profileUrl: undefined,
    rating: 4.7,
    verified: true,
    description:
      "Small business specializing in handcrafted jewelry with unique designs.",
    website: "https://artisanjewelry.com",
    advertiserTypes: [
      AdvertiserType.EVENTS,
      AdvertiserType.SPORTS,
      AdvertiserType.TECH,
      AdvertiserType.HEALTH,
    ],
  },
  campaign: {
    type: CampaignType.SELLER,
    budgetHeld: 3000,
    spentBudget: 500,
    maxBudget: 3000,
    minBudget: 1500,
    deliverables: [
      {
        id: "deliverable-seller-1",
        campaignId: "3",
        deliverable: Deliverable.CONTENT_PLAN,
        isSubmitted: true,
        isFinished: true,
        createdAt: new Date("2025-06-10"),
        updatedAt: new Date("2025-06-25"),
        promoterWork: [
          {
            id: "work-1",
            campaignId: "3",
            promoterLink: "https://drive.google.com/content-plan-jewelry",
            description: "Comprehensive content strategy for jewelry brand",
            createdAt: new Date("2025-06-25"),
            updatedAt: new Date("2025-06-25"),
          },
        ] as CampaignWork[],
      },
      {
        id: "deliverable-seller-2",
        campaignId: "3",
        deliverable: Deliverable.INSTAGRAM_POST,
        isSubmitted: false,
        isFinished: false,
        createdAt: new Date("2025-06-10"),
        updatedAt: new Date("2025-06-10"),
        promoterWork: [],
      },
      {
        id: "deliverable-seller-3",
        campaignId: "3",
        deliverable: Deliverable.WEEKLY_REPORT,
        isSubmitted: true,
        isFinished: false,
        createdAt: new Date("2025-06-10"),
        updatedAt: new Date("2025-07-01"),
        promoterWork: [
          {
            id: "work-2",
            campaignId: "3",
            promoterLink: "https://docs.google.com/week1-report",
            description: "Week 1 progress report",
            createdAt: new Date("2025-07-01"),
            updatedAt: new Date("2025-07-01"),
          },
        ] as CampaignWork[],
      },
    ] as CampaignDeliverable[],
    sellerRequirements: [Deliverable.INSTAGRAM_POST, Deliverable.CONTENT_PLAN],
    fixedPrice: 2500,
    meetingPlan: MeetingPlan.WEEKLY,
    targetAudience:
      "Jewelry enthusiasts, gift buyers, fashion-conscious consumers",
    preferredPlatforms: [
      SocialPlatform.INSTAGRAM,
      SocialPlatform.FACEBOOK,
      SocialPlatform.OTHER,
    ],
    requirements: [
      "Experience with e-commerce store setup",
      "Product photography skills",
      "Social media marketing experience",
      "Knowledge of jewelry market",
    ],
    needMeeting: true, // Indicates if a meeting is required before starting
    meetingCount: 4, // Number of meetings required for the campaign

    createdAt: new Date("2025-06-10"),
    deadline: "2025-08-15",
    startDate: "2025-06-15",
    isPublic: false,
    discordInviteLink: "https://discord.gg/seller-example",
  } as SellerCampaignDetails,
  earnings: {
    totalEarned: 0,
    viewsGenerated: 0,
    projectedTotal: 2500,
  },
  tags: [
    AdvertiserType.EVENTS,
    AdvertiserType.SPORTS,
    AdvertiserType.TECH,
    AdvertiserType.HEALTH,
  ],
};

export const MOCK_CAMPAIGN_PROMOTER4: CampaignPromoter = {
  id: "4",
  title: "Fitness App Sales Commission Program",
  type: CampaignType.SALESMAN,
  mediaUrls: undefined,
  status: PromoterCampaignStatus.ONGOING,
  description:
    "Join our sales team and earn commission for every fitness app subscription you generate. Perfect for fitness influencers and health enthusiasts with engaged audiences.",
  advertiser: {
    id: "4",
    companyName: "FitTrack Pro",
    profileUrl: undefined,
    rating: 4.9,
    verified: true,
    description:
      "Leading fitness tracking app with personalized workout plans and nutrition guidance.",
    website: "https://fittrackpro.com",
    advertiserTypes: [
      AdvertiserType.EVENTS,
      AdvertiserType.SPORTS,
      AdvertiserType.TECH,
      AdvertiserType.HEALTH,
    ],
  },
  campaign: {
    type: CampaignType.SALESMAN,
    budgetHeld: 8000,
    spentBudget: 1200,
    commissionPerSale: 25,
    trackSalesVia: SalesTrackingMethod.COUPON_CODE,
    codePrefix: "FIT25",
    minFollowers: 5000,
    targetAudience:
      "Fitness enthusiasts, health-conscious individuals, gym-goers",
    preferredPlatforms: [
      SocialPlatform.INSTAGRAM,
      SocialPlatform.TIKTOK,
      SocialPlatform.YOUTUBE,
    ],
    requirements: [
      "Minimum 5K followers interested in fitness",
      "Authentic engagement with fitness content",
      "Ability to create compelling sales content",
      "Must disclose sponsored partnerships",
    ],
    createdAt: new Date("2025-06-05"),
    deadline: "2025-09-30",
    startDate: "2025-06-10",
    isPublic: true,
    discordInviteLink: "https://discord.gg/salesman-example",
  } as SalesmanCampaignDetails,
  earnings: {
    totalEarned: 450,
    viewsGenerated: 0, // Not applicable for sales campaigns
    projectedTotal: 2000,
  },
  tags: [
    AdvertiserType.SPORTS,
    AdvertiserType.TECH,
    AdvertiserType.SCIENCE,
    AdvertiserType.HEALTH,
  ],
};

// Export all campaigns as an array for components that need the complete list
export const MOCK_CAMPAIGN_PROMOTERS = [
  MOCK_CAMPAIGN_PROMOTER1,
  MOCK_CAMPAIGN_PROMOTER2,
  MOCK_CAMPAIGN_PROMOTER3,
  MOCK_CAMPAIGN_PROMOTER4,
];
