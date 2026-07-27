import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import TopNav from "./TopNav";

it("marks the active section and navigates from a button click", () => {
  const onNavigate = vi.fn();
  render(<TopNav activeId="alumni" onNavigate={onNavigate} />);

  const desktopHome = screen.getAllByRole("link", { name: "首页" }).at(-1)!;
  expect(desktopHome.parentElement).toHaveClass(
    "sm:justify-center",
  );

  expect(screen.getByRole("link", { name: "优秀成员" })).toHaveAttribute(
    "aria-current",
    "page"
  );
  expect(screen.queryByRole("link", { name: "成员" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("link", { name: "招新" }));
  expect(onNavigate).toHaveBeenCalledWith("recruitment");
});

it("provides a mobile Node Line with direct section navigation", () => {
  const onNavigate = vi.fn();
  render(<TopNav activeId="alumni" onNavigate={onNavigate} />);

  expect(
    screen.getByRole("navigation", { name: "移动端页面导航" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("combobox", { name: "页面导航" }),
  ).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "更多页面" })).not.toBeInTheDocument();
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(
    screen.queryByRole("menuitem", { name: "优秀成员" }),
  ).not.toBeInTheDocument();

  const alumniNode = screen.getByRole("button", { name: "前往优秀成员" });
  expect(alumniNode).toHaveClass("size-11");
  fireEvent.click(alumniNode);
  expect(onNavigate).toHaveBeenCalledWith("alumni");
});
