"use client";

import { OnboardingData } from "../UserOnboarding";

interface BasicInformationProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function BasicInformation({
  data,
  onUpdate,
  onNext,
  onBack,
}: BasicInformationProps) {
  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    onUpdate({ [field]: value });
  };

  const isValid = data.name.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell us about yourself
        </h2>
        <p className="text-gray-600">
          This information will be visible on your profile
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={data.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
            placeholder="Tell us a bit about yourself..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {data.bio.length}/200 characters
          </p>
        </div>

        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Preferred Currency *
          </label>
          <select
            id="currency"
            value={data.usedCurrency}
            onChange={(e) => handleInputChange("usedCurrency", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            This will be used for payments and earnings display
          </p>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Social Media Links
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="instagram"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Instagram
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm">
                  @
                </span>
                <input
                  id="instagram"
                  type="text"
                  value={data.instagramUrl}
                  onChange={(e) =>
                    handleInputChange("instagramUrl", e.target.value)
                  }
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="tiktok"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                TikTok
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm">
                  @
                </span>
                <input
                  id="tiktok"
                  type="text"
                  value={data.tiktokUrl}
                  onChange={(e) =>
                    handleInputChange("tiktokUrl", e.target.value)
                  }
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="youtube"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                YouTube
              </label>
              <input
                id="youtube"
                type="url"
                value={data.youtubeUrl}
                onChange={(e) =>
                  handleInputChange("youtubeUrl", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="https://youtube.com/..."
              />
            </div>

            <div>
              <label
                htmlFor="twitter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Twitter/X
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm">
                  @
                </span>
                <input
                  id="twitter"
                  type="text"
                  value={data.twitterUrl}
                  onChange={(e) =>
                    handleInputChange("twitterUrl", e.target.value)
                  }
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="snapchat"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Snapchat
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm">
                  @
                </span>
                <input
                  id="snapchat"
                  type="text"
                  value={data.snapchatUrl}
                  onChange={(e) =>
                    handleInputChange("snapchatUrl", e.target.value)
                  }
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Website
              </label>
              <input
                id="website"
                type="url"
                value={data.websiteUrl}
                onChange={(e) =>
                  handleInputChange("websiteUrl", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
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
          disabled={!isValid}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
