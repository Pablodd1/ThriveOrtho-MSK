-- ============================================================
-- DEMO PATIENT SEED DATA - Complete Patient Journey
-- ThriveOrtho MVP Demonstration
-- Patient: Sarah Mitchell (Demo Patient)
-- ============================================================

-- 1. DEMO PATIENT PROFILE
INSERT INTO patients (
  id, name, email, phone, date_of_birth, gender, 
  address, emergency_contact, emergency_phone,
  medical_history, current_medications, allergies,
  primary_complaint, occupation, activity_level,
  created_at, updated_at
) VALUES (
  999,
  'Sarah Mitchell',
  'sarah.mitchell.demo@thriveortho.com',
  '(555) 123-4567',
  '1988-03-15',
  'female',
  '123 Demo Street, San Francisco, CA 94102',
  'John Mitchell (Spouse)',
  '(555) 987-6543',
  'Previous ACL reconstruction (right knee, 2019). History of lower back pain (2017-2018, resolved). No chronic conditions.',
  'None',
  'None known',
  'Right knee pain and instability after returning to running. Occasional lower back stiffness.',
  'Software Engineer (Sedentary)',
  'Active (Running 3-4x/week, Yoga 2x/week)',
  datetime('now', '-90 days'),
  datetime('now')
);

-- 2. INITIAL INTAKE ASSESSMENT
INSERT INTO assessments (
  id, patient_id, assessment_type, assessment_date,
  chief_complaint, pain_level, pain_location, pain_quality,
  onset, aggravating_factors, alleviating_factors,
  previous_treatment, goals,
  created_at
) VALUES (
  9991,
  999,
  'Initial Evaluation',
  datetime('now', '-90 days'),
  'Right knee pain and instability post-ACL reconstruction. Patient wants to return to competitive 10K running.',
  6,
  '["right_knee_anterior", "right_knee_medial", "lower_back_central"]',
  'Sharp pain with running, dull ache at rest. Knee feels unstable on uneven surfaces.',
  'Gradual onset over 3 months. Started when returning to running after ACL rehab.',
  'Running downhill, jumping, pivoting movements, prolonged sitting (>2 hours)',
  'Ice, rest, NSAIDs (temporary relief), gentle stretching',
  'PT after ACL surgery (6 months, completed 2020). Chiropractor for lower back (2018).',
  '["Return to running 5K by 6 weeks", "Complete 10K race in 12 weeks", "Improve knee stability", "Reduce pain to 2/10 or less"]',
  datetime('now', '-90 days')
);

-- 3. FMS ASSESSMENT (Score: 13/21 - Elevated Injury Risk)
INSERT INTO fms_assessments (
  id, patient_id, assessment_date, assessor_name,
  
  -- Test Scores (0-3 each)
  deep_squat_score, deep_squat_notes,
  hurdle_step_left, hurdle_step_right, hurdle_step_notes,
  inline_lunge_left, inline_lunge_right, inline_lunge_notes,
  shoulder_mobility_left, shoulder_mobility_right, shoulder_mobility_clearing,
  leg_raise_left, leg_raise_right, leg_raise_notes,
  push_up_score, push_up_clearing,
  rotary_stability_left, rotary_stability_right, rotary_stability_clearing,
  
  -- Calculated Results
  total_score, lowest_score, asymmetry_count,
  injury_risk_level, injury_risk_score,
  
  -- Recommendations
  recommendations, corrective_exercises,
  
  created_at
) VALUES (
  9991,
  999,
  datetime('now', '-90 days'),
  'Dr. Emily Rodriguez, PT, DPT',
  
  -- Scores
  2, 'Unable to achieve full depth without heel lift. Compensates with forward trunk lean.',
  2, 1, 'Right side shows decreased stability. Left normal. Significant asymmetry detected.',
  2, 1, 'Right knee pain at bottom of lunge. Decreased knee flexion ROM on right.',
  3, 3, 0,
  2, 2, 'Hamstring tightness bilateral. Within functional range.',
  2, 0,
  2, 2, 0,
  
  -- Calculated
  13, 1, 2,
  'elevated', 65,
  
  -- Recommendations
  '["Corrective exercise program recommended (8-12 weeks)", "Focus on right knee stability and strength", "Address bilateral asymmetries", "Retest after 6 weeks of corrective work", "Medical clearance recommended before return to running"]',
  '["Single-leg balance progressions (right emphasis)", "Split squats (right leg focus)", "Hip strengthening (glute med, glute max)", "Ankle mobility drills", "Core anti-rotation exercises", "Hamstring stretching protocol"]',
  
  datetime('now', '-90 days')
);

