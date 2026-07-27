# Mobile Node Line Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mobile top navigation with a left-side node line whose active node follows section scrolling reliably.

**Architecture:** `Layout` owns the active section and computes it from the scroll container's section offsets. A focused `MobileNodeLine` component renders the mobile-only controls; `TopNav` becomes desktop-only. Clicking a node sets the active section immediately before calling the existing scroll callback.

**Tech Stack:** React 19, Next.js 16 Pages Router, TypeScript, Tailwind CSS 4, Vitest, Testing Library.

## Global Constraints

- Show the node line only below the existing `sm` breakpoint.
- Preserve desktop navigation and reduced-motion behavior.
- Use native buttons for the node controls; every target is 44×44 px.
- Do not retain a mobile select or dropdown menu.

---

### Task 1: Cover mobile node navigation behavior

**Files:**
- Modify: `src/components/TopNav.test.tsx`
- Modify: `src/components/Layout.test.tsx`

**Interfaces:**
- Consumes: `sections`, `TopNav`, and `Layout`.
- Produces: regression coverage for the mobile Node Line and active-section synchronization.

- [ ] **Step 1: Write the failing mobile-navigation tests**

```tsx
expect(screen.getByRole("navigation", { name: "移动端页面导航" })).toBeInTheDocument();
expect(screen.queryByRole("button", { name: "更多页面" })).not.toBeInTheDocument();
fireEvent.click(screen.getByRole("button", { name: "前往优秀成员" }));
expect(onNavigate).toHaveBeenCalledWith("alumni");
```

- [ ] **Step 2: Run the focused tests and verify they fail**

Run: `npm test -- src/components/TopNav.test.tsx src/components/Layout.test.tsx`

Expected: failure because the mobile node navigation does not exist yet.

- [ ] **Step 3: Add scroll-state assertions**

```tsx
root.scrollTop = 3000;
fireEvent.scroll(root);
expect(screen.getByRole("button", { name: "前往优秀成员" })).toHaveAttribute(
  "aria-current",
  "page",
);
```

- [ ] **Step 4: Run the focused tests and verify the scroll assertion fails**

Run: `npm test -- src/components/Layout.test.tsx`

Expected: failure because active state is still driven only by IntersectionObserver.

### Task 2: Build the Node Line and stable active-section state

**Files:**
- Create: `src/components/MobileNodeLine.tsx`
- Modify: `src/components/TopNav.tsx`
- Modify: `src/components/Layout.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: `SectionItem[]`, `activeId: string`, and `onNavigate(id: string): void`.
- Produces: `MobileNodeLine` with `aria-label="移动端页面导航"` and node buttons named `前往${section.label}`.

- [ ] **Step 1: Implement the node control contract**

```tsx
export default function MobileNodeLine({ activeId, onNavigate }: Props) {
  return sections.map((section) => (
    <button
      aria-current={section.id === activeId ? "page" : undefined}
      aria-label={`前往${section.label}`}
      onClick={() => onNavigate(section.id)}
    />
  ));
}
```

- [ ] **Step 2: Replace mobile dropdown rendering and remove its dependency**

```tsx
<MobileNodeLine activeId={activeId} onNavigate={onNavigate} />
<div className="hidden sm:flex">{/* existing desktop links */}</div>
```

- [ ] **Step 3: Compute active section from the scroll root**

```tsx
const updateActiveSection = () => {
  const current = sectionElements.reduce((active, section) =>
    section.offsetTop <= scrollRoot.scrollTop + 1 ? section : active,
  sectionElements[0]);
  setActiveId(current.id);
};
```

- [ ] **Step 4: Set active state before smooth scrolling**

```tsx
setActiveId(id);
scrollRoot.scrollTo({ top: section.offsetTop, behavior });
```

- [ ] **Step 5: Run focused tests**

Run: `npm test -- src/components/TopNav.test.tsx src/components/Layout.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/MobileNodeLine.tsx src/components/TopNav.tsx src/components/Layout.tsx src/components/TopNav.test.tsx src/components/Layout.test.tsx package.json package-lock.json
git commit -m "feat: replace mobile nav with node line"
```

### Task 3: Verify at mobile size

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: committed Node Line implementation.
- Produces: test, lint, build, and browser evidence.

- [ ] **Step 1: Run full verification**

Run: `npm test && npm run lint && npm run build`

Expected: all tests and build pass; any pre-existing image lint warnings remain warnings only.

- [ ] **Step 2: Inspect the 390 px page**

Run: Playwright at `http://localhost:3000`, resize to `390 844`, click `前往优秀成员`, and confirm its node is active with no menu in the accessibility tree.
