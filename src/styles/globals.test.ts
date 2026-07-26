import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

const globalStyles = readFileSync(
  resolve(process.cwd(), "src/styles/globals.css"),
  "utf8"
);

it("reserves the shared navigation offset at the start of every site section", () => {
  const siteSectionRule = globalStyles.match(/\.site-section\s*\{(?<rules>[^}]*)\}/)?.groups?.rules;

  expect(globalStyles).toContain("--site-nav-safe-offset:");
  expect(siteSectionRule).toContain(
    "padding-block-start: var(--site-nav-safe-offset);"
  );
});

it("disables native smooth scrolling and floating animation for reduced motion", () => {
  const reducedMotionRule = globalStyles.slice(
    globalStyles.indexOf("@media (prefers-reduced-motion: reduce)"),
  );

  expect(reducedMotionRule).toContain("scroll-behavior: auto");
  expect(reducedMotionRule).toContain("animation: none");
});
