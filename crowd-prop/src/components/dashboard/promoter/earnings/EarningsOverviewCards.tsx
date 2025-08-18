'use client';

import { useState, useEffect } from 'react';
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { promoterEarningsService, EarningsOverview } from '@/services/promoter-earnings.service';

interface EarningsOverviewCardsProps {
  className?: string;
}

export default function EarningsOverviewCards({ className = '' }: EarningsOverviewCardsProps) {
  const [overview, setOverview] = useState<EarningsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEarningsOverview();
  }, []);

  const loadEarningsOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await promoterEarningsService.getEarningsOverview();
      setOverview(data);
    } catch (err) {
      console.error('Error loading earnings overview:', err);
      setError('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-28"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadEarningsOverview}
          className="mt-2 text-red-700 underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!overview) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {/* Current Balance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Available Balance</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(overview.currentBalance)}</p>
            <p className="text-sm text-blue-600 mt-1">
              Min: {formatCurrency(overview.minimumThreshold)}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <BanknotesIcon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Pending Earnings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Earnings</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(overview.pendingBalance)}</p>
            <p className="text-sm text-yellow-600 mt-1">Processing...</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Total Earned */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Earned</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(overview.totalEarned)}</p>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              All time
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Last Payout */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Last Payout</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(overview.totalWithdrawn)}</p>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <CalendarDaysIcon className="h-4 w-4 mr-1" />
              {formatDate(overview.lastPayoutDate)}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <BanknotesIcon className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
