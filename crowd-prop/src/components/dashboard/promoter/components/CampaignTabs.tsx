"use client";

import {
  ChartBarIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

interface CampaignTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasNewMessages?: boolean;
  unreadCount?: number;
}

export default function CampaignTabs({
  activeTab,
  onTabChange,
  hasNewMessages = false,
  unreadCount = 0,
}: CampaignTabsProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: ChartBarIcon },
    { id: "media", label: "Media", icon: PhotoIcon },
    { id: "performance", label: "Performance", icon: EyeIcon },
    { id: "messages", label: "Messages", icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
                {/* Show notification badge for Messages tab */}
                {tab.id === "messages" && hasNewMessages && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
