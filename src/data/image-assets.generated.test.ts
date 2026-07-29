import { expect, it } from "vitest";
import { imageAssets } from "./image-assets.generated";

it("provides sorted responsive variants for every published content image", () => {
  expect(Object.keys(imageAssets)).toEqual([
    "about01",
    "about02",
    "about03",
    "about04",
    "about05",
    "about06",
    "recruitmentQr",
  ]);

  for (const image of Object.values(imageAssets)) {
    expect(image.src).toMatch(/^\/media\//);
    expect(image.src).toMatch(/-[a-f0-9]{8}-\d+\.webp$/);
    expect(image.width).toBeGreaterThan(0);
    expect(image.height).toBeGreaterThan(0);
    expect(image.variants.map(({ width }) => width)).toEqual(
      [...image.variants.map(({ width }) => width)].sort((a, b) => a - b),
    );
  }

  expect(imageAssets.about01.variants.map(({ width }) => width)).toEqual([
    320,
    640,
  ]);
  expect(imageAssets.recruitmentQr.variants.map(({ width }) => width)).toEqual([
    320,
    576,
  ]);
});
