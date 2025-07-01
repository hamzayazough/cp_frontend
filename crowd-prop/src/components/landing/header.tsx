'use client';

import Link from 'next/link';
import { useState } from 'react';
import { routes } from '@/lib/router';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href={routes.home} className="text-2xl font-bold text-gray-900">
              Crowd Prop
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <Link href={routes.login} className="text-gray-600 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Link
              href={routes.register}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Join Now
            </Link>
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
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <Link href={routes.login} className="text-gray-600 hover:text-gray-900 transition-colors">
                Login
              </Link>
              <Link
                href={routes.register}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-fit"
              >
                Join Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
