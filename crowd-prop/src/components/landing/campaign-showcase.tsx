'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserType } from '@/contexts/UserTypeContext';
import { useInView } from 'react-intersection-observer';
import { Eye, Users, TrendingUp, DollarSign, Lightbulb, Rocket, Target, Zap, Clock, Shield, Star, LucideIcon } from 'lucide-react';

interface BusinessCampaignDetails {
  howItWorks: string[];
  pricing: string;
  timeline: string;
  benefits: string[];
}

interface IndividualCampaignDetails {
  howItWorks: string[];
  earnings: string;
  requirements: string;
  benefits: string[];
}

interface BusinessCampaign {
  icon: LucideIcon;
  title: string;
  shortDesc: string;
  description: string;
  color: string;
  features: string[];
  details: BusinessCampaignDetails;
}

interface IndividualCampaign {
  icon: LucideIcon;
  title: string;
  shortDesc: string;
  description: string;
  color: string;
  features: string[];
  details: IndividualCampaignDetails;
}

const businessCampaigns: BusinessCampaign[] = [
  {
    icon: Eye,
    title: "Visibility Campaigns",
    shortDesc: "Drive quality traffic to your website",
    description: "Need website traffic? Set your budget, specify your target audience, and let promoters compete to deliver quality visitors to your site",
    color: "from-purple-600 to-pink-600",
    features: ["Set any budget", "You approve promoters", "Real traffic guaranteed", "Track every visitor"],
    details: {
      howItWorks: [
        "Post your traffic requirements and target audience",
        "Set your campaign budget (can be increased later)",
        "Review promoter applications and their traffic methods",
        "Choose promoters that match your criteria",
        "Pay for traffic delivered within your budget"
      ],
      pricing: "Pay per visitor delivered within your campaign budget",
      timeline: "Traffic delivery starts within 24-48 hours",
      benefits: ["Budget flexibility", "Geographic targeting", "Real-time analytics", "Quality guarantee"]
    }
  },
  {
    icon: Lightbulb,
    title: "Consultant Campaigns", 
    shortDesc: "Get expert marketing strategy and advice",
    description: "Need marketing strategy? Post your requirements, review consultant applications, and choose the expert who fits your needs and budget",
    color: "from-blue-600 to-cyan-600",
    features: ["Expert advice on demand", "Choose your consultant", "Custom strategies", "Flexible budgets"],
    details: {
      howItWorks: [
        "Describe your business and marketing challenges",
        "Set your campaign budget (can be increased later)",
        "Review consultant profiles and proposals",
        "Interview and select your preferred expert",
        "Pay for deliverables as they're completed within your budget"
      ],
      pricing: "Milestone-based payments within your set budget - pay as deliverables are completed",
      timeline: "Strategy sessions can start within 24 hours",
      benefits: ["Industry experts", "Milestone payments", "Budget flexibility", "Actionable insights"]
    }
  },
  {
    icon: Rocket,
    title: "Seller Campaigns",
    shortDesc: "Full marketing execution by professional teams",
    description: "Need full marketing execution? Describe what you want, set your budget, and select from experienced teams who can deliver",
    color: "from-green-600 to-emerald-600", 
    features: ["Complete marketing execution", "Professional teams apply", "You choose who works", "Results you approve"],
    details: {
      howItWorks: [
        "Define your marketing goals and deliverable requirements",
        "Set your campaign budget (can be increased later)",
        "Review team portfolios and proposals",
        "Select the team that best fits your needs",
        "Pay for completed deliverables within your budget"
      ],
      pricing: "Pay as you go - make payments for completed deliverables within your campaign budget",
      timeline: "Execution begins within 3-5 business days",
      benefits: ["Professional teams", "Milestone payments", "Budget control", "Quality tracking"]
    }
  },
  {
    icon: DollarSign,
    title: "Salesman Campaigns",
    shortDesc: "Performance-based sales with zero upfront cost",
    description: "Need actual sales? Set your commission rate, let sales professionals apply, and only pay when they deliver real customers",
    color: "from-orange-600 to-red-600",
    features: ["Pay only for sales", "Choose your sales team", "Set your own rates", "Track every conversion"],
    details: {
      howItWorks: [
        "Set your product/service commission structure",
        "Define your target customer profile",
        "Review sales professional applications",
        "Approve sales methods and materials",
        "Pay commissions only on confirmed sales"
      ],
      pricing: "Commission-only (typically 10-50% of sale value)",
      timeline: "Sales efforts begin within 1-2 days",
      benefits: ["Zero upfront cost", "Performance-based", "Sale verification", "Scalable growth"]
    }
  }
];

