-- Add KAMS Assessment Data for Demo Patient Sarah Mitchell (ID: 999)
-- This demonstrates the KAMS (Kinetic Analysis & Movement Screen) feature
-- showing progression from initial to follow-up assessment

-- Create KAMS assessments table if not exists
CREATE TABLE IF NOT EXISTS kams_assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  assessment_date TEXT NOT NULL,
  assessment_type TEXT DEFAULT 'KAMS Movement Analysis',
  assessor TEXT DEFAULT 'AI-Powered System',
  
  -- Overall scores
  overall_score INTEGER NOT NULL CHECK(overall_score >= 0 AND overall_score <= 100),
  score_rating TEXT CHECK(score_rating IN ('Excellent', 'Good', 'Fair', 'Poor')),
  
  -- Core metrics (0-100 scale)
  dynamic_posture_index INTEGER CHECK(dynamic_posture_index >= 0 AND dynamic_posture_index <= 100),
  dynamic_posture_rating TEXT,
  
  lower_extremity_power INTEGER CHECK(lower_extremity_power >= 0 AND lower_extremity_power <= 100),
  lower_extremity_rating TEXT,
  
  functional_asymmetry INTEGER CHECK(functional_asymmetry >= 0 AND functional_asymmetry <= 100),
  functional_asymmetry_rating TEXT,
  
  injury_susceptibility INTEGER CHECK(injury_susceptibility >= 0 AND injury_susceptibility <= 100),
  injury_susceptibility_rating TEXT,
  
  -- Additional data
  dysfunction_regions TEXT, -- JSON: {upperBody: [], lowerBody: [], spinal: []}
  recommendations TEXT, -- JSON: [{category, priority, interventions}]
  treatment_protocol TEXT, -- JSON: {phase1, phase2, phase3}
  
  -- Metadata
  total_frames INTEGER,
  assessment_duration INTEGER, -- seconds
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Sarah Mitchell - Initial KAMS Assessment (Day 1, 2024-09-15)
-- Post-ACL reconstruction, week 6
INSERT INTO kams_assessments (
  patient_id,
  assessment_date,
  overall_score,
  score_rating,
  dynamic_posture_index,
  dynamic_posture_rating,
  lower_extremity_power,
  lower_extremity_rating,
  functional_asymmetry,
  functional_asymmetry_rating,
  injury_susceptibility,
  injury_susceptibility_rating,
  dysfunction_regions,
  recommendations,
  treatment_protocol,
  total_frames,
  assessment_duration,
  notes
) VALUES (
  999, -- Sarah Mitchell
  '2024-09-15',
  64,
  'Fair',
  77,
  'Great',
  54,
  'Moderate',
  92,
  'Great',
  59,
  'Moderate',
  json('{"upperBody":[],"lowerBody":[{"location":"Right Knee","plane":"FP","severity":"High","issue":"valgus/instability"},{"location":"Right Hip","plane":"SP","severity":"Moderate","issue":"weakness/reduced ROM"},{"location":"Right Ankle","plane":"TP","severity":"Low","issue":"reduced dorsiflexion"}],"spinal":[{"location":"Lumbar","plane":"SP","severity":"Low","issue":"mild anterior pelvic tilt"}]}'),
  json('[{"category":"Strength & Power","priority":"Critical","interventions":["Progressive quad strengthening (R > L)","Closed-chain exercises for knee stability","Gradual plyometric progression","Single-leg balance and proprioception"]},{"category":"Injury Prevention","priority":"High","interventions":["Knee valgus correction drills","Hip abductor strengthening","Landing mechanics training","Movement screening and modification"]},{"category":"Lower Body Dysfunction","priority":"High","interventions":["Hip strengthening (glute med/max)","Ankle mobility and stability","Knee alignment training","Single-leg balance progression"]}]'),
  json('{"phase1":{"name":"Foundation & Correction (Weeks 1-4)","frequency":"3x/week","focus":["Knee stability and alignment","Quad strengthening (surgical side)","Hip abductor activation","Proprioception training"],"exercises":["Quad sets and straight leg raises","Clamshells and side-lying hip abduction","Single-leg stance progression (eyes open → closed)","Mini squats with mirror feedback","Ankle pumps and dorsiflexion stretches"]},"phase2":{"name":"Strengthening & Integration (Weeks 5-8)","frequency":"2-3x/week","focus":["Progressive resistance training","Functional movement patterns","Asymmetry reduction","Dynamic stability"],"exercises":["Bulgarian split squats (R emphasis)","Step-ups and step-downs","Lateral band walks","Single-leg deadlifts","Controlled lunges (sagittal and frontal planes)"]},"phase3":{"name":"Functional & Return to Running (Weeks 9-12)","frequency":"2x/week + running progression","focus":["Return to running mechanics","Plyometric training","Sport-specific drills","Endurance building"],"exercises":["Walk-jog intervals on flat surface","Low-impact plyometrics (box steps, small hops)","Agility drills (lateral shuffle, carioca)","Running form analysis and correction","Progressive distance building (5K goal)"]}}'),
  900,
  180,
  'Initial assessment post-ACL reconstruction. Significant right knee instability with compensatory patterns. Patient motivated and compliant with HEP.'
);

