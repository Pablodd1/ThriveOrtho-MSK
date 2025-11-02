-- Migration 0006: Add 3 Dummy Patients with Complete Data
-- Created: 2025-11-02
-- Purpose: Seed database with realistic patient data for testing

-- ============================================
-- PATIENT 1: Sarah Johnson - Post-Surgical Knee
-- ============================================

INSERT INTO patients (
  first_name, last_name, date_of_birth, gender, email, phone,
  address_line1, city, state, zip_code,
  emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
  primary_physician, insurance_provider, insurance_policy_number,
  assessment_reason, chief_complaint, pain_scale, activity_level,
  height_cm, weight_kg,
  medical_history, current_medications, allergies
) VALUES (
  'Sarah', 'Johnson', '1978-05-15', 'female', 'sarah.johnson@email.com', '555-0102',
  '456 Oak Avenue', 'Springfield', 'IL', '62701',
  'Michael Johnson', '555-0103', 'Spouse',
  'Dr. Emily Roberts', 'Blue Cross Blue Shield', 'BCBS-784521963',
  'post_surgery', 'Right knee pain and stiffness following total knee replacement 6 weeks ago. Difficulty with stairs and prolonged walking.', 6, 'light',
  165.0, 68.5,
  '{"surgeries": ["Total Knee Replacement (Right) - 6 weeks ago", "Appendectomy (2010)"], "chronic_conditions": ["Type 2 Diabetes (controlled)", "Hypertension"], "family_history": "Mother had osteoarthritis"}',
  '["Metformin 500mg twice daily", "Lisinopril 10mg daily", "Acetaminophen 500mg as needed for pain"]',
  '["Penicillin - causes rash", "Codeine - nausea"]'
);

-- Portal access for Sarah
INSERT INTO patient_portal_access (patient_id, portal_patient_id, last_name_hash, portal_enabled)
VALUES (
  (SELECT id FROM patients WHERE first_name = 'Sarah' AND last_name = 'Johnson'),
  'PT002',
  'johnson',
  1
);

-- ============================================
-- PATIENT 2: Robert Martinez - Chronic Lower Back Pain
-- ============================================

INSERT INTO patients (
  first_name, last_name, date_of_birth, gender, email, phone,
  address_line1, city, state, zip_code,
  emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
  primary_physician, insurance_provider, insurance_policy_number,
  assessment_reason, chief_complaint, pain_scale, activity_level,
  height_cm, weight_kg,
  medical_history, current_medications, allergies
) VALUES (
  'Robert', 'Martinez', '1965-09-22', 'male', 'r.martinez@email.com', '555-0104',
  '789 Pine Street', 'Austin', 'TX', '78701',
  'Maria Martinez', '555-0105', 'Wife',
  'Dr. James Chen', 'Medicare', 'MEDICARE-987654321',
  'chronic_pain', 'Chronic lower back pain for 3 years. Pain radiates to right leg. Worse with prolonged sitting or standing. History of L4-L5 disc bulge on MRI.', 7, 'sedentary',
  178.0, 92.3,
  '{"surgeries": [], "chronic_conditions": ["Lumbar Disc Disease L4-L5", "Obesity (BMI 29.1)", "Degenerative Disc Disease"], "family_history": "Father had spinal stenosis requiring surgery"}',
  '["Ibuprofen 400mg three times daily", "Gabapentin 300mg at bedtime", "Omeprazole 20mg daily for GERD"]',
  '["None known"]'
);

-- Portal access for Robert
INSERT INTO patient_portal_access (patient_id, portal_patient_id, last_name_hash, portal_enabled)
VALUES (
  (SELECT id FROM patients WHERE first_name = 'Robert' AND last_name = 'Martinez'),
  'PT003',
  'martinez',
  1
);

-- ============================================
-- PATIENT 3: Linda Chen - Shoulder Impingement
-- ============================================

