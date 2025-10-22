-- ============================================
-- DEMO DATA SEED SCRIPT
-- F-AI bian Assessment System
-- ============================================
-- This script creates realistic demo/dummy data for demonstration purposes
-- Includes: 5 diverse patients, assessments, movement tests, and medical records

-- ============================================
-- DEMO PATIENTS
-- ============================================

-- Patient 1: Post-Surgery Elderly Male
INSERT OR IGNORE INTO patients (
    id, first_name, last_name, date_of_birth, gender, email, phone,
    address_line1, address_line2, city, state, zip_code,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    primary_physician, insurance_provider, insurance_policy_number,
    medical_history, current_medications, allergies,
    assessment_reason, chief_complaint, pain_scale, activity_level,
    height_cm, weight_kg,
    created_at, updated_at
) VALUES (
    100, 'Robert', 'Thompson', '1950-03-15', 'male', 'robert.thompson@email.com', '555-0101',
    '123 Oak Street', 'Apt 4B', 'Miami', 'FL', '33101',
    'Mary Thompson', '555-0102', 'Wife',
    'Dr. Sarah Johnson', 'Medicare Part A & B', 'MED-12345678',
    '{"conditions": ["Hypertension", "Type 2 Diabetes", "Hip Replacement Surgery (Right, 6 weeks ago)"]}',
    '["Metformin 500mg", "Lisinopril 10mg", "Aspirin 81mg"]',
    '["Penicillin", "Sulfa drugs"]',
    'post_surgery', 'Right hip pain and stiffness post hip replacement surgery. Limited mobility and difficulty with daily activities.',
    6, 'sedentary',
    175.0, 85.5,
    datetime('now', '-30 days'), datetime('now', '-30 days')
);

-- Patient 2: Fall Risk Elderly Female
INSERT OR IGNORE INTO patients (
    id, first_name, last_name, date_of_birth, gender, email, phone,
    address_line1, address_line2, city, state, zip_code,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    primary_physician, insurance_provider, insurance_policy_number,
    medical_history, current_medications, allergies,
    assessment_reason, chief_complaint, pain_scale, activity_level,
    height_cm, weight_kg,
    created_at, updated_at
) VALUES (
    101, 'Margaret', 'Chen', '1945-08-22', 'female', 'margaret.chen@email.com', '555-0201',
    '456 Maple Avenue', NULL, 'Fort Lauderdale', 'FL', '33301',
    'David Chen', '555-0202', 'Son',
    'Dr. Michael Rodriguez', 'United Healthcare', 'UHC-87654321',
    '{"conditions": ["Osteoporosis", "Balance Disorder", "Mild Cognitive Impairment"]}',
    '["Alendronate 70mg weekly", "Vitamin D 2000IU", "Calcium 600mg"]',
    '[]',
    'fall_prevention', 'Multiple near-falls in past 3 months. Difficulty maintaining balance during daily activities. Fear of falling affecting confidence.',
    3, 'light',
    162.0, 58.3,
    datetime('now', '-25 days'), datetime('now', '-25 days')
);

-- Patient 3: Chronic Pain Middle-Aged Male
INSERT OR IGNORE INTO patients (
    id, first_name, last_name, date_of_birth, gender, email, phone,
    address_line1, address_line2, city, state, zip_code,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    primary_physician, insurance_provider, insurance_policy_number,
    medical_history, current_medications, allergies,
    assessment_reason, chief_complaint, pain_scale, activity_level,
    height_cm, weight_kg,
    created_at, updated_at
) VALUES (
    102, 'James', 'Martinez', '1968-11-10', 'male', 'james.martinez@email.com', '555-0301',
    '789 Pine Road', 'Unit 12', 'Orlando', 'FL', '32801',
    'Lisa Martinez', '555-0302', 'Wife',
    'Dr. Emily Foster', 'Blue Cross Blue Shield', 'BCBS-45678901',
    '{"conditions": ["Chronic Lower Back Pain", "Sciatica", "Herniated Disc L4-L5"]}',
    '["Gabapentin 300mg", "Ibuprofen 400mg PRN", "Cyclobenzaprine 10mg"]',
    '["Codeine"]',
    'chronic_pain', 'Persistent lower back pain radiating down left leg for 8 months. Pain worsens with prolonged sitting or standing. Affecting work productivity.',
    7, 'light',
    180.0, 95.2,
    datetime('now', '-20 days'), datetime('now', '-20 days')
);

