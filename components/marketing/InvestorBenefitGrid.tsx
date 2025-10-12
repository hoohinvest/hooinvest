export default function InvestorBenefitGrid() {
  const benefits = [
    {
      title: 'Diversification',
      description: 'Access real businesses beyond public markets',
    },
    {
      title: 'Fractional Entry',
      description: 'Invest smaller amounts across multiple opportunities',
    },
    {
      title: 'Transparency',
      description: 'Regular updates and performance dashboards',
    },
    {
      title: 'Curated Pipeline',
      description: 'Vetted opportunities with due diligence',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {benefits.map((benefit) => (
        <div
          key={benefit.title}
          className="panel p-5 text-center hover:border-[#4DD2FF] transition-all"
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

