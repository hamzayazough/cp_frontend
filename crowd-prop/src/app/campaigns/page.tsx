import Link from "next/link";
import { routes, Router } from "@/lib/router";

export default function CampaignsPage() {
  // Mock campaign data
  const campaigns = [
    { id: "1", title: "Summer Fashion Campaign", status: "active" },
    { id: "2", title: "Tech Product Launch", status: "draft" },
    { id: "3", title: "Food Blog Promotion", status: "completed" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Link
          href={routes.campaignCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Campaign
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
            <p className="text-gray-600 mb-4">Status: {campaign.status}</p>
            
            <div className="flex gap-2">
              <Link
                href={Router.campaignDetails(campaign.id)}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
              >
                View Details
              </Link>
              <Link
                href={Router.campaignEdit(campaign.id)}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href={routes.home}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
