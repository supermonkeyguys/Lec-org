import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Timeline from "./Timeline";

it("shows the latest eight activities and reveals another eight on request", () => {
  render(<Timeline />);

  expect(screen.getByRole("heading", { name: "我们最近在" })).toBeInTheDocument();
  expect(screen.getAllByRole("article")[0]).toHaveTextContent("祝陈居浩生日快乐");
  expect(screen.getAllByRole("article")).toHaveLength(8);
  expect(screen.getByRole("button", { name: /加载更多/ })).toHaveTextContent("剩余 135 条");

  fireEvent.click(screen.getByRole("button", { name: /加载更多/ }));

  expect(screen.getAllByRole("article")).toHaveLength(16);
  expect(screen.getByRole("button", { name: /加载更多/ })).toHaveTextContent("剩余 127 条");
  expect(screen.queryByText(/临时展示|正式历史资料待补充/)).not.toBeInTheDocument();
});

it("removes the load-more control after every activity is visible", () => {
  render(<Timeline />);

  for (let click = 0; click < 17; click += 1) {
    fireEvent.click(screen.getByRole("button", { name: /加载更多/ }));
  }

  expect(screen.getAllByRole("article")).toHaveLength(143);
  expect(screen.queryByRole("button", { name: /加载更多/ })).not.toBeInTheDocument();
});

it("uses a centered desktop timeline and subtly raises left-side cards", () => {
  render(<Timeline />);

  expect(screen.getByTestId("activity-timeline")).toHaveClass("sm:before:left-1/2");
  expect(screen.getAllByTestId("activity-card")[0]).toHaveClass("sm:-translate-y-2");
  expect(screen.getAllByTestId("activity-card")[1]).not.toHaveClass("sm:-translate-y-2");
});
