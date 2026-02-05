## 2026-02-05 - [Task Checkbox Accessibility]
**Learning:** Custom interactive elements (like divs used as checkboxes) are often overlooked for accessibility. They require semantic roles (), state attributes (), tabindex (), and keyboard handlers (/) to be equivalent to native controls.
**Action:** When identifying custom controls in legacy code, prioritize replacing them with native elements or fully augmenting them with ARIA and keyboard support immediately.
## 2026-02-05 - [Task Checkbox Accessibility]
**Learning:** Custom interactive elements (like divs used as checkboxes) are often overlooked for accessibility. They require semantic roles (`role="checkbox"`), state attributes (`aria-checked`), tabindex (`0`), and keyboard handlers (`Enter`/`Space`) to be equivalent to native controls.
**Action:** When identifying custom controls in legacy code, prioritize replacing them with native elements or fully augmenting them with ARIA and keyboard support immediately.
