"use client";

import { PromoterApplicationInfo } from "@/app/interfaces/campaign/advertiser-campaign";
import {
  X,
  Star,
  Clock,
  Users,
  ExternalLink,
  Check,
  XIcon,
} from "lucide-react";
import Image from "next/image";

interface ApplicationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle: string;
  applications: PromoterApplicationInfo[];
  onAcceptApplication: (applicationId: string) => void;
  onRejectApplication: (applicationId: string) => void;
}

export default function ApplicationReviewModal({
  isOpen,
  onClose,
  campaignTitle,
  applications,
  onAcceptApplication,
  onRejectApplication,
}: ApplicationReviewModalProps) {
  if (!isOpen) return null;

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Applications
              </h3>
              <p className="text-gray-500">
                No promoters have applied to this campaign yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {applications.length} Application
                  {applications.length !== 1 ? "s" : ""} Received
                </h3>
                <p className="text-sm text-gray-500">
                  Select a promoter to work with on this campaign
                </p>
              </div>

              {applications.map((app) => (
                <div
                  key={app.promoter.id}
                  className="border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md hover:border-gray-300"
                >
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {app.promoter.avatarUrl ? (
                        <Image
                          src={app.promoter.avatarUrl}
                          alt={app.promoter.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        app.promoter.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {app.promoter.name}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="font-medium">
                                {app.promoter.rating || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-1" />
                              <span>
                                Joined {formatDate(app.promoter.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-gray-400 mr-1" />
                              <span>
                                {app.promoter.location ||
                                  "Location not specified"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleReject(app.promoter.id)}
                            className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                          >
                            <XIcon className="h-4 w-4 mr-1 inline" />
                            Reject
                          </button>
                          <button
                            onClick={() => handleAccept(app.promoter.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <Check className="h-4 w-4 mr-1 inline" />
                            Accept
                          </button>
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">
                          About
                        </h5>
                        <p className="text-sm text-gray-600 mb-3">
                          {app.promoter.bio || "No bio provided"}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                app.applicationStatus === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : app.applicationStatus === "ACCEPTED"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {app.applicationStatus}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Total Views
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatNumber(
                                app.promoter.totalViewsGenerated || 0
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Total Sales
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              ${formatNumber(app.promoter.totalSales || 0)}
                            </p>
                          </div>
                        </div>

                        {/* Application Message */}
                        {app.applicationMessage && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h6 className="font-medium text-gray-900 mb-2">
                              Application Message
                            </h6>
                            <p className="text-sm text-gray-600">
                              {app.applicationMessage}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Campaign Statistics */}
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Campaigns Done
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Visibility
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {app.promoter.numberOfVisibilityCampaignDone || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Consultant
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {app.promoter.numberOfConsultantCampaignDone || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Seller</p>
                            <p className="text-sm font-medium text-gray-900">
                              {app.promoter.numberOfSellerCampaignDone || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Salesman
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {app.promoter.numberOfSalesmanCampaignDone || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      {app.promoter.skills &&
                        app.promoter.skills.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">
                              Skills
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {app.promoter.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Social Links */}
                      <div className="flex items-center space-x-4">
                        {app.promoter.instagramUrl && (
                          <a
                            href={app.promoter.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Instagram
                          </a>
                        )}
                        {app.promoter.tiktokUrl && (
                          <a
                            href={app.promoter.tiktokUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            TikTok
                          </a>
                        )}
                        {app.promoter.youtubeUrl && (
                          <a
                            href={app.promoter.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            YouTube
                          </a>
                        )}
                        {app.promoter.twitterUrl && (
                          <a
                            href={app.promoter.twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Twitter
                          </a>
                        )}
                      </div>
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
