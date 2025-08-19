'use client';

import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useUserType } from '@/contexts/UserTypeContext';
import { useInView } from 'react-intersection-observer';
import { Shield, BarChart3, Users, TrendingUp, Clock, Star, ArrowRight, CheckCircle, Zap, Sparkles } from 'lucide-react';

const businessFeatures = [
  {
    icon: Clock,
    title: "Save Time & Resources",
    description: "Stop spending hours on marketing tasks - focus on building your product while promoters handle the rest",
    gradient: "from-purple-600 to-pink-600",
    stats: "90% time saved",
    benefit: "Focus on product development"
  },
  {
    icon: Users,
    title: "You Choose Your Team", 
    description: "Review promoter applications and select only those who match your specific criteria and requirements",
    gradient: "from-blue-600 to-cyan-600",
    stats: "100% control",
    benefit: "Handpicked team members"
  },
  {
    icon: BarChart3,
    title: "Any Budget Works",
    description: "Create campaigns from $5 to $100,000+ with complete budget control and transparent pricing",
    gradient: "from-green-600 to-emerald-600",
    stats: "$5 - $100K+",
    benefit: "Flexible budget scaling"
  },
  {
    icon: Shield,
    title: "Complete Campaign Control",
    description: "Set exact requirements, approve deliverables, and maintain full control over your brand messaging",
    gradient: "from-orange-600 to-red-600",
    stats: "Full ownership",
    benefit: "Brand protection guaranteed"
  }
];

const individualFeatures = [
  {
    icon: TrendingUp,
    title: "Experience-Based Earnings",
    description: "Get paid by the value and experience you bring - the more skilled you become, the higher your earning potential",
    gradient: "from-purple-600 to-pink-600",
    stats: "Unlimited growth",
    benefit: "Earnings scale with expertise"
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description: "Choose campaigns that fit your availability and work style preferences",
    gradient: "from-blue-600 to-cyan-600",
    stats: "Work anywhere",
    benefit: "Complete flexibility"
  },
  {
    icon: Users,
    title: "Community Network",
    description: "Connect with other marketers and build professional relationships",
    gradient: "from-green-600 to-emerald-600",
    stats: "Global network",
    benefit: "Professional connections"
  },
  {
    icon: Star,
    title: "Portfolio Building",
    description: "Build a strong portfolio with real client work and success stories",
    gradient: "from-orange-600 to-red-600",
    stats: "Proven results",
    benefit: "Career advancement"
  }
];

export function FeaturesSection() {
  const { userType, isTransitioning } = useUserType();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const controls = useAnimation();
  
  const features = userType === 'business' ? businessFeatures : individualFeatures;
  const title = userType === 'business' ? 'Why Businesses Choose Us' : 'Why Promoters Love Our Platform';

  // Auto-rotate through features
  useEffect(() => {
    if (!inView) return;
    
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [features.length, inView]);

  // Pulse animation for active feature
  useEffect(() => {
    controls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.6, ease: "easeInOut" }
    });
  }, [activeFeature, controls]);

  // Generate deterministic positions for particles to avoid hydration mismatch
  const particlePositions = Array.from({ length: 20 }, (_, i) => ({
    left: ((i * 7 + 13) % 100),
    top: ((i * 11 + 17) % 100),
  }));

  return (
    <section ref={ref} className="py-32 px-6 relative overflow-hidden">
      {/* Enhanced Dynamic Background */}
      <div className="absolute inset-0">
        {/* Animated particle system */}
        {particlePositions.map((position, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
        
        {/* Animated orbs with enhanced effects */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.6, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600/10 rounded-full blur-2xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        
        {/* Energy rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-[800px] h-[800px] border border-purple-500/10 rounded-full" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-[600px] h-[600px] border border-blue-500/10 rounded-full" />
        </motion.div>
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          key={userType}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isTransitioning ? 0 : (inView ? 1 : 0), y: isTransitioning ? 30 : (inView ? 0 : 30) }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: inView ? 1 : 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3">
              <span className="text-purple-200 font-medium flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {userType === 'business' ? 'Platform Benefits' : 'Career Advantages'}
              </span>
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200 mb-6">
            {title}
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {userType === 'business' 
              ? 'Powerful features designed to maximize your promotional ROI and streamline campaign management'
              : 'Everything you need to succeed as a promoter and build a thriving marketing career'
            }
          </p>
        </motion.div>        {/* Modern Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const isActive = activeFeature === index;
            const isHovered = hoveredFeature === index;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={() => setActiveFeature(index)}
              >
                <motion.div
                  className={`relative overflow-hidden bg-gradient-to-br from-black/30 to-black/20 backdrop-blur-xl border rounded-3xl p-8 h-full cursor-pointer transition-all duration-500 ${
                    isActive || isHovered
                      ? 'border-white/50 shadow-2xl transform scale-105 bg-gradient-to-br from-black/40 to-black/25' 
                      : 'border-white/30 hover:border-white/40'
                  }`}
                  animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.6 }}
                >
                  {/* Gradient overlay effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 ${
                      isActive || isHovered ? 'opacity-10' : ''
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isActive || isHovered ? 0.1 : 0 }}
                  />

                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full blur-xl opacity-50" />
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-full blur-xl opacity-30" />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <motion.div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </motion.div>

                      {/* Active/Featured indicator */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-3 py-1.5"
                        >
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-300 text-sm font-medium">Featured</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Stats Badge */}
                    <div className={`inline-flex items-center bg-gradient-to-r ${feature.gradient} bg-opacity-20 border border-white/20 rounded-full px-4 py-2 mb-4`}>
                      <Zap className="w-4 h-4 mr-2 text-white" />
                      <span className="text-white font-semibold text-sm">{feature.stats}</span>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-white/80 text-base leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    {/* Benefit highlight */}
                    <motion.div 
                      className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-500/20 rounded-xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-green-300 font-medium">{feature.benefit}</span>
                      <ArrowRight className="w-4 h-4 text-green-400 ml-auto" />
                    </motion.div>
                  </div>

                  {/* Hover effect border */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2 border-transparent"
                    animate={{
                      borderColor: isActive || isHovered ? 'rgba(255, 255, 255, 0.3)' : 'transparent'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center mt-12 space-x-4">
          {features.map((_, index) => (
            <motion.button
              key={index}
              className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                activeFeature === index 
                  ? 'bg-white border-white shadow-lg' 
                  : 'bg-transparent border-white/40 hover:border-white/70'
              }`}
              onClick={() => setActiveFeature(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {activeFeature === index && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
