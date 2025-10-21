-- Migration 0002: Seed Exercise Library
-- 17 therapeutic exercises across 6 categories

-- ============================================
-- MOBILITY EXERCISES (3)
-- ============================================

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Hip Flexor Stretch',
  'mobility',
  'Static stretch to improve hip flexion range of motion and reduce tightness in hip flexors',
  'Stand in lunge position with back knee on ground. Gently push hips forward while keeping torso upright. Hold for 30 seconds, repeat 3 times each side.',
  '["iliopsoas", "rectus_femoris", "tensor_fasciae_latae"]',
  '["hip"]',
  '["limited_hip_flexion", "hip_tightness", "lower_back_pain"]',
  2,
  '["acute_hip_injury", "hip_replacement_within_6_weeks"]',
  'Stop if sharp pain occurs. Avoid excessive arching of lower back.'
);

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Shoulder Circles',
  'mobility',
  'Dynamic shoulder mobilization exercise to improve shoulder range of motion',
  'Stand with feet shoulder-width apart. Slowly circle shoulders forward 10 times, then backward 10 times. Gradually increase circle size.',
  '["deltoids", "rotator_cuff", "trapezius"]',
  '["shoulder", "scapula"]',
  '["limited_shoulder_rom", "shoulder_stiffness", "frozen_shoulder"]',
  1,
  '["acute_shoulder_dislocation", "severe_shoulder_pain"]',
  'Keep movements slow and controlled. Stop if numbness or tingling occurs.'
);

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Cat-Cow Stretch',
  'mobility',
  'Spinal mobility exercise to improve flexibility in the spine and core',
  'Start on hands and knees. Arch back upward (cat) for 5 seconds, then curve back downward (cow) for 5 seconds. Repeat 10 times.',
  '["erector_spinae", "abdominals", "multifidus"]',
  '["spine", "thoracic", "lumbar"]',
  '["spinal_stiffness", "lower_back_pain", "poor_posture"]',
  1,
  '["acute_back_injury", "herniated_disc_with_symptoms"]',
  'Move slowly and within pain-free range. Avoid if experiencing sciatica.'
);

-- ============================================
-- STABILITY EXERCISES (3)
-- ============================================

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Plank Hold',
  'stability',
  'Core stabilization exercise to strengthen abdominal and back muscles',
  'Start in push-up position on forearms. Keep body straight from head to heels. Hold for 20-60 seconds. Rest and repeat 3 times.',
  '["rectus_abdominis", "transverse_abdominis", "erector_spinae", "deltoids"]',
  '["spine", "shoulder", "hip"]',
  '["core_weakness", "lower_back_instability", "poor_posture"]',
  3,
  '["acute_shoulder_injury", "uncontrolled_high_blood_pressure"]',
  'Avoid sagging hips or arching back. Breathe steadily throughout hold.'
);

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Bird Dog',
  'stability',
  'Dynamic stability exercise for core and spine stabilization',
  'Start on hands and knees. Extend right arm forward and left leg backward simultaneously. Hold 5 seconds. Return to start. Alternate sides. 10 reps each side.',
  '["erector_spinae", "multifidus", "gluteus_maximus", "deltoids"]',
  '["spine", "shoulder", "hip"]',
  '["spinal_instability", "core_weakness", "balance_deficit"]',
  2,
  '["acute_back_pain", "severe_shoulder_injury"]',
  'Keep hips level. Move slowly with control. Avoid rotating torso.'
);

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Side Plank',
  'stability',
  'Lateral core stabilization exercise targeting obliques and hip stabilizers',
  'Lie on side, prop up on forearm. Lift hips off ground, creating straight line from head to feet. Hold 20-45 seconds. Repeat 3 times each side.',
  '["obliques", "transverse_abdominis", "gluteus_medius", "quadratus_lumborum"]',
  '["spine", "shoulder", "hip"]',
  '["lateral_core_weakness", "hip_instability", "scoliosis"]',
  3,
  '["shoulder_impingement", "acute_rib_injury"]',
  'Keep body aligned. Avoid dropping hips. Breathe steadily.'
);

