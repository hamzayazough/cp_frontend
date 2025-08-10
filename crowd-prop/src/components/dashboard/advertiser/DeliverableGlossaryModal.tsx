"use client";

import { Deliverable } from "@/app/enums/campaign-type";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface DeliverableGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableDeliverables: Deliverable[];
  campaignType: "consultant" | "seller";
}

// Import the same deliverable info from the selector
const DELIVERABLE_INFO: Record<Deliverable, { name: string; description: string; category: string }> = {
  // Consultant Deliverables
  [Deliverable.MARKETING_STRATEGY]: {
    name: "Marketing Strategy",
    description: "A comprehensive plan outlining how to promote your product/service, including target audience analysis, messaging, and channel recommendations.",
    category: "Strategy"
  },
  [Deliverable.CONTENT_PLAN]: {
    name: "Content Plan",
    description: "A detailed calendar and strategy for content creation, including topics, posting schedules, and content types across different platforms.",
    category: "Planning"
  },
  [Deliverable.SCRIPT]: {
    name: "Script Writing",
    description: "Written scripts for videos, ads, sales pitches, or other promotional content tailored to your brand voice and objectives.",
    category: "Creative"
  },
  [Deliverable.MARKET_ANALYSIS]: {
    name: "Market Analysis",
    description: "In-depth research and analysis of your market, competitors, trends, and opportunities to inform strategic decisions.",
    category: "Research"
  },
  [Deliverable.BRAND_GUIDELINES]: {
    name: "Brand Guidelines",
    description: "Recommendations for your brand's visual identity, tone of voice, messaging consistency, and overall brand presentation.",
    category: "Branding"
  },
  [Deliverable.WEEKLY_REPORT]: {
    name: "Weekly Reports",
    description: "Regular progress updates and performance reports detailing campaign metrics, insights, and recommended optimizations.",
    category: "Reporting"
  },
  [Deliverable.PERFORMANCE_AUDIT]: {
    name: "Performance Audit",
    description: "A thorough review and analysis of your current marketing efforts, identifying strengths, weaknesses, and improvement opportunities.",
    category: "Analysis"
  },
  [Deliverable.LIVE_SESSION]: {
    name: "Live Sessions",
    description: "One-on-one coaching calls, Q&A sessions, or workshops to provide personalized guidance and answer your questions.",
    category: "Consultation"
  },
  [Deliverable.PRODUCT_FEEDBACK]: {
    name: "Product Feedback",
    description: "Detailed review and improvement suggestions for your product, service, or offering from a marketing perspective.",
    category: "Review"
  },
  [Deliverable.AD_CONCEPTS]: {
    name: "Ad Concepts",
    description: "Creative ideas and concepts for advertising campaigns, including copy suggestions, visual direction, and targeting strategies.",
    category: "Creative"
  },

  // Seller Deliverables
  [Deliverable.CREATE_SOCIAL_MEDIA_ACCOUNTS]: {
    name: "Create Social Media Accounts",
    description: "Set up new social media profiles specifically dedicated to promoting your product or service across relevant platforms.",
    category: "Setup"
  },
  [Deliverable.SOCIAL_MEDIA_MANAGEMENT]: {
    name: "Social Media Management",
    description: "Ongoing management of social media accounts including content posting, community engagement, follower growth, and brand representation.",
    category: "Management"
  },
  [Deliverable.SPAM_PROMOTION]: {
    name: "Mass Promotion",
    description: "Large-scale posting and distribution of your content across multiple channels, forums, and platforms to maximize reach.",
    category: "Distribution"
  },
  [Deliverable.PROMOTIONAL_VIDEO]: {
    name: "Promotional Video",
    description: "A fully produced promotional video from concept to completion, including scripting, filming, editing, and final delivery.",
    category: "Video"
  },
  [Deliverable.VIDEO_EDITING]: {
    name: "Video Editing",
    description: "Professional editing of your raw footage into polished marketing videos with transitions, effects, and optimized for your target platforms.",
    category: "Video"
  },
  [Deliverable.INSTAGRAM_POST]: {
    name: "Instagram Content",
    description: "Creation of Instagram posts including images, carousels, reels, stories, and captions optimized for engagement and your brand.",
    category: "Social Content"
  },
  [Deliverable.TIKTOK_VIDEO]: {
    name: "TikTok Videos",
    description: "Short-form video content specifically created for TikTok, following current trends and optimized for the platform's algorithm.",
    category: "Social Content"
  },
  [Deliverable.BLOG_ARTICLE]: {
    name: "Blog Articles",
    description: "SEO-optimized written content and articles that drive traffic to your website and establish thought leadership in your industry.",
    category: "Content"
  },
  [Deliverable.EMAIL_CAMPAIGN]: {
    name: "Email Campaigns",
    description: "Designed and written email marketing campaigns including templates, copy, and targeting strategies to reach your audience.",
    category: "Email Marketing"
  },
  [Deliverable.PAID_ADS_CREATION]: {
    name: "Paid Ads Creation",
    description: "Creation and setup of paid advertising campaigns on platforms like Facebook, Google, TikTok, or other advertising networks.",
    category: "Advertising"
  },
  [Deliverable.PRODUCT_REVIEW]: {
    name: "Product Reviews",
    description: "Authentic written or video reviews of your product or service, showcasing features, benefits, and personal experience.",
    category: "Review"
  },
  [Deliverable.EVENT_PROMOTION]: {
    name: "Event Promotion",
    description: "Promotion of your events through livestreams, giveaways, coverage, and audience engagement to drive attendance and awareness.",
    category: "Events"
  },
  [Deliverable.DIRECT_OUTREACH]: {
    name: "Direct Outreach",
    description: "Proactive outreach to potential customers through DMs, emails, cold calls, and other direct communication channels.",
    category: "Outreach"
  },

  // Shared
  [Deliverable.CUSTOM]: {
    name: "Custom Deliverable",
    description: "A custom deliverable that you can define specifically for your campaign needs. Details to be discussed with the promoter.",
    category: "Custom"
  }
};

export default function DeliverableGlossaryModal({
  isOpen,
  onClose,
  availableDeliverables,
  campaignType
}: DeliverableGlossaryModalProps) {
  if (!isOpen) return null;

  // Group deliverables by category
  const categorizedDeliverables = availableDeliverables.reduce((acc, deliverable) => {
    const info = DELIVERABLE_INFO[deliverable];
    if (!acc[info.category]) {
      acc[info.category] = [];
    }
    acc[info.category].push(deliverable);
    return acc;
  }, {} as Record<string, Deliverable[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {campaignType === "consultant" ? "Consultant" : "Seller"} Deliverables Guide
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Learn about all available deliverables for {campaignType} campaigns
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {Object.entries(categorizedDeliverables).map(([category, deliverables]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deliverables.map((deliverable) => {
                    const info = DELIVERABLE_INFO[deliverable];
                    return (
                      <div 
                        key={deliverable}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <h4 className="font-medium text-gray-900 mb-2">
                          {info.name}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {info.description}
                        </p>
                        <span className="inline-block mt-3 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          {info.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            💡 <strong>Tip:</strong> You can click the info icon (ℹ️) next to any deliverable above to see its description while selecting.
          </p>
        </div>
      </div>
    </div>
  );
}
