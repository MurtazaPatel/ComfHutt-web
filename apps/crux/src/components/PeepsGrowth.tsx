export default function PeepsGrowth() {
  return (
    // pt-14 gives the rising houses headroom to animate upward without clipping.
    // overflow-hidden removed — it was silently killing the coin-rise animation.
    <div
      data-testid="peeps-zone-b"
      className="relative flex flex-col items-center justify-center w-full max-w-70 sm:max-w-90 mx-auto pt-14"
    >
      {/* Floating house icons — positioned inside the pt-14 headroom */}
      <div className="absolute top-0 left-0 w-full" style={{ height: 56 }}>
        {/* House 1 */}
        <div
          className="absolute"
          style={{ left: "15%", top: "30%", animation: "coin-rise 2s ease-in-out infinite 0s" }}
        >
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="sm:w-8 sm:h-8">
            <path d="M16 4L28 14V28H20V20H12V28H4V14L16 4Z" fill="#22C55E" stroke="#0F0F0F" strokeWidth="1.5"/>
          </svg>
        </div>
        {/* House 2 */}
        <div
          className="absolute"
          style={{ left: "48%", top: "10%", animation: "coin-rise 2s ease-in-out infinite 0.6s" }}
        >
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="sm:w-8 sm:h-8">
            <path d="M16 4L28 14V28H20V20H12V28H4V14L16 4Z" fill="#22C55E" stroke="#0F0F0F" strokeWidth="1.5"/>
          </svg>
        </div>
        {/* House 3 — desktop only */}
        <div
          className="absolute hidden sm:block"
          style={{ left: "72%", top: "20%", animation: "coin-rise 2s ease-in-out infinite 1.2s" }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M16 4L28 14V28H20V20H12V28H4V14L16 4Z" fill="#22C55E" stroke="#0F0F0F" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>

      {/* Sitting peep */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/peeps/sitting-11.svg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        draggable="false"
        width="auto"
        height="auto"
        className="w-28 sm:w-44"
        style={{ animation: "peep-float 4s ease-in-out infinite", filter: "invert(8%) sepia(5%) saturate(200%) hue-rotate(180deg) brightness(96%)" }}
      />
    </div>
  );
}
