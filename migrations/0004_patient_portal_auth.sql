-- Migration 0004: Patient Portal Authentication Tables
-- Adds support for patient portal login and session management

-- ============================================
-- PATIENT_PORTAL_ACCESS TABLE
-- ============================================
-- Stores patient portal access credentials and permissions
CREATE TABLE IF NOT EXISTS patient_portal_access (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL UNIQUE,
  
  -- Authentication (simple for demo, use proper auth in production)
  portal_patient_id TEXT UNIQUE NOT NULL, -- e.g., "DEMO001", "PT2024-001"
  last_name_hash TEXT NOT NULL, -- For verification
  
  -- Permissions
  portal_enabled INTEGER DEFAULT 1, -- Boolean: can access portal
  can_view_exercises INTEGER DEFAULT 1,
  can_mark_complete INTEGER DEFAULT 1,
  can_view_progress INTEGER DEFAULT 1,
  
  -- Session management
  last_login DATETIME,
  login_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- ============================================
-- PATIENT_ACTIVITY_LOG TABLE
-- ============================================
-- Tracks patient exercise completions from portal
CREATE TABLE IF NOT EXISTS patient_activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  prescribed_exercise_id INTEGER,
  
  activity_type TEXT NOT NULL, -- 'login', 'exercise_view', 'exercise_complete', 'logout'
  activity_date DATE DEFAULT (date('now')),
  activity_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Context
  exercise_name TEXT,
  sets_completed INTEGER,
  reps_completed INTEGER,
  duration_seconds INTEGER,
  
  -- Patient feedback
  pain_level INTEGER CHECK(pain_level BETWEEN 0 AND 10),
  difficulty_rating INTEGER CHECK(difficulty_rating BETWEEN 1 AND 5),
  notes TEXT,
  
  -- Device info
  device_type TEXT, -- 'mobile', 'tablet', 'desktop'
  browser TEXT,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (prescribed_exercise_id) REFERENCES prescribed_exercises(id) ON DELETE SET NULL
);

