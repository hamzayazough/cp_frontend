"use client";

import { useState } from "react";
import {
  CurrencyDollarIcon,
  EyeIcon,
  UsersIcon,
  CalendarIcon,
  DocumentTextIcon,
  BanknotesIcon,
  PlusIcon,
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
import { advertiserPaymentService } from "@/services/advertiser-payment.service";
import FundingVerificationModal from "../FundingVerificationModal";

interface AdvertiserCampaignStatsCardsProps {
  campaign: CampaignAdvertiser;
  daysLeft: number | string;
  onBudgetUpdated?: () => void; // Callback to refresh campaign data
}

export default function AdvertiserCampaignStatsCards({
  campaign,
  daysLeft,
  onBudgetUpdated,
}: AdvertiserCampaignStatsCardsProps) {
  const [additionalBudget, setAdditionalBudget] = useState<number>(100);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [isAdjustingBudget, setIsAdjustingBudget] = useState(false);
  const [adjustBudgetError, setAdjustBudgetError] = useState<string | null>(null);
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

  const handleIncreaseBudget = () => {
    if (additionalBudget <= 0) {
      setAdjustBudgetError("Please enter a positive amount");
      return;
    }
    setAdjustBudgetError(null);
    setShowFundingModal(true);
  };

  const handleFundingVerified = async () => {
    setIsAdjustingBudget(true);
    setAdjustBudgetError(null);
    
    try {
      // Convert additional budget to cents (backend expects cents)
      const additionalBudgetCents = additionalBudget * 100;
      const result = await advertiserPaymentService.adjustCampaignBudget(campaign.id, additionalBudgetCents);
      
      if (result.success) {
        // Update the campaign data locally with new budget values (convert from cents to dollars)
        const newBudgetDollars = result.data?.newBudgetCents ? result.data.newBudgetCents / 100 : campaign.campaign.maxBudget + additionalBudget;
        
        // Update both maxBudget and budgetHeld
        campaign.campaign.maxBudget = newBudgetDollars;
        campaign.campaign.budgetHeld = newBudgetDollars;
        
        // Reset form
        setAdditionalBudget(100);
        setShowFundingModal(false);
        
        // Trigger refresh if callback provided
        if (onBudgetUpdated) {
          onBudgetUpdated();
        }
      } else {
        setAdjustBudgetError(result.message || "Failed to adjust budget");
        setShowFundingModal(false);
      }
    } catch (error) {
      setAdjustBudgetError(error instanceof Error ? error.message : "Failed to adjust budget");
      setShowFundingModal(false);
    } finally {
      setIsAdjustingBudget(false);
    }
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

      {/* Views/Performance or Budget Range */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className={`p-1.5 rounded-lg ${
            campaign.type === CampaignType.CONSULTANT || campaign.type === CampaignType.SELLER
              ? "bg-blue-100" 
              : "bg-green-100"
          }`}>
            {campaign.type === CampaignType.CONSULTANT || campaign.type === CampaignType.SELLER ? (
              <BanknotesIcon className="h-4 w-4 text-blue-600" />
            ) : (
              <EyeIcon className="h-4 w-4 text-green-600" />
            )}
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">
              {campaign.type === CampaignType.CONSULTANT || campaign.type === CampaignType.SELLER
                ? "Budget Range"
                : campaign.type === CampaignType.VISIBILITY 
                ? "Views Generated" 
                : "Total Views"
              }
            </p>
            <p className="text-lg font-bold text-gray-900">
              {campaign.type === CampaignType.CONSULTANT || campaign.type === CampaignType.SELLER
                ? `${formatCurrency(campaign.campaign.minBudget)} - ${formatCurrency(campaign.campaign.maxBudget)}`
                : campaign.type === CampaignType.VISIBILITY && campaign.campaign.type === CampaignType.VISIBILITY
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
        {/* Budget Adjustment for Consultant/Seller campaigns */}
        {(campaign.type === CampaignType.CONSULTANT || campaign.type === CampaignType.SELLER) && (
          <div className="mt-3 space-y-2">
            {adjustBudgetError && (
              <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                {adjustBudgetError}
              </div>
            )}
            <div className="flex items-center space-x-1">
              <input
                type="number"
                value={additionalBudget}
                onChange={(e) => setAdditionalBudget(Number(e.target.value))}
                className="w-16 px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-center text-black"
                min="1"
                step="10"
                disabled={isAdjustingBudget}
              />
              <button
                onClick={handleIncreaseBudget}
                disabled={isAdjustingBudget || additionalBudget <= 0}
                className="flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAdjustingBudget ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                ) : (
                  <PlusIcon className="h-3 w-3 mr-1" />
                )}
                {isAdjustingBudget ? "..." : "Add"}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Increase max budget
            </p>
          </div>
        )}
      </div>

      {/* Deliverables, CPV, or Promoters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className={`p-1.5 rounded-lg ${
            campaign.type === CampaignType.CONSULTANT || campaign.type === CampaignType.SELLER
              ? "bg-green-100"
              : campaign.type === CampaignType.VISIBILITY
              ? "bg-yellow-100"
              : "bg-purple-100"
          }`}>
            {campaign.type === CampaignType.CONSULTANT || campaign.type === CampaignType.SELLER ? (
              <DocumentTextIcon className="h-4 w-4 text-green-600" />
            ) : campaign.type === CampaignType.VISIBILITY ? (
              <CurrencyDollarIcon className="h-4 w-4 text-yellow-600" />
            ) : (
              <UsersIcon className="h-4 w-4 text-purple-600" />
            )}
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">
              {campaign.type === CampaignType.CONSULTANT || campaign.type === CampaignType.SELLER
                ? "Deliverables"
                : campaign.type === CampaignType.VISIBILITY
                ? "Cost per 100 Views"
                : "Promoters"
              }
            </p>
            <p className="text-lg font-bold text-gray-900">
              {campaign.type === CampaignType.CONSULTANT
                ? (() => {
                    const deliverables = campaign.campaign.expectedDeliverables || [];
                    const finished = deliverables.filter(d => d.isFinished).length;
                    return `${finished}/${deliverables.length}`;
                  })()
                : campaign.type === CampaignType.SELLER
                ? (() => {
                    const deliverables = campaign.campaign.deliverables || [];
                    const finished = deliverables.filter(d => d.isFinished).length;
                    return `${finished}/${deliverables.length}`;
                  })()
                : campaign.type === CampaignType.VISIBILITY && campaign.campaign.type === CampaignType.VISIBILITY
                ? formatCurrency(campaign.campaign.cpv)
                : campaign.promoters?.length || 0
              }
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          {campaign.type === CampaignType.CONSULTANT || campaign.type === CampaignType.SELLER
            ? "completed"
            : campaign.type === CampaignType.VISIBILITY
            ? "per 100 views"
            : `${campaign.promoters?.filter(p => p.status === 'AWAITING_REVIEW').length || 0} pending review`
          }
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

    {/* Funding Verification Modal */}
    <FundingVerificationModal
      isOpen={showFundingModal}
      onClose={() => setShowFundingModal(false)}
      onVerified={handleFundingVerified}
      estimatedBudget={additionalBudget}
      mode="increase"
      currentMaxBudget={campaign.campaign.maxBudget}
    />
    </div>
  );
}
