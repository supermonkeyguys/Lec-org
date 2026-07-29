# Local Display Fonts Design

## Goal

Restore the original handwritten and monospace visual style without reintroducing Google Fonts, full Chinese web fonts, or late font swaps.

## Design

Use `next/font/local` with the local Latin subset files supplied by `@fontsource/patrick-hand` and `@fontsource/space-mono`. The application receives CSS variables for Patrick Hand and Space Mono; the existing Chinese-capable system sans-serif stack remains the fallback for glyphs those display fonts do not contain.

Load Patrick Hand 400 and Space Mono 400/400 italic/700/700 italic only. Set `display: "optional"`: a fast first visit renders the bundled visual fonts, while a slower visit retains the immediately available system fallback instead of swapping after first paint.

Noto Sans SC is not restored. Its full Chinese subset mapping previously produced a 438,990-byte CSS file and 419 font assets. No layout, copy, image, route-loading behavior, or colors change.

## Validation

- Tests confirm `next/font/local`, `display: "optional"`, and the five intended local font files are declared.
- The production build succeeds with no Google font URL and no Noto Sans SC artifact.
- The generated output contains only the five intended display-font assets and keeps CSS below the prior 438,990-byte full-Chinese-font baseline.
