import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Recruitment from "./Recruitment";

it("shows reusable recruitment details alongside its local QR image", () => {
  render(<Recruitment />);

  expect(screen.getByText("每年 8–10 月")).toBeVisible();
  expect(screen.getByText("674764635")).toBeVisible();
  expect(screen.getByRole("img", { name: "乐程官方招新群二维码" })).toHaveAttribute(
    "src",
    "/recruitment/lec-recruitment-qr.webp",
  );
});
