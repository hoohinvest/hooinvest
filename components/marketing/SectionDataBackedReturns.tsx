export default function SectionDataBackedReturns() {
  const benchmarks = [
    {
      label: 'Traditional Savings (HYSA)',
      value: '~4–5%',
      note: '(illustrative)',
    },
    {
      label: 'Index Funds (10-yr avg)',
      value: '~7–10%',
      note: '(illustrative)',
    },
    {
      label: 'HooInvest Real Assets',
      value: '8–12%',
      note: 'illustrative blends*',
      highlight: true,
    },
    {
      label: 'Income-plus strategies',
      value: 'NOI + equity',
      note: 'deal-dependent',
    },
  ];

  const marketEvidence = [
    'Real-asset exposure (cash-flow + appreciation)',
    'Transparent underwriting + milestone tracking',
    'Diversified, fractional participation lowers single-asset risk',
  ];

  return (
    <section className="py-14 md:py-20 bg-[#0E1526]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#E8EEF5] mb-3">
            Data-Backed Returns
          </h2>
          <p className="text-[#A9B4C0] max-w-2xl mx-auto">
            Illustrative benchmarks; not guarantees. Returns depend on offering risk and disclosures.
          </p>
        </div>

        {/* Data Tiles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {benchmarks.map((benchmark) => (
            <div
              key={benchmark.label}
              className={`panel p-6 text-center ${
                benchmark.highlight
                  ? 'border-[#00E18D] bg-[#111A2E]'
                  : ''
              }`}
            >
              <p className="text-xs text-[#A9B4C0] mb-2">{benchmark.label}</p>
              <p
                className={`text-3xl font-bold mb-1 ${
                  benchmark.highlight ? 'text-[#00E18D]' : 'text-[#E8EEF5]'
                }`}
              >
                {benchmark.value}
              </p>
              <p className="text-xs text-[#A9B4C0]">{benchmark.note}</p>
            </div>
          ))}
        </div>

        {/* Market Evidence */}
        <div className="panel p-8">
          <h3 className="text-lg font-semibold text-[#E8EEF5] mb-4 text-center">
            Why HooInvest Can Outperform
          </h3>
          <ul className="grid sm:grid-cols-3 gap-4">
            {marketEvidence.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[#A9B4C0]">
                <span className="text-[#00E18D] mt-0.5 flex-shrink-0">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-[#A9B4C0] text-center italic">
          *Illustrative only; not a guarantee. See offering docs for specific risk and return profiles.
        </p>
      </div>
    </section>
  );
}

