/**
 * A hundred marks, some of them different: a percentage you can count.
 *
 * `count` of the 100 dots take the marked style. They switch on one after
 * another when the nearest `[data-inview="true"]` ancestor appears, by a CSS
 * transition with a per-dot delay — two hundred framer-motion nodes for two
 * cards would be a lot of JavaScript for what is a staggered opacity change.
 *
 * Decorative: the figure beside it carries the number for a screen reader.
 */
interface DotMatrixProps {
  /** How many of the hundred are marked. */
  count: number;
  /** `fill` marks with a solid dot; `void` hollows the marked ones out. */
  mode: "fill" | "void";
  /** Colour classes for a marked and an unmarked dot. */
  markedClass: string;
  restClass: string;
}

export default function DotMatrix({ count, mode, markedClass, restClass }: DotMatrixProps) {
  const n = Math.max(0, Math.min(100, Math.round(count)));
  return (
    <div
      aria-hidden
      className="crux-dots grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[5px] sm:gap-1.5"
    >
      {Array.from({ length: 100 }, (_, i) => {
        const marked = i < n;
        return (
          <span
            key={i}
            data-marked={marked || undefined}
            data-mode={mode}
            className={`crux-dot aspect-square rounded-full ${marked ? markedClass : restClass}`}
            style={marked ? { transitionDelay: `${180 + i * 14}ms` } : undefined}
          />
        );
      })}
    </div>
  );
}
