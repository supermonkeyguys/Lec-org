import { expect, it } from "vitest";
import { technicalDirections } from "./directions";
import { recruitmentInfo } from "./recruitment";

it("keeps reusable recruitment facts and seven directions in data", () => {
  expect(recruitmentInfo.period).toBe("每年 8–10 月");
  expect(recruitmentInfo.groupNumber).toBe("674764635");
  expect(technicalDirections).toHaveLength(7);
});
