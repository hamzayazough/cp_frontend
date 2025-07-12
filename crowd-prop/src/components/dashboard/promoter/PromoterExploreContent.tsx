"use client";

import { useState } from "react";
import Link from "next/link";
import { routes } from "@/lib/router";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  TagIcon,
  StarIcon,
  CalendarIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import {
  TYPE_OPTIONS,
  SORT_OPTIONS,
  MOCK_CAMPAIGNS,
  getTypeColor,
  formatBudgetInfo,
  getDaysLeft,
  getFilteredAndSortedCampaigns,
} from "./promoter-explore-content.constants";
import { formatDate } from "@/utils/date";

export default function PromoterExploreContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedCampaigns = getFilteredAndSortedCampaigns(
    searchTerm,
    typeFilter,
    sortBy
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Explore Campaigns
          </h1>
          <p className="text-gray-600 mt-2">
            Discover new opportunities to earn money
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            {filteredAndSortedCampaigns.length} campaigns available
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <EyeIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Visibility</p>{" "}
              <p className="text-lg font-semibold">
                {MOCK_CAMPAIGNS.filter((c) => c.type === "VISIBILITY").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Sales</p>
              <p className="text-lg font-semibold">
                {MOCK_CAMPAIGNS.filter((c) => c.type === "SALESMAN").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Consulting</p>
              <p className="text-lg font-semibold">
                {MOCK_CAMPAIGNS.filter((c) => c.type === "CONSULTANT").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <TagIcon className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Content</p>
              <p className="text-lg font-semibold">
                {MOCK_CAMPAIGNS.filter((c) => c.type === "SELLER").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns, companies, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-6">
        {" "}
        {filteredAndSortedCampaigns.map((campaign) => (
          <Link
            key={campaign.id}
            href={routes.dashboardExploreDetails(campaign.id)}
            className="block bg-white rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md hover:border-blue-200 relative group"
          >
            {/* External Link Icon */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowTopRightOnSquareIcon className="h-4 w-4 text-blue-600" />
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-12">
                  {" "}
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {campaign.title}
                    </h3>
                  </div>{" "}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-md"></div>{" "}
                      <div>
                        {" "}
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {campaign.advertiser.companyName}
                          {campaign.advertiser.verified && (
                            <div className="ml-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
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
                        <div className="flex items-center">
                          <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 ml-1">
                            {campaign.advertiser.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        campaign.type
                      )}`}
                    >
                      {campaign.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {formatBudgetInfo(campaign)}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {getDaysLeft(campaign.deadline)} days left
                  </div>
                </div>
              </div>
              {/* Description */}
              <p className="text-gray-700 mb-4">{campaign.description}</p>{" "}
              {/* Requirements */}
              {campaign.requirements && campaign.requirements.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Requirements:
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {campaign.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
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
              </div>{" "}
              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {" "}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Posted {formatDate(campaign.createdAt)}</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Handle apply/take contract action
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    {campaign.isPublic ? (
                      <>
                        <DocumentTextIcon className="h-4 w-4" />
                        <span>Take Contract</span>
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="h-4 w-4" />
                        <span>Apply Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedCampaigns.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No campaigns found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("ALL");
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
