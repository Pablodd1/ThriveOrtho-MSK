-- ============================================
-- DEMO/DUMMY DATA FOR MVP DEMONSTRATION
-- Medical-Grade PT Assessment System
-- ============================================
-- This file contains 5 complete patient profiles with:
-- - Diverse demographics (age, gender, conditions)
-- - Complete assessments with movement tests
-- - Realistic BMI and medical histories
-- - Various injury types and activity levels
-- ============================================

-- Clear existing demo data (keep schema)
DELETE FROM movement_tests;
DELETE FROM assessments;
DELETE FROM patients WHERE id >= 10; -- Keep existing test patients

-- ============================================
-- DEMO PATIENT 1: Post-Surgical Knee Recovery
-- ============================================
INSERT INTO patients (
    id, first_name, last_name, date_of_birth, gender, email, phone,
    address_line1, city, state, zip_code,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    height_cm, weight_kg,
    chief_complaint, pain_scale, activity_level, assessment_reason,
    medical_history, current_medications, allergies
) VALUES (
    10,
    'Michael',
    'Rodriguez',
    '1975-03-15',
    'male',
    'michael.rodriguez@example.com',
    '(555) 123-4567',
    '456 Oak Avenue',
    'San Diego',
    'CA',
    '92101',
    'Maria Rodriguez',
    '(555) 123-4568',
    'Spouse',
    178.0,  -- 5'10"
    82.5,   -- 182 lbs, BMI: 26.0 (slightly overweight)
    'Right knee pain and stiffness following ACL reconstruction surgery 8 weeks ago',
    6,
    'limited',
    'post_surgical_rehab',
    '{"conditions":["ACL reconstruction (8 weeks post-op)","Mild hypertension","Previous left ankle sprain (2019)"],"surgeries":["ACL reconstruction - right knee (2 months ago)","Appendectomy (2005)"]}',
    '["Ibuprofen 400mg PRN","Lisinopril 10mg daily"]',
    '["Penicillin - rash"]'
);

-- Assessment for Patient 1
INSERT INTO assessments (id, patient_id, assessment_type, status, assessment_date, clinical_notes)
VALUES (
    10,
    10,
    'initial_evaluation',
    'completed',
    '2025-10-20 10:30:00',
    'Initial post-surgical assessment. Patient demonstrates limited knee flexion ROM (0-95°, normal 0-135°). Quad strength 3/5. Gait antalgic with decreased stance phase on right. Reports increased pain with stairs and prolonged sitting. Good surgical healing, no signs of infection.'
);

-- Movement tests for Patient 1
INSERT INTO movement_tests (assessment_id, test_name, test_category, skeleton_data)
VALUES
(10, 'Bodyweight Squat', 'squat', '{"analysis":{"rom_score":65.3,"form_quality":72.1,"balance_score":68.4,"duration_seconds":45,"reps_completed":8},"angles":[{"knee_left":128,"knee_right":95,"hip_left":105,"hip_right":88},{"knee_left":130,"knee_right":97,"hip_left":107,"hip_right":90},{"knee_left":132,"knee_right":99,"hip_left":109,"hip_right":92},{"knee_left":129,"knee_right":96,"hip_left":106,"hip_right":89},{"knee_left":131,"knee_right":98,"hip_left":108,"hip_right":91},{"knee_left":127,"knee_right":94,"hip_left":104,"hip_right":87},{"knee_left":133,"knee_right":100,"hip_left":110,"hip_right":93},{"knee_left":130,"knee_right":97,"hip_left":107,"hip_right":90}],"maxAngles":{"knee_left":133,"knee_right":100,"hip_left":110,"hip_right":93},"minAngles":{"knee_left":127,"knee_right":94,"hip_left":104,"hip_right":87}}'),
(10, 'Single Leg Balance - Left', 'balance', '{"analysis":{"balance_score":78.5,"stability_score":82.3,"form_quality":75.2,"duration_seconds":30},"angles":[{"hip_left":172,"knee_left":178,"ankle_left":88}],"avgAngles":{"hip_left":172,"knee_left":178,"ankle_left":88}}'),
(10, 'Single Leg Balance - Right', 'balance', '{"analysis":{"balance_score":52.1,"stability_score":48.7,"form_quality":55.3,"duration_seconds":15},"angles":[{"hip_right":165,"knee_right":155,"ankle_right":82}],"avgAngles":{"hip_right":165,"knee_right":155,"ankle_right":82}}'),
(10, 'Hip Flexor Stretch - Left', 'flexibility', '{"analysis":{"rom_score":88.2,"form_quality":85.6,"duration_seconds":30,"reps_completed":3},"angles":[{"hip_left":118,"knee_left":135}],"maxAngles":{"hip_left":118,"knee_left":135}}'),
(10, 'Hip Flexor Stretch - Right', 'flexibility', '{"analysis":{"rom_score":71.5,"form_quality":73.2,"duration_seconds":30,"reps_completed":3},"angles":[{"hip_right":95,"knee_right":110}],"maxAngles":{"hip_right":95,"knee_right":110}}');

