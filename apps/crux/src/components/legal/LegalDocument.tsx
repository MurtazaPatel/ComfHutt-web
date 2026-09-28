import Link from "next/link";
import type { Inline, LegalBlock, LegalDoc, Rich } from "@/content/legal/types";

/**
 * The renderer for every CRUX legal page.
 *
 * One component draws all four documents, so `/terms` cannot drift away from
 * `/privacy` in type scale, measure or link behaviour, and a correction to the
 * text is a diff in `src/content/legal/*.ts` and nowhere else.
 *
 * Measure: the column is capped at 36rem. At the 16–17px body size that is
 * roughly 67–71 characters a line, which is the readable range for continuous
 * prose. Legal text is read end to end, not scanned, so the cap matters more here
 * than anywhere else on the site.
 */

const FOCUS_RING =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2";

const PROSE_LINK = `font-medium text-crux-green-dark underline decoration-crux-green/40 underline-offset-[3px] transition-colors duration-200 motion-reduce:transition-none hover:text-crux-green-mid hover:decoration-crux-green ${FOCUS_RING}`;

/** Every legal surface, for the cross-links at the foot of each page. */
const LEGAL_PAGES: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/dispute", label: "Dispute a grade" },
];

function InlineNode({ node }: { node: Inline }) {
  switch (node.kind) {
    case "strong":
      return <strong className="font-semibold text-crux-text-primary">{node.text}</strong>;
    case "em":
      return <em>{node.text}</em>;
    case "link":
      // Route links go through next/link; mailto and external links stay plain
      // anchors, which is what the rest of the app does.
      return node.href.startsWith("/") ? (
        <Link href={node.href} className={PROSE_LINK}>
          {node.text}
        </Link>
      ) : (
        <a href={node.href} className={PROSE_LINK}>
          {node.text}
        </a>
      );
    case "text":
      return <>{node.text}</>;
  }
}

function InlineRun({ content }: { content: Rich }) {
  return (
    <>
      {content.map((node, index) => (
        // The content is a static module, so index keys are stable by
        // construction — these runs are never reordered or filtered.
        <InlineNode key={index} node={node} />
      ))}
    </>
  );
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case "paragraph":
      return (
        <p className="text-[16px] leading-[1.75] text-crux-text-secondary md:text-[17px]">
          <InlineRun content={block.content} />
        </p>
      );

    case "callout":
      return (
        <p className="rounded-2xl border border-crux-green/25 bg-crux-bg-accent p-5 text-[16px] leading-[1.7] text-crux-text-primary md:text-[17px]">
          <InlineRun content={block.content} />
        </p>
      );

    case "list": {
      const className =
        "flex flex-col gap-3 pl-5 text-[16px] leading-[1.75] text-crux-text-secondary marker:text-crux-green md:text-[17px]";
      const items = block.items.map((item, index) => (
        <li key={index} className="pl-1">
          <InlineRun content={item} />
        </li>
      ));
      return block.ordered ? (
        <ol className={`list-decimal ${className}`}>{items}</ol>
      ) : (
        <ul className={`list-disc ${className}`}>{items}</ul>
      );
    }

    case "table":
      return (
        // Below ~600px the three columns cannot both fit and stay legible, so the
        // table scrolls inside its own box rather than forcing the page sideways.
        // tabIndex makes that scroller reachable from the keyboard.
        <div
          className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
          tabIndex={0}
          role="region"
          aria-label={block.caption}
        >
          <table className="w-full min-w-[34rem] border-collapse text-left text-[14px] leading-[1.6] md:text-[15px]">
            <caption className="sr-only">{block.caption}</caption>
            <thead>
              <tr className="border-b border-crux-border">
                {block.columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="py-3 pr-4 align-top text-[11px] font-semibold uppercase tracking-[0.12em] text-crux-text-muted last:pr-0"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-crux-border last:border-b-0">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={
                        cellIndex === 0
                          ? "py-3.5 pr-4 align-top font-medium text-crux-text-primary"
                          : "py-3.5 pr-4 align-top text-crux-text-secondary last:pr-0"
                      }
                    >
                      <InlineRun content={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

function Blocks({ blocks }: { blocks: readonly LegalBlock[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}

export default function LegalDocument({
  doc,
  path,
  children,
}: {
  doc: LegalDoc;
  /** This page's route, so it is left out of the cross-links at the foot. */
  path: string;
  /** Rendered after the policy text — the dispute form, on `/dispute`. */
  children?: React.ReactNode;
}) {
  const otherPages = LEGAL_PAGES.filter((page) => page.href !== path);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-crux-border bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[36rem] items-center justify-between gap-4 px-4 py-2 sm:px-6">
          <Link
            href="/"
            className={`inline-flex min-h-11 items-center text-[18px] font-bold tracking-[-0.03em] text-crux-text-primary no-underline transition-colors duration-200 motion-reduce:transition-none hover:text-crux-green-mid ${FOCUS_RING}`}
          >
            CRUX
          </Link>
          <Link
            href="/score"
            className={`inline-flex min-h-11 items-center rounded-full bg-crux-green px-4 text-[13px] font-semibold text-white no-underline shadow-[var(--shadow-premium-sm)] transition-colors duration-200 motion-reduce:transition-none hover:bg-crux-green-mid ${FOCUS_RING}`}
          >
            Grade a project
          </Link>
        </div>
      </header>

      <main className="flex-1 bg-crux-bg-primary">
        <div className="mx-auto w-full max-w-[36rem] px-4 py-14 sm:px-6 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-crux-green">
            Legal
          </p>
          <h1 className="mt-3 text-pretty text-[30px] font-bold leading-tight tracking-[-0.02em] text-crux-text-primary md:text-[40px]">
            {doc.title}
          </h1>
          <p className="mt-3 text-[13px] text-crux-text-muted">
            Last updated: {doc.lastUpdated}
          </p>

          <nav aria-label="On this page" className="mt-10 rounded-2xl border border-crux-border bg-white p-5 shadow-[var(--shadow-premium-sm)]">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-crux-text-muted">
              On this page
            </h2>
            <ul className="mt-1 flex list-none flex-col p-0">
              {doc.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`flex min-h-11 items-center text-[14px] text-crux-text-secondary no-underline transition-colors duration-200 motion-reduce:transition-none hover:text-crux-green-mid hover:underline ${FOCUS_RING}`}
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article className="mt-12 flex flex-col gap-12">
            {doc.intro ? <Blocks blocks={doc.intro} /> : null}

            {doc.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="scroll-mt-24"
              >
                <h2
                  id={`${section.id}-heading`}
                  className="text-pretty text-[20px] font-bold leading-snug tracking-[-0.01em] text-crux-text-primary md:text-[22px]"
                >
                  {section.heading}
                </h2>
                <div className="mt-4">
                  <Blocks blocks={section.blocks} />
                </div>
              </section>
            ))}
          </article>

          {children}

          <nav
            aria-label="Other legal pages"
            className="mt-16 border-t border-crux-border pt-6"
          >
            <ul className="flex list-none flex-wrap gap-x-6 p-0">
              {otherPages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className={`flex min-h-11 items-center text-[14px] text-crux-text-secondary no-underline transition-colors duration-200 motion-reduce:transition-none hover:text-crux-green-mid hover:underline ${FOCUS_RING}`}
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
    </>
  );
}
