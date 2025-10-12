export default function ValuesGrid() {
  const values = [
    {
      icon: '•',
      title: 'Mission',
      description: 'Democratize access to real-world wealth creation',
      type: 'mission'
    },
    {
      icon: '•',
      title: 'Vision',
      description: 'A transparent, end-to-end investment ecosystem connecting capital, construction, and cash flow',
      type: 'vision'
    }
  ];

  const principles = [
    {
      icon: '•',
      title: 'Transparency',
      description: 'Clear terms, visible metrics, honest communication'
    },
    {
      icon: '•',
      title: 'Compliance-First',
      description: 'Built on regulatory foundations, not around them'
    },
    {
      icon: '•',
      title: 'Inclusion',
      description: 'Opening opportunities previously limited to the privileged few'
    },
    {
      icon: '•',
      title: 'Security',
      description: 'Bank-grade encryption and rigorous data protection'
    },
    {
      icon: '•',
      title: 'Accountability',
      description: 'We answer to investors, issuers, and regulators'
    },
    {
      icon: '•',
      title: 'Performance',
      description: 'Results matter—we optimize for sustainable returns'
    }
  ];

  return (
    <section className="py-14 border-t border-[#1A222C]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-sm uppercase tracking-wide text-[#A9B4C0] mb-3">Our Foundation</h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5]">
            Mission, Vision & Values
          </h3>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {values.map((item) => (
            <div
              key={item.title}
              className="bg-[#11161D] border border-[#00E18D] rounded-2xl p-8 text-center"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h4 className="text-xl font-semibold text-[#00E18D] mb-3">{item.title}</h4>
              <p className="text-[#A9B4C0] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Values/Principles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((principle) => (
            <div
              key={principle.title}
              className="bg-[#11161D] border border-[#1A222C] rounded-2xl p-6 hover:bg-[#0F141B] transition-colors"
            >
              <div className="text-4xl mb-3">{principle.icon}</div>
              <h4 className="text-lg font-semibold text-[#E8EEF5] mb-2">{principle.title}</h4>
              <p className="text-[#A9B4C0] text-sm">{principle.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

