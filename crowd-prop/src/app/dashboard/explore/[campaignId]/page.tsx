"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  EyeIcon,
  CurrencyDollarIcon,
  TagIcon,
  CheckCircleIcon,
  UsersIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  PresentationChartLineIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { CampaignType, CampaignStatus } from "@/app/enums/campaign-type";
import {
  VisibilityCampaign,
  SalesmanCampaign,
  ConsultantCampaign,
  SellerCampaign,
  CampaignUnion,
} from "@/app/interfaces/campaign/explore-campaign";
import { formatDate, getDaysLeft } from "@/utils/date";
import { exploreCampaignsStorage } from "@/utils/explore-campaigns-storage";

const getCampaignDisplayStatus = (
  campaign: CampaignUnion,
  isExpired: boolean
) => {
  // First check if the campaign is expired (overrides all other statuses)
  if (isExpired) {
    return {
      label: "Expired",
      className:
        "px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium",
    };
  }

  // For now, we'll check if the campaign has a campaignStatus property
  // If not available, we'll derive it from the current PromoterCampaignStatus
  // This is a placeholder - in a real app, the backend should provide the CampaignStatus
  const campaignWithStatus = campaign as CampaignUnion & {
    campaignStatus?: CampaignStatus;
  };
  const campaignStatus =
    campaignWithStatus.campaignStatus || CampaignStatus.ACTIVE;

  switch (campaignStatus) {
    case CampaignStatus.ACTIVE:
      return {
        label: "Active",
        className:
          "px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium",
      };
    case CampaignStatus.PAUSED:
      return {
        label: "Paused",
        className:
          "px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium",
      };
    case CampaignStatus.ENDED:
      return {
        label: "Ended",
        className:
          "px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium",
      };
    default:
      return {
        label: "Active",
        className:
          "px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium",
      };
  }
};

interface CampaignDetailsPageProps {
  params: Promise<{
    campaignId: string;
  }>;
}

const formatBudgetInfo = (campaign: CampaignUnion) => {
  switch (campaign.type) {
    case CampaignType.VISIBILITY:
      const visibilityCampaign = campaign as VisibilityCampaign;
      return `$${Number(visibilityCampaign.cpv).toFixed(2)} per 100 view`;
    case CampaignType.SALESMAN:
      const salesmanCampaign = campaign as SalesmanCampaign;
      return `${Number(salesmanCampaign.commissionPerSale * 100).toFixed(
        0
      )}% commission`;
    case CampaignType.CONSULTANT:
      const consultantCampaign = campaign as ConsultantCampaign;
      return `$${Number(
        consultantCampaign.minBudget
      ).toLocaleString()} - $${Number(
        consultantCampaign.maxBudget
      ).toLocaleString()}`;
    case CampaignType.SELLER:
      const sellerCampaign = campaign as SellerCampaign;
      return `$${Number(sellerCampaign.minBudget).toLocaleString()} - $${Number(
        sellerCampaign.maxBudget
      ).toLocaleString()}`;
    default:
      return "Contact for details";
  }
};

const getCampaignTypeIcon = (type: CampaignType) => {
  switch (type) {
    case CampaignType.VISIBILITY:
      return <EyeIcon className="h-6 w-6" />;
    case CampaignType.SALESMAN:
      return <CurrencyDollarIcon className="h-6 w-6" />;
    case CampaignType.CONSULTANT:
      return <AcademicCapIcon className="h-6 w-6" />;
    case CampaignType.SELLER:
      return <TagIcon className="h-6 w-6" />;
    default:
      return <DocumentTextIcon className="h-6 w-6" />;
  }
};

