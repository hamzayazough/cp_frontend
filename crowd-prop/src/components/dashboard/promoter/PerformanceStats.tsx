"use client";

import { User } from "@/app/interfaces/user";

interface PerformanceStatsProps {
  user: User;
}

export default function PerformanceStats({ user }: PerformanceStatsProps) {
  const stats = [
    {
      value: user.promoterDetails?.numberOfCampaignDone || 0,
      label: "Campaigns Done",
      color: "text-blue-600",
    },
    {
      value: `$${user.promoterDetails?.totalSales?.toFixed(2) || "0.00"}`,
      label: "Total Sales",
      color: "text-green-600",
    },
    {
      value: user.promoterDetails?.totalViewsGenerated?.toLocaleString() || "0",
      label: "Views Generated",
      color: "text-purple-600",
    },
    {
      value: user.rating ? user.rating.toFixed(1) : "N/A",
      label: "Rating",
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Performance Stats
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
