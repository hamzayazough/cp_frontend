import { LandingPage } from '@/components/landing/landing-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Starting with CP",
};

export default function Home() {
  return <LandingPage />;
}
