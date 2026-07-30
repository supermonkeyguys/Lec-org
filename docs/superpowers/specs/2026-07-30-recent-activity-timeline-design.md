# Recent Activity Timeline Design

## Goal

Present the existing newest-first recent-activity feed as a compact timeline that reveals records in manageable batches.

## Layout

On desktop (`sm` and above), the activity area has a vertical center line. Activity cards alternate left and right around that line, with a circular node at the center for every record. Left-side cards are offset upward by `8px` relative to their adjacent right-side position, producing a subtle hand-made stagger while retaining clear chronological order.

On narrow screens, cards return to a single-column list with the timeline line and nodes aligned to the left. This prevents long Chinese activity text from becoming too narrow. The source ordering remains unchanged: newest record first.

## Progressive Disclosure

The component initially renders the first eight records. A `加载更多` button appears below the visible entries whenever additional records remain. Each click increases the visible count by eight. Once every imported activity is visible, the button is removed.

## Accessibility and Motion

Cards remain semantic `article` elements and dates remain `time` elements. The load-more control is a native button with a visible remaining-count label. The section header may retain its current motion, but individual feed records do not receive per-item animation so expanding a long feed stays responsive.

## Testing

Component tests will assert the initial count, the next batch after activating the button, the absence of the control once all content is shown, and the newest-first first record. The layout classes will be kept deterministic and covered by a source-level assertion for the center line and left-side offset.
