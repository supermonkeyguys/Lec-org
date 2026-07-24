import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { historyContent, milestones } from "@/data/milestones";
import Timeline from "./Timeline";

it("renders temporary history metadata from the data module without legacy copy", () => {
  render(<Timeline />);

  expect(screen.getByRole("heading", { name: historyContent.title })).toBeInTheDocument();
  expect(screen.getByText(historyContent.subtitle)).toBeInTheDocument();
  expect(screen.getByText(historyContent.statusLabel)).toBeInTheDocument();
  expect(screen.queryByText(/十年|白板|校友网络/)).not.toBeInTheDocument();
  expect(milestones.every((milestone) => milestone.sourceStatus === "temporary")).toBe(
    true,
  );
});
