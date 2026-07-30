import { useEffect } from "react";
import { X } from "lucide-react";
import type { TeamAboutImage } from "@/data/team";
import { assetPath } from "@/lib/assetPath";

interface ImageViewerProps {
  image: TeamAboutImage | null;
  onClose: () => void;
}

export default function ImageViewer({ image, onClose }: ImageViewerProps) {
  useEffect(() => {
    if (!image) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      aria-label={`查看${image.alt}`}
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 p-6"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="relative max-h-full max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          aria-label="关闭图片查看"
          className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-card text-ink shadow-[2px_2px_0_0_rgba(30,41,59,1)]"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={18} strokeWidth={2.5} />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element -- the viewer uses the existing pre-generated static asset. */}
        <img
          alt={image.alt}
          className="max-h-[calc(100svh-3rem)] max-w-full sketchy-border bg-card object-contain"
          height={image.image.height}
          src={assetPath(image.image.src)}
          width={image.image.width}
        />
      </div>
    </div>
  );
}
