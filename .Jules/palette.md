## 2025-05-15 - Icon-Only Buttons
**Learning:** This app heavily relies on icon-only buttons for critical actions (scanning, recording, regenerating) without accessible labels. This is a common pattern in density-focused medical UIs but creates a significant barrier for screen reader users who miss the context.
**Action:** Always audit icon-only buttons in "compact" views and ensure they carry `aria-label` and `title` attributes that explicitly describe the action *and* the target (e.g., "Scan [Patient Name]" instead of just "Scan").