-- ============================================
-- DEMO PATIENT 2: Chronic Low Back Pain (Sedentary Worker)
-- ============================================
INSERT INTO patients (
    id, first_name, last_name, date_of_birth, gender, email, phone,
    address_line1, city, state, zip_code,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    height_cm, weight_kg,
    chief_complaint, pain_scale, activity_level, assessment_reason,
    medical_history, current_medications, allergies
) VALUES (
    11,
    'Jennifer',
    'Chen',
    '1988-07-22',
    'female',
    'jennifer.chen@example.com',
    '(555) 234-5678',
    '789 Maple Street, Apt 3B',
    'Austin',
    'TX',
    '78701',
    'David Chen',
    '(555) 234-5679',
    'Spouse',
    165.0,  -- 5'5"
    68.0,   -- 150 lbs, BMI: 25.0 (upper normal)
    'Chronic lower back pain, worse with prolonged sitting and standing',
    7,
    'sedentary',
    'chronic_pain_management',
    '{"conditions":["Chronic non-specific low back pain (3 years)","Mild scoliosis","Computer-related neck strain"],"surgeries":[]}',
    '["Acetaminophen 500mg PRN","Meloxicam 7.5mg daily"]',
    '[]'
);

INSERT INTO assessments (id, patient_id, assessment_type, status, assessment_date, clinical_notes)
VALUES (
    11,
    11,
    'initial_evaluation',
    'completed',
    '2025-10-19 14:15:00',
    'Desk worker with 3-year history of LBP. Forward head posture noted. Limited lumbar flexion and extension. Tight hip flexors bilaterally. Core strength 2+/5. Reports pain increases after 30 min sitting. No radicular symptoms. Negative SLR bilaterally.'
);

INSERT INTO movement_tests (assessment_id, test_name, test_category, skeleton_data)
VALUES
(11, 'Bodyweight Squat', 'squat', 40, 10, '{"analysis":{"rom_score":71.8,"form_quality":68.2,"balance_score":75.5},"angles":[{"knee_left":120,"knee_right":118,"hip_left":98,"hip_right":95},{"knee_left":122,"knee_right":120,"hip_left":100,"hip_right":97},{"knee_left":119,"knee_right":117,"hip_left":97,"hip_right":94},{"knee_left":121,"knee_right":119,"hip_left":99,"hip_right":96},{"knee_left":123,"knee_right":121,"hip_left":101,"hip_right":98},{"knee_left":120,"knee_right":118,"hip_left":98,"hip_right":95},{"knee_left":122,"knee_right":120,"hip_left":100,"hip_right":97},{"knee_left":118,"knee_right":116,"hip_left":96,"hip_right":93},{"knee_left":121,"knee_right":119,"hip_left":99,"hip_right":96},{"knee_left":120,"knee_right":118,"hip_left":98,"hip_right":95}],"maxAngles":{"knee_left":123,"knee_right":121,"hip_left":101,"hip_right":98},"minAngles":{"knee_left":118,"knee_right":116,"hip_left":96,"hip_right":93}}'),
(11, 'Hip Flexor Stretch - Left', 'flexibility', 30, 3, '{"analysis":{"rom_score":62.5,"form_quality":65.8},"angles":[{"hip_left":85,"knee_left":125}],"maxAngles":{"hip_left":85,"knee_left":125}}'),
(11, 'Hip Flexor Stretch - Right', 'flexibility', 30, 3, '{"analysis":{"rom_score":58.3,"form_quality":61.2},"angles":[{"hip_right":78,"knee_right":120}],"maxAngles":{"hip_right":78,"knee_right":120}}'),
(11, 'Plank Hold', 'stability', 25, 1, '{"analysis":{"stability_score":55.7,"form_quality":52.3},"duration":25}'),
(11, 'Bridge Hold', 'stability', 35, 1, '{"analysis":{"stability_score":68.4,"form_quality":71.2},"duration":35}');

