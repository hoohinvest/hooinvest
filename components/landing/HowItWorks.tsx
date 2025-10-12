export default function HowItWorks() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#E8EEF5]">
          How It Works
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* For Businesses */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-[#00E18D] mb-6">For Businesses</h3>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#00E18D] text-black rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-[#E8EEF5] mb-1">Apply</h4>
                <p className="text-[#A9B4C0] text-sm">
                  Submit your business details, financials, and funding needs
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#00E18D] text-black rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-[#E8EEF5] mb-1">Verify</h4>
                <p className="text-[#A9B4C0] text-sm">
                  Complete KYB verification and due diligence review
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#00E18D] text-black rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-[#E8EEF5] mb-1">Launch Raise</h4>
                <p className="text-[#A9B4C0] text-sm">
                  Go live with equity, interest, or royalty offering
                </p>
              </div>
            </div>
          </div>

          {/* For Investors */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-[#4DD2FF] mb-6">For Investors</h3>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#4DD2FF] text-black rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-[#E8EEF5] mb-1">Browse</h4>
                <p className="text-[#A9B4C0] text-sm">
                  Explore vetted business and project opportunities
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#4DD2FF] text-black rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-[#E8EEF5] mb-1">Commit in Escrow</h4>
                <p className="text-[#A9B4C0] text-sm">
                  Pledge capital securely with compliant escrow protection
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#4DD2FF] text-black rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-[#E8EEF5] mb-1">Track Performance</h4>
                <p className="text-[#A9B4C0] text-sm">
                  Monitor your investments with transparent updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


