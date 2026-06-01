"use client";

interface AIMessageProps {
  content: string;
}

export function AIMessage({ content }: AIMessageProps) {
  return (
    <div className="flex gap-4 px-6">
      {/* Avatar */}
      <div
        className="flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "2px",
          background: "#22C55E",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[14px] font-semibold text-[#111827] mb-1"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          CRUX Lens
        </p>
        <div
          className="text-[16px] leading-[1.65] text-[#111827] whitespace-pre-wrap break-words"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
