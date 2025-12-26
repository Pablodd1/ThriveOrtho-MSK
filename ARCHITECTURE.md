# TeleMed AI Platform - Complete Architecture Design

## Executive Summary

A comprehensive telemedicine platform with AI-powered diagnostics for video consultations, medical image analysis, and intelligent patient triage. Designed for HIPAA compliance with edge-first architecture using Cloudflare infrastructure.

---

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              TELEMEDICINE AI PLATFORM                                │
│                           "TeleMed AI" - System Overview                             │
└─────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────┐
                                    │   PATIENTS  │
                                    │  (Web/App)  │
                                    └──────┬──────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
              ┌─────▼─────┐          ┌─────▼─────┐          ┌─────▼─────┐
              │  Patient  │          │   Video   │          │   Admin   │
              │  Portal   │          │  Console  │          │  Portal   │
              │   (SPA)   │          │   (SPA)   │          │   (SPA)   │
              └─────┬─────┘          └─────┬─────┘          └─────┬─────┘
                    │                      │                      │
                    └──────────────────────┼──────────────────────┘
                                           │
┌──────────────────────────────────────────▼──────────────────────────────────────────┐
│                           CLOUDFLARE EDGE NETWORK                                    │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │                      Cloudflare Pages + Workers                                 │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │ │
│  │  │  API Routes │  │   Static    │  │   Auth      │  │  WebSocket  │           │ │
│  │  │   (Hono)    │  │   Assets    │  │  Middleware │  │   Proxy     │           │ │
│  │  └──────┬──────┘  └─────────────┘  └──────┬──────┘  └──────┬──────┘           │ │
│  └─────────┼─────────────────────────────────┼────────────────┼──────────────────┘ │
│            │                                 │                │                     │
│  ┌─────────▼─────────────────────────────────▼────────────────▼──────────────────┐ │
│  │                        CLOUDFLARE DATA SERVICES                                │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │ │
│  │  │     D1      │  │     KV      │  │     R2      │  │   Durable   │           │ │
│  │  │  (SQLite)   │  │  (Cache)    │  │  (Storage)  │  │   Objects   │           │ │
│  │  │             │  │             │  │             │  │  (WebRTC)   │           │ │
│  │  │ • Patients  │  │ • Sessions  │  │ • Images    │  │ • Video     │           │ │
│  │  │ • Doctors   │  │ • Tokens    │  │ • Documents │  │   Rooms     │           │ │
│  │  │ • Records   │  │ • Cache     │  │ • Reports   │  │ • Chat      │           │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │ │
│  └────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                           │
┌──────────────────────────────────────────▼──────────────────────────────────────────┐
│                           EXTERNAL AI SERVICES                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                                                                                  ││
│  │  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐ ││
│  │  │   OpenAI      │   │    Google     │   │  Specialty    │   │   Video AI    │ ││
│  │  │   GPT-4o      │   │   MedGemma    │   │    APIs       │   │   Services    │ ││
│  │  │               │   │               │   │               │   │               │ ││
│  │  │ • Vision      │   │ • Medical     │   │ • Legit.Health│   │ • Shen.ai     │ ││
│  │  │ • Triage      │   │   Imaging     │   │   (Skin)      │   │   (Vitals)    │ ││
│  │  │ • Summaries   │   │ • Text        │   │ • Aidoc       │   │ • Daily.co    │ ││
│  │  │ • Chat        │   │   Analysis    │   │   (Radiology) │   │   (WebRTC)    │ ││
│  │  └───────────────┘   └───────────────┘   └───────────────┘   └───────────────┘ ││
│  │                                                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘
                                           │
┌──────────────────────────────────────────▼──────────────────────────────────────────┐
│                           THIRD-PARTY INTEGRATIONS                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   Auth0     │  │  Stripe     │  │  Twilio     │  │  SendGrid   │                 │
│  │   (Auth)    │  │ (Payments)  │  │   (SMS)     │  │  (Email)    │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Component Architecture

