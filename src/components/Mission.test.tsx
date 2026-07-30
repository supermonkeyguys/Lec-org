import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { teamInfo } from "@/data/team";

const imageViewerLoader = vi.hoisted(() => ({
  loadImageViewer: vi.fn(),
  renders: [] as Array<{ image: unknown; onClose: unknown }>,
}));

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

vi.mock("./imageViewerLoader", () => {
  return {
    loadImageViewer: imageViewerLoader.loadImageViewer,
  };
});

beforeEach(() => {
  imageViewerLoader.loadImageViewer.mockReset();
  imageViewerLoader.renders.length = 0;
});

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

it("loads and mounts the viewer only after selecting a team photo", async () => {
  const Viewer = (props: { image: unknown; onClose: unknown }) => {
    imageViewerLoader.renders.push(props);
    return null;
  };
  imageViewerLoader.loadImageViewer.mockResolvedValue(Viewer);
  const { default: Mission } = await import("./Mission");

  render(<Mission />);

  expect(imageViewerLoader.loadImageViewer).not.toHaveBeenCalled();
  expect(imageViewerLoader.renders).toHaveLength(0);

  fireEvent.click(screen.getByRole("button", { name: "查看团队成员围坐火锅聚餐" }));

  await waitFor(() => {
    expect(imageViewerLoader.loadImageViewer).toHaveBeenCalledTimes(1);
    expect(imageViewerLoader.renders).toHaveLength(1);
    expect(imageViewerLoader.renders[0]).toMatchObject({
      image: teamInfo.aboutImages[0],
      onClose: expect.any(Function),
    });
  });
});

it("shows a refresh instruction when the viewer module fails to load", async () => {
  imageViewerLoader.loadImageViewer.mockRejectedValue(
    new Error("ImageViewer failed to load"),
  );
  const { default: Mission } = await import("./Mission");

  render(<Mission />);

  fireEvent.click(screen.getByRole("button", { name: "查看团队成员围坐火锅聚餐" }));

  expect(await screen.findByRole("status")).toHaveTextContent(
    "图片查看器加载失败，请刷新页面后重试。",
  );
});
