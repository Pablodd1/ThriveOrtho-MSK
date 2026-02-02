## 2024-05-22 - Custom HTML Template Functions
**Learning:** This Hono-based app uses a custom `html` string interpolation function in `src/index.tsx` rather than the standard `jsxRenderer` or Hono middleware for layout. This means global markup changes (like adding a skip link or meta tags) must be done in this specific function rather than a layout component.
**Action:** When making global a11y changes, look for the `const html =` definition in `src/index.tsx` first.
