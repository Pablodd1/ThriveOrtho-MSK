## 2026-02-06 - Icon-Only Button Accessibility
**Learning:** The "Start Assessment" buttons in the dashboard were icon-only (`<i class="fas fa-bone">`) and lacked accessible names, making them invisible to screen readers.
**Action:** Always verify icon-only interactive elements have `aria-label` and `title` attributes describing the action and context (e.g., "Start assessment for [Patient Name]").
