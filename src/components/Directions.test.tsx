import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Directions from "./Directions";

it("renders the five current technical directions", () => {
  render(<Directions />);

  expect(screen.getByRole("heading", { name: "技术方向" })).toBeVisible();
  expect(screen.getByText("全栈开发")).toBeVisible();
  expect(screen.getByText("Agent 开发")).toBeVisible();
  expect(screen.queryByText("算法")).not.toBeInTheDocument();
  expect(screen.queryByText("人工智能")).not.toBeInTheDocument();
});
