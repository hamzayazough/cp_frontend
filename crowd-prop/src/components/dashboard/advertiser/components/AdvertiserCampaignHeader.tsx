"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  CampaignAdvertiser,
  AdvertiserConsultantCampaignDetails,
  AdvertiserSellerCampaignDetails,
} from "@/app/interfaces/campaign/advertiser-campaign";
import {
  CampaignType,
  PromoterCampaignStatus,
} from "@/app/enums/campaign-type";
import { useState } from "react";
import { AdvertiserCampaignStatus } from "@/app/interfaces/dashboard/advertiser-dashboard";

interface AdvertiserCampaignHeaderProps {
  campaign: CampaignAdvertiser;
  campaignId: string;
  onShareClick: () => void;
  getStatusColor: (status: AdvertiserCampaignStatus) => string;
  getTypeColor: (type: CampaignType) => string;
}

export default function AdvertiserCampaignHeader({
  campaign,
  campaignId,
  onShareClick,
  getStatusColor,
  getTypeColor,
}: AdvertiserCampaignHeaderProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isCompletingCampaign, setIsCompletingCampaign] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [extendError, setExtendError] = useState<string | null>(null);

  // Check if all deliverables are finished for Consultant and Seller campaigns
  const areAllDeliverablesFinished = () => {
    if (campaign.type === CampaignType.CONSULTANT) {
      const consultantCampaign =
        campaign.campaign as AdvertiserConsultantCampaignDetails;
      const deliverables = consultantCampaign.expectedDeliverables || [];
      return deliverables.length > 0 && deliverables.every((d) => d.isFinished);
    } else if (campaign.type === CampaignType.SELLER) {
      const sellerCampaign =
        campaign.campaign as AdvertiserSellerCampaignDetails;
      const deliverables = sellerCampaign.deliverables || [];
      return deliverables.length > 0 && deliverables.every((d) => d.isFinished);
    }
    return false;
  };

  const canCompleteCampaign = () => {
    return (
      (campaign.type === CampaignType.CONSULTANT ||
        campaign.type === CampaignType.SELLER) &&
      campaign.status === AdvertiserCampaignStatus.ONGOING &&
      areAllDeliverablesFinished()
    );
  };

  // Check if chat button should be shown
  const shouldShowChatButton = () => {
    if (
      !campaign.chosenPromoters ||
      campaign.status !== AdvertiserCampaignStatus.ONGOING
    ) {
      return false;
    }

    // Handle both single object and array for chosenPromoters
    const chosenPromotersArray = Array.isArray(campaign.chosenPromoters)
      ? campaign.chosenPromoters
      : [campaign.chosenPromoters];

    // Check if at least one promoter is ongoing
    return chosenPromotersArray.some(
      (chosenPromoter) =>
        chosenPromoter.status === PromoterCampaignStatus.ONGOING
    );
  };

  // Check if deadline is within a week
  const isDeadlineWithinWeek = () => {
    const deadline = new Date(campaign.campaign.deadline);
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    return deadline.getTime() - now.getTime() <= oneWeek && deadline > now;
  };

  // Handle extending campaign deadline
  const handleExtendDeadline = async (additionalDays: number) => {
    setIsExtending(true);
    setExtendError(null);
    try {
      const res = await import("@/services/advertiser.service").then((m) =>
        m.advertiserService.extendCampaignDeadline(campaign.id, additionalDays)
      );
      if (res.success) {
        // Reload the page to show updated deadline
        window.location.reload();
      } else {
        setExtendError(res.message || "Failed to extend deadline.");
      }
    } catch {
      setExtendError("Failed to extend deadline.");
    } finally {
      setIsExtending(false);
      setShowExtendModal(false);
    }
  };

  const handleCompleteCampaign = async () => {
    setIsCompletingCampaign(true);
    setCompleteError(null);
    try {
      const res = await import("@/services/advertiser.service").then((m) =>
        m.advertiserService.completeCampaign(campaign.id)
      );
      if (res.success) {
        // Reload the page to show updated campaign status
        window.location.reload();
      } else {
        setCompleteError(res.message || "Failed to complete campaign.");
      }
    } catch {
      setCompleteError("Failed to complete campaign.");
    } finally {
      setIsCompletingCampaign(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await import("@/services/advertiser.service").then((m) =>
        m.advertiserService.deleteCampaign(campaign.id)
      );
      if (res.success) {
        window.location.href = "/dashboard/campaigns";
      } else {
        setDeleteError(res.message || "Failed to delete campaign.");
      }
    } catch {
      setDeleteError("Failed to delete campaign.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Message for Complete Campaign */}
      {completeError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{completeError}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/campaigns"
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {campaign.title}
            </h1>
            <div className="flex items-center space-x-3 mt-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  campaign.status
                )}`}
              >
                {campaign.status}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                  campaign.type
                )}`}
              >
                {campaign.type}
              </span>
            </div>
          </div>
        </div>
        {/* Remove Chat button if no chosenPromoters */}
        <div className="flex items-center space-x-3">
          {/* Extend Deadline Button - only show if deadline is within a week and campaign is ongoing */}
          {isDeadlineWithinWeek() &&
            campaign.status === AdvertiserCampaignStatus.ONGOING && (
              <button
                onClick={() => setShowExtendModal(true)}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                <ClockIcon className="h-4 w-4 mr-2" />
                Extend Deadline
              </button>
            )}
          {/* Complete Campaign Button for Consultant and Seller campaigns */}
          {canCompleteCampaign() && (
            <button
              onClick={handleCompleteCampaign}
              disabled={isCompletingCampaign}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {isCompletingCampaign ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <CheckCircleIcon className="h-4 w-4 mr-2" />
              )}
              {isCompletingCampaign ? "Completing..." : "Complete Campaign"}
            </button>
          )}
          {campaign.type === CampaignType.VISIBILITY &&
            shouldShowChatButton() && (
              <button
                onClick={onShareClick}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Link to Share
              </button>
            )}
          {campaign.campaign.discordInviteLink && (
            <Link
              href={campaign.campaign.discordInviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Join Discord
            </Link>
          )}
          {campaign.campaign.discordThreadUrl && (
            <Link
              href={campaign.campaign.discordThreadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Discord Thread
            </Link>
          )}
          {shouldShowChatButton() ? (
            <Link
              href={`/dashboard/messages/${campaignId}`}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Chat
            </Link>
          ) : campaign.chosenPromoters ? (
            <div className="flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm">
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Chat only available when campaign and promoters are active
            </div>
          ) : null}
          {/* Delete Icon Button - only if no chosenPromoters */}
          {!campaign.chosenPromoters && (
            <>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-red-500 hover:text-white hover:bg-red-600 rounded-full transition-colors"
                title="Delete Campaign"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                  />
                </svg>
              </button>
              {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">
                      Delete Campaign
                    </h2>
                    <p className="mb-4 text-gray-700">
                      Are you sure you want to delete this campaign? This action
                      cannot be undone.
                    </p>
                    {deleteError && (
                      <div className="mb-2 text-red-600 text-sm">
                        {deleteError}
                      </div>
                    )}
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                        disabled={isDeleting}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Extend Deadline Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Extend Campaign Deadline
            </h2>
            <p className="mb-4 text-gray-700">
              Choose how much time to add to your campaign deadline:
            </p>
            {extendError && (
              <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded">
                {extendError}
              </div>
            )}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleExtendDeadline(7)}
                disabled={isExtending}
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <div className="font-medium">One Week</div>
                <div className="text-sm text-gray-500">Add 7 days</div>
              </button>
              <button
                onClick={() => handleExtendDeadline(30)}
                disabled={isExtending}
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <div className="font-medium">One Month</div>
                <div className="text-sm text-gray-500">Add 30 days</div>
              </button>
              <button
                onClick={() => handleExtendDeadline(180)}
                disabled={isExtending}
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <div className="font-medium">Six Months</div>
                <div className="text-sm text-gray-500">Add 180 days</div>
              </button>
              <button
                onClick={() => handleExtendDeadline(365)}
                disabled={isExtending}
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <div className="font-medium">One Year</div>
                <div className="text-sm text-gray-500">Add 365 days</div>
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowExtendModal(false);
                  setExtendError(null);
                }}
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                disabled={isExtending}
              >
                Cancel
              </button>
            </div>
            {isExtending && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">
                  Extending deadline...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
