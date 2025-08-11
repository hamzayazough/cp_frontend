"use client";

import { useState, useEffect } from "react";
import {
  LinkIcon,
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { CampaignDeliverable } from "@/app/interfaces/campaign-work";
import { CampaignType } from "@/app/enums/campaign-type";
import { getPromoterDisplayName } from "@/utils/promoter-name";
import {
  CampaignAdvertiser,
  ChosenPromoterInfo,
  AdvertiserConsultantCampaignDetails,
  AdvertiserSellerCampaignDetails,
} from "@/app/interfaces/campaign/advertiser-campaign";
import { advertiserService } from "@/services/advertiser.service";
import { AdvertiserCampaignStatus } from "@/app/interfaces/dashboard/advertiser-dashboard";

interface AdvertiserPromoterLinksProps {
  campaign: CampaignAdvertiser;
  selectedPromoter?: ChosenPromoterInfo;
}

export default function AdvertiserPromoterLinks({
  campaign,
  selectedPromoter,
}: AdvertiserPromoterLinksProps) {
  const [deliverables, setDeliverables] = useState<CampaignDeliverable[]>([]);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<
    string | null
  >(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );
  const [newComments, setNewComments] = useState<{ [workId: string]: string }>(
    {}
  );
  const [markingFinished, setMarkingFinished] = useState<{
    [deliverableId: string]: boolean;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current deliverable's work
  const selectedDeliverable = deliverables.find(
    (d) => d.id === selectedDeliverableId
  );
  const currentWorks = selectedDeliverable?.promoterWork || [];

  // Load deliverables from the campaign
  useEffect(() => {
    const loadDeliverables = async () => {
      try {
        setLoading(true);
        setError(null);

        let campaignDeliverables: CampaignDeliverable[] = [];

        if (campaign.type === CampaignType.CONSULTANT) {
          const consultantDetails =
            campaign.campaign as AdvertiserConsultantCampaignDetails;
          campaignDeliverables = consultantDetails.expectedDeliverables || [];
        } else if (campaign.type === CampaignType.SELLER) {
          const sellerDetails =
            campaign.campaign as AdvertiserSellerCampaignDetails;
          campaignDeliverables = sellerDetails.deliverables || [];
        }

        // If a specific promoter is selected, filter their work within each deliverable
        if (selectedPromoter) {
          campaignDeliverables = campaignDeliverables.map((deliverable) => ({
            ...deliverable,
            promoterWork: deliverable.promoterWork || [],
          }));
        }

        setDeliverables(campaignDeliverables);

        // Auto-select first deliverable if available
        if (campaignDeliverables.length > 0 && !selectedDeliverableId) {
          setSelectedDeliverableId(campaignDeliverables[0].id || null);
        }
      } catch (err) {
        console.error("Error loading deliverables:", err);
        setError("Failed to load deliverables");
      } finally {
        setLoading(false);
      }
    };

    loadDeliverables();
  }, [campaign, selectedPromoter, selectedDeliverableId]);

  const addComment = async (workId: string) => {
    const commentText = newComments[workId]?.trim();
    if (!commentText || !selectedDeliverableId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await advertiserService.addCommentToWork(
        campaign.id,
        selectedDeliverableId,
        workId,
        commentText
      );

      if (response.data) {
        // Update the specific deliverable with updated work
        setDeliverables((prev) =>
          prev.map((d) =>
            d.id === selectedDeliverableId
              ? { ...d, promoterWork: response.data }
              : d
          )
        );
      }

      // Clear the comment input
      setNewComments((prev) => ({ ...prev, [workId]: "" }));
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const markDeliverableAsFinished = async (deliverableId: string) => {
    try {
      setMarkingFinished((prev) => ({ ...prev, [deliverableId]: true }));
      setError(null);

      const response = await advertiserService.markDeliverableAsFinished(
        campaign.id,
        deliverableId
      );

      if (response.success) {
        // Update the deliverable status
        setDeliverables((prev) =>
          prev.map((d) =>
            d.id === deliverableId ? { ...d, isFinished: true } : d
          )
        );
      }
    } catch (err) {
      console.error("Error marking deliverable as finished:", err);
      setError("Failed to mark deliverable as finished");
    } finally {
      setMarkingFinished((prev) => ({ ...prev, [deliverableId]: false }));
    }
  };

  const toggleComments = (workId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(workId)) {
        newSet.delete(workId);
      } else {
        newSet.add(workId);
      }
      return newSet;
    });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  // Only show for consultant and seller campaigns
  if (
    !(
      campaign.type === CampaignType.CONSULTANT ||
      campaign.type === CampaignType.SELLER
    )
  ) {
    return null;
  }

  // Only show if campaign status is ACTIVE or INACTIVE (ongoing or completed)
  if (
    !(
      campaign.status === AdvertiserCampaignStatus.ONGOING ||
      campaign.status === AdvertiserCampaignStatus.COMPLETED
    )
  ) {
    return null;
  }

  // Don't show if no promoters are chosen yet
  if (!campaign.chosenPromoters || campaign.chosenPromoters.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-center py-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">
          Promoter Work & Deliverables
        </h3>
        <span className="text-xs text-gray-600">
          {selectedPromoter
            ? `Work from ${getPromoterDisplayName(selectedPromoter.promoter)}`
            : `Work from all promoters`}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-xs">{error}</p>
        </div>
      )}

      {/* Deliverables Navigation */}
      {deliverables.length === 0 ? (
        <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
          <LinkIcon className="h-6 w-6 text-gray-400 mx-auto mb-1" />
          <p className="text-gray-500 font-medium text-xs">
            No deliverables assigned yet
          </p>
          <p className="text-gray-400 text-xs">
            {selectedPromoter
              ? "No deliverables found for this promoter"
              : "No deliverables have been set up for this campaign yet"}
          </p>
        </div>
      ) : (
        <>
          {/* Deliverable Tabs */}
          <div className="mb-3">
            <div className="border-b border-gray-200">
              <nav
                className="-mb-px flex space-x-4 overflow-x-auto scrollbar-hide pb-1 scroll-smooth"
                aria-label="Deliverables"
              >
                {deliverables.map((deliverable) => {
                  const workCount = deliverable.promoterWork?.length || 0;
                  const isSelected = selectedDeliverableId === deliverable.id;

                  return (
                    <button
                      key={deliverable.id}
                      onClick={() =>
                        setSelectedDeliverableId(deliverable.id || null)
                      }
                      className={`
                        whitespace-nowrap py-1.5 px-1 border-b-2 font-medium text-xs transition-colors flex-shrink-0
                        ${
                          isSelected
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }
                      `}
                    >
                      <div className="flex items-center space-x-1">
                        <span>
                          {deliverable.deliverable.replace(/_/g, " ")}
                        </span>
                        <span
                          className={`
                          inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium
                          ${
                            deliverable.isFinished
                              ? "bg-green-100 text-green-800"
                              : deliverable.isSubmitted
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-600"
                          }
                        `}
                        >
                          {deliverable.isFinished
                            ? "Complete"
                            : deliverable.isSubmitted
                            ? "Review"
                            : "Pending"}
                        </span>
                        {workCount > 0 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {workCount}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Selected Deliverable Content */}
          {selectedDeliverable && (
            <>
              {/* Deliverable Info */}
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">
                      {selectedDeliverable.deliverable.replace(/_/g, " ")}
                    </h4>
                    <div className="flex items-center space-x-3 text-xs text-gray-600">
                      <span>
                        Created:{" "}
                        {new Date(
                          selectedDeliverable.createdAt
                        ).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>
                        Work Submissions:{" "}
                        {selectedDeliverable.promoterWork?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`
                      inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${
                        selectedDeliverable.isFinished
                          ? "bg-green-100 text-green-800"
                          : selectedDeliverable.isSubmitted
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                    >
                      {selectedDeliverable.isFinished
                        ? "Completed"
                        : selectedDeliverable.isSubmitted
                        ? "Under Review"
                        : "Pending"}
                    </span>
                    {!selectedDeliverable.isFinished &&
                      selectedDeliverable.promoterWork &&
                      selectedDeliverable.promoterWork.length > 0 && (
                        <button
                          onClick={() =>
                            markDeliverableAsFinished(selectedDeliverable.id!)
                          }
                          disabled={markingFinished[selectedDeliverable.id!]}
                          className="flex items-center px-2 py-0.5 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          {markingFinished[selectedDeliverable.id!] ? (
                            <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-white mr-1"></div>
                          ) : (
                            <CheckIcon className="h-2 w-2 mr-1" />
                          )}
                          Mark as Finished
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Work Items List for Selected Deliverable */}
      {selectedDeliverable && (
        <div className="space-y-2">
          {currentWorks.length === 0 ? (
            <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
              <LinkIcon className="h-6 w-6 text-gray-400 mx-auto mb-1" />
              <p className="text-gray-500 font-medium text-xs">
                No work submitted for this deliverable
              </p>
              <p className="text-gray-400 text-xs">
                Promoter work submissions will appear here
              </p>
            </div>
          ) : (
            currentWorks.map((work) => (
              <div
                key={work.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors space-y-2"
              >
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-3 w-3 text-blue-600 flex-shrink-0" />
                  <a
                    href={work.promoterLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-blue-600 hover:text-blue-800 truncate text-xs font-medium"
                  >
                    {work.promoterLink}
                  </a>
                  <a
                    href={work.promoterLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                  </a>
                </div>

                {work.description && (
                  <p className="text-gray-600 text-xs pl-5">
                    {work.description}
                  </p>
                )}

                <div className="flex items-center justify-between pl-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>
                      Added: {new Date(work.createdAt).toLocaleDateString()}
                    </span>
                    {work.updatedAt !== work.createdAt && (
                      <span>
                        Updated: {new Date(work.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Comments toggle button */}
                  {work.comments && work.comments.length > 0 ? (
                    <button
                      onClick={() => toggleComments(work.id)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <ChatBubbleLeftEllipsisIcon className="h-3 w-3" />
                      <span>
                        {work.comments.length}
                      </span>
                      {expandedComments.has(work.id) ? (
                        <ChevronUpIcon className="h-2 w-2" />
                      ) : (
                        <ChevronDownIcon className="h-2 w-2" />
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleComments(work.id)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ChatBubbleLeftEllipsisIcon className="h-3 w-3" />
                      <span>Comment</span>
                    </button>
                  )}
                </div>

                {/* Comments section */}
                {expandedComments.has(work.id) && (
                  <div className="pl-5 mt-2 border-l-2 border-gray-200">
                    <div className="pl-2 space-y-2">
                      <h4 className="text-xs font-medium text-gray-700 mb-1">
                        Comments
                      </h4>

                      {/* Existing Comments */}
                      {work.comments && work.comments.length > 0 && (
                        <div className="space-y-2 mb-2">
                          {work.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm"
                            >
                              <div className="flex items-start gap-2">
                                <UserCircleIcon className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-medium text-gray-900">
                                      {comment.commentatorName || "You"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatRelativeTime(
                                        new Date(comment.createdAt)
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-700 leading-relaxed">
                                    {comment.commentMessage}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add New Comment */}
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={newComments[work.id] || ""}
                          onChange={(e) =>
                            setNewComments((prev) => ({
                              ...prev,
                              [work.id]: e.target.value,
                            }))
                          }
                          placeholder="Add a comment..."
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
                          disabled={loading}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              addComment(work.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => addComment(work.id)}
                          disabled={loading || !newComments[work.id]?.trim()}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-white"></div>
                          ) : (
                            <PaperAirplaneIcon className="h-2 w-2" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Info box */}
      <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <InformationCircleIcon className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-700 text-xs">
              <strong>Review and provide feedback:</strong> These are work
              deliverables submitted by your promoter(s). You can add comments
              to provide feedback and guide their work.
            </p>
            {campaign.type === CampaignType.CONSULTANT ? (
              <ul className="text-blue-700 text-xs mt-1 ml-3 space-y-0.5">
                <li>• Strategy documents and reports</li>
                <li>• Presentations and recommendations</li>
                <li>• Data analysis and campaign metrics</li>
                <li>• Marketing materials and designs</li>
                <li>• Live campaign examples and case studies</li>
              </ul>
            ) : (
              <ul className="text-blue-700 text-xs mt-1 ml-3 space-y-0.5">
                <li>• Product photos and promotional videos</li>
                <li>• Social media posts and campaigns</li>
                <li>• Store setup progress and screenshots</li>
                <li>• Sales reports and analytics</li>
                <li>• Customer testimonials and reviews</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
