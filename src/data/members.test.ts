import { describe, expect, it } from "vitest";
import { members } from "./members";

describe("ordinary member data", () => {
  it("matches the imported current-member workbook records", () => {
    expect(members).toHaveLength(23);
    expect(new Set(members.map((member) => member.cohort))).toEqual(
      new Set([2024, 2025]),
    );
  });
});
