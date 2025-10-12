export default function DataTiles() {
  const benchmarks = [
    { label: 'Traditional Savings', value: '~4–5%' },
    { label: 'Index Funds (10-yr)', value: '~7–10%' },
    { label: 'HooInvest Real Assets*', value: '8–12%', highlight: true },
  ];

  const reasons = [
    'Access to cash-flowing real assets + revenue sharing',
    'Transparent underwriting & milestone progress',
    'Diversified, fractional participation',
  ];

  return (
    <div className="space-y-4">
      {/* Illustrative Benchmarks */}
      <div className="panel p-6">
        <p className="text-sm text-[#A9B4C0] mb-4">Illustrative Benchmarks</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {benchmarks.map((benchmark) => (
            <div
              key={benchmark.label}
              className={`rounded-xl p-4 ${
                benchmark.highlight
                  ? 'bg-[#111A2E] border border-[#00E18D]'
                  : 'bg-[#111A2E]'
              }`}
            >
              <p className="text-xs text-[#A9B4C0]">{benchmark.label}</p>
              <p className={`text-2xl font-bold mt-1 ${
                benchmark.highlight ? 'text-[#00E18D]' : 'text-[#E8EEF5]'
              }`}>
                {benchmark.value}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#A9B4C0] mt-3 italic">
          *Illustrative only. No guarantee. Subject to each offering's risk and disclosures.
        </p>
      </div>

      {/* Why HooInvest Can Outperform */}
      <div className="panel p-6">
        <p className="text-sm font-medium text-[#E8EEF5] mb-3">Why HooInvest Can Outperform</p>
        <ul className="space-y-2">
          {reasons.map((reason, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-[#A9B4C0]">
              <span className="text-[#00E18D] mt-0.5">✓</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

