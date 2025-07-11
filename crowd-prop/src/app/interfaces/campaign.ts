import {
  CampaignStatus,
  CampaignType,
  SalesTrackingMethod,
  Deliverable,
  MeetingPlan,
} from "../enums/campaign-type";
import { AdvertiserType } from "../enums/advertiser-type";

// Base campaign interface
export interface Campaign {
  id: string;
  title: string;
  description: string;
  type: CampaignType;
  advertiserTypes?: AdvertiserType[];
  isPublic: boolean;
  expiryDate?: Date;
  mediaUrl?: string;

  requirements?: string[]; // Additional requirements for the campaign
  targetAudience?: string; // Target audience description
  preferredPlatforms?: SocialPlatform[];

  //set by server
  status: CampaignStatus;
  createdAt: Date;
  updatedAt?: Date;
  advertiserId: string;
  startsAt?: Date; // When the campaign starts, can be null if ongoing
  endsAt?: Date; // When the campaign ends, can be null if ongoing

  // after creation
  selectedPromoterId?: string; // ID of the selected promoter for the campaign if campaign isPublic = false and a promoter is selected

  //discord generated invite link once the campaign is created
  discordInviteLink?: string;

  // Payment tracking fields
  budgetHeld: number; // Amount currently reserved/held from advertiser
  spentBudget: number; // Amount spent so far in the campaign
  finalPayoutAmount?: number; // Actual amount to pay to promoter (negotiated/agreed)
  payoutExecuted: boolean; // Indicates if transfer to promoter completed
  payoutDate?: Date; // When payout was executed
  stripeChargeId?: string; // Stripe charge ID for funds collection
  stripeTransferId?: string; // Stripe transfer ID for payout to promoter
}

export interface VisibilityCampaign extends Campaign {
  type: CampaignType.VISIBILITY;
  cpv: number; // cost per 100 views
  maxViews?: number; // maximum view user want to achieve
  trackUrl: string;
  minFollowers?: number;
}

export interface ConsultantCampaign extends Campaign {
  type: CampaignType.CONSULTANT;
  expectedDeliverables: Deliverable[];
  meetingCount?: number;
  maxBudget: number;
  minBudget: number;
  deadline?: Date;
  PromoterLinks?: string[];
  isPublic: false; // false by default

  // Once Consultant campaign is created the selected promoter is gonna share a link to show his current work
  // to the advertiser, so advertiser can see the progress and give feedback
  promoterLinks?: string[]; // Links submitted by the promoter for deliverables
}

export interface SellerCampaign extends Campaign {
  type: CampaignType.SELLER;
  sellerRequirements?: Deliverable[];
  deliverables?: Deliverable[];
  meetingPlan?: MeetingPlan;
  deadlineStrict: boolean;
  deadline: Date;

  maxBudget: number;
  minBudget: number;
  isPublic: false; // false by default

  // Once Seller campaign is created, the selected promoter is gonna share links for example, if he creates a tiktok account for the product (tiktok account link) or post instagram posts (instagram post links)
  // PromoterLinks is an array of links that the promoter has created for the campaign
  PromoterLinks?: string[];
  minFollowers?: number;
  PromoterLinks?: string[];
}

export interface SalesmanCampaign extends Campaign {
  type: CampaignType.SALESMAN;
  commissionPerSale: number;
  trackSalesVia: SalesTrackingMethod;
  codePrefix?: string;
  isPublic: false; // false by default
  minFollowers?: number;
}

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
  deadlineStrict?: boolean; // Optional in both, defaults to false
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

/*
            EXPLANATION OF CAMPAIGN TYPES

    🧠 CAMPAIGN TYPES – FULL EXPLANATION
🎯 1. VISIBILITY Campaign
Used when an Advertiser wants maximum exposure (views or reach) for a product, link, or brand.

✅ Created by:
An Advertiser aiming to get traffic to a URL (e.g., website, YouTube, Instagram).

💡 Goal:
Get real people to view a specific link via promoters’ audience.

👤 Promoter’s role:
They get a shortlink (trackUrl) that redirects to the advertiser’s URL.

They share the link via TikTok, Instagram, Snap, etc.

🔁 Access:
isPublic: true

No need to apply → Anyone can promote instantly.

💰 Earnings:
Based on CPV (cost per 100 views)

Tracked automatically using the redirect backend (trackUrl).

View tracking strategy handled by ViewTrackingStrategy.

🔚 Ends when:
expiryDate is reached

OR maxViews limit hit

OR campaign is manually paused

🧠 2. CONSULTANT Campaign
Used when an Advertiser wants a skilled freelancer to provide expert help (e.g., content strategy, ad writing, etc.).

✅ Created by:
An Advertiser with specific consulting needs.

💡 Goal:
Receive professional consulting deliverables (written material, feedback, plans, etc.)

👤 Promoter’s role:
They must apply with a pitch, portfolioUrl, and optionally a quote.

If selected, they:

Join a private Discord via discordInviteLink

Deliver via files and referenceUrl

Respect the number of meetings and deadlines

🔁 Access:
isPublic: false

applicationRequired: true

Only one Promoter can be selected (selectedPromoterId)

📊 Success metric:
Deliverables sent (tracked manually)

Meetings held (meetingCount)

Progress shown via referenceUrl

Satisfaction of advertiser

🔚 Ends when:
Promoter is selected

All agreed deliverables completed

🛍️ 3. SELLER Campaign
Used when an Advertiser wants a Promoter to create and sell something (e.g., marketing material, landing pages).

✅ Created by:
An Advertiser who wants to outsource a small sales operation.

💡 Goal:
Let a promoter:

Build a product or asset

Sell or launch it using their social reach

👤 Promoter’s role:
Apply with pitch, portfolio, and optionally quote

Once selected, they:

Join private Discord

Deliver on deliverables

Upload proof (links, images, assets) to PromoterLinks

🔁 Access:
isPublic: false

applicationRequired: true

One promoter only → selectedPromoterId

📊 Success metric:
Deliverables submitted and accepted

Campaign links shown in PromoterLinks[]

On-time completion (deadlineStrict)

🔚 Ends when:
Promoter selected

Deliverables completed

💼 4. SALESMAN Campaign
Used when an Advertiser wants to generate sales using promo codes or trackable links.

✅ Created by:
An Advertiser looking to pay-per-sale via Promoters.

💡 Goal:
Boost sales conversions using influencers’ audiences.

👤 Promoter’s role:
Use a referral link or promo code (trackSalesVia)

Promote on socials

Get commission per sale (commissionPerSale)

Links include custom codePrefix to distinguish promoters

🔁 Access:
isPublic: true

applicationRequired is usually false

If onlyApprovedCanSell = true, advertiser must approve

📊 Success metric:
Tracked purchases via code or link

Paid commission per successful sale

🔚 Ends when:
Budget exhausted

Campaign expired

Manually paused by advertiser

🧩 Additional Notes:
All campaign types include a Discord invite (discordInviteLink) on creation for off-platform collaboration.

selectedPromoterId locks the campaign for types requiring manual approval.

All monetary values (like cpv, commissionPerSale, minBudget, maxBudget) are numeric and should be treated with currency-safe formatting.

All date fields (deadline, expiryDate) are actual Date objects — not strings.
*/
