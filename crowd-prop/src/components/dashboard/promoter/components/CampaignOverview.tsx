"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CampaignPromoter,
  VisibilityCampaignDetails,
  ConsultantCampaignDetails,
  SellerCampaignDetails,
  SalesmanCampaignDetails,
} from "@/app/interfaces/campaign/promoter-campaign-details";
import { CampaignType } from "@/app/enums/campaign-type";
import { SocialPlatform } from "@/app/enums/social-platform";
import {
  DollarSign,
  Users,
  Globe,
  CheckCircle,
  MessageCircle,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Facebook,
  Eye,
  User,
  ShoppingBag,
  Banknote,
  Building,
  Star,
  Target,
  Tag,
} from "lucide-react";
import Image from "next/image";

interface CampaignOverviewProps {
  campaign: CampaignPromoter;
}

export default function CampaignOverview({ campaign }: CampaignOverviewProps) {
  const [showAllRequirements, setShowAllRequirements] = useState(false);
  const router = useRouter();

  const handleAdvertiserClick = () => {
    router.push(`/user/${campaign.advertiser.id}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSocialPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case SocialPlatform.INSTAGRAM:
        return <Instagram className="h-3 w-3" />;
      case SocialPlatform.TWITTER:
        return <Twitter className="h-3 w-3" />;
      case SocialPlatform.YOUTUBE:
        return <Youtube className="h-3 w-3" />;
      case SocialPlatform.LINKEDIN:
        return <Linkedin className="h-3 w-3" />;
      case SocialPlatform.FACEBOOK:
        return <Facebook className="h-3 w-3" />;
      default:
        return <Globe className="h-3 w-3" />;
    }
  };

  const getCampaignTypeConfig = () => {
    switch (campaign.campaign.type) {
      case CampaignType.VISIBILITY:
        return {
          icon: Eye,
          title: 'Visibility',
          color: 'blue',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-600',
        };
      case CampaignType.CONSULTANT:
        return {
          icon: User,
          title: 'Consultant',
          color: 'purple',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          iconColor: 'text-purple-600',
        };
      case CampaignType.SELLER:
        return {
          icon: ShoppingBag,
          title: 'Seller',
          color: 'green',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          iconColor: 'text-green-600',
        };
      case CampaignType.SALESMAN:
        return {
          icon: Banknote,
          title: 'Salesman',
          color: 'orange',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          iconColor: 'text-orange-600',
        };
      default:
        return {
          icon: Target,
          title: 'Campaign',
          color: 'gray',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          iconColor: 'text-gray-600',
        };
    }
  };

  const getBudgetInfo = () => {
    switch (campaign.campaign.type) {
      case CampaignType.VISIBILITY:
        const visibilityDetails = campaign.campaign as VisibilityCampaignDetails;
        return {
          value: formatCurrency(campaign.campaign.budgetHeld),
          label: `${formatCurrency(visibilityDetails.cpv)} per 100 views`
        };
      case CampaignType.CONSULTANT:
        const consultantDetails = campaign.campaign as ConsultantCampaignDetails;
        return {
          value: `${formatCurrency(consultantDetails.minBudget || 0)} - ${formatCurrency(consultantDetails.maxBudget || 0)}`,
          label: `${consultantDetails.meetingCount || 0} meetings`
        };
      case CampaignType.SELLER:
        const sellerDetails = campaign.campaign as SellerCampaignDetails;
        return {
          value: sellerDetails.fixedPrice 
            ? formatCurrency(sellerDetails.fixedPrice)
            : `${formatCurrency(sellerDetails.minBudget || 0)} - ${formatCurrency(sellerDetails.maxBudget || 0)}`,
          label: sellerDetails.fixedPrice ? "Fixed price" : "Budget range"
        };
      case CampaignType.SALESMAN:
        const salesmanDetails = campaign.campaign as SalesmanCampaignDetails;
        return {
          value: `${salesmanDetails.commissionPerSale}%`,
          label: `Commission per sale`
        };
      default:
        return {
          value: formatCurrency(campaign.campaign.budgetHeld),
          label: "Total budget"
        };
    }
  };

  const getAllRequirements = () => {
    const requirements = [];

    // Campaign type specific requirements
    switch (campaign.campaign.type) {
      case CampaignType.VISIBILITY:
        const visibilityDetails = campaign.campaign as VisibilityCampaignDetails;
        if (visibilityDetails.minFollowers) {
          requirements.push(`Minimum ${visibilityDetails.minFollowers.toLocaleString()} followers required on social media`);
        }
        break;

      case CampaignType.CONSULTANT:
        const consultantDetails = campaign.campaign as ConsultantCampaignDetails;
        if (consultantDetails.expertiseRequired) {
          requirements.push(`Required Expertise: ${consultantDetails.expertiseRequired}`);
        }
        if (consultantDetails.meetingPlan) {
          requirements.push(`Meeting Schedule: ${consultantDetails.meetingPlan} meetings`);
        }
        break;

      case CampaignType.SELLER:
        const sellerDetails = campaign.campaign as SellerCampaignDetails;
        if (sellerDetails.minFollowers) {
          requirements.push(`Minimum ${sellerDetails.minFollowers.toLocaleString()} followers for product promotion`);
        }
        if (sellerDetails.needMeeting) {
          requirements.push(`Meeting with advertiser required before starting`);
        }
        if (sellerDetails.sellerRequirements && sellerDetails.sellerRequirements.length > 0) {
          requirements.push(`Seller Requirements: ${sellerDetails.sellerRequirements.join(', ')}`);
        }
        break;

      case CampaignType.SALESMAN:
        const salesmanDetails = campaign.campaign as SalesmanCampaignDetails;
        if (salesmanDetails.minFollowers) {
          requirements.push(`Minimum ${salesmanDetails.minFollowers.toLocaleString()} followers for sales promotion`);
        }
        break;
    }

    // General requirements
    if (campaign.campaign.requirements && campaign.campaign.requirements.length > 0) {
      requirements.push(...campaign.campaign.requirements);
    }
    
    return requirements;
  };

  const typeConfig = getCampaignTypeConfig();
  const budgetInfo = getBudgetInfo();
  const allRequirements = getAllRequirements();

  return (
    <div className="space-y-4">
      {/* Header with Campaign Type */}
      <div className={`${typeConfig.bgColor} rounded-lg p-3 border border-gray-200`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-lg">
            <typeConfig.icon className={`h-4 w-4 ${typeConfig.iconColor}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${typeConfig.textColor}`}>
              {typeConfig.title} Campaign
            </h3>
            <p className="text-xs text-gray-600">{campaign.title}</p>
          </div>
        </div>
      </div>

      {/* Advertiser Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="flex items-center mb-2">
          <Building className="h-3 w-3 text-blue-600 mr-1" />
          <span className="text-xs font-medium text-gray-900">Advertiser</span>
        </div>
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
          onClick={handleAdvertiserClick}
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {campaign.advertiser.profileUrl ? (
              <Image
                src={campaign.advertiser.profileUrl}
                alt={campaign.advertiser.companyName}
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Building className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1 mb-1">
              <h4 className="font-medium text-gray-900 text-sm truncate hover:text-blue-600 transition-colors">
                {campaign.advertiser.companyName}
              </h4>
              {campaign.advertiser.verified && (
                <CheckCircle className="h-3 w-3 text-blue-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">{campaign.advertiser.rating.toFixed(1)}</span>
              </div>
              {campaign.advertiser.website && (
                <a
                  href={campaign.advertiser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-xs truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  Website →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
        <p className="text-xs text-gray-700 leading-relaxed">
          {campaign.description}
        </p>
      </div>

      {/* Main Grid - 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        {/* Budget Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <DollarSign className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-xs font-medium text-gray-700">Budget</span>
          </div>
          <div className="text-sm font-bold text-green-600 mb-1">
            {budgetInfo.value}
          </div>
          <div className="text-xs text-gray-500">
            {budgetInfo.label}
          </div>
        </div>

        {/* Target Audience Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Users className="h-3 w-3 text-blue-600 mr-1" />
            <span className="text-xs font-medium text-gray-700">Audience</span>
          </div>
          <div className="text-xs text-gray-700 mb-2 line-clamp-2">
            {campaign.campaign.targetAudience || "General audience"}
          </div>
          {campaign.campaign.preferredPlatforms && campaign.campaign.preferredPlatforms.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {campaign.campaign.preferredPlatforms.slice(0, 2).map((platform, index) => (
                <div key={index} className="flex items-center bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs">
                  {getSocialPlatformIcon(platform)}
                </div>
              ))}
              {campaign.campaign.preferredPlatforms.length > 2 && (
                <span className="text-xs text-gray-500">+{campaign.campaign.preferredPlatforms.length - 2}</span>
              )}
            </div>
          )}
        </div>

        {/* Requirements Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-3 w-3 text-orange-600 mr-1" />
            <span className="text-xs font-medium text-gray-700">Requirements</span>
          </div>
          <div className="space-y-1">
            {allRequirements.length > 0 ? (
              <>
                {(showAllRequirements ? allRequirements : allRequirements.slice(0, 3)).map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-1">
                    <div className="h-1 w-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="text-xs text-gray-700 line-clamp-1">{requirement}</span>
                  </div>
                ))}
                {allRequirements.length > 3 && (
                  <button
                    onClick={() => setShowAllRequirements(!showAllRequirements)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1"
                  >
                    {showAllRequirements 
                      ? "Show less" 
                      : `+${allRequirements.length - 3} more`
                    }
                  </button>
                )}
              </>
            ) : (
              <span className="text-xs text-gray-500">No specific requirements</span>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Row - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        
        {/* Categories */}
        {campaign.tags && campaign.tags.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <Tag className="h-3 w-3 text-purple-600 mr-1" />
              <span className="text-xs font-medium text-gray-700">Categories</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {campaign.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-xs"
                >
                  {tag.toUpperCase()}
                </span>
              ))}
              {campaign.tags.length > 4 && (
                <span className="text-xs text-gray-500">+{campaign.tags.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Discord Channel */}
        {(campaign.campaign.discordInviteLink || campaign.campaign.discordThreadUrl) && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="h-3 w-3 text-indigo-600 mr-1" />
                <span className="text-xs font-medium text-gray-700">Discussion</span>
              </div>
              <div className="flex items-center space-x-1">
                {campaign.campaign.discordInviteLink && (
                  <a
                    href={campaign.campaign.discordInviteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                  >
                    Discord
                  </a>
                )}
                {campaign.campaign.discordThreadUrl && (
                  <a
                    href={campaign.campaign.discordThreadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                  >
                    Thread
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
