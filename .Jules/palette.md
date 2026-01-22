## 2024-05-23 - Hardcoded Dashboard Data
**Learning:** The dashboard patient list and assessment data are currently hardcoded in `src/index.tsx`, making dynamic updates impossible without code changes.
**Action:** Future refactoring should move this data to the database (D1) and fetch it dynamically to support real patient management.

## 2024-05-23 - Accessibility Gaps in Legacy Code
**Learning:** Many interactive elements, especially icon-only buttons, lacked basic accessibility attributes like `aria-label`, making them unusable for screen reader users.
**Action:** Systematically review all `<a>` and `<button>` tags during any touch of `src/index.tsx` to ensure `aria-label` or visible text is present.
