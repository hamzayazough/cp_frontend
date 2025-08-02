"use client";

import Image from "next/image";
import { OnboardingData } from "../UserOnboarding";
import { AdvertiserType } from "@/app/enums/advertiser-type";
import { Language } from "@/app/enums/language";

interface OnboardingCompleteProps {
  data: OnboardingData;
  userEmail: string;
  onComplete: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function OnboardingComplete({
  data,
  userEmail,
  onComplete,
  onBack,
  isLoading = false,
}: OnboardingCompleteProps) {
  const formatPrice = (price: string | number | null | undefined): string => {
    if (!price) return "";

    const numericPrice = typeof price === "string" ? parseFloat(price) : price;

    if (isNaN(numericPrice)) return "";

    return numericPrice.toFixed(2);
  };

  // Create mappings for display names
  const advertiserTypeLabels: Record<AdvertiserType, string> = {
    [AdvertiserType.EDUCATION]: "Education",
    [AdvertiserType.CLOTHING]: "Clothing & Fashion",
    [AdvertiserType.TECH]: "Technology",
    [AdvertiserType.BEAUTY]: "Beauty & Cosmetics",
    [AdvertiserType.FOOD]: "Food & Beverage",
    [AdvertiserType.HEALTH]: "Health & Fitness",
    [AdvertiserType.ENTERTAINMENT]: "Entertainment",
    [AdvertiserType.TRAVEL]: "Travel & Tourism",
    [AdvertiserType.FINANCE]: "Finance",
    [AdvertiserType.OTHER]: "Other",
    [AdvertiserType.SPORTS]: "Sports",
    [AdvertiserType.AUTOMOTIVE]: "Automotive",
    [AdvertiserType.ART]: "Art",
    [AdvertiserType.GAMING]: "Gaming",
    [AdvertiserType.ECOMMERCE]: "E-commerce",
    [AdvertiserType.MEDIA]: "Media",
    [AdvertiserType.NON_PROFIT]: "Non-Profit",
    [AdvertiserType.REAL_ESTATE]: "Real Estate",
    [AdvertiserType.HOME_SERVICES]: "Home & Garden",
    [AdvertiserType.EVENTS]: "Events",
    [AdvertiserType.CONSULTING]: "Consulting",
    [AdvertiserType.BOOKS]: "Books",
    [AdvertiserType.MUSIC]: "Music",
    [AdvertiserType.PETS]: "Pets",
    [AdvertiserType.TOYS]: "Toys",
    [AdvertiserType.BABY]: "Baby",
    [AdvertiserType.JEWELRY]: "Jewelry",
    [AdvertiserType.SCIENCE]: "Science",
    [AdvertiserType.HARDWARE]: "Hardware",
    [AdvertiserType.ENERGY]: "Energy",
    [AdvertiserType.AGRICULTURE]: "Agriculture",
    [AdvertiserType.GOVERNMENT]: "Government",
  };

  const languageLabels: Record<Language, string> = {
    [Language.ENGLISH]: "English",
    [Language.FRENCH]: "French",
    [Language.SPANISH]: "Spanish",
    [Language.GERMAN]: "German",
    [Language.ITALIAN]: "Italian",
    [Language.PORTUGUESE]: "Portuguese",
    [Language.RUSSIAN]: "Russian",
    [Language.JAPANESE]: "Japanese",
    [Language.CHINESE]: "Chinese",
    [Language.ARABIC]: "Arabic",
    [Language.HINDI]: "Hindi",
    [Language.KOREAN]: "Korean",
    [Language.DUTCH]: "Dutch",
    [Language.SWEDISH]: "Swedish",
    [Language.POLISH]: "Polish",
    [Language.TURKISH]: "Turkish",
    [Language.OTHER]: "Other",
  };
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Profile Complete!
        </h2>
        <p className="text-gray-600">
          Review your information before finishing setup
        </p>
      </div>

      {/* Profile Summary */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-6">
        {/* Cover Photo */}
        <div className="relative h-40">
          {data.backgroundUrl ? (
            <Image
              src={data.backgroundUrl}
              alt={`${data.name}'s cover photo`}
              width={1200}
              height={320}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <div
              className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
              aria-label="Default cover photo"
            >
              <div className="text-center text-white opacity-70">
                <svg
                  className="w-16 h-16 mx-auto mb-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <p className="text-sm font-medium">
                  Your cover photo will appear here
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="pb-6 px-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex items-start gap-4 pt-6 pb-4">
            {/* Profile Picture */}
            <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg flex-shrink-0">
              {data.avatarUrl ? (
                <Image
                  src={data.avatarUrl}
                  alt={`${data.name}'s profile picture`}
                  width={80}
                  height={80}
                  className="w-full h-full rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg
                      className="w-8 h-8 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Name, Role, Email */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {data.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-1">
                    {data.role === "ADVERTISER"
                      ? "Business/Advertiser"
                      : "Creator/Promoter"}
                  </p>
                  <p className="text-gray-500 text-sm">{userEmail}</p>
                </div>
                <div className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                  {data.role === "ADVERTISER" ? "💼 Business" : "🎨 Creator"}
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {data.bio && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed italic">
                &ldquo;{data.bio}&rdquo;
              </p>
            </div>
          )}

          {/* Social Media Links */}
          {(data.instagramUrl ||
            data.tiktokUrl ||
            data.youtubeUrl ||
            data.twitterUrl ||
            data.snapchatUrl ||
            data.websiteUrl) && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Connect with me
              </h3>
              <div className="flex flex-wrap gap-3">
                {data.instagramUrl && (
                  <a
                    href={`https://instagram.com/${data.instagramUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    @{data.instagramUrl}
                  </a>
                )}
                {data.tiktokUrl && (
                  <a
                    href={`https://tiktok.com/@${data.tiktokUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                    @{data.tiktokUrl}
                  </a>
                )}
                {data.youtubeUrl && (
                  <a
                    href={data.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-all shadow-md"
                    style={{ backgroundColor: "#dc2626", color: "white" }}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    YouTube
                  </a>
                )}
                {/* Debug: YouTube URL exists: {data.youtubeUrl ? 'YES' : 'NO'} */}
                {data.twitterUrl && (
                  <a
                    href={`https://twitter.com/${data.twitterUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-all"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    @{data.twitterUrl}
                  </a>
                )}
                {data.snapchatUrl && (
                  <a
                    href={`https://snapchat.com/add/${data.snapchatUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-yellow-400 text-white rounded-full text-sm font-medium hover:bg-yellow-500 transition-all"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001 12.017.001z" />
                    </svg>
                    @{data.snapchatUrl}
                  </a>
                )}
                {data.websiteUrl && (
                  <a
                    href={data.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Website
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role-specific Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        {data.role === "ADVERTISER" && data.advertiserDetails && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Business Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <p className="text-gray-900">
                  {data.advertiserDetails.companyName}
                </p>
              </div>
              {data.advertiserDetails.companyWebsite && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <p className="text-gray-900">
                    {data.advertiserDetails.companyWebsite}
                  </p>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {data.advertiserDetails.advertiserTypes.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {advertiserTypeLabels[type]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {data.role === "PROMOTER" && data.promoterDetails && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Creator Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <div className="flex items-center mt-1">
                  {data.promoterDetails.isBusiness ? (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                        Business/Agency
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                        Individual Creator
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <p className="text-gray-900">{data.promoterDetails.location}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages
                </label>
                <div className="flex flex-wrap gap-2">
                  {data.promoterDetails.languagesSpoken.map(
                    (language, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {languageLabels[language]}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {data.promoterDetails.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Section */}
      {(data.role === "ADVERTISER" && data.advertiserWorks.length > 0) ||
      (data.role === "PROMOTER" && data.promoterWorks.length > 0) ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          {data.role === "ADVERTISER" && data.advertiserWorks.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Some of your products
                </h3>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  {data.advertiserWorks.length}{" "}
                  {data.advertiserWorks.length === 1 ? "sample" : "samples"}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.advertiserWorks.map((work, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
                  >
                    <h4 className="font-semibold text-gray-900 text-lg mb-4">
                      {work.title}
                    </h4>

                    <p
                      className="text-gray-700 text-sm mb-4 leading-relaxed h-12 overflow-hidden text-ellipsis"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical" as const,
                        textOverflow: "ellipsis",
                      }}
                    >
                      {work.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {work.price && formatPrice(work.price) && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          ${formatPrice(work.price)}
                        </span>
                      )}
                      {work.websiteUrl && (
                        <a
                          href={work.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full hover:bg-blue-200 transition-colors"
                        >
                          View Product →
                        </a>
                      )}
                    </div>

                    {work.mediaUrl ? (
                      <div className="mt-4">
                        <div
                          className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
                          style={{ height: "192px" }}
                        >
                          {work.mediaUrl.includes("video") ? (
                            <video
                              src={work.mediaUrl}
                              controls
                              className="w-full h-full object-cover"
                              style={{ height: "192px" }}
                            />
                          ) : (
                            <Image
                              src={work.mediaUrl}
                              alt={work.title}
                              width={384}
                              height={192}
                              className="w-full h-full object-cover"
                              style={{ height: "192px" }}
                              unoptimized
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <div
                          className="rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center"
                          style={{ height: "192px" }}
                        >
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                              <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">
                              No image uploaded
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.role === "PROMOTER" && data.promoterWorks.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Your Content Portfolio
                </h3>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  {data.promoterWorks.length}{" "}
                  {data.promoterWorks.length === 1 ? "sample" : "samples"}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.promoterWorks.map((work, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
                  >
                    <h4 className="font-semibold text-gray-900 text-lg mb-4">
                      {work.title}
                    </h4>

                    {work.description && (
                      <p
                        className="text-gray-700 text-sm mb-4 leading-relaxed h-12 overflow-hidden text-ellipsis"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical" as const,
                          textOverflow: "ellipsis",
                        }}
                      >
                        {work.description}
                      </p>
                    )}

                    <div className="mt-4">
                      <div
                        className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
                        style={{ height: "192px" }}
                      >
                        {work.mediaUrl.includes("video") ? (
                          <video
                            src={work.mediaUrl}
                            controls
                            className="w-full h-full object-cover"
                            style={{ height: "192px" }}
                          />
                        ) : (
                          <Image
                            src={work.mediaUrl}
                            alt={work.title}
                            width={384}
                            height={192}
                            className="w-full h-full object-cover"
                            style={{ height: "192px" }}
                            unoptimized
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          What&apos;s Next?
        </h3>
        <p className="text-blue-800">
          {data.role === "ADVERTISER"
            ? "You can now create campaigns and connect with talented promoters to grow your business."
            : "You can now browse available campaigns and start applying to promotion opportunities that match your skills."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Back to Edit
        </button>
        <button
          onClick={onComplete}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Setting up..." : "Complete Setup"}
        </button>
      </div>
    </div>
  );
}
