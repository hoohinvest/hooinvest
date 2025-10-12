export default function TrustBadges() {
  const badges = ['KYC/KYB', 'Escrow', 'AML', 'Data Security'];

  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
      {badges.map((badge) => (
        <div
          key={badge}
          className="panel p-4 text-center"
        >
          <p className="text-sm font-medium text-[#E8EEF5]">{badge}</p>
        </div>
      ))}
    </div>
  );
}

