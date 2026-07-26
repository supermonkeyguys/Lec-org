import { describe, expect, it } from "vitest";
import { milestones } from "./milestones";

describe("temporary milestone data", () => {
  it("marks the verified 2010 founding fact as temporary and replaceable", () => {
    const foundingMilestone = milestones.find((milestone) =>
      milestone.dateLabel.includes("2010"),
    );

    expect(foundingMilestone?.sourceStatus).toBe("temporary");
    expect(foundingMilestone?.sourceNote).toContain("待正式历史资料核验");
  });
});