INSERT INTO patients (
  first_name, last_name, date_of_birth, gender, email, phone,
  address_line1, city, state, zip_code,
  emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
  primary_physician, insurance_provider, insurance_policy_number,
  assessment_reason, chief_complaint, pain_scale, activity_level,
  height_cm, weight_kg,
  medical_history, current_medications, allergies
) VALUES (
  'Linda', 'Chen', '1982-12-08', 'female', 'linda.chen@email.com', '555-0106',
  '321 Maple Drive', 'Seattle', 'WA', '98101',
  'David Chen', '555-0107', 'Brother',
  'Dr. Susan Park', 'Aetna', 'AETNA-556677889',
  'chronic_pain', 'Left shoulder pain for 6 months. Sharp pain with overhead reaching. Difficulty sleeping on left side. Works as graphic designer with prolonged computer use.', 5, 'moderate',
  160.0, 58.0,
  '{"surgeries": [], "chronic_conditions": ["Subacromial Impingement Syndrome (Left)", "Forward Head Posture", "Upper Crossed Syndrome"], "family_history": "No significant musculoskeletal family history"}',
  '["Ibuprofen 200mg as needed", "Multivitamin daily"]',
  '["Sulfa drugs - severe allergic reaction"]'
);

-- Portal access for Linda
INSERT INTO patient_portal_access (patient_id, portal_patient_id, last_name_hash, portal_enabled)
VALUES (
  (SELECT id FROM patients WHERE first_name = 'Linda' AND last_name = 'Chen'),
  'PT004',
  'chen',
  1
);

-- ============================================
-- CREATE ACTIVE PRESCRIPTIONS FOR DUMMY PATIENTS
-- ============================================

-- Sarah Johnson's Prescription
INSERT INTO prescriptions (
  patient_id, clinician_id, program_name,
  program_goals, frequency_per_week, estimated_duration_minutes,
  start_date, status, clinician_notes, patient_instructions
)
SELECT 
  p.id, 1, 'Post-Surgical Knee Rehabilitation',
  '["Restore full knee range of motion", "Increase quadriceps strength", "Reduce pain and swelling", "Return to normal walking"]',
  5, 30,
  date('now', '-14 days'), 'active',
  'Patient is 6 weeks post-op TKR. Focus on ROM, quad strengthening, and gait training. Monitor for excessive swelling.',
  'Perform exercises 5 times per week. Apply ice after exercises. Avoid excessive pain during exercises.'
FROM patients p
WHERE p.first_name = 'Sarah' AND p.last_name = 'Johnson';

-- Prescribed exercises for Sarah (Knee focused)
INSERT INTO prescribed_exercises (prescription_id, exercise_id, sets, reps, frequency_per_week, clinical_reason, target_deficiency, status)
SELECT 
  (SELECT id FROM prescriptions WHERE program_name = 'Post-Surgical Knee Rehabilitation'),
  e.id, 3, 12, 5,
  'Strengthens quadriceps and improves knee extension',
  'Quadriceps weakness post-surgery',
  'active'
FROM exercises e
WHERE e.name = 'Leg Raises';

INSERT INTO prescribed_exercises (prescription_id, exercise_id, sets, reps, frequency_per_week, clinical_reason, target_deficiency, status)
SELECT 
  (SELECT id FROM prescriptions WHERE program_name = 'Post-Surgical Knee Rehabilitation'),
  e.id, 3, 10, 5,
  'Improves knee flexion and extension ROM',
  'Limited knee range of motion',
  'active'
FROM exercises e
WHERE e.name = 'Bodyweight Squats';

-- Robert Martinez's Prescription
INSERT INTO prescriptions (
  patient_id, clinician_id, program_name,
  program_goals, frequency_per_week, estimated_duration_minutes,
  start_date, status, clinician_notes, patient_instructions
)
SELECT 
  p.id, 1, 'Chronic Lower Back Pain Management',
  '["Reduce lower back pain", "Strengthen core musculature", "Improve flexibility", "Decrease leg radiation"]',
  4, 25,
  date('now', '-21 days'), 'active',
  'Patient has chronic L4-L5 disc bulge. Focus on core stability, hip mobility, and neural tension relief. Avoid excessive lumbar flexion.',
  'Perform exercises 4 times per week. Stop if leg pain increases. Use proper posture throughout the day.'
FROM patients p
WHERE p.first_name = 'Robert' AND p.last_name = 'Martinez';

-- Prescribed exercises for Robert (Core/Back focused)
INSERT INTO prescribed_exercises (prescription_id, exercise_id, sets, reps, hold_time, frequency_per_week, clinical_reason, target_deficiency, status)
SELECT 
  (SELECT id FROM prescriptions WHERE program_name = 'Chronic Lower Back Pain Management'),
  e.id, 3, NULL, 30, 4,
  'Strengthens core stabilizers to support lumbar spine',
  'Weak core musculature',
  'active'
FROM exercises e
WHERE e.name = 'Plank Hold';

