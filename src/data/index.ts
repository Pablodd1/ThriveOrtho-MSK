// ============================================================================
// COMPREHENSIVE JOINT DATA - All Body Joints
// ============================================================================

export const allJoints = {
  // HEAD & FACE
  face: ['jaw_TMJ', 'eyebrow_elevation', 'eye_tracking', 'mouth_opening', 'facial_symmetry'],
  cervical: ['c_flexion', 'c_extension', 'c_lateral_L', 'c_lateral_R', 'c_rotation_L', 'c_rotation_R'],

  // UPPER BODY
  shoulder_L: ['sh_flexion_L', 'sh_extension_L', 'sh_abduction_L', 'sh_adduction_L', 'sh_internal_rot_L', 'sh_external_rot_L'],
  shoulder_R: ['sh_flexion_R', 'sh_extension_R', 'sh_abduction_R', 'sh_adduction_R', 'sh_internal_rot_R', 'sh_external_rot_R'],
  elbow_L: ['elbow_flexion_L', 'elbow_extension_L', 'forearm_supination_L', 'forearm_pronation_L'],
  elbow_R: ['elbow_flexion_R', 'elbow_extension_R', 'forearm_supination_R', 'forearm_pronation_R'],
  wrist_L: ['wrist_flexion_L', 'wrist_extension_L', 'wrist_radial_L', 'wrist_ulnar_L'],
  wrist_R: ['wrist_flexion_R', 'wrist_extension_R', 'wrist_radial_R', 'wrist_ulnar_R'],

  // HANDS
  hand_L: ['thumb_opposition_L', 'finger_flexion_L', 'finger_extension_L', 'grip_strength_L', 'pinch_strength_L'],
  hand_R: ['thumb_opposition_R', 'finger_flexion_R', 'finger_extension_R', 'grip_strength_R', 'pinch_strength_R'],

  // SPINE
  thoracic: ['t_flexion', 't_extension', 't_rotation_L', 't_rotation_R'],
  lumbar: ['l_flexion', 'l_extension', 'l_lateral_L', 'l_lateral_R', 'l_rotation_L', 'l_rotation_R'],

  // LOWER BODY
  hip_L: ['hip_flexion_L', 'hip_extension_L', 'hip_abduction_L', 'hip_adduction_L', 'hip_internal_rot_L', 'hip_external_rot_L'],
  hip_R: ['hip_flexion_R', 'hip_extension_R', 'hip_abduction_R', 'hip_adduction_R', 'hip_internal_rot_R', 'hip_external_rot_R'],
  knee_L: ['knee_flexion_L', 'knee_extension_L'],
  knee_R: ['knee_flexion_R', 'knee_extension_R'],
  ankle_L: ['ankle_dorsiflexion_L', 'ankle_plantarflexion_L', 'ankle_inversion_L', 'ankle_eversion_L'],
  ankle_R: ['ankle_dorsiflexion_R', 'ankle_plantarflexion_R', 'ankle_inversion_R', 'ankle_eversion_R'],

  // FEET
  foot_L: ['toe_flexion_L', 'toe_extension_L', 'arch_height_L', 'great_toe_mobility_L'],
  foot_R: ['toe_flexion_R', 'toe_extension_R', 'arch_height_R', 'great_toe_mobility_R']
}

// Normal ROM values for reference
export const normalROM = {
  // Cervical
  c_flexion: { normal: 45, min: 35 },
  c_extension: { normal: 45, min: 35 },
  c_lateral_L: { normal: 45, min: 35 },
  c_lateral_R: { normal: 45, min: 35 },
  c_rotation_L: { normal: 80, min: 60 },
  c_rotation_R: { normal: 80, min: 60 },

  // Shoulder
  sh_flexion: { normal: 180, min: 150 },
  sh_extension: { normal: 60, min: 40 },
  sh_abduction: { normal: 180, min: 150 },
  sh_internal_rot: { normal: 70, min: 50 },
  sh_external_rot: { normal: 90, min: 70 },

  // Elbow
  elbow_flexion: { normal: 150, min: 130 },
  elbow_extension: { normal: 0, min: -10 },

  // Wrist
  wrist_flexion: { normal: 80, min: 60 },
  wrist_extension: { normal: 70, min: 50 },

  // Hip
  hip_flexion: { normal: 120, min: 90 },
  hip_extension: { normal: 30, min: 20 },
  hip_abduction: { normal: 45, min: 30 },
  hip_internal_rot: { normal: 40, min: 25 },
  hip_external_rot: { normal: 45, min: 30 },

  // Knee
  knee_flexion: { normal: 140, min: 120 },
  knee_extension: { normal: 0, min: -5 },

  // Ankle
  ankle_dorsiflexion: { normal: 20, min: 10 },
  ankle_plantarflexion: { normal: 50, min: 40 }
}

// ============================================================================
// MOVEMENTS - Standard + Elderly-Specific
// ============================================================================

