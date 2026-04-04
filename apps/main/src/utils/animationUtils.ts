// Animation Utilities & Constants
// Easing curves matching design spec

export const EASING = {
  slideIn: [0.22, 0.9, 0.28, 1] as const, // cubic-bezier(.22,.9,.28,1)
  hover: [0, 0, 0.2, 1] as const, // ease-out
  smooth: [0.25, 0.1, 0.25, 1] as const, // ease
};

export const VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASING.slideIn } },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

export const TRANSITIONS = {
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
};