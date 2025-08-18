"use client";

import { useState } from "react";
import Image from 'next/image';
import { User } from "@/app/interfaces/user";
import { PromoterWork } from "@/app/interfaces/promoter-work";
import { Language } from "@/app/enums/language";
import { usePromoterProfileEdit } from "@/hooks/usePromoterProfileEdit";
import {
  MapPinIcon,
  GlobeAltIcon,
  StarIcon,
  UserIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CheckBadgeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import PortfolioManager from "./PortfolioManager";
import PortfolioDetailModal from "./PortfolioDetailModal";

interface PromoterProfileContentProps {
  user: User;
  onUserUpdate: (user: User) => void;
  isViewOnly?: boolean;
}

// Social media platform configurations with SVG icons
const socialPlatforms = [
  { 
    key: 'tiktokUrl', 
    name: 'TikTok', 
    color: 'bg-black text-white', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    )
  },
  { 
    key: 'instagramUrl', 
    name: 'Instagram', 
    color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  { 
    key: 'youtubeUrl', 
    name: 'YouTube', 
    color: 'bg-red-600 text-white', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  { 
    key: 'snapchatUrl', 
    name: 'Snapchat', 
    color: 'bg-yellow-400 text-white', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.160 1.219-5.160s-.312-.623-.312-1.543c0-1.446.839-2.523 1.883-2.523.888 0 1.317.664 1.317 1.463 0 .891-.568 2.225-.861 3.462-.245 1.041.522 1.887 1.549 1.887 1.861 0 3.293-1.964 3.293-4.799 0-2.511-1.804-4.266-4.384-4.266-2.987 0-4.749 2.240-4.749 4.558 0 .901.347 1.869.78 2.397.085.103.097.194.072.299-.079.332-.256 1.033-.290 1.178-.045.184-.147.223-.339.135-1.249-.581-2.03-2.407-2.03-3.874 0-3.308 2.402-6.346 6.919-6.346 3.636 0 6.460 2.592 6.460 6.056 0 3.614-2.277 6.521-5.437 6.521-1.062 0-2.062-.552-2.404-1.209 0 0-.526 2.006-.654 2.497-.237.915-.877 2.061-1.305 2.759.982.304 2.023.466 3.104.466 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017.001z"/>
      </svg>
    )
  },
  { 
    key: 'twitterUrl', 
    name: 'X', 
    color: 'bg-black text-white', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  { 
    key: 'websiteUrl', 
    name: 'Website', 
    color: 'bg-gray-600 text-white', 
    icon: <GlobeAltIcon className="w-5 h-5" />
  },
];

// Language display mapping
const languageDisplay = {
  ENGLISH: 'English',
  SPANISH: 'Spanish',
  FRENCH: 'French',
  ITALIAN: 'Italian',
  GERMAN: 'German',
  PORTUGUESE: 'Portuguese',
  CHINESE: 'Chinese',
  JAPANESE: 'Japanese',
  KOREAN: 'Korean',
  ARABIC: 'Arabic',
};

export default function PromoterProfileContent({
  user,
  onUserUpdate,
  isViewOnly = false,
}: PromoterProfileContentProps) {
  const [showPortfolioManager, setShowPortfolioManager] = useState(false);
  const [selectedWork, setSelectedWork] = useState<PromoterWork | null>(null);

  const {
    isEditing,
    isSaving,
    editData,
    setIsEditing,
    handleEditDataChange,
    handleLanguageToggle,
    handleSkillToggle,
    handleSave,
    handleCancel,
  } = usePromoterProfileEdit(user, onUserUpdate);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: user.usedCurrency || 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
          {user.backgroundUrl ? (
            <Image
              src={user.backgroundUrl}
              alt="Cover"
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-10" />
        </div>

        {/* Profile Content */}
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="relative -mt-12 sm:-mt-12">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="rounded-xl object-cover border-4 border-white shadow-lg bg-white"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-xl font-bold text-white">
                      {(user.promoterDetails?.isBusiness && user.promoterDetails?.businessName 
                        ? user.promoterDetails.businessName 
                        : user.name).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and Info */}
              <div className="flex-1 sm:pt-0 pt-2">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.promoterDetails?.isBusiness && user.promoterDetails?.businessName 
                      ? user.promoterDetails.businessName 
                      : user.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {user.promoterDetails?.isBusiness ? 'Company' : 'Individual'}
                    </span>
                    {user.promoterDetails?.verified && (
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckBadgeIcon className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    {user.rating && (
                      <span className="px-2.5 py-1 bg-yellow-50 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
                        <StarIconSolid className="w-3 h-3 text-yellow-500" />
                        {user.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-1 mb-3">
                  {user.promoterDetails?.isBusiness && user.promoterDetails?.businessName ? (
                    <div className="text-sm text-gray-600">
                      Contact: {user.name} • {user.email}
                      {user.phoneNumber && <span> • {user.phoneNumber}</span>}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      {user.email}
                      {user.phoneNumber && <span> • {user.phoneNumber}</span>}
                    </div>
                  )}
                </div>
                
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {user.promoterDetails?.location && (
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{user.promoterDetails.location}</span>
                    </div>
                  )}
                  
                  {user.country && (
                    <div className="flex items-center gap-1">
                      <span className="text-base">🌍</span>
                      <span>{user.country}</span>
                    </div>
                  )}
                  
                  {user.usedCurrency && (
                    <div className="flex items-center gap-1">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      <span>{user.usedCurrency}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    <span>Member since {new Date(user.createdAt).getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {!isViewOnly && (
              <div className="flex gap-2 sm:pt-0 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-2 text-sm"
                    >
                      {isSaving ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          {(user.bio || isEditing) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              {isEditing ? (
                <textarea
                  value={editData.bio || ''}
                  onChange={(e) => handleEditDataChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-400"
                  rows={4}
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              )}
            </div>
          )}

          {/* Performance Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h2>
            
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-xl font-bold text-green-600 mb-1">
                  {formatCurrency(user.promoterDetails?.totalSales || 0)}
                </div>
                <div className="text-xs text-gray-600">Total Sales</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <EyeIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-xl font-bold text-purple-600 mb-1">
                  {formatNumber(user.promoterDetails?.totalViewsGenerated || 0)}
                </div>
                <div className="text-xs text-gray-600">Views Generated</div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <StarIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-xl font-bold text-orange-600 mb-1">
                  {user.rating ? user.rating.toFixed(1) : 'N/A'}
                </div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
            </div>

            {/* Campaign Types Breakdown */}
            <div className="border-t pt-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-gray-600" />
                Campaign Types Completed
              </h3>
              
              {/* Total Campaigns Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {user.promoterDetails?.numberOfCampaignDone || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Campaigns Completed</div>
                  </div>
                </div>
              </div>
              
              {/* Campaign Type Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-indigo-50 rounded-lg p-3 text-center border border-indigo-100">
                  <div className="text-lg font-bold text-indigo-600 mb-1">
                    {user.promoterDetails?.numberOfVisibilityCampaignDone || 0}
                  </div>
                  <div className="text-xs text-indigo-700 font-medium">Visibility</div>
                  <div className="text-xs text-gray-500">Campaigns</div>
                </div>
                
                <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                  <div className="text-lg font-bold text-emerald-600 mb-1">
                    {user.promoterDetails?.numberOfSellerCampaignDone || 0}
                  </div>
                  <div className="text-xs text-emerald-700 font-medium">Seller</div>
                  <div className="text-xs text-gray-500">Campaigns</div>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-100">
                  <div className="text-lg font-bold text-amber-600 mb-1">
                    {user.promoterDetails?.numberOfSalesmanCampaignDone || 0}
                  </div>
                  <div className="text-xs text-amber-700 font-medium">Salesman</div>
                  <div className="text-xs text-gray-500">Campaigns</div>
                </div>
                
                <div className="bg-violet-50 rounded-lg p-3 text-center border border-violet-100">
                  <div className="text-lg font-bold text-violet-600 mb-1">
                    {user.promoterDetails?.numberOfConsultantCampaignDone || 0}
                  </div>
                  <div className="text-xs text-violet-700 font-medium">Consultant</div>
                  <div className="text-xs text-gray-500">Campaigns</div>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Portfolio</h2>
              {!isViewOnly && (
                <button
                  onClick={() => setShowPortfolioManager(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Work
                </button>
              )}
            </div>

            {user.promoterDetails?.works && user.promoterDetails.works.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.promoterDetails.works.map((work, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedWork(work)}
                    className="group cursor-pointer bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {work.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {work.description}
                    </p>
                    {work.mediaUrl && (
                      <div className="mt-3 text-xs text-blue-600">
                        Media file
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlusIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio items yet</h3>
                <p className="text-gray-600">
                  {isViewOnly 
                    ? "This promoter hasn't added any portfolio items yet"
                    : "Start building your portfolio by adding your best work"
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar Info */}
        <div className="space-y-6">
          {/* Social Media */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
            <div className="space-y-3">
              {socialPlatforms.map((platform) => {
                const url = user[platform.key as keyof User] as string;
                if (!url) return null;
                
                return (
                  <a
                    key={platform.key}
                    href={url.startsWith('http') ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-lg hover:scale-105 transition-transform ${platform.color}`}
                  >
                    {platform.icon}
                    <span className="font-medium">{platform.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Languages */}
          {((user.promoterDetails?.languagesSpoken && user.promoterDetails.languagesSpoken.length > 0) || isEditing) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages Spoken</h3>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(languageDisplay).map(([key, display]) => (
                      <label key={key} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editData.languagesSpoken?.includes(key as Language) || false}
                          onChange={() => handleLanguageToggle(key as Language)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{display}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.promoterDetails?.languagesSpoken?.map((language) => (
                    <span
                      key={language}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {languageDisplay[language as keyof typeof languageDisplay] || language}
                    </span>
                  )) || <span className="text-gray-500">No languages specified</span>}
                </div>
              )}
            </div>
          )}

          {/* Skills & Expertise */}
          {((user.promoterDetails?.skills && user.promoterDetails.skills.length > 0) || isEditing) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {editData.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => handleSkillToggle(skill)}
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a skill..."
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const skill = e.currentTarget.value.trim();
                          if (skill && !editData.skills?.includes(skill)) {
                            handleSkillToggle(skill);
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Press Enter to add a skill</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.promoterDetails?.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  )) || <span className="text-gray-500">No skills specified</span>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showPortfolioManager && (
        <PortfolioManager
          works={user.promoterDetails?.works || []}
          onClose={() => setShowPortfolioManager(false)}
        />
      )}

      {selectedWork && (
        <PortfolioDetailModal
          work={selectedWork}
          onClose={() => setSelectedWork(null)}
        />
      )}
    </div>
  );
}
