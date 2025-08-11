"use client";

import { useState } from "react";
import { CampaignAdvertiser } from "@/app/interfaces/campaign/advertiser-campaign";
import { CampaignType } from "@/app/enums/campaign-type";
import { SocialPlatform } from "@/app/enums/social-platform";
import {
  DollarSign,
  Users,
  Globe,
  CheckCircle,
  MessageCircle,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Facebook,
  MapPin,
  Eye,
  User,
  ShoppingBag,
  Banknote,
  Info,
} from "lucide-react";

interface AdvertiserCampaignOverviewProps {
  campaign: CampaignAdvertiser;
}

export default function AdvertiserCampaignOverview({
  campaign,
}: AdvertiserCampaignOverviewProps) {
  const [showCampaignTypeModal, setShowCampaignTypeModal] = useState(false);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getSocialPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case SocialPlatform.INSTAGRAM:
        return <Instagram className="h-4 w-4" />;
      case SocialPlatform.TWITTER:
        return <Twitter className="h-4 w-4" />;
      case SocialPlatform.YOUTUBE:
        return <Youtube className="h-4 w-4" />;
      case SocialPlatform.LINKEDIN:
        return <Linkedin className="h-4 w-4" />;
      case SocialPlatform.FACEBOOK:
        return <Facebook className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getRequirements = () => {
    const baseRequirements = campaign.campaign.requirements || [];
    const requirements = [...baseRequirements];
    
    if ('minFollowers' in campaign.campaign && campaign.campaign.minFollowers && campaign.campaign.minFollowers > 0) {
      requirements.push(`Minimum ${campaign.campaign.minFollowers.toLocaleString()} followers required`);
    }
    
    return requirements;
  };

  const getBudgetInfo = () => {
    switch (campaign.campaign.type) {
      case CampaignType.VISIBILITY:
        return {
          mainValue: formatCurrency(campaign.campaign.budgetAllocated),
          subInfo: `${formatCurrency(campaign.campaign.cpv)} per 100 views • Max ${formatNumber(campaign.campaign.maxViews)} views`
        };
      case CampaignType.CONSULTANT:
        return {
          mainValue: `${formatCurrency(campaign.campaign.minBudget)} - ${formatCurrency(campaign.campaign.maxBudget)}`,
          subInfo: `${campaign.campaign.meetingCount} meetings required`
        };
      case CampaignType.SELLER:
        return {
          mainValue: campaign.campaign.fixedPrice 
            ? formatCurrency(campaign.campaign.fixedPrice)
            : `${formatCurrency(campaign.campaign.minBudget)} - ${formatCurrency(campaign.campaign.maxBudget)}`,
          subInfo: campaign.campaign.fixedPrice ? "Fixed price" : "Budget range"
        };
      case CampaignType.SALESMAN:
        return {
          mainValue: formatCurrency(campaign.campaign.commissionPerSale),
          subInfo: `Commission per sale • Track via ${campaign.campaign.trackSalesVia}`
        };
      default:
        return {
          mainValue: formatCurrency(campaign.campaign.budgetAllocated),
          subInfo: "Total budget"
        };
    }
  };

  const budgetInfo = getBudgetInfo();

  // Campaign type configurations
  const getCampaignTypeInfo = () => {
    switch (campaign.campaign.type) {
      case CampaignType.VISIBILITY:
        return {
          icon: Eye,
          title: 'Visibility Campaign',
          description: 'Effortless exposure - promoters drive traffic while you pay only for results',
          detailedDescription: 'A visibility campaign starts when the advertiser enters the campaign creation process and defines all necessary details. They provide a title and description for the campaign, set the destination URL they want to promote, decide on a price per 100 unique views, and determine either a total budget or a campaign duration. Once these details are submitted, the system automatically generates a unique tracking link for the campaign. This link acts as the entry point for all promotional traffic and is essential for accurate tracking.',
          color: 'blue',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-600',
          borderColor: 'border-blue-200'
        };
      case CampaignType.CONSULTANT:
        return {
          icon: User,
          title: 'Consultant Campaign',
          description: 'Get strategic advice from marketing experts',
          detailedDescription: 'The consultant campaign begins with the advertiser browsing the list of available consultants on the platform. After reviewing profiles, ratings, portfolios, and pricing models, the advertiser selects a single consultant for the campaign. This choice is significant because the consultant will be the exclusive partner for the entire campaign duration. The advertiser and consultant then meet virtually to define the campaign scope, objectives, deliverables, meeting frequency, and key milestones. The advertiser sets both a minimum and maximum budget to control the project\'s financial scope. Once the agreement is in place, the onboarding phase starts with a discovery session where the consultant gathers in-depth information about the advertiser\'s brand, target market, competitors, and promotional history. Using this information, the consultant develops a tailored marketing strategy. This can include detailed content plans, ad concepts, scripts, platform recommendations, and brand guidelines. The deliverables are created in the agreed formats, such as Figma mockups, Google Docs, PowerPoint decks, or private video recordings, and shared through secure, link-based delivery. Throughout the campaign, scheduled meetings — often weekly or bi-weekly — are held to review progress, adapt strategies, and address challenges. The consultant\'s role is to provide continuous strategic direction, make adjustments based on performance data, and ensure that the advertiser has actionable steps to follow. Payments are made progressively, either on milestone completion or on a time-based schedule, always within the limits of the agreed maximum budget.',
          color: 'purple',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          iconColor: 'text-purple-600',
          borderColor: 'border-purple-200'
        };
      case CampaignType.SELLER:
        return {
          icon: ShoppingBag,
          title: 'Seller Campaign',
          description: 'Get hands-on promotion and social media management',
          detailedDescription: 'The seller campaign is initiated when an advertiser selects a single seller from the platform\'s pool of promoters. This seller is not just an advisor but an active executor of promotional work. The advertiser and seller first define the campaign scope, which may range from complete creative autonomy for the seller to highly specific instructions for execution. The advertiser also sets a minimum and maximum budget for the campaign. Once the campaign begins, the seller starts executing the promotional plan. This may involve creating and managing social media accounts, posting content regularly, running paid ad campaigns, producing videos, engaging with audiences, writing blog articles, sending email blasts, or promoting across multiple channels. Sellers may also set up dedicated "throwaway" accounts specifically for aggressive promotional pushes or niche targeting. In some cases, they handle direct outreach to potential customers through DMs, cold emails, or phone calls.',
          color: 'green',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          iconColor: 'text-green-600',
          borderColor: 'border-green-200'
        };
      case CampaignType.SALESMAN:
        return {
          icon: Banknote,
          title: 'Salesman Campaign',
          description: 'Commission-based sales through affiliate promoters',
          detailedDescription: 'The salesman campaign begins with the advertiser defining a commission structure that specifies what percentage of each sale will go to the promoter. The advertiser also decides whether to allow multiple promoters or keep the campaign exclusive to one. Once set, the platform generates a unique promotional code or affiliate link for each participating promoter. This identifier is tied directly to the platform\'s tracking system, which must be integrated into the advertiser\'s e-commerce backend. Before launch, the platform verifies that the advertiser\'s site or store is correctly tracking sales through the provided code or link. Once the campaign is live, promoters begin promoting the advertiser\'s products or services using their assigned identifiers. They may use a variety of methods, including social media content, influencer collaborations, paid ads, blog posts, or even offline promotions, as long as customers are directed to make purchases using the assigned code or link. When a customer completes a purchase using the promoter\'s code or link, the transaction is logged in the system. The system maintains an ongoing record of each promoter\'s total sales, revenue generated, and corresponding commission. Advertisers can monitor performance at any time, and promoters have their own dashboards for tracking progress.',
          color: 'orange',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          iconColor: 'text-orange-600',
          borderColor: 'border-orange-200'
        };
      default:
        return null;
    }
  };

  const campaignTypeInfo = getCampaignTypeInfo();

  return (
    <div className="space-y-4">
      {/* Campaign Type Tooltip */}
      {campaignTypeInfo && (
        <div 
          className={`${campaignTypeInfo.bgColor} border ${campaignTypeInfo.borderColor} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setShowCampaignTypeModal(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <campaignTypeInfo.icon className={`h-5 w-5 ${campaignTypeInfo.iconColor}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${campaignTypeInfo.textColor} mb-1`}>
                  {campaignTypeInfo.title}
                </h3>
                <p className={`text-sm ${campaignTypeInfo.textColor} opacity-80`}>
                  {campaignTypeInfo.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Info className={`h-4 w-4 ${campaignTypeInfo.iconColor}`} />
              <span className={`text-xs ${campaignTypeInfo.textColor} font-medium`}>
                Learn More
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Description */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">About This Campaign</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          {campaign.description}
        </p>
      </div>

      {/* Key Information - Compact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Budget */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <DollarSign className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Budget</span>
          </div>
          <div className="text-lg font-bold text-green-600 mb-1">
            {budgetInfo.mainValue}
          </div>
          <div className="text-xs text-gray-600">
            {budgetInfo.subInfo}
          </div>
        </div>

        {/* Target Audience */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Users className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Target Audience</span>
          </div>
          {campaign.campaign.targetAudience ? (
            <p className="text-sm text-gray-700 mb-2 line-clamp-2">
              {campaign.campaign.targetAudience}
            </p>
          ) : (
            <p className="text-sm text-gray-500 mb-2">No specific audience</p>
          )}
          {campaign.campaign.preferredPlatforms && campaign.campaign.preferredPlatforms.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {campaign.campaign.preferredPlatforms.slice(0, 3).map((platform, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                >
                  {getSocialPlatformIcon(platform)}
                  <span className="ml-1">{platform}</span>
                </div>
              ))}
              {campaign.campaign.preferredPlatforms.length > 3 && (
                <span className="text-xs text-gray-500">+{campaign.campaign.preferredPlatforms.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Requirements */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-4 w-4 text-orange-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Requirements</span>
          </div>
          {getRequirements().length > 0 ? (
            <div className="space-y-1">
              {getRequirements().slice(0, 2).map((requirement, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="text-xs text-gray-700">{requirement}</span>
                </div>
              ))}
              {getRequirements().length > 2 && (
                <div className="text-xs text-gray-500">+{getRequirements().length - 2} more</div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500">No specific requirements</p>
          )}
        </div>

      </div>

      {/* Categories - Full Width */}
      {campaign.tags && campaign.tags.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <MapPin className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Categories</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {campaign.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium"
              >
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Discord Channel */}
      {campaign.campaign.discordInviteLink && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 text-indigo-600 mr-2" />
              <div>
                <span className="text-sm font-medium text-gray-900">Discussion Channel</span>
                <p className="text-xs text-gray-600">Ask questions & connect</p>
              </div>
            </div>
            <a
              href={campaign.campaign.discordInviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 transition-colors"
            >
              Join
            </a>
          </div>
        </div>
      )}

      {/* Campaign Type Info Modal */}
      {showCampaignTypeModal && campaignTypeInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`${campaignTypeInfo.bgColor} border-b ${campaignTypeInfo.borderColor} p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <campaignTypeInfo.icon className={`h-6 w-6 ${campaignTypeInfo.iconColor}`} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${campaignTypeInfo.textColor}`}>
                      {campaignTypeInfo.title}
                    </h2>
                    <p className={`text-sm ${campaignTypeInfo.textColor} opacity-80`}>
                      How this campaign type works
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCampaignTypeModal(false)}
                  className={`p-2 rounded-lg hover:bg-white hover:bg-opacity-50 transition-colors ${campaignTypeInfo.textColor}`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Campaign Overview
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {campaignTypeInfo.description}
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How It Works
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {campaignTypeInfo.detailedDescription}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-4">
              <button
                onClick={() => setShowCampaignTypeModal(false)}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
