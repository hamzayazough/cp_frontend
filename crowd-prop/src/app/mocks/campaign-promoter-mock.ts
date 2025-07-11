import {
  CampaignPromoter,
  VisibilityCampaignDetails,
  ConsultantCampaignDetails,
  SellerCampaignDetails,
  SalesmanCampaignDetails,
} from "@/interfaces/campaign-promoter";
import {
  CampaignStatus,
  CampaignType,
  MeetingPlan,
  Deliverable,
  SalesTrackingMethod,
} from "../enums/campaign-type";
import { SocialPlatform } from "../enums/social-platform";

export const MOCK_CAMPAIGN_PROMOTER1: CampaignPromoter = {
  id: "1",
  title: "KeepFit Health App Promotion",
  type: CampaignType.VISIBILITY,
  mediaUrl: undefined,
  status: CampaignStatus.ACTIVE,
  description:
    "Help us promote our revolutionary health and fitness app to reach health-conscious millennials and Gen Z.",
  advertiser: {
    name: "HealthTech Inc.",
    profileUrl: undefined,
    rating: 4.8,
    verified: true,
    description:
      "Leading health technology company focused on making fitness accessible to everyone.",
    website: "https://healthtech.com",
  },
  campaign: {
    type: CampaignType.VISIBILITY,
    budget: 10000,
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
    averageCPV: 0.05,
    projectedTotal: 850,
  },
  tags: ["Health", "Fitness", "Mobile App", "Wellness"],
  joinedDate: "2025-06-01",
  lastActivity: "2025-07-01T08:30:00Z",
};

export const MOCK_CAMPAIGN_PROMOTER2: CampaignPromoter = {
  id: "2",
  title: "Digital Marketing Strategy Consultation",
  type: CampaignType.CONSULTANT,
  mediaUrl: undefined,
  status: CampaignStatus.ACTIVE,
  description:
    "Looking for an experienced digital marketing consultant to help develop a comprehensive marketing strategy for our e-commerce platform.",
  advertiser: {
    name: "TechStart Solutions",
    profileUrl: undefined,
    rating: 4.6,
    verified: true,
    description:
      "Innovative e-commerce platform startup focused on sustainable products.",
    website: "https://techstartsolutions.com",
  },
  campaign: {
    type: CampaignType.CONSULTANT,
    budget: 5000,
    spentBudget: 0,
    maxBudget: 5000,
    minBudget: 2500,
    meetingPlan: MeetingPlan.WEEKLY,
    deliverables: [Deliverable.CONTENT_PLAN, Deliverable.WEEKLY_REPORT],
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
    averageCPV: 0,
    projectedTotal: 5000,
  },
  tags: ["Digital Marketing", "Consulting", "E-commerce", "Strategy"],
  joinedDate: "2025-06-20",
  lastActivity: "2025-07-09T14:15:00Z",
};

export const MOCK_CAMPAIGN_PROMOTER3: CampaignPromoter = {
  id: "3",
  title: "E-commerce Store Creation & Sales",
  type: CampaignType.SELLER,
  mediaUrl: undefined,
  status: CampaignStatus.ACTIVE,
  description:
    "Looking for a skilled promoter to create and manage a complete e-commerce store for our handmade jewelry business, including product photography, store setup, and initial sales.",
  advertiser: {
    name: "Artisan Jewelry Co.",
    profileUrl: undefined,
    rating: 4.7,
    verified: true,
    description:
      "Small business specializing in handcrafted jewelry with unique designs.",
    website: "https://artisanjewelry.com",
  },
  campaign: {
    type: CampaignType.SELLER,
    budget: 3000,
    spentBudget: 500,
    maxBudget: 3000,
    minBudget: 1500,
    deliverables: [
      Deliverable.CONTENT_PLAN,
      Deliverable.INSTAGRAM_POST,
      Deliverable.WEEKLY_REPORT,
    ],
    sellerRequirements: [Deliverable.INSTAGRAM_POST, Deliverable.CONTENT_PLAN],
    fixedPrice: 2500,
    meetingPlan: MeetingPlan.WEEKLY,
    deadlineStrict: true,
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
    createdAt: new Date("2025-06-10"),
    deadline: "2025-08-15",
    startDate: "2025-06-15",
    isPublic: false,
    discordInviteLink: "https://discord.gg/seller-example",
  } as SellerCampaignDetails,
  earnings: {
    totalEarned: 0,
    viewsGenerated: 0,
    averageCPV: 0,
    projectedTotal: 2500,
  },
  tags: ["E-commerce", "Jewelry", "Store Creation", "Sales"],
  joinedDate: "2025-06-12",
  lastActivity: "2025-07-08T10:20:00Z",
};

export const MOCK_CAMPAIGN_PROMOTER4: CampaignPromoter = {
  id: "4",
  title: "Fitness App Sales Commission Program",
  type: CampaignType.SALESMAN,
  mediaUrl: undefined,
  status: CampaignStatus.ACTIVE,
  description:
    "Join our sales team and earn commission for every fitness app subscription you generate. Perfect for fitness influencers and health enthusiasts with engaged audiences.",
  advertiser: {
    name: "FitTrack Pro",
    profileUrl: undefined,
    rating: 4.9,
    verified: true,
    description:
      "Leading fitness tracking app with personalized workout plans and nutrition guidance.",
    website: "https://fittrackpro.com",
  },
  campaign: {
    type: CampaignType.SALESMAN,
    budget: 8000,
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
    averageCPV: 0, // Not applicable for sales campaigns
    projectedTotal: 2000,
  },
  tags: ["Fitness", "App Sales", "Commission", "Health"],
  joinedDate: "2025-06-08",
  lastActivity: "2025-07-09T16:45:00Z",
};