-- ============================================
-- DEMO PATIENT 3: Elderly Fall Prevention (High Risk)
-- ============================================
INSERT INTO patients (
    id, first_name, last_name, date_of_birth, gender, email, phone,
    address_line1, city, state, zip_code,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    height_cm, weight_kg,
    chief_complaint, pain_scale, activity_level, assessment_reason,
    medical_history, current_medications, allergies
) VALUES (
    12,
    'Dorothy',
    'Williams',
    '1948-11-08',
    'female',
    'dorothy.williams@example.com',
    '(555) 345-6789',
    '234 Senior Living Way',
    'Phoenix',
    'AZ',
    '85001',
    'Sarah Williams',
    '(555) 345-6790',
    'Daughter',
    160.0,  -- 5'3"
    58.0,   -- 128 lbs, BMI: 22.7 (normal)
    'Recent near-fall episodes, decreased balance confidence, general weakness',
    3,
    'limited',
    'fall_prevention',
    '{"conditions":["Osteoporosis","Type 2 Diabetes (controlled)","Mild osteoarthritis - bilateral knees","History of 2 falls in past year"],"surgeries":["Cataract surgery OU (2020)","Cholecystectomy (1995)"]}',
    '["Alendronate 70mg weekly","Metformin 500mg BID","Vitamin D 2000 IU daily","Calcium 600mg BID"]',
    '["Sulfa drugs"]'
);

INSERT INTO assessments (id, patient_id, assessment_type, status, assessment_date, clinical_notes)
VALUES (
    12,
    12,
    'initial_evaluation',
    'completed',
    '2025-10-18 09:30:00',
    'High fall risk assessment. Positive Romberg test. TUG test: 18 seconds (abnormal for age). Decreased ankle dorsiflexion bilaterally. Lower extremity strength 3/5. Uses single-point cane for community ambulation. Lives alone, daughter nearby. Good cognition, motivated for therapy.'
);

INSERT INTO movement_tests (assessment_id, test_name, test_category, skeleton_data)
VALUES
(12, 'Chair Stand Test', 'strength', 40, 6, '{"analysis":{"rom_score":58.2,"form_quality":61.5,"balance_score":55.8},"angles":[{"knee_left":115,"knee_right":112,"hip_left":88,"hip_right":85},{"knee_left":117,"knee_right":114,"hip_left":90,"hip_right":87},{"knee_left":113,"knee_right":110,"hip_left":86,"hip_right":83},{"knee_left":116,"knee_right":113,"hip_left":89,"hip_right":86},{"knee_left":114,"knee_right":111,"hip_left":87,"hip_right":84},{"knee_left":115,"knee_right":112,"hip_left":88,"hip_right":85}],"maxAngles":{"knee_left":117,"knee_right":114,"hip_left":90,"hip_right":87},"minAngles":{"knee_left":113,"knee_right":110,"hip_left":86,"hip_right":83}}'),
(12, 'Single Leg Balance - Left', 'balance', 8, 1, '{"analysis":{"balance_score":42.3,"stability_score":38.7,"form_quality":45.1},"angles":[{"hip_left":168,"knee_left":175,"ankle_left":85}],"avgAngles":{"hip_left":168,"knee_left":175,"ankle_left":85}}'),
(12, 'Single Leg Balance - Right', 'balance', 6, 1, '{"analysis":{"balance_score":38.5,"stability_score":35.2,"form_quality":40.8},"angles":[{"hip_right":165,"knee_right":172,"ankle_right":83}],"avgAngles":{"hip_right":165,"knee_right":172,"ankle_right":83}}'),
(12, 'Heel Raises', 'strength', 30, 8, '{"analysis":{"rom_score":52.1,"form_quality":55.7},"angles":[{"ankle_left":65,"ankle_right":62}],"maxAngles":{"ankle_left":65,"ankle_right":62}}'),
(12, 'Tandem Stance', 'balance', 12, 1, '{"analysis":{"balance_score":48.6,"stability_score":51.2},"duration":12}');

