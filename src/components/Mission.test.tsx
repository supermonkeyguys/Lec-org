import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { teamInfo } from "@/data/team";

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

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

it("prefixes every mission gallery image for a GitHub Pages project site", async () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/Lec-org");
  const { default: Mission } = await import("./Mission");

  render(<Mission />);

  teamInfo.aboutImages.forEach((image) => {
    const galleryImage = screen.getByRole("img", { name: image.alt });

    expect(galleryImage).toHaveAttribute("src", `/Lec-org${image.src}`);
    expect(galleryImage).toHaveAttribute("loading", "lazy");
    expect(galleryImage).toHaveAttribute("decoding", "async");
  });
});
