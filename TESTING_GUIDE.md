# 🧪 Medical Scribe System - Testing Guide

## Quick Test Scenarios

### ✅ Scenario 1: Basic Microphone Test (30 seconds)

**Steps:**
1. Go to: https://3000-isoavrqar3ev1h6ka8wvl-cc2fbc16.sandbox.novita.ai
2. Click "Dashboard" → "Start Quick Assessment"
3. Select any camera type (Phone/Laptop/External/Pro)
4. **IMPORTANT:** Allow BOTH camera AND microphone permissions
5. Wait for Medical Scribe panel to appear (should be automatic)
6. Speak clearly: **"Testing one two three"**

**Expected Results:**
- ✅ Medical Scribe panel visible
- ✅ Green pulsing mic icon
- ✅ "Listening..." status
- ✅ Text appears in "LIVE TRANSCRIPT" box
- ✅ After you finish, text moves to "TRANSCRIPT LOG"
- ✅ Transcript Count shows "1"
- ✅ Words Spoken increases

---

### 🚨 Scenario 2: Pain Complaint Detection (1 minute)

**Test Phrases** (speak one at a time, pause between):
1. **"My knee hurts when I squat"**
2. **"I feel sharp pain in my shoulder"**
3. **"This exercise is uncomfortable"**
4. **"My back feels stiff"**

**Expected Results for EACH phrase:**
- 🚨 Large red alert overlay appears in center
- 📹 Camera border flashes red
- 🔊 Beep sound plays
- 📝 Complaint added to "PAIN COMPLAINTS" section
- 📊 Complaint Counter increments
- ⏱️ Alert disappears after 2 seconds

**What to Check:**
- Pain type classification (SHARP PAIN, STIFFNESS, etc.)
- Timestamp is correct
- Exercise name is shown
- Rep count is recorded

---

### 📊 Scenario 3: Statistics Tracking (2 minutes)

**Steps:**
1. Continue speaking various phrases (mix of normal and pain complaints)
2. Watch the statistics boxes at top of panel

**What to Track:**
- 🚨 **Complaints** - Should match number of pain statements
- 📝 **Transcripts** - Should match entries in transcript log
- 💬 **Words** - Should increase as you speak more

**Test Statements:**
- Normal: "This is my first time here"
- Pain: "My ankle hurts"
- Normal: "I feel good about this exercise"
- Pain: "Sharp pain in my wrist"
- Normal: "Thank you for helping me"

**Expected Final Stats:**
- Complaints: 2
- Transcripts: 5
- Words: ~30-40 (depends on exact wording)

---

### 💾 Scenario 4: Transcript Export (1 minute)

**Steps:**
1. After speaking 5+ phrases (mix of normal + pain)
2. Click **"Export Transcript"** button at bottom of panel
3. Check your downloads folder

**Expected Results:**
- ✅ `.txt` file downloads
- ✅ Filename format: `medical-scribe-{patient_id}-{timestamp}.txt`
- ✅ File contains:
  - Patient info
  - Session date/time
  - Statistics summary
  - Pain complaints section
  - Full transcription log
  - Proper formatting with boxes/lines

**Sample File Structure:**
```
═══════════════════════════════════════════════════
MEDICAL SCRIBE TRANSCRIPT
═══════════════════════════════════════════════════

Patient: John Smith
Session Date: 10/23/2025
...

🚨 PAIN COMPLAINTS

[1] 14:23:45 - SHARP PAIN
    Complaint: "My knee hurts"
    ...

📋 FULL TRANSCRIPTION LOG

[1] 14:23:20
    "This is my first time here"
    ...
```

---

### 🔄 Scenario 5: Microphone Toggle (30 seconds)

**Steps:**
1. While microphone is active (green icon pulsing)
2. Click **[Stop]** button (top-right, red)
3. Speak - nothing should happen
4. Click **[Start]** button (now green)
5. Speak again

**Expected Results:**
- **After Stop:**
  - ⭕ Icon stops pulsing, turns gray
  - ⏸️ Status shows "Stopped"
  - 🔇 Speaking does NOT create transcripts
  