-- 4. VISUAL ASSESSMENT - SQUAT ANALYSIS
INSERT INTO visual_assessments (
  id, patient_id, assessment_date, movement_type,
  duration_seconds, total_frames, pose_detections,
  
  -- Biomechanical Analysis
  rom_data, symmetry_data, velocity_data,
  compensation_patterns, quality_score,
  
  -- AI Analysis Results
  injury_risk_factors, injury_risk_score, injury_predictions,
  form_corrections, exercise_recommendations,
  
  -- Raw Data (compressed)
  pose_data_summary,
  
  created_at
) VALUES (
  9991,
  999,
  datetime('now', '-90 days'),
  'Squat Assessment',
  45,
  1350,
  1342,
  
  -- ROM Data
  '{"left_knee": {"min": 15, "max": 112, "avg": 65}, "right_knee": {"min": 15, "max": 98, "avg": 58}, "left_hip": {"min": 10, "max": 95, "avg": 52}, "right_hip": {"min": 10, "max": 88, "avg": 48}}',
  
  -- Symmetry Data
  '{"knee_flexion": {"left": 112, "right": 98, "difference": 14, "symmetry_index": 0.875}, "hip_flexion": {"left": 95, "right": 88, "difference": 7, "symmetry_index": 0.926}}',
  
  -- Velocity Data
  '{"descent_avg": 0.85, "ascent_avg": 0.92, "consistency": 0.88}',
  
  -- Compensation Patterns
  '["Right knee valgus collapse during descent", "Forward trunk lean to compensate for limited ankle dorsiflexion", "Weight shift to left side", "Decreased depth on right side", "Early fatigue after 8 reps"]',
  
  72,
  
  -- AI Injury Risk
  '["Knee valgus collapse (right)", "Bilateral asymmetry >10%", "Reduced ROM right knee", "Weak glute medius (right)", "Limited ankle dorsiflexion", "Core stability deficit", "Hamstring tightness"]',
  68,
  '{"acl_reinjury": 0.65, "patellofemoral_pain": 0.72, "lower_back_strain": 0.45}',
  
  -- Form Corrections
  '["Push knees out during descent", "Keep weight centered", "Improve ankle mobility before depth", "Activate glutes before movement", "Engage core throughout"]',
  
  -- Exercise Recommendations
  '["Banded clamshells (glute med)", "Single-leg balance progressions", "Ankle dorsiflexion stretches", "Box squats (controlled depth)", "Dead bugs (core stability)"]',
  
  -- Pose Data Summary
  '{"key_frames": [0, 450, 900, 1350], "min_landmarks": 33, "avg_confidence": 0.94}',
  
  datetime('now', '-90 days')
);

