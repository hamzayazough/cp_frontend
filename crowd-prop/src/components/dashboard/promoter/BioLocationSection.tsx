"use client";

import { User } from "@/app/interfaces/user";
import { PROFILE_CONSTANTS } from "@/app/const/promoter-profile-const";

interface BioLocationSectionProps {
  user: User;
  isEditing: boolean;
  editData: {
    bio: string;
    location: string;
  };
  onEditDataChange: (field: string, value: string) => void;
  isViewOnly?: boolean;
}

export default function BioLocationSection({
  user,
  isEditing,
  editData,
  onEditDataChange,
}: BioLocationSectionProps) {
  return (
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bio */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">About</h3>
        {isEditing ? (
          <textarea
            value={editData.bio}
            onChange={(e) => onEditDataChange("bio", e.target.value)}
            placeholder="Tell us about yourself..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-400"
            rows={PROFILE_CONSTANTS.TEXTAREA_ROWS}
          />
        ) : (
          <p className="text-gray-600 leading-relaxed text-sm">
            {user.bio || "No bio provided yet."}
          </p>
        )}
      </div>

      {/* Location */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">Location</h3>
        {isEditing ? (
          <input
            type="text"
            value={editData.location}
            onChange={(e) => onEditDataChange("location", e.target.value)}
            placeholder="Enter your location"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          />
        ) : (
          <p className="text-gray-600 text-sm">
            {user.promoterDetails?.location || "No location specified"}
          </p>
        )}
      </div>

      {/* Account Type */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          Account Type
        </h3>
        <div className="flex items-center">
          {user.promoterDetails?.isBusiness ? (
            <div className="flex items-center text-sm">
              <svg
                className="w-4 h-4 mr-2 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Business/Agency
              </span>
            </div>
          ) : (
            <div className="flex items-center text-sm">
              <svg
                className="w-4 h-4 mr-2 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Individual Creator
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
