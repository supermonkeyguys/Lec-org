import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import MobileNodeLine from "./MobileNodeLine";

it("places the mobile section controls in a horizontal bottom capsule", () => {
  const onNavigate = vi.fn();

  render(<MobileNodeLine activeId="mission" onNavigate={onNavigate} />);

  const nav = screen.getByRole("navigation", { name: "移动端页面导航" });
  const mission = screen.getByRole("button", { name: "前往宗旨" });

  expect(nav).toHaveClass(
    "bottom-[max(0.75rem,env(safe-area-inset-bottom))]",
    "left-1/2",
    "flex-row",
  );
  expect(mission).toHaveAttribute("aria-current", "page");

  fireEvent.click(mission);
  expect(onNavigate).toHaveBeenCalledWith("mission");
});
