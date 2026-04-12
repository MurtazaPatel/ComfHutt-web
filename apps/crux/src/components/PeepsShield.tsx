export default function PeepsShield() {
  return (
    <div
      data-testid="peeps-zone-a"
      className="relative flex flex-row items-end justify-center gap-2 sm:gap-8 max-w-75 sm:max-w-100 mx-auto"
    >
      {/* Green checkmark — floats above group center, visible on all screens */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none">
        <svg
          width="28"
          height="28"
          viewBox="0 0 36 36"
          fill="none"
          aria-hidden="true"
          className="sm:w-9 sm:h-9"
        >
          <circle cx="18" cy="18" r="17" stroke="#22C55E" strokeWidth="2" fill="rgba(34,197,94,0.15)"/>
          <path d="M10 18L15.5 23.5L26 13" stroke="#22C55E" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Left peep */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/peeps/standing-9.svg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        draggable="false"
        width="auto"
        height="auto"
        className="w-25 sm:w-35 h-auto self-end"
        style={{ animation: "peep-float 3s ease-in-out infinite", filter: "invert(8%) sepia(5%) saturate(200%) hue-rotate(180deg) brightness(96%)" }}
      />

      {/* Right peep */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/peeps/standing-20.svg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        draggable="false"
        width="auto"
        height="auto"
        className="w-25 sm:w-35 h-auto self-end"
        style={{ animation: "peep-float 3s ease-in-out infinite 0.5s", filter: "invert(8%) sepia(5%) saturate(200%) hue-rotate(180deg) brightness(96%)" }}
      />
    </div>
  );
}
