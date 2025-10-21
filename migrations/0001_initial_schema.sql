-- Migration 0001: Initial Schema for F-AI bian Assessment System
-- 11 core tables for elderly home rehabilitation monitoring

-- ============================================
-- 1. PATIENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK(gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  email TEXT,
  phone TEXT,
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  
  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  
  -- Medical Information
  primary_physician TEXT,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  medical_history TEXT, -- JSON: {conditions: [], surgeries: []}
  current_medications TEXT, -- JSON: [{name, dosage, frequency}]
  allergies TEXT, -- JSON: [allergy1, allergy2]
  
  -- Assessment Context
  assessment_reason TEXT, -- 'post_surgery', 'fall_prevention', 'chronic_pain', etc.
  chief_complaint TEXT,
  pain_scale INTEGER CHECK(pain_scale BETWEEN 0 AND 10),
  activity_level TEXT, -- 'sedentary', 'light', 'moderate', 'active'
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. ASSESSMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  clinician_id INTEGER,
  assessment_date DATE DEFAULT (date('now')),
  assessment_type TEXT DEFAULT 'initial', -- 'initial', 'progress', 'discharge'
  
  -- CRITICAL: Column is 'status' NOT 'assessment_status'
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'cancelled'
  
  -- Summary
  overall_score REAL, -- 0-100
  clinical_notes TEXT,
  recommendations TEXT, -- JSON array
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- ============================================
-- 3. MOVEMENT_TESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS movement_tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assessment_id INTEGER NOT NULL,
  test_name TEXT NOT NULL,
  test_category TEXT, -- 'mobility', 'stability', 'strength', 'flexibility', 'balance'
  test_order INTEGER DEFAULT 1,
  
  instructions TEXT,
  
  -- CRITICAL: Column is 'status' NOT 'test_status'
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'skipped'
  
  -- Skeleton tracking data
  skeleton_data TEXT, -- JSON: {frames: [], duration: 0, camera_type: 'webcam'|'femto_mega'}
  camera_type TEXT, -- 'webcam', 'phone', 'external', 'femto_mega'
  
  -- Results
  score REAL, -- 0-100
  deficiencies TEXT, -- JSON: [{area, severity, description}]
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  started_at DATETIME,
  completed_at DATETIME,
  
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

-- ============================================
-- 4. EXERCISES TABLE (Library)
-- ============================================
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'mobility', 'stability', 'strength', 'flexibility', 'balance', 'coordination'
  description TEXT,
  instructions TEXT,
  
  -- Target areas
  target_muscles TEXT, -- JSON array
  target_joints TEXT, -- JSON array
  target_conditions TEXT, -- JSON array: ['hip_rom', 'knee_stability', etc.]
  
  -- Media
  video_url TEXT,
  image_url TEXT,
  
  -- Difficulty
  difficulty_level INTEGER DEFAULT 1, -- 1-5
  
  -- Safety
  contraindications TEXT, -- JSON array
  precautions TEXT,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. PRESCRIPTIONS TABLE (Exercise Programs)
-- ============================================
CREATE TABLE IF NOT EXISTS prescriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  assessment_id INTEGER,
  clinician_id INTEGER,
  
  program_name TEXT NOT NULL,
  program_goals TEXT, -- JSON array
  
  frequency_per_week INTEGER DEFAULT 3,
  estimated_duration_minutes INTEGER DEFAULT 30,
  
  start_date DATE DEFAULT (date('now')),
  end_date DATE,
  
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'completed', 'cancelled'
  
  clinician_notes TEXT,
  patient_instructions TEXT,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE SET NULL
);

-- ============================================
-- 6. PRESCRIBED_EXERCISES TABLE (Join Table)
-- ============================================
CREATE TABLE IF NOT EXISTS prescribed_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prescription_id INTEGER NOT NULL,
  exercise_id INTEGER NOT NULL,
  
  -- Parameters
  sets INTEGER DEFAULT 3,
  reps INTEGER DEFAULT 10,
  hold_time INTEGER, -- seconds
  rest_time INTEGER DEFAULT 60, -- seconds between sets
  
  frequency_per_week INTEGER DEFAULT 3,
  
  -- Clinical reasoning
  clinical_reason TEXT,
  target_deficiency TEXT,
  
  -- Progression
  progression_criteria TEXT,
  
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'modified', 'discontinued'
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT
);

-- ============================================
-- 7. EXERCISE_SESSIONS TABLE (Patient Home Workouts)
-- ============================================
CREATE TABLE IF NOT EXISTS exercise_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  prescription_id INTEGER,
  
  session_date DATE DEFAULT (date('now')),
  start_time DATETIME,
  end_time DATETIME,
  duration_minutes INTEGER,
  
  completed INTEGER DEFAULT 0, -- Boolean: 0 or 1
  
  -- Patient feedback
  perceived_exertion INTEGER CHECK(perceived_exertion BETWEEN 1 AND 10),
  pain_level INTEGER CHECK(pain_level BETWEEN 0 AND 10),
  notes TEXT,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE SET NULL
);

