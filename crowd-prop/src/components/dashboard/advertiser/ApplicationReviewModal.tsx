"use client";

import { PromoterApplicationInfo } from "@/app/interfaces/promoter-campaign";
import {
  getPromoterDisplayName,
  getPromoterInitials,
} from "@/utils/promoter-name";
import {
  X,
  Star,
  Users,
  Check,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ApplicationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle: string;
  applications: PromoterApplicationInfo[];
  onAcceptApplication: (applicationId: string) => void;
  onRejectApplication: (applicationId: string) => void;
  onRefresh?: () => void;
}

export default function ApplicationReviewModal({
  isOpen,
  onClose,
  campaignTitle,
  applications,
  onAcceptApplication,
  onRejectApplication,
  onRefresh,
}: ApplicationReviewModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const handleAccept = (applicationId: string) => {
    onAcceptApplication(applicationId);
    onRefresh?.(); // Refresh the campaign data
    onClose();
  };

  const handleReject = (applicationId: string) => {
    onRejectApplication(applicationId);
    // Don't close modal, just remove this application from view
  };

  const handleUserClick = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/user/${userId}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Review Applications</h2>
              <p className="text-blue-100 text-xs mt-0.5">{campaignTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 overflow-y-auto max-h-[calc(90vh-72px)]">
          {applications.length === 0 ? (
            <div className="text-center py-6">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                No Applications
              </h3>
              <p className="text-xs text-gray-500">
                No promoters have applied to this campaign yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  {applications.length} Application
                  {applications.length !== 1 ? "s" : ""} Received
                </h3>
                <p className="text-xs text-gray-500">
                  Select a promoter to work with on this campaign
                </p>
              </div>

              {applications.map((app) => (
                <div
                  key={app.promoter.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all bg-white"
                >
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      {/* Left: Avatar + Basic Info */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => handleUserClick(app.promoter.id, e)}
                          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer"
                          title={`View ${getPromoterDisplayName(
                            app.promoter
                          )}'s profile`}
                        >
                          {app.promoter.avatarUrl ? (
                            <Image
                              src={app.promoter.avatarUrl}
                              alt={getPromoterDisplayName(app.promoter)}
                              width={40}
                              height={40}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            getPromoterInitials(app.promoter)
                          )}
                        </button>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            {getPromoterDisplayName(app.promoter)}
                          </h4>
                          <div className="flex items-center space-x-3 text-xs text-gray-600">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 mr-1" />
                              <span>{app.promoter.rating || "N/A"}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-3 w-3 text-gray-400 mr-1" />
                              <span>{app.promoter.location || "Location not specified"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleReject(app.promoter.id)}
                          className="px-2 py-1 text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors text-xs font-medium"
                        >
                          <XIcon className="h-3 w-3 mr-1 inline" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleAccept(app.promoter.id)}
                          className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs font-medium"
                        >
                          <Check className="h-3 w-3 mr-1 inline" />
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Left Column: About & Message */}
                    <div className="md:col-span-1">
                      <div className="space-y-2">
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                            About
                          </h5>
                          <p className="text-xs text-gray-600 line-clamp-3">
                            {app.promoter.bio || "No bio provided"}
                          </p>
                        </div>
                        
                        {app.applicationMessage && (
                          <div>
                            <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                              Application Message
                            </h5>
                            <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
                              {app.applicationMessage}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle Column: Stats */}
                    <div className="md:col-span-1">
                      <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        Performance
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <p className="text-sm font-bold text-blue-600">
                            {formatNumber(app.promoter.totalViewsGenerated || 0)}
                          </p>
                          <p className="text-xs text-blue-500">Total Views Generated</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2 text-center">
                          <p className="text-sm font-bold text-green-600">
                            ${formatNumber(app.promoter.totalSales || 0)}
                          </p>
                          <p className="text-xs text-green-500">Total Sales Generated</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Campaign Experience */}
                    <div className="md:col-span-1">
                      <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        Campaign Experience
                      </h5>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Visibility:</span>
                          <span className="font-medium text-gray-700">{app.promoter.numberOfVisibilityCampaignDone || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Consultant:</span>
                          <span className="font-medium text-gray-700">{app.promoter.numberOfConsultantCampaignDone || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Seller:</span>
                          <span className="font-medium text-gray-700">{app.promoter.numberOfSellerCampaignDone || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Salesman:</span>
                          <span className="font-medium text-gray-700">{app.promoter.numberOfSalesmanCampaignDone || 0}</span>
                        </div>
                      </div>
                      
                      {/* Skills */}
                      {app.promoter.skills && app.promoter.skills.length > 0 && (
                        <div className="mt-2">
                          <h6 className="text-xs font-medium text-gray-700 mb-1">Skills</h6>
                          <div className="flex flex-wrap gap-1">
                            {app.promoter.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            {app.promoter.skills.length > 3 && (
                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                                +{app.promoter.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer: Social Links */}
                  {(app.promoter.instagramUrl || app.promoter.tiktokUrl || app.promoter.youtubeUrl || app.promoter.twitterUrl) && (
                    <div className="px-3 pb-2 border-t border-gray-100 pt-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-500">Social:</span>
                        {app.promoter.instagramUrl && (
                          <a
                            href={app.promoter.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center"
                          >
                            Instagram
                          </a>
                        )}
                        {app.promoter.tiktokUrl && (
                          <a
                            href={app.promoter.tiktokUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center"
                          >
                            TikTok
                          </a>
                        )}
                        {app.promoter.youtubeUrl && (
                          <a
                            href={app.promoter.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center"
                          >
                            YouTube
                          </a>
                        )}
                        {app.promoter.twitterUrl && (
                          <a
                            href={app.promoter.twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center"
                          >
                            Twitter
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
