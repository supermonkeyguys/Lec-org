import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

it("uses system font stacks without shipping web font CSS", () => {
  const source = readFileSync(
    resolve(process.cwd(), "src/styles/globals.css"),
    "utf8",
  );

  expect(source).toContain('"PingFang SC"');
  expect(source).toContain('"Microsoft YaHei"');
  expect(source).toContain("ui-monospace");
  expect(source).not.toContain("@fontsource/");
  expect(source).not.toContain("fonts.googleapis.com");
});
