const sources = [
  "MCA21",
  "eCourts",
  "CPCB AQI",
  "NHB RESIDEX",
  "TRAI",
  "NASA VIIRS",
  "CPWD",
  "State IGR",
  "RBI",
  "RERA",
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="w-full bg-white flex flex-col"
      style={{ minHeight: "100svh" }}
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3.5">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 no-underline">
            <span
              className="font-bold text-[#0A0A1A] tracking-tight"
              style={{ fontSize: 20 }}
            >
              CRUX
            </span>
            <span className="flex items-center gap-1.5 self-end mb-0.5">
              <span className="text-[10px] text-gray-400">by</span>
              <img
                src="/comfhutt-logo.svg"
                alt="ComfHutt"
                style={{ height: 13, width: "auto", opacity: 0.5 }}
              />
            </span>
          </a>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-8">
            {["How It Works", "Features", "Pricing"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-[13px] text-gray-500 hover:text-[#0A0A1A] transition-colors duration-200 font-medium no-underline"
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#"
            className="text-[13px] font-semibold text-[#22C55E] hover:text-[#1ea34d] transition-colors duration-200 no-underline"
          >
            Get Started →
          </a>
        </div>
      </nav>

      {/* Hero content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-12">
        {/* Pill badge */}
        <div className="anim" style={{ animationDelay: "0.05s" }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[13px] text-gray-600 font-medium tracking-tight">
              India&apos;s First Property Intelligence Engine
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="anim mt-8 text-center font-extrabold text-[#0A0A1A]"
          style={{
            fontSize: "clamp(44px, 8vw, 88px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            animationDelay: "0.15s",
          }}
        >
          Every property has a{" "}
          <span className="text-[#22C55E]">score.</span>
          <br />
          Most buyers never check it.
        </h1>

        {/* Subtitle */}
        <p
          className="anim mt-6 text-center text-gray-500 max-w-[540px] mx-auto leading-relaxed"
          style={{
            fontSize: "clamp(16px, 1.6vw, 19px)",
            animationDelay: "0.25s",
          }}
        >
          Type any address. We check for court cases, builder fraud,
          encumbrances, flood risk, and 17 more things your{" "}
          <span className="text-gray-700 font-medium">
            broker never told you about
          </span>
          .
        </p>

        {/* Chat input */}
        <div
          className="anim mt-10 w-full max-w-[580px] mx-auto px-4"
          style={{ animationDelay: "0.35s" }}
        >
          <div className="relative flex items-center w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] focus-within:border-[#22C55E]/50 focus-within:shadow-[0_0_0_3px_rgba(34,197,94,0.08),0_4px_16px_rgba(0,0,0,0.06)]">
            {/* Search icon */}
            <svg
              className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>

            {/* Input */}
            <input
              type="text"
              placeholder="Enter any address in India..."
              className="flex-1 bg-transparent text-[15px] text-[#0A0A1A] placeholder:text-gray-300 outline-none"
              style={{ caretColor: "#22C55E" }}
            />

            {/* Submit button */}
            <button
              className="ml-3 flex-shrink-0 w-9 h-9 rounded-xl bg-[#22C55E] flex items-center justify-center transition-all duration-200 hover:bg-[#1ea34d] hover:scale-105 active:scale-95"
              aria-label="Search"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Trust nudge */}
        <p
          className="anim mt-4 text-[13px] text-gray-400 text-center tracking-wide"
          style={{ animationDelay: "0.45s" }}
        >
          Free
          <span className="mx-1.5 text-[#22C55E]">·</span>
          No signup required
          <span className="mx-1.5 text-[#22C55E]">·</span>
          Score any property in India
        </p>

        {/* Data source strip */}
        <div
          className="anim mt-8 flex items-center justify-center gap-x-3 gap-y-2 flex-wrap px-4 max-w-2xl mx-auto"
          style={{ animationDelay: "0.55s" }}
        >
          <span className="text-[11px] text-gray-300 uppercase tracking-[0.15em] font-medium whitespace-nowrap">
            Verified from
          </span>
          {sources.map((src) => (
            <span
              key={src}
              className="text-[11px] text-gray-400 font-medium px-2.5 py-1 rounded-md border border-gray-100 hover:text-gray-600 hover:border-gray-200 transition-colors duration-200 whitespace-nowrap"
            >
              {src}
            </span>
          ))}
        </div>
      </div>

      {/* Product mockup */}
      <div
        className="anim w-full max-w-5xl mx-auto px-6 pb-0"
        style={{ animationDelay: "0.65s" }}
      >
        <div
          className="relative rounded-t-2xl border border-b-0 border-gray-200 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden"
          style={{
            transform: "perspective(2000px) rotateX(4deg)",
            transformOrigin: "center top",
          }}
        >
          {/* Dashboard mockup */}
          <div className="w-full bg-[#FAFAFA]" style={{ aspectRatio: "16/9" }}>
            {/* Browser bar */}
            <div className="w-full h-10 bg-[#0A0A1A] flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 bg-white/10 rounded text-[10px] text-white/50 font-mono">
                  crux.comfhutt.com
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-5 grid grid-cols-4 gap-4">
              {/* Sidebar */}
              <div className="col-span-1 space-y-3 pt-1">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-2 w-16 bg-gray-100 rounded" />
                <div className="h-2 w-24 bg-gray-100 rounded" />
                <div className="h-2 w-14 bg-gray-100 rounded" />
                <div className="h-2 w-20 bg-gray-100 rounded" />
                <div className="h-2 w-18 bg-gray-100 rounded mt-4" />
                <div className="h-2 w-12 bg-gray-100 rounded" />
              </div>

              {/* Main content */}
              <div className="col-span-3 space-y-4">
                {/* KPI cards */}
                <div className="flex gap-3">
                  <div className="flex-1 p-4 rounded-xl border border-gray-100 bg-white">
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">CRUX Score</div>
                    <div className="text-2xl font-bold text-[#22C55E] mt-1">87</div>
                    <div className="text-[10px] text-gray-400 mt-1">High confidence</div>
                  </div>
                  <div className="flex-1 p-4 rounded-xl border border-gray-100 bg-white">
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Fair Value</div>
                    <div className="text-2xl font-bold text-[#0A0A1A] mt-1">₹82L</div>
                    <div className="text-[10px] text-[#22C55E] mt-1">+12% vs listed</div>
                  </div>
                  <div className="flex-1 p-4 rounded-xl border border-gray-100 bg-white">
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Gross Yield</div>
                    <div className="text-2xl font-bold text-[#0A0A1A] mt-1">4.2%</div>
                    <div className="text-[10px] text-gray-400 mt-1">Above market avg</div>
                  </div>
                </div>

                {/* Chart placeholder */}
                <div className="h-28 rounded-xl border border-gray-100 bg-white flex items-end px-4 pb-3 gap-1.5">
                  {[40, 55, 45, 70, 60, 80, 65, 87].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h}%`,
                        background: i === 7 ? "#22C55E" : "#E5E7EB",
                      }}
                    />
                  ))}
                </div>

                {/* Data rows */}
                <div className="space-y-2">
                  {[
                    { label: "Legal Status", value: "Clear", ok: true },
                    { label: "Flood Risk", value: "Low", ok: true },
                    { label: "Builder RERA", value: "Registered", ok: true },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-gray-100 bg-white">
                      <span className="text-[12px] text-gray-500">{row.label}</span>
                      <span className="text-[12px] font-medium" style={{ color: row.ok ? "#22C55E" : "#EF4444" }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom fade-out */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent 0%, #FFFFFF 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
