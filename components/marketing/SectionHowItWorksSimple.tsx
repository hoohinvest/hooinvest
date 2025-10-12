export default function SectionHowItWorksSimple() {
  return (
    <section className="py-14 md:py-20 bg-[#0B1220]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#E8EEF5] text-center mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* For Businesses */}
          <div className="panel p-8">
            <h3 className="text-xl font-semibold text-[#E8EEF5] mb-4">For Businesses</h3>
            <ul className="space-y-3 text-[#A9B4C0]">
              <li className="flex items-start gap-3">
                <span className="text-[#00E18D] font-bold">1.</span>
                <span>Apply → Verify → Launch raise (equity, debt-style yield, or royalties)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00E18D] font-bold">2.</span>
                <span>Faster to capital with escrow-backed closes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00E18D] font-bold">3.</span>
                <span>Standardized disclosures & investor updates</span>
              </li>
            </ul>
          </div>

          {/* For Investors */}
          <div className="panel p-8">
            <h3 className="text-xl font-semibold text-[#E8EEF5] mb-4">For Investors</h3>
            <ul className="space-y-3 text-[#A9B4C0]">
              <li className="flex items-start gap-3">
                <span className="text-[#4DD2FF] font-bold">1.</span>
                <span>Browse offerings → Commit in Escrow → Track performance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#4DD2FF] font-bold">2.</span>
                <span>Diversify into real assets & businesses</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#4DD2FF] font-bold">3.</span>
                <span>Fractional access; data-driven transparency</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

