'use client';

import { useState } from 'react';
import { CampaignType } from '@/app/enums/campaign-type';
import { AdvertiserCampaignStatus } from '@/app/interfaces/dashboard/advertiser-dashboard';
import { MOCK_CAMPAIGN_FILTERS } from '@/app/mocks/advertiser-campaign-mock';
import { AdvertiserCampaignSortField } from '@/app/interfaces/campaign/advertiser-campaign';
import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';

interface CampaignFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchBlur?: () => void;
  onSearchKeyDown?: (e: React.KeyboardEvent) => void;
  statusFilter: AdvertiserCampaignStatus[];
  onStatusFilterChange: (statuses: AdvertiserCampaignStatus[]) => void;
  typeFilter: CampaignType[];
  onTypeFilterChange: (types: CampaignType[]) => void;
  sortBy: AdvertiserCampaignSortField;
  onSortByChange: (sortBy: AdvertiserCampaignSortField) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onClearFilters: () => void;
  resultsCount: number;
  totalCount: number;
  availableStatuses?: AdvertiserCampaignStatus[];
  availableTypes?: CampaignType[];
}

export default function CampaignFilters({
  searchQuery,
  onSearchChange,
  onSearchBlur,
  onSearchKeyDown,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
  resultsCount,
  totalCount,
  availableStatuses = MOCK_CAMPAIGN_FILTERS.statuses,
  availableTypes = MOCK_CAMPAIGN_FILTERS.types,
}: CampaignFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleStatusToggle = (status: AdvertiserCampaignStatus) => {
    if (statusFilter.includes(status)) {
      onStatusFilterChange(statusFilter.filter(s => s !== status));
    } else {
      onStatusFilterChange([...statusFilter, status]);
    }
  };

  const handleTypeToggle = (type: CampaignType) => {
    if (typeFilter.includes(type)) {
      onTypeFilterChange(typeFilter.filter(t => t !== type));
    } else {
      onTypeFilterChange([...typeFilter, type]);
    }
  };

  const getStatusBadgeColor = (status: AdvertiserCampaignStatus) => {
    switch (status) {
      case AdvertiserCampaignStatus.ONGOING:
        return 'bg-green-100 text-green-800 border-green-200';
      case AdvertiserCampaignStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case AdvertiserCampaignStatus.REVIEWING_APPLICATIONS:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case AdvertiserCampaignStatus.PENDING_PROMOTER:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeBadgeColor = (type: CampaignType) => {
    switch (type) {
      case CampaignType.VISIBILITY:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case CampaignType.CONSULTANT:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case CampaignType.SALESMAN:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case CampaignType.SELLER:
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const hasActiveFilters = statusFilter.length > 0 || typeFilter.length > 0 || searchQuery;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onBlur={onSearchBlur}
            onKeyDown={onSearchKeyDown}
            className="w-full pl-8 pr-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm border rounded-lg transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">
              {statusFilter.length + typeFilter.length}
            </span>
          )}
        </button>

        {/* Sort */}
        <div className="flex items-center space-x-1.5">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as AdvertiserCampaignSortField)}
            className="px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          >
            <option value={AdvertiserCampaignSortField.UPDATED_AT}>Last Updated</option>
            <option value={AdvertiserCampaignSortField.CREATED_AT}>Created Date</option>
            <option value={AdvertiserCampaignSortField.TITLE}>Title</option>
            <option value={AdvertiserCampaignSortField.DEADLINE}>Deadline</option>
            <option value={AdvertiserCampaignSortField.TOTAL_BUDGET}>Budget</option>
            <option value={AdvertiserCampaignSortField.SPENT_AMOUNT}>Spent</option>
            <option value={AdvertiserCampaignSortField.TOTAL_PROMOTERS}>Promoters</option>
          </select>

          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-3.5 w-3.5 text-black" />
            ) : (
              <SortDesc className="h-3.5 w-3.5 text-black" />
            )}
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
        <span>
          Showing {resultsCount} of {totalCount} campaigns
        </span>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
          >
            <X className="h-3 w-3" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-3 space-y-3">
          {/* Status Filters */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Status</label>
            <div className="flex flex-wrap gap-1.5">
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusToggle(status)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    statusFilter.includes(status)
                      ? getStatusBadgeColor(status)
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filters */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Campaign Type</label>
            <div className="flex flex-wrap gap-1.5">
              {availableTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeToggle(type)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    typeFilter.includes(type)
                      ? getTypeBadgeColor(type)
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
