"use client";

import { CampaignAdvertiser } from "@/app/interfaces/campaign/advertiser-campaign";
import { PromoterCampaignStatus } from "@/app/enums/campaign-type";
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  LinkIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";

interface AdvertiserCampaignPromotersProps {
  campaign: CampaignAdvertiser;
  onViewApplications: (campaign: CampaignAdvertiser) => void;
}

export default function AdvertiserCampaignPromoters({ 
  campaign, 
  onViewApplications 
}: AdvertiserCampaignPromotersProps) {
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

  const getPromoterStatusColor = (status: PromoterCampaignStatus) => {
    switch (status) {
      case PromoterCampaignStatus.AWAITING_REVIEW:
        return 'bg-yellow-100 text-yellow-800';
      case PromoterCampaignStatus.ONGOING:
        return 'bg-green-100 text-green-800';
      case PromoterCampaignStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      case PromoterCampaignStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: PromoterCampaignStatus) => {
    switch (status) {
      case PromoterCampaignStatus.AWAITING_REVIEW:
        return <ClockIcon className="h-4 w-4" />;
      case PromoterCampaignStatus.ONGOING:
        return <CheckCircleIcon className="h-4 w-4" />;
      case PromoterCampaignStatus.COMPLETED:
        return <CheckCircleIcon className="h-4 w-4" />;
      case PromoterCampaignStatus.REJECTED:
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const promoters = campaign.promoters || [];
  const awaitingReview = promoters.filter(p => p.status === PromoterCampaignStatus.AWAITING_REVIEW);
  const ongoing = promoters.filter(p => p.status === PromoterCampaignStatus.ONGOING);
  const completed = promoters.filter(p => p.status === PromoterCampaignStatus.COMPLETED);

  if (promoters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <EyeIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Promoters Yet</h3>
        <p className="text-gray-600 mb-4">
          No promoters have applied to this campaign yet.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Share Campaign
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Awaiting Review</p>
              <p className="text-xl font-bold text-yellow-900">{awaitingReview.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-800">Active</p>
              <p className="text-xl font-bold text-green-900">{ongoing.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-800">Completed</p>
              <p className="text-xl font-bold text-blue-900">{completed.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Applications Button */}
      {awaitingReview.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-yellow-800">
                {awaitingReview.length} Application{awaitingReview.length > 1 ? 's' : ''} Pending Review
              </h3>
              <p className="text-sm text-yellow-700">
                Review and approve/reject promoter applications for your campaign.
              </p>
            </div>
            <button
              onClick={() => onViewApplications(campaign)}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Review Applications
            </button>
          </div>
        </div>
      )}

      {/* Promoters List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          All Promoters ({promoters.length})
        </h3>
        <div className="space-y-3">
          {promoters.map((promoterInfo, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Image
                    src={promoterInfo.promoter.avatarUrl || '/api/placeholder/48/48'}
                    alt={promoterInfo.promoter.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{promoterInfo.promoter.name}</h4>
                    <p className="text-sm text-gray-500">{promoterInfo.promoter.email}</p>
                    {promoterInfo.joinedAt && (
                      <p className="text-xs text-gray-400">
                        Joined {new Date(promoterInfo.joinedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPromoterStatusColor(promoterInfo.status)}`}>
                      {getStatusIcon(promoterInfo.status)}
                      <span className="ml-1">{promoterInfo.status.replace('_', ' ')}</span>
                    </div>
                    {promoterInfo.earnings && (
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatCurrency(promoterInfo.earnings)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    </button>
                    {promoterInfo.promoterLinks && promoterInfo.promoterLinks.length > 0 && (
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <LinkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Additional Info for Active Promoters */}
              {promoterInfo.status === PromoterCampaignStatus.ONGOING && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {promoterInfo.viewsGenerated && (
                      <div>
                        <span className="text-gray-500">Views Generated:</span>
                        <span className="ml-2 font-medium">{formatNumber(promoterInfo.viewsGenerated)}</span>
                      </div>
                    )}
                    {promoterInfo.numberMeetingsDone !== undefined && (
                      <div>
                        <span className="text-gray-500">Meetings Done:</span>
                        <span className="ml-2 font-medium">{promoterInfo.numberMeetingsDone}</span>
                      </div>
                    )}
                    {promoterInfo.promoterLinks && promoterInfo.promoterLinks.length > 0 && (
                      <div>
                        <span className="text-gray-500">Links Shared:</span>
                        <span className="ml-2 font-medium">{promoterInfo.promoterLinks.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
