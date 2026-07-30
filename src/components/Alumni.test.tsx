import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import Alumni from "./Alumni";
import { alumniMembers } from "@/data/alumni";
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

it("keeps its standalone anchor by default and omits it when requested", () => {
  const { container, rerender } = render(<Alumni />);

  expect(container.querySelectorAll("#alumni")).toHaveLength(1);

  rerender(<Alumni id={null} />);

  expect(container.querySelectorAll("#alumni")).toHaveLength(0);
});

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
  expect(newestTab).toHaveAttribute("id", `alumni-grade-tab-${newestGrade}`);
  expect(newestTab).toHaveAttribute("aria-controls", `alumni-grade-${newestGrade}`);
  expect(newestTab).toHaveAttribute("tabindex", "0");
  expect(screen.getByRole("tab", { name: `${nextGrade}级` })).toHaveAttribute(
    "tabindex",
    "-1",
  );
  expect(screen.getByRole("tabpanel")).toHaveAttribute(
    "aria-labelledby",
    `alumni-grade-tab-${newestGrade}`,
  );
  expect(newestTab).toHaveClass("sketchy-border", "bg-ink", "text-card");
  expect(screen.getByRole("heading", { name: newestMember.name })).toBeVisible();
  expect(screen.queryByRole("heading", { name: nextMember.name })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("tab", { name: `${nextGrade}级` }));

  const nextTab = screen.getByRole("tab", { name: `${nextGrade}级` });
  expect(nextTab).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(nextTab).toHaveAttribute("id", `alumni-grade-tab-${nextGrade}`);
  expect(nextTab).toHaveAttribute("aria-controls", `alumni-grade-${nextGrade}`);
  expect(screen.getByRole("tabpanel")).toHaveAttribute(
    "aria-labelledby",
    `alumni-grade-tab-${nextGrade}`,
  );
  expect(nextTab).toHaveClass(
    "sketchy-border",
    "bg-ink",
    "text-card",
  );
  expect(screen.getByRole("heading", { name: nextMember.name })).toBeVisible();
  expect(screen.queryByRole("heading", { name: newestMember.name })).not.toBeInTheDocument();
});

it("keeps every tab panel in the DOM and hides the non-selected panels", () => {
  render(<Alumni />);

  screen.getAllByRole("tab").forEach((tab) => {
    const panel = document.getElementById(tab.getAttribute("aria-controls")!);

    expect(panel).toHaveAttribute("role", "tabpanel");
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    expect(panel?.hidden).toBe(tab.getAttribute("aria-selected") !== "true");
  });
});

it("uses roving tab keyboard navigation to select and focus grade panels", () => {
  render(<Alumni />);

  const newestTab = screen.getByRole("tab", { name: "2025级" });
  const nextTab = screen.getByRole("tab", { name: "2024级" });
  const oldestTab = screen.getByRole("tab", { name: "2019级" });

  newestTab.focus();
  fireEvent.keyDown(newestTab, { key: "ArrowRight" });
  expect(nextTab).toHaveFocus();
  expect(nextTab).toHaveAttribute("aria-selected", "true");
  expect(nextTab).toHaveAttribute("tabindex", "0");
  expect(newestTab).toHaveAttribute("tabindex", "-1");

  fireEvent.keyDown(nextTab, { key: "ArrowUp" });
  expect(newestTab).toHaveFocus();
  expect(newestTab).toHaveAttribute("aria-selected", "true");

  fireEvent.keyDown(newestTab, { key: "ArrowLeft" });
  expect(oldestTab).toHaveFocus();
  expect(oldestTab).toHaveAttribute("aria-selected", "true");

  fireEvent.keyDown(oldestTab, { key: "Home" });
  expect(newestTab).toHaveFocus();
  expect(newestTab).toHaveAttribute("aria-selected", "true");

  fireEvent.keyDown(newestTab, { key: "End" });
  expect(oldestTab).toHaveFocus();
  expect(oldestTab).toHaveAttribute("aria-selected", "true");
});

it("retains graduate-exam classifications behind unified further-study labels", () => {
  expect(alumniMembers.find((member) => member.name === "曹志鹏")?.outcome).toBe(
    "graduate-exam",
  );
  expect(alumniMembers.find((member) => member.name === "孙钰镒")?.outcome).toBe(
    "graduate-exam",
  );
});

it("groups alumni by cohort and exposes their outcomes", () => {
  const { container } = render(<Alumni />);

  expect(screen.getByRole("heading", { name: "团队成员" })).toBeVisible();
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
  for (const name of ["刘洪堃", "岳筱涵", "蒋曾慧"]) {
    const card = screen.getByRole("heading", { name }).closest("article");
    if (!card) throw new Error(`Expected a card for ${name}`);

    expect(card.querySelector("span.rounded-full.px-2")).toHaveClass(
      "bg-violet-100",
      "text-violet-700",
    );
  }
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
