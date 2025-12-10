-- Migration 0006: Demo Patient Complete Schema
-- Ensures all tables exist for demo data

-- 1. FMS Assessments Table
CREATE TABLE IF NOT EXISTS fms_assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  assessment_date DATETIME NOT NULL,
  assessor_name TEXT NOT NULL,
  
  -- Test Scores (0-3 each)
  deep_squat_score INTEGER,
  deep_squat_notes TEXT,
  
  hurdle_step_left INTEGER,
  hurdle_step_right INTEGER,
  hurdle_step_notes TEXT,
  
  inline_lunge_left INTEGER,
  inline_lunge_right INTEGER,
  inline_lunge_notes TEXT,
  
  shoulder_mobility_left INTEGER,
  shoulder_mobility_right INTEGER,
  shoulder_mobility_clearing INTEGER DEFAULT 0,
  
  leg_raise_left INTEGER,
  leg_raise_right INTEGER,
  leg_raise_notes TEXT,
  
  push_up_score INTEGER,
  push_up_clearing INTEGER DEFAULT 0,
  
  rotary_stability_left INTEGER,
  rotary_stability_right INTEGER,
  rotary_stability_clearing INTEGER DEFAULT 0,
  
  -- Calculated Results
  total_score INTEGER,
  lowest_score INTEGER,
  asymmetry_count INTEGER DEFAULT 0,
  
  injury_risk_level TEXT, -- 'low', 'moderate', 'elevated', 'high'
  injury_risk_score INTEGER,
  
  -- Recommendations (JSON arrays)
  recommendations TEXT, -- JSON array
  corrective_exercises TEXT, -- JSON array
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_fms_patient ON fms_assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_fms_date ON fms_assessments(assessment_date);

-- 2. Visual Assessments Table (Enhanced)
CREATE TABLE IF NOT EXISTS visual_assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  assessment_date DATETIME NOT NULL,
  movement_type TEXT NOT NULL,
  
  duration_seconds INTEGER,
  total_frames INTEGER,
  pose_detections INTEGER,
  
  -- Biomechanical Analysis (JSON)
  rom_data TEXT, -- JSON object with joint ROM data
  symmetry_data TEXT, -- JSON object with symmetry metrics
  velocity_data TEXT, -- JSON object with velocity/speed data
  
  compensation_patterns TEXT, -- JSON array of compensation patterns
  quality_score INTEGER, -- 0-100
  
  -- AI Analysis Results (JSON)
  injury_risk_factors TEXT, -- JSON array
  injury_risk_score INTEGER, -- 0-100
  injury_predictions TEXT, -- JSON object
  
  form_corrections TEXT, -- JSON array
  exercise_recommendations TEXT, -- JSON array
  
  -- Raw Data (compressed/summary)
  pose_data_summary TEXT, -- JSON summary instead of full data
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_visual_patient ON visual_assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_visual_date ON visual_assessments(assessment_date);

-- 3. SOAP Notes Table (Enhanced)
CREATE TABLE IF NOT EXISTS soap_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  visit_date DATETIME NOT NULL,
  provider_name TEXT NOT NULL,
  
  -- SOAP Components
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  plan TEXT,
  
  -- Diagnostic/Billing Codes (JSON arrays)
  icd10_codes TEXT, -- JSON array of ICD-10 codes
  cpt_codes TEXT, -- JSON array of CPT codes
  
  -- Goals (JSON arrays)
  short_term_goals TEXT,
  long_term_goals TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_soap_patient ON soap_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_soap_date ON soap_notes(visit_date);

-- 4. Progress Photos Table
CREATE TABLE IF NOT EXISTS progress_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  photo_date DATETIME NOT NULL,
  photo_type TEXT NOT NULL, -- 'baseline', 'progress', 'current'
  
  photo_url TEXT NOT NULL,
  side_view TEXT, -- 'front', 'side', 'back', 'action'
  notes TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_photos_patient ON progress_photos(patient_id);
CREATE INDEX IF NOT EXISTS idx_photos_date ON progress_photos(photo_date);

-- 5. Treatment Goals Table
CREATE TABLE IF NOT EXISTS treatment_goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  
  goal_description TEXT NOT NULL,
  goal_type TEXT NOT NULL, -- 'short_term', 'long_term'
  
  target_date DATETIME,
  completion_date DATETIME,
  
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'discontinued'
  progress_percentage INTEGER DEFAULT 0,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_goals_patient ON treatment_goals(patient_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON treatment_goals(status);

-- 6. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  
  sender_type TEXT NOT NULL, -- 'patient', 'therapist'
  sender_name TEXT NOT NULL,
  
  message_text TEXT NOT NULL,
  
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_messages_patient ON messages(patient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent ON messages(sent_at);

-- 7. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  
  appointment_date DATETIME NOT NULL,
  appointment_type TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 45,
  
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no-show'
  notes TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_appt_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appt_date ON appointments(appointment_date);

-- 8. Exercise Log Table
CREATE TABLE IF NOT EXISTS exercise_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  
  exercise_name TEXT NOT NULL,
  sets INTEGER,
  reps INTEGER,
  
  completion_date DATETIME NOT NULL,
  difficulty_rating INTEGER, -- 1-5
  pain_level INTEGER, -- 0-10
  notes TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_exercise_patient ON exercise_log(patient_id);
CREATE INDEX IF NOT EXISTS idx_exercise_date ON exercise_log(completion_date);

-- 9. Billing Records Table
CREATE TABLE IF NOT EXISTS billing_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  visit_date DATETIME NOT NULL,
  provider_name TEXT NOT NULL,
  
  cpt_codes_recommended TEXT, -- JSON array of recommended codes
  cpt_codes_billed TEXT, -- JSON array of actually billed codes
  
  total_charge REAL,
  estimated_reimbursement REAL,
  
  payer_type TEXT, -- 'medicare', 'medicaid', 'commercial', 'cash'
  denial_risk_score INTEGER, -- 0-100
  
  optimization_notes TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_billing_patient ON billing_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_billing_date ON billing_records(visit_date);

-- 10. AI Analysis Results Table
CREATE TABLE IF NOT EXISTS ai_analysis_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  analysis_date DATETIME NOT NULL,
  analysis_type TEXT NOT NULL, -- 'injury_risk', 'form_correction', 'progress_tracking'
  
  -- Injury Risk Analysis
  risk_factors TEXT, -- JSON array
  risk_score INTEGER, -- 0-100
  risk_level TEXT, -- 'low', 'moderate', 'high'
  predictions TEXT, -- JSON object
  recommendations TEXT, -- JSON array
  
  -- Progress Tracking
  progress_metrics TEXT, -- JSON object
  progress_score INTEGER, -- 0-100
  progress_trend TEXT, -- 'excellent', 'good', 'fair', 'poor'
  clinical_narrative TEXT,
  next_steps TEXT, -- JSON array
  
  -- Metadata
  confidence_score REAL,
  model_version TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_ai_patient ON ai_analysis_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_ai_type ON ai_analysis_results(analysis_type);
CREATE INDEX IF NOT EXISTS idx_ai_date ON ai_analysis_results(analysis_date);
