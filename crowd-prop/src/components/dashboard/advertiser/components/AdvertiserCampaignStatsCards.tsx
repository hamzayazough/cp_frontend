"use client";

import {
  CurrencyDollarIcon,
  EyeIcon,
  UsersIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { CampaignAdvertiser } from "@/app/interfaces/campaign/advertiser-campaign";
import { CampaignType } from "@/app/enums/campaign-type";

interface AdvertiserCampaignStatsCardsProps {
  campaign: CampaignAdvertiser;
  daysLeft: number | string;
}

export default function AdvertiserCampaignStatsCards({
  campaign,
  daysLeft,
}: AdvertiserCampaignStatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getProgressPercentage = (spent: number, total: number) => {
    if (total === 0) return 0;
    return Math.min((spent / total) * 100, 100);
  };

  const getViewsProgress = () => {
    if (campaign.type === CampaignType.VISIBILITY && campaign.campaign.type === CampaignType.VISIBILITY) {
      const current = campaign.campaign.currentViews;
      const max = campaign.campaign.maxViews;
      return Math.min((current / max) * 100, 100);
    }
    return 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Budget Spent */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Budget Spent</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(campaign.campaign.spentBudget)}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              of {formatCurrency(campaign.campaign.budgetHeld)}
            </span>
            <span className="text-gray-600">
              {getProgressPercentage(campaign.campaign.spentBudget, campaign.campaign.budgetHeld).toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${getProgressPercentage(campaign.campaign.spentBudget, campaign.campaign.budgetHeld)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Views/Performance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <EyeIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              {campaign.type === CampaignType.VISIBILITY ? "Views Generated" : "Total Views"}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {campaign.type === CampaignType.VISIBILITY && campaign.campaign.type === CampaignType.VISIBILITY
                ? formatNumber(campaign.campaign.currentViews)
                : formatNumber(campaign.performance.totalViewsGained || 0)
              }
            </p>
          </div>
        </div>
        {campaign.type === CampaignType.VISIBILITY && campaign.campaign.type === CampaignType.VISIBILITY && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                of {formatNumber(campaign.campaign.maxViews)} target
              </span>
              <span className="text-gray-600">
                {getViewsProgress().toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${getViewsProgress()}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Promoters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <UsersIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Promoters</p>
            <p className="text-2xl font-bold text-gray-900">
              {campaign.promoters?.length || 0}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {campaign.promoters?.filter(p => p.status === 'AWAITING_REVIEW').length || 0} pending review
        </p>
      </div>

      {/* Days Left */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-orange-100 rounded-lg">
            <CalendarIcon className="h-6 w-6 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Days Left</p>
            <p className="text-2xl font-bold text-gray-900">{daysLeft}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Until {new Date(campaign.campaign.deadline).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
