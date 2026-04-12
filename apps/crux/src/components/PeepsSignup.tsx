export default function PeepsSignup() {
  return (
    <div
      data-testid="peeps-zone-c"
      className="flex flex-row gap-2 sm:gap-6 items-end justify-center w-full max-w-xs sm:max-w-lg mx-auto"
    >
      {/* Left peep (primary) — with phone */}
      <div className="relative shrink-0" style={{ animation: "peep-wave 3s ease-in-out infinite" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/peeps/standing-4.svg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          draggable="false"
          width="auto"
          height="auto"
          className="w-20 sm:w-36 h-auto"
          style={{ filter: "invert(8%) sepia(5%) saturate(200%) hue-rotate(180deg) brightness(96%)" }}
        />
        {/* Phone near hand */}
        <div className="absolute bottom-[38%] right-[-8px] sm:right-[-10px]">
          <svg width="16" height="22" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="sm:w-5 sm:h-7">
            <rect width="20" height="28" rx="3" fill="#22C55E"/>
            <rect x="4" y="4" width="12" height="16" rx="1" fill="#0F0F0F"/>
            <circle cx="10" cy="23" r="2" fill="#0F0F0F"/>
          </svg>
        </div>
      </div>

      {/* Building (static, center) — scales via CSS, no fixed attrs */}
      <div className="shrink-0 self-end pb-1">
        <svg
          viewBox="0 0 100 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 sm:w-28 h-auto"
          aria-hidden="true"
        >
          {/* Roof */}
          <polygon points="50,0 100,30 0,30" fill="#1a1a1a" stroke="#22C55E" strokeWidth="1.5"/>
          {/* Body */}
          <rect x="10" y="30" width="80" height="110" fill="#1a1a1a" stroke="#22C55E" strokeWidth="1.5"/>
          {/* Windows row 1 */}
          <rect x="20" y="45" width="16" height="16" rx="2" fill="#22C55E" fillOpacity="0.4"/>
          <rect x="42" y="45" width="16" height="16" rx="2" fill="#22C55E" fillOpacity="0.4"/>
          <rect x="64" y="45" width="16" height="16" rx="2" fill="#22C55E" fillOpacity="0.4"/>
          {/* Windows row 2 */}
          <rect x="20" y="72" width="16" height="16" rx="2" fill="#22C55E" fillOpacity="0.4"/>
          <rect x="42" y="72" width="16" height="16" rx="2" fill="#22C55E" fillOpacity="0.4"/>
          <rect x="64" y="72" width="16" height="16" rx="2" fill="#22C55E" fillOpacity="0.4"/>
          {/* Door */}
          <rect x="37" y="100" width="26" height="40" rx="2" fill="#22C55E" fillOpacity="0.6"/>
        </svg>
      </div>

      {/* Right peep (secondary) — desktop only */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/peeps/standing-2.svg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        draggable="false"
        width="auto"
        height="auto"
        className="hidden sm:block w-28 sm:w-32 shrink-0 h-auto self-end"
        style={{ animation: "peep-float 3.5s ease-in-out infinite 0.8s", filter: "invert(8%) sepia(5%) saturate(200%) hue-rotate(180deg) brightness(96%)" }}
      />
    </div>
  );
}
