import Link from 'next/link';

export default function CTAJoin() {
  return (
    <section className="py-14 border-t border-[#1A222C]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-gradient-to-br from-[#11161D] to-[#0B0F14] border border-[#00E18D] rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E8EEF5] mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-[#A9B4C0] text-lg mb-8">
              Join businesses raising capital and investors finding opportunities on HooInvest
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/business"
                className="bg-[#00E18D] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#00E18D]/90 transition-all focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:ring-offset-2 focus:ring-offset-[#0B0F14]"
              >
                Businesses: Start Your Raise
              </Link>
              <Link
                href="/investors"
                className="bg-[#1A222C] text-[#E8EEF5] border border-[#1A222C] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#1A222C]/80 hover:border-[#00E18D] transition-all focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:ring-offset-2 focus:ring-offset-[#0B0F14]"
              >
                Investors: Express Interest
              </Link>
            </div>

            {/* Secondary Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm mb-6">
              <a
                href="mailto:careers@hooinvest.com"
                className="text-[#A9B4C0] hover:text-[#00E18D] transition-colors underline"
              >
                We're Hiring – Join Our Team
              </a>
              <span className="hidden sm:inline text-[#1A222C]">•</span>
              <a
                href="mailto:hello@hooinvest.com"
                className="text-[#A9B4C0] hover:text-[#00E18D] transition-colors underline"
              >
                Contact Us
              </a>
            </div>

            {/* Trust copy */}
            <p className="text-[#A9B4C0] text-sm italic">
              Expressions of interest are non-binding and help us prioritize access.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


