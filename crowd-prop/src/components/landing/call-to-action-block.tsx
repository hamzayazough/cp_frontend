'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { routes } from '@/lib/router';

export function CallToActionBlock() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Ready to Promote or Get Promoted?
          </h2>
          
          <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Join thousands of businesses and promoters who are already growing together.
            <br />
            <span className="font-semibold">Free to join. Pay as you grow.</span>
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <Link
              href={routes.register}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              href={routes.login}
              className="bg-transparent text-white px-8 py-4 rounded-xl text-lg font-semibold border-2 border-white hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
            >
              Sign In
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-blue-100"
          >
            <div>
              <div className="text-3xl font-bold text-white mb-2">5,000+</div>
              <div>Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">$500K+</div>
              <div>Total Earnings Paid</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div>Success Rate</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
