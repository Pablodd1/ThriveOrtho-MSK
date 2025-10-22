# Camera Initialization Troubleshooting Guide

## 🔧 Version 2 Improvements Applied

**Changes Made:**
1. ✅ Multiple fallback mechanisms for MediaPipe loading
2. ✅ Flexible constructor detection (window.Pose || Pose)
3. ✅ Manual frame processing fallback if Camera utility missing
4. ✅ Manual landmark drawing fallback if drawing utils missing
5. ✅ Comprehensive console logging for debugging
6. ✅ Specific error messages for each failure type
7. ✅ Extended timeout (15 seconds instead of 10)

---

## 🔍 How to Debug the Issue

### **Step 1: Open Browser DevTools**
1. Right-click on the page → "Inspect" (or press F12)
2. Go to the "Console" tab
3. Keep it open while testing

### **Step 2: Navigate to Assessment Page**
Visit: `https://3000-isoavrqar3ev1h6ka8wvl-cc2fbc16.sandbox.novita.ai/static/assessment-enhanced.html?patient_id=100`

### **Step 3: Check Console Messages**

**Look for these messages:**

#### ✅ **Success Messages (Good):**
```
✅ MediaPipe Pose loaded
✅ MediaPipe Camera loaded
✅ MediaPipe drawing utilities loaded
```

#### ⚠️ **Warning Messages (Still works, but using fallback):**
```
⚠️ Using fallback frame processing (MediaPipe Camera not found)
⚠️ Using fallback drawing (MediaPipe drawing utils not found)
```

#### ⏳ **Loading Messages (Normal):**
```
⏳ Waiting for MediaPipe libraries... (2s)
⏳ Waiting for MediaPipe libraries... (4s)
```

#### ❌ **Error Messages (Problem):**
```
❌ MediaPipe Pose library failed to load after 15 seconds
❌ Camera initialization error: ...
```

### **Step 4: Click Camera Button**

After clicking a camera type (Phone/Laptop/External), look for:

#### ✅ **Success Sequence:**
```
🎥 Starting camera initialization...
📹 Requesting camera access...
✅ Camera access granted
✅ Video playing
🤖 Initializing MediaPipe Pose...
📦 Loading MediaPipe file: pose_landmark_lite.tflite
📦 Loading MediaPipe file: pose_solution_simd_wasm_bin.wasm
✅ MediaPipe Pose initialized
📷 Using MediaPipe Camera utility (or manual frame processing)
✅ Camera processing started
```

#### ❌ **Failure Points:**

**1. Camera Permission Denied:**
```
❌ Camera initialization error: NotAllowedError
Error: Camera permission denied. Please allow camera access and try again.
```

**2. No Camera Found:**
```
❌ Camera initialization error: NotFoundError
Error: No camera found. Please connect a camera and try again.
```

**3. Camera In Use:**
```
❌ Camera initialization error: NotReadableError
Error: Camera is in use by another application.
```

**4. MediaPipe Not Loaded:**
```
❌ Camera initialization error: MediaPipe Pose not found
Error: MediaPipe Pose not found. Scripts may not be loaded. Please refresh page.
```

---

## 🛠️ Solutions for Common Issues

### **Issue 1: "MediaPipe Pose not found"**

**Cause:** MediaPipe scripts didn't load from CDN

**Solutions:**
1. **Check Internet Connection** - MediaPipe loads from jsdelivr CDN
2. **Refresh the page** - Wait 5-10 seconds for scripts to load
3. **Check Network tab** in DevTools:
   - Look for 4 requests to `cdn.jsdelivr.net/npm/@mediapipe/`
   - All should show status 200 (green)
   - If red (failed), network issue

**Quick Test:**
Open console and type:
```javascript
window.Pose
```
Should return: `[Function: Pose]` or similar (NOT `undefined`)

---

### **Issue 2: "Camera permission denied"**

**Cause:** Browser blocked camera access

**Solutions:**
1. **Check URL bar** - Look for camera icon with red X
2. **Click the icon** → Change to "Allow"
3. **Refresh the page**
4. **For HTTPS:** Make sure you're using HTTPS or localhost (required for camera)

---

### **Issue 3: "No camera found"**

**Cause:** No physical camera connected

**Solutions:**
1. **Connect external webcam** (if using desktop without built-in camera)
2. **Enable camera in BIOS** (some laptops have hardware switch)
3. **Check Windows Settings** → Privacy → Camera → Allow apps to access camera
4. **Mac:** System Preferences → Security & Privacy → Camera

---

### **Issue 4: "Camera is in use"**

**Cause:** Another application using camera

**Solutions:**
1. **Close other apps** using camera (Zoom, Teams, Skype, etc.)
2. **Check browser tabs** - Close other tabs using camera
3. **Restart browser** completely
4. **Windows:** Check Task Manager for processes using camera

---

### **Issue 5: Scripts load but camera still fails**

**Cause:** JavaScript error in initialization

