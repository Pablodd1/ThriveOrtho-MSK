# KAMS Integration Guide

## Overview
KAMS (Kinetic Analysis & Movement Screen) is a comprehensive movement assessment system that provides objective scoring of movement quality, dysfunction region identification, and automated treatment protocol generation.

## Quick Start

### 1. View Demo KAMS Data
Sarah Mitchell (Patient ID: 999) has 3 complete KAMS assessments showing her 90-day rehab progression:

**Access KAMS Results:**
```
http://localhost:3000/static/kams-results-viewer.html
```

The page will automatically load Sarah Mitchell's initial assessment data (64% KAMS score) as a demo.

### 2. Load KAMS Demo Data (if needed)
```bash
cd /home/user/webapp
npx wrangler d1 execute webapp-production --local --file=./demo-seed-kams.sql
```

### 3. Integration with Visual Assessment

#### Add KAMS scripts to your assessment page:
```html
<!-- KAMS Assessment Logic -->
<script src="/static/kams-style-assessment.js"></script>
<script src="/static/gait-alignment-overlay.js"></script>
<script src="/static/kams-integration.js"></script>
```

#### Process assessment data and generate KAMS scores:
```javascript
// After completing visual assessment
const kamsIntegration = initKAMSIntegration();

// Process recorded pose data
const kamsResults = await kamsIntegration.processAssessmentData(recordedData);

// Display results in UI
kamsIntegration.displayKAMSResults('results-container-id');

// Save to database
await kamsIntegration.saveKAMSAssessment(patientId);

// Open full report
kamsIntegration.openFullReport(); // Opens kams-results-viewer.html
```

## KAMS Score Breakdown

### Overall KAMS Score (0-100%)
- **Excellent (80-100%)**: Optimal movement patterns, minimal injury risk
- **Good (65-79%)**: Good movement quality with minor issues
- **Fair (50-64%)**: Moderate dysfunction requiring intervention
- **Poor (<50%)**: Significant dysfunction, high injury risk

### Core Metrics

1. **Dynamic Posture Index (0-100%)**
   - Measures static and dynamic alignment quality
   - Evaluates head-neck, shoulder, hip, torso, and knee alignment
   - Deductions for deviations from ideal posture

2. **Lower Extremity Power Score (0-100%)**
   - Assesses lower body strength and ROM
   - Analyzes hip, knee, and ankle ROM from movement data
   - Evaluates explosive movement capacity

3. **Functional Asymmetry Index (0-100%)**
   - Measures left-right balance
   - Analyzes shoulder, hip, knee, and elbow symmetry
   - Higher scores indicate better bilateral balance

4. **Susceptibility to Injury Index (0-100%)**
   - Predicts injury risk based on movement patterns
   - Evaluates knee valgus, forward head posture, pelvic tilt
   - Lower scores indicate lower injury risk

## Dysfunction Region Mapping

### Three Body Regions:
1. **Upper Body**: Shoulders, elbows, neck
2. **Lower Body**: Hips, knees, ankles
3. **Spinal**: Thoracic, lumbar, SI joint

### Severity Levels:
- **High**: Requires immediate attention, significant dysfunction
- **Moderate**: Notable issue, should be addressed
- **Low**: Minor concern, monitor and correct

### Plane Indicators:
- **FP (Frontal Plane)**: Front view analysis
- **TP (Transverse Plane)**: Top-down view analysis
- **SP (Sagittal Plane)**: Side view analysis

## Treatment Protocol Generation

KAMS automatically generates a 3-phase treatment protocol:

### Phase 1: Foundation & Correction (Weeks 1-4)
- Focus: Address highest priority issues
- Frequency: 2-3x/week
- Exercises: Corrective movements, mobility, basic strengthening

### Phase 2: Strengthening & Integration (Weeks 5-8)
- Focus: Build strength, reduce asymmetries
- Frequency: 2x/week
- Exercises: Progressive resistance, functional patterns, balance

### Phase 3: Functional & Return to Activity (Weeks 9-12)
- Focus: Sport/activity-specific training
- Frequency: 1-2x/week
- Exercises: Advanced movements, plyometrics, return-to-sport drills

## API Endpoints (Backend Required)

### Save KAMS Assessment
```
POST /api/kams/save
Body: {
  patientId: number,
  kamsData: object,
  timestamp: string (ISO 8601)
}
```

### Retrieve KAMS History
```
GET /api/assessments/:patientId/kams
Response: [kamsAssessment, ...]
```

### Get Latest KAMS Score
```
GET /api/assessments/:assessmentId/kams
Response: kamsAssessment object
```

## Database Schema

```sql
CREATE TABLE kams_assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  assessment_date TEXT NOT NULL,
  assessment_type TEXT DEFAULT 'KAMS Movement Analysis',
  assessor TEXT DEFAULT 'AI-Powered System',
  
  -- Overall scores
  overall_score INTEGER NOT NULL,
  score_rating TEXT,
  
  -- Core metrics
  dynamic_posture_index INTEGER,
  dynamic_posture_rating TEXT,
  lower_extremity_power INTEGER,
  lower_extremity_rating TEXT,
  functional_asymmetry INTEGER,
  functional_asymmetry_rating TEXT,
  injury_susceptibility INTEGER,
  injury_susceptibility_rating TEXT,
  
  -- JSON data
  dysfunction_regions TEXT, -- JSON
  recommendations TEXT, -- JSON
  treatment_protocol TEXT, -- JSON
  
  -- Metadata
  total_frames INTEGER,
  assessment_duration INTEGER,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);
```

