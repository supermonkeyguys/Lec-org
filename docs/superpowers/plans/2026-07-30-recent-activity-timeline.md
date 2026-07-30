# Recent Activity Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the recent-activity list into a responsive alternating timeline that initially shows eight records and reveals eight more per interaction.

**Architecture:** `Timeline` owns a local visible-record count, initialized to eight and incremented by eight from a native button. It derives `visibleActivities` from the already sorted generated dataset. Desktop uses a centered line with alternating card columns and nodes; narrow screens use a left-aligned single-column timeline.

**Tech Stack:** Next.js Pages Router 16.2, React 19, TypeScript, Tailwind CSS, Framer Motion, Vitest, Testing Library.

## Global Constraints

- Keep `recentActivities` as the sole event source and preserve its newest-first order.
- Render eight records initially; each activation reveals exactly eight additional records.
- Desktop (`sm` and above) alternates cards around a centered timeline; left cards use an upward `-translate-y-2` (8px) offset.
- Narrow screens render a one-column timeline with its line and nodes aligned to the left.
- Use semantic `article`, `time`, and a native `button`; do not add dependencies or per-record animation.

---

### Task 1: Add progressive disclosure and alternating timeline layout

**Files:**
- Modify: `src/components/Timeline.tsx`
- Modify: `src/components/Timeline.test.tsx`

**Interfaces:**
- Consumes: `recentActivities: RecentActivity[]`, ordered newest-first.
- Produces: a `Timeline` section that exposes the first eight activities, then eight more per `加载更多` button activation.

- [ ] **Step 1: Write failing interaction and layout tests**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Timeline from "./Timeline";

it("shows eight activities initially and reveals another eight when requested", () => {
  render(<Timeline />);

  expect(screen.getAllByRole("article")).toHaveLength(8);
  expect(screen.getByRole("button", { name: /加载更多/ })).toHaveTextContent("剩余 135 条");

  fireEvent.click(screen.getByRole("button", { name: /加载更多/ }));

  expect(screen.getAllByRole("article")).toHaveLength(16);
  expect(screen.getByRole("button", { name: /加载更多/ })).toHaveTextContent("剩余 127 条");
});

it("uses the desktop center line and a subtle left-card offset", () => {
  render(<Timeline />);

  expect(screen.getByTestId("activity-timeline")).toHaveClass("sm:before:left-1/2");
  expect(screen.getAllByTestId("activity-card")[0]).toHaveClass("sm:-translate-y-2");
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm run test -- src/components/Timeline.test.tsx`

Expected: FAIL because all 143 activity cards are rendered and neither the button nor timeline test identifiers exist.

- [ ] **Step 3: Implement the minimal stateful feed and responsive structure**

```tsx
const BATCH_SIZE = 8;
const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
const visibleActivities = recentActivities.slice(0, visibleCount);
const remainingCount = recentActivities.length - visibleActivities.length;

<div
  className="relative space-y-8 before:absolute before:bottom-0 before:left-4 before:top-0 before:w-px before:bg-ink/20 sm:before:left-1/2"
  data-testid="activity-timeline"
>
  {visibleActivities.map((activity, index) => {
    const isLeft = index % 2 === 0;
    return (
      <article
        className="relative grid grid-cols-[2rem_1fr] gap-x-4 sm:grid-cols-[1fr_4rem_1fr]"
        key={activity.id}
      >
        <span className="relative z-10 col-start-1 mt-6 h-3 w-3 rounded-full bg-ink sm:col-start-2 sm:justify-self-center" />
        <div
          className={`sketchy-border bg-card col-start-2 row-start-1 p-5 sm:w-[calc(100%-2rem)] ${
            isLeft
              ? "sm:col-start-1 sm:justify-self-end sm:-translate-y-2"
              : "sm:col-start-3 sm:justify-self-start"
          }`}
          data-testid="activity-card"
        >
          <time>{activity.dateLabel}</time>
          <p>{activity.title}</p>
        </div>
      </article>
    );
  })}
</div>
{remainingCount > 0 && (
  <button onClick={() => setVisibleCount((count) => count + BATCH_SIZE)} type="button">
    加载更多（剩余 {remainingCount} 条）
  </button>
)}
```

- [ ] **Step 4: Run focused tests and verify they pass**

Run: `npm run test -- src/components/Timeline.test.tsx`

Expected: PASS with initial count, progressive expansion, current first-item assertion, and deterministic layout assertions all passing.

- [ ] **Step 5: Commit the implementation**

```bash
git add src/components/Timeline.tsx src/components/Timeline.test.tsx
git commit -m "feat: paginate recent activity timeline"
```

### Task 2: Verify the integrated timeline

**Files:**
- No source changes expected.

**Interfaces:**
- Verifies the compiled homepage can render the stateful activity timeline.

- [ ] **Step 1: Run the complete quality checks**

Run: `npm run test && npm run lint && npm run build`

Expected: tests pass, lint has no newly introduced warnings, and the production build succeeds.

- [ ] **Step 2: Verify the local page responds**

Run: `curl --max-time 20 -sS -o /dev/null -w '%{http_code}\\n' http://localhost:3005/`

Expected: `200`.
