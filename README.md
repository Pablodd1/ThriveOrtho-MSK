# Thrive Ortho EHR v9.0

## Real-Time MSK Assessment Platform with AI Joint Tracking

Professional medical-grade EHR platform featuring real-time joint tracking using MediaPipe Holistic, voice-guided exercises, automatic rep counting, and comprehensive clinical documentation.

## Live Demo

**Sandbox URL**: https://3000-isoavrqar3ev1h6ka8wvl-cc2fbc16.sandbox.novita.ai

### Quick Access

| Page | URL | Description |
|------|-----|-------------|
| **Login** | `/login` | Role selection |
| **Doctor Dashboard** | `/doctor` | Main provider interface |
| **MSK Assessment** | `/doctor/joints` | Real-time joint tracking |
| **Voice Intake** | `/doctor/intake` | AI pain flag detection |
| **Medical Notes** | `/doctor/notes` | Generate clinical notes |

## Key Features

### Real-Time Joint Tracking (v9.0)
- **543 Landmarks**: Body (33) + Face (468) + Hands (42)
- **MediaPipe Holistic**: GPU-accelerated ML tracking
- **Temporal Smoothing**: EMA filter for stable angles
- **Bilateral Tracking**: L/R comparison with asymmetry detection
- **Large Dashboard**: 80px angle display for clinical viewing

### Guided Assessment Workflow
- **6 Exercises**: Deep Squat, Shoulder Raise, Hip Hinge, Arm Curl, Trunk Rotation, Balance Check
- **Auto Rep Counting**: State machine detects down→up movements
- **Voice Instructions**: TTS guides through each exercise
- **Auto-Advance**: Moves to next exercise when reps complete
- **Red Flag Detection**: Speech recognition monitors for pain keywords

### D1 Database Storage
- **Persistent History**: Assessments saved to Cloudflare D1
- **Red Flag Tracking**: Alerts with acknowledgment workflow
- **Error Logging**: Silent fail-safe error capture
- **Patient History**: Full assessment timeline per patient

### Clinical Documentation
- **ICD-10 Codes**: M54.5, M54.16, M62.838, etc.
- **CPT Codes**: 97161, 97162, 97163, 97110, 97140
- **SOAP Format**: Professional medical notes
- **Exercise Prescription**: Evidence-based HEP

## API Endpoints

### Core APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/ai/analyze-joints` | POST | Gemini joint analysis |
| `/api/ai/analyze-voice` | POST | Voice pain detection |
| `/api/ai/generate-note` | POST | Generate medical note |

### Assessment APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/assessment/log` | POST | Save assessment |
| `/api/assessment/:id` | GET | Get assessment |
| `/api/assessments` | GET | List assessments |
| `/api/patient/:id/assessments` | GET | Patient history |

### Error & Flag APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/log-error` | POST | Log error (silent) |
| `/api/errors` | GET | View error history |
| `/api/red-flag` | POST | Log red flag |
| `/api/red-flags` | GET | View flags |
| `/api/red-flag/:id/acknowledge` | POST | Acknowledge flag |

## Technology Stack

- **Backend**: Hono framework
- **Runtime**: Cloudflare Workers/Pages
- **Database**: Cloudflare D1 (SQLite)
- **ML**: MediaPipe Holistic (WebGL)
- **AI**: Google Gemini 2.0 Flash
- **Build**: Vite + TypeScript

## Database Tables

| Table | Purpose |
|-------|---------|
| `msk_assessments` | Full assessment sessions |
| `msk_red_flags` | Clinical alerts |
| `msk_angle_history` | Per-frame angle data |
| `error_logs` | Application errors |
| `patients` | Patient records |
| `users` | Authentication |

## Environment Variables

```bash
# AI Features
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key

# Database (auto-configured)
DB=d1_database_binding
```

## Local Development

```bash
# Install
npm install

# Build
npm run build

# Run with D1
pm2 start ecosystem.config.cjs

# Or directly
npx wrangler pages dev dist --d1=sobeairehab-telemed-db --local --ip 0.0.0.0 --port 3000
```

## Deployment

### Cloudflare Pages

```bash
# Setup (run once)
setup_cloudflare_api_key

# Deploy
npm run build
npx wrangler pages deploy dist --project-name thrive-ortho
```

### D1 Database Setup

```bash
# Create production DB
npx wrangler d1 create thrive-ortho-db

# Apply migrations
npx wrangler d1 execute thrive-ortho-db --file=migrations/0001_initial_schema.sql
npx wrangler d1 execute thrive-ortho-db --file=migrations/0008_msk_assessments.sql
```

## Project Structure

```
webapp/
├── src/
│   └── index.tsx           # Main app (4100 lines)
├── migrations/
│   ├── 0001_initial_schema.sql
│   └── 0008_msk_assessments.sql
├── dist/                   # Build output (~155KB)
├── ecosystem.config.cjs    # PM2 config
├── wrangler.jsonc          # Cloudflare config
└── package.json
```

## Version History

| Version | Features |
|---------|----------|
| **v9.0** | Desktop layout, large angle dashboard, auto rep counting |
| **v8.1** | D1 database storage, temporal smoothing |
| **v8.0** | Full holistic tracking (body+face+hands) |
| **v7.0** | Voice instructions, guided workflow |
| **v6.0** | MediaPipe Holistic integration |
| **v5.2** | Enhanced camera support |
| **v3.0** | Gemini AI integration |

## Rep Detection Thresholds

| Exercise | Joint | Down | Up |
|----------|-------|------|-----|
| Deep Squat | Knee | ≤110° | ≥155° |
| Shoulder Raise | Shoulder | ≤60° | ≥140° |
| Hip Hinge | Hip | ≤110° | ≥160° |
| Arm Curl | Elbow | ≤60° | ≥140° |

## License

Proprietary - Thrive Ortho

---

**Last Updated**: December 2025 | **Build**: 155KB | **Routes**: 32
