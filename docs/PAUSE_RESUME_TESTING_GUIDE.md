# 🧪 Pause/Resume Assessment - Quick Testing Guide

**Feature:** Pause/Resume functionality for assessment interruptions  
**Test Duration:** 5-10 minutes  
**Priority:** HIGH (real-world usability feature)

---

## 🎯 Quick Test (2 minutes)

### Test Flow
1. Start Quick Assessment from dashboard
2. Start recording for Squat exercise
3. Do 2 squats (watch counter increment)
4. Click **Pause Assessment** (yellow button)
5. Notice:
   - Button turns green "Resume Assessment"
   - Status shows "Paused"
   - Voice says "Assessment paused"
6. Do more squats - **counter should NOT change**
7. Click **Resume Assessment**
8. Notice:
   - Button turns yellow "Pause" again
   - Status shows "Recording..."
   - Voice says "Resuming now"
9. Do 3 more squats - counter continues from where it left off
10. Click Stop Recording
11. Duration should show ~10-15 seconds (excludes pause time)

**Expected Result:** ✅ All behaviors work correctly

---

## 🔄 Recovery Test (3 minutes)

### Test Flow
1. Start a regular assessment (not quick mode)
2. Start recording for first exercise
3. Do 5 reps
4. Click **Pause Assessment**
5. Open browser console and check for:
   ```
   📝 Assessment progress saved to localStorage
   ```
6. **Close the browser tab completely**
7. Reopen assessment page for same patient
8. Wait 2 seconds
9. Dialog should appear:
   ```
   Found incomplete assessment from [time].
   
   Exercise: Squat
   Reps completed: 5
   
   Would you like to resume where you left off?
   ```
10. Click **OK**
11. Verify:
    - Correct exercise displayed
    - Rep count shows 5
    - Can continue recording

**Expected Result:** ✅ Progress restored correctly

---

## 🚫 No Dialog Test (1 minute)

### Test Flow
1. Start fresh assessment
2. Start recording
3. Do 3 reps
4. Click Stop Recording (complete normally)
5. Refresh page
6. **No resume dialog should appear**

**Why:** Progress is cleared on successful completion

**Expected Result:** ✅ Clean slate for new assessment

---

## ⏰ Expiration Test (Optional - 1 minute)

### Test Flow
1. Save progress (pause during assessment)
2. Open browser console
3. Manually expire the saved data:
```javascript
let p = JSON.parse(localStorage.getItem('assessmentProgress'));
p.timestamp = new Date(Date.now() - 25*60*60*1000).toISOString(); // 25 hours ago
localStorage.setItem('assessmentProgress', JSON.stringify(p));
```
4. Refresh page
5. **No dialog should appear**
6. Check console for automatic cleanup

**Expected Result:** ✅ Old data cleaned up automatically

---

## 🎮 Multiple Pause Test (2 minutes)

### Test Flow
1. Start recording
2. Do 2 reps
3. Pause
4. Wait 5 seconds
5. Resume
6. Do 2 reps
7. Pause again
8. Wait 5 seconds
9. Resume again
10. Do 2 reps
11. Stop recording
12. Check duration - should exclude both pause periods (~20-25 seconds, not 30+)

**Expected Result:** ✅ Multiple pauses handled correctly

---

## 🐛 Edge Cases to Check

### 1. Pause at Zero Reps
- Start recording
- Immediately pause (before any reps)
- Resume
- Continue normally

**Expected:** ✅ Works fine

### 2. Stop While Paused
- Start recording
- Do 3 reps
- Pause
- Click Stop Recording
- Analysis should show correct duration

**Expected:** ✅ Works fine

### 3. Next Exercise After Pause
- Complete first exercise (with pause)
- Click "Next Exercise"
- Verify no resume dialog on page refresh

**Expected:** ✅ Progress cleared

---

## 📊 Visual Indicators Checklist

During pause/resume cycles, verify:

- [ ] **Pause Button Color:** Yellow when recording
- [ ] **Resume Button Color:** Green when paused
- [ ] **Button Icon:** Pause icon (❚❚) when recording, Play icon (▶) when paused
- [ ] **Status Badge:** Shows "Recording..." in red, "Paused" in yellow
- [ ] **Toast Notification:** Appears for pause/resume actions
- [ ] **Voice Feedback:** Audio announcements (if enabled)
- [ ] **Rep Counter:** Frozen when paused, increments when recording

---

## 🎤 Voice Feedback Test

If audio is enabled:

1. Pause assessment
   - Should hear: "Assessment paused. Take your time. Click resume when ready."

2. Resume assessment
   - Should hear: "Resuming now. Continue the exercise."

**Note:** Voice priority is "high" so it should interrupt other instructions

---

## 🔍 Console Logs to Watch

During testing, open browser console and look for:

```
📝 Assessment progress saved to localStorage
✅ Assessment progress restored!
```

**No errors should appear related to:**
- localStorage operations
- STATE variable access
- Function calls

---

## ✅ Success Criteria

**All tests PASS if:**

1. ✅ Pause/resume cycles work smoothly
2. ✅ Rep counting freezes during pause
3. ✅ Duration calculations exclude paused time
4. ✅ Progress saves to localStorage
5. ✅ Resume dialog appears with correct data
6. ✅ Progress clears on completion
7. ✅ Old data expires after 24 hours
8. ✅ UI indicators update correctly
9. ✅ No JavaScript errors in console
10. ✅ Voice feedback works (if audio enabled)

---

## 🚨 Known Limitations

1. **Camera Feed Continues:** Live video and skeleton overlay still update when paused (this is intentional - allows clinician to monitor patient)

2. **Medical Scribe Continues:** Voice recognition continues during pause (this is intentional - allows capturing patient comments during breaks)

3. **Client-Side Only:** Progress stored in localStorage (not database) - works for single device only

4. **24-Hour Window:** Progress expires after 24 hours (configurable in code if needed)

---

## 🛠️ Troubleshooting

### Problem: No pause button visible
**Solution:** Start recording first - button only appears during active recording

### Problem: Resume dialog doesn't appear
**Solutions:**
1. Check if assessment was completed normally (progress cleared)
2. Check if >24 hours passed (expired)
3. Check localStorage in browser dev tools: `localStorage.getItem('assessmentProgress')`

### Problem: Rep count still increments when paused
**Solution:** Hard refresh browser (Ctrl+Shift+R) to clear cached JavaScript

### Problem: Duration includes paused time
**Solution:** Check that `STATE.pausedTime` is accumulating correctly in console

---

## 📞 If Tests Fail

1. Check browser console for errors
2. Verify build completed successfully: `npm run build`
3. Verify PM2 service running: `pm2 list`
4. Hard refresh browser to clear cache
5. Check git commit: `13a718b` contains all changes

**If issues persist:** Check `/home/user/webapp/docs/PHASE2_TASK1_COMPLETE.md` for detailed implementation notes

---

**Happy Testing! 🧪✨**