export const movements = [
  // Standard FMS
  { id: 1, name: 'Deep Squat', category: 'FMS', joints: ['hip', 'knee', 'ankle'], description: 'Bilateral mobility of hips, knees, and ankles', cpt: '97161', forElderly: true },
  { id: 2, name: 'Hurdle Step', category: 'FMS', joints: ['hip', 'knee'], description: 'Stride mechanics and stance leg stability', cpt: '97161', forElderly: false },
  { id: 3, name: 'Inline Lunge', category: 'FMS', joints: ['hip', 'knee', 'ankle'], description: 'Hip mobility/stability, ankle stability', cpt: '97161', forElderly: false },
  { id: 4, name: 'Shoulder Mobility', category: 'FMS', joints: ['shoulder', 'scapula'], description: 'Bilateral shoulder ROM', cpt: '97161', forElderly: true },
  { id: 5, name: 'Active Straight Leg Raise', category: 'FMS', joints: ['hip', 'pelvis'], description: 'Hamstring flexibility with pelvic control', cpt: '97161', forElderly: true },
  { id: 6, name: 'Trunk Stability Push-Up', category: 'FMS', joints: ['spine', 'shoulder'], description: 'Core stabilization', cpt: '97161', forElderly: false },
  { id: 7, name: 'Rotary Stability', category: 'FMS', joints: ['spine', 'hip', 'shoulder'], description: 'Multi-plane core stability', cpt: '97161', forElderly: false },

  // AMA Standard
  { id: 8, name: 'Cervical ROM', category: 'AMA', joints: ['cervical'], description: 'Neck range of motion all planes', cpt: '97162', forElderly: true },
  { id: 9, name: 'Lumbar ROM', category: 'AMA', joints: ['lumbar'], description: 'Lower back range of motion', cpt: '97162', forElderly: true },
  { id: 10, name: 'Gait Analysis', category: 'AMA', joints: ['hip', 'knee', 'ankle'], description: 'Walking pattern assessment', cpt: '97164', forElderly: true },

  // ELDERLY-SPECIFIC ASSESSMENTS
  { id: 11, name: 'Timed Up and Go (TUG)', category: 'ELDERLY', joints: ['hip', 'knee', 'ankle', 'balance'], description: 'Rise from chair, walk 3m, turn, return, sit. <10s normal, >14s fall risk', cpt: '97164', forElderly: true },
  { id: 12, name: 'Walk Forward 20ft', category: 'ELDERLY', joints: ['hip', 'knee', 'ankle', 'gait'], description: 'Observe heel strike, arm swing, posture, cadence', cpt: '97164', forElderly: true },
  { id: 13, name: 'Walk Backward 10ft', category: 'ELDERLY', joints: ['hip', 'knee', 'ankle', 'balance'], description: 'Assess backward gait, fall risk, coordination', cpt: '97164', forElderly: true },
  { id: 14, name: 'Tandem Walk', category: 'ELDERLY', joints: ['ankle', 'balance', 'vestibular'], description: 'Heel-to-toe walking for balance assessment', cpt: '97164', forElderly: true },
  { id: 15, name: 'Single Leg Stance', category: 'ELDERLY', joints: ['hip', 'ankle', 'balance'], description: 'Stand on one leg, eyes open then closed. <5s = high fall risk', cpt: '97164', forElderly: true },
  { id: 16, name: 'Sit to Stand x5', category: 'ELDERLY', joints: ['hip', 'knee', 'quadriceps'], description: 'Rise from chair 5 times without arms. >12s indicates weakness', cpt: '97164', forElderly: true },
  { id: 17, name: 'Functional Reach', category: 'ELDERLY', joints: ['balance', 'ankle'], description: 'Reach forward as far as possible without stepping. <6in = fall risk', cpt: '97164', forElderly: true },
  { id: 18, name: '180° Turn', category: 'ELDERLY', joints: ['hip', 'ankle', 'vestibular'], description: 'Turn around completely. >4 steps = balance concern', cpt: '97164', forElderly: true },

  // HAND & FINE MOTOR
  { id: 19, name: 'Hand Grip Strength', category: 'HAND', joints: ['hand', 'forearm'], description: 'Grip dynamometry both hands', cpt: '97162', forElderly: true },
  { id: 20, name: 'Finger Dexterity', category: 'HAND', joints: ['hand', 'fingers'], description: 'Fine motor: pinch, opposition, coordination', cpt: '97162', forElderly: true },
  { id: 21, name: 'Wrist ROM', category: 'HAND', joints: ['wrist'], description: 'Flexion, extension, radial/ulnar deviation', cpt: '97162', forElderly: true },

  // FOOT & ANKLE
  { id: 22, name: 'Ankle ROM', category: 'FOOT', joints: ['ankle'], description: 'Dorsiflexion, plantarflexion, inversion, eversion', cpt: '97162', forElderly: true },
  { id: 23, name: 'Toe Mobility', category: 'FOOT', joints: ['foot', 'toes'], description: 'Great toe extension, toe spread, flexion', cpt: '97162', forElderly: true },
  { id: 24, name: 'Arch Assessment', category: 'FOOT', joints: ['foot'], description: 'Arch height, pronation/supination pattern', cpt: '97162', forElderly: true },

  // FACE & JAW
  { id: 25, name: 'TMJ Assessment', category: 'FACE', joints: ['jaw'], description: 'Jaw opening, deviation, clicking, pain', cpt: '97162', forElderly: true },
  { id: 26, name: 'Facial Symmetry', category: 'FACE', joints: ['face'], description: 'Muscle symmetry, expression capability', cpt: '97162', forElderly: true }
]

export const exercises = [
  { id: 'E001', name: 'Hip Flexor Stretch', target: 'hip', difficulty: 'Beginner', sets: 3, reps: '30s hold', frequency: '2x daily', forElderly: true },
  { id: 'E002', name: 'Piriformis Stretch', target: 'hip', difficulty: 'Beginner', sets: 3, reps: '30s hold', frequency: '2x daily', forElderly: true },
  { id: 'E003', name: 'Dead Bug', target: 'core', difficulty: 'Intermediate', sets: 3, reps: '10 each', frequency: 'daily', forElderly: false },
  { id: 'E004', name: 'Bird Dog', target: 'core', difficulty: 'Beginner', sets: 3, reps: '10 each', frequency: 'daily', forElderly: true },
  { id: 'E005', name: 'Cat-Cow Stretch', target: 'spine', difficulty: 'Beginner', sets: 1, reps: '10 cycles', frequency: '2x daily', forElderly: true },
  { id: 'E006', name: 'Cervical Retraction', target: 'cervical', difficulty: 'Beginner', sets: 3, reps: '10', frequency: '3x daily', forElderly: true },
  { id: 'E007', name: 'Ankle Circles', target: 'ankle', difficulty: 'Beginner', sets: 2, reps: '10 each direction', frequency: '2x daily', forElderly: true },
  { id: 'E008', name: 'Seated Marching', target: 'hip', difficulty: 'Beginner', sets: 3, reps: '20', frequency: 'daily', forElderly: true },
  { id: 'E009', name: 'Heel Raises', target: 'ankle', difficulty: 'Beginner', sets: 3, reps: '15', frequency: 'daily', forElderly: true },
  { id: 'E010', name: 'Finger Spreads', target: 'hand', difficulty: 'Beginner', sets: 3, reps: '10', frequency: '2x daily', forElderly: true },
  { id: 'E011', name: 'Wrist Circles', target: 'wrist', difficulty: 'Beginner', sets: 2, reps: '10 each', frequency: '2x daily', forElderly: true },
  { id: 'E012', name: 'Chair Stand', target: 'legs', difficulty: 'Beginner', sets: 2, reps: '10', frequency: 'daily', forElderly: true },
  { id: 'E013', name: 'Wall Push-ups', target: 'upper body', difficulty: 'Beginner', sets: 2, reps: '10', frequency: 'daily', forElderly: true },
  { id: 'E014', name: 'Tandem Balance', target: 'balance', difficulty: 'Beginner', sets: 3, reps: '30s hold', frequency: 'daily', forElderly: true },
  { id: 'E015', name: 'Toe Yoga', target: 'feet', difficulty: 'Beginner', sets: 2, reps: '10', frequency: 'daily', forElderly: true }
]

