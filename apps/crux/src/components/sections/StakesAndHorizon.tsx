"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ─── Scroll entrance hook ────────────────────────────────────────────────────
function useScrollEntrance(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── Parallax hook ────────────────────────────────────────────────────────────
function useParallax() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      setOffset(window.scrollY - sectionTop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { sectionRef, offset };
}

// ─── Abstract Visualizations ──────────────────────────────────────────────────

function RiskStackVisual({ inView }: { inView: boolean }) {
  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto flex items-center justify-center">
      <motion.div 
        className="absolute inset-0 bg-[var(--color-crux-green)] opacity-[0.03] rounded-full blur-3xl"
        animate={{ scale: inView ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-64 h-80 rounded-2xl border border-border bg-white shadow-[var(--shadow-premium-lg)] flex flex-col justify-between p-6"
          initial={{ opacity: 0, y: 100, rotate: 0, scale: 0.8 }}
          animate={inView ? { 
            opacity: 1 - i * 0.2, 
            y: i * -20, 
            rotate: i === 0 ? -4 : i === 1 ? 4 : -2,
            scale: 1 - i * 0.05,
            zIndex: 10 - i
          } : {}}
          transition={{ duration: 0.9, delay: 0.1 + i * 0.15, type: "spring", stiffness: 90 }}
        >
           <div className="space-y-5">
             <div className="w-10 h-10 rounded-full bg-[var(--color-crux-bg-secondary)]" />
             <div className="space-y-2">
                <div className="w-full h-2 rounded-full bg-[var(--color-crux-bg-secondary)]" />
                <div className="w-4/5 h-2 rounded-full bg-[var(--color-crux-bg-secondary)]" />
                <div className="w-2/3 h-2 rounded-full bg-[var(--color-crux-bg-secondary)]" />
             </div>
           </div>
           {i === 0 && (
             <motion.div 
               className="self-end w-12 h-12 rounded-full border border-border shadow-sm flex items-center justify-center bg-[var(--color-crux-bg-primary)]"
               initial={{ scale: 0 }}
               animate={inView ? { scale: 1 } : {}}
               transition={{ delay: 1.2, type: "spring" }}
             >
               <div className="w-4 h-4 bg-red-400 rounded-full opacity-80" />
             </motion.div>
           )}
        </motion.div>
      ))}
    </div>
  )
}



function UnlockUIVisual({ inView }: { inView: boolean }) {
  return (
    <div className="relative w-full aspect-square max-w-[450px] mx-auto flex items-center justify-center p-8">
      <motion.div
        className="relative w-full bg-white rounded-[24px] border border-border p-6 shadow-[var(--shadow-premium-lg)]"
        initial={{ opacity: 0, y: 50, rotateY: 20, rotateX: 10 }}
        animate={inView ? { opacity: 1, y: 0, rotateY: 0, rotateX: 0 } : {}}
        transition={{ duration: 1, type: "spring", stiffness: 80, damping: 20 }}
        style={{ perspective: 1000 }}
      >
        <div className="w-full h-48 bg-[var(--color-crux-bg-secondary)] rounded-[16px] mb-8 overflow-hidden relative border border-border">
          <div className="absolute bottom-0 left-[15%] w-[10%] h-[60%] bg-[var(--color-crux-border)] opacity-50 rounded-t-md" />
          <div className="absolute bottom-0 left-[35%] w-[20%] h-[80%] bg-[var(--color-crux-border)] opacity-70 rounded-t-md" />
          <div className="absolute bottom-0 right-[20%] w-[15%] h-[40%] bg-[var(--color-crux-border)] opacity-30 rounded-t-md" />
          <motion.div 
            className="absolute top-0 left-0 w-full h-[2px] bg-[var(--color-crux-green)] shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            animate={{ y: [0, 192, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-2">Verified Asset #001</div>
            <div className="text-[22px] font-bold text-foreground tracking-tight">ComfHutt Prime</div>
          </div>
          <div className="text-right">
            <div className="text-[12px] text-muted-foreground mb-1 font-medium">Fractional Entry</div>
            <div className="text-[20px] font-bold text-[var(--color-crux-green)]">₹10,000</div>
          </div>
        </div>

        <div className="space-y-4">
           <div className="flex justify-between items-center pt-4 border-t border-border">
             <span className="text-[13px] text-muted-foreground font-medium">Legal Clarity</span>
             <span className="text-[13px] font-semibold text-foreground">100% Cleared</span>
           </div>
           <div className="flex justify-between items-center pt-2">
             <span className="text-[13px] text-muted-foreground font-medium">Estimated Yield</span>
             <span className="text-[13px] font-bold text-[var(--color-crux-green-dark)]">8.4% Net</span>
           </div>
        </div>

        <motion.div
          className="absolute -right-6 -top-6 bg-white rounded-full p-4 border border-[var(--color-crux-green-mid)] shadow-[var(--shadow-premium-md)]"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ type: "spring", delay: 0.8 }}
        >
          <div className="absolute inset-0 bg-[var(--color-crux-green)] opacity-10 rounded-full animate-ping" />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-crux-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─── Entrance line styles ─────────────────────────────────────────────────────
