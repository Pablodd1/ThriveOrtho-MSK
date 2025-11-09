# F-AI bian Platform - Navigation & Workflow Map

## Table of Contents
1. [System Overview](#system-overview)
2. [User Roles & Entry Points](#user-roles--entry-points)
3. [Clinician Workflow](#clinician-workflow)
4. [Patient Workflow](#patient-workflow)
5. [Navigation Map](#navigation-map)
6. [AI Features Integration](#ai-features-integration)
7. [File Structure](#file-structure)

---

## System Overview

**F-AI bian Platform** is a comprehensive physical therapy management system with:
- AI-powered motion assessments
- Automated clinical documentation
- Patient engagement portal
- Device integration capabilities
- Real-time AI assistance

### Technology Stack
- **Frontend**: HTML5, TailwindCSS, JavaScript (ES6+)
- **Backend**: Hono (Cloudflare Workers)
- **AI**: Gemini API (Flash & Pro models)
- **Storage**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages

---

## User Roles & Entry Points

### 1. Clinician/Therapist
**Entry Point**: `/` (Home Page)

**Key Actions**:
- Create new patients
- Conduct assessments
- Review AI-generated reports
- Manage patient data
- Prescribe exercises

**Main Pages**:
- Dashboard (`/static/dashboard.html`)
- Intake Form (`/static/intake.html`)
- Assessment Tool (`/static/assessment-enhanced.html`)
- Human Dashboard (`/static/human-dashboard.html`)
- Medical Notes (`/static/medical-note.html`)

### 2. Patient
**Entry Point**: `/static/patient-portal.html` (Login Page)

**Key Actions**:
- View exercise program
- Track progress
- Communicate with therapist
- Ask AI trainer questions
- View progress photos

**Main Pages**:
- Patient Dashboard (`/static/patient-dashboard.html`)
- Exercise Library (`/static/exercise-library.html`)
- Messages (`/static/patient-messages.html`)
- Goals (`/static/patient-goals.html`)
- Photos (`/static/patient-photos.html`)

---

## Clinician Workflow

### Step 1: Patient Intake
**Page**: `/static/intake.html`

**Process**:
1. Enter patient demographics
2. Capture medical history
3. Record chief complaint
4. Save to database
5. Redirect to dashboard

**Exit Points**:
- ✅ Success → Dashboard (`/static/dashboard.html`)
- ❌ Cancel → Home (`/`)

---

### Step 2: Assessment
**Page**: `/static/assessment-enhanced.html`

**Process**:
1. **Camera Selection** (5 options):
   - 📱 Phone Camera
   - 💻 Laptop Camera
   - 🎥 External Camera
   - 🔬 Pro Camera (Femto Mega)
   - 🔌 **Import Data** (3rd party devices) ← NEW!

2. **Recording Tests**:
   - Squat
   - Lunge (Left/Right)
   - Single Leg Stance (Left/Right)
   - Overhead Reach
   - Sit to Stand
   - Step Up (Left/Right)

3. **AI Analysis**:
   - Real-time form correction
   - Skeleton data capture
   - Angle measurements
   - Symmetry analysis

4. **Voice Transcription**:
   - Clinical observations
   - Patient feedback
   - Test notes

**Exit Points**:
- ✅ Complete → Medical Note (`/static/medical-note.html`)
- 🔄 Quick Mode → Dashboard

---

### Step 3: Device Integration (Optional)
**Page**: `/static/device-integration.html`

**Process**:
1. **Select Device Type**:
   - Kinetisense (markerless 3D)
   - Vicon (marker-based)
   - OptiTrack (high-speed)
   - Generic (CSV/JSON)

2. **Upload File**:
   - Drag & drop or browse
   - Auto-detect format
   - Parse and validate

3. **Review Data**:
   - Frame count verification
   - Joint mapping check
   - Quality validation

4. **Import to Assessment**:
   - Normalize to F-AI bian format
   - Merge with existing data
   - Continue workflow

**Supported Formats**:
- CSV, JSON, XML, C3D, BVH, FBX

**Exit Points**:
- ✅ Import Success → Assessment or Dashboard
- 🔗 Human Dashboard → Review imported data

---

### Step 4: Human Dashboard
**Page**: `/static/human-dashboard.html`

**5 Main Tabs**:

#### Tab 1: Overview
- Patient summary cards
- Quick actions
- Recent assessments
- System stats

#### Tab 2: Patients
- Patient list
- Search/filter
- Individual patient cards
- Quick assessment launch

#### Tab 3: Assessments
- Assessment history
- Filter by date/type
- View detailed reports
- Comparison tools

#### Tab 4: Analytics
- Practice-wide metrics
- Assessment trends
- Patient outcomes
- Performance insights

#### Tab 5: AI Features
**8 AI Modules**:

1. **Form Correction AI**
   - Real-time coaching
   - Voice feedback
   - Common mistakes detection

2. **Injury Risk Assessment**
   - 7-factor analysis
   - 0-100 risk score
   - Injury predictions
   - Prevention recommendations

3. **Progress Tracker**
   - Week-over-week comparison
   - Trend analysis
   - AI-generated narratives

4. **Smart Exercise Library**
   - 15+ evidence-based exercises
   - AI matching algorithm
   - Difficulty adjustment
   - Equipment filtering

5. **Patient Education**
   - Medical jargon translator
   - 50+ term glossary
   - Interactive tooltips

6. **Skeleton Optimizer**
   - 95% storage reduction
   - Key frame extraction
   - Summary statistics

7. **AI Batch Processor**
   - Consolidated API calls
   - 66% cost savings
   - SOAP + HEP + Analysis

8. **Device Integration Hub**
   - Universal parser
   - Multi-format support
   - Quality validation

**Quick Actions**:
- 🚀 Quick Assessment
- ➕ New Patient
- 🔌 Device Import

**Navigation Links**:
- 🏠 Home (`/`)
- 📊 Dashboard (`/static/dashboard.html`)
- 📝 Intake (`/static/intake.html`)

---

### Step 5: Medical Documentation
**Page**: `/static/medical-note.html`

**AI-Generated Content**:
- SOAP Note
- Assessment Summary
- ICD-10 Code Suggestions
- Home Exercise Program
- Deficiency Analysis

**Features**:
- One-click AI generation
- Editable fields
- Export to PDF
- Save to patient record

**Exit Points**:
- ✅ Save → Dashboard
- 📧 Send to Patient

---

## Patient Workflow

### Step 1: Patient Login
**Page**: `/static/patient-portal.html`

**Process**:
1. Enter email
2. Submit (demo mode - no password)
3. Load patient context

**Exit Points**:
- ✅ Success → Patient Dashboard

---

### Step 2: Patient Dashboard
**Page**: `/static/patient-dashboard.html`

**Key Features**:
- Welcome card with patient info
- Exercise completion tracking
- Streak counter
- Calendar visualization
- Today's exercises
- Progress summary

**Quick Stats**:
- 🔥 Current Streak
- 📅 Days Completed
- 💪 Total Exercises
- 🎯 Today's Progress

**Navigation Cards**:
1. 📸 Progress Photos
2. 💬 Messages (with unread badge)
3. 🎯 Goals & Milestones
4. 📚 Exercise Library

**AI Feature**:
- 🤖 Trainer AI Helper (floating button) ← NEW!

---

### Step 3: Exercise Library
**Page**: `/static/exercise-library.html`

**Features**:
- Category filtering
- Difficulty levels
- Equipment filters
- Video demonstrations
- Step-by-step instructions
- Tips and variations

**Categories**:
- Core Stability
- Lower Body Strength
- Upper Body Strength
- Balance & Coordination
- Flexibility & Mobility
- Cardio & Conditioning

**AI Feature**:
- 🤖 Trainer AI Helper (ask about exercises) ← NEW!

**Exit Points**:
- ⬅️ Back to Dashboard

---

### Step 4: Messages
**Page**: `/static/patient-messages.html`

**Features**:
- Threaded conversations
- Unread indicators
- Compose new message
- Reply to therapist
- Message history

**AI Feature**:
- 🤖 Trainer AI Helper (ask about messages) ← NEW!

---

### Step 5: Goals
**Page**: `/static/patient-goals.html`

**Features**:
- Short-term goals (1-2 weeks)
- Long-term goals (1-3 months)
- Progress indicators
- Completion status
- Target dates

**Goal Types**:
- Pain reduction
- Range of motion
- Strength gains
- Functional milestones

**AI Feature**:
- 🤖 Trainer AI Helper (motivation & guidance) ← NEW!

---

### Step 6: Progress Photos
**Page**: `/static/patient-photos.html`

**Features**:
- Timeline view
- Before/After comparisons
- Date stamps
- Body part categorization
- Zoom functionality

**AI Feature**:
- 🤖 Trainer AI Helper (explain progress) ← NEW!

---

## Navigation Map

### Global Navigation Structure

```
/ (Home)
├── /static/intake.html (New Patient)
├── /static/dashboard.html (Clinician Dashboard)
│   ├── Start Assessment → /static/assessment-enhanced.html
│   ├── View Patient Details
│   └── Add New Patient → /static/intake.html
│
├── /static/assessment-enhanced.html (Assessment Tool)
│   ├── Camera Selection:
│   │   ├── Phone Camera
│   │   ├── Laptop Camera
│   │   ├── External Camera
│   │   ├── Pro Camera
│   │   └── Import Data → Device Import Modal
│   │       └── Open Hub → /static/device-integration.html
│   ├── Record Tests
│   ├── Voice Transcription
│   └── Complete → /static/medical-note.html
│
├── /static/device-integration.html (Device Integration Hub)
│   ├── Upload File
│   ├── Parse & Validate
│   └── Import Success → Back to Assessment
│
├── /static/human-dashboard.html (Human Dashboard)
│   ├── Tab: Overview
│   ├── Tab: Patients
│   ├── Tab: Assessments
│   ├── Tab: Analytics
│   ├── Tab: AI Features
│   ├── Header: Quick Assessment → /static/assessment-enhanced.html
│   ├── Header: New Patient → /static/intake.html
│   ├── Header: Device Import → /static/device-integration.html
│   └── Header: Home → /
│
├── /static/medical-note.html (Medical Documentation)
│   ├── Generate AI Note
│   ├── Edit Content
│   ├── Export PDF
│   └── Back to Dashboard → /static/dashboard.html
│
└── /static/patient-portal.html (Patient Login)
    └── Login → /static/patient-dashboard.html (Patient Dashboard)
        ├── 📸 Progress Photos → /static/patient-photos.html
        ├── 💬 Messages → /static/patient-messages.html
        ├── 🎯 Goals → /static/patient-goals.html
        ├── 📚 Exercise Library → /static/exercise-library.html
        └── 🤖 Trainer AI Helper (floating button - all patient pages)
```

---

## AI Features Integration

### AI Module Loading Strategy

**Lazy Loading System**: `ai-module-loader.js`

#### Auto-Load by Page Type:
1. **Assessment Pages** → Load:
   - Form Correction AI
   - Skeleton Optimizer

2. **Dashboard Pages** → Load:
   - Injury Risk AI
   - Progress Tracker
   - Smart Exercise Library
   - Patient Education
   - AI Batch Processor

3. **Device Integration** → Load:
   - Device Integration Hub

4. **Patient Portal** → Load:
   - Trainer AI Helper

#### Background Preloading:
- After 5 seconds, preload remaining modules
- Uses `requestIdleCallback` for low-priority loading
- Improves perceived performance

---

### Trainer AI Helper Integration

**Available On**:
- ✅ Patient Dashboard (`patient-dashboard.html`)
- ✅ Exercise Library (`exercise-library.html`)
- ✅ Messages (`patient-messages.html`)
- ✅ Goals (`patient-goals.html`)
- ✅ Photos (`patient-photos.html`)

**Features**:
- 🤖 Floating chat button (bottom-right)
- 💬 Conversational AI interface
- 🎯 Context-aware responses
- 📚 Exercise knowledge base
- ⚡ Quick question buttons
- 💾 Conversation history (last 10 messages)

**Quick Questions**:
1. "How do I perform this exercise correctly?"
2. "What should I feel during this exercise?"
3. "When should I stop or be concerned?"
4. "Why was this exercise prescribed to me?"
5. "How often should I do these exercises?"
6. "How will I know I'm making progress?"

**API Endpoint**: `/api/gemini-flash` (POST)

**Context Awareness**:
- Patient name
- Current exercises
- Exercise details
- Treatment plan context

**Safety Features**:
- Recommends contacting PT for pain/injury concerns
- Prioritizes patient safety
- Simple, jargon-free language
- Encouraging and supportive tone

---

## File Structure

### HTML Pages (21 total)
```
public/static/
├── index.html                     # Auto-generated by Hono
├── intake.html                    # Patient intake form
├── dashboard.html                 # Clinician dashboard
├── assessment-enhanced.html       # Main assessment tool
├── assessment-realtime.html       # Real-time assessment variant
├── assessment-report.html         # Assessment report view
├── medical-note.html              # AI-generated medical notes
├── human-dashboard.html         # Unified AI dashboard (5 tabs)
├── device-integration.html        # Device import hub
├── prescription.html              # Exercise prescription
├── reports-dashboard.html         # Reports overview
├── clinician-analytics.html       # Analytics dashboard
├── body-diagram.html              # Interactive body diagram
├── patient-portal.html            # Patient login
├── patient-dashboard.html         # Patient home page
├── exercise-library.html          # Exercise catalog
├── patient-messages.html          # Patient-therapist messaging
├── patient-goals.html             # Goal tracking
├── patient-photos.html            # Progress photos
├── test-scribe.html               # Voice transcription test
├── test-mri-reader.html           # MRI analysis test
├── camera-diagnostic.html         # Camera troubleshooting
├── camera-help-mobile.html        # Mobile camera help
└── glassmorphism-demo.html        # UI demo page
```

### JavaScript Modules (12 total)
```
public/static/
├── angle-visualization.js         # Angle overlay rendering
├── pdf-export-enhanced.js         # PDF generation
├── form-correction-ai.js          # Real-time form coaching (15.8 KB)
├── injury-risk-ai.js              # Injury prediction (18.4 KB)
├── progress-tracker-ai.js         # Progress analysis (26.7 KB)
├── smart-exercise-library.js      # Exercise matching (31.9 KB)
├── patient-education-ai.js        # Medical translator (28.4 KB)
├── skeleton-optimizer.js          # Data compression (18.4 KB)
├── ai-batch-processor.js          # API optimization (15.3 KB)
├── device-integration-hub.js      # Device parser (22.8 KB)
├── trainer-ai-helper.js           # Patient AI coach (29.0 KB) ← NEW!
└── ai-module-loader.js            # Lazy loading (10.5 KB) ← NEW!
```

### Backend Routes (20+ endpoints)
```
src/index.tsx
├── GET  /                         # Home page
├── GET  /api/patients             # List patients
├── GET  /api/patients/:id         # Get patient
├── POST /api/patients             # Create patient
├── GET  /api/patients/:id/assessments
├── GET  /api/assessments/:id
├── POST /api/assessments
├── POST /api/assessments/:id/tests
├── GET  /api/exercises
├── GET  /api/exercises/:id
├── GET  /api/prescriptions/:id
├── POST /api/prescriptions
├── POST /api/prescribed-exercises
├── POST /api/patient/auth         # Patient login
├── GET  /api/patient/:id/exercises
├── POST /api/patient/:id/complete
├── GET  /api/patient/:id/progress
├── POST /api/gemini-pro           # AI documentation
├── POST /api/gemini-flash         # Trainer AI Helper ← NEW!
└── POST /api/icd10-suggest        # ICD-10 suggestions
```

---

## Workflow Summary

### Clinician End-to-End Flow
```
Home
  ↓
Intake (Create Patient)
  ↓
Dashboard (View Patients)
  ↓
Assessment (Record Tests)
  ↓ [Optional]
Device Import (3rd Party Data)
  ↓
Medical Note (AI Documentation)
  ↓
Human Dashboard (Review AI Analysis)
  ↓
Prescription (Assign Exercises)
  ↓
Send to Patient
```

### Patient End-to-End Flow
```
Patient Portal (Login)
  ↓
Patient Dashboard (View Program)
  ↓
Exercise Library (Learn Exercises)
  ↓
Complete Exercises (Track Progress)
  ↓
Ask Trainer AI (Get Help) ← NEW!
  ↓
View Progress (Photos & Goals)
  ↓
Message Therapist (Communication)
```

---

## Key Integration Points

### 1. Assessment → Device Import
**Modal Popup** in `assessment-enhanced.html`:
- Click "Import Data" camera option
- Modal explains supported devices
- Link to Device Integration Hub
- Download sample data

### 2. Device Hub → Assessment
**After Import**:
- Data normalized to F-AI bian format
- Validated for quality
- Can continue assessment workflow
- Or navigate to Human Dashboard

### 3. Assessment → Medical Note
**Completion Flow**:
- Click "Complete Assessment"
- Redirects to medical note page
- AI generates SOAP note
- Includes all test data

### 4. Patient Dashboard → Trainer AI
**Floating Button**:
- Available on all patient pages
- Context-aware responses
- Exercise-specific help
- Safety guidance

### 5. All Pages → Human Dashboard
**Central Hub**:
- Accessible from header
- Device Import button
- Quick Assessment button
- New Patient button

---

## Performance Optimization

### 1. Lazy Loading
- AI modules load only when needed
- Background preloading after 5s
- Reduces initial page load time

### 2. Data Compression
- Skeleton data: 95% reduction
- Key frame extraction
- Summary statistics

### 3. API Batching
- Consolidated Gemini calls
- 66% cost reduction
- Single request for multiple analyses

### 4. CDN Resources
- TailwindCSS from CDN
- FontAwesome from CDN
- Lodash, Axios from CDN
- Reduces bundle size

---

## Error Handling & Diagnostics

### Camera Issues
- **Diagnostic Tool**: `/static/camera-diagnostic.html`
- **Mobile Help**: `/static/camera-help-mobile.html`
- Auto-link in error messages

### Device Import Issues
- Auto-detection fallback
- Format validation
- User-friendly error messages
- Sample data available

### AI API Failures
- Graceful degradation
- User-friendly error messages
- Retry mechanisms
- Fallback responses

---

## Future Enhancements (Not Implemented)

1. **Direct Upload from Modal**
   - Upload device data without leaving assessment page

2. **Real-Time Device Streaming**
   - Live data streaming from connected devices

3. **Automated Device Detection**
   - USB/Bluetooth auto-detection

4. **Batch Import**
   - Import multiple assessments at once

5. **Export to Device Formats**
   - Convert F-AI bian data back to device formats

---

## Version History

- **v1.0** - Initial platform with core features
- **v2.0** - Added 8 AI features (Phase D)
- **v3.0** - Added device integration (Phase E)
- **v4.0** - Integrated device import into assessment flow
- **v5.0** - Added Trainer AI Helper for patients ← CURRENT
- **v5.1** - Added AI module lazy loading optimization

---

## Support & Contact

For technical issues or feature requests, contact the F-AI bian Platform team.

**Documentation Files**:
- `README.md` - Project overview
- `DEVICE_INTEGRATION_GUIDE.md` - Technical device integration docs
- `DEVICE_INTEGRATION_QUICKSTART.md` - Quick start guide
- `NAVIGATION_WORKFLOW_MAP.md` - This file

---

*Last Updated: 2025-01-08*
*Version: 5.1.0*
