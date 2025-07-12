"use client";

import Image from "next/image";
import { User } from "@/app/interfaces/user";
import { PromoterWork } from "@/app/interfaces/promoter-work";
import { PROFILE_CONSTANTS } from "@/app/const/promoter-profile-const";
import { truncateText } from "@/utils/promoter-profile";

interface PortfolioSectionProps {
  user: User;
  onPortfolioManagerOpen: () => void;
  onWorkSelect: (work: PromoterWork) => void;
}

export default function PortfolioSection({
  user,
  onPortfolioManagerOpen,
  onWorkSelect,
}: PortfolioSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">Portfolio</h3>
        <button
          onClick={onPortfolioManagerOpen}
          className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          title="Manage Portfolio"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
        </button>
      </div>

      {user.promoterDetails?.works && user.promoterDetails.works.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.promoterDetails.works.map(
            (work: PromoterWork, index: number) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onWorkSelect(work)}
              >
                <div className="aspect-video bg-gray-100 relative">
                  {work.mediaUrl && (
                    <Image
                      src={work.mediaUrl}
                      alt={work.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-gray-900 mb-1 text-sm">
                    {truncateText(
                      work.title,
                      PROFILE_CONSTANTS.TRUNCATE_TITLE_LENGTH
                    )}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {truncateText(
                      work.description,
                      PROFILE_CONSTANTS.TRUNCATE_DESCRIPTION_LENGTH
                    )}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h4 className="text-base font-medium text-gray-900 mb-1">
            No portfolio items yet
          </h4>
          <p className="text-gray-500 mb-3 text-sm">
            Showcase your best work to attract more clients
          </p>
          <button
            onClick={onPortfolioManagerOpen}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Add Portfolio Item
          </button>
        </div>
      )}
    </div>
  );
}
