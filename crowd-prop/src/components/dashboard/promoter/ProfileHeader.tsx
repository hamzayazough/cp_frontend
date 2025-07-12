"use client";

import Image from "next/image";
import { User } from "@/app/interfaces/user";
import {
  DEFAULT_COVER_IMAGE,
  PROFILE_CONSTANTS,
} from "@/app/const/promoter-profile-const";

interface ProfileHeaderProps {
  user: User;
  isEditing: boolean;
  isSaving: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
}

export default function ProfileHeader({
  user,
  isEditing,
  isSaving,
  onEditClick,
  onSaveClick,
  onCancelClick,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {" "}
      {/* Cover Photo */}
      <div
        className={`relative ${PROFILE_CONSTANTS.COVER_HEIGHT} overflow-hidden`}
      >
        {/* Background image - using fallback image for now */}
        <Image
          src={DEFAULT_COVER_IMAGE}
          alt="Profile background"
          fill
          priority
          className="object-cover"
          unoptimized
          onLoad={() => console.log("Background image loaded successfully")}
          onError={(e) => {
            console.log("Background image failed to load");
            e.currentTarget.style.display = "none";
          }}
        />

        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-600/50 z-10"></div>
      </div>{" "}
      {/* Profile Info */}
      <div className="px-6 pb-6 relative z-20">
        <div className="flex items-start justify-between -mt-12 mb-4">
          <div className="flex items-end space-x-4 relative z-20">
            {/* Profile Picture */}
            <div
              className={`${PROFILE_CONSTANTS.AVATAR_SIZE} rounded-full bg-white p-1 shadow-lg`}
            >
              {user.avatarUrl ? (
                <div className="w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={88}
                    height={88}
                    className="rounded-full object-cover"
                    style={{ width: "100%", height: "100%" }}
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-500">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {/* Name and Role */}
            <div className="pt-8">
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600 font-medium">Content Creator</p>
              {user.rating && (
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-sm text-gray-600">
                    {user.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>{" "}
          {/* Edit Button */}
          <div className="pt-8 relative z-20">
            {!isEditing ? (
              <button
                onClick={onEditClick}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Edit Profile"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={onCancelClick}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={onSaveClick}
                  disabled={isSaving}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  title={isSaving ? "Saving..." : "Save Changes"}
                >
                  {isSaving ? (
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