-- ============================================
-- PATIENT_BOOKMARKS TABLE
-- ============================================
-- Stores patient's bookmarked exercises from library
CREATE TABLE IF NOT EXISTS patient_bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  exercise_id INTEGER NOT NULL,
  
  bookmarked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  
  UNIQUE(patient_id, exercise_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_patient_portal_access_portal_id ON patient_portal_access(portal_patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_activity_log_patient_id ON patient_activity_log(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_activity_log_date ON patient_activity_log(activity_date);
CREATE INDEX IF NOT EXISTS idx_patient_bookmarks_patient_id ON patient_bookmarks(patient_id);

-- ============================================
-- SEED: Demo Patient with Portal Access
-- ============================================

-- Insert demo patient
INSERT INTO patients (
  first_name, 
  last_name, 
  date_of_birth, 
  gender, 
  email, 
  phone,
  assessment_reason,
  chief_complaint,
  pain_scale,
  activity_level
) VALUES (
  'John',
  'Smith',
  '1960-05-15',
  'male',
  'john.smith@demo.com',
  '555-0100',
  'chronic_pain',
  'Lower back pain with limited mobility',
  6,
  'light'
);

-- Create portal access for demo patient (patient_id will be 1 if first patient)
INSERT INTO patient_portal_access (
  patient_id,
  portal_patient_id,
  last_name_hash,
  portal_enabled
) VALUES (
  (SELECT id FROM patients WHERE email = 'john.smith@demo.com'),
  'DEMO001',
  'smith', -- In production, use proper hashing
  1
);

-- Create a prescription for the demo patient
INSERT INTO prescriptions (
  patient_id,
  clinician_id,
  program_name,
  program_goals,
  frequency_per_week,
  estimated_duration_minutes,
  status,
  patient_instructions
) VALUES (
  (SELECT id FROM patients WHERE email = 'john.smith@demo.com'),
  1, -- Default clinician
  'Low Back Pain Rehabilitation Program',
  '["Reduce pain", "Improve core strength", "Increase flexibility", "Return to daily activities"]',
  3,
  30,
  'active',
  'Complete these exercises 3 times per week. Start gently and gradually increase intensity. Stop if you experience sharp pain. Track your progress daily in the portal.'
);

-- Prescribe exercises to the demo patient (assuming exercises exist from seed)
-- We'll prescribe 6 exercises: Pelvic Tilts, Bird Dogs, Dead Bugs, Cat-Cow, Knee to Chest, Child's Pose
INSERT INTO prescribed_exercises (
  prescription_id,
  exercise_id,
  sets,
  reps,
  frequency_per_week,
  clinical_reason,
  target_deficiency,
  status
) 
SELECT 
  (SELECT id FROM prescriptions WHERE patient_id = (SELECT id FROM patients WHERE email = 'john.smith@demo.com')),
  e.id,
  CASE e.name
    WHEN 'Pelvic Tilts' THEN 3
    WHEN 'Bird Dogs' THEN 3
    WHEN 'Dead Bugs' THEN 3
    WHEN 'Cat-Cow Stretch' THEN 2
    WHEN 'Knee to Chest' THEN 3
    WHEN 'Standing Hamstring Stretch' THEN 2
  END as sets,
  CASE e.name
    WHEN 'Pelvic Tilts' THEN 10
    WHEN 'Bird Dogs' THEN 10
    WHEN 'Dead Bugs' THEN 12
    WHEN 'Cat-Cow Stretch' THEN 15
    WHEN 'Knee to Chest' THEN 10
    WHEN 'Standing Hamstring Stretch' THEN 1
  END as reps,
  3 as frequency_per_week,
  CASE e.name
    WHEN 'Pelvic Tilts' THEN 'Strengthen core and improve pelvic mobility'
    WHEN 'Bird Dogs' THEN 'Improve core stability and coordination'
    WHEN 'Dead Bugs' THEN 'Strengthen abdominals and stabilize spine'
    WHEN 'Cat-Cow Stretch' THEN 'Increase spinal mobility and reduce tension'
    WHEN 'Knee to Chest' THEN 'Stretch lower back and hip flexors'
    WHEN 'Standing Hamstring Stretch' THEN 'Improve leg flexibility and reduce back strain'
  END as clinical_reason,
  CASE e.name
    WHEN 'Pelvic Tilts' THEN 'Core weakness, Limited pelvic mobility'
    WHEN 'Bird Dogs' THEN 'Core instability, Poor coordination'
    WHEN 'Dead Bugs' THEN 'Weak abdominals, Spine instability'
    WHEN 'Cat-Cow Stretch' THEN 'Spinal stiffness, Limited flexibility'
    WHEN 'Knee to Chest' THEN 'Lower back tightness, Hip flexor restriction'
    WHEN 'Standing Hamstring Stretch' THEN 'Hamstring tightness, Limited ROM'
  END as target_deficiency,
  'active'
FROM exercises e
WHERE e.name IN (
  'Pelvic Tilts',
  'Bird Dogs',
  'Dead Bugs',
  'Cat-Cow Stretch',
  'Knee to Chest',
  'Standing Hamstring Stretch'
)
LIMIT 6;

-- ============================================
-- VIEWS for Easy Queries
-- ============================================

-- View: Patient's Active Exercises
CREATE VIEW IF NOT EXISTS vw_patient_active_exercises AS
SELECT 
  p.id as patient_id,
  p.first_name,
  p.last_name,
  pr.id as prescription_id,
  pr.program_name,
  e.id as exercise_id,
  e.name as exercise_name,
  e.category,
  e.description,
  e.instructions,
  e.video_url,
  e.difficulty_level,
  pe.id as prescribed_exercise_id,
  pe.sets,
  pe.reps,
  pe.hold_time,
  pe.frequency_per_week,
  pe.clinical_reason,
  pe.target_deficiency
FROM patients p
JOIN prescriptions pr ON p.id = pr.patient_id
JOIN prescribed_exercises pe ON pr.id = pe.prescription_id
JOIN exercises e ON pe.exercise_id = e.id
WHERE pr.status = 'active'
  AND pe.status = 'active';

-- View: Patient Progress Summary
CREATE VIEW IF NOT EXISTS vw_patient_progress_summary AS
SELECT 
  p.id as patient_id,
  p.first_name,
  p.last_name,
  COUNT(DISTINCT pal.activity_date) as active_days,
  COUNT(CASE WHEN pal.activity_type = 'exercise_complete' THEN 1 END) as total_completions,
  MAX(pal.activity_date) as last_activity_date,
  COUNT(DISTINCT CASE WHEN pal.activity_date >= date('now', '-7 days') THEN pal.activity_date END) as active_days_last_week
FROM patients p
LEFT JOIN patient_activity_log pal ON p.id = pal.patient_id
GROUP BY p.id, p.first_name, p.last_name;
