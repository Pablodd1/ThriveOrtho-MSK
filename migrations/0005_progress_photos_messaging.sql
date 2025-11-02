-- Migration 0005: Progress Photos and Messaging System
-- Adds support for photo uploads, patient messaging, and enhanced analytics

-- ============================================
-- PROGRESS_PHOTOS TABLE
-- ============================================
-- Stores patient progress photos (before/after, during treatment)
CREATE TABLE IF NOT EXISTS progress_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  
  -- Photo metadata
  photo_type TEXT NOT NULL CHECK(photo_type IN ('before', 'during', 'after', 'exercise_demo')),
  photo_category TEXT, -- 'posture', 'range_of_motion', 'mobility', 'injury_site', etc.
  
  -- Photo data (base64 encoded for Cloudflare Pages compatibility)
  photo_data TEXT NOT NULL, -- base64 encoded image
  photo_format TEXT NOT NULL DEFAULT 'jpeg', -- jpeg, png, webp
  thumbnail_data TEXT, -- smaller version for lists
  
  -- Context
  body_area TEXT, -- 'neck', 'shoulder', 'back', 'knee', etc.
  notes TEXT, -- Therapist or patient notes
  taken_by TEXT CHECK(taken_by IN ('patient', 'therapist')),
  
  -- Photo date (separate from created_at for backdating)
  photo_date DATE DEFAULT (date('now')),
  
  -- Related exercise (if applicable)
  exercise_id INTEGER,
  prescribed_exercise_id INTEGER,
  
  -- Privacy and visibility
  visible_to_patient INTEGER DEFAULT 1, -- Boolean
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE SET NULL,
  FOREIGN KEY (prescribed_exercise_id) REFERENCES prescribed_exercises(id) ON DELETE SET NULL
);

-- Index for fast patient photo lookups
CREATE INDEX IF NOT EXISTS idx_progress_photos_patient 
  ON progress_photos(patient_id, photo_date DESC);

-- Index for photo type filtering
CREATE INDEX IF NOT EXISTS idx_progress_photos_type 
  ON progress_photos(patient_id, photo_type);

-- ============================================
-- PATIENT_MESSAGES TABLE
-- ============================================
-- Two-way messaging between patients and therapists
CREATE TABLE IF NOT EXISTS patient_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  clinician_id INTEGER NOT NULL,
  
  -- Message content
  sender_type TEXT NOT NULL CHECK(sender_type IN ('patient', 'therapist')),
  message_text TEXT NOT NULL,
  message_subject TEXT,
  
  -- Message status
  is_read INTEGER DEFAULT 0, -- Boolean
  read_at DATETIME,
  is_priority INTEGER DEFAULT 0, -- Boolean: urgent message
  
  -- Thread management (for conversation grouping)
  parent_message_id INTEGER, -- NULL for top-level messages
  thread_id INTEGER, -- Groups related messages
  
  -- Timestamps
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (clinician_id) REFERENCES clinicians(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_message_id) REFERENCES patient_messages(id) ON DELETE CASCADE
);

-- Index for message retrieval
CREATE INDEX IF NOT EXISTS idx_patient_messages_patient 
  ON patient_messages(patient_id, sent_at DESC);

-- Index for clinician inbox
CREATE INDEX IF NOT EXISTS idx_patient_messages_clinician 
  ON patient_messages(clinician_id, is_read, sent_at DESC);

-- Index for threads
CREATE INDEX IF NOT EXISTS idx_patient_messages_thread 
  ON patient_messages(thread_id, sent_at);