const individualOpportunities: IndividualCampaign[] = [
  {
    icon: Target,
    title: "Strategy Consulting",
    shortDesc: "Monetize your marketing expertise",
    description: "Provide expert marketing advice and strategic planning to growing businesses",
    color: "from-purple-600 to-pink-600",
    features: ["Strategy development", "Market research", "Performance audits", "Live sessions"],
    details: {
      howItWorks: [
        "Create your consultant profile and expertise areas",
        "Apply to consultation requests that match your skills",
        "Conduct interviews with potential clients",
        "Deliver strategic advice and complete milestones",
        "Get paid for each completed deliverable"
      ],
      earnings: "Get paid per deliverable within the client's campaign budget",
      requirements: "Marketing experience, proven track record, communication skills",
      benefits: ["Milestone payments", "Premium rates", "Skill development", "Client network"]
    }
  },
  {
    icon: Zap,
    title: "Campaign Execution",
    shortDesc: "Execute full marketing campaigns for businesses",
    description: "Handle complete promotional campaigns from content creation to audience engagement",
    color: "from-blue-600 to-cyan-600", 
    features: ["Content creation", "Social media management", "Video production", "Email marketing"],
    details: {
      howItWorks: [
        "Browse available campaign execution projects",
        "Submit proposals with your approach and timeline",
        "Get selected based on portfolio and proposal",
        "Execute campaigns and complete deliverables",
        "Get paid for each milestone achieved"
      ],
      earnings: "Earn based on completed deliverables within campaign budgets",
      requirements: "Portfolio of work, marketing skills, project management",
      benefits: ["Milestone payments", "Skill building", "Long-term contracts", "Creative freedom"]
    }
  },
  {
    icon: TrendingUp,
    title: "Traffic Generation",
    shortDesc: "Drive visitors to business websites",
    description: "Drive high-quality visitors to business websites using your marketing channels",
    color: "from-green-600 to-emerald-600",
    features: ["Social promotion", "Influencer outreach", "SEO content", "Paid advertising"],
    details: {
      howItWorks: [
        "Apply to traffic generation campaigns",
        "Propose your traffic delivery methods",
        "Get approved based on your audience and methods",
        "Drive quality traffic to client websites",
        "Get paid per visitor delivered from campaign budget"
      ],
      earnings: "Paid per visitor delivered within the campaign budget",
      requirements: "Audience/followers, traffic generation experience",
      benefits: ["Quick payments", "Scalable income", "Flexible work", "Performance bonuses"]
    }
  },
  {
    icon: Users,
    title: "Sales Generation",
    shortDesc: "Earn commissions by generating sales",
    description: "Earn commissions by converting your audience into paying customers for brands",
    color: "from-orange-600 to-red-600",
    features: ["Affiliate marketing", "Product reviews", "Direct sales", "Conversion optimization"],
    details: {
      howItWorks: [
        "Apply to sales campaigns that match your audience",
        "Get approved sales materials and tracking links",
        "Promote products/services to your network",
        "Convert audience into paying customers",
        "Earn commissions on verified sales"
      ],
      earnings: "Earn commissions from campaign budgets for verified sales",
      requirements: "Audience/network, sales experience preferred",
      benefits: ["High earning potential", "Performance-based", "Passive income", "Recurring commissions"]
    }
  }
];