INSERT INTO prescribed_exercises (prescription_id, exercise_id, sets, reps, frequency_per_week, clinical_reason, target_deficiency, status)
SELECT 
  (SELECT id FROM prescriptions WHERE program_name = 'Chronic Lower Back Pain Management'),
  e.id, 3, 15, 4,
  'Strengthens gluteal muscles to reduce back strain',
  'Weak hip extensors',
  'active'
FROM exercises e
WHERE e.name = 'Hip Bridges';

-- Linda Chen's Prescription  
INSERT INTO prescriptions (
  patient_id, clinician_id, program_name,
  program_goals, frequency_per_week, estimated_duration_minutes,
  start_date, status, clinician_notes, patient_instructions
)
SELECT 
  p.id, 1, 'Shoulder Impingement Rehabilitation',
  '["Eliminate shoulder pain with overhead activities", "Restore full shoulder ROM", "Correct scapular dyskinesis", "Improve posture"]',
  4, 20,
  date('now', '-7 days'), 'active',
  'Patient presents with left shoulder impingement and upper crossed syndrome. Focus on scapular stabilization, rotator cuff strengthening, and postural correction.',
  'Perform exercises 4 times per week. Take breaks from computer work every 30 minutes. Maintain good posture.'
FROM patients p
WHERE p.first_name = 'Linda' AND p.last_name = 'Chen';

-- Prescribed exercises for Linda (Shoulder focused)
INSERT INTO prescribed_exercises (prescription_id, exercise_id, sets, reps, frequency_per_week, clinical_reason, target_deficiency, status)
SELECT 
  (SELECT id FROM prescriptions WHERE program_name = 'Shoulder Impingement Rehabilitation'),
  e.id, 3, 12, 4,
  'Strengthens rotator cuff and improves shoulder mechanics',
  'Rotator cuff weakness',
  'active'
FROM exercises e
WHERE e.name = 'Shoulder Raises';

-- ============================================
-- ADD ACTIVITY LOGS FOR DUMMY PATIENTS
-- ============================================

-- Sarah Johnson activity logs (consistent user - 12 exercise completions over last 14 days)
-- Manual inserts for activity logs to avoid rowid ambiguity
INSERT INTO patient_activity_log (patient_id, prescribed_exercise_id, activity_type, exercise_name, sets_completed, reps_completed, pain_level, difficulty_rating, activity_date)
VALUES 
  ((SELECT p.id FROM patients p WHERE p.first_name = 'Sarah' AND p.last_name = 'Johnson'), 
   (SELECT pe.id FROM prescribed_exercises pe WHERE pe.prescription_id = (SELECT id FROM prescriptions WHERE program_name = 'Post-Surgical Knee Rehabilitation') AND pe.exercise_id = (SELECT id FROM exercises WHERE name = 'Leg Raises')),
   'exercise_complete', 'Leg Raises', 3, 12, 4, 3, date('now', '-1 days')),
  ((SELECT p.id FROM patients p WHERE p.first_name = 'Sarah' AND p.last_name = 'Johnson'), 
   (SELECT pe.id FROM prescribed_exercises pe WHERE pe.prescription_id = (SELECT id FROM prescriptions WHERE program_name = 'Post-Surgical Knee Rehabilitation') AND pe.exercise_id = (SELECT id FROM exercises WHERE name = 'Leg Raises')),
   'exercise_complete', 'Leg Raises', 3, 12, 4, 3, date('now', '-3 days')),
  ((SELECT p.id FROM patients p WHERE p.first_name = 'Sarah' AND p.last_name = 'Johnson'), 
   (SELECT pe.id FROM prescribed_exercises pe WHERE pe.prescription_id = (SELECT id FROM prescriptions WHERE program_name = 'Post-Surgical Knee Rehabilitation') AND pe.exercise_id = (SELECT id FROM exercises WHERE name = 'Leg Raises')),
   'exercise_complete', 'Leg Raises', 3, 12, 4, 3, date('now', '-5 days')),
  ((SELECT p.id FROM patients p WHERE p.first_name = 'Sarah' AND p.last_name = 'Johnson'), 
   (SELECT pe.id FROM prescribed_exercises pe WHERE pe.prescription_id = (SELECT id FROM prescriptions WHERE program_name = 'Post-Surgical Knee Rehabilitation') AND pe.exercise_id = (SELECT id FROM exercises WHERE name = 'Leg Raises')),
   'exercise_complete', 'Leg Raises', 3, 12, 3, 3, date('now', '-7 days')),
  ((SELECT p.id FROM patients p WHERE p.first_name = 'Sarah' AND p.last_name = 'Johnson'), 
   (SELECT pe.id FROM prescribed_exercises pe WHERE pe.prescription_id = (SELECT id FROM prescriptions WHERE program_name = 'Post-Surgical Knee Rehabilitation') AND pe.exercise_id = (SELECT id FROM exercises WHERE name = 'Leg Raises')),
   'exercise_complete', 'Leg Raises', 3, 12, 3, 2, date('now', '-9 days'));

