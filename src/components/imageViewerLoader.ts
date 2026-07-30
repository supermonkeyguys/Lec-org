import type { ComponentType } from "react";
import type { TeamAboutImage } from "@/data/team";

export type ImageViewerComponent = ComponentType<{
  image: TeamAboutImage;
  onClose: () => void;
}>;

export async function loadImageViewer(): Promise<ImageViewerComponent> {
  const { default: ImageViewer } = await import("./ImageViewer");
  return ImageViewer;
}