-- ============================================
-- APPOINTMENT_REMINDERS TABLE
-- ============================================
-- Scheduled appointments and reminders
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  clinician_id INTEGER NOT NULL,
  
  -- Appointment details
  appointment_type TEXT NOT NULL CHECK(appointment_type IN (
    'initial_evaluation', 'follow_up', 'discharge', 'reassessment', 'telehealth'
  )),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  
  -- Location
  location_type TEXT CHECK(location_type IN ('home', 'car', 'clinic', 'telehealth')),
  location_address TEXT,
  
  -- Status
  status TEXT DEFAULT 'scheduled' CHECK(status IN (
    'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled'
  )),
  
  -- Reminders
  reminder_sent INTEGER DEFAULT 0, -- Boolean
  reminder_sent_at DATETIME,
  reminder_24h_sent INTEGER DEFAULT 0, -- 24 hour reminder
  reminder_1h_sent INTEGER DEFAULT 0, -- 1 hour reminder
  
  -- Notes
  notes TEXT,
  cancellation_reason TEXT,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (clinician_id) REFERENCES clinicians(id) ON DELETE CASCADE
);

-- Index for upcoming appointments
CREATE INDEX IF NOT EXISTS idx_appointments_upcoming 
  ON appointments(appointment_date, appointment_time) 
  WHERE status IN ('scheduled', 'confirmed');

-- Index for patient appointments
CREATE INDEX IF NOT EXISTS idx_appointments_patient 
  ON appointments(patient_id, appointment_date DESC);

-- Index for clinician schedule
CREATE INDEX IF NOT EXISTS idx_appointments_clinician 
  ON appointments(clinician_id, appointment_date, appointment_time);

-- ============================================
-- PATIENT_GOALS TABLE
-- ============================================
-- Treatment goals and milestones tracking
CREATE TABLE IF NOT EXISTS patient_goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  prescription_id INTEGER,
  
  -- Goal definition
  goal_type TEXT CHECK(goal_type IN (
    'pain_reduction', 'rom_improvement', 'strength_gain', 
    'function_restoration', 'independence', 'return_to_sport'
  )),
  goal_description TEXT NOT NULL,
  
  -- Measurement
  baseline_value TEXT, -- Initial measurement
  target_value TEXT, -- Goal target
  current_value TEXT, -- Current progress
  measurement_unit TEXT, -- 'degrees', 'reps', 'pain_scale', 'distance', etc.
  
  -- Timeline
  target_date DATE,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'achieved', 'modified', 'cancelled')),
  achievement_date DATE,
  
  -- Progress tracking
  progress_percentage INTEGER DEFAULT 0 CHECK(progress_percentage BETWEEN 0 AND 100),
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE SET NULL
);

-- Index for active goals
CREATE INDEX IF NOT EXISTS idx_patient_goals_active 
  ON patient_goals(patient_id, status, target_date);

-- ============================================
-- ANALYTICS VIEWS
-- ============================================

-- View: Patient engagement metrics
CREATE VIEW IF NOT EXISTS vw_patient_engagement AS
SELECT 
  p.id as patient_id,
  p.first_name || ' ' || p.last_name as patient_name,
  
  -- Login activity
  ppa.last_login,
  ppa.login_count,
  
  -- Exercise completion stats (last 30 days)
  COUNT(CASE 
    WHEN pal.activity_type = 'exercise_complete' 
    AND pal.activity_date >= DATE('now', '-30 days')
    THEN 1 
  END) as exercises_completed_30d,
  
  -- Current streak
  (
    SELECT COUNT(DISTINCT DATE(activity_date))
    FROM patient_activity_log
    WHERE patient_id = p.id 
      AND activity_type = 'exercise_complete'
      AND activity_date >= DATE('now', '-7 days')
  ) as days_active_7d,
  
  -- Average pain level (last 30 days)
  ROUND(AVG(CASE 
    WHEN pal.activity_type = 'exercise_complete' 
    AND pal.pain_level IS NOT NULL
    AND pal.activity_date >= DATE('now', '-30 days')
    THEN pal.pain_level 
  END), 1) as avg_pain_30d,
  
  -- Photos uploaded
  (SELECT COUNT(*) FROM progress_photos WHERE patient_id = p.id) as total_photos,
  
  -- Messages sent
  (SELECT COUNT(*) FROM patient_messages WHERE patient_id = p.id AND sender_type = 'patient') as messages_sent,
  
  -- Unread messages
  (SELECT COUNT(*) FROM patient_messages WHERE patient_id = p.id AND sender_type = 'therapist' AND is_read = 0) as unread_messages

