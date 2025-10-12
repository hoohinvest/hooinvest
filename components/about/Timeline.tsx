export default function Timeline() {
  const milestones = [
    {
      date: 'Q1 2023',
      title: 'Founded',
      description: 'HooInvest founded with a mission to democratize access to real asset investing'
    },
    {
      date: 'Q3 2023',
      title: 'MVP1 Launch',
      description: 'First platform iteration connecting investors with real estate and business opportunities'
    },
    {
      date: 'Q4 2023',
      title: 'Compliance Partnerships',
      description: 'Established relationships with escrow providers, KYC/AML vendors, and legal counsel'
    },
    {
      date: 'Q1 2024',
      title: 'First $1M Funded',
      description: 'Reached $1M in total capital raised across multiple business offerings'
    },
    {
      date: 'Q2 2024',
      title: 'MVP2 Platform',
      description: 'Launched enhanced application flow, admin review system, and business onboarding'
    },
    {
      date: 'Q3 2024',
      title: 'Marketplace Expansion',
      description: 'Added contractor portal, bid management, and trade tracking capabilities'
    },
    {
      date: 'Q4 2024',
      title: 'Property Management Suite',
      description: 'Introduced tenant portal, lease management, and maintenance request system'
    }
  ];

  return (
    <section className="py-14 border-t border-[#1A222C]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-sm uppercase tracking-wide text-[#A9B4C0] mb-3">Our Journey</h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5]">
            Milestones & Growth
          </h3>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 group">
                {/* Date column */}
                <div className="flex-shrink-0 w-24 pt-1">
                  <div className="text-[#00E18D] font-semibold text-sm">{milestone.date}</div>
                </div>

                {/* Timeline dot and line */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-[#00E18D] border-4 border-[#0B0F14] ring-2 ring-[#00E18D] flex-shrink-0 mt-1"></div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-[#1A222C] group-hover:bg-[#00E18D] transition-colors"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="bg-[#11161D] border border-[#1A222C] rounded-xl p-6 group-hover:border-[#00E18D] transition-colors">
                    <h4 className="text-lg font-semibold text-[#E8EEF5] mb-2">{milestone.title}</h4>
                    <p className="text-[#A9B4C0] text-sm">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


