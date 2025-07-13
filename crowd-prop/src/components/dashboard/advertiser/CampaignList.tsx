'use client';

import { useState } from 'react';
import { AdvertiserCampaign, PromoterApplication } from '@/app/interfaces/advertiser-campaign';
import { CampaignType } from '@/app/enums/campaign-type';
import { CampaignStatus } from '@/app/enums/campaign-type';
import { ADVERTISER_CAMPAIGN_MOCKS } from '@/app/mocks/advertiser-campaign-mock';
import ApplicationReviewModal from './ApplicationReviewModal';
import { 
  Eye, 
  Users, 
  DollarSign, 
  Calendar, 
  MoreHorizontal,
  PlayCircle,
  PauseCircle,
  Settings,
  BarChart3,
  MessageCircle,
  ExternalLink,
  UserCheck,
  Clock
} from 'lucide-react';

interface CampaignListProps {
  campaigns: AdvertiserCampaign[];
}

export default function CampaignList({ campaigns }: CampaignListProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    campaign: AdvertiserCampaign | null;
    applications: PromoterApplication[];
  }>({
    isOpen: false,
    campaign: null,
    applications: [],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getStatusBadge = (status: CampaignStatus) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case CampaignStatus.ACTIVE:
        return `${baseClasses} bg-green-100 text-green-800`;
      case CampaignStatus.PAUSED:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case CampaignStatus.COMPLETED:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case CampaignStatus.EXPIRED:
        return `${baseClasses} bg-red-100 text-red-800`;
      case CampaignStatus.DRAFT:
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeBadge = (type: CampaignType) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (type) {
      case CampaignType.VISIBILITY:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case CampaignType.CONSULTANT:
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case CampaignType.SALESMAN:
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case CampaignType.SELLER:
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getProgressPercentage = (spent: number, total: number) => {
    return Math.min((spent / total) * 100, 100);
  };

  const getCampaignIcon = (type: CampaignType) => {
    switch (type) {
      case CampaignType.VISIBILITY:
        return Eye;
      case CampaignType.CONSULTANT:
        return Users;
      case CampaignType.SALESMAN:
        return DollarSign;
      case CampaignType.SELLER:
        return BarChart3;
      default:
        return Eye;
    }
  };

  const handleViewApplications = (campaign: AdvertiserCampaign) => {
    const applications = ADVERTISER_CAMPAIGN_MOCKS.helpers.getApplicationsByCampaignId(campaign.id);
    setModalState({
      isOpen: true,
      campaign,
      applications,
    });
  };

  const handleAcceptApplication = (applicationId: string) => {
    console.log('Accepting application:', applicationId);
    // TODO: Implement accept logic
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleRejectApplication = (applicationId: string) => {
    console.log('Rejecting application:', applicationId);
    // TODO: Implement reject logic
    // Remove the application from the modal
    setModalState(prev => ({
      ...prev,
      applications: prev.applications.filter(app => app.id !== applicationId)
    }));
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      campaign: null,
      applications: [],
    });
  };

  const handleSendMessage = (campaign: AdvertiserCampaign) => {
    console.log('Send message for campaign:', campaign.id);
    // TODO: Open message modal or navigate to messages
  };

  const handleJoinDiscord = (campaign: AdvertiserCampaign) => {
    if (campaign.discordInviteLink) {
      window.open(campaign.discordInviteLink, '_blank');
    }
  };

  const handleViewPromoters = (campaign: AdvertiserCampaign) => {
    console.log('View promoters for campaign:', campaign.id);
    // TODO: Open modal with promoters list
  };

  if (campaigns.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
        <p className="text-gray-500 mb-4">
          No campaigns match your current filters. Try adjusting your search criteria.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create New Campaign
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {campaigns.map((campaign) => {
          const Icon = getCampaignIcon(campaign.type);
          const progressPercentage = getProgressPercentage(campaign.spentAmount, campaign.totalBudget);
          
          return (
            <div
              key={campaign.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                {/* Campaign Info */}
                <div className="flex items-start space-x-4 flex-1">
                  {/* Icon */}
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {campaign.title}
                      </h3>
                      <span className={getStatusBadge(campaign.status)}>
                        {campaign.status}
                      </span>
                      <span className={getTypeBadge(campaign.type)}>
                        {campaign.type}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {campaign.description}
                    </p>

                    {/* Campaign Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(campaign.totalBudget)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Spent</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(campaign.spentAmount)}
                        </p>
                      </div>
                      
                      {/* Visibility campaigns - show views instead of promoters in main metrics */}
                      {campaign.type === CampaignType.VISIBILITY ? (
                        <div>
                          <p className="text-xs text-gray-500">Views</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatNumber(campaign.currentViews || 0)}
                          </p>
                        </div>
                      ) : (
                        // Non-visibility campaigns logic
                        (() => {
                          // For private campaigns (consultant, salesman, seller), don't show promoter count
                          if (!campaign.isPublic) {
                            // For private campaigns with ongoing promoter, show campaign-specific metric
                            if (campaign.ongoingPromoter) {
                              if (campaign.type === CampaignType.CONSULTANT) {
                                return (
                                  <div>
                                    <p className="text-xs text-gray-500">Meetings</p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {campaign.ongoingPromoter.meetingsCompleted || 0}/{campaign.ongoingPromoter.totalMeetings || 0}
                                    </p>
                                  </div>
                                );
                              } else if (campaign.type === CampaignType.SALESMAN) {
                                return (
                                  <div>
                                    <p className="text-xs text-gray-500">Sales</p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {campaign.ongoingPromoter.salesGenerated || 0}
                                    </p>
                                  </div>
                                );
                              } else if (campaign.type === CampaignType.SELLER) {
                                return (
                                  <div>
                                    <p className="text-xs text-gray-500">Progress</p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {campaign.ongoingPromoter.deliverableProgress || '0/0'}
                                    </p>
                                  </div>
                                );
                              }
                            }
                            // For private campaigns without ongoing promoter, return empty div
                            return <div></div>;
                          } else {
                            // For public campaigns, show promoters
                            if (campaign.totalPromoters > 0) {
                              // Make it clickable if there are promoters
                              return (
                                <div>
                                  <p className="text-xs text-gray-500">Promoters</p>
                                  <button
                                    onClick={() => handleViewPromoters(campaign)}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                  >
                                    {campaign.totalPromoters}
                                  </button>
                                </div>
                              );
                            } else {
                              // Show regular count if no promoters
                              return (
                                <div>
                                  <p className="text-xs text-gray-500">Promoters</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {campaign.totalPromoters}
                                  </p>
                                </div>
                              );
                            }
                          }
                        })()
                      )}
                      
                      <div>
                        <p className="text-xs text-gray-500">Deadline</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(campaign.deadline)}
                        </p>
                      </div>
                    </div>

                    {/* Visibility campaigns - organized additional metrics */}
                    {campaign.type === CampaignType.VISIBILITY && (
                      <div className="mb-4 pt-3 border-t border-gray-100">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-900 flex items-center">
                              <Eye className="h-4 w-4 text-blue-600 mr-2" />
                              Campaign Performance
                            </h4>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-white rounded-md p-3">
                              <p className="text-xs text-gray-500 mb-1">Cost Per View</p>
                              <p className="text-lg font-semibold text-gray-900">
                                ${campaign.cpv?.toFixed(3) || '0.000'}
                              </p>
                            </div>
                            <div className="bg-white rounded-md p-3">
                              <p className="text-xs text-gray-500 mb-1">Target Views</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {campaign.maxViews ? formatNumber(campaign.maxViews) : 'Unlimited'}
                              </p>
                            </div>
                          </div>
                          
                          {/* Promoters section */}
                          {campaign.totalPromoters > 0 && (
                            <div className="bg-white rounded-md p-3 border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Users className="h-4 w-4 text-blue-600" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      See who&apos;s promoting your campaign
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {campaign.totalPromoters} active promoter{campaign.totalPromoters !== 1 ? 's' : ''}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleViewPromoters(campaign)}
                                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                                >
                                  View All
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Private Campaign State Management */}
                    {!campaign.isPublic && (
                      <div className="mb-4 pt-2 border-t border-gray-100">
                        {(() => {
                          
                          if (campaign.ongoingPromoter) {
                            // Show selected promoter info with campaign-specific details
                            return (
                              <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-3 flex-1">
                                    <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                                      <UserCheck className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <p className="text-sm font-medium text-gray-900">
                                          {campaign.ongoingPromoter.name}
                                        </p>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                          Active
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600 mb-2">
                                        Joined {formatDate(campaign.ongoingPromoter.joinedAt)}
                                      </p>
                                      
                                      {/* Campaign-specific information */}
                                      {campaign.type === CampaignType.CONSULTANT && (
                                        <div className="bg-white rounded p-2 mb-2">
                                          <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                              <span className="text-gray-500">Meetings:</span>
                                              <span className="ml-1 font-medium">
                                                {campaign.ongoingPromoter.meetingsCompleted}/{campaign.ongoingPromoter.totalMeetings}
                                              </span>
                                            </div>
                                            <div>
                                              <span className="text-gray-500">Next:</span>
                                              <span className="ml-1 font-medium">
                                                {campaign.ongoingPromoter.nextMeetingDate ? formatDate(campaign.ongoingPromoter.nextMeetingDate) : 'TBD'}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {campaign.type === CampaignType.SALESMAN && (
                                        <div className="bg-white rounded p-2 mb-2">
                                          <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                              <span className="text-gray-500">Sales:</span>
                                              <span className="ml-1 font-medium">
                                                {campaign.ongoingPromoter.salesGenerated || 0}
                                              </span>
                                            </div>
                                            <div>
                                              <span className="text-gray-500">Commission:</span>
                                              <span className="ml-1 font-medium">
                                                ${campaign.ongoingPromoter.totalCommission?.toFixed(2) || '0.00'}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {campaign.type === CampaignType.SELLER && (
                                        <div className="bg-white rounded p-2 mb-2">
                                          <div className="text-xs">
                                            <div className="mb-1">
                                              <span className="text-gray-500">Progress:</span>
                                              <span className="ml-1 font-medium">
                                                {campaign.ongoingPromoter.deliverableProgress}
                                              </span>
                                            </div>
                                            {campaign.ongoingPromoter.deliverables && (
                                              <div>
                                                <span className="text-gray-500">Deliverables:</span>
                                                <span className="ml-1">
                                                  {campaign.ongoingPromoter.deliverables.join(', ')}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 ml-4">
                                    <button
                                      onClick={() => handleSendMessage(campaign)}
                                      className="flex items-center space-x-1 px-3 py-1 bg-white text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors text-xs"
                                    >
                                      <MessageCircle className="h-3 w-3" />
                                      <span>Message</span>
                                    </button>
                                    {campaign.discordInviteLink && (
                                      <button
                                        onClick={() => handleJoinDiscord(campaign)}
                                        className="flex items-center space-x-1 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                        <span>Discord</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          } else if (campaign.pendingApplicationsCount && campaign.pendingApplicationsCount > 0) {
                            // Show applications to review
                            return (
                              <div className="bg-amber-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                                      <Clock className="h-4 w-4 text-amber-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {campaign.pendingApplicationsCount} Application{campaign.pendingApplicationsCount !== 1 ? 's' : ''} Pending
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Review and select a promoter for this campaign
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleViewApplications(campaign)}
                                    className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm font-medium"
                                  >
                                    Review Applications
                                  </button>
                                </div>
                              </div>
                            );
                          } else {
                            // No applications yet
                            return (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <Users className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      Waiting for Applications
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      No promoters have applied yet
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })()}
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Budget Usage</span>
                        <span className="text-xs text-gray-700">
                          {progressPercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            progressPercentage > 80 
                              ? 'bg-red-500' 
                              : progressPercentage > 60 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Created {formatDate(campaign.createdAt)}</span>
                        </span>
                        {campaign.isPublic && (
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Public
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {campaign.status === CampaignStatus.ACTIVE && (
                    <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                      <PauseCircle className="h-4 w-4" />
                    </button>
                  )}
                  {campaign.status === CampaignStatus.PAUSED && (
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <PlayCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Settings className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Application Review Modal */}
      <ApplicationReviewModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        campaignTitle={modalState.campaign?.title || ''}
        applications={modalState.applications}
        onAcceptApplication={handleAcceptApplication}
        onRejectApplication={handleRejectApplication}
      />
    </div>
  );
}
