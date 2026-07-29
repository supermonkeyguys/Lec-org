import React from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import DeferredSection from "./DeferredSection";

let observerCallback: IntersectionObserverCallback | undefined;

class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }

  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

beforeEach(() => {
  observerCallback = undefined;
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

it("keeps the anchor while rendering its content after it reaches the viewport", () => {
  render(
    <DeferredSection id="history" minHeight="100svh">
      {() => <p>History</p>}
    </DeferredSection>,
  );

  expect(screen.getByTestId("deferred-section-history")).toHaveAttribute(
    "id",
    "history",
  );
  expect(screen.queryByText("History")).not.toBeInTheDocument();

  act(() => {
    observerCallback?.(
      [{ isIntersecting: true }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );
  });

  expect(screen.getByText("History")).toBeInTheDocument();
});
