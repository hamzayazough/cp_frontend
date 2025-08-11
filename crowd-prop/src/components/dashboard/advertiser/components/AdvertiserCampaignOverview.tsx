"use client";

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
} from "lucide-react";

interface AdvertiserCampaignOverviewProps {
  campaign: CampaignAdvertiser;
}

export default function AdvertiserCampaignOverview({
  campaign,
}: AdvertiserCampaignOverviewProps) {
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

  return (
    <div className="space-y-4">
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
    </div>
  );
}
