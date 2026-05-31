export default function AuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-crux-border" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-[11px] uppercase tracking-[0.15em] text-crux-text-muted">
          or
        </span>
      </div>
    </div>
  );
}