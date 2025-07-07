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
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface PromoterDashboardTemplateProps {
  userName?: string;
}

export default function PromoterDashboardTemplate({ userName }: PromoterDashboardTemplateProps) {
  return (
    <div className="space-y-8">
      {/* API Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <InformationCircleIcon className="h-5 w-5 text-blue-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Dashboard Template</h3>
            <p className="mt-1 text-sm text-blue-700">
              This is a template view showing the dashboard structure. The API endpoints need to be implemented to display real data.
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userName || 'Promoter'}! 🎯</h1>
        <p className="text-blue-100 mb-4">
          Your dashboard is ready. Once the API is connected, you&apos;ll see your real performance data here.
        </p>
        <div className="flex space-x-4">
          <Link
            href={routes.dashboardExplore}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Explore Campaigns
          </Link>
          <Link
            href={routes.dashboardCampaigns}
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
              <p className="text-3xl font-bold text-gray-900">$0</p>
              <p className="text-sm text-gray-400 flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                Waiting for data...
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
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-400 flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                Waiting for data...
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
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-400 flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                Waiting for data...
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
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600 mt-1">
                0 pending review
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
              href={routes.dashboardCampaigns}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RectangleStackIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Campaigns</h3>
            <p className="text-gray-500 mb-4">
              Your active campaigns will appear here once you apply and get accepted.
            </p>
            <Link
              href={routes.dashboardExplore}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Explore Campaigns
            </Link>
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
                href={routes.dashboardExplore}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                Explore More
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Suggestions Yet</h3>
              <p className="text-gray-500 mb-4">
                Personalized campaign suggestions will appear here based on your profile and performance.
              </p>
              <Link
                href={routes.dashboardExplore}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Browse All Campaigns
              </Link>
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
                  href={routes.dashboardEarnings}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Available for Withdrawal</p>
                    <p className="text-2xl font-bold text-green-600">$0.00</p>
                    <p className="text-xs text-gray-500">View earnings (Monthly payout)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Pending Balance</p>
                    <p className="text-2xl font-bold text-yellow-600">$0.00</p>
                    <p className="text-xs text-gray-500">Need $20.00 to unlock</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Lifetime Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">$0.00</p>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">View Earnings:</span> $0.00
                    </div>
                    <div>
                      <span className="font-medium">Direct Earnings:</span> $0.00
                    </div>
                  </div>
                </div>
                
                <button 
                  disabled
                  className="w-full py-2 px-4 rounded-lg font-medium bg-gray-200 text-gray-500 cursor-not-allowed"
                >
                  Need $20.00 more (API Required)
                </button>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Recent Transactions</h3>
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No transactions yet</p>
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
                  href={routes.dashboardMessages}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <InformationCircleIcon className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No messages yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