function entranceStyle(inView: boolean, delay: number): React.CSSProperties {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
  };
}

// ─── Email validation ─────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Main component ───────────────────────────────────────────────────────────
export default function StakesAndHorizon() {
  const { sectionRef } = useParallax();

  const beat1 = useScrollEntrance(0.2);
  const beat3 = useScrollEntrance(0.2);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");
    setSubmitted(true);
  };

  return (
    <section ref={sectionRef} className="bg-[var(--color-crux-bg-primary)] overflow-hidden">
      {/* ── BEAT 1: THE STAKES ─────────────────────────────────────────────── */}
      <div className="py-24 md:py-40">
        <div className="mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div ref={beat1.ref} className="w-full md:w-1/2 order-2 md:order-1">
              <p
                className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-crux-green)] font-bold mb-6"
                style={entranceStyle(beat1.inView, 0)}
              >
                The Reality
              </p>
              <h2
                className="text-[36px] md:text-[56px] text-foreground font-extrabold leading-[1.05] tracking-tight mb-8"
                style={entranceStyle(beat1.inView, 100)}
              >
                The average Indian family spends 18 years saving for property.
              </h2>
              <p
                className="text-[18px] md:text-[20px] text-muted-foreground leading-relaxed font-medium mb-6"
                style={entranceStyle(beat1.inView, 200)}
              >
                1 in 3 end up in a legal dispute, a fraudulent developer, or a
                locality that was never what it seemed.
              </p>
              <p
                className="text-[15px] text-muted-foreground italic"
                style={entranceStyle(beat1.inView, 300)}
              >
                Not because they didn&apos;t try. Because they had no way to know.
              </p>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <RiskStackVisual inView={beat1.inView} />
            </div>
          </div>
        </div>
      </div>

      {/* ── BEAT 3: THE HORIZON ────────────────────────────────────────────── */}
      <div className="py-24 md:py-40 bg-[var(--color-crux-bg-primary)]">
        <div className="mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="w-full md:w-1/2 hidden md:block">
              <UnlockUIVisual inView={beat3.inView} />
            </div>

            <div ref={beat3.ref} className="w-full md:w-1/2">
              <p
                className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-crux-green)] font-bold mb-6"
                style={entranceStyle(beat3.inView, 0)}
              >
                You&apos;ve done the hard part
              </p>

              <div className="mb-8" style={entranceStyle(beat3.inView, 100)}>
                <h2 className="text-[36px] md:text-[52px] text-foreground font-extrabold leading-[1.05] tracking-tight">
                  Most people spend years waiting to feel ready.
                </h2>
                <h2 className="text-[36px] md:text-[52px] text-[var(--color-crux-green)] font-extrabold leading-[1.05] tracking-tight mt-2">
                  You just skipped the line.
                </h2>
              </div>

              <p
                className="text-[18px] text-muted-foreground leading-[1.6] mb-6 font-medium"
                style={entranceStyle(beat3.inView, 200)}
              >
                CRUX told you which properties are worth your attention.
                <br />
                ComfHutt Invest will let you own a piece of them — legally, directly, from ₹10,000.
              </p>

              <p
                className="text-[14px] text-muted-foreground italic mb-12"
                style={entranceStyle(beat3.inView, 300)}
              >
                No pooling. No fund manager taking a cut.
                <br />
                Your name. Your demat account. Your property.
              </p>

              <div style={entranceStyle(beat3.inView, 400)}>
                {submitted ? (
                  <div className="bg-white p-8 rounded-2xl border border-border shadow-[var(--shadow-premium-md)]">
                    <span className="text-[40px] text-[var(--color-crux-green)] block mb-4">
                      ✓
                    </span>
                    <p className="text-[20px] font-bold text-foreground mb-2">
                      You&apos;re on the list.
                    </p>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                      Founding Investors get first access, a 3% discount, and a
                      front-row seat to Property #001. We&apos;ll be in touch soon.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-crux-green)] border-2 border-white shadow-sm" />
                        <div className="w-8 h-8 rounded-full bg-[var(--color-crux-green-mid)] border-2 border-white shadow-sm" />
                        <div className="w-8 h-8 rounded-full bg-[var(--color-crux-green-dark)] border-2 border-white shadow-sm" />
                      </div>
                      <span className="text-[13px] font-medium text-muted-foreground">
                        214 people are already on the list.
                      </span>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError("");
                          }}
                          placeholder="your@email.com"
                          className="flex-1 bg-white border border-border rounded-xl px-5 py-4 text-[16px] text-foreground outline-none transition-all duration-300 focus:border-[var(--color-crux-green)] focus:shadow-[var(--shadow-premium-glow)]"
                        />
                        <button
                          type="submit"
                          className="bg-[var(--color-crux-green)] text-white font-bold rounded-xl px-8 py-4 text-[15px] shadow-[var(--shadow-premium-md)] hover:shadow-[var(--shadow-premium-lg)] hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
                        >
                          Claim your spot →
                        </button>
                      </div>
                      {emailError && (
                        <p className="text-red-500 text-[13px] font-medium mt-3 ml-1">
                          {emailError}
                        </p>
                      )}
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


