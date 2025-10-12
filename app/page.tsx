import Link from 'next/link';
import type { Metadata } from 'next';
import HeroMarketing from '@/components/marketing/HeroMarketing';
import SectionHowItWorksSimple from '@/components/marketing/SectionHowItWorksSimple';
import SectionDataBackedReturns from '@/components/marketing/SectionDataBackedReturns';
import SegmentPanels from '@/components/marketing/SegmentPanels';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'hooinvest | Invest in Real Businesses. Own Real Results.',
  description: 'Raise capital or invest with clarity—equity, interest, or royalties—on one simple platform. Access real businesses and real assets with transparent underwriting.',
};

export default function HomePage() {
  // Schema.org JSON-LD structured data
  const schemaData = {
    "@context": "https://schema.org",
        "@type": "Organization",
        "name": "HooVest",
        "description": "Invest in real businesses. Own real results. Raise capital or invest with clarity—equity, interest, or royalties—on one simple platform.",
        "url": "https://hoovest.com",
        "logo": "https://hoovest.com/logo.png",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": "English"
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Header */}
      <header className="bg-[#0E1526] border-b border-[#1E2A3C] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
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
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content - FOUR Fluid Sections */}
      <main>
        {/* SECTION A: Hero - "Why HooVest" */}
        <HeroMarketing />

        {/* SECTION B: How It Works - Process Steps */}
        <SectionHowItWorksSimple />

        {/* SECTION C: Data-Backed Returns - Dedicated Data Section */}
        <SectionDataBackedReturns />

        {/* SECTION D: Who It's For + CTAs - Segment Panels */}
        <section className="py-14 md:py-20 bg-[#0B1220]">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#E8EEF5] text-center mb-12">
              Who It's For
            </h2>
            <SegmentPanels />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E2A3C] py-12 bg-[#0E1526]">
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
          <div className="border-t border-[#1E2A3C] pt-8 text-center text-[#A9B4C0] text-sm">
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
