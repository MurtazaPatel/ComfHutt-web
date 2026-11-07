import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchFactSheet, reportErrorHref, splitSheet } from "@/lib/fact-sheet";

/**
 * D59 project fact sheet. Server-rendered; the backend decides whether this page exists
 * (feature flag or founder preview token) and 404s otherwise. The sheet text is the miner's
 * checked output; its last line is the source line and is shown exactly as stored.
 */

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ entityId: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
};

function previewToken(raw: string | string[] | undefined): string | undefined {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v ? v : undefined;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { entityId } = await params;
  const preview = previewToken((await searchParams).preview);
  const sheet = await fetchFactSheet(entityId, preview);
  return {
    title: sheet?.project_name ? `${sheet.project_name} — fact sheet` : "Project fact sheet",
    // A preview link is for founder review only: keep it out of every index.
    ...(preview ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function FactSheetPage({ params, searchParams }: Props) {
  const { entityId } = await params;
  const preview = previewToken((await searchParams).preview);
  const sheet = await fetchFactSheet(entityId, preview);
  if (!sheet) notFound();

  const { paragraphs, source } = splitSheet(sheet.text);
  const title = sheet.project_name ?? `Project ${sheet.entity_id}`;
  const gradeHref = sheet.grade && sheet.property_id ? `/score/${sheet.property_id}` : null;

  return (
    <div className="min-h-dvh bg-crux-bg-primary">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex h-16 max-w-[900px] items-center px-5">
          <Link
            href="/"
            className="rounded-md text-[18px] font-bold tracking-[-0.03em] text-crux-text-primary focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            CRUX
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-5 py-8 sm:py-12">
        <article className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
          <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-crux-text-primary sm:text-[26px]">
            {title}
          </h1>
          {sheet.reg_no && <p className="mt-1 text-[13px] text-crux-text-muted">{sheet.reg_no}</p>}

          <div className="mt-5 space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="max-w-[68ch] text-[15px] leading-relaxed text-crux-text-secondary">
                {p}
              </p>
            ))}
          </div>

          {source && <p className="mt-6 text-[12px] text-crux-text-muted">{source}</p>}

          <p className="mt-4 text-[13px]">
            <a
              href={reportErrorHref(sheet)}
              className="rounded-sm font-medium text-crux-text-primary underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Report an error
            </a>
          </p>
        </article>

        {sheet.grade && (
          <aside className="mt-5 rounded-2xl bg-white p-5 ring-1 ring-black/5">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-crux-text-muted uppercase">
              CRUX Grade
            </p>
            <p className="mt-1 text-[22px] font-bold leading-none text-crux-text-primary">{sheet.grade}</p>
            {gradeHref && (
              <Link
                href={gradeHref}
                className="mt-3 inline-block rounded-sm text-[13px] font-medium text-crux-text-primary underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                See the full grade
              </Link>
            )}
          </aside>
        )}
      </main>
    </div>
  );
}
