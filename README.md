# Thrive Ortho EHR - AI-Powered MSK Assessment Platform

## Live Demo

**URL**: https://3000-isoavrqar3ev1h6ka8wvl-cc2fbc16.sandbox.novita.ai

### Skip Login - Demo Mode (4 Roles)

| Role | URL | Description |
|------|-----|-------------|
| **Patient** | `/patient` | Complete intake, view exercises, track progress |
| **Doctor** | `/doctor` | Clinical evaluation, FMS assessment, medical notes |
| **Coach** | `/coach` | Movement specialist, training programs |
| **Administrator** | `/admin` | System management, user management |

### Key Pages

| Page | URL | Description |
|------|-----|-------------|
| **Login** | `/login` | Role selector with skip login buttons |
| **Voice Intake** | `/doctor/intake` | AI-powered voice medical history |
| **FMS Assessment** | `/doctor/assessment` | 10-movement screen with AI analysis |
| **Medical Notes** | `/doctor/notes` | AI-generated comprehensive notes |

---

## Project Overview

- **Name**: Thrive Ortho EHR
- **Goal**: Comprehensive EHR platform with AI-powered MSK assessment
- **Reference**: KinetiSense-style visual movement analysis
- **Validation**: FMS (Functional Movement Systems) + AMA Guidelines

## Core Features

### 1. Skip Login Demonstration
- **4 User Roles**: Patient, Doctor, Coach, Administrator
- **One-Click Access**: Skip login buttons for instant demo
- **Role-Based Dashboards**: Tailored UI for each user type

### 2. Voice-Powered Medical Intake
- **Microphone Integration**: Web Speech API for voice recording
- **8 Intake Categories**: Demographics, Chief Complaint, Pain Assessment, Location, Aggravating Factors, Medical History, Medications, Functional Impact
- **Real-Time Transcription**: Live text display as patient speaks
- **Progress Tracking**: Visual step-by-step intake process

### 3. FMS 7-Movement Screen (Validated)
| # | Movement | Purpose |
|---|----------|---------|
| 1 | **Deep Squat** | Hip/knee/ankle mobility, core stability |
| 2 | **Hurdle Step** | Stride mechanics, single-leg stability |
| 3 | **Inline Lunge** | Deceleration, directional change |
| 4 | **Shoulder Mobility** | Scapular mobility, thoracic extension |
| 5 | **Active Straight Leg Raise** | Hamstring flexibility, pelvic stability |
| 6 | **Trunk Stability Push-Up** | Core stability in sagittal plane |
| 7 | **Rotary Stability** | Multi-plane trunk stability |

### 4. AMA ROM Assessment (3 Additional)
| # | Movement | Purpose |
|---|----------|---------|
| 8 | **Cervical ROM** | Neck flexion, extension, rotation |
| 9 | **Lumbar ROM** | Lower back mobility |
| 10 | **Gait Analysis** | Walking pattern, symmetry |

### 5. AI-Powered Medical Note Generation
- **Comprehensive Documentation**: SOAP-style notes
- **FMS Results Integration**: Scores with interpretation
- **AMA ROM Data**: Range of motion measurements
- **ICD-10 Coding**: Suggested diagnosis codes
- **Exercise Prescription**: Tailored corrective exercises
- **Risk Assessment**: Injury risk based on FMS score

### 6. KinetiSense-Style Visual Analysis
- **Video Feed Interface**: Camera placeholder for AI analysis
- **Real-Time Scoring**: 0-3 scale per movement
- **Movement Compensation Detection**: AI identifies dysfunctions
- **Total Score Tracking**: FMS score out of 21
- **Risk Stratification**: High (≤11), Moderate (12-14), Low (≥15)

---

## EHR Dashboard Features

### Patient Dashboard
- Next appointment display
- Exercise completion tracking
- FMS score history
- Recovery progress metrics
- Care team information

### Doctor Dashboard
- Patient queue with FMS scores
- Quick action buttons (Intake, Assessment, Notes)
- AI insights and priority alerts
- Appointment schedule

### Coach Dashboard
- Client list with programs
- FMS score tracking
- Progress monitoring
- Exercise assignment tools

