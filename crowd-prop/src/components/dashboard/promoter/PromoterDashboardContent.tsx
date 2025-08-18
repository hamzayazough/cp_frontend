"use client";

import Link from "next/link";
import Image from "next/image";
import { routes } from "@/lib/router";
import { usePromoterDashboard } from "@/hooks/usePromoterDashboard";
import PromoterDashboardTemplate from "./PromoterDashboardTemplate";
import StripeStatusCard from "./StripeStatusCard";
import { userService } from "@/services/user.service";
import { useStripeOnboarding } from "@/hooks/useStripeOnboarding";
import { CampaignType } from "@/app/enums/campaign-type";
import {
  formatWalletValue,
  meetsThreshold,
  amountNeededForThreshold,
} from "@/utils/wallet";
import {
  EyeIcon,
  CurrencyDollarIcon,
  RectangleStackIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { PromoterCampaignStatus } from "@/app/interfaces/promoter-campaign";

interface PromoterDashboardContentProps {
  userName?: string;
}

export default function PromoterDashboardContent({
  userName,
}: PromoterDashboardContentProps) {
  const {
    data: dashboardData,
    loading,
    error,
    refetch,
    requestPayout,
    useTemplate,
    setUseTemplate,
  } = usePromoterDashboard();

  const currentUser = userService.getCurrentUserSync();
  const isPromoter = currentUser?.role === "PROMOTER";

  // Get Stripe status for promoters
  const { accountData } = useStripeOnboarding();
  const canReceivePayouts = isPromoter && accountData?.payoutsEnabled;

  const handleRequestPayout = async () => {
    try {
      const result = await requestPayout();
      if (result.success) {
        alert("Payout request submitted successfully!");
      } else {
        alert(`Failed to request payout: ${result.message}`);
      }
    } catch (err) {
      alert(
        `Error requesting payout: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show template if explicitly using template mode
  if (useTemplate) {
    return <PromoterDashboardTemplate userName={userName} />;
  }

  if (error) {
    // If it's a 404 error (API not implemented), show the template
    if (error.includes("API endpoints are not yet implemented")) {
      return <PromoterDashboardTemplate userName={userName} />;
    }

    // For other errors, show the error message with option to use template
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading dashboard
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={refetch}
                  className="text-sm text-red-800 underline hover:text-red-900"
                >
                  Try again
                </button>
                <button
                  onClick={() => setUseTemplate(true)}
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  Use template view
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No dashboard data available</p>
      </div>
    );
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case PromoterCampaignStatus.ONGOING:
        return "bg-green-100 text-green-800";
      case PromoterCampaignStatus.AWAITING_REVIEW:
        return "bg-yellow-100 text-yellow-800";
      case PromoterCampaignStatus.COMPLETED:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case PromoterCampaignStatus.ONGOING:
        return <ClockIcon className="h-4 w-4" />;
      case PromoterCampaignStatus.AWAITING_REVIEW:
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case PromoterCampaignStatus.COMPLETED:
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {userName || "Promoter"}! 🎯
        </h1>
        <p className="text-blue-100 mb-4">
          You&apos;re doing great! Here&apos;s your performance overview.
        </p>
        <div className="flex space-x-4">
          <Link
            href={routes.dashboardExplore}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Explore Campaigns
          </Link>
          <Link
            href={routes.dashboardCampaigns}
            className="border border-white text-white px-4 py-2 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
          >
            My Campaigns
          </Link>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Earnings This Week
              </p>
              <p className="text-3xl font-bold text-gray-900">
                ${dashboardData.stats.earningsThisWeek}
              </p>
              <p
                className={`text-sm flex items-center mt-1 ${
                  dashboardData.stats.earningsPercentageChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {dashboardData.stats.earningsPercentageChange >= 0 ? "+" : ""}
                {dashboardData.stats.earningsPercentageChange}% from last week
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Views Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.stats.viewsToday}
              </p>
              <p
                className={`text-sm flex items-center mt-1 ${
                  dashboardData.stats.viewsPercentageChange >= 0
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {dashboardData.stats.viewsPercentageChange >= 0 ? "+" : ""}
                {dashboardData.stats.viewsPercentageChange}% from yesterday
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <EyeIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Sales This Week
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.stats.salesThisWeek}
              </p>
              <p
                className={`text-sm flex items-center mt-1 ${
                  dashboardData.stats.salesPercentageChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {dashboardData.stats.salesPercentageChange >= 0 ? "+" : ""}
                {dashboardData.stats.salesPercentageChange}% from last week
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Payment Status Card for Promoters */}
        {isPromoter ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Payment Status
                </p>
                <p
                  className={`text-lg font-bold ${
                    canReceivePayouts ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {canReceivePayouts ? "Ready" : "Setup Required"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {canReceivePayouts
                    ? "Payouts enabled"
                    : "Complete Stripe setup"}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  canReceivePayouts ? "bg-green-100" : "bg-orange-100"
                }`}
              >
                {canReceivePayouts ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                ) : (
                  <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Campaigns
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardData.stats.activeCampaigns}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {dashboardData.stats.pendingReviewCampaigns} pending review
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <RectangleStackIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Campaigns Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Active Campaigns
            </h2>
            <Link
              href={routes.dashboardCampaigns}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {dashboardData.activeCampaigns.length > 0 ? (
              dashboardData.activeCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start space-x-4 mb-3">
                    {/* Advertiser Profile */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                      {campaign.advertiser.profileUrl ? (
                        <Image
                          src={campaign.advertiser.profileUrl}
                          alt={campaign.advertiser.companyName}
                          fill
                          className="object-cover"
                          sizes="64px"
                          unoptimized
                          onError={(e) => {
                            // Hide the image and show fallback
                            e.currentTarget.style.display = "none";
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.classList.add(
                                "flex",
                                "items-center",
                                "justify-center",
                                "bg-gray-200"
                              );
                              parent.innerHTML = `<span class="text-gray-600 font-medium text-xl">${campaign.advertiser.companyName
                                .charAt(0)
                                .toUpperCase()}</span>`;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-600 font-medium text-xl">
                            {campaign.advertiser.companyName
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {campaign.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {campaign.advertiser.companyName}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              campaign.status
                            )}`}
                          >
                            {getStatusIcon(campaign.status)}
                            <span className="ml-1">
                              {campaign.status.replace("_", " ")}
                            </span>
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {campaign.type}
                          </span>
                          {!campaign.isPublic && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              Private
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">
                        {campaign.type === CampaignType.VISIBILITY
                          ? "Views Generated"
                          : "Progress"}
                      </p>
                      <p className="font-semibold text-gray-600">
                        {campaign.type === CampaignType.VISIBILITY
                          ? campaign.views.toLocaleString()
                          : campaign.type === CampaignType.CONSULTANT &&
                            campaign.meetingCount
                          ? `${campaign.meetingDone ? 1 : 0}/${
                              campaign.meetingCount
                            } meetings`
                          : campaign.type === CampaignType.SELLER &&
                            campaign.meetingCount
                          ? `${campaign.meetingDone ? 1 : 0}/${
                              campaign.meetingCount
                            } meetings`
                          : "In Progress"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Earnings</p>
                      <p className="font-semibold text-green-600">
                        ${campaign.earnings}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        {campaign.type === CampaignType.VISIBILITY &&
                        campaign.cpv
                          ? "CPV Rate"
                          : campaign.type === CampaignType.SALESMAN &&
                            campaign.commissionPerSale
                          ? "Commission"
                          : campaign.type === CampaignType.CONSULTANT &&
                            campaign.minBudget
                          ? "Budget Range"
                          : "Deadline"}
                      </p>
                      <p className="font-semibold text-gray-600">
                        {campaign.type === CampaignType.VISIBILITY &&
                        campaign.cpv
                          ? `$${campaign.cpv}`
                          : campaign.type === CampaignType.SALESMAN &&
                            campaign.commissionPerSale
                          ? `${campaign.commissionPerSale}%`
                          : campaign.type === CampaignType.CONSULTANT &&
                            campaign.minBudget &&
                            campaign.maxBudget
                          ? `$${campaign.minBudget}-$${campaign.maxBudget}`
                          : new Date(campaign.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Additional Campaign Details */}
                  {campaign.requirements &&
                    campaign.requirements.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">
                          Requirements
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {campaign.requirements
                            .slice(0, 3)
                            .map((req, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                              >
                                {req}
                              </span>
                            ))}
                          {campaign.requirements.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                              +{campaign.requirements.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Meeting Plan for Consultant/Seller */}
                  {(campaign.type === CampaignType.CONSULTANT ||
                    campaign.type === CampaignType.SELLER) &&
                    campaign.meetingPlan && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">
                          Meeting Plan
                        </p>
                        <p className="text-sm text-gray-700 truncate">
                          {campaign.meetingPlan}
                        </p>
                      </div>
                    )}

                  <div className="flex space-x-2">
                    <Link
                      href={routes.dashboardCampaignDetails(campaign.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      View Stats
                    </Link>
                    <Link
                      href={routes.messageThread(campaign.id)}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-200 transition-colors"
                    >
                      Send Message
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <RectangleStackIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">
                  No active campaigns
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  You don&apos;t have any active campaigns yet. Start by
                  exploring available campaigns.
                </p>
                <Link
                  href={routes.dashboardExplore}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Explore Campaigns
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Suggested Campaigns */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Suggested Campaigns
              </h2>
              <Link
                href={routes.dashboardExplore}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                Explore More
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.suggestedCampaigns.length > 0 ? (
                dashboardData.suggestedCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3">
                          {/* Advertiser Profile */}
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                            {campaign.advertiser.profileUrl ? (
                              <Image
                                src={campaign.advertiser.profileUrl}
                                alt={campaign.advertiser.companyName}
                                fill
                                className="object-cover"
                                sizes="48px"
                                unoptimized
                                onError={(e) => {
                                  // Hide the image and show fallback
                                  e.currentTarget.style.display = "none";
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    parent.classList.add(
                                      "flex",
                                      "items-center",
                                      "justify-center",
                                      "bg-gray-200"
                                    );
                                    parent.innerHTML = `<span class="text-gray-600 font-medium text-lg">${campaign.advertiser.companyName
                                      .charAt(0)
                                      .toUpperCase()}</span>`;
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <span className="text-gray-600 font-medium text-lg">
                                  {campaign.advertiser.companyName
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {campaign.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {campaign.advertiser.companyName}
                            </p>
                            {campaign.requirements &&
                              campaign.requirements.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {campaign.requirements
                                    .slice(0, 3)
                                    .map((requirement, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                                      >
                                        {requirement}
                                      </span>
                                    ))}
                                  {campaign.requirements.length > 3 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                      +{campaign.requirements.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {campaign.type}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            campaign.isPublic
                              ? "bg-green-100 text-green-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {campaign.isPublic ? "Public" : "Private"}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      {/* Campaign Type Specific Information */}
                      {campaign.type === CampaignType.VISIBILITY && (
                        <div className="space-y-1">
                          {campaign.cpv && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">
                                ${campaign.cpv}
                              </span>{" "}
                              per view
                              {campaign.maxViews && (
                                <span>
                                  {" "}
                                  •{" "}
                                  <span className="font-medium">
                                    {campaign.maxViews.toLocaleString()}
                                  </span>{" "}
                                  max views
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      )}

                      {campaign.type === CampaignType.SALESMAN && (
                        <div className="space-y-1">
                          {campaign.commissionPerSale && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">
                                {campaign.commissionPerSale}%
                              </span>{" "}
                              commission per sale
                            </p>
                          )}
                        </div>
                      )}

                      {(campaign.type === CampaignType.CONSULTANT ||
                        campaign.type === CampaignType.SELLER) && (
                        <div className="space-y-1">
                          {(campaign.minBudget || campaign.maxBudget) && (
                            <p className="text-sm text-gray-600">
                              Budget range:{" "}
                              <span className="font-medium">
                                {campaign.minBudget
                                  ? `$${campaign.minBudget}`
                                  : "N/A"}
                                {campaign.maxBudget &&
                                  ` - $${campaign.maxBudget}`}
                              </span>
                            </p>
                          )}
                          {campaign.meetingCount && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">
                                {campaign.meetingCount}
                              </span>{" "}
                              meeting{campaign.meetingCount > 1 ? "s" : ""}{" "}
                              required
                            </p>
                          )}
                          {campaign.meetingPlan && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Plan:</span>{" "}
                              <span className="truncate">
                                {campaign.meetingPlan}
                              </span>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Campaign Deadline and Creation Date */}
                      <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                        <span>
                          <span className="font-medium">Deadline:</span>{" "}
                          {new Date(campaign.deadline).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={routes.dashboardExploreDetails(campaign.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      View Campaign
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-sm font-medium text-gray-900">
                    No suggested campaigns
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    We&apos;ll recommend campaigns based on your interests and
                    performance.
                  </p>
                  <Link
                    href={routes.dashboardExplore}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Explore All Campaigns
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wallet & Messages */}
        <div className="space-y-8">
          {/* Stripe Connect Status - Only for Promoters */}
          {isPromoter && <StripeStatusCard />}

          {/* Wallet Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Wallet Overview
                </h2>
                <Link
                  href={routes.dashboardEarnings}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              {/* Stripe Setup Warning for Promoters */}
              {isPromoter && !canReceivePayouts && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Payment Setup Required
                      </p>
                      <p className="text-sm text-yellow-700">
                        Complete your Stripe Connect setup above to enable
                        payouts and receive earnings.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Available for Withdrawal
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      $
                      {formatWalletValue(
                        dashboardData.wallet.viewEarnings.currentBalance
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      View earnings (Monthly payout:{" "}
                      {dashboardData.wallet.viewEarnings.nextPayoutDate
                        ? new Date(
                            dashboardData.wallet.viewEarnings.nextPayoutDate
                          ).toLocaleDateString()
                        : "N/A"}
                      )
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Pending Balance
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      $
                      {formatWalletValue(
                        dashboardData.wallet.viewEarnings.pendingBalance
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Need $
                      {formatWalletValue(
                        amountNeededForThreshold(
                          dashboardData.wallet.viewEarnings.pendingBalance,
                          dashboardData.wallet.viewEarnings.minimumThreshold
                        )
                      )}{" "}
                      more to unlock
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Lifetime Earnings
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    $
                    {formatWalletValue(
                      dashboardData.wallet.totalLifetimeEarnings
                    )}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">View Earnings:</span> $
                      {formatWalletValue(
                        dashboardData.wallet.viewEarnings.totalEarned
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Direct Earnings:</span> $
                      {formatWalletValue(
                        dashboardData.wallet.directEarnings.totalEarned
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRequestPayout}
                  disabled={
                    !meetsThreshold(
                      dashboardData.wallet.viewEarnings.currentBalance,
                      dashboardData.wallet.viewEarnings.minimumThreshold
                    ) ||
                    (isPromoter && !canReceivePayouts)
                  }
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    meetsThreshold(
                      dashboardData.wallet.viewEarnings.currentBalance,
                      dashboardData.wallet.viewEarnings.minimumThreshold
                    ) &&
                    (!isPromoter || canReceivePayouts)
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {!isPromoter || canReceivePayouts
                    ? meetsThreshold(
                        dashboardData.wallet.viewEarnings.currentBalance,
                        dashboardData.wallet.viewEarnings.minimumThreshold
                      )
                      ? "Request Monthly Payout"
                      : `Need $${formatWalletValue(
                          amountNeededForThreshold(
                            dashboardData.wallet.viewEarnings.currentBalance,
                            dashboardData.wallet.viewEarnings.minimumThreshold
                          )
                        )} more`
                    : "Complete Stripe Setup to Enable Payouts"}
                </button>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  Recent Transactions
                </h3>
                <div className="space-y-3">
                  {dashboardData.recentTransactions.length > 0 ? (
                    dashboardData.recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.campaign}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                transaction.paymentMethod === "WALLET"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {transaction.paymentMethod === "WALLET"
                                ? "Wallet"
                                : "Bank Transfer"}
                            </span>
                            <span>•</span>
                            <span className="capitalize">
                              {transaction.type.replace("_", " ").toLowerCase()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            +${formatWalletValue(transaction.amount)}
                          </p>
                          <p
                            className={`text-xs ${
                              transaction.status === "COMPLETED"
                                ? "text-green-600"
                                : transaction.status === "PENDING"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <CurrencyDollarIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        No recent transactions
                      </p>
                      <p className="text-xs text-gray-400">
                        Your earnings will appear here once you start promoting
                        campaigns
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
