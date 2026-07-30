import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

let observerCallbacks: IntersectionObserverCallback[];

class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback) {
    observerCallbacks.push(callback);
  }

  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

const dynamic = vi.fn((loader: () => Promise<unknown>) => {
  if (loader.toString().includes("Alumni")) {
    return ({ id = "alumni" }: { id?: string | null }) => (
      <section {...(id ? { id } : {})} />
    );
  }

  return () => null;
});
vi.mock("next/dynamic", () => ({ default: dynamic }));

beforeEach(() => {
  observerCallbacks = [];
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

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
  expect(source).toContain("{() => <Alumni id={null} />}");
});

it("keeps alumni as the sole anchor after its deferred content activates", async () => {
  const { default: Home } = await import("../pages/index");
  const { container } = render(<Home />);

  act(() => {
    observerCallbacks[1]?.(
      [{ isIntersecting: true }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );
  });

  expect(container.querySelectorAll("#alumni")).toHaveLength(1);
});
