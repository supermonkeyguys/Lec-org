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

describe("scoped section navigation", () => {
  it("moves one adjacent section per wheel gesture and throttles repeated input", () => {
    const { root, scrollTo } = renderLayout();

    const firstWheel = createEvent.wheel(root, { deltaY: 120 });
    fireEvent(root, firstWheel);
    fireEvent.wheel(root, { deltaY: 120 });

    expect(firstWheel.defaultPrevented).toBe(true);
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 1000, behavior: "smooth" });

    vi.advanceTimersByTime(800);
    fireEvent.wheel(root, { deltaY: 120 });
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 2000, behavior: "smooth" });
  });

  it.each([
    ["PageDown", 1000],
    ["End", 6200],
    ["Home", 0],
  ])("handles %s inside the scroll root", (key, expectedTop) => {
    const { root, scrollTo } = renderLayout();
    root.scrollTop = key === "Home" ? 2000 : 0;

    const event = createEvent.keyDown(root, { key });
    fireEvent(root, event);

    expect(event.defaultPrevented).toBe(true);
    expect(scrollTo).toHaveBeenLastCalledWith({
      top: expectedTop,
      behavior: "smooth",
    });
  });

  it("handles PageUp by moving to the previous adjacent section", () => {
    const { root, scrollTo } = renderLayout();
    root.scrollTop = 2000;

    fireEvent.keyDown(root, { key: "PageUp" });

    expect(scrollTo).toHaveBeenLastCalledWith({ top: 1000, behavior: "smooth" });
  });

  it("preserves native wheel behavior on interactive elements", () => {
    const { scrollTo } = renderLayout();
    const link = screen.getByRole("link", { name: "Interactive link" });
    const event = createEvent.wheel(link, { deltaY: 120 });

    fireEvent(link, event);

    expect(event.defaultPrevented).toBe(false);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("preserves a nested scroll container while it can consume the gesture", () => {
    const { scrollTo } = renderLayout();
    const nested = screen.getByTestId("nested-scroll");
    Object.defineProperties(nested, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 300 },
      scrollTop: { configurable: true, writable: true, value: 20 },
    });
    const target = screen.getByTestId("nested-target");
    const event = createEvent.wheel(target, { deltaY: 120 });

    fireEvent(target, event);

    expect(event.defaultPrevented).toBe(false);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("preserves root scrolling inside an oversized direct-child section", () => {
    const { root, scrollTo } = renderLayout();
    const alumni = document.getElementById("alumni")!;
    Object.defineProperties(root, {
      clientHeight: { configurable: true, value: 1000 },
      scrollHeight: { configurable: true, value: 7200 },
    });
    Object.defineProperties(alumni, {
      clientHeight: { configurable: true, value: 2200 },
      offsetHeight: { configurable: true, value: 2200 },
    });
    root.scrollTop = 3200;

    const event = createEvent.wheel(alumni, { deltaY: 120 });
    fireEvent(alumni, event);

    expect(event.defaultPrevented).toBe(false);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("preserves upward root scrolling inside an oversized direct-child section", () => {
    const { root, scrollTo } = renderLayout();
    const alumni = document.getElementById("alumni")!;
    Object.defineProperties(root, {
      clientHeight: { configurable: true, value: 1000 },
      scrollHeight: { configurable: true, value: 7200 },
    });
    Object.defineProperties(alumni, {
      clientHeight: { configurable: true, value: 2200 },
      offsetHeight: { configurable: true, value: 2200 },
    });
    root.scrollTop = 4000;

    const event = createEvent.wheel(alumni, { deltaY: -120 });
    fireEvent(alumni, event);

    expect(event.defaultPrevented).toBe(false);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it.each([
    ["lower", 4200, 120, 5200],
    ["upper", 3000, -120, 2000],
  ])(
    "hands wheel navigation to the adjacent section at the oversized section's %s edge",
    (_edge, scrollTop, deltaY, expectedTop) => {
      const { root, scrollTo } = renderLayout();
      const alumni = document.getElementById("alumni")!;
      Object.defineProperties(root, {
        clientHeight: { configurable: true, value: 1000 },
        scrollHeight: { configurable: true, value: 7200 },
      });
      Object.defineProperties(alumni, {
        clientHeight: { configurable: true, value: 2200 },
        offsetHeight: { configurable: true, value: 2200 },
      });
      root.scrollTop = scrollTop;

      const event = createEvent.wheel(alumni, { deltaY });
      fireEvent(alumni, event);

      expect(event.defaultPrevented).toBe(true);
      expect(scrollTo).toHaveBeenLastCalledWith({ top: expectedTop, behavior: "smooth" });
    },
  );
});

describe("reduced motion", () => {
  it("uses auto navigation and leaves wheel and paging keys native", () => {
    setReducedMotion(true);
    const { root, scrollTo } = renderLayout();

    fireEvent.click(screen.getByRole("link", { name: "宗旨" }));
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 1000, behavior: "auto" });
    scrollTo.mockClear();

    const wheel = createEvent.wheel(root, { deltaY: 120 });
    const pageDown = createEvent.keyDown(root, { key: "PageDown" });
    fireEvent(root, wheel);
    fireEvent(root, pageDown);

    expect(wheel.defaultPrevented).toBe(false);
    expect(pageDown.defaultPrevented).toBe(false);
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

  fireEvent(root, wheel);
  fireEvent(root, pageDown);

  expect(wheel.defaultPrevented).toBe(false);
  expect(pageDown.defaultPrevented).toBe(false);
  expect(scrollTo).not.toHaveBeenCalled();
});
