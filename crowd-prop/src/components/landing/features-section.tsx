'use client';

import { motion } from 'framer-motion';
import { useUserType } from '@/contexts/UserTypeContext';
import { useInView } from 'react-intersection-observer';
import { Shield, BarChart3, Users, TrendingUp, Clock, Star } from 'lucide-react';

const businessFeatures = [
  {
    icon: Clock,
    title: "Save Time & Resources",
    description: "Stop spending hours on marketing tasks - focus on building your product while promoters handle the rest",
    gradient: "from-purple-600 to-pink-600"
  },
  {
    icon: Users,
    title: "You Choose Your Team", 
    description: "Review promoter applications and select only those who match your specific criteria and requirements",
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    icon: BarChart3,
    title: "Any Budget Works",
    description: "Create campaigns from $5 to $100,000+ with complete budget control and transparent pricing",
    gradient: "from-green-600 to-emerald-600"
  },
  {
    icon: Shield,
    title: "Complete Campaign Control",
    description: "Set exact requirements, approve deliverables, and maintain full control over your brand messaging",
    gradient: "from-orange-600 to-red-600"
  }
];

const individualFeatures = [
  {
    icon: TrendingUp,
    title: "Skill Development",
    description: "Grow your expertise by working with diverse brands and industries",
    gradient: "from-purple-600 to-pink-600"
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description: "Choose campaigns that fit your availability and work style preferences",
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    icon: Users,
    title: "Community Network",
    description: "Connect with other marketers and build professional relationships",
    gradient: "from-green-600 to-emerald-600"
  },
  {
    icon: Star,
    title: "Portfolio Building",
    description: "Build a strong portfolio with real client work and success stories",
    gradient: "from-orange-600 to-red-600"
  }
];

export function FeaturesSection() {
  const { userType, isTransitioning } = useUserType();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  
  const features = userType === 'business' ? businessFeatures : individualFeatures;
  const title = userType === 'business' ? 'Why Businesses Choose Us' : 'Why Promoters Love Our Platform';

  return (
    <section ref={ref} className="py-32 px-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20" />
      
      <div className="max-w-7xl mx-auto relative">
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
            {userType === 'business' 
              ? 'Powerful features designed to maximize your promotional ROI and streamline campaign management'
              : 'Everything you need to succeed as a promoter and build a thriving marketing career'
            }
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={`${userType}-${feature.title}`}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              animate={{ 
                opacity: isTransitioning ? 0 : (inView ? 1 : 0), 
                y: isTransitioning ? 50 : (inView ? 0 : 50),
                rotateY: isTransitioning ? -15 : (inView ? 0 : -15)
              }}
              transition={{ delay: index * 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
              className="group perspective-1000"
            >
              <div className="relative bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-8 h-full group-hover:border-white/30 transition-all duration-500 transform-gpu group-hover:rotateY-5 group-hover:scale-105">
                {/* Floating Icon */}
                <motion.div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 relative`}
                  whileHover={{ scale: 1.1, rotateZ: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                  
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500`} />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 bg-gradient-to-r ${feature.gradient} rounded-full opacity-0 group-hover:opacity-60`}
                      style={{
                        top: `${20 + i * 30}%`,
                        right: `${10 + i * 15}%`,
                      }}
                      animate={{
                        y: [-5, 5, -5],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
