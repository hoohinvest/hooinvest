import Link from 'next/link';
import LeadFormBusiness from '@/components/forms/LeadFormBusiness';
import FAQAccordion from '@/components/marketing/FAQAccordion';
import BusinessBenefitGrid from '@/components/marketing/BusinessBenefitGrid';
import ThemeToggle from '@/components/ThemeToggle';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Raise Capital for Your Business | HooInvest',
  description: 'Raise capital on your terms with ownership stakes, fixed yield, or revenue-sharing. Fast, transparent, and compliant.',
};

export default function BusinessPage() {
  const businessFAQs = [
    {
      question: 'What can I raise: equity, interest, or royalties?',
      answer: 'You choose the structure that works best for your business. Equity gives investors an ownership stake; interest (debt) provides fixed yield on a note; royalties share a percentage of revenue. We support all three and help you structure the offering.',
    },
    {
      question: 'How long does it take to go live?',
      answer: 'Typical timeline is 6-10 business days from application submission to live listing, depending on document completeness and verification. Our team works with you to expedite the process while ensuring compliance.',
    },
    {
      question: 'Do I need audited financials?',
      answer: 'Not required for all offerings, but we do need clear financial statements and metrics. For larger raises or certain investor audiences, reviewed or audited financials may strengthen your application.',
    },
    {
      question: 'How are investors updated post-raise?',
      answer: 'You\'ll use our dashboard to post quarterly (or more frequent) updates including key metrics, milestones, and financial performance. Transparent communication builds investor trust and future access to capital.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Header */}
      <header className="bg-[#0E1526] border-b border-[#1E2A3C]">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-[#00E18D]">
              HooInvest
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                href="/investors" 
                className="text-[#A9B4C0] hover:text-[#E8EEF5] transition-colors"
              >
                For Investors
              </Link>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* SECTION 1: Hero */}
        <section 
          className="relative overflow-hidden py-16 md:py-24"
          style={{ 
            background: "radial-gradient(1200px 600px at 20% -10%, rgba(77,210,255,0.18), transparent), linear-gradient(180deg, #0B1220 0%, #0E1526 100%)" 
          }}
        >
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <p className="eyebrow mb-3 text-center md:text-left">FOR BUSINESSES</p>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight text-center md:text-left text-[#E8EEF5]">
              Raise Capital on Your Terms.
            </h1>
            
            <p className="mt-4 text-lg md:text-xl text-[#A9B4C0] max-w-2xl text-center md:text-left">
              Choose equity, debt-style yield, or royalties to fit your model—with compliant escrow, transparent updates, and investor reach.
            </p>
            
            <div className="mt-8 flex justify-center md:justify-start">
              <a href="#form" className="primary-btn">
                Start Your Raise
              </a>
            </div>

            {/* Business Benefits */}
            <div className="mt-10">
              <BusinessBenefitGrid />
            </div>
          </div>
        </section>

        {/* SECTION 2: How It Works + Benefits */}
        <section className="py-14 md:py-20 bg-[#0B1220]">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: How It Works */}
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5]">How It Works</h2>
                
                <div className="panel p-6 space-y-4">
                  <ul className="space-y-3 text-[#A9B4C0]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#00E18D] mt-1 font-bold">1.</span>
                      <span>Apply → Verify → Launch raise (ownership stake, fixed yield, or revenue share)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00E18D] mt-1 font-bold">2.</span>
                      <span>Faster to capital with escrow-backed closes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00E18D] mt-1 font-bold">3.</span>
                      <span>Standardized disclosures & investor updates</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right: Benefits */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5]">Benefits</h2>
                
                <div className="grid gap-4">
                  <div className="panel p-4">
                    <h3 className="font-semibold text-[#E8EEF5] mb-1">Flexible Instruments</h3>
                    <p className="text-sm text-[#A9B4C0]">Choose Equity, Interest (Debt), or Royalty structures</p>
                  </div>
                  <div className="panel p-4">
                    <h3 className="font-semibold text-[#E8EEF5] mb-1">Speed to Capital</h3>
                    <p className="text-sm text-[#A9B4C0]">Templated diligence and streamlined compliance</p>
                  </div>
                  <div className="panel p-4">
                    <h3 className="font-semibold text-[#E8EEF5] mb-1">Investor Reach</h3>
                    <p className="text-sm text-[#A9B4C0]">Curated, data-rich listing to qualified investors</p>
                  </div>
                  <div className="panel p-4">
                    <h3 className="font-semibold text-[#E8EEF5] mb-1">Compliance-First</h3>
                    <p className="text-sm text-[#A9B4C0]">KYB verification, AML checks, secure escrow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Form Entry + FAQs */}
        <section id="form" className="py-14 md:py-20 bg-[#0E1526]">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Form */}
              <div>
                <div className="panel p-8">
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5] mb-2">
                    Start Your Raise
                  </h2>
                  <p className="text-[#A9B4C0] mb-6">
                    Complete the form below to express your interest. Our team will review and reach out within 2-3 business days.
                  </p>
                  
                  {/* Existing form component - NO LOGIC CHANGES */}
                  <LeadFormBusiness />
                  
                  <p className="mt-4 text-xs text-[#A9B4C0] italic">
                    Expressions of interest are non-binding. Your information remains private and is handled per our Privacy Policy.
                  </p>
                </div>
              </div>

              {/* Right: FAQs */}
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5] mb-6">
                  Frequently Asked Questions
                </h2>
                <FAQAccordion items={businessFAQs} />
                <p className="mt-6 text-xs text-[#A9B4C0] italic">
                  Illustrative information only; see full disclosures and offering documents.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E2A3C] py-12 bg-[#0E1526]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-[#00E18D] font-bold text-xl mb-4">HooInvest</h4>
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
            <p>&copy; {new Date().getFullYear()} HooInvest. All rights reserved.</p>
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
