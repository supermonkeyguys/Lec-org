# Final Review Fix Report

Date: 2026-07-25

## Scope completed

### 1. Scoped adjacent-section navigation

- Added a wheel listener only on `#site-scroll-root`, registered non-passively so it can prevent default only when a section transition is actually handled.
- One accepted wheel gesture moves to the adjacent configured section and locks further gestures for 700 ms.
- Added PageUp, PageDown, Home, and End handling on the focusable main scroll root.
- Interactive targets retain native wheel/key behavior.
- Nested vertical scroll containers retain wheel/key behavior while they can still scroll in the requested direction.
- First/last-section boundary gestures remain native, allowing the ordinary footer to be reached after History.
- The JavaScript controller is disabled at 767 px and below so small screens use natural scrolling.

### 2. Complete reduced-motion behavior

- Native CSS smooth scrolling changes to `auto` under `prefers-reduced-motion: reduce`.
- Programmatic navigation requests `behavior: "auto"` for reduced-motion users.
- Wheel and paging-key interception is disabled under reduced motion.
- Hero floating CSS animation is disabled.
- Framer Motion presets use hydration-safe preference detection and zero-duration/final-state rendering under reduced motion.
- Initial reveal transforms were removed so server-rendered markup is stable and reduced-motion clients do not briefly animate or trigger hydration mismatches.
- `MotionConfig reducedMotion="user"` remains at the layout boundary for Framer Motion's built-in transform/layout policy.

### 3. PDF-aligned temporary team/history content

- Team data now models and renders:
  - founded in June 2010;
  - approximately 30 people;
  - 28 attendance hours per week;
  - regular meetings / learning exchange;
  - competitions / project practice;
  - “学以致用，服务学校，走向社会”.
- Removed unsupported legacy value copy, including “10 年积累”, code-review lineage claims, and the component-embedded “十年，从一张白板到遍布各地的校友网络”.
- History now renders only the currently supportable June 2010 founding fact.
- Temporary status, source note, title, subtitle, and status label live in `src/data/milestones.ts`.

### 4. Current-only ordinary Members

- `src/data/members.ts` now contains 30 current mock members across the 2025, 2024, and 2023 cohorts.
- Removed alumni cohorts, the graduated filter group, and Alumni badges from ordinary Members.
- Alumni outcome records remain exclusively in `src/data/alumni.ts` and the independent Alumni section.

### 5. Data-only replacement boundary

- Added `membersContent` in `src/data/members.ts` for section title/subtitle, mock/current status, and empty state.
- Added `alumniContent` in `src/data/alumni.ts` for title, Mock status message, and empty state.
- Added `historyContent` and per-milestone source metadata in `src/data/milestones.ts`.
- Expanded `teamInfo` in `src/data/team.ts` to own team facts and display labels used by Hero, Mission, and Footer.
- Added architecture tests ensuring replaceable Mock/history copy does not return to presentation components.

### 6. Footer snap behavior

- Removed `site-section` from Footer.
- The configured navigation and snap model now contains exactly five sections, matching the five navigation links.
- At the History boundary, downward native scrolling reaches the footer.

## TDD evidence

Initial RED command:

```text
npm run test -- src/components/Layout.test.tsx src/components/Footer.test.tsx src/styles/globals.test.ts src/data/team.test.ts src/data/members.test.ts src/components/Members.test.tsx src/components/Timeline.test.tsx src/components/content-ownership.test.ts
```

Result: 18 required-behavior/content failures (plus one pre-existing test-harness cleanup/IntersectionObserver issue exposed by the new component coverage).

Small-screen acceptance RED:

```text
npm run test -- src/components/Layout.test.tsx
```

Result: the new small-screen native-scroll test failed because wheel default was prevented. The controller was then disabled below 768 px and the suite passed 10/10.

Framer reduced-motion RED:

```text
npm run test -- src/config/animations.test.ts
```

Result: failed with `sectionFade is not a function`; reduced-motion-aware presets were implemented and the focused suite passed.

Final focused result:

```text
Test Files  11 passed (11)
Tests       22 passed (22)
```

The later animation/small-screen additions increased the final full suite to 25 tests.

## Real-browser acceptance (Chromium via Playwright CLI)

### Desktop, 1440 × 900

- DOM: 5 `main#site-scroll-root > section.site-section` targets, 5 navigation links, Footer has no `site-section`.
- Two immediate wheel events from Hero: final `scrollTop` 900, Mission `offsetTop` 900 (throttle prevented skipping).
- PageDown from Mission: final `scrollTop` 1800, Members `offsetTop` 1800.
- Home/End: navigated first/last configured section; History settled with the fixed-nav safe offset.
- Downward wheel at History: footer visible; `scrollTop` 4207 of maximum 4493.
- Synthetic wheel on the Hero link: `defaultPrevented: false`.

### Mobile, 390 × 844

- A 300 px wheel gesture produced `scrollTop: 300` while Mission began at 449, confirming natural rather than adjacent-section navigation.
- Computed `scroll-snap-type: none`.
- Section minimum height computed naturally (`0px` rather than a viewport lock).
- All 5 navigation links remained available in a horizontally scrollable nav container.

### Reduced motion, desktop

- Computed HTML `scroll-behavior: auto`.
- Computed main `scroll-snap-type: none`.
- Hero float computed `animation-name: none`.
- Hero motion container computed `transform: none`, `opacity: 1`.
- `document.getAnimations().length` was 0 at 100 ms after navigation.
- Navigation requested programmatic behavior `auto`.
- Wheel and PageDown synthetic events were not prevented.
- Fresh reduced-motion session console: 0 errors.

## Final verification

Command:

```text
npm test && npm run lint && npm run build
```

Results:

- Tests: 13 files passed, 25 tests passed, 0 failures.
- Lint: exit 0; 4 existing `@next/next/no-img-element` warnings in Footer, Hero, Members, and the unused TocFloating component.
- Build: exit 0; Next.js 16.2.4 TypeScript, optimized production compilation, static generation, and export all succeeded.
- `git diff --check`: clean.

## Concerns

- The repository/worktree lockfile arrangement continues to produce Next.js's existing inferred-workspace-root warning; it does not block the build.
- Current member and alumni records remain explicitly Mock data. Formal records can replace the exported arrays/content objects without component changes.
- The four raw-image lint warnings predate these final review fixes and remain warnings rather than errors.
