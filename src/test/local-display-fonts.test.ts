import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

it("declares the original display fonts from local Latin files", () => {
  const fontConfigPath = resolve(process.cwd(), "src/styles/fonts.ts");

  expect(existsSync(fontConfigPath)).toBe(true);
  if (!existsSync(fontConfigPath)) {
    return;
  }

  const source = readFileSync(fontConfigPath, "utf8");

  expect(source).toContain('from "next/font/local"');
  expect(source).toContain('display: "optional"');
  expect(source).toContain("patrick-hand-latin-400-normal.woff2");
  expect(source).toContain("space-mono-latin-700-italic.woff2");
  expect(source).not.toContain("noto-sans-sc");
});