- **After Start:**
  - 🟢 Icon resumes pulsing, turns green
  - 🎤 Status shows "Listening..."
  - 🔊 Speaking creates transcripts again

---

### 🏋️ Scenario 6: During Actual Exercise (3 minutes)

**Steps:**
1. Click **[Start Recording]** (main red button)
2. Start performing the exercise (e.g., squats)
3. While exercising, speak:
   - "One" (as you do rep 1)
   - "This is harder than I thought"
   - "My knee hurts at the bottom" (during rep 3)
   - "Five" (as you do rep 5)

**Expected Results:**
- ✅ Rep counter increments as you move
- ✅ All speech is transcribed
- ✅ "My knee hurts" triggers complaint alert
- ✅ Complaint shows correct rep count (Rep 3)
- ✅ Exercise name appears in transcript
- ✅ After target reps, recording stops automatically

---

### 🩺 Scenario 7: Clinical Pain Keywords Test

**Test ALL these phrases one by one:**

**Should Trigger Alerts:**
1. "It hurts right here" ✅
2. "I have pain in my lower back" ✅
3. "This feels painful" ✅
4. "My shoulder aches" ✅
5. "That's sore" ✅
6. "It's uncomfortable to move" ✅
7. "Sharp pain when I twist" ✅
8. "Dull ache in my hip" ✅
9. "Burning sensation" ✅
10. "My knee is stiff" ✅
11. "Tight muscles" ✅
12. "Feels tender to touch" ✅
13. "Throbbing in my elbow" ✅
14. "Shooting pain down my leg" ✅
15. "Pinching feeling" ✅
16. "Cramping in my calf" ✅
17. "Muscle spasm" ✅
18. "My arm feels weak" ✅
19. "Numbness in my hand" ✅
20. "Tingling in my fingers" ✅
21. "Can't move my neck" ✅
22. "Difficult to lift my arm" ✅
23. "Hard to walk on this leg" ✅

**Should NOT Trigger Alerts:**
1. "This feels good" ❌
2. "I'm doing great" ❌
3. "Nice stretch" ❌
4. "Feeling better" ❌
5. "Thank you" ❌

---

## 🎯 Browser Compatibility Testing

### **Chrome/Edge (Best Support) - 95% Expected**
- Full Speech Recognition ✅
- Audio Recording ✅
- All features work ✅

### **Safari (Good Support) - 85% Expected**
- Speech Recognition (webkit prefix) ✅
- Audio Recording ✅
- May need explicit permission each time ⚠️

### **Firefox (Limited Support) - 60% Expected**
- Speech Recognition may not work ❌
- Audio Recording should work ✅
- Graceful degradation - app still usable ⚠️

**Test on:**
- Desktop Chrome
- Mobile Chrome (Android)
- Desktop Safari
- Mobile Safari (iOS)
- Desktop Edge

---

## 🐛 Common Issues & Solutions

### Issue: "Speech recognition not supported"
**Fix:** Use Chrome, Edge, or Safari

### Issue: No transcription appearing
**Check:**
1. Microphone icon is green and pulsing?
2. Speaking loud enough?
3. Background noise too high?
4. Correct language (English)?

**Fix:**
- Speak clearly at normal volume
- Reduce background noise
- Try: "Testing one two three"

### Issue: Pain complaints not triggering
**Check:**
1. Using explicit pain words? ("hurt", "pain", "sore")
2. Speaking clearly?

**Fix:**
- Use direct pain terms
- Speak one sentence at a time
- Pause briefly between statements

### Issue: Recording time not updating
**This is normal if:**
- Microphone was stopped
- Page was refreshed

**Fix:**
- Check microphone status is "Listening..."
- Click [Start] if stopped

### Issue: Export button does nothing
**Check:**
1. Browser blocking downloads?
2. Any transcripts recorded?

**Fix:**
- Allow downloads in browser
- Speak at least one sentence first
- Try clicking button again

---

## 📱 Mobile Testing Checklist

