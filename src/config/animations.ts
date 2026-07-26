import type { Variants } from "framer-motion";
import { useEffect, useState } from "react";

export function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}

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

export const sectionFade = (reducedMotion = false) =>
  ({
    initial: false,
    whileInView: "visible",
    variants: fadeInUp,
    viewport: { once: true, margin: "-100px" },
    transition: { duration: reducedMotion ? 0 : 0.6 },
  } as const);

export const itemFade = (delay: number = 0, reducedMotion = false) =>
  ({
    initial: false,
    whileInView: "visible",
    variants: fadeInUp,
    viewport: { once: true, margin: "-50px" },
    transition: {
      duration: reducedMotion ? 0 : 0.4,
      delay: reducedMotion ? 0 : delay,
    },
  } as const);