-- Sarah Mitchell - Week 4 KAMS Re-assessment (2024-10-13)
-- Post-ACL reconstruction, week 10 - showing improvement
INSERT INTO kams_assessments (
  patient_id,
  assessment_date,
  overall_score,
  score_rating,
  dynamic_posture_index,
  dynamic_posture_rating,
  lower_extremity_power,
  lower_extremity_rating,
  functional_asymmetry,
  functional_asymmetry_rating,
  injury_susceptibility,
  injury_susceptibility_rating,
  dysfunction_regions,
  recommendations,
  treatment_protocol,
  total_frames,
  assessment_duration,
  notes
) VALUES (
  999,
  '2024-10-13',
  72,
  'Good',
  82,
  'Great',
  65,
  'Good',
  95,
  'Great',
  42,
  'Mild',
  json('{"upperBody":[],"lowerBody":[{"location":"Right Knee","plane":"FP","severity":"Moderate","issue":"mild valgus tendency"},{"location":"Right Hip","plane":"SP","severity":"Low","issue":"improving strength/ROM"},{"location":"Right Ankle","plane":"TP","severity":"none","issue":"normal dorsiflexion"}],"spinal":[]}'),
  json('[{"category":"Strength & Power","priority":"High","interventions":["Continue progressive quad strengthening","Introduce plyometric exercises","Unilateral strengthening focus","Advanced balance challenges"]},{"category":"Movement Quality","priority":"Medium","interventions":["Maintain knee alignment awareness","Running mechanics preparation","Sport-specific movement patterns","Continue proprioceptive training"]},{"category":"Return to Activity","priority":"Medium","interventions":["Begin walk-jog progression","Gradual return to sport drills","Continue injury prevention exercises","Confidence building in movement"]}]'),
  json('{"phase1":{"name":"Advanced Strengthening (Weeks 11-14)","frequency":"2-3x/week","focus":["High-level strength development","Plyometric progression","Running preparation","Confidence building"],"exercises":["Heavy Bulgarian split squats","Box jumps (bilateral → unilateral)","Sprint drills and acceleration","Advanced single-leg exercises","Reactive agility work"]},"phase2":{"name":"Return to Running (Weeks 15-18)","frequency":"2x/week + running 3x/week","focus":["Running volume progression","Movement quality maintenance","Sport-specific conditioning","Injury prevention sustainability"],"exercises":["Progressive running program (5K)","Tempo runs and intervals","Lateral movement drills","Continued strength maintenance","Movement screening monthly"]},"phase3":{"name":"Return to Sport & Maintenance (Weeks 19+)","frequency":"1x/week PT + independent training","focus":["Full return to running","Competitive readiness (if applicable)","Long-term injury prevention","Independent program execution"],"exercises":["Full running training plan","Race-specific preparation","Maintenance strength work","Self-monitoring and adjustment","Periodic PT check-ins"]}}'),
  950,
  180,
  'Excellent progress. Knee stability significantly improved. Right leg strength at 85% of left. Patient cleared for early jog progression. Continue current protocol with gradual running integration.'
);

