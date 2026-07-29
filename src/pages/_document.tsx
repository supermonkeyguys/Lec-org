import { Html, Head, Main, NextScript } from "next/document";
import { fontVariables } from "@/styles/fonts";

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head />
      <body className={fontVariables}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
