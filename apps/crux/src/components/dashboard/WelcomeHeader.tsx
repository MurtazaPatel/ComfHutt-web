"use client";

interface WelcomeHeaderProps {
  userName?: string | null;
  isLoading?: boolean;
}

export function WelcomeHeader({ userName, isLoading = false }: WelcomeHeaderProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="h-[34px] w-[200px] bg-gray-100 rounded animate-pulse" />
        <div className="h-[29px] w-[320px] bg-gray-50 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <h2
        style={{
          fontFamily: "var(--font-inter, Inter, sans-serif)",
          fontSize: "28px",
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "-0.005em",
          color: "#111827",
        }}
        className="mb-1"
      >
        Welcome{userName ? `, ${userName}` : ""}
      </h2>
      <p
        style={{
          fontSize: "18px",
          fontWeight: 400,
          lineHeight: 1.6,
          color: "#6B7280",
        }}
      >
        Find intelligence on any property in India.
      </p>
    </div>
  );
}
