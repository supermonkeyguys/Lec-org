# Mobile Section Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separate mobile content areas into panels and compact the Node Line without changing desktop behaviour.

**Architecture:** Add `SectionShell` for all seven semantic top-level sections. Keep the responsive visual rules in `globals.css`; resize only the Node Line controls in `MobileNodeLine`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Vitest, Testing Library.

## Global Constraints

- Desktop `.site-section` remains full-width with `min-height: 100svh`.
- Below `768px`, each section is a distinct white rounded panel on a cream background.
- Preserve ids, content, data, navigation APIs, and active-section scroll logic.
- The mobile rule must override the desktop top-navigation offset.
- Node Line retains seven accessible buttons and the active label.
- Do not stage user changes in `package.json`, pnpm files, or `.superpowers/sdd`.

---

## File structure

- Create `src/components/SectionShell.tsx` and `src/components/SectionShell.test.tsx` for the shared semantic wrapper.
- Modify all seven content components to use the wrapper while retaining their internal layout.
- Modify `src/styles/globals.css` and `src/styles/globals.test.ts` for the responsive panel rules.
- Modify `src/components/MobileNodeLine.tsx` and `src/components/TopNav.test.tsx` for compact navigation sizing.

### Task 1: Extract the shared section shell

**Files:** Create `src/components/SectionShell.tsx`, `src/components/SectionShell.test.tsx`; modify Hero, Mission, Achievements, Directions, Alumni, Timeline, and Recruitment.

**Interface:** `SectionShell({ id, className, children }: SectionShellProps)` returns `<section id={id} className={`site-section ${className}`.trim()}>`; `Layout` can keep calling `document.getElementById(id)`.

- [ ] **Step 1: Write a failing test**

```tsx
const { container } = render(<SectionShell id="mission" className="items-center"><p>内容</p></SectionShell>);
expect(container.querySelector("section#mission")).toHaveClass("site-section", "items-center");
```

Place it in `src/components/SectionShell.test.tsx`, import Testing Library/Vitest, and assert that the query result is not null before inspecting its id. Do not add an ARIA label only to give the section a `region` role.

- [ ] **Step 2: Verify the test fails**

Run `npm test -- src/components/SectionShell.test.tsx`; expect module-not-found for `./SectionShell`.

- [ ] **Step 3: Implement minimal wrapper and migrate callers**

```tsx
interface SectionShellProps { id: string; className?: string; children: ReactNode; }
export default function SectionShell({ id, className = "", children }: SectionShellProps) {
  return <section id={id} className={`site-section ${className}`.trim()}>{children}</section>;
}
```

Replace the outer `<section id="…" className="site-section …">` in each listed component with `<SectionShell id="…" className="…">`; preserve all original inner content and class tokens.

- [ ] **Step 4: Verify the migration passes**

Run `npm test -- src/components/SectionShell.test.tsx src/components/Hero.test.tsx src/components/Mission.test.tsx src/components/Achievements.test.tsx src/components/Directions.test.tsx src/components/Alumni.test.tsx src/components/Timeline.test.tsx src/components/Recruitment.test.tsx`; expect zero failures.

- [ ] **Step 5: Commit only the wrapper migration**

Run `git add src/components/SectionShell.tsx src/components/SectionShell.test.tsx src/components/Hero.tsx src/components/Mission.tsx src/components/Achievements.tsx src/components/Directions.tsx src/components/Alumni.tsx src/components/Timeline.tsx src/components/Recruitment.tsx && git commit -m "refactor: share top-level section shell"`.

### Task 2: Add mobile-only panel separation

**Files:** Modify `src/styles/globals.css`, `src/styles/globals.test.ts`.

**Interface:** The existing `site-section` class has mobile-only cards, while desktop and reduced-motion rules retain current behavior.

- [ ] **Step 1: Write a failing stylesheet test**

```tsx
const rules = mediaRule("max-width: 767px").match(/\.site-section\s*\{(?<rules>[^}]*)\}/)?.groups?.rules;
expect(rules).toContain("margin-inline: 0.75rem;");
expect(rules).toContain("padding-block-start: 4rem;");
expect(rules).toContain("background: var(--color-card);");
expect(rules).toContain("border-radius:");
```

Append this to `src/styles/globals.test.ts`, also asserting `margin-block: 1rem`, the `1.5px` border, and `box-shadow`.

- [ ] **Step 2: Verify the stylesheet test fails**

Run `npm test -- src/styles/globals.test.ts`; expect its missing mobile panel assertion to fail.

- [ ] **Step 3: Implement minimal mobile panel CSS**

```css
@media (max-width: 767px) {
  .site-section { min-height: auto; margin-inline: 0.75rem; margin-block: 1rem; padding-block-start: 4rem; padding-block-end: 4rem; background: var(--color-card); border: 1.5px solid var(--color-border); border-radius: 2rem; box-shadow: 3px 4px 0 rgba(30, 41, 59, 0.18); }
  .site-section:first-child { margin-block-start: max(1rem, env(safe-area-inset-top)); }
  .site-section:last-child { margin-block-end: max(1rem, env(safe-area-inset-bottom)); }
}
```

Replace the current small-screen rule with these declarations; this intentionally overrides the desktop nav-safe top offset.

- [ ] **Step 4: Verify the stylesheet test passes**

Run `npm test -- src/styles/globals.test.ts`; expect zero failures.

- [ ] **Step 5: Commit only the mobile panel files**

Run `git add src/styles/globals.css src/styles/globals.test.ts && git commit -m "feat: separate mobile content sections"`.

### Task 3: Compact the mobile Node Line

**Files:** Modify `src/components/MobileNodeLine.tsx`, `src/components/TopNav.test.tsx`.

**Interface:** Existing `activeId`/`onNavigate` remain unchanged; compact buttons use `size-9` and preserve ARIA and click behavior.

- [ ] **Step 1: Write the failing desired-size test**

Replace the `size-11` expectation in `TopNav.test.tsx` with `expect(alumniNode).toHaveClass("size-9");`.

- [ ] **Step 2: Verify it fails**

Run `npm test -- src/components/TopNav.test.tsx`; expect failure because the component still has `size-11`.

- [ ] **Step 3: Implement proportional sizing**

In `MobileNodeLine.tsx`, change the line offsets to `before:left-[1.125rem] before:inset-y-4`, button size to `size-9`, active dot to `size-2.5`, and inactive dot to `size-1.5`. Do not change handlers, labels, `aria-current`, or focus styles.

- [ ] **Step 4: Verify it passes**

Run `npm test -- src/components/TopNav.test.tsx`; expect direct navigation and compact-size tests to pass.

- [ ] **Step 5: Commit only Node Line files**

Run `git add src/components/MobileNodeLine.tsx src/components/TopNav.test.tsx && git commit -m "style: compact mobile node line"`.

### Task 4: Full verification

- [ ] **Step 1: Run test suite** — `npm test`; expect zero failures.
- [ ] **Step 2: Run static checks** — `npm run lint && npm run build`; expect exit code 0 and report any pre-existing raw-image warnings only as warnings.
- [ ] **Step 3: Run 390px browser smoke test** — use Playwright at `http://localhost:3000/`; verify cream gaps between panels, white rounded/bordered panels, compact Node Line, and click-to-scroll/highlight for “前往优秀成员”.
