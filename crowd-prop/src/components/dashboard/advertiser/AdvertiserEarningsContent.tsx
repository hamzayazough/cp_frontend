'use client';

import { useAdvertiserDashboard } from '@/hooks/useAdvertiserDashboard';
import { usePaymentManagement } from '@/hooks/usePaymentManagement';
import SpendingOverview from './SpendingOverview';
import PaymentStatusCard from '@/components/payment/PaymentStatusCard';
import PaymentMethodsCard from '@/components/payment/PaymentMethodsCard';
import {
  ExclamationTriangleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

export default function AdvertiserEarningsContent() {
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
                Error loading campaign spending data
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Campaign Spending & Analytics
            </h1>
            <p className="text-gray-600">
              Monitor your advertising spend, budget performance, and financial analytics
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {dashboardData ? 
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(dashboardData.stats.totalSpent || 0)
                      : '$0.00'
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Campaigns</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {dashboardData?.stats.activeCampaigns || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Setup Cards - Show if setup is not complete */}
      {paymentStatus && !paymentStatus.setupComplete && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaymentStatusCard />
          <PaymentMethodsCard />
        </div>
      )}

      {/* Payment Setup Complete - Show full spending overview */}
      {paymentStatus?.setupComplete && (
        <SpendingOverview
          showTransactionHistory={true}
          showWalletOverview={true}
          showBudgetMetrics={true}
        />
      )}

      {/* Alternative view when no payment setup */}
      {!paymentStatus?.setupComplete && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-4">
              <BanknotesIcon className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Complete Payment Setup
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              To view your spending analytics and manage your campaign budgets, 
              please complete your payment setup first.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 max-w-lg mx-auto">
              <h4 className="font-medium text-gray-900 mb-3">What you&apos;ll get access to:</h4>
              <ul className="text-sm text-gray-700 space-y-2 text-left">
                <li className="flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Real-time spending analytics
                </li>
                <li className="flex items-center">
                  <ChartBarIcon className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                  Budget performance tracking
                </li>
                <li className="flex items-center">
                  <BanknotesIcon className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                  Wallet management and funding
                </li>
                <li className="flex items-center">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-indigo-500 mr-2 flex-shrink-0" />
                  Campaign ROI insights
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
