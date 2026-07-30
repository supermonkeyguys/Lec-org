# Deferred interactive sections design

## Goal

Reduce JavaScript downloaded before the user reaches interactive below-the-fold
content, while keeping the existing alumni tabs, card animation, and team-photo
viewer available when a visitor needs them.

## Scope

- Move the Alumni component behind the existing `DeferredSection` boundary and
  a client-only dynamic import, matching the existing Mission and Timeline
  loading model.
- Keep an immediate semantic placeholder with `id="alumni"` so Node Line,
  desktop navigation, and in-page links retain their current destinations.
- Split `ImageViewer` from Mission's initial module. Its code must only load
  after a visitor selects a team photo.
- Preserve all existing image viewer accessibility and behaviour: dialog
  semantics, Escape close, backdrop close, close button, and image content.
- Preserve alumni tab keyboard interaction, selected cohort behaviour, and
  card animation once the section has loaded.

## Non-goals

- Do not remove `framer-motion` or replace the current animations with CSS.
- Do not change section order, data, copy, image assets, navigation APIs, or
  page visual design.
- Do not alter GitHub Pages cache headers; that is a deployment-platform
  concern separate from unused JavaScript reduction.

## Architecture

`pages/index.tsx` will give Alumni the same two-layer boundary used by Mission
and Timeline: `next/dynamic` creates a separate client chunk, while
`DeferredSection` owns the permanent top-level section id and loads children
when the section approaches the viewport. The deferred component receives
`id={null}` to prevent duplicate section ids.

Mission keeps the selected-image state. It declares a dynamic ImageViewer
component but mounts it only when `selectedImage` is non-null. This ensures the
photo-viewer chunk is requested only after a photo click, and its existing props
remain the interface to the viewer.

## Error handling and loading

The existing `DeferredSection` placeholder remains the loading surface for
Alumni. The image viewer uses no loading UI because the selection remains in
component state and the dialog appears as soon as its small client chunk has
loaded; failure is handled by retaining the source page and leaving the photo
button usable for a retry.

## Verification

- Extend page performance tests to require all three below-fold interactive
  sections (Mission, Alumni, Timeline) to be dynamic modules inside matching
  `DeferredSection` wrappers.
- Extend Mission tests to prove ImageViewer is not mounted until a photo is
  selected and still receives the selected image and close callback afterward.
- Run focused tests, full tests, lint, production build, and browser checks:
  navigation to the unloaded Alumni section, its tab interaction after load,
  and photo viewer opening/closing after a click.
- Compare the production client chunk graph or bundle report before and after
  the change; verify that Alumni's animation code is absent from the initial
  page chunk and ImageViewer is a separate chunk.