**Solutions:**
1. **Check Console** for red error messages
2. **Copy full error** and share it
3. **Try different browser** (Chrome recommended)
4. **Clear browser cache** (Ctrl+Shift+Delete)

---

## 📋 Browser Requirements

### **Recommended Browsers:**
- ✅ **Chrome 90+** (Best support)
- ✅ **Edge 90+** (Chromium-based, excellent)
- ✅ **Safari 14+** (Good on Mac/iOS)
- ⚠️ **Firefox 88+** (Works but may need adjustments)

### **Required Features:**
- ✅ getUserMedia API (camera access)
- ✅ WebAssembly (for MediaPipe)
- ✅ Canvas API (for skeleton drawing)
- ✅ ES6+ JavaScript

---

## 🧪 Manual Testing Steps

### **Test 1: Check MediaPipe Loading**
```javascript
// Open console and run:
console.log('Pose:', typeof window.Pose);
console.log('Camera:', typeof window.Camera);
console.log('drawConnectors:', typeof window.drawConnectors);

// Expected output:
// Pose: function ✅
// Camera: function ✅ (or undefined - okay, we have fallback)
// drawConnectors: function ✅ (or undefined - okay, we have fallback)
```

### **Test 2: Check Camera Access**
```javascript
// Open console and run:
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    console.log('✅ Camera works!', stream);
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(err => {
    console.error('❌ Camera error:', err.name, err.message);
  });
```

### **Test 3: Check HTTPS**
```javascript
// Open console and run:
console.log('Protocol:', window.location.protocol);
console.log('Is Secure:', window.isSecureContext);

// Expected:
// Protocol: https: ✅ (or http://localhost - okay)
// Is Secure: true ✅
```

---

## 🚀 Advanced Debugging

### **Enable Verbose Logging:**
The new code already has extensive console logging. Just open DevTools Console.

### **Check MediaPipe Files Loading:**
1. Open DevTools → **Network** tab
2. Refresh page
3. Filter by "mediapipe"
4. Look for:
   - `camera_utils.js` ✅
   - `control_utils.js` ✅
   - `drawing_utils.js` ✅
   - `pose.js` ✅
   - `pose_landmark_lite.tflite` ✅
   - `pose_solution_simd_wasm_bin.wasm` ✅

All should be **Status 200** (green)

### **Check Video Element:**
```javascript
// In console:
const video = document.getElementById('videoElement');
console.log('Video ready:', video.readyState); // Should be 4
console.log('Video playing:', !video.paused); // Should be true
console.log('Video size:', video.videoWidth, 'x', video.videoHeight); // Should show dimensions
```

---

## 📝 What to Share If Still Failing

If the camera still doesn't work, please share:

1. **Console output** (full text, especially errors in red)
2. **Browser and version** (e.g., Chrome 120, Firefox 115)
3. **Operating System** (Windows 11, macOS, etc.)
4. **URL you're accessing** (should be HTTPS)
5. **Result of Test 1, 2, 3** above

---

## 🔄 Recent Improvements (Version 2)

**What's different from first fix:**

### **Before (Version 1):**
```javascript
// Strict checks, no fallbacks
STATE.pose = new window.Pose({...});
STATE.camera = new window.Camera(video, {...});
```

### **After (Version 2):**
```javascript
// Multiple fallback options
const PoseConstructor = window.Pose || window.pose?.Pose || Pose;
const CameraConstructor = window.Camera || window.camera_utils?.Camera || Camera;

// Fallback to manual frame processing if Camera utility missing
if (CameraConstructor) {
    STATE.camera = new CameraConstructor(video, {...});
} else {
    // Manual requestAnimationFrame loop
    const processFrame = async () => {
        await STATE.pose.send({ image: video });
        requestAnimationFrame(processFrame);
    };
    processFrame();
}
```

**Result:** More robust, works even if some MediaPipe utilities fail to load.

---

## 🎯 Success Checklist

Before clicking camera button, verify:
- [ ] Console shows "✅ MediaPipe Pose loaded"
- [ ] No red errors in console
- [ ] URL is HTTPS or localhost
- [ ] Browser is Chrome/Edge/Safari (latest)
- [ ] Camera permissions granted

After clicking camera button:
- [ ] Console shows "📹 Requesting camera access..."
- [ ] Browser asks for camera permission (if first time)
- [ ] Console shows "✅ Camera access granted"
- [ ] Console shows "✅ Video playing"
- [ ] Console shows "✅ MediaPipe Pose initialized"
- [ ] Console shows "✅ Camera processing started"
- [ ] Video feed appears in page
- [ ] Green skeleton overlay appears (after you're in frame)

---

## 🆘 Emergency Fallback

If nothing works, try the **old assessment page** (without enhancements):
`/static/assessment.html?patient_id=100`

This uses simpler camera code and might work if the enhanced version has issues.

---

**Updated:** October 22, 2025
**Version:** 2.1.2 (Camera Fix V2)
**Status:** Deployed ✅
