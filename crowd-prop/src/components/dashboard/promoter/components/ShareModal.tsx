"use client";

import { VisibilityCampaignDetails } from "@/app/interfaces/campaign/promoter-campaign-details";

interface ShareModalProps {
  campaign: {
    campaign: VisibilityCampaignDetails;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({
  campaign,
  isOpen,
  onClose,
}: ShareModalProps) {
  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(campaign.campaign.trackingLink);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Share Your Tracking Link
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your unique tracking link:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={campaign.campaign.trackingLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Use this link to track your referrals and earn money for each valid
            view or conversion.
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