-- ============================================
-- 8. EXERCISE_PERFORMANCES TABLE (Individual Exercise Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS exercise_performances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  prescribed_exercise_id INTEGER NOT NULL,
  
  sets_completed INTEGER DEFAULT 0,
  reps_completed INTEGER DEFAULT 0,
  hold_time_achieved INTEGER, -- seconds
  
  -- Quality metrics
  form_quality TEXT, -- 'excellent', 'good', 'fair', 'poor'
  completion_status TEXT DEFAULT 'completed', -- 'completed', 'partial', 'skipped'
  
  -- Patient feedback
  difficulty_rating INTEGER CHECK(difficulty_rating BETWEEN 1 AND 5),
  pain_during_exercise INTEGER CHECK(pain_during_exercise BETWEEN 0 AND 10),
  notes TEXT,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (session_id) REFERENCES exercise_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (prescribed_exercise_id) REFERENCES prescribed_exercises(id) ON DELETE CASCADE
);

-- ============================================
-- 9. RPM_MONITORING TABLE (Remote Patient Monitoring for Billing)
-- ============================================
CREATE TABLE IF NOT EXISTS rpm_monitoring (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  billing_month TEXT NOT NULL, -- 'YYYY-MM' format
  
  -- CPT Codes tracking
  cpt_99453_billed INTEGER DEFAULT 0, -- Initial setup (once per patient)
  cpt_99454_billed INTEGER DEFAULT 0, -- Device supply (monthly)
  cpt_99457_billed INTEGER DEFAULT 0, -- 20 minutes clinical review (monthly)
  cpt_99458_billed INTEGER DEFAULT 0, -- Additional 20 minutes (monthly)
  
  -- Activity tracking
  total_monitoring_minutes INTEGER DEFAULT 0,
  total_sessions_recorded INTEGER DEFAULT 0,
  
  -- Data collection days (need 16+ days per month)
  days_with_data INTEGER DEFAULT 0,
  eligible_for_billing INTEGER DEFAULT 0, -- Boolean
  
  -- Clinical review
  last_review_date DATE,
  reviewed_by_clinician_id INTEGER,
  review_notes TEXT,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  UNIQUE(patient_id, billing_month)
);

-- ============================================
-- 10. CLINICIANS TABLE (User Accounts)
-- ============================================
CREATE TABLE IF NOT EXISTS clinicians (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  
  role TEXT DEFAULT 'clinician', -- 'admin', 'clinician', 'assistant'
  
  credentials TEXT, -- 'PT', 'DPT', 'OT', 'PTA', etc.
  license_number TEXT,
  
  active INTEGER DEFAULT 1, -- Boolean
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- ============================================
-- 11. SYSTEM_SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS system_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type TEXT, -- 'string', 'number', 'boolean', 'json'
  description TEXT,
  
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- Patients
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_last_name ON patients(last_name);

-- Assessments
CREATE INDEX IF NOT EXISTS idx_assessments_patient_id ON assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_assessments_date ON assessments(assessment_date);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);

-- Movement Tests
CREATE INDEX IF NOT EXISTS idx_movement_tests_assessment_id ON movement_tests(assessment_id);
CREATE INDEX IF NOT EXISTS idx_movement_tests_status ON movement_tests(status);

-- Prescriptions
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);

-- Prescribed Exercises
CREATE INDEX IF NOT EXISTS idx_prescribed_exercises_prescription_id ON prescribed_exercises(prescription_id);
CREATE INDEX IF NOT EXISTS idx_prescribed_exercises_exercise_id ON prescribed_exercises(exercise_id);

-- Exercise Sessions
CREATE INDEX IF NOT EXISTS idx_exercise_sessions_patient_id ON exercise_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_exercise_sessions_date ON exercise_sessions(session_date);

-- RPM Monitoring
CREATE INDEX IF NOT EXISTS idx_rpm_monitoring_patient_id ON rpm_monitoring(patient_id);
CREATE INDEX IF NOT EXISTS idx_rpm_monitoring_month ON rpm_monitoring(billing_month);

-- Clinicians
CREATE INDEX IF NOT EXISTS idx_clinicians_email ON clinicians(email);

-- ============================================
-- SEED: Default Clinician Account
-- ============================================
INSERT INTO clinicians (email, password_hash, first_name, last_name, role, credentials)
VALUES (
  'admin@faibian.com',
  'demo_hash_change_in_production',
  'Demo',
  'Clinician',
  'admin',
  'PT, DPT'
);

-- ============================================
-- SEED: System Settings
-- ============================================
INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
VALUES 
  ('app_name', 'F-AI bian Assessment System', 'string', 'Application name'),
  ('rpm_minimum_days', '16', 'number', 'Minimum days of data for RPM billing'),
  ('rpm_review_minutes_required', '20', 'number', 'Minutes required for CPT 99457'),
  ('default_session_duration', '30', 'number', 'Default exercise session duration in minutes');
