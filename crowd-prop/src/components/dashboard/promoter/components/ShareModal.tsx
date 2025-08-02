"use client";

import { useState } from "react";
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
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(campaign.campaign.trackingLink);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-black"
              />
              <button
                onClick={copyToClipboard}
                className={`px-3 py-2 text-white rounded-lg transition-colors text-sm ${
                  isCopied
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isCopied ? (
                  <span className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Copied!</span>
                  </span>
                ) : (
                  "Copy"
                )}
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
