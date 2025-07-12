import { useState } from "react";
import { User } from "@/app/interfaces/user";
import { Language } from "@/app/enums/language";
import { authService } from "@/services/auth.service";
import { cleanFormData } from "@/utils/promoter-profile";

interface EditData {
  name: string;
  bio: string;
  location: string;
  languagesSpoken: Language[];
  skills: string[];
  tiktokUrl: string;
  instagramUrl: string;
  snapchatUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  websiteUrl: string;
}

export function usePromoterProfileEdit(
  user: User,
  onUserUpdate: (user: User) => void
) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<EditData>({
    name: user.name,
    bio: user.bio || "",
    location: user.promoterDetails?.location || "",
    languagesSpoken: user.promoterDetails?.languagesSpoken || [],
    skills: user.promoterDetails?.skills || [],
    tiktokUrl: user.tiktokUrl || "",
    instagramUrl: user.instagramUrl || "",
    snapchatUrl: user.snapchatUrl || "",
    youtubeUrl: user.youtubeUrl || "",
    twitterUrl: user.twitterUrl || "",
    websiteUrl: user.websiteUrl || "",
  });

  const handleEditDataChange = (
    field: string,
    value: string | Language[] | string[]
  ) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLanguageToggle = (language: Language) => {
    setEditData((prev) => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.includes(language)
        ? prev.languagesSpoken.filter((l) => l !== language)
        : [...prev.languagesSpoken, language],
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setEditData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Clean and prepare the update data - only include editable fields
      const updateData = cleanFormData({
        name: editData.name,
        bio: editData.bio,
        tiktokUrl: editData.tiktokUrl,
        instagramUrl: editData.instagramUrl,
        snapchatUrl: editData.snapchatUrl,
        youtubeUrl: editData.youtubeUrl,
        twitterUrl: editData.twitterUrl,
        websiteUrl: editData.websiteUrl,
        promoterDetails: {
          ...user.promoterDetails,
          location: editData.location,
          languagesSpoken: editData.languagesSpoken,
          skills: editData.skills,
          works: user.promoterDetails?.works || [],
        },
      });

      console.log("Sending update data:", updateData);

      // Update user profile via authService
      const response = await authService.updateUserInfo(updateData);
      const updatedUser = response.user;

      // Update the parent component with the updated user
      onUserUpdate(updatedUser);
      console.log("Updated user:", updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      // TODO: Show error message to user
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset edit data to original values
    setEditData({
      name: user.name,
      bio: user.bio || "",
      location: user.promoterDetails?.location || "",
      languagesSpoken: user.promoterDetails?.languagesSpoken || [],
      skills: user.promoterDetails?.skills || [],
      tiktokUrl: user.tiktokUrl || "",
      instagramUrl: user.instagramUrl || "",
      snapchatUrl: user.snapchatUrl || "",
      youtubeUrl: user.youtubeUrl || "",
      twitterUrl: user.twitterUrl || "",
      websiteUrl: user.websiteUrl || "",
    });
    setIsEditing(false);
  };

  return {
    isEditing,
    isSaving,
    editData,
    setIsEditing,
    handleEditDataChange,
    handleLanguageToggle,
    handleSkillToggle,
    handleSave,
    handleCancel,
  };
}
