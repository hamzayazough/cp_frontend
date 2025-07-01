'use client';

import { FEATURES } from '@/app/const/landing-page';
import { motion } from 'framer-motion';

const features = FEATURES;

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Powered by Technology
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform is built with cutting-edge technology to ensure transparency, security, and performance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
