import FlipCard from './FlipCard';

export default function HomeTrustGrid() {
  const trustItems = [
    {
      title: 'KYC/KYB',
      blurb: 'Know Your Customer and Business verification ensures all participants are verified and legitimate.',
    },
    {
      title: 'Escrow',
      blurb: 'Third-party escrow services hold funds safely until all conditions are met, protecting both parties.',
    },
    {
      title: 'AML',
      blurb: 'Anti-Money Laundering protocols monitor and prevent illicit financial activity on the platform.',
    },
    {
      title: 'Data Security',
      blurb: 'Bank-grade encryption at rest and in transit protects your sensitive information.',
    },
  ];

  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
      {trustItems.map((item) => (
        <FlipCard
          key={item.title}
          title={item.title}
          blurb={item.blurb}
        />
      ))}
    </div>
  );
}

