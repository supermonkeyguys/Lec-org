# Recent Activity and Image Viewer Design

## Goal

Improve the homepage's in-page navigation and turn the former team-history section into a current activity feed sourced from `news.xlsx`.

## Scope

1. The hero CTA scrolls to the excellent-member section within the existing scroll container instead of relying on hash navigation.
2. Only the six images in the team-profile image wall open in an image viewer.
3. The `history` section becomes `我们最近在` and displays every valid workbook event in descending year-month order.

## Navigation

`Layout` remains the single owner of in-page navigation. It will provide its existing navigation handler to `Hero`, so the CTA uses the same scroll container, smooth-scroll behavior, reduced-motion fallback, and active-navigation lock as the top and mobile navigation controls.

## Image Viewer

`Mission` owns the selected image state and opens a reusable viewer for the existing six image-wall assets. The viewer is a fixed modal overlay with the largest available image, accessible label, close button, backdrop dismissal, and Escape dismissal. It does not apply to the hero logo or recruitment QR code, and it introduces no third-party dependency.

## Recent Activity Data

A `news-import` script reads `news.xlsx`, validates the `时间` and `事件` headers, discards blank events, normalizes `YYYY.MM`, `YYYY.M`, and `YYYY-MM` dates into `{ year, month }`, and writes a generated data module. Events are sorted descending by normalized year-month; events in the same month retain the workbook's source order.

The new data module exposes compact date labels, titles, and stable IDs. The UI uses a simple vertical feed with the newest activity first. It replaces the temporary historical milestone copy entirely.

## Error Handling and Testing

- The importer rejects malformed headers and dates, preserving the existing generated file on failure.
- Import tests cover date normalization, blank-row exclusion, order, and atomic output behavior.
- Component tests cover CTA delegation, viewer open/close interactions, and newest-first activity rendering.
- The implementation follows the existing reduced-motion and deferred-section behavior.
