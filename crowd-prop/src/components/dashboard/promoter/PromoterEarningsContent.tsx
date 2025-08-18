'use client';

import { useState, useEffect } from 'react';
import EarningsOverviewCards from './earnings/EarningsOverviewCards';
import EarningsChart from './earnings/EarningsChart';
import EarningsStatisticsCards from './earnings/EarningsStatisticsCards';
import TransactionHistoryTable from './earnings/TransactionHistoryTable';
import CampaignEarningsTable from './earnings/CampaignEarningsTable';
import PayoutRequestModal from './earnings/PayoutRequestModal';
import { promoterEarningsService, EarningsOverview } from '@/services/promoter-earnings.service';

export default function PromoterEarningsContent() {
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [overview, setOverview] = useState<EarningsOverview | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'transactions'>('overview');

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      const data = await promoterEarningsService.getEarningsOverview();
      setOverview(data);
    } catch (error) {
      console.error('Error loading overview:', error);
    }
  };

  const handlePayoutSuccess = () => {
    // Reload overview data after successful payout
    loadOverview();
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', description: 'View your earnings summary and statistics' },
    { id: 'campaigns' as const, label: 'Campaign Breakdown', description: 'Detailed earnings by campaign' },
    { id: 'transactions' as const, label: 'Transaction History', description: 'Complete transaction log' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings & Payouts</h1>
          <p className="text-gray-600 mt-2">Track your earnings, view performance, and manage payouts</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowPayoutModal(true)}
            disabled={!overview || overview.currentBalance < overview.minimumThreshold}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Request Payout
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <EarningsOverviewCards />

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-left">
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs text-gray-500 hidden sm:block">{tab.description}</div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <>
            {/* Statistics Cards */}
            <EarningsStatisticsCards />
            
            {/* Earnings Chart */}
            <EarningsChart />
          </>
        )}

        {activeTab === 'campaigns' && (
          <>
            {/* Campaign Earnings Table */}
            <CampaignEarningsTable />
          </>
        )}

        {activeTab === 'transactions' && (
          <>
            {/* Transaction History */}
            <TransactionHistoryTable />
          </>
        )}
      </div>

      {/* Payout Request Modal */}
      <PayoutRequestModal
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        availableBalance={overview?.currentBalance || 0}
        minimumThreshold={overview?.minimumThreshold || 20}
        onSuccess={handlePayoutSuccess}
      />
    </div>
  );
}
