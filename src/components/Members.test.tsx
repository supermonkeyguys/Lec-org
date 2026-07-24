import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { membersContent } from "@/data/members";
import Members from "./Members";

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: new Proxy(
    {},
    {
      get: (_target, element: string) =>
        ({ children, ...props }: React.HTMLAttributes<HTMLElement>) =>
          React.createElement(element, props, children),
    },
  ),
}));

it("shows only current cohorts and keeps cohort filtering usable", () => {
  render(<Members />);

  expect(screen.getByRole("heading", { name: membersContent.title })).toBeInTheDocument();
  expect(screen.queryByText("已毕业")).not.toBeInTheDocument();
  expect(screen.queryByText("Alumni")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "2024 级" }));
  expect(screen.getByText("2024级成员 1")).toBeVisible();
  expect(screen.queryByText("2025级成员 1")).not.toBeInTheDocument();
});