-- 5. SOAP NOTE - INITIAL EVALUATION
INSERT INTO soap_notes (
  id, patient_id, visit_date, provider_name,
  
  subjective, objective, assessment, plan,
  
  -- ICD-10 Codes
  icd10_codes,
  
  -- CPT Codes
  cpt_codes,
  
  -- Goals
  short_term_goals, long_term_goals,
  
  created_at
) VALUES (
  9991,
  999,
  datetime('now', '-90 days'),
  'Dr. Emily Rodriguez, PT, DPT',
  
  -- Subjective
  'Patient is a 36-year-old female software engineer presenting with right knee pain and instability. Reports gradual onset over 3 months after returning to running post-ACL reconstruction (2019). Pain 6/10 with running, 3/10 at rest. Describes sharp anterior knee pain with downhill running and instability on uneven surfaces. Denies locking or giving way. Also reports lower back stiffness after prolonged sitting. Goals: Return to 5K running in 6 weeks, complete 10K race in 12 weeks. Patient motivated and compliant.',
  
  -- Objective
  'OBSERVATION: Mild right knee swelling. Gait shows decreased stance phase on right, shortened stride length. FMS Score: 13/21 (elevated injury risk). Significant asymmetries in hurdle step (L:2, R:1) and inline lunge (L:2, R:1).

PALPATION: Tenderness medial joint line right knee. No effusion. Mild tightness bilateral hamstrings.

ROM: Right knee flexion 0-125° (limited by pain last 10°), extension 0°. Left knee flexion 0-140°, extension 0°. Hip flexion bilateral 95° (tight), ankle dorsiflexion right 5° (limited), left 10°.

STRENGTH (MMT): Hip abduction R: 3+/5, L: 4/5. Hip extension R: 4-/5, L: 4+/5. Knee extension R: 4/5, L: 5/5. Core strength: 3/5.

SPECIAL TESTS: Anterior drawer negative. Lachman negative. McMurray positive for medial meniscus (right). Valgus stress test mild laxity. Single leg squat shows significant valgus collapse right knee.

BALANCE: Single leg stance right 12 seconds (eyes open), left 30+ seconds. Star Excursion Balance Test: Right anterior reach 78% of height (decreased), left 95% (normal).

VISUAL ASSESSMENT: Squat analysis shows 14° asymmetry in knee flexion ROM, right knee valgus collapse, weight shift to left, compensatory forward trunk lean.',
  
  -- Assessment
  'Patient presents with right knee pain and functional instability post-ACL reconstruction, likely related to persistent strength deficits, particularly gluteus medius weakness, and movement pattern dysfunction. FMS score of 13/21 indicates elevated injury risk. McMurray positive suggests possible medial meniscus involvement. Significant asymmetries in strength, ROM, and movement quality. Current activity level exceeds tissue capacity. Prognosis good for return to running with structured rehabilitation program focused on strength, stability, and movement retraining. Estimated 8-12 weeks to meet functional goals.',
  
  -- Plan
  'FREQUENCY: 2x/week PT for 8 weeks, then 1x/week for 4 weeks. Home exercise program daily.

TREATMENT INTERVENTIONS:
1. Manual therapy: Soft tissue mobilization hamstrings, quadriceps, IT band; Joint mobilization ankle dorsiflexion
2. Therapeutic exercise: Progressive strengthening (glute med, glute max, quadriceps), single-leg stability exercises, core strengthening
3. Neuromuscular re-education: Single-leg squat training, gait training, plyometric progression
4. Modalities: Ice post-treatment, KT tape for patellar tracking

HOME PROGRAM:
- Clamshells 3x20 daily
- Single-leg balance 3x30sec each side
- Ankle mobility exercises 2x daily
- Dead bugs 3x10 daily
- Ice after activity 15-20 min

PATIENT EDUCATION: Activity modification (avoid running until week 6), proper warm-up protocol, pain monitoring (keep <3/10)

GOALS:
- 4 weeks: Reduce pain to 2/10, improve hip abduction strength to 4+/5, single leg squat without valgus
- 8 weeks: Pain-free daily activities, initiate walk-run program, FMS retest >14/21
- 12 weeks: Complete 5K run pain-free, clear for 10K training program

FOLLOW-UP: Reassess in 2 weeks. Consider MRI if no improvement in 4 weeks (rule out meniscus tear). Physician consult if persistent symptoms.',
  
  -- ICD-10 Codes
  '["M25.561 - Pain in right knee", "M25.361 - Other instability, right knee", "M23.201 - Derangement of unspecified medial meniscus, right knee", "M62.81 - Muscle weakness (generalized)", "M54.5 - Low back pain", "Z96.651 - Presence of right artificial knee joint"]',
  
  -- CPT Codes
  '["97163 - PT evaluation (high complexity)", "97110 - Therapeutic exercise (3 units)", "97112 - Neuromuscular re-education (2 units)", "97140 - Manual therapy (2 units)", "97530 - Therapeutic activities (2 units)"]',
  
  -- Goals
  '["Reduce pain to 2/10 within 4 weeks", "Improve right hip abduction strength to 4+/5 in 4 weeks", "Single leg squat without valgus collapse in 4 weeks", "Walk-run program initiation by week 8"]',
  '["Return to 5K running pain-free in 12 weeks", "Complete 10K race in 16 weeks", "FMS score >14/21", "Maintain long-term knee health and prevent reinjury"]',
  
  datetime('now', '-90 days')
);

