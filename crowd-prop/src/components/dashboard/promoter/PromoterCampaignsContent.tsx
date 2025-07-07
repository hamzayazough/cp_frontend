'use client';

import { useState } from 'react';
import Link from 'next/link';
import { routes } from '@/lib/router';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Mock data
const mockCampaigns = [
  {
    id: '1',
    title: 'KeepFit Health App Promotion',
    type: 'VISIBILITY',
    status: 'ONGOING',
    views: 12700,
    earnings: 635,
    advertiser: 'HealthTech Inc.',
    deadline: '2025-07-15',
    joinedDate: '2025-06-01',
    cpv: 0.05,
    description: 'Promote our new fitness app to health-conscious audiences',
    tags: ['Health', 'Fitness', 'Mobile App']
  },
  {
    id: '2',
    title: 'AI Web Service Marketing',
    type: 'SALESMAN',
    status: 'AWAITING_REVIEW',
    views: 4300,
    earnings: 320,
    advertiser: 'TechStart Inc.',
    deadline: '2025-07-20',
    joinedDate: '2025-06-10',
    commission: 15,
    description: 'Drive sales for our AI-powered web development platform',
    tags: ['AI', 'SaaS', 'Technology']
  },
  {
    id: '3',
    title: 'SechTrendz Marketing Consulting',
    type: 'CONSULTANT',
    status: 'ONGOING',
    views: 0,
    earnings: 1500,
    advertiser: 'Marketing Pro LLC',
    deadline: '2025-08-01',
    joinedDate: '2025-05-15',
    hourlyRate: 75,
    description: 'Provide marketing strategy consultation for tech startup',
    tags: ['Consulting', 'Marketing', 'Strategy']
  },
  {
    id: '4',
    title: 'Eco-Friendly Products Campaign',
    type: 'VISIBILITY',
    status: 'COMPLETED',
    views: 25000,
    earnings: 1250,
    advertiser: 'GreenLife Co.',
    deadline: '2025-06-30',
    joinedDate: '2025-05-01',
    cpv: 0.05,
    description: 'Promote sustainable lifestyle products',
    tags: ['Sustainability', 'Lifestyle', 'Products']
  },
  {
    id: '5',
    title: 'Fashion Brand Ambassador',
    type: 'SELLER',
    status: 'PENDING_APPROVAL',
    views: 0,
    earnings: 0,
    advertiser: 'StyleForward',
    deadline: '2025-08-15',
    joinedDate: '2025-06-25',
    description: 'Create content and drive sales for summer collection',
    tags: ['Fashion', 'Content Creation', 'Sales']
  }
];

const statusOptions = [
  { value: 'ALL', label: 'All Status' },
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'AWAITING_REVIEW', label: 'Awaiting Review' },
  { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PAUSED', label: 'Paused' }
];

const typeOptions = [
  { value: 'ALL', label: 'All Types' },
  { value: 'VISIBILITY', label: 'Visibility' },
  { value: 'SALESMAN', label: 'Salesman' },
  { value: 'CONSULTANT', label: 'Consultant' },
  { value: 'SELLER', label: 'Seller' }
];

export default function PromoterCampaignsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return 'bg-green-100 text-green-800';
      case 'AWAITING_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING_APPROVAL':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'PAUSED':
        return 'bg-red-100 text-red-800';
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
      case 'PENDING_APPROVAL':
        return <ClockIcon className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
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

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.advertiser.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || campaign.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getEarningsInfo = (campaign: typeof mockCampaigns[0]) => {
    switch (campaign.type) {
      case 'VISIBILITY':
        return `$${campaign.cpv} per view`;
      case 'SALESMAN':
        return `${campaign.commission}% commission`;
      case 'CONSULTANT':
        return `$${campaign.hourlyRate}/hour`;
      case 'SELLER':
        return 'Fixed fee + commission';
      default:
        return 'Variable';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
          <p className="text-gray-600 mt-2">Manage your active and completed campaigns</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href={routes.dashboardExplore}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Explore New Campaigns
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockCampaigns.filter(c => c.status === 'ONGOING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockCampaigns.filter(c => c.status === 'AWAITING_REVIEW' || c.status === 'PENDING_APPROVAL').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockCampaigns.reduce((sum, c) => sum + c.views, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${mockCampaigns.reduce((sum, c) => sum + c.earnings, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-4">
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-6">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Link
              href={routes.dashboardExplore}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Explore Campaigns
            </Link>
          </div>
        ) : (
          filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{campaign.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1">{campaign.status.replace('_', ' ')}</span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(campaign.type)}`}>
                        {campaign.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{campaign.advertiser}</p>
                    <p className="text-gray-700 mb-3">{campaign.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {campaign.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Views Generated</p>
                    <p className="font-semibold text-gray-900">{campaign.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Earnings</p>
                    <p className="font-semibold text-green-600">${campaign.earnings}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Rate</p>
                    <p className="font-semibold text-blue-600">{getEarningsInfo(campaign)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Deadline</p>
                    <p className="font-semibold text-gray-900 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(campaign.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Link
                    href={routes.dashboardCampaignDetails(campaign.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Details
                  </Link>
                  {campaign.status === 'ONGOING' && (
                    <Link
                      href={routes.messageThread(campaign.id)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Message Advertiser
                    </Link>
                  )}
                  {campaign.type === 'CONSULTANT' && campaign.status === 'ONGOING' && (
                    <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors font-medium">
                      Submit Work
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
