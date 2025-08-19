'use client';

import { motion } from 'framer-motion';
import { useUserType } from '@/contexts/UserTypeContext';
import { Building2, Users } from 'lucide-react';

export function UserTypeSelector() {
  const { userType, setUserType } = useUserType();

  return (
    <motion.div 
      className="fixed top-6 right-8 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-2 flex gap-2">
        <motion.button
          onClick={() => setUserType('business')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
            userType === 'business'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Building2 size={18} />
          <span className="font-medium">Business</span>
        </motion.button>
        
        <motion.button
          onClick={() => setUserType('individual')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
            userType === 'individual'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Users size={18} />
          <span className="font-medium">Individual</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
