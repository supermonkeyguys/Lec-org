import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import Hero from "./Hero";

vi.mock("framer-motion", () => {
  throw new Error("Hero must not load Framer Motion");
});

it("links the hero call to action to the alumni section", () => {
  render(<Hero />);

  expect(
    screen.getByRole("link", { name: "认识我们的优秀成员 →" }),
  ).toHaveAttribute("href", "#alumni");

  const logo = screen.getByRole("img", { name: "LEC 实验室" });
  expect(logo).toHaveAttribute("width", "400");
  expect(logo).toHaveAttribute("height", "400");
  expect(logo).toHaveAttribute("fetchpriority", "high");
});
