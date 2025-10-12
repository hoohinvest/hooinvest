import Link from 'next/link';

export default function SegmentPanels() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Business Panel */}
        <div className="panel p-8">
          <h3 className="text-2xl font-semibold text-[#E8EEF5] mb-3">
            Raise Capital on Your Terms
          </h3>
            <p className="text-[#A9B4C0] mb-6">
              Ownership stakes, fixed-yield notes, or revenue-sharing—raise capital with escrow and clear investor updates.
            </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2 text-[#A9B4C0]">
              <span className="text-[#00E18D] mt-1">•</span>
              <span>Choose equity, yield notes, or revenue share</span>
            </li>
            <li className="flex items-start gap-2 text-[#A9B4C0]">
              <span className="text-[#00E18D] mt-1">•</span>
              <span>Faster to capital with compliant escrow</span>
            </li>
            <li className="flex items-start gap-2 text-[#A9B4C0]">
              <span className="text-[#00E18D] mt-1">•</span>
              <span>Wider investor reach & transparent updates</span>
            </li>
            <li className="flex items-start gap-2 text-[#A9B4C0]">
              <span className="text-[#00E18D] mt-1">•</span>
              <span>KYB verification & compliance support</span>
            </li>
          </ul>
          <Link href="/business" className="primary-btn w-full sm:w-auto">
            Start Your Raise
          </Link>
        </div>

        {/* Investor Panel */}
        <div className="panel p-8">
          <h3 className="text-2xl font-semibold text-[#E8EEF5] mb-3">
            Invest Beyond Stocks
          </h3>
          <p className="text-[#A9B4C0] mb-6">
            Diversify into real businesses and real estate projects with data-backed transparency.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2 text-[#A9B4C0]">
              <span className="text-[#4DD2FF] mt-1">•</span>
              <span>Diversify into real assets beyond public markets</span>
            </li>
            <li className="flex items-start gap-2 text-[#A9B4C0]">
              <span className="text-[#4DD2FF] mt-1">•</span>
              <span>Fractional access to vetted opportunities</span>
            </li>
            <li className="flex items-start gap-2 text-[#A9B4C0]">
              <span className="text-[#4DD2FF] mt-1">•</span>
              <span>Curated pipeline with transparent updates</span>
            </li>
            <li className="flex items-start gap-2 text-[#A9B4C0]">
              <span className="text-[#4DD2FF] mt-1">•</span>
              <span>Live performance tracking & reporting</span>
            </li>
          </ul>
          <Link href="/investors" className="secondary-btn w-full sm:w-auto">
            Express Interest
          </Link>
        </div>
      </div>

      {/* Footer links */}
      <div className="flex flex-wrap justify-center gap-4 text-sm text-[#A9B4C0]">
        <Link href="/about" className="hover:text-[#00E18D] transition-colors underline">
          Learn about our compliance
        </Link>
        <span className="hidden sm:inline">•</span>
        <Link href="/business" className="hover:text-[#00E18D] transition-colors underline">
          See business benefits
        </Link>
        <span className="hidden sm:inline">•</span>
        <Link href="/investors" className="hover:text-[#00E18D] transition-colors underline">
          See investor benefits
        </Link>
      </div>

      {/* Legal disclaimer */}
      <p className="text-xs text-center text-[#A9B4C0] max-w-4xl mx-auto">
        Expressions of interest are non-binding and subject to verification and disclosures.
      </p>
    </div>
  );
}

