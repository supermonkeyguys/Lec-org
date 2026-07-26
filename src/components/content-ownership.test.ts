import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readComponent = (name: string) =>
  readFileSync(resolve(process.cwd(), `src/components/${name}.tsx`), "utf8");

describe("replaceable content ownership", () => {
  it("keeps member mock/status display copy in the member data modules", () => {
    const membersSource = readComponent("Members");
    const alumniSource = readComponent("Alumni");

    expect(membersSource).toContain("membersContent");
    expect(alumniSource).toContain("alumniContent");
    expect(`${membersSource}\n${alumniSource}`).not.toMatch(
      /Mock 展示|正式资料待|资料整理中|每一位都是/,
    );
  });

  it("keeps history subtitle and status display copy in milestone data", () => {
    const timelineSource = readComponent("Timeline");

    expect(timelineSource).toContain("historyContent");
    expect(timelineSource).not.toMatch(/Our Story|十年|临时展示|正式历史/);
  });
});
