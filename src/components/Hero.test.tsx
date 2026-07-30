import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { SiteNavigationContext } from "@/context/siteNavigation";
import Hero from "./Hero";

vi.mock("framer-motion", () => {
  throw new Error("Hero must not load Framer Motion");
});

it("uses the site navigator for the hero call to action", () => {
  const navigateToSection = vi.fn();

  render(
    <SiteNavigationContext.Provider value={navigateToSection}>
      <Hero />
    </SiteNavigationContext.Provider>,
  );

  const cta = screen.getByRole("link", { name: "认识我们的优秀成员 →" });
  expect(cta).toHaveAttribute("href", "#alumni");
  fireEvent.click(cta);
  expect(navigateToSection).toHaveBeenCalledWith("alumni");

  const logo = screen.getByRole("img", { name: "LEC 实验室" });
  expect(logo).toHaveAttribute("width", "400");
  expect(logo).toHaveAttribute("height", "400");
  expect(logo).toHaveAttribute("fetchpriority", "high");
});
