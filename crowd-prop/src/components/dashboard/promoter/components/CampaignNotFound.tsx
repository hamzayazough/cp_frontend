"use client";

import Link from "next/link";
import { routes } from "@/lib/router";

export default function CampaignNotFound() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Campaign Not Found
      </h2>
      <p className="text-gray-600 mb-6">
        The campaign you&apos;re looking for doesn&apos;t exist or you
        don&apos;t have access to it.
      </p>
      <Link
        href={routes.dashboardCampaigns}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Campaigns
      </Link>
    </div>
  );
}
