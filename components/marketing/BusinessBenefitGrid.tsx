export default function BusinessBenefitGrid() {
  const benefits = [
    {
      title: 'Speed to Capital',
      description: 'Streamlined application and review process gets you funded faster',
    },
    {
      title: 'Flexible Structures',
      description: 'Select ownership stakes, fixed-yield notes, or revenue-share structures',
    },
    {
      title: 'Investor Reach',
      description: 'Access curated network of qualified investors',
    },
    {
      title: 'Transparent Updates',
      description: 'Dashboard tools for investor communication and reporting',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {benefits.map((benefit) => (
        <div
          key={benefit.title}
          className="panel p-5 text-center hover:border-[#00E18D] transition-all"
        >
          <h4 className="text-sm font-semibold text-[#E8EEF5] mb-2">
            {benefit.title}
          </h4>
          <p className="text-xs text-[#A9B4C0]">
            {benefit.description}
          </p>
        </div>
      ))}
    </div>
  );
}

