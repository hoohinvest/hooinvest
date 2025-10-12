import Link from 'next/link';

export default function Hero() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#E8EEF5]">
          Invest in Real Businesses. Own Real Results.
        </h1>
        <p className="text-xl md:text-2xl text-[#A9B4C0] mb-12 max-w-3xl mx-auto">
          Raise capital or invest with clarity—equity, interest, or royalties—on one simple platform.
        </p>
        
        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/business"
            className="w-full sm:w-auto bg-[#00E18D] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#00E18D]/90 transition-all focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:ring-offset-2 focus:ring-offset-[#0B0F14]"
            aria-label="Business application - Raise capital"
          >
            I'm a Business – Raise Capital
          </Link>
          <Link 
            href="/investors"
            className="w-full sm:w-auto bg-[#1A222C] text-[#E8EEF5] border border-[#1A222C] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#1A222C]/80 hover:border-[#00E18D] transition-all focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:ring-offset-2 focus:ring-offset-[#0B0F14]"
            aria-label="Investor application - Explore investment deals"
          >
            I'm an Investor – Explore Deals
          </Link>
        </div>
      </div>
    </section>
  );
}


