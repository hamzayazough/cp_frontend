"use client";

import { useState } from "react";
import { CampaignType } from "@/app/enums/campaign-type";
import { CampaignStatus } from "@/app/enums/campaign-type";
import { AdvertiserCampaignSortField } from "@/app/interfaces/campaign/advertiser-campaign";
import { useAdvertiserCampaigns } from "@/hooks/useAdvertiserCampaigns";
import CampaignStatsCards from "./CampaignStatsCards";
import CampaignFilters from "./CampaignFilters";
import CampaignList from "./CampaignList";
import CreateCampaignButton from "./CreateCampaignButton";

export default function AdvertiserCampaignsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus[]>([]);
  const [typeFilter, setTypeFilter] = useState<CampaignType[]>([]);
  const [sortBy, setSortBy] = useState<AdvertiserCampaignSortField>(
    AdvertiserCampaignSortField.UPDATED_AT
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const {
    campaigns,
    loading,
    error,
    summary,
    filters,
    refetch,
  } = useAdvertiserCampaigns({
    searchQuery: searchQuery || undefined,
    status: statusFilter.length > 0 ? statusFilter : undefined,
    type: typeFilter.length > 0 ? typeFilter : undefined,
    sortBy,
    sortOrder,
  });

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter([]);
    setTypeFilter([]);
    setSortBy(AdvertiserCampaignSortField.UPDATED_AT);
    setSortOrder("desc");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
            <p className="text-gray-600 text-sm">
              Manage your advertising campaigns and track their performance
            </p>
          </div>
          <CreateCampaignButton />
        </div>
        <div className="flex justify-center items-center h-48">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="space-y-4">
        {/* Header - Keep the same structure */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
            <p className="text-gray-600 text-sm">
              Manage your advertising campaigns and track their performance
            </p>
          </div>
          <CreateCampaignButton />
        </div>

        {/* Error Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-4 w-4 text-amber-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-2">
              <h3 className="text-sm font-medium text-amber-800">
                {error.includes("demo data") ? "Demo Mode" : "Connection Issue"}
              </h3>
              <div className="mt-1 text-sm text-amber-700">
                <p>{error}</p>
              </div>
              {!error.includes("demo data") && (
                <div className="mt-2">
                  <button
                    onClick={() => refetch()}
                    className="bg-amber-600 text-white px-3 py-1 text-sm rounded-md hover:bg-amber-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards - Show skeleton or actual data */}
        <CampaignStatsCards summary={summary} />

        {/* Filters and Search - Show with available data */}
        <CampaignFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onClearFilters={handleClearFilters}
          resultsCount={campaigns.length}
          totalCount={
            summary.totalActiveCampaigns + summary.totalCompletedCampaigns
          }
          availableStatuses={filters.statuses}
          availableTypes={filters.types}
        />

        {/* Campaign List - Show available campaigns or empty state */}
        <CampaignList campaigns={campaigns} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
          <p className="text-gray-600 text-sm">
            Manage your advertising campaigns and track their performance
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <CampaignStatsCards summary={summary} />

      {/* Filters and Search */}
      <CampaignFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onClearFilters={handleClearFilters}
        resultsCount={campaigns.length}
        totalCount={
          summary.totalActiveCampaigns + summary.totalCompletedCampaigns
        }
        availableStatuses={filters.statuses}
        availableTypes={filters.types}
      />

      {/* Campaign List */}
      <CampaignList campaigns={campaigns} />
    </div>
  );
}
