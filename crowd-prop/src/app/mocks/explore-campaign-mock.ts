import { AdvertiserType } from "@/app/enums/advertiser-type";
import {
  CampaignType,
  Deliverable,
  MeetingPlan,
  SalesTrackingMethod,
} from "@/app/enums/campaign-type";
import { SocialPlatform } from "@/app/enums/social-platform";
import { PromoterCampaignStatus } from "@/app/interfaces/promoter-campaign";
import {
  VisibilityCampaign,
  SalesmanCampaign,
  ConsultantCampaign,
  SellerCampaign,
  CampaignUnion,
  ExploreCampaignResponse,
} from "@/app/interfaces/campaign/explore-campaign";

// Individual campaign data
const mockCampaigns: CampaignUnion[] = [
  {
    id: "1",
    advertiser: {
      id: "adv-1",
      companyName: "FinanceHub Inc.",
      profileUrl: "/api/placeholder/40/40",
      rating: 4.8,
      verified: true,
      description:
        "Leading financial education platform for millennials and Gen Z.",
      website: "https://financehub.com",
      advertiserTypes: [AdvertiserType.FINANCE, AdvertiserType.EDUCATION],
    },
    title: "Finance Insights Blog Promotion",
    type: CampaignType.VISIBILITY,
    mediaUrl: undefined,
    status: PromoterCampaignStatus.ONGOING,
    description:
      "Promote our finance education blog to reach financially conscious millennials and Gen Z.",
    targetAudience: "Financially conscious millennials and Gen Z",
    preferredPlatforms: [SocialPlatform.INSTAGRAM, SocialPlatform.TIKTOK],
    requirements: [
      "Min 1K followers",
      "Finance/Business niche",
      "Authentic engagement",
    ],
    createdAt: new Date("2025-06-20"),
    deadline: "2025-08-15",
    startDate: "2025-06-20",
    isPublic: false,
    tags: [AdvertiserType.FINANCE, AdvertiserType.EDUCATION],
    maxViews: 100000,
    currentViews: 0,
    cpv: 0.05,
    minFollowers: 1000,
  } as VisibilityCampaign,
  {
    id: "2",
    advertiser: {
      id: "adv-2",
      companyName: "GreenTech Solutions",
      profileUrl: "/api/placeholder/40/40",
      rating: 4.6,
      verified: true,
      description:
        "Sustainable energy solutions for environmentally conscious homeowners.",
      website: "https://greentech.com",
      advertiserTypes: [AdvertiserType.ENERGY, AdvertiserType.HOME_SERVICES],
    },
    title: "Eco Energy Product Sales",
    type: CampaignType.SALESMAN,
    mediaUrl: undefined,
    status: PromoterCampaignStatus.ONGOING,
    description:
      "Drive sales for our sustainable energy solutions targeting environmentally conscious homeowners.",
    targetAudience: "Environmentally conscious homeowners",
    preferredPlatforms: [SocialPlatform.FACEBOOK, SocialPlatform.LINKEDIN],
    requirements: [
      "Sales experience",
      "Sustainability interest",
      "Strong communication",
    ],
    createdAt: new Date("2025-06-25"),
    deadline: "2025-09-30",
    startDate: "2025-06-25",
    isPublic: true,
    tags: [AdvertiserType.ENERGY, AdvertiserType.HOME_SERVICES],
    commissionPerSale: 15,
    trackSalesVia: SalesTrackingMethod.REF_LINK,
    refLink: "https://greentech.com/ref/promoter",
    minFollowers: 500,
  } as SalesmanCampaign,
  {
    id: "3",
    advertiser: {
      id: "adv-3",
      companyName: "CloudTech Startup",
      profileUrl: "/api/placeholder/40/40",
      rating: 4.9,
      verified: false,
      description:
        "Innovative SaaS platform startup seeking marketing expertise.",
      website: "https://cloudtech.com",
      advertiserTypes: [AdvertiserType.TECH, AdvertiserType.CONSULTING],
    },
    title: "SaaS Marketing Strategy Consulting",
    type: CampaignType.CONSULTANT,
    mediaUrl: undefined,
    status: PromoterCampaignStatus.ONGOING,
    description:
      "We need a marketing consultant to help develop our go-to-market strategy for our new SaaS platform.",
    targetAudience: "B2B SaaS companies",
    preferredPlatforms: [SocialPlatform.LINKEDIN, SocialPlatform.TWITTER],
    requirements: [
      "3+ years SaaS marketing",
      "B2B experience",
      "Strategy expertise",
    ],
    createdAt: new Date("2025-06-22"),
    deadline: "2025-07-30",
    startDate: "2025-06-22",
    isPublic: true,
    tags: [AdvertiserType.TECH, AdvertiserType.CONSULTING],
    meetingPlan: MeetingPlan.WEEKLY,
    expectedDeliverables: [Deliverable.CONTENT_PLAN, Deliverable.WEEKLY_REPORT],
    expertiseRequired: "SaaS marketing and B2B strategy",
    meetingCount: 6,
    maxBudget: 8000,
    minBudget: 5000,
  } as ConsultantCampaign,
  {
    id: "4",
    advertiser: {
      id: "adv-4",
      companyName: "EcoFashion Co.",
      profileUrl: "/api/placeholder/40/40",
      rating: 4.7,
      verified: true,
      description:
        "Sustainable fashion brand focused on eco-friendly materials.",
      website: "https://ecofashion.com",
      advertiserTypes: [AdvertiserType.CLOTHING, AdvertiserType.EVENTS],
    },
    title: "Fashion Brand Content Creation",
    type: CampaignType.SELLER,
    mediaUrl: undefined,
    status: PromoterCampaignStatus.ONGOING,
    description:
      "Create compelling content and drive sales for our new sustainable fashion line.",
    targetAudience:
      "Fashion-conscious millennials interested in sustainability",
    preferredPlatforms: [SocialPlatform.INSTAGRAM, SocialPlatform.TIKTOK],
    requirements: [
      "Fashion content creation",
      "Instagram/TikTok presence",
      "Sustainable fashion interest",
    ],
    createdAt: new Date("2025-06-28"),
    deadline: "2025-08-20",
    startDate: "2025-06-28",
    isPublic: true,
    tags: [AdvertiserType.CLOTHING, AdvertiserType.EVENTS],
    sellerRequirements: [Deliverable.INSTAGRAM_POST, Deliverable.TIKTOK_VIDEO],
    deliverables: [Deliverable.PRODUCT_REVIEW, Deliverable.PROMOTIONAL_VIDEO],
    maxBudget: 3000,
    minBudget: 2000,
    minFollowers: 5000,
    needMeeting: true,
    meetingPlan: MeetingPlan.ONE_TIME,
    meetingCount: 1,
  } as SellerCampaign,
  {
    id: "5",
    advertiser: {
      id: "adv-5",
      companyName: "ProductivityPro",
      profileUrl: "/api/placeholder/40/40",
      rating: 4.5,
      verified: true,
      description:
        "Productivity app helping professionals optimize their workflow.",
      website: "https://productivitypro.com",
      advertiserTypes: [AdvertiserType.TECH, AdvertiserType.OTHER],
    },
    title: "Tech Product Review Campaign",
    type: CampaignType.VISIBILITY,
    mediaUrl: undefined,
    status: PromoterCampaignStatus.ONGOING,
    description:
      "Review and promote our new productivity app to tech-savvy professionals.",
    targetAudience: "Tech-savvy professionals and entrepreneurs",
    preferredPlatforms: [SocialPlatform.YOUTUBE, SocialPlatform.LINKEDIN],
    requirements: [
      "Tech review experience",
      "Professional audience",
      "Video content preferred",
    ],
    createdAt: new Date("2025-06-30"),
    deadline: "2025-07-25",
    startDate: "2025-06-30",
    isPublic: true,
    tags: [AdvertiserType.TECH, AdvertiserType.OTHER],
    maxViews: 37500,
    currentViews: 0,
    cpv: 0.08,
    minFollowers: 2000,
  } as VisibilityCampaign,
];

// Mock response data following the ExploreCampaignResponse interface
export const EXPLORE_CAMPAIGN_MOCK: ExploreCampaignResponse = {
  campaigns: mockCampaigns,
  page: 1,
  totalPages: 1,
  totalCount: mockCampaigns.length,
  sortBy: "newest",
  searchTerm: "",
  typeFilter: [],
  advertiserTypes: [],
};

// Legacy export for backward compatibility (just the campaigns array)
export const LEGACY_EXPLORE_CAMPAIGN_MOCK = mockCampaigns;
