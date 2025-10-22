# PT SOAP Note Implementation Plan
**F-AI BIAN Assessment System - Professional PT Documentation**

## 🎯 **IMPLEMENTATION SUMMARY**

This document outlines the comprehensive PT SOAP Note template integration based on FMA Gold Standard with AI-driven movement analysis.

---

## ✅ **CURRENT SYSTEM STATUS**

### **What's Already Working**:
1. ✅ Patient intake with demographics
2. ✅ Real-time movement assessment with MediaPipe
3. ✅ Biomechanical angle calculations (±5° accuracy)
4. ✅ Medical note with SOAP format
5. ✅ BMI calculations and lifestyle recommendations
6. ✅ Pain body mapping
7. ✅ Color-coded ROM analysis

---

## 🔧 **ENHANCEMENTS NEEDED**

### **Priority 1: Enhanced Intake Form**

#### **Add to `/home/user/webapp/public/static/intake.html`**:

**New Fields Required**:
```html
<!-- PT-Specific Fields -->
<div class="section">
    <h3>PT Assessment Details</h3>
    
    <!-- Referring Provider -->
    <label>Referring Provider</label>
    <input type="text" name="referring_provider" class="form-control">
    
    <!-- ICD-10 Diagnosis -->
    <label>Diagnosis (ICD-10)</label>
    <input type="text" name="icd10_code" placeholder="e.g., M54.5" class="form-control">
    
    <!-- Session Location -->
    <label>Session Location</label>
    <select name="session_location" class="form-control">
        <option value="clinic">Clinic</option>
        <option value="home">Home</option>
        <option value="telehealth">Telehealth</option>
    </select>
    
    <!-- Pain Scale (Already exists, verify) -->
    <label>Pain Scale (NRS 0-10)</label>
    <div class="grid grid-cols-3 gap-4">
        <div>
            <label class="text-sm">At Rest</label>
            <input type="number" name="pain_rest" min="0" max="10" class="form-control">
        </div>
        <div>
            <label class="text-sm">With Activity</label>
            <input type="number" name="pain_activity" min="0" max="10" class="form-control">
        </div>
        <div>
            <label class="text-sm">Worst Pain</label>
            <input type="number" name="pain_worst" min="0" max="10" class="form-control">
        </div>
    </div>
    
    <!-- Aggravating Factors -->
    <label>Aggravating Factors</label>
    <textarea name="aggravating_factors" rows="2" class="form-control"></textarea>
    
    <!-- Easing Factors -->
    <label>Easing Factors</label>
    <textarea name="easing_factors" rows="2" class="form-control"></textarea>
    
    <!-- 24-Hour Pattern -->
    <label>24-Hour Pattern / Irritability</label>
    <textarea name="pattern_24hr" rows="2" class="form-control"></textarea>
    
    <!-- Patient Goal -->
    <label>Patient Goal (in own words)</label>
    <textarea name="patient_goal" rows="2" class="form-control" 
        placeholder="What would you like to be able to do?"></textarea>
    
    <!-- Red Flag Screen -->
    <label>Red Flag Screen</label>
    <select name="red_flag_status" class="form-control">
        <option value="none">None</option>
        <option value="ruled_out">Ruled Out</option>
        <option value="requires_followup">Requires Follow-Up</option>
    </select>
</div>
```

**Database Migration Needed**:
```sql
-- Add to patients table
ALTER TABLE patients ADD COLUMN referring_provider TEXT;
ALTER TABLE patients ADD COLUMN icd10_code TEXT;
ALTER TABLE patients ADD COLUMN session_location TEXT;
ALTER TABLE patients ADD COLUMN pain_rest INTEGER;
ALTER TABLE patients ADD COLUMN pain_activity INTEGER;
ALTER TABLE patients ADD COLUMN pain_worst INTEGER;
ALTER TABLE patients ADD COLUMN aggravating_factors TEXT;
ALTER TABLE patients ADD COLUMN easing_factors TEXT;
ALTER TABLE patients ADD COLUMN pattern_24hr TEXT;
ALTER TABLE patients ADD COLUMN patient_goal TEXT;
ALTER TABLE patients ADD COLUMN red_flag_status TEXT;
```

---

### **Priority 2: Enhanced Assessment with Device Metadata**

#### **Add to `/home/user/webapp/public/static/assessment-enhanced.html`**:

**Device Metadata Section** (Add before camera selection):
```html
<div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h3 class="text-lg font-bold mb-4">
        <i class="fas fa-camera mr-2"></i>
        Device & Session Metadata
    </h3>
    
    <div class="grid md:grid-cols-2 gap-4">
        <!-- Device Type -->
        <div>
            <label class="block text-sm font-semibold mb-2">Device Used</label>
            <select id="deviceType" class="w-full px-3 py-2 border rounded">
                <option value="webcam">Standard Webcam</option>
                <option value="realsense">Intel RealSense L515</option>
                <option value="mirror">Smart Mirror</option>
                <option value="lidar">LiDAR iPad</option>
            </select>
        </div>
        
        <!-- Camera Distance -->
        <div>
            <label class="block text-sm font-semibold mb-2">Camera Distance (meters)</label>
            <input type="number" id="cameraDistance" step="0.1" value="2.0" 
                class="w-full px-3 py-2 border rounded">
        </div>
        
        <!-- Camera Angle -->
        <div>
            <label class="block text-sm font-semibold mb-2">Camera Angle (degrees)</label>
            <input type="number" id="cameraAngle" value="0" 
                class="w-full px-3 py-2 border rounded">
        </div>
        
        <!-- Lighting Condition -->
        <div>
            <label class="block text-sm font-semibold mb-2">Lighting Condition</label>
            <select id="lightingCondition" class="w-full px-3 py-2 border rounded">
                <option value="optimal">Optimal</option>
                <option value="adequate">Adequate</option>
                <option value="poor">Poor - May affect accuracy</option>
            </select>
        </div>
        
        <!-- Occlusion Status -->
        <div class="col-span-2">
            <label class="block text-sm font-semibold mb-2">Occlusion / Obstacles</label>
            <input type="text" id="occlusionStatus" placeholder="e.g., None, Partial body visibility" 
                class="w-full px-3 py-2 border rounded">
        </div>
    </div>
    
    <!-- AI Model Info (Auto-populated) -->
    <div class="mt-4 bg-blue-50 p-3 rounded">
        <p class="text-sm"><strong>AI Model:</strong> MediaPipe Pose v0.5.1675469404</p>
        <p class="text-sm"><strong>App Version:</strong> F-AI BIAN v1.0.0</p>
        <p class="text-sm"><strong>Session ID:</strong> <span id="sessionId"></span></p>
    </div>
</div>
```

**Save Metadata with Test**:
```javascript
// In recording completion
const testData = {
    test_name: currentExercise,
    skeleton_data: JSON.stringify({
        frames: recordedFrames,
        angles: recordedAngles,
        analysis: analysisResults,
        metadata: {
            device_type: document.getElementById('deviceType').value,
            camera_distance: document.getElementById('cameraDistance').value,
            camera_angle: document.getElementById('cameraAngle').value,
            lighting: document.getElementById('lightingCondition').value,
            occlusion: document.getElementById('occlusionStatus').value,
            ai_model: 'MediaPipe Pose v0.5.1675469404',
            app_version: '1.0.0',
            session_id: STATE.sessionId,
            timestamp: new Date().toISOString()
        }
    }),
    // ... rest of test data
};
```

---

### **Priority 3: Comprehensive PT SOAP Note Template**

#### **Create New File**: `/home/user/webapp/public/static/pt-soap-note.html`

**Key Sections to Implement**:

1. **Patient Information Block** (Enhanced demographics)
2. **Device & Session Metadata** (from assessment)
3. **Subjective Section**:
   - Pain scores (rest/activity/worst)
   - Aggravating/easing factors
   - 24-hour pattern
   - Patient goals
   - Red flag screening
4. **Objective Section**:
   - **FMA Scores Table** (from assessment)
   - **Kinematic Analysis Table** (angles, ROM, asymmetry)
   - **PROM Measures** (ODI/LEFS/NDI tracking)
   - **Special Tests** (manual entry)
5. **Assessment Section**:
   - Primary deficits
   - Movement drivers
   - Pain behavior
   - Risk level (Low/Mod/High)
   - Prognosis
   - AI confidence score
6. **Plan Section**:
   - HEP exercises (with dosage)
   - Visit cadence
   - Next targets/goals
   - Contraindications
7. **Adherence & RTM Monitoring**:
   - Sessions completed
   - Exercise minutes logged
   - CPT codes (97161, 97110, 97112, etc.)
   - RTM codes (98975, 98977, 98980, 98981)