export const demoUsers = {
  doctor: { id: 'D001', name: 'Dr. Michael Torres', email: 'dr.torres@thriveortho.com', avatar: 'MT', credentials: 'MD, Sports Medicine', role: 'doctor' },
  coach: { id: 'C001', name: 'Jessica Martinez', email: 'jessica.m@thriveortho.com', avatar: 'JM', credentials: 'DPT, CSCS, FMS', role: 'coach' },
  admin: { id: 'A001', name: 'Robert Chen', email: 'admin@thriveortho.com', avatar: 'RC', role: 'admin' }
}

// Clinical Demo Patients - 5 realistic cases
export const demoPatients = [
  {
    id: 'P001',
    name: 'Marcus Williams',
    avatar: 'MW',
    age: 52,
    gender: 'Male',
    bmi: 38.5,
    condition: 'Obesity',
    cc: 'Bilateral knee pain, limited mobility',
    focus: 'Knee, Hip, Gait',
    fms: 10,
    status: 'In Progress',
    risk: 'High Risk',
    notes: 'BMI 38.5, Class II Obesity. Difficulty with weight-bearing exercises. Focus on low-impact mobility.'
  },
  {
    id: 'P002',
    name: 'Patricia Chen',
    avatar: 'PC',
    age: 61,
    gender: 'Female',
    condition: 'Type 2 Diabetes',
    cc: 'Diabetic neuropathy, balance issues',
    focus: 'Balance, Feet, Gait',
    fms: 11,
    status: 'In Progress',
    risk: 'High Risk',
    notes: 'T2DM x 12 years. Peripheral neuropathy bilateral feet. Fall risk assessment needed.'
  },
  {
    id: 'P003',
    name: 'James Rodriguez',
    avatar: 'JR',
    age: 58,
    gender: 'Male',
    condition: 'Pre-Op Knee',
    cc: 'Right TKA scheduled, pre-surgical eval',
    focus: 'Knee ROM, Quad strength',
    fms: 9,
    status: 'Pre-Surgery',
    risk: 'Moderate',
    notes: 'Right TKA scheduled 01/15. Pre-op PT eval. OA Grade IV. Document baseline ROM.'
  },
  {
    id: 'P004',
    name: 'Linda Thompson',
    avatar: 'LT',
    age: 67,
    gender: 'Female',
    condition: 'Post-Op Hip',
    cc: 'Left THR 4 weeks ago, rehab phase',
    focus: 'Hip ROM, Gait, Balance',
    fms: 13,
    status: 'Rehab',
    risk: 'Moderate',
    notes: 'Left THR 4 weeks post-op. Posterior approach precautions. Progress to full weight bearing.'
  },
  {
    id: 'P005',
    name: 'David Park',
    avatar: 'DP',
    age: 45,
    gender: 'Male',
    condition: 'Healthy Baseline',
    cc: 'Annual MSK screening, active lifestyle',
    focus: 'Full Body, FMS',
    fms: 17,
    status: 'Screening',
    risk: 'Low Risk',
    notes: 'Annual wellness screen. Marathon runner. No current complaints.'
  }
]

export const painKeywords = {
  red: ['numbness', 'tingling', 'weakness', 'bowel', 'bladder', 'night pain', 'fever', 'weight loss', 'cancer', 'trauma', 'fall', 'accident', 'bilateral', 'progressive', 'dizziness', 'vision changes'],
  yellow: ['stress', 'anxiety', 'depression', 'fear', 'catastrophizing', 'work', 'compensation', 'litigation', 'hopeless', 'frustrated'],
  severity: ['severe', 'excruciating', 'unbearable', 'worst', 'intense', 'sharp', 'shooting', 'burning', 'stabbing', 'constant'],
  elderly: ['fall', 'unsteady', 'dizzy', 'tripped', 'lost balance', 'weak legs', 'can\'t get up', 'stumble']
}

// Clinical Validation Evidence Base
export const CLINICAL_EVIDENCE = {
  poseEstimationAccuracy: {
    mediapipeHolistic: { accuracy: '±5-8°', landmarks: 543, fps: 30, source: 'Google Research 2023' },
    viTPose: { accuracy: '±3-5°', landmarks: 17, fps: 15, source: 'ViTPose CVPR 2022' },
    openPose: { accuracy: '±3.7°', landmarks: 25, fps: 10, source: 'CMU 2019' },
    clinical: { goldStandard: 'Goniometer', accuracy: '±5°', source: 'APTA Guidelines' }
  },
  validationStudies: [
    { title: 'Hip Kinematics Comparison', journal: 'Gait & Posture 2022', accuracy: '3.7° ± 1.3°' },
    { title: 'Pose Estimation in Clinical Settings', journal: 'JMPT 2023', correlation: 'r=0.92' },
    { title: 'TeleRehab Accuracy Study', journal: 'PTJ 2024', agreement: '94%' }
  ],
  normativeData: {
    source: 'AAOS Normative ROM Values',
    population: 'Adults 18-65',
    sampleSize: 'n=2,847'
  }
}

// Biomechanical Risk Scoring Algorithm (Proprietary)
export const BIOMECHANICAL_RISK_FACTORS = {
  // ACL Injury Risk Indicators
  acl: {
    kneeValgus: { threshold: 15, weight: 0.35, description: 'Dynamic knee valgus >15° during landing' },
    hipDrop: { threshold: 10, weight: 0.25, description: 'Contralateral hip drop >10°' },
    trunkLateralFlexion: { threshold: 12, weight: 0.2, description: 'Trunk lateral flexion >12°' },
    quadDominance: { threshold: 1.5, weight: 0.2, description: 'Quad:Ham ratio >1.5' }
  },
  // Lower Back Pain Risk
  lbp: {
    lumbarFlexion: { threshold: 45, weight: 0.3, description: 'Excessive lumbar flexion during lift' },
    hipMobility: { threshold: 90, weight: 0.25, description: 'Hip flexion <90° (compensated by lumbar)' },
    coreStability: { threshold: 2, weight: 0.25, description: 'FMS core score <2' },
    thoracicRotation: { threshold: 35, weight: 0.2, description: 'Thoracic rotation <35°' }
  },
  // Shoulder Impingement Risk
  shoulder: {
    scapularDyskinesis: { threshold: 'present', weight: 0.35, description: 'Visible scapular winging' },
    posteriorCapsuleTightness: { threshold: 20, weight: 0.25, description: 'IR deficit >20° vs contralateral' },
    overheadMobility: { threshold: 170, weight: 0.2, description: 'Shoulder flexion <170°' },
    rotatorCuffStrength: { threshold: 0.65, weight: 0.2, description: 'ER:IR ratio <0.65' }
  },
  // Fall Risk (Elderly)
  fall: {
    tugTime: { threshold: 12, weight: 0.3, description: 'TUG >12 seconds' },
    singleLegStance: { threshold: 10, weight: 0.25, description: 'SLS <10 seconds' },
    gaitSpeed: { threshold: 1.0, weight: 0.25, description: 'Gait speed <1.0 m/s' },
    stepWidth: { threshold: 10, weight: 0.2, description: 'Step width variability >10cm' }
  }
}

