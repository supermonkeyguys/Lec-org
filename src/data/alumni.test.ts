import { describe, expect, it } from "vitest";
import { alumniMembers, outcomeLabels } from "./alumni";

describe("alumni member mock data", () => {
  it("contains the three required outcomes and groups sorted newest first", () => {
    expect(new Set(alumniMembers.map((member) => member.outcome))).toEqual(
      new Set(["recommendation", "graduate-exam", "employment"]),
    );
    expect(alumniMembers.map((member) => member.cohort)).toEqual(
      [...alumniMembers.map((member) => member.cohort)].sort((a, b) => b - a),
    );
    expect(outcomeLabels.recommendation).toBe("保研");
  });
});
