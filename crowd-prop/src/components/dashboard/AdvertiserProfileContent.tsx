'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User } from '@/app/interfaces/user';
import { AdvertiserType } from '@/app/enums/advertiser-type';
import { AdvertiserWork } from '@/app/interfaces/advertiser-work';
import { authService } from '@/services/auth.service';
import AdvertiserPortfolioManager from './AdvertiserPortfolioManager';
import AdvertiserPortfolioDetailModal from './AdvertiserPortfolioDetailModal';

interface AdvertiserProfileContentProps {
  user: User;
  onUserUpdate: (user: User) => void;
  isViewOnly?: boolean;
}

export default function AdvertiserProfileContent({ user, onUserUpdate, isViewOnly = false }: AdvertiserProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPortfolioManager, setShowPortfolioManager] = useState(false);
  const [selectedWork, setSelectedWork] = useState<AdvertiserWork | null>(null);
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
  });

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Advertiser type mapping for display purposes
  const advertiserTypeOptions = [
    { value: AdvertiserType.EDUCATION, display: 'Education' },
    { value: AdvertiserType.CLOTHING, display: 'Clothing & Fashion' },
    { value: AdvertiserType.TECH, display: 'Technology' },
    { value: AdvertiserType.BEAUTY, display: 'Beauty & Cosmetics' },
    { value: AdvertiserType.FOOD, display: 'Food & Beverage' },
    { value: AdvertiserType.HEALTH, display: 'Health & Fitness' },
    { value: AdvertiserType.ENTERTAINMENT, display: 'Entertainment' },
    { value: AdvertiserType.TRAVEL, display: 'Travel & Tourism' },
    { value: AdvertiserType.FINANCE, display: 'Finance & Banking' },
    { value: AdvertiserType.SPORTS, display: 'Sports & Recreation' },
    { value: AdvertiserType.AUTOMOTIVE, display: 'Automotive' },
    { value: AdvertiserType.ART, display: 'Art & Design' },
    { value: AdvertiserType.GAMING, display: 'Gaming' },
    { value: AdvertiserType.ECOMMERCE, display: 'E-commerce' },
    { value: AdvertiserType.MEDIA, display: 'Media & Publishing' },
    { value: AdvertiserType.NON_PROFIT, display: 'Non-Profit' },
    { value: AdvertiserType.REAL_ESTATE, display: 'Real Estate' },
    { value: AdvertiserType.HOME_SERVICES, display: 'Home Services' },
    { value: AdvertiserType.EVENTS, display: 'Events & Venues' },
    { value: AdvertiserType.CONSULTING, display: 'Consulting' },
    { value: AdvertiserType.BOOKS, display: 'Books & Literature' },
    { value: AdvertiserType.MUSIC, display: 'Music & Audio' },
    { value: AdvertiserType.PETS, display: 'Pets & Animals' },
    { value: AdvertiserType.TOYS, display: 'Toys & Games' },
    { value: AdvertiserType.BABY, display: 'Baby & Kids' },
    { value: AdvertiserType.JEWELRY, display: 'Jewelry & Accessories' },
    { value: AdvertiserType.SCIENCE, display: 'Science & Research' },
    { value: AdvertiserType.HARDWARE, display: 'Hardware & Tools' },
    { value: AdvertiserType.ENERGY, display: 'Energy & Environment' },
    { value: AdvertiserType.AGRICULTURE, display: 'Agriculture & Farming' },
    { value: AdvertiserType.GOVERNMENT, display: 'Government & Public' },
    { value: AdvertiserType.OTHER, display: 'Other' },
  ];

  const getAdvertiserTypeDisplay = (type: AdvertiserType) => {
    const option = advertiserTypeOptions.find(opt => opt.value === type);
    return option ? option.display : type;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Clean and prepare the update data - only include editable fields
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
        }
      };

      // Remove empty/undefined fields
      Object.keys(updateData).forEach(key => {
        const typedKey = key as keyof typeof updateData;
        if (updateData[typedKey] === undefined || updateData[typedKey] === '') {
          delete updateData[typedKey];
        }
      });

      console.log('Sending update data:', updateData);

      // Update user profile via authService
      const response = await authService.updateUserInfo(updateData);

      const updatedUser = response.user;

      // Update the parent component with the updated user
      onUserUpdate(updatedUser);
      console.log('Updated user:', updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // TODO: Show error message to user
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset edit data to original values
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
    });
    setIsEditing(false);
  };

  const handleAdvertiserTypeToggle = (type: AdvertiserType) => {
    setEditData(prev => ({
      ...prev,
      advertiserTypes: prev.advertiserTypes.includes(type)
        ? prev.advertiserTypes.filter(t => t !== type)
        : [...prev.advertiserTypes, type]
    }));
  };

  const handlePortfolioUpdate = async (works: AdvertiserWork[]) => {
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
      console.error('Failed to update portfolio:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-32 overflow-hidden">
          {/* Background gradient - this will be visible if image fails */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 z-0"></div>
          
          {/* Pattern overlay for visual interest */}
          <div className="absolute inset-0 opacity-20 z-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>
          
          {/* Company-themed overlay pattern */}
          <div className="absolute inset-0 bg-black bg-opacity-10 z-20"></div>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 relative z-30">
          <div className="flex items-start justify-between -mt-12 mb-4">
            <div className="flex items-end space-x-4">
              {/* Profile Picture */}
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="w-full h-full rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-500">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and Role */}
              <div className="pt-8">
                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600 font-medium">
                  {user.advertiserDetails?.companyName || 'Advertiser'}
                </p>
                {user.advertiserDetails?.verified && (
                  <div className="flex items-center mt-1">
                    <span className="text-green-500 mr-1">✓</span>
                    <span className="text-sm text-gray-600">Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            {!isViewOnly && (
              <div className="pt-8">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Edit Profile"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      title={isSaving ? 'Saving...' : 'Save Changes'}
                    >
                      {isSaving ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Company Info and Bio - Side by side */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Company Name</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.companyName}
                  onChange={(e) => setEditData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Enter your company name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                />
              ) : (
                <p className="text-gray-600 text-sm">
                  {user.advertiserDetails?.companyName || 'No company name specified'}
                </p>
              )}
            </div>

            {/* Company Website */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Company Website</h3>
              {isEditing ? (
                <input
                  type="url"
                  value={editData.companyWebsite}
                  onChange={(e) => setEditData(prev => ({ ...prev, companyWebsite: e.target.value }))}
                  placeholder="https://yourcompany.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                />
              ) : (
                user.advertiserDetails?.companyWebsite ? (
                  <a
                    href={user.advertiserDetails.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    {user.advertiserDetails.companyWebsite}
                  </a>
                ) : (
                  <p className="text-gray-600 text-sm">No website specified</p>
                )
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <h3 className="text-base font-semibold text-gray-900 mb-2">About Company</h3>
            {isEditing ? (
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about your company..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-400"
                rows={3}
              />
            ) : (
              <p className="text-gray-600 leading-relaxed text-sm">
                {user.bio || 'No company description provided yet.'}
              </p>
            )}
          </div>

          {/* Social Media Links */}
          <div className="mt-8 mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Social Media & Links</h3>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">TikTok</label>
                  <input
                    type="url"
                    value={editData.tiktokUrl}
                    onChange={(e) => setEditData(prev => ({ ...prev, tiktokUrl: e.target.value }))}
                    placeholder="https://tiktok.com/@company"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={editData.instagramUrl}
                    onChange={(e) => setEditData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                    placeholder="https://instagram.com/company"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">YouTube</label>
                  <input
                    type="url"
                    value={editData.youtubeUrl}
                    onChange={(e) => setEditData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                    placeholder="https://youtube.com/@company"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">X (Twitter)</label>
                  <input
                    type="url"
                    value={editData.twitterUrl}
                    onChange={(e) => setEditData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                    placeholder="https://x.com/company"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Snapchat</label>
                  <input
                    type="url"
                    value={editData.snapchatUrl}
                    onChange={(e) => setEditData(prev => ({ ...prev, snapchatUrl: e.target.value }))}
                    placeholder="https://snapchat.com/add/company"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={editData.websiteUrl}
                    onChange={(e) => setEditData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {/* TikTok */}
                {user.tiktokUrl ? (
                  <a
                    href={user.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors text-xs"
                    style={{ backgroundColor: '#000000', color: 'white' }}
                  >
                    <span>TikTok</span>
                  </a>
                ) : (
                  <span className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs border" style={{ backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' }}>
                    <span>TikTok</span>
                  </span>
                )}
                
                {/* Instagram */}
                {user.instagramUrl ? (
                  <a
                    href={user.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors text-xs"
                    style={{ background: 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)', color: 'white' }}
                  >
                    <span>Instagram</span>
                  </a>
                ) : (
                  <span className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs border" style={{ backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' }}>
                    <span>Instagram</span>
                  </span>
                )}
                
                {/* YouTube */}
                {user.youtubeUrl ? (
                  <a
                    href={user.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors text-xs"
                    style={{ backgroundColor: '#dc2626', color: 'white' }}
                  >
                    <span>YouTube</span>
                  </a>
                ) : (
                  <span className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs border" style={{ backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' }}>
                    <span>YouTube</span>
                  </span>
                )}
                
                {/* X (Twitter) */}
                {user.twitterUrl ? (
                  <a
                    href={user.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors text-xs"
                    style={{ backgroundColor: '#000000', color: 'white' }}
                  >
                    <span>𝕏</span>
                  </a>
                ) : (
                  <span className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs border" style={{ backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' }}>
                    <span>𝕏</span>
                  </span>
                )}
                
                {/* Snapchat */}
                {user.snapchatUrl ? (
                  <a
                    href={user.snapchatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors text-xs"
                    style={{ backgroundColor: '#FFFC00', color: 'black', fontWeight: 'bold' }}
                  >
                    <span>👻</span>
                  </a>
                ) : (
                  <span className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs border" style={{ backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' }}>
                    <span>👻</span>
                  </span>
                )}
                
                {/* Website */}
                {user.websiteUrl ? (
                  <a
                    href={user.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors text-xs"
                    style={{ backgroundColor: '#4b5563', color: 'white' }}
                  >
                    <span>Website</span>
                  </a>
                ) : (
                  <span className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs border" style={{ backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' }}>
                    <span>Website</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Business Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {user.advertiserDetails?.verified ? '✓' : '⏳'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {user.advertiserDetails?.verified ? 'Verified' : 'Pending Verification'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ${user.walletBalance?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-500 mt-1">Wallet Balance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {user.advertiserDetails?.advertiserTypes?.length || 0}
            </div>
            <div className="text-sm text-gray-500 mt-1">Business Categories</div>
          </div>
        </div>
      </div>

      {/* Business Categories */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Business Categories</h3>
        {isEditing ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {advertiserTypeOptions.map((type) => (
              <label key={type.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editData.advertiserTypes.includes(type.value)}
                  onChange={() => handleAdvertiserTypeToggle(type.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">{type.display}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {user.advertiserDetails?.advertiserTypes?.map((type) => (
              <span
                key={type}
                className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
              >
                {getAdvertiserTypeDisplay(type)}
              </span>
            )) || <span className="text-gray-500 text-sm">No categories specified</span>}
          </div>
        )}
      </div>

      {/* Products/Services Portfolio */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">Products & Services</h3>
          {!isViewOnly && (
            <button 
              onClick={() => setShowPortfolioManager(true)}
              className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              title="Manage Products & Services"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </button>
          )}
        </div>
        
        {user.advertiserDetails?.advertiserWork && user.advertiserDetails.advertiserWork.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.advertiserDetails.advertiserWork.map((work: AdvertiserWork, index: number) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedWork(work)}
              >
                <div className="aspect-video bg-gray-100 relative">
                  {work.mediaUrl && (
                    <Image
                      src={work.mediaUrl}
                      alt={work.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  {work.price && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                      ${work.price}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-gray-900 mb-1 text-sm">
                    {truncateText(work.title, 30)}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {truncateText(work.description, 60)}
                  </p>
                  {work.websiteUrl && (
                    <a
                      href={work.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Learn More
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h4 className="text-base font-medium text-gray-900 mb-1">No products or services yet</h4>
            <p className="text-gray-500 mb-3 text-sm">
              {isViewOnly 
                ? "This advertiser hasn't added any products or services yet" 
                : "Showcase your products and services to attract promoters"
              }
            </p>
            {!isViewOnly && (
              <button 
                onClick={() => setShowPortfolioManager(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Add Product/Service
              </button>
            )}
          </div>
        )}
      </div>

      {/* Portfolio Manager Modal */}
      {showPortfolioManager && (
        <AdvertiserPortfolioManager
          works={user.advertiserDetails?.advertiserWork || []}
          onUpdate={handlePortfolioUpdate}
          onClose={() => setShowPortfolioManager(false)}
        />
      )}

      {/* Portfolio Detail Modal */}
      {selectedWork && (
        <AdvertiserPortfolioDetailModal
          work={selectedWork}
          onClose={() => setSelectedWork(null)}
        />
      )}
    </div>
  );
}
