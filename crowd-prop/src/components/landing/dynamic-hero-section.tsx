'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUserType } from '@/contexts/UserTypeContext';
import { Sparkles, ArrowRight, TrendingUp, Target } from 'lucide-react';

const businessContent = {
  title: "Focus on Your Product, We'll Handle Your Marketing",
  subtitle: "Save time and resources by letting expert promoters compete for your campaigns",
  description: "Create personalized campaigns with any budget, specify exactly what you need, and watch qualified promoters apply. You choose who matches your criteria - giving you complete control while freeing up your time to focus on what matters most: building your business.",
  cta: "Launch Your Campaign",
  features: [
    "Any Budget Works",
    "You Choose Your Promoters", 
    "Complete Campaign Control",
    "Save Time To Focus On What Really Matters"
  ]
};

const individualContent = {
  title: "Monetize Your Expertise",
  subtitle: "Join our network of promoters and turn your skills into consistent income",
  description: "Whether you're a marketing consultant, content creator, social media expert, or sales professional, choose from four campaign types that match your skills: consulting, execution, sales, or traffic generation.",
  cta: "Start Earning",
  features: [
    "Consulting Opportunities",
    "Campaign Execution Projects",
    "Commission-Based Sales",
    "Traffic Generation Tasks"
  ]
};

export function DynamicHeroSection() {
  const { userType, isTransitioning } = useUserType();
  const router = useRouter();
  const content = userType === 'business' ? businessContent : individualContent;

  const handlePrimaryCTA = () => {
    if (userType === 'business') {
      router.push('/dashboard/create-campaign');
    } else {
      router.push('/dashboard');
    }
  };

  const handleSecondaryCTA = () => {
    router.push('/dashboard');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          key={userType}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? 30 : 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-200 font-medium">
              {userType === 'business' ? 'For Enterprises & Startups' : 'For Marketing Professionals'}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {content.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {content.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-lg text-white/70 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {content.description}
          </motion.p>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {content.features.map((feature, index) => (
              <motion.div
                key={feature}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  {userType === 'business' ? (
                    [<Target size={16} key="target" />, <TrendingUp size={16} key="trending" />, <Sparkles size={16} key="sparkles" />, <ArrowRight size={16} key="arrow" />][index]
                  ) : (
                    [<Sparkles size={16} key="sparkles" />, <TrendingUp size={16} key="trending" />, <Target size={16} key="target" />, <ArrowRight size={16} key="arrow" />][index]
                  )}
                </div>
                <p className="text-white/80 text-sm font-medium">{feature}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.button
              className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrimaryCTA}
            >
              <span>{content.cta}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button
              className="text-white/80 hover:text-white px-8 py-4 rounded-xl font-medium text-lg border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSecondaryCTA}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
