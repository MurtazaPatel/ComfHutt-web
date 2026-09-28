"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * The scoreboard promise, then a short Invest teaser. Together they replace the
 * three-principle trust section that used to sit here.
 *
 * **The scoreboard sentence renders without a link**, because `/scoreboard` does
 * not exist. The brief is explicit about this: link it only when the route exists.
 * A promise to publish our own misses is worth making before the page that carries
 * them is built; a link to a 404 is not. When that route ships, wrap it.
 *
 * The Invest teaser lost "214 people are already on the list" and "You just skipped
 * the line" — the first was an invented count, the second manufactured urgency for a
 * product that is not open. What is left describes the structure honestly: one
 * company per property, shares in the buyer's own demat account, no pooling. Note
 * "will let you" — Invest is not live, and the tense carries that.
 */

const VP = { once: true, margin: "-100px" } as const;

export default function InvestTeaser() {
  return (
    <section className="bg-white px-4 py-20 md:py-28">
      <div className="mx-auto max-w-[1100px]">
        <motion.p
          className="mx-auto max-w-[60ch] text-pretty text-center text-[17px] font-medium leading-[1.7] text-crux-text-primary md:text-[19px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          We publish our own scoreboard: every grade we gave, against what actually
          happened. Including the times we were wrong.
        </motion.p>

        <motion.div
          className="mx-auto mt-14 max-w-3xl rounded-2xl border border-crux-border bg-crux-bg-primary p-7 md:p-9"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-crux-text-muted">
            Coming from ComfHutt
          </p>
          <h2 className="mt-3 text-balance text-[22px] font-bold leading-tight tracking-[-0.01em] text-crux-text-primary md:text-[28px]">
            ComfHutt Invest
          </h2>
          <p className="mt-3 text-pretty text-[15px] leading-[1.7] text-crux-text-secondary">
            CRUX tells you which projects are worth your attention. ComfHutt Invest
            will let you own a piece of them — legally, directly, from ₹10,000. One
            company per property, shares in your own demat account, no pooling.
          </p>
          <a
            href="https://comfhutt.com"
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-crux-border bg-white px-5 py-3 text-[14px] font-semibold text-crux-text-primary no-underline transition-colors hover:border-crux-green hover:text-crux-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Join the early list
            <ArrowRight size={15} aria-hidden />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
