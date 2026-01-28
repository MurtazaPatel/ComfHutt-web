"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Particles } from "@/components/ui/particles";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const steps = [
  {
    title: "1. A real property",
    description:
      "A real apartment or commercial space that earns rent and has long-term value.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 7L12 2L22 7V17L12 22L2 17V7Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M2 7L12 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 22V12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M22 7L12 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M17 4.5L7 9.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "2. Divided into parts",
    description:
      "Ownership is split into fractions so more people can participate.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3V21"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 12H3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.364 5.63604L5.63604 18.364"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.364 18.364L5.63604 5.63604"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "3. You buy fractions",
    description:
      "Your investment gives you legal ownership in that property.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 8V16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 12H8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    title: "4. You earn like an owner",
    description:
      "<ul class='space-y-2 text-left mt-4'><li>• Rental income</li><li>• Property value appreciation</li><li>• Option to sell your fraction later</li></ul>",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 12L7 16L12 11L17 16L21 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 6L7 10L12 5L17 10L21 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  Accordion.AccordionItemProps
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Item
    className={`overflow-hidden mt-4 first:mt-0 border-b border-gray-200/80 ${className}`}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </Accordion.Item>
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  Accordion.AccordionTriggerProps
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      className={`group flex flex-1 cursor-pointer items-center justify-between py-4 text-lg font-medium text-gray-700 transition-all hover:text-black ${className}`}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDownIcon
        className="transform transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </Accordion.Trigger>
  </Accordion.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  Accordion.AccordionContentProps
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={`overflow-hidden text-base text-gray-600 transition-all data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown ${className}`}
    {...props}
    ref={forwardedRef}
  >
    <div
      className="pt-2 pb-4"
      dangerouslySetInnerHTML={{ __html: children as string }}
    ></div>
  </Accordion.Content>
));
AccordionContent.displayName = "AccordionContent";

export default function FractionalRealEstateExplained() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section
      ref={ref}
      className="relative py-32 bg-white text-black overflow-hidden"
    >
      <Particles
        className="absolute inset-0 -z-10"
        quantity={100}
        color="#cccccc"
      />
      <motion.div style={{ opacity, y }} className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent">
            What is Fractional Real Estate?
          </h2>
          <p className="text-xl text-gray-600">
            Owning real estate, just in smaller pieces.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12 rounded-lg border border-gray-200/80 bg-white/50 p-8 text-center text-lg italic"
        >
          <p>
            Think of it like this: Instead of buying an entire property alone,
            multiple people co-own one real property together.
          </p>
        </motion.div>

        <Accordion.Root
          type="single"
          defaultValue="item-0"
          collapsible
          className="w-full"
        >
          {steps.map((step, i) => (
            <AccordionItem value={`item-${i}`} key={i}>
              <AccordionTrigger>
                <div className="flex items-center">
                  <span className="mr-4 text-gray-500">{step.icon}</span>
                  {step.title}
                </div>
              </AccordionTrigger>
              <AccordionContent>{step.description}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion.Root>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-8 text-center"
        >
          <p className="text-xl font-medium text-emerald-700">
            If the property performs well, you benefit.
            <br />
            If it doesn’t, the risk is shared.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
