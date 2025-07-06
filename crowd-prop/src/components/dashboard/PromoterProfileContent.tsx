'use client';

import { useState } from 'react';
import { User } from '@/app/interfaces/user';
import { Language } from '@/app/enums/language';
import { PromoterWork } from '@/app/interfaces/promoter-work';
import { authService } from '@/services/auth.service';
import PortfolioManager from './PortfolioManager';
import PortfolioDetailModal from './PortfolioDetailModal';

interface PromoterProfileContentProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export default function PromoterProfileContent({ user, onUserUpdate }: PromoterProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPortfolioManager, setShowPortfolioManager] = useState(false);
  const [selectedWork, setSelectedWork] = useState<PromoterWork | null>(null);
  const [editData, setEditData] = useState({
    name: user.name,
    bio: user.bio || '',
    location: user.promoterDetails?.location || '',
    languagesSpoken: user.promoterDetails?.languagesSpoken || [],
    skills: user.promoterDetails?.skills || [],
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

  // Language mapping for display purposes
  const languageOptions = [
    { value: Language.ENGLISH, display: 'English' },
    { value: Language.SPANISH, display: 'Spanish' },
    { value: Language.FRENCH, display: 'French' },
    { value: Language.GERMAN, display: 'German' },
    { value: Language.ITALIAN, display: 'Italian' },
    { value: Language.PORTUGUESE, display: 'Portuguese' },
    { value: Language.RUSSIAN, display: 'Russian' },
    { value: Language.CHINESE, display: 'Chinese' },
    { value: Language.JAPANESE, display: 'Japanese' },
    { value: Language.KOREAN, display: 'Korean' },
    { value: Language.ARABIC, display: 'Arabic' },
    { value: Language.HINDI, display: 'Hindi' },
    { value: Language.DUTCH, display: 'Dutch' },
    { value: Language.TURKISH, display: 'Turkish' },
    { value: Language.POLISH, display: 'Polish' },
    { value: Language.SWEDISH, display: 'Swedish' },
  ];

  const skillsOptions = [
    'Video Editing', 'Photography', 'Content Writing', 'Graphic Design',
    'Social Media Management', 'Influencer Marketing', 'Brand Partnerships',
    'Live Streaming', 'Comedy/Entertainment', 'Fashion/Beauty', 'Fitness/Health',
    'Tech Reviews', 'Gaming', 'Cooking/Food', 'Travel', 'Education/Tutorials'
  ];

  const getLanguageDisplay = (language: Language) => {
    const option = languageOptions.find(opt => opt.value === language);
    return option ? option.display : language;
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
        promoterDetails: {
          location: editData.location?.trim(),
          languagesSpoken: editData.languagesSpoken,
          skills: editData.skills,
        }
      };

      // Remove empty/undefined fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === '') {
          delete updateData[key];
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
      location: user.promoterDetails?.location || '',
      languagesSpoken: user.promoterDetails?.languagesSpoken || [],
      skills: user.promoterDetails?.skills || [],
      tiktokUrl: user.tiktokUrl || '',
      instagramUrl: user.instagramUrl || '',
      snapchatUrl: user.snapchatUrl || '',
      youtubeUrl: user.youtubeUrl || '',
      twitterUrl: user.twitterUrl || '',
      websiteUrl: user.websiteUrl || '',
    });
    setIsEditing(false);
  };

  const handleLanguageToggle = (language: Language) => {
    setEditData(prev => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.includes(language)
        ? prev.languagesSpoken.filter(l => l !== language)
        : [...prev.languagesSpoken, language]
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handlePortfolioUpdate = async (works: PromoterWork[]) => {
    try {
      setIsSaving(true);
      const response = await authService.updateUserInfo({
        promoterDetails: {
          ...user.promoterDetails,
          works: works,
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
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          {/* Background image - using fallback image for now */}
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Profile background"
            className="absolute inset-0 w-full h-full object-cover z-10"
            onLoad={() => console.log('Background image loaded successfully')}
            onError={(e) => {
              console.log('Background image failed to load');
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-start justify-between -mt-12 mb-4">
            <div className="flex items-end space-x-4">
              {/* Profile Picture */}
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
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
                <p className="text-gray-600 font-medium">Content Creator</p>
                {user.rating && (
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-sm text-gray-600">{user.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
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
          </div>

          {/* Bio and Location - Side by side */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bio */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">About</h3>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-400"
                  rows={3}
                />
              ) : (
                <p className="text-gray-600 leading-relaxed text-sm">
                  {user.bio || 'No bio provided yet.'}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Location</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter your location"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                />
              ) : (
                <p className="text-gray-600 text-sm">
                  {user.promoterDetails?.location || 'No location specified'}
                </p>
              )}
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-8 mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Social Media</h3>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">TikTok</label>
                  <input
                    type="url"
                    value={editData.tiktokUrl}
                    onChange={(e) => setEditData(prev => ({ ...prev, tiktokUrl: e.target.value }))}
                    placeholder="https://tiktok.com/@username"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={editData.instagramUrl}
                    onChange={(e) => setEditData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                    placeholder="https://instagram.com/username"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">YouTube</label>
                  <input
                    type="url"
                    value={editData.youtubeUrl}
                    onChange={(e) => setEditData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                    placeholder="https://youtube.com/@username"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">X (Twitter)</label>
                  <input
                    type="url"
                    value={editData.twitterUrl}
                    onChange={(e) => setEditData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                    placeholder="https://x.com/username"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Snapchat</label>
                  <input
                    type="url"
                    value={editData.snapchatUrl}
                    onChange={(e) => setEditData(prev => ({ ...prev, snapchatUrl: e.target.value }))}
                    placeholder="https://snapchat.com/add/username"
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

      {/* Performance Stats - Moved up for prominence */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{user.promoterDetails?.numberOfCampaignDone || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Campaigns Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${user.promoterDetails?.totalSales?.toFixed(2) || '0.00'}</div>
            <div className="text-sm text-gray-500 mt-1">Total Sales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{user.promoterDetails?.totalViewsGenerated?.toLocaleString() || '0'}</div>
            <div className="text-sm text-gray-500 mt-1">Views Generated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{user.rating ? user.rating.toFixed(1) : 'N/A'}</div>
            <div className="text-sm text-gray-500 mt-1">Rating</div>
          </div>
        </div>
      </div>

      {/* Languages & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Languages */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Languages Spoken</h3>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              {languageOptions.map((language) => (
                <label key={language.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editData.languagesSpoken.includes(language.value)}
                    onChange={() => handleLanguageToggle(language.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">{language.display}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {user.promoterDetails?.languagesSpoken?.map((language) => (
                <span
                  key={language}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                >
                  {getLanguageDisplay(language)}
                </span>
              )) || <span className="text-gray-500 text-sm">No languages specified</span>}
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              {skillsOptions.map((skill) => (
                <label key={skill} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editData.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">{skill}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {user.promoterDetails?.skills?.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              )) || <span className="text-gray-500 text-sm">No skills specified</span>}
            </div>
          )}
        </div>
      </div>

      {/* Portfolio */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">Portfolio</h3>
          <button 
            onClick={() => setShowPortfolioManager(true)}
            className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            title="Manage Portfolio"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>
        </div>
        
        {user.promoterDetails?.works && user.promoterDetails.works.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.promoterDetails.works.map((work: PromoterWork, index: number) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedWork(work)}
              >
                <div className="aspect-video bg-gray-100 relative">
                  {work.mediaUrl && (
                    <img
                      src={work.mediaUrl}
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-gray-900 mb-1 text-sm">
                    {truncateText(work.title, 30)}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {truncateText(work.description, 60)}
                  </p>
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
            <h4 className="text-base font-medium text-gray-900 mb-1">No portfolio items yet</h4>
            <p className="text-gray-500 mb-3 text-sm">Showcase your best work to attract more clients</p>
            <button 
              onClick={() => setShowPortfolioManager(true)}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Add Portfolio Item
            </button>
          </div>
        )}
      </div>

      {/* Portfolio Manager Modal */}
      {showPortfolioManager && (
        <PortfolioManager
          works={user.promoterDetails?.works || []}
          onUpdate={handlePortfolioUpdate}
          onClose={() => setShowPortfolioManager(false)}
        />
      )}

      {/* Portfolio Detail Modal */}
      {selectedWork && (
        <PortfolioDetailModal
          work={selectedWork}
          onClose={() => setSelectedWork(null)}
        />
      )}
    </div>
  );
}
