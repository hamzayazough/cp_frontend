'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { routes } from '@/lib/router';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6"
          >
            Visibility That{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pays Off
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            The performance-based marketplace where businesses get promoted, and promoters get paid.
            Connect. Create. Earn.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              href={routes.register}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Promoting
            </Link>
            <Link
              href={routes.exploreCampaigns}
              className="bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Browse Campaigns
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>2,318 views tracked today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>147 active campaigns</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>$12,450 earned this week</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-32 right-20 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full shadow-lg"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-20 w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full shadow-lg"
        />
        <motion.div
          animate={{ y: [0, 25, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-32 right-10 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg"
        />
      </div>
    </section>
  );
}
