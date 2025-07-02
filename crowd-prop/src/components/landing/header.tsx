'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { routes } from '@/lib/router';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href={routes.home} className="flex items-center">
              <Image 
                src="/cp_logo2.png" 
                alt="Crowd Prop" 
                width={250} 
                height={60}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Pricing
            </a>
            <div className="flex items-center space-x-4">
              <Link
                href={routes.register}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white px-6 py-2.5 rounded-full font-medium hover:from-blue-700 hover:via-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Pricing
              </a>
              <Link href={routes.login} className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Login
              </Link>
              <Link
                href={routes.register}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white px-6 py-3 rounded-full font-medium hover:from-blue-700 hover:via-purple-700 hover:to-purple-800 transition-all duration-300 w-fit shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
