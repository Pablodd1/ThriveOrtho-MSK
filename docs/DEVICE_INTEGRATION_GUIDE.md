# 🔌 Device Integration Guide

**Complete guide for integrating third-party 3D motion capture devices with F-AI bian platform**

---

## 📋 Overview

The Device Integration Hub allows seamless import of assessment data from professional 3D motion capture systems into the F-AI bian platform. This eliminates manual data entry and enables clinicians to leverage existing motion capture investments.

---

## 🎯 Supported Devices

### 1. **Kinetisense** (Primary Integration)

**Vendor:** Kinetisense  
**Type:** Markerless 3D Motion Capture  
**Website:** https://www.kinetisense.com/

**Key Features:**
- Patented markerless motion capture
- Real-time 3D joint tracking
- 48 different ROM assessments
- Validated against Vicon (gold standard)
- Clinical-grade accuracy

**Export Formats:**
- ✅ CSV (Primary) - Joint coordinates and angles per frame
- ✅ JSON - Structured assessment data
- ✅ XML - Alternative structured format

**Data Structure (CSV):**
```csv
timestamp,frame,joint_name,x,y,z,angle,velocity,acceleration
0.033,1,hip_left,120.5,450.2,800.1,92.3,15.2,3.1
0.066,2,hip_left,119.8,448.7,799.5,89.1,14.8,2.9
```

**Typical Use Cases:**
- Physical therapy clinics
- Sports performance centers
- Orthopedic practices
- Chiropractic clinics

---

### 2. **Vicon Motion Capture**

**Vendor:** Vicon  
**Type:** Marker-Based 3D Motion Capture  
**Website:** https://www.vicon.com/

**Key Features:**
- Gold standard in motion capture
- Sub-millimeter accuracy
- Multi-camera setup
- Research-grade system

**Export Formats:**
- ✅ C3D (Standard biomechanics format)
- ✅ CSV - Marker positions per frame
- ✅ JSON - Processed data

**Data Structure (CSV):**
```csv
Frame,LASI_X,LASI_Y,LASI_Z,RASI_X,RASI_Y,RASI_Z,...
1,1023.4,450.2,800.1,1087.5,455.3,798.2,...
2,1024.1,449.8,799.9,1088.2,454.9,797.8,...
```

**Joint Marker Naming Convention:**
- `LASI` / `RASI` - Left/Right Anterior Superior Iliac Spine
- `LKNE` / `RKNE` - Left/Right Knee
- `LANK` / `RANK` - Left/Right Ankle
- `LSHO` / `RSHO` - Left/Right Shoulder

---

### 3. **OptiTrack**

**Vendor:** NaturalPoint  
**Type:** Marker-Based Optical Motion Capture  
**Website:** https://optitrack.com/

**Export Formats:**
- ✅ BVH (BioVision Hierarchy) - Animation format
- ✅ FBX - 3D content format
- ✅ CSV - Raw marker data

---

### 4. **Generic 3D Systems**

**Type:** Any system that exports joint angle data

**Requirements:**
- CSV or JSON format
- Standard joint naming (hip_left, knee_right, etc.)
- Frame-by-frame data with timestamps

---

## 🔧 How It Works

### Data Flow Architecture

```
┌─────────────────┐
│  3D Device      │
│  (Kinetisense)  │
└────────┬────────┘
         │ Export
         ▼
┌─────────────────┐
│  CSV/JSON/XML   │
│  Data File      │
└────────┬────────┘
         │ Upload
         ▼
┌─────────────────┐
│ Device          │
│ Integration Hub │
│                 │
│ • Auto-Detect   │
│ • Parse         │
│ • Normalize     │
│ • Validate      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ F-AI bian       │
│ Standard Format │
│                 │
│ {               │
│   frames: [...] │
│   summary: {...}│
│ }               │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Assessment      │
│ Analysis        │
└─────────────────┘
```

### Processing Steps

1. **File Upload**
   - Drag & drop or browse
   - Supports multiple formats
   - File size validation

2. **Auto-Detection**
   - Device type detection
   - Format identification
   - Structure recognition

3. **Parsing**
   - CSV: Line-by-line parsing with delimiter detection
   - JSON: Recursive structure parsing
   - XML: DOM-based parsing

4. **Normalization**
   - Joint name mapping
   - Angle calculation
   - Unit conversion (if needed)
   - Frame synchronization

5. **Validation**
   - Frame count check (minimum 30 frames)
   - Joint completeness check
   - Angle range validation (0-360°)
   - Data quality assessment

6. **Integration**
   - Convert to F-AI bian format
   - Generate summary statistics
   - Create assessment record

---

## 📊 F-AI bian Standard Format

All imported data is normalized to this structure:

