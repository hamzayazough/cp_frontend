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
  ChatBubbleLeftRightIcon,
  CloudArrowUpIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  ConsultantCampaignDetails,
  SellerCampaignDetails,
} from "@/app/interfaces/campaign/promoter-campaign-details";
import { CampaignType } from "@/app/enums/campaign-type";
import { PromoterCampaignStatus } from "@/app/interfaces/promoter-campaign";
import {
  statusOptions,
  typeOptions,
  getStatusColor,
  getStatusIcon,
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
      <div className="space-y-3">
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">No campaigns found</h3>
            <p className="text-sm text-gray-600 mb-4">Try adjusting your search or filters</p>
            <Link
              href={routes.dashboardExplore}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              Explore Campaigns
            </Link>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={routes.dashboardCampaignDetails(campaign.id)}
              className="block group"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {campaign.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {getStatusIcon(campaign.status)}
                          <span className="ml-1">{campaign.status.replace("_", " ")}</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(campaign.type)}`}>
                          {campaign.type}
                        </span>
                      </div>

                      {/* Advertiser Info */}
                      <div className="flex items-center space-x-2 mb-2">
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
                            <h4 className="text-xs font-semibold text-gray-900 truncate">
                              {campaign.advertiser.companyName}
                            </h4>
                            {campaign.advertiser.verified && (
                              <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircleIcon className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="flex items-center">
                              <svg className="w-2 h-2 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-xs font-medium text-gray-700 ml-1">
                                {Number(campaign.advertiser.rating).toFixed(1)}
                              </span>
                            </div>
                            {campaign.advertiser.advertiserTypes?.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400">•</span>
                                <span className="text-xs text-gray-500">
                                  {campaign.advertiser.advertiserTypes[0]}
                                  {campaign.advertiser.advertiserTypes.length > 1 && ` +${campaign.advertiser.advertiserTypes.length - 1}`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-2 line-clamp-2">{campaign.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {campaign.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                        {campaign.tags.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{campaign.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-50 group-hover:bg-blue-100 rounded-md transition-colors">
                      <ArrowTopRightOnSquareIcon className="h-3 w-3 text-blue-600" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Total Earned</p>
                      <p className="text-sm font-semibold text-green-600">${campaign.earnings.totalEarned}</p>
                    </div>

                    {campaign.type === CampaignType.VISIBILITY && (
                      <>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Views Generated</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {(campaign.earnings.viewsGenerated || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Rate</p>
                          <p className="text-sm font-semibold text-blue-600">{getEarningsInfo(campaign)}</p>
                        </div>
                      </>
                    )}

                    {(campaign.type === CampaignType.CONSULTANT || campaign.type === CampaignType.SELLER) && (
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Budget Range</p>
                        <p className="text-sm font-semibold text-gray-900">
                          ${(campaign.campaign as ConsultantCampaignDetails | SellerCampaignDetails).minBudget} - $
                          {(campaign.campaign as ConsultantCampaignDetails | SellerCampaignDetails).maxBudget}
                        </p>
                      </div>
                    )}

                    {campaign.type === CampaignType.CONSULTANT && (
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Meetings Left</p>
                        <p className="text-sm font-semibold text-blue-600">
                          {(() => {
                            const consultantDetails = campaign.campaign as ConsultantCampaignDetails;
                            const meetingsDone = campaign.meetingDone ? 1 : 0;
                            const meetingsLeft = Math.max(0, consultantDetails.meetingCount - meetingsDone);
                            return meetingsLeft;
                          })()}
                        </p>
                      </div>
                    )}

                    {campaign.type === CampaignType.SELLER && (campaign.campaign as SellerCampaignDetails).needMeeting && (
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Meetings Left</p>
                        <p className="text-sm font-semibold text-blue-600">
                          {(() => {
                            const sellerDetails = campaign.campaign as SellerCampaignDetails;
                            const meetingsDone = campaign.meetingDone ? 1 : 0;
                            const meetingsLeft = Math.max(0, sellerDetails.meetingCount - meetingsDone);
                            return meetingsLeft;
                          })()}
                        </p>
                      </div>
                    )}

                    {campaign.type === CampaignType.SALESMAN && (
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Commission</p>
                        <p className="text-sm font-semibold text-blue-600">{getEarningsInfo(campaign)}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Deadline</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {new Date(campaign.campaign.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Deliverables - Simplified */}
                  {(campaign.type === CampaignType.CONSULTANT || campaign.type === CampaignType.SELLER) && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">Deliverables:</p>
                      <div className="space-y-1">
                        {(() => {
                          const details = campaign.campaign as ConsultantCampaignDetails | SellerCampaignDetails;
                          const deliverables = campaign.type === CampaignType.CONSULTANT
                            ? (details as ConsultantCampaignDetails).expectedDeliverables || []
                            : (details as SellerCampaignDetails).deliverables || [];

                          const visibleDeliverables = deliverables.slice(0, 2);
                          const hasMore = deliverables.length > 2;

                          return (
                            <>
                              {visibleDeliverables.map((deliverable, index) => (
                                <div key={deliverable.id || index} className="flex items-center justify-between bg-gray-50 rounded-md p-2 border border-gray-200">
                                  <div className="flex items-center space-x-2">
                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                      {deliverable.deliverable.replace(/_/g, " ")}
                                    </span>
                                    <div className="flex items-center space-x-1 text-xs">
                                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${
                                        deliverable.isSubmitted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                      }`}>
                                        {deliverable.isSubmitted ? (
                                          <>
                                            <CloudArrowUpIcon className="h-2 w-2" />
                                            <span>Submitted</span>
                                          </>
                                        ) : (
                                          <>
                                            <ClockIcon className="h-2 w-2" />
                                            <span>Pending</span>
                                          </>
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {deliverable.promoterWork?.length || 0} work{(deliverable.promoterWork?.length || 0) !== 1 ? "s" : ""}
                                  </div>
                                </div>
                              ))}
                              {hasMore && (
                                <div className="flex items-center justify-center bg-gray-50 rounded-md p-2 border border-gray-200 border-dashed">
                                  <span className="text-xs text-gray-500 font-medium">
                                    +{deliverables.length - 2} more deliverable{deliverables.length - 2 > 1 ? "s" : ""}
                                  </span>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                    {campaign.status === "ONGOING" && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle message action
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-md border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                      >
                        <ChatBubbleLeftRightIcon className="h-3 w-3" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