-- 6. PROGRESS NOTES - Week 4 Follow-up
INSERT INTO soap_notes (
  id, patient_id, visit_date, provider_name,
  subjective, objective, assessment, plan,
  icd10_codes, cpt_codes,
  short_term_goals, long_term_goals,
  created_at
) VALUES (
  9992,
  999,
  datetime('now', '-60 days'),
  'Dr. Emily Rodriguez, PT, DPT',
  
  'Patient reports significant improvement. Pain now 2/10 with daily activities, 0/10 at rest. Completing HEP consistently 6 days/week. Back pain resolved. Eager to begin running. No adverse events.',
  
  'ROM: Right knee flexion 0-135° (improved 10°). Hip abduction strength R: 4/5 (improved), L: 4+/5. Single leg squat shows minimal valgus (improved). Visual assessment shows 6° asymmetry (improved from 14°). Balance: Single leg stance right 25 seconds (improved from 12s).',
  
  'Excellent progress toward goals. Strength and movement quality significantly improved. Patient ready for walk-run progression.',
  
  'Initiate walk-run program (Week 1: 4 min walk, 1 min run x 6 reps, 3x/week). Continue PT 1x/week. Progress HEP to moderate resistance. Retest FMS at week 8.',
  
  '["M25.561 - Pain in right knee (improving)", "M25.361 - Other instability, right knee (improving)"]',
  '["97164 - PT re-evaluation", "97110 - Therapeutic exercise (2 units)", "97116 - Gait training (2 units)"]',
  '["Progress to continuous 20-minute run by week 8", "Complete 5K distance by week 10"]',
  '["Return to 10K racing by week 16", "Maintain injury prevention program"]',
  
  datetime('now', '-60 days')
);

-- 7. FMS RE-ASSESSMENT - Week 8 (Score: 16/21 - Low Risk)
INSERT INTO fms_assessments (
  id, patient_id, assessment_date, assessor_name,
  
  deep_squat_score, deep_squat_notes,
  hurdle_step_left, hurdle_step_right, hurdle_step_notes,
  inline_lunge_left, inline_lunge_right, inline_lunge_notes,
  shoulder_mobility_left, shoulder_mobility_right, shoulder_mobility_clearing,
  leg_raise_left, leg_raise_right, leg_raise_notes,
  push_up_score, push_up_clearing,
  rotary_stability_left, rotary_stability_right, rotary_stability_clearing,
  
  total_score, lowest_score, asymmetry_count,
  injury_risk_level, injury_risk_score,
  
  recommendations, corrective_exercises,
  
  created_at
) VALUES (
  9992,
  999,
  datetime('now', '-30 days'),
  'Dr. Emily Rodriguez, PT, DPT',
  
  2, 'Improved depth. Still minor heel lift. Acceptable for running.',
  3, 2, 'Right improved to 2. Small asymmetry remains. Functional.',
  3, 2, 'Right improved significantly. Pain-free. ROM improved.',
  3, 3, 0,
  3, 3, 'Hamstring flexibility improved with stretching program.',
  3, 0,
  3, 3, 0,
  
  16, 2, 1,
  'low', 22,
  
  '["Continue maintenance program", "Cleared for return to running", "Monitor right knee during training progression", "Retest every 6 months or after injury", "Continue preventive strengthening 2x/week"]',
  '["Maintain hip strengthening program", "Continue ankle mobility work", "Progressive running program", "Plyometric training for return to sport"]',
  
  datetime('now', '-30 days')
);

