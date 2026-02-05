## 2024-05-22 - Monolithic Architecture & Accessibility Gaps
**Learning:** The application is a massive single-file Hono app (`src/index.tsx`), which makes widespread changes risky. Interactive elements like icon-only buttons and custom checkboxes lack basic accessibility attributes (ARIA labels, keyboard support).
**Action:** Focus on high-impact, targeted accessibility fixes. Use `grep` to locate specific lines in the monolith. Always implement keyboard support for custom interactive elements (`div` buttons).
