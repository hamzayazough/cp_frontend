import { Language } from "@/app/enums/language";

export const LANGUAGE_OPTIONS = [
  { value: Language.ENGLISH, display: "English" },
  { value: Language.SPANISH, display: "Spanish" },
  { value: Language.FRENCH, display: "French" },
  { value: Language.GERMAN, display: "German" },
  { value: Language.ITALIAN, display: "Italian" },
  { value: Language.PORTUGUESE, display: "Portuguese" },
  { value: Language.RUSSIAN, display: "Russian" },
  { value: Language.CHINESE, display: "Chinese" },
  { value: Language.JAPANESE, display: "Japanese" },
  { value: Language.KOREAN, display: "Korean" },
  { value: Language.ARABIC, display: "Arabic" },
  { value: Language.HINDI, display: "Hindi" },
  { value: Language.DUTCH, display: "Dutch" },
  { value: Language.TURKISH, display: "Turkish" },
  { value: Language.POLISH, display: "Polish" },
  { value: Language.SWEDISH, display: "Swedish" },
];

export const SKILLS_OPTIONS = [
  "Video Editing",
  "Photography",
  "Content Writing",
  "Graphic Design",
  "Social Media Management",
  "Influencer Marketing",
  "Brand Partnerships",
  "Live Streaming",
  "Comedy/Entertainment",
  "Fashion/Beauty",
  "Fitness/Health",
  "Tech Reviews",
  "Gaming",
  "Cooking/Food",
  "Travel",
  "Education/Tutorials",
];

export const SOCIAL_MEDIA_PLATFORMS = {
  TIKTOK: {
    name: "TikTok",
    placeholder: "https://tiktok.com/@username",
    backgroundColor: "#000000",
    background: undefined,
    color: "white",
    display: "TikTok",
  },
  INSTAGRAM: {
    name: "Instagram",
    placeholder: "https://instagram.com/username",
    backgroundColor: undefined,
    background: "linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)",
    color: "white",
    display: "Instagram",
  },
  YOUTUBE: {
    name: "YouTube",
    placeholder: "https://youtube.com/@username",
    backgroundColor: "#dc2626",
    background: undefined,
    color: "white",
    display: "YouTube",
  },
  TWITTER: {
    name: "X (Twitter)",
    placeholder: "https://x.com/username",
    backgroundColor: "#000000",
    background: undefined,
    color: "white",
    display: "𝕏",
  },
  SNAPCHAT: {
    name: "Snapchat",
    placeholder: "https://snapchat.com/add/username",
    backgroundColor: "#FFFC00",
    background: undefined,
    color: "black",
    display: "👻",
  },
  WEBSITE: {
    name: "Website",
    placeholder: "https://yourwebsite.com",
    backgroundColor: "#4b5563",
    background: undefined,
    color: "white",
    display: "Website",
  },
};

export const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";

export const PROFILE_CONSTANTS = {
  COVER_HEIGHT: "h-32",
  AVATAR_SIZE: "w-24 h-24",
  TRUNCATE_TITLE_LENGTH: 30,
  TRUNCATE_DESCRIPTION_LENGTH: 60,
  TEXTAREA_ROWS: 3,
};
