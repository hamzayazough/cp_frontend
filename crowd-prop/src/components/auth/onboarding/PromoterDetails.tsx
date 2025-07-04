'use client';

import { OnboardingData } from '../UserOnboarding';
import { Language } from '@/app/enums/language';

interface PromoterDetailsProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PromoterDetails({ data, onUpdate, onNext, onBack }: PromoterDetailsProps) {
  // Language mapping for display purposes
  const languageOptions = [
    { value: Language.ENGLISH, display: 'English' },
    { value: Language.SPANISH, display: 'Spanish' },
    { value: Language.FRENCH, display: 'French' },
    { value: Language.GERMAN, display: 'German' },
    { value: Language.ITALIAN, display: 'Italian' },
    { value: Language.PORTUGUESE, display: 'Portuguese' },
    { value: Language.RUSSIAN, display: 'Russian' },
    { value: Language.CHINESE, display: 'Chinese' },
    { value: Language.JAPANESE, display: 'Japanese' },
    { value: Language.KOREAN, display: 'Korean' },
    { value: Language.ARABIC, display: 'Arabic' },
    { value: Language.HINDI, display: 'Hindi' },
    { value: Language.DUTCH, display: 'Dutch' },
    { value: Language.TURKISH, display: 'Turkish' },
    { value: Language.POLISH, display: 'Polish' },
    { value: Language.SWEDISH, display: 'Swedish' },
    { value: Language.OTHER, display: 'Other' }
  ];

  const skillsOptions = [
    'Video Editing', 'Photography', 'Content Writing', 'Graphic Design',
    'Social Media Management', 'Influencer Marketing', 'Brand Partnerships',
    'Live Streaming', 'Comedy/Entertainment', 'Fashion/Beauty', 'Fitness/Health',
    'Tech Reviews', 'Gaming', 'Cooking/Food', 'Travel', 'Education/Tutorials'
  ];

  const handleLocationChange = (value: string) => {
    onUpdate({
      promoterDetails: {
        ...data.promoterDetails,
        location: value,
        languagesSpoken: data.promoterDetails?.languagesSpoken || [],
        skills: data.promoterDetails?.skills || []
      }
    });
  };

  const handleLanguageToggle = (language: Language) => {
    const currentLanguages = data.promoterDetails?.languagesSpoken || [];
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language];

    onUpdate({
      promoterDetails: {
        ...data.promoterDetails,
        location: data.promoterDetails?.location || '',
        skills: data.promoterDetails?.skills || [],
        languagesSpoken: newLanguages
      }
    });
  };

  const handleSkillToggle = (skill: string) => {
    const currentSkills = data.promoterDetails?.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];

    onUpdate({
      promoterDetails: {
        ...data.promoterDetails,
        location: data.promoterDetails?.location || '',
        languagesSpoken: data.promoterDetails?.languagesSpoken || [],
        skills: newSkills
      }
    });
  };

  const isValid = 
    (data.promoterDetails?.location || '').trim().length > 0 &&
    (data.promoterDetails?.languagesSpoken || []).length > 0 &&
    (data.promoterDetails?.skills || []).length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Creator Profile
        </h2>
        <p className="text-gray-600">
          Help brands find you by sharing your expertise and capabilities
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            id="location"
            type="text"
            value={data.promoterDetails?.location || ''}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="City, Country (e.g., New York, USA)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Languages Spoken * (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {languageOptions.map((languageOption) => {
              const isSelected = (data.promoterDetails?.languagesSpoken || []).includes(languageOption.value);
              return (
                <button
                  key={languageOption.value}
                  type="button"
                  onClick={() => handleLanguageToggle(languageOption.value)}
                  className={`p-2 text-sm border rounded-lg text-center transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {languageOption.display}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: {(data.promoterDetails?.languagesSpoken || []).length} languages
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Skills & Expertise * (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {skillsOptions.map((skill) => {
              const isSelected = (data.promoterDetails?.skills || []).includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`p-3 text-sm border rounded-lg text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: {(data.promoterDetails?.skills || []).length} skills
          </p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Portfolio Building
            </h3>
            <p className="text-sm text-green-700 mt-1">
              After completing registration, you&apos;ll be able to upload your work samples and showcase your content creation abilities to potential brand partners.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
