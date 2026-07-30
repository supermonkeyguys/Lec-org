import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it, vi } from "vitest";

const dynamic = vi.fn(() => () => null);
vi.mock("next/dynamic", () => ({ default: dynamic }));

it("splits animated below-fold sections into dynamic modules", async () => {
  await import("../pages/index");

  expect(dynamic).toHaveBeenCalledTimes(3);
  expect(dynamic).toHaveBeenNthCalledWith(
    1,
    expect.any(Function),
    { ssr: false },
  );
  expect(dynamic).toHaveBeenNthCalledWith(
    2,
    expect.any(Function),
    { ssr: false },
  );
  expect(dynamic).toHaveBeenNthCalledWith(
    3,
    expect.any(Function),
    { ssr: false },
  );

  const source = readFileSync(resolve(process.cwd(), "src/pages/index.tsx"), "utf8");
  expect(source).toContain(
    'const Alumni = dynamic(() => import("@/components/Alumni"), { ssr: false });',
  );
  expect(source).toContain('<DeferredSection id="alumni" minHeight="100svh">');
});
