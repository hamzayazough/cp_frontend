'use client';

import Link from 'next/link';
import { routes } from '@/lib/router';
import {
  EyeIcon,
  CurrencyDollarIcon,
  RectangleStackIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Mock data - in production, this would come from your API
const mockData = {
  stats: {
    earningsThisWeek: 1250,
    viewsToday: 375,
    salesThisWeek: 12,
    activeCampaigns: 8
  },
  activeCampaigns: [
    {
      id: '1',
      title: 'KeepFit Health App',
      type: 'VISIBILITY',
      status: 'ONGOING',
      views: 12700,
      earnings: 635,
      advertiser: 'HealthTech Inc.',
      deadline: '2025-07-15'
    },
    {
      id: '2',
      title: 'AI Web Service',
      type: 'SALESMAN',
      status: 'AWAITING_REVIEW',
      views: 4300,
      earnings: 320,
      advertiser: 'TechStart',
      deadline: '2025-07-20'
    },
    {
      id: '3',
      title: 'SechTrendz Consulting',
      type: 'CONSULTANT',
      status: 'ONGOING',
      views: 0,
      earnings: 1500,
      advertiser: 'Marketing Pro',
      deadline: '2025-08-01'
    }
  ],
  suggestedCampaigns: [
    {
      id: '4',
      title: 'Finance Insights Blog',
      type: 'VISIBILITY',
      cpv: 0.05,
      budget: 5000,
      advertiser: 'FinanceHub',
      tags: ['Finance', 'Content']
    },
    {
      id: '5',
      title: 'Eco Energy Promotion',
      type: 'SALESMAN',
      commission: 15,
      advertiser: 'GreenTech',
      tags: ['Sustainability', 'Sales']
    }
  ],
  transactions: [
    { id: 1, amount: 950, status: 'COMPLETED', date: '2025-06-28', campaign: 'KeepFit Health App' },
    { id: 2, amount: 436, status: 'PENDING', date: '2025-06-25', campaign: 'AI Web Service' },
    { id: 3, amount: 266, status: 'COMPLETED', date: '2025-06-22', campaign: 'SechTrendz Consulting' }
  ],
  messages: [
    {
      id: 1,
      name: 'Tracy Brown',
      message: 'Looking forward to our meeting this Thursday!',
      time: '8 Aug',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 2,
      name: 'Advertiser',
      message: 'Just updated the product version.',
      time: '28 Aug',
      avatar: '/api/placeholder/32/32'
    }
  ]
};

export default function PromoterDashboardContent() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return 'bg-green-100 text-green-800';
      case 'AWAITING_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return <ClockIcon className="h-4 w-4" />;
      case 'AWAITING_REVIEW':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Promoter! 🎯</h1>
        <p className="text-blue-100 mb-4">
          You&apos;re doing great! Here&apos;s your performance overview.
        </p>
        <div className="flex space-x-4">
          <Link
            href={routes.promoter.explore}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Explore Campaigns
          </Link>
          <Link
            href={routes.promoter.campaigns}
            className="border border-white text-white px-4 py-2 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
          >
            My Campaigns
          </Link>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Earnings This Week</p>
              <p className="text-3xl font-bold text-gray-900">${mockData.stats.earningsThisWeek}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +12% from last week
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Views Today</p>
              <p className="text-3xl font-bold text-gray-900">{mockData.stats.viewsToday}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +8% from yesterday
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
              <p className="text-sm font-medium text-gray-600">Sales This Week</p>
              <p className="text-3xl font-bold text-gray-900">{mockData.stats.salesThisWeek}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +25% from last week
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-3xl font-bold text-gray-900">{mockData.stats.activeCampaigns}</p>
              <p className="text-sm text-gray-600 mt-1">
                2 pending review
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <RectangleStackIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Campaigns Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Active Campaigns</h2>
            <Link
              href={routes.promoter.campaigns}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockData.activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                    <p className="text-sm text-gray-600">{campaign.advertiser}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      <span className="ml-1">{campaign.status.replace('_', ' ')}</span>
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {campaign.type}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Views Generated</p>
                    <p className="font-semibold">{campaign.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Earnings</p>
                    <p className="font-semibold text-green-600">${campaign.earnings}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Deadline</p>
                    <p className="font-semibold">{new Date(campaign.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={routes.promoter.campaignDetails(campaign.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
                  >
                    View Stats
                  </Link>
                  <Link
                    href={routes.promoter.messageThread(campaign.id)}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-200 transition-colors"
                  >
                    Send Message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Suggested Campaigns */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Suggested Campaigns</h2>
              <Link
                href={routes.promoter.explore}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                Explore More
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockData.suggestedCampaigns.map((campaign) => (
                <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                      <p className="text-sm text-gray-600">{campaign.advertiser}</p>
                      <div className="flex space-x-1 mt-2">
                        {campaign.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {campaign.type}
                    </span>
                  </div>
                  <div className="mb-3">
                    {campaign.type === 'VISIBILITY' && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">${campaign.cpv}</span> per view • 
                        <span className="font-medium"> ${campaign.budget}</span> budget
                      </p>
                    )}
                    {campaign.type === 'SALESMAN' && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{campaign.commission}%</span> commission per sale
                      </p>
                    )}
                  </div>
                  <Link
                    href={routes.promoter.campaignDetails(campaign.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
                  >
                    View Campaign
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wallet & Messages */}
        <div className="space-y-8">
          {/* Wallet Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Wallet Overview</h2>
                <Link
                  href={routes.promoter.earnings}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Current Balance</p>
                <p className="text-3xl font-bold text-gray-900">$2,350.00</p>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full">
                  Request Payout
                </button>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Recent Transactions</h3>
                <div className="space-y-3">
                  {mockData.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.campaign}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+${transaction.amount}</p>
                        <p className={`text-xs ${transaction.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                <Link
                  href={routes.promoter.messages}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockData.messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {message.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{message.name}</p>
                        <p className="text-xs text-gray-500">{message.time}</p>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