-- 8. PROGRESS PHOTOS
INSERT INTO progress_photos (
  id, patient_id, photo_date, photo_type,
  photo_url, side_view, notes,
  created_at
) VALUES 
  (9991, 999, datetime('now', '-90 days'), 'baseline', '/demo/sarah-baseline-front.jpg', 'front', 'Initial assessment - Forward head posture, right knee valgus visible', datetime('now', '-90 days')),
  (9992, 999, datetime('now', '-90 days'), 'baseline', '/demo/sarah-baseline-side.jpg', 'side', 'Initial assessment - Anterior pelvic tilt, increased lumbar lordosis', datetime('now', '-90 days')),
  (9993, 999, datetime('now', '-60 days'), 'progress', '/demo/sarah-week4-front.jpg', 'front', 'Week 4 - Improved knee alignment, reduced valgus', datetime('now', '-60 days')),
  (9994, 999, datetime('now', '-30 days'), 'progress', '/demo/sarah-week8-front.jpg', 'front', 'Week 8 - Excellent knee alignment, normalized movement patterns', datetime('now', '-30 days')),
  (9995, 999, datetime('now', '-7 days'), 'current', '/demo/sarah-current-running.jpg', 'action', 'Current - Running form assessment, pain-free 5K', datetime('now', '-7 days'));

-- 9. TREATMENT GOALS & TRACKING
INSERT INTO treatment_goals (
  id, patient_id, goal_description, goal_type,
  target_date, completion_date, status, progress_percentage,
  created_at, updated_at
) VALUES 
  (9991, 999, 'Reduce knee pain to 2/10 or less', 'short_term', datetime('now', '-60 days'), datetime('now', '-60 days'), 'completed', 100, datetime('now', '-90 days'), datetime('now', '-60 days')),
  (9992, 999, 'Improve right hip abduction strength to 4+/5', 'short_term', datetime('now', '-60 days'), datetime('now', '-55 days'), 'completed', 100, datetime('now', '-90 days'), datetime('now', '-55 days')),
  (9993, 999, 'Single leg squat without valgus collapse', 'short_term', datetime('now', '-60 days'), datetime('now', '-62 days'), 'completed', 100, datetime('now', '-90 days'), datetime('now', '-62 days')),
  (9994, 999, 'Complete 5K run pain-free', 'long_term', datetime('now', '-15 days'), datetime('now', '-7 days'), 'completed', 100, datetime('now', '-90 days'), datetime('now', '-7 days')),
  (9995, 999, 'Achieve FMS score >14/21', 'short_term', datetime('now', '-30 days'), datetime('now', '-30 days'), 'completed', 100, datetime('now', '-90 days'), datetime('now', '-30 days')),
  (9996, 999, 'Complete 10K race', 'long_term', datetime('now', '+15 days'), NULL, 'active', 85, datetime('now', '-90 days'), datetime('now'));

-- 10. MESSAGES (Patient-Therapist Communication)
INSERT INTO messages (
  id, patient_id, sender_type, sender_name,
  message_text, sent_at, read_at
) VALUES 
  (9991, 999, 'therapist', 'Dr. Emily Rodriguez', 'Welcome to ThriveOrtho, Sarah! I''ve reviewed your intake form. Looking forward to our first session tomorrow. Please arrive 10 minutes early to complete paperwork.', datetime('now', '-91 days'), datetime('now', '-91 days')),
  (9992, 999, 'patient', 'Sarah Mitchell', 'Thank you! I''m excited to get started. Should I bring anything specific?', datetime('now', '-91 days'), datetime('now', '-91 days')),
  (9993, 999, 'therapist', 'Dr. Emily Rodriguez', 'Just wear comfortable athletic clothing and bring your running shoes. We''ll be doing movement assessments.', datetime('now', '-91 days'), datetime('now', '-91 days')),
  (9994, 999, 'patient', 'Sarah Mitchell', 'Quick question - is it okay if I did some light yoga this morning? Knee feels a bit sore.', datetime('now', '-70 days'), datetime('now', '-70 days')),
  (9995, 999, 'therapist', 'Dr. Emily Rodriguez', 'Yoga is fine! Just avoid deep lunges or poses that cause pain >3/10. Listen to your body. Ice for 15 min if needed.', datetime('now', '-70 days'), datetime('now', '-70 days')),
  (9996, 999, 'patient', 'Sarah Mitchell', 'The exercises are really helping! Pain is down to 2/10. Can I try jogging a bit?', datetime('now', '-62 days'), datetime('now', '-62 days')),
  (9997, 999, 'therapist', 'Dr. Emily Rodriguez', 'That''s great progress! Let''s wait until next week when I can assess your movement quality. We''ll start the walk-run program together. Patience now = success later! 💪', datetime('now', '-62 days'), datetime('now', '-62 days')),
  (9998, 999, 'patient', 'Sarah Mitchell', 'Just completed my first 5K run in 3 years!! 🎉 Zero pain! Thank you so much for getting me back to running!', datetime('now', '-7 days'), datetime('now', '-7 days')),
  (9999, 999, 'therapist', 'Dr. Emily Rodriguez', 'Sarah, this is AMAZING!!! 🌟 So proud of your hard work and consistency. Keep up the maintenance program and you''ll crush that 10K! Let''s schedule your final check-in.', datetime('now', '-7 days'), datetime('now', '-7 days'));

