import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import TopNav from "./TopNav";

it("marks the active section and navigates from a button click", () => {
  const onNavigate = vi.fn();
  render(<TopNav activeId="alumni" onNavigate={onNavigate} />);

  expect(screen.getByRole("link", { name: "优秀成员" })).toHaveAttribute(
    "aria-current",
    "page"
  );
  expect(screen.queryByRole("link", { name: "成员" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("link", { name: "招新" }));
  expect(onNavigate).toHaveBeenCalledWith("recruitment");
});
