import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import Alumni from "./Alumni";
import { members } from "@/data/members";

vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, element: string) =>
        ({ children, ...props }: React.HTMLAttributes<HTMLElement>) =>
          React.createElement(element, props, children),
    },
  ),
}));

it("shows the newest grade by default and switches the visible alumni", () => {
  const newestGrade = 2025;
  const nextGrade = 2024;
  const newestMember = members.find((member) => member.cohort === newestGrade);
  const nextMember = members.find((member) => member.cohort === nextGrade);

  if (!newestMember || !nextMember) {
    throw new Error("Expected alumni data for the two newest grades");
  }

  render(<Alumni />);

  const newestTab = screen.getByRole("tab", { name: `${newestGrade}级` });
  expect(newestTab).toHaveAttribute("aria-selected", "true");
  expect(newestTab).toHaveClass("sketchy-border", "bg-ink", "text-card");
  expect(screen.getByRole("heading", { name: newestMember.name })).toBeVisible();
  expect(screen.queryByRole("heading", { name: nextMember.name })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("tab", { name: `${nextGrade}级` }));

  expect(screen.getByRole("tab", { name: `${nextGrade}级` })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(screen.getByRole("tab", { name: `${nextGrade}级` })).toHaveClass(
    "sketchy-border",
    "bg-ink",
    "text-card",
  );
  expect(screen.getByRole("heading", { name: nextMember.name })).toBeVisible();
  expect(screen.queryByRole("heading", { name: newestMember.name })).not.toBeInTheDocument();
});

it("groups alumni by cohort and exposes their outcomes", () => {
  const { container } = render(<Alumni />);

  expect(screen.getByRole("heading", { name: "往届优秀成员" })).toBeVisible();
  expect(screen.getByRole("tab", { name: "2023级" })).toBeVisible();
  expect(screen.queryByRole("tab", { name: "2026级" })).not.toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "刘洪堃" })).not.toBeInTheDocument();
  expect(screen.queryByText(/Mock 展示/)).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("tab", { name: "2019级" }));

  expect(screen.getByRole("heading", { name: "刘洪堃" })).toBeVisible();
  expect(screen.getByRole("heading", { name: "刘洪堃" }).closest("article")).toHaveTextContent(
    "深造",
  );
  expect(screen.getByRole("heading", { name: "岳筱涵" }).closest("article")).toHaveTextContent(
    "深造",
  );
  expect(screen.getByRole("heading", { name: "蒋曾慧" }).closest("article")).toHaveTextContent(
    "深造",
  );
  expect(screen.queryByText("物联网")).not.toBeInTheDocument();

  expect(screen.queryByRole("heading", { name: "张峰" })).not.toBeInTheDocument();
  expect(container.querySelectorAll("span.rounded-full.px-2:empty")).toHaveLength(0);
  expect(container.querySelectorAll("p.text-muted:empty")).toHaveLength(0);
});

it("shows current members without destinations and labels 2022 outcomes", () => {
  render(<Alumni />);

  fireEvent.click(screen.getByRole("tab", { name: "2023级" }));

  const currentMember = screen.getByRole("heading", { name: "陈居浩" }).closest("article");
  expect(currentMember).not.toHaveTextContent("美团");

  fireEvent.click(screen.getByRole("tab", { name: "2022级" }));

  expect(screen.getByRole("heading", { name: "陈信豪" }).closest("article")).toHaveTextContent("就业");
  expect(screen.getByRole("heading", { name: "隋炀" }).closest("article")).toHaveTextContent("深造");
});
