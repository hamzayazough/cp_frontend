'use client';

import { motion } from 'framer-motion';
import { useUserType } from '@/contexts/UserTypeContext';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export function FuturisticFooter() {
  const { userType } = useUserType();

  const businessLinks = [
    { title: 'Campaign Types', href: '#campaigns' },
    { title: 'Analytics', href: '#analytics' }
  ];

  const individualLinks = [
    { title: 'How It Works', href: '#how-it-works' },
    { title: 'Opportunities', href: '#opportunities' },
    { title: 'Community', href: '#community' },
    { title: 'Resources', href: '#resources' }
  ];

  const links = userType === 'business' ? businessLinks : individualLinks;

  return (
    <footer className="relative py-20 px-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">CP</span>
              </div>
              <span className="text-2xl font-bold text-white">CrowdProp</span>
            </div>
            <p className="text-white/70 leading-relaxed max-w-md mb-6">
              {userType === 'business' 
                ? 'The leading platform connecting businesses with professional promoters for scalable growth campaigns.'
                : 'Empowering marketers to monetize their skills through diverse promotional opportunities.'
              }
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Github, href: '#' },
                { icon: Mail, href: '#' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg flex items-center justify-center transition-all duration-300 group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-white font-semibold mb-6">
              {userType === 'business' ? 'For Businesses' : 'For Promoters'}
            </h3>
            <ul className="space-y-3">
              {links.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/60">
                <Mail className="w-4 h-4" />
                <span>knowvance.business@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Phone className="w-4 h-4" />
                <span>+1 (581) 337-8450</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <MapPin className="w-4 h-4" />
                <span>Montreal, CA</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-white/50 text-sm">
            © 2025 CrowdProp. All rights reserved.
          </p>
          
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-white/50 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/50 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-white/50 hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
