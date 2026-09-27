"use client";

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end px-4 sm:px-6">
      {/* whitespace-pre-wrap keeps the line breaks the user typed; break-words stops a
          pasted survey number or URL from widening the column past 360px. */}
      <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl bg-crux-bg-secondary px-4 py-3 text-[16px] leading-[1.65] text-crux-text-primary sm:max-w-[70%]">
        {content}
      </div>
    </div>
  );
}
