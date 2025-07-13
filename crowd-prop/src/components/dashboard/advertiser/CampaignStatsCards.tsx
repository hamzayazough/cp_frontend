'use client';

import { AdvertiserDashboardSummary } from '@/app/interfaces/advertiser-campaign';
import { TrendingUp, TrendingDown, DollarSign, Target, Users, BarChart3 } from 'lucide-react';

interface CampaignStatsCardsProps {
  summary: AdvertiserDashboardSummary;
}

export default function CampaignStatsCards({ summary }: CampaignStatsCardsProps) {
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return new Intl.NumberFormat('en-US').format(num);
  };

  const statsCards = [
    {
      title: 'Total Campaigns',
      value: summary.totalCampaigns || 0,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Target,
      description: `${summary.activeCampaigns || 0} active, ${summary.draftCampaigns || 0} draft`,
    },
    {
      title: 'Monthly Spend',
      value: formatCurrency(summary.monthlySpend),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: `${formatCurrency(summary.remainingBudget)} remaining`,
    },
    {
      title: 'Total Views',
      value: formatNumber(summary.totalViews),
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: BarChart3,
      description: `${summary.totalSales || 0} conversions`,
    },
    {
      title: 'Total Sales',
      value: formatNumber(summary.totalSales),
      change: '+18.5%',
      changeType: 'positive' as const,
      icon: Users,
      description: `${formatCurrency(summary.totalRevenue)} revenue`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center space-x-1 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
}
