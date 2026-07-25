import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Achievements from "./Achievements";

it("shows an explicitly temporary achievement summary", () => {
  render(<Achievements />);

  expect(screen.getByText("省级奖项 100+")).toBeVisible();
  expect(screen.getByText("展示数字与赛事标签均待正式资料确认。")).toBeVisible();
});
