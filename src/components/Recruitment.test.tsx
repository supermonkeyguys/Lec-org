import { render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { recruitmentInfo } from "@/data/recruitment";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

it("prefixes the local QR image for a GitHub Pages project site", async () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/Lec-org");
  const { default: Recruitment } = await import("./Recruitment");

  render(<Recruitment />);

  expect(screen.getByText("每年 8–10 月")).toBeVisible();
  expect(screen.getByText("674764635")).toBeVisible();
  expect(screen.getByRole("img", { name: "乐程官方招新群二维码" })).toHaveAttribute(
    "src",
    `/Lec-org${recruitmentInfo.qrImage.src}`,
  );
  expect(screen.getByRole("img", { name: "乐程官方招新群二维码" })).toHaveAttribute(
    "srcset",
    expect.stringContaining(" 576w"),
  );
  expect(screen.getByRole("img", { name: "乐程官方招新群二维码" })).toHaveAttribute(
    "sizes",
    "(min-width: 1024px) 24rem, min(100vw - 3rem, 18rem)",
  );
  expect(screen.getByRole("img", { name: "乐程官方招新群二维码" })).toHaveAttribute(
    "loading",
    "lazy",
  );
  expect(screen.getByRole("img", { name: "乐程官方招新群二维码" })).toHaveAttribute(
    "decoding",
    "async",
  );
});
