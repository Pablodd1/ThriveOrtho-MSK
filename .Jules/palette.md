## 2026-01-31 - Dynamic ARIA Labels in Vanilla JS
**Learning:** Icon-only toggle buttons (like recording start/stop) require dynamic `aria-label` updates to communicate state changes to screen readers, especially when the icon class changes visually.
**Action:** When implementing toggle logic in `src/index.tsx`, always include `element.setAttribute('aria-label', 'New State')` alongside class changes.
