import Link from 'next/link';
import type { Metadata } from 'next';
import HeroAbout from '@/components/about/HeroAbout';
import StoryBlock from '@/components/about/StoryBlock';
import ValuesGrid from '@/components/about/ValuesGrid';
import TrustBadges from '@/components/about/TrustBadges';
import Timeline from '@/components/about/Timeline';
import TeamGrid from '@/components/about/TeamGrid';
import Testimonials from '@/components/about/Testimonials';
import CTAJoin from '@/components/about/CTAJoin';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'About HooVest | Our Mission, Team & Values',
  description: 'Learn about HooVest - the investment platform built by operators, engineers, and compliance pros. Democratizing access to real asset investing with transparency and security.',
  openGraph: {
    title: 'About HooVest | Our Mission, Team & Values',
    description: 'The investment broker app for real assets—built by operators, engineers, and compliance pros.',
    type: 'website',
  },
};

export default function AboutPage() {
  // Schema.org JSON-LD structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HooVest",
    "description": "Investment platform connecting businesses raising capital with investors seeking real asset opportunities.",
    "url": "https://hoovest.com",
    "logo": "https://hoovest.com/logo.png",
    "foundingDate": "2023",
    "sameAs": [
      "https://linkedin.com/company/hoovest",
      "https://twitter.com/hoovest"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "hello@hooinvest.com",
      "availableLanguage": "English"
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14]">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Header */}
      <header className="bg-[#11161D] border-b border-[#1A222C]">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-[#00E18D]">
              HooVest
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                href="/business" 
                className="text-[#A9B4C0] hover:text-[#E8EEF5] transition-colors hidden sm:inline"
              >
                For Business
              </Link>
              <Link 
                href="/investors" 
                className="text-[#A9B4C0] hover:text-[#E8EEF5] transition-colors hidden sm:inline"
              >
                For Investors
              </Link>
              <Link 
                href="/" 
                className="bg-[#1A222C] text-[#E8EEF5] px-4 py-2 rounded-lg hover:bg-[#1A222C]/80 hover:border-[#00E18D] border border-[#1A222C] transition-all"
              >
                Home
              </Link>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroAbout />
        <StoryBlock />
        <ValuesGrid />
        <TrustBadges />
        <Testimonials />
        <Timeline />
        <TeamGrid />
        <CTAJoin />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1A222C] py-12 bg-[#11161D]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-[#00E18D] font-bold text-xl mb-4">HooVest</h4>
              <p className="text-[#A9B4C0] text-sm">
                Invest in real businesses. Own real results.
              </p>
            </div>
            <div>
              <h5 className="text-[#E8EEF5] font-semibold mb-3">For Businesses</h5>
              <ul className="space-y-2 text-[#A9B4C0] text-sm">
                <li><Link href="/business" className="hover:text-[#00E18D] transition-colors">Raise Capital</Link></li>
                <li><Link href="/business#how-it-works" className="hover:text-[#00E18D] transition-colors">How It Works</Link></li>
                <li><Link href="/business#benefits" className="hover:text-[#00E18D] transition-colors">Benefits</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[#E8EEF5] font-semibold mb-3">For Investors</h5>
              <ul className="space-y-2 text-[#A9B4C0] text-sm">
                <li><Link href="/investors" className="hover:text-[#00E18D] transition-colors">Explore Deals</Link></li>
                <li><Link href="/investors#opportunities" className="hover:text-[#00E18D] transition-colors">Opportunities</Link></li>
                <li><Link href="/investors#benefits" className="hover:text-[#00E18D] transition-colors">Benefits</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[#E8EEF5] font-semibold mb-3">Company</h5>
              <ul className="space-y-2 text-[#A9B4C0] text-sm">
                <li><Link href="/about" className="hover:text-[#00E18D] transition-colors">About</Link></li>
                <li><a href="mailto:careers@hooinvest.com" className="hover:text-[#00E18D] transition-colors">Careers</a></li>
                <li><a href="mailto:hello@hooinvest.com" className="hover:text-[#00E18D] transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1A222C] pt-8 text-center text-[#A9B4C0] text-sm">
            <p>&copy; {new Date().getFullYear()} HooVest. All rights reserved.</p>
            <p className="mt-2 text-xs">
              Investments carry risk. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </footer>

      {/* Hidden Admin Sign-In Trigger - Click bottom-right corner */}
      <Link
        href="/auth/sign-in"
        className="fixed bottom-0 right-0 w-8 h-8 opacity-0 hover:opacity-10 z-50"
        aria-label="Admin access"
        title="Admin sign in"
      />
    </div>
  );
}

