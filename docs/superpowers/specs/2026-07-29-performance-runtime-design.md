# Runtime Performance Optimization Design

## Goal

Remove font-download work from the first render and defer the JavaScript for animated sections that are outside the initial viewport, while preserving the existing page content and layout.

## Decisions

### System font stacks

The site will not ship web fonts. `globals.css` will define a Chinese-capable system sans-serif stack for the page text and a system monospace stack for metadata labels. The custom Patrick Hand, Space Mono, and Noto Sans SC package imports will be removed from the runtime dependency graph.

This eliminates font request and fallback-swap flicker. Typography can vary slightly across operating systems; that trade-off is accepted in favor of a stable first render.

### Viewport-triggered animated sections

`Mission` and `Timeline` will remain semantic sections in the page structure, but their animated implementations will not be imported until an IntersectionObserver sees a lightweight section placeholder close to the viewport. Each placeholder has the same section id and a reserved minimum height so hash links continue to work and the page does not jump when the implementation becomes available.

The first viewport keeps `Hero` and its static markup in the main entry chunk. `Mission` and `Timeline` retain their Framer Motion behavior after loading. No other content, navigation, color, spacing, or image behavior changes.

## Validation

- Unit tests prove that no `@fontsource` imports remain in global CSS and that the system font stacks are declared.
- Component tests prove the deferred section placeholder preserves its anchor id and triggers a dynamic module only after it intersects.
- `npm run test`, `npm run lint`, and `npm run build` pass.
- The exported production output has no `.woff2` files and has a smaller CSS asset than the current 438,990-byte stylesheet.
