import { describe, expect, it } from "vitest";
import { itemFade, sectionFade } from "./animations";

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
