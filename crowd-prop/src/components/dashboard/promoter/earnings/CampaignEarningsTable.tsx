'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  EyeIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { promoterEarningsService, CampaignEarningsBreakdown } from '@/services/promoter-earnings.service';

interface CampaignEarningsTableProps {
  className?: string;
}

export default function CampaignEarningsTable({ className = '' }: CampaignEarningsTableProps) {
  const [campaigns, setCampaigns] = useState<CampaignEarningsBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Generate month/year options
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('en-US', { month: 'long' }),
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  const loadCampaignEarnings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await promoterEarningsService.getCampaignEarningsBreakdown(
        selectedMonth,
        selectedYear
      );
      setCampaigns(data);
    } catch (err) {
      console.error('Error loading campaign earnings:', err);
      setError('Failed to load campaign earnings');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadCampaignEarnings();
  }, [loadCampaignEarnings]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toLocaleString();
  };

  const getCampaignTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'VISIBILITY':
        return 'bg-blue-100 text-blue-800';
      case 'SALESMAN':
        return 'bg-green-100 text-green-800';
      case 'CONSULTANT':
        return 'bg-purple-100 text-purple-800';
      case 'SELLER':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCampaignType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  const getTotalStats = () => {
    return campaigns.reduce(
      (acc, campaign) => ({
        totalViews: acc.totalViews + campaign.viewsGenerated,
        totalGross: acc.totalGross + campaign.grossEarnings,
        totalNet: acc.totalNet + campaign.netEarnings,
        paidOut: acc.paidOut + (campaign.payoutExecuted ? campaign.netEarnings : 0),
      }),
      { totalViews: 0, totalGross: 0, totalNet: 0, paidOut: 0 }
    );
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h2 className="text-xl font-bold text-gray-900">Campaign Earnings Breakdown</h2>
          
          {/* Month/Year Selectors */}
          <div className="flex space-x-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadCampaignEarnings}
              className="mt-2 text-red-700 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="p-12 text-center">
          <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No earnings for this period</h3>
          <p className="text-gray-600">
            No campaign earnings found for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <EyeIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total Views</span>
                </div>
                <p className="text-2xl font-bold text-blue-900 mt-1">{formatViews(stats.totalViews)}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Gross Earnings</span>
                </div>
                <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(stats.totalGross)}</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Net Earnings</span>
                </div>
                <p className="text-2xl font-bold text-purple-900 mt-1">{formatCurrency(stats.totalNet)}</p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Paid Out</span>
                </div>
                <p className="text-2xl font-bold text-orange-900 mt-1">{formatCurrency(stats.paidOut)}</p>
              </div>
            </div>
          </div>

          {/* Campaign Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPV Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.campaignId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{campaign.campaignTitle}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getCampaignTypeColor(campaign.campaignType)}`}>
                          {formatCampaignType(campaign.campaignType)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{campaign.viewsGenerated.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{formatCurrency(campaign.cpvRate)}</span>
                      <span className="text-xs text-gray-500 block">per 100 views</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(campaign.grossEarnings)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-green-600">{formatCurrency(campaign.netEarnings)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {campaign.payoutExecuted ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Paid Out
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
