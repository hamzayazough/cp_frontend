"use client";

import { useState } from "react";
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
  PlayIcon,
} from "@heroicons/react/24/outline";
import { MOCK_CAMPAIGN_PROMOTERS } from "@/app/mocks/campaign-promoter-mock";
import {
  ConsultantCampaignDetails,
  SellerCampaignDetails,
} from "@/app/interfaces/campaign/promoter-campaign-details";
import { CampaignType } from "@/app/enums/campaign-type";
import {
  statusOptions,
  typeOptions,
  getStatusColor,
  getStatusIcon,
  getTypeColor,
  getEarningsInfo,
} from "@/app/const/promoter-campaign-content-const";

// Mock data
const mockCampaigns = MOCK_CAMPAIGN_PROMOTERS;

export default function PromoterCampaignsContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.advertiser.companyName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || campaign.status === statusFilter;
    const matchesType = typeFilter === "ALL" || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

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
      </div>

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
                {mockCampaigns.filter((c) => c.status === "ONGOING").length}
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
                {" "}
                {
                  mockCampaigns.filter((c) => c.status === "AWAITING_REVIEW")
                    .length
                }
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
              <p className="text-sm font-medium text-gray-600">Total Views</p>{" "}
              <p className="text-2xl font-bold text-gray-900">
                {mockCampaigns
                  .reduce((sum, c) => sum + (c.earnings.viewsGenerated || 0), 0)
                  .toLocaleString()}
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
                {" "}
                $
                {mockCampaigns
                  .reduce((sum, c) => sum + c.earnings.totalEarned, 0)
                  .toLocaleString()}
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
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>{" "}
            <Link
              href={routes.dashboardExplore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              Explore Campaigns
            </Link>
          </div>
        ) : (
          filteredCampaigns.map((campaign) => (
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
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {campaign.advertiser.companyName}
                      </p>
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
                  </div>
                  {/* Campaign Media */}
                  {campaign.mediaUrl && campaign.mediaUrl !== "undefined" && (
                    <div className="mb-4">
                      <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                        {campaign.mediaUrl.endsWith(".mp4") ||
                        campaign.mediaUrl.endsWith(".webm") ? (
                          <video
                            src={campaign.mediaUrl}
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : (
                          <Image
                            src={campaign.mediaUrl}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                            width={400}
                            height={192}
                          />
                        )}
                      </div>
                    </div>
                  )}{" "}
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
                      <div className="flex flex-wrap gap-2">
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

                          return deliverables.map((deliverable, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                            >
                              {deliverable.replace(/_/g, " ")}
                            </span>
                          ));
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
                            // Handle submit work action
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        >
                          <DocumentArrowUpIcon className="h-4 w-4" />
                          Submit Work
                        </button>
                      )}
                    {campaign.mediaUrl && campaign.mediaUrl !== "undefined" && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle preview media action
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      >
                        <PlayIcon className="h-4 w-4" />
                        Preview Media
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
