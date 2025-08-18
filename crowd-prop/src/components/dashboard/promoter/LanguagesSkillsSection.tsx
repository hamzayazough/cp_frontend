"use client";

import { User } from "@/app/interfaces/user";
import { Language } from "@/app/enums/language";
import {
  LANGUAGE_OPTIONS,
  SKILLS_OPTIONS,
} from "@/app/const/promoter-profile-const";

interface LanguagesSkillsSectionProps {
  user: User;
  isEditing: boolean;
  editData: {
    languagesSpoken: Language[];
    skills: string[];
  };
  onLanguageToggle: (language: Language) => void;
  onSkillToggle: (skill: string) => void;
  isViewOnly?: boolean;
}

export default function LanguagesSkillsSection({
  user,
  isEditing,
  editData,
  onLanguageToggle,
  onSkillToggle,
}: LanguagesSkillsSectionProps) {
  const getLanguageDisplay = (language: Language) => {
    const option = LANGUAGE_OPTIONS.find((opt) => opt.value === language);
    return option ? option.display : language;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Languages */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Languages Spoken
        </h3>
        {isEditing ? (
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGE_OPTIONS.map((language) => (
              <label
                key={language.value}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  checked={editData.languagesSpoken.includes(language.value)}
                  onChange={() => onLanguageToggle(language.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">
                  {language.display}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {user.promoterDetails?.languagesSpoken?.map((language) => (
              <span
                key={language}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
              >
                {getLanguageDisplay(language)}
              </span>
            )) || (
              <span className="text-gray-500 text-sm">
                No languages specified
              </span>
            )}
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Skills & Expertise
        </h3>
        {isEditing ? (
          <div className="grid grid-cols-2 gap-2">
            {SKILLS_OPTIONS.map((skill) => (
              <label key={skill} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editData.skills.includes(skill)}
                  onChange={() => onSkillToggle(skill)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">{skill}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {user.promoterDetails?.skills?.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            )) || (
              <span className="text-gray-500 text-sm">No skills specified</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
