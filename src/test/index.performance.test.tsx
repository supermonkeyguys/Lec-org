import { expect, it, vi } from "vitest";

const dynamic = vi.fn(() => () => null);
vi.mock("next/dynamic", () => ({ default: dynamic }));

it("splits animated below-fold sections into dynamic modules", async () => {
  await import("../pages/index");

  expect(dynamic).toHaveBeenCalledTimes(2);
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
});
