# Replace Interface Emojis with Lucide Icons

## Goal

Replace the interface emojis used in the team-profile and technical-direction cards, and replace the image viewer's text close control with an X icon. The page should retain its current content, interactions, and accessibility semantics.

## Approach

Add `lucide-react` and import only the ten required icons:

- Image viewer: `X`
- Team profile: `Users`, `Clock3`, `MessagesSquare`, `Code2`
- Technical directions: `Layers3`, `Bot`, `Gamepad2`, `ChartNoAxesCombined`, `Sparkles`

The icon components will be decorative (`aria-hidden`) because each card already exposes an adjacent text heading. The image-viewer button will retain the existing accessible name, `关闭图片查看`.

## UI Rules

- Use a consistent 22px dark outline icon treatment in the cards.
- Preserve every existing heading, description, card layout, and animation.
- Replace only the nine UI emojis identified in `Mission` and `directions`; do not alter emoji-like characters in user-facing copy elsewhere.
- Make the close button a compact, visible X icon button while retaining its click, backdrop-click, and Escape-key close paths.

## Performance

Use named imports from `lucide-react`; no icon registry or runtime icon lookup will be added. The existing deferred `ImageViewer` loading boundary remains unchanged.

## Verification

- Add tests that assert the visual glyph is no longer exposed as emoji text and the cards retain their labels.
- Assert the close button has the same accessible name while rendering an X SVG.
- Run focused tests, the full test suite, lint, and production build.