-- 11. APPOINTMENTS
INSERT INTO appointments (
  id, patient_id, appointment_date, appointment_type,
  provider_name, duration_minutes, status, notes,
  created_at
) VALUES 
  (9991, 999, datetime('now', '-90 days', '+10 hours'), 'Initial Evaluation', 'Dr. Emily Rodriguez, PT, DPT', 60, 'completed', 'Comprehensive evaluation completed. FMS and visual assessment performed.', datetime('now', '-95 days')),
  (9992, 999, datetime('now', '-83 days', '+14 hours'), 'Follow-up Treatment', 'Dr. Emily Rodriguez, PT, DPT', 45, 'completed', 'Manual therapy, therapeutic exercise, gait training', datetime('now', '-85 days')),
  (9993, 999, datetime('now', '-76 days', '+10 hours'), 'Follow-up Treatment', 'Dr. Emily Rodriguez, PT, DPT', 45, 'completed', 'Progressive strengthening, single-leg stability work', datetime('now', '-78 days')),
  (9994, 999, datetime('now', '-69 days', '+14 hours'), 'Follow-up Treatment', 'Dr. Emily Rodriguez, PT, DPT', 45, 'completed', 'Neuromuscular re-education, plyometric introduction', datetime('now', '-71 days')),
  (9995, 999, datetime('now', '-60 days', '+10 hours'), 'Re-evaluation', 'Dr. Emily Rodriguez, PT, DPT', 45, 'completed', 'Significant progress noted. Walk-run program initiated.', datetime('now', '-62 days')),
  (9996, 999, datetime('now', '-53 days', '+14 hours'), 'Follow-up Treatment', 'Dr. Emily Rodriguez, PT, DPT', 30, 'completed', 'Running gait analysis, program progression', datetime('now', '-55 days')),
  (9997, 999, datetime('now', '-46 days', '+10 hours'), 'Follow-up Treatment', 'Dr. Emily Rodriguez, PT, DPT', 30, 'completed', 'Advanced strengthening, running volume increase', datetime('now', '-48 days')),
  (9998, 999, datetime('now', '-30 days', '+14 hours'), 'FMS Re-assessment', 'Dr. Emily Rodriguez, PT, DPT', 45, 'completed', 'FMS score improved to 16/21. Cleared for full running.', datetime('now', '-32 days')),
  (9999, 999, datetime('now', '+5 days', '+10 hours'), 'Final Check-in', 'Dr. Emily Rodriguez, PT, DPT', 30, 'scheduled', 'Discharge planning, maintenance program review', datetime('now', '-2 days'));

-- 12. EXERCISE COMPLETION TRACKING
INSERT INTO exercise_log (
  id, patient_id, exercise_name, sets, reps, completion_date,
  difficulty_rating, pain_level, notes, created_at
) VALUES 
  (9991, 999, 'Clamshells (Right)', 3, 20, datetime('now', '-89 days'), 3, 0, 'Felt good, glutes burning', datetime('now', '-89 days')),
  (9992, 999, 'Single-leg Balance (Right)', 3, 30, datetime('now', '-89 days'), 4, 0, 'Challenging but manageable', datetime('now', '-89 days')),
  (9993, 999, 'Dead Bugs', 3, 10, datetime('now', '-89 days'), 2, 0, 'Easy, good for warm-up', datetime('now', '-89 days')),
  -- ... (Multiple daily entries showing consistency)
  (9994, 999, 'Walk-Run Intervals', 6, 1, datetime('now', '-58 days'), 5, 1, 'First run! Small knee discomfort but within range', datetime('now', '-58 days')),
  (9995, 999, 'Progressive Run (20 min)', 1, 1, datetime('now', '-45 days'), 4, 0, 'Pain-free continuous run!', datetime('now', '-45 days')),
  (9996, 999, '5K Run', 1, 1, datetime('now', '-7 days'), 3, 0, 'Completed first 5K post-injury! Time: 28:45', datetime('now', '-7 days'));

