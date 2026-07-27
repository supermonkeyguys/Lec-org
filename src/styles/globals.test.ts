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

it("keeps sections content-sized on small and reduced-motion screens without snap rules", () => {
  const mobileRule = mediaRule("max-width: 767px");
  const reducedMotionRule = mediaRule("prefers-reduced-motion: reduce");

  for (const rule of [mobileRule, reducedMotionRule]) {
    const siteSectionRule = rule.match(/\.site-section\s*\{(?<rules>[^}]*)\}/)?.groups?.rules;

    expect(siteSectionRule).toBeDefined();
    expect(siteSectionRule).toContain("min-height: auto;");
    expect(siteSectionRule).not.toContain("scroll-snap");
  }
});

it("separates site sections into cards on small screens", () => {
  const rules = mediaRule("max-width: 767px").match(/\.site-section\s*\{(?<rules>[^}]*)\}/)?.groups?.rules;

  expect(rules).toContain("margin-inline: 0.75rem;");
  expect(rules).toContain("margin-block: 1rem;");
  expect(rules).toContain("padding-block-start: 4rem;");
  expect(rules).toContain("background: var(--color-card);");
  expect(rules).toContain("border: 1.5px solid var(--color-border);");
  expect(rules).toContain("border-radius:");
  expect(rules).toContain("box-shadow:");
});

it("disables native smooth scrolling and floating animation for reduced motion", () => {
  const reducedMotionRule = globalStyles.slice(
    globalStyles.indexOf("@media (prefers-reduced-motion: reduce)"),
  );

  expect(reducedMotionRule).toContain("scroll-behavior: auto");
  expect(reducedMotionRule).toContain("animation: none");
});
