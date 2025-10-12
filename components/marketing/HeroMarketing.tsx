import Link from 'next/link';
import HomeTrustGrid from './HomeTrustGrid';
import StatsStrip from './StatsStrip';

export default function HeroMarketing() {
  return (
    <section 
      className="relative overflow-hidden py-16 md:py-24"
      style={{ 
        background: "radial-gradient(1200px 600px at 20% -10%, rgba(77,210,255,0.18), transparent), linear-gradient(180deg, #0B1220 0%, #0E1526 100%)" 
      }}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Eyebrow */}
        <p className="eyebrow mb-3 text-center md:text-left">WHY HOOVEST</p>
        
        {/* Main headline */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight text-center md:text-left text-[#E8EEF5]">
          Invest in Real Businesses.<br />Own Real Results.
        </h1>
        
        {/* Subheadline */}
        <p className="mt-4 text-lg md:text-xl text-[#A9B4C0] max-w-2xl text-center md:text-left">
          Raise capital or invest with clarity—equity, interest, or royalties—on one transparent platform.
        </p>
        
        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
          <Link href="/business" className="primary-btn">
            I'm a Business – Raise Capital
          </Link>
          <Link href="/investors" className="secondary-btn">
            I'm an Investor – Explore Offers
          </Link>
        </div>

        {/* Trust badges - Flip cards */}
        <HomeTrustGrid />

        {/* Stats strip */}
        <StatsStrip />

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-[#A9B4C0] text-center md:text-left max-w-3xl italic">
          Illustrative metrics only; not guarantees. Returns depend on specific offerings and risk. 
          Past performance does not predict future results.
        </p>
      </div>
    </section>
  );
}

