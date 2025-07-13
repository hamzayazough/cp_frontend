'use client';

import { useState } from 'react';
import { PromoterApplication } from '@/app/interfaces/advertiser-campaign';
import { 
  X, 
  Star, 
  Clock, 
  DollarSign, 
  Users, 
  ExternalLink,
  Check,
  XIcon
} from 'lucide-react';

interface ApplicationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle: string;
  applications: PromoterApplication[];
  onAcceptApplication: (applicationId: string) => void;
  onRejectApplication: (applicationId: string) => void;
}

export default function ApplicationReviewModal({
  isOpen,
  onClose,
  campaignTitle,
  applications,
  onAcceptApplication,
  onRejectApplication
}: ApplicationReviewModalProps) {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getTotalFollowers = (followerCounts: { [key: string]: number } = {}) => {
    return Object.values(followerCounts).reduce((sum, count) => sum + (count || 0), 0);
  };

  const handleAccept = (applicationId: string) => {
    onAcceptApplication(applicationId);
    onClose();
  };

  const handleReject = (applicationId: string) => {
    onRejectApplication(applicationId);
    // Don't close modal, just remove this application from view
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Review Applications</h2>
              <p className="text-blue-100 text-sm mt-1">{campaignTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications</h3>
              <p className="text-gray-500">No promoters have applied to this campaign yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {applications.length} Application{applications.length !== 1 ? 's' : ''} Received
                </h3>
                <p className="text-sm text-gray-500">
                  Select a promoter to work with on this campaign
                </p>
              </div>

              {applications.map((app) => (
                <div
                  key={app.id}
                  className={`border rounded-xl p-6 transition-all hover:shadow-md ${
                    selectedApplication === app.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {app.promoterName.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {app.promoterName}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="font-medium">{app.promoterRating}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-1" />
                              <span>Applied {formatDate(app.appliedAt)}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-gray-400 mr-1" />
                              <span>{formatNumber(getTotalFollowers(app.followerCounts))} followers</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleReject(app.id)}
                            className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                          >
                            <XIcon className="h-4 w-4 mr-1 inline" />
                            Reject
                          </button>
                          <button
                            onClick={() => handleAccept(app.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <Check className="h-4 w-4 mr-1 inline" />
                            Accept
                          </button>
                        </div>
                      </div>

                      {/* Rate and Availability */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Proposed Rate</p>
                              <p className="font-semibold text-gray-900">
                                ${app.proposedRate}/hour
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-blue-600 mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Availability</p>
                              <p className="font-semibold text-gray-900">
                                {app.availability}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Application Message */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Application Message</h5>
                        <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                          {app.applicationMessage}
                        </p>
                      </div>

                      {/* Previous Work */}
                      {app.previousWorkExamples && app.previousWorkExamples.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Previous Work</h5>
                          <div className="flex flex-wrap gap-2">
                            {app.previousWorkExamples.map((work, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {work}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Social Media Links */}
                      {app.socialMediaLinks && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Social Media</h5>
                          <div className="flex space-x-3">
                            {app.socialMediaLinks.instagramUrl && (
                              <a
                                href={app.socialMediaLinks.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-3 py-1 bg-pink-100 text-pink-800 text-xs rounded-md hover:bg-pink-200 transition-colors"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Instagram
                              </a>
                            )}
                            {app.socialMediaLinks.tiktokUrl && (
                              <a
                                href={app.socialMediaLinks.tiktokUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-md hover:bg-gray-200 transition-colors"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                TikTok
                              </a>
                            )}
                            {app.socialMediaLinks.youtubeUrl && (
                              <a
                                href={app.socialMediaLinks.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-3 py-1 bg-red-100 text-red-800 text-xs rounded-md hover:bg-red-200 transition-colors"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                YouTube
                              </a>
                            )}
                            {app.socialMediaLinks.twitterUrl && (
                              <a
                                href={app.socialMediaLinks.twitterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-md hover:bg-blue-200 transition-colors"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Twitter
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
