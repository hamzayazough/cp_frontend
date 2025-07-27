"use client";

import routes from "@/lib/router";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateCampaignButton() {
  const router = useRouter();

  const handleCreateCampaign = () => {
    router.push(routes.dashboardCampaigns + "/create");
  };

  return (
    <button
      onClick={handleCreateCampaign}
      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
    >
      <Plus className="h-4 w-4" />
      <span>Verify Funds</span>
    </button>
  );
}