-- ============================================
-- DEMO PATIENT 4: Athletic Shoulder Injury
-- ============================================
INSERT INTO patients (
    id, first_name, last_name, date_of_birth, gender, email, phone,
    address_line1, city, state, zip_code,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    height_cm, weight_kg,
    chief_complaint, pain_scale, activity_level, assessment_reason,
    medical_history, current_medications, allergies
) VALUES (
    13,
    'Marcus',
    'Thompson',
    '1995-05-18',
    'male',
    'marcus.thompson@example.com',
    '(555) 456-7890',
    '567 Athletic Drive',
    'Seattle',
    'WA',
    '98101',
    'Lisa Thompson',
    '(555) 456-7891',
    'Mother',
    188.0,  -- 6'2"
    92.0,   -- 203 lbs, BMI: 26.0 (athletic build)
    'Right shoulder pain during overhead activities, previous rotator cuff strain',
    5,
    'very_active',
    'sports_injury',
    '{"conditions":["Right rotator cuff strain (4 weeks ago)","Previous left ankle sprain (2022)"],"surgeries":[]}',
    '["Naproxen 500mg PRN"]',
    '[]'
);

INSERT INTO assessments (id, patient_id, assessment_type, status, assessment_date, clinical_notes)
VALUES (
    13,
    13,
    'initial_evaluation',
    'completed',
    '2025-10-21 16:45:00',
    'Competitive volleyball player with 4-week history of right shoulder pain. Pain with overhead serving and spiking. ROM: Flexion 165°, Abduction 155°, ER 75°, IR 55° (limited). Positive Neer and Hawkins-Kennedy tests. Rotator cuff strength 4/5. Scapular dyskinesis noted. Eager to return to sport.'
);

INSERT INTO movement_tests (assessment_id, test_name, test_category, skeleton_data)
VALUES
(13, 'Shoulder Flexion Test', 'flexibility', 30, 8, '{"analysis":{"rom_score":82.5,"form_quality":85.3},"angles":[{"shoulder_left":175,"shoulder_right":165}],"maxAngles":{"shoulder_left":175,"shoulder_right":165}}'),
(13, 'Wall Angels', 'mobility', 40, 10, '{"analysis":{"rom_score":78.6,"form_quality":81.2},"angles":[{"shoulder_left":168,"shoulder_right":158},{"shoulder_left":170,"shoulder_right":160},{"shoulder_left":169,"shoulder_right":159},{"shoulder_left":171,"shoulder_right":161},{"shoulder_left":168,"shoulder_right":158},{"shoulder_left":172,"shoulder_right":162},{"shoulder_left":169,"shoulder_right":159},{"shoulder_left":170,"shoulder_right":160},{"shoulder_left":171,"shoulder_right":161},{"shoulder_left":169,"shoulder_right":159}],"maxAngles":{"shoulder_left":172,"shoulder_right":162},"minAngles":{"shoulder_left":168,"shoulder_right":158}}'),
(13, 'Plank Hold', 'stability', 75, 1, '{"analysis":{"stability_score":92.3,"form_quality":88.7},"duration":75}'),
(13, 'Bodyweight Squat', 'squat', 35, 12, '{"analysis":{"rom_score":95.2,"form_quality":92.8,"balance_score":94.1},"angles":[{"knee_left":132,"knee_right":130,"hip_left":118,"hip_right":115}],"maxAngles":{"knee_left":132,"knee_right":130,"hip_left":118,"hip_right":115}}'),
(13, 'Single Leg Balance - Right', 'balance', 60, 1, '{"analysis":{"balance_score":96.5,"stability_score":94.2,"form_quality":95.8},"angles":[{"hip_right":178,"knee_right":179,"ankle_right":92}],"avgAngles":{"hip_right":178,"knee_right":179,"ankle_right":92}}');

