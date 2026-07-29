import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

it("does not make external Google font requests in the document shell", () => {
  const source = readFileSync(
    resolve(process.cwd(), "src/pages/_document.tsx"),
    "utf8",
  );

  expect(source).not.toContain("fonts.googleapis.com");
  expect(source).not.toContain("fonts.gstatic.com");
  expect(source).not.toContain("preconnect");
});