-- 13. CPT BILLING OPTIMIZATION (Initial Evaluation)
INSERT INTO billing_records (
  id, patient_id, visit_date, provider_name,
  cpt_codes_recommended, cpt_codes_billed,
  total_charge, estimated_reimbursement,
  payer_type, denial_risk_score,
  optimization_notes,
  created_at
) VALUES (
  9991,
  999,
  datetime('now', '-90 days'),
  'Dr. Emily Rodriguez, PT, DPT',
  
  '[
    {"code": "97163", "description": "PT eval - high complexity", "units": 1, "charge": 150, "modifiers": ["GP"]},
    {"code": "97110", "description": "Therapeutic exercise", "units": 3, "charge": 105, "modifiers": ["GP"]},
    {"code": "97112", "description": "Neuromuscular re-education", "units": 2, "charge": 74, "modifiers": ["GP"]},
    {"code": "97140", "description": "Manual therapy", "units": 2, "charge": 80, "modifiers": ["GP"]},
    {"code": "97530", "description": "Therapeutic activities", "units": 2, "charge": 76, "modifiers": ["GP"]}
  ]',
  
  '[
    {"code": "97163", "units": 1},
    {"code": "97110", "units": 3},
    {"code": "97112", "units": 2},
    {"code": "97140", "units": 2},
    {"code": "97530", "units": 2}
  ]',
  
  485.00,
  388.00,
  'commercial',
  18,
  
  'Optimal code selection for high-complexity evaluation. Total time: 75 minutes. All units comply with 8-minute rule. Low denial risk. GP modifier applied to all codes (Medicare secondary). Expected reimbursement: 80% of charges.',
  
  datetime('now', '-90 days')
);

-- 14. AI ANALYSIS - INJURY RISK ASSESSMENT (Initial)
INSERT INTO ai_analysis_results (
  id, patient_id, analysis_date, analysis_type,
  
  risk_factors, risk_score, risk_level,
  predictions, recommendations,
  
  confidence_score, model_version,
  
  created_at
) VALUES (
  9991,
  999,
  datetime('now', '-90 days'),
  'injury_risk',
  
  '[
    {"factor": "Knee valgus collapse (right)", "severity": "high", "score": 85},
    {"factor": "Bilateral asymmetry >10%", "severity": "high", "score": 78},
    {"factor": "Reduced ROM right knee", "severity": "moderate", "score": 65},
    {"factor": "Weak glute medius (right)", "severity": "high", "score": 82},
    {"factor": "Limited ankle dorsiflexion", "severity": "moderate", "score": 60},
    {"factor": "Core stability deficit", "severity": "moderate", "score": 58},
    {"factor": "Previous ACL reconstruction", "severity": "high", "score": 75}
  ]',
  
  68,
  'elevated',
  
  '{
    "acl_reinjury": {"probability": 0.65, "timeframe": "6-12 months if untreated"},
    "patellofemoral_pain": {"probability": 0.72, "timeframe": "immediate risk"},
    "lower_back_strain": {"probability": 0.45, "timeframe": "with increased activity"},
    "ankle_sprain": {"probability": 0.38, "timeframe": "on uneven surfaces"}
  }',
  
  '[
    "Priority: Strengthen gluteus medius (especially right side)",
    "Address knee valgus pattern before return to running",
    "Progressive ankle mobility program",
    "Core stabilization exercises daily",
    "Gradual return to running protocol (8+ weeks)",
    "Consider functional movement screening every 6 weeks",
    "Avoid high-impact activities until symmetry improved"
  ]',
  
  0.89,
  'injury-risk-ai-v2.1',
  
  datetime('now', '-90 days')
);

