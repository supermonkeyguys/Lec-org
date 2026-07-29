import type { ResponsiveImageAsset } from "@/lib/responsiveImage";

export const imageAssets = {
  about01: {
    src: "/media/about/lec-about-01-3fcd32b6-640.webp",
    width: 640,
    height: 360,
    variants: [
      { src: "/media/about/lec-about-01-3fcd32b6-320.webp", width: 320 },
      { src: "/media/about/lec-about-01-3fcd32b6-640.webp", width: 640 },
    ],
  },
  about02: {
    src: "/media/about/lec-about-02-e645ef60-640.webp",
    width: 640,
    height: 853,
    variants: [
      { src: "/media/about/lec-about-02-e645ef60-320.webp", width: 320 },
      { src: "/media/about/lec-about-02-e645ef60-640.webp", width: 640 },
    ],
  },
  about03: {
    src: "/media/about/lec-about-03-638f43fc-640.webp",
    width: 640,
    height: 480,
    variants: [
      { src: "/media/about/lec-about-03-638f43fc-320.webp", width: 320 },
      { src: "/media/about/lec-about-03-638f43fc-640.webp", width: 640 },
    ],
  },
  about04: {
    src: "/media/about/lec-about-04-0128f9c6-640.webp",
    width: 640,
    height: 480,
    variants: [
      { src: "/media/about/lec-about-04-0128f9c6-320.webp", width: 320 },
      { src: "/media/about/lec-about-04-0128f9c6-640.webp", width: 640 },
    ],
  },
  about05: {
    src: "/media/about/lec-about-05-a742067b-640.webp",
    width: 640,
    height: 480,
    variants: [
      { src: "/media/about/lec-about-05-a742067b-320.webp", width: 320 },
      { src: "/media/about/lec-about-05-a742067b-640.webp", width: 640 },
    ],
  },
  about06: {
    src: "/media/about/lec-about-06-c14ef9f5-640.webp",
    width: 640,
    height: 480,
    variants: [
      { src: "/media/about/lec-about-06-c14ef9f5-320.webp", width: 320 },
      { src: "/media/about/lec-about-06-c14ef9f5-640.webp", width: 640 },
    ],
  },
  recruitmentQr: {
    src: "/media/recruitment/lec-recruitment-qr-a95e3cec-576.webp",
    width: 576,
    height: 545,
    variants: [
      { src: "/media/recruitment/lec-recruitment-qr-a95e3cec-320.webp", width: 320 },
      { src: "/media/recruitment/lec-recruitment-qr-a95e3cec-576.webp", width: 576 },
    ],
  },
} as const satisfies Record<string, ResponsiveImageAsset>;
