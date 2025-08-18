'use client';

import { useState, useEffect } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { promoterEarningsService } from '@/services/promoter-earnings.service';

interface EarningsChartProps {
  className?: string;
}

type Period = 'week' | 'month' | 'quarter' | 'year';

interface ChartData {
  labels: string[];
  earnings: number[];
  views: number[];
  campaigns: number[];
}

export default function EarningsChart({ className = '' }: EarningsChartProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const periods: { value: Period; label: string; limit: number }[] = [
    { value: 'week', label: 'Last 8 Weeks', limit: 8 },
    { value: 'month', label: 'Last 12 Months', limit: 12 },
    { value: 'quarter', label: 'Last 8 Quarters', limit: 8 },
    { value: 'year', label: 'Last 5 Years', limit: 5 },
  ];

  useEffect(() => {
    loadChartData();
  }, [selectedPeriod]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPeriod = periods.find(p => p.value === selectedPeriod);
      const limit = currentPeriod?.limit || 12;
      
      const data = await promoterEarningsService.getEarningsTrends(selectedPeriod, limit);
      setChartData(data);
    } catch (err) {
      console.error('Error loading chart data:', err);
      setError('Failed to load chart data');
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

  const getMaxEarnings = () => {
    if (!chartData || !chartData.earnings.length) return 0;
    return Math.max(...chartData.earnings);
  };

  const getBarHeight = (value: number) => {
    const max = getMaxEarnings();
    if (max === 0) return 0;
    return Math.max((value / max) * 100, 2); // Minimum 2% height for visibility
  };

  if (loading) {
    return (
      <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="animate-pulse">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Loading chart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Earnings Trend</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as Period)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
        <div className="h-64 bg-red-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-2">{error}</p>
            <button
              onClick={loadChartData}
              className="text-red-700 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Earnings Trend</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as Period)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
        >
          {periods.map(period => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
      </div>

      {!chartData || chartData.labels.length === 0 ? (
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No earnings data available</p>
            <p className="text-sm text-gray-400">Start promoting campaigns to see your earnings</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Chart */}
          <div className="h-64 flex items-end justify-between space-x-1">
            {chartData.labels.map((label, index) => (
              <div key={index} className="flex flex-col items-center flex-1 max-w-16">
                {/* Bar */}
                <div className="relative w-full bg-gray-100 rounded-t">
                  <div
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                    style={{ height: `${getBarHeight(chartData.earnings[index])}%` }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                      <div className="text-center">
                        <div>{formatCurrency(chartData.earnings[index])}</div>
                        <div className="text-gray-300">{chartData.views[index].toLocaleString()} views</div>
                        <div className="text-gray-300">{chartData.campaigns[index]} campaigns</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Label */}
                <div className="mt-2 text-xs text-gray-600 text-center transform -rotate-45 origin-center">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded"></div>
              <span className="text-gray-600">Earnings</span>
            </div>
            <div className="text-gray-500">
              Total: {formatCurrency(chartData.earnings.reduce((a, b) => a + b, 0))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
