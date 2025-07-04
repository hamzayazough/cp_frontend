'use client';

import { useState, useRef } from 'react';
import { OnboardingData } from '../UserOnboarding';
import { authService } from '@/services/auth.service';

interface ProfileImagesProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ProfileImages({ data, onUpdate, onNext, onBack }: ProfileImagesProps) {
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [backgroundUploading, setBackgroundUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(data.avatarUrl || null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(data.backgroundUrl || null);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;

    setAvatarUploading(true);

    try {
      // Upload to backend using auth service
      const response = await authService.uploadAvatar(file);
      
      // Update preview and data with the uploaded URL
      setAvatarPreview(response.result.publicUrl);
      onUpdate({ avatarUrl: response.result.publicUrl });
      
      console.log('Avatar uploaded successfully:', response.result.publicUrl);
    } catch (error) {
      console.error('Avatar upload failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload avatar. Please try again.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleBackgroundUpload = async (file: File) => {
    if (!file) return;

    setBackgroundUploading(true);

    try {
      // Upload to backend using auth service
      const response = await authService.uploadBackground(file);
      
      // Update preview and data with the uploaded URL
      setBackgroundPreview(response.result.publicUrl);
      onUpdate({ backgroundUrl: response.result.publicUrl });
      
      console.log('Background uploaded successfully:', response.result.publicUrl);
    } catch (error) {
      console.error('Background upload failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload background. Please try again.');
    } finally {
      setBackgroundUploading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleBackgroundUpload(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    onUpdate({ avatarUrl: undefined });
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  };

  const removeBackground = () => {
    setBackgroundPreview(null);
    onUpdate({ backgroundUrl: undefined });
    if (backgroundInputRef.current) {
      backgroundInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Profile Images
        </h2>
        <p className="text-gray-600">
          Add a profile picture and background to make your profile stand out
        </p>
      </div>

      <div className="space-y-8">
        {/* Avatar Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Profile Picture
          </label>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              {avatarPreview && (
                <button
                  onClick={removeAvatar}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex flex-col items-center space-y-2">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  avatarUploading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {avatarUploading ? 'Uploading...' : avatarPreview ? 'Change Picture' : 'Upload Picture'}
              </label>
              <p className="text-xs text-gray-500">JPEG, PNG, WebP up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Background Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Background Image (Optional)
          </label>
          <div className="space-y-4">
            <div className="relative">
              <div className="w-full aspect-[3/1] bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                {backgroundPreview ? (
                  <img
                    src={backgroundPreview}
                    alt="Background preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-500 text-sm">Background Image</p>
                  </div>
                )}
              </div>
              {backgroundPreview && (
                <button
                  onClick={removeBackground}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex justify-center">
              <input
                ref={backgroundInputRef}
                type="file"
                accept="image/*"
                onChange={handleBackgroundChange}
                className="hidden"
                id="background-upload"
              />
              <label
                htmlFor="background-upload"
                className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  backgroundUploading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {backgroundUploading ? 'Uploading...' : backgroundPreview ? 'Change Background' : 'Upload Background'}
              </label>
            </div>
            <p className="text-xs text-gray-500 text-center">JPEG, PNG, WebP up to 10MB</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Profile Tips
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              A professional profile picture and engaging background help you make a great first impression with {data.role === 'PROMOTER' ? 'brands' : 'content creators'}.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={avatarUploading || backgroundUploading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {avatarUploading || backgroundUploading ? 'Uploading...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
