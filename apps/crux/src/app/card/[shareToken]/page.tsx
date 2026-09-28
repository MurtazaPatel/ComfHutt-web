import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CircleAlert, CircleCheck, LinkIcon } from "lucide-react";
import { fetchShareCard, humanisePropertyType, type ShareCard } from "@/lib/share-card";
import { formatDateLong, formatDate } from "@/lib/format";
import { scoreColor } from "@/lib/grade";

/**
 * The public shared-verdict page.
 *
 * This route did not exist. The backend has minted share cards for a while, and
 * every one of them carries `deep_link = https://crux.comfhutt.com/card/{token}`,
 * so every link a user had ever shared resolved to a 404. Meanwhile the dashboard's
 * own share control copied `/dashboard/properties/{id}` — a page that requires the
 * recipient to sign in AND to own the property, i.e. a link that could never work
 * for the person it was sent to. The shareable asset was the whole point of the
 * feature and it had no destination.
 *
 * Rendered on the server: a recipient arrives from WhatsApp on a mid-range Android,
 * with no account, and should get the verdict in the first byte rather than after a
 * client-side auth round trip. There is deliberately no auth on this page at all —
 * `GET /crux/card/share/:token` is public on the backend by design.
 */

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ shareToken: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { shareToken } = await params;
  const result = await fetchShareCard(shareToken);
  if (result.status !== "ok") {
    return { title: "Shared verdict", robots: { index: false, follow: false } };
  }
  const { address, score_composite } = result.card.card_data;
  const score = typeof score_composite === "number" ? `${Math.round(score_composite)}/100` : null;
  return {
    title: score ? `${address} — ${score}` : address,
    description: `A CRUX verdict for ${address}, built from Gujarat's public record.`,
    // A share card is a snapshot of one property for one recipient, not a page
    // that should accumulate search equity or outlive its own expiry in an index.
    robots: { index: false, follow: false },
  };
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-crux-bg-primary">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex h-16 max-w-[900px] items-center justify-between px-5">
          <Link
            href="/"
            className="rounded-md text-[18px] font-bold tracking-[-0.03em] text-crux-text-primary focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            CRUX
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 rounded-full bg-crux-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-crux-green-mid focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
          >
            Grade a property free
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-[900px] px-5 py-8 sm:py-12">{children}</main>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

function Message({ title, body }: { title: string; body: string }) {
  return (
    <Shell>
      <Card className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-crux-bg-secondary">
          <LinkIcon className="h-5 w-5 text-crux-text-muted" aria-hidden />
        </div>
        <h1 className="mb-2 text-xl font-semibold text-crux-text-primary">{title}</h1>
        <p className="mx-auto mb-6 max-w-[42ch] text-sm text-crux-text-secondary">{body}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-crux-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-crux-green-mid focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
        >
          Grade a property yourself
          <ArrowRight size={16} aria-hidden />
        </Link>
      </Card>
    </Shell>
  );
}

