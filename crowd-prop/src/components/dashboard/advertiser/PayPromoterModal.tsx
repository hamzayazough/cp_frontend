"use client";

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  AdvertiserConsultantCampaignDetails,
  AdvertiserSellerCampaignDetails,
  AdvertiserVisibilityCampaignDetails,
  AdvertiserSalesmanCampaignDetails,
  CampaignAdvertiser,
} from "@/app/interfaces/campaign/advertiser-campaign";
import { Promoter } from "@/app/interfaces/user";
import { formatCurrency } from "@/utils/currency";
import { getPromoterDisplayName } from "@/utils/promoter-name";
import { advertiserPaymentService } from "@/services/advertiser-payment.service";

interface PayPromoterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (amount: number) => void;
  campaign: CampaignAdvertiser;
  promoter: Promoter;
}

export default function PayPromoterModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  campaign,
  promoter,
}: PayPromoterModalProps) {
  console.log("PayPromoterModal component called with:", {
    isOpen,
    campaignTitle: campaign?.title,
    promoterName: promoter?.name,
    campaignType: campaign?.campaign?.type,
    fullCampaign: campaign,
    fullPromoter: promoter,
  });

  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  console.log("PayPromoterModal props:", {
    isOpen,
    campaign: campaign?.title || campaign?.title,
    promoter: promoter?.name,
  });

  // Get campaign budget info (with null checks)
  const campaignData = campaign;
  const campaignId = campaignData?.id;
  const campaignType = campaignData?.campaign?.type;
  const campaignDetails = campaignData?.campaign;

  // Extract budget values based on campaign type
  let minBudget = 0;
  let maxBudget = 0;

  if (campaignDetails) {
    switch (campaignDetails.type) {
      case "CONSULTANT":
        const consultantDetails =
          campaignDetails as AdvertiserConsultantCampaignDetails;
        minBudget = consultantDetails.minBudget || 0;
        maxBudget = consultantDetails.maxBudget || 0;
        break;
      case "SELLER":
        const sellerDetails =
          campaignDetails as AdvertiserSellerCampaignDetails;
        minBudget = sellerDetails.minBudget || 0;
        maxBudget = sellerDetails.maxBudget || 0;
        break;
      case "VISIBILITY":
        const visibilityDetails =
          campaignDetails as AdvertiserVisibilityCampaignDetails;
        minBudget = 0; // Visibility campaigns don't have min/max budget
        maxBudget = visibilityDetails.budgetAllocated || 0;
        break;
      case "SALESMAN":
        const salesmanDetails =
          campaignDetails as AdvertiserSalesmanCampaignDetails;
        minBudget = 0; // Salesman campaigns don't have min/max budget
        maxBudget = salesmanDetails.budgetAllocated || 0;
        break;
      default:
        minBudget = 0;
        maxBudget = 0;
    }
  }

  const spentBudget = campaignDetails?.spentBudget || 0;

  const remainingBudget = maxBudget - spentBudget;

  console.log("Budget values:", {
    campaignType,
    minBudget,
    maxBudget,
    spentBudget,
    remainingBudget,
    campaignDetails,
  });

  useEffect(() => {
    if (isOpen && campaignData && promoter) {
      // Set default payment amount to the spent budget or remaining budget, whichever is lower
      const defaultAmount = Math.min(spentBudget, remainingBudget);
      setPaymentAmount(defaultAmount > 0 ? defaultAmount : minBudget);
      setError(null);
    }
  }, [isOpen, spentBudget, remainingBudget, minBudget, campaignData, promoter]);

  // Early return if required props are missing
  if (!campaignData || !campaignId || !promoter || !promoter.id) {
    console.error("PayPromoterModal: Missing required props", {
      campaign: !!campaign,
      campaignData: !!campaignData,
      campaignId: campaignId,
      promoter: !!promoter,
      promoterId: !!promoter?.id,
    });
    return null;
  }

  const handlePaymentAmountChange = (value: number) => {
    setPaymentAmount(value);
    setError(null);
  };

  const validatePaymentAmount = (): string | null => {
    if (paymentAmount <= 0) {
      return "Payment amount must be greater than $0";
    }
    if (paymentAmount > remainingBudget) {
      return `Payment amount cannot exceed ${formatCurrency(
        remainingBudget
      )} (remaining budget)`;
    }
    if (spentBudget + paymentAmount > maxBudget) {
      return `Total payments cannot exceed ${formatCurrency(
        maxBudget
      )} (maximum budget)`;
    }
    return null;
  };

  const handlePayNow = async () => {
    const validationError = validatePaymentAmount();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Modal payment attempt:", {
        campaignId: campaignId,
        campaignIdType: typeof campaignId,
        promoterId: promoter.id,
        promoterIdType: typeof promoter.id,
        paymentAmount: paymentAmount,
        paymentAmountCents: Math.round(paymentAmount * 100),
      });

      await advertiserPaymentService.payPromoter(
        campaignId,
        promoter.id,
        Math.round(paymentAmount * 100) // Convert to cents
      );

      // Show success message
      setShowSuccess(true);

      // Call success callback
      onPaymentSuccess(paymentAmount);

      // Wait 2 seconds for user to see confirmation, then reload
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPaymentAmount(0);
    setError(null);
    setLoading(false);
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) {
    console.log("Modal not open, returning null");
    return null;
  }

  console.log("Modal should render now...");

  // Show success confirmation
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />

        {/* Success Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {formatCurrency(paymentAmount)} has been successfully paid to{" "}
                {getPromoterDisplayName(promoter)}.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  The page will refresh automatically to show updated payment
                  information.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm text-gray-600">
                  Refreshing page...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCardIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Pay Promoter
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Promoter Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Promoter
              </h4>
              <p className="text-lg font-semibold text-gray-900">
                {getPromoterDisplayName(promoter)}
              </p>
              <p className="text-sm text-gray-600">
                Campaign: {campaignData?.title || "Unknown Campaign"}
              </p>
            </div>

            {/* Budget Timeline */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-4">
                Payment Progress
              </h4>

              {/* Timeline Visual */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute top-3 left-0 right-0 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        (spentBudget / maxBudget) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                {/* Timeline Points */}
                <div className="relative flex justify-between items-center mb-6">
                  {/* Start Point */}
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white shadow-sm"></div>
                    <div className="mt-2 text-xs text-gray-600 text-center">
                      <div className="font-medium">$0</div>
                      <div>Start</div>
                    </div>
                  </div>

                  {/* Min Budget Point */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 border-white shadow-sm ${
                        spentBudget >= minBudget ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    ></div>
                    <div className="mt-2 text-xs text-gray-600 text-center">
                      <div className="font-medium">
                        {formatCurrency(minBudget)}
                      </div>
                      <div>Min</div>
                    </div>
                  </div>

                  {/* Current Point */}
                  {spentBudget > 0 &&
                    spentBudget !== minBudget &&
                    spentBudget !== maxBudget && (
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-sm"></div>
                        <div className="mt-2 text-xs text-gray-600 text-center">
                          <div className="font-medium">
                            {formatCurrency(spentBudget)}
                          </div>
                          <div>Current</div>
                        </div>
                      </div>
                    )}

                  {/* Max Budget Point */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 border-white shadow-sm ${
                        spentBudget >= maxBudget ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    ></div>
                    <div className="mt-2 text-xs text-gray-600 text-center">
                      <div className="font-medium">
                        {formatCurrency(maxBudget)}
                      </div>
                      <div>Max</div>
                    </div>
                  </div>
                </div>

                {/* Progress Summary */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Paid: {formatCurrency(spentBudget)}
                  </span>
                  <span className="text-blue-700 font-medium">
                    Remaining: {formatCurrency(remainingBudget)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Amount Input */}
            <div>
              <label
                htmlFor="paymentAmount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Payment Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="paymentAmount"
                  value={paymentAmount}
                  onChange={(e) =>
                    handlePaymentAmountChange(Number(e.target.value))
                  }
                  className="block w-full pl-7 pr-12 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-lg text-black"
                  placeholder="0.00"
                  min={0}
                  max={remainingBudget}
                  step="0.01"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => handlePaymentAmountChange(minBudget)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                >
                  {formatCurrency(minBudget)}
                </button>
                <button
                  onClick={() => handlePaymentAmountChange(remainingBudget)}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                  disabled={remainingBudget <= 0}
                >
                  {formatCurrency(remainingBudget)}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-900">
                      Payment Error
                    </h4>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Platform Fee Information */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <InformationCircleIcon className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> A portion of the payment will be
                    retained by the platform to cover transaction fees and
                    service costs.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleClose}
                disabled={loading}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayNow}
                disabled={loading || validatePaymentAmount() !== null}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                    Pay {formatCurrency(paymentAmount)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
