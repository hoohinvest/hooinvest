export default function HowItWorksMarketing() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5]">How It Works</h2>
      
      {/* For Businesses */}
      <div className="panel p-6 space-y-4">
        <p className="font-semibold text-[#E8EEF5] text-lg">For Businesses</p>
        <ul className="space-y-2 text-[#A9B4C0]">
          <li className="flex items-start gap-2">
            <span className="text-[#00E18D] mt-1">→</span>
            <span>Apply → Verify → Launch raise (equity stake, yield note, or revenue share)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00E18D] mt-1">→</span>
            <span>Faster path to capital with escrow + disclosures</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00E18D] mt-1">→</span>
            <span>Transparent updates for investors</span>
          </li>
        </ul>
      </div>

      {/* For Investors */}
      <div className="panel p-6 space-y-4">
        <p className="font-semibold text-[#E8EEF5] text-lg">For Investors</p>
        <ul className="space-y-2 text-[#A9B4C0]">
          <li className="flex items-start gap-2">
            <span className="text-[#4DD2FF] mt-1">→</span>
            <span>Browse offerings → Commit in escrow → Track performance</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#4DD2FF] mt-1">→</span>
            <span>Diversify across real businesses & projects</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#4DD2FF] mt-1">→</span>
            <span>Fractional access; data-driven transparency</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

