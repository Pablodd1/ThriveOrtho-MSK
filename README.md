# F-AI bian Assessment System 🏥

> **Elderly Home Rehabilitation Monitoring & Remote Patient Monitoring Platform**

![Colors](https://img.shields.io/badge/Colors-Orange%20%26%20Blue-orange)
![Status](https://img.shields.io/badge/Status-Active-success)
![Tech](https://img.shields.io/badge/Tech-Hono%20%2B%20Cloudflare-blue)

## 🌐 Public URLs

- **Sandbox Development**: https://3000-isoavrqar3ev1h6ka8wvl-cc2fbc16.sandbox.novita.ai
- **Production**: (Deploy to Cloudflare Pages for production URL)

### Key URLs

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Main landing page with quick actions |
| Patient Intake | `/static/intake.html` | Complete patient demographic and medical history form |
| Assessment | `/static/assessment.html?patient_id=X` | Camera-based movement assessment (5 exercises) |
| Prescription | `/static/prescription.html?assessment_id=X` | Exercise prescription from 17-exercise library |
| Dashboard | `/static/dashboard.html` | Patient management and RPM monitoring |

## 🎯 Project Goals

Build a comprehensive elderly home rehabilitation monitoring system that enables physical therapists to:

1. **Intake** patient demographics and medical history
2. **Perform** movement assessments using camera-based skeleton tracking
3. **Analyze** biomechanical deficiencies using AI
4. **Prescribe** targeted therapeutic exercises
5. **Monitor** patient compliance and bill for Remote Patient Monitoring (RPM)

## ✨ Features

### 🎥 AI-Powered Movement Analysis
- **Camera Support**: 
  - 📱 Phone Camera (front/back)
  - 💻 Laptop Camera (built-in webcam)
  - 📷 External USB Camera
  - 🎥 Femto Mega Professional Camera (32 joints with depth)
- **Skeleton Tracking**: MediaPipe Pose (33 joints) for consumer cameras
- **Real-time Visualization**: Green skeleton overlay with joint tracking
- **5 Exercise Assessment**: Squat, Balance, Shoulder, Gait, Sit-to-Stand

### 🏋️ Personalized Exercise Programs
- **17 Therapeutic Exercises** across 6 categories:
  - Mobility (3): Hip Flexor Stretch, Shoulder Circles, Cat-Cow Stretch
  - Stability (3): Plank Hold, Bird Dog, Side Plank
  - Strength (3): Bodyweight Squats, Wall Push-Ups, Calf Raises
  - Flexibility (3): Hamstring Stretch, Quadriceps Stretch, Seated Spinal Twist
  - Balance (3): Single Leg Stand, Heel-to-Toe Walk, Standing March
  - Coordination (2): Cross-Body Reaches, Sit-to-Stand Transitions

### 📊 Data Architecture

**Storage Services**: Cloudflare D1 SQLite Database

**11 Core Tables**:
1. `patients` - Demographics, medical history, height/weight
2. `assessments` - Movement assessment sessions
3. `movement_tests` - Individual test recordings (5 per assessment)
4. `exercises` - Exercise library (17 seeded)
5. `prescriptions` - Exercise programs
6. `prescribed_exercises` - Join table with parameters
7. `exercise_sessions` - Patient home workout tracking
8. `exercise_performances` - Individual exercise completion
9. `rpm_monitoring` - CPT code tracking for billing
10. `clinicians` - User accounts
11. `system_settings` - App configuration

**Key Features**:
- All skeleton data stored as JSON in `movement_tests.skeleton_data`
- Camera type tracked: `webcam`, `phone`, `external`, `femto_mega`
- 5 exercises recorded per assessment (configurable)
- Height/weight in cm/kg for international compatibility

### 💰 RPM Billing Support
- **CPT Code Tracking**: 99453, 99454, 99457, 99458
- **Eligibility Monitoring**: 16+ days of data required
- **Clinical Review**: 20+ minutes monthly review time
- **Automated Tracking**: Session and minute accumulation

## 🚀 Tech Stack

- **Backend**: Hono (lightweight edge framework)
- **Frontend**: Vanilla JavaScript + TailwindCSS
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Workers/Pages (serverless edge)
- **Camera**: MediaPipe Pose (33 joints)
- **Process Manager**: PM2 (development)
- **Build Tool**: Vite

## 📋 Complete Workflow (5 Phases)

### Phase 1: Patient Intake ✅
**URL**: `/static/intake.html`

**Completed Features**:
- ✅ Full demographic form (name, DOB, gender, contact)
- ✅ Address collection
- ✅ Emergency contact information
- ✅ Medical information (physician, insurance)
- ✅ Assessment context (reason, chief complaint, pain scale 0-10)
- ✅ Height/Weight measurements
- ✅ Auto-redirect to assessment after submission

**API**: `POST /api/patients`

### Phase 2: Movement Assessment ✅
**URL**: `/static/assessment.html?patient_id=X`

**Completed Features**:
- ✅ Camera selection UI (4 options)
- ✅ MediaPipe Pose integration (33 joints)
- ✅ Real-time skeleton visualization
- ✅ 5-exercise workflow with counter
- ✅ Recording controls (start/stop)
- ✅ Frame statistics (duration, frames, FPS, joints tracked)
- ✅ Skeleton data saved to database
- ✅ Auto-redirect to prescription after completion

**Exercises Assessed**:
1. Squat Assessment (mobility)
2. Balance Stand (balance)
3. Shoulder Range Test (mobility)
4. Gait Assessment (mobility)
5. Sit-to-Stand (strength)

**APIs Used**:
- `POST /api/assessments` - Create assessment
- `POST /api/assessments/:id/tests` - Create test
- `PUT /api/tests/:id/analyze` - Save skeleton data

### Phase 3: Biomechanical Analysis ✅
**Integrated into Assessment**

**Completed Features**:
- ✅ Skeleton data capture (timestamp + landmarks per frame)
- ✅ Frame-by-frame tracking
- ✅ Duration and FPS calculation
- ✅ Joint tracking verification (33 joints)
- ✅ Camera type recording
- ✅ Data stored as JSON in database

**Future Enhancements** (Not Yet Implemented):
- ⚠️ Joint angle calculation
- ⚠️ Deficiency detection algorithms
- ⚠️ Movement quality scoring (0-100)
- ⚠️ AI recommendations generation

### Phase 4: Exercise Prescription ✅
**URL**: `/static/prescription.html?assessment_id=X`

**Completed Features**:
- ✅ Load 17 exercises from database
- ✅ Exercise selection (checkbox interface)
- ✅ Program details (name, frequency)
- ✅ Create prescription with selected exercises
- ✅ Auto-redirect to dashboard after creation

**APIs Used**:
- `GET /api/exercises` - Load exercise library
- `POST /api/prescriptions` - Create program
- `POST /api/prescribed-exercises` - Add exercises

### Phase 5: Dashboard & Monitoring ✅
**URL**: `/static/dashboard.html`

**Completed Features**:
- ✅ Patient list with table view
- ✅ Stats dashboard (patients, assessments, programs, exercises)
- ✅ Quick action to start assessment
- ✅ Link to new patient intake
- ✅ Exercise count from database (17)

**Future Enhancements** (Not Yet Implemented):
- ⚠️ Assessment history per patient
- ⚠️ RPM billing dashboard with CPT codes
- ⚠️ Compliance tracking visualization
- ⚠️ Medical note generation

## 🎨 Brand Colors

- **Orange**: `#FF6B35` - Primary actions, headings
- **Blue**: `#004E89` - Secondary elements, links

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ installed
- PM2 process manager (pre-installed in sandbox)

### Quick Start

```bash
# 1. Navigate to project
cd /home/user/webapp

# 2. Install dependencies (if needed)
npm install

# 3. Apply database migrations
npm run db:migrate:local

# 4. Verify database
npx wrangler d1 execute webapp-production --local --command="SELECT COUNT(*) FROM exercises"
# Should return: 17

# 5. Build project
npm run build

# 6. Start service with PM2
fuser -k 3000/tcp 2>/dev/null || true
pm2 start ecosystem.config.cjs

# 7. Check logs
pm2 logs webapp --nostream

# 8. Test endpoint
curl http://localhost:3000/api/exercises
```

### Available Scripts

```json
{
  "dev": "vite",
  "dev:sandbox": "wrangler pages dev dist --ip 0.0.0.0 --port 3000",
  "dev:d1": "wrangler pages dev dist --d1=webapp-production --local --ip 0.0.0.0 --port 3000",
  "build": "vite build",
  "deploy": "npm run build && wrangler pages deploy dist",
  "db:migrate:local": "wrangler d1 migrations apply webapp-production --local",
  "db:migrate:prod": "wrangler d1 migrations apply webapp-production",
  "db:console:local": "wrangler d1 execute webapp-production --local",
  "clean-port": "fuser -k 3000/tcp 2>/dev/null || true",
  "test": "curl http://localhost:3000"
}
```

## 📊 Current Status

### ✅ Completed Features

| Feature | Status | Details |
|---------|--------|---------|
| Patient Intake Form | ✅ Complete | All fields including height/weight |
| Camera Integration | ✅ Complete | 4 camera types, MediaPipe working |
| 5-Exercise Assessment | ✅ Complete | Squat, Balance, Shoulder, Gait, Sit-to-Stand |
| Skeleton Tracking | ✅ Complete | 33 joints, real-time visualization |
| Database Schema | ✅ Complete | 11 tables, 3 migrations applied |
| Exercise Library | ✅ Complete | 17 exercises seeded |
| Prescription System | ✅ Complete | Select from library, create programs |
| Dashboard | ✅ Complete | Patient list, basic stats |
| Backend API | ✅ Complete | All CRUD endpoints working |
| PM2 Configuration | ✅ Complete | Service running stable |

### ⚠️ Future Enhancements

| Feature | Status | Priority |
|---------|--------|----------|
| Joint Angle Calculation | 🕒 Pending | High |
| Deficiency Detection | 🕒 Pending | High |
| Movement Quality Scoring | 🕒 Pending | High |
| AI Recommendations | 🕒 Pending | Medium |
| RPM Billing Dashboard | 🕒 Pending | Medium |
| Compliance Tracking | 🕒 Pending | Medium |
| Medical Note Generation | 🕒 Pending | Low |
| Femto Mega Full Integration | 🕒 Pending | Low |

## 📦 Deployment

### Local Development (Current)
- **URL**: https://3000-isoavrqar3ev1h6ka8wvl-cc2fbc16.sandbox.novita.ai
- **Status**: ✅ Active
- **Database**: Local SQLite (.wrangler/state/v3/d1)
- **Process**: PM2 with ecosystem.config.cjs

### Cloudflare Pages Production

```bash
# 1. Setup Cloudflare API Key
# Call: setup_cloudflare_api_key

# 2. Verify authentication
npx wrangler whoami

# 3. Create production D1 database
npx wrangler d1 create webapp-production
# Copy database_id to wrangler.jsonc

# 4. Apply migrations to production
npx wrangler d1 migrations apply webapp-production

# 5. Create Cloudflare Pages project
npx wrangler pages project create webapp \
  --production-branch main \
  --compatibility-date 2024-01-01

# 6. Deploy to production
npm run deploy:prod
```

## 🧪 Testing Checklist

### ✅ Phase 1: Patient Intake (Verified)
- [x] Form loads with all fields
- [x] Submit creates patient in database
- [x] Redirects to assessment with patient_id
- [x] Height/weight fields working

### ✅ Phase 2: Assessment (Verified)
- [x] Camera selection UI appears
- [x] Laptop camera requests permission
- [x] MediaPipe skeleton overlay appears
- [x] 33 joints tracked in real-time
- [x] Start/Stop recording works
- [x] 5 exercises workflow with counter
- [x] Skeleton data saved to database
- [x] Redirects to prescription after completion

### ✅ Phase 3: Prescription (Verified)
- [x] Loads 17 exercises from database
- [x] Checkbox selection works
- [x] Create prescription succeeds
- [x] Exercises added to prescription
- [x] Redirects to dashboard

### ✅ Phase 4: Dashboard (Verified)
- [x] Patient list displays
- [x] Stats show correct counts
- [x] Links to assessment work
- [x] New patient button functional

### ✅ API Testing (Verified)
- [x] GET /api/patients - Returns patients
- [x] POST /api/patients - Creates patient
- [x] GET /api/exercises - Returns 17 exercises
- [x] POST /api/assessments - Creates assessment
- [x] POST /api/assessments/:id/tests - Creates test
- [x] PUT /api/tests/:id/analyze - Saves skeleton data
- [x] POST /api/prescriptions - Creates prescription

## 🐛 Known Issues & Limitations

1. **Biomechanical Analysis**: Joint angle calculation not yet implemented
2. **Femto Mega**: WebSocket bridge requires separate Python server
3. **Camera Permissions**: Users must grant camera access in browser
4. **HTTPS Required**: Camera API only works on HTTPS or localhost
5. **RPM Dashboard**: Billing interface not yet built
6. **Medical Notes**: AI-generated SOAP notes not implemented

## 📝 Notes for Next Developer

### Critical Implementation Details

1. **Database Column Names**:
   - Use `status` NOT `assessment_status` in assessments table
   - Use `status` NOT `test_status` in movement_tests table
   - Height/weight columns: `height_cm` and `weight_kg`

2. **Camera Access**:
   - Requires HTTPS or localhost
   - 3-tier fallback strategy in assessment.html
   - MediaPipe CDN loaded from jsdelivr

3. **5-Exercise Workflow**:
   - Counter shows "1 of 5" through "5 of 5"
   - "Next Exercise" button after first 4
   - "Complete & Analyze" button after 5th
   - Each exercise creates new movement_test record

4. **Static Files**:
   - Located in `public/static/`
   - Served at `/static/*` URLs
   - Use `serveStatic` from `hono/cloudflare-workers`

5. **PM2 Configuration**:
   - Always use PM2 for service startup
   - Clean port 3000 before starting: `fuser -k 3000/tcp`
   - Check logs with `pm2 logs --nostream`
   - Build before first start: `npm run build`

## 🤝 Contributing

This project follows the standard Hono + Cloudflare Pages workflow:

1. Make changes to `src/index.tsx` or `public/static/*.html`
2. Run `npm run build` to compile
3. Test locally with PM2
4. Commit to git: `git add . && git commit -m "message"`
5. Deploy to Cloudflare Pages when ready

## 📄 License

All rights reserved © 2025 F-AI bian Assessment System

---

**Last Updated**: 2025-10-21  
**Version**: 1.0.0  
**Status**: ✅ Development Complete - Ready for Testing & Deployment
