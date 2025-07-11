"use client";

import Link from "next/link";
import {
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  TagIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { 
  CampaignPromoter, 
  VisibilityCampaignDetails,
  ConsultantCampaignDetails,
  SellerCampaignDetails,
  SalesmanCampaignDetails
} from "@/interfaces/campaign-promoter";
import { CampaignType } from "@/app/enums/campaign-type";

interface CampaignOverviewProps {
  campaign: CampaignPromoter;
}

export default function CampaignOverview({ campaign }: CampaignOverviewProps) {
  const renderCampaignTips = () => {
    switch (campaign.campaign.type) {
      case CampaignType.VISIBILITY:
        return (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-400 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  💡
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                  💡 Pro Tips to Maximize Your Earnings
                </h3>
                <div className="space-y-2 text-sm text-emerald-800">
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Post consistently and engage with your audience</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Use trending hashtags and optimize posting times</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Create authentic content that resonates with your followers</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Always include your tracking link in posts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case CampaignType.CONSULTANT:
        return (
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 border-l-4 border-purple-400 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  🎯
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  🎯 Consulting Success Tips
                </h3>
                <div className="space-y-2 text-sm text-purple-800">
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Prepare thoroughly for each client meeting</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Deliver actionable insights and recommendations</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Document your work and share progress updates</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Be responsive and maintain professional communication</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case CampaignType.SELLER:
      case CampaignType.SALESMAN:
        return (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  💰
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  💰 Sales & Delivery Tips
                </h3>
                <div className="space-y-2 text-sm text-orange-800">
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Follow up promptly with potential customers</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Provide excellent customer service</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Track your sales metrics and optimize your approach</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Build long-term relationships with customers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderCampaignDetails = () => {
    const baseDetails = (
      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Budget</span>
        </div>
        <span className="font-semibold text-gray-900">
          ${campaign.campaign.budgetHeld.toLocaleString()}
        </span>
      </div>
    );

    const specificDetails = [];

    switch (campaign.campaign.type) {
      case CampaignType.VISIBILITY:
        const visibilityDetails = campaign.campaign as VisibilityCampaignDetails;
        specificDetails.push(
          <div key="cpv" className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Revenue per 100 Views</span>
            </div>
            <span className="font-semibold text-gray-900">
              ${visibilityDetails.cpv}
            </span>
          </div>
        );
        break;

      case CampaignType.CONSULTANT:
        const consultantDetails = campaign.campaign as ConsultantCampaignDetails;
        specificDetails.push(
          <div key="minBudget" className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Min Budget</span>
            </div>
            <span className="font-semibold text-gray-900">
              ${consultantDetails.minBudget?.toLocaleString() || 0}
            </span>
          </div>,
          <div key="maxBudget" className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Max Budget</span>
            </div>
            <span className="font-semibold text-gray-900">
              ${consultantDetails.maxBudget?.toLocaleString() || 0}
            </span>
          </div>,
          <div key="meetingPlan" className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Meeting Plan</span>
            </div>
            <span className="font-semibold text-gray-900">
              {consultantDetails.meetingPlan || "TBD"}
            </span>
          </div>
        );
        break;

      case CampaignType.SELLER:
        const sellerDetails = campaign.campaign as SellerCampaignDetails;
        specificDetails.push(
          <div key="fixedPrice" className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Fixed Price</span>
            </div>
            <span className="font-semibold text-gray-900">
              ${sellerDetails.fixedPrice || 0}
            </span>
          </div>
        );
        break;

      case CampaignType.SALESMAN:
        const salesmanDetails = campaign.campaign as SalesmanCampaignDetails;
        specificDetails.push(
          <div key="commission" className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Commission Rate</span>
            </div>
            <span className="font-semibold text-gray-900">
              {salesmanDetails.commissionPerSale}%
            </span>
          </div>
        );
        break;
    }

    return [baseDetails, ...specificDetails];
  };

  return (
    <div className="space-y-6">
      {/* Campaign Media */}
      {campaign.mediaUrl && (
        <div>
          <div className="w-full max-w-2xl h-80 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center mx-auto">
            {campaign.mediaUrl.endsWith(".mp4") ||
            campaign.mediaUrl.endsWith(".webm") ? (
              <video
                src={campaign.mediaUrl}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={campaign.mediaUrl}
                alt="Campaign Media"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      )}

      {/* Tips Section */}
      {renderCampaignTips()}

      {/* Campaign Description */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-100">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 ml-3">
            Campaign Description
          </h3>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-700 leading-relaxed">
            {campaign.description}
          </p>
        </div>
      </div>

      {/* Advertiser Information */}
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-100">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-cyan-100 rounded-lg">
            <BuildingOfficeIcon className="h-5 w-5 text-cyan-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 ml-3">
            Advertiser Information
          </h3>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
              {campaign.advertiser.profileUrl ? (
                <img
                  src={campaign.advertiser.profileUrl}
                  alt={campaign.advertiser.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-semibold text-gray-900">
                  {campaign.advertiser.name}
                </h4>
                <span className="text-sm text-gray-500">
                  {campaign.advertiser.type}
                </span>
              </div>
              <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                {campaign.advertiser.description}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-500">
                  Industry: {campaign.advertiser.industry}
                </span>
                <span className="text-gray-500">
                  Since: {campaign.advertiser.memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Details Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">
              Campaign Details
            </h3>
          </div>
          <div className="space-y-4">
            {renderCampaignDetails()}
          </div>
        </div>

        {/* Target Audience Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserGroupIcon className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">
              {campaign.campaign.type === CampaignType.CONSULTANT
                ? "Target Market"
                : "Target Audience"}
            </h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {campaign.campaign.targetAudience}
            </p>
          </div>

          {/* Consultant-specific expertise display */}
          {campaign.campaign.type === CampaignType.CONSULTANT && (
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Required Expertise:
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-green-200">
                <p className="text-green-700 text-sm font-medium">
                  {(campaign.campaign as ConsultantCampaignDetails).expertiseRequired}
                </p>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                Preferred Platforms:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {campaign.campaign.preferredPlatforms &&
                campaign.campaign.preferredPlatforms.map((platform) => (
                  <span
                    key={platform}
                    className="inline-flex items-center px-3 py-1 bg-white border border-green-200 text-green-700 rounded-full text-sm font-medium shadow-sm"
                  >
                    {platform}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Tags Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TagIcon className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">
              Campaign Tags
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {campaign.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Campaign Timeline
            </h3>
          </div>

          {/* Visual Timeline */}
          {campaign.campaign.startDate && campaign.campaign.deadline && (
            <div className="w-full max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  <div className="font-medium">Start Date</div>
                  <div>{new Date(campaign.campaign.startDate).toLocaleDateString()}</div>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="font-medium">Deadline</div>
                  <div>{new Date(campaign.campaign.deadline).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        0,
                        ((new Date().getTime() - new Date(campaign.campaign.startDate).getTime()) /
                          (new Date(campaign.campaign.deadline).getTime() - new Date(campaign.campaign.startDate).getTime())) *
                          100
                      ),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Channel Footer */}
      {campaign.campaign.discordInviteLink && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Join Campaign Channel
                </h3>
                <p className="text-sm text-gray-600">
                  Connect with the advertiser and other promoters
                </p>
              </div>
            </div>
            <Link
              href={campaign.campaign.discordInviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
              Join Discord Channel
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
