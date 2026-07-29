# Final Review Fix Report

## Scope

Addressed the final review findings for font variable scope, keyboard
interruption of pending smooth navigation, and accessible alumni grade tabs.

## RED evidence

Before changing production code, added focused regression coverage and ran:

```text
npm test -- src/test/fonts.test.ts src/components/Layout.test.tsx src/components/Alumni.test.tsx
```

Result: 3 test files failed, with 12 failed tests and 9 passing tests.

- `fonts.test.ts` failed because `_document.tsx` did not import `fontVariables`
  or apply them to `<body>`.
- The eight parameterized keyboard-scroll assertions in `Layout.test.tsx`
  failed because a pending smooth navigation kept the clicked section active
  after ArrowUp, ArrowDown, PageUp, PageDown, Home, End, `Space`, or the
  literal space key.
- `Alumni.test.tsx` failed because inactive tabs had no controlled panels,
  tabs did not use roving `tabIndex`, and Arrow navigation did not move focus
  or selection.

## GREEN evidence

Implemented the smallest changes that satisfy the new regression coverage:

- Move `fontVariables` from the descendant wrapper in `_app.tsx` to the
  server-rendered document `<body>`, so the `body` hand-font declaration can
  resolve `--font-lec-hand` while descendants retain both font variables.
- Clear a pending smooth-navigation target on standard user scroll keys,
  including `" "`, without preventing the browser's native keyboard scroll.
- Keep one alumni `tabpanel` per grade in the DOM, hide inactive panels, and
  use a focusable roving-tab implementation with wrapping Arrow keys plus
  Home and End.

Focused verification:

```text
npm test -- src/test/fonts.test.ts src/components/Layout.test.tsx src/components/Alumni.test.tsx
Test Files  3 passed (3)
Tests  21 passed (21)
```

Required verification:

```text
npm test
Test Files  28 passed (28)
Tests  97 passed (97)

npm run lint
exit 0; 5 warnings, 0 errors

npm run build
Next.js 16.2.4 production build completed successfully
```

## Files committed

- `src/pages/_app.tsx`
- `src/pages/_document.tsx`
- `src/test/fonts.test.ts`
- `src/components/Layout.tsx`
- `src/components/Layout.test.tsx`
- `src/components/Alumni.tsx`
- `src/components/Alumni.test.tsx`
- `.superpowers/sdd/final-review-fix-report.md`

Commit message: `fix: address final review accessibility findings`.

## Concerns

`npm run lint` succeeds with five existing `@next/next/no-img-element`
warnings in `Footer.tsx`, `Hero.tsx`, `Mission.tsx`, `Recruitment.tsx`, and
`TocFloating.tsx`. They are outside this repair and were not changed.
