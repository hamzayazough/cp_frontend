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
  SalesmanCampaignDetails,
} from "@/app/interfaces/campaign/promoter-campaign-details";
import { CampaignType } from "@/app/enums/campaign-type";
import Image from "next/image";

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
                    <span>
                      Post consistently on different platforms and use your
                      creativity to generate engaging content
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>
                      Use trending hashtags and optimize posting times
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>
                      Create authentic content that resonates with your audience
                    </span>
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
                    <span>
                      Exceed client expectations by delivering exceptional value
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Document your work and share progress updates</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <span>
                      Be responsive and maintain professional communication
                    </span>
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
                    <span>
                      Track your sales metrics and optimize your approach
                    </span>
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
      <div key="baseDetails" className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
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
        const visibilityDetails =
          campaign.campaign as VisibilityCampaignDetails;
        specificDetails.push(
          <div
            key="cpv"
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">
                Revenue per 100 Views
              </span>
            </div>
            <span className="font-semibold text-gray-900">
              ${visibilityDetails.cpv}
            </span>
          </div>
        );
        break;

      case CampaignType.CONSULTANT:
        const consultantDetails =
          campaign.campaign as ConsultantCampaignDetails;
        specificDetails.push(
          <div
            key="minBudget"
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Min Budget</span>
            </div>
            <span className="font-semibold text-gray-900">
              ${consultantDetails.minBudget?.toLocaleString() || 0}
            </span>
          </div>,
          <div
            key="maxBudget"
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Max Budget</span>
            </div>
            <span className="font-semibold text-gray-900">
              ${consultantDetails.maxBudget?.toLocaleString() || 0}
            </span>
          </div>,
          <div
            key="meetingPlan"
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Meeting Plan</span>
            </div>
            <span className="font-semibold text-gray-900">
              {consultantDetails.meetingPlan || "TBD"}
            </span>
          </div>,
          <div
            key="meetingCount"
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Planned Meetings</span>
            </div>
            <span className="font-semibold text-gray-900">
              {consultantDetails.meetingCount || 0}
            </span>
          </div>
        );

        // Add deliverables if they exist
        if (
          consultantDetails.expectedDeliverables &&
          consultantDetails.expectedDeliverables.length > 0
        ) {
          specificDetails.push(
            <div
              key="deliverables"
              className="p-3 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">
                  Expected Deliverables
                </span>
              </div>
              <div className="space-y-2">
                {consultantDetails.expectedDeliverables.map(
                  (deliverable, index) => (
                    <div
                      key={deliverable.id || index}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                        {deliverable.deliverable.replace(/_/g, " ")}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        }
        break;
      case CampaignType.SELLER:
        const sellerDetails = campaign.campaign as SellerCampaignDetails;

        // Show meeting requirement
        specificDetails.push(
          <div
            key="needMeeting"
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Meeting Required</span>
            </div>
            <span className="font-semibold text-gray-900">
              {sellerDetails.needMeeting ? "Yes" : "No"}
            </span>
          </div>
        );

        // If meeting is required, show meeting details
        if (sellerDetails.needMeeting) {
          specificDetails.push(
            <div
              key="meetingPlan"
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Meeting Plan</span>
              </div>
              <span className="font-semibold text-gray-900">
                {sellerDetails.meetingPlan || "TBD"}
              </span>
            </div>,
            <div
              key="meetingCount"
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Planned Meetings</span>
              </div>
              <span className="font-semibold text-gray-900">
                {sellerDetails.meetingCount || 0}
              </span>
            </div>
          );
        }

        // Add deliverables if they exist
        if (
          sellerDetails.deliverables &&
          sellerDetails.deliverables.length > 0
        ) {
          specificDetails.push(
            <div
              key="deliverables"
              className="p-3 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">
                  Required Deliverables
                </span>
              </div>
              <div className="space-y-2">
                {sellerDetails.deliverables.map((deliverable, index) => (
                  <div
                    key={deliverable.id || index}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                      {deliverable.deliverable.replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        break;

      case CampaignType.SALESMAN:
        const salesmanDetails = campaign.campaign as SalesmanCampaignDetails;
        specificDetails.push(
          <div
            key="commission"
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
          >
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
            ) : campaign.mediaUrl.toLowerCase().endsWith(".pdf") ? (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-gray-50">
                <svg
                  className="h-16 w-16 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                <p className="text-gray-600 text-lg font-medium">
                  PDF Document
                </p>
                <a
                  href={campaign.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
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
                    <div class="w-full h-full flex flex-col items-center justify-center space-y-4 bg-gray-100">
                      <svg class="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                      <p class="text-gray-500 text-lg font-medium">Media unavailable</p>
                    </div>
                  `;
                }}
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
        </div>{" "}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start space-x-4">
            {" "}
            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
              {campaign.advertiser.profileUrl ? (
                <Image
                  src={campaign.advertiser.profileUrl}
                  alt={campaign.advertiser.companyName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              {" "}
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-semibold text-gray-900">
                  {campaign.advertiser.companyName}
                </h4>{" "}
                {campaign.advertiser.verified && (
                  <div className="relative">
                    <svg
                      className="w-5 h-5 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-sm text-gray-500">Rating:</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {campaign.advertiser.rating.toFixed(1)}
                  </span>
                  <span className="text-yellow-400 ml-1">★</span>
                </div>
              </div>
              <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                {campaign.advertiser.description}
              </p>
              {campaign.advertiser.website && (
                <div className="mb-3">
                  <a
                    href={campaign.advertiser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                  >
                    Visit Website →
                  </a>
                </div>
              )}
              {campaign.advertiser.advertiserTypes &&
                campaign.advertiser.advertiserTypes.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500 mb-2 block">
                      Industries:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {campaign.advertiser.advertiserTypes.map((type) => (
                        <span
                          key={type}
                          className="inline-flex items-center px-2 py-1 bg-cyan-100 text-cyan-800 text-xs font-medium rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
          <div className="space-y-4">{renderCampaignDetails()}</div>
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
                  {
                    (campaign.campaign as ConsultantCampaignDetails)
                      .expertiseRequired
                  }
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
                  <div>
                    {new Date(campaign.campaign.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="font-medium">Deadline</div>
                  <div>
                    {new Date(campaign.campaign.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        0,
                        ((new Date().getTime() -
                          new Date(campaign.campaign.startDate).getTime()) /
                          (new Date(campaign.campaign.deadline).getTime() -
                            new Date(campaign.campaign.startDate).getTime())) *
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
                  Having questions? Connect directly with the advertiser in the
                  campaign channel.
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
