import React from "react";
import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import SectionShell from "./SectionShell";

it("renders the shared semantic section with its id and classes", () => {
  const { container } = render(
    <SectionShell id="mission" className="items-center">
      <p>内容</p>
    </SectionShell>,
  );
  const section = container.querySelector("section#mission");

  expect(section).not.toBeNull();
  if (!section) {
    throw new Error("Expected the mission section to render");
  }
  expect(section).toHaveAttribute("id", "mission");
  expect(section).toHaveClass("site-section", "items-center");
});
