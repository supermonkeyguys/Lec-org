import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const assets = [
  ["about01", "assets/image-source/about/lec-about-01.webp", "about", [320, 640]],
  ["about02", "assets/image-source/about/lec-about-02.webp", "about", [320, 640]],
  ["about03", "assets/image-source/about/lec-about-03.webp", "about", [320, 640]],
  ["about04", "assets/image-source/about/lec-about-04.webp", "about", [320, 640]],
  ["about05", "assets/image-source/about/lec-about-05.webp", "about", [320, 640]],
  ["about06", "assets/image-source/about/lec-about-06.webp", "about", [320, 640]],
  [
    "recruitmentQr",
    "assets/image-source/recruitment/lec-recruitment-qr.webp",
    "recruitment",
    [320, 576],
  ],
];

await rm(resolve(root, "public/media"), { recursive: true, force: true });
const generated = [];

for (const [key, source, category, widths] of assets) {
  const input = resolve(root, source);
  const buffer = await readFile(input);
  const digest = createHash("sha256").update(buffer).digest("hex").slice(0, 8);
  const metadata = await sharp(buffer).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Missing dimensions: ${source}`);
  }

  const stem = basename(source, ".webp");
  const outputDirectory = resolve(root, "public/media", category);
  await mkdir(outputDirectory, { recursive: true });
  const variants = [];

  for (const width of widths) {
    const filename = `${stem}-${digest}-${width}.webp`;
    await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 72, effort: 6 })
      .toFile(resolve(outputDirectory, filename));
    variants.push({ src: `/media/${category}/${filename}`, width });
  }

  const largestWidth = widths.at(-1);
  if (!largestWidth) {
    throw new Error(`No widths configured: ${source}`);
  }

  generated.push({
    key,
    src: variants.at(-1).src,
    width: largestWidth,
    height: Math.round((metadata.height * largestWidth) / metadata.width),
    variants,
  });
}

const records = generated
  .map(
    ({ key, src, width, height, variants }) =>
      `  ${key}: {\n    src: "${src}",\n    width: ${width},\n    height: ${height},\n    variants: [\n${variants
        .map(
          ({ src: variantSource, width: variantWidth }) =>
            `      { src: "${variantSource}", width: ${variantWidth} },`,
        )
        .join("\n")}\n    ],\n  },`,
  )
  .join("\n");

await writeFile(
  resolve(root, "src/data/image-assets.generated.ts"),
  `import type { ResponsiveImageAsset } from "@/lib/responsiveImage";\n\nexport const imageAssets = {\n${records}\n} as const satisfies Record<string, ResponsiveImageAsset>;\n`,
);
