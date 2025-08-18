'use client';

import { useState, useEffect } from 'react';
import {
  EyeIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { promoterEarningsService, EarningsStatistics } from '@/services/promoter-earnings.service';

interface EarningsStatisticsCardsProps {
  className?: string;
}

export default function EarningsStatisticsCards({ className = '' }: EarningsStatisticsCardsProps) {
  const [statistics, setStatistics] = useState<EarningsStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await promoterEarningsService.getEarningsStatistics();
      setStatistics(data);
    } catch (err) {
      console.error('Error loading statistics:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Current Month Stats */}
        <div>
          <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Year to Date Stats */}
        <div>
          <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadStatistics}
          className="mt-2 text-red-700 underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Month Performance */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(statistics.currentMonthStats.totalViews)}</p>
                <p className={`text-sm flex items-center mt-1 ${
                  statistics.currentMonthStats.viewsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  {formatPercentage(statistics.currentMonthStats.viewsGrowth)} vs last month
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
                <p className="text-sm font-medium text-gray-600">Estimated Earnings</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(statistics.currentMonthStats.estimatedEarnings)}</p>
                <p className="text-sm text-yellow-600 mt-1">Pending payout</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.currentMonthStats.activeCampaigns}</p>
                <p className="text-sm text-blue-600 mt-1">Currently promoting</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-3xl font-bold text-gray-900">{formatPercentage(statistics.currentMonthStats.viewsGrowth)}</p>
                <p className="text-sm text-gray-600 mt-1">Views growth</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ArrowTrendingUpIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Year to Date Performance */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Year to Date Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(statistics.yearToDateStats.totalEarnings)}</p>
                <p className="text-sm text-green-600 mt-1">Year to date</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(statistics.yearToDateStats.totalViews)}</p>
                <p className="text-sm text-blue-600 mt-1">Year to date</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <EyeIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payouts</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(statistics.yearToDateStats.totalPayouts)}</p>
                <p className="text-sm text-purple-600 mt-1">Withdrawn</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Monthly</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(statistics.yearToDateStats.averageMonthlyEarnings)}</p>
                <p className="text-sm text-orange-600 mt-1">Per month</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ArrowTrendingUpIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average CPV</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(statistics.performanceMetrics.averageCPV)}</p>
                <p className="text-sm text-gray-600 mt-1">Per 100 views</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.performanceMetrics.totalCampaignsParticipated}</p>
                <p className="text-sm text-blue-600 mt-1">Participated</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.performanceMetrics.successRate.toFixed(1)}%</p>
                <p className="text-sm text-purple-600 mt-1">Qualified for payout</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <StarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Score</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.performanceMetrics.engagementScore.toFixed(1)}</p>
                <p className="text-sm text-orange-600 mt-1">Out of 100</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ArrowTrendingUpIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
