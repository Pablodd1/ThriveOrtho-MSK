# Palette's Journal

## 2024-05-21 - Monolithic Structure and Accessibility
**Learning:** The application uses a single monolithic file (`src/index.tsx`) for most logic and rendering, which makes identifying reusable components harder. Accessibility gaps like icon-only buttons without ARIA labels are common in this structure as they are hardcoded HTML strings.
**Action:** When working in this repo, always check the hardcoded HTML strings in `src/index.tsx` for accessibility attributes, especially on interactive elements like buttons and "fake" checkboxes (`div`s with onclick).
