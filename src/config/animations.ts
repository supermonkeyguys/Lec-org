import type { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const sectionFade = {
  initial: "hidden",
  whileInView: "visible",
  variants: fadeInUp,
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
} as const;

export const itemFade = (delay: number = 0) =>
  ({
    initial: "hidden",
    whileInView: "visible",
    variants: fadeInUp,
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.4, delay },
  } as const);
