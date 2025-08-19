'use client';

import { UserTypeProvider } from '@/contexts/UserTypeContext';
import { ThreeDBackground } from './3d-background';
import { UserTypeSelector } from './user-type-selector';
import { DynamicHeroSection } from './dynamic-hero-section';
import { CampaignShowcase } from './campaign-showcase';
import { FeaturesSection } from './features-section';
import { CallToActionSection } from './cta-section';
import { FuturisticFooter } from './futuristic-footer';

export function LandingPage() {
  return (
    <UserTypeProvider>
      <div className="min-h-screen relative overflow-hidden">
        {/* 3D Background */}
        <ThreeDBackground />
        
        {/* User Type Selector */}
        <UserTypeSelector />
        
        {/* Main Content */}
        <main className="relative z-10">
          <DynamicHeroSection />
          <CampaignShowcase />
          <FeaturesSection />
          <CallToActionSection />
        </main>
        
        {/* Footer */}
        <FuturisticFooter />
      </div>
    </UserTypeProvider>
  );
}