/** A list of plain-string findings. The backend caps each list at five. */
function Findings({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "risk" | "positive";
}) {
  const Icon = tone === "risk" ? CircleAlert : CircleCheck;
  return (
    <Card>
      <h2 className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-crux-text-primary">
        <Icon
          size={16}
          className={tone === "risk" ? "text-amber-600" : "text-crux-green"}
          aria-hidden
        />
        {title}
      </h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-crux-text-secondary">
            <span aria-hidden className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-crux-text-muted" />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Verdict({ card, expired }: { card: ShareCard; expired: boolean }) {
  const d = card.card_data;
  const score = typeof d.score_composite === "number" ? Math.round(d.score_composite) : null;
  const confidence = typeof d.confidence_score === "number" ? Math.round(d.confidence_score * 100) : null;
  const propertyType = humanisePropertyType(d.property_type);
  const location = [d.city, d.state].filter(Boolean).join(", ");
  const risks = d.risk_flags?.filter((f) => f.trim()) ?? [];
  const positives = d.positive_signals?.filter((f) => f.trim()) ?? [];

  return (
    <Shell>
      {expired && (
        // The backend serves an expired card as a normal 200, so without this the
        // recipient would read a months-old grade as today's.
        <div
          role="status"
          className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-[13px] text-amber-900 ring-1 ring-amber-200"
        >
          <strong className="font-semibold">This shared link has expired.</strong> The grade below
          is the snapshot taken when it was shared
          {d.scored_at ? ` on ${formatDate(d.scored_at)}` : ""} and is no longer being updated.
        </div>
      )}

      <Card className="mb-5">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-crux-text-muted uppercase">
              CRUX verdict
            </p>
            <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-crux-text-primary">
              {d.address}
            </h1>
            {location && <p className="mt-1 text-[13px] text-crux-text-secondary">{location}</p>}
            {propertyType && <p className="mt-0.5 text-[13px] text-crux-text-muted">{propertyType}</p>}
            {d.scored_at && (
              // A grade with no date reads as permanently current; it is a reading of
              // the public record on one day.
              <p className="mt-3 text-[12px] text-crux-text-muted">
                Graded {formatDateLong(d.scored_at)}
                {d.crux_version ? ` · engine ${d.crux_version}` : ""}
              </p>
            )}
          </div>

          {score !== null && (
            <div className="flex flex-shrink-0 items-center gap-4 sm:flex-col sm:items-end">
              <div
                className="flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full bg-white"
                style={{ boxShadow: `inset 0 0 0 6px ${scoreColor(score)}` }}
                role="img"
                aria-label={`Composite ${score} out of 100`}
              >
                <span className="text-[34px] font-bold leading-none text-crux-text-primary">
                  {score}
                </span>
                <span className="mt-0.5 text-[11px] text-crux-text-muted">/100</span>
              </div>
              {confidence !== null && (
                <p className="text-[12px] text-crux-text-secondary sm:text-right">
                  {confidence}% confidence
                </p>
              )}
            </div>
          )}
        </div>

        {/* What a grade is, on the one surface a stranger reaches without ever
            having seen the rest of the site. A shared card is the most likely
            place for a grade to be read out of context, so the line that frames
            it as an opinion belongs here more than anywhere. */}
        <p className="mt-6 border-t border-crux-border pt-5 text-[12px] leading-relaxed text-crux-text-muted">
          A CRUX Grade is an opinion based on public records.{" "}
          <Link
            href="/disclaimer"
            className="font-medium text-crux-green-dark underline underline-offset-2 transition-colors hover:text-crux-green-deeper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            What this means
          </Link>
          .
        </p>

        {d.summary && (
          <p className="mt-5 text-[14px] leading-relaxed text-crux-text-secondary">
            {d.summary}
          </p>
        )}
      </Card>

      {(risks.length > 0 || positives.length > 0) && (
        <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Both sides, always, when either exists. A report that lists only the
              risks is not the neutral instrument this product claims to be. */}
          {positives.length > 0 && (
            <Findings title="What holds up" items={positives} tone="positive" />
          )}
          {risks.length > 0 && <Findings title="What to check" items={risks} tone="risk" />}
        </div>
      )}

      {d.data_sources_used && d.data_sources_used.length > 0 && (
        <Card className="mb-5">
          <h2 className="mb-3 text-[15px] font-semibold text-crux-text-primary">Read from</h2>
          <div className="flex flex-wrap gap-2">
            {d.data_sources_used.map((source) => (
              <span
                key={source}
                className="inline-flex items-center rounded-full bg-crux-bg-secondary px-3 py-1.5 text-[12px] font-medium text-crux-text-secondary"
              >
                {source}
              </span>
            ))}
          </div>
        </Card>
      )}

      <Card className="mb-5 bg-crux-bg-accent ring-crux-green/20">
        <h2 className="mb-1.5 text-[15px] font-semibold text-crux-text-primary">
          Check a property yourself
        </h2>
        <p className="mb-4 text-[13px] text-crux-text-secondary">
          CRUX reads Gujarat&rsquo;s public record — GujRERA filings, the appellate tribunal
          and the court record — and gives you the grade with the filing behind it.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-xl bg-crux-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-crux-green-mid focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
        >
          Get started free
          <ArrowRight size={16} aria-hidden />
        </Link>
      </Card>

      {/* Compliance text the backend attaches to every card. It ships with the card
          or the card does not ship. */}
      {d.sebi_disclaimer && (
        <p className="text-[11px] leading-relaxed text-crux-text-muted">{d.sebi_disclaimer}</p>
      )}
      {!expired && card.expires_at && (
        <p className="mt-2 text-[11px] text-crux-text-muted">
          This link works until {formatDate(card.expires_at)}.
        </p>
      )}
    </Shell>
  );
}

export default async function SharedCardPage({ params }: Params) {
  const { shareToken } = await params;
  const result = await fetchShareCard(shareToken);

  switch (result.status) {
    case "ok":
      return <Verdict card={result.card} expired={false} />;
    case "expired":
      return <Verdict card={result.card} expired />;
    case "not_found":
      return (
        <Message
          title="This link isn't valid"
          body="Shared CRUX verdicts expire, and the link may have been mistyped or withdrawn. Ask whoever sent it for a fresh one, or grade the property yourself."
        />
      );
    case "unavailable":
      return (
        <Message
          title="Couldn't load this verdict"
          body="CRUX couldn't reach its records just now. This is on our side, not the link — please try again in a moment."
        />
      );
  }
}