-- ============================================
-- STRENGTH EXERCISES (3)
-- ============================================

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Bodyweight Squats',
  'strength',
  'Lower body strengthening exercise for legs and hips',
  'Stand with feet shoulder-width apart. Lower hips back and down as if sitting in chair. Keep knees behind toes. Return to standing. 10-15 reps, 3 sets.',
  '["quadriceps", "gluteus_maximus", "hamstrings", "gastrocnemius"]',
  '["hip", "knee", "ankle"]',
  '["knee_weakness", "hip_weakness", "balance_deficit"]',
  2,
  '["acute_knee_injury", "hip_replacement_within_12_weeks"]',
  'Keep chest up and core engaged. Stop if knee pain occurs.'
);

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Wall Push-Ups',
  'strength',
  'Modified upper body strengthening for chest, shoulders, and arms',
  'Stand arm''s length from wall. Place hands on wall at shoulder height. Bend elbows to bring chest toward wall. Push back to start. 10-15 reps, 3 sets.',
  '["pectoralis_major", "deltoids", "triceps", "serratus_anterior"]',
  '["shoulder", "elbow", "wrist"]',
  '["upper_body_weakness", "shoulder_weakness", "poor_posture"]',
  1,
  '["acute_shoulder_injury", "recent_wrist_fracture"]',
  'Keep body straight. Move slowly with control. Stop if shoulder pain occurs.'
);

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Calf Raises',
  'strength',
  'Lower leg strengthening exercise for calf muscles and ankle stability',
  'Stand with feet hip-width apart. Rise up on toes as high as possible. Hold 2 seconds at top. Lower slowly. 15-20 reps, 3 sets.',
  '["gastrocnemius", "soleus", "tibialis_posterior"]',
  '["ankle"]',
  '["ankle_weakness", "calf_weakness", "balance_deficit"]',
  1,
  '["acute_ankle_sprain", "achilles_tendonitis_acute"]',
  'Hold onto support if needed for balance. Move through full range of motion.'
);

-- ============================================
-- FLEXIBILITY EXERCISES (3)
-- ============================================

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Hamstring Stretch',
  'flexibility',
  'Static stretch to improve hamstring flexibility and reduce lower back tension',
  'Sit on floor with one leg extended, other bent. Reach toward extended foot, keeping back straight. Hold 30 seconds. Repeat 3 times each leg.',
  '["hamstrings", "gastrocnemius", "erector_spinae"]',
  '["hip", "knee"]',
  '["hamstring_tightness", "limited_hip_flexion", "lower_back_pain"]',
  1,
  '["acute_hamstring_tear", "severe_sciatica"]',
  'Don''t bounce. Stretch to mild tension, not pain. Keep knee slightly bent if needed.'
);

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Quadriceps Stretch',
  'flexibility',
  'Static stretch for front thigh muscles to improve knee flexion',
  'Stand on one leg. Bend other knee, bringing heel toward buttock. Hold ankle with hand. Keep knees together. Hold 30 seconds. Repeat 3 times each leg.',
  '["rectus_femoris", "vastus_lateralis", "vastus_medialis"]',
  '["hip", "knee"]',
  '["quad_tightness", "limited_knee_flexion", "patellofemoral_syndrome"]',
  2,
  '["acute_knee_injury", "recent_knee_surgery"]',
  'Use wall for balance support. Don''t pull hard on ankle. Keep hips aligned.'
);

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Seated Spinal Twist',
  'flexibility',
  'Rotational flexibility exercise for spine and core',
  'Sit in chair with feet flat. Place right hand on left knee. Rotate torso to left, looking over left shoulder. Hold 20 seconds. Repeat 3 times each side.',
  '["obliques", "erector_spinae", "multifidus"]',
  '["spine", "thoracic"]',
  '["spinal_stiffness", "poor_rotation", "lower_back_pain"]',
  1,
  '["acute_disc_herniation", "spinal_stenosis_with_symptoms"]',
  'Move slowly into rotation. Stop if sharp pain occurs. Keep shoulders level.'
);

