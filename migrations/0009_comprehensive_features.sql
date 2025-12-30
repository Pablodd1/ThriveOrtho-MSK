-- Migration: Comprehensive Features
-- Description: Add tables for HIPAA audit logging, exercise library, progress tracking, notifications, and video sessions
-- Created: 2024-12-30

-- HIPAA Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  user_id TEXT,
  user_role TEXT,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  details TEXT, -- JSON
  phi_accessed INTEGER DEFAULT 0,
  outcome TEXT DEFAULT 'success',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource);
CREATE INDEX IF NOT EXISTS idx_audit_logs_phi ON audit_logs(phi_accessed);

-- Exercise Prescriptions Table
CREATE TABLE IF NOT EXISTS exercise_prescriptions (
  id TEXT PRIMARY KEY,
  patient_id TEXT,
  provider_id TEXT,
  diagnosis TEXT,
  exercises TEXT NOT NULL, -- JSON array of exercises
  frequency TEXT,
  duration TEXT,
  precautions TEXT, -- JSON array
  progression_criteria TEXT, -- JSON array
  status TEXT DEFAULT 'active',
  start_date TEXT,
  end_date TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_exercise_prescriptions_patient ON exercise_prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_exercise_prescriptions_status ON exercise_prescriptions(status);

-- Exercise Completion Tracking
CREATE TABLE IF NOT EXISTS exercise_completions (
  id TEXT PRIMARY KEY,
  prescription_id TEXT,
  patient_id TEXT,
  exercise_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  sets_completed INTEGER,
  reps_completed INTEGER,
  hold_duration INTEGER, -- seconds
  pain_level INTEGER, -- 0-10
  difficulty_rating INTEGER, -- 1-5
  notes TEXT,
  completed_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (prescription_id) REFERENCES exercise_prescriptions(id)
);

CREATE INDEX IF NOT EXISTS idx_exercise_completions_patient ON exercise_completions(patient_id);
CREATE INDEX IF NOT EXISTS idx_exercise_completions_prescription ON exercise_completions(prescription_id);
CREATE INDEX IF NOT EXISTS idx_exercise_completions_date ON exercise_completions(completed_at);

-- Progress Metrics Table
CREATE TABLE IF NOT EXISTS progress_metrics (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  assessment_id TEXT,
  metric_type TEXT NOT NULL, -- pain, function, rom, strength, balance
  metric_name TEXT NOT NULL, -- NRS, LEFS, shoulder_flexion, etc.
  value REAL NOT NULL,
  unit TEXT,
  previous_value REAL,
  percent_change REAL,
  trend TEXT, -- improving, stable, declining
  measured_at TEXT DEFAULT (datetime('now')),
  measured_by TEXT,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_progress_metrics_patient ON progress_metrics(patient_id);
CREATE INDEX IF NOT EXISTS idx_progress_metrics_type ON progress_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_progress_metrics_date ON progress_metrics(measured_at);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  patient_id TEXT,
  provider_id TEXT,
  type TEXT NOT NULL, -- reminder, alert, message, appointment
  template TEXT,
  subject TEXT,
  body TEXT NOT NULL,
  channels TEXT, -- JSON array: email, sms, push
  status TEXT DEFAULT 'pending', -- pending, sent, failed, read
  scheduled_for TEXT,
  sent_at TEXT,
  read_at TEXT,
  error TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notifications_patient ON notifications(patient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notifications(scheduled_for);

-- Video Sessions Table
CREATE TABLE IF NOT EXISTS video_sessions (
  id TEXT PRIMARY KEY,
  patient_id TEXT,
  provider_id TEXT,
  assessment_id TEXT,
  session_type TEXT, -- assessment, telemedicine, review
  start_time TEXT NOT NULL,
  end_time TEXT,
  duration_seconds INTEGER,
  frame_count INTEGER,
  consent_given INTEGER DEFAULT 0,
  consent_timestamp TEXT,
  storage_location TEXT,
  storage_key TEXT,
  encrypted INTEGER DEFAULT 1,
  retention_days INTEGER DEFAULT 90,
  status TEXT DEFAULT 'recording', -- recording, completed, deleted
  metadata TEXT, -- JSON
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_video_sessions_patient ON video_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_video_sessions_status ON video_sessions(status);
CREATE INDEX IF NOT EXISTS idx_video_sessions_date ON video_sessions(start_time);

-- Gait Analysis Results Table
CREATE TABLE IF NOT EXISTS gait_analyses (
  id TEXT PRIMARY KEY,
  assessment_id TEXT,
  patient_id TEXT,
  analysis_type TEXT, -- standard, tug, 10mwt, 6mwt
  temporal_parameters TEXT, -- JSON: cadence, stride_time, stance_phase, etc.
  spatial_parameters TEXT, -- JSON: stride_length, step_width, gait_speed, etc.
  kinematic_parameters TEXT, -- JSON: joint angles during gait
  symmetry_indices TEXT, -- JSON: L/R comparisons
  qualitative_observations TEXT, -- JSON: heel_strike, arm_swing, etc.
  deviations TEXT, -- JSON array of detected issues
  fall_risk TEXT, -- low, moderate, high
  recommendations TEXT, -- JSON array
  analyzed_at TEXT DEFAULT (datetime('now')),
  analyzed_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_gait_analyses_patient ON gait_analyses(patient_id);
CREATE INDEX IF NOT EXISTS idx_gait_analyses_assessment ON gait_analyses(assessment_id);

-- Pain Assessments Table
CREATE TABLE IF NOT EXISTS pain_assessments (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  assessment_id TEXT,
  scale_used TEXT DEFAULT 'NRS', -- NRS, VAS, MPQ, etc.
  score REAL NOT NULL,
  location TEXT,
  characteristics TEXT, -- JSON array
  duration TEXT,
  aggravating_factors TEXT, -- JSON array
  relieving_factors TEXT, -- JSON array
  mechanical_pattern TEXT, -- flexion_intolerant, extension_intolerant, etc.
  red_flags TEXT, -- JSON array
  yellow_flags TEXT, -- JSON array
  transcript TEXT, -- Voice transcript if available
  assessed_at TEXT DEFAULT (datetime('now')),
  assessed_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_pain_assessments_patient ON pain_assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_pain_assessments_date ON pain_assessments(assessed_at);

-- Clinical Reasoning Records
CREATE TABLE IF NOT EXISTS clinical_reasoning (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  encounter_id TEXT,
  chief_complaint TEXT,
  clinical_picture TEXT, -- JSON: history, examination, tests
  differential_diagnosis TEXT, -- JSON array with probabilities
  working_diagnosis TEXT, -- JSON
  icd10_codes TEXT, -- JSON array
  clinical_reasoning_text TEXT,
  treatment_plan TEXT, -- JSON: immediate, short_term, long_term
  referrals TEXT, -- JSON array
  red_flags_identified TEXT, -- JSON array
  follow_up_plan TEXT,
  ai_assisted INTEGER DEFAULT 0,
  confidence_level TEXT, -- high, medium, low
  created_at TEXT DEFAULT (datetime('now')),
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_clinical_reasoning_patient ON clinical_reasoning(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_reasoning_date ON clinical_reasoning(created_at);

-- Telemedicine Sessions
CREATE TABLE IF NOT EXISTS telemedicine_sessions (
  id TEXT PRIMARY KEY,
  room_id TEXT UNIQUE NOT NULL,
  patient_id TEXT,
  provider_id TEXT,
  appointment_type TEXT,
  scheduled_time TEXT,
  actual_start_time TEXT,
  actual_end_time TEXT,
  duration_seconds INTEGER,
  status TEXT DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  recording_consent INTEGER DEFAULT 0,
  recording_url TEXT,
  joint_tracking_enabled INTEGER DEFAULT 0,
  joint_tracking_data TEXT, -- JSON
  chat_log TEXT, -- JSON array
  notes TEXT,
  hipaa_compliant INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_telemedicine_patient ON telemedicine_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_telemedicine_provider ON telemedicine_sessions(provider_id);
CREATE INDEX IF NOT EXISTS idx_telemedicine_status ON telemedicine_sessions(status);
CREATE INDEX IF NOT EXISTS idx_telemedicine_scheduled ON telemedicine_sessions(scheduled_time);

-- Patient Goals
CREATE TABLE IF NOT EXISTS patient_goals (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  goal_type TEXT, -- functional, pain, activity, sport
  description TEXT NOT NULL,
  target_value REAL,
  target_unit TEXT,
  baseline_value REAL,
  current_value REAL,
  progress_percent INTEGER DEFAULT 0,
  status TEXT DEFAULT 'in_progress', -- in_progress, achieved, not_achieved, revised
  target_date TEXT,
  achieved_date TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_patient_goals_patient ON patient_goals(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_goals_status ON patient_goals(status);
