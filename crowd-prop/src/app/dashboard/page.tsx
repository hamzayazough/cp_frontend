import Link from "next/link";
import { routes } from "@/lib/router";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Campaigns</h3>
          <p className="text-gray-600 mb-4">Manage your marketing campaigns</p>
          <Link
            href={routes.campaigns}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
          >
            View Campaigns
          </Link>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Messages</h3>
          <p className="text-gray-600 mb-4">Check your conversations</p>
          <Link
            href={routes.messages}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors inline-block"
          >
            View Messages
          </Link>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Profile</h3>
          <p className="text-gray-600 mb-4">Update your profile settings</p>
          <Link
            href={routes.profile}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors inline-block"
          >
            Edit Profile
          </Link>
        </div>
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
