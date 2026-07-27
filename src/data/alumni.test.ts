import { describe, expect, it } from "vitest";
import { alumniMembers } from "./alumni";

describe("alumni member data", () => {
  it("shows only alumni with a recorded destination", () => {
    expect(alumniMembers).toHaveLength(41);
    expect(new Set(alumniMembers.map((member) => member.cohort))).toEqual(
      new Set([2019, 2020, 2021, 2022]),
    );
    expect(alumniMembers.some((member) => member.name === "刘洪堃")).toBe(true);
    expect(alumniMembers.every((member) => member.organization)).toBe(true);
    expect(alumniMembers.some((member) => member.name === "张峰")).toBe(false);
    expect(alumniMembers.some((member) => member.cohort === 2023)).toBe(false);
    expect(alumniMembers.some((member) => member.name.includes("Mock"))).toBe(false);
  });
});
