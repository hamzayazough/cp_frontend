"use client";

import { useState } from "react";
import { User } from "@/app/interfaces/user";
import { PromoterWork } from "@/app/interfaces/promoter-work";
import { usePromoterProfileEdit } from "@/hooks/usePromoterProfileEdit";
import {
  ProfileHeader,
  BioLocationSection,
  SocialMediaSection,
  PerformanceStats,
  LanguagesSkillsSection,
  PortfolioSection,
} from "./promoter";
import PortfolioManager from "./PortfolioManager";
import PortfolioDetailModal from "./PortfolioDetailModal";

interface PromoterProfileContentProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export default function PromoterProfileContent({
  user,
  onUserUpdate,
}: PromoterProfileContentProps) {
  const [showPortfolioManager, setShowPortfolioManager] = useState(false);
  const [selectedWork, setSelectedWork] = useState<PromoterWork | null>(null);

  const {
    isEditing,
    isSaving,
    editData,
    setIsEditing,
    handleEditDataChange,
    handleLanguageToggle,
    handleSkillToggle,
    handleSave,
    handleCancel,
  } = usePromoterProfileEdit(user, onUserUpdate);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <ProfileHeader
        user={user}
        isEditing={isEditing}
        isSaving={isSaving}
        onEditClick={() => setIsEditing(true)}
        onSaveClick={handleSave}
        onCancelClick={handleCancel}
      />

      {/* Bio and Location Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <BioLocationSection
          user={user}
          isEditing={isEditing}
          editData={editData}
          onEditDataChange={handleEditDataChange}
        />

        {/* Social Media Links */}
        <SocialMediaSection
          user={user}
          isEditing={isEditing}
          editData={editData}
          onEditDataChange={handleEditDataChange}
        />
      </div>

      {/* Performance Stats */}
      <PerformanceStats user={user} />

      {/* Languages & Skills */}
      <LanguagesSkillsSection
        user={user}
        isEditing={isEditing}
        editData={editData}
        onLanguageToggle={handleLanguageToggle}
        onSkillToggle={handleSkillToggle}
      />

      {/* Portfolio */}
      <PortfolioSection
        user={user}
        onPortfolioManagerOpen={() => setShowPortfolioManager(true)}
        onWorkSelect={setSelectedWork}
      />

      {/* Portfolio Manager Modal */}
      {showPortfolioManager && (
        <PortfolioManager
          works={user.promoterDetails?.works || []}
          onClose={() => setShowPortfolioManager(false)}
        />
      )}

      {/* Portfolio Detail Modal */}
      {selectedWork && (
        <PortfolioDetailModal
          work={selectedWork}
          onClose={() => setSelectedWork(null)}
        />
      )}
    </div>
  );
}
