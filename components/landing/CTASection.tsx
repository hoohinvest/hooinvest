import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#11161D] border border-[#1A222C] rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#E8EEF5] mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-[#A9B4C0] text-lg mb-8 max-w-2xl mx-auto">
            Join businesses raising capital and investors finding opportunities on HooInvest
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              href="/business"
              className="w-full sm:w-auto bg-[#00E18D] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#00E18D]/90 transition-all focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:ring-offset-2 focus:ring-offset-[#11161D]"
            >
              Start Your Raise
            </Link>
            <Link 
              href="/investors"
              className="w-full sm:w-auto bg-[#00E18D] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#00C67A] transition-all focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:ring-offset-2 focus:ring-offset-[#11161D]"
            >
              Express Interest to Invest
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-[#A9B4C0] text-sm">
            <div className="flex items-center gap-2">
              <span className="text-[#00E18D]">✓</span>
              <span>KYC/KYB Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#00E18D]">✓</span>
              <span>Secure Escrow</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#00E18D]">✓</span>
              <span>Compliance First</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


