export default function ValueProof() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#E8EEF5]">
          Data-Backed Returns
        </h2>
        <p className="text-center text-[#A9B4C0] mb-12 max-w-2xl mx-auto">
          See how real asset investing can potentially outperform traditional options
        </p>

        {/* Comparison Tiles */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#11161D] border border-[#1A222C] rounded-2xl p-6 text-center">
            <div className="text-[#A9B4C0] text-sm font-medium mb-2">Traditional Savings</div>
            <div className="text-4xl font-bold text-[#E8EEF5] mb-2">4–5%</div>
            <div className="text-[#A9B4C0] text-sm">High-Yield Savings Account</div>
          </div>

          <div className="bg-[#11161D] border border-[#1A222C] rounded-2xl p-6 text-center">
            <div className="text-[#A9B4C0] text-sm font-medium mb-2">Public Markets</div>
            <div className="text-4xl font-bold text-[#E8EEF5] mb-2">7–10%</div>
            <div className="text-[#A9B4C0] text-sm">Index Funds (10-yr avg)</div>
          </div>

          <div className="bg-[#11161D] border border-[#00E18D] rounded-2xl p-6 text-center relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#00E18D] text-black px-3 py-1 rounded-full text-xs font-bold">
              HooInvest
            </div>
            <div className="text-[#00E18D] text-sm font-medium mb-2">Real Assets</div>
            <div className="text-4xl font-bold text-[#00E18D] mb-2">8–12%</div>
            <div className="text-[#A9B4C0] text-sm">Blended Portfolio (Illustrative)</div>
          </div>
        </div>

        {/* Why Our Model Works */}
        <div className="bg-[#11161D] border border-[#1A222C] rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-[#E8EEF5] mb-4">Why Our Model Can Outperform</h3>
          <ul className="space-y-3 text-[#A9B4C0]">
            <li className="flex items-start gap-3">
              <span className="text-[#00E18D] text-xl">✓</span>
              <span>Access to cash-flowing real assets + business revenue sharing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00E18D] text-xl">✓</span>
              <span>Transparent underwriting and regular updates</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00E18D] text-xl">✓</span>
              <span>Fractional participation across diversified projects</span>
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[#A9B4C0] text-sm mt-6 italic">
          * Illustrative only. Not a guarantee. Returns depend on specific offerings and risk. 
          Investments may lose value. Past performance does not predict future results.
        </p>
      </div>
    </section>
  );
}