export function CampaignShowcase() {
  const { userType, isTransitioning } = useUserType();
  const router = useRouter();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeCampaign, setActiveCampaign] = useState(0);
  
  const campaigns = userType === 'business' ? businessCampaigns : individualOpportunities;
  const title = userType === 'business' ? 'Four Powerful Campaign Types' : 'Multiple Revenue Opportunities';
  const subtitle = userType === 'business' 
    ? 'Choose the perfect promotional strategy for your business goals'
    : 'Monetize your skills across different campaign types';

  const handleCTA = () => {
    if (userType === 'business') {
      router.push('/dashboard/campaigns/create');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <section ref={ref} className="py-32 px-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-600/5 rounded-full blur-2xl animate-pulse delay-500" />
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          key={userType}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isTransitioning ? 0 : (inView ? 1 : 0), y: isTransitioning ? 30 : (inView ? 0 : 30) }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-6">
            {title}
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Campaign Tabs - Left Side */}
          <div className="lg:w-1/3 space-y-4">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={`${userType}-${campaign.title}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ 
                  opacity: isTransitioning ? 0 : (inView ? 1 : 0), 
                  x: isTransitioning ? -50 : (inView ? 0 : -50) 
                }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`relative cursor-pointer group ${activeCampaign === index ? 'scale-105' : ''} transition-all duration-300`}
                onClick={() => setActiveCampaign(index)}
              >
                <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                  activeCampaign === index 
                    ? `bg-gradient-to-r ${campaign.color} border-white/30 shadow-2xl` 
                    : 'bg-black/20 backdrop-blur-sm border-white/10 hover:border-white/20'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      activeCampaign === index 
                        ? 'bg-white/20' 
                        : `bg-gradient-to-r ${campaign.color}`
                    }`}>
                      {(() => {
                        const IconComponent = campaign.icon;
                        return <IconComponent className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold transition-all duration-300 ${
                        activeCampaign === index ? 'text-white text-lg' : 'text-white/80 text-base'
                      }`}>
                        {campaign.title}
                      </h3>
                      <p className={`text-sm transition-all duration-300 ${
                        activeCampaign === index ? 'text-white/90' : 'text-white/60'
                      }`}>
                        {campaign.shortDesc}
                      </p>
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {activeCampaign === index && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-2xl border-2 border-white/40"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Campaign Details - Right Side */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${userType}-${activeCampaign}`}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className="bg-gradient-to-br from-black/30 to-black/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${campaigns[activeCampaign].color} opacity-10 rounded-full blur-3xl transform translate-x-32 -translate-y-32`} />
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${campaigns[activeCampaign].color} flex items-center justify-center mb-6 shadow-2xl`}>
                        {(() => {
                          const IconComponent = campaigns[activeCampaign].icon;
                          return <IconComponent className="w-10 h-10 text-white" />;
                        })()}
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {campaigns[activeCampaign].title}
                      </h3>
                      <p className="text-xl text-white/80 mb-4">
                        {campaigns[activeCampaign].shortDesc}
                      </p>
                      <p className="text-white/70 leading-relaxed max-w-2xl">
                        {campaigns[activeCampaign].description}
                      </p>
                    </div>
                  </div>

                  {/* Features Pills */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {campaigns[activeCampaign].features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className={`px-4 py-2 rounded-full bg-gradient-to-r ${campaigns[activeCampaign].color} bg-opacity-20 border border-white/20 text-white/90 text-sm font-medium backdrop-blur-sm`}
                      >
                        {feature}
                      </motion.div>
                    ))}
                  </div>

                  {/* Detailed Information */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* How It Works */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
                    >
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-purple-400" />
                        How It Works
                      </h4>
                      <div className="space-y-3">
                        {campaigns[activeCampaign].details.howItWorks.slice(0, 3).map((step, index) => (
                          <div key={index} className="flex items-start text-white/70 text-sm">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r ${campaigns[activeCampaign].color} text-white text-xs font-bold mr-3 mt-0.5 flex-shrink-0`}>
                              {index + 1}
                            </span>
                            {step}
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Pricing & Benefits */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="space-y-6"
                    >
                      {/* Pricing */}
                      <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                          {userType === 'business' ? 'Pricing' : 'Earnings'}
                        </h4>
                        <p className="text-white/70 text-sm">
                          {userType === 'business' 
                            ? (campaigns[activeCampaign] as BusinessCampaign).details.pricing 
                            : (campaigns[activeCampaign] as IndividualCampaign).details.earnings
                          }
                        </p>
                      </div>

                      {/* Timeline/Requirements */}
                      <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-blue-400" />
                          {userType === 'business' ? 'Timeline' : 'Requirements'}
                        </h4>
                        <p className="text-white/70 text-sm">
                          {userType === 'business' 
                            ? (campaigns[activeCampaign] as BusinessCampaign).details.timeline 
                            : (campaigns[activeCampaign] as IndividualCampaign).details.requirements
                          }
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Key Benefits */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-8"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-400" />
                      Key Benefits
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {campaigns[activeCampaign].details.benefits.map((benefit, index) => (
                        <motion.div
                          key={benefit}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                          className="flex items-center text-white/70 text-sm bg-white/5 rounded-lg p-3 backdrop-blur-sm"
                        >
                          <Shield className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                          {benefit}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-8 flex justify-center"
                  >
                    <motion.button
                      className={`bg-gradient-to-r ${campaigns[activeCampaign].color} text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300`}
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCTA}
                    >
                      {userType === 'business' ? 'Create This Campaign' : 'Apply for This Role'}
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Auto-cycle indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex justify-center mt-12"
        >
          <div className="flex space-x-2">
            {campaigns.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveCampaign(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeCampaign === index 
                    ? `bg-gradient-to-r ${campaigns[index].color}` 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
