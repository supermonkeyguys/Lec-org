import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readComponent = (name: string) =>
  readFileSync(resolve(process.cwd(), `src/components/${name}.tsx`), "utf8");
const readHomePage = () =>
  readFileSync(resolve(process.cwd(), "src/pages/index.tsx"), "utf8");

describe("replaceable content ownership", () => {
  it("keeps alumni status display copy in the alumni data module", () => {
    const alumniSource = readComponent("Alumni");

    expect(alumniSource).toContain("alumniContent");
    expect(alumniSource).not.toMatch(
      /Mock 展示|正式资料待|资料整理中|每一位都是/,
    );
  });

  it("does not render the current-member block on the home page", () => {
    expect(readHomePage()).not.toContain("<Members");
  });

  it("keeps history subtitle and status display copy in milestone data", () => {
    const timelineSource = readComponent("Timeline");

    expect(timelineSource).toContain("historyContent");
    expect(timelineSource).not.toMatch(/Our Story|十年|临时展示|正式历史/);
  });
});
