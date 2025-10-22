-- Simple Demo Data for MVP Demonstration
-- 3 complete patient profiles with assessments

-- Clear existing demo data
DELETE FROM movement_tests WHERE assessment_id >= 100;
DELETE FROM assessments WHERE id >= 100;
DELETE FROM patients WHERE id >= 100;

-- DEMO PATIENT 1: Post-Surgical Knee Patient
INSERT INTO patients (
    id, first_name, last_name, date_of_birth, gender, email, phone,
    address_line1, city, state, zip_code,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    height_cm, weight_kg,
    chief_complaint, pain_scale, activity_level, assessment_reason
) VALUES (
    100,
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
    178.0,
    82.5,
    'Right knee pain and stiffness following ACL reconstruction surgery 8 weeks ago',
    6,
    'limited',
    'post_surgical_rehab'
);

INSERT INTO assessments (id, patient_id, assessment_type, status, assessment_date, clinical_notes)
VALUES (
    100,
    100,
    'initial_evaluation',
    'completed',
    '2025-10-20 10:30:00',
    'Initial post-surgical assessment. Patient demonstrates limited knee flexion ROM (0-95°, normal 0-135°). Quad strength 3/5. Gait antalgic with decreased stance phase on right.'
);

INSERT INTO movement_tests (assessment_id, test_name, test_category, skeleton_data, status)
VALUES
(100, 'Bodyweight Squat', 'squat', '{"analysis":{"rom_score":65.3,"form_quality":72.1,"balance_score":68.4},"angles":[{"knee_left":128,"knee_right":95,"hip_left":105,"hip_right":88}],"maxAngles":{"knee_left":133,"knee_right":100,"hip_left":110,"hip_right":93}}', 'completed'),
(100, 'Single Leg Balance - Left', 'balance', '{"analysis":{"balance_score":78.5,"stability_score":82.3,"form_quality":75.2},"angles":[{"hip_left":172,"knee_left":178,"ankle_left":88}]}', 'completed'),
(100, 'Single Leg Balance - Right', 'balance', '{"analysis":{"balance_score":52.1,"stability_score":48.7,"form_quality":55.3},"angles":[{"hip_right":165,"knee_right":155,"ankle_right":82}]}', 'completed'),
(100, 'Hip Flexor Stretch', 'flexibility', '{"analysis":{"rom_score":71.5,"form_quality":73.2},"angles":[{"hip_left":118,"hip_right":95}]}', 'completed');

-- DEMO PATIENT 2: Chronic Low Back Pain
INSERT INTO patients (
    id, first_name, last_name, date_of_birth, gender, email, phone,
    address_line1, city, state, zip_code,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    height_cm, weight_kg,
    chief_complaint, pain_scale, activity_level, assessment_reason
) VALUES (
    101,
    'Jennifer',
    'Chen',
    '1988-07-22',
    'female',
    'jennifer.chen@example.com',
    '(555) 234-5678',
    '789 Maple Street',
    'Austin',
    'TX',
    '78701',
    'David Chen',
    '(555) 234-5679',
    'Spouse',
    165.0,
    68.0,
    'Chronic lower back pain, worse with prolonged sitting and standing',
    7,
    'sedentary',
    'chronic_pain_management'
);

INSERT INTO assessments (id, patient_id, assessment_type, status, assessment_date, clinical_notes)
VALUES (
    101,
    101,
    'initial_evaluation',
    'completed',
    '2025-10-19 14:15:00',
    'Desk worker with 3-year history of LBP. Forward head posture noted. Limited lumbar flexion and extension. Tight hip flexors bilaterally. Core strength 2+/5.'
);

INSERT INTO movement_tests (assessment_id, test_name, test_category, skeleton_data, status)
VALUES
(101, 'Bodyweight Squat', 'squat', '{"analysis":{"rom_score":71.8,"form_quality":68.2,"balance_score":75.5},"angles":[{"knee_left":120,"knee_right":118,"hip_left":98,"hip_right":95}],"maxAngles":{"knee_left":123,"knee_right":121,"hip_left":101,"hip_right":98}}', 'completed'),
(101, 'Hip Flexor Stretch', 'flexibility', '{"analysis":{"rom_score":60.4,"form_quality":63.5},"angles":[{"hip_left":85,"hip_right":78}],"maxAngles":{"hip_left":85,"hip_right":78}}', 'completed'),
(101, 'Plank Hold', 'stability', '{"analysis":{"stability_score":55.7,"form_quality":52.3},"duration":25}', 'completed'),
(101, 'Bridge Hold', 'stability', '{"analysis":{"stability_score":68.4,"form_quality":71.2},"duration":35}', 'completed');

-- DEMO PATIENT 3: Elderly Fall Prevention
INSERT INTO patients (
    id, first_name, last_name, date_of_birth, gender, email, phone,
    address_line1, city, state, zip_code,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    height_cm, weight_kg,
    chief_complaint, pain_scale, activity_level, assessment_reason
) VALUES (
    102,
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
    160.0,
    58.0,
    'Recent near-fall episodes, decreased balance confidence, general weakness',
    3,
    'limited',
    'fall_prevention'
);

INSERT INTO assessments (id, patient_id, assessment_type, status, assessment_date, clinical_notes)
VALUES (
    102,
    102,
    'initial_evaluation',
    'completed',
    '2025-10-18 09:30:00',
    'High fall risk assessment. Positive Romberg test. TUG test: 18 seconds (abnormal). Decreased ankle dorsiflexion bilaterally. Lower extremity strength 3/5.'
);

INSERT INTO movement_tests (assessment_id, test_name, test_category, skeleton_data, status)
VALUES
(102, 'Chair Stand Test', 'strength', '{"analysis":{"rom_score":58.2,"form_quality":61.5,"balance_score":55.8},"angles":[{"knee_left":115,"knee_right":112,"hip_left":88,"hip_right":85}],"maxAngles":{"knee_left":117,"knee_right":114,"hip_left":90,"hip_right":87}}', 'completed'),
(102, 'Single Leg Balance - Left', 'balance', '{"analysis":{"balance_score":42.3,"stability_score":38.7,"form_quality":45.1},"duration":8}', 'completed'),
(102, 'Single Leg Balance - Right', 'balance', '{"analysis":{"balance_score":38.5,"stability_score":35.2,"form_quality":40.8},"duration":6}', 'completed'),
(102, 'Tandem Stance', 'balance', '{"analysis":{"balance_score":48.6,"stability_score":51.2},"duration":12}', 'completed');
