"use client";

import {
  ChartBarIcon,
  EyeIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

interface AdvertiserCampaignTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdvertiserCampaignTabs({ 
  activeTab, 
  onTabChange 
}: AdvertiserCampaignTabsProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: ChartBarIcon },
    { id: "promoters", label: "Promoters", icon: UsersIcon },
    { id: "performance", label: "Performance", icon: EyeIcon },
    { id: "requirements", label: "Requirements", icon: CheckCircleIcon },
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
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
