'use client';

import { OnboardingData } from '../UserOnboarding';
import { AdvertiserType } from '@/app/enums/advertiser-type';
import { Language } from '@/app/enums/language';

interface OnboardingCompleteProps {
  data: OnboardingData;
  userEmail: string;
  onComplete: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function OnboardingComplete({ data, userEmail, onComplete, onBack, isLoading = false }: OnboardingCompleteProps) {
  // Create mappings for display names
  const advertiserTypeLabels: Record<AdvertiserType, string> = {
    [AdvertiserType.EDUCATION]: 'Education',
    [AdvertiserType.CLOTHING]: 'Clothing & Fashion',
    [AdvertiserType.TECH]: 'Technology',
    [AdvertiserType.BEAUTY]: 'Beauty & Cosmetics',
    [AdvertiserType.FOOD]: 'Food & Beverage',
    [AdvertiserType.HEALTH]: 'Health & Fitness',
    [AdvertiserType.ENTERTAINMENT]: 'Entertainment',
    [AdvertiserType.TRAVEL]: 'Travel & Tourism',
    [AdvertiserType.FINANCE]: 'Finance',
    [AdvertiserType.OTHER]: 'Other',
    [AdvertiserType.SPORTS]: 'Sports',
    [AdvertiserType.AUTOMOTIVE]: 'Automotive',
    [AdvertiserType.ART]: 'Art',
    [AdvertiserType.GAMING]: 'Gaming',
    [AdvertiserType.ECOMMERCE]: 'E-commerce',
    [AdvertiserType.MEDIA]: 'Media',
    [AdvertiserType.NON_PROFIT]: 'Non-Profit',
    [AdvertiserType.REAL_ESTATE]: 'Real Estate',
    [AdvertiserType.HOME_SERVICES]: 'Home & Garden',
    [AdvertiserType.EVENTS]: 'Events',
    [AdvertiserType.CONSULTING]: 'Consulting',
    [AdvertiserType.BOOKS]: 'Books',
    [AdvertiserType.MUSIC]: 'Music',
    [AdvertiserType.PETS]: 'Pets',
    [AdvertiserType.TOYS]: 'Toys',
    [AdvertiserType.BABY]: 'Baby',
    [AdvertiserType.JEWELRY]: 'Jewelry',
    [AdvertiserType.SCIENCE]: 'Science',
    [AdvertiserType.HARDWARE]: 'Hardware',
    [AdvertiserType.ENERGY]: 'Energy',
    [AdvertiserType.AGRICULTURE]: 'Agriculture',
    [AdvertiserType.GOVERNMENT]: 'Government',
  };

  const languageLabels: Record<Language, string> = {
    [Language.ENGLISH]: 'English',
    [Language.FRENCH]: 'French',
    [Language.SPANISH]: 'Spanish',
    [Language.GERMAN]: 'German',
    [Language.ITALIAN]: 'Italian',
    [Language.PORTUGUESE]: 'Portuguese',
    [Language.RUSSIAN]: 'Russian',
    [Language.JAPANESE]: 'Japanese',
    [Language.CHINESE]: 'Chinese',
    [Language.ARABIC]: 'Arabic',
    [Language.HINDI]: 'Hindi',
    [Language.KOREAN]: 'Korean',
    [Language.DUTCH]: 'Dutch',
    [Language.SWEDISH]: 'Swedish',
    [Language.NORWEGIAN]: 'Norwegian',
    [Language.DANISH]: 'Danish',
    [Language.FINNISH]: 'Finnish',
    [Language.POLISH]: 'Polish',
    [Language.CZECH]: 'Czech',
    [Language.HUNGARIAN]: 'Hungarian',
    [Language.ROMANIAN]: 'Romanian',
    [Language.BULGARIAN]: 'Bulgarian',
    [Language.CROATIAN]: 'Croatian',
    [Language.SERBIAN]: 'Serbian',
    [Language.SLOVAK]: 'Slovak',
    [Language.SLOVENIAN]: 'Slovenian',
    [Language.ESTONIAN]: 'Estonian',
    [Language.LATVIAN]: 'Latvian',
    [Language.LITHUANIAN]: 'Lithuanian',
    [Language.GREEK]: 'Greek',
    [Language.TURKISH]: 'Turkish',
    [Language.HEBREW]: 'Hebrew',
    [Language.THAI]: 'Thai',
    [Language.VIETNAMESE]: 'Vietnamese',
    [Language.INDONESIAN]: 'Indonesian',
    [Language.MALAY]: 'Malay',
    [Language.TAGALOG]: 'Tagalog',
    [Language.SWAHILI]: 'Swahili',
    [Language.URDU]: 'Urdu',
    [Language.BENGALI]: 'Bengali',
    [Language.TAMIL]: 'Tamil',
    [Language.TELUGU]: 'Telugu',
    [Language.MARATHI]: 'Marathi',
    [Language.GUJARATI]: 'Gujarati',
    [Language.KANNADA]: 'Kannada',
    [Language.MALAYALAM]: 'Malayalam',
    [Language.PUNJABI]: 'Punjabi',
    [Language.NEPALI]: 'Nepali',
    [Language.SINHALA]: 'Sinhala',
    [Language.BURMESE]: 'Burmese',
    [Language.KHMER]: 'Khmer',
    [Language.LAO]: 'Lao',
    [Language.MONGOLIAN]: 'Mongolian',
    [Language.TIBETAN]: 'Tibetan',
    [Language.PERSIAN]: 'Persian',
    [Language.PASHTO]: 'Pashto',
    [Language.KURDISH]: 'Kurdish',
    [Language.ARMENIAN]: 'Armenian',
    [Language.GEORGIAN]: 'Georgian',
    [Language.AZERBAIJANI]: 'Azerbaijani',
    [Language.KAZAKH]: 'Kazakh',
    [Language.KYRGYZ]: 'Kyrgyz',
    [Language.TAJIK]: 'Tajik',
    [Language.TURKMEN]: 'Turkmen',
    [Language.UZBEK]: 'Uzbek',
    [Language.ALBANIAN]: 'Albanian',
    [Language.BOSNIAN]: 'Bosnian',
    [Language.MACEDONIAN]: 'Macedonian',
    [Language.MONTENEGRIN]: 'Montenegrin',
    [Language.ICELANDIC]: 'Icelandic',
    [Language.IRISH]: 'Irish',
    [Language.WELSH]: 'Welsh',
    [Language.SCOTTISH_GAELIC]: 'Scottish Gaelic',
    [Language.BASQUE]: 'Basque',
    [Language.CATALAN]: 'Catalan',
    [Language.GALICIAN]: 'Galician',
    [Language.MALTESE]: 'Maltese',
    [Language.LUXEMBOURGISH]: 'Luxembourgish',
    [Language.AFRIKAANS]: 'Afrikaans',
    [Language.ZULU]: 'Zulu',
    [Language.XHOSA]: 'Xhosa',
    [Language.SOTHO]: 'Sotho',
    [Language.TSWANA]: 'Tswana',
    [Language.VENDA]: 'Venda',
    [Language.TSONGA]: 'Tsonga',
    [Language.NDEBELE]: 'Ndebele',
    [Language.YORUBA]: 'Yoruba',
    [Language.IGBO]: 'Igbo',
    [Language.HAUSA]: 'Hausa',
    [Language.AMHARIC]: 'Amharic',
    [Language.OROMO]: 'Oromo',
    [Language.TIGRINYA]: 'Tigrinya',
    [Language.SOMALI]: 'Somali',
    [Language.MALAGASY]: 'Malagasy',
    [Language.SHONA]: 'Shona',
    [Language.CHICHEWA]: 'Chichewa',
    [Language.KINYARWANDA]: 'Kinyarwanda',
    [Language.KIRUNDI]: 'Kirundi',
    [Language.LUGANDA]: 'Luganda',
    [Language.LINGALA]: 'Lingala',
    [Language.WOLOF]: 'Wolof',
    [Language.FULA]: 'Fula',
    [Language.BAMBARA]: 'Bambara',
    [Language.AKAN]: 'Akan',
    [Language.EWE]: 'Ewe',
    [Language.GA]: 'Ga',
    [Language.KIKUYU]: 'Kikuyu',
    [Language.LUO]: 'Luo',
    [Language.MAASAI]: 'Maasai',
    [Language.MERU]: 'Meru',
    [Language.KALENJIN]: 'Kalenjin',
    [Language.KAMBA]: 'Kamba',
    [Language.KISII]: 'Kisii',
    [Language.LUHYA]: 'Luhya',
    [Language.MIJIKENDA]: 'Mijikenda',
    [Language.POKOT]: 'Pokot',
    [Language.SAMBURU]: 'Samburu',
    [Language.TAITA]: 'Taita',
    [Language.TESO]: 'Teso',
    [Language.TURKANA]: 'Turkana',
  };
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Profile Complete!
        </h2>
        <p className="text-gray-600">
          Review your information before finishing setup
        </p>
      </div>

      {/* Profile Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        {/* Profile Images */}
        {(data.avatarUrl || data.backgroundUrl) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile Images</h3>
            <div className="flex items-center space-x-4">
              {data.avatarUrl && (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                    <img
                      src={data.avatarUrl}
                      alt="Profile picture"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-gray-600 mt-1 block">Profile Picture</span>
                </div>
              )}
              {data.backgroundUrl && (
                <div className="text-center">
                  <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden border-2 border-gray-300">
                    <img
                      src={data.backgroundUrl}
                      alt="Background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-gray-600 mt-1 block">Background</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="text-gray-900">{data.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{userEmail}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="text-gray-900">
                {data.role === 'ADVERTISER' ? 'Business/Advertiser' : 'Creator/Promoter'}
              </p>
            </div>
            {data.bio && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <p className="text-gray-900">{data.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Social Media */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.instagramUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Instagram</label>
                <p className="text-gray-900">@{data.instagramUrl}</p>
              </div>
            )}
            {data.tiktokUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700">TikTok</label>
                <p className="text-gray-900">@{data.tiktokUrl}</p>
              </div>
            )}
            {data.youtubeUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700">YouTube</label>
                <p className="text-gray-900">{data.youtubeUrl}</p>
              </div>
            )}
            {data.twitterUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Twitter/X</label>
                <p className="text-gray-900">@{data.twitterUrl}</p>
              </div>
            )}
            {data.snapchatUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Snapchat</label>
                <p className="text-gray-900">@{data.snapchatUrl}</p>
              </div>
            )}
            {data.websiteUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <p className="text-gray-900">{data.websiteUrl}</p>
              </div>
            )}
          </div>
        </div>

