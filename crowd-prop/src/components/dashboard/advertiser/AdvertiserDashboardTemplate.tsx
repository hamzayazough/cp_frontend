"use client";

import Link from "next/link";
import {
  CurrencyDollarIcon,
  EyeIcon,
  RectangleStackIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  PlayIcon,
  PauseIcon,
  UserGroupIcon,
  StarIcon,
  MapPinIcon,
  BanknotesIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { PromoterCampaignStatus } from "@/app/interfaces/promoter-campaign";

interface AdvertiserDashboardTemplateProps {
  userName?: string;
}

export default function AdvertiserDashboardTemplate({
  userName,
}: AdvertiserDashboardTemplateProps) {
  // Mock data for template
  const mockData = {
    stats: {
      spendingThisWeek: 2450.0,
      spendingPercentageChange: 12.5,
      viewsToday: 15420,
      viewsPercentageChange: 8.3,
      conversionsThisWeek: 34,
      conversionsPercentageChange: 18.7,
      activeCampaigns: 6,
      pendingApprovalCampaigns: 2,
    },
    activeCampaigns: [
      {
        id: "1",
        title: "Summer Fashion Collection 2024",
        type: "VISIBILITY" as const,
        status: PromoterCampaignStatus.ONGOING as const,
        views: 12450,
        spent: 850.0,
        applications: 23,
        conversions: 8,
        deadline: "2024-08-15",
        createdAt: "2024-07-01",
        updatedAt: "2024-07-05",
      },
      {
        id: "2",
        title: "Tech Product Launch",
        type: "SALESMAN" as const,
        status: "AWAITING_PROMOTER" as const,
        views: 8930,
        spent: 1200.0,
        applications: 15,
        conversions: 12,
        deadline: "2024-08-20",
        createdAt: "2024-07-02",
        updatedAt: "2024-07-04",
      },
    ],
    recommendedPromoters: [
      {
        id: "1",
        name: "Sarah Johnson",
        avatar: "",
        rating: 4.9,
        followers: 125000,
        specialties: ["Fashion", "Lifestyle", "Beauty"],
        location: "New York, NY",
        successRate: 95,
        averageViews: 25000,
        completedCampaigns: 47,
        priceRange: { min: 250, max: 800 },
        isVerified: true,
        languages: ["English", "Spanish"],
      },
      {
        id: "2",
        name: "Mike Chen",
        avatar: "",
        rating: 4.8,
        followers: 89000,
        specialties: ["Tech", "Gaming", "Reviews"],
        location: "San Francisco, CA",
        successRate: 92,
        averageViews: 18000,
        completedCampaigns: 32,
        priceRange: { min: 300, max: 1000 },
        isVerified: true,
        languages: ["English", "Chinese"],
      },
    ],
    wallet: {
      balance: {
        currentBalance: 5240.5,
        pendingCharges: 1200.0,
        totalSpent: 18450.0,
        totalDeposited: 25000.0,
        minimumBalance: 100.0,
      },
      campaignBudgets: {
        totalAllocated: 8500.0,
        totalUsed: 3260.0,
        pendingPayments: 450.0,
      },
      totalLifetimeSpent: 18450.0,
      totalAvailableBalance: 4040.5,
    },
    recentTransactions: [
      {
        id: "1",
        amount: -450.0,
        status: "COMPLETED" as const,
        date: "2024-07-05",
        campaign: "Summer Fashion Collection",
        campaignId: "1",
        promoter: "Sarah Johnson",
        type: "PROMOTER_PAYMENT" as const,
        paymentMethod: "WALLET" as const,
        description: "Payment for VISIBILITY campaign completion",
      },
      {
        id: "2",
        amount: 1000.0,
        status: "COMPLETED" as const,
        date: "2024-07-04",
        campaign: "Wallet Deposit",
        campaignId: "",
        type: "WALLET_DEPOSIT" as const,
        paymentMethod: "CREDIT_CARD" as const,
        description: "Wallet top-up via credit card",
      },
    ],
    recentMessages: [
      {
        id: "1",
        name: "Sarah Johnson",
        message:
          "I've completed the first phase of your fashion campaign. The engagement is looking great!",
        time: "2 hours ago",
        avatar: "",
        isRead: false,
        threadId: "1",
        senderType: "PROMOTER" as const,
        campaignId: "1",
      },
      {
        id: "2",
        name: "Mike Chen",
        message:
          "I'm interested in your tech product launch. Can we discuss the requirements?",
        time: "5 hours ago",
        avatar: "",
        isRead: false,
        threadId: "2",
        senderType: "PROMOTER" as const,
        campaignId: "2",
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case PromoterCampaignStatus.ONGOING:
        return "bg-green-100 text-green-800";
      case PromoterCampaignStatus.AWAITING_REVIEW:
        return "bg-yellow-100 text-yellow-800";
      case PromoterCampaignStatus.COMPLETED:
        return "bg-blue-100 text-blue-800";
      case PromoterCampaignStatus.PAUSED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ONGOING":
        return <PlayIcon className="h-4 w-4" />;
      case "AWAITING_PROMOTER":
        return <ClockIcon className="h-4 w-4" />;
      case "COMPLETED":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "PAUSED":
        return <PauseIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {userName || "Advertiser"}! 🚀
        </h1>
        <p className="text-blue-100 mb-4">
          Your campaigns are performing well! Here&apos;s your business
          overview.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/dashboard/campaigns"
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
          >
            Create Campaign
          </Link>
          <Link
            href="/dashboard/explore"
            className="border border-white text-white px-4 py-2 rounded-lg font-medium hover:bg-white hover:text-purple-600 transition-colors"
          >
            Find Promoters
          </Link>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Spent This Week
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(mockData.stats.spendingThisWeek)}
              </p>
              <p
                className={`text-sm flex items-center mt-1 ${
                  mockData.stats.spendingPercentageChange >= 0
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {mockData.stats.spendingPercentageChange >= 0 ? "+" : ""}
                {mockData.stats.spendingPercentageChange}% from last week
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Views Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(mockData.stats.viewsToday)}
              </p>
              <p
                className={`text-sm flex items-center mt-1 ${
                  mockData.stats.viewsPercentageChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {mockData.stats.viewsPercentageChange >= 0 ? "+" : ""}
                {mockData.stats.viewsPercentageChange}% from yesterday
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
              <p className="text-sm font-medium text-gray-600">
                Conversions This Week
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {mockData.stats.conversionsThisWeek}
              </p>
              <p
                className={`text-sm flex items-center mt-1 ${
                  mockData.stats.conversionsPercentageChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {mockData.stats.conversionsPercentageChange >= 0 ? "+" : ""}
                {mockData.stats.conversionsPercentageChange}% from last week
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
              <p className="text-sm font-medium text-gray-600">
                Active Campaigns
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {mockData.stats.activeCampaigns}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {mockData.stats.pendingApprovalCampaigns} pending approval
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
            <h2 className="text-xl font-bold text-gray-900">
              Active Campaigns
            </h2>
            <Link
              href="/dashboard/campaigns"
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
              <div
                key={campaign.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900">
                      {campaign.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        campaign.status
                      )}`}
                    >
                      {getStatusIcon(campaign.status)}
                      <span className="ml-1">
                        {campaign.status.replace("_", " ")}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <PauseIcon className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <PlayIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatNumber(campaign.views)}
                    </div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(campaign.spent)}
                    </div>
                    <div className="text-xs text-gray-500">Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {campaign.applications}
                    </div>
                    <div className="text-xs text-gray-500">Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {campaign.conversions}
                    </div>
                    <div className="text-xs text-gray-500">Conversions</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Type: {campaign.type}</span>
                  <span>
                    Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Promoters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Recommended Promoters
              </h2>
              <Link
                href="/dashboard/explore"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View All
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockData.recommendedPromoters.map((promoter) => (
                <div
                  key={promoter.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-500">
                        {promoter.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">
                          {promoter.name}
                        </h3>
                        {promoter.isVerified && (
                          <CheckCircleIcon className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          {promoter.rating}
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          {formatNumber(promoter.followers)}
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {promoter.location}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {promoter.specialties
                          .slice(0, 3)
                          .map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {specialty}
                            </span>
                          ))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {formatCurrency(promoter.priceRange.min)} -{" "}
                          {formatCurrency(promoter.priceRange.max)}
                        </span>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs">
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
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
                <h2 className="text-xl font-bold text-gray-900">
                  Wallet Overview
                </h2>
                <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Funds
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(mockData.wallet.balance.currentBalance)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Available Balance
                      </div>
                    </div>
                    <BanknotesIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(
                          mockData.wallet.campaignBudgets.totalAllocated
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Allocated
                      </div>
                    </div>
                    <RectangleStackIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  Recent Transactions
                </h3>
                <div className="space-y-3">
                  {mockData.recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.amount > 0
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {transaction.amount > 0 ? (
                            <ArrowUpIcon className="h-4 w-4 text-green-600" />
                          ) : (
                            <CurrencyDollarIcon className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {transaction.campaign}
                          </div>
                          <div className="text-sm text-gray-600">
                            {transaction.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-medium ${
                            transaction.amount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
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
                  href="/dashboard/messages"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockData.recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-500">
                        {message.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">
                          {message.name}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {message.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {message.message}
                      </p>
                      {!message.isRead && (
                        <div className="mt-1">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        </div>
                      )}
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
