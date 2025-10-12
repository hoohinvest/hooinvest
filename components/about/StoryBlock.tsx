export default function StoryBlock() {
  return (
    <section className="py-14 border-t border-[#1A222C]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left column: Story */}
          <div>
            <h2 className="text-sm uppercase tracking-wide text-[#A9B4C0] mb-3">What We Do</h2>
            <h3 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5] mb-6">
              Connecting Capital to Real Opportunities
            </h3>
            <p className="text-[#A9B4C0] leading-relaxed text-lg">
              HooVest is a platform where businesses raise capital (ownership stakes, fixed-yield notes, or revenue-sharing) 
              and anyone can invest into real opportunities with clarity and compliance. We bridge the 
              gap between traditional finance and accessible investing, making it easier for businesses 
              to grow and investors to diversify beyond stocks.
            </p>
          </div>

          {/* Right column: Why it matters */}
          <div className="bg-[#11161D] border border-[#1A222C] rounded-2xl p-8">
            <h4 className="text-xl font-semibold text-[#E8EEF5] mb-6">Why It Matters</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-[#00E18D] text-xl flex-shrink-0 mt-1">→</span>
                <div>
                  <p className="text-[#E8EEF5] font-medium">Speed to Capital</p>
                  <p className="text-[#A9B4C0] text-sm">Streamlined process gets businesses funded faster than traditional routes</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00E18D] text-xl flex-shrink-0 mt-1">→</span>
                <div>
                  <p className="text-[#E8EEF5] font-medium">Fractional Access</p>
                  <p className="text-[#A9B4C0] text-sm">Invest smaller amounts across multiple opportunities to build a diversified portfolio</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00E18D] text-xl flex-shrink-0 mt-1">✓</span>
                <div>
                  <p className="text-[#E8EEF5] font-medium">Integrated KYC/Escrow</p>
                  <p className="text-[#A9B4C0] text-sm">Built-in verification and secure escrow protect all parties throughout the transaction</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00E18D] text-xl flex-shrink-0 mt-1">→</span>
                <div>
                  <p className="text-[#E8EEF5] font-medium">Transparent Updates</p>
                  <p className="text-[#A9B4C0] text-sm">Real-time dashboards and regular reporting keep everyone informed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

