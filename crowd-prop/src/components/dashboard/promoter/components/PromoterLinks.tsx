"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { CampaignType } from "@/app/enums/campaign-type";
import { PromoterCampaignStatus } from "@/app/interfaces/promoter-campaign";
import { 
  CampaignPromoter, 
  ConsultantCampaignDetails, 
  SellerCampaignDetails 
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
  const [promoterLinks, setPromoterLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [editingLinkValue, setEditingLinkValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing links from the campaign or API
  useEffect(() => {
    const loadLinks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First check if campaign has promoterLinks in the campaign object
        if (campaign.campaign.type === CampaignType.CONSULTANT || 
            campaign.campaign.type === CampaignType.SELLER) {
          const campaignDetails = campaign.campaign as ConsultantCampaignDetails | SellerCampaignDetails;
          if (campaignDetails.promoterLinks) {
            setPromoterLinks(campaignDetails.promoterLinks);
          } else {
            // TODO: do something in this case
          }
        }
      } catch (err) {
        console.error("Error loading campaign links:", err);
        setError("Failed to load campaign links");
      } finally {
        setLoading(false);
      }
    };

    loadLinks();
  }, [campaign]);

  const addPromoterLink = async () => {
    if (!newLink.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await promoterService.addCampaignLink(campaign.id, newLink.trim());
      
      if (response.data) {
        setPromoterLinks(response.data);
      } else {
        setPromoterLinks([...promoterLinks, newLink.trim()]);
      }
      
      setNewLink("");
    } catch (err) {
      console.error("Error adding campaign link:", err);
      setError("Failed to add link");
    } finally {
      setLoading(false);
    }
  };

  const deletePromoterLink = async (index: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const linkToDelete = promoterLinks[index];
      const response = await promoterService.deleteCampaignLink(campaign.id, linkToDelete);
      
      if (response.data) {
        setPromoterLinks(response.data);
      } else {
        setPromoterLinks(promoterLinks.filter((_, i) => i !== index));
      }
    } catch (err) {
      console.error("Error deleting campaign link:", err);
      setError("Failed to delete link");
    } finally {
      setLoading(false);
    }
  };

  const startEditingLink = (index: number) => {
    setEditingLinkIndex(index);
    setEditingLinkValue(promoterLinks[index]);
  };

  const saveEditedLink = async () => {
    if (editingLinkIndex === null || !editingLinkValue.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const oldLink = promoterLinks[editingLinkIndex];
      const response = await promoterService.updateCampaignLink(
        campaign.id, 
        oldLink,
        editingLinkValue.trim()
      );
      
      if (response.data) {
        setPromoterLinks(response.data);
      } else {
        const updatedLinks = [...promoterLinks];
        updatedLinks[editingLinkIndex] = editingLinkValue.trim();
        setPromoterLinks(updatedLinks);
      }
      
      setEditingLinkIndex(null);
      setEditingLinkValue("");
    } catch (err) {
      console.error("Error updating campaign link:", err);
      setError("Failed to update link");
    } finally {
      setLoading(false);
    }
  };

  const cancelEditing = () => {
    setEditingLinkIndex(null);
    setEditingLinkValue("");
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Share Links With Client
        </h3>
        <span className="text-sm text-gray-600">
          Add links to your work (posts, videos, docs, etc.)
        </span>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      {/* Add New Link */}
      <div className="mb-4">
        <div className="flex gap-3 text-black">
          <input
            type="url"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            placeholder="Enter a link (Instagram post, TikTok video, Google Doc, etc.)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            disabled={loading}
          />
          <button
            onClick={addPromoterLink}
            disabled={!newLink.trim() || loading}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <PlusIcon className="h-4 w-4 mr-2" />
            )}
            Add Link
          </button>
        </div>
      </div>
      {/* Links List */}
      <div className="space-y-3">
        {promoterLinks.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No work links added yet</p>
            <p className="text-gray-400 text-sm">
              Share Google Docs, PowerPoints, designs, or reports that your
              client needs to review
            </p>
          </div>
        ) : (
          promoterLinks.map((link, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {editingLinkIndex === index ? (
                // Edit mode
                <>
                  <input
                    type="url"
                    value={editingLinkValue}
                    onChange={(e) => setEditingLinkValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    autoFocus
                  />
                  <button
                    onClick={saveEditedLink}
                    disabled={loading}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors disabled:opacity-50"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={cancelEditing}
                    disabled={loading}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </>
              ) : (
                // View mode
                <>
                  <LinkIcon className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-blue-600 hover:text-blue-800 truncate text-sm font-medium"
                  >
                    {link}
                  </a>
                  <button
                    onClick={() => startEditingLink(index)}
                    disabled={loading}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deletePromoterLink(index)}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>{" "}
      {/* Helper text */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-purple-700 text-sm">
          <strong>💡 Important:</strong> These links will be{" "}
          <strong>visible to your client</strong>. Share links to your
          deliverables and work progress such as:
        </p>
        {campaignType === CampaignType.CONSULTANT ? (
          <ul className="text-purple-700 text-sm mt-2 ml-4 space-y-1">
            <li>• Google Docs with strategy documents or reports</li>
            <li>• PowerPoint presentations with your recommendations</li>
            <li>• Spreadsheets with data analysis or campaign metrics</li>
            <li>• Figma/Canva designs for marketing materials</li>
            <li>
              • Live campaign examples or case studies you&apos;ve created
            </li>
          </ul>
        ) : (
          <ul className="text-purple-700 text-sm mt-2 ml-4 space-y-1">
            <li>• Product photos and videos you&apos;ve created</li>
            <li>• Social media posts showcasing the products</li>
            <li>• Store setup progress and screenshots</li>
            <li>• Sales reports and analytics dashboards</li>
            <li>• Customer testimonials and reviews you&apos;ve collected</li>
          </ul>
        )}
      </div>
    </div>
  );
}