FROM patients p
LEFT JOIN patient_portal_access ppa ON p.id = ppa.patient_id
LEFT JOIN patient_activity_log pal ON p.id = pal.patient_id
GROUP BY p.id, p.first_name, p.last_name, ppa.last_login, ppa.login_count;

-- View: Clinician dashboard summary
CREATE VIEW IF NOT EXISTS vw_clinician_dashboard AS
SELECT 
  c.id as clinician_id,
  c.first_name || ' ' || c.last_name as clinician_name,
  
  -- Active patients
  COUNT(DISTINCT p.id) as total_active_patients,
  
  -- Prescriptions
  COUNT(DISTINCT pr.id) as active_prescriptions,
  
  -- Upcoming appointments today
  (
    SELECT COUNT(*)
    FROM appointments
    WHERE clinician_id = c.id
      AND appointment_date = DATE('now')
      AND status IN ('scheduled', 'confirmed')
  ) as appointments_today,
  
  -- Unread messages
  (
    SELECT COUNT(*)
    FROM patient_messages
    WHERE clinician_id = c.id
      AND sender_type = 'patient'
      AND is_read = 0
  ) as unread_messages,
  
  -- Patients needing attention (no activity in 7 days)
  (
    SELECT COUNT(DISTINCT p2.id)
    FROM patients p2
    JOIN prescriptions pr2 ON p2.id = pr2.patient_id
    WHERE pr2.clinician_id = c.id
      AND pr2.status = 'active'
      AND p2.id NOT IN (
        SELECT DISTINCT patient_id 
        FROM patient_activity_log
        WHERE activity_date >= DATE('now', '-7 days')
      )
  ) as patients_needing_attention

FROM clinicians c
LEFT JOIN prescriptions pr ON c.id = pr.clinician_id AND pr.status = 'active'
LEFT JOIN patients p ON pr.patient_id = p.id
GROUP BY c.id, c.first_name, c.last_name;

-- View: Exercise effectiveness tracking
CREATE VIEW IF NOT EXISTS vw_exercise_effectiveness AS
SELECT 
  e.id as exercise_id,
  e.name as exercise_name,
  e.category,
  
  -- Usage stats
  COUNT(DISTINCT pe.id) as times_prescribed,
  COUNT(DISTINCT pe.prescription_id) as prescriptions_count,
  
  -- Completion stats
  COUNT(CASE WHEN pal.activity_type = 'exercise_complete' THEN 1 END) as total_completions,
  
  -- Average ratings
  ROUND(AVG(pal.difficulty_rating), 1) as avg_difficulty,
  ROUND(AVG(pal.pain_level), 1) as avg_pain_during,
  
  -- Effectiveness score (lower pain + moderate difficulty = more effective)
  ROUND(
    (5 - COALESCE(AVG(pal.pain_level), 5)) * 10 + 
    (3 - ABS(3 - COALESCE(AVG(pal.difficulty_rating), 3))) * 5
  , 1) as effectiveness_score

FROM exercises e
LEFT JOIN prescribed_exercises pe ON e.id = pe.exercise_id
LEFT JOIN patient_activity_log pal ON e.name = pal.exercise_name
GROUP BY e.id, e.name, e.category;

-- ============================================
-- SEED DATA FOR TESTING
-- ============================================

-- Add a sample progress photo for demo patient
INSERT INTO progress_photos (
  patient_id,
  photo_type,
  photo_category,
  photo_data,
  photo_format,
  body_area,
  notes,
  taken_by,
  photo_date,
  visible_to_patient
)
SELECT 
  p.id,
  'before',
  'posture',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CRUZPUkUgUEhPVE88L3RleHQ+PC9zdmc+',
  'svg',
  'back',
  'Initial assessment - limited ROM in thoracic spine',
  'therapist',
  DATE('now', '-30 days'),
  1
