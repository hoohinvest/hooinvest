import Link from 'next/link';
import LeadFormInvestor from '@/components/forms/LeadFormInvestor';
import FAQAccordion from '@/components/marketing/FAQAccordion';
import InvestorBenefitGrid from '@/components/marketing/InvestorBenefitGrid';
import ThemeToggle from '@/components/ThemeToggle';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invest Beyond Stocks | hooinvest',
  description: 'Diversify into real businesses and projects. Fractional access, transparent updates, and curated pipelines.',
};

export default function InvestorsPage() {
  const investorFAQs = [
    {
      question: 'Who can invest?',
      answer: 'Depending on the offering, both accredited and non-accredited investors may participate. Some offerings are open to all under Reg CF; others require accredited status. We clearly mark each offering investor requirements.',
    },
    {
      question: 'What risks should I consider?',
      answer: 'All investments carry risk, including loss of principal. Real businesses and projects may underperform, face operational challenges, or fail. Review each offering risk disclosures and consult your financial advisor before investing.',
    },
    {
      question: 'When are funds moved from escrow?',
      answer: 'Funds are held in secure escrow until the offering closes successfully (minimum raise met, all conditions satisfied). If the offering does not close, funds are returned to investors. Post-close, funds are disbursed per the offering terms.',
    },
    {
      question: 'How do I track returns?',
      answer: 'Your dashboard shows real-time performance metrics, quarterly updates, and distributions. You will receive notifications for material events and can view detailed reports on revenue, milestones, and financial health.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Header */}
      <header className="bg-[#0E1526] border-b border-[#1E2A3C]">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-[#00E18D]">
              hooinvest
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                href="/business" 
                className="text-[#A9B4C0] hover:text-[#E8EEF5] transition-colors"
              >
                For Business
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
            <p className="eyebrow mb-3 text-center md:text-left">FOR INVESTORS</p>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight text-center md:text-left text-[#E8EEF5]">
              Invest Beyond Stocks.
            </h1>
            
            <p className="mt-4 text-lg md:text-xl text-[#A9B4C0] max-w-2xl text-center md:text-left">
              Access real businesses and projects with transparent data, fractional entry, and escrow-backed commitments.
            </p>
            
            <div className="mt-8 flex justify-center md:justify-start">
              <a href="#form" className="primary-btn">
                Express Interest
              </a>
            </div>

            {/* Investor Benefits */}
            <div className="mt-10">
              <InvestorBenefitGrid />
            </div>

            <p className="mt-6 text-xs text-[#A9B4C0] text-center md:text-left italic">
              Illustrative; not guarantees—returns depend on each offering's risk.
            </p>
          </div>
        </section>

        {/* SECTION 2: How It Works + Data Tiles */}
        <section className="py-14 md:py-20 bg-[#0B1220]">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: How It Works */}
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5]">How It Works</h2>
                
                <div className="panel p-6 space-y-4">
                  <ul className="space-y-3 text-[#A9B4C0]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#4DD2FF] mt-1 font-bold">1.</span>
                      <span>Browse offerings → Commit in Escrow → Track performance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4DD2FF] mt-1 font-bold">2.</span>
                      <span>Diversify into real assets & businesses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4DD2FF] mt-1 font-bold">3.</span>
                      <span>Fractional access; data-driven transparency</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right: Data Tiles */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5]">Illustrative Returns</h2>
                
                <div className="panel p-6">
                  <p className="text-sm text-[#A9B4C0] mb-4">Benchmark Comparison</p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-xl bg-[#111A2E] p-4">
                      <p className="text-xs text-[#A9B4C0]">Traditional Savings</p>
                      <p className="text-2xl font-bold text-[#E8EEF5]">~4–5%</p>
                      <p className="text-xs text-[#A9B4C0]">(illustrative)</p>
                    </div>
                    <div className="rounded-xl bg-[#111A2E] p-4">
                      <p className="text-xs text-[#A9B4C0]">Index Funds (10-yr avg)</p>
                      <p className="text-2xl font-bold text-[#E8EEF5]">~7–10%</p>
                      <p className="text-xs text-[#A9B4C0]">(illustrative)</p>
                    </div>
                    <div className="rounded-xl bg-[#111A2E] border border-[#00E18D] p-4">
                      <p className="text-xs text-[#A9B4C0]">HooInvest Real Assets*</p>
                      <p className="text-2xl font-bold text-[#00E18D]">8–12%</p>
                      <p className="text-xs text-[#A9B4C0]">(illustrative blends)</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#A9B4C0] mt-3 italic">
                    *Illustrative only. No guarantee. See offering docs for specific risk and return profiles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Interest Form + FAQs */}
        <section id="form" className="py-14 md:py-20 bg-[#0E1526]">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Form */}
              <div>
                <div className="panel p-8">
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5] mb-2">
                    Tell Us What You Want to Invest
                  </h2>
                  <p className="text-[#A9B4C0] mb-6">
                    Complete the form below and we'll send you curated opportunities matching your investment profile.
                  </p>
                  
                  {/* Existing form component - NO LOGIC CHANGES */}
                  <LeadFormInvestor />
                  
                  <p className="mt-4 text-xs text-[#A9B4C0] italic">
                    Expressions of interest are non-binding and help us match you to relevant offerings.
                  </p>
                </div>
              </div>

              {/* Right: FAQs */}
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5] mb-6">
                  Frequently Asked Questions
                </h2>
                <FAQAccordion items={investorFAQs} />
                <p className="mt-6 text-xs text-[#A9B4C0] italic">
                  Illustrative information only; see full disclosures before investing.
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
              <h4 className="text-[#00E18D] font-bold text-xl mb-4">hooinvest</h4>
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
            <p>&copy; {new Date().getFullYear()} hooinvest. All rights reserved.</p>
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
