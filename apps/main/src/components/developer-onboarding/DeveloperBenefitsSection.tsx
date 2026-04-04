"use client";

import { motion } from "framer-motion";
import { DollarSign, Zap, TrendingUp, Shield, Eye } from "lucide-react";

/**
 * Highlight = color only.
 * No layout, no motion, no inline-block tricks.
 */
const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--comfhutt-accent)] inline">
    {children}
  </span>
);

export const DeveloperBenefitsSection = () => {
  const benefits = [
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      text: (
        <>
          <Highlight>Capital</Highlight> can come in earlier, without <Highlight>waiting</Highlight> for
          full-unit buyers.
        </>
      ),
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      text: (<>
      <Highlight>Pricing</Highlight> discipline stays <Highlight>intact</Highlight>. No forced discounting.
      </>),
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      text: (
        <>
          <Highlight>Execution</Highlight> momentum improves as{" "}
          <Highlight>capital</Highlight>{" "}
          <Highlight>timing</Highlight> smooths out.
        </>
      ),
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      text: (
        <>
        <Highlight>Dependence</Highlight> on any single route reduces.
        </>
      ),
    },
    {
      icon: <Eye className="h-8 w-8 text-primary" />,
      text: (<>
      Projects gain additional <Highlight>visibility</Highlight> without repositioning.
      </>),
    },
  ];

  return (
    <section id="developer-benefits" className="py-20 md:py-32 bg-background">
  
      <div className="container mx-auto max-w-5xl px-4">
        
        {/* Heading */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold font-playfair tracking-tight text-balance leading-tight">
            Here’s how ComfHutt{" "}
            <Highlight>
              Partners
            </Highlight>{" "}
            benefit.
          </h2>
        </div>

        {/* First row – 3 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-10">
          {benefits.slice(0, 3).map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.1,
              }}
              className="text-center flex flex-col items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex justify-center items-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-muted/50 mx-auto"
              >
                {benefit.icon}
              </motion.div>

              <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground text-balance max-w-xs mx-auto">
                {benefit.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Second row – centered 2 items */}
        <div className="mt-12 sm:mt-10 flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-10">
            {benefits.slice(3).map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: (index + 3) * 0.1,
                }}
                className="text-center flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex justify-center items-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-muted/50 mx-auto"
                >
                  {benefit.icon}
                </motion.div>

                <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground text-balance max-w-xs mx-auto">
                  {benefit.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};