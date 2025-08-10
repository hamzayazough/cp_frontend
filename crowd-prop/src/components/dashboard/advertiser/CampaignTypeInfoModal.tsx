'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, EyeIcon, UserIcon, ShoppingBagIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { CampaignType } from '@/app/enums/campaign-type';

interface CampaignTypeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignType: CampaignType | null;
}

const campaignDetails = {
  [CampaignType.VISIBILITY]: {
    icon: EyeIcon,
    title: 'Visibility Campaign',
    subtitle: 'Drive traffic and boost your online presence',
    color: 'blue',
    description: 'The hands-off approach to getting more eyes on your product. Simply set your target and budget, then let promoters do all the work driving traffic to your content. You only pay for actual views - no upfront costs, no ongoing management required.',
    
    howItWorks: [
      {
        title: 'Set Your Target',
        description: 'Provide your target URL and set the price you&apos;re willing to pay per 100 unique views.',
        icon: '🎯'
      },
      {
        title: 'Get Your Link',
        description: 'We generate a unique tracking link that captures all visitor data and prevents fraud.',
        icon: '🔗'
      },
      {
        title: 'Promoters Share',
        description: 'Multiple promoters join your campaign and share your tracking link across their networks.',
        icon: '📢'
      },
      {
        title: 'Pay for Results',
        description: 'You only pay for verified, unique visitors with detailed analytics to track performance.',
        icon: '✅'
      }
    ],
    
    exampleUseCases: [
      {
        title: 'Product Launch',
        description: 'Drive traffic to your new product page to test market interest and generate initial buzz.'
      },
      {
        title: 'Content Promotion',
        description: 'Get your blog posts, videos, or articles in front of targeted audiences to build authority.'
      },
      {
        title: 'Website Traffic',
        description: 'Increase visitors to your website or landing page to improve conversions and SEO.'
      }
    ]
  },
  
  [CampaignType.CONSULTANT]: {
    icon: UserIcon,
    title: 'Consultant Campaign',
    subtitle: 'Get expert strategic guidance',
    color: 'purple',
    description: 'Work one-on-one with experienced marketing professionals to develop winning strategies and get personalized advice.',
    
    howItWorks: [
      {
        title: 'Choose Your Expert',
        description: 'Browse qualified consultants and select one that matches your industry and campaign needs.',
        icon: '👨‍💼'
      },
      {
        title: 'Define the Scope',
        description: 'Work together to outline project deliverables, timeline, and specific strategic goals.',
        icon: '📋'
      },
      {
        title: 'Strategy Sessions',
        description: 'Participate in discovery meetings and brainstorming sessions to develop your custom strategy.',
        icon: '🧠'
      },
      {
        title: 'Receive Deliverables',
        description: 'Get actionable plans, documents, and ongoing support through regular check-ins.',
        icon: '📄'
      }
    ],
    
    exampleUseCases: [
      {
        title: 'Growth Strategy',
        description: 'Develop comprehensive marketing strategies for scaling your business and increasing revenue.'
      },
      {
        title: 'Campaign Optimization',
        description: 'Get expert advice on improving existing campaigns and maximizing your marketing ROI.'
      },
      {
        title: 'Script Writing',
        description: 'Create compelling scripts for ads, videos, presentations, or marketing materials.'
      },
      {
        title: 'Market Analysis',
        description: 'Understand your competition, target audience, and market positioning with professional insights.'
      }
    ]
  },
  
  [CampaignType.SELLER]: {
    icon: ShoppingBagIcon,
    title: 'Seller Campaign',
    subtitle: 'Full-service campaign management',
    color: 'green',
    description: 'Work with experienced promoters who take full control of your campaign execution, from content creation to social media management.',
    
    howItWorks: [
      {
        title: 'Explain Your Product',
        description: 'Provide detailed information about your product, target audience, and campaign goals to your chosen promoter.',
        icon: '📋'
      },
      {
        title: 'Define Deliverables',
        description: 'Specify exactly what you want delivered: social media posts, content creation, audience engagement, etc.',
        icon: '🎯'
      },
      {
        title: 'Track with Links',
        description: 'Promoter provides links to deliverables: social media accounts they created, posts they published, videos they made, and other work completed.',
        icon: '📊'
      },
      {
        title: 'Staged Payments',
        description: 'Pay the promoter in stages as milestones are completed and deliverables are approved by you.',
        icon: '💰'
      }
    ],
    
    exampleUseCases: [
      {
        title: 'Social Media Management',
        description: 'Have a promoter create and manage your social media presence across multiple platforms.'
      },
      {
        title: 'Content Creation',
        description: 'Get professional content created for your brand including posts, videos, and marketing materials.'
      },
      {
        title: 'Video Production',
        description: 'Create promotional videos, tutorials, or product demonstrations for your business.'
      },
      {
        title: 'Brand Building',
        description: 'Build your brand presence online through consistent messaging and community engagement.'
      }
    ]
  },
  
  [CampaignType.SALESMAN]: {
    icon: CurrencyDollarIcon,
    title: 'Salesman Campaign',
    subtitle: 'Commission-based sales performance',
    color: 'orange',
    description: 'Build a network of promoters who earn commission for every sale they generate, creating a scalable sales force.',
    
    howItWorks: [
      {
        title: 'Set Commission Rates',
        description: 'Define commission percentages or fixed amounts for each successful sale or conversion.',
        icon: '💵'
      },
      {
        title: 'Generate Tracking',
        description: 'We create unique promotional codes or affiliate links for each promoter to track their sales.',
        icon: '🔖'
      },
      {
        title: 'Promoters Sell',
        description: 'Your network of promoters actively market and sell your products using their unique codes.',
        icon: '🛒'
      },
      {
        title: 'Pay on Performance',
        description: 'Pay commissions only for verified sales with comprehensive tracking and analytics.',
        icon: '📈'
      }
    ],
    
    exampleUseCases: [
      {
        title: 'Affiliate Program',
        description: 'Build a network of promoters who sell your products and earn commission for each sale.'
      },
      {
        title: 'Sales Scaling',
        description: 'Expand your sales reach through multiple promoters without upfront marketing costs.'
      },
      {
        title: 'Performance Marketing',
        description: 'Only pay for actual results with commission-based promotional campaigns.'
      }
    ]
  }
};

