import { describe, expect, it } from "vitest";
import { alumniMembers } from "./alumni";

describe("alumni member data", () => {
  it("matches the imported alumni workbook records", () => {
    expect(alumniMembers).toHaveLength(65);
    expect(new Set(alumniMembers.map((member) => member.cohort))).toEqual(
      new Set([2019, 2020, 2021, 2022, 2023]),
    );
    expect(alumniMembers.some((member) => member.name === "刘洪堃")).toBe(true);
    expect(alumniMembers.some((member) => member.name.includes("Mock"))).toBe(false);
  });
});
