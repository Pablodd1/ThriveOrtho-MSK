## 2024-05-22 - Accessibility Improvements in Dashboard
**Learning:** Icon-only buttons (like "Full Body Scan" and voice controls) are common in this dashboard but completely invisible to screen readers without `aria-label`. Interactive divs used for tasks need explicit roles and keyboard handlers to be accessible.
**Action:** When creating icon-only interactive elements, always include `aria-label`. When using non-standard elements (divs) for interaction, enforce `role`, `tabindex`, and `keydown` handlers, or prefer native `<button>` elements.
