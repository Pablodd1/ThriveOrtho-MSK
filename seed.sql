-- TeleMed AI Platform - Seed Data for Development
-- Run: npx wrangler d1 execute telemed-production --local --file=./seed.sql

-- ============================================
-- SAMPLE USERS
-- ============================================

-- Admin user (password: admin123)
INSERT OR IGNORE INTO users (id, email, password_hash, role, email_verified, status) VALUES
('admin-001', 'admin@telemed.ai', '$2b$10$YourHashedPasswordHere', 'admin', 1, 'active');

-- Doctor users (password: doctor123)
INSERT OR IGNORE INTO users (id, email, password_hash, role, email_verified, status) VALUES
('user-doc-001', 'dr.smith@telemed.ai', '$2b$10$YourHashedPasswordHere', 'doctor', 1, 'active'),
('user-doc-002', 'dr.johnson@telemed.ai', '$2b$10$YourHashedPasswordHere', 'doctor', 1, 'active'),
('user-doc-003', 'dr.patel@telemed.ai', '$2b$10$YourHashedPasswordHere', 'doctor', 1, 'active');

-- Patient users (password: patient123)
INSERT OR IGNORE INTO users (id, email, password_hash, role, email_verified, status) VALUES
('user-pat-001', 'john.doe@email.com', '$2b$10$YourHashedPasswordHere', 'patient', 1, 'active'),
('user-pat-002', 'jane.smith@email.com', '$2b$10$YourHashedPasswordHere', 'patient', 1, 'active'),
('user-pat-003', 'mike.wilson@email.com', '$2b$10$YourHashedPasswordHere', 'patient', 1, 'active');

-- ============================================
-- SAMPLE DOCTORS
-- ============================================

INSERT OR IGNORE INTO doctors (id, user_id, first_name, last_name, license_number, license_state, specialization, sub_specializations, years_experience, education, certifications, languages, bio, consultation_fee, available_hours, rating, total_reviews, verified, verified_at) VALUES
(
    'doc-001',
    'user-doc-001',
    'Sarah',
    'Smith',
    'MD-12345-CA',
    'CA',
    'General Practice',
    '["Family Medicine", "Preventive Care"]',
    15,
    '[{"degree": "MD", "institution": "Stanford University", "year": 2009}, {"degree": "Residency", "institution": "UCSF Medical Center", "year": 2012}]',
    '["Board Certified Family Medicine", "ACLS Certified"]',
    '["English", "Spanish"]',
    'Dr. Sarah Smith is a board-certified family medicine physician with over 15 years of experience. She specializes in preventive care and chronic disease management.',
    75.00,
    '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "13:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "15:00"}}',
    4.8,
    156,
    1,
    datetime('now')
),
(
    'doc-002',
    'user-doc-002',
    'Michael',
    'Johnson',
    'MD-67890-NY',
    'NY',
    'Dermatology',
    '["Medical Dermatology", "Cosmetic Dermatology", "Skin Cancer Screening"]',
    12,
    '[{"degree": "MD", "institution": "Harvard Medical School", "year": 2011}, {"degree": "Residency", "institution": "NYU Langone", "year": 2015}]',
    '["Board Certified Dermatology", "Fellow of AAD"]',
    '["English"]',
    'Dr. Michael Johnson is a leading dermatologist specializing in both medical and cosmetic dermatology. Expert in AI-assisted skin condition diagnosis.',
    120.00,
    '{"monday": {"start": "10:00", "end": "18:00"}, "tuesday": {"start": "10:00", "end": "18:00"}, "wednesday": {"start": "10:00", "end": "18:00"}, "thursday": {"start": "10:00", "end": "18:00"}}',
    4.9,
    203,
    1,
    datetime('now')
),
(
    'doc-003',
    'user-doc-003',
    'Priya',
    'Patel',
    'MD-24680-TX',
    'TX',
    'Internal Medicine',
    '["Diabetes Management", "Cardiovascular Health", "Geriatric Medicine"]',
    10,
    '[{"degree": "MD", "institution": "Johns Hopkins", "year": 2013}, {"degree": "Residency", "institution": "Baylor College of Medicine", "year": 2016}]',
    '["Board Certified Internal Medicine", "Certified Diabetes Educator"]',
    '["English", "Hindi", "Gujarati"]',
    'Dr. Priya Patel specializes in internal medicine with a focus on diabetes management and cardiovascular health. She is passionate about using technology to improve patient outcomes.',
    90.00,
    '{"monday": {"start": "08:00", "end": "16:00"}, "tuesday": {"start": "08:00", "end": "16:00"}, "wednesday": {"start": "08:00", "end": "16:00"}, "thursday": {"start": "08:00", "end": "16:00"}, "friday": {"start": "08:00", "end": "12:00"}}',
    4.7,
    89,
    1,
    datetime('now')
);

-- ============================================
-- SAMPLE PATIENTS
-- ============================================

INSERT OR IGNORE INTO patients (id, user_id, first_name, last_name, date_of_birth, gender, phone, address, city, state, zip_code, blood_type, allergies, chronic_conditions, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_policy_number) VALUES
(
    'pat-001',
    'user-pat-001',
    'John',
    'Doe',
    '1985-03-15',
    'male',
    '+1-555-123-4567',
    '123 Main Street, Apt 4B',
    'San Francisco',
    'CA',
    '94102',
    'O+',
    '["Penicillin", "Shellfish"]',
    '["Hypertension"]',
    'Jane Doe',
    '+1-555-123-4568',
    'Blue Cross Blue Shield',
    'BCBS-123456789'
),
(
    'pat-002',
    'user-pat-002',
    'Jane',
    'Smith',
    '1990-07-22',
    'female',
    '+1-555-234-5678',
    '456 Oak Avenue',
    'New York',
    'NY',
    '10001',
    'A-',
    '["Latex"]',
    '[]',
    'John Smith',
    '+1-555-234-5679',
    'Aetna',
    'AET-987654321'
),
(
    'pat-003',
    'user-pat-003',
    'Mike',
    'Wilson',
    '1978-11-08',
    'male',
    '+1-555-345-6789',
    '789 Elm Street',
    'Austin',
    'TX',
    '78701',
    'B+',
    '[]',
    '["Type 2 Diabetes", "High Cholesterol"]',
    'Sarah Wilson',
    '+1-555-345-6780',
    'UnitedHealthcare',
    'UHC-456789123'
);

-- ============================================
-- SAMPLE DOCTOR AVAILABILITY
-- ============================================

-- Dr. Smith availability
INSERT OR IGNORE INTO doctor_availability (id, doctor_id, day_of_week, start_time, end_time, slot_duration_minutes) VALUES
('avail-001', 'doc-001', 1, '09:00', '17:00', 30),
('avail-002', 'doc-001', 2, '09:00', '17:00', 30),
('avail-003', 'doc-001', 3, '09:00', '13:00', 30),
('avail-004', 'doc-001', 4, '09:00', '17:00', 30),
('avail-005', 'doc-001', 5, '09:00', '15:00', 30);

-- Dr. Johnson availability
INSERT OR IGNORE INTO doctor_availability (id, doctor_id, day_of_week, start_time, end_time, slot_duration_minutes) VALUES
('avail-006', 'doc-002', 1, '10:00', '18:00', 30),
('avail-007', 'doc-002', 2, '10:00', '18:00', 30),
('avail-008', 'doc-002', 3, '10:00', '18:00', 30),
('avail-009', 'doc-002', 4, '10:00', '18:00', 30);

-- Dr. Patel availability
INSERT OR IGNORE INTO doctor_availability (id, doctor_id, day_of_week, start_time, end_time, slot_duration_minutes) VALUES
('avail-010', 'doc-003', 1, '08:00', '16:00', 30),
('avail-011', 'doc-003', 2, '08:00', '16:00', 30),
('avail-012', 'doc-003', 3, '08:00', '16:00', 30),
('avail-013', 'doc-003', 4, '08:00', '16:00', 30),
('avail-014', 'doc-003', 5, '08:00', '12:00', 30);

-- ============================================
-- SAMPLE APPOINTMENTS
-- ============================================

INSERT OR IGNORE INTO appointments (id, patient_id, doctor_id, scheduled_at, duration_minutes, status, consultation_type, reason_for_visit, symptoms, ai_triage_score) VALUES
(
    'appt-001',
    'pat-001',
    'doc-001',
    datetime('now', '+1 day', 'start of day', '+10 hours'),
    30,
    'confirmed',
    'video',
    'Annual checkup and blood pressure follow-up',
    '["Occasional headaches", "Mild fatigue"]',
    3
),
(
    'appt-002',
    'pat-002',
    'doc-002',
    datetime('now', '+2 days', 'start of day', '+14 hours'),
    30,
    'scheduled',
    'video',
    'Skin rash evaluation',
    '["Itchy red patches on arms", "Appeared 3 days ago"]',
    5
),
(
    'appt-003',
    'pat-003',
    'doc-003',
    datetime('now', '+3 days', 'start of day', '+9 hours'),
    45,
    'scheduled',
    'video',
    'Diabetes management follow-up',
    '["Blood sugar fluctuations", "Increased thirst"]',
    6
);

-- ============================================
-- SAMPLE AI ANALYSES
-- ============================================

INSERT OR IGNORE INTO ai_analyses (id, patient_id, appointment_id, ai_service, analysis_type, input_type, input_reference, result, confidence_score, processing_time_ms, model_version) VALUES
(
    'ai-001',
    'pat-001',
    'appt-001',
    'openai',
    'symptom_triage',
    'text',
    'Patient reports occasional headaches and mild fatigue for the past 2 weeks',
    '{"urgency_score": 3, "category": "routine", "possible_conditions": ["Tension headaches", "Stress-related fatigue", "Blood pressure related"], "recommended_action": "Schedule routine consultation", "red_flags": false}',
    0.87,
    1250,
    'gpt-4o-2024-11'
),
(
    'ai-002',
    'pat-002',
    'appt-002',
    'legit_health',
    'image_analysis',
    'image',
    'r2://telemed-medical-images/patients/pat-002/skin/2025-12-20_rash.jpg',
    '{"condition": "Contact Dermatitis", "confidence": 0.82, "severity": "mild", "differential_diagnosis": ["Eczema", "Psoriasis"], "recommended_action": "Topical corticosteroid may be beneficial", "additional_tests": ["Patch testing if symptoms persist"]}',
    0.82,
    2340,
    'legit-health-v2.1'
);

-- ============================================
-- SAMPLE NOTIFICATIONS
-- ============================================

INSERT OR IGNORE INTO notifications (id, user_id, type, title, message, data, channel) VALUES
('notif-001', 'user-pat-001', 'appointment_confirmed', 'Appointment Confirmed', 'Your appointment with Dr. Sarah Smith has been confirmed for tomorrow at 10:00 AM.', '{"appointment_id": "appt-001", "doctor_name": "Dr. Sarah Smith"}', 'in_app'),
('notif-002', 'user-doc-001', 'new_appointment', 'New Appointment', 'You have a new appointment with John Doe scheduled for tomorrow at 10:00 AM.', '{"appointment_id": "appt-001", "patient_name": "John Doe"}', 'in_app');

-- ============================================
-- SAMPLE AUDIT LOGS
-- ============================================

INSERT OR IGNORE INTO audit_logs (id, user_id, action, resource_type, resource_id, ip_address, details, status) VALUES
('audit-001', 'user-pat-001', 'login', NULL, NULL, '192.168.1.100', '{"method": "password", "mfa_used": false}', 'success'),
('audit-002', 'user-pat-001', 'view_record', 'medical_record', 'record-001', '192.168.1.100', '{"record_type": "consultation"}', 'success'),
('audit-003', 'user-doc-001', 'create_appointment', 'appointment', 'appt-001', '192.168.1.101', '{"patient_id": "pat-001"}', 'success');