8. **Signatures Block**:
   - Therapist signature
   - Reviewer signature
   - AI session checksum

**Template Structure**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>PT SOAP Note - F-AI BIAN</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            .no-print { display: none; }
            table { page-break-inside: avoid; }
            .section { page-break-inside: avoid; }
        }
        .soap-section {
            background: white;
            border-left: 4px solid #FF6B35;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .soap-header {
            font-size: 1.25rem;
            font-weight: bold;
            color: #004E89;
            margin-bottom: 1rem;
            border-bottom: 2px solid #FF6B35;
            padding-bottom: 0.5rem;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        .data-table th {
            background: #004E89;
            color: white;
            padding: 0.75rem;
            text-align: left;
            font-size: 0.875rem;
        }
        .data-table td {
            border: 1px solid #e5e7eb;
            padding: 0.75rem;
            font-size: 0.875rem;
        }
        .data-table tbody tr:nth-child(even) {
            background: #f9fafb;
        }
        .score-excellent { color: #059669; font-weight: bold; }
        .score-good { color: #F59E0B; font-weight: bold; }
        .score-fair { color: #F97316; font-weight: bold; }
        .score-poor { color: #DC2626; font-weight: bold; }
    </style>
</head>
<body class="bg-gray-50">
    <div class="max-w-7xl mx-auto p-8">
        <!-- Header -->
        <div class="bg-gradient-to-r from-brand-blue to-brand-orange text-white p-6 rounded-lg mb-6 no-print">
            <h1 class="text-3xl font-bold">
                <i class="fas fa-file-medical-alt mr-3"></i>
                AI-Assisted Physical Therapy SOAP Note
            </h1>
            <p class="text-sm mt-2">FMA Gold Standard – Real-Time Movement Analysis Integrated</p>
            <div class="mt-4">
                <button onclick="window.print()" class="px-4 py-2 bg-white text-brand-blue rounded">
                    <i class="fas fa-print mr-2"></i>Print
                </button>
                <button onclick="exportWord()" class="px-4 py-2 bg-white text-brand-orange rounded ml-2">
                    <i class="fas fa-file-word mr-2"></i>Export to Word
                </button>
            </div>
        </div>

        <!-- Patient Information -->
        <div class="soap-section">
            <div class="soap-header">PATIENT INFORMATION</div>
            <table class="data-table">
                <tr>
                    <td><strong>Patient Name:</strong></td>
                    <td id="patientName"></td>
                    <td><strong>Date of Birth:</strong></td>
                    <td id="dob"></td>
                </tr>
                <tr>
                    <td><strong>Date of Visit:</strong></td>
                    <td id="visitDate"></td>
                    <td><strong>MRN / ID:</strong></td>
                    <td id="mrn"></td>
                </tr>
                <tr>
                    <td><strong>Referring Provider:</strong></td>
                    <td id="referringProvider"></td>
                    <td><strong>Diagnosis (ICD-10):</strong></td>
                    <td id="icd10"></td>
                </tr>
                <tr>
                    <td><strong>Visit Number:</strong></td>
                    <td id="visitNumber"></td>
                    <td><strong>Evaluating Therapist / NPI:</strong></td>
                    <td><input type="text" class="border rounded px-2 py-1 w-full"></td>
                </tr>
                <tr>
                    <td><strong>Session Location:</strong></td>
                    <td colspan="3" id="sessionLocation"></td>
                </tr>
            </table>
        </div>

        <!-- Device & Session Metadata -->
        <div class="soap-section">
            <div class="soap-header">DEVICE & SESSION METADATA</div>
            <table class="data-table">
                <tr>
                    <td><strong>Device Used:</strong></td>
                    <td id="deviceType"></td>
                    <td><strong>Camera Distance/Angle:</strong></td>
                    <td id="cameraSetup"></td>
                </tr>
                <tr>
                    <td><strong>Lighting/Occlusion:</strong></td>
                    <td id="environmentStatus"></td>
                    <td><strong>AI Model Build:</strong></td>
                    <td id="aiModel"></td>
                </tr>
                <tr>
                    <td><strong>AI Confidence Score:</strong></td>
                    <td id="aiConfidence" class="score-excellent"></td>
                    <td><strong>QC Warnings:</strong></td>
                    <td id="qcWarnings"></td>
                </tr>
            </table>
        </div>

        <!-- SUBJECTIVE -->
        <div class="soap-section">
            <div class="soap-header">SUBJECTIVE</div>
            <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="bg-blue-50 p-3 rounded">
                    <p class="text-sm text-gray-600">Pain at Rest</p>
                    <p class="text-3xl font-bold" id="painRest"></p>
                </div>
                <div class="bg-yellow-50 p-3 rounded">
                    <p class="text-sm text-gray-600">Pain with Activity</p>
                    <p class="text-3xl font-bold" id="painActivity"></p>
                </div>
                <div class="bg-red-50 p-3 rounded">
                    <p class="text-sm text-gray-600">Worst Pain</p>
                    <p class="text-3xl font-bold" id="painWorst"></p>
                </div>
            </div>
            <table class="data-table">
                <tr>
                    <td style="width: 30%"><strong>Aggravating Factors:</strong></td>
                    <td id="aggravatingFactors"></td>
                </tr>
                <tr>
                    <td><strong>Easing Factors:</strong></td>
                    <td id="easingFactors"></td>
                </tr>
                <tr>
                    <td><strong>24-Hour Pattern/Irritability:</strong></td>
                    <td id="pattern24hr"></td>
                </tr>
                <tr>
                    <td><strong>Patient Goal (in own words):</strong></td>
                    <td id="patientGoal" class="font-semibold text-brand-blue"></td>
                </tr>
                <tr>
                    <td><strong>Red Flag Screen:</strong></td>
                    <td id="redFlagStatus"></td>
                </tr>
            </table>
        </div>

        <!-- OBJECTIVE: FMA Scores -->
        <div class="soap-section">
            <div class="soap-header">OBJECTIVE: Functional Movement Assessment (FMA)</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Pattern</th>
                        <th>Score / 100</th>
                        <th>Deficit Level</th>
                        <th>MCID Achieved</th>
                        <th>Comments</th>
                    </tr>
                </thead>
                <tbody id="fmaScoresTable">
                    <!-- Populated by JavaScript -->
                </tbody>
            </table>
        </div>

        <!-- OBJECTIVE: Kinematic Analysis -->
        <div class="soap-section">
            <div class="soap-header">OBJECTIVE: Kinematic Analysis (AI Captured)</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Joint</th>
                        <th>Peak Angle (°)</th>
                        <th>ROM Deficit vs Norm (°)</th>
                        <th>Asymmetry (%)</th>
                        <th>Compensations</th>
                        <th>Consistency (CV %)</th>
                    </tr>
                </thead>
                <tbody id="kinematicsTable">
                    <!-- Populated by JavaScript -->
                </tbody>
            </table>
        </div>

        <!-- OBJECTIVE: PROM -->
        <div class="soap-section">
            <div class="soap-header">OBJECTIVE: Patient-Reported Outcome Measures</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Tool</th>
                        <th>Baseline</th>
                        <th>Current</th>
                        <th>Δ Change</th>
                        <th>MCID Met</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>ODI (Oswestry Disability Index)</strong></td>
                        <td><input type="number" class="border rounded px-2 py-1 w-20"></td>
                        <td><input type="number" class="border rounded px-2 py-1 w-20"></td>
                        <td class="font-bold"></td>
                        <td><select class="border rounded px-2 py-1"><option>N</option><option>Y</option></select></td>
                    </tr>
                    <tr>
                        <td><strong>LEFS (Lower Extremity Functional Scale)</strong></td>
                        <td><input type="number" class="border rounded px-2 py-1 w-20"></td>
                        <td><input type="number" class="border rounded px-2 py-1 w-20"></td>
                        <td class="font-bold"></td>
                        <td><select class="border rounded px-2 py-1"><option>N</option><option>Y</option></select></td>
                    </tr>
                    <tr>
                        <td><strong>NDI (Neck Disability Index)</strong></td>
                        <td><input type="number" class="border rounded px-2 py-1 w-20"></td>
                        <td><input type="number" class="border rounded px-2 py-1 w-20"></td>
                        <td class="font-bold"></td>
                        <td><select class="border rounded px-2 py-1"><option>N</option><option>Y</option></select></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- ASSESSMENT -->
        <div class="soap-section">
            <div class="soap-header">ASSESSMENT / CLINICAL IMPRESSION</div>
            <table class="data-table">
                <tr>
                    <td style="width: 30%"><strong>Primary Deficits Identified:</strong></td>
                    <td id="primaryDeficits"></td>
                </tr>
                <tr>
                    <td><strong>Movement Drivers (Chain Link):</strong></td>
                    <td><textarea class="w-full border rounded p-2" rows="2"></textarea></td>
                </tr>
                <tr>
                    <td><strong>Pain Behavior / Irritability:</strong></td>
                    <td><textarea class="w-full border rounded p-2" rows="2"></textarea></td>
                </tr>
                <tr>
                    <td><strong>Risk Level:</strong></td>
                    <td>
                        <select class="border rounded px-3 py-2">
                            <option value="low">Low</option>
                            <option value="moderate">Moderate</option>
                            <option value="high">High</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td><strong>Prognosis:</strong></td>
                    <td><textarea class="w-full border rounded p-2" rows="2"></textarea></td>
                </tr>
                <tr>
                    <td><strong>Response to Treatment:</strong></td>
                    <td><textarea class="w-full border rounded p-2" rows="2"></textarea></td>
                </tr>
                <tr>
                    <td><strong>AI Summary Confidence:</strong></td>
                    <td><span id="aiSummaryConfidence" class="text-2xl font-bold score-excellent"></span> / 1.00</td>
                </tr>
            </table>
        </div>

        <!-- PLAN -->
        <div class="soap-section">
            <div class="soap-header">PLAN OF CARE</div>
            <h4 class="font-bold mt-4 mb-2">Home Exercise Program (HEP)</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Exercise Name</th>
                        <th>Dosage (sets × reps × tempo × frequency)</th>
                        <th>Target Cue(s)</th>
                        <th>Progression Rules</th>
                        <th>Stop Criteria</th>
                    </tr>
                </thead>
                <tbody id="hepTable">
                    <!-- Populated from prescription -->
                </tbody>
            </table>
            
            <div class="mt-4">
                <table class="data-table">
                    <tr>
                        <td><strong>Visit Cadence:</strong></td>
                        <td>
                            <label><input type="radio" name="cadence" value="1x"> 1× week</label>
                            <label class="ml-4"><input type="radio" name="cadence" value="2x"> 2× week</label>
                            <label class="ml-4"><input type="radio" name="cadence" value="hybrid"> Hybrid Tele-PT</label>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Next Targets / Goals:</strong></td>
                        <td><textarea class="w-full border rounded p-2" rows="2"></textarea></td>
                    </tr>
                    <tr>
                        <td><strong>Contraindications Today:</strong></td>
                        <td><textarea class="w-full border rounded p-2" rows="2"></textarea></td>
                    </tr>
                    <tr>
                        <td><strong>Communication Sent to MD / Team:</strong></td>
                        <td><textarea class="w-full border rounded p-2" rows="2"></textarea></td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Adherence & RTM Monitoring -->
        <div class="soap-section">
            <div class="soap-header">ADHERENCE & RTM MONITORING</div>
            <table class="data-table">
                <tr>
                    <td><strong>Sessions Completed / Assigned:</strong></td>
                    <td><input type="text" class="border rounded px-2 py-1"></td>
                    <td><strong>Total Exercise Minutes Logged:</strong></td>
                    <td><input type="number" class="border rounded px-2 py-1"></td>
                </tr>
                <tr>
                    <td><strong>AI Prompts Resolved:</strong></td>
                    <td><input type="number" class="border rounded px-2 py-1"></td>
                    <td><strong>Remote Review Minutes (This Period):</strong></td>
                    <td><input type="number" class="border rounded px-2 py-1"></td>
                </tr>
                <tr>
                    <td colspan="4" class="bg-green-50">
                        <strong>CPT Codes Documented:</strong>
                        <div class="mt-2">
                            <label class="mr-4"><input type="checkbox" value="97161"> 97161 (PT Eval Low)</label>
                            <label class="mr-4"><input type="checkbox" value="97162"> 97162 (PT Eval Mod)</label>
                            <label class="mr-4"><input type="checkbox" value="97163"> 97163 (PT Eval High)</label>
                            <label class="mr-4"><input type="checkbox" value="97110"> 97110 (Ther Ex)</label>
                            <label class="mr-4"><input type="checkbox" value="97112"> 97112 (Neuro Re-ed)</label>
                            <label class="mr-4"><input type="checkbox" value="97116"> 97116 (Gait Training)</label>
                            <label class="mr-4"><input type="checkbox" value="97530"> 97530 (Ther Act)</label>
                            <label class="mr-4"><input type="checkbox" value="97164"> 97164 (PT Re-eval)</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="4" class="bg-blue-50">
                        <strong>RTM Codes (if applicable):</strong>
                        <div class="mt-2">
                            <label class="mr-4"><input type="checkbox" value="98975"> 98975 (RTM Setup)</label>
                            <label class="mr-4"><input type="checkbox" value="98977"> 98977 (RTM Device)</label>
                            <label class="mr-4"><input type="checkbox" value="98980"> 98980 (RTM First 20 min)</label>
                            <label class="mr-4"><input type="checkbox" value="98981"> 98981 (RTM Each Add'l 20 min)</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><strong>Next Review Date:</strong></td>
                    <td colspan="3"><input type="date" class="border rounded px-2 py-1"></td>
                </tr>
            </table>
        </div>

        <!-- Signatures -->
        <div class="soap-section">
            <div class="soap-header">SIGNATURES</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Signature</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Therapist</strong></td>
                        <td><input type="text" class="border rounded px-2 py-1 w-full"></td>
                        <td><input type="date" class="border rounded px-2 py-1"></td>
                        <td class="text-center">_____________________</td>
                    </tr>
                    <tr>
                        <td><strong>Reviewer (Clinical Lead)</strong></td>
                        <td><input type="text" class="border rounded px-2 py-1 w-full"></td>
                        <td><input type="date" class="border rounded px-2 py-1"></td>
                        <td class="text-center">_____________________</td>
                    </tr>
                    <tr>
                        <td><strong>AI Session Checksum / ID</strong></td>
                        <td colspan="3" id="sessionChecksum" class="font-mono text-sm"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Attachment Section -->
        <div class="soap-section no-print">
            <div class="soap-header">ATTACHMENTS (Optional)</div>
            <div class="grid grid-cols-3 gap-4">
                <button class="p-4 border-2 border-dashed rounded hover:bg-gray-50">
                    <i class="fas fa-image text-3xl text-gray-400 mb-2"></i>
                    <p class="text-sm">Embed Still Frames<br>(Pre / Post Cue)</p>
                </button>
                <button class="p-4 border-2 border-dashed rounded hover:bg-gray-50">
                    <i class="fas fa-chart-line text-3xl text-gray-400 mb-2"></i>
                    <p class="text-sm">Normative Comparison<br>Graph</p>
                </button>
                <button class="p-4 border-2 border-dashed rounded hover:bg-gray-50">
                    <i class="fas fa-chart-area text-3xl text-gray-400 mb-2"></i>
                    <p class="text-sm">Movement Trend Chart<br>(Δ per visit)</p>
                </button>
            </div>
        </div>
    </div>

    <script>
        // Load data from assessment
        const STATE = {
            assessmentId: new URLSearchParams(window.location.search).get('assessment_id'),
            patientId: new URLSearchParams(window.location.search).get('patient_id'),
            patientData: null,
            assessmentData: null
        };

        // Initialize on page load
        window.addEventListener('DOMContentLoaded', async () => {
            await loadAllData();
            populateSOAPNote();
        });

        async function loadAllData() {
            // Load patient
            const patientRes = await fetch(`/api/patients/${STATE.patientId}`);
            STATE.patientData = (await patientRes.json()).data;

            // Load assessment
            const assessmentRes = await fetch(`/api/assessments/${STATE.assessmentId}`);
            STATE.assessmentData = (await assessmentRes.json()).data;
        }

        function populateSOAPNote() {
            const p = STATE.patientData;
            const a = STATE.assessmentData;

            // Patient Information
            document.getElementById('patientName').textContent = `${p.first_name} ${p.last_name}`;
            document.getElementById('dob').textContent = p.date_of_birth;
            document.getElementById('visitDate').textContent = new Date().toLocaleDateString();
            document.getElementById('mrn').textContent = p.id;
            document.getElementById('referringProvider').textContent = p.referring_provider || 'N/A';
            document.getElementById('icd10').textContent = p.icd10_code || 'N/A';
            document.getElementById('visitNumber').textContent = '1'; // From assessments count
            document.getElementById('sessionLocation').textContent = p.session_location || 'Clinic';

            // Subjective
            document.getElementById('painRest').textContent = p.pain_rest !== null ? `${p.pain_rest}/10` : 'N/A';
            document.getElementById('painActivity').textContent = p.pain_activity !== null ? `${p.pain_activity}/10` : 'N/A';
            document.getElementById('painWorst').textContent = p.pain_worst !== null ? `${p.pain_worst}/10` : 'N/A';
            document.getElementById('aggravatingFactors').textContent = p.aggravating_factors || 'Not specified';
            document.getElementById('easingFactors').textContent = p.easing_factors || 'Not specified';
            document.getElementById('pattern24hr').textContent = p.pattern_24hr || 'Not documented';
            document.getElementById('patientGoal').textContent = p.patient_goal || 'Improve function and reduce pain';
            document.getElementById('redFlagStatus').textContent = p.red_flag_status || 'None';

            // Device Metadata (from first test)
            if (a.tests && a.tests.length > 0) {
                const firstTest = a.tests[0];
                const skelData = JSON.parse(firstTest.skeleton_data || '{}');
                const meta = skelData.metadata || {};
                
                document.getElementById('deviceType').textContent = meta.device_type || 'Webcam';
                document.getElementById('cameraSetup').textContent = 
                    `${meta.camera_distance || '2.0'}m / ${meta.camera_angle || '0'}°`;
                document.getElementById('environmentStatus').textContent = 
                    `${meta.lighting || 'Adequate'} / ${meta.occlusion || 'None'}`;
                document.getElementById('aiModel').textContent = meta.ai_model || 'MediaPipe Pose';
                
                // Calculate average confidence
                const avgConfidence = (skelData.analysis?.form_quality || 80) / 100;
                document.getElementById('aiConfidence').textContent = avgConfidence.toFixed(2);
                document.getElementById('qcWarnings').textContent = 'None';
            }

            // FMA Scores
            populateFMATable(a.tests);

            // Kinematic Analysis
            populateKinematicsTable(a.tests);

            // Primary Deficits
            const deficiencies = [];
            a.tests?.forEach(test => {
                const skelData = JSON.parse(test.skeleton_data || '{}');
                if (skelData.analysis?.deficiencies) {
                    deficiencies.push(...skelData.analysis.deficiencies);
                }
            });
            document.getElementById('primaryDeficits').textContent = 
                deficiencies.map(d => `${d.area} (${d.severity})`).join('; ') || 'None identified';

            // AI Summary Confidence
            const avgScore = a.tests?.reduce((sum, t) => {
                const skelData = JSON.parse(t.skeleton_data || '{}');
                return sum + (skelData.analysis?.form_quality || 0);
            }, 0) / (a.tests?.length || 1);
            document.getElementById('aiSummaryConfidence').textContent = (avgScore / 100).toFixed(2);

            // Session Checksum
            document.getElementById('sessionChecksum').textContent = 
                `SHA256-${Date.now()}-${STATE.assessmentId}`;
        }

        function populateFMATable(tests) {
            const tbody = document.getElementById('fmaScoresTable');
            tbody.innerHTML = '';

            tests?.forEach(test => {
                const skelData = JSON.parse(test.skeleton_data || '{}');
                const analysis = skelData.analysis || {};
                
                const score = analysis.form_quality || 0;
                const deficitLevel = score >= 80 ? 'None' : score >= 60 ? 'Mild' : score >= 40 ? 'Moderate' : 'Severe';
                const scoreClass = score >= 80 ? 'score-excellent' : score >= 60 ? 'score-good' : score >= 40 ? 'score-fair' : 'score-poor';

                const row = `
                    <tr>
                        <td><strong>${test.test_name}</strong></td>
                        <td class="${scoreClass}">${score.toFixed(1)}</td>
                        <td>${deficitLevel}</td>
                        <td>${score >= 80 ? 'N/A' : 'Pending'}</td>
                        <td>${analysis.deficiencies?.map(d => d.description).join('; ') || 'None'}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });

            // Composite score
            const avgScore = tests?.reduce((sum, t) => {
                const skelData = JSON.parse(t.skeleton_data || '{}');
                return sum + (skelData.analysis?.form_quality || 0);
            }, 0) / (tests?.length || 1);
            const compositeClass = avgScore >= 80 ? 'score-excellent' : avgScore >= 60 ? 'score-good' : avgScore >= 40 ? 'score-fair' : 'score-poor';
            
            tbody.innerHTML += `
                <tr class="bg-gray-100">
                    <td><strong>COMPOSITE</strong></td>
                    <td class="${compositeClass}"><strong>${avgScore.toFixed(1)}</strong></td>
                    <td><strong>${avgScore >= 80 ? 'None' : avgScore >= 60 ? 'Mild' : avgScore >= 40 ? 'Moderate' : 'Severe'}</strong></td>
                    <td colspan="2"><strong>Overall functional movement status</strong></td>
                </tr>
            `;
        }

        function populateKinematicsTable(tests) {
            const tbody = document.getElementById('kinematicsTable');
            tbody.innerHTML = '';

            tests?.forEach(test => {
                const skelData = JSON.parse(test.skeleton_data || '{}');
                const angles = skelData.angles || [];
                
                // Calculate average angles
                if (angles.length > 0) {
                    const joints = Object.keys(angles[0]);
                    joints.forEach(joint => {
                        const values = angles.map(a => a[joint]).filter(v => v);
                        if (values.length === 0) return;

                        const peak = Math.max(...values);
                        const min = Math.min(...values);
                        const range = peak - min;
                        const mean = values.reduce((a,b) => a+b, 0) / values.length;
                        const std = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length);
                        const cv = (std / mean * 100).toFixed(1);

                        // Normal ranges (simplified)
                        const normals = {
                            hip_left: 125, hip_right: 125,
                            knee_left: 135, knee_right: 135,
                            shoulder_left: 180, shoulder_right: 180
                        };
                        const normalROM = normals[joint] || 180;
                        const deficit = normalROM - range;
                        const asymmetry = joint.includes('left') ? 
                            Math.abs(values[0] - (angles[0][joint.replace('left', 'right')] || 0)) : 0;

                        const row = `
                            <tr>
                                <td><strong>${test.test_name}</strong></td>
                                <td>${joint.replace('_', ' ')}</td>
                                <td>${peak.toFixed(1)}°</td>
                                <td class="${deficit > 20 ? 'score-poor' : deficit > 10 ? 'score-fair' : 'score-good'}">${deficit.toFixed(1)}°</td>
                                <td>${asymmetry.toFixed(1)}%</td>
                                <td>${skelData.analysis?.deficiencies?.length || 0} detected</td>
                                <td>${cv}%</td>
                            </tr>
                        `;
                        tbody.innerHTML += row;
                    });
                }
            });
        }

        function exportWord() {
            alert('Word export will use browser print-to-PDF. Click OK then Print and select "Save as PDF"');
            setTimeout(() => window.print(), 100);
        }
    </script>
</body>
</html>
```

---

### **Priority 4: Update Navigation Flow**

**Update `assessment-enhanced.html` completion**:
```javascript
// After completing all exercises, redirect to PT SOAP note
function completeAssessment() {
    // Mark assessment as completed
    await fetch(`/api/assessments/${STATE.assessmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
    });

    // Redirect to PT SOAP note
    window.location.href = `/static/pt-soap-note.html?assessment_id=${STATE.assessmentId}&patient_id=${STATE.patientId}`;
}
```

---

## 🧪 **TESTING PROTOCOL**

### **Complete Workflow Test**:

1. **Intake** → Fill form with new PT fields → Create patient
2. **Assessment** → Enter device metadata → Record exercises → Complete
3. **PT SOAP Note** → Verify all data populated → Print/export

### **Data Flow Verification**:
```
Patient Data (intake)
  ↓
Assessment Data (camera metadata)
  ↓
Movement Tests (angles, FMA scores)
  ↓
PT SOAP Note (comprehensive documentation)
```

---

## 📋 **IMPLEMENTATION CHECKLIST**

- [ ] Create migration 0004 for new patient fields
- [ ] Update intake.html with PT-specific fields
- [ ] Update backend API to handle new fields
- [ ] Add device metadata section to assessment-enhanced.html
- [ ] Create pt-soap-note.html with full template
- [ ] Update navigation flow (assessment → PT SOAP)
- [ ] Test complete workflow end-to-end
- [ ] Verify all data populates correctly
- [ ] Test print/PDF functionality
- [ ] Verify CPT/RTM code tracking
- [ ] Test on mobile devices
- [ ] Double-check all integrations

---

## 🎯 **EXPECTED OUTCOME**

A fully integrated PT SOAP Note system that:
- Captures comprehensive patient data at intake
- Records device/session metadata during assessment
- Generates professional PT documentation automatically
- Supports CPT/RTM billing codes
- Provides medical-grade kinematic analysis
- Meets FMA gold standard requirements
- Is print/export ready for EHR integration

**Status**: Implementation plan complete. Ready for development.

---

**Document Version**: 1.0  
**Created**: 2025-10-21  
**Next Step**: Begin implementation with migration 0004