// ICD-10 Code Database for Auto-Coding
export const ICD10_DATABASE: Record<string, { code: string; description: string; category: string }[]> = {
  'knee_pain': [
    { code: 'M25.561', description: 'Pain in right knee', category: 'Joint disorders' },
    { code: 'M25.562', description: 'Pain in left knee', category: 'Joint disorders' },
    { code: 'M17.11', description: 'Primary osteoarthritis, right knee', category: 'Arthropathies' },
    { code: 'M17.12', description: 'Primary osteoarthritis, left knee', category: 'Arthropathies' }
  ],
  'back_pain': [
    { code: 'M54.5', description: 'Low back pain', category: 'Dorsopathies' },
    { code: 'M54.16', description: 'Radiculopathy, lumbar region', category: 'Dorsopathies' },
    { code: 'M54.2', description: 'Cervicalgia', category: 'Dorsopathies' }
  ],
  'shoulder_pain': [
    { code: 'M25.511', description: 'Pain in right shoulder', category: 'Joint disorders' },
    { code: 'M25.512', description: 'Pain in left shoulder', category: 'Joint disorders' },
    { code: 'M75.101', description: 'Rotator cuff tear, right shoulder', category: 'Shoulder lesions' }
  ],
  'hip_pain': [
    { code: 'M25.551', description: 'Pain in right hip', category: 'Joint disorders' },
    { code: 'M25.552', description: 'Pain in left hip', category: 'Joint disorders' },
    { code: 'M16.11', description: 'Primary osteoarthritis, right hip', category: 'Arthropathies' }
  ],
  'ankle_pain': [
    { code: 'M25.571', description: 'Pain in right ankle', category: 'Joint disorders' },
    { code: 'M25.572', description: 'Pain in left ankle', category: 'Joint disorders' },
    { code: 'S93.401A', description: 'Sprain of ankle, initial encounter', category: 'Injuries' }
  ],
  'muscle_weakness': [
    { code: 'M62.81', description: 'Muscle weakness (generalized)', category: 'Myopathies' },
    { code: 'R26.2', description: 'Difficulty in walking', category: 'Gait abnormalities' }
  ],
  'balance_deficit': [
    { code: 'R26.81', description: 'Unsteadiness on feet', category: 'Gait abnormalities' },
    { code: 'R26.89', description: 'Other abnormalities of gait and mobility', category: 'Gait abnormalities' },
    { code: 'R29.6', description: 'Repeated falls', category: 'Fall risk' }
  ]
}

// CPT Code Auto-Selection Logic
export const CPT_COMPLEXITY_RULES = {
  low: {
    evaluation: '97161',
    description: 'PT Evaluation - Low Complexity',
    criteria: ['1-2 body systems', 'stable condition', 'minimal functional limitations']
  },
  moderate: {
    evaluation: '97162',
    description: 'PT Evaluation - Moderate Complexity',
    criteria: ['2-3 body systems', 'evolving condition', 'moderate functional limitations']
  },
  high: {
    evaluation: '97163',
    description: 'PT Evaluation - High Complexity',
    criteria: ['4+ body systems', 'unstable condition', 'significant functional limitations']
  }
}

// ============================================================================
// COMPREHENSIVE EXERCISE LIBRARY - 50+ Evidence-Based Exercises
// ============================================================================

