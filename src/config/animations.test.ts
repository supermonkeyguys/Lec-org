import { describe, expect, it } from "vitest";
import { cardReveal, itemFade, sectionFade } from "./animations";

describe("reduced Framer Motion presets", () => {
  it("renders section and item animations in their final state with zero duration", () => {
    expect(sectionFade(true)).toMatchObject({
      initial: false,
      transition: { duration: 0 },
    });
    expect(itemFade(0.3, true)).toMatchObject({
      initial: false,
      transition: { duration: 0, delay: 0 },
    });
  });
});

it("reveals cards from below with a reduced-motion fallback", () => {
  expect(cardReveal(0.12)).toMatchObject({
    initial: "hidden",
    animate: "visible",
    variants: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
    transition: { duration: 0.35, delay: 0.12 },
  });
  expect(cardReveal(0.12, true)).toMatchObject({
    transition: { duration: 0, delay: 0 },
  });
});
