import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

const globalStyles = readFileSync(
  resolve(process.cwd(), "src/styles/globals.css"),
  "utf8"
);

function mediaRule(query: string) {
  const start = globalStyles.indexOf(`@media (${query})`);
  const end = globalStyles.indexOf("\n}", start);

  return globalStyles.slice(start, end + 2);
}

it("reserves the shared navigation offset at the start of every site section", () => {
  const siteSectionRule = globalStyles.match(/\.site-section\s*\{(?<rules>[^}]*)\}/)?.groups?.rules;

  expect(globalStyles).toContain("--site-nav-safe-offset:");
  expect(siteSectionRule).toContain(
    "padding-block-start: calc(var(--site-nav-safe-offset) + 1.5rem);"
  );
});

it("does not mandate snap scrolling for the base site rules", () => {
  const siteScrollRule = globalStyles.match(/\.site-scroll\s*\{(?<rules>[^}]*)\}/)?.groups?.rules;
  const siteSectionRule = globalStyles.match(/\.site-section\s*\{(?<rules>[^}]*)\}/)?.groups?.rules;

  expect(siteScrollRule).not.toContain("scroll-snap");
  expect(siteSectionRule).not.toContain("scroll-snap");
});

it("uses gentle full-screen snapping on mobile but not for reduced motion", () => {
  const mobileRule = mediaRule("max-width: 767px");
  const reducedMotionRule = mediaRule("prefers-reduced-motion: reduce");
  const mobileScrollRule = mobileRule.match(/\.site-scroll\s*\{(?<rules>[^}]*)\}/)?.groups?.rules;
  const mobileSectionRule = mobileRule.match(/\.site-section\s*\{(?<rules>[^}]*)\}/)?.groups?.rules;

  expect(mobileScrollRule).toContain("scroll-snap-type: y proximity;");
  expect(mobileScrollRule).toContain("padding-bottom:");
  expect(mobileSectionRule).toContain("min-height: 100svh;");
  expect(mobileSectionRule).toContain("scroll-snap-align: start;");
  expect(mobileSectionRule).not.toContain("margin-inline");
  expect(mobileSectionRule).not.toContain("border-radius");
  expect(reducedMotionRule).toContain("scroll-snap-type: none;");
});

it("disables native smooth scrolling and floating animation for reduced motion", () => {
  const reducedMotionRule = globalStyles.slice(
    globalStyles.indexOf("@media (prefers-reduced-motion: reduce)"),
  );

  expect(reducedMotionRule).toContain("scroll-behavior: auto");
  expect(reducedMotionRule).toContain("animation: none");
});
