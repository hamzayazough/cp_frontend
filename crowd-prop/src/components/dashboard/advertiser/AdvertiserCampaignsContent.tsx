'use client';

import { useState } from 'react';
import { CampaignType } from '@/app/enums/campaign-type';
import { CampaignStatus } from '@/app/enums/campaign-type';
import { AdvertiserCampaignSortField } from '@/app/interfaces/campaign/advertiser-campaign';
import { useAdvertiserCampaigns } from '@/hooks/useAdvertiserCampaigns';
import CampaignStatsCards from './CampaignStatsCards';
import CampaignFilters from './CampaignFilters';
import CampaignList from './CampaignList';
import CreateCampaignButton from './CreateCampaignButton';

export default function AdvertiserCampaignsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus[]>([]);
  const [typeFilter, setTypeFilter] = useState<CampaignType[]>([]);
  const [sortBy, setSortBy] = useState<AdvertiserCampaignSortField>(AdvertiserCampaignSortField.UPDATED_AT);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { 
    campaigns, 
    loading, 
    error, 
    summary, 
    dashboardSummary, 
    filters,
    refetch 
  } = useAdvertiserCampaigns({
    searchQuery: searchQuery || undefined,
    statusFilter: statusFilter.length > 0 ? statusFilter : undefined,
    typeFilter: typeFilter.length > 0 ? typeFilter : undefined,
    sortBy,
    sortOrder,
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter([]);
    setTypeFilter([]);
    setSortBy(AdvertiserCampaignSortField.UPDATED_AT);
    setSortOrder('desc');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
            <p className="text-gray-600 mt-1">
              Manage your advertising campaigns and track their performance
            </p>
          </div>
          <CreateCampaignButton />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
            <p className="text-gray-600 mt-1">
              Manage your advertising campaigns and track their performance
            </p>
          </div>
          <CreateCampaignButton />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading campaigns</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => refetch()}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
          <p className="text-gray-600 mt-1">
            Manage your advertising campaigns and track their performance
          </p>
        </div>
        <CreateCampaignButton />
      </div>

      {/* Stats Cards */}
      <CampaignStatsCards summary={dashboardSummary} />

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
        totalCount={summary.totalActiveCampaigns + summary.totalCompletedCampaigns}
        availableStatuses={filters.statuses}
        availableTypes={filters.types}
      />

      {/* Campaign List */}
      <CampaignList campaigns={campaigns} />
    </div>
  );
}
