import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Alumni from "./Alumni";

it("groups alumni by cohort and exposes their outcomes", () => {
  render(<Alumni />);

  expect(screen.getByRole("heading", { name: "往届优秀成员" })).toBeVisible();
  expect(screen.getByText("2025 届")).toBeVisible();
  expect(screen.getAllByText("保研").length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Mock 展示/).length).toBeGreaterThan(0);
});
