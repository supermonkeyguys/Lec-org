import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { teamInfo } from "@/data/team";
import ImageViewer from "./ImageViewer";

it("shows a selected image and closes from the close control, backdrop, or Escape", () => {
  const onClose = vi.fn();
  const image = teamInfo.aboutImages[0];

  render(<ImageViewer image={image} onClose={onClose} />);

  const dialog = screen.getByRole("dialog", { name: `查看${image.alt}` });
  expect(dialog).toBeVisible();
  expect(screen.getByRole("img", { name: image.alt })).toBeVisible();
  const closeControl = screen.getByRole("button", { name: "关闭图片查看" });
  expect(
    closeControl.querySelector("svg[aria-hidden='true']"),
  ).toBeInTheDocument();
  fireEvent.click(closeControl);
  expect(onClose).toHaveBeenCalledTimes(1);

  fireEvent.click(dialog);
  expect(onClose).toHaveBeenCalledTimes(2);

  fireEvent.keyDown(window, { key: "Escape" });
  expect(onClose).toHaveBeenCalledTimes(3);
});
