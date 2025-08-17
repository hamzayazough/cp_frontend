"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/lib/router";
import {
  CheckCircleIcon,
  EyeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  ConsultantCampaignDetails,
  SellerCampaignDetails,
} from "@/app/interfaces/campaign/promoter-campaign-details";
import { CampaignType } from "@/app/enums/campaign-type";
import { SocialPlatform } from "@/app/enums/social-platform";
import { PromoterCampaignStatus } from "@/app/interfaces/promoter-campaign";
import {
  statusOptions,
  typeOptions,
  getTypeColor,
  getEarningsInfo,
} from "@/app/const/promoter-campaign-content-const";
import { usePromoterCampaigns } from "@/hooks/usePromoterCampaigns";
import { GetPromoterCampaignsRequest } from "@/app/interfaces/campaign/promoter-campaigns-request";
import { formatCurrency } from "@/utils/currency";

export default function PromoterCampaignsContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<string>>(new Set());
  const [expandedDeliverables, setExpandedDeliverables] = useState<Set<string>>(new Set());

  // Use the hook to manage campaigns data
  const { campaigns, loading, error, summary, fetchCampaigns } =
    usePromoterCampaigns();
  // Update filters when they change
  useEffect(() => {
    const params: GetPromoterCampaignsRequest = {};

    if (searchTerm) {
      params.searchTerm = searchTerm;
    }

    if (statusFilter !== "ALL") {
      params.status = [statusFilter as PromoterCampaignStatus];
    }

    if (typeFilter !== "ALL") {
      params.type = [typeFilter as CampaignType];
    }

    fetchCampaigns(params);
  }, [searchTerm, statusFilter, typeFilter, fetchCampaigns]);

  const togglePlatformsExpansion = (campaignId: string) => {
    setExpandedPlatforms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  const toggleDeliverablesExpansion = (campaignId: string) => {
    setExpandedDeliverables(prev => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading campaigns: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Campaigns</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your campaigns</p>
        </div>
        <div className="mt-2 sm:mt-0">
          <Link
            href={routes.dashboardExplore}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            Explore Campaigns
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-1.5 bg-green-100 rounded-md">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Active</p>
              <p className="text-lg font-bold text-gray-900">
                {summary.totalActive}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-100 rounded-md">
              <CheckCircleIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Completed</p>
              <p className="text-lg font-bold text-gray-900">
                {summary.totalCompleted}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-100 rounded-md">
              <EyeIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total Views</p>
              <p className="text-lg font-bold text-gray-900">
                {summary.totalViews.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-1.5 bg-green-100 rounded-md">
              <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">
                Total Earnings
              </p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(summary.totalEarnings)}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0 lg:space-x-3">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <FunnelIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-7 pr-6 py-1.5 text-sm border border-gray-400 text-gray-800 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-400 text-gray-800 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Campaigns List */}
      <div className="space-y-6">
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <Link
              href={routes.dashboardExplore}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Campaigns
            </Link>
          </div>
        ) : (
          campaigns.map((campaign) => {
            // Get campaign type colors and icons
            const getCampaignTypeColor = (type: string) => {
              switch (type) {
                case "VISIBILITY":
                  return "bg-blue-500";
                case "CONSULTANT":
                  return "bg-purple-500";
                case "SALESMAN":
                  return "bg-orange-500";
                case "SELLER":
                  return "bg-green-500";
                default:
                  return "bg-gray-500";
              }
            };

            const getCampaignIcon = (type: string) => {
              switch (type) {
                case "VISIBILITY":
                  return EyeIcon;
                case "CONSULTANT":
                  return CheckCircleIcon;
                case "SALESMAN":
                  return CurrencyDollarIcon;
                case "SELLER":
                  return CheckCircleIcon;
                default:
                  return EyeIcon;
              }
            };

            const Icon = getCampaignIcon(campaign.type);
            const isAwaitingReview = campaign.status === "AWAITING_REVIEW";

            return (
              <div
                key={campaign.id}
                className={`group rounded-lg border transition-all duration-300 overflow-hidden ${
                  isAwaitingReview 
                    ? "bg-gray-50 border-gray-300 cursor-not-allowed" 
                    : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer"
                }`}
                onClick={isAwaitingReview ? undefined : () => window.location.href = routes.dashboardCampaignDetails(campaign.id)}
              >
                {/* Header Section */}
                <div className="relative">
                  {/* Status Banner */}
                  <div className={`h-1 w-full ${getCampaignTypeColor(campaign.type)}`} />
                  
                  {/* Awaiting Review Overlay */}
                  {isAwaitingReview && (
                    <div className="absolute top-2 left-4 right-4 z-10">
                      <div className="bg-orange-100 border border-orange-300 rounded-lg p-2 flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4 text-orange-600 flex-shrink-0" />
                        <span className="text-xs font-medium text-orange-800">
                          Awaiting Advertiser Review
                        </span>
                      </div>
                    </div>
                  )}
                  <div className={`p-4 ${isAwaitingReview ? "pt-16" : ""}`}>
                    {/* Title Row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2 flex-1">
                        <div className={`p-1.5 rounded-lg ${
                          isAwaitingReview
                            ? "bg-gray-200"
                            : campaign.type === "VISIBILITY" ? "bg-gradient-to-br from-blue-50 to-blue-100" :
                            campaign.type === "CONSULTANT" ? "bg-gradient-to-br from-purple-50 to-purple-100" :
                            campaign.type === "SALESMAN" ? "bg-gradient-to-br from-orange-50 to-orange-100" :
                            campaign.type === "SELLER" ? "bg-gradient-to-br from-green-50 to-green-100" :
                            "bg-gradient-to-br from-gray-50 to-gray-100"
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            isAwaitingReview
                              ? "text-gray-500"
                              : campaign.type === "VISIBILITY" ? "text-blue-600" :
                              campaign.type === "CONSULTANT" ? "text-purple-600" :
                              campaign.type === "SALESMAN" ? "text-orange-600" :
                              campaign.type === "SELLER" ? "text-green-600" :
                              "text-gray-600"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-base font-bold mb-0.5 truncate ${
                            isAwaitingReview ? "text-gray-500" : "text-gray-900"
                          }`}>
                            {campaign.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              isAwaitingReview 
                                ? "bg-gray-200 text-gray-600" 
                                : getTypeColor(campaign.type)
                            }`}>
                              {campaign.type}
                            </span>
                            <div className={`flex items-center text-xs ${
                              isAwaitingReview ? "text-gray-400" : "text-gray-500"
                            }`}>
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              <span>Due {new Date(campaign.campaign.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <ArrowTopRightOnSquareIcon className={`h-4 w-4 transition-colors ${
                          isAwaitingReview 
                            ? "text-gray-300" 
                            : "text-gray-400 group-hover:text-blue-600"
                        }`} />
                      </div>
                    </div>

                    {/* Advertiser Info */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {campaign.advertiser.profileUrl ? (
                          <Image
                            src={campaign.advertiser.profileUrl}
                            alt={campaign.advertiser.companyName}
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {campaign.advertiser.companyName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <span className={`text-sm font-medium truncate ${
                            isAwaitingReview ? "text-gray-500" : "text-gray-700"
                          }`}>
                            {campaign.advertiser.companyName}
                          </span>
                          {campaign.advertiser.verified && (
                            <CheckCircleIcon className={`w-4 h-4 flex-shrink-0 ${
                              isAwaitingReview ? "text-gray-400" : "text-blue-500"
                            }`} />
                          )}
                        </div>
                        <div className="flex items-center">
                          <svg className={`w-3 h-3 fill-current ${
                            isAwaitingReview ? "text-gray-400" : "text-yellow-400"
                          }`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className={`text-xs font-medium ml-1 ${
                            isAwaitingReview ? "text-gray-500" : "text-gray-600"
                          }`}>
                            {Number(campaign.advertiser.rating).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className={`grid gap-3 ${isAwaitingReview ? "grid-cols-1" : "grid-cols-2"}`}>
                      {/* Earnings - only show when not awaiting review */}
                      {!isAwaitingReview && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-3 border border-green-200">
                          <div className="flex items-center space-x-1.5 mb-0.5">
                            <div className="p-1 bg-green-200 rounded-md">
                              <CurrencyDollarIcon className="h-3 w-3 text-green-600" />
                            </div>
                            <span className="text-xs font-medium text-green-700">Earned</span>
                          </div>
                          <p className="text-sm font-bold text-green-900">
                            ${campaign.earnings.totalEarned}
                          </p>
                        </div>
                      )}

                      {/* Type-specific metric */}
                      {campaign.type === CampaignType.VISIBILITY ? (
                        <div className={`rounded-lg p-3 border ${
                          isAwaitingReview 
                            ? "bg-gray-100 border-gray-300" 
                            : "bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200"
                        }`}>
                          <div className="flex items-center space-x-1.5 mb-0.5">
                            <div className={`p-1 rounded-md ${
                              isAwaitingReview ? "bg-gray-300" : "bg-purple-200"
                            }`}>
                              <EyeIcon className={`h-3 w-3 ${
                                isAwaitingReview ? "text-gray-500" : "text-purple-600"
                              }`} />
                            </div>
                            <span className={`text-xs font-medium ${
                              isAwaitingReview ? "text-gray-500" : "text-purple-700"
                            }`}>Views Generated</span>
                          </div>
                          <p className={`text-sm font-bold ${
                            isAwaitingReview ? "text-gray-600" : "text-purple-900"
                          }`}>
                            {(campaign.earnings.viewsGenerated || 0).toLocaleString()}
                          </p>
                        </div>
                      ) : campaign.type === CampaignType.CONSULTANT ? (
                        <div className={`rounded-lg p-3 border ${
                          isAwaitingReview 
                            ? "bg-gray-100 border-gray-300" 
                            : "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200"
                        }`}>
                          <div className="flex items-center space-x-1.5 mb-0.5">
                            <div className={`p-1 rounded-md ${
                              isAwaitingReview ? "bg-gray-300" : "bg-blue-200"
                            }`}>
                              <CheckCircleIcon className={`h-3 w-3 ${
                                isAwaitingReview ? "text-gray-500" : "text-blue-600"
                              }`} />
                            </div>
                            <span className={`text-xs font-medium ${
                              isAwaitingReview ? "text-gray-500" : "text-blue-700"
                            }`}>Meetings Left</span>
                          </div>
                          <p className={`text-sm font-bold ${
                            isAwaitingReview ? "text-gray-600" : "text-blue-900"
                          }`}>
                            {(() => {
                              const consultantDetails = campaign.campaign as ConsultantCampaignDetails;
                              const meetingsDone = campaign.meetingDone ? 1 : 0;
                              const meetingsLeft = Math.max(0, consultantDetails.meetingCount - meetingsDone);
                              return meetingsLeft;
                            })()}
                          </p>
                        </div>
                      ) : campaign.type === CampaignType.SELLER ? (
                        <div className={`rounded-lg p-3 border ${
                          isAwaitingReview 
                            ? "bg-gray-100 border-gray-300" 
                            : "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200"
                        }`}>
                          <div className="flex items-center space-x-1.5 mb-0.5">
                            <div className={`p-1 rounded-md ${
                              isAwaitingReview ? "bg-gray-300" : "bg-blue-200"
                            }`}>
                              <CurrencyDollarIcon className={`h-3 w-3 ${
                                isAwaitingReview ? "text-gray-500" : "text-blue-600"
                              }`} />
                            </div>
                            <span className={`text-xs font-medium ${
                              isAwaitingReview ? "text-gray-500" : "text-blue-700"
                            }`}>Budget Range</span>
                          </div>
                          <p className={`text-sm font-bold ${
                            isAwaitingReview ? "text-gray-600" : "text-blue-900"
                          }`}>
                            ${(campaign.campaign as SellerCampaignDetails).minBudget}-${(campaign.campaign as SellerCampaignDetails).maxBudget}
                          </p>
                        </div>
                      ) : (
                        <div className={`rounded-lg p-3 border ${
                          isAwaitingReview 
                            ? "bg-gray-100 border-gray-300" 
                            : "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
                        }`}>
                          <div className="flex items-center space-x-1.5 mb-0.5">
                            <div className={`p-1 rounded-md ${
                              isAwaitingReview ? "bg-gray-300" : "bg-orange-200"
                            }`}>
                              <CurrencyDollarIcon className={`h-3 w-3 ${
                                isAwaitingReview ? "text-gray-500" : "text-orange-600"
                              }`} />
                            </div>
                            <span className={`text-xs font-medium ${
                              isAwaitingReview ? "text-gray-500" : "text-orange-700"
                            }`}>Commission</span>
                          </div>
                          <p className={`text-sm font-bold ${
                            isAwaitingReview ? "text-gray-600" : "text-orange-900"
                          }`}>
                            {getEarningsInfo(campaign)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className={`border-t px-4 py-3 space-y-3 ${
                    isAwaitingReview 
                      ? "border-gray-300 bg-gray-100" 
                      : "border-gray-100 bg-gray-50"
                  }`}>
                    {/* Preferred Platforms for VISIBILITY */}
                    {campaign.type === CampaignType.VISIBILITY && (() => {
                      const preferredPlatforms = campaign.campaign.preferredPlatforms;
                      
                      if (preferredPlatforms && preferredPlatforms.length > 0) {
                        const formatPlatformName = (platform: SocialPlatform): string => {
                          switch (platform) {
                            case SocialPlatform.TIKTOK:
                              return 'TikTok';
                            case SocialPlatform.INSTAGRAM:
                              return 'Instagram';
                            case SocialPlatform.SNAPCHAT:
                              return 'Snapchat';
                            case SocialPlatform.YOUTUBE:
                              return 'YouTube';
                            case SocialPlatform.TWITTER:
                              return 'Twitter';
                            case SocialPlatform.FACEBOOK:
                              return 'Facebook';
                            case SocialPlatform.LINKEDIN:
                              return 'LinkedIn';
                            case SocialPlatform.OTHER:
                              return 'Other';
                            default:
                              return platform;
                          }
                        };

                        const isExpanded = expandedPlatforms.has(campaign.id);
                        const displayPlatforms = isExpanded ? preferredPlatforms : preferredPlatforms.slice(0, 3);

                        return (
                          <div>
                            <h4 className={`text-xs font-medium mb-1 ${
                              isAwaitingReview ? "text-gray-500" : "text-gray-700"
                            }`}>Preferred Platforms</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {displayPlatforms.map((platform: SocialPlatform, index: number) => (
                                <span
                                  key={index}
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                    isAwaitingReview 
                                      ? "bg-gray-200 text-gray-600 border-gray-300"
                                      : "bg-blue-100 text-blue-800 border-blue-200"
                                  }`}
                                >
                                  {formatPlatformName(platform)}
                                </span>
                              ))}
                              {preferredPlatforms.length > 3 && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    togglePlatformsExpansion(campaign.id);
                                  }}
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-colors ${
                                    isAwaitingReview 
                                      ? "bg-gray-200 text-gray-600 border-gray-300"
                                      : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                                  }`}
                                >
                                  {isExpanded ? 'show less' : `+${preferredPlatforms.length - 3} more`}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Deliverables for CONSULTANT and SELLER */}
                    {(campaign.type === CampaignType.CONSULTANT || campaign.type === CampaignType.SELLER) && (
                      <div>
                        <h4 className={`text-xs font-medium mb-1 ${
                          isAwaitingReview ? "text-gray-500" : "text-gray-700"
                        }`}>Deliverables</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {(() => {
                            const details = campaign.campaign as ConsultantCampaignDetails | SellerCampaignDetails;
                            const deliverables = campaign.type === CampaignType.CONSULTANT
                              ? (details as ConsultantCampaignDetails).expectedDeliverables || []
                              : (details as SellerCampaignDetails).deliverables || [];

                            const isExpanded = expandedDeliverables.has(campaign.id);
                            const displayDeliverables = isExpanded ? deliverables : deliverables.slice(0, 3);

                            return (
                              <>
                                {displayDeliverables.map((deliverable, index) => (
                                  <div
                                    key={deliverable.id || index}
                                    className={`flex items-center space-x-1.5 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                                      isAwaitingReview
                                        ? "bg-gray-200 text-gray-600 border border-gray-300"
                                        : deliverable.isSubmitted
                                        ? "bg-green-100 text-green-800 border border-green-200"
                                        : "bg-orange-100 text-orange-800 border border-orange-200"
                                    }`}
                                  >
                                    <span>{deliverable.deliverable.replace(/_/g, " ")}</span>
                                    {deliverable.isSubmitted ? (
                                      <CheckCircleIcon className="h-3 w-3" />
                                    ) : (
                                      <ClockIcon className="h-3 w-3" />
                                    )}
                                  </div>
                                ))}
                                {deliverables.length > 3 && (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleDeliverablesExpansion(campaign.id);
                                    }}
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-colors ${
                                      isAwaitingReview 
                                        ? "bg-gray-200 text-gray-600 border-gray-300"
                                        : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                                    }`}
                                  >
                                    {isExpanded ? 'show less' : `+${deliverables.length - 3} more`}
                                  </button>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className={`flex items-center justify-between pt-1.5 border-t ${
                      isAwaitingReview ? "border-gray-300" : "border-gray-200"
                    }`}>
                      <span className={`text-xs ${
                        isAwaitingReview ? "text-gray-500" : "text-gray-500"
                      }`}>
                        Rate: {getEarningsInfo(campaign)}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        {campaign.status === "ONGOING" && (
                          <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                            Active
                          </span>
                        )}
                        {isAwaitingReview && (
                          <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                            Under Review
                          </span>
                        )}
                        {campaign.earnings.totalEarned > 0 && (
                          <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                            Earning
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
