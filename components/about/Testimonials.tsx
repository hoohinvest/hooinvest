export default function Testimonials() {
  const testimonials = [
    {
      quote: "HooInvest made it incredibly easy to raise capital for our restaurant expansion. The platform is transparent, the process was fast, and the team provided excellent support throughout.",
      author: "Maria S.",
      role: "Restaurant Owner",
      location: "Austin, TX"
    },
    {
      quote: "As an investor, I love having access to real businesses and projects that I can actually understand. The due diligence is thorough and the updates keep me informed every step of the way.",
      author: "James K.",
      role: "Angel Investor",
      location: "San Francisco, CA"
    },
    {
      quote: "The compliance and security features gave us confidence to invest. KYC verification, secure escrow, and transparent reporting make this platform stand out from alternatives.",
      author: "Lisa M.",
      role: "Accredited Investor",
      location: "New York, NY"
    }
  ];

  return (
    <section className="py-14 border-t border-[#1A222C]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-sm uppercase tracking-wide text-[#A9B4C0] mb-3">Social Proof</h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5] mb-4">
            Trusted by Businesses & Investors
          </h3>
        </div>

        {/* Press Logos Strip (Placeholder) */}
        <div className="mb-16">
          <p className="text-center text-[#A9B4C0] text-sm mb-6">Featured in</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50">
            <div className="text-[#A9B4C0] text-xl font-bold">TechCrunch</div>
            <div className="text-[#A9B4C0] text-xl font-bold">Forbes</div>
            <div className="text-[#A9B4C0] text-xl font-bold">WSJ</div>
            <div className="text-[#A9B4C0] text-xl font-bold">Bloomberg</div>
            <div className="text-[#A9B4C0] text-xl font-bold">VentureBeat</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#11161D] border border-[#1A222C] rounded-2xl p-6 hover:border-[#00E18D] transition-colors"
            >
              {/* Quote icon */}
              <div className="text-[#00E18D] text-4xl mb-4">"</div>
              
              {/* Quote text */}
              <p className="text-[#A9B4C0] italic mb-6 leading-relaxed">
                {testimonial.quote}
              </p>
              
              {/* Author info */}
              <div className="border-t border-[#1A222C] pt-4">
                <p className="text-[#E8EEF5] font-semibold">{testimonial.author}</p>
                <p className="text-[#A9B4C0] text-sm">{testimonial.role}</p>
                <p className="text-[#A9B4C0] text-xs mt-1">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


