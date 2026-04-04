export default function Home() {
  return (
    <main
      style={{ background: "var(--background)", color: "var(--foreground)" }}
      className="min-h-screen flex flex-col items-center justify-center"
    >
      <div className="text-center space-y-4 px-6">
        <h1
          style={{ color: "oklch(0.646 0.222 41.116)" }}
          className="text-7xl font-bold tracking-tight"
        >
          CRUX
        </h1>
        <p
          style={{ color: "var(--muted-foreground)" }}
          className="text-xl font-medium tracking-wide"
        >
          Property Intelligence Engine
        </p>
        <p
          style={{ color: "var(--muted-foreground)" }}
          className="text-sm mt-8"
        >
          Coming soon.
        </p>
      </div>
    </main>
  );
}
