import { expect, it } from "vitest";
import { technicalDirections } from "./directions";
import { recruitmentInfo } from "./recruitment";

it("keeps reusable recruitment facts and five directions in data", () => {
  expect(recruitmentInfo.period).toBe("每年 8–10 月");
  expect(recruitmentInfo.groupNumber).toBe("674764635");
  expect(technicalDirections.map((direction) => direction.title)).toEqual([
    "全栈开发",
    "Agent 开发",
    "游戏开发",
    "机器学习",
    "图形学",
  ]);
});
