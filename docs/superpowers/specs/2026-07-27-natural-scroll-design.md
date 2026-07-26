# Natural scrolling design

## Goal

Remove the desktop pause and jitter that occurs at section boundaries while keeping the site navigation useful and accessible.

## Decision

Use the browser's native scrolling for every input method and viewport size. The scroll container will no longer intercept wheel or paging-key events, and sections will no longer use mandatory scroll snapping. The existing intersection observer continues to identify the active navigation item.

Top-navigation links remain an intentional navigation control: selecting one scrolls the matching section into view smoothly, except when the user has requested reduced motion.

## Alternatives considered

1. Tune the 700 ms wheel throttle. This still overrides trackpad input and cannot eliminate competing snap behavior.
2. Keep snapping but remove wheel interception. This reduces code but mandatory snapping can still interrupt continuous scrolling at long section boundaries.
3. Use native scrolling and retain explicit navigation links. Chosen because it removes both competing controllers while preserving direct section navigation.

## Tests

- A desktop wheel event and PageUp/PageDown event are not prevented and do not call `scrollTo`.
- A top-navigation click still calls `scrollTo` with smooth behavior, or auto behavior for reduced motion.
- Global styles keep the shared navigation offset but do not enforce mandatory snapping or `scroll-snap-stop`.
