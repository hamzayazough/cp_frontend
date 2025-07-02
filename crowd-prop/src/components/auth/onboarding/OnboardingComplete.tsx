'use client';

import { OnboardingData } from '../UserOnboarding';

interface OnboardingCompleteProps {
  data: OnboardingData;
  userEmail: string;
  onComplete: () => void;
  onBack: () => void;
}

export default function OnboardingComplete({ data, userEmail, onComplete, onBack }: OnboardingCompleteProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Profile Complete!
        </h2>
        <p className="text-gray-600">
          Review your information before finishing setup
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Basic Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="text-gray-900">{data.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-900">{userEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="text-gray-900">
                {data.role === 'ADVERTISER' ? 'Business/Advertiser' : 'Creator/Promoter'}
              </span>
            </div>
            {data.bio && (
              <div>
                <span className="text-gray-600">Bio:</span>
                <p className="text-gray-900 mt-1">{data.bio}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Social Media</h3>
          <div className="space-y-1 text-sm">
            {data.instagramUrl && (
              <div className="flex justify-between">
                <span className="text-gray-600">Instagram:</span>
                <span className="text-gray-900">@{data.instagramUrl}</span>
              </div>
            )}
            {data.tiktokUrl && (
              <div className="flex justify-between">
                <span className="text-gray-600">TikTok:</span>
                <span className="text-gray-900">@{data.tiktokUrl}</span>
              </div>
            )}
            {data.youtubeUrl && (
              <div className="flex justify-between">
                <span className="text-gray-600">YouTube:</span>
                <span className="text-gray-900">{data.youtubeUrl}</span>
              </div>
            )}
            {data.twitterUrl && (
              <div className="flex justify-between">
                <span className="text-gray-600">Twitter/X:</span>
                <span className="text-gray-900">@{data.twitterUrl}</span>
              </div>
            )}
            {data.snapchatUrl && (
              <div className="flex justify-between">
                <span className="text-gray-600">Snapchat:</span>
                <span className="text-gray-900">@{data.snapchatUrl}</span>
              </div>
            )}
            {data.websiteUrl && (
              <div className="flex justify-between">
                <span className="text-gray-600">Website:</span>
                <span className="text-gray-900">{data.websiteUrl}</span>
              </div>
            )}
          </div>
        </div>

        {data.role === 'ADVERTISER' && data.advertiserDetails && (
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Business Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Company:</span>
                <span className="text-gray-900">{data.advertiserDetails.companyName}</span>
              </div>
              {data.advertiserDetails.companyWebsite && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Website:</span>
                  <span className="text-gray-900">{data.advertiserDetails.companyWebsite}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600">Categories:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.advertiserDetails.advertiserTypes.map((type, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {data.role === 'PROMOTER' && data.promoterDetails && (
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Creator Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="text-gray-900">{data.promoterDetails.location}</span>
              </div>
              <div>
                <span className="text-gray-600">Languages:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.promoterDetails.languagesSpoken.map((language, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Skills:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.promoterDetails.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              What&apos;s Next?
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              {data.role === 'ADVERTISER' 
                ? 'You can now create campaigns and connect with talented promoters to grow your business.'
                : 'You can now browse available campaigns and start applying to promotion opportunities that match your skills.'}
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
          onClick={onComplete}
          className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
}