### Admin Dashboard
- User management (CRUD)
- System status monitoring
- Analytics overview
- Audit logs access

---

## Technology Stack

| Category | Technology |
|----------|------------|
| **Backend** | Hono Framework |
| **Runtime** | Cloudflare Workers |
| **Frontend** | Vanilla HTML/CSS/JS |
| **Styling** | Custom CSS (Medical Teal theme) |
| **Typography** | Inter + Plus Jakarta Sans |
| **Icons** | Font Awesome 6.5 |
| **Voice** | Web Speech API |
| **Build** | Vite |

---

## Design System

### Color Palette

```css
/* Primary - Medical Teal */
--primary-500: #14b8a6;
--primary-600: #0d9488;

/* Role Colors */
--role-patient: #8b5cf6;  /* Purple */
--role-doctor: #0ea5e9;   /* Blue */
--role-coach: #22c55e;    /* Green */
--role-admin: #f59e0b;    /* Amber */
```

### Typography
- **Display**: Plus Jakarta Sans (700-800)
- **Body**: Inter (400-600)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | Demo user profiles |
| GET | `/api/movements` | All 10 movements |
| GET | `/api/fms` | FMS 7 movements only |
| GET | `/api/intake-questions` | Voice intake questions |
| GET | `/api/patients` | Patient records |
| POST | `/api/ai/generate-note` | Generate medical note |

---

## Data Models

### FMS Movement
```typescript
{
  id: string;
  name: string;
  description: string;
  purpose: string;
  instructions: string[];
  scoring: { 0: string, 1: string, 2: string, 3: string };
  compensations: string[];
  targetAreas: string[];
  videoUrl: string;
  duration: number;
}
```

### Patient Record
```typescript
{
  id: string;
  patientName: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  icd10: string[];
  painLevel: number;
  fmsScore: number;
  status: 'active' | 'urgent' | 'completed';
  assignedDoctor: string;
  assignedCoach: string;
}
```

---

## Project Structure

```
webapp/
├── src/
│   └── index.tsx          # Main application (104KB)
├── migrations/
│   └── 0001_initial_schema.sql
├── dist/                  # Build output
├── ARCHITECTURE.md        # System architecture
├── README.md             # This file
├── package.json
├── vite.config.ts
├── wrangler.jsonc
└── ecosystem.config.cjs
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start ecosystem.config.cjs

# Or direct
npm run dev:sandbox
```

---

## Workflow

### Standard Patient Flow
1. **Login** → Select role or skip login
2. **Voice Intake** → Answer medical history questions
3. **FMS Assessment** → Complete 10-movement screen
4. **AI Analysis** → Review movement dysfunctions
5. **Medical Note** → Generate comprehensive documentation
6. **Exercise Prescription** → Assign corrective exercises

### Scoring Guide
| Score | Meaning |
|-------|---------|
| **3** | Perfect movement pattern |
| **2** | Compensation observed |
| **1** | Unable to complete movement |
| **0** | Pain during movement |

### Risk Stratification
| FMS Score | Risk Level | Action |
|-----------|------------|--------|
| ≤ 11 | HIGH | Immediate intervention |
| 12-14 | MODERATE | Corrective exercise program |
| ≥ 15 | LOW | Maintenance program |

---

## References

- **FMS**: Functional Movement Systems - [functionalmovement.com](https://www.functionalmovement.com)
- **KinetiSense**: 3D Motion Capture - [kinetisense.com](https://www.kinetisense.com)
- **AMA Guides**: 6th Edition MSK Assessment Guidelines

---

## Next Steps

### Immediate
- [ ] Deploy to Cloudflare Pages
- [ ] Connect real OpenAI API for AI analysis
- [ ] Add exercise video library

### Short-term
- [ ] Real-time pose estimation (TensorFlow.js)
- [ ] PDF export for medical notes
- [ ] Patient scheduling system

### Long-term
- [ ] Mobile app (React Native)
- [ ] EHR integrations (Epic, Cerner)
- [ ] Insurance verification

---

*Version: 2.0.0 - Thrive Ortho EHR*  
*Last Updated: December 2025*
