# 🚀 Device Integration Quick Start Guide

**Get started with third-party device data import in 5 minutes**

---

## 📍 Access Points

### **Method 1: Direct URL (Recommended)**

```
Current Sandbox:
https://3000-isoavrqar3ev1h6ka8wvl-cc2fbc16.sandbox.novita.ai/static/device-integration.html

Production (after deployment):
https://[your-domain].pages.dev/static/device-integration.html
```

### **Method 2: From Unified Dashboard**

1. Go to: `/static/unified-dashboard.html`
2. Click the **"Device Import"** button in the top-right header (purple button)
3. Or navigate through the dashboard interface

### **Method 3: From Homepage**

1. Go to: `/`
2. Look for "Device Integration" or "Import Data" link
3. Click to access the integration hub

---

## 🧪 Testing with Sample Data

We've provided a sample Kinetisense CSV file for testing:

**Location:** `/sample-data/kinetisense-sample.csv`

**Download Options:**

### Option A: Download via Browser

1. Navigate to sandbox URL
2. Open browser console (F12)
3. Run:
```javascript
window.open('/sample-data/kinetisense-sample.csv', '_blank')
```

### Option B: Use curl

```bash
curl https://3000-isoavrqar3ev1h6ka8wvl-cc2fbc16.sandbox.novita.ai/sample-data/kinetisense-sample.csv > kinetisense-sample.csv
```

### Option C: Create Locally

Copy this content to a file named `kinetisense-sample.csv`:

```csv
timestamp,frame,joint_name,x,y,z,angle,velocity,acceleration
0.000,0,hip_left,580.3,450.2,800.1,92.3,0.0,0.0
0.000,0,hip_right,690.1,455.3,798.2,89.7,0.0,0.0
0.000,0,knee_left,585.2,650.4,805.3,165.2,0.0,0.0
...
```

(Full file is 5KB with 10 frames of data)

---

## 📋 Step-by-Step Import Process

### **Step 1: Access Device Integration**

Navigate to:
```
/static/device-integration.html
```

You should see:
- 4 device cards (Kinetisense, Vicon, OptiTrack, Generic)
- Drag & drop upload zone
- Device type selector dropdown

### **Step 2: Select Device (Optional)**

Click on the **Kinetisense** card to pre-select the device type.

*Note: You can skip this - the system will auto-detect from the file.*

### **Step 3: Upload File**

**Option A: Drag & Drop**
- Drag `kinetisense-sample.csv` onto the upload zone
- Drop when zone turns green

**Option B: Browse**
- Click "Browse Files" button
- Select `kinetisense-sample.csv`
- Click Open

### **Step 4: Import Data**

1. Click **"Import and Process Data"** button (green)
2. Wait 1-2 seconds for processing
3. Watch for success message

### **Step 5: Review Results**

You should see:

**Success Message:**
```
✅ Import Successful!
Imported 10 frames from Kinetisense 3D Motion Capture
```

**Data Preview:**
```
Metadata:
- Device: Kinetisense 3D Motion Capture
- Frame Count: 10
- Duration: 0.33s @ 30 FPS

Average Joint Angles:
- hip_left: 81.2°
- hip_right: 78.6°
- knee_left: 159.0°
- knee_right: 163.0°
- ankle_left: 90.4°
- ankle_right: 90.0°
```

### **Step 6: Export or Create Assessment**

**Option A: Download JSON**
- Click "Download JSON" button
- Saves normalized data in F-AI bian format

**Option B: Create Assessment** (Future Integration)
- Click "Create Assessment from Import"
- Select patient
- Name the test
- Save

---

## 🔍 Understanding the Data

### What Happens During Import?

1. **File Reading**
   - System reads CSV file
   - Parses line by line

2. **Device Detection**
   - Looks for "Kinetisense" in content
   - Checks file structure
   - Identifies format (CSV)

3. **Data Parsing**
   - Extracts frame-by-frame data
   - Groups by frame number
   - Extracts joint positions and angles

4. **Normalization**
   - Maps joint names to F-AI bian standard:
     ```
     Kinetisense → F-AI bian
     hip_left    → hip_left
     hip_right   → hip_right
     knee_left   → knee_left
     ... etc
     ```

5. **Validation**
   - Checks frame count (minimum 30 for 1 second)
   - Validates angle ranges (0-360°)
   - Checks for missing joints
   - Reports warnings

6. **Summary Generation**
   - Calculates average angles per joint
   - Finds min/max angles
   - Computes range of motion
   - Identifies asymmetries

### Output Format (F-AI bian Standard)

```javascript
{
  metadata: {
    device: "Kinetisense 3D Motion Capture",
    deviceType: "kinetisense",
    importedAt: "2025-11-07T22:30:00Z",
    frameCount: 10
  },
  
  frames: [
    {
      frameNumber: 0,
      timestamp: 0.000,
      hip_left: 92.3,
      hip_right: 89.7,
      knee_left: 165.2,
      knee_right: 168.4,
      ankle_left: 95.1,
      ankle_right: 93.8,
      shoulder_left: 178.2,
      shoulder_right: 176.5,
      elbow_left: 170.3,
      elbow_right: 172.1
    },
    // ... 9 more frames
  ],
  
  summary: {
    avgAngles: {
      hip_left: 81.2,
      hip_right: 78.6,
      // ...
    },
    rangeOfMotion: {
      hip_left: 19.8,
      hip_right: 20.8,
      // ...
    }
  }
}
```

