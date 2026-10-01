"use client";

import { motion, MotionConfig } from "framer-motion";
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
    <MotionConfig reducedMotion="user">
    <section className="crux-frame bg-crux-bg-primary py-24 md:py-36">
      <div className="crux-container">
        <motion.p
          className="t-voice mx-auto max-w-[30ch] text-balance text-center text-[28px] leading-[1.2] text-crux-ink md:text-[44px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          We publish our own scoreboard: every grade we gave, against what actually
          happened. Including the times we were wrong.
        </motion.p>

        <motion.div
          className="surface-panel mx-auto mt-16 max-w-3xl p-7 md:mt-20 md:p-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <p className="t-eyebrow text-crux-green-dark">
            Coming from ComfHutt
          </p>
          <h2 className="mt-4 text-balance text-[26px] font-bold leading-[1.1] tracking-[-0.03em] text-crux-text-primary md:text-[36px]">
            ComfHutt Invest
          </h2>
          <p className="mt-4 max-w-[58ch] text-pretty text-[16px] leading-[1.7] text-crux-text-secondary">
            CRUX tells you which projects are worth your attention. ComfHutt Invest
            will let you own a piece of them — legally, directly, from ₹10,000. One
            company per property, shares in your own demat account, no pooling.
          </p>
          <a
            href="https://comfhutt.com"
            className="btn-crux btn-crux--outline group mt-7"
          >
            Join the early list
            <ArrowRight
              size={15}
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </a>
        </motion.div>
      </div>
    </section>
    </MotionConfig>
  );
}