-- Patient 4: Active Senior with Mobility Decline
INSERT OR IGNORE INTO patients (
    id, first_name, last_name, date_of_birth, gender, email, phone,
    address_line1, address_line2, city, state, zip_code,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    primary_physician, insurance_provider, insurance_policy_number,
    medical_history, current_medications, allergies,
    assessment_reason, chief_complaint, pain_scale, activity_level,
    height_cm, weight_kg,
    created_at, updated_at
) VALUES (
    103, 'Eleanor', 'Williams', '1952-05-30', 'female', 'eleanor.williams@email.com', '555-0401',
    '321 Elm Street', NULL, 'Tampa', 'FL', '33601',
    'Richard Williams', '555-0402', 'Husband',
    'Dr. David Park', 'Aetna', 'AET-23456789',
    '{"conditions": ["Osteoarthritis (Bilateral Knees)", "Hypertension", "Former Tennis Player"]}',
    '["Losartan 50mg", "Acetaminophen 650mg", "Glucosamine 1500mg"]',
    '[]',
    'mobility_decline', 'Gradual decline in walking distance over past year. Bilateral knee pain and stiffness, especially in mornings. Unable to continue tennis activities.',
    5, 'moderate',
    168.0, 72.8,
    datetime('now', '-15 days'), datetime('now', '-15 days')
);

-- Patient 5: Athlete with Balance Issues
INSERT OR IGNORE INTO patients (
    id, first_name, last_name, date_of_birth, gender, email, phone,
    address_line1, address_line2, city, state, zip_code,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    primary_physician, insurance_provider, insurance_policy_number,
    medical_history, current_medications, allergies,
    assessment_reason, chief_complaint, pain_scale, activity_level,
    height_cm, weight_kg,
    created_at, updated_at
) VALUES (
    104, 'Michael', 'Johnson', '1985-09-14', 'male', 'michael.johnson@email.com', '555-0501',
    '654 Cedar Lane', 'Apt 8A', 'Jacksonville', 'FL', '32099',
    'Sarah Johnson', '555-0502', 'Sister',
    'Dr. Amanda Lee', 'Cigna', 'CIG-34567890',
    '{"conditions": ["Post-Concussion Syndrome", "Vestibular Disorder", "Former College Football Player"]}',
    '["Meclizine 25mg PRN"]',
    '[]',
    'balance_issues', 'Persistent dizziness and balance problems since concussion 4 months ago. Difficulty with rapid head movements. Affecting return to athletic activities.',
    4, 'active',
    188.0, 92.5,
    datetime('now', '-10 days'), datetime('now', '-10 days')
);

-- ============================================
-- DEMO ASSESSMENTS
-- ============================================

-- Assessment for Patient 100 (Robert Thompson - Post-Surgery)
INSERT OR IGNORE INTO assessments (
    id, patient_id, clinician_id, assessment_type, status,
    completed_at, clinical_notes, created_at
) VALUES (
    200, 100, NULL, 'initial', 'completed',
    datetime('now', '-29 days'),
    'Initial post-op assessment 6 weeks after right hip replacement. Patient shows limited ROM in hip flexion (80 degrees) and external rotation. Gait pattern antalgic with right hip hiking. Pain level moderate (6/10). Recommended progressive strengthening and ROM exercises.',
    datetime('now', '-29 days')
);

-- Assessment for Patient 101 (Margaret Chen - Fall Prevention)
INSERT OR IGNORE INTO assessments (
    id, patient_id, clinician_id, assessment_type, status,
    completed_at, clinical_notes, created_at
) VALUES (
    201, 101, NULL, 'initial', 'completed',
    datetime('now', '-24 days'),
    'Fall risk assessment showing moderate risk. Berg Balance Scale: 42/56 (moderate fall risk). TUG test: 18 seconds (high risk). Significant balance deficits with tandem stance and single leg stance. Recommending balance training program.',
    datetime('now', '-24 days')
);

-- Assessment for Patient 102 (James Martinez - Chronic Pain)
INSERT OR IGNORE INTO assessments (
    id, patient_id, clinician_id, assessment_type, status,
    completed_at, clinical_notes, created_at
) VALUES (
    202, 102, NULL, 'initial', 'completed',
    datetime('now', '-19 days'),
    'Chronic low back pain evaluation. Limited lumbar flexion (40 degrees) and extension (15 degrees). Positive straight leg raise at 45 degrees on left. Core strength 2/5. Oswestry Disability Index: 42% (moderate disability). Focus on core stabilization and pain management techniques.',
    datetime('now', '-19 days')
);

