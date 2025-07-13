'use client';

import { useState } from 'react';
import { CampaignType } from '@/app/enums/campaign-type';
import { ADVERTISER_CAMPAIGN_MOCKS } from '@/app/mocks/advertiser-campaign-mock';
import { CampaignStatus } from '@/app/enums/campaign-type';
import { AdvertiserCampaignSortField } from '@/app/interfaces/campaign/advertiser-campaign';
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

  // Get filtered and sorted campaigns
  const filteredCampaigns = ADVERTISER_CAMPAIGN_MOCKS.helpers.getFilteredCampaigns(
    ADVERTISER_CAMPAIGN_MOCKS.campaigns,
    {
      status: statusFilter.length > 0 ? statusFilter : undefined,
      type: typeFilter.length > 0 ? typeFilter : undefined,
      searchQuery: searchQuery || undefined,
    }
  );

  const sortedCampaigns = ADVERTISER_CAMPAIGN_MOCKS.helpers.sortCampaigns(
    filteredCampaigns,
    sortBy,
    sortOrder
  );

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter([]);
    setTypeFilter([]);
    setSortBy(AdvertiserCampaignSortField.UPDATED_AT);
    setSortOrder('desc');
  };

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
      <CampaignStatsCards summary={ADVERTISER_CAMPAIGN_MOCKS.dashboardSummary} />

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
        resultsCount={sortedCampaigns.length}
        totalCount={ADVERTISER_CAMPAIGN_MOCKS.campaigns.length}
      />

      {/* Campaign List */}
      <CampaignList campaigns={sortedCampaigns} />
    </div>
  );
}
