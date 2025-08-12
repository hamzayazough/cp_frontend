"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
  CampaignWork,
  CampaignDeliverable,
} from "@/app/interfaces/campaign-work";
import { CampaignType } from "@/app/enums/campaign-type";
import { PromoterCampaignStatus } from "@/app/interfaces/promoter-campaign";
import {
  CampaignPromoter,
  ConsultantCampaignDetails,
  SellerCampaignDetails,
} from "@/app/interfaces/campaign/promoter-campaign-details";
import { promoterService } from "@/services/promoter.service";

interface PromoterLinksProps {
  campaign: CampaignPromoter;
  campaignType: string;
  campaignStatus: PromoterCampaignStatus;
}

export default function PromoterLinks({
  campaign,
  campaignType,
  campaignStatus,
}: PromoterLinksProps) {
  const [deliverables, setDeliverables] = useState<CampaignDeliverable[]>([]);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<
    string | null
  >(null);
  const [newLink, setNewLink] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [editingLinkValue, setEditingLinkValue] = useState("");
  const [editingDescriptionValue, setEditingDescriptionValue] = useState("");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );
  const [newComment, setNewComment] = useState<{ [workId: string]: string }>(
    {}
  );
  const [loadingComment, setLoadingComment] = useState<{
    [workId: string]: boolean;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current deliverable's work
  const selectedDeliverable = deliverables.find(
    (d) => d.id === selectedDeliverableId
  );
  const currentWorks = selectedDeliverable?.promoterWork || [];

  // Load existing deliverables from the campaign
  useEffect(() => {
    const loadDeliverables = async () => {
      try {
        setLoading(true);
        setError(null);

        if (campaign.campaign.type === CampaignType.CONSULTANT) {
          const consultantDetails =
            campaign.campaign as ConsultantCampaignDetails;
          const expectedDeliverables =
            consultantDetails.expectedDeliverables || [];
          setDeliverables(expectedDeliverables);
          // Auto-select first deliverable if available
          if (expectedDeliverables.length > 0 && !selectedDeliverableId) {
            setSelectedDeliverableId(expectedDeliverables[0].id || null);
          }
        } else if (campaign.campaign.type === CampaignType.SELLER) {
          const sellerDetails = campaign.campaign as SellerCampaignDetails;
          const deliverables = sellerDetails.deliverables || [];
          setDeliverables(deliverables);
          // Auto-select first deliverable if available
          if (deliverables.length > 0 && !selectedDeliverableId) {
            setSelectedDeliverableId(deliverables[0].id || null);
          }
        }
      } catch (err) {
        console.error("Error loading deliverables:", err);
        setError("Failed to load deliverables");
      } finally {
        setLoading(false);
      }
    };

    loadDeliverables();
  }, [campaign, selectedDeliverableId]);

  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      // Only allow http and https protocols to ensure it's a proper web link
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const formatUrlForDisplay = (url: string) => {
    // If URL doesn't start with http:// or https://, prepend https://
    if (!/^https?:\/\//i.test(url.trim())) {
      return `https://${url.trim()}`;
    }
    return url.trim();
  };

  const addPromoterLink = async () => {
    if (!newLink.trim() || !selectedDeliverableId) return;

    // Format the URL to include protocol if missing
    const formattedUrl = formatUrlForDisplay(newLink);

    if (!isValidUrl(formattedUrl)) {
      setError(
        "Please enter a valid web URL (e.g., https://example.com or www.example.com)"
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await promoterService.addCampaignWorkToDeliverable(
        campaign.id,
        selectedDeliverableId,
        formattedUrl,
        newDescription.trim() || undefined
      );

      if (response.data) {
        // Update the specific deliverable with new work
        setDeliverables((prev) =>
          prev.map((d) =>
            d.id === selectedDeliverableId
              ? { ...d, promoterWork: response.data }
              : d
          )
        );
      }

      setNewLink("");
      setNewDescription("");
    } catch (err) {
      console.error("Error adding campaign work:", err);
      setError("Failed to add work");
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaignWork = async (workId: string) => {
    if (!selectedDeliverableId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await promoterService.deleteCampaignWorkFromDeliverable(
        campaign.id,
        selectedDeliverableId,
        workId
      );

      if (response.data) {
        // Update the specific deliverable
        setDeliverables((prev) =>
          prev.map((d) =>
            d.id === selectedDeliverableId
              ? { ...d, promoterWork: response.data }
              : d
          )
        );
      }
    } catch (err) {
      console.error("Error deleting campaign work:", err);
      setError("Failed to delete work");
    } finally {
      setLoading(false);
    }
  };

  const startEditingWork = (work: CampaignWork) => {
    setEditingWorkId(work.id);
    setEditingLinkValue(work.promoterLink);
    setEditingDescriptionValue(work.description || "");
  };

  const saveEditedWork = async () => {
    if (
      editingWorkId === null ||
      !editingLinkValue.trim() ||
      !selectedDeliverableId
    )
      return;

    // Format the URL to include protocol if missing
    const formattedUrl = formatUrlForDisplay(editingLinkValue);

    if (!isValidUrl(formattedUrl)) {
      setError(
        "Please enter a valid web URL (e.g., https://example.com or www.example.com)"
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await promoterService.updateCampaignWorkInDeliverable(
        campaign.id,
        selectedDeliverableId,
        editingWorkId,
        formattedUrl,
        editingDescriptionValue.trim() || undefined
      );

      if (response.data) {
        // Update the specific deliverable
        setDeliverables((prev) =>
          prev.map((d) =>
            d.id === selectedDeliverableId
              ? { ...d, promoterWork: response.data }
              : d
          )
        );
      }

      setEditingWorkId(null);
      setEditingLinkValue("");
      setEditingDescriptionValue("");
    } catch (err) {
      console.error("Error updating campaign work:", err);
      setError("Failed to update work");
    } finally {
      setLoading(false);
    }
  };

  const cancelEditing = () => {
    setEditingWorkId(null);
    setEditingLinkValue("");
    setEditingDescriptionValue("");
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

  const addComment = async (workId: string) => {
    const commentMessage = newComment[workId]?.trim();
    if (!commentMessage || !selectedDeliverableId) return;

    try {
      setLoadingComment((prev) => ({ ...prev, [workId]: true }));
      setError(null);

      const response = await promoterService.addCommentToWork(
        campaign.id,
        selectedDeliverableId,
        workId,
        commentMessage
      );

      if (response.data) {
        // Update the specific deliverable with new work data including comments
        setDeliverables((prev) =>
          prev.map((d) =>
            d.id === selectedDeliverableId
              ? { ...d, promoterWork: response.data }
              : d
          )
        );
        // Clear the comment input
        setNewComment((prev) => ({ ...prev, [workId]: "" }));
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment");
    } finally {
      setLoadingComment((prev) => ({ ...prev, [workId]: false }));
    }
  };
  if (
    !(
      campaignType === CampaignType.CONSULTANT ||
      campaignType === CampaignType.SELLER
    ) ||
    campaignStatus !== PromoterCampaignStatus.ONGOING
  ) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          Submit Work
        </h3>
        <span className="text-xs text-gray-500">
          Add work for deliverables
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-xs">{error}</p>
        </div>
      )}

      {/* Deliverables Navigation */}
      {deliverables.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-md">
          <LinkIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm font-medium">
            No deliverables assigned
          </p>
          <p className="text-gray-400 text-xs">
            Deliverables will appear here once assigned
          </p>
        </div>
      ) : (
        <>
          {/* Deliverable Tabs */}
          <div className="mb-4">
            <div className="border-b border-gray-200">
              <nav
                className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide pb-1 scroll-smooth"
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
                            ? "border-purple-500 text-purple-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }
                      `}
                    >
                      <div className="flex items-center space-x-1.5">
                        <span>
                          {deliverable.deliverable.replace(/_/g, " ")}
                        </span>
                        <span
                          className={`
                          inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium
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
                            ? "Done"
                            : deliverable.isSubmitted
                            ? "Review"
                            : "Pending"}
                        </span>
                        {workCount > 0 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
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
              <div className="mb-3 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm mb-0.5">
                      {selectedDeliverable.deliverable.replace(/_/g, " ")}
                    </h4>
                    <div className="flex items-center space-x-3 text-xs text-gray-600">
                      <span>
                        {new Date(
                          selectedDeliverable.createdAt
                        ).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>
                        {selectedDeliverable.promoterWork?.length || 0} items
                      </span>
                    </div>
                  </div>
                  <span
                    className={`
                    inline-flex items-center px-2 py-1 rounded text-xs font-medium
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
                </div>
              </div>

              {/* Add New Work for Selected Deliverable */}
              <div className="mb-4">
                <div className="space-y-2">
                  <div className="flex gap-2 text-black">
                    <input
                      type="url"
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      placeholder={`Add work link for ${selectedDeliverable.deliverable
                        .replace(/_/g, " ")
                        .toLowerCase()}`}
                      className={`flex-1 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                        newLink.trim() &&
                        !isValidUrl(formatUrlForDisplay(newLink.trim()))
                          ? "border-red-300 bg-red-50"
                          : newLink.trim() &&
                            isValidUrl(formatUrlForDisplay(newLink.trim()))
                          ? "border-green-300 bg-green-50"
                          : "border-gray-300"
                      }`}
                      disabled={loading}
                    />
                    <button
                      onClick={addPromoterLink}
                      disabled={
                        !newLink.trim() ||
                        !isValidUrl(formatUrlForDisplay(newLink.trim())) ||
                        loading
                      }
                      className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                      ) : (
                        <PlusIcon className="h-3 w-3 mr-1" />
                      )}
                      Add
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Optional description"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-black"
                    disabled={loading}
                  />
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
            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-md">
              <LinkIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm font-medium">
                No work submitted
              </p>
              <p className="text-gray-400 text-xs">
                Add links to receive client feedback
              </p>
            </div>
          ) : (
            currentWorks.map((work) => (
              <div
                key={work.id}
                className="p-3 bg-gray-50 rounded-md border border-gray-200 space-y-2"
              >
                {editingWorkId === work.id ? (
                  // Edit mode
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={editingLinkValue}
                        onChange={(e) => setEditingLinkValue(e.target.value)}
                        className={`flex-1 px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-black ${
                          editingLinkValue.trim() &&
                          !isValidUrl(
                            formatUrlForDisplay(editingLinkValue.trim())
                          )
                            ? "border-red-300 bg-red-50"
                            : editingLinkValue.trim() &&
                              isValidUrl(
                                formatUrlForDisplay(editingLinkValue.trim())
                              )
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter URL"
                        autoFocus
                      />
                      <button
                        onClick={saveEditedWork}
                        disabled={
                          loading ||
                          !isValidUrl(
                            formatUrlForDisplay(editingLinkValue.trim())
                          )
                        }
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors disabled:opacity-50"
                      >
                        <CheckIcon className="h-3 w-3" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={loading}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={editingDescriptionValue}
                      onChange={(e) =>
                        setEditingDescriptionValue(e.target.value)
                      }
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-black"
                      placeholder="Optional description"
                    />
                  </div>
                ) : (
                  // View mode
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-3 w-3 text-purple-600 flex-shrink-0" />
                      <a
                        href={work.promoterLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-blue-600 hover:text-blue-800 truncate text-xs font-medium"
                      >
                        {work.promoterLink}
                      </a>
                      <button
                        onClick={() => startEditingWork(work)}
                        disabled={loading}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                      >
                        <PencilIcon className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => deleteCampaignWork(work.id)}
                        disabled={loading}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </div>

                    {work.description && (
                      <p className="text-gray-600 text-xs pl-5">
                        {work.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pl-5">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>
                          {new Date(work.createdAt).toLocaleDateString()}
                        </span>
                        {work.updatedAt !== work.createdAt && (
                          <span>
                            Updated: {new Date(work.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Comments toggle button */}
                      <button
                        onClick={() => toggleComments(work.id)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <ChatBubbleLeftEllipsisIcon className="h-3 w-3" />
                        {work.comments && work.comments.length > 0 ? (
                          <>
                            <span>{work.comments.length}</span>
                            {expandedComments.has(work.id) ? (
                              <ChevronUpIcon className="h-3 w-3" />
                            ) : (
                              <ChevronDownIcon className="h-3 w-3" />
                            )}
                          </>
                        ) : (
                          <>
                            <span>Comment</span>
                            {expandedComments.has(work.id) ? (
                              <ChevronUpIcon className="h-3 w-3" />
                            ) : (
                              <ChevronDownIcon className="h-3 w-3" />
                            )}
                          </>
                        )}
                      </button>
                    </div>

                    {/* Comments section */}
                    {expandedComments.has(work.id) && (
                      <div className="pl-5 mt-2 border-l-2 border-gray-200">
                        <div className="pl-2 space-y-2">
                          {work.comments && work.comments.length > 0 && (
                            <>
                              <h4 className="text-xs font-medium text-gray-700 mb-1">
                                Comments
                              </h4>
                              {work.comments.map((comment) => (
                                <div
                                  key={comment.id}
                                  className="bg-white p-2 rounded border border-gray-200 shadow-sm"
                                >
                                  <div className="flex items-start gap-2">
                                    <UserCircleIcon className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="text-xs font-medium text-gray-900">
                                          {comment.commentatorName || "Client"}
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
                            </>
                          )}

                          {/* Add comment section */}
                          <div className="mt-2">
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={newComment[work.id] || ""}
                                onChange={(e) =>
                                  setNewComment((prev) => ({
                                    ...prev,
                                    [work.id]: e.target.value,
                                  }))
                                }
                                placeholder="Add comment..."
                                className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-black"
                                disabled={loadingComment[work.id]}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    addComment(work.id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => addComment(work.id)}
                                disabled={
                                  !newComment[work.id]?.trim() ||
                                  loadingComment[work.id]
                                }
                                className={`p-1.5 rounded transition-colors disabled:cursor-not-allowed flex items-center justify-center h-8 w-8 ${
                                  newComment[work.id]?.trim()
                                    ? "bg-purple-600 hover:bg-purple-700"
                                    : "bg-gray-300 hover:bg-gray-400"
                                } disabled:bg-gray-200`}
                              >
                                {loadingComment[work.id] ? (
                                  <div
                                    className={`animate-spin rounded-full h-3 w-3 border-b-2 ${
                                      newComment[work.id]?.trim()
                                        ? "border-white"
                                        : "border-gray-600"
                                    }`}
                                  ></div>
                                ) : (
                                  <PaperAirplaneIcon className="h-3 w-3 text-white" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Helper text */}
      <div className="mt-3 p-2 bg-purple-50 rounded-md border border-purple-200">
        <p className="text-purple-700 text-xs">
          <strong>💡 Tip:</strong> Share links visible to your client for feedback:
        </p>
        {campaignType === CampaignType.CONSULTANT ? (
          <ul className="text-purple-700 text-xs mt-1 ml-3 space-y-0.5">
            <li>• Strategy docs, reports, presentations</li>
            <li>• Analytics, designs, campaign examples</li>
          </ul>
        ) : (
          <ul className="text-purple-700 text-xs mt-1 ml-3 space-y-0.5">
            <li>• Product photos, social posts, store setup</li>
            <li>• Sales reports, testimonials, reviews</li>
          </ul>
        )}
      </div>
    </div>
  );
}
