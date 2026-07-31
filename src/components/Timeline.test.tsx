import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Timeline from "./Timeline";

it("renders every activity in an internal scroll region", () => {
  render(<Timeline />);

  expect(screen.getByRole("heading", { name: "我们最近在" })).toBeInTheDocument();
  expect(screen.getAllByRole("article")[0]).toHaveTextContent("祝陈居浩生日快乐");
  expect(screen.getAllByRole("article")).toHaveLength(143);
  expect(screen.getByTestId("activity-scroll-region")).toHaveClass(
    "sketchy-border",
    "p-4",
    "no-scrollbar",
    "max-h-[60svh]",
    "overflow-y-auto",
  );
  expect(screen.getByTestId("activity-scroll-region")).not.toHaveClass("bg-card");
  expect(screen.queryByRole("button", { name: /加载更多/ })).not.toBeInTheDocument();
  expect(screen.queryByText(/临时展示|正式历史资料待补充/)).not.toBeInTheDocument();
});

it("uses a centered desktop timeline and subtly raises left-side cards", () => {
  render(<Timeline />);

  expect(screen.getByTestId("activity-timeline")).toHaveClass("sm:before:left-1/2");
  expect(screen.getByTestId("activity-timeline")).toHaveClass("space-y-5");
  expect(screen.getAllByTestId("activity-card")[0]).toHaveClass("sm:-translate-y-2");
  expect(screen.getAllByTestId("activity-card")[1]).not.toHaveClass("sm:-translate-y-2");
  expect(screen.getAllByTestId("activity-card")[0]).toHaveClass(
    "sm:w-full",
    "sm:max-w-[22rem]",
    "p-4",
  );
});
