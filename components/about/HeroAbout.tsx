export default function HeroAbout() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Subtle background graphic */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#00E18D] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#4DD2FF] rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#E8EEF5] mb-6">
            About HooInvest
          </h1>
          <p className="text-xl md:text-2xl text-[#A9B4C0] leading-relaxed">
            The investment broker app for real assets—built by operators, engineers, and compliance pros.
          </p>
        </div>
      </div>
    </section>
  );
}