-- Assessment for Patient 103 (Eleanor Williams - Mobility Decline)
INSERT OR IGNORE INTO assessments (
    id, patient_id, clinician_id, assessment_type, status,
    completed_at, clinical_notes, created_at
) VALUES (
    203, 103, NULL, 'initial', 'completed',
    datetime('now', '-14 days'),
    'Knee OA assessment showing bilateral degenerative changes. Right knee ROM: 5-110 degrees, Left knee ROM: 0-105 degrees. Quad strength 3+/5 bilaterally. 6-minute walk test: 280 meters (below normal for age). WOMAC score: 58/100. Recommending strengthening and functional mobility training.',
    datetime('now', '-14 days')
);

-- Assessment for Patient 104 (Michael Johnson - Balance Issues)
INSERT OR IGNORE INTO assessments (
    id, patient_id, clinician_id, assessment_type, status,
    completed_at, clinical_notes, created_at
) VALUES (
    204, 104, NULL, 'initial', 'completed',
    datetime('now', '-9 days'),
    'Post-concussion vestibular assessment. Positive Dynamic Visual Acuity test. Balance Error Scoring System (BESS): 22 errors (abnormal). Abnormal head thrust test. Recommending vestibular rehabilitation therapy with progressive return to sport protocol.',
    datetime('now', '-9 days')
);

-- ============================================
-- DEMO MOVEMENT TESTS (Simplified - Without Full Skeleton Data)
-- ============================================

-- Movement Test 1: Bodyweight Squat for Patient 100
INSERT OR IGNORE INTO movement_tests (
    id, assessment_id, test_name, status, score,
    skeleton_data, completed_at, created_at
) VALUES (
    300, 200, 'Bodyweight Squat', 'completed', 65.3,
    '{"fps": 30, "total_frames": 1350, "reps": 8, "duration": 45, "analysis": {"form_quality": 65.3, "rom_score": 58.7, "balance_score": 72.1, "consistency": 68.5, "recommendations": ["Increase depth gradually", "Focus on hip mobility", "Strengthen quadriceps"]}, "angles": []}',
    datetime('now', '-29 days'), datetime('now', '-29 days')
);

-- Movement Test 2: Hip Flexor Stretch for Patient 100
INSERT OR IGNORE INTO movement_tests (
    id, assessment_id, test_name, repetitions, duration_seconds,
    skeleton_data, created_at
) VALUES (
    301, 200, 'Hip Flexor Stretch', 5, 150,
    '{"fps": 30, "total_frames": 4500, "analysis": {"form_quality": 71.2, "rom_score": 62.4, "balance_score": 85.3, "consistency": 75.8, "recommendations": ["Hold stretch longer (30s minimum)", "Focus on posterior pelvic tilt", "Avoid arching lower back"]}, "angles": []}',
    datetime('now', '-29 days')
);

-- Movement Test 3: Single Leg Stand for Patient 101
INSERT OR IGNORE INTO movement_tests (
    id, assessment_id, test_name, repetitions, duration_seconds,
    skeleton_data, created_at
) VALUES (
    302, 201, 'Single Leg Stand', 6, 72,
    '{"fps": 30, "total_frames": 2160, "analysis": {"form_quality": 52.8, "rom_score": 68.3, "balance_score": 48.5, "consistency": 55.2, "recommendations": ["Start with supported single leg stance", "Progress duration gradually", "Focus on hip stability"]}, "angles": []}',
    datetime('now', '-24 days')
);

-- Movement Test 4: Tandem Walk for Patient 101
INSERT OR IGNORE INTO movement_tests (
    id, assessment_id, test_name, repetitions, duration_seconds,
    skeleton_data, created_at
) VALUES (
    303, 201, 'Tandem Walk', 1, 30,
    '{"fps": 30, "total_frames": 900, "analysis": {"form_quality": 58.6, "rom_score": 72.1, "balance_score": 51.3, "consistency": 62.5, "recommendations": ["Practice heel-to-toe pattern", "Use assistive device initially", "Focus on trunk control"]}, "angles": []}',
    datetime('now', '-24 days')
);

