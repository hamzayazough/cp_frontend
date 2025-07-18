"use client";

import { useState, useEffect } from "react";
import {
  LinkIcon,
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { CampaignType, CampaignStatus } from "@/app/enums/campaign-type";
import {
  CampaignAdvertiser,
  ChosenPromoterInfo,
} from "@/app/interfaces/campaign/advertiser-campaign";
import { advertiserService } from "@/services/advertiser.service";

interface AdvertiserPromoterLinksProps {
  campaign: CampaignAdvertiser;
  selectedPromoter?: ChosenPromoterInfo;
}

export default function AdvertiserPromoterLinks({
  campaign,
  selectedPromoter,
}: AdvertiserPromoterLinksProps) {
  const [promoterLinks, setPromoterLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load promoter links from the campaign or API
  useEffect(() => {
    const loadPromoterLinks = async () => {
      try {
        setLoading(true);
        setError(null);

        // First check if we have a selected promoter with links
        if (selectedPromoter?.promoterLinks) {
          setPromoterLinks(selectedPromoter.promoterLinks);
        } else if (
          campaign.chosenPromoters &&
          campaign.chosenPromoters.length > 0
        ) {
          // If no specific promoter selected, get links from all promoters
          const allLinks = campaign.chosenPromoters
            .flatMap((promoter) => promoter.promoterLinks || [])
            .filter((link) => link); // Remove empty links
          setPromoterLinks(allLinks);
        } else {
          // TODO: remove or replace this else statement
          try {
            const response = await advertiserService.getCampaignPromoterLinks(
              campaign.id
            );
            setPromoterLinks(response.data || []);
          } catch {
            console.log("No API endpoint available yet, showing empty state");
            setPromoterLinks([]);
          }
        }
      } catch (err) {
        console.error("Error loading promoter links:", err);
        setError("Failed to load promoter links");
      } finally {
        setLoading(false);
      }
    };

    loadPromoterLinks();
  }, [campaign, selectedPromoter]);

  // Only show for consultant and seller campaigns
  if (
    !(
      campaign.type === CampaignType.CONSULTANT ||
      campaign.type === CampaignType.SELLER
    )
  ) {
    return null;
  }

  // Only show if campaign status is ACTIVE or ENDED (ongoing or completed)
  if (
    !(
      campaign.status === CampaignStatus.ACTIVE ||
      campaign.status === CampaignStatus.ENDED
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Promoter Work Links
        </h3>
        <span className="text-sm text-gray-600">
          {selectedPromoter
            ? `Links from ${selectedPromoter.promoter.firstName} ${selectedPromoter.promoter.lastName}`
            : `Links from all promoters`}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-3">
        {promoterLinks.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No work links shared yet
            </p>
            <p className="text-gray-400 text-sm">
              {selectedPromoter
                ? "This promoter hasn't shared any work links yet"
                : "Your promoters haven't shared any work links yet"}
            </p>
          </div>
        ) : (
          promoterLinks.map((link, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <LinkIcon className="h-4 w-4 text-purple-600 flex-shrink-0" />
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-blue-600 hover:text-blue-800 truncate text-sm font-medium"
              >
                {link}
              </a>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
                title="Open in new tab"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>
          ))
        )}
      </div>

      {/* Info box */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-700 text-sm">
              <strong>About these links:</strong> These are work deliverables
              and progress updates shared by your promoter(s).
            </p>
            {campaign.type === CampaignType.CONSULTANT ? (
              <ul className="text-blue-700 text-sm mt-2 ml-4 space-y-1">
                <li>• Strategy documents and reports</li>
                <li>• Presentations and recommendations</li>
                <li>• Data analysis and campaign metrics</li>
                <li>• Marketing materials and designs</li>
                <li>• Live campaign examples and case studies</li>
              </ul>
            ) : (
              <ul className="text-blue-700 text-sm mt-2 ml-4 space-y-1">
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
