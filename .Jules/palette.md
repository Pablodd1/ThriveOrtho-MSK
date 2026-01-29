## 2024-05-23 - Custom Checkboxes Accessibility
**Learning:** Hardcoded `div` elements used as checkboxes create significant accessibility barriers (no keyboard support, no screen reader state).
**Action:** Always add `role="checkbox"`, `tabindex="0"`, `aria-checked`, and keyboard event listeners (Enter/Space) when retrofitting non-semantic interactive elements.

## 2024-05-23 - Dynamic ARIA Labels
**Learning:** Icon-only buttons in lists (like patient actions) are unusable for screen readers without context.
**Action:** Include dynamic data (e.g., patient name) in `aria-label` attributes (e.g., "Start scan for [Name]") to provide necessary context.
