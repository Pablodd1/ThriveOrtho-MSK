from playwright.sync_api import sync_playwright, expect

def verify_accessibility(page):
    # 1. Verify Doctor Dashboard Buttons
    print("Navigating to Doctor Dashboard...")
    page.goto("http://localhost:3000/doctor")
    page.wait_for_selector(".btn-primary")

    # Check patient buttons
    print("Checking patient buttons...")
    # Find the button for Marcus Williams (P001)
    # The selector targets the link with the specific href
    btn_p001 = page.locator('a[href="/doctor/joints?patient=P001"]')
    aria_label = btn_p001.get_attribute("aria-label")
    print(f"P001 Button aria-label: {aria_label}")
    assert aria_label == "Start full body scan for Marcus Williams", "P001 button missing correct aria-label"

    btn_p002 = page.locator('a[href="/doctor/joints?patient=P002"]')
    aria_label = btn_p002.get_attribute("aria-label")
    print(f"P002 Button aria-label: {aria_label}")
    assert aria_label == "Start full body scan for Patricia Chen", "P002 button missing correct aria-label"

    # Check Task Items
    print("Checking task items...")
    tasks = page.locator(".task-check")
    count = tasks.count()
    print(f"Found {count} task checks")
    assert count > 0, "No task checks found"

    for i in range(count):
        task = tasks.nth(i)
        role = task.get_attribute("role")
        aria_checked = task.get_attribute("aria-checked")
        tabindex = task.get_attribute("tabindex")
        aria_label_task = task.get_attribute("aria-label")

        print(f"Task {i}: role={role}, aria-checked={aria_checked}, tabindex={tabindex}, label={aria_label_task}")
        assert role == "checkbox", f"Task {i} missing role=checkbox"
        assert aria_checked == "false", f"Task {i} missing aria-checked=false"
        assert tabindex == "0", f"Task {i} missing tabindex=0"
        assert aria_label_task == "Mark task as complete", f"Task {i} missing aria-label"

    # Test toggling a task
    print("Testing task toggle...")
    first_task = tasks.first
    first_task.click()
    expect(first_task).to_have_attribute("aria-checked", "true")
    print("Task toggle successful (aria-checked updated to true)")

    page.screenshot(path="verification/dashboard_a11y.png")
    print("Dashboard screenshot saved.")

    # 2. Verify Voice Intake Button
    print("Navigating to Voice Intake...")
    page.goto("http://localhost:3000/doctor/intake")
    page.wait_for_selector("#voiceBtn")

    voice_btn = page.locator("#voiceBtn")
    voice_label = voice_btn.get_attribute("aria-label")
    print(f"Voice Button aria-label: {voice_label}")
    assert voice_label == "Start voice recording", "Voice button missing correct aria-label"

    page.screenshot(path="verification/intake_a11y.png")
    print("Intake screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_accessibility(page)
            print("All accessibility verifications passed!")
        except Exception as e:
            print(f"Verification failed: {e}")
            exit(1)
        finally:
            browser.close()
