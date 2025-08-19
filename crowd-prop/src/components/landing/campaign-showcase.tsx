'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserType } from '@/contexts/UserTypeContext';
import { useInView } from 'react-intersection-observer';
import { Eye, Users, TrendingUp, DollarSign, Lightbulb, Rocket, Target, Zap, ChevronDown, Clock, Shield, Star } from 'lucide-react';

const businessCampaigns = [
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

const individualOpportunities = [
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
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  
  const campaigns = userType === 'business' ? businessCampaigns : individualOpportunities;
  const title = userType === 'business' ? 'Four Powerful Campaign Types' : 'Multiple Revenue Opportunities';
  const subtitle = userType === 'business' 
    ? 'Choose the perfect promotional strategy for your business goals'
    : 'Monetize your skills across different campaign types';

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleCTA = () => {
    if (userType === 'business') {
      router.push('/dashboard/create-campaign');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <section ref={ref} className="py-32 px-6 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          key={userType}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isTransitioning ? 0 : (inView ? 1 : 0), y: isTransitioning ? 30 : (inView ? 0 : 30) }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-6">
            {title}
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={`${userType}-${campaign.title}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: isTransitioning ? 0 : (inView ? 1 : 0), 
                y: isTransitioning ? 50 : (inView ? 0 : 50) 
              }}
              transition={{ delay: index * 0.15, duration: 0.8 }}
              className="group relative"
            >
              <div className={`bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-500 ${expandedCard === index ? 'shadow-2xl shadow-purple-500/20' : ''}`}>
                {/* Main Card Content */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${campaign.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <campaign.icon className="w-8 h-8 text-white" />
                    </div>
                    <motion.button
                      onClick={() => toggleCard(index)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        animate={{ rotate: expandedCard === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-white/60" />
                      </motion.div>
                    </motion.button>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    {campaign.title}
                  </h3>
                  
                  <p className="text-white/80 font-medium mb-4">
                    {campaign.shortDesc}
                  </p>

                  <p className="text-white/60 mb-6 leading-relaxed">
                    {campaign.description}
                  </p>

                  {/* Quick Features */}
                  <div className="grid grid-cols-2 gap-3">
                    {campaign.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                          opacity: isTransitioning ? 0 : (inView ? 1 : 0), 
                          x: isTransitioning ? -10 : (inView ? 0 : -10) 
                        }}
                        transition={{ delay: (index * 0.15) + (featureIndex * 0.1) + 0.5, duration: 0.5 }}
                        className="flex items-center text-sm text-white/70 bg-white/5 rounded-lg p-3"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${campaign.color} mr-2 flex-shrink-0`} />
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedCard === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="border-t border-white/10 bg-black/10"
                    >
                      <div className="p-8 space-y-6">
                        {/* How It Works */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <Target className="w-5 h-5 mr-2 text-purple-400" />
                            How It Works
                          </h4>
                          <ol className="space-y-2">
                            {campaign.details.howItWorks.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start text-white/70">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r ${campaign.color} text-white text-xs font-bold mr-3 mt-0.5 flex-shrink-0`}>
                                  {stepIndex + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Pricing/Earnings */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                            {userType === 'business' ? 'Pricing' : 'Earnings'}
                          </h4>
                          <p className="text-white/70">
                            {userType === 'business' ? campaign.details.pricing : campaign.details.earnings}
                          </p>
                        </div>

                        {/* Timeline/Requirements */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-blue-400" />
                            {userType === 'business' ? 'Timeline' : 'Requirements'}
                          </h4>
                          <p className="text-white/70">
                            {userType === 'business' ? campaign.details.timeline : campaign.details.requirements}
                          </p>
                        </div>

                        {/* Benefits */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <Star className="w-5 h-5 mr-2 text-yellow-400" />
                            Key Benefits
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {campaign.details.benefits.map((benefit, benefitIndex) => (
                              <div key={benefitIndex} className="flex items-center text-white/70 text-sm">
                                <Shield className="w-4 h-4 mr-2 text-green-400" />
                                {benefit}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-white/60 mb-6">
            Ready to get started? {userType === 'business' ? 'Launch your first campaign' : 'Start earning today'}
          </p>
          <motion.button
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCTA}
          >
            {userType === 'business' ? 'Create Campaign' : 'Join as Promoter'}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
