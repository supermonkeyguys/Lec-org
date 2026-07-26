import { render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

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
    "/Lec-org/recruitment/lec-recruitment-qr.webp",
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
