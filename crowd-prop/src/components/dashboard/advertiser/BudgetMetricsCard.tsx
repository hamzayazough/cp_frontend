'use client';

import { CurrencyDollarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface BudgetMetricsCardProps {
  spendingThisWeek: number;
  spendingPercentageChange: number;
  className?: string;
}

export default function BudgetMetricsCard({
  spendingThisWeek,
  spendingPercentageChange,
  className = '',
}: BudgetMetricsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">
            Spent This Week
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(spendingThisWeek)}
          </p>
          <p
            className={`text-sm flex items-center mt-1 ${
              spendingPercentageChange >= 0
                ? "text-blue-600"
                : "text-green-600"
            }`}
          >
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            {spendingPercentageChange >= 0 ? "+" : ""}
            {spendingPercentageChange}% from last week
          </p>
        </div>
        <div className="p-3 bg-purple-100 rounded-full">
          <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
        </div>
      </div>
    </div>
  );
}
