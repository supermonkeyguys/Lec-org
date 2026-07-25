import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Directions from "./Directions";

it("renders all seven technical directions", () => {
  render(<Directions />);

  expect(screen.getByRole("heading", { name: "技术方向" })).toBeVisible();
  expect(screen.getByText("人工智能")).toBeVisible();
});
