"use client";

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end px-6">
      <div
        className="text-[16px] leading-[1.65] text-[#0d0d0d] max-w-[70%]"
        style={{
          fontFamily: "var(--font-inter, Inter, sans-serif)",
          background: "#f5f5f5",
          borderRadius: "16px",
          padding: "12px 16px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {content}
      </div>
    </div>
  );
}
