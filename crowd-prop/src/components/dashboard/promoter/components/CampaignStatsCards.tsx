"use client";

import {
  CurrencyDollarIcon,
  EyeIcon,
  ChartBarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import {
  CampaignPromoter,
  VisibilityCampaignDetails,
  ConsultantCampaignDetails,
  SellerCampaignDetails,
} from "@/app/interfaces/campaign/promoter-campaign-details";
import { CampaignType } from "@/app/enums/campaign-type";

interface CampaignStatsCardsProps {
  campaign: CampaignPromoter;
  daysLeft: number | string;
}

export default function CampaignStatsCards({
  campaign,
  daysLeft,
}: CampaignStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-1.5 bg-green-100 rounded-lg">
            <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
          </div>
          <div className="ml-2">
            <p className="text-xs font-medium text-gray-600">Total Earned</p>
            <p className="text-lg font-bold text-gray-900">
              ${(campaign.earnings.totalEarned || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      {campaign.campaign.type === CampaignType.VISIBILITY && (
        <>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <EyeIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-2">
                <p className="text-xs font-medium text-gray-600">Views</p>
                <p className="text-lg font-bold text-gray-900">
                  {(campaign.earnings.viewsGenerated || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <CurrencyDollarIcon className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-2">
                <p className="text-xs font-medium text-gray-600">Per 100 views</p>
                <p className="text-lg font-bold text-gray-900">
                  ${Number((campaign.campaign as VisibilityCampaignDetails).cpv || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {campaign.campaign.type === CampaignType.CONSULTANT && (
        <>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-2">
                <p className="text-xs font-medium text-gray-600">Budget Used</p>
                <p className="text-lg font-bold text-gray-900">
                  {Math.round(
                    (campaign.campaign.spentBudget /
                      campaign.campaign.budgetHeld) *
                      100
                  ) || 0}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <EyeIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-2">
                <p className="text-xs font-medium text-gray-600">Meetings</p>
                <p className="text-lg font-bold text-gray-900">
                  {(campaign.campaign as ConsultantCampaignDetails).meetingCount || 0}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {campaign.campaign.type === CampaignType.SALESMAN && (
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-2">
              <p className="text-xs font-medium text-gray-600">Sales</p>
              <p className="text-lg font-bold text-gray-900">
                {campaign.earnings.totalEarned || 0}
              </p>
            </div>
          </div>
        </div>
      )}
      {campaign.campaign.type === CampaignType.SELLER && (
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <CurrencyDollarIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-2">
              <p className="text-xs font-medium text-gray-600">Min Budget</p>
              <p className="text-lg font-bold text-gray-900">
                ${((campaign.campaign as SellerCampaignDetails).minBudget || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
      {(campaign.campaign.type === CampaignType.SELLER ||
        campaign.campaign.type === CampaignType.SALESMAN) && (
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <CurrencyDollarIcon className="h-4 w-4 text-purple-600" />
            </div>
            <div className="ml-2">
              <p className="text-xs font-medium text-gray-600">Max Budget</p>
              <p className="text-lg font-bold text-gray-900">
                ${(campaign.campaign.type === CampaignType.SELLER ||
                campaign.campaign.type === CampaignType.SALESMAN
                  ? (campaign.campaign as SellerCampaignDetails).maxBudget || 0
                  : 0
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-1.5 bg-orange-100 rounded-lg">
            <CalendarIcon className="h-4 w-4 text-orange-600" />
          </div>
          <div className="ml-2">
            <p className="text-xs font-medium text-gray-600">Days Left</p>
            <p className="text-lg font-bold text-gray-900">{daysLeft}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
