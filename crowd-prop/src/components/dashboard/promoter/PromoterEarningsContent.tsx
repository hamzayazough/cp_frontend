'use client';

import { useState } from 'react';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

// Mock data
const mockEarningsData = {
  currentBalance: 2350.00,
  monthlyEarnings: 4180.00,
  totalEarnings: 18750.00,
  pendingEarnings: 680.00,
  thisMonthChange: 15.3,
  lastPayout: {
    amount: 1200.00,
    date: '2025-06-25',
    status: 'COMPLETED'
  }
};

const mockTransactions = [
  {
    id: '1',
    type: 'EARNING',
    campaign: 'KeepFit Health App',
    amount: 635.00,
    status: 'COMPLETED',
    date: '2025-07-01',
    description: 'Views milestone reached',
    campaignType: 'VISIBILITY'
  },
  {
    id: '2',
    type: 'EARNING',
    campaign: 'AI Web Service',
    amount: 320.00,
    status: 'PENDING',
    date: '2025-06-30',
    description: 'Sales commission',
    campaignType: 'SALESMAN'
  },
  {
    id: '3',
    type: 'PAYOUT',
    campaign: 'Wallet Withdrawal',
    amount: -1200.00,
    status: 'COMPLETED',
    date: '2025-06-25',
    description: 'Bank transfer to **** 1234',
    campaignType: 'PAYOUT'
  },
  {
    id: '4',
    type: 'EARNING',
    campaign: 'SechTrendz Consulting',
    amount: 1500.00,
    status: 'COMPLETED',
    date: '2025-06-22',
    description: 'Consulting milestone 2',
    campaignType: 'CONSULTANT'
  },
  {
    id: '5',
    type: 'EARNING',
    campaign: 'Eco-Friendly Products',
    amount: 125.00,
    status: 'COMPLETED',
    date: '2025-06-20',
    description: 'Performance bonus',
    campaignType: 'VISIBILITY'
  },
  {
    id: '6',
    type: 'EARNING',
    campaign: 'Fashion Brand Ambassador',
    amount: 85.00,
    status: 'PENDING',
    date: '2025-06-18',
    description: 'Content creation fee',
    campaignType: 'SELLER'
  }
];

const mockPayoutMethods = [
  {
    id: '1',
    type: 'BANK',
    name: 'Chase Bank',
    details: '**** **** **** 1234',
    isDefault: true,
    isVerified: true
  },
  {
    id: '2',
    type: 'PAYPAL',
    name: 'PayPal',
    details: 'user@email.com',
    isDefault: false,
    isVerified: true
  },
  {
    id: '3',
    type: 'STRIPE',
    name: 'Stripe Express',
    details: 'Connected',
    isDefault: false,
    isVerified: false
  }
];

const periods = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' }
];

export default function PromoterEarningsContent() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'PENDING':
        return <ClockIcon className="h-4 w-4" />;
      case 'FAILED':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case 'VISIBILITY':
        return 'bg-blue-100 text-blue-800';
      case 'SALESMAN':
        return 'bg-green-100 text-green-800';
      case 'CONSULTANT':
        return 'bg-purple-100 text-purple-800';
      case 'SELLER':
        return 'bg-orange-100 text-orange-800';
      case 'PAYOUT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePayout = () => {
    const amount = parseFloat(payoutAmount);
    if (amount > 0 && amount <= mockEarningsData.currentBalance) {
      // In a real app, this would call your payout API
      console.log('Processing payout:', amount);
      setShowPayoutModal(false);
      setPayoutAmount('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings & Payouts</h1>
          <p className="text-gray-600 mt-2">Manage your earnings and withdrawal settings</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowPayoutModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Request Payout
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Balance</p>
              <p className="text-3xl font-bold text-gray-900">${mockEarningsData.currentBalance.toFixed(2)}</p>
              <p className="text-sm text-blue-600 mt-1">Available for withdrawal</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BanknotesIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900">${mockEarningsData.monthlyEarnings.toFixed(2)}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +{mockEarningsData.thisMonthChange}% vs last month
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
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-900">${mockEarningsData.totalEarnings.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">All time</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-gray-900">${mockEarningsData.pendingEarnings.toFixed(2)}</p>
              <p className="text-sm text-yellow-600 mt-1">Awaiting review</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earnings Chart Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Earnings Trend</h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Earnings chart will be displayed here</p>
              <p className="text-sm text-gray-400">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        {/* Payout Methods */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Payout Methods</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Add Method
            </button>
          </div>
          <div className="space-y-4">
            {mockPayoutMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BanknotesIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{method.name}</p>
                    <p className="text-sm text-gray-600">{method.details}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.isDefault && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Default
                    </span>
                  )}
                  {method.isVerified ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Verified
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
            <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.type}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">{transaction.campaign}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCampaignTypeColor(transaction.campaignType)}`}>
                        {transaction.campaignType}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1">{transaction.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Request Payout</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (Max: ${mockEarningsData.currentBalance.toFixed(2)})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="0.00"
                    max={mockEarningsData.currentBalance}
                    min="1"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout Method
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {mockPayoutMethods.filter(m => m.isVerified).map(method => (
                    <option key={method.id} value={method.id}>
                      {method.name} - {method.details}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowPayoutModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayout}
                  disabled={!payoutAmount || parseFloat(payoutAmount) <= 0 || parseFloat(payoutAmount) > mockEarningsData.currentBalance}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Request Payout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