export const EXERCISE_LIBRARY = {
  // CERVICAL SPINE
  cervical: [
    { id: 'C001', name: 'Cervical Retraction (Chin Tucks)', target: 'deep neck flexors', difficulty: 'beginner', sets: 3, reps: 10, hold: '5s', frequency: '3x daily', instructions: 'Sit tall, pull chin straight back creating double chin, hold, release', contraindications: ['acute disc herniation', 'vertebral fracture'], evidence: 'McKenzie Method' },
    { id: 'C002', name: 'Cervical Rotation Stretch', target: 'SCM, scalenes', difficulty: 'beginner', sets: 2, reps: 5, hold: '30s', frequency: '2x daily', instructions: 'Slowly turn head to look over shoulder, hold at end range', contraindications: ['vertebral artery insufficiency'], evidence: 'APTA Guidelines' },
    { id: 'C003', name: 'Levator Scapulae Stretch', target: 'levator scapulae', difficulty: 'beginner', sets: 2, reps: 3, hold: '30s', frequency: '2x daily', instructions: 'Look down toward opposite armpit, use hand for gentle overpressure', contraindications: [], evidence: 'Jull et al. 2008' },
    { id: 'C004', name: 'Upper Trapezius Stretch', target: 'upper trapezius', difficulty: 'beginner', sets: 2, reps: 3, hold: '30s', frequency: '2x daily', instructions: 'Tilt ear to shoulder, hand on head for gentle pull', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'C005', name: 'Deep Neck Flexor Activation', target: 'longus colli/capitis', difficulty: 'intermediate', sets: 3, reps: 10, hold: '10s', frequency: 'daily', instructions: 'Supine with towel roll, nod chin gently, feel front of neck activate', contraindications: [], evidence: 'Jull et al. 2008' },
  ],

  // SHOULDER
  shoulder: [
    { id: 'S001', name: 'Pendulum Exercises (Codman)', target: 'glenohumeral joint', difficulty: 'beginner', sets: 3, reps: '30s each direction', hold: null, frequency: '3x daily', instructions: 'Lean forward, let arm hang, make small circles', contraindications: [], evidence: 'Post-surgical protocol' },
    { id: 'S002', name: 'Sleeper Stretch', target: 'posterior capsule', difficulty: 'beginner', sets: 3, reps: 5, hold: '30s', frequency: 'daily', instructions: 'Side lying, push forearm toward floor keeping shoulder blade stable', contraindications: ['anterior instability'], evidence: 'Wilk et al.' },
    { id: 'S003', name: 'Cross-Body Stretch', target: 'posterior deltoid/capsule', difficulty: 'beginner', sets: 3, reps: 3, hold: '30s', frequency: 'daily', instructions: 'Pull arm across body at shoulder height', contraindications: ['AC joint pathology'], evidence: 'APTA Guidelines' },
    { id: 'S004', name: 'External Rotation with Theraband', target: 'infraspinatus, teres minor', difficulty: 'intermediate', sets: 3, reps: 15, hold: null, frequency: 'daily', instructions: 'Elbow at 90°, rotate forearm outward against resistance', contraindications: [], evidence: 'Reinold et al.' },
    { id: 'S005', name: 'Internal Rotation with Theraband', target: 'subscapularis', difficulty: 'intermediate', sets: 3, reps: 15, hold: null, frequency: 'daily', instructions: 'Elbow at 90°, rotate forearm inward against resistance', contraindications: [], evidence: 'Reinold et al.' },
    { id: 'S006', name: 'YTWL Exercises', target: 'lower trapezius, rhomboids', difficulty: 'intermediate', sets: 2, reps: 10, hold: '5s', frequency: 'daily', instructions: 'Prone, lift arms in Y, T, W, L positions', contraindications: [], evidence: 'Cools et al.' },
    { id: 'S007', name: 'Scapular Retraction', target: 'rhomboids, mid trapezius', difficulty: 'beginner', sets: 3, reps: 15, hold: '5s', frequency: 'daily', instructions: 'Squeeze shoulder blades together', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'S008', name: 'Wall Slides', target: 'serratus anterior, rotator cuff', difficulty: 'intermediate', sets: 3, reps: 10, hold: null, frequency: 'daily', instructions: 'Back against wall, slide arms up keeping contact', contraindications: ['impingement acute phase'], evidence: 'Kibler et al.' },
  ],

  // LUMBAR SPINE
  lumbar: [
    { id: 'L001', name: 'Cat-Cow Stretch', target: 'spinal mobility', difficulty: 'beginner', sets: 1, reps: 10, hold: null, frequency: '2x daily', instructions: 'On hands and knees, alternate arching and rounding spine', contraindications: ['acute disc herniation'], evidence: 'Clinical consensus' },
    { id: 'L002', name: 'Pelvic Tilts', target: 'core activation', difficulty: 'beginner', sets: 3, reps: 15, hold: '5s', frequency: 'daily', instructions: 'Supine, flatten low back to floor by tilting pelvis', contraindications: [], evidence: 'O\'Sullivan et al.' },
    { id: 'L003', name: 'Bird Dog', target: 'multifidus, core', difficulty: 'beginner', sets: 3, reps: 10, hold: '5s', frequency: 'daily', instructions: 'Hands and knees, extend opposite arm and leg', contraindications: [], evidence: 'McGill Big 3' },
    { id: 'L004', name: 'Dead Bug', target: 'transverse abdominis', difficulty: 'intermediate', sets: 3, reps: 10, hold: '5s', frequency: 'daily', instructions: 'Supine, lower opposite arm and leg maintaining neutral spine', contraindications: [], evidence: 'McGill et al.' },
    { id: 'L005', name: 'Side Plank', target: 'quadratus lumborum, obliques', difficulty: 'intermediate', sets: 3, reps: null, hold: '30s', frequency: 'daily', instructions: 'Side lying on elbow, lift hips creating straight line', contraindications: ['shoulder injury'], evidence: 'McGill Big 3' },
    { id: 'L006', name: 'McGill Curl-Up', target: 'rectus abdominis', difficulty: 'beginner', sets: 3, reps: 10, hold: '5s', frequency: 'daily', instructions: 'Supine, hands under low back, lift head and shoulders only', contraindications: [], evidence: 'McGill Big 3' },
    { id: 'L007', name: 'Prone Press-Up (McKenzie)', target: 'lumbar extension', difficulty: 'beginner', sets: 1, reps: 10, hold: '3s', frequency: 'every 2 hours', instructions: 'Prone, press up leaving hips on floor', contraindications: ['spinal stenosis', 'spondylolisthesis'], evidence: 'McKenzie Method' },
    { id: 'L008', name: 'Knee to Chest Stretch', target: 'lumbar flexion', difficulty: 'beginner', sets: 3, reps: 3, hold: '30s', frequency: 'daily', instructions: 'Supine, pull knee toward chest', contraindications: ['acute disc herniation posterior'], evidence: 'Clinical consensus' },
    { id: 'L009', name: 'Piriformis Stretch', target: 'piriformis', difficulty: 'beginner', sets: 3, reps: 3, hold: '30s', frequency: 'daily', instructions: 'Supine, cross ankle over knee, pull toward chest', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'L010', name: 'Child\'s Pose', target: 'lumbar flexion, relaxation', difficulty: 'beginner', sets: 1, reps: 3, hold: '60s', frequency: 'daily', instructions: 'Kneel, sit back on heels, reach arms forward', contraindications: ['knee injury'], evidence: 'Clinical consensus' },
  ],

  // HIP
  hip: [
    { id: 'H001', name: 'Hip Flexor Stretch (Kneeling)', target: 'iliopsoas, rectus femoris', difficulty: 'beginner', sets: 3, reps: 3, hold: '30s', frequency: '2x daily', instructions: 'Half-kneeling, tuck pelvis under, lean forward', contraindications: ['knee injury'], evidence: 'Clinical consensus' },
    { id: 'H002', name: '90/90 Hip Stretch', target: 'hip rotators', difficulty: 'intermediate', sets: 2, reps: 5, hold: '30s', frequency: 'daily', instructions: 'Sit with both legs at 90°, lean forward over front leg', contraindications: ['hip replacement precautions'], evidence: 'FRC Method' },
    { id: 'H003', name: 'Clamshells', target: 'gluteus medius', difficulty: 'beginner', sets: 3, reps: 15, hold: null, frequency: 'daily', instructions: 'Side lying, knees bent, lift top knee keeping feet together', contraindications: [], evidence: 'Distefano et al.' },
    { id: 'H004', name: 'Glute Bridge', target: 'gluteus maximus', difficulty: 'beginner', sets: 3, reps: 15, hold: '5s', frequency: 'daily', instructions: 'Supine, feet flat, lift hips toward ceiling', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'H005', name: 'Single Leg Glute Bridge', target: 'gluteus maximus, stability', difficulty: 'intermediate', sets: 3, reps: 10, hold: '5s', frequency: 'daily', instructions: 'Single leg version of glute bridge', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'H006', name: 'Fire Hydrant', target: 'gluteus medius, hip abductors', difficulty: 'beginner', sets: 3, reps: 15, hold: null, frequency: 'daily', instructions: 'Hands and knees, lift bent knee to side', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'H007', name: 'Monster Walks', target: 'gluteus medius, TFL', difficulty: 'intermediate', sets: 2, reps: 20, hold: null, frequency: 'daily', instructions: 'Band around ankles, walk sideways in squat position', contraindications: [], evidence: 'Cambridge et al.' },
    { id: 'H008', name: 'Hip Hinge Pattern', target: 'posterior chain', difficulty: 'beginner', sets: 3, reps: 10, hold: null, frequency: 'daily', instructions: 'Stand, push hips back while maintaining flat back', contraindications: [], evidence: 'FMS Method' },
  ],

  // KNEE
  knee: [
    { id: 'K001', name: 'Quad Sets', target: 'quadriceps', difficulty: 'beginner', sets: 3, reps: 10, hold: '5s', frequency: '3x daily', instructions: 'Sitting or supine, tighten thigh muscle pressing knee down', contraindications: [], evidence: 'Post-surgical protocol' },
    { id: 'K002', name: 'Straight Leg Raise', target: 'quadriceps', difficulty: 'beginner', sets: 3, reps: 15, hold: '3s', frequency: 'daily', instructions: 'Supine, keep knee straight, lift leg 12 inches', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'K003', name: 'Terminal Knee Extension', target: 'VMO', difficulty: 'beginner', sets: 3, reps: 15, hold: '5s', frequency: 'daily', instructions: 'Roll under knee, straighten knee against resistance', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'K004', name: 'Wall Sit', target: 'quadriceps isometric', difficulty: 'intermediate', sets: 3, reps: null, hold: '30-60s', frequency: 'daily', instructions: 'Back against wall, slide down to 90° knee bend', contraindications: ['patellofemoral pain'], evidence: 'Clinical consensus' },
    { id: 'K005', name: 'Step Ups', target: 'quadriceps, glutes', difficulty: 'intermediate', sets: 3, reps: 10, hold: null, frequency: 'daily', instructions: 'Step up onto 6-8 inch step, control descent', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'K006', name: 'Hamstring Curls', target: 'hamstrings', difficulty: 'beginner', sets: 3, reps: 15, hold: null, frequency: 'daily', instructions: 'Standing or prone, bend knee bringing heel toward buttock', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'K007', name: 'IT Band Foam Rolling', target: 'IT band', difficulty: 'beginner', sets: 1, reps: null, hold: '60s', frequency: 'daily', instructions: 'Side lying on roller, roll from hip to knee', contraindications: [], evidence: 'MacDonald et al.' },
  ],

  // ANKLE/FOOT
  ankle: [
    { id: 'A001', name: 'Ankle Alphabet', target: 'ankle mobility', difficulty: 'beginner', sets: 2, reps: '26 letters', hold: null, frequency: '2x daily', instructions: 'Seated, draw alphabet with big toe', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'A002', name: 'Calf Raises', target: 'gastrocnemius', difficulty: 'beginner', sets: 3, reps: 15, hold: '2s', frequency: 'daily', instructions: 'Rise up on toes, control descent', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'A003', name: 'Single Leg Calf Raise', target: 'gastrocnemius, soleus', difficulty: 'intermediate', sets: 3, reps: 15, hold: '2s', frequency: 'daily', instructions: 'Single leg version off step for full ROM', contraindications: ['Achilles tendinopathy acute'], evidence: 'Alfredson Protocol' },
    { id: 'A004', name: 'Ankle Dorsiflexion Stretch', target: 'gastrocnemius/soleus', difficulty: 'beginner', sets: 3, reps: 3, hold: '30s', frequency: 'daily', instructions: 'Wall stretch with knee straight and bent', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'A005', name: 'Towel Scrunches', target: 'intrinsic foot muscles', difficulty: 'beginner', sets: 3, reps: 15, hold: null, frequency: 'daily', instructions: 'Seated, use toes to scrunch towel toward you', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'A006', name: 'Short Foot Exercise', target: 'arch muscles', difficulty: 'intermediate', sets: 3, reps: 10, hold: '10s', frequency: 'daily', instructions: 'Standing, shorten foot by lifting arch without curling toes', contraindications: [], evidence: 'Janda approach' },
    { id: 'A007', name: 'BAPS Board Balance', target: 'proprioception', difficulty: 'intermediate', sets: 3, reps: '60s', hold: null, frequency: 'daily', instructions: 'Stand on balance board, maintain equilibrium', contraindications: ['acute ankle sprain'], evidence: 'McKeon et al.' },
  ],

  // BALANCE/ELDERLY
  balance: [
    { id: 'B001', name: 'Tandem Stance', target: 'static balance', difficulty: 'beginner', sets: 3, reps: null, hold: '30s', frequency: 'daily', instructions: 'Stand heel-to-toe, progress to eyes closed', contraindications: [], evidence: 'CDC STEADI' },
    { id: 'B002', name: 'Single Leg Stance', target: 'static balance', difficulty: 'beginner', sets: 3, reps: null, hold: '30s', frequency: 'daily', instructions: 'Stand on one leg, use wall for safety', contraindications: [], evidence: 'CDC STEADI' },
    { id: 'B003', name: 'Heel-Toe Walking', target: 'dynamic balance', difficulty: 'intermediate', sets: 3, reps: '10 steps', hold: null, frequency: 'daily', instructions: 'Walk placing heel directly in front of toe', contraindications: [], evidence: 'CDC STEADI' },
    { id: 'B004', name: 'Sit to Stand Practice', target: 'functional strength', difficulty: 'beginner', sets: 3, reps: 10, hold: null, frequency: 'daily', instructions: 'Rise from chair without using arms', contraindications: [], evidence: 'Otago Program' },
    { id: 'B005', name: 'Backward Walking', target: 'gait, balance', difficulty: 'intermediate', sets: 2, reps: '20 steps', hold: null, frequency: 'daily', instructions: 'Walk backward in safe environment', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'B006', name: 'Clock Reach', target: 'dynamic balance', difficulty: 'intermediate', sets: 2, reps: 8, hold: null, frequency: 'daily', instructions: 'Single leg, reach to clock positions', contraindications: [], evidence: 'Star Excursion' },
    { id: 'B007', name: 'Marching in Place', target: 'hip flexion, balance', difficulty: 'beginner', sets: 3, reps: 30, hold: null, frequency: 'daily', instructions: 'March lifting knees to hip height', contraindications: [], evidence: 'Otago Program' },
    { id: 'B008', name: 'Tai Chi Movements', target: 'balance, coordination', difficulty: 'intermediate', sets: 1, reps: '10 minutes', hold: null, frequency: 'daily', instructions: 'Slow controlled movements', contraindications: [], evidence: 'Li et al. NEJM 2012' },
  ],

  // HAND/WRIST
  hand: [
    { id: 'W001', name: 'Wrist Flexor Stretch', target: 'wrist flexors', difficulty: 'beginner', sets: 3, reps: 3, hold: '30s', frequency: '2x daily', instructions: 'Extend arm, palm up, pull fingers back with other hand', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'W002', name: 'Wrist Extensor Stretch', target: 'wrist extensors', difficulty: 'beginner', sets: 3, reps: 3, hold: '30s', frequency: '2x daily', instructions: 'Extend arm, palm down, pull fingers toward floor', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'W003', name: 'Grip Strengthening', target: 'forearm flexors', difficulty: 'beginner', sets: 3, reps: 15, hold: '5s', frequency: 'daily', instructions: 'Squeeze stress ball or grip strengthener', contraindications: ['acute carpal tunnel'], evidence: 'Clinical consensus' },
    { id: 'W004', name: 'Finger Spreads', target: 'intrinsic hand muscles', difficulty: 'beginner', sets: 3, reps: 10, hold: '5s', frequency: 'daily', instructions: 'Spread fingers wide apart, hold, relax', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'W005', name: 'Thumb Opposition', target: 'thenar muscles', difficulty: 'beginner', sets: 3, reps: 10, hold: null, frequency: 'daily', instructions: 'Touch thumb to each fingertip', contraindications: [], evidence: 'Clinical consensus' },
    { id: 'W006', name: 'Nerve Gliding (Median)', target: 'median nerve', difficulty: 'intermediate', sets: 2, reps: 10, hold: '3s', frequency: '2x daily', instructions: 'Sequential positions to mobilize median nerve', contraindications: ['acute CTS'], evidence: 'Butler DN' },
  ],
}

