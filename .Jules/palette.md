# Palette's Journal

## 2025-02-21 - Icon-Only Buttons in Monolithic HTML
**Learning:** This app uses large template literals for server-side rendering. Icon-only buttons (like "Scan" or "Regenerate") are hardcoded without accessible names, creating a pattern where screen reader users cannot determine the button's purpose or target (e.g., "Scan" vs "Scan Marcus Williams").
**Action:** When working with Hono template literals, manually audit all `<a>` and `<button>` tags containing only `<i>` elements and ensure they have descriptive `aria-label` attributes.
