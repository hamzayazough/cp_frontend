'use client';

import { STEPS } from '@/app/const/landing-page';
import { motion } from 'framer-motion';

const steps = STEPS;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple steps to start earning or growing your business through performance-based promotion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 transform translate-x-1/2 z-0" />
              )}
              
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                  {step.icon}
                </div>
                
                <div className="w-8 h-8 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>
                
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
