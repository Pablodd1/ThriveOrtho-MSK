-- TeleMed AI Platform - Initial Database Schema
-- Migration: 0001_initial_schema
-- Created: December 2025

-- ============================================
-- USERS TABLE (Base authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
    mfa_enabled INTEGER DEFAULT 0,
    mfa_secret TEXT,
    email_verified INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    last_login TEXT
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- PATIENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'US',
    blood_type TEXT,
    allergies TEXT, -- JSON array
    chronic_conditions TEXT, -- JSON array
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    insurance_provider TEXT,
    insurance_policy_number TEXT,
    profile_image_url TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_name ON patients(last_name, first_name);

-- ============================================
-- DOCTORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS doctors (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    license_number TEXT NOT NULL,
    license_state TEXT NOT NULL,
    specialization TEXT NOT NULL,
    sub_specializations TEXT, -- JSON array
    years_experience INTEGER,
    education TEXT, -- JSON array
    certifications TEXT, -- JSON array
    languages TEXT DEFAULT '["English"]', -- JSON array
    bio TEXT,
    consultation_fee REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    available_hours TEXT, -- JSON object with schedule
    max_patients_per_day INTEGER DEFAULT 20,
    rating REAL DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_consultations INTEGER DEFAULT 0,
    profile_image_url TEXT,
    verified INTEGER DEFAULT 0,
    verified_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_doctors_user_id ON doctors(user_id);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);
CREATE INDEX idx_doctors_rating ON doctors(rating DESC);
CREATE INDEX idx_doctors_verified ON doctors(verified);

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    patient_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    scheduled_at TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    consultation_type TEXT DEFAULT 'video' CHECK (consultation_type IN ('video', 'audio', 'chat')),
    reason_for_visit TEXT,
    symptoms TEXT, -- JSON array
    ai_triage_score INTEGER, -- 1-10 urgency
    ai_triage_summary TEXT,
    video_room_id TEXT,
    notes TEXT,
    patient_notes TEXT,
    cancellation_reason TEXT,
    cancelled_by TEXT,
    reminder_sent INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ============================================
-- MEDICAL RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS medical_records (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    patient_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    appointment_id TEXT,
    record_type TEXT NOT NULL CHECK (record_type IN ('consultation', 'diagnosis', 'prescription', 'lab_result', 'imaging', 'note')),
    title TEXT NOT NULL,
    diagnosis TEXT,
    diagnosis_codes TEXT, -- JSON array (ICD-10 codes)
    symptoms TEXT, -- JSON array
    chief_complaint TEXT,
    history_of_present_illness TEXT,
    physical_examination TEXT,
    assessment TEXT,
    plan TEXT,
    prescriptions TEXT, -- JSON array
    lab_results TEXT, -- JSON object
    vital_signs TEXT, -- JSON object
    attachments TEXT, -- JSON array of R2 URLs
    ai_analysis_id TEXT,
    is_confidential INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor_id ON medical_records(doctor_id);
CREATE INDEX idx_medical_records_appointment_id ON medical_records(appointment_id);
CREATE INDEX idx_medical_records_type ON medical_records(record_type);
CREATE INDEX idx_medical_records_created_at ON medical_records(created_at DESC);

-- ============================================
-- AI ANALYSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ai_analyses (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    patient_id TEXT NOT NULL,
    appointment_id TEXT,
    medical_record_id TEXT,
    ai_service TEXT NOT NULL, -- 'openai', 'medgemma', 'legit_health', 'shen_ai'
    analysis_type TEXT NOT NULL, -- 'symptom_triage', 'image_analysis', 'vitals', 'transcription', 'summary'
    input_type TEXT NOT NULL, -- 'text', 'image', 'video_frame', 'audio'
    input_reference TEXT, -- R2 URL or text
    result TEXT NOT NULL, -- JSON object with analysis results
    confidence_score REAL,
    processing_time_ms INTEGER,
    model_version TEXT,
    flagged_for_review INTEGER DEFAULT 0,
    flag_reason TEXT,
    reviewed_by TEXT,
    reviewed_at TEXT,
    reviewer_notes TEXT,
    cost_cents INTEGER, -- API cost tracking
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE SET NULL
);

CREATE INDEX idx_ai_analyses_patient_id ON ai_analyses(patient_id);
CREATE INDEX idx_ai_analyses_appointment_id ON ai_analyses(appointment_id);
CREATE INDEX idx_ai_analyses_type ON ai_analyses(analysis_type);
CREATE INDEX idx_ai_analyses_flagged ON ai_analyses(flagged_for_review);
CREATE INDEX idx_ai_analyses_created_at ON ai_analyses(created_at DESC);

-- ============================================
-- VIDEO SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS video_sessions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    appointment_id TEXT NOT NULL UNIQUE,
    room_id TEXT NOT NULL UNIQUE,
    provider TEXT DEFAULT 'daily.co', -- 'daily.co', 'cloudflare_calls'
    patient_token TEXT,
    doctor_token TEXT,
    status TEXT DEFAULT 'created' CHECK (status IN ('created', 'waiting', 'active', 'ended')),
    started_at TEXT,
    ended_at TEXT,
    duration_seconds INTEGER,
    recording_url TEXT,
    recording_status TEXT DEFAULT 'none' CHECK (recording_status IN ('none', 'recording', 'processing', 'ready', 'failed')),
    transcript TEXT,
    ai_summary TEXT,
    vitals_data TEXT, -- JSON array of vitals readings over time
    ai_insights TEXT, -- JSON array of real-time AI observations
    participant_count INTEGER DEFAULT 0,
    quality_metrics TEXT, -- JSON object
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);

CREATE INDEX idx_video_sessions_appointment_id ON video_sessions(appointment_id);
CREATE INDEX idx_video_sessions_room_id ON video_sessions(room_id);
CREATE INDEX idx_video_sessions_status ON video_sessions(status);

-- ============================================
-- MESSAGES TABLE (In-consultation chat)
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    appointment_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('patient', 'doctor', 'system', 'ai')),
    content TEXT NOT NULL,
    content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'file', 'ai_suggestion')),
    attachment_url TEXT,
    attachment_name TEXT,
    read_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_appointment_id ON messages(appointment_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    appointment_id TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded')),
    payment_method TEXT, -- 'card', 'insurance'
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    stripe_refund_id TEXT,
    invoice_url TEXT,
    receipt_url TEXT,
    platform_fee REAL,
    doctor_payout REAL,
    payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'completed', 'failed')),
    refund_amount REAL,
    refund_reason TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

