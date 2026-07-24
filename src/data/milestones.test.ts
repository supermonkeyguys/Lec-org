import { describe, expect, it } from "vitest";
import { milestones } from "./milestones";

describe("temporary milestone data", () => {
  it("marks the verified 2010 founding fact as temporary and replaceable", () => {
    const foundingMilestone = milestones.find(
      (milestone) => milestone.year === 2010,
    );

    expect(foundingMilestone?.description).toContain("临时节点");
    expect(foundingMilestone?.description).toContain("待正式资料核验");
  });
});
