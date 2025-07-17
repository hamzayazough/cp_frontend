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
  FileText,
} from "lucide-react";
import Image from "next/image";

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
              <span className="text-sm font-medium text-gray-600">
                Cost per 100 Views
              </span>
              <span className="text-lg font-semibold text-pink-600">
                {campaign.campaign.type === CampaignType.VISIBILITY
                  ? formatCurrency(campaign.campaign.cpv * 100)
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Max Views
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {campaign.campaign.type === CampaignType.VISIBILITY
                  ? formatNumber(campaign.campaign.maxViews)
                  : "N/A"}
              </span>
            </div>
            {campaign.campaign.type === CampaignType.VISIBILITY &&
              campaign.campaign.minFollowers && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Min Followers
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
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
              <span className="text-sm font-medium text-gray-600">
                Budget Range
              </span>
              <span className="text-lg font-semibold text-gray-900">
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
    <div className="space-y-6">
      {" "}
      {/* Campaign Media */}
      {campaign.mediaUrl && (
        <div>
          <div className="w-full max-w-2xl h-80 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center mx-auto">
            {campaign.mediaUrl.endsWith(".mp4") ||
            campaign.mediaUrl.endsWith(".webm") ||
            campaign.mediaUrl.endsWith(".mov") ||
            campaign.mediaUrl.endsWith(".avi") ? (
              <video
                src={campaign.mediaUrl}
                controls
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            ) : campaign.mediaUrl.endsWith(".pdf") ? (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                <FileText className="h-16 w-16 text-gray-400" />
                <p className="text-gray-600 text-center">PDF Document</p>
                <a
                  href={campaign.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View PDF
                </a>
              </div>
            ) : (
              <Image
                src={campaign.mediaUrl}
                alt="Campaign Media"
                width={800}
                height={400}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="flex flex-col items-center justify-center space-y-4">
                      <div class="h-16 w-16 text-gray-400">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                      </div>
                      <p class="text-gray-600 text-center">Media unavailable</p>
                    </div>
                  `;
                }}
              />
            )}
          </div>
        </div>
      )}
      {/* Three cards section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Details Card */}
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Campaign Details
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Budget</span>
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(campaign.campaign.budgetHeld)}
              </span>
            </div>
            {renderCampaignSpecificDetails()}
          </div>
        </div>

        {/* Target Audience Card */}
        <div className="bg-green-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Target Audience
            </h3>
          </div>
          <div className="space-y-3">
            {campaign.campaign.targetAudience && (
              <p className="text-gray-700 text-sm leading-relaxed">
                {campaign.campaign.targetAudience}
              </p>
            )}
            {campaign.campaign.preferredPlatforms &&
              campaign.campaign.preferredPlatforms.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Preferred Platforms:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {campaign.campaign.preferredPlatforms.map(
                      (platform, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full"
                        >
                          {getSocialPlatformIcon(platform)}
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
        <div className="bg-purple-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Tag className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Campaign Tags
            </h3>
          </div>
          <div className="space-y-3">
            {campaign.tags && campaign.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {campaign.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getAdvertiserTypeColor(
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
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Campaign Timeline
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-900">Start Date</p>
              <p className="text-sm text-gray-600">
                {formatDate(campaign.campaign.startDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Deadline</p>
              <p className="text-sm text-gray-600">
                {formatDate(campaign.campaign.deadline)}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
