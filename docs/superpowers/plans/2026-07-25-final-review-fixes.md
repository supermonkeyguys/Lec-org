# Final Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve every Important finding from the final review while preserving accessible native scrolling and making formal content replacement data-only.

**Architecture:** Keep the five configured sections as the only snap/navigation targets. Add a small DOM navigation policy module used by `Layout` for wheel and keyboard decisions, apply reduced-motion behavior at the scroll, CSS, and Framer Motion boundaries, and move all replaceable display copy into typed data modules consumed by presentation components.

**Tech Stack:** Next.js 16.2.4 Pages Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion 12, Vitest/Testing Library, Playwright CLI.

## Global Constraints

- Read relevant bundled documentation from `node_modules/next/dist/docs/` before code changes.
- Use TDD: every production behavior begins with a failing focused test.
- Keep five navigable/snap sections; Footer is ordinary non-snap content.
- Preserve default behavior for reduced motion, interactive targets, and nested scroll containers.
- Content replacement must only require edits under `src/data/`.

---

### Task 1: Scoped section navigation and reduced motion

**Files:**
- Create: `src/components/Layout.test.tsx`
- Create: `src/lib/section-navigation.test.ts`
- Create: `src/lib/section-navigation.ts`
- Modify: `src/components/Layout.tsx`
- Modify: `src/styles/globals.test.ts`
- Modify: `src/styles/globals.css`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- `shouldPreserveNativeScroll(root, target, deltaY): boolean`
- `getSectionTargetIndex(root, sectionElements, direction): number | null`
- `Layout` owns scoped listeners on `#site-scroll-root` and wraps content in `MotionConfig reducedMotion="user"`.

- [ ] Write failing unit/component/CSS tests for adjacent wheel navigation, throttle, keyboard keys, interactive and nested-scroll preservation, reduced-motion auto/native behavior, MotionConfig policy, disabled floating animation, and a non-snap footer.
- [ ] Run the focused tests and confirm failures are caused by missing behavior.
- [ ] Implement the minimal navigation helpers and Layout listeners, using `{ passive: false }` only on the scoped wheel listener.
- [ ] Add CSS/Framer reduced-motion policy and remove `site-section` from Footer.
- [ ] Re-run focused tests and keep them green.

### Task 2: PDF-aligned, data-only content

**Files:**
- Create: `src/data/team.test.ts`
- Create: `src/data/members.test.ts`
- Create: `src/components/Members.test.tsx`
- Create: `src/components/Timeline.test.tsx`
- Modify: `src/data/team.ts`
- Modify: `src/data/members.ts`
- Modify: `src/data/alumni.ts`
- Modify: `src/data/milestones.ts`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/Mission.tsx`
- Modify: `src/components/Members.tsx`
- Modify: `src/components/Alumni.tsx`
- Modify: `src/components/Timeline.tsx`

**Interfaces:**
- `teamInfo` owns founding date, approximate member count, weekly attendance hours, mission, practices, and section display copy.
- `members` contains only current mock members; `membersContent` owns all section labels/status messages.
- `alumniContent` owns all mock/empty-state labels.
- `historyContent` and each milestone's source metadata own all temporary-status/history display copy.

- [ ] Write failing data and rendering tests for 2010-06, approximately 30 people, 28 weekly attendance hours, current-only ordinary members, independent alumni outcomes, no stale legacy copy, and imported display metadata.
- [ ] Run focused tests and confirm the expected failures.
- [ ] Replace the data models/content and update components to consume them without embedded replaceable copy.
- [ ] Re-run focused tests and the existing suites.

### Task 3: Acceptance, reporting, and commits

**Files:**
- Create: `.superpowers/sdd/final-fixes-report.md`

- [ ] Run all focused tests, full tests, lint, and production build.
- [ ] Start the production/dev server and validate desktop wheel/key navigation, mobile natural scrolling, footer reachability, and reduced motion in a real browser.
- [ ] Append exact commands/results and any concerns to the report.
- [ ] Review the diff against all six findings, then commit the implementation and report.
