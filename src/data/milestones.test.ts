import { describe, expect, it } from "vitest";
import { historyContent } from "./milestones";

describe("recent activity content", () => {
  it("labels the history section as recent team activity", () => {
    expect(historyContent.title).toBe("我们最近在");
    expect(historyContent).not.toHaveProperty("statusLabel");
  });
});