// ============================================================================
// GAIT ANALYSIS SYSTEM
// ============================================================================

export const GAIT_PARAMETERS = {
  temporal: {
    cadence: { normal: { min: 100, max: 120, unit: 'steps/min' }, elderly: { min: 90, max: 110 } },
    strideTime: { normal: { min: 0.9, max: 1.2, unit: 'seconds' }, elderly: { min: 1.0, max: 1.4 } },
    stancePhase: { normal: { min: 58, max: 62, unit: '%' }, elderly: { min: 60, max: 65 } },
    swingPhase: { normal: { min: 38, max: 42, unit: '%' }, elderly: { min: 35, max: 40 } },
    doubleSupport: { normal: { min: 16, max: 24, unit: '%' }, elderly: { min: 20, max: 30 } },
  },
  spatial: {
    strideLength: { normal: { min: 1.2, max: 1.6, unit: 'm' }, elderly: { min: 1.0, max: 1.4 } },
    stepLength: { normal: { min: 0.6, max: 0.8, unit: 'm' }, elderly: { min: 0.5, max: 0.7 } },
    stepWidth: { normal: { min: 0.05, max: 0.10, unit: 'm' }, elderly: { min: 0.08, max: 0.15 } },
    gaitSpeed: { normal: { min: 1.2, max: 1.4, unit: 'm/s' }, elderly: { min: 0.8, max: 1.2 } },
    footProgression: { normal: { min: 5, max: 15, unit: 'degrees' }, elderly: { min: 5, max: 20 } },
  },
  kinematic: {
    hipFlexion: { normal: { peak: 30, unit: 'degrees' } },
    hipExtension: { normal: { peak: 10, unit: 'degrees' } },
    kneeFlexion: { normal: { peak: 60, unit: 'degrees' } },
    ankleDorsiflexion: { normal: { peak: 10, unit: 'degrees' } },
    anklePlantarflexion: { normal: { peak: 20, unit: 'degrees' } },
    pelvicTilt: { normal: { range: 4, unit: 'degrees' } },
    pelvicObliquity: { normal: { range: 5, unit: 'degrees' } },
    pelvicRotation: { normal: { range: 8, unit: 'degrees' } },
    trunkLateralFlexion: { normal: { max: 5, unit: 'degrees' } },
  },
  qualitative: {
    heelStrike: ['present', 'absent', 'flat foot', 'forefoot'],
    toeOff: ['adequate', 'diminished', 'absent'],
    armSwing: ['reciprocal', 'diminished', 'absent', 'asymmetric'],
    trunkPosture: ['upright', 'forward flexed', 'lateral lean'],
    baseOfSupport: ['narrow', 'normal', 'wide'],
    footClearance: ['adequate', 'toe drag', 'circumduction', 'hip hiking'],
  }
}

