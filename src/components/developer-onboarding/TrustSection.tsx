"use client";

import { motion } from "framer-motion";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--comfhutt-accent)]">{children}</span>
);

export const TrustSection = () => {
  return (
    <section className="relative py-28 md:py-40 bg-background overflow-hidden">
      {/* Subtle architectural grid glow */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(0,0,0,0.03)_96%)] bg-[length:100%_48px]"
        animate={{ backgroundPositionY: ["0px", "48px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative container mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          {/* Left: Trust anchor */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-playfair tracking-tight leading-tight">
              Safer and reliable,
              <br />
              in every way
              <br />
              that <Highlight>matters</Highlight>.
            </h2>

            <div className="mt-10 space-y-4 text-sm uppercase tracking-wide text-muted-foreground">
              <p>SPV-based ownership structure</p>
              <p>Legally familiar frameworks</p>
              <p>Clear rights and responsibilities</p>
            </div>
          </motion.div>

          {/* Right: Structured explanation */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="relative"
          >
            {/* Vertical trust spine */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border/60" />

            <div className="pl-10 space-y-10">
              <div>
                <p className="text-lg md:text-xl text-foreground font-medium">
                  Structured through a dedicated SPV
                </p>
                <p className="mt-2 text-muted-foreground">
                  Each project is held within a separate <Highlight>SPV</Highlight>,
                  a standard legal vehicle used to ring-fence assets, ownership,
                  and obligations.
                </p>
              </div>

              <div>
                <p className="text-lg md:text-xl text-foreground font-medium">
                  Transparent by design
                </p>
                <p className="mt-2 text-muted-foreground">
                  The SPV structure, shareholding, and terms are visible upfront,
                  allowing legal and finance teams to review everything clearly
                  before any commitment.
                </p>
              </div>

              <div>
                <p className="text-lg md:text-xl text-foreground font-medium">
                  No operational interference
                </p>
                <p className="mt-2 text-muted-foreground">
                  The project continues exactly as planned. The SPV simply provides
                  a safer, more predictable route for <Highlight>capital</Highlight>{" "}
                  to participate without altering execution.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Closing confidence line */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="text-center mt-28"
        >
          <p className="text-xl md:text-2xl font-semibold text-foreground">
            Built for <Highlight>confidence</Highlight>, not shortcuts.
          </p>
        </motion.div>
      </div>
    </section>
  );
};