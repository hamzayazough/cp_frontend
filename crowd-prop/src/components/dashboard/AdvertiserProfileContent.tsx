'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User } from '@/app/interfaces/user';
import { AdvertiserType } from '@/app/enums/advertiser-type';
import { AdvertiserWork } from '@/app/interfaces/advertiser-work';
import { authService } from '@/services/auth.service';
import AdvertiserPortfolioManager from './AdvertiserPortfolioManager';
import AdvertiserPortfolioDetailModal from './AdvertiserPortfolioDetailModal';
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  PlusIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface AdvertiserProfileContentProps {
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

export default function AdvertiserProfileContent({ user, onUserUpdate, isViewOnly = false }: AdvertiserProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showProductManager, setShowProductManager] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdvertiserWork | null>(null);
  const [editData, setEditData] = useState({
    name: user.name,
    bio: user.bio || '',
    companyName: user.advertiserDetails?.companyName || '',
    companyWebsite: user.advertiserDetails?.companyWebsite || '',
    advertiserTypes: user.advertiserDetails?.advertiserTypes || [],
    tiktokUrl: user.tiktokUrl || '',
    instagramUrl: user.instagramUrl || '',
    snapchatUrl: user.snapchatUrl || '',
    youtubeUrl: user.youtubeUrl || '',
    twitterUrl: user.twitterUrl || '',
    websiteUrl: user.websiteUrl || '',
    discordChannelUrl: user.advertiserDetails?.discordChannelUrl || '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        name: editData.name?.trim(),
        bio: editData.bio?.trim(),
        tiktokUrl: editData.tiktokUrl?.trim() || undefined,
        instagramUrl: editData.instagramUrl?.trim() || undefined,
        snapchatUrl: editData.snapchatUrl?.trim() || undefined,
        youtubeUrl: editData.youtubeUrl?.trim() || undefined,
        twitterUrl: editData.twitterUrl?.trim() || undefined,
        websiteUrl: editData.websiteUrl?.trim() || undefined,
        advertiserDetails: {
          companyName: editData.companyName?.trim(),
          companyWebsite: editData.companyWebsite?.trim() || undefined,
          advertiserTypes: editData.advertiserTypes,
          discordChannelUrl: editData.discordChannelUrl?.trim() || undefined,
        }
      };

      Object.keys(updateData).forEach(key => {
        const typedKey = key as keyof typeof updateData;
        if (updateData[typedKey] === undefined || updateData[typedKey] === '') {
          delete updateData[typedKey];
        }
      });

      const response = await authService.updateUserInfo(updateData);
      const updatedUser = response.user;
      onUserUpdate(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      bio: user.bio || '',
      companyName: user.advertiserDetails?.companyName || '',
      companyWebsite: user.advertiserDetails?.companyWebsite || '',
      advertiserTypes: user.advertiserDetails?.advertiserTypes || [],
      tiktokUrl: user.tiktokUrl || '',
      instagramUrl: user.instagramUrl || '',
      snapchatUrl: user.snapchatUrl || '',
      youtubeUrl: user.youtubeUrl || '',
      twitterUrl: user.twitterUrl || '',
      websiteUrl: user.websiteUrl || '',
      discordChannelUrl: user.advertiserDetails?.discordChannelUrl || '',
    });
    setIsEditing(false);
  };

  const handleProductUpdate = async (works: AdvertiserWork[]) => {
    try {
      setIsSaving(true);
      const response = await authService.updateUserInfo({
        advertiserDetails: {
          companyName: user.advertiserDetails?.companyName || '',
          companyWebsite: user.advertiserDetails?.companyWebsite,
          advertiserTypes: user.advertiserDetails?.advertiserTypes || [],
          verified: user.advertiserDetails?.verified || false,
          advertiserWork: works,
        }
      });
      const updatedUser = response.user;
      onUserUpdate(updatedUser);
    } catch (error) {
      console.error('Failed to update products:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const advertiserTypeOptions = Object.values(AdvertiserType).map(type => ({
    value: type,
    display: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  }));

  const getAdvertiserTypeDisplay = (type: AdvertiserType) => {
    const option = advertiserTypeOptions.find(opt => opt.value === type);
    return option ? option.display : type;
  };

  const handleAdvertiserTypeToggle = (type: AdvertiserType) => {
    setEditData(prev => ({
      ...prev,
      advertiserTypes: prev.advertiserTypes.includes(type)
        ? prev.advertiserTypes.filter(t => t !== type)
        : [...prev.advertiserTypes, type]
    }));
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
                    alt={user.advertiserDetails?.companyName || user.name}
                    width={80}
                    height={80}
                    className="rounded-xl object-cover border-4 border-white shadow-lg bg-white"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-xl font-bold text-white">
                      {(user.advertiserDetails?.companyName || user.name).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and Info */}
              <div className="flex-1 sm:pt-0 pt-2">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.advertiserDetails?.companyName || user.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    {user.advertiserDetails?.verified && (
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckBadgeIcon className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-1 mb-3">
                  <div className="text-sm text-gray-600">
                    Contact: {user.name} • {user.email}
                    {user.phoneNumber && <span> • {user.phoneNumber}</span>}
                  </div>
                </div>
                
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
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
                  value={editData.bio}
                  onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about your company..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-400"
                  rows={4}
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              )}
            </div>
          )}

          {/* Products Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Products</h2>
              {!isViewOnly && (
                <button
                  onClick={() => setShowProductManager(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Product
                </button>
              )}
            </div>

            {user.advertiserDetails?.advertiserWork && user.advertiserDetails.advertiserWork.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.advertiserDetails.advertiserWork.map((work, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedProduct(work)}
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
                        1 media file
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products shown yet</h3>
                <p className="text-gray-600">
                  {isViewOnly ? 'This advertiser has not added any products.' : "Add your company's products to attract promoters."}
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
              {isEditing ? (
                socialPlatforms.map(platform => (
                  <div key={platform.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{platform.name}</label>
                    <input
                      type="url"
                      value={editData[platform.key as keyof typeof editData]}
                      onChange={(e) => setEditData(prev => ({ ...prev, [platform.key]: e.target.value }))
                      }
                      placeholder={`https://${platform.name.toLowerCase()}.com/your-profile`}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                ))
              ) : (
                socialPlatforms.map((platform) => {
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
                })
              )}
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Info</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={editData.companyName}
                    onChange={(e) => setEditData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                  <input
                    type="url"
                    value={editData.companyWebsite}
                    onChange={(e) => setEditData(prev => ({ ...prev, companyWebsite: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {user.advertiserDetails?.companyName && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <BuildingOfficeIcon className="w-5 h-5 text-gray-500" />
                    <span>{user.advertiserDetails.companyName}</span>
                  </div>
                )}
                {user.advertiserDetails?.companyWebsite && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <GlobeAltIcon className="w-5 h-5 text-gray-500" />
                    <a href={user.advertiserDetails.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {user.advertiserDetails.companyWebsite}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Advertiser Types */}
          {((user.advertiserDetails?.advertiserTypes && user.advertiserDetails.advertiserTypes.length > 0) || isEditing) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {advertiserTypeOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleAdvertiserTypeToggle(option.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        editData.advertiserTypes.includes(option.value)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {option.display}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.advertiserDetails?.advertiserTypes.map(type => (
                    <span key={type} className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm font-medium">
                      {getAdvertiserTypeDisplay(type)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showProductManager && (
        <AdvertiserPortfolioManager
          works={user.advertiserDetails?.advertiserWork || []}
          onUpdate={handleProductUpdate}
          onClose={() => setShowProductManager(false)}
        />
      )}

      {selectedProduct && (
        <AdvertiserPortfolioDetailModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          work={selectedProduct}
        />
      )}
    </div>
  );
}
