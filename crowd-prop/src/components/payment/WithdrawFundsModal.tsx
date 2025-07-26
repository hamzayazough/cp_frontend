'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon, BanknotesIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { PAYMENT_CONSTANTS } from '@/app/const/payment-constants';
import { advertiserPaymentService } from '@/services/advertiser-payment.service';
import { WithdrawalLimits } from '@/app/interfaces/payment';
import { getWithdrawalEstimatedArrival } from '@/utils/date';

interface WithdrawFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
  currentBalance: number;
}

export default function WithdrawFundsModal({
  isOpen,
  onClose,
  onSuccess,
  currentBalance,
}: WithdrawFundsModalProps) {
  const [amount, setAmount] = useState<number>(50);
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [withdrawalLimits, setWithdrawalLimits] = useState<WithdrawalLimits | null>(null);
  const [limitsLoading, setLimitsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadWithdrawalLimits();
      setError(null);
      setAmount(50);
      setReason('');
    }
  }, [isOpen]);

  const loadWithdrawalLimits = async () => {
    try {
      setLimitsLoading(true);
      const limits = await advertiserPaymentService.getWithdrawalLimits();
      setWithdrawalLimits(limits);
    } catch (error) {
      console.error('Failed to load withdrawal limits:', error);
      // Use default limits if API fails
      setWithdrawalLimits({
        feeStructure: {
          standardFee: PAYMENT_CONSTANTS.WITHDRAWAL_FEE,
          freeWithdrawalThreshold: 500,
          minimumWithdrawal: PAYMENT_CONSTANTS.MINIMUM_WITHDRAWAL,
        },
        limits: {
          dailyLimit: PAYMENT_CONSTANTS.MAXIMUM_DAILY_WITHDRAWAL,
          remainingDailyLimit: PAYMENT_CONSTANTS.MAXIMUM_DAILY_WITHDRAWAL,
          maxWithdrawable: currentBalance - PAYMENT_CONSTANTS.MINIMUM_WALLET_BALANCE,
          recommendedMaxWithdrawal: currentBalance - PAYMENT_CONSTANTS.MINIMUM_WALLET_BALANCE,
        },
        campaignRestrictions: {
          activeCampaigns: 0,
          totalBudgetAllocated: 0,
          recommendedReserve: 0,
          canWithdrawFullBalance: true,
        },
        processingTime: `${PAYMENT_CONSTANTS.WITHDRAWAL_PROCESSING_DAYS} business days`,
        description: 'Default withdrawal limits',
      });
    } finally {
      setLimitsLoading(false);
    }
  };

  const calculateFee = (): number => {
    return withdrawalLimits?.feeStructure?.standardFee || PAYMENT_CONSTANTS.WITHDRAWAL_FEE;
  };

  const calculateNetAmount = (withdrawAmount: number): number => {
    return withdrawAmount - calculateFee();
  };

  const getMaxWithdrawable = (): number => {
    if (!withdrawalLimits) return 0;
    
    // Use the backend calculated max withdrawable amount
    return withdrawalLimits.limits.maxWithdrawable;
  };

  const validateAmount = (withdrawAmount: number): string | null => {
    if (!withdrawalLimits) return 'Loading limits...';
    
    if (withdrawAmount < withdrawalLimits.feeStructure.minimumWithdrawal) {
      return `Minimum withdrawal amount is $${withdrawalLimits.feeStructure.minimumWithdrawal}`;
    }
    
    if (withdrawAmount > withdrawalLimits.limits.dailyLimit) {
      return `Daily withdrawal limit is $${withdrawalLimits.limits.dailyLimit}`;
    }
    
    if (withdrawAmount > withdrawalLimits.limits.remainingDailyLimit) {
      return `Remaining daily limit is $${withdrawalLimits.limits.remainingDailyLimit}`;
    }
    
    const maxWithdrawable = withdrawalLimits.limits.maxWithdrawable;
    if (withdrawAmount > maxWithdrawable) {
      return `Maximum withdrawable amount is $${maxWithdrawable}`;
    }
    
    return null;
  };

  const handleWithdraw = async () => {
    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await advertiserPaymentService.withdrawFunds({
        amount,
        reason: reason || undefined,
      });

      if (response.success) {
        onSuccess(amount);
        onClose();
      } else {
        setError(response.message || 'Withdrawal failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process withdrawal');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount(50);
    setReason('');
    setError(null);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!isOpen) return null;

  const fee = calculateFee();
  const netAmount = calculateNetAmount(amount);
  const validationError = validateAmount(amount);
  const maxWithdrawable = getMaxWithdrawable();

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
              <div className="p-2 bg-red-100 rounded-lg">
                <BanknotesIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Withdraw Funds
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {limitsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600">Loading withdrawal limits...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Balance */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Balance</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(currentBalance)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">Max Withdrawable</span>
                  <span className="text-sm font-medium text-red-600">
                    {formatCurrency(maxWithdrawable)}
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={withdrawalLimits?.feeStructure?.minimumWithdrawal || 1}
                    max={maxWithdrawable}
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-black"
                    placeholder="0.00"
                  />
                </div>
                
                {/* Quick amounts */}
                <div className="flex space-x-2 mt-2">
                  {[50, 100, 250, 500].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount)}
                      disabled={quickAmount > maxWithdrawable}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-black"
                    >
                      ${quickAmount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Withdrawal Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Withdrawal Amount</span>
                    <span className="text-yellow-700">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Processing Fee</span>
                    <span className="text-yellow-700">-{formatCurrency(fee)}</span>
                  </div>
                  <div className="border-t border-yellow-300 pt-1 flex justify-between font-medium">
                    <span className="text-yellow-800">You&apos;ll Receive</span>
                    <span className="text-yellow-800">{formatCurrency(netAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Business Rules Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Withdrawal Information</h4>
                    <ul className="text-sm text-blue-700 mt-1 space-y-1">
                      <li>• Processing time: 3-5 business days</li>
                      <li>• Estimated arrival: {getWithdrawalEstimatedArrival()}</li>
                      <li>• Daily limit: {formatCurrency(withdrawalLimits?.maximumDaily || 5000)}</li>
                      <li>• Minimum balance: {formatCurrency(withdrawalLimits?.minimumBalance || 10)} must remain</li>
                      <li>• Processing fee: {formatCurrency(withdrawalLimits?.withdrawalFee || 5)}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reason (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter reason for withdrawal..."
                />
              </div>

              {/* Error Message */}
              {(error || validationError) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-red-600">{error || validationError}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleWithdraw}
                  disabled={loading || !!validationError || amount <= 0}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Withdraw ${formatCurrency(netAmount)}`}
                </button>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
