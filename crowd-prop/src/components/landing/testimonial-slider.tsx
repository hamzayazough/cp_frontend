'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp, Users } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: "Secure & Transparent",
    description: "Advanced tracking and fraud prevention ensure every interaction is legitimate and properly attributed.",
    color: "bg-blue-500"
  },
  {
    icon: Zap,
    title: "Fast Deployment",
    description: "Launch campaigns quickly and start seeing results with our streamlined platform designed for efficiency.",
    color: "bg-purple-500"
  },
  {
    icon: TrendingUp,
    title: "Performance-Based",
    description: "Pay only for results with our transparent tracking system that ensures fair compensation for all parties.",
    color: "bg-green-500"
  },
  {
    icon: Users,
    title: "Professional Network",
    description: "Connect with verified promoters and advertisers in a professional environment built for success.",
    color: "bg-orange-500"
  }
];

export function TestimonialSlider() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our innovative platform connecting advertisers with skilled promoters
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center mb-6`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