CREATE INDEX idx_payments_appointment_id ON payments(appointment_id);
CREATE INDEX idx_payments_patient_id ON payments(patient_id);
CREATE INDEX idx_payments_doctor_id ON payments(doctor_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_payment_intent ON payments(stripe_payment_intent_id);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'appointment_reminder', 'appointment_confirmed', 'new_message', 'ai_result_ready', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data TEXT, -- JSON object with additional context
    channel TEXT DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email', 'sms', 'push')),
    sent_at TEXT,
    read_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read_at);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- AUDIT LOGS TABLE (HIPAA Compliance)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT,
    action TEXT NOT NULL, -- 'login', 'logout', 'view_record', 'create_record', 'update_record', 'delete_record', 'export_data', etc.
    resource_type TEXT, -- 'patient', 'medical_record', 'appointment', etc.
    resource_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    details TEXT, -- JSON object with action details
    status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failure', 'warning')),
    error_message TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================
-- DOCTOR AVAILABILITY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS doctor_availability (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    doctor_id TEXT NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
    start_time TEXT NOT NULL, -- HH:MM format
    end_time TEXT NOT NULL, -- HH:MM format
    is_available INTEGER DEFAULT 1,
    slot_duration_minutes INTEGER DEFAULT 30,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

CREATE INDEX idx_doctor_availability_doctor_id ON doctor_availability(doctor_id);
CREATE INDEX idx_doctor_availability_day ON doctor_availability(day_of_week);

-- ============================================
-- DOCTOR TIME OFF TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS doctor_time_off (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    doctor_id TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    reason TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

CREATE INDEX idx_doctor_time_off_doctor_id ON doctor_time_off(doctor_id);
CREATE INDEX idx_doctor_time_off_dates ON doctor_time_off(start_date, end_date);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    appointment_id TEXT NOT NULL UNIQUE,
    patient_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_anonymous INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

CREATE INDEX idx_reviews_doctor_id ON reviews(doctor_id);
CREATE INDEX idx_reviews_patient_id ON reviews(patient_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
