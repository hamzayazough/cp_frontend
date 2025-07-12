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
}

export default function BioLocationSection({
  user,
  isEditing,
  editData,
  onEditDataChange,
}: BioLocationSectionProps) {
  return (
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    </div>
  );
}
