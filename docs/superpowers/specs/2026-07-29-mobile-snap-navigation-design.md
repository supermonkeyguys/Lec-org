# Mobile Snap Navigation Design

## Goal

Give each mobile content section a full-screen surface and gentle boundary snapping without interrupting long-form reading, while moving the fixed navigation away from the left content edge.

## Design

At widths below 768px, the scroll root uses `scroll-snap-type: y proximity` and each `.site-section` uses `scroll-snap-align: start`. Sections have a `min-height` of `100svh`; sections taller than the viewport retain their native continuous scrolling because proximity snapping and the default snap-stop do not force a jump through internal content.

Mobile sections lose their exterior card margins and rounded-card chrome so each owns the full viewport width. Their padding includes top and bottom safe-area space. Reduced-motion users keep native unsnapped scrolling.

Replace the left-center `MobileNodeLine` with a fixed, bottom-center horizontal navigation capsule. It keeps the same seven labelled buttons and active-state semantics but uses compact dot controls. The content scroll root receives bottom padding equal to the capsule safe area so the navigation does not cover the final content.

## Validation

- Stylesheet tests confirm mobile proximity snapping, full-screen section sizing, absence of card margins, and reduced-motion snap removal.
- Navigation tests confirm the mobile control has bottom-center positioning, horizontal layout, and unchanged accessible labels.
- Full test suite, lint, and production build pass; a 390px preview confirms sections snap near boundaries and long sections can scroll internally.
