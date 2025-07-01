'use client';

import { motion } from 'framer-motion';

const campaignTypes = [
  {
    title: 'Visibility',
    description: 'Drive brand awareness and reach new audiences through strategic promotion.',
    icon: '👁️',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Consultant',
    description: 'Connect with experts who can promote your consultancy services.',
    icon: '💼',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Seller',
    description: 'Boost product sales through performance-based marketing campaigns.',
    icon: '🛒',
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Salesman',
    description: 'Expand your sales team with commission-based promoter partnerships.',
    icon: '📈',
    color: 'from-orange-500 to-red-500',
  },
];

export function CampaignTypes() {
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
            Campaign Types
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect campaign type for your business goals and find promoters who specialize in your niche
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {campaignTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className={`w-16 h-16 mb-6 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                {type.icon}
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {type.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {type.description}
              </p>
              
              <div className="mt-6 text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Learn more →
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