const getCampaignTypeColor = (type: CampaignType) => {
  switch (type) {
    case CampaignType.VISIBILITY:
      return "bg-blue-100 text-blue-800";
    case CampaignType.SALESMAN:
      return "bg-green-100 text-green-800";
    case CampaignType.CONSULTANT:
      return "bg-purple-100 text-purple-800";
    case CampaignType.SELLER:
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const renderCampaignSpecificInfo = (campaign: CampaignUnion) => {
  switch (campaign.type) {
    case CampaignType.VISIBILITY:
      const visibilityCampaign = campaign as VisibilityCampaign;
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <EyeIcon className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Target Views
                </p>{" "}
                <p className="text-2xl font-bold text-blue-900">
                  {Number(visibilityCampaign.maxViews).toLocaleString()}
                </p>
              </div>
            </div>
          </div>{" "}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Payment Per 100 Views
                </p>{" "}
                <p className="text-2xl font-bold text-green-900">
                  ${Number(visibilityCampaign.cpv).toFixed(2)}
                </p>
              </div>
            </div>
          </div>{" "}
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-purple-600 font-medium">
                  Campaign Budget
                </p>{" "}
                <p className="text-2xl font-bold text-purple-900">
                  $
                  {(
                    Number(visibilityCampaign.maxViews) *
                    Number(visibilityCampaign.cpv)
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    case CampaignType.SALESMAN:
      const salesmanCampaign = campaign as SalesmanCampaign;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Commission Rate
                </p>{" "}
                <p className="text-3xl font-bold text-green-900">
                  {Number(salesmanCampaign.commissionPerSale * 100).toFixed(0)}%
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Per successful sale</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <GlobeAltIcon className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Tracking Method
                </p>
                <p className="text-lg font-semibold text-blue-900">
                  {salesmanCampaign.trackSalesVia}
                </p>
              </div>
            </div>
            {salesmanCampaign.refLink && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Reference Link:</p>
                <p className="text-sm text-blue-600 truncate">
                  {salesmanCampaign.refLink}
                </p>
              </div>
            )}
          </div>
        </div>
      );

    case CampaignType.CONSULTANT:
      const consultantCampaign = campaign as ConsultantCampaign;
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">
                    Budget Range
                  </p>{" "}
                  <p className="text-lg font-bold text-purple-900">
                    ${Number(consultantCampaign.minBudget).toLocaleString()} - $
                    {Number(consultantCampaign.maxBudget).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <VideoCameraIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Meeting Plan
                  </p>
                  <p className="text-lg font-bold text-blue-900">
                    {consultantCampaign.meetingPlan}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <PresentationChartLineIcon className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Total Meetings
                  </p>{" "}
                  <p className="text-lg font-bold text-green-900">
                    {Number(consultantCampaign.meetingCount)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Required Expertise
            </h4>
            <p className="text-gray-700">
              {consultantCampaign.expertiseRequired}
            </p>
          </div>

          {consultantCampaign.expectedDeliverables &&
            consultantCampaign.expectedDeliverables.length > 0 && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">
                  Expected Deliverables
                </h4>{" "}
                <div className="flex flex-wrap gap-2">
                  {consultantCampaign.expectedDeliverables.map(
                    (deliverable: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {deliverable}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      );

    case CampaignType.SELLER:
      const sellerCampaign = campaign as SellerCampaign;
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <CurrencyDollarIcon className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-orange-600 font-medium">
                    Budget Range
                  </p>{" "}
                  <p className="text-2xl font-bold text-orange-900">
                    ${Number(sellerCampaign.minBudget).toLocaleString()} - $
                    {Number(sellerCampaign.maxBudget).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <UsersIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Min Followers
                  </p>{" "}
                  <p className="text-2xl font-bold text-blue-900">
                    {sellerCampaign.minFollowers
                      ? Number(sellerCampaign.minFollowers).toLocaleString()
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {sellerCampaign.needMeeting && (
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <VideoCameraIcon className="h-6 w-6 text-green-600" />
                <h4 className="text-lg font-semibold text-green-900">
                  Meeting Required
                </h4>
              </div>
              <p className="text-gray-700 mb-2">
                Meeting Plan:{" "}
                <span className="font-medium">
                  {sellerCampaign.meetingPlan}
                </span>
              </p>{" "}
              <p className="text-gray-700">
                Total Meetings:{" "}
                <span className="font-medium">
                  {Number(sellerCampaign.meetingCount)}
                </span>
              </p>
            </div>
          )}

          {sellerCampaign.deliverables &&
            sellerCampaign.deliverables.length > 0 && (
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-900 mb-3">
                  Required Deliverables
                </h4>{" "}
                <div className="flex flex-wrap gap-2">
                  {sellerCampaign.deliverables.map(
                    (deliverable: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium"
                      >
                        {deliverable}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      );

    default:
      return null;
  }
};

export default function CampaignDetailsPage({
  params,
}: CampaignDetailsPageProps) {
  const resolvedParams = use(params);
  const [campaign, setCampaign] = useState<CampaignUnion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get campaign from localStorage first
    const storedCampaign = exploreCampaignsStorage.getCampaignById(
      resolvedParams.campaignId
    );

    if (storedCampaign) {
      setCampaign(storedCampaign);
      setLoading(false);
    } else {
      // If not found in localStorage, redirect back to explore page
      // This could happen if user navigates directly to URL or cache expired
      setLoading(false);
    }
  }, [resolvedParams.campaignId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    notFound();
  }

  const daysLeft = getDaysLeft(campaign.deadline);
  const isExpired = daysLeft === 0;
  const statusInfo = getCampaignDisplayStatus(campaign, isExpired);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/explore"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${getCampaignTypeColor(
                    campaign.type
                  )}`}
                >
                  {getCampaignTypeIcon(campaign.type)}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {campaign.title}
                  </h1>
                  <p className="text-sm text-gray-600">Campaign Details</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getCampaignTypeColor(
                  campaign.type
                )}`}
              >
                {campaign.type}
              </span>
              <span className={statusInfo.className}>{statusInfo.label}</span>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Advertiser Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {campaign.advertiser.companyName}
                  </h2>
                  {campaign.advertiser.verified && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <StarIconSolid className="h-4 w-4 text-yellow-400" />{" "}
                    <span className="text-sm font-medium text-gray-900">
                      {Number(campaign.advertiser.rating).toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-600">
                      Company Rating
                    </span>
                  </div>{" "}
                  <div className="flex flex-wrap gap-2">
                    {campaign.advertiser.advertiserTypes?.map(
                      (type: string) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {type}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-2">
                  {campaign.advertiser.description}
                </p>
                {campaign.advertiser.website && (
                  <a
                    href={campaign.advertiser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-block"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Company Rating</p>
              <div className="flex items-center space-x-1">
                {" "}
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIconSolid
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.floor(Number(campaign.advertiser.rating))
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campaign Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-700 text-lg">
                    {campaign.description}
                  </p>
                </div>
              </div>

              {/* Campaign Specific Information */}
              {renderCampaignSpecificInfo(campaign)}
            </div>{" "}
            {/* Requirements */}
            {campaign.requirements && campaign.requirements.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Requirements
                </h3>{" "}
                <div className="space-y-3">
                  {campaign.requirements.map(
                    (requirement: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </div>
                    )
                  )}
                  {/* Add min followers requirement for visibility campaigns */}
                  {campaign.type === CampaignType.VISIBILITY &&
                    (campaign as VisibilityCampaign).minFollowers && (
                      <div className="flex items-center space-x-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">
                          Minimum{" "}
                          {(
                            campaign as VisibilityCampaign
                          ).minFollowers?.toLocaleString()}{" "}
                          followers required
                        </span>
                      </div>
                    )}
                </div>
              </div>
            )}
            {/* Target Audience & Platforms */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Campaign Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Target Audience
                  </h4>
                  <p className="text-gray-700">{campaign.targetAudience}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Preferred Platforms
                  </h4>{" "}
                  <div className="flex flex-wrap gap-2">
                    {campaign.preferredPlatforms?.map((platform: string) => (
                      <span
                        key={platform}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {platform}
                      </span>
                    )) || (
                      <span className="text-gray-500">
                        No platforms specified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Campaign Tags
              </h3>{" "}
              <div className="flex flex-wrap gap-2">
                {campaign.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatBudgetInfo(campaign)}
                </div>
                <p className="text-gray-600">Compensation</p>
              </div>
              <div className="space-y-4 mb-6">
                {" "}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      statusInfo.label === "Expired"
                        ? "text-red-600"
                        : statusInfo.label === "Active"
                        ? "text-green-600"
                        : statusInfo.label === "Paused"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {statusInfo.label}
                  </span>
                </div>{" "}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Posted:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(campaign.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Deadline:</span>
                  <span
                    className={`font-medium ${
                      isExpired ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {isExpired ? "Expired" : `${daysLeft} days left`}
                  </span>
                </div>
              </div>{" "}
              {statusInfo.label === "Active" && (
                <button
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  disabled={statusInfo.label !== "Active"}
                >
                  {campaign.isPublic ? (
                    <>
                      <DocumentTextIcon className="h-5 w-5" />
                      <span>Take Contract</span>
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-5 w-5" />
                      <span>Apply Now</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Campaign Timeline
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>{" "}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Campaign Created
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(campaign.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>{" "}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Campaign Started
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(campaign.startDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isExpired ? "bg-red-500" : "bg-yellow-500"
                    }`}
                  ></div>{" "}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Campaign Deadline
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(campaign.deadline)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Contact Support</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <DocumentTextIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">View Guidelines</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