-- ============================================
-- DEMO PATIENT 5: Obesity & Multiple Comorbidities
-- ============================================
INSERT INTO patients (
    id, first_name, last_name, date_of_birth, gender, email, phone,
    address_line1, city, state, zip_code,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    height_cm, weight_kg,
    chief_complaint, pain_scale, activity_level, assessment_reason,
    medical_history, current_medications, allergies
) VALUES (
    14,
    'Robert',
    'Martinez',
    '1972-09-30',
    'male',
    'robert.martinez@example.com',
    '(555) 567-8901',
    '890 Health Way',
    'Miami',
    'FL',
    '33101',
    'Carmen Martinez',
    '(555) 567-8902',
    'Spouse',
    175.0,  -- 5'9"
    115.0,  -- 254 lbs, BMI: 37.6 (obese class II)
    'Bilateral knee pain, difficulty with stairs and prolonged standing, shortness of breath with activity',
    8,
    'sedentary',
    'weight_management',
    '{"conditions":["Obesity (BMI 37.6)","Type 2 Diabetes","Hypertension","Obstructive Sleep Apnea","Osteoarthritis - bilateral knees"],"surgeries":["Bariatric surgery consultation scheduled"]}',
    '["Metformin 1000mg BID","Lisinopril 20mg daily","Atorvastatin 40mg daily","Insulin glargine 30 units QHS","CPAP nightly"]',
    '["Codeine - nausea"]'
);

INSERT INTO assessments (id, patient_id, assessment_type, status, assessment_date, clinical_notes)
VALUES (
    14,
    14,
    'initial_evaluation',
    'completed',
    '2025-10-17 11:00:00',
    'Pre-bariatric surgery PT evaluation. Significant functional limitations. 6MWT: 285 meters (severely reduced). TUG: 16 seconds. Bilateral knee crepitus and effusion. Unable to perform standard squat due to pain and ROM limitation. Uses bilateral knee braces. Motivated for weight loss and improved function. Will need modified exercise program.'
);

INSERT INTO movement_tests (assessment_id, test_name, test_category, skeleton_data)
VALUES
(14, 'Modified Chair Squat', 'squat', 45, 5, '{"analysis":{"rom_score":42.5,"form_quality":38.7,"balance_score":45.2},"angles":[{"knee_left":105,"knee_right":102,"hip_left":78,"hip_right":75},{"knee_left":107,"knee_right":104,"hip_left":80,"hip_right":77},{"knee_left":103,"knee_right":100,"hip_left":76,"hip_right":73},{"knee_left":106,"knee_right":103,"hip_left":79,"hip_right":76},{"knee_left":104,"knee_right":101,"hip_left":77,"hip_right":74}],"maxAngles":{"knee_left":107,"knee_right":104,"hip_left":80,"hip_right":77},"minAngles":{"knee_left":103,"knee_right":100,"hip_left":76,"hip_right":73}}'),
(14, 'Seated March', 'mobility', 40, 15, '{"analysis":{"rom_score":51.3,"form_quality":55.8},"angles":[{"hip_left":72,"hip_right":70}],"maxAngles":{"hip_left":72,"hip_right":70}}'),
(14, 'Wall Push-ups', 'strength', 35, 8, '{"analysis":{"rom_score":48.2,"form_quality":52.1},"angles":[{"shoulder_left":145,"shoulder_right":142}],"maxAngles":{"shoulder_left":145,"shoulder_right":142}}'),
(14, 'Seated Balance Reach', 'balance', 30, 6, '{"analysis":{"balance_score":62.5,"stability_score":58.3},"duration":30}');

-- ============================================
-- SUMMARY STATS FOR DEMO DATA
-- ============================================
-- Total Patients: 5
-- Age Range: 29 - 76 years
-- Gender: 3 Male, 2 Female
-- BMI Range: 22.7 (Normal) - 37.6 (Obese Class II)
-- Total Assessments: 5 (all completed)
-- Total Movement Tests: 24
-- 
-- Patient Types Represented:
-- 1. Post-surgical rehabilitation
-- 2. Chronic pain (occupational)
-- 3. Geriatric fall prevention
-- 4. Athletic/sports injury
-- 5. Obesity with multiple comorbidities
-- ============================================