---

## 🎯 Real-World Usage

### Scenario 1: Kinetisense Clinic

**You have:**
- Kinetisense system installed
- Patient completed squat assessment
- CSV export ready

**Steps:**
1. Export from Kinetisense (File → Export → CSV)
2. Go to F-AI bian Device Integration
3. Upload CSV file
4. Review imported data
5. Create assessment record
6. Run AI analysis (injury risk, exercise matching)

### Scenario 2: Research Lab (Vicon)

**You have:**
- Vicon motion capture data
- 50 subjects completed gait analysis
- Need AI analysis on all subjects

**Steps:**
1. Export Vicon data as CSV (batch)
2. Import each file to F-AI bian
3. System normalizes all to common format
4. Run batch AI analysis
5. Export aggregated results

### Scenario 3: Multi-Device Clinic

**You have:**
- Kinetisense for ROM assessments
- iPhone cameras for functional tests
- Manual assessments for balance

**Steps:**
1. Use native F-AI bian for iPhone assessments
2. Import Kinetisense data for ROM
3. Manual entry for balance scores
4. All data in unified format
5. Compare across modalities
6. Generate comprehensive reports

---

## 🐛 Troubleshooting

### Issue: "Can't find device-integration.html"

**Solution:**
- Check URL: `/static/device-integration.html`
- Ensure service is running: `pm2 list`
- Restart if needed: `pm2 restart all`

### Issue: "Import failed - No frames found"

**Cause:** Empty or invalid CSV file

**Solution:**
- Check CSV has header row
- Verify data rows exist
- Use sample file to test

### Issue: "Invalid angle at frame X"

**Cause:** Angle outside 0-360° range

**Solution:**
- This is a warning, not an error
- Check original Kinetisense data
- May indicate tracking issue
- Data still imports

### Issue: "Missing required joint: hip_left"

**Cause:** Incomplete joint data in export

**Solution:**
- Re-export from Kinetisense with all joints
- Check joint selection in export settings
- Ensure full body tracking was enabled

---

## 📊 Sample Data Details

The provided sample file contains:

- **10 frames** (0.33 seconds at 30 FPS)
- **10 joints tracked** per frame:
  - hip_left, hip_right
  - knee_left, knee_right
  - ankle_left, ankle_right
  - shoulder_left, shoulder_right
  - elbow_left, elbow_right

- **Data per joint:**
  - 3D position (x, y, z) in pixels
  - Angle in degrees
  - Velocity in degrees/second
  - Acceleration in degrees/second²

- **Movement captured:**
  - Simulated squat motion
  - Hip angle: 92° → 72° (20° ROM)
  - Knee flexion: 165° → 152° (13° ROM)
  - Natural asymmetry included

---

## 🔗 API Integration (Advanced)

For programmatic access:

```javascript
// Load the integration hub
const hub = new DeviceIntegrationHub();

// Import file programmatically
const fileInput = document.getElementById('myFileInput');
const file = fileInput.files[0];

const result = await hub.importDeviceData(file, 'kinetisense');

if (result.success) {
  console.log('Imported:', result.dataPoints, 'frames');
  console.log('Device:', result.deviceName);
  console.log('Data:', result.data);
  
  // Export to assessment format
  const assessment = hub.exportToAssessmentFormat(0, 'Squat Test');
  
  // Send to backend
  await fetch('/api/assessments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assessment)
  });
}
```

---

## 📚 Additional Resources

**Full Documentation:**
- [DEVICE_INTEGRATION_GUIDE.md](DEVICE_INTEGRATION_GUIDE.md) - Comprehensive guide
- [README.md](../README.md) - Platform overview
- [AI_FEATURES_COMPREHENSIVE_UPGRADE.md](AI_FEATURES_COMPREHENSIVE_UPGRADE.md) - AI capabilities

**Kinetisense Resources:**
- Official website: https://www.kinetisense.com/
- User manual: https://kinetisense.com/resources/
- Export guide: Check Kinetisense software Help menu

**Support:**
- Platform issues: Check browser console (F12)
- Import errors: Review validation warnings
- Feature requests: Document in project issues

---

## ✅ Quick Checklist

Before importing data, ensure:

- [ ] Service is running (`pm2 list` shows webapp active)
- [ ] Can access `/static/device-integration.html`
- [ ] Have valid CSV/JSON file from device
- [ ] File has required columns (timestamp, frame, joint_name, angle)
- [ ] Browser allows file uploads (not blocked by security)

For first-time testing:

- [ ] Download sample file (`kinetisense-sample.csv`)
- [ ] Navigate to device integration page
- [ ] Upload sample file
- [ ] Verify successful import
- [ ] Review data preview
- [ ] Download JSON output

---

## 🎉 You're Ready!

You now have everything needed to:
1. Access the Device Integration Hub
2. Import third-party device data
3. Normalize to F-AI bian format
4. Validate and review results
5. Export for further analysis

**Next Steps:**
1. Test with sample data
2. Try with real Kinetisense export
3. Integrate with patient records
4. Run AI analysis on imported data

---

**Last Updated:** November 7, 2025  
**Version:** 1.0  
**Status:** ✅ Ready for Testing
