"use client";

import { User } from "@/app/interfaces/user";
import { SOCIAL_MEDIA_PLATFORMS } from "@/app/const/promoter-profile-const";

interface SocialMediaSectionProps {
  user: User;
  isEditing: boolean;
  editData: {
    tiktokUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
    twitterUrl: string;
    snapchatUrl: string;
    websiteUrl: string;
  };
  onEditDataChange: (field: string, value: string) => void;
}

export default function SocialMediaSection({
  user,
  isEditing,
  editData,
  onEditDataChange,
}: SocialMediaSectionProps) {
  const socialMediaItems = [
    {
      key: "tiktokUrl",
      config: SOCIAL_MEDIA_PLATFORMS.TIKTOK,
      value: user.tiktokUrl,
      editValue: editData.tiktokUrl,
    },
    {
      key: "instagramUrl",
      config: SOCIAL_MEDIA_PLATFORMS.INSTAGRAM,
      value: user.instagramUrl,
      editValue: editData.instagramUrl,
    },
    {
      key: "youtubeUrl",
      config: SOCIAL_MEDIA_PLATFORMS.YOUTUBE,
      value: user.youtubeUrl,
      editValue: editData.youtubeUrl,
    },
    {
      key: "twitterUrl",
      config: SOCIAL_MEDIA_PLATFORMS.TWITTER,
      value: user.twitterUrl,
      editValue: editData.twitterUrl,
    },
    {
      key: "snapchatUrl",
      config: SOCIAL_MEDIA_PLATFORMS.SNAPCHAT,
      value: user.snapchatUrl,
      editValue: editData.snapchatUrl,
    },
    {
      key: "websiteUrl",
      config: SOCIAL_MEDIA_PLATFORMS.WEBSITE,
      value: user.websiteUrl,
      editValue: editData.websiteUrl,
    },
  ];
  const renderSocialMediaLink = (item: (typeof socialMediaItems)[0]) => {
    const style: React.CSSProperties = {
      color: item.config.color,
      fontWeight: item.key === "snapchatUrl" ? "bold" : "normal",
    };

    if (item.config.background) {
      style.background = item.config.background;
    } else if (item.config.backgroundColor) {
      style.backgroundColor = item.config.backgroundColor;
    }

    if (item.value) {
      return (
        <a
          key={item.key}
          href={item.value}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors text-xs"
          style={style}
        >
          <span>{item.config.display}</span>
        </a>
      );
    } else {
      return (
        <span
          key={item.key}
          className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs border"
          style={{
            backgroundColor: "#f3f4f6",
            color: "#374151",
            borderColor: "#d1d5db",
          }}
        >
          <span>{item.config.display}</span>
        </span>
      );
    }
  };

  return (
    <div className="mt-8 mb-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        Social Media
      </h3>
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {socialMediaItems.map((item) => (
            <div key={item.key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {item.config.name}
              </label>
              <input
                type="url"
                value={item.editValue}
                onChange={(e) => onEditDataChange(item.key, e.target.value)}
                placeholder={item.config.placeholder}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {socialMediaItems.map(renderSocialMediaLink)}
        </div>
      )}
    </div>
  );
}
