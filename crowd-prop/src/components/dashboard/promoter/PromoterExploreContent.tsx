'use client';

import { useState } from 'react';
import Link from 'next/link';
import { routes } from '@/lib/router';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  TagIcon,
  StarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

// Mock data for available campaigns
const mockCampaigns = [
  {
    id: '1',
    title: 'Finance Insights Blog Promotion',
    type: 'VISIBILITY',
    description: 'Promote our finance education blog to reach financially conscious millennials and Gen Z.',
    advertiser: {
      name: 'FinanceHub Inc.',
      logo: '/api/placeholder/40/40',
      rating: 4.8,
      verified: true
    },
    budget: 5000,
    cpv: 0.05,
    maxViews: 100000,
    deadline: '2025-08-15',
    requirements: [
      'Min 1K followers',
      'Finance/Business niche',
      'Authentic engagement'
    ],
    tags: ['Finance', 'Education', 'Blog', 'Content'],
    postedDate: '2025-06-20',
    applicants: 23,
    featured: true
  },
  {
    id: '2',
    title: 'Eco Energy Product Sales',
    type: 'SALESMAN',
    description: 'Drive sales for our sustainable energy solutions targeting environmentally conscious homeowners.',
    advertiser: {
      name: 'GreenTech Solutions',
      logo: '/api/placeholder/40/40',
      rating: 4.6,
      verified: true
    },
    commission: 15,
    productPrice: 299,
    deadline: '2025-09-30',
    requirements: [
      'Sales experience',
      'Sustainability interest',
      'Strong communication'
    ],
    tags: ['Sustainability', 'Sales', 'Energy', 'Home'],
    postedDate: '2025-06-25',
    applicants: 15
  },
  {
    id: '3',
    title: 'SaaS Marketing Strategy Consulting',
    type: 'CONSULTANT',
    description: 'We need a marketing consultant to help develop our go-to-market strategy for our new SaaS platform.',
    advertiser: {
      name: 'CloudTech Startup',
      logo: '/api/placeholder/40/40',
      rating: 4.9,
      verified: false
    },
    budget: 8000,
    hourlyRate: 85,
    duration: '6 weeks',
    deadline: '2025-07-30',
    requirements: [
      '3+ years SaaS marketing',
      'B2B experience',
      'Strategy expertise'
    ],
    tags: ['SaaS', 'B2B', 'Strategy', 'Consulting'],
    postedDate: '2025-06-22',
    applicants: 8
  },
  {
    id: '4',
    title: 'Fashion Brand Content Creation',
    type: 'SELLER',
    description: 'Create compelling content and drive sales for our new sustainable fashion line.',
    advertiser: {
      name: 'EcoFashion Co.',
      logo: '/api/placeholder/40/40',
      rating: 4.7,
      verified: true
    },
    fixedFee: 2000,
    commission: 10,
    deadline: '2025-08-20',
    requirements: [
      'Fashion content creation',
      'Instagram/TikTok presence',
      'Sustainable fashion interest'
    ],
    tags: ['Fashion', 'Content', 'Sustainability', 'Social Media'],
    postedDate: '2025-06-28',
    applicants: 31,
    urgent: true
  },
  {
    id: '5',
    title: 'Tech Product Review Campaign',
    type: 'VISIBILITY',
    description: 'Review and promote our new productivity app to tech-savvy professionals.',
    advertiser: {
      name: 'ProductivityPro',
      logo: '/api/placeholder/40/40',
      rating: 4.5,
      verified: true
    },
    budget: 3000,
    cpv: 0.08,
    maxViews: 37500,
    deadline: '2025-07-25',
    requirements: [
      'Tech review experience',
      'Professional audience',
      'Video content preferred'
    ],
    tags: ['Technology', 'Productivity', 'Reviews', 'SaaS'],
    postedDate: '2025-06-30',
    applicants: 19
  }
];

const typeOptions = [
  { value: 'ALL', label: 'All Types' },
  { value: 'VISIBILITY', label: 'Visibility' },
  { value: 'SALESMAN', label: 'Sales' },
  { value: 'CONSULTANT', label: 'Consulting' },
  { value: 'SELLER', label: 'Content & Sales' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'deadline', label: 'Deadline Soon' },
  { value: 'budget', label: 'Highest Budget' },
  { value: 'applicants', label: 'Least Competition' }
];

export default function PromoterExploreContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

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

  const formatBudgetInfo = (campaign: typeof mockCampaigns[0]) => {
    switch (campaign.type) {
      case 'VISIBILITY':
        return `$${campaign.cpv} per view • $${campaign.budget?.toLocaleString()} budget`;
      case 'SALESMAN':
        return `${campaign.commission}% commission • $${campaign.productPrice} product`;
      case 'CONSULTANT':
        return `$${campaign.hourlyRate}/hour • ${campaign.duration}`;
      case 'SELLER':
        return `$${campaign.fixedFee} fixed + ${campaign.commission}% commission`;
      default:
        return 'Contact for details';
    }
  };

  const filteredAndSortedCampaigns = mockCampaigns
    .filter(campaign => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.advertiser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === 'ALL' || campaign.type === typeFilter;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'budget':
          return (b.budget || 0) - (a.budget || 0);
        case 'applicants':
          return a.applicants - b.applicants;
        default:
          return 0;
      }
    });

  const getDaysLeft = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore Campaigns</h1>
          <p className="text-gray-600 mt-2">Discover new opportunities to earn money</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            {filteredAndSortedCampaigns.length} campaigns available
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <EyeIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Visibility</p>
              <p className="text-lg font-semibold">
                {mockCampaigns.filter(c => c.type === 'VISIBILITY').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Sales</p>
              <p className="text-lg font-semibold">
                {mockCampaigns.filter(c => c.type === 'SALESMAN').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Consulting</p>
              <p className="text-lg font-semibold">
                {mockCampaigns.filter(c => c.type === 'CONSULTANT').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <TagIcon className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Content</p>
              <p className="text-lg font-semibold">
                {mockCampaigns.filter(c => c.type === 'SELLER').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns, companies, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
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

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-6">
        {filteredAndSortedCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
              campaign.featured ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-200'
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{campaign.title}</h3>
                    {campaign.featured && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                    {campaign.urgent && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 flex items-center">
                          {campaign.advertiser.name}
                          {campaign.advertiser.verified && (
                            <span className="ml-1 text-blue-500">✓</span>
                          )}
                        </p>
                        <div className="flex items-center">
                          <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 ml-1">
                            {campaign.advertiser.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(campaign.type)}`}>
                      {campaign.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {formatBudgetInfo(campaign)}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {getDaysLeft(campaign.deadline)} days left
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4">{campaign.description}</p>

              {/* Requirements */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {campaign.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {campaign.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{campaign.applicants} applicants</span>
                  <span>Posted {new Date(campaign.postedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-3">
                  <Link
                    href={routes.promoter.campaignDetails(campaign.id)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </Link>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedCampaigns.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search terms or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('ALL');
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
