"use client";

import { useState } from "react";
import { Deliverable } from "@/app/enums/campaign-type";
import {
  InformationCircleIcon,
  XMarkIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import DeliverableGlossaryModal from "./DeliverableGlossaryModal";

interface DeliverableSelectorProps {
  selectedDeliverables: Deliverable[];
  availableDeliverables: Deliverable[];
  onSelectionChange: (deliverables: Deliverable[]) => void;
  title: string;
  description?: string;
  className?: string;
  colorScheme?: "purple" | "orange" | "green" | "blue";
  campaignType?: "consultant" | "seller"; // Added for glossary modal
}

// Deliverable descriptions and metadata
const DELIVERABLE_INFO: Record<
  Deliverable,
  { name: string; description: string; category: string }
> = {
  // Consultant Deliverables
  [Deliverable.MARKETING_STRATEGY]: {
    name: "Marketing Strategy",
    description:
      "A comprehensive plan outlining how to promote your product/service, including target audience analysis, messaging, and channel recommendations.",
    category: "Strategy",
  },
  [Deliverable.CONTENT_PLAN]: {
    name: "Content Plan",
    description:
      "A detailed calendar and strategy for content creation, including topics, posting schedules, and content types across different platforms.",
    category: "Planning",
  },
  [Deliverable.SCRIPT]: {
    name: "Script Writing",
    description:
      "Written scripts for videos, ads, sales pitches, or other promotional content tailored to your brand voice and objectives.",
    category: "Creative",
  },
  [Deliverable.MARKET_ANALYSIS]: {
    name: "Market Analysis",
    description:
      "In-depth research and analysis of your market, competitors, trends, and opportunities to inform strategic decisions.",
    category: "Research",
  },
  [Deliverable.BRAND_GUIDELINES]: {
    name: "Brand Guidelines",
    description:
      "Recommendations for your brand's visual identity, tone of voice, messaging consistency, and overall brand presentation.",
    category: "Branding",
  },
  [Deliverable.WEEKLY_REPORT]: {
    name: "Weekly Reports",
    description:
      "Regular progress updates and performance reports detailing campaign metrics, insights, and recommended optimizations.",
    category: "Reporting",
  },
  [Deliverable.PERFORMANCE_AUDIT]: {
    name: "Performance Audit",
    description:
      "A thorough review and analysis of your current marketing efforts, identifying strengths, weaknesses, and improvement opportunities.",
    category: "Analysis",
  },
  [Deliverable.LIVE_SESSION]: {
    name: "Live Sessions",
    description:
      "One-on-one coaching calls, Q&A sessions, or workshops to provide personalized guidance and answer your questions.",
    category: "Consultation",
  },
  [Deliverable.PRODUCT_FEEDBACK]: {
    name: "Product Feedback",
    description:
      "Detailed review and improvement suggestions for your product, service, or offering from a marketing perspective.",
    category: "Review",
  },
  [Deliverable.AD_CONCEPTS]: {
    name: "Ad Concepts",
    description:
      "Creative ideas and concepts for advertising campaigns, including copy suggestions, visual direction, and targeting strategies.",
    category: "Creative",
  },

  // Seller Deliverables
  [Deliverable.CREATE_SOCIAL_MEDIA_ACCOUNTS]: {
    name: "Create Social Media Accounts",
    description:
      "Set up new social media profiles specifically dedicated to promoting your product or service across relevant platforms.",
    category: "Setup",
  },
  [Deliverable.SOCIAL_MEDIA_MANAGEMENT]: {
    name: "Social Media Management",
    description:
      "Ongoing management of social media accounts including content posting, community engagement, follower growth, and brand representation.",
    category: "Management",
  },
  [Deliverable.SPAM_PROMOTION]: {
    name: "Mass Promotion",
    description:
      "Large-scale posting and distribution of your content across multiple channels, forums, and platforms to maximize reach.",
    category: "Distribution",
  },
  [Deliverable.PROMOTIONAL_VIDEO]: {
    name: "Promotional Video",
    description:
      "A fully produced promotional video from concept to completion, including scripting, filming, editing, and final delivery.",
    category: "Video",
  },
  [Deliverable.VIDEO_EDITING]: {
    name: "Video Editing",
    description:
      "Professional editing of your raw footage into polished marketing videos with transitions, effects, and optimized for your target platforms.",
    category: "Video",
  },
  [Deliverable.INSTAGRAM_POST]: {
    name: "Instagram Content",
    description:
      "Creation of Instagram posts including images, carousels, reels, stories, and captions optimized for engagement and your brand.",
    category: "Social Content",
  },
  [Deliverable.TIKTOK_VIDEO]: {
    name: "TikTok Videos",
    description:
      "Short-form video content specifically created for TikTok, following current trends and optimized for the platform's algorithm.",
    category: "Social Content",
  },
  [Deliverable.BLOG_ARTICLE]: {
    name: "Blog Articles",
    description:
      "SEO-optimized written content and articles that drive traffic to your website and establish thought leadership in your industry.",
    category: "Content",
  },
  [Deliverable.EMAIL_CAMPAIGN]: {
    name: "Email Campaigns",
    description:
      "Designed and written email marketing campaigns including templates, copy, and targeting strategies to reach your audience.",
    category: "Email Marketing",
  },
  [Deliverable.PAID_ADS_CREATION]: {
    name: "Paid Ads Creation",
    description:
      "Creation and setup of paid advertising campaigns on platforms like Facebook, Google, TikTok, or other advertising networks.",
    category: "Advertising",
  },
  [Deliverable.PRODUCT_REVIEW]: {
    name: "Product Reviews",
    description:
      "Authentic written or video reviews of your product or service, showcasing features, benefits, and personal experience.",
    category: "Review",
  },
  [Deliverable.EVENT_PROMOTION]: {
    name: "Event Promotion",
    description:
      "Promotion of your events through livestreams, giveaways, coverage, and audience engagement to drive attendance and awareness.",
    category: "Events",
  },
  [Deliverable.DIRECT_OUTREACH]: {
    name: "Direct Outreach",
    description:
      "Proactive outreach to potential customers through DMs, emails, cold calls, and other direct communication channels.",
    category: "Outreach",
  },

  // Shared
  [Deliverable.CUSTOM]: {
    name: "Custom Deliverable",
    description:
      "A custom deliverable that you can define specifically for your campaign needs. Details to be discussed with the promoter.",
    category: "Custom",
  },
};

export default function DeliverableSelector({
  selectedDeliverables,
  availableDeliverables,
  onSelectionChange,
  title,
  description,
  className = "",
  colorScheme = "purple",
  campaignType,
}: DeliverableSelectorProps) {
  const [showModal, setShowModal] = useState<Deliverable | null>(null);
  const [showTooltip, setShowTooltip] = useState<Deliverable | null>(null);
  const [showGlossary, setShowGlossary] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDeliverable = (deliverable: Deliverable) => {
    const newSelection = selectedDeliverables.includes(deliverable)
      ? selectedDeliverables.filter((d) => d !== deliverable)
      : [...selectedDeliverables, deliverable];
    onSelectionChange(newSelection);
  };

  const getColorClasses = () => {
    const colors = {
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        icon: "text-purple-600",
        selected: "bg-purple-600 text-white border-purple-600",
        hover: "hover:border-purple-300 hover:bg-purple-50",
        selectedBadge: "bg-purple-600 text-white",
      },
      orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: "text-orange-600",
        selected: "bg-orange-600 text-white border-orange-600",
        hover: "hover:border-orange-300 hover:bg-orange-50",
        selectedBadge: "bg-orange-600 text-white",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "text-green-600",
        selected: "bg-green-600 text-white border-green-600",
        hover: "hover:border-green-300 hover:bg-green-50",
        selectedBadge: "bg-green-600 text-white",
      },
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "text-blue-600",
        selected: "bg-blue-600 text-white border-blue-600",
        hover: "hover:border-blue-300 hover:bg-blue-50",
        selectedBadge: "bg-blue-600 text-white",
      },
    };
    return colors[colorScheme];
  };

  const colors = getColorClasses();

  const handleInfoClick = (e: React.MouseEvent, deliverable: Deliverable) => {
    e.stopPropagation();
    // On mobile, show modal; on desktop, show tooltip
    if (window.innerWidth < 768) {
      setShowModal(deliverable);
    } else {
      setShowTooltip(showTooltip === deliverable ? null : deliverable);
    }
  };

  return (
    <div
      className={`${colors.bg} ${colors.border} border rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          {title}
        </label>
        <div className="flex items-center space-x-2">
          {availableDeliverables.length > 8 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUpIcon className="h-4 w-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDownIcon className="h-4 w-4 mr-1" />
                  Show All
                </>
              )}
            </button>
          )}
          {campaignType && (
            <button
              type="button"
              onClick={() => setShowGlossary(true)}
              className="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              Guide
            </button>
          )}
        </div>
      </div>

      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}

      {/* Compact Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {(isExpanded
          ? availableDeliverables
          : availableDeliverables.slice(0, 8)
        ).map((deliverable) => {
          const info = DELIVERABLE_INFO[deliverable];
          const isSelected = selectedDeliverables.includes(deliverable);

          return (
            <div key={deliverable} className="relative">
              <button
                type="button"
                onClick={() => toggleDeliverable(deliverable)}
                className={`w-full px-2 py-2 text-xs rounded-md border font-medium transition-all duration-200 text-left ${
                  isSelected
                    ? `${colors.selected} shadow-sm`
                    : `bg-white text-gray-700 border-gray-300 ${colors.hover}`
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1 pr-1 leading-tight">{info.name}</span>
                  <span
                    onClick={(e) => handleInfoClick(e, deliverable)}
                    className={`flex-shrink-0 transition-colors cursor-pointer ${
                      isSelected
                        ? "text-white/80 hover:text-white"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    aria-label={`More info about ${info.name}`}
                  >
                    <InformationCircleIcon className="h-3 w-3" />
                  </span>
                </div>
              </button>

              {/* Desktop Tooltip */}
              {showTooltip === deliverable && (
                <div className="absolute z-50 bottom-full left-0 mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg w-64 hidden md:block">
                  <div className="font-medium mb-1">{info.name}</div>
                  <div className="text-gray-300 mb-2">{info.description}</div>
                  <span className="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                    {info.category}
                  </span>
                  {/* Arrow */}
                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          );
        })}

        {/* Show hidden items indicator */}
        {!isExpanded && availableDeliverables.length > 8 && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="w-full px-2 py-2 text-xs rounded-md border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center"
          >
            +{availableDeliverables.length - 8} more
          </button>
        )}
      </div>

      {/* Compact Selected Indicator */}
      {selectedDeliverables.length > 0 && (
        <div className="mt-3 p-2 bg-white border border-gray-200 rounded-md">
          <p className="text-xs text-gray-600 mb-1">
            <span className="font-medium">{selectedDeliverables.length}</span>{" "}
            selected
          </p>
          <div className="flex flex-wrap gap-1">
            {selectedDeliverables.slice(0, 3).map((deliverable) => (
              <span
                key={deliverable}
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${colors.selectedBadge}`}
              >
                {DELIVERABLE_INFO[deliverable].name}
              </span>
            ))}
            {selectedDeliverables.length > 3 && (
              <span className="text-xs text-gray-500 px-1">
                +{selectedDeliverables.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Mobile Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 md:hidden">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full max-h-96 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {DELIVERABLE_INFO[showModal].name}
              </h3>
              <button
                onClick={() => setShowModal(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {DELIVERABLE_INFO[showModal].description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {DELIVERABLE_INFO[showModal].category}
              </span>
              <button
                onClick={() => {
                  toggleDeliverable(showModal);
                  setShowModal(null);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedDeliverables.includes(showModal)
                    ? `${colors.selected}`
                    : `bg-gray-100 text-gray-700 hover:bg-gray-200`
                }`}
              >
                {selectedDeliverables.includes(showModal) ? "Remove" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside handler for desktop tooltip */}
      {showTooltip && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowTooltip(null)}
        />
      )}

      {/* Deliverable Glossary Modal */}
      {campaignType && (
        <DeliverableGlossaryModal
          isOpen={showGlossary}
          onClose={() => setShowGlossary(false)}
          availableDeliverables={availableDeliverables}
          campaignType={campaignType}
        />
      )}
    </div>
  );
}
