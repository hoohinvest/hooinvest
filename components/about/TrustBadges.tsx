export default function TrustBadges() {
  const badges = [
    {
      icon: '✓',
      title: 'KYC/KYB Verification',
      description: 'Know Your Customer and Business checks ensure all participants are verified and legitimate'
    },
    {
      icon: '✓',
      title: 'AML Compliance',
      description: 'Anti-Money Laundering protocols monitor and prevent illicit financial activity'
    },
    {
      icon: '✓',
      title: 'Secure Escrow',
      description: 'Third-party escrow services hold funds safely until all conditions are met'
    },
    {
      icon: '✓',
      title: 'Data Security',
      description: 'Bank-grade encryption at rest and in transit protects your sensitive information'
    },
    {
      icon: '✓',
      title: 'Privacy First',
      description: 'We never sell your data. Minimal collection, maximum protection, full transparency'
    },
    {
      icon: '✓',
      title: 'Regulatory Compliance',
      description: 'Built to comply with SEC regulations, state securities laws, and industry best practices'
    }
  ];

  return (
    <section className="py-14 border-t border-[#1A222C]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-sm uppercase tracking-wide text-[#A9B4C0] mb-3">Security & Compliance</h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5] mb-4">
            Built on Trust
          </h3>
          <p className="text-[#A9B4C0] max-w-2xl mx-auto">
            Your security and compliance are foundational to everything we do. We meet or exceed industry standards.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="bg-[#11161D] border border-[#1A222C] rounded-2xl p-6 hover:border-[#00E18D] transition-colors"
            >
              <div className="text-4xl mb-4">{badge.icon}</div>
              <h4 className="text-lg font-semibold text-[#E8EEF5] mb-2">{badge.title}</h4>
              <p className="text-[#A9B4C0] text-sm leading-relaxed">{badge.description}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-[#1A222C] border border-[#1A222C] rounded-xl p-6 text-center">
          <p className="text-[#A9B4C0] text-sm">
            <strong className="text-[#E8EEF5]">Important:</strong> HooInvest facilitates connections between 
            businesses and investors. Investments carry risk. This is not an offer of securities. 
            Please review all disclosures and consult with financial and legal advisors before investing.
          </p>
        </div>
      </div>
    </section>
  );
}

