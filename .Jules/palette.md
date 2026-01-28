## 2025-05-21 - Non-Semantic Interactive Elements
**Learning:** The app uses `div` elements with `onclick` handlers for interactive controls (like checkboxes), which excludes keyboard users and screen readers.
**Action:** Replace with semantic `<button>` or `<input>` where possible, or rigorously apply ARIA roles (`role="checkbox"`) and `tabindex="0"` with keyboard handlers.
