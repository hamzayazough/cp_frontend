"use client";

import {
  CurrencyDollarIcon,
  EyeIcon,
  UsersIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import {
  Play,
  CheckCircle,
  Search,
  AlertCircle,
} from "lucide-react";
import { CampaignAdvertiser } from "@/app/interfaces/campaign/advertiser-campaign";
import { CampaignType } from "@/app/enums/campaign-type";
import { AdvertiserCampaignStatus } from "@/app/interfaces/dashboard/advertiser-dashboard";

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
    <div className="space-y-4">
      {/* Campaign Status Progress */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-center">
          <div className="w-[90%] flex items-center space-x-1">
            {(() => {
              const statuses = campaign.campaign.isPublic 
                ? [
                    { key: AdvertiserCampaignStatus.PENDING_PROMOTER, label: "Waiting", icon: AlertCircle },
                    { key: AdvertiserCampaignStatus.REVIEWING_APPLICATIONS, label: "Review", icon: Search },
                    { key: AdvertiserCampaignStatus.ONGOING, label: "Ongoing", icon: Play },
                    { key: AdvertiserCampaignStatus.COMPLETED, label: "Completed", icon: CheckCircle },
                  ]
                : [
                    { key: AdvertiserCampaignStatus.PENDING_PROMOTER, label: "Waiting", icon: AlertCircle },
                    { key: AdvertiserCampaignStatus.REVIEWING_APPLICATIONS, label: "Review", icon: Search },
                    { key: AdvertiserCampaignStatus.ONGOING, label: "Ongoing", icon: Play },
                    { key: AdvertiserCampaignStatus.COMPLETED, label: "Completed", icon: CheckCircle },
                  ];
              
              const currentIndex = statuses.findIndex(status => status.key === campaign.status);
              
              return statuses.map((status, index) => {
                const Icon = status.icon;
                const isActive = index === currentIndex;
                const isCompleted = index < currentIndex;
                
                return (
                  <div key={status.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center mb-0.5 transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg"
                            : isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <Icon className="h-2.5 w-2.5" />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isActive
                            ? "text-blue-600"
                            : isCompleted
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {status.label}
                      </span>
                    </div>
                    {index < statuses.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-1 rounded-full transition-all ${
                          isCompleted ? "bg-green-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {/* Budget Spent */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <CurrencyDollarIcon className="h-4 w-4 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">Budget Spent</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(campaign.campaign.spentBudget)}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              of {formatCurrency(campaign.campaign.budgetHeld)}
            </span>
            <span className="text-gray-600">
              {getProgressPercentage(campaign.campaign.spentBudget, campaign.campaign.budgetHeld).toFixed(1)}%
            </span>
          </div>
          <div className="mt-1.5 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{
                width: `${getProgressPercentage(campaign.campaign.spentBudget, campaign.campaign.budgetHeld)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Views/Performance */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-1.5 bg-green-100 rounded-lg">
            <EyeIcon className="h-4 w-4 text-green-600" />
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">
              {campaign.type === CampaignType.VISIBILITY ? "Views Generated" : "Total Views"}
            </p>
            <p className="text-lg font-bold text-gray-900">
              {campaign.type === CampaignType.VISIBILITY && campaign.campaign.type === CampaignType.VISIBILITY
                ? formatNumber(campaign.campaign.currentViews)
                : formatNumber(campaign.performance.totalViewsGained || 0)
              }
            </p>
          </div>
        </div>
        {campaign.type === CampaignType.VISIBILITY && campaign.campaign.type === CampaignType.VISIBILITY && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                of {formatNumber(campaign.campaign.maxViews)} target
              </span>
              <span className="text-gray-600">
                {getViewsProgress().toFixed(1)}%
              </span>
            </div>
            <div className="mt-1.5 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-600 h-1.5 rounded-full"
                style={{
                  width: `${getViewsProgress()}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Promoters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-1.5 bg-purple-100 rounded-lg">
            <UsersIcon className="h-4 w-4 text-purple-600" />
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">Promoters</p>
            <p className="text-lg font-bold text-gray-900">
              {campaign.promoters?.length || 0}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          {campaign.promoters?.filter(p => p.status === 'AWAITING_REVIEW').length || 0} pending review
        </p>
      </div>

      {/* Days Left */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-1.5 bg-orange-100 rounded-lg">
            <CalendarIcon className="h-4 w-4 text-orange-600" />
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">Days Left</p>
            <p className="text-lg font-bold text-gray-900">{daysLeft}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          Until {new Date(campaign.campaign.deadline).toLocaleDateString()}
        </p>
      </div>
    </div>
    </div>
  );
}
