'use client';

import { motion } from 'framer-motion';
import { useUserType } from '@/contexts/UserTypeContext';
import { useInView } from 'react-intersection-observer';
import { Eye, Users, TrendingUp, DollarSign, Lightbulb, Rocket, Target, Zap } from 'lucide-react';

const businessCampaigns = [
  {
    icon: Eye,
    title: "Visibility Campaigns",
    description: "Drive targeted traffic to your website or landing page with guaranteed unique visitors",
    color: "from-purple-600 to-pink-600",
    features: ["Pay per users visiting your website", "Anti-bot protection", "Real-time analytics", "Global reach"]
  },
  {
    icon: Lightbulb,
    title: "Consultant Campaigns", 
    description: "Get expert marketing strategies and professional guidance from industry specialists",
    color: "from-blue-600 to-cyan-600",
    features: ["Marketing strategies", "Content planning", "Market analysis", "Brand guidelines"]
  },
  {
    icon: Rocket,
    title: "Seller Campaigns",
    description: "Full-service promotional execution handled by professional marketing teams",
    color: "from-green-600 to-emerald-600", 
    features: ["Social media management", "Content creation", "Direct outreach", "Campaign execution"]
  },
  {
    icon: DollarSign,
    title: "Salesman Campaigns",
    description: "Performance-based promotions where you only pay for actual sales generated",
    color: "from-orange-600 to-red-600",
    features: ["Commission-based", "Sales tracking", "Risk-free growth", "Affiliate management"]
  }
];

const individualOpportunities = [
  {
    icon: Target,
    title: "Strategy Consulting",
    description: "Provide expert marketing advice and strategic planning to growing businesses",
    color: "from-purple-600 to-pink-600",
    features: ["Strategy development", "Market research", "Performance audits", "Live sessions"]
  },
  {
    icon: Zap,
    title: "Campaign Execution",
    description: "Handle complete promotional campaigns from content creation to audience engagement",
    color: "from-blue-600 to-cyan-600", 
    features: ["Content creation", "Social media management", "Video production", "Email marketing"]
  },
  {
    icon: TrendingUp,
    title: "Traffic Generation",
    description: "Drive high-quality visitors to business websites using your marketing channels",
    color: "from-green-600 to-emerald-600",
    features: ["Social promotion", "Influencer outreach", "SEO content", "Paid advertising"]
  },
  {
    icon: Users,
    title: "Sales Generation",
    description: "Earn commissions by converting your audience into paying customers for brands",
    color: "from-orange-600 to-red-600",
    features: ["Affiliate marketing", "Product reviews", "Direct sales", "Conversion optimization"]
  }
];

export function CampaignShowcase() {
  const { userType, isTransitioning } = useUserType();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  
  const campaigns = userType === 'business' ? businessCampaigns : individualOpportunities;
  const title = userType === 'business' ? 'Four Powerful Campaign Types' : 'Multiple Revenue Opportunities';
  const subtitle = userType === 'business' 
    ? 'Choose the perfect promotional strategy for your business goals'
    : 'Monetize your skills across different campaign types';

  return (
    <section ref={ref} className="py-32 px-6 relative">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={`${userType}-${campaign.title}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: isTransitioning ? 0 : (inView ? 1 : 0), 
                y: isTransitioning ? 50 : (inView ? 0 : 50) 
              }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="group relative"
            >
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:border-white/30 transition-all duration-500 hover:transform hover:scale-105">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${campaign.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <campaign.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all duration-300">
                  {campaign.title}
                </h3>
                
                <p className="text-white/70 mb-6 leading-relaxed">
                  {campaign.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {campaign.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: isTransitioning ? 0 : (inView ? 1 : 0), 
                        x: isTransitioning ? -10 : (inView ? 0 : -10) 
                      }}
                      transition={{ delay: (index * 0.2) + (featureIndex * 0.1) + 0.5, duration: 0.5 }}
                      className="flex items-center text-sm text-white/60"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${campaign.color} mr-3`} />
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
