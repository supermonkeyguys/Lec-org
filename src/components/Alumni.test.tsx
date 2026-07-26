import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Alumni from "./Alumni";

it("groups alumni by cohort and exposes their outcomes", () => {
  const { container } = render(<Alumni />);

  expect(screen.getByRole("heading", { name: "往届优秀成员" })).toBeVisible();
  expect(screen.getByText("2019 届")).toBeVisible();
  expect(screen.getByRole("heading", { name: "刘洪堃" })).toBeVisible();
  expect(screen.queryByText(/Mock 展示/)).not.toBeInTheDocument();

  const liuCard = screen.getByRole("heading", { name: "刘洪堃" }).closest("article");
  expect(liuCard?.querySelector("span.rounded-full.px-2")).toBeNull();

  const zhangCard = screen.getByRole("heading", { name: "张峰" }).closest("article");
  expect(zhangCard?.querySelector(".text-muted")).toBeNull();
  expect(container.querySelectorAll("span.rounded-full.px-2:empty")).toHaveLength(0);
  expect(container.querySelectorAll("p.text-muted:empty")).toHaveLength(0);
});
