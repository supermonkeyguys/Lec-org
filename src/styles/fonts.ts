import localFont from "next/font/local";

const hand = localFont({
  src: "../../node_modules/@fontsource/patrick-hand/files/patrick-hand-latin-400-normal.woff2",
  display: "optional",
  variable: "--font-lec-hand",
});

const mono = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/space-mono/files/space-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/space-mono/files/space-mono-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../node_modules/@fontsource/space-mono/files/space-mono-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/space-mono/files/space-mono-latin-700-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  display: "optional",
  variable: "--font-lec-mono",
});

export const fontVariables = `${hand.variable} ${mono.variable}`;
