import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import TopNav from "./TopNav";

it("marks the active section and navigates from a button click", () => {
  const onNavigate = vi.fn();
  render(<TopNav activeId="alumni" onNavigate={onNavigate} />);

  const [, desktopHome] = screen.getAllByRole("link", { name: "首页" });
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

it("offers a mobile overflow menu instead of a native picker", () => {
  const onNavigate = vi.fn();
  render(<TopNav activeId="alumni" onNavigate={onNavigate} />);

  expect(screen.queryByRole("combobox", { name: "页面导航" })).not.toBeInTheDocument();

  fireEvent.pointerDown(screen.getByRole("button", { name: "更多页面" }), {
    button: 0,
    ctrlKey: false,
  });

  const menu = screen.getByRole("menu");
  expect(within(menu).getByRole("menuitem", { name: "优秀成员" })).toBeVisible();
  expect(within(menu).getByRole("menuitem", { name: "招新" })).toBeVisible();

  fireEvent.click(within(menu).getByRole("menuitem", { name: "招新" }));
  expect(onNavigate).toHaveBeenCalledWith("recruitment");
});