-- Sarah Mitchell - Week 8 KAMS Final Assessment (2024-11-10)
-- Post-ACL reconstruction, week 14 - approaching normal function
INSERT INTO kams_assessments (
  patient_id,
  assessment_date,
  overall_score,
  score_rating,
  dynamic_posture_index,
  dynamic_posture_rating,
  lower_extremity_power,
  lower_extremity_rating,
  functional_asymmetry,
  functional_asymmetry_rating,
  injury_susceptibility,
  injury_susceptibility_rating,
  dysfunction_regions,
  recommendations,
  treatment_protocol,
  total_frames,
  assessment_duration,
  notes
) VALUES (
  999,
  '2024-11-10',
  86,
  'Excellent',
  90,
  'Great',
  82,
  'Great',
  97,
  'Great',
  22,
  'Low',
  json('{"upperBody":[],"lowerBody":[{"location":"Right Knee","plane":"FP","severity":"none","issue":"normal alignment"},{"location":"Right Hip","plane":"SP","severity":"none","issue":"full strength/ROM"},{"location":"Right Ankle","plane":"TP","severity":"none","issue":"normal function"}],"spinal":[]}'),
  json('[{"category":"Maintenance & Prevention","priority":"Low","interventions":["Continue strength training 2x/week","Monthly movement screening","Gradual running volume progression","Maintain flexibility and mobility work"]},{"category":"Return to Sport","priority":"Low","interventions":["Full clearance for running activities","Sport-specific training as desired","Self-directed exercise program","Periodic PT follow-up as needed"]},{"category":"Long-term Health","priority":"Low","interventions":["Sustainable exercise routine","Injury prevention awareness","Listen to body signals","Annual movement screening recommended"]}]'),
  json('{"phase1":{"name":"Maintenance & Optimization (Ongoing)","frequency":"Self-directed + 1x/month PT","focus":["Maintain current function","Continue running progression","Prevent re-injury","Long-term health"],"exercises":["Strength training 2x/week","Running 3-4x/week (gradually increasing)","Flexibility/mobility work","Sport-specific training as desired","Self-monitoring and adjustment"]},"phase2":{"name":"Advanced Training (Optional)","frequency":"Self-directed","focus":["Performance optimization","Competitive training (if desired)","Advanced strength/power","Sport specialization"],"exercises":["Advanced plyometrics","Speed and agility work","Endurance building (>5K)","Strength training progression","Sport-specific skills"]},"phase3":{"name":"Long-term Prevention (Lifelong)","frequency":"Ongoing self-management","focus":["Injury prevention awareness","Sustainable training","Health maintenance","Quality of life"],"exercises":["Regular movement screening","Varied exercise routine","Strength maintenance","Flexibility work","Enjoyable physical activities"]}}'),
  1000,
  180,
  'Outstanding recovery. All metrics within normal range. Right knee strength 95% of left. No compensatory patterns observed. Patient running 3 miles comfortably. Cleared for discharge with maintenance program. 5K race goal achievable within 4 weeks.'
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_kams_patient_date ON kams_assessments(patient_id, assessment_date DESC);
CREATE INDEX IF NOT EXISTS idx_kams_score ON kams_assessments(overall_score DESC);

-- Summary: Sarah Mitchell KAMS Journey
-- Week 6 (Initial): KAMS 64% (Fair) - Significant knee instability, moderate dysfunction
-- Week 10 (Re-test): KAMS 72% (Good) - Improving strength, reduced injury risk
-- Week 14 (Final): KAMS 86% (Excellent) - Near-normal function, ready for discharge

-- Progress:
-- Overall KAMS Score: 64% → 86% (+22 points, +34% improvement)
-- Dynamic Posture: 77% → 90% (+13 points)
-- Lower Extremity Power: 54% → 82% (+28 points, +52% improvement)
-- Functional Asymmetry: 92% → 97% (+5 points)
-- Injury Susceptibility: 59% → 22% (-37 points, -63% risk reduction)
