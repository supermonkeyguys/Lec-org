import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Footer from "./Footer";

it("renders as ordinary non-snap footer content", () => {
  render(<Footer />);

  expect(screen.getByRole("contentinfo")).not.toHaveClass("site-section");
});