### 2.1 Frontend Applications

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND ARCHITECTURE                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│      PATIENT PORTAL (SPA)       │    │      DOCTOR PORTAL (SPA)        │
├─────────────────────────────────┤    ├─────────────────────────────────┤
│                                 │    │                                 │
│  ┌───────────────────────────┐  │    │  ┌───────────────────────────┐  │
│  │      Authentication       │  │    │  │      Authentication       │  │
│  │  • Login / Register       │  │    │  │  • SSO / MFA Login        │  │
│  │  • MFA Verification       │  │    │  │  • License Verification   │  │
│  │  • Password Recovery      │  │    │  │  • Session Management     │  │
│  └───────────────────────────┘  │    │  └───────────────────────────┘  │
│                                 │    │                                 │
│  ┌───────────────────────────┐  │    │  ┌───────────────────────────┐  │
│  │      Dashboard            │  │    │  │      Dashboard            │  │
│  │  • Upcoming Appointments  │  │    │  │  • Patient Queue          │  │
│  │  • Health Summary         │  │    │  │  • Today's Schedule       │  │
│  │  • AI Health Insights     │  │    │  │  • AI Alerts/Flags        │  │
│  └───────────────────────────┘  │    │  └───────────────────────────┘  │
│                                 │    │                                 │
│  ┌───────────────────────────┐  │    │  ┌───────────────────────────┐  │
│  │      Symptom Checker      │  │    │  │      Patient Records      │  │
│  │  • AI Chatbot Triage      │  │    │  │  • Medical History        │  │
│  │  • Image Upload           │  │    │  │  • AI Analysis Results    │  │
│  │  • Preliminary Assessment │  │    │  │  • Prescriptions          │  │
│  └───────────────────────────┘  │    │  └───────────────────────────┘  │
│                                 │    │                                 │
│  ┌───────────────────────────┐  │    │  ┌───────────────────────────┐  │
│  │      Video Consultation   │  │    │  │      Video Consultation   │  │
│  │  • WebRTC Video Call      │  │    │  │  • WebRTC Video Call      │  │
│  │  • Screen Sharing         │  │    │  │  • AI Real-time Analysis  │  │
│  │  • Chat / File Sharing    │  │    │  │  • Vitals Monitoring      │  │
│  │  • AI Transcription       │  │    │  │  • Notes / Prescriptions  │  │
│  └───────────────────────────┘  │    │  └───────────────────────────┘  │
│                                 │    │                                 │
│  ┌───────────────────────────┐  │    │  ┌───────────────────────────┐  │
│  │      Medical Records      │  │    │  │      AI Diagnostic Tools  │  │
│  │  • View Reports           │  │    │  │  • Image Analysis Panel   │  │
│  │  • Download Documents     │  │    │  │  • Differential Diagnosis │  │
│  │  • Share with Providers   │  │    │  │  • Drug Interaction Check │  │
│  └───────────────────────────┘  │    │  └───────────────────────────┘  │
│                                 │    │                                 │
└─────────────────────────────────┘    └─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        ADMIN PORTAL (SPA)                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │    User     │  │  Analytics  │  │   Billing   │  │   System    │    │
│  │ Management  │  │  Dashboard  │  │  Management │  │   Config    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Backend API Architecture (Hono on Cloudflare Workers)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND API ARCHITECTURE                                   │
│                              (Hono Framework)                                        │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY LAYER                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │  Rate Limiting │ CORS │ Authentication │ Request Validation │ Logging          ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘
                                          │