-- 15. AI ANALYSIS - PROGRESS TRACKER (Week 8)
INSERT INTO ai_analysis_results (
  id, patient_id, analysis_date, analysis_type,
  
  progress_metrics, progress_score, progress_trend,
  clinical_narrative, next_steps,
  
  confidence_score, model_version,
  
  created_at
) VALUES (
  9992,
  999,
  datetime('now', '-30 days'),
  'progress_tracking',
  
  '{
    "pain_improvement": {"baseline": 6, "current": 1, "change_percent": 83, "trend": "excellent"},
    "strength_improvement": {"hip_abduction_right": {"baseline": "3+/5", "current": "4+/5", "improvement": "1 grade"}, "overall": "significant"},
    "rom_improvement": {"right_knee_flexion": {"baseline": 125, "current": 135, "change": 10}, "trend": "improving"},
    "functional_improvement": {"fms_score": {"baseline": 13, "current": 16, "change": 3}, "single_leg_balance": {"baseline": 12, "current": 25, "change": 13}},
    "asymmetry_reduction": {"knee_flexion": {"baseline": 14, "current": 6, "improvement": 57}},
    "compliance": {"hep_adherence": "95%", "attendance": "100%", "rating": "excellent"}
  }',
  
  88,
  'excellent_progress',
  
  'Patient demonstrates exceptional progress across all objective measures over 8-week period. Pain reduced by 83% (6/10 to 1/10), strength improved by full grade in key muscle groups, ROM increased 10°, and movement quality significantly enhanced (FMS 13→16). Most notably, bilateral asymmetry reduced by 57%, indicating effective neuromuscular re-education. Compliance with home program outstanding at 95%. Patient has met all short-term goals ahead of schedule and is progressing toward long-term objectives. Cleared for return to running with graduated protocol. Recommend transition to maintenance phase with ongoing preventive strengthening 2x/week. Prognosis for full return to 10K racing: excellent.',
  
  '[
    "Continue current strength maintenance program 2x/week",
    "Progress running volume by 10% per week (max)",
    "Monitor for any return of symptoms during training progression",
    "Retest FMS in 3 months or sooner if any setbacks",
    "Consider sport-specific plyometric training for race preparation",
    "Discharge from formal PT, transition to independent program",
    "Schedule 6-month follow-up for long-term outcome tracking"
  ]',
  
  0.92,
  'progress-tracker-ai-v1.5',
  
  datetime('now', '-30 days')
);

-- ============================================================
-- SUMMARY STATISTICS
-- ============================================================

SELECT 'DEMO PATIENT DATA LOADED SUCCESSFULLY' as status;
SELECT '------------------------------------' as separator;
SELECT 'Patient: Sarah Mitchell (ID: 999)' as patient_info;
SELECT 'Timeline: 90-day journey from initial eval to 5K completion' as timeline;
SELECT 'Total Visits: 9 (8 completed, 1 scheduled)' as visits;
SELECT 'FMS Scores: 13/21 → 16/21 (23% improvement)' as fms_progress;
SELECT 'Pain Level: 6/10 → 1/10 (83% reduction)' as pain_progress;
SELECT 'Goals Met: 5/6 (83% completion rate)' as goals;
SELECT 'Compliance: 95% HEP adherence' as compliance;
SELECT '------------------------------------' as separator;
SELECT 'Features Demonstrated:' as features_header;
SELECT '✅ Initial Evaluation with FMS' as f1;
SELECT '✅ Visual Assessment with AI Analysis' as f2;
SELECT '✅ SOAP Notes with ICD-10/CPT Codes' as f3;
SELECT '✅ Progress Tracking' as f4;
SELECT '✅ Treatment Goals with Completion' as f5;
SELECT '✅ Patient-Therapist Messaging' as f6;
SELECT '✅ Appointment Scheduling' as f7;
SELECT '✅ Exercise Logging' as f8;
SELECT '✅ Progress Photos' as f9;
SELECT '✅ CPT Billing Optimization' as f10;
SELECT '✅ AI Injury Risk Assessment' as f11;
SELECT '✅ AI Progress Analysis' as f12;
SELECT '------------------------------------' as separator;
