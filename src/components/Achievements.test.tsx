import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Achievements from "./Achievements";

it("shows the current achievement events without a temporary status note", () => {
  render(<Achievements />);

  expect(screen.getByText("省级奖项 100+")).toBeVisible();
  expect(screen.getByText("中国大学生服务外包创新创业大赛")).toBeVisible();
  expect(screen.queryByText("CCF CAT")).not.toBeInTheDocument();
  expect(screen.queryByText("展示数字与赛事标签均待正式资料确认。")).not.toBeInTheDocument();
});
