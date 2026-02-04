## 2025-02-20 - Custom Role Selector Accessibility
**Learning:** Custom interactive elements (like div/button based role selectors) often lack ARIA states (like aria-pressed), making them opaque to screen readers.
**Action:** Always add aria-pressed or aria-checked to custom toggle/selection buttons and ensure they are updated via JS.
