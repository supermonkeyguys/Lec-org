# Mobile Cards Final Fix Report

## Scope

- Correct the final mobile card bottom selector so the final section is selected even when the footer follows it.
- Keep the Node Line visible below 768px and desktop navigation visible from 768px.
- Remove the desktop navigation scroll-padding from mobile cards.

## TDD Evidence

### RED

Command:

```sh
pnpm test src/styles/globals.test.ts src/components/TopNav.test.tsx
```

Before implementation, the command failed with three expected assertions:

- The mobile stylesheet lacked `.site-section:last-of-type` (and still contained `.site-section:last-child`).
- Desktop navigation had `sm:block` rather than `md:block`.
- Mobile Node Line had `sm:hidden` rather than `md:hidden`.

The newly added mobile scroll-padding assertion was part of the same stylesheet test; execution stopped at the prior selector failure.

### GREEN

After the minimal implementation, the same focused command passed: 2 test files, 7 tests.

### Full Suite

```sh
pnpm test
```

Passed: 20 test files, 75 tests.

## Files Changed

- `src/styles/globals.css`
- `src/styles/globals.test.ts`
- `src/components/MobileNodeLine.tsx`
- `src/components/TopNav.tsx`
- `src/components/TopNav.test.tsx`

## Self Review

- `.site-section:last-of-type` replaces the ineffective `:last-child` selector.
- The mobile media query resets `.site-scroll` to `scroll-padding-block-start: 0`.
- Node Line uses `md:hidden`; desktop TopNav uses `hidden md:block`.
- Existing Node Line button structure, ARIA/current state, click handler, focus classes, section data/order, and no-snap rules are unchanged.
- Desktop/default section styles remain unchanged.