export default function CampaignTypeInfoModal({ isOpen, onClose, campaignType }: CampaignTypeInfoModalProps) {
  if (!campaignType || !campaignDetails[campaignType]) {
    return null;
  }

  const details = campaignDetails[campaignType];
  const Icon = details.icon;

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          icon: 'text-blue-600',
          border: 'border-blue-200'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          icon: 'text-purple-600',
          border: 'border-purple-200'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          icon: 'text-green-600',
          border: 'border-green-200'
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          icon: 'text-orange-600',
          border: 'border-orange-200'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          icon: 'text-gray-600',
          border: 'border-gray-200'
        };
    }
  };

  const colors = getColorClasses(details.color);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className={`${colors.bg} ${colors.border} border-b px-6 py-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Icon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <div>
                        <Dialog.Title className={`text-lg font-semibold ${colors.text}`}>
                          {details.title}
                        </Dialog.Title>
                        <p className={`text-sm ${colors.text} opacity-80`}>
                          {details.subtitle}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg hover:bg-white hover:bg-opacity-50 transition-colors"
                    >
                      <XMarkIcon className={`h-5 w-5 ${colors.text}`} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                  {/* Description */}
                  <div className="mb-8">
                    <p className="text-gray-700 text-base leading-relaxed">
                      {details.description}
                    </p>
                  </div>

                  {/* How It Works - Full Width */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                      How It Works
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {details.howItWorks.map((step, index) => (
                        <div key={index} className="text-center">
                          <div className={`w-16 h-16 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center mx-auto mb-4`}>
                            <span className="text-2xl">{step.icon}</span>
                          </div>
                          <div className={`w-6 h-6 rounded-full ${colors.bg} ${colors.text} text-sm font-bold flex items-center justify-center mx-auto mb-3`}>
                            {index + 1}
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {step.title}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Example Use Cases */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                      Example Use Cases
                    </h3>
                    <div className="space-y-4">
                      {details.exampleUseCases.map((useCase, index) => (
                        <div key={index} className={`p-4 ${colors.bg} rounded-lg border ${colors.border}`}>
                          <h4 className={`font-semibold ${colors.text} mb-2`}>
                            {useCase.title}
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {useCase.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  {/* Empty footer space */}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
