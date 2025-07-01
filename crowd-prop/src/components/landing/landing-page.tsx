import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { CampaignTypes } from '@/components/landing/campaign-types';
import { Features } from '@/components/landing/features';
import { TestimonialSlider } from '@/components/landing/testimonial-slider';
import { CallToActionBlock } from '@/components/landing/call-to-action-block';
import { Footer } from '@/components/landing/footer';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <HowItWorks />
      <CampaignTypes />
      <Features />
      <TestimonialSlider />
      <CallToActionBlock />
      <Footer />
    </div>
  );
}
