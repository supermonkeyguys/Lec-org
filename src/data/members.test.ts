import { describe, expect, it } from "vitest";
import { members } from "./members";

describe("ordinary member data", () => {
  it("contains about thirty current members and no alumni outcome records", () => {
    expect(members).toHaveLength(30);
    expect(members.every((member) => member.status === "current")).toBe(true);
    expect(members.every((member) => !("outcome" in member))).toBe(true);
  });
});