-- Robert Martinez activity logs (inconsistent user - 5 completions over last 21 days)
INSERT INTO patient_activity_log (patient_id, prescribed_exercise_id, activity_type, exercise_name, sets_completed, reps_completed, pain_level, difficulty_rating, activity_date)
VALUES 
  ((SELECT p.id FROM patients p WHERE p.first_name = 'Robert' AND p.last_name = 'Martinez'), 
   (SELECT pe.id FROM prescribed_exercises pe WHERE pe.prescription_id = (SELECT id FROM prescriptions WHERE program_name = 'Chronic Lower Back Pain Management') AND pe.exercise_id = (SELECT id FROM exercises WHERE name = 'Plank Hold')),
   'exercise_complete', 'Plank Hold', 3, NULL, 6, 4, date('now', '-2 days')),
  ((SELECT p.id FROM patients p WHERE p.first_name = 'Robert' AND p.last_name = 'Martinez'), 
   (SELECT pe.id FROM prescribed_exercises pe WHERE pe.prescription_id = (SELECT id FROM prescriptions WHERE program_name = 'Chronic Lower Back Pain Management') AND pe.exercise_id = (SELECT id FROM exercises WHERE name = 'Plank Hold')),
   'exercise_complete', 'Plank Hold', 3, NULL, 7, 4, date('now', '-8 days')),
  ((SELECT p.id FROM patients p WHERE p.first_name = 'Robert' AND p.last_name = 'Martinez'), 
   (SELECT pe.id FROM prescribed_exercises pe WHERE pe.prescription_id = (SELECT id FROM prescriptions WHERE program_name = 'Chronic Lower Back Pain Management') AND pe.exercise_id = (SELECT id FROM exercises WHERE name = 'Plank Hold')),
   'exercise_complete', 'Plank Hold', 2, NULL, 7, 5, date('now', '-15 days'));

-- Linda Chen activity logs (new user - 3 completions over last 7 days)
INSERT INTO patient_activity_log (patient_id, prescribed_exercise_id, activity_type, exercise_name, sets_completed, reps_completed, pain_level, difficulty_rating, activity_date)
VALUES 
  ((SELECT p.id FROM patients p WHERE p.first_name = 'Linda' AND p.last_name = 'Chen'), 
   (SELECT pe.id FROM prescribed_exercises pe WHERE pe.prescription_id = (SELECT id FROM prescriptions WHERE program_name = 'Shoulder Impingement Rehabilitation') AND pe.exercise_id = (SELECT id FROM exercises WHERE name = 'Shoulder Raises')),
   'exercise_complete', 'Shoulder Raises', 3, 12, 5, 3, date('now', '-1 days')),
  ((SELECT p.id FROM patients p WHERE p.first_name = 'Linda' AND p.last_name = 'Chen'), 
   (SELECT pe.id FROM prescribed_exercises pe WHERE pe.prescription_id = (SELECT id FROM prescriptions WHERE program_name = 'Shoulder Impingement Rehabilitation') AND pe.exercise_id = (SELECT id FROM exercises WHERE name = 'Shoulder Raises')),
   'exercise_complete', 'Shoulder Raises', 3, 12, 4, 3, date('now', '-4 days'));

-- Add login activity for all dummy patients
INSERT INTO patient_activity_log (patient_id, activity_type, activity_date)
VALUES 
  ((SELECT id FROM patients WHERE first_name = 'Sarah' AND last_name = 'Johnson'), 'login', date('now', '-1 days')),
  ((SELECT id FROM patients WHERE first_name = 'Robert' AND last_name = 'Martinez'), 'login', date('now', '-2 days')),
  ((SELECT id FROM patients WHERE first_name = 'Linda' AND last_name = 'Chen'), 'login', date('now', '-1 days'));