// ============================================================================
// PAIN ASSESSMENT SCALES
// ============================================================================

export const PAIN_SCALES = {
  VAS: { name: 'Visual Analog Scale', range: [0, 100], unit: 'mm' },
  NRS: { name: 'Numeric Rating Scale', range: [0, 10], unit: 'number' },
  FPS: { name: 'Faces Pain Scale', range: [0, 10], images: 6 },
  MPQ: {
    name: 'McGill Pain Questionnaire',
    categories: {
      sensory: ['throbbing', 'shooting', 'stabbing', 'sharp', 'cramping', 'gnawing', 'burning', 'aching', 'heavy', 'tender', 'splitting'],
      affective: ['tiring', 'sickening', 'fearful', 'punishing'],
      evaluative: ['annoying', 'troublesome', 'miserable', 'intense', 'unbearable'],
      miscellaneous: ['spreading', 'radiating', 'penetrating', 'piercing', 'tight', 'numb', 'drawing', 'squeezing', 'tearing', 'cool', 'cold', 'freezing']
    }
  },
  WOMAC: { name: 'Western Ontario and McMaster Universities Osteoarthritis Index', sections: ['pain', 'stiffness', 'function'] },
  ODI: { name: 'Oswestry Disability Index', sections: 10, maxScore: 50 },
  NDI: { name: 'Neck Disability Index', sections: 10, maxScore: 50 },
  DASH: { name: 'Disabilities of Arm Shoulder Hand', questions: 30 },
  LEFS: { name: 'Lower Extremity Functional Scale', questions: 20, maxScore: 80 },
}

// ============================================================================
// MULTI-LANGUAGE SUPPORT
// ============================================================================