FROM patients p
WHERE p.email = 'john.smith@demo.com'
LIMIT 1;

-- Add sample messages for demo patient
INSERT INTO patient_messages (
  patient_id,
  clinician_id,
  sender_type,
  message_subject,
  message_text,
  is_read,
  thread_id
)
SELECT 
  p.id,
  pr.clinician_id,
  'therapist',
  'Welcome to Your Exercise Program',
  'Hi John! Welcome to your personalized exercise program. I''ve assigned 6 exercises for you to complete 3x per week. Please let me know if you have any questions or concerns about the exercises. Remember to track your pain levels after each session.',
  1,
  1
FROM patients p
JOIN prescriptions pr ON p.id = pr.patient_id
WHERE p.email = 'john.smith@demo.com'
  AND pr.status = 'active'
LIMIT 1;

-- Patient response
INSERT INTO patient_messages (
  patient_id,
  clinician_id,
  sender_type,
  message_subject,
  message_text,
  is_read,
  parent_message_id,
  thread_id
)
SELECT 
  p.id,
  pr.clinician_id,
  'patient',
  'Re: Welcome to Your Exercise Program',
  'Thanks! I completed my first session today. The neck stretches felt really good, but I had some difficulty with the shoulder exercises. Should I continue or modify them?',
  0,
  (SELECT id FROM patient_messages LIMIT 1),
  1
FROM patients p
JOIN prescriptions pr ON p.id = pr.patient_id
WHERE p.email = 'john.smith@demo.com'
  AND pr.status = 'active'
LIMIT 1;

-- Add sample appointment for demo patient
INSERT INTO appointments (
  patient_id,
  clinician_id,
  appointment_type,
  appointment_date,
  appointment_time,
  duration_minutes,
  location_type,
  location_address,
  status,
  notes
)
SELECT 
  p.id,
  pr.clinician_id,
  'follow_up',
  DATE('now', '+3 days'),
  '10:00',
  60,
  'home',
  '123 Main St, Springfield',
  'scheduled',
  'Follow-up assessment after 2 weeks of HEP'
FROM patients p
JOIN prescriptions pr ON p.id = pr.patient_id
WHERE p.email = 'john.smith@demo.com'
  AND pr.status = 'active'
LIMIT 1;

-- Add sample goals for demo patient
INSERT INTO patient_goals (
  patient_id,
  prescription_id,
  goal_type,
  goal_description,
  baseline_value,
  target_value,
  current_value,
  measurement_unit,
  target_date,
  status,
  progress_percentage
)
SELECT 
  p.id,
  pr.id,
  'pain_reduction',
  'Reduce neck pain from 7/10 to 3/10 or below',
  '7',
  '3',
  '5',
  'pain_scale',
  DATE('now', '+30 days'),
  'active',
  50
FROM patients p
JOIN prescriptions pr ON p.id = pr.patient_id
WHERE p.email = 'john.smith@demo.com'
  AND pr.status = 'active'
LIMIT 1;

INSERT INTO patient_goals (
  patient_id,
  prescription_id,
  goal_type,
  goal_description,
  baseline_value,
  target_value,
  current_value,
  measurement_unit,
  target_date,
  status,
  progress_percentage
)
SELECT 
  p.id,
  pr.id,
  'rom_improvement',
  'Improve shoulder flexion ROM from 120° to 160°',
  '120',
  '160',
  '140',
  'degrees',
  DATE('now', '+45 days'),
  'active',
  50
FROM patients p
JOIN prescriptions pr ON p.id = pr.patient_id
WHERE p.email = 'john.smith@demo.com'
  AND pr.status = 'active'
LIMIT 1;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Tables created: 5 (progress_photos, patient_messages, appointments, patient_goals, + analytics views)
-- Views created: 3 (vw_patient_engagement, vw_clinician_dashboard, vw_exercise_effectiveness)
-- Sample data: Photos, messages, appointments, and goals for demo patient
