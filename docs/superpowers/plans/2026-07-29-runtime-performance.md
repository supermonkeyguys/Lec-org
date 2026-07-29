# Runtime Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate first-render web-font work and load animated non-hero sections only near the viewport.

**Architecture:** Replace package-provided web font CSS with OS-native font stacks in the global stylesheet, so no font asset is emitted in the static export. Add a reusable `DeferredSection` observer wrapper that keeps an anchor target in the document and renders a `next/dynamic` client-only component only after it approaches the viewport.

**Tech Stack:** Next.js 16 Pages Router static export, React 19, TypeScript, Vitest, Tailwind CSS v4, Framer Motion.

## Global Constraints

- Preserve page copy, colors, layouts, responsive image behavior, and anchor ids.
- Do not rely on a remote font service or ship `.woff2` files in `out/`.
- Do not change the user's main worktree; work only in this linked worktree.
- Run `npm run test`, `npm run lint`, and `npm run build` before reporting completion.

---

### Task 1: Replace web fonts with system font stacks

**Files:**
- Modify: `src/styles/globals.css:1-20`
- Modify: `src/test/fonts.test.ts:1-16`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `--font-hand` as a Chinese-capable system sans-serif stack and `--font-mono` as a system monospace stack.
- Removes: all `@fontsource/*` CSS imports and three `@fontsource/*` runtime dependencies.

- [ ] **Step 1: Write the failing font-source test**

```ts
expect(source).toContain('"PingFang SC"');
expect(source).toContain('"Microsoft YaHei"');
expect(source).toContain('ui-monospace');
expect(source).not.toContain("@fontsource/");
```

- [ ] **Step 2: Verify the test fails against the font-package imports**

Run: `npm run test -- src/test/fonts.test.ts`

Expected: FAIL because `globals.css` still contains `@fontsource` imports.

- [ ] **Step 3: Implement the system stacks and remove packages**

```css
--font-hand: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

Remove the nine `@fontsource` imports from `globals.css`, then run:

```bash
npm uninstall @fontsource/noto-sans-sc @fontsource/patrick-hand @fontsource/space-mono
```

- [ ] **Step 4: Verify font behavior and emitted artifacts**

Run:

```bash
npm run test -- src/test/fonts.test.ts
npm run build
test "$(find out -type f -name '*.woff2' | wc -l | tr -d ' ')" = 0
```

Expected: test passes, build succeeds, and `out/` contains zero `.woff2` files.

- [ ] **Step 5: Commit the task**

```bash
git add src/styles/globals.css src/test/fonts.test.ts package.json package-lock.json
git commit -m "perf: use system font stacks"
```

### Task 2: Render non-hero animation modules near the viewport

**Files:**
- Create: `src/components/DeferredSection.tsx`
- Create: `src/components/DeferredSection.test.tsx`
- Modify: `src/components/SectionShell.tsx:3-17`
- Modify: `src/components/Mission.tsx:11-68`
- Modify: `src/components/Timeline.tsx:10-69`
- Modify: `src/pages/index.tsx:1-29`
- Modify: `src/test/index.performance.test.tsx:1-10`

**Interfaces:**
- `DeferredSection({ id, minHeight, children })` accepts an anchor id, a reserved-height CSS value, and a render callback.
- `Mission` and `Timeline` accept optional `id?: string`; omitting it avoids duplicate ids inside `DeferredSection`.
- `children` executes only after an IntersectionObserver entry has `isIntersecting: true`; browsers lacking IntersectionObserver render it immediately.

- [ ] **Step 1: Write the failing observer tests**

```tsx
render(<DeferredSection id="history" minHeight="100svh">{() => <p>History</p>}</DeferredSection>);
expect(screen.queryByText("History")).not.toBeInTheDocument();
expect(screen.getByTestId("deferred-section-history")).toHaveAttribute("id", "history");
observerCallback?.([{ isIntersecting: true }] as IntersectionObserverEntry[], observer);
expect(await screen.findByText("History")).toBeInTheDocument();
```

Also update the page performance test to require `{ ssr: false }` on both dynamic imports.

- [ ] **Step 2: Verify the tests fail**

Run: `npm run test -- src/components/DeferredSection.test.tsx src/test/index.performance.test.tsx`

Expected: FAIL because `DeferredSection` does not exist and dynamic imports are not client-only.

- [ ] **Step 3: Implement the observer wrapper and wire the page**

```tsx
const Mission = dynamic(() => import("@/components/Mission"), { ssr: false });

<DeferredSection id="mission" minHeight="100svh">
  {() => <Mission id={undefined} />}
</DeferredSection>
```

`DeferredSection` observes its anchor with `rootMargin: "300px 0px"`, disconnects once loaded, and renders `children()` only after intersection. Move the ids from `Mission` and `Timeline` to their wrappers by allowing `SectionShell` to omit its `id` attribute when no id is supplied.

- [ ] **Step 4: Verify deferred loading behavior**

Run: `npm run test -- src/components/DeferredSection.test.tsx src/test/index.performance.test.tsx src/components/Mission.test.tsx src/components/Timeline.test.tsx`

Expected: all listed tests pass.

- [ ] **Step 5: Commit the task**

```bash
git add src/components/DeferredSection.tsx src/components/DeferredSection.test.tsx src/components/SectionShell.tsx src/components/Mission.tsx src/components/Timeline.tsx src/pages/index.tsx src/test/index.performance.test.tsx
git commit -m "perf: defer below-fold animation modules"
```

### Task 3: Validate the production output and local preview

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: the system font stack and deferred-section behavior from Tasks 1 and 2.
- Produces: a verified static `out/` artifact and a local development preview.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`

Expected: every Vitest file passes.

- [ ] **Step 2: Run static analysis**

Run: `npm run lint`

Expected: exit code 0; existing `<img>` guidance warnings may remain because static export uses pre-generated responsive images.

- [ ] **Step 3: Build and inspect asset output**

Run:

```bash
npm run build
find out -type f -name '*.woff2' | wc -l
find out -type f -name '*.css' -exec wc -c {} +
```

Expected: build succeeds, no `.woff2` files are emitted, and the CSS artifact is below the previous 438,990-byte baseline.

- [ ] **Step 4: Restart the local preview and verify the page response**

Run:

```bash
npm run dev -- --port 3005
curl --max-time 20 -sS -o /dev/null -w '%{http_code}\n' http://localhost:3005/
```

Expected: Next reports ready and the route returns `200`.
