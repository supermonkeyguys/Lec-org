# Alumni Grade Tabs Design

## Goal

Replace the vertically stacked alumni cohort sections with compact grade tabs so visitors view one grade at a time.

## Design

The existing `cohort` data stays unchanged and is presented as a grade label: `2022级`, `2021级`, and so on. `Alumni` derives the available grades in descending order, initializes its selected grade to the newest available grade, and renders a top row of buttons under the section introduction.

Clicking a grade button updates only the member grid for that grade. Buttons use a tablist/tab/tabpanel relationship with `aria-selected` and `aria-controls`; the selected grade has the existing ink active treatment. The empty state remains unchanged when no alumni data exists. Member cards and outcome presentation do not change.

## Validation

- Component tests verify newest-grade default selection, grade labels, visible members changing on selection, and tab ARIA state.
- Full tests, lint, and production build pass.
