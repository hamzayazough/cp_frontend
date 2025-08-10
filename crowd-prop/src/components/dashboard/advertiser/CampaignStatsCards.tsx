"use client";

import {
  PlayIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

interface CampaignStatsCardsProps {
  summary: {
    totalActiveCampaigns: number;
    totalCompletedCampaigns: number;
    totalSpentThisMonth: number;
    totalAllocatedBudget: string | number;
    totalRemainingBudget: number;
  } | null;
}

export default function CampaignStatsCards({
  summary,
}: CampaignStatsCardsProps) {
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null || isNaN(amount)) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle null summary
  if (!summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalAllocated = parseFloat(summary.totalAllocatedBudget?.toString() || "0");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Campaigns */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <PlayIcon className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Active Campaigns</p>
            <p className="text-xl font-bold text-gray-900">
              {summary.totalActiveCampaigns}
            </p>
          </div>
        </div>
      </div>

      {/* Completed Campaigns */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CheckCircleIcon className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Completed Campaigns</p>
            <p className="text-xl font-bold text-gray-900">
              {summary.totalCompletedCampaigns}
            </p>
          </div>
        </div>
      </div>

      {/* This Month's Spend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <CurrencyDollarIcon className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">This Month</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(summary.totalSpentThisMonth)}
            </p>
            <p className="text-xs text-gray-500">
              of {formatCurrency(totalAllocated)} allocated
            </p>
          </div>
        </div>
      </div>

      {/* Remaining Budget */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BanknotesIcon className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Available Budget</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(summary.totalRemainingBudget)}
            </p>
            <p className="text-xs text-gray-500">
              ready to spend
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