export const LANGUAGES = {
  en: {
    code: 'en-US',
    name: 'English',
    voice: 'en-US',
    instructions: {
      startAssessment: 'Welcome. Let\'s begin your movement assessment. Please stand in front of the camera.',
      deepSquat: 'Deep Squat. Stand with feet shoulder-width apart. Squat down as low as comfortable, keeping heels on the floor.',
      shoulderRaise: 'Shoulder Raise. Raise both arms overhead as high as you can.',
      hipHinge: 'Hip Hinge. Bend forward at the hips, keeping your back straight.',
      armCurl: 'Arm Curl. Bend your elbows, bringing hands toward shoulders.',
      trunkRotation: 'Trunk Rotation. Rotate your upper body to the left, then to the right.',
      balanceCheck: 'Balance Check. Stand on one leg for as long as comfortable.',
      exerciseComplete: 'Excellent! Exercise complete. Moving to the next one.',
      assessmentComplete: 'Assessment complete. Great job! Your results are ready.',
      painDetected: 'I noticed you mentioned pain. Can you tell me more about where it hurts?',
      fallRiskWarning: 'Please be careful. Move slowly and use support if needed.',
    }
  },
  es: {
    code: 'es-ES',
    name: 'Spanish',
    voice: 'es-ES',
    instructions: {
      startAssessment: 'Bienvenido. Comencemos su evaluación de movimiento. Por favor, colóquese frente a la cámara.',
      deepSquat: 'Sentadilla profunda. Párese con los pies al ancho de los hombros. Baje lo más que pueda, manteniendo los talones en el suelo.',
      shoulderRaise: 'Elevación de hombros. Levante ambos brazos sobre la cabeza lo más alto que pueda.',
      hipHinge: 'Bisagra de cadera. Inclínese hacia adelante desde las caderas, manteniendo la espalda recta.',
      armCurl: 'Curl de brazos. Doble los codos, llevando las manos hacia los hombros.',
      trunkRotation: 'Rotación del tronco. Gire la parte superior del cuerpo hacia la izquierda, luego hacia la derecha.',
      balanceCheck: 'Control de equilibrio. Párese en una pierna el mayor tiempo posible.',
      exerciseComplete: '¡Excelente! Ejercicio completado. Pasamos al siguiente.',
      assessmentComplete: 'Evaluación completada. ¡Buen trabajo! Sus resultados están listos.',
      painDetected: 'Noté que mencionó dolor. ¿Puede decirme más sobre dónde le duele?',
      fallRiskWarning: 'Por favor tenga cuidado. Muévase lentamente y use apoyo si es necesario.',
    }
  },
  pt: {
    code: 'pt-BR',
    name: 'Portuguese',
    voice: 'pt-BR',
    instructions: {
      startAssessment: 'Bem-vindo. Vamos começar sua avaliação de movimento. Por favor, fique em frente à câmera.',
      deepSquat: 'Agachamento profundo. Fique com os pés na largura dos ombros. Agache o mais baixo que conseguir, mantendo os calcanhares no chão.',
      shoulderRaise: 'Elevação dos ombros. Levante ambos os braços acima da cabeça o mais alto que puder.',
      hipHinge: 'Dobradiça do quadril. Incline-se para frente a partir dos quadris, mantendo as costas retas.',
      armCurl: 'Rosca de braço. Dobre os cotovelos, trazendo as mãos em direção aos ombros.',
      trunkRotation: 'Rotação do tronco. Gire a parte superior do corpo para a esquerda, depois para a direita.',
      balanceCheck: 'Verificação de equilíbrio. Fique em uma perna pelo maior tempo possível.',
      exerciseComplete: 'Excelente! Exercício concluído. Vamos para o próximo.',
      assessmentComplete: 'Avaliação concluída. Ótimo trabalho! Seus resultados estão prontos.',
      painDetected: 'Percebi que você mencionou dor. Pode me dizer mais sobre onde dói?',
      fallRiskWarning: 'Por favor, tenha cuidado. Mova-se devagar e use apoio se necessário.',
    }
  },
  fr: {
    code: 'fr-FR',
    name: 'French',
    voice: 'fr-FR',
    instructions: {
      startAssessment: 'Bienvenue. Commençons votre évaluation du mouvement. Veuillez vous placer devant la caméra.',
      deepSquat: 'Squat profond. Tenez-vous debout, pieds écartés à la largeur des épaules. Descendez aussi bas que possible, en gardant les talons au sol.',
      shoulderRaise: 'Élévation des épaules. Levez les deux bras au-dessus de la tête aussi haut que possible.',
      hipHinge: 'Charnière de hanche. Penchez-vous en avant au niveau des hanches, en gardant le dos droit.',
      armCurl: 'Flexion des bras. Pliez les coudes, en ramenant les mains vers les épaules.',
      trunkRotation: 'Rotation du tronc. Tournez le haut du corps vers la gauche, puis vers la droite.',
      balanceCheck: 'Test d\'équilibre. Tenez-vous sur une jambe aussi longtemps que possible.',
      exerciseComplete: 'Excellent! Exercice terminé. Passons au suivant.',
      assessmentComplete: 'Évaluation terminée. Bon travail! Vos résultats sont prêts.',
      painDetected: 'J\'ai remarqué que vous avez mentionné une douleur. Pouvez-vous m\'en dire plus sur l\'endroit où ça fait mal?',
      fallRiskWarning: 'Soyez prudent. Bougez lentement et utilisez un support si nécessaire.',
    }
  },
  zh: {
    code: 'zh-CN',
    name: 'Chinese',
    voice: 'zh-CN',
    instructions: {
      startAssessment: '欢迎。让我们开始您的运动评估。请站在摄像头前。',
      deepSquat: '深蹲。双脚与肩同宽站立。尽可能深蹲，保持脚跟着地。',
      shoulderRaise: '肩部上举。尽可能高地举起双臂。',
      hipHinge: '髋关节铰链。从髋部向前弯曲，保持背部挺直。',
      armCurl: '手臂弯举。弯曲手肘，将手带向肩膀。',
      trunkRotation: '躯干旋转。将上半身向左旋转，然后向右旋转。',
      balanceCheck: '平衡检查。单腿站立尽可能长的时间。',
      exerciseComplete: '太棒了！练习完成。进入下一个。',
      assessmentComplete: '评估完成。做得好！您的结果已准备好。',
      painDetected: '我注意到您提到了疼痛。您能告诉我更多关于疼痛的位置吗？',
      fallRiskWarning: '请小心。慢慢移动，如需要请使用支撑。',
    }
  }
}
