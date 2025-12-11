-- Demo Patient KAMS Assessment Data
-- Add KAMS assessments for Sarah Mitchell to demonstrate KAMS functionality

-- Create KAMS assessments table (if not exists from migration)
CREATE TABLE IF NOT EXISTS kams_assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  assessment_date TEXT NOT NULL,
  assessment_type TEXT DEFAULT 'KAMS Movement Analysis',
  assessor TEXT DEFAULT 'AI-Powered System',
  overall_score INTEGER NOT NULL,
  score_rating TEXT,
  dynamic_posture_index INTEGER,
  dynamic_posture_rating TEXT,
  lower_extremity_power INTEGER,
  lower_extremity_rating TEXT,
  functional_asymmetry INTEGER,
  functional_asymmetry_rating TEXT,
  injury_susceptibility INTEGER,
  injury_susceptibility_rating TEXT,
  dysfunction_regions TEXT,
  recommendations TEXT,
  treatment_protocol TEXT,
  total_frames INTEGER,
  assessment_duration INTEGER,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Sarah Mitchell - Initial KAMS (Day 1)
INSERT INTO kams_assessments (patient_id, assessment_date, overall_score, score_rating, dynamic_posture_index, dynamic_posture_rating, lower_extremity_power, lower_extremity_rating, functional_asymmetry, functional_asymmetry_rating, injury_susceptibility, injury_susceptibility_rating, dysfunction_regions, recommendations, treatment_protocol, total_frames, assessment_duration, notes) 
VALUES (999, '2024-09-15', 64, 'Fair', 77, 'Great', 54, 'Moderate', 92, 'Great', 59, 'Moderate', 
'{"upperBody":[],"lowerBody":[{"location":"Right Knee","plane":"FP","severity":"High","issue":"valgus/instability"},{"location":"Right Hip","plane":"SP","severity":"Moderate","issue":"weakness/reduced ROM"}],"spinal":[{"location":"Lumbar","plane":"SP","severity":"Low","issue":"mild pelvic tilt"}]}', 
'[{"category":"Strength & Power","priority":"Critical","interventions":["Progressive quad strengthening","Knee stability exercises","Single-leg balance training"]},{"category":"Injury Prevention","priority":"High","interventions":["Knee valgus correction","Hip strengthening","Movement pattern training"]}]', 
'{"phase1":{"name":"Foundation (Weeks 1-4)","frequency":"3x/week","focus":["Knee stability","Quad strengthening","Hip activation"],"exercises":["Quad sets","Clamshells","Single-leg stance","Mini squats"]}}', 
900, 180, 'Initial assessment. Significant right knee instability.');

-- Sarah Mitchell - Week 4 Re-assessment
INSERT INTO kams_assessments (patient_id, assessment_date, overall_score, score_rating, dynamic_posture_index, dynamic_posture_rating, lower_extremity_power, lower_extremity_rating, functional_asymmetry, functional_asymmetry_rating, injury_susceptibility, injury_susceptibility_rating, dysfunction_regions, recommendations, treatment_protocol, total_frames, assessment_duration, notes) 
VALUES (999, '2024-10-13', 72, 'Good', 82, 'Great', 65, 'Good', 95, 'Great', 42, 'Mild', 
'{"upperBody":[],"lowerBody":[{"location":"Right Knee","plane":"FP","severity":"Moderate","issue":"mild valgus"}],"spinal":[]}', 
'[{"category":"Strength & Power","priority":"High","interventions":["Continue strengthening","Introduce plyometrics","Advanced balance work"]},{"category":"Movement Quality","priority":"Medium","interventions":["Running mechanics prep","Sport-specific patterns"]}]', 
'{"phase2":{"name":"Strengthening (Weeks 5-8)","frequency":"2-3x/week","focus":["Progressive resistance","Functional patterns","Dynamic stability"],"exercises":["Bulgarian split squats","Step-ups","Lateral band walks"]}}', 
950, 180, 'Excellent progress. Right leg strength at 85%.');

-- Sarah Mitchell - Week 8 Final Assessment
INSERT INTO kams_assessments (patient_id, assessment_date, overall_score, score_rating, dynamic_posture_index, dynamic_posture_rating, lower_extremity_power, lower_extremity_rating, functional_asymmetry, functional_asymmetry_rating, injury_susceptibility, injury_susceptibility_rating, dysfunction_regions, recommendations, treatment_protocol, total_frames, assessment_duration, notes) 
VALUES (999, '2024-11-10', 86, 'Excellent', 90, 'Great', 82, 'Great', 97, 'Great', 22, 'Low', 
'{"upperBody":[],"lowerBody":[],"spinal":[]}', 
'[{"category":"Maintenance","priority":"Low","interventions":["Continue strength 2x/week","Monthly screening","Gradual volume progression"]},{"category":"Return to Sport","priority":"Low","interventions":["Full running clearance","Self-directed program","Periodic PT follow-up"]}]', 
'{"phase3":{"name":"Return to Running (Weeks 9-12)","frequency":"2x/week + running","focus":["Running mechanics","Plyometric training","Sport drills"],"exercises":["Walk-jog intervals","Box jumps","Agility drills","Running progression"]}}', 
1000, 180, 'Outstanding recovery. All metrics normal. Cleared for discharge.');

-- Create index
CREATE INDEX IF NOT EXISTS idx_kams_patient_date ON kams_assessments(patient_id, assessment_date DESC);
