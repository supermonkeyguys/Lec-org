import { describe, expect, it } from "vitest";
import { members } from "./members";

describe("ordinary member data", () => {
  it("matches the imported current-member workbook records", () => {
    expect(members).toHaveLength(33);
    expect(members.map((member) => member.name)).not.toContain("蒋京玲");
    expect(members.map((member) => member.name)).not.toContain("罗乙番");
    expect(new Set(members.map((member) => member.cohort))).toEqual(
      new Set([2023, 2024, 2025]),
    );
  });
});