┌─────────────────────────────────────────▼───────────────────────────────────────────┐
│                              API ROUTE GROUPS                                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐         │
│  │   /api/auth/*       │  │   /api/users/*      │  │   /api/doctors/*    │         │
│  ├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤         │
│  │ POST /login         │  │ GET  /profile       │  │ GET  /list          │         │
│  │ POST /register      │  │ PUT  /profile       │  │ GET  /:id           │         │
│  │ POST /logout        │  │ GET  /records       │  │ GET  /:id/schedule  │         │
│  │ POST /refresh       │  │ POST /upload-image  │  │ POST /availability  │         │
│  │ POST /verify-mfa    │  │ GET  /appointments  │  │ GET  /patients      │         │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘         │
│                                                                                      │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐         │
│  │ /api/appointments/* │  │   /api/ai/*         │  │   /api/video/*      │         │
│  ├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤         │
│  │ POST /create        │  │ POST /analyze-image │  │ POST /create-room   │         │
│  │ GET  /list          │  │ POST /symptom-check │  │ GET  /room/:id      │         │
│  │ GET  /:id           │  │ POST /transcribe    │  │ POST /join          │         │
│  │ PUT  /:id           │  │ POST /summarize     │  │ POST /end           │         │
│  │ DELETE /:id         │  │ POST /vitals-check  │  │ GET  /recording/:id │         │
│  │ POST /:id/cancel    │  │ GET  /analysis/:id  │  │ POST /chat          │         │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘         │
│                                                                                      │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐         │
│  │  /api/records/*     │  │   /api/billing/*    │  │   /api/admin/*      │         │
│  ├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤         │
│  │ GET  /patient/:id   │  │ POST /create-intent │  │ GET  /users         │         │
│  │ POST /create        │  │ POST /process       │  │ GET  /analytics     │         │
│  │ PUT  /:id           │  │ GET  /history       │  │ POST /settings      │         │
│  │ POST /share         │  │ GET  /invoices      │  │ GET  /audit-logs    │         │
│  │ GET  /download/:id  │  │ POST /refund        │  │ POST /compliance    │         │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘         │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. AI Integration Architecture

### 3.1 AI Service Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           AI INTEGRATION ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              AI ORCHESTRATION LAYER                                  │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                          AI Router (Hono Middleware)                             ││
│  │  • Request Classification → Route to appropriate AI service                      ││
│  │  • Response Aggregation   → Combine multiple AI results                          ││
│  │  • Fallback Handling      → Graceful degradation if AI fails                     ││
│  │  • Cost Optimization      → Route based on complexity/cost                       ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
┌───────────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────┐
│   GENERAL AI ANALYSIS     │ │   MEDICAL IMAGE AI        │ │   VIDEO/VITALS AI         │
├───────────────────────────┤ ├───────────────────────────┤ ├───────────────────────────┤
│                           │ │                           │ │                           │
│  ┌─────────────────────┐  │ │  ┌─────────────────────┐  │ │  ┌─────────────────────┐  │
│  │     OpenAI          │  │ │  │   Google MedGemma   │  │ │  │     Shen.ai         │  │
│  │     GPT-4o          │  │ │  │   (Self-hosted)     │  │ │  │                     │  │
│  ├─────────────────────┤  │ │  ├─────────────────────┤  │ │  ├─────────────────────┤  │
│  │ • Symptom Triage    │  │ │  │ • X-Ray Analysis    │  │ │  │ • Heart Rate        │  │
│  │ • Chat Assistant    │  │ │  │ • CT/MRI Review     │  │ │  │ • Respiratory Rate  │  │
│  │ • Report Summary    │  │ │  │ • Pathology         │  │ │  │ • Stress Level      │  │
│  │ • Drug Interactions │  │ │  │ • Chest Analysis    │  │ │  │ • Blood Pressure*   │  │
│  └─────────────────────┘  │ │  └─────────────────────┘  │ │  └─────────────────────┘  │
│                           │ │                           │ │                           │
│  ┌─────────────────────┐  │ │  ┌─────────────────────┐  │ │  ┌─────────────────────┐  │
│  │   Anthropic Claude  │  │ │  │   Legit.Health      │  │ │  │   Custom ML Model   │  │
│  │   (Backup)          │  │ │  │   (Dermatology)     │  │ │  │   (Optional)        │  │
│  ├─────────────────────┤  │ │  ├─────────────────────┤  │ │  ├─────────────────────┤  │
│  │ • Complex Cases     │  │ │  │ • 200+ Skin Cond.   │  │ │  │ • Emotion Detection │  │
│  │ • Second Opinion    │  │ │  │ • Severity Scoring  │  │ │  │ • Pain Assessment   │  │
│  │ • Research Support  │  │ │  │ • Treatment Recs    │  │ │  │ • Engagement Score  │  │
│  └─────────────────────┘  │ │  └─────────────────────┘  │ │  └─────────────────────┘  │
│                           │ │                           │ │                           │
└───────────────────────────┘ └───────────────────────────┘ └───────────────────────────┘


                              AI PROCESSING WORKFLOWS
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                      │
│  WORKFLOW 1: PRE-CONSULTATION TRIAGE                                                │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │ Patient  │───▶│ Symptom  │───▶│  OpenAI  │───▶│ Priority │───▶│ Schedule │      │
│  │  Input   │    │  Form    │    │  Triage  │    │  Score   │    │  Match   │      │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘      │
│                                                                                      │
│  WORKFLOW 2: IMAGE ANALYSIS                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │  Upload  │───▶│  Image   │───▶│ Specialty│───▶│ Generate │───▶│ Doctor   │      │
│  │  Image   │    │ Validate │    │    AI    │    │  Report  │    │  Review  │      │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘      │
│                                                                                      │
│  WORKFLOW 3: REAL-TIME VIDEO ANALYSIS                                               │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │  Video   │───▶│  Frame   │───▶│ Vitals   │───▶│  Alert   │───▶│ Doctor   │      │
│  │  Feed    │    │ Extract  │    │   AI     │    │ Generate │    │  Display │      │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘      │
│                                                                                      │
│  WORKFLOW 4: POST-CONSULTATION SUMMARY                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │  Audio   │───▶│Transcribe│───▶│ Generate │───▶│ Generate │───▶│  Store   │      │
│  │Recording │    │  (AI)    │    │ Summary  │    │ Records  │    │ & Share  │      │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘      │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 AI Decision Matrix

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           AI SERVICE SELECTION MATRIX                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ INPUT TYPE        │ PRIMARY AI        │ FALLBACK AI      │ CONFIDENCE REQ.     ││
│  ├───────────────────┼───────────────────┼──────────────────┼─────────────────────┤│
│  │ Symptom Text      │ OpenAI GPT-4o     │ Anthropic Claude │ 70%                 ││
│  │ Skin Image        │ Legit.Health      │ GPT-4o Vision    │ 80%                 ││
│  │ X-Ray/CT Image    │ Google MedGemma   │ GPT-4o Vision    │ 85%                 ││
│  │ Video Frame       │ Shen.ai           │ Custom Model     │ 75%                 ││
│  │ Audio Recording   │ OpenAI Whisper    │ Google Speech    │ 90%                 ││
│  │ Lab Results       │ OpenAI GPT-4o     │ MedGemma         │ 90%                 ││
│  │ Drug Interaction  │ OpenAI GPT-4o     │ DrugBank API     │ 95%                 ││
│  └───────────────────┴───────────────────┴──────────────────┴─────────────────────┘│
│                                                                                      │
│  ROUTING LOGIC:                                                                      │
│  1. Classify input type                                                             │
│  2. Route to primary AI service                                                     │
│  3. If confidence < threshold → Route to fallback                                   │
│  4. If both fail → Flag for human review                                           │
│  5. Log all decisions for audit trail                                              │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Architecture

### 4.1 Database Schema (Cloudflare D1)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA DESIGN                                     │
│                              (Cloudflare D1 - SQLite)                               │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│       USERS         │       │      PATIENTS       │       │      DOCTORS        │
├─────────────────────┤       ├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │       │ id (PK)             │
│ email (UNIQUE)      │       │ user_id (FK)        │──┐    │ user_id (FK)        │──┐
│ password_hash       │       │ date_of_birth       │  │    │ license_number      │  │
│ role (enum)         │◀──────│ gender              │  │    │ specialization      │  │
│ mfa_enabled         │       │ blood_type          │  │    │ years_experience    │  │
│ mfa_secret          │       │ allergies (JSON)    │  │    │ education (JSON)    │  │
│ created_at          │       │ emergency_contact   │  │    │ certifications      │  │
│ updated_at          │       │ insurance_info      │  │    │ consultation_fee    │  │
│ last_login          │       │ created_at          │  │    │ available_hours     │  │
└─────────────────────┘       └─────────────────────┘  │    │ rating              │  │
                                                        │    │ verified_at         │  │
                                                        │    └─────────────────────┘  │
                                                        │                              │
┌─────────────────────┐       ┌─────────────────────┐  │    ┌─────────────────────┐  │
│    APPOINTMENTS     │       │   MEDICAL_RECORDS   │  │    │   AI_ANALYSES       │  │
├─────────────────────┤       ├─────────────────────┤  │    ├─────────────────────┤  │
│ id (PK)             │       │ id (PK)             │  │    │ id (PK)             │  │
│ patient_id (FK)     │──────▶│ patient_id (FK)     │◀─┘    │ patient_id (FK)     │◀─┘
│ doctor_id (FK)      │──────▶│ doctor_id (FK)      │◀──────│ appointment_id (FK) │
│ scheduled_at        │       │ appointment_id (FK) │       │ ai_service          │
│ duration_minutes    │       │ record_type         │       │ input_type          │
│ status (enum)       │       │ diagnosis           │       │ input_reference     │
│ consultation_type   │       │ symptoms (JSON)     │       │ result (JSON)       │
│ video_room_id       │       │ prescriptions (JSON)│       │ confidence_score    │
│ notes               │       │ lab_results (JSON)  │       │ flagged_for_review  │
│ ai_summary          │       │ notes               │       │ reviewed_by         │
│ created_at          │       │ attachments (JSON)  │       │ reviewed_at         │
│ updated_at          │       │ created_at          │       │ created_at          │
└─────────────────────┘       └─────────────────────┘       └─────────────────────┘

┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│   VIDEO_SESSIONS    │       │      MESSAGES       │       │     PAYMENTS        │
├─────────────────────┤       ├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │       │ id (PK)             │
│ appointment_id (FK) │       │ appointment_id (FK) │       │ appointment_id (FK) │
│ room_id (UNIQUE)    │       │ sender_id (FK)      │       │ patient_id (FK)     │
│ provider            │       │ recipient_id (FK)   │       │ amount              │
│ started_at          │       │ content             │       │ currency            │
│ ended_at            │       │ content_type        │       │ status (enum)       │
│ duration_seconds    │       │ attachments (JSON)  │       │ stripe_payment_id   │
│ recording_url       │       │ read_at             │       │ invoice_url         │
│ transcript          │       │ created_at          │       │ created_at          │
│ vitals_data (JSON)  │       └─────────────────────┘       └─────────────────────┘
│ ai_insights (JSON)  │
└─────────────────────┘

┌─────────────────────┐       ┌─────────────────────┐
│    AUDIT_LOGS       │       │    NOTIFICATIONS    │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ user_id (FK)        │       │ user_id (FK)        │
│ action              │       │ type                │
│ resource_type       │       │ title               │
│ resource_id         │       │ message             │
│ ip_address          │       │ data (JSON)         │
│ user_agent          │       │ read_at             │
│ details (JSON)      │       │ created_at          │
│ created_at          │       └─────────────────────┘
└─────────────────────┘
```

### 4.2 Storage Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           STORAGE ARCHITECTURE                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           CLOUDFLARE D1 (Relational Data)                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • User profiles, authentication data                                            ││
│  │ • Appointments, scheduling                                                       ││
│  │ • Medical records metadata                                                       ││
│  │ • AI analysis results and audit logs                                            ││
│  │ • Payments and billing records                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           CLOUDFLARE KV (Fast Access Data)                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Session tokens (TTL: 24h)                                                     ││
│  │ • Rate limiting counters (TTL: 1min)                                            ││
│  │ • Cached AI responses (TTL: 1h)                                                 ││
│  │ • Feature flags and configuration                                               ││
│  │ • Temporary verification codes (TTL: 10min)                                     ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           CLOUDFLARE R2 (Binary/File Storage)                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                                                                                  ││
│  │  BUCKET: telemed-medical-images                                                 ││
│  │  ├── patients/{patient_id}/                                                     ││
│  │  │   ├── skin/{timestamp}_{uuid}.jpg                                           ││
│  │  │   ├── xray/{timestamp}_{uuid}.dcm                                           ││
│  │  │   └── documents/{timestamp}_{uuid}.pdf                                      ││
│  │  │                                                                              ││
│  │  BUCKET: telemed-video-recordings                                               ││
│  │  ├── consultations/{appointment_id}/                                            ││
│  │  │   ├── recording.webm                                                         ││
│  │  │   ├── transcript.json                                                        ││
│  │  │   └── vitals_timeline.json                                                   ││
│  │  │                                                                              ││
│  │  BUCKET: telemed-reports                                                        ││
│  │  ├── ai_reports/{analysis_id}/                                                  ││
│  │  │   └── report_{timestamp}.pdf                                                 ││
│  │  ├── prescriptions/{record_id}/                                                 ││
│  │  │   └── prescription_{timestamp}.pdf                                           ││
│  │                                                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           CLOUDFLARE DURABLE OBJECTS (Real-time State)              │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Video room state (participants, permissions)                                  ││
│  │ • Real-time chat state                                                          ││
│  │ • WebSocket connection management                                               ││
│  │ • Live collaboration features                                                   ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Security & Compliance Architecture

### 5.1 HIPAA Compliance Framework

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           HIPAA COMPLIANCE ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY LAYERS                                            │
│                                                                                      │
│  LAYER 1: NETWORK SECURITY                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Cloudflare WAF (Web Application Firewall)                                     ││
│  │ • DDoS Protection (automatic)                                                   ││
│  │ • TLS 1.3 encryption for all traffic                                            ││
│  │ • IP allowlisting for admin access                                              ││
│  │ • Bot protection and rate limiting                                              ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  LAYER 2: APPLICATION SECURITY                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • JWT tokens with short expiry (15 min access, 7 day refresh)                   ││
│  │ • Multi-Factor Authentication (TOTP/SMS)                                        ││
│  │ • Role-Based Access Control (RBAC)                                              ││
│  │ • Input validation and sanitization                                             ││
│  │ • CSRF protection                                                               ││
│  │ • Content Security Policy (CSP)                                                 ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  LAYER 3: DATA SECURITY                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • AES-256 encryption at rest (D1, R2, KV)                                       ││
│  │ • Field-level encryption for PII (SSN, DOB)                                     ││
│  │ • Secure key management (Cloudflare Secrets)                                    ││
│  │ • Data masking in logs                                                          ││
│  │ • Automatic backup encryption                                                   ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  LAYER 4: AUDIT & MONITORING                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Comprehensive audit logging (all PHI access)                                  ││
│  │ • Real-time anomaly detection                                                   ││
│  │ • User activity monitoring                                                      ││
│  │ • Failed login tracking                                                         ││
│  │ • Data export logging                                                           ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           HIPAA SAFEGUARDS MAPPING                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ADMINISTRATIVE SAFEGUARDS                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ Requirement                    │ Implementation                                 ││
│  ├────────────────────────────────┼────────────────────────────────────────────────┤│
│  │ Security Officer               │ Role defined in Admin Portal                   ││
│  │ Risk Assessment                │ Quarterly automated + annual manual            ││
│  │ Workforce Training             │ In-app training modules                        ││
│  │ Incident Response              │ Automated alerts + playbook                    ││
│  │ Business Associates            │ BAA tracking in Admin Portal                   ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  PHYSICAL SAFEGUARDS                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ Requirement                    │ Implementation                                 ││
│  ├────────────────────────────────┼────────────────────────────────────────────────┤│
│  │ Facility Access                │ Cloudflare data center compliance (SOC 2)     ││
│  │ Workstation Security           │ Session timeout, auto-lock                     ││
│  │ Device Controls                │ Mobile device management (optional)            ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  TECHNICAL SAFEGUARDS                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ Requirement                    │ Implementation                                 ││
│  ├────────────────────────────────┼────────────────────────────────────────────────┤│
│  │ Access Control                 │ RBAC + unique user IDs + auto-logoff          ││
│  │ Audit Controls                 │ Comprehensive logging to audit_logs table     ││
│  │ Integrity Controls             │ Checksums + version history                    ││
│  │ Transmission Security          │ TLS 1.3 + end-to-end encryption (WebRTC)      ││
│  │ Authentication                 │ MFA + password policies + session management  ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           LOGIN FLOW WITH MFA                                        │
│                                                                                      │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐           │
│  │  User   │    │ Submit  │    │ Verify  │    │   MFA   │    │  Issue  │           │
│  │ Access  │───▶│ Creds   │───▶│ Password│───▶│ Verify  │───▶│ Tokens  │           │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘           │
│       │              │              │              │              │                  │
│       ▼              ▼              ▼              ▼              ▼                  │
│  ┌─────────────────────────────────────────────────────────────────────┐            │
│  │                        SECURITY CHECKS                               │            │
│  │  • Rate limit check (KV)                                            │            │
│  │  • IP reputation check                                              │            │
│  │  • Device fingerprint validation                                    │            │
│  │  • Brute force detection                                           │            │
│  │  • Suspicious activity flagging                                    │            │
│  └─────────────────────────────────────────────────────────────────────┘            │
│                                                                                      │
│  TOKEN STRUCTURE:                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐            │
│  │  Access Token (15 min):                                              │            │
│  │  {                                                                   │            │
│  │    "sub": "user_id",                                                │            │
│  │    "role": "patient|doctor|admin",                                  │            │
│  │    "permissions": ["read:records", "write:appointments"],           │            │
│  │    "exp": 1234567890,                                               │            │
│  │    "iat": 1234567890,                                               │            │
│  │    "jti": "unique_token_id"                                         │            │
│  │  }                                                                   │            │
│  └─────────────────────────────────────────────────────────────────────┘            │
│                                                                                      │
│  RBAC PERMISSIONS:                                                                  │
│  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│  │ Role      │ Permissions                                                        │  │
│  ├───────────┼────────────────────────────────────────────────────────────────────┤  │
│  │ Patient   │ read:own_records, write:appointments, upload:images               │  │
│  │ Doctor    │ read:patient_records, write:records, write:prescriptions          │  │
│  │ Admin     │ manage:users, view:analytics, manage:settings, view:audit_logs    │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Video Consultation Architecture

### 6.1 WebRTC Integration

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           VIDEO CONSULTATION ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           OPTION A: DAILY.CO (RECOMMENDED)                          │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                                                                                  ││
│  │    ┌──────────┐         ┌──────────────────┐         ┌──────────┐              ││
│  │    │  Patient │◀───────▶│    Daily.co      │◀───────▶│  Doctor  │              ││
│  │    │  Browser │   P2P   │   Media Server   │   P2P   │  Browser │              ││
│  │    └──────────┘  WebRTC └──────────────────┘  WebRTC └──────────┘              ││
│  │         │                       │                          │                    ││
│  │         │                       ▼                          │                    ││
│  │         │              ┌──────────────────┐                │                    ││
│  │         │              │   Recording +    │                │                    ││
│  │         │              │   Transcription  │                │                    ││
│  │         │              └────────┬─────────┘                │                    ││
│  │         │                       │                          │                    ││
│  │         └───────────────────────┼──────────────────────────┘                    ││
│  │                                 ▼                                               ││
│  │                    ┌────────────────────────┐                                   ││
│  │                    │   Cloudflare Worker    │                                   ││
│  │                    │   - Room management    │                                   ││
│  │                    │   - Token generation   │                                   ││
│  │                    │   - Webhook handling   │                                   ││
│  │                    └────────────────────────┘                                   ││
│  │                                                                                  ││
│  │  FEATURES:                                                                       ││
│  │  ✅ HIPAA compliant (BAA available)                                             ││
│  │  ✅ Built-in recording & transcription                                          ││
│  │  ✅ Screen sharing                                                              ││
│  │  ✅ Custom UI via iframe or React SDK                                           ││
│  │  ✅ 99.99% uptime SLA                                                           ││
│  │                                                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           OPTION B: CLOUDFLARE CALLS (EMERGING)                     │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                                                                                  ││
│  │    ┌──────────┐         ┌──────────────────┐         ┌──────────┐              ││
│  │    │  Patient │◀───────▶│ Cloudflare Calls │◀───────▶│  Doctor  │              ││
│  │    │  Browser │  WebRTC │  (Global Edge)   │  WebRTC │  Browser │              ││
│  │    └──────────┘         └──────────────────┘         └──────────┘              ││
│  │                                 │                                               ││
│  │                                 ▼                                               ││
│  │                    ┌────────────────────────┐                                   ││
│  │                    │  Durable Objects       │                                   ││
│  │                    │  - Room state          │                                   ││
│  │                    │  - Signaling           │                                   ││
│  │                    └────────────────────────┘                                   ││
│  │                                                                                  ││
│  │  FEATURES:                                                                       ││
│  │  ✅ Native Cloudflare integration                                               ││
│  │  ✅ Global edge network (low latency)                                           ││
│  │  ⚠️  HIPAA compliance (verify with Cloudflare)                                  ││
│  │  ⚠️  Recording needs custom implementation                                       ││
│  │                                                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           VIDEO SESSION FLOW                                         │
│                                                                                      │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                                 │ │
│  │  1. ROOM CREATION                                                              │ │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐                 │ │
│  │  │ Schedule │───▶│  Create  │───▶│ Generate │───▶│  Store   │                 │ │
│  │  │ Appt.    │    │ Room ID  │    │ Tokens   │    │  in D1   │                 │ │
│  │  └──────────┘    └──────────┘    └──────────┘    └──────────┘                 │ │
│  │                                                                                 │ │
│  │  2. JOIN SESSION                                                               │ │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐                 │ │
│  │  │ Click    │───▶│ Validate │───▶│  Get     │───▶│  Join    │                 │ │
│  │  │ Join     │    │ Identity │    │  Token   │    │  Room    │                 │ │
│  │  └──────────┘    └──────────┘    └──────────┘    └──────────┘                 │ │
│  │                                                                                 │ │
│  │  3. DURING SESSION                                                             │ │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐                 │ │
│  │  │  Video   │───▶│   AI     │───▶│  Real-   │───▶│ Display  │                 │ │
│  │  │  Stream  │    │  Vitals  │    │  time    │    │  to Doc  │                 │ │
│  │  └──────────┘    └──────────┘    └──────────┘    └──────────┘                 │ │
│  │                                                                                 │ │
│  │  4. POST SESSION                                                               │ │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐                 │ │
│  │  │   End    │───▶│ Process  │───▶│ Generate │───▶│  Store   │                 │ │
│  │  │  Call    │    │Recording │    │ Summary  │    │ Records  │                 │ │
│  │  └──────────┘    └──────────┘    └──────────┘    └──────────┘                 │ │
│  │                                                                                 │ │
│  └────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Implementation Roadmap

### 7.1 Phase Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           IMPLEMENTATION ROADMAP                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                      │
│  PHASE 1: FOUNDATION (Weeks 1-4)                                            🟢 MVP  │
│  ═══════════════════════════════════════════════════════════════════════════════════│
│                                                                                      │
│  Week 1-2: Core Setup                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Initialize Cloudflare Pages project with Hono                                 ││
│  │ • Set up D1 database with core tables (users, patients, doctors)               ││
│  │ • Implement authentication (Auth0 or custom JWT)                                ││
│  │ • Create basic API routes structure                                             ││
│  │ • Set up R2 buckets for file storage                                           ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  Week 3-4: Patient Portal MVP                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Patient registration and login                                                ││
│  │ • Profile management                                                            ││
│  │ • Basic appointment booking                                                     ││
│  │ • Doctor listing and search                                                     ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  DELIVERABLES:                                                                      │
│  ✓ Working authentication system                                                   │
│  ✓ Patient can register and book appointments                                      │
│  ✓ Basic doctor profiles visible                                                   │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                      │
│  PHASE 2: VIDEO CONSULTATIONS (Weeks 5-8)                                  🟡 BETA │
│  ═══════════════════════════════════════════════════════════════════════════════════│
│                                                                                      │
│  Week 5-6: Video Integration                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Integrate Daily.co for video calls                                           ││
│  │ • Room creation and token management                                           ││
│  │ • Patient and doctor video interfaces                                          ││
│  │ • In-call chat functionality                                                    ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  Week 7-8: Doctor Portal                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Doctor dashboard and schedule management                                      ││
│  │ • Patient queue and appointment management                                      ││
│  │ • Basic medical record creation                                                 ││
│  │ • Prescription generation                                                       ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  DELIVERABLES:                                                                      │
│  ✓ Full video consultation flow                                                    │
│  ✓ Doctor can manage schedule and see patients                                     │
│  ✓ Basic medical records system                                                    │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                      │
│  PHASE 3: AI INTEGRATION (Weeks 9-14)                                      🔵 V1.0 │
│  ═══════════════════════════════════════════════════════════════════════════════════│
│                                                                                      │
│  Week 9-10: Symptom Triage AI                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Integrate OpenAI GPT-4o for symptom assessment                               ││
│  │ • Build AI chatbot interface                                                    ││
│  │ • Implement triage scoring and urgency detection                               ││
│  │ • Connect triage results to appointment booking                                ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  Week 11-12: Medical Image Analysis                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Image upload and processing pipeline                                          ││
│  │ • Integrate specialty AI (dermatology, radiology)                              ││
│  │ • AI analysis result display for doctors                                       ││
│  │ • Confidence scoring and flagging                                              ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  Week 13-14: Video AI Features                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Integrate Shen.ai for real-time vitals                                       ││
│  │ • Auto-transcription with OpenAI Whisper                                       ││
│  │ • AI-generated consultation summaries                                          ││
│  │ • Recording storage and retrieval                                              ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  DELIVERABLES:                                                                      │
│  ✓ AI-powered symptom checker                                                      │
│  ✓ Medical image analysis (skin, X-ray)                                           │
│  ✓ Real-time vitals during video calls                                            │
│  ✓ Auto-generated consultation notes                                              │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                      │
│  PHASE 4: COMPLIANCE & POLISH (Weeks 15-18)                               🟣 V1.5  │
│  ═══════════════════════════════════════════════════════════════════════════════════│
│                                                                                      │
│  Week 15-16: Security Hardening                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Implement MFA for all users                                                   ││
│  │ • Complete audit logging                                                        ││
│  │ • Data encryption at rest                                                       ││
│  │ • Security testing and penetration testing                                      ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  Week 17-18: Payments & Admin                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Stripe payment integration                                                    ││
│  │ • Invoice generation                                                            ││
│  │ • Admin dashboard with analytics                                               ││
│  │ • Compliance reporting tools                                                    ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  DELIVERABLES:                                                                      │
│  ✓ HIPAA-ready security measures                                                   │
│  ✓ Full payment flow                                                               │
│  ✓ Admin analytics and reporting                                                   │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                      │
│  PHASE 5: SCALE & OPTIMIZE (Weeks 19+)                                    🔴 V2.0  │
│  ═══════════════════════════════════════════════════════════════════════════════════│
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Mobile app development (React Native)                                         ││
│  │ • EHR/EMR integrations (Epic, Cerner)                                          ││
│  │ • Advanced AI features (differential diagnosis, drug interactions)              ││
│  │ • Multi-language support                                                        ││
│  │ • White-label capabilities                                                      ││
│  │ • Performance optimization and caching                                          ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Technology Stack Summary

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           TECHNOLOGY STACK                                           │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  CATEGORY              │ TECHNOLOGY              │ PURPOSE                          │
├────────────────────────┼─────────────────────────┼──────────────────────────────────┤
│                        │                         │                                  │
│  FRONTEND              │ HTML/CSS/JS (SPA)       │ Patient & Doctor Portals         │
│                        │ Tailwind CSS            │ Styling                          │
│                        │ Alpine.js or htmx       │ Interactivity (lightweight)      │
│                        │ Chart.js                │ Analytics visualizations         │
│                        │                         │                                  │
├────────────────────────┼─────────────────────────┼──────────────────────────────────┤
│                        │                         │                                  │
│  BACKEND               │ Hono                    │ Web framework                    │
│                        │ TypeScript              │ Type safety                      │
│                        │ Cloudflare Workers      │ Edge runtime                     │
│                        │                         │                                  │
├────────────────────────┼─────────────────────────┼──────────────────────────────────┤
│                        │                         │                                  │
│  DATABASE              │ Cloudflare D1           │ Relational data (SQLite)         │
│                        │ Cloudflare KV           │ Sessions, cache                  │
│                        │ Cloudflare R2           │ File/image storage               │
│                        │ Durable Objects         │ Real-time state                  │
│                        │                         │                                  │
├────────────────────────┼─────────────────────────┼──────────────────────────────────┤
│                        │                         │                                  │
│  AI SERVICES           │ OpenAI GPT-4o           │ Triage, summaries, chat          │
│                        │ OpenAI Whisper          │ Transcription                    │
│                        │ Google MedGemma         │ Medical imaging (optional)       │
│                        │ Legit.Health            │ Dermatology AI                   │
│                        │ Shen.ai                 │ Video vitals detection           │
│                        │                         │                                  │
├────────────────────────┼─────────────────────────┼──────────────────────────────────┤
│                        │                         │                                  │
│  VIDEO                 │ Daily.co                │ WebRTC video (HIPAA)             │
│                        │ (alt: Cloudflare Calls) │ Native CF video                  │
│                        │                         │                                  │
├────────────────────────┼─────────────────────────┼──────────────────────────────────┤
│                        │                         │                                  │
│  THIRD-PARTY           │ Auth0 / Custom          │ Authentication                   │
│                        │ Stripe                  │ Payments                         │
│                        │ Twilio                  │ SMS notifications                │
│                        │ SendGrid                │ Email                            │
│                        │                         │                                  │
├────────────────────────┼─────────────────────────┼──────────────────────────────────┤
│                        │                         │                                  │
│  DEPLOYMENT            │ Cloudflare Pages        │ Static + Workers                 │
│                        │ Wrangler CLI            │ Development & deployment         │
│                        │ GitHub Actions          │ CI/CD                            │
│                        │                         │                                  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Cost Estimation

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           MONTHLY COST ESTIMATION                                    │
│                              (1,000 consultations/month)                            │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  SERVICE                │ TIER           │ EST. MONTHLY COST │ NOTES               │
├─────────────────────────┼────────────────┼───────────────────┼─────────────────────┤
│                         │                │                   │                     │
│  Cloudflare Workers     │ Paid ($5/mo)   │ $5 - $20          │ 10M requests incl.  │
│  Cloudflare D1          │ Paid           │ $5 - $15          │ 5GB storage incl.   │
│  Cloudflare R2          │ Standard       │ $10 - $50         │ Based on storage    │
│  Cloudflare KV          │ Included       │ $0                │ 1GB free            │
│                         │                │                   │                     │
│  Daily.co Video         │ Scale          │ $99 - $499        │ Per participant-min │
│                         │                │                   │                     │
│  OpenAI API             │ Pay-as-you-go  │ $100 - $300       │ GPT-4o + Whisper    │
│  Shen.ai                │ Growth         │ $200 - $500       │ Vitals detection    │
│  Legit.Health           │ Professional   │ $200 - $400       │ Per analysis        │
│                         │                │                   │                     │
│  Auth0                  │ Professional   │ $23 - $240        │ 7K MAU free         │
│  Stripe                 │ Pay-as-you-go  │ 2.9% + $0.30      │ Per transaction     │
│  Twilio SMS             │ Pay-as-you-go  │ $20 - $50         │ ~$0.0075/SMS        │
│  SendGrid               │ Essentials     │ $20 - $50         │ 50K emails/mo       │
│                         │                │                   │                     │
├─────────────────────────┴────────────────┴───────────────────┴─────────────────────┤
│                                                                                     │
│  ESTIMATED TOTAL:  $680 - $2,140 / month                                           │
│                                                                                     │
│  SCALING NOTE: Costs scale linearly with consultations.                            │
│  At 10,000 consultations/month: ~$3,000 - $8,000                                   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Next Steps

### Recommended Actions:

1. **Review Architecture** - Validate requirements and adjust components as needed
2. **Choose AI Services** - Select specific AI providers based on use case priority
3. **Set Up Development Environment** - Initialize Cloudflare project
4. **Start Phase 1** - Begin with authentication and core user management

### Questions to Answer:

- [ ] Which AI features are highest priority? (Triage, Image Analysis, Vitals)
- [ ] Do you need HIPAA compliance from day one?
- [ ] What's the expected scale? (consultations/month)
- [ ] Are there specific EHR/EMR integrations needed?
- [ ] Mobile app requirement timeline?

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Architecture designed for Cloudflare Pages deployment*
