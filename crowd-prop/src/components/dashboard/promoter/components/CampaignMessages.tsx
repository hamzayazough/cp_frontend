"use client";

import Link from "next/link";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { routes } from "@/lib/router";

interface CampaignMessagesProps {
  campaignId: string;
}

export default function CampaignMessages({ campaignId }: CampaignMessagesProps) {
  return (
    <div className="text-center py-8">
      <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No messages yet
      </h3>
      <p className="text-gray-600 mb-4">
        Start a conversation with the advertiser
      </p>
      <Link
        href={routes.messageThread(campaignId)}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Send Message
      </Link>
    </div>
  );
}
