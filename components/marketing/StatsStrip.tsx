export default function StatsStrip() {
  const stats = [
    { label: 'Typical listing-to-close', value: '6-10 days', note: 'pilot avg' },
    { label: 'Investors from', value: '15+ states', note: 'and growing' },
    { label: 'Indicated interest', value: '$2.5M+', note: 'across offerings' },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="stats-widget bg-[#111A2E]/50 border border-[#1E2A3C] rounded-xl p-4"
        >
          <p className="text-xs text-[#A9B4C0] mb-1">{stat.label}</p>
          <p className="text-2xl font-bold text-[#00E18D]">{stat.value}</p>
          <p className="text-xs text-[#A9B4C0] mt-1">{stat.note}</p>
        </div>
      ))}
    </div>
  );
}

