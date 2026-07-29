import { expect, it } from "vitest";
import { responsiveImageProps } from "./responsiveImage";

it("builds base-path-aware responsive image attributes", () => {
  expect(
    responsiveImageProps(
      {
        src: "/media/about/example-a1b2c3d4-640.webp",
        width: 640,
        height: 360,
        variants: [
          { src: "/media/about/example-a1b2c3d4-320.webp", width: 320 },
          { src: "/media/about/example-a1b2c3d4-640.webp", width: 640 },
        ],
      },
      "(min-width: 640px) 16rem, calc((100vw - 4rem) / 2)",
    ),
  ).toEqual({
    src: "/media/about/example-a1b2c3d4-640.webp",
    width: 640,
    height: 360,
    srcSet:
      "/media/about/example-a1b2c3d4-320.webp 320w, /media/about/example-a1b2c3d4-640.webp 640w",
    sizes: "(min-width: 640px) 16rem, calc((100vw - 4rem) / 2)",
  });
});
