"use client";

import { CampaignAdvertiser } from "@/app/interfaces/campaign/advertiser-campaign";
import { CampaignType } from "@/app/enums/campaign-type";
import { SocialPlatform } from "@/app/enums/social-platform";
import { AdvertiserType } from "@/app/enums/advertiser-type";
import {
  DollarSign,
  Target,
  Tag,
  Calendar,
  MessageCircle,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Facebook,
  Globe,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getSocialPlatformIcon = (platform: SocialPlatform, color?: string) => {
    const iconClass = color === "black" ? "h-4 w-4 text-gray-800" : "h-4 w-4";
    switch (platform) {
      case SocialPlatform.INSTAGRAM:
        return <Instagram className={iconClass} />;
      case SocialPlatform.TWITTER:
        return <Twitter className={iconClass} />;
      case SocialPlatform.YOUTUBE:
        return <Youtube className={iconClass} />;
      case SocialPlatform.LINKEDIN:
        return <Linkedin className={iconClass} />;
      case SocialPlatform.FACEBOOK:
        return <Facebook className={iconClass} />;
      default:
        return <Globe className={iconClass} />;
    }
  };

  const getAdvertiserTypeColor = (type: AdvertiserType) => {
    switch (type) {
      case AdvertiserType.EVENTS:
        return "bg-purple-100 text-purple-800";
      case AdvertiserType.SPORTS:
        return "bg-pink-100 text-pink-800";
      case AdvertiserType.TECH:
        return "bg-blue-100 text-blue-800";
      case AdvertiserType.HEALTH:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAdvertiserTypeLabel = (type: AdvertiserType) => {
    switch (type) {
      case AdvertiserType.EVENTS:
        return "EVENTS";
      case AdvertiserType.SPORTS:
        return "SPORTS";
      case AdvertiserType.TECH:
        return "TECH";
      case AdvertiserType.HEALTH:
        return "HEALTH";
      default:
        return type.toUpperCase();
    }
  };

  const renderCampaignSpecificDetails = () => {
    switch (campaign.type) {
      case CampaignType.VISIBILITY:
        return (
          <>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">
                Cost per 100 Views
              </span>
              <span className="text-sm font-semibold text-pink-600">
                {campaign.campaign.type === CampaignType.VISIBILITY
                  ? formatCurrency(campaign.campaign.cpv)
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">
                Max Views
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {campaign.campaign.type === CampaignType.VISIBILITY
                  ? formatNumber(campaign.campaign.maxViews)
                  : "N/A"}
              </span>
            </div>
            {campaign.campaign.type === CampaignType.VISIBILITY &&
              campaign.campaign.minFollowers && (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-600">
                    Min Followers
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatNumber(campaign.campaign.minFollowers)}
                  </span>
                </div>
              )}
          </>
        );

      case CampaignType.CONSULTANT:
        return (
          <>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">
                Budget Range
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {campaign.campaign.type === CampaignType.CONSULTANT
                  ? `${formatCurrency(
                      campaign.campaign.minBudget
                    )} - ${formatCurrency(campaign.campaign.maxBudget)}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Meeting Count
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {campaign.campaign.type === CampaignType.CONSULTANT
                  ? campaign.campaign.meetingCount
                  : "N/A"}
              </span>
            </div>
          </>
        );

      case CampaignType.SELLER:
        return (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Budget Range
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {campaign.campaign.type === CampaignType.SELLER
                  ? `${formatCurrency(
                      campaign.campaign.minBudget
                    )} - ${formatCurrency(campaign.campaign.maxBudget)}`
                  : "N/A"}
              </span>
            </div>
            {campaign.campaign.type === CampaignType.SELLER &&
              campaign.campaign.fixedPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Fixed Price
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(campaign.campaign.fixedPrice)}
                  </span>
                </div>
              )}
          </>
        );

      case CampaignType.SALESMAN:
        return (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Commission per Sale
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {campaign.campaign.type === CampaignType.SALESMAN
                  ? formatCurrency(campaign.campaign.commissionPerSale)
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Sales Tracking
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {campaign.campaign.type === CampaignType.SALESMAN
                  ? campaign.campaign.trackSalesVia
                  : "N/A"}
              </span>
            </div>
          </>
        );

      default:
        return null;
    }
  };
  return (
    <div className="space-y-4">
      {/* Three cards section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Campaign Details Card */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              Campaign Details
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">Budget</span>
              <span className="text-sm font-semibold text-green-600">
                {formatCurrency(campaign.campaign.budgetAllocated)}
              </span>
            </div>
            {renderCampaignSpecificDetails()}
          </div>
        </div>

        {/* Target Audience Card */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Target className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              Target Audience
            </h3>
          </div>
          <div className="space-y-2">
            {campaign.campaign.targetAudience && (
              <p className="text-gray-700 text-xs leading-relaxed">
                {campaign.campaign.targetAudience}
              </p>
            )}
            {campaign.campaign.preferredPlatforms &&
              campaign.campaign.preferredPlatforms.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1.5">
                    Preferred Platforms:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {campaign.campaign.preferredPlatforms.map(
                      (platform, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-1 bg-green-100 px-1.5 py-0.5 rounded-full"
                        >
                          {getSocialPlatformIcon(platform, "black")}
                          <span className="text-xs font-medium text-green-700">
                            {platform}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Campaign Tags Card */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Tag className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              Campaign Tags
            </h3>
          </div>
          <div className="space-y-2">
            {campaign.tags && campaign.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {campaign.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAdvertiserTypeColor(
                      tag
                    )}`}
                  >
                    {getAdvertiserTypeLabel(tag)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Campaign Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            Campaign Timeline
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-medium text-gray-900">Start Date</p>
              <p className="text-xs text-gray-600">
                {formatDate(campaign.campaign.startDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-900">Deadline</p>
              <p className="text-xs text-gray-600">
                {formatDate(campaign.campaign.deadline)}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    (campaign.campaign.spentBudget /
                      campaign.campaign.budgetHeld) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      {/* Campaign Channel Footer */}
      {campaign.campaign.discordInviteLink && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Join Campaign Channel
                </h3>
                <p className="text-sm text-gray-600">
                  Having questions? Connect directly with the advertiser in the
                  campaign channel.
                </p>
              </div>
            </div>
            <a
              href={campaign.campaign.discordInviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Join Discord Channel
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
