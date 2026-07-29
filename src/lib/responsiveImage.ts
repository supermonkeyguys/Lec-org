import { assetPath } from "./assetPath";

export interface ResponsiveImageVariant {
  src: string;
  width: number;
}

export interface ResponsiveImageAsset {
  src: string;
  width: number;
  height: number;
  variants: readonly ResponsiveImageVariant[];
}

export function responsiveImageProps(image: ResponsiveImageAsset, sizes: string) {
  return {
    src: assetPath(image.src),
    width: image.width,
    height: image.height,
    srcSet: image.variants
      .map(({ src, width }) => `${assetPath(src)} ${width}w`)
      .join(", "),
    sizes,
  };
}
