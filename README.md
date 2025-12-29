# Thrive Ortho EHR v3.0

## Professional MSK Assessment Platform

Ultra-minimal, medical-grade EHR platform with Gemini AI integration for musculoskeletal assessment, voice analysis, and comprehensive medical documentation.

## Live Demo

**Production URL**: https://3000-isoavrqar3ev1h6ka8wvl-cc2fbc16.sandbox.novita.ai

### Quick Access (Skip Login Demo)

| Role | URL | Description |
|------|-----|-------------|
| **Login** | `/login` | Role selection page |
| **Doctor** | `/doctor` | Provider dashboard with patient management |
| **Patient** | `/patient` | Patient portal with exercises and appointments |
| **Coach** | `/coach` | Coach dashboard with client management |
| **Admin** | `/admin` | System administration and analytics |

### Doctor Workflow

1. `/doctor/intake` - Voice Medical Intake (AI pain flag detection)
2. `/doctor/assessment` - MSK Movement Assessment (10 movements)
3. `/doctor/notes` - Medical Note Generator (DX/CPT codes)
4. `/doctor/video` - Telemedicine (HIPAA compliant)
5. `/doctor/tasks` - Task management (To-do list)

## Key Features

### Design System
- **Ultra-minimal UI**: Monochrome base with single teal accent
- **Dashboard on RIGHT**: Professional panel layout
- **Typography**: Inter font family
- **Professional colors**: Gray scale + medical teal (#0d9488)

### MSK Assessment (FMS + AMA)
- **10 validated movements**:
  - FMS (1-7): Deep Squat, Hurdle Step, Inline Lunge, Shoulder Mobility, ASLR, Trunk Stability Push-Up, Rotary Stability
  - AMA (8-10): Cervical ROM, Lumbar ROM, Gait Analysis
- **Scoring**: 0-3 scale (0=Pain, 1=Unable, 2=Compensation, 3=Perfect)
- **Risk stratification**: High (≤11), Moderate (12-14), Low (≥15)

### Gemini AI Integration
- **Real-time joint tracking**: Camera-based movement analysis
- **Joint angle measurement**: Hip, knee, ankle, trunk, shoulder
- **Compensation detection**: AI identifies movement compensations
- **Confidence scoring**: Percentage-based accuracy

### Voice Analysis
- **Web Speech API**: Real-time transcription
- **Pain flag detection**: Red flags (serious), Yellow flags (psychosocial)
- **Voice cue analysis**: Hesitation, breathing patterns
- **Gemini AI analysis**: Potential diagnoses with ICD-10 codes

### Medical Notes
- **Comprehensive documentation**: SOAP-style format
- **ICD-10 codes**: M54.5, M54.16, M62.838, M99.03
- **CPT codes**: 97161, 97162, 97163, 97110, 97140, 97530
- **Exercise prescription**: 12 evidence-based exercises
- **HIPAA compliant**: Professional formatting

### Task Management
- **Priority levels**: High, Medium, Low
- **Status tracking**: Pending, In Progress, Completed
- **Patient context**: Tasks linked to patients
- **Due date management**: Today, Tomorrow, This week

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/ai/analyze-joints` | POST | Gemini joint analysis |
| `/api/ai/analyze-voice` | POST | Voice pain flag detection |
| `/api/ai/generate-note` | POST | Generate medical note |
| `/api/tasks` | GET | Get task list |
| `/api/exercises` | GET | Get exercise library |
| `/api/movements` | GET | Get movement protocol |

## Technology Stack

- **Backend**: Hono framework
- **Runtime**: Cloudflare Workers
- **Frontend**: HTML/CSS/JavaScript + TailwindCSS
- **Build**: Vite
- **AI**: Google Gemini API (gemini-2.0-flash)
- **Deploy**: Cloudflare Pages

## Environment Variables

```bash
# Required for AI features
GEMINI_API_KEY=your_gemini_api_key

# Optional
OPENAI_API_KEY=your_openai_api_key
```

### Get Gemini API Key
1. Visit: https://aistudio.google.com/app/apikey
2. Create new API key
3. Add to environment variables

## Local Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Start development server
npm run dev:sandbox

# Or with PM2
pm2 start ecosystem.config.cjs
```

## Deployment

### Cloudflare Pages

```bash
# Configure Cloudflare API
setup_cloudflare_api_key

# Deploy
npm run build
npx wrangler pages deploy dist --project-name sobeairehab
```

### With D1 Database

```bash
# Create database
npx wrangler d1 create telemed-ai-db

# Apply migrations
npx wrangler d1 migrations apply telemed-ai-db --local

# Start with D1
npm run dev:d1
```

## Project Structure

```
webapp/
├── src/
│   └── index.tsx          # Main application
├── migrations/
│   └── 0001_initial_schema.sql
├── public/                # Static assets
├── dist/                  # Build output
├── ecosystem.config.cjs   # PM2 configuration
├── wrangler.jsonc         # Cloudflare configuration
├── vite.config.ts         # Vite configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## Exercise Library

| ID | Name | Target | Difficulty |
|----|------|--------|------------|
| E001 | Hip Flexor Stretch | Hip | Beginner |
| E002 | Piriformis Stretch | Hip | Beginner |
| E003 | Dead Bug | Core | Intermediate |
| E004 | Bird Dog | Core | Beginner |
| E005 | Cat-Cow Stretch | Spine | Beginner |
| E006 | Cervical Retraction | Cervical | Beginner |
| E007 | Shoulder ER/IR | Shoulder | Intermediate |
| E008 | Clamshells | Hip | Beginner |
| E009 | Ankle Alphabet | Ankle | Beginner |
| E010 | McKenzie Extension | Lumbar | Beginner |
| E011 | Glute Bridge | Hip | Beginner |
| E012 | Side Plank | Core | Intermediate |

## Version History

- **v3.0** (Current): Ultra-minimal UI, Gemini AI integration, comprehensive medical notes
- **v2.0**: Glass morphism UI, voice intake, FMS assessment
- **v1.0**: Initial MVP with basic dashboards

## License

Proprietary - Thrive Ortho

---

**Last Updated**: December 2025
