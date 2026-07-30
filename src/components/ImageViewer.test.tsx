import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { teamInfo } from "@/data/team";
import ImageViewer from "./ImageViewer";

it("shows a selected image and closes from the close control or Escape", () => {
  const onClose = vi.fn();
  const image = teamInfo.aboutImages[0];

  render(<ImageViewer image={image} onClose={onClose} />);

  expect(screen.getByRole("dialog", { name: `查看${image.alt}` })).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "关闭图片查看" }));
  expect(onClose).toHaveBeenCalledTimes(1);

  fireEvent.keyDown(window, { key: "Escape" });
  expect(onClose).toHaveBeenCalledTimes(2);
});