-- Movement Test 5: Cat-Cow Stretch for Patient 102
INSERT OR IGNORE INTO movement_tests (
    id, assessment_id, test_name, repetitions, duration_seconds,
    skeleton_data, created_at
) VALUES (
    304, 202, 'Cat-Cow Stretch', 10, 60,
    '{"fps": 30, "total_frames": 1800, "analysis": {"form_quality": 74.5, "rom_score": 68.9, "balance_score": 88.2, "consistency": 81.3, "recommendations": ["Good controlled movement", "Increase repetitions to 15", "Focus on breathing coordination"]}, "angles": []}',
    datetime('now', '-19 days')
);

-- Movement Test 6: Bird Dog Exercise for Patient 102
INSERT OR IGNORE INTO movement_tests (
    id, assessment_id, test_name, repetitions, duration_seconds,
    skeleton_data, created_at
) VALUES (
    305, 202, 'Bird Dog Exercise', 8, 80,
    '{"fps": 30, "total_frames": 2400, "analysis": {"form_quality": 62.7, "rom_score": 71.4, "balance_score": 65.8, "consistency": 69.5, "recommendations": ["Maintain neutral spine", "Avoid hip hiking", "Progress to longer holds"]}, "angles": []}',
    datetime('now', '-19 days')
);

-- Movement Test 7: Sit to Stand for Patient 103
INSERT OR IGNORE INTO movement_tests (
    id, assessment_id, test_name, repetitions, duration_seconds,
    skeleton_data, created_at
) VALUES (
    306, 203, 'Sit to Stand', 10, 30,
    '{"fps": 30, "total_frames": 900, "analysis": {"form_quality": 76.8, "rom_score": 72.3, "balance_score": 81.5, "consistency": 78.9, "recommendations": ["Good functional movement", "Progress to single leg variant", "Maintain upright posture"]}, "angles": []}',
    datetime('now', '-14 days')
);

-- Movement Test 8: Heel Raises for Patient 103
INSERT OR IGNORE INTO movement_tests (
    id, assessment_id, test_name, repetitions, duration_seconds,
    skeleton_data, created_at
) VALUES (
    307, 203, 'Heel Raises', 15, 45,
    '{"fps": 30, "total_frames": 1350, "analysis": {"form_quality": 82.4, "rom_score": 85.7, "balance_score": 79.3, "consistency": 83.1, "recommendations": ["Excellent ankle mobility", "Add resistance for progression", "Consider single leg variant"]}, "angles": []}',
    datetime('now', '-14 days')
);

-- Movement Test 9: Head Turns for Patient 104
INSERT OR IGNORE INTO movement_tests (
    id, assessment_id, test_name, repetitions, duration_seconds,
    skeleton_data, created_at
) VALUES (
    308, 204, 'Head Turns', 20, 40,
    '{"fps": 30, "total_frames": 1200, "analysis": {"form_quality": 65.9, "rom_score": 78.6, "balance_score": 58.4, "consistency": 67.2, "recommendations": ["Slow controlled movements", "Focus on visual tracking", "Progress to standing position"]}, "angles": []}',
    datetime('now', '-9 days')
);

-- Movement Test 10: Balance Board Exercise for Patient 104
INSERT OR IGNORE INTO movement_tests (
    id, assessment_id, test_name, repetitions, duration_seconds,
    skeleton_data, created_at
) VALUES (
    309, 204, 'Balance Board Exercise', 1, 120,
    '{"fps": 30, "total_frames": 3600, "analysis": {"form_quality": 55.3, "rom_score": 68.1, "balance_score": 52.7, "consistency": 59.5, "recommendations": ["Start with stable surface", "Progress duration gradually", "Add cognitive tasks when ready"]}, "angles": []}',
    datetime('now', '-9 days')
);

-- ============================================
-- SUMMARY
-- ============================================
-- Demo data created:
-- - 5 Diverse Patients (ages 39-80, various conditions)
-- - 5 Initial Assessments (all completed)
-- - 10 Movement Tests (2 per assessment)
-- 
-- Patient Profiles:
-- 1. Robert Thompson (74) - Post-hip surgery, limited mobility
-- 2. Margaret Chen (80) - Fall risk, balance issues
-- 3. James Martinez (57) - Chronic back pain, sciatica
-- 4. Eleanor Williams (73) - Knee arthritis, former athlete
-- 5. Michael Johnson (39) - Post-concussion, vestibular issues
--
-- This data demonstrates the system's ability to handle:
-- - Various age groups (39-80 years)
-- - Multiple clinical presentations
-- - Different assessment types
-- - Diverse movement capabilities
-- - Realistic medical scenarios
