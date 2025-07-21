"use client";

import { useState } from "react";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { CampaignUnion } from "@/app/interfaces/campaign/explore-campaign";

interface CampaignApplicationModalProps {
  campaign: CampaignUnion;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

export default function CampaignApplicationModal({
  campaign,
  onClose,
  onSubmit,
}: CampaignApplicationModalProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(message);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Apply for Campaign
            </h2>
            <p className="text-sm text-gray-600 mt-1">{campaign.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Campaign Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <ExclamationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">
                  Application Requirements
                </h3>
                <p className="text-sm text-blue-700">
                  This is a private campaign. Your application will be reviewed
                  by the advertiser before approval.
                </p>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="application-message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Application Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="application-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell the advertiser why you're the right fit for this campaign. Include your relevant experience, audience demographics, and how you plan to promote their product/service..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 50 characters. Be specific about your qualifications and
                approach.
              </p>
            </div>

            {/* Character count */}
            <div className="text-right">
              <span
                className={`text-xs ${
                  message.length < 50
                    ? "text-red-500"
                    : message.length > 500
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {message.length} characters
                {message.length < 50 && ` (${50 - message.length} more needed)`}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || message.trim().length < 50}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-4 h-4" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
