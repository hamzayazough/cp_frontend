"use client";

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CreditCardIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { CampaignFundingFeasibility } from "@/app/interfaces/payment";
import { advertiserPaymentService } from "@/services/advertiser-payment.service";
import { formatCurrency } from "@/utils/currency";
import AddFundsModal from "../../payment/AddFundsModal";

interface FundingVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  estimatedBudget: number; // Budget in dollars
  mode?: 'create' | 'increase'; // New prop to customize content
  currentMaxBudget?: number; // Current max budget for increase mode
}

export default function FundingVerificationModal({
  isOpen,
  onClose,
  onVerified,
  estimatedBudget,
  mode = 'create',
  currentMaxBudget = 0,
}: FundingVerificationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feasibility, setFeasibility] =
    useState<CampaignFundingFeasibility | null>(null);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [isRechecking, setIsRechecking] = useState(false);

  useEffect(() => {
    if (isOpen && estimatedBudget > 0) {
      checkFunding();
    }
  }, [isOpen, estimatedBudget]);

  const checkFunding = async () => {
    setLoading(true);
    setError(null);
    try {
      const result =
        await advertiserPaymentService.checkCampaignFundingFeasibility(
          Math.round(estimatedBudget * 100) // Convert dollars to cents
        );
      setFeasibility(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check funding");
    } finally {
      setLoading(false);
    }
  };

  const handleRecheck = async () => {
    setIsRechecking(true);
    await checkFunding();
    setIsRechecking(false);
  };

  const handleAddFundsSuccess = async () => {
    setShowAddFunds(false);
    // Recheck funding after successful addition
    await handleRecheck();
  };

  const handleClose = () => {
    setFeasibility(null);
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleCreateCampaign = () => {
    if (feasibility?.canAfford) {
      onVerified();
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCardIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {mode === 'increase' ? 'Verify Budget Increase' : 'Verify Campaign Funds'}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">
                  Checking your account balance...
                </p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-900">Error</h4>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
                <button
                  onClick={checkFunding}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : feasibility ? (
              <div className="space-y-6">
                {/* Campaign Budget Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    {mode === 'increase' ? 'Budget Increase' : 'Campaign Budget'}
                  </h4>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(feasibility.estimatedBudget)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {mode === 'increase' 
                      ? `Additional budget to be added (Current max: ${formatCurrency(currentMaxBudget)})`
                      : 'Estimated maximum budget for this campaign'
                    }
                  </p>
                </div>

                {/* Wallet Summary */}
                {feasibility.walletSummary && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-3">
                      Wallet Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Balance:</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(
                            feasibility.walletSummary.totalBalance
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Held for Existing Campaigns:
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(
                            feasibility.walletSummary.heldForExistingCampaigns
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Available for New Campaigns:
                        </span>
                        <span className="font-semibold text-blue-900">
                          {formatCurrency(feasibility.currentAvailableBalance)}
                        </span>
                      </div>
                      {feasibility.walletSummary.pendingTransactions > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Pending Transactions:
                          </span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(
                              feasibility.walletSummary.pendingTransactions
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Funding Status */}
                {feasibility.canAfford ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-green-900">
                          ✅ Sufficient Funds Available
                        </h4>
                        <p className="text-sm text-green-700 mt-1">
                          {mode === 'increase'
                            ? 'You have enough funds to increase the campaign budget. The additional amount will be held in your account.'
                            : 'You have enough funds to create this campaign. The maximum budget will be held when you create the campaign.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                      <h4 className="text-sm font-medium text-red-900">
                        Additional Funding Required
                      </h4>
                      <p className="text-sm text-red-700 mt-1">
                        You need {formatCurrency(feasibility.shortfallAmount)}{" "}
                        more to {mode === 'increase' ? 'increase the campaign budget' : 'fund this campaign'}.
                      </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Information Note - only show for create mode */}
                {mode === 'create' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <InformationCircleIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700">
                          <strong>How it works:</strong> When you create a
                          campaign, the maximum budget amount will be temporarily
                          held in your account to ensure promoters get paid.
                          Unused funds are released when the campaign ends.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleClose}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>

                  {feasibility.canAfford ? (
                    <button
                      onClick={handleCreateCampaign}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      {mode === 'increase' ? '✅ Increase Budget' : '✅ Create Campaign'}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleRecheck}
                        disabled={isRechecking}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isRechecking ? "Checking..." : "Recheck"}
                      </button>
                      <button
                        onClick={() => setShowAddFunds(true)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Add Funds
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Add Funds Modal */}
      <AddFundsModal
        isOpen={showAddFunds}
        onClose={() => setShowAddFunds(false)}
        onSuccess={handleAddFundsSuccess}
      />
    </>
  );
}
