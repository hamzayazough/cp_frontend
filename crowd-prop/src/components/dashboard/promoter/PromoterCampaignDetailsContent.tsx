'use client';

import { useState } from 'react';
import Link from 'next/link';
import { routes } from '@/lib/router';
import {
  ArrowLeftIcon,
  EyeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  TagIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

interface PromoterCampaignDetailsContentProps {
  campaignId: string;
}

// Mock campaign data - in production, this would be fetched from your API
const mockCampaignData = {
  '1': {
    id: '1',
    title: 'KeepFit Health App Promotion',
    type: 'VISIBILITY',
    status: 'ONGOING',
    description: 'Help us promote our revolutionary health and fitness app to reach health-conscious millennials and Gen Z. We\'re looking for authentic promoters who genuinely care about fitness and wellness.',
    advertiser: {
      name: 'HealthTech Inc.',
      logo: '/api/placeholder/60/60',
      rating: 4.8,
      verified: true,
      description: 'Leading health technology company focused on making fitness accessible to everyone.',
      website: 'https://healthtech.com'
    },
    campaign: {
      budget: 10000,
      cpv: 0.05,
      maxViews: 200000,
      currentViews: 12700,
      deadline: '2025-07-15',
      startDate: '2025-06-01',
      targetAudience: 'Health-conscious millennials and Gen Z',
      platforms: ['Instagram', 'TikTok', 'YouTube'],
      requirements: [
        'Minimum 1K engaged followers',
        'Health/Fitness content niche',
        'Authentic engagement rate >3%',
        'Must disclose sponsored content'
      ]
    },
    earnings: {
      totalEarned: 635,
      viewsGenerated: 12700,
      conversionRate: 3.2,
      averageCPV: 0.05,
      projectedTotal: 850
    },
    trackingLink: 'https://crowdprop.com/r/keepfit-abc123',
    tags: ['Health', 'Fitness', 'Mobile App', 'Wellness'],
    joinedDate: '2025-06-01',
    lastActivity: '2025-07-01T08:30:00Z'
  }
};

export default function PromoterCampaignDetailsContent({ campaignId }: PromoterCampaignDetailsContentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  
  const campaign = mockCampaignData[campaignId as keyof typeof mockCampaignData];

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h2>
        <p className="text-gray-600 mb-6">The campaign you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
        <Link
          href={routes.dashboardCampaigns}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Campaigns
        </Link>
      </div>
    );
  }

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

  const getTypeColor = (type: string) => {
    switch (type) {
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

  const progress = (campaign.campaign.currentViews / campaign.campaign.maxViews) * 100;
  const daysLeft = Math.ceil((new Date(campaign.campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'performance', label: 'Performance', icon: EyeIcon },
    { id: 'requirements', label: 'Requirements', icon: CheckCircleIcon },
    { id: 'messages', label: 'Messages', icon: ChatBubbleLeftRightIcon }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={routes.dashboardCampaigns}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{campaign.title}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                {campaign.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(campaign.type)}`}>
                {campaign.type}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShareIcon className="h-4 w-4 mr-2" />
            Share Link
          </button>
          <Link
            href={routes.messageThread(campaignId)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
            Message Advertiser
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900">${campaign.earnings.totalEarned}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Views Generated</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.earnings.viewsGenerated.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.earnings.conversionRate}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Days Left</p>
              <p className="text-2xl font-bold text-gray-900">{daysLeft}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Campaign Progress</h3>
          <span className="text-sm text-gray-600">
            {campaign.campaign.currentViews.toLocaleString()} / {campaign.campaign.maxViews.toLocaleString()} views
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{progress.toFixed(1)}% complete</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Campaign Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Campaign Description</h3>
                <p className="text-gray-700 leading-relaxed">{campaign.description}</p>
              </div>

              {/* Advertiser Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Advertiser Information</h3>
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                    <BuildingOfficeIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{campaign.advertiser.name}</h4>
                      {campaign.advertiser.verified && (
                        <span className="text-blue-500 text-sm">✓ Verified</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{campaign.advertiser.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Rating: {campaign.advertiser.rating}/5</span>
                      <Link
                        href={campaign.advertiser.website}
                        className="text-blue-600 hover:text-blue-700 flex items-center"
                      >
                        <LinkIcon className="h-4 w-4 mr-1" />
                        Visit Website
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Campaign Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">${campaign.campaign.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost per View:</span>
                      <span className="font-medium">${campaign.campaign.cpv}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{new Date(campaign.campaign.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-medium">{new Date(campaign.campaign.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Audience</h3>
                  <p className="text-gray-700 mb-3">{campaign.campaign.targetAudience}</p>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Preferred Platforms:</p>
                    <div className="flex flex-wrap gap-2">
                      {campaign.campaign.platforms.map((platform) => (
                        <span key={platform} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center">
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
              
              {/* Performance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Average CPV</p>
                  <p className="text-xl font-bold text-gray-900">${campaign.earnings.averageCPV}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Projected Total</p>
                  <p className="text-xl font-bold text-gray-900">${campaign.earnings.projectedTotal}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Performance Score</p>
                  <p className="text-xl font-bold text-gray-900">85%</p>
                </div>
              </div>

              {/* Tracking Link */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Your Tracking Link</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={campaign.trackingLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(campaign.trackingLink)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Campaign Requirements</h3>
              <div className="space-y-3">
                {campaign.campaign.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="text-center py-8">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600 mb-4">Start a conversation with the advertiser</p>
              <Link
                href={routes.messageThread(campaignId)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Message
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share Your Tracking Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your unique tracking link:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={campaign.trackingLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(campaign.trackingLink)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Use this link to track your referrals and earn money for each valid view or conversion.
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
