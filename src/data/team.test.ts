import { describe, expect, it } from "vitest";
import { teamInfo } from "./team";

describe("PDF-aligned team information", () => {
  it("models the founding month, approximate size, attendance, and stated mission", () => {
    expect(teamInfo.founded).toEqual({ year: 2010, month: 6 });
    expect(teamInfo.memberCount).toEqual({ value: 30, approximate: true });
    expect(teamInfo.weeklyAttendanceHours).toBe(28);
    expect(teamInfo.mission).toBe("学以致用，服务学校，走向社会");
  });

  it("does not retain unsupported legacy claims", () => {
    expect(JSON.stringify(teamInfo)).not.toMatch(
      /十年|10 年积累|白板|校友网络|代码 review|服务器/,
    );
  });

  it("uses image-specific descriptions for the About photo wall", () => {
    const altTexts = teamInfo.aboutImages.map((image) => image.alt);

    expect(altTexts).not.toContain("乐程团队活动照片 1");
    expect(altTexts).not.toContain("乐程团队活动照片 2");
    expect(altTexts).not.toContain("乐程团队活动照片 3");
    expect(altTexts).not.toContain("乐程团队活动照片 4");
    expect(altTexts).not.toContain("乐程团队活动照片 5");
    expect(altTexts).not.toContain("乐程团队活动照片 6");
  });
});
