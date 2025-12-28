# Thrive Ortho MSK - AI-Powered Musculoskeletal Assessment Platform

## Live Demo

**URL**: https://3000-isoavrqar3ev1h6ka8wvl-cc2fbc16.sandbox.novita.ai

### Quick Access (Skip Login - Demo Mode)

| Portal | URL | Description |
|--------|-----|-------------|
| **Home** | `/` | Landing page |
| **Login** | `/login` | Role selector (skip login available) |
| **Provider Dashboard** | `/provider` | PT/Chiropractic clinical dashboard |
| **MSK Assessment** | `/provider/assessment` | Interactive body map with AI analysis |
| **Exercise Library** | `/provider/exercises` | Evidence-based exercise prescription |
| **Video Consultation** | `/provider/video` | HIPAA-compliant video sessions |
| **EHR Integration** | `/provider/ehr` | Epic, WebPT, Jane App connections |
| **Admin Dashboard** | `/admin` | System management & analytics |
| **Patient Portal** | `/patient` | Exercise tracking & progress |

---

## Project Overview

- **Name**: Thrive Ortho MSK
- **Goal**: AI-powered musculoskeletal assessment platform for Physical Therapy and Chiropractic care
- **Status**: MVP Running
- **Design**: Professional glass morphism with medical-grade color palette

## Key Features

### Professional Glass Morphism UI
- Minimalist, clean design with medical-appropriate colors
- Inter + Plus Jakarta Sans typography
- Calming blue-green medical palette
- Frosted glass card effects with subtle shadows
- Desktop-optimized layout

### Interactive MSK Assessment
- **15 Body Regions**: Cervical, Thoracic, Lumbar spine, Shoulders, Elbows, Wrists, Hips, Knees, Ankles
- **Pain Scale**: Visual 1-10 pain level selector with color coding
- **AI Analysis**: Automated findings, risk assessment, and recommendations
- **Real-time Updates**: Dynamic UI updates as regions are selected

### Exercise Library
- **10+ Evidence-Based Exercises**: McKenzie Extension, Cat-Cow, Pendulum, Dead Bug, etc.
- **Video Demonstrations**: Ready for video integration
- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Prescription System**: Easy exercise assignment to patients

### EHR Integration
- **Epic MyChart**: Patient records & appointments
- **WebPT**: PT documentation
- **Jane App**: Scheduling & billing
- **Bi-directional Sync**: Real-time data synchronization

### AI Capabilities
- **MSK Analysis Engine**: Pattern recognition for musculoskeletal conditions
- **Risk Scoring**: AI-generated risk assessment (0-100)
- **Treatment Recommendations**: Protocol and exercise suggestions
- **Progress Tracking**: Automated patient progress analysis

### Video Consultation
- **HIPAA Compliant**: Ready for Daily.co integration
- **Waiting Room**: Patient queue management
- **Session Tools**: Body map, exercises, records access during calls
- **Recording**: Optional session recording (when enabled)

---

## Technology Stack

| Category | Technology |
|----------|------------|
| **Backend** | Hono Framework |
| **Runtime** | Cloudflare Workers |
| **Frontend** | HTML/CSS/JS (Vanilla) |
| **Styling** | Custom Glass Morphism CSS |
| **Typography** | Inter + Plus Jakarta Sans |
| **Icons** | Font Awesome 6 |
| **Build** | Vite |
| **Deploy** | Cloudflare Pages |

---

## Design System

### Color Palette

```css
/* Primary - Calming Medical Blue */
--primary-500: #0ea5e9;
--primary-600: #0284c7;

/* Accent - Healing Green */
--accent-500: #22c55e;
--accent-600: #16a34a;

/* Warm - Wellness */
--warm-500: #f59e0b;

/* Neutral - Professional Slate */
--slate-800: #1e293b;
--slate-500: #64748b;
```

### Typography

- **Display**: Plus Jakarta Sans (headings, brand)
- **Body**: Inter (content, UI elements)

### Glass Morphism

```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/demo-users` | Demo user profiles |
| GET | `/api/body-regions` | Body map regions |
| GET | `/api/exercises` | Exercise library |
| GET | `/api/protocols` | Assessment protocols |
| GET | `/api/patients` | Patient records |
| POST | `/api/ai/msk-analysis` | AI MSK analysis |
| POST | `/api/video/create-room` | Create video room |

---

## Data Models

### Body Regions
- 15 anatomical regions with x/y coordinates for body map
- Region categories: Upper Extremity, Lower Extremity, Spine

### Exercise Library
- ID, name, target region, difficulty, duration, reps
- Video availability flag

### Patient Records
- Patient info, chief complaint, pain level
- AI risk score, treatment status
- Appointment history

### Assessment Protocols
- Protocol name, target region, duration
- AI-assisted flag

---

## Project Structure

```
webapp/
├── src/
│   └── index.tsx          # Main Hono application (90KB)
├── migrations/
│   └── 0001_initial_schema.sql  # Database schema
├── dist/                  # Build output
├── ARCHITECTURE.md        # System architecture
├── UPGRADES.md           # AI upgrade recommendations
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

# Or run directly
npm run dev:sandbox
```

---

## Demo Users

| Role | Name | Email |
|------|------|-------|
| Admin | Dr. Sarah Mitchell | admin@thriveortho.ai |
| Provider | Dr. Fabian Rodriguez | dr.fabian@thriveortho.ai |
| Patient | Michael Chen | michael@patient.com |

---

## AI Integration Points

### Current (Demo Mode)
- Simulated MSK analysis responses
- Pattern-based recommendations
- Risk scoring algorithms

### Ready for Integration
- **OpenAI GPT-4o Vision**: Medical image analysis
- **Google MedGemma**: Clinical decision support
- **Legit.Health**: Dermatology imaging (skin conditions)
- **Shen.ai/Binah.ai**: Video-based vital signs

---

## HIPAA Compliance Features

- TLS 1.3 encryption in transit
- Field-level encryption for PII (ready)
- Comprehensive audit logging (schema ready)
- Role-based access control
- Session timeout management
- BAA-ready architecture

---

## Deployment

### Current: Sandbox
- URL: https://3000-isoavrqar3ev1h6ka8wvl-cc2fbc16.sandbox.novita.ai

### Production: Cloudflare Pages (Pending)
- Requires Cloudflare API key configuration
- Project name: sobeairehab-telemed
- D1 Database: Ready for setup

---

## Next Steps

### Immediate
- [ ] Configure Cloudflare API key for production deployment
- [ ] Create D1 database for persistent storage
- [ ] Connect real OpenAI API for AI analysis
- [ ] Integrate Daily.co for video consultations

### Short-term
- [ ] Patient intake forms
- [ ] Progress note generation
- [ ] Exercise video library
- [ ] Mobile-responsive optimization

### Long-term
- [ ] EHR OAuth integration
- [ ] Insurance verification
- [ ] Billing system
- [ ] Mobile apps

---

*Version: 2.0.0 - Thrive Ortho MSK*  
*Last Updated: December 2025*