```javascript
{
  metadata: {
    device: "Kinetisense 3D Motion Capture",
    deviceType: "kinetisense",
    importedAt: "2025-11-03T10:30:00Z",
    originalFormat: "csv",
    frameCount: 120
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
    // ... 119 more frames
  ],
  
  summary: {
    avgAngles: {
      hip_left: 115.4,
      hip_right: 112.8,
      knee_left: 150.6,
      knee_right: 152.3,
      // ...
    },
    minAngles: {
      hip_left: 45.2,
      hip_right: 42.8,
      // ...
    },
    maxAngles: {
      hip_left: 178.1,
      hip_right: 176.4,
      // ...
    },
    rangeOfMotion: {
      hip_left: 132.9,
      hip_right: 133.6,
      // ...
    }
  }
}
```

---

## 🎯 Kinetisense-Specific Integration

### Exporting from Kinetisense

**Step 1: Complete Assessment**
- Perform assessment using Kinetisense software
- Complete all desired movement tests
- Review results in Kinetisense dashboard

**Step 2: Export Data**
1. Open the completed assessment
2. Click "Export" or "Data Export"
3. Select format: **CSV (Recommended)**
4. Choose export location
5. Save file (e.g., `patient_smith_squat_2025-11-03.csv`)

**Expected CSV Structure:**
```csv
timestamp,frame,joint_name,x,y,z,angle,velocity,acceleration
0.000,0,head,640.2,120.5,1500.3,0.0,0.0,0.0
0.000,0,neck,638.5,180.2,1450.1,5.2,0.0,0.0
0.000,0,spine_upper,635.8,250.4,1400.5,8.1,0.0,0.0
0.000,0,hip_left,580.3,450.2,800.1,92.3,0.0,0.0
0.000,0,hip_right,690.1,455.3,798.2,89.7,0.0,0.0
0.033,1,head,640.1,120.3,1500.1,0.1,0.5,0.3
...
```

**Data Fields:**
- `timestamp` - Time in seconds since start
- `frame` - Frame number (0-indexed)
- `joint_name` - Name of tracked joint
- `x`, `y`, `z` - 3D coordinates in pixels or mm
- `angle` - Joint angle in degrees
- `velocity` - Angular velocity (degrees/second)
- `acceleration` - Angular acceleration (degrees/second²)

---

### Importing to F-AI bian

**Step 1: Access Device Integration**
1. Log in to F-AI bian platform
2. Navigate to **Unified Dashboard**
3. Click **Device Integration** tab (or access directly at `/static/device-integration.html`)

**Step 2: Select Device Type**
- Click on **Kinetisense** card to pre-select device type
- Or use "Auto-Detect" option (system will identify automatically)

**Step 3: Upload File**
- Drag & drop CSV file onto upload zone
- Or click "Browse Files" and select file
- File name and size will display

**Step 4: Import and Process**
- Click **"Import and Process Data"**
- System will:
  - Parse CSV data
  - Detect joint structure
  - Normalize to F-AI bian format
  - Validate data quality
  - Calculate summary statistics

**Step 5: Review Results**
- Check import success message
- Review data preview (metadata, frame count, average angles)
- Review validation warnings (if any)
- Inspect first frame data

**Step 6: Create Assessment**
- Click **"Create Assessment from Import"**
- Select patient (or create new patient)
- Name the test (e.g., "Squat Assessment - Kinetisense")
- Save assessment

---

## 🔍 Data Validation

The system performs comprehensive validation:

### Automatic Checks

1. **Frame Count Validation**
   - ✅ Pass: ≥30 frames (1+ seconds at 30 FPS)
   - ⚠️ Warning: <30 frames (insufficient data)
   - ❌ Error: 0 frames (no data)

2. **Joint Completeness**
   - ✅ Pass: All required joints present (hip, knee, ankle)
   - ⚠️ Warning: Optional joints missing (shoulder, elbow)
   - ❌ Error: Critical joints missing

3. **Angle Range Validation**
   - ✅ Pass: Angles within 0-360°
   - ⚠️ Warning: Angles outside typical ROM ranges
   - ❌ Error: Invalid angle values (negative, >360°, NaN)

4. **Data Consistency**
   - ✅ Pass: Consistent frame numbering
   - ⚠️ Warning: Missing frames or gaps
   - ⚠️ Warning: Duplicate frames

### Validation Report Example

```
✅ Import Successful
📊 120 frames imported (4.0 seconds @ 30 FPS)
⚠️ 2 Validation Warnings:

1. [Warning] Frame 45: hip_left angle 185.3° exceeds typical ROM
2. [Warning] Optional joint missing: elbow_left
```

---

## 🔗 Joint Name Mapping

The system automatically maps device-specific joint names to F-AI bian standard:

| F-AI bian Standard | Kinetisense | Vicon | Notes |
|--------------------|-------------|-------|-------|
| `hip_left` | `hip_left` | `LASI` | Left hip joint |
| `hip_right` | `hip_right` | `RASI` | Right hip joint |
| `knee_left` | `knee_left` | `LKNE` | Left knee joint |
| `knee_right` | `knee_right` | `RKNE` | Right knee joint |
| `ankle_left` | `ankle_left` | `LANK` | Left ankle joint |
| `ankle_right` | `ankle_right` | `RANK` | Right ankle joint |
| `shoulder_left` | `shoulder_left` | `LSHO` | Left shoulder |
| `shoulder_right` | `shoulder_right` | `RSHO` | Right shoulder |
| `elbow_left` | `elbow_left` | `LELB` | Left elbow |
| `elbow_right` | `elbow_right` | `RELB` | Right elbow |

---

## 🎓 Use Cases

### Use Case 1: Kinetisense Clinic Integration

**Scenario:** Physical therapy clinic has Kinetisense system and wants to use F-AI bian for AI-powered analysis

**Workflow:**
1. Perform initial assessment using Kinetisense
2. Export CSV data
3. Import to F-AI bian
4. Generate AI-powered SOAP notes
5. Use Smart Exercise Library for HEP
6. Track progress with AI Progress Tracker

**Benefits:**
- Leverage existing Kinetisense investment
- Add AI capabilities (injury risk, form correction, progress tracking)
- Unified patient records
- Enhanced reporting

---

### Use Case 2: Research Lab Data Analysis

**Scenario:** Research lab collects Vicon motion capture data and wants to analyze with F-AI bian AI

**Workflow:**
1. Collect Vicon C3D files from experiments
2. Export as CSV
3. Batch import to F-AI bian
4. Run AI analysis on all subjects
5. Generate comparative reports
6. Export results for publication

---

### Use Case 3: Multi-Device Clinical Practice

**Scenario:** Clinic uses multiple devices (Kinetisense, iPhone cameras, OptiTrack) for different patient types

**Workflow:**
1. Import data from any device
2. Normalize to common format
3. Compare across devices
4. Use best device per patient need
5. Maintain consistent records

---

## 🛠️ API Integration (Advanced)

For developers building custom integrations:

### JavaScript API

```javascript
// Initialize hub
const hub = new DeviceIntegrationHub();

// Import file programmatically
const file = /* File object */;
const result = await hub.importDeviceData(file, 'kinetisense');

if (result.success) {
  console.log(`Imported ${result.dataPoints} frames`);
  console.log('Data:', result.data);
  
  // Export to assessment format
  const assessmentData = hub.exportToAssessmentFormat(0, 'Squat Test');
  
  // Save to database
  await saveAssessment(assessmentData);
}
```

### REST API Endpoint (Future)

```javascript
POST /api/device-integration/import

Headers:
  Content-Type: multipart/form-data

Body:
  file: [CSV/JSON file]
  deviceType: "kinetisense" | "vicon" | "auto_detect"
  patientId: number (optional)

Response:
{
  "success": true,
  "importId": "abc123",
  "dataPoints": 120,
  "deviceName": "Kinetisense 3D Motion Capture",
  "warnings": []
}
```

---

## 📈 Future Enhancements

### Planned Features

1. **Real-Time Streaming**
   - Direct device-to-platform streaming
   - WebSocket integration
   - Live assessment viewing

2. **Batch Import**
   - Import multiple files at once
   - Folder upload support
   - Progress tracking

3. **Device Calibration**
   - Custom joint mappings
   - Unit conversion settings
   - Coordinate system transformation

4. **Advanced Validation**
   - Biomechanical plausibility checks
   - ML-based anomaly detection
   - Automatic data cleaning

5. **Cloud Sync**
   - Direct Kinetisense cloud integration
   - Vicon Nexus integration
   - Automated import scheduling

---

## 🆘 Troubleshooting

### Common Issues

**Issue: "No frames found in data"**
- **Cause:** Empty file or incorrect format
- **Solution:** Verify file has data, check export settings

**Issue: "Missing required joint: hip_left"**
- **Cause:** Incomplete joint tracking or wrong export
- **Solution:** Re-export with all joints selected

**Issue: "Invalid angle at frame 45"**
- **Cause:** Tracking error or occlusion
- **Solution:** Review in original software, consider excluding frames

**Issue: "Auto-detect failed"**
- **Cause:** Non-standard file format
- **Solution:** Manually select device type

---

## 📞 Support

For integration support:
- Check [README.md](../README.md) for general documentation
- See [TEST_RESULTS.md](../TEST_RESULTS.md) for validation details
- Contact: support@faibian.com

---

## 📜 References

**Kinetisense Documentation:**
- User Manual: https://kinetisense.com/resources/
- Research Validation: https://kinetisense.com/research/

**Vicon Documentation:**
- Export Guide: https://docs.vicon.com/
- C3D Format: https://www.c3d.org/

**Industry Standards:**
- ISB Joint Angle Definition: https://isbweb.org/
- Biomechanics Data Format: https://www.biomech.org/

---

**Last Updated:** November 3, 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready
