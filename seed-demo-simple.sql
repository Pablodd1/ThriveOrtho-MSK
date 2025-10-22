-- Simplified Demo Data for F-AI bian Assessment System

-- Demo Patients
INSERT OR IGNORE INTO patients (id, first_name, last_name, date_of_birth, gender, email, phone, address_line1, city, state, zip_code, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, assessment_reason, chief_complaint, pain_scale, activity_level, height_cm, weight_kg, created_at, updated_at)
VALUES 
(100, 'Robert', 'Thompson', '1950-03-15', 'male', 'robert.thompson@email.com', '555-0101', '123 Oak Street', 'Miami', 'FL', '33101', 'Mary Thompson', '555-0102', 'Wife', 'post_surgery', 'Right hip pain post hip replacement surgery', 6, 'sedentary', 175.0, 85.5, datetime('now', '-30 days'), datetime('now', '-30 days')),
(101, 'Margaret', 'Chen', '1945-08-22', 'female', 'margaret.chen@email.com', '555-0201', '456 Maple Avenue', 'Fort Lauderdale', 'FL', '33301', 'David Chen', '555-0202', 'Son', 'fall_prevention', 'Multiple near-falls, balance difficulties', 3, 'light', 162.0, 58.3, datetime('now', '-25 days'), datetime('now', '-25 days')),
(102, 'James', 'Martinez', '1968-11-10', 'male', 'james.martinez@email.com', '555-0301', '789 Pine Road', 'Orlando', 'FL', '32801', 'Lisa Martinez', '555-0302', 'Wife', 'chronic_pain', 'Persistent lower back pain radiating down left leg', 7, 'light', 180.0, 95.2, datetime('now', '-20 days'), datetime('now', '-20 days')),
(103, 'Eleanor', 'Williams', '1952-05-30', 'female', 'eleanor.williams@email.com', '555-0401', '321 Elm Street', 'Tampa', 'FL', '33601', 'Richard Williams', '555-0402', 'Husband', 'mobility_decline', 'Bilateral knee pain, unable to continue tennis', 5, 'moderate', 168.0, 72.8, datetime('now', '-15 days'), datetime('now', '-15 days')),
(104, 'Michael', 'Johnson', '1985-09-14', 'male', 'michael.johnson@email.com', '555-0501', '654 Cedar Lane', 'Jacksonville', 'FL', '32099', 'Sarah Johnson', '555-0502', 'Sister', 'balance_issues', 'Dizziness and balance problems since concussion', 4, 'active', 188.0, 92.5, datetime('now', '-10 days'), datetime('now', '-10 days'));

-- Demo Assessments
INSERT OR IGNORE INTO assessments (id, patient_id, assessment_type, status, clinical_notes, completed_at, created_at)
VALUES 
(200, 100, 'initial', 'completed', 'Initial post-op assessment. Limited ROM in hip flexion (80°). Gait antalgic. Pain 6/10.', datetime('now', '-29 days'), datetime('now', '-29 days')),
(201, 101, 'initial', 'completed', 'Fall risk assessment. Berg Balance Scale: 42/56. TUG: 18 seconds. High risk.', datetime('now', '-24 days'), datetime('now', '-24 days')),
(202, 102, 'initial', 'completed', 'Chronic low back pain. Limited lumbar flexion (40°). Positive SLR 45° left. Core 2/5.', datetime('now', '-19 days'), datetime('now', '-19 days')),
(203, 103, 'initial', 'completed', 'Knee OA bilateral. ROM: R 5-110°, L 0-105°. Quad 3+/5. 6MWT: 280m.', datetime('now', '-14 days'), datetime('now', '-14 days')),
(204, 104, 'initial', 'completed', 'Post-concussion vestibular. Positive DVA test. BESS: 22 errors. Abnormal head thrust.', datetime('now', '-9 days'), datetime('now', '-9 days'));

-- Demo Movement Tests
INSERT OR IGNORE INTO movement_tests (id, assessment_id, test_name, status, score, skeleton_data, completed_at, created_at)
VALUES 
(300, 200, 'Bodyweight Squat', 'completed', 65.3, '{"reps": 8, "duration": 45, "analysis": {"form_quality": 65.3, "rom_score": 58.7, "balance_score": 72.1}}', datetime('now', '-29 days'), datetime('now', '-29 days')),
(301, 200, 'Hip Flexor Stretch', 'completed', 71.2, '{"reps": 5, "duration": 150, "analysis": {"form_quality": 71.2, "rom_score": 62.4, "balance_score": 85.3}}', datetime('now', '-29 days'), datetime('now', '-29 days')),
(302, 201, 'Single Leg Stand', 'completed', 52.8, '{"reps": 6, "duration": 72, "analysis": {"form_quality": 52.8, "rom_score": 68.3, "balance_score": 48.5}}', datetime('now', '-24 days'), datetime('now', '-24 days')),
(303, 201, 'Tandem Walk', 'completed', 58.6, '{"reps": 1, "duration": 30, "analysis": {"form_quality": 58.6, "rom_score": 72.1, "balance_score": 51.3}}', datetime('now', '-24 days'), datetime('now', '-24 days')),
(304, 202, 'Cat-Cow Stretch', 'completed', 74.5, '{"reps": 10, "duration": 60, "analysis": {"form_quality": 74.5, "rom_score": 68.9, "balance_score": 88.2}}', datetime('now', '-19 days'), datetime('now', '-19 days')),
(305, 202, 'Bird Dog Exercise', 'completed', 62.7, '{"reps": 8, "duration": 80, "analysis": {"form_quality": 62.7, "rom_score": 71.4, "balance_score": 65.8}}', datetime('now', '-19 days'), datetime('now', '-19 days')),
(306, 203, 'Sit to Stand', 'completed', 76.8, '{"reps": 10, "duration": 30, "analysis": {"form_quality": 76.8, "rom_score": 72.3, "balance_score": 81.5}}', datetime('now', '-14 days'), datetime('now', '-14 days')),
(307, 203, 'Heel Raises', 'completed', 82.4, '{"reps": 15, "duration": 45, "analysis": {"form_quality": 82.4, "rom_score": 85.7, "balance_score": 79.3}}', datetime('now', '-14 days'), datetime('now', '-14 days')),
(308, 204, 'Head Turns', 'completed', 65.9, '{"reps": 20, "duration": 40, "analysis": {"form_quality": 65.9, "rom_score": 78.6, "balance_score": 58.4}}', datetime('now', '-9 days'), datetime('now', '-9 days')),
(309, 204, 'Balance Board Exercise', 'completed', 55.3, '{"reps": 1, "duration": 120, "analysis": {"form_quality": 55.3, "rom_score": 68.1, "balance_score": 52.7}}', datetime('now', '-9 days'), datetime('now', '-9 days'));
