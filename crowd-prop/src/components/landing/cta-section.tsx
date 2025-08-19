'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUserType } from '@/contexts/UserTypeContext';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Sparkles, Rocket } from 'lucide-react';

export function CallToActionSection() {
  const { userType, isTransitioning } = useUserType();
  const router = useRouter();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

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

  const businessContent = {
    title: "Ready to Scale Your Business?",
    subtitle: "Join the future of promotional marketing with our innovative platform",
    description: "Start your first campaign today and experience the power of professional promotion. No long-term contracts, transparent pricing, and guaranteed results.",
    primaryCTA: "Launch Your Campaign",
    secondaryCTA: "Schedule Demo"
  };

  const individualContent = {
    title: "Start Your Promotion Career Today",
    subtitle: "Build your marketing career on our innovative platform",
    description: "Create your profile, browse available campaigns, and start earning from your first project. Build your reputation and unlock higher-paying opportunities.",
    primaryCTA: "Become a Promoter", 
    secondaryCTA: "View Opportunities"
  };

  const content = userType === 'business' ? businessContent : individualContent;

  return (
    <section ref={ref} className="py-32 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30" />
      
      {/* Animated background shapes */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-purple-600/20 rounded-full blur-xl"
        animate={{ 
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-40 h-40 bg-blue-600/20 rounded-full blur-xl"
        animate={{ 
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 0.8, 1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-5xl mx-auto text-center relative">
        <motion.div
          key={userType}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isTransitioning ? 0 : (inView ? 1 : 0), y: isTransitioning ? 30 : (inView ? 0 : 30) }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3"
            initial={{ scale: 0 }}
            animate={{ scale: inView ? 1 : 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-200 font-medium">
              {userType === 'business' ? 'Next-Generation Platform' : 'Innovative Opportunities'}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {content.title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-purple-200 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {content.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {content.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.button
              className="group relative bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-5 rounded-xl font-semibold text-lg flex items-center gap-3 shadow-2xl overflow-hidden"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 25px 50px rgba(139, 92, 246, 0.4)" 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrimaryCTA}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              
              <Rocket className="w-5 h-5 z-10 relative group-hover:rotate-12 transition-transform duration-300" />
              <span className="z-10 relative">{content.primaryCTA}</span>
              <ArrowRight className="w-5 h-5 z-10 relative group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
            
            <motion.button
              className="group text-white/80 hover:text-white px-10 py-5 rounded-xl font-medium text-lg border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm hover:bg-white/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSecondaryCTA}
            >
              <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                {content.secondaryCTA}
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
