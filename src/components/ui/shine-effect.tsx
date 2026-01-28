import { motion } from "framer-motion";
import clsx from "clsx";

export const ShineWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={clsx(
        "relative inline-block align-baseline",
        className
      )}
    >
      {/* Actual text */}
      <span className="relative z-10">
        {children}
      </span>

      {/* Shine overlay */}
      <motion.span
        aria-hidden
        className="
          pointer-events-none
          absolute inset-0
          bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent)]
          bg-[length:200%_100%]
          mix-blend-overlay
        "
        initial={{ backgroundPositionX: "200%" }}
        animate={{ backgroundPositionX: "-200%" }}
        transition={{
          duration: 1.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 2.5,
        }}
      />
    </span>
  );
};