        {/* Role-specific Details */}
        {data.role === 'ADVERTISER' && data.advertiserDetails && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <p className="text-gray-900">{data.advertiserDetails.companyName}</p>
              </div>
              {data.advertiserDetails.companyWebsite && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <p className="text-gray-900">{data.advertiserDetails.companyWebsite}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {data.advertiserDetails.advertiserTypes.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {advertiserTypeLabels[type]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {data.role === 'PROMOTER' && data.promoterDetails && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Creator Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="text-gray-900">{data.promoterDetails.location}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {data.promoterDetails.languagesSpoken.map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      {languageLabels[language]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {data.promoterDetails.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio/Works Section */}
        {data.role === 'ADVERTISER' && data.advertiserWorks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Work Portfolio ({data.advertiserWorks.length} samples)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.advertiserWorks.map((work, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{work.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{work.description}</p>
                  {work.price && (
                    <p className="text-green-600 font-semibold text-sm mb-2">
                      ${work.price.toFixed(2)}
                    </p>
                  )}
                  {work.websiteUrl && (
                    <p className="text-blue-600 text-sm mb-2">
                      <a href={work.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        View Product
                      </a>
                    </p>
                  )}
                  {work.mediaUrl && (
                    <div className="mt-2">
                      {work.mediaUrl.includes('video') ? (
                        <video src={work.mediaUrl} className="w-full h-24 object-cover rounded" />
                      ) : (
                        <img src={work.mediaUrl} alt={work.title} className="w-full h-24 object-cover rounded" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.role === 'PROMOTER' && data.promoterWorks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Content Portfolio ({data.promoterWorks.length} samples)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.promoterWorks.map((work, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{work.title}</h4>
                  {work.description && (
                    <p className="text-gray-600 text-sm mb-2">{work.description}</p>
                  )}
                  <div className="mt-2">
                    {work.mediaUrl.includes('video') ? (
                      <video src={work.mediaUrl} className="w-full h-24 object-cover rounded" />
                    ) : (
                      <img src={work.mediaUrl} alt={work.title} className="w-full h-24 object-cover rounded" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          What&apos;s Next?
        </h3>
        <p className="text-blue-800">
          {data.role === 'ADVERTISER' 
            ? 'You can now create campaigns and connect with talented promoters to grow your business.'
            : 'You can now browse available campaigns and start applying to promotion opportunities that match your skills.'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Back to Edit
        </button>
        <button
          onClick={onComplete}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Setting up...' : 'Complete Setup'}
        </button>
      </div>
    </div>
  );
}
