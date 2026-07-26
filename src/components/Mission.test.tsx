import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { teamInfo } from "@/data/team";
import Mission from "./Mission";

vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, element: string) =>
        ({ children, ...props }: React.HTMLAttributes<HTMLElement>) =>
          React.createElement(element, props, children),
    },
  ),
}));

it("lazily decodes every mission gallery image", () => {
  render(<Mission />);

  teamInfo.aboutImages.forEach((image) => {
    const galleryImage = screen.getByRole("img", { name: image.alt });

    expect(galleryImage).toHaveAttribute("src", image.src);
    expect(galleryImage).toHaveAttribute("loading", "lazy");
    expect(galleryImage).toHaveAttribute("decoding", "async");
  });
});
