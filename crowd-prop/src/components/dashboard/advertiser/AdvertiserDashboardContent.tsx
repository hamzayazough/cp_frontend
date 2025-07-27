"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdvertiserDashboard } from "@/hooks/useAdvertiserDashboard";
import { usePaymentManagement } from "@/hooks/usePaymentManagement";
import PaymentStatusCard from "@/components/payment/PaymentStatusCard";
import PaymentMethodsCard from "@/components/payment/PaymentMethodsCard";
import AddFundsModal from "@/components/payment/AddFundsModal";
import WithdrawFundsModal from "@/components/payment/WithdrawFundsModal";
import {
  EyeIcon,
  CurrencyDollarIcon,
  RectangleStackIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  PauseIcon,
  BanknotesIcon,
  PlusIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { PromoterCampaignStatus } from "@/app/interfaces/promoter-campaign";

interface AdvertiserDashboardContentProps {
  userName?: string;
}

export default function AdvertiserDashboardContent({
  userName,
}: AdvertiserDashboardContentProps) {
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  
  const {
    data: dashboardData,
    loading,
    error,
    refetch,
    pauseCampaign,
    resumeCampaign,
  } = useAdvertiserDashboard();

  // Add payment status check
  const { paymentStatus, walletBalance, isWalletLoading, refreshAll, withdrawFunds, transactions } = usePaymentManagement();

  const handleAddFundsSuccess = async (amount: number) => {
    console.log(`Successfully added $${amount} to wallet!`);
    
    await refreshAll();
  };

  const handlePauseCampaign = async (campaignId: string) => {
    try {
      const result = await pauseCampaign(campaignId);
      if (result.success) {
        alert("Campaign paused successfully!");
      } else {
        alert(`Failed to pause campaign: ${result.message}`);
      }
    } catch (err) {
      alert(
        `Error pausing campaign: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const handleResumeCampaign = async (campaignId: string) => {
    try {
      const result = await resumeCampaign(campaignId);
      if (result.success) {
        alert("Campaign resumed successfully!");
      } else {
        alert(`Failed to resume campaign: ${result.message}`);
      }
    } catch (err) {
      alert(
        `Error resuming campaign: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const handleWithdrawFunds = async (amount: number) => {
    try {
      await withdrawFunds({ amount });
      
      // If we get here, the withdrawal was successful (no error thrown)
      await refreshAll(); // This will refresh wallet, payment status, etc.
      refetch(); // Refresh dashboard data
      
      const fee = 5; // Standard withdrawal fee
      const netAmount = amount - fee;
      alert(`Withdrawal request submitted successfully! Processing time: 3-5 business days. Net amount after $5 fee: $${netAmount.toFixed(2)}`);
    } catch (err) {
      alert(
        `Error processing withdrawal: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading dashboard
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
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
        <p className="text-gray-500">No dashboard data available</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case PromoterCampaignStatus.ONGOING:
        return "bg-green-100 text-green-800";
      case PromoterCampaignStatus.AWAITING_REVIEW:
        return "bg-yellow-100 text-yellow-800";
      case PromoterCampaignStatus.COMPLETED:
        return "bg-blue-100 text-blue-800";
      case PromoterCampaignStatus.PAUSED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case PromoterCampaignStatus.ONGOING:
        return <PlayIcon className="h-4 w-4" />;
      case PromoterCampaignStatus.AWAITING_REVIEW:
        return <ClockIcon className="h-4 w-4" />;
      case PromoterCampaignStatus.COMPLETED:
        return <CheckCircleIcon className="h-4 w-4" />;
      case PromoterCampaignStatus.PAUSED:
        return <PauseIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {userName || "Advertiser"}! 🚀
        </h1>
        <p className="text-purple-100 mb-4">
          Your campaigns are performing well! Here&apos;s your business
          overview.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/dashboard/campaigns/create"
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
          >
            Create Campaign
          </Link>
          <Link
            href="/dashboard/profile"
            className="border border-white text-white px-4 py-2 rounded-lg font-medium hover:bg-white hover:text-purple-600 transition-colors"
          >
            Manage profile
          </Link>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Spent This Week
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(dashboardData.stats.spendingThisWeek)}
              </p>
              <p
                className={`text-sm flex items-center mt-1 ${
                  dashboardData.stats.spendingPercentageChange >= 0
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {dashboardData.stats.spendingPercentageChange >= 0 ? "+" : ""}
                {dashboardData.stats.spendingPercentageChange}% from last week
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Views Generated Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(dashboardData.stats.viewsToday)}
              </p>
              <p
                className={`text-sm flex items-center mt-1 ${
                  dashboardData.stats.viewsPercentageChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {dashboardData.stats.viewsPercentageChange >= 0 ? "+" : ""}
                {dashboardData.stats.viewsPercentageChange}% from yesterday
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <EyeIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Conversions This Week
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.stats.conversionsThisWeek}
              </p>
              <p
                className={`text-sm flex items-center mt-1 ${
                  dashboardData.stats.conversionsPercentageChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {dashboardData.stats.conversionsPercentageChange >= 0
                  ? "+"
                  : ""}
                {dashboardData.stats.conversionsPercentageChange}% from last
                week
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Payment Status
              </p>
              <p className="text-3xl font-bold text-green-600">
                Ready
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {dashboardData.stats.activeCampaigns} active campaigns
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Campaigns Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Active Campaigns
            </h2>
            <Link
              href="/dashboard/campaigns"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {dashboardData.activeCampaigns.length > 0 ? (
              dashboardData.activeCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">
                        {campaign.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1">
                          {campaign.status.replace("_", " ")}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePauseCampaign(campaign.id)}
                        className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Pause Campaign"
                      >
                        <PauseIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleResumeCampaign(campaign.id)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Resume Campaign"
                      >
                        <PlayIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatNumber(campaign.views)}
                      </div>
                      <div className="text-xs text-gray-500">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(campaign.spent)}
                      </div>
                      <div className="text-xs text-gray-500">Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {campaign.applications}
                      </div>
                      <div className="text-xs text-gray-500">Applications</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {campaign.conversions}
                      </div>
                      <div className="text-xs text-gray-500">Conversions</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Type: {campaign.type}</span>
                    <span>
                      Deadline:{" "}
                      {new Date(campaign.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <RectangleStackIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">
                  No active campaigns
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  You don&apos;t have any active campaigns yet. Start by
                  creating your first campaign.
                </p>
                <Link
                  href="/dashboard/campaigns/create"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Campaign
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Payment Management */}
        <div className="space-y-8">
          {/* Payment Status Card */}
          <PaymentStatusCard />
          
          {/* Payment Methods Management */}
          <PaymentMethodsCard />
        </div>

        {/* Right Column - Wallet & Messages */}
        <div className="space-y-8">
          {/* Wallet Overview - Only show if payment setup is complete */}
          {paymentStatus?.setupComplete && (
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
                      disabled={!walletBalance || walletBalance.currentBalance < 16} // Minimum $16 (1 minimum withdrawal + 5 fee + 10 remaining)
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              {walletBalance ? formatCurrency(walletBalance.currentBalance) : '$0.00'}
                            </div>
                            <div className="text-sm text-gray-600">
                              Available Balance
                            </div>
                          </div>
                          <BanknotesIcon className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              {walletBalance ? formatCurrency(walletBalance.totalSpent) : '$0.00'}
                            </div>
                            <div className="text-sm text-gray-600">
                              Total Spent
                            </div>
                          </div>
                          <RectangleStackIcon className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {walletBalance ? formatCurrency(walletBalance.totalDeposited) : '$0.00'}
                            </div>
                            <div className="text-sm text-gray-600">
                              Total Deposited
                            </div>
                          </div>
                          <ArrowUpIcon className="h-8 w-8 text-purple-600" />
                        </div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-orange-600">
                              {walletBalance ? formatCurrency(walletBalance.pendingCharges) : '$0.00'}
                            </div>
                            <div className="text-sm text-gray-600">
                              Pending Charges
                            </div>
                          </div>
                          <ClockIcon className="h-8 w-8 text-orange-600" />
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">
                          Recent Transactions
                        </h3>
                        {transactions.length > 3 && (
                          <button
                            onClick={() => setShowAllTransactions(!showAllTransactions)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {showAllTransactions ? 'Show Less' : 'Show More'}
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {transactions.length > 0 ? (
                          (showAllTransactions ? transactions : transactions.slice(0, 2)).map((transaction) => (
                            <div
                              key={transaction.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-full bg-green-100">
                                  <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {transaction.type === 'WALLET_DEPOSIT' ? 'Wallet Deposit' : transaction.type}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {transaction.description}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Status: {transaction.status} • {transaction.paymentMethod}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-green-600">
                                  +{formatCurrency(transaction.amount)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Gross: {formatCurrency(transaction.grossAmount)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(transaction.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h4 className="text-sm font-medium text-gray-900 mb-2">No transactions yet</h4>
                            <p className="text-sm text-gray-500">
                              Your transaction history will appear here once you start funding campaigns.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Setup Required Message - Show when payment setup is not complete */}
          {paymentStatus && !paymentStatus.setupComplete && (
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
                  <li>• Add a payment method using the card above</li>
                  <li>• Fund your wallet to start campaigns</li>
                  <li>• Monitor your spending and ROI</li>
                </ul>
              </div>
            </div>
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
    </div>
  );
}
