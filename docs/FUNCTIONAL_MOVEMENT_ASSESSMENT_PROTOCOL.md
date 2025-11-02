# ThriveOrtho - Functional Movement Assessment Protocol
**Medical-Grade Movement Analysis System**  
**Version**: 3.0.0  
**Created**: November 2, 2025

---

## 📋 **Table of Contents**
1. [Overview](#overview)
2. [Assessment Protocol](#assessment-protocol)
3. [Camera Positioning Requirements](#camera-positioning)
4. [Movement Tests](#movement-tests)
5. [Real-Time Data Capture](#real-time-data)
6. [Biomechanical Metrics](#biomechanical-metrics)
7. [Scoring System](#scoring-system)
8. [Report Generation](#report-generation)

---

## 🎯 **Overview**

### **Purpose**
Medical-grade functional movement assessment to evaluate:
- Bilateral symmetry and balance
- Range of motion (ROM) limitations
- Movement compensations
- Injury risk factors
- Functional capacity

### **Technology Stack**
- **Pose Detection**: MediaPipe Pose (33 body landmarks)
- **Angle Calculation**: 3D joint angle computation
- **Real-Time Visualization**: Chart.js for live movement graphs
- **Video Analysis**: Multi-angle capture (Front, Side, Back)

---

## 📹 **Camera Positioning Requirements**

### **Standard Setup (Single Camera)**
```
FRONT VIEW (Primary)
┌─────────────────────────┐
│                         │
│    [  PATIENT  ]        │
│         🧍              │
│                         │
│    Distance: 8-10 feet  │
│    Height: Chest level  │
│    Angle: 0° (straight) │
└─────────────────────────┘
```

### **Multi-Angle Protocol** (For comprehensive assessment)
1. **FRONT VIEW (Anterior)**
   - **Purpose**: Assess frontal plane movements
   - **Captures**: Knee valgus/varus, hip alignment, shoulder levelness
   - **Distance**: 8-10 feet
   - **Height**: Mid-torso level

2. **SIDE VIEW (Sagittal - Right or Left)**
   - **Purpose**: Assess sagittal plane movements  
   - **Captures**: Forward lean, squat depth, ankle dorsiflexion
   - **Distance**: 8-10 feet
   - **Height**: Mid-torso level
   - **Position**: 90° perpendicular to front

3. **BACK VIEW (Posterior)** (Optional for advanced assessment)
   - **Purpose**: Assess posterior chain symmetry
   - **Captures**: Scapular dyskinesis, spinal alignment
   - **Distance**: 8-10 feet
   - **Height**: Mid-torso level

### **Patient Positioning**
- Feet: Shoulder-width apart (measured)
- Arms: Overhead for squat, sides for other movements
- Footwear: Barefoot preferred for accuracy
- Clothing: Form-fitting for landmark detection
- Space: 6x6 feet clear area minimum

---

## 🏋️ **Movement Tests**

### **Test 1: Deep Overhead Squat** (Primary Assessment)

**Clinical Relevance**: Most comprehensive functional movement test, assesses total body mechanics.

**Setup**:
- Feet shoulder-width apart, toes forward (0-15° out-turn allowed)
- Arms fully extended overhead, hands shoulder-width
- Dowel/PVC pipe held overhead (simulated in ThriveOrtho)

**Movement Protocol**:
1. **Starting Position**:
   - Stand upright, arms overhead
   - Weight evenly distributed on both feet
   - Neutral spine alignment

2. **Descent Phase** (3-4 seconds):
   - Simultaneous hip and knee flexion
   - Keep arms overhead throughout
   - Maintain torso upright (minimize forward lean)
   - Descend until thighs parallel to ground OR maximum depth

3. **Bottom Position** (Hold 1 second):
   - Thighs at or below parallel if possible
   - Heels remain on ground
   - Knees track over toes
   - Arms remain overhead

4. **Ascent Phase** (2-3 seconds):
   - Drive through heels
   - Return to starting position
   - Maintain arm position

5. **Repetitions**: 5 controlled repetitions
6. **Rest**: 30 seconds between reps

**Camera Views Required**:
- Front view: All 5 reps
- Side view: Reps 2-4 (if multi-angle setup)

**Key Landmarks Tracked** (MediaPipe indices):
- Nose (0), Shoulders (11, 12)
- Elbows (13, 14), Wrists (15, 16)
- Hips (23, 24), Knees (25, 26)
- Ankles (27, 28), Heels (29, 30)
- Toes (31, 32)

---

### **Test 2: Single Leg Balance** (Stability Assessment)

**Clinical Relevance**: Tests postural control, ankle/hip stability, vestibular function.

**Movement Protocol**:
1. Stand on one leg
2. Opposite knee lifted to 90° hip flexion
3. Arms at sides or crossed over chest
4. Hold for 30 seconds
5. Repeat on opposite leg
6. **Metrics**: Sway (cm), center of mass deviation

**Camera View**: Front view only

---

### **Test 3: Forward Bend (Toe Touch)**

**Clinical Relevance**: Assesses hamstring flexibility, lumbar spine flexion, hip mobility.

**Movement Protocol**:
1. Stand with feet together
2. Bend forward attempting to touch toes
3. Keep knees straight (no flexion)
4. Hold end position 2 seconds
5. Return to standing
6. Repeat 3 times

**Camera View**: Side view preferred

---

### **Test 4: Shoulder Mobility** (Upper Extremity)

**Clinical Relevance**: Assesses glenohumeral ROM, scapular mobility, thoracic extension.

**Movement Protocol**:
1. Arms at sides
2. Raise both arms overhead (flexion to 180°)
3. Lower arms behind back (extension)
4. Repeat 5 times
5. **Metrics**: Maximum flexion angle, extension angle, symmetry

**Camera View**: Front and side views

---

### **Test 5: Hip Hinge** (Functional Pattern)

**Clinical Relevance**: Assesses hip mobility, hamstring flexibility, lumbar stability.

**Movement Protocol**:
1. Feet hip-width apart
2. Hands on hips or crossed over chest
3. Hinge at hips (push hips back)
4. Keep back straight, knees slightly bent
5. Lower torso to ~45°
6. Return to standing
7. Repeat 5 times

**Camera View**: Side view required

---

## 📊 **Real-Time Data Capture**

### **Joint Angles Calculated** (Every frame, ~30 FPS)

#### **Lower Body**:
1. **Hip Flexion Angle** (Bilateral)
   - Landmarks: Shoulder - Hip - Knee
   - Normal ROM: 0° (standing) to 120° (deep squat)
   - Formula: `angle(shoulder, hip, knee)`

2. **Knee Flexion Angle** (Bilateral)
   - Landmarks: Hip - Knee - Ankle
   - Normal ROM: 0° (standing) to 135° (deep flexion)
   - Formula: `angle(hip, knee, ankle)`

3. **Ankle Dorsiflexion** (Bilateral)
   - Landmarks: Knee - Ankle - Toe
   - Normal ROM: 90° (neutral) to 70° (dorsiflexion)
   - Formula: `angle(knee, ankle, toe)`

4. **Knee Valgus/Varus** (Frontal plane)
   - Landmarks: Hip - Knee - Ankle (frontal)
   - Normal: 180° ± 5° (neutral alignment)
   - <175° = Valgus (knock-knee)
   - >185° = Varus (bow-legged)

#### **Upper Body**:
5. **Shoulder Flexion** (Bilateral)
   - Landmarks: Hip - Shoulder - Elbow
   - Normal ROM: 0° to 180°
   - Formula: `angle(hip, shoulder, elbow)`

6. **Elbow Flexion** (Bilateral)
   - Landmarks: Shoulder - Elbow - Wrist
   - Normal ROM: 0° to 150°
   - Formula: `angle(shoulder, elbow, wrist)`

#### **Core/Trunk**:
7. **Forward Lean Angle** (Sagittal plane)
   - Landmarks: Hip - Shoulder - Vertical
   - Normal squat: <45° forward lean
   - Excessive: >60° indicates compensation

8. **Pelvic Tilt** (Sagittal plane)
   - Landmarks: Shoulder - Hip - Knee
   - Measures anterior/posterior pelvic rotation

---

### **Movement Quality Metrics**

#### **1. Symmetry Index** (Bilateral comparison)
```
Symmetry = (Left Angle - Right Angle) / Average Angle * 100
```
- **Normal**: <10% difference
- **Mild Asymmetry**: 10-20%
- **Moderate Asymmetry**: 20-30%
- **Severe Asymmetry**: >30%

#### **2. Range of Motion (ROM) Score**
```
ROM Score = (Achieved Angle / Expected Angle) * 100
```
- **Full ROM**: >90%
- **Mild Limitation**: 70-90%
- **Moderate Limitation**: 50-70%
- **Severe Limitation**: <50%

#### **3. Movement Speed**
- **Descent Speed**: Pixels/frame or degrees/second
- **Ascent Speed**: Pixels/frame or degrees/second
- **Optimal**: Controlled, 3-4 seconds descent, 2-3 seconds ascent

#### **4. Stability Score**
- **Sway**: Standard deviation of center of mass
- **Balance**: Time maintained in position
- **Tremor**: High-frequency joint position variations

#### **5. Compensation Patterns** (Red flags)
- Excessive forward lean (>60°)
- Heel lift (ankle loses contact with ground)
- Knee valgus (knees cave inward)
- Arm drops (arms fall below horizontal)
- Hip shift (lateral weight shifting)

---

## 📈 **Real-Time Visualization System**

### **Live Graph Display** (During assessment)

#### **Graph 1: Joint Angle Timeline**
```
Y-axis: Angle (degrees, 0-180°)
X-axis: Time (seconds) or Frame number
Lines: 
  - Hip Flexion (Left) - Blue
  - Hip Flexion (Right) - Red
  - Knee Flexion (Left) - Green
  - Knee Flexion (Right) - Orange
  - Reference Lines: Normal ROM ranges
```

#### **Graph 2: Symmetry Monitor**
```
Y-axis: Symmetry Index (-30% to +30%)
X-axis: Time
Lines:
  - Hip Symmetry
  - Knee Symmetry
  - Ankle Symmetry
Reference Line: 0% (perfect symmetry)
Alert Zones: >10% highlighted in yellow/red
```

#### **Graph 3: Movement Velocity**
```
Y-axis: Angular velocity (degrees/second)
X-axis: Time
Lines:
  - Descent velocity
  - Ascent velocity
Reference: Optimal speed zones
```

#### **Graph 4: Center of Mass Tracking**
```
Y-axis: Vertical position (normalized)
X-axis: Horizontal position (normalized)
Visualization: Real-time dot showing COM
Ideal Path: Vertical line (minimal horizontal drift)
```

---

## 🎯 **Scoring System** (Medical-Grade)

### **Overall Functional Movement Score (FMS)**
**Scale**: 0-3 per test (21 points maximum for 7 tests)

#### **Score Definitions**:
- **3**: Performs movement correctly without compensation
- **2**: Completes movement with minor compensations
- **1**: Unable to complete movement or severe compensations
- **0**: Pain during movement (immediate stop, refer to physician)

### **Deep Squat Scoring Criteria**:

#### **Score 3** (Excellent):
- ✅ Upper torso parallel with tibia or toward vertical
- ✅ Femur below horizontal
- ✅ Knees align over feet
- ✅ Dowel (arms) aligned over feet
- ✅ No heel lift
- ✅ Bilateral symmetry

#### **Score 2** (Acceptable with compensations):
- ⚠️ Upper torso parallel with tibia or toward vertical
- ⚠️ Femur below horizontal
- ⚠️ Knees align over feet
- ⚠️ Dowel aligned over feet
- ❌ Heel lift present OR
- ❌ Mild asymmetry (10-20%)

#### **Score 1** (Poor):
- ❌ Excessive forward lean (torso not parallel with tibia)
- ❌ Femur not below horizontal (shallow squat)
- ❌ Knees cave inward (valgus) or outward (varus)
- ❌ Arms drop below horizontal
- ❌ Significant heel lift
- ❌ Moderate-severe asymmetry (>20%)

#### **Score 0** (Pain):
- 🚫 Patient reports pain during any phase of movement
- 🚫 **Action**: Stop assessment, document pain location/intensity
- 🚫 **Referral**: Consider physician evaluation

---

## 📄 **Assessment Report Generation**

### **Report Sections**:

#### **1. Patient Information**
- Name, DOB, Assessment Date
- Chief complaint
- Medical history relevant to MSK

#### **2. Assessment Summary**
- Overall FMS Score (X/21)
- Individual test scores
- High-risk areas identified

#### **3. Detailed Movement Analysis**
- **Per Test**:
  - Video thumbnail/snapshot
  - Joint angle data table
  - Symmetry analysis
  - Compensation patterns noted
  - Score and rationale

#### **4. Biomechanical Data**
- **Tables**:
  - Joint angles (max, min, average)
  - ROM percentages
  - Symmetry indices
  - Movement velocity

- **Graphs**:
  - Angle progression timeline
  - Bilateral comparison charts
  - ROM spider/radar charts
  - Symmetry bar charts

#### **5. Clinical Findings**
- **Deficiencies Identified**:
  - Mobility limitations (joint-specific)
  - Stability issues
  - Strength deficits
  - Coordination problems
  - Asymmetries

- **Risk Factors**:
  - Injury risk score (low/moderate/high)
  - Specific at-risk movements
  - Return-to-sport readiness (if applicable)

#### **6. Recommendations**
- Prescribed exercises (auto-generated based on deficiencies)
- Manual therapy needs
- Equipment recommendations
- Referrals (if needed)

#### **7. Progress Tracking** (For follow-up assessments)
- Comparison with previous assessments
- Improvement metrics
- Goal achievement status

---

## 🖥️ **User Interface Requirements**

### **During Assessment**:

```
┌─────────────────────────────────────────────────────────────┐
│  ASSESSMENT IN PROGRESS - Deep Overhead Squat (Rep 3/5)     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────┐  ┌────────────────┐   │
│  │                                 │  │  LIVE METRICS  │   │
│  │         CAMERA VIEW             │  │                │   │
│  │         (80% width)             │  │  Hip Angle     │   │
│  │                                 │  │  Left:  105°   │   │
│  │         🧍 [POSE LANDMARKS]     │  │  Right: 107°   │   │
│  │                                 │  │  Symmetry: 2%  │   │
│  │         [SKELETON OVERLAY]      │  │                │   │
│  │                                 │  │  Knee Angle    │   │
│  │                                 │  │  Left:  98°    │   │
│  │                                 │  │  Right: 95°    │   │
│  │                                 │  │  Symmetry: 3%  │   │
│  └─────────────────────────────────┘  └────────────────┘   │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  REAL-TIME GRAPHS (Below camera)                       │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐              │ │
│  │  │ Angle    │ │ Symmetry │ │ Velocity │              │ │
│  │  │ Timeline │ │ Monitor  │ │ Graph    │              │ │
│  │  └──────────┘ └──────────┘ └──────────┘              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  MOVEMENT CUES & FEEDBACK                              │ │
│  │  ✅ Good depth! ✅ Knees tracking well                 │ │
│  │  ⚠️ Watch forward lean - keep chest up                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  [◼ Stop]  [⏸ Pause]  [↻ Retry Rep]  [→ Next Test]        │
└─────────────────────────────────────────────────────────────┘
```

### **Key UI Elements**:
1. **Camera Feed**: 70-80% of viewport width, centered
2. **Live Metrics Panel**: Right sidebar, always visible
3. **Real-Time Graphs**: Below camera, 3-4 graphs side-by-side
4. **Movement Cues**: Bottom banner with real-time feedback
5. **Controls**: Bottom bar with clear action buttons

---

## ✅ **Implementation Checklist**

### **Phase 1: Enhanced Assessment UI**
- [ ] Enlarge camera view to 80% viewport width
- [ ] Add live metrics panel (joint angles updating real-time)
- [ ] Implement 3 real-time graphs (Chart.js):
  - Joint angle timeline
  - Bilateral symmetry monitor
  - Movement velocity

### **Phase 2: Biomechanical Calculations**
- [ ] Calculate 8 primary joint angles every frame
- [ ] Compute symmetry indices (left vs right)
- [ ] Track movement velocity (angular speed)
- [ ] Detect compensation patterns (rules-based)

### **Phase 3: Multi-Angle Capture**
- [ ] Add camera position selector (Front/Side/Back)
- [ ] Save video clips per view
- [ ] Sync angle data with specific views

### **Phase 4: Scoring System**
- [ ] Implement FMS scoring algorithm (0-3 scale)
- [ ] Auto-score based on captured metrics
- [ ] Manual override for clinician adjustment

### **Phase 5: Report Generation**
- [ ] Create comprehensive PDF report template
- [ ] Include all graphs, tables, and snapshots
- [ ] Generate for 3 dummy patients (complete reports)

### **Phase 6: Demo Data**
- [ ] Create complete assessment records for Sarah Johnson
- [ ] Create complete assessment records for Robert Martinez
- [ ] Create complete assessment records for Linda Chen
- [ ] Each includes: videos, angles, graphs, scores, recommendations

---

## 📚 **References**

1. Functional Movement Systems (FMS™) - Gray Cook
2. NASM Overhead Squat Assessment (OHSA) Protocol
3. MediaPipe Pose - Google Research, 2020
4. Physiopedia - Overhead Squat Test
5. NIH/PMC - Biomechanical Analysis Studies
6. TPI (Titleist Performance Institute) - Movement Screening

---

**End of Protocol Document**
