"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
          className="text-[15px] leading-[1.65] text-[#111827] break-words"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
              li: ({ node, ...props }) => <li className="pl-1" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
              em: ({ node, ...props }) => <em className="italic" {...props} />,
              h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 mt-4 text-gray-900" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-3 mt-4 text-gray-900" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-2 mt-3 text-gray-900" {...props} />,
              a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match && !className;
                return isInline ? (
                  <code className="bg-gray-100 text-gray-800 rounded px-1.5 py-0.5 text-sm font-mono" {...props}>
                    {children}
                  </code>
                ) : (
                  <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 mb-4 overflow-x-auto text-sm font-mono">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                );
              },
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => <th className="px-4 py-2 bg-gray-50 text-left text-sm font-semibold text-gray-900" {...props} />,
              td: ({ node, ...props }) => <td className="px-4 py-2 text-sm border-t border-gray-200" {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 py-1 italic text-gray-700 mb-4 bg-gray-50 rounded-r-lg" {...props} />
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