### iPhone/iPad (Safari)
- [ ] Camera permission granted
- [ ] Microphone permission granted
- [ ] Speech recognition working
- [ ] Transcripts appearing
- [ ] Complaints detected
- [ ] Export working

### Android (Chrome)
- [ ] Camera permission granted
- [ ] Microphone permission granted
- [ ] Speech recognition working
- [ ] Transcripts appearing
- [ ] Complaints detected
- [ ] Export working

**Mobile-Specific Notes:**
- May need to grant permissions each session
- Some devices auto-pause when screen locks
- Keep screen on during session
- Use headset microphone for better quality

---

## 🎬 Full Session Test (5 minutes)

**Complete Workflow Test:**

1. **Start** (30s)
   - Open app → Dashboard → Quick Assessment
   - Select camera → Allow permissions
   - Verify microphone auto-starts

2. **Introduction** (30s)
   - Say: "Hello, this is my first session"
   - Verify transcript appears
   - Check stats update

3. **Exercise Begin** (2 min)
   - Click [Start Recording]
   - Perform 3 reps of exercise
   - Say: "One", "Two", "Three"
   - Verify rep counter updates

4. **Pain Report** (1 min)
   - Say: "My knee hurts during the squat"
   - Verify red alert appears
   - Verify complaint logged with rep count

5. **Continue** (1 min)
   - Complete remaining reps
   - Say: "That was tough" or "Feeling tired"
   - Verify normal transcripts logged

6. **Finish** (30s)
   - Exercise completes automatically
   - Verify microphone still running
   - Click [Export Transcript]
   - Verify file downloads

7. **Complete** (30s)
   - Click [Complete Assessment]
   - Verify redirects to medical note page
   - Check if transcript data appears (future step)

---

## 📊 Success Criteria

### ✅ All Green = System Working Perfectly

**Basic Functionality:**
- [x] Microphone starts automatically
- [x] Live transcription appears
- [x] Final transcripts logged
- [x] Statistics update correctly
- [x] Recording time increments

**Pain Detection:**
- [x] 23+ pain keywords detected
- [x] Red alert appears
- [x] Beep sound plays
- [x] Complaint logged with context
- [x] Pain type classified

**User Interface:**
- [x] All UI components visible
- [x] Responsive design (desktop + mobile)
- [x] Colors match ThriveOrtho branding
- [x] Icons and labels correct
- [x] Buttons functional

**Data Export:**
- [x] Export button works
- [x] File format correct
- [x] All data included
- [x] Formatting readable

**Integration:**
- [x] Works during exercise recording
- [x] Saves to sessionStorage
- [x] No camera interference
- [x] No performance issues

---

## 🎓 Training Script for Clinicians

**"How to Use Medical Scribe" - 2 Minute Demo:**

1. **"When you start an assessment, the microphone activates automatically."**
   - Point to Medical Scribe panel
   - Show green pulsing icon

2. **"Everything the patient says is transcribed in real-time."**
   - Point to Live Transcript area
   - Say something as example

3. **"When they mention pain, the system alerts you."**
   - Say: "My knee hurts"
   - Show red alert appearing
   - Point to Pain Complaints section

4. **"All conversations are logged with timestamps and exercise context."**
   - Scroll through Transcript Log
   - Show exercise name and rep count

5. **"At the end, you can export everything as a text file."**
   - Click Export Transcript
   - Show downloaded file

6. **"It's that simple - just talk naturally during the session."**

---

## 📞 Need Help?

**Check:**
1. This testing guide
2. MEDICAL_SCRIBE_IMPLEMENTATION.md (technical details)
3. Browser console for errors (F12 → Console)

**Common Solutions:**
- Refresh page and re-allow permissions
- Use Chrome or Edge browser
- Speak clearly at normal volume
- Reduce background noise
- Check microphone is not muted/blocked

**Test URL:**
https://3000-isoavrqar3ev1h6ka8wvl-cc2fbc16.sandbox.novita.ai

---

**Happy Testing! 🎉**
