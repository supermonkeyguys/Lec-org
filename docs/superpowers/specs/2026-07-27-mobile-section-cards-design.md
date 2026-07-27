# Mobile section cards and compact node line

## Goal

Make the small-screen presentation read as a sequence of distinct content
panels, while preserving the desktop full-viewport section experience. Reduce
the visual weight of the mobile Node Line without making its controls too small
to tap.

## Scope

- Keep desktop sections full-width and viewport-sized.
- At widths below 768px, make every top-level site section a separate panel:
  - cream page background visible between panels;
  - a white panel background, hand-drawn border, rounded corners, and subtle
    shadow;
  - consistent horizontal and vertical exterior spacing;
  - first and final panels have balanced safe-area-aware page spacing.
- Remove the desktop top-navigation safety offset from mobile sections because
  mobile navigation is the fixed Node Line rather than a top bar.
- Extract the shared section outer element into `SectionShell`, which owns the
  section id, base section class, and the shared responsive panel behaviour.
- Keep each content component responsible only for its own internal layout and
  content.
- Reduce the Node Line button from `44px` to a compact 36px visual/touch
  control, then reduce the line and active dot proportions to match. The active
  label remains available and the buttons stay keyboard-accessible.

## Non-goals

- Do not redesign desktop navigation or desktop section styling.
- Do not change section ordering, copy, data, scrolling semantics, or active
  section calculation.
- Do not add a separate component library or a mobile-only navigation system.

## Architecture

`SectionShell` is a small presentational wrapper used by Hero, Mission,
Achievements, Directions, Alumni, Timeline, and Recruitment. It takes an `id`,
optional additional class names, and children. Its single DOM element remains a
semantic `section`, so `Layout` can keep locating sections by id and scrolling
to their existing `offsetTop` values.

The responsive visual rules remain in `globals.css` under the existing
`.site-section` selector. This keeps the responsive surface centralised and
makes the wrapper independent of a styling framework implementation detail.

`MobileNodeLine` continues to own its seven navigation controls. Only the
class-level sizing tokens change; navigation callbacks and ARIA labels stay as
they are.

## Verification

- Extend component tests to verify each primary component uses `SectionShell`.
- Extend stylesheet tests to verify the mobile section panel rules, mobile
offset reset, and absence of snap scrolling.
- Update Node Line tests for the compact button size and preserve direct
navigation checks.
- Run targeted tests first, then the full test suite, lint, production build,
and a 390px browser smoke test covering visible panel separation and Node Line
interaction.
