import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import TopNav from "./TopNav";

it("marks the active section and navigates from a button click", () => {
  const onNavigate = vi.fn();
  render(<TopNav activeId="members" onNavigate={onNavigate} />);

  expect(screen.getByRole("link", { name: "成员" })).toHaveAttribute(
    "aria-current",
    "page"
  );
  fireEvent.click(screen.getByRole("link", { name: "优秀成员" }));
  expect(onNavigate).toHaveBeenCalledWith("alumni");
});