-- ============================================
-- BALANCE EXERCISES (3)
-- ============================================

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Single Leg Stand',
  'balance',
  'Static balance exercise to improve stability and reduce fall risk',
  'Stand near wall or counter for support. Lift one foot off ground, balance on other leg for 30 seconds. Repeat 3 times each leg.',
  '["hip_abductors", "gluteus_medius", "ankle_stabilizers"]',
  '["hip", "knee", "ankle"]',
  '["balance_deficit", "fall_risk", "ankle_instability"]',
  2,
  '["severe_vertigo", "acute_ankle_injury"]',
  'Keep support surface nearby. Progress by closing eyes or standing on unstable surface.'
);

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Heel-to-Toe Walk',
  'balance',
  'Dynamic balance exercise improving coordination and gait stability',
  'Walk forward in straight line, placing heel of front foot directly against toes of back foot. Take 20 steps forward, turn around, return. Repeat 3 times.',
  '["hip_stabilizers", "core_muscles", "ankle_stabilizers"]',
  '["hip", "knee", "ankle"]',
  '["balance_deficit", "gait_instability", "fall_risk"]',
  2,
  '["severe_balance_impairment", "acute_lower_extremity_injury"]',
  'Use wall or rail for light support if needed. Look forward, not down at feet.'
);

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Standing March',
  'balance',
  'Dynamic balance exercise combining marching with balance challenge',
  'Stand with feet hip-width apart. March in place, lifting knees to hip height. Maintain upright posture. March for 60 seconds. Repeat 3 sets.',
  '["hip_flexors", "core_muscles", "ankle_stabilizers"]',
  '["hip", "knee", "ankle"]',
  '["balance_deficit", "gait_weakness", "hip_weakness"]',
  1,
  '["severe_balance_impairment", "acute_hip_injury"]',
  'Use support if needed. Start with lower knee lift and progress gradually.'
);

-- ============================================
-- COORDINATION EXERCISES (2)
-- ============================================

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Cross-Body Reaches',
  'coordination',
  'Coordination exercise combining arm movement with torso rotation',
  'Stand with feet shoulder-width apart. Reach right hand toward left foot, bending slightly. Return to standing. Alternate sides. 10 reaches each side, 3 sets.',
  '["obliques", "hip_flexors", "deltoids", "core_muscles"]',
  '["spine", "shoulder", "hip"]',
  '["coordination_deficit", "balance_deficit", "functional_limitation"]',
  2,
  '["severe_balance_impairment", "acute_shoulder_injury"]',
  'Move slowly with control. Use support if balance is challenged. Stop if dizzy.'
);

INSERT INTO exercises (
  name, category, description, instructions,
  target_muscles, target_joints, target_conditions,
  difficulty_level, contraindications, precautions
) VALUES (
  'Sit-to-Stand Transitions',
  'coordination',
  'Functional exercise improving coordination for daily activities',
  'Sit in sturdy chair. Stand up without using hands if possible. Sit back down with control. Repeat 10-15 times, 3 sets.',
  '["quadriceps", "gluteus_maximus", "core_muscles", "hip_extensors"]',
  '["hip", "knee", "ankle"]',
  '["functional_limitation", "hip_weakness", "knee_weakness"]',
  2,
  '["acute_knee_injury", "severe_hip_pain"]',
  'Use arms for assistance if needed. Progress to hands-free version. Move with control.'
);

-- ============================================
-- Summary Statistics
-- ============================================
-- Total exercises: 17
-- Categories: 6 (Mobility: 3, Stability: 3, Strength: 3, Flexibility: 3, Balance: 3, Coordination: 2)
-- Difficulty levels: 1-3 (Beginner to Intermediate)
-- All exercises include contraindications and precautions for safety
