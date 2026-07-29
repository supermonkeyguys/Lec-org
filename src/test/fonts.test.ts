import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

it("uses system font stacks without shipping web font CSS", () => {
  const styleSource = readFileSync(
    resolve(process.cwd(), "src/styles/globals.css"),
    "utf8",
  );
  const appSource = readFileSync(
    resolve(process.cwd(), "src/pages/_app.tsx"),
    "utf8",
  );

  expect(appSource).toContain("fontVariables");
  expect(styleSource).toContain("var(--font-lec-hand, -apple-system)");
  expect(styleSource).toContain("var(--font-lec-mono, ui-monospace)");
  expect(styleSource).toContain('"PingFang SC"');
  expect(styleSource).toContain('"Microsoft YaHei"');
  expect(styleSource).not.toContain("fonts.googleapis.com");
});