## Demo Patient: Sarah Mitchell Journey

### Initial Assessment (Week 6, 2024-09-15)
- **Overall KAMS:** 64% (Fair)
- **Dynamic Posture:** 77% (Great)
- **Lower Extremity Power:** 54% (Moderate)
- **Functional Asymmetry:** 92% (Great)
- **Injury Susceptibility:** 59% (Moderate)
- **Key Issues:** Right knee valgus/instability (High), Right hip weakness (Moderate)

### Re-Assessment (Week 10, 2024-10-13)
- **Overall KAMS:** 72% (Good) - +8 points
- **Dynamic Posture:** 82% (Great) - +5 points
- **Lower Extremity Power:** 65% (Good) - +11 points
- **Functional Asymmetry:** 95% (Great) - +3 points
- **Injury Susceptibility:** 42% (Mild) - -17 points (risk reduced)
- **Key Issues:** Right knee mild valgus (Moderate) - improved from High

### Final Assessment (Week 14, 2024-11-10)
- **Overall KAMS:** 86% (Excellent) - +22 points from initial
- **Dynamic Posture:** 90% (Great) - +13 points
- **Lower Extremity Power:** 82% (Great) - +28 points (+52% improvement)
- **Functional Asymmetry:** 97% (Great) - +5 points
- **Injury Susceptibility:** 22% (Low) - -37 points (-63% risk reduction)
- **Key Issues:** None - All metrics within normal range

### Progress Summary
- **34% overall improvement** in KAMS score
- **63% reduction** in injury susceptibility
- **52% improvement** in lower extremity power
- **Ready for discharge** - cleared for full running activities

## Gait Alignment Overlay

The KAMS system includes a professional gait alignment overlay for real-time analysis:

### Features:
- **Center of Mass (COM) tracking** with crosshair indicator
- **Alignment grid** with dotted reference lines
- **Distance measurements**: From core, shoulder width, stance width
- **Circular position indicators** (L/R) with degree measurements
- **Body tilt measurements**: Shoulder, pelvic, torso, hip rotation
- **LCP markers** (Lateral Center Position) in corners
- **Real-time metrics panel** with live updates

### Usage:
```javascript
const canvas = document.getElementById('gait-canvas');
const video = document.getElementById('video-element');

const gaitOverlay = new GaitAlignmentOverlay(canvas, video);

// Update on each pose detection
function onPoseResults(results) {
  if (results.poseLandmarks) {
    gaitOverlay.drawAlignmentOverlay(results.poseLandmarks);
  }
}

// Export metrics history
const metricsHistory = []; // Collect metrics over time
metricsHistory.push(gaitOverlay.getMetrics());

// Export to CSV
const csv = gaitOverlay.exportMetricsCSV(metricsHistory);
```

## Best Practices

1. **Collect sufficient movement data**: Minimum 30 frames (1 second at 30 FPS) for accurate analysis
2. **Use representative frames**: Middle of assessment provides most stable landmarks
3. **Include previous frames**: For ROM and movement speed calculations
4. **Store complete results**: Save both summary scores and detailed dysfunction regions
5. **Generate protocols automatically**: Let KAMS create evidence-based treatment plans
6. **Track progress over time**: Regular re-assessments (every 4 weeks)
7. **Combine with FMS**: Use both KAMS and FMS for comprehensive movement screening

## Clinical Validation

KAMS scores are based on:
- **MediaPipe Pose Detection**: 33-point skeleton tracking
- **Biomechanical Analysis**: Joint angles, alignment, symmetry
- **Movement Science**: Evidence-based ROM and strength norms
- **Injury Prediction**: Research-validated injury risk factors (knee valgus, forward head, pelvic tilt)
- **Progressive Protocols**: Phased rehabilitation following standard PT timelines

## Troubleshooting

### No KAMS data displayed
- Check sessionStorage: `sessionStorage.getItem('kamsData')`
- Verify pose data quality: Ensure landmarks are detected
- Check console for errors

### Low KAMS scores
- Verify camera quality and positioning
- Ensure full body is visible in frame
- Check lighting conditions for MediaPipe accuracy
- Validate patient positioning

### Treatment protocols not generating
- Ensure all dysfunction regions are properly identified
- Check that metrics have valid ratings
- Verify JSON structure in database

## Future Enhancements

- [ ] Real-time KAMS scoring during live assessment
- [ ] KAMS progress charts over time
- [ ] Comparison with normative data by age/activity level
- [ ] Integration with exercise prescription database
- [ ] Automated email reports to patients
- [ ] KAMS-based outcome prediction models
- [ ] Multi-patient KAMS comparison for clinics

## Support

For questions or issues with KAMS integration, refer to:
- `kams-style-assessment.js` - Core assessment logic
- `gait-alignment-overlay.js` - Visual gait analysis
- `kams-integration.js` - Integration module
- `kams-results-viewer.html` - Full UI implementation
