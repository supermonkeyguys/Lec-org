import React from "react";
import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Layout from "./Layout";

vi.mock("framer-motion", () => ({
  MotionConfig: ({
    children,
    reducedMotion,
  }: {
    children: React.ReactNode;
    reducedMotion: string;
  }) => (
    <div data-testid="motion-config" data-reduced-motion={reducedMotion}>
      {children}
    </div>
  ),
}));

class IntersectionObserverStub {
  observe = vi.fn();
  disconnect = vi.fn();
}

function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockReturnValue({
      matches,
      media: "(prefers-reduced-motion: reduce)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
}

function setSmallViewport(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === "(max-width: 767px)" ? matches : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

function renderLayout() {
  render(
    <Layout>
      <section id="hero">Hero</section>
      <section id="mission">
        <a href="#example">Interactive link</a>
        <div data-testid="nested-scroll" style={{ overflowY: "auto" }}>
          <span data-testid="nested-target">Nested target</span>
        </div>
      </section>
      <section id="members">Members</section>
      <section id="alumni">Alumni</section>
      <section id="history">History</section>
      <section id="recruitment">Recruitment</section>
    </Layout>,
  );

  const root = screen.getByRole("main");
  const offsets: Record<string, number> = {
    hero: 0,
    mission: 1000,
    members: 2000,
    alumni: 3000,
    history: 5200,
    recruitment: 6200,
  };

  Object.entries(offsets).forEach(([id, offsetTop]) => {
    Object.defineProperty(document.getElementById(id), "offsetTop", {
      configurable: true,
      value: offsetTop,
    });
  });

  const scrollTo = vi.fn(({ top }: ScrollToOptions) => {
    root.scrollTop = top ?? root.scrollTop;
  });
  Object.defineProperty(root, "scrollTo", {
    configurable: true,
    value: scrollTo,
  });

  return { root, scrollTo };
}

beforeEach(() => {
  vi.useFakeTimers();
  setReducedMotion(false);
  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    value: IntersectionObserverStub,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("native section scrolling", () => {
  it("leaves desktop wheel and paging-key scrolling native", () => {
    const { root, scrollTo } = renderLayout();

    fireEvent.click(screen.getAllByRole("link", { name: "宗旨" }).at(-1)!);
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 1000, behavior: "smooth" });
    scrollTo.mockClear();

    const wheel = createEvent.wheel(root, { deltaY: 120 });
    const pageDown = createEvent.keyDown(root, { key: "PageDown" });
    const pageUp = createEvent.keyDown(root, { key: "PageUp" });
    fireEvent(root, wheel);
    fireEvent(root, pageDown);
    fireEvent(root, pageUp);
    expect(wheel.defaultPrevented).toBe(false);
    expect(pageDown.defaultPrevented).toBe(false);
    expect(pageUp.defaultPrevented).toBe(false);
    expect(scrollTo).not.toHaveBeenCalled();
  });
});

describe("reduced motion", () => {
  it("uses auto navigation and leaves wheel and paging keys native", () => {
    setReducedMotion(true);
    const { root, scrollTo } = renderLayout();

    fireEvent.click(screen.getAllByRole("link", { name: "宗旨" }).at(-1)!);
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 1000, behavior: "auto" });
    scrollTo.mockClear();

    const wheel = createEvent.wheel(root, { deltaY: 120 });
    const pageDown = createEvent.keyDown(root, { key: "PageDown" });
    const pageUp = createEvent.keyDown(root, { key: "PageUp" });
    fireEvent(root, wheel);
    fireEvent(root, pageDown);
    fireEvent(root, pageUp);

    expect(wheel.defaultPrevented).toBe(false);
    expect(pageDown.defaultPrevented).toBe(false);
    expect(pageUp.defaultPrevented).toBe(false);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("configures Framer Motion to honor the user's reduced-motion setting", () => {
    renderLayout();
    expect(screen.getByTestId("motion-config")).toHaveAttribute(
      "data-reduced-motion",
      "user",
    );
  });
});

it("leaves wheel and paging keys native on small screens", () => {
  setSmallViewport(true);
  const { root, scrollTo } = renderLayout();
  const wheel = createEvent.wheel(root, { deltaY: 120 });
  const pageDown = createEvent.keyDown(root, { key: "PageDown" });
  const pageUp = createEvent.keyDown(root, { key: "PageUp" });

  fireEvent(root, wheel);
  fireEvent(root, pageDown);
  fireEvent(root, pageUp);

  expect(wheel.defaultPrevented).toBe(false);
  expect(pageDown.defaultPrevented).toBe(false);
  expect(pageUp.defaultPrevented).toBe(false);
  expect(scrollTo).not.toHaveBeenCalled();
});
