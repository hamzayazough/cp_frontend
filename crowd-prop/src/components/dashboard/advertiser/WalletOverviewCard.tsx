'use client';

import { useState } from 'react';
import { usePaymentManagement } from '@/hooks/usePaymentManagement';
import AddFundsModal from '@/components/payment/AddFundsModal';
import WithdrawFundsModal from '@/components/payment/WithdrawFundsModal';
import {
  BanknotesIcon,
  PlusIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';

interface WalletOverviewCardProps {
  onAddFundsSuccess?: (amount: number) => void;
  onWithdrawSuccess?: (amount: number) => void;
}

export default function WalletOverviewCard({
  onAddFundsSuccess,
  onWithdrawSuccess,
}: WalletOverviewCardProps) {
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  
  const { 
    paymentStatus, 
    walletBalance, 
    isWalletLoading, 
    refreshAll, 
    withdrawFunds 
  } = usePaymentManagement();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleAddFundsSuccess = async (amount: number) => {
    await refreshAll();
    onAddFundsSuccess?.(amount);
  };

  const handleWithdrawFunds = async (amount: number) => {
    try {
      await withdrawFunds({ amount });
      await refreshAll();
      
      const fee = 5;
      const netAmount = amount - fee;
      alert(`Withdrawal request submitted successfully! Processing time: 3-5 business days. Net amount after $5 fee: $${netAmount.toFixed(2)}`);
      
      onWithdrawSuccess?.(amount);
    } catch (err) {
      alert(
        `Error processing withdrawal: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  if (!paymentStatus?.setupComplete) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Wallet Overview
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!walletBalance || walletBalance.currentBalance < 16}
                title={
                  !walletBalance || walletBalance.currentBalance < 16
                    ? "Minimum $16 required (includes $5 withdrawal fee and $10 minimum balance)"
                    : "Withdraw funds from your wallet"
                }
              >
                <BanknotesIcon className="h-4 w-4 mr-1" />
                Withdraw
              </button>
              <button
                onClick={() => setShowAddFundsModal(true)}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Funds
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {isWalletLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-200 h-20 rounded-lg"></div>
                <div className="bg-gray-200 h-20 rounded-lg"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Primary Metrics - Most Important */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-green-600">
                        {walletBalance ? formatCurrency(walletBalance.currentBalance) : '$0.00'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Available Balance
                      </div>
                    </div>
                    <BanknotesIcon className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">
                        {walletBalance ? formatCurrency(walletBalance.totalSpent) : '$0.00'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Total Spent
                      </div>
                    </div>
                    <RectangleStackIcon className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Secondary Metrics - Less Prominent */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded border">
                    <div className="text-lg font-semibold text-gray-900">
                      {walletBalance ? formatCurrency(walletBalance.totalHeldForCampaign) : '$0.00'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Held for Campaigns
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-lg font-semibold text-gray-900">
                      {walletBalance ? formatCurrency(walletBalance.totalDeposited) : '$0.00'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Total Deposited
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-lg font-semibold text-gray-900">
                      {walletBalance ? formatCurrency(walletBalance.pendingCharges) : '$0.00'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Pending Charges
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Funds Modal */}
      <AddFundsModal
        isOpen={showAddFundsModal}
        onClose={() => setShowAddFundsModal(false)}
        onSuccess={(amount) => {
          handleAddFundsSuccess(amount);
          setShowAddFundsModal(false);
        }}
      />

      {/* Withdraw Funds Modal */}
      <WithdrawFundsModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onSuccess={(amount) => {
          handleWithdrawFunds(amount);
          setShowWithdrawModal(false);
        }}
        currentBalance={walletBalance?.currentBalance || 0}
      />
    </>
  );
}
