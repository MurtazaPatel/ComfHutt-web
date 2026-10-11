export default function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-[var(--color-crux-border)]" />
      <span className="t-eyebrow text-[var(--color-crux-text-muted)]">
        or
      </span>
      <div className="h-px flex-1 bg-[var(--color-crux-border)]" />
    </div>
  );
}
