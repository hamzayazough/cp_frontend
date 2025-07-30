"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/lib/router";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
  ChatBubbleLeftRightIcon,
  DocumentArrowUpIcon,
  XCircleIcon,
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
          <p className="text-gray-600 mt-2">
            Manage your active and completed campaigns
          </p>
        </div>{" "}
        <div className="mt-4 sm:mt-0">
          <Link
            href={routes.dashboardExplore}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            Explore New Campaigns
          </Link>
        </div>
      </div>{" "}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.totalActive}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.totalPending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.totalViews.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Earnings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalEarnings)}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-4">
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-400 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
              className="px-4 py-2 border border-gray-400 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
              ))}
            </select>
          </div>
        </div>
      </div>{" "}
      {/* Campaigns List */}
      <div className="space-y-6">
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <Link
              href={routes.dashboardExplore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer transform group-hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {campaign.title}
                        </h3>
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
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            campaign.type
                          )}`}
                        >
                          {campaign.type}
                        </span>{" "}
                      </div>

                      {/* Enhanced Advertiser Info */}
                      <div className="flex items-center space-x-3 mb-3">
                        {/* Advertiser Avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {campaign.advertiser.profileUrl ? (
                            <Image
                              src={campaign.advertiser.profileUrl}
                              alt={campaign.advertiser.companyName}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {campaign.advertiser.companyName
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Advertiser Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {campaign.advertiser.companyName}
                            </h4>
                            {/* Verification Badge */}
                            {campaign.advertiser.verified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-2.5 h-2.5 text-white"
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
                          {/* Rating */}
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="flex items-center">
                              <svg
                                className="w-3 h-3 text-yellow-400 fill-current"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-xs font-medium text-gray-700 ml-1">
                                {Number(campaign.advertiser.rating).toFixed(1)}
                              </span>
                            </div>
                            {/* Advertiser Type Badges */}
                            {campaign.advertiser.advertiserTypes &&
                              campaign.advertiser.advertiserTypes.length >
                                0 && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-gray-400">•</span>
                                  <span className="text-xs text-gray-500">
                                    {campaign.advertiser.advertiserTypes[0]}
                                    {campaign.advertiser.advertiserTypes
                                      .length > 1 &&
                                      ` +${
                                        campaign.advertiser.advertiserTypes
                                          .length - 1
                                      }`}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">
                        {campaign.description}
                      </p>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {campaign.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* View Details Icon */}
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-50 group-hover:bg-blue-100 rounded-lg transition-colors">
                      <ArrowTopRightOnSquareIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>{" "}
                  {/* Type-specific Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {/* Always show Total Earned */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Earned</p>
                      <p className="font-semibold text-green-600">
                        ${campaign.earnings.totalEarned}
                      </p>
                    </div>

                    {/* Views Generated - Only for VISIBILITY */}
                    {campaign.type === CampaignType.VISIBILITY && (
                      <>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Views Generated
                          </p>
                          <p className="font-semibold text-gray-900">
                            {(
                              campaign.earnings.viewsGenerated || 0
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Rate</p>
                          <p className="font-semibold text-blue-600">
                            {getEarningsInfo(campaign)}
                          </p>
                        </div>
                      </>
                    )}

                    {/* Budget Range - For CONSULTANT and SELLER */}
                    {(campaign.type === CampaignType.CONSULTANT ||
                      campaign.type === CampaignType.SELLER) && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Budget Range
                        </p>
                        <p className="font-semibold text-gray-900">
                          $
                          {
                            (
                              campaign.campaign as
                                | ConsultantCampaignDetails
                                | SellerCampaignDetails
                            ).minBudget
                          }{" "}
                          - $
                          {
                            (
                              campaign.campaign as
                                | ConsultantCampaignDetails
                                | SellerCampaignDetails
                            ).maxBudget
                          }
                        </p>
                      </div>
                    )}

                    {/* Meetings Left - For CONSULTANT */}
                    {campaign.type === CampaignType.CONSULTANT && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Meetings Left
                        </p>
                        <p className="font-semibold text-blue-600">
                          {(() => {
                            const consultantDetails =
                              campaign.campaign as ConsultantCampaignDetails;
                            const meetingsDone = campaign.meetingDone ? 1 : 0;
                            const meetingsLeft = Math.max(
                              0,
                              consultantDetails.meetingCount - meetingsDone
                            );
                            return meetingsLeft;
                          })()}
                        </p>
                      </div>
                    )}

                    {/* Meetings Left - For SELLER (if needMeeting is true) */}
                    {campaign.type === CampaignType.SELLER &&
                      (campaign.campaign as SellerCampaignDetails)
                        .needMeeting && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Meetings Left
                          </p>
                          <p className="font-semibold text-blue-600">
                            {(() => {
                              const sellerDetails =
                                campaign.campaign as SellerCampaignDetails;
                              const meetingsDone = campaign.meetingDone ? 1 : 0;
                              const meetingsLeft = Math.max(
                                0,
                                sellerDetails.meetingCount - meetingsDone
                              );
                              return meetingsLeft;
                            })()}
                          </p>
                        </div>
                      )}

                    {/* Rate/Commission Info - Only for SALESMAN */}
                    {campaign.type === CampaignType.SALESMAN && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Commission</p>
                        <p className="font-semibold text-blue-600">
                          {getEarningsInfo(campaign)}
                        </p>
                      </div>
                    )}

                    {/* Deadline */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Deadline</p>
                      <p className="font-semibold text-gray-900 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(
                          campaign.campaign.deadline
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {/* Deliverables - For CONSULTANT and SELLER */}
                  {(campaign.type === CampaignType.CONSULTANT ||
                    campaign.type === CampaignType.SELLER) && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Deliverables:
                      </p>
                      <div className="space-y-2">
                        {(() => {
                          const details = campaign.campaign as
                            | ConsultantCampaignDetails
                            | SellerCampaignDetails;
                          const deliverables =
                            campaign.type === CampaignType.CONSULTANT
                              ? (details as ConsultantCampaignDetails)
                                  .expectedDeliverables || []
                              : (details as SellerCampaignDetails)
                                  .deliverables || [];

                          const visibleDeliverables = deliverables.slice(0, 3);
                          const hasMore = deliverables.length > 3;
                          const remainingCount = deliverables.length - 3;

                          return (
                            <>
                              {visibleDeliverables.map((deliverable, index) => (
                                <div
                                  key={deliverable.id || index}
                                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
                                >
                                  <div className="flex items-center space-x-3">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                      {deliverable.deliverable.replace(/_/g, " ")}
                                    </span>
                                    <div className="flex items-center space-x-2 text-xs">
                                      <span
                                        className={`px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                                          deliverable.isSubmitted
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                      >
                                        {deliverable.isSubmitted ? (
                                          <>
                                            <CloudArrowUpIcon className="h-3 w-3" />
                                            <span>Submitted</span>
                                          </>
                                        ) : (
                                          <>
                                            <ClockIcon className="h-3 w-3" />
                                            <span>Pending</span>
                                          </>
                                        )}
                                      </span>
                                      <span
                                        className={`px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                                          deliverable.isFinished
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                      >
                                        {deliverable.isFinished ? (
                                          <>
                                            <CheckCircleIcon className="h-3 w-3" />
                                          </>
                                        ) : (
                                          <>
                                            <XCircleIcon className="h-3 w-3" />
                                          </>
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                                    <span className="flex items-center space-x-1">
                                      <span>{deliverable.promoterWork?.length || 0}</span>
                                      <span>work{(deliverable.promoterWork?.length || 0) !== 1 ? 's' : ''}</span>
                                    </span>
                                  </div>
                                </div>
                              ))}
                              
                              {hasMore && (
                                <div className="flex items-center justify-center bg-gray-50 rounded-lg p-3 border border-gray-200 border-dashed">
                                  <span className="text-sm text-gray-500 font-medium">
                                    +{remainingCount} more deliverable{remainingCount > 1 ? 's' : ''}
                                  </span>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}{" "}
                  {/* Actions - Now just for non-navigational actions */}
                  <div
                    className="flex flex-wrap gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {campaign.status === "ONGOING" && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle message action
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      >
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        Message
                      </button>
                    )}{" "}
                    {(campaign.type === "CONSULTANT" ||
                      campaign.type === "SELLER") &&
                      campaign.status === "ONGOING" && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            //TODO: Handle submit work action
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        >
                          <DocumentArrowUpIcon className="h-4 w-4" />
                          Submit Work
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
