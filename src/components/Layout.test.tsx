import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Layout from "./Layout";

vi.mock("framer-motion", () => {
  throw new Error("Layout must not load Framer Motion");
});

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
      <section id="achievements">Achievements</section>
      <section id="directions">Directions</section>
      <section id="alumni">Alumni</section>
      <section id="history">History</section>
      <section id="recruitment">Recruitment</section>
    </Layout>,
  );

  const root = screen.getByRole("main");
  const offsets: Record<string, number> = {
    hero: 0,
    mission: 1000,
    achievements: 2000,
    directions: 2500,
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

it("updates the mobile Node Line after native scrolling", () => {
  setSmallViewport(true);
  const { root } = renderLayout();

  root.scrollTop = 3000;
  fireEvent.scroll(root);

  expect(screen.getByRole("button", { name: "前往优秀成员" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

it("marks a mobile Node Line destination current before its smooth scroll completes", () => {
  setSmallViewport(true);
  const { scrollTo } = renderLayout();

  const alumniNode = screen.getByRole("button", { name: "前往优秀成员" });
  fireEvent.click(alumniNode);

  expect(alumniNode).toHaveAttribute("aria-current", "page");
  expect(scrollTo).toHaveBeenCalledWith({ top: 3000, behavior: "smooth" });
});

it("keeps a clicked mobile destination active while smooth scrolling crosses earlier sections", () => {
  setSmallViewport(true);
  const { root } = renderLayout();

  const alumniNode = screen.getByRole("button", { name: "前往优秀成员" });
  fireEvent.click(alumniNode);

  root.scrollTop = 2000;
  fireEvent.scroll(root);

  expect(alumniNode).toHaveAttribute("aria-current", "page");
});

it.each([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  "Space",
  " ",
])("cancels pending smooth navigation when the user scrolls with %j", (key) => {
  const { root } = renderLayout();

  fireEvent.click(screen.getAllByRole("link", { name: "优秀成员" }).at(-1)!);

  root.scrollTop = 2000;
  fireEvent.keyDown(root, { key });
  fireEvent.scroll(root);

  expect(screen.getAllByRole("link", { name: "成就" }).at(-1)).toHaveAttribute(
    "aria-current",
    "page",
  );
});
