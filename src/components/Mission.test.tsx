import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
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

    expect(galleryImage).toHaveAttribute("src", `/Lec-org${image.image.src}`);
    expect(galleryImage).toHaveAttribute("srcset", expect.stringContaining(" 320w"));
    expect(galleryImage).toHaveAttribute(
      "sizes",
      "(min-width: 640px) 16rem, calc((100vw - 4rem) / 2)",
    );
    expect(galleryImage).toHaveAttribute("loading", "lazy");
    expect(galleryImage).toHaveAttribute("decoding", "async");
  });
});

it("shows the complete studio introduction", async () => {
  const { default: Mission } = await import("./Mission");

  render(<Mission />);

  expect(
    screen.getByText(/乐程软件工作室自 2010 年 6 月创立以来/),
  ).toBeVisible();
  expect(screen.getByText(/在电子科大、川大等知名大学继续深造/)).toBeVisible();
  expect(screen.getByText(/助力每一位成员在深造与就业路上少走弯路/)).toBeVisible();
});

it("opens the image viewer from the team photo wall", async () => {
  const { default: Mission } = await import("./Mission");

  render(<Mission />);

  fireEvent.click(screen.getByRole("button", { name: "查看团队成员围坐火锅聚餐" }));
  expect(screen.getByRole("dialog", { name: "查看团队成员围坐火锅聚餐" })).toBeVisible();
});
