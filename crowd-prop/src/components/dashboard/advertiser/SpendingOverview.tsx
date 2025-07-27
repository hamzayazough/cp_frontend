'use client';

import { useAdvertiserDashboard } from '@/hooks/useAdvertiserDashboard';
import { usePaymentManagement } from '@/hooks/usePaymentManagement';
import WalletOverviewCard from './WalletOverviewCard';
import BudgetMetricsCard from './BudgetMetricsCard';
import RecentTransactionsCard from './RecentTransactionsCard';
import {
  ExclamationTriangleIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

interface SpendingOverviewProps {
  showTransactionHistory?: boolean;
  showWalletOverview?: boolean;
  showBudgetMetrics?: boolean;
}

export default function SpendingOverview({
  showTransactionHistory = true,
  showWalletOverview = true,
  showBudgetMetrics = true,
}: SpendingOverviewProps) {
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refetch,
  } = useAdvertiserDashboard();

  const { paymentStatus } = usePaymentManagement();

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading spending data
              </h3>
              <p className="mt-1 text-sm text-red-700">{dashboardError}</p>
              <div className="mt-3">
                <button
                  onClick={refetch}
                  className="text-sm text-red-800 underline hover:text-red-900"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No spending data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Budget Metrics */}
      {showBudgetMetrics && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Budget & Spending Overview
          </h2>
          <BudgetMetricsCard
            spendingThisWeek={dashboardData.stats.spendingThisWeek}
            spendingPercentageChange={dashboardData.stats.spendingPercentageChange}
          />
        </div>
      )}

      {/* Wallet Overview and Transaction History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Wallet Overview */}
        {showWalletOverview && paymentStatus?.setupComplete && (
          <WalletOverviewCard
            onAddFundsSuccess={() => refetch()}
            onWithdrawSuccess={() => refetch()}
          />
        )}

        {/* Setup Required Message - Show when payment setup is not complete */}
        {showWalletOverview && paymentStatus && !paymentStatus.setupComplete && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-full">
                <BanknotesIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-900">
                  Complete Payment Setup
                </h3>
                <p className="text-sm text-amber-700">
                  Add a payment method to access your wallet and fund campaigns
                </p>
              </div>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-2">Next Steps:</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Add a payment method in your dashboard</li>
                <li>• Fund your wallet to start campaigns</li>
                <li>• Monitor your spending and ROI</li>
              </ul>
            </div>
          </div>
        )}

        {/* Transaction History */}
        {showTransactionHistory && (
          <RecentTransactionsCard
            showHeader={true}
            maxTransactions={5}
          />
        )}
      </div>

      {/* Full width transaction history if wallet overview is hidden */}
      {showTransactionHistory && !showWalletOverview && (
        <RecentTransactionsCard
          showHeader={true}
          maxTransactions={10}
        />
      )}
    </div>
  );
}
