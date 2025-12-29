import { Hono } from 'hono'
import { cors } from 'hono/cors'

// ============================================================================
// THRIVE ORTHO EHR - Professional MSK Assessment Platform v3.1
// BLUE Theme | Full Body Joint Tracking | Elderly-Specific Assessments
// Dashboard RIGHT | Gemini AI Integration
// ============================================================================

type Bindings = {
  GEMINI_API_KEY: string;
  OPENAI_API_KEY: string;
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()
app.use('/api/*', cors())

// ============================================================================
// COMPREHENSIVE JOINT DATA - All Body Joints
// ============================================================================

const allJoints = {
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
const normalROM = {
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

const movements = [
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

const exercises = [
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

const demoUsers = {
  patient: { id: 'P001', name: 'Sarah Johnson', email: 'sarah.j@email.com', avatar: 'SJ', age: 39, gender: 'Female', role: 'patient' },
  doctor: { id: 'D001', name: 'Dr. Michael Torres', email: 'dr.torres@thriveortho.com', avatar: 'MT', credentials: 'MD, Sports Medicine', role: 'doctor' },
  coach: { id: 'C001', name: 'Jessica Martinez', email: 'jessica.m@thriveortho.com', avatar: 'JM', credentials: 'DPT, CSCS, FMS', role: 'coach' },
  admin: { id: 'A001', name: 'Robert Chen', email: 'admin@thriveortho.com', avatar: 'RC', role: 'admin' }
}

const painKeywords = {
  red: ['numbness', 'tingling', 'weakness', 'bowel', 'bladder', 'night pain', 'fever', 'weight loss', 'cancer', 'trauma', 'fall', 'accident', 'bilateral', 'progressive', 'dizziness', 'vision changes'],
  yellow: ['stress', 'anxiety', 'depression', 'fear', 'catastrophizing', 'work', 'compensation', 'litigation', 'hopeless', 'frustrated'],
  severity: ['severe', 'excruciating', 'unbearable', 'worst', 'intense', 'sharp', 'shooting', 'burning', 'stabbing', 'constant'],
  elderly: ['fall', 'unsteady', 'dizzy', 'tripped', 'lost balance', 'weak legs', 'can\'t get up', 'stumble']
}

// ============================================================================
// BLUE DESIGN SYSTEM
// ============================================================================

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  /* Monochrome base */
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
  
  /* BLUE accent - medical blue */
  --accent: #2563eb;
  --accent-dark: #1d4ed8;
  --accent-light: #dbeafe;
  --accent-lighter: #eff6ff;
  
  /* Semantic */
  --error: #dc2626;
  --error-light: #fef2f2;
  --warning: #d97706;
  --warning-light: #fffbeb;
  --success: #059669;
  --success-light: #ecfdf5;
  --info: #0891b2;
  --info-light: #ecfeff;
  
  /* Layout */
  --sidebar-w: 180px;
  --panel-w: 320px;
  --radius: 6px;
  --radius-lg: 8px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: var(--gray-900);
  background: var(--gray-100);
  -webkit-font-smoothing: antialiased;
}

/* Layout - Dashboard on RIGHT */
.layout {
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr var(--panel-w);
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  background: white;
  border-right: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
  padding: 12px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px 16px;
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: 12px;
}

.logo-mark {
  width: 28px;
  height: 28px;
  background: var(--accent);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 10px;
}

.logo-text { font-weight: 700; font-size: 13px; color: var(--gray-900); }

.nav { flex: 1; }

.nav-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px 8px 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--radius);
  color: var(--gray-600);
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.nav-item:hover { background: var(--gray-100); color: var(--gray-900); }
.nav-item.active { background: var(--accent-light); color: var(--accent); }
.nav-item i { width: 14px; font-size: 11px; text-align: center; }

.user-card {
  padding: 10px;
  background: var(--gray-50);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.avatar {
  width: 28px;
  height: 28px;
  background: var(--accent);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 10px;
  flex-shrink: 0;
}

.avatar-lg { width: 36px; height: 36px; font-size: 12px; }
.user-name { font-weight: 600; font-size: 12px; }
.user-meta { font-size: 10px; color: var(--gray-500); }

/* Main Content */
.main {
  padding: 16px 20px;
  overflow-y: auto;
  background: var(--gray-100);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.title { font-size: 18px; font-weight: 700; color: var(--gray-900); }
.subtitle { font-size: 11px; color: var(--gray-500); margin-top: 2px; }

/* Right Panel - Wider for joint data */
.panel {
  background: white;
  border-left: 1px solid var(--gray-200);
  padding: 16px;
  overflow-y: auto;
}

.panel-section { margin-bottom: 16px; }

.panel-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.panel-card {
  background: var(--gray-50);
  border-radius: var(--radius);
  padding: 10px;
}

.panel-card + .panel-card { margin-top: 6px; }

/* Score Display */
.score-display {
  text-align: center;
  padding: 14px;
  background: var(--accent-lighter);
  border-radius: var(--radius);
  border: 1px solid var(--accent-light);
}

.score-value {
  font-size: 42px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}

.score-label {
  font-size: 11px;
  color: var(--gray-500);
  margin-top: 4px;
}

/* Cards */
.card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  margin-bottom: 12px;
}

.card-header {
  padding: 12px 14px;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title { font-weight: 600; font-size: 12px; color: var(--gray-900); }
.card-body { padding: 14px; }
.card-body-sm { padding: 10px; }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px 10px;
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 11px;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
  text-decoration: none;
}

.btn-primary { background: var(--accent); color: white; }
.btn-primary:hover { background: var(--accent-dark); }

.btn-secondary { background: white; color: var(--gray-700); border: 1px solid var(--gray-300); }
.btn-secondary:hover { background: var(--gray-50); border-color: var(--gray-400); }

.btn-ghost { background: transparent; color: var(--gray-600); }
.btn-ghost:hover { background: var(--gray-100); }

.btn-danger { background: var(--error); color: white; }
.btn-sm { padding: 4px 8px; font-size: 10px; }
.btn-lg { padding: 9px 14px; font-size: 12px; }
.btn-icon { width: 28px; height: 28px; padding: 0; }

/* Tables */
.table { width: 100%; border-collapse: collapse; }

.table th, .table td {
  padding: 8px 10px;
  text-align: left;
  border-bottom: 1px solid var(--gray-200);
  font-size: 11px;
}

.table th {
  font-weight: 600;
  font-size: 10px;
  text-transform: uppercase;
  color: var(--gray-500);
  background: var(--gray-50);
}

.table tbody tr:hover { background: var(--gray-50); }

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}

.badge-success { background: var(--success-light); color: var(--success); }
.badge-warning { background: var(--warning-light); color: var(--warning); }
.badge-danger { background: var(--error-light); color: var(--error); }
.badge-neutral { background: var(--gray-100); color: var(--gray-600); }
.badge-accent { background: var(--accent-light); color: var(--accent); }
.badge-info { background: var(--info-light); color: var(--info); }

/* Forms */
.form-group { margin-bottom: 12px; }
.form-label { display: block; font-size: 10px; font-weight: 600; color: var(--gray-600); margin-bottom: 4px; text-transform: uppercase; }

.form-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  font-size: 12px;
  color: var(--gray-900);
  background: white;
}

.form-input:focus { outline: none; border-color: var(--accent); }
.form-textarea { min-height: 80px; resize: vertical; font-family: inherit; }

/* Movement Grid - Smaller for more items */
.movement-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.movement-card {
  padding: 8px 6px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
  background: white;
  text-align: center;
}

.movement-card:hover { border-color: var(--accent); }
.movement-card.active { border-color: var(--accent); background: var(--accent-light); }
.movement-card.scored { border-color: var(--success); }
.movement-card.elderly { border-left: 3px solid var(--info); }

.movement-num {
  width: 18px;
  height: 18px;
  background: var(--gray-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  color: var(--gray-600);
  margin: 0 auto 4px;
}

.movement-card.scored .movement-num { background: var(--success); color: white; }
.movement-name { font-weight: 600; font-size: 9px; color: var(--gray-900); margin-bottom: 2px; line-height: 1.2; }
.movement-category { font-size: 8px; color: var(--gray-500); }
.movement-score { font-weight: 700; font-size: 12px; color: var(--gray-400); margin-top: 2px; }
.movement-card.scored .movement-score { color: var(--success); }

/* Score Buttons */
.score-btns { display: flex; gap: 6px; justify-content: center; }

.score-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  background: white;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--gray-600);
}

.score-btn:hover { border-color: var(--accent); color: var(--accent); }
.score-btn.selected { background: var(--accent); color: white; border-color: var(--accent); }

/* Video - BLUE Theme */
.video-box {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #172554 100%);
  border-radius: var(--radius-lg);
  aspect-ratio: 16/9;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--accent);
  box-shadow: 0 4px 24px rgba(37, 99, 235, 0.3), inset 0 0 60px rgba(37, 99, 235, 0.1);
}

.video-placeholder { text-align: center; color: #60a5fa; }
.video-placeholder i { font-size: 40px; margin-bottom: 10px; color: #3b82f6; }
.video-placeholder p { font-size: 11px; color: #93c5fd; }

.video-overlay {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.video-controls { display: flex; gap: 6px; flex-wrap: wrap; }

.video-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s;
}

.video-btn-light { background: rgba(59, 130, 246, 0.4); color: white; border: 1px solid rgba(147, 197, 253, 0.4); }
.video-btn-light:hover { background: rgba(59, 130, 246, 0.6); transform: scale(1.1); }
.video-btn-accent { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; box-shadow: 0 2px 10px rgba(37, 99, 235, 0.5); }
.video-btn-accent:hover { transform: scale(1.15); box-shadow: 0 4px 16px rgba(37, 99, 235, 0.7); }
.video-btn-danger { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; }

/* Joint Data Overlay - BLUE Theme */
.joint-overlay {
  background: linear-gradient(135deg, rgba(30, 58, 138, 0.95), rgba(29, 78, 216, 0.95));
  color: white;
  padding: 12px 14px;
  border-radius: var(--radius-lg);
  font-size: 9px;
  max-width: 300px;
  display: none;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.5);
  border: 1px solid rgba(147, 197, 253, 0.3);
  max-height: 400px;
  overflow-y: auto;
}

.joint-overlay.visible { display: block; }
.joint-overlay-title { 
  font-weight: 600; 
  font-size: 11px; 
  color: #bfdbfe; 
  margin-bottom: 8px; 
  border-bottom: 1px solid rgba(147, 197, 253, 0.3); 
  padding-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.joint-overlay-title i { color: #60a5fa; }

.joint-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3px 10px;
}

.joint-item { display: flex; justify-content: space-between; padding: 1px 0; }
.joint-item span:first-child { color: rgba(191, 219, 254, 0.7); font-size: 8px; }
.joint-item span:last-child { font-weight: 600; color: #bfdbfe; }
.joint-item.limited span:last-child { color: #fde047; }
.joint-item.good span:last-child { color: #86efac; }
.joint-item.critical span:last-child { color: #fca5a5; font-weight: 700; }

/* Voice */
.voice-area { text-align: center; padding: 24px; }

.voice-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.15s;
}

.voice-btn:hover { transform: scale(1.05); }
.voice-btn.recording { background: var(--error); animation: pulse 1.5s infinite; }

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(220, 38, 38, 0); }
}

.voice-status { font-size: 11px; color: var(--gray-500); margin-top: 10px; }

/* Flags */
.flag {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--radius);
  margin-bottom: 6px;
  font-size: 11px;
  border-left: 3px solid;
}

.flag-red { background: var(--error-light); border-color: var(--error); }
.flag-yellow { background: var(--warning-light); border-color: var(--warning); }
.flag-elderly { background: var(--info-light); border-color: var(--info); }
.flag i { margin-top: 1px; flex-shrink: 0; }
.flag-red i { color: var(--error); }
.flag-yellow i { color: var(--warning); }
.flag-elderly i { color: var(--info); }

/* Medical Note */
.medical-note {
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-size: 10px;
  line-height: 1.6;
  background: var(--gray-50);
  padding: 14px;
  border-radius: var(--radius);
  white-space: pre-wrap;
  max-height: 500px;
  overflow-y: auto;
  color: var(--gray-800);
}

/* Login */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-lighter) 0%, var(--gray-100) 100%);
}

.login-box {
  width: 100%;
  max-width: 360px;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.login-header { text-align: center; margin-bottom: 20px; }

.login-logo {
  width: 40px;
  height: 40px;
  background: var(--accent);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 14px;
  margin: 0 auto 10px;
}

.login-title { font-size: 16px; font-weight: 700; }
.login-subtitle { font-size: 11px; color: var(--gray-500); margin-top: 4px; }

.role-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 16px 0;
}

.role-btn {
  padding: 14px 8px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  background: white;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;
}

.role-btn:hover { border-color: var(--accent); }
.role-btn.selected { border-color: var(--accent); background: var(--accent-light); }
.role-btn i { font-size: 18px; color: var(--accent); margin-bottom: 6px; display: block; }
.role-btn span { font-weight: 600; font-size: 11px; color: var(--gray-800); }

/* Tasks */
.task-list { list-style: none; }

.task-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--gray-200);
}

.task-item:last-child { border-bottom: none; }

.task-check {
  width: 16px;
  height: 16px;
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}

.task-check:hover { border-color: var(--accent); }
.task-check.done { background: var(--accent); border-color: var(--accent); color: white; }
.task-check i { font-size: 9px; display: none; }
.task-check.done i { display: block; }

.task-content { flex: 1; }
.task-title { font-size: 11px; font-weight: 500; }
.task-item.completed .task-title { color: var(--gray-400); text-decoration: line-through; }
.task-meta { font-size: 10px; color: var(--gray-500); }

.task-priority { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.task-priority.high { background: var(--error); }
.task-priority.medium { background: var(--warning); }
.task-priority.low { background: var(--success); }

/* Demo Banner */
.demo-bar {
  background: var(--gray-900);
  color: white;
  padding: 5px 16px;
  font-size: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.demo-bar a { color: var(--accent-light); text-decoration: none; }
.demo-bar a:hover { text-decoration: underline; }

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.stat-box {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 12px;
}

.stat-value { font-size: 22px; font-weight: 700; color: var(--gray-900); }
.stat-label { font-size: 10px; color: var(--gray-500); margin-top: 2px; }

/* Tele grid */
.tele-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.tele-video {
  background: var(--gray-900);
  border-radius: var(--radius-lg);
  aspect-ratio: 16/10;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.tele-label {
  position: absolute;
  bottom: 6px;
  left: 6px;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
}

/* Category tabs */
.category-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.category-tab {
  padding: 4px 8px;
  border-radius: var(--radius);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  background: var(--gray-100);
  color: var(--gray-600);
  border: none;
  transition: all 0.15s;
}

.category-tab:hover { background: var(--gray-200); }
.category-tab.active { background: var(--accent); color: white; }

/* Utilities */
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-1 { gap: 6px; }
.gap-2 { gap: 12px; }
.mt-1 { margin-top: 6px; }
.mt-2 { margin-top: 12px; }
.mb-1 { margin-bottom: 6px; }
.mb-2 { margin-bottom: 12px; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-sm { font-size: 10px; }
.text-muted { color: var(--gray-500); }
.text-danger { color: var(--error); }
.text-success { color: var(--success); }
.text-accent { color: var(--accent); }
.font-mono { font-family: 'SF Mono', monospace; }
`

// ============================================================================
// HTML Template
// ============================================================================

const html = (content: string, title = 'Thrive Ortho EHR') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <style>${styles}</style>
</head>
<body>${content}</body>
</html>
`

// Sidebar
const sidebar = (role: string, active: string) => {
  const user = demoUsers[role as keyof typeof demoUsers]
  const navs: Record<string, Array<{id: string, icon: string, label: string, href: string}>> = {
    doctor: [
      { id: 'dashboard', icon: 'fa-grid-2', label: 'Dashboard', href: '/doctor' },
      { id: 'patients', icon: 'fa-users', label: 'Patients', href: '/doctor/patients' },
      { id: 'intake', icon: 'fa-microphone', label: 'Voice Intake', href: '/doctor/intake' },
      { id: 'assessment', icon: 'fa-person-running', label: 'MSK Assessment', href: '/doctor/assessment' },
      { id: 'joints', icon: 'fa-bone', label: 'Full Body Scan', href: '/doctor/joints' },
      { id: 'notes', icon: 'fa-file-medical', label: 'Medical Notes', href: '/doctor/notes' },
      { id: 'video', icon: 'fa-video', label: 'Telemedicine', href: '/doctor/video' },
      { id: 'tasks', icon: 'fa-list-check', label: 'Tasks', href: '/doctor/tasks' },
    ],
    coach: [
      { id: 'dashboard', icon: 'fa-grid-2', label: 'Dashboard', href: '/coach' },
      { id: 'clients', icon: 'fa-users', label: 'Clients', href: '/coach/clients' },
      { id: 'assessment', icon: 'fa-person-running', label: 'Assessment', href: '/coach/assessment' },
      { id: 'programs', icon: 'fa-dumbbell', label: 'Programs', href: '/coach/programs' },
    ],
    patient: [
      { id: 'dashboard', icon: 'fa-grid-2', label: 'My Dashboard', href: '/patient' },
      { id: 'exercises', icon: 'fa-dumbbell', label: 'Exercises', href: '/patient/exercises' },
      { id: 'appointments', icon: 'fa-calendar', label: 'Appointments', href: '/patient/appointments' },
      { id: 'video', icon: 'fa-video', label: 'Video Visit', href: '/patient/video' },
    ],
    admin: [
      { id: 'dashboard', icon: 'fa-grid-2', label: 'Overview', href: '/admin' },
      { id: 'users', icon: 'fa-users-gear', label: 'Users', href: '/admin/users' },
      { id: 'analytics', icon: 'fa-chart-line', label: 'Analytics', href: '/admin/analytics' },
    ]
  }
  
  return `
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-mark">TO</div>
        <div class="logo-text">Thrive Ortho</div>
      </div>
      
      <nav class="nav">
        <div class="nav-label">Navigation</div>
        ${navs[role]?.map(item => `
          <a class="nav-item ${active === item.id ? 'active' : ''}" href="${item.href}">
            <i class="fas ${item.icon}"></i>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </nav>
      
      <div class="user-card">
        <div class="avatar">${user?.avatar || 'U'}</div>
        <div>
          <div class="user-name">${user?.name || 'User'}</div>
          <div class="user-meta" style="text-transform: capitalize;">${role}</div>
        </div>
      </div>
    </aside>
  `
}

// Right Panel with full joint data
const rightPanel = (data: any = {}) => `
  <aside class="panel">
    <div class="panel-section">
      <div class="panel-label">Assessment Score</div>
      <div class="score-display">
        <div class="score-value" id="fmsScore">${data.fmsScore ?? '--'}</div>
        <div class="score-label">of 21 points (FMS)</div>
      </div>
      <div class="mt-1 text-center">
        <span class="badge ${data.fmsScore <= 11 ? 'badge-danger' : data.fmsScore <= 14 ? 'badge-warning' : data.fmsScore ? 'badge-success' : 'badge-neutral'}" id="riskBadge">
          ${data.fmsScore <= 11 ? 'High Risk' : data.fmsScore <= 14 ? 'Moderate' : data.fmsScore ? 'Low Risk' : 'Not Scored'}
        </span>
      </div>
    </div>
    
    <div class="panel-section">
      <div class="panel-label">Current Patient</div>
      <div class="panel-card">
        <div class="flex items-center gap-1 mb-1">
          <div class="avatar">SJ</div>
          <div>
            <div class="user-name">Sarah Johnson</div>
            <div class="user-meta">39 y/o Female</div>
          </div>
        </div>
        <div class="text-sm text-muted" style="margin-top: 6px; padding-top: 6px; border-top: 1px solid var(--gray-200);">
          <strong>CC:</strong> LBP w/ radiculopathy
        </div>
      </div>
    </div>
    
    <div class="panel-section">
      <div class="panel-label">AI Joint Analysis</div>
      <div class="panel-card" id="jointAnalysisPanel">
        <div class="text-center text-sm text-muted" style="padding: 10px;">
          <i class="fas fa-bone" style="font-size: 18px; margin-bottom: 4px; display: block; color: var(--accent);"></i>
          Capture to analyze all joints
        </div>
      </div>
    </div>
    
    <div class="panel-section">
      <div class="panel-label">Clinical Flags</div>
      <div id="flagsContainer">
        <div class="panel-card text-center text-sm text-muted" style="padding: 10px;">
          Complete intake for flags
        </div>
      </div>
    </div>
    
    <div class="panel-section">
      <div class="panel-label">Quick Actions</div>
      <a href="/doctor/intake" class="btn btn-secondary" style="width: 100%; margin-bottom: 6px;">
        <i class="fas fa-microphone"></i> Voice Intake
      </a>
      <a href="/doctor/joints" class="btn btn-secondary" style="width: 100%; margin-bottom: 6px;">
        <i class="fas fa-bone"></i> Full Body Scan
      </a>
      <a href="/doctor/notes" class="btn btn-primary" style="width: 100%;">
        <i class="fas fa-file-medical"></i> Generate Note
      </a>
    </div>
  </aside>
`

// ============================================================================
// API ROUTES
// ============================================================================

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: { gemini: true, openai: true, d1: true },
    version: '3.1'
  })
})

// COMPREHENSIVE JOINT ANALYSIS - All Body Parts
app.post('/api/ai/analyze-joints', async (c) => {
  const { imageBase64, movement, analysisType } = await c.req.json()
  const geminiKey = c.env?.GEMINI_API_KEY || ''
  
  // Determine analysis focus
  const isFullBody = analysisType === 'full' || !movement
  const isElderly = analysisType === 'elderly'
  const isGait = analysisType === 'gait' || movement?.toLowerCase().includes('walk') || movement?.toLowerCase().includes('gait')
  const isHands = analysisType === 'hands'
  const isFeet = analysisType === 'feet'
  const isFace = analysisType === 'face'
  
  if (!geminiKey || geminiKey === 'YOUR_GEMINI_API_KEY') {
    // Comprehensive mock data
    return c.json({
      success: true,
      mock: true,
      analysis: {
        // HEAD & FACE
        face: {
          jaw_opening: '42mm',
          facial_symmetry: 'Normal',
          eye_tracking: 'Full range'
        },
        // CERVICAL
        cervical: {
          flexion: '42°',
          extension: '40°',
          lateral_L: '38°',
          lateral_R: '40°',
          rotation_L: '72°',
          rotation_R: '75°'
        },
        // SHOULDERS
        shoulder_L: {
          flexion: '168°',
          extension: '52°',
          abduction: '165°',
          internal_rotation: '62°',
          external_rotation: '82°'
        },
        shoulder_R: {
          flexion: '172°',
          extension: '55°',
          abduction: '170°',
          internal_rotation: '65°',
          external_rotation: '85°'
        },
        // ELBOWS
        elbow_L: { flexion: '145°', extension: '0°' },
        elbow_R: { flexion: '148°', extension: '0°' },
        // WRISTS
        wrist_L: { flexion: '72°', extension: '65°', radial: '18°', ulnar: '28°' },
        wrist_R: { flexion: '75°', extension: '68°', radial: '20°', ulnar: '30°' },
        // HANDS
        hand_L: { grip_strength: '28kg', pinch: '6kg', finger_flexion: 'Full', thumb_opposition: 'Normal' },
        hand_R: { grip_strength: '32kg', pinch: '7kg', finger_flexion: 'Full', thumb_opposition: 'Normal' },
        // SPINE
        thoracic: { flexion: '30°', extension: '20°', rotation_L: '35°', rotation_R: '38°' },
        lumbar: { flexion: '55°', extension: '22°', lateral_L: '24°', lateral_R: '26°' },
        // HIPS
        hip_L: {
          flexion: '112°',
          extension: '18°',
          abduction: '38°',
          adduction: '22°',
          internal_rotation: '32°',
          external_rotation: '38°'
        },
        hip_R: {
          flexion: '115°',
          extension: '20°',
          abduction: '40°',
          adduction: '24°',
          internal_rotation: '35°',
          external_rotation: '42°'
        },
        // KNEES
        knee_L: { flexion: '132°', extension: '-2°' },
        knee_R: { flexion: '135°', extension: '0°' },
        // ANKLES
        ankle_L: { dorsiflexion: '12°', plantarflexion: '42°', inversion: '28°', eversion: '15°' },
        ankle_R: { dorsiflexion: '14°', plantarflexion: '45°', inversion: '30°', eversion: '18°' },
        // FEET
        foot_L: { arch_height: 'Normal', great_toe_ext: '65°', toe_spread: 'Good' },
        foot_R: { arch_height: 'Normal', great_toe_ext: '68°', toe_spread: 'Good' },
        // GAIT (for walking forward/backward analysis)
        gait: (isGait || isElderly) ? {
          cadence: '108 steps/min',
          stride_length_L: '62cm',
          stride_length_R: '65cm',
          step_width: '8cm',
          arm_swing: 'Decreased bilaterally',
          heel_strike: 'Normal',
          toe_off: 'Normal',
          trunk_rotation: 'Minimal',
          balance: 'Stable',
          forward_walk: 'Steady, 4.2s for 20ft',
          backward_walk: 'Cautious, 6.8s for 10ft',
          turn_quality: 'Uses 5 steps for 180°'
        } : null,
        // ELDERLY SPECIFIC FALL RISK
        elderly: isElderly ? {
          tug_time: '11.2s',
          tug_risk: 'Moderate',
          single_leg_stance_L: '8s',
          single_leg_stance_R: '12s',
          functional_reach: '9 inches',
          sit_to_stand_time: '14s',
          turn_steps: '5 steps',
          fall_risk: 'Moderate',
          tandem_walk: 'Unsteady after 5 steps',
          backward_gait: 'Hesitant',
          fear_of_falling: 'Reported',
          assistive_device: 'None currently'
        } : null,
        // OVERALL
        score: 2,
        compensations: [
          'Limited ankle dorsiflexion bilaterally',
          'Hip flexor tightness noted',
          'Forward head posture'
        ],
        limitations: [
          'Ankle DF: 12-14° (normal >20°)',
          'Lumbar extension: 22° (normal >30°)',
          'Hip IR both sides reduced'
        ],
        recommendations: [
          'Ankle mobility exercises daily',
          'Hip flexor stretching protocol',
          'Cervical retraction exercises',
          'Core stabilization program'
        ],
        confidence: 0.89
      }
    })
  }
  
  // Real Gemini API call
  try {
    const prompt = isFullBody ? `You are an expert medical AI specializing in comprehensive musculoskeletal assessment. Analyze this full-body image and provide detailed joint measurements.

Return ONLY valid JSON with ALL joints:
{
  "face": { "jaw_opening": "mm", "facial_symmetry": "status", "eye_tracking": "status" },
  "cervical": { "flexion": "°", "extension": "°", "lateral_L": "°", "lateral_R": "°", "rotation_L": "°", "rotation_R": "°" },
  "shoulder_L": { "flexion": "°", "extension": "°", "abduction": "°", "internal_rotation": "°", "external_rotation": "°" },
  "shoulder_R": { "flexion": "°", "extension": "°", "abduction": "°", "internal_rotation": "°", "external_rotation": "°" },
  "elbow_L": { "flexion": "°", "extension": "°" },
  "elbow_R": { "flexion": "°", "extension": "°" },
  "wrist_L": { "flexion": "°", "extension": "°", "radial": "°", "ulnar": "°" },
  "wrist_R": { "flexion": "°", "extension": "°", "radial": "°", "ulnar": "°" },
  "hand_L": { "grip_strength": "kg", "finger_flexion": "status", "thumb_opposition": "status" },
  "hand_R": { "grip_strength": "kg", "finger_flexion": "status", "thumb_opposition": "status" },
  "thoracic": { "flexion": "°", "extension": "°", "rotation_L": "°", "rotation_R": "°" },
  "lumbar": { "flexion": "°", "extension": "°", "lateral_L": "°", "lateral_R": "°" },
  "hip_L": { "flexion": "°", "extension": "°", "abduction": "°", "internal_rotation": "°", "external_rotation": "°" },
  "hip_R": { "flexion": "°", "extension": "°", "abduction": "°", "internal_rotation": "°", "external_rotation": "°" },
  "knee_L": { "flexion": "°", "extension": "°" },
  "knee_R": { "flexion": "°", "extension": "°" },
  "ankle_L": { "dorsiflexion": "°", "plantarflexion": "°", "inversion": "°", "eversion": "°" },
  "ankle_R": { "dorsiflexion": "°", "plantarflexion": "°", "inversion": "°", "eversion": "°" },
  "foot_L": { "arch_height": "status", "great_toe_ext": "°", "toe_spread": "status" },
  "foot_R": { "arch_height": "status", "great_toe_ext": "°", "toe_spread": "status" },
  ${isGait ? '"gait": { "cadence": "steps/min", "stride_length_L": "cm", "stride_length_R": "cm", "arm_swing": "status", "balance": "status" },' : ''}
  ${isElderly ? '"elderly": { "fall_risk": "low/moderate/high", "balance_concern": "yes/no", "gait_pattern": "status" },' : ''}
  "score": 0-3,
  "compensations": ["list"],
  "limitations": ["list with measurements"],
  "recommendations": ["list"],
  "confidence": 0.0-1.0
}` : `Analyze ${movement} movement. Return JSON with relevant joint angles, score 0-3, compensations, and recommendations.`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }
          ]
        }],
        generationConfig: { temperature: 0.2 }
      })
    })
    
    const data = await response.json()
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const text = data.candidates[0].content.parts[0].text
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0])
        return c.json({ success: true, analysis })
      }
    }
    
    return c.json({ success: false, error: 'Failed to parse response' })
  } catch (error: any) {
    return c.json({ success: false, error: error.message })
  }
})

// Voice Analysis
app.post('/api/ai/analyze-voice', async (c) => {
  const { transcript } = await c.req.json()
  const text = transcript.toLowerCase()
  const geminiKey = c.env?.GEMINI_API_KEY || ''
  
  const flags = {
    red: [] as string[],
    yellow: [] as string[],
    severity: [] as string[],
    elderly: [] as string[]
  }
  
  painKeywords.red.forEach(kw => { if (text.includes(kw)) flags.red.push(kw) })
  painKeywords.yellow.forEach(kw => { if (text.includes(kw)) flags.yellow.push(kw) })
  painKeywords.severity.forEach(kw => { if (text.includes(kw)) flags.severity.push(kw) })
  painKeywords.elderly.forEach(kw => { if (text.includes(kw)) flags.elderly.push(kw) })
  
  let aiAnalysis = null
  
  if (geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY') {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze patient statement for MSK triage. Detect voice cues indicating pain.

Statement: "${transcript}"

Return JSON:
{
  "redFlags": ["serious concerns"],
  "yellowFlags": ["psychosocial factors"],
  "elderlyFlags": ["fall risk, balance issues"],
  "voiceCues": ["detected pain indicators: hesitation, gasps, etc"],
  "potentialDx": [{"code": "ICD-10", "name": "diagnosis"}],
  "painLevel": 1-10,
  "urgency": "routine|urgent|emergent",
  "fallRisk": "low|moderate|high",
  "recommendations": ["list"]
}`
            }]
          }],
          generationConfig: { temperature: 0.3 }
        })
      })
      
      const data = await response.json()
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const jsonMatch = data.candidates[0].content.parts[0].text.match(/\{[\s\S]*\}/)
        if (jsonMatch) aiAnalysis = JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      console.error('Voice analysis error:', e)
    }
  }
  
  return c.json({ flags, aiAnalysis })
})

// Generate Medical Note
app.post('/api/ai/generate-note', async (c) => {
  const { patient, intake, fmsScores, aiFlags, jointAnalysis } = await c.req.json()
  
  let fmsTotal = 0
  for (let i = 1; i <= 7; i++) {
    if (fmsScores?.[i] !== undefined) fmsTotal += fmsScores[i]
  }
  const riskLevel = fmsTotal <= 11 ? 'HIGH' : fmsTotal <= 14 ? 'MODERATE' : 'LOW'
  
  const note = `
╔══════════════════════════════════════════════════════════════════════════════╗
║              COMPREHENSIVE MUSCULOSKELETAL EVALUATION v3.1                   ║
║                        THRIVE ORTHO EHR                                      ║
╚══════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════════════════
ADMINISTRATIVE
═══════════════════════════════════════════════════════════════════════════════
DATE:     ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
PROVIDER: Dr. Michael Torres, MD | Sports Medicine
NPI:      1234567890

═══════════════════════════════════════════════════════════════════════════════
PATIENT
═══════════════════════════════════════════════════════════════════════════════
NAME:      ${patient?.name || 'Sarah Johnson'}
DOB:       03/15/1985 | AGE: 39 | SEX: Female
MRN:       P-2025-001234

═══════════════════════════════════════════════════════════════════════════════
CHIEF COMPLAINT
═══════════════════════════════════════════════════════════════════════════════
${intake?.chiefComplaint || 'Lower back pain with right leg radiating symptoms × 6 weeks'}

═══════════════════════════════════════════════════════════════════════════════
AI CLINICAL FLAGS
═══════════════════════════════════════════════════════════════════════════════
RED FLAGS:     ${aiFlags?.red?.length > 0 ? aiFlags.red.join(', ').toUpperCase() : 'None'}
YELLOW FLAGS:  ${aiFlags?.yellow?.length > 0 ? aiFlags.yellow.join(', ') : 'None'}
ELDERLY FLAGS: ${aiFlags?.elderly?.length > 0 ? aiFlags.elderly.join(', ') : 'N/A'}
FALL RISK:     ${aiFlags?.fallRisk || 'Low'}

═══════════════════════════════════════════════════════════════════════════════
FMS ASSESSMENT (Movements 1-7)
═══════════════════════════════════════════════════════════════════════════════
TOTAL SCORE: ${fmsTotal}/21 | RISK: ▶ ${riskLevel} ◀

┌─────────────────────────────────┬───────┐
│ Movement                        │ Score │
├─────────────────────────────────┼───────┤
│ 1. Deep Squat                   │   ${fmsScores?.[1] ?? '-'}   │
│ 2. Hurdle Step                  │   ${fmsScores?.[2] ?? '-'}   │
│ 3. Inline Lunge                 │   ${fmsScores?.[3] ?? '-'}   │
│ 4. Shoulder Mobility            │   ${fmsScores?.[4] ?? '-'}   │
│ 5. Active Straight Leg Raise    │   ${fmsScores?.[5] ?? '-'}   │
│ 6. Trunk Stability Push-Up      │   ${fmsScores?.[6] ?? '-'}   │
│ 7. Rotary Stability             │   ${fmsScores?.[7] ?? '-'}   │
└─────────────────────────────────┴───────┘

═══════════════════════════════════════════════════════════════════════════════
COMPREHENSIVE JOINT ANALYSIS (Gemini AI)
═══════════════════════════════════════════════════════════════════════════════
${jointAnalysis ? `
CERVICAL:
  Flexion: ${jointAnalysis.cervical?.flexion || '--'}  Extension: ${jointAnalysis.cervical?.extension || '--'}
  Lateral L/R: ${jointAnalysis.cervical?.lateral_L || '--'}/${jointAnalysis.cervical?.lateral_R || '--'}
  Rotation L/R: ${jointAnalysis.cervical?.rotation_L || '--'}/${jointAnalysis.cervical?.rotation_R || '--'}

SHOULDERS (L/R):
  Flexion: ${jointAnalysis.shoulder_L?.flexion || '--'}/${jointAnalysis.shoulder_R?.flexion || '--'}
  Abduction: ${jointAnalysis.shoulder_L?.abduction || '--'}/${jointAnalysis.shoulder_R?.abduction || '--'}
  IR/ER L: ${jointAnalysis.shoulder_L?.internal_rotation || '--'}/${jointAnalysis.shoulder_L?.external_rotation || '--'}
  IR/ER R: ${jointAnalysis.shoulder_R?.internal_rotation || '--'}/${jointAnalysis.shoulder_R?.external_rotation || '--'}

ELBOWS (L/R):
  Flexion: ${jointAnalysis.elbow_L?.flexion || '--'}/${jointAnalysis.elbow_R?.flexion || '--'}

WRISTS (L/R):
  Flexion: ${jointAnalysis.wrist_L?.flexion || '--'}/${jointAnalysis.wrist_R?.flexion || '--'}
  Extension: ${jointAnalysis.wrist_L?.extension || '--'}/${jointAnalysis.wrist_R?.extension || '--'}

HANDS:
  Grip Strength L/R: ${jointAnalysis.hand_L?.grip_strength || '--'}/${jointAnalysis.hand_R?.grip_strength || '--'}

LUMBAR:
  Flexion: ${jointAnalysis.lumbar?.flexion || '--'}  Extension: ${jointAnalysis.lumbar?.extension || '--'}
  Lateral L/R: ${jointAnalysis.lumbar?.lateral_L || '--'}/${jointAnalysis.lumbar?.lateral_R || '--'}

HIPS (L/R):
  Flexion: ${jointAnalysis.hip_L?.flexion || '--'}/${jointAnalysis.hip_R?.flexion || '--'}
  Extension: ${jointAnalysis.hip_L?.extension || '--'}/${jointAnalysis.hip_R?.extension || '--'}
  Abduction: ${jointAnalysis.hip_L?.abduction || '--'}/${jointAnalysis.hip_R?.abduction || '--'}
  IR/ER L: ${jointAnalysis.hip_L?.internal_rotation || '--'}/${jointAnalysis.hip_L?.external_rotation || '--'}
  IR/ER R: ${jointAnalysis.hip_R?.internal_rotation || '--'}/${jointAnalysis.hip_R?.external_rotation || '--'}

KNEES (L/R):
  Flexion: ${jointAnalysis.knee_L?.flexion || '--'}/${jointAnalysis.knee_R?.flexion || '--'}
  Extension: ${jointAnalysis.knee_L?.extension || '--'}/${jointAnalysis.knee_R?.extension || '--'}

ANKLES (L/R):
  Dorsiflexion: ${jointAnalysis.ankle_L?.dorsiflexion || '--'}/${jointAnalysis.ankle_R?.dorsiflexion || '--'}
  Plantarflexion: ${jointAnalysis.ankle_L?.plantarflexion || '--'}/${jointAnalysis.ankle_R?.plantarflexion || '--'}

FEET:
  Arch Height L/R: ${jointAnalysis.foot_L?.arch_height || '--'}/${jointAnalysis.foot_R?.arch_height || '--'}
  Great Toe Ext L/R: ${jointAnalysis.foot_L?.great_toe_ext || '--'}/${jointAnalysis.foot_R?.great_toe_ext || '--'}

${jointAnalysis.gait ? `
GAIT ANALYSIS:
  Cadence: ${jointAnalysis.gait.cadence}
  Stride Length L/R: ${jointAnalysis.gait.stride_length_L}/${jointAnalysis.gait.stride_length_R}
  Arm Swing: ${jointAnalysis.gait.arm_swing}
  Balance: ${jointAnalysis.gait.balance}
` : ''}
${jointAnalysis.elderly ? `
ELDERLY ASSESSMENT:
  TUG Time: ${jointAnalysis.elderly.tug_time} (${jointAnalysis.elderly.tug_risk} risk)
  Single Leg Stance L/R: ${jointAnalysis.elderly.single_leg_stance_L}/${jointAnalysis.elderly.single_leg_stance_R}
  Functional Reach: ${jointAnalysis.elderly.functional_reach}
  Sit-to-Stand: ${jointAnalysis.elderly.sit_to_stand_time}
  Fall Risk: ${jointAnalysis.elderly.fall_risk}
` : ''}
LIMITATIONS:
${jointAnalysis.limitations?.map((l: string) => `  • ${l}`).join('\n') || '  None identified'}

COMPENSATIONS:
${jointAnalysis.compensations?.map((c: string) => `  • ${c}`).join('\n') || '  None identified'}
` : 'Full joint analysis not performed'}

═══════════════════════════════════════════════════════════════════════════════
DIAGNOSIS (ICD-10)
═══════════════════════════════════════════════════════════════════════════════
1. M54.5   Low back pain
2. M54.16  Radiculopathy, lumbar region
3. M62.838 Muscle spasm
4. M99.03  Segmental dysfunction, lumbar

═══════════════════════════════════════════════════════════════════════════════
CPT CODES
═══════════════════════════════════════════════════════════════════════════════
97163  PT Evaluation - High Complexity     1 unit
97110  Therapeutic Exercise                2 units
97140  Manual Therapy                      2 units
97530  Therapeutic Activities              1 unit

═══════════════════════════════════════════════════════════════════════════════
PLAN
═══════════════════════════════════════════════════════════════════════════════
Frequency: 2x/week × 6 weeks

HOME EXERCISE PROGRAM:
1. Hip Flexor Stretch - 3×30s, 2x daily
2. Ankle Circles - 2×10, 2x daily
3. Bird Dog - 3×10, daily
4. Chair Stands - 2×10, daily
5. Tandem Balance - 3×30s, daily

═══════════════════════════════════════════════════════════════════════════════
FOLLOW-UP
═══════════════════════════════════════════════════════════════════════════════
Next: ${new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString()}
Re-eval: ${new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString()}

_________________________________
Dr. Michael Torres, MD
Sports Medicine

╔══════════════════════════════════════════════════════════════════════════════╗
║          THRIVE ORTHO EHR v3.1 | Gemini AI | Full Body Analysis              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`.trim()

  return c.json({ note })
})

// API endpoints
app.get('/api/tasks', (c) => c.json({ tasks: [
  { id: 1, title: 'Complete Sarah Johnson intake', priority: 'high', status: 'pending', due: 'Today' },
  { id: 2, title: 'Full body joint scan', priority: 'high', status: 'pending', due: 'Today' },
  { id: 3, title: 'Generate medical note', priority: 'high', status: 'pending', due: 'Today' },
  { id: 4, title: 'Elderly gait assessment - Mr. Thompson', priority: 'medium', status: 'pending', due: 'Tomorrow' },
]}))

app.get('/api/exercises', (c) => c.json({ exercises }))
app.get('/api/movements', (c) => c.json({ movements }))

// ============================================================================
// PAGE ROUTES
// ============================================================================

// Login
app.get('/login', (c) => {
  return c.html(html(`
    <div class="login-page">
      <div class="login-box">
        <div class="login-header">
          <div class="login-logo">TO</div>
          <div class="login-title">Thrive Ortho EHR</div>
          <div class="login-subtitle">Full Body MSK Assessment v3.1</div>
        </div>
        
        <div style="font-size: 11px; font-weight: 600; color: var(--gray-600); margin-bottom: 6px;">
          Select Role
        </div>
        
        <div class="role-grid">
          <button class="role-btn" onclick="selectRole('patient')">
            <i class="fas fa-user"></i>
            <span>Patient</span>
          </button>
          <button class="role-btn selected" onclick="selectRole('doctor')">
            <i class="fas fa-user-md"></i>
            <span>Doctor</span>
          </button>
          <button class="role-btn" onclick="selectRole('coach')">
            <i class="fas fa-clipboard-user"></i>
            <span>Coach</span>
          </button>
          <button class="role-btn" onclick="selectRole('admin')">
            <i class="fas fa-gear"></i>
            <span>Admin</span>
          </button>
        </div>
        
        <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="login()">
          Skip Login (Demo) <i class="fas fa-arrow-right" style="margin-left: 4px;"></i>
        </button>
        
        <div class="text-center text-muted text-sm" style="margin-top: 14px;">
          All Joints • Hands • Feet • Face • Gait • Elderly
        </div>
      </div>
    </div>
    
    <script>
      let role = 'doctor';
      function selectRole(r) {
        role = r;
        document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
      }
      function login() { location.href = '/' + role; }
    </script>
  `, 'Login - Thrive Ortho EHR'))
})

// Doctor Dashboard
app.get('/doctor', (c) => {
  return c.html(html(`
    <div class="demo-bar">
      <span>Demo Mode — Dr. Michael Torres</span>
      <a href="/login">Switch Role</a>
    </div>
    <div class="layout">
      ${sidebar('doctor', 'dashboard')}
      
      <main class="main">
        <div class="header">
          <div>
            <h1 class="title">Dashboard</h1>
            <p class="subtitle">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div class="flex gap-1">
            <a href="/doctor/joints" class="btn btn-secondary"><i class="fas fa-bone"></i> Full Body Scan</a>
            <a href="/doctor/assessment" class="btn btn-primary"><i class="fas fa-plus"></i> Assessment</a>
          </div>
        </div>
        
        <div class="stats-row">
          <div class="stat-box">
            <div class="stat-value">8</div>
            <div class="stat-label">Today's Patients</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">3</div>
            <div class="stat-label">Assessments</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">2</div>
            <div class="stat-label">Elderly Evals</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">5</div>
            <div class="stat-label">Notes Due</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title">Today's Patients</span>
          </div>
          <table class="table">
            <thead>
              <tr><th>Patient</th><th>Type</th><th>Focus</th><th>FMS</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              <tr>
                <td><div class="flex items-center gap-1"><div class="avatar">SJ</div><div><strong>Sarah Johnson</strong><div class="text-muted text-sm">39 y/o F</div></div></div></td>
                <td>Standard</td>
                <td>LBP, Hip, Ankle</td>
                <td><span style="font-weight: 700; color: var(--warning);">12</span>/21</td>
                <td><span class="badge badge-warning">In Progress</span></td>
                <td class="text-right"><a href="/doctor/joints" class="btn btn-sm btn-primary"><i class="fas fa-bone"></i></a></td>
              </tr>
              <tr>
                <td><div class="flex items-center gap-1"><div class="avatar">RT</div><div><strong>Robert Thompson</strong><div class="text-muted text-sm">72 y/o M</div></div></div></td>
                <td><span class="badge badge-info">Elderly</span></td>
                <td>Gait, Balance, Fall Risk</td>
                <td><span style="font-weight: 700; color: var(--error);">9</span>/21</td>
                <td><span class="badge badge-danger">High Risk</span></td>
                <td class="text-right"><a href="/doctor/joints" class="btn btn-sm btn-primary"><i class="fas fa-bone"></i></a></td>
              </tr>
              <tr>
                <td><div class="flex items-center gap-1"><div class="avatar">MK</div><div><strong>Maria Kim</strong><div class="text-muted text-sm">45 y/o F</div></div></div></td>
                <td>Standard</td>
                <td>Hands, Wrists</td>
                <td><span style="font-weight: 700; color: var(--success);">16</span>/21</td>
                <td><span class="badge badge-success">Low Risk</span></td>
                <td class="text-right"><a href="/doctor/joints" class="btn btn-sm btn-ghost"><i class="fas fa-bone"></i></a></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title">Tasks</span>
            <a href="/doctor/tasks" class="btn btn-sm btn-secondary">View All</a>
          </div>
          <div class="card-body">
            <ul class="task-list">
              <li class="task-item">
                <div class="task-priority high"></div>
                <div class="task-check" onclick="toggleTask(this)"><i class="fas fa-check"></i></div>
                <div class="task-content">
                  <div class="task-title">Full body joint scan - Sarah Johnson</div>
                  <div class="task-meta">Due: Today</div>
                </div>
              </li>
              <li class="task-item">
                <div class="task-priority high"></div>
                <div class="task-check" onclick="toggleTask(this)"><i class="fas fa-check"></i></div>
                <div class="task-content">
                  <div class="task-title">Elderly gait assessment - Robert Thompson</div>
                  <div class="task-meta">Due: Today • Fall risk evaluation</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
      
      ${rightPanel({ fmsScore: 12 })}
    </div>
    
    <script>
      function toggleTask(el) {
        el.classList.toggle('done');
        el.closest('.task-item').classList.toggle('completed');
      }
    </script>
  `, 'Dashboard - Thrive Ortho EHR'))
})


// =============================================================================
// FULL BODY 3D SCAN - Medical Grade Holistic Tracking
// Body (33 landmarks) + Face (468 landmarks) + Hands (21 landmarks each)
// Total: 543 landmarks in real-time
// =============================================================================
app.get('/doctor/joints', (c) => {
  return c.html(html(`
    <style>
      /* 3D Body Scan - Medical Grade Assessment */
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
        background: #000; 
        color: #fff; 
        overflow: hidden;
        touch-action: manipulation;
      }
      
      .scan-page { 
        height: 100vh; 
        height: 100dvh;
        display: flex; 
        flex-direction: column; 
      }
      
      /* Header */
      .scan-header {
        background: linear-gradient(180deg, #0a0a0a 0%, #050505 100%);
        padding: 10px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #1a1a1a;
        z-index: 100;
      }
      .scan-header h1 { 
        font-size: 14px; 
        font-weight: 600; 
        color: #3b82f6;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .scan-header h1::before {
        content: '◉';
        animation: pulse 1.5s infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      .back-link { 
        color: #666; 
        text-decoration: none; 
        font-size: 13px;
        padding: 6px 12px;
        border-radius: 6px;
        background: #111;
        border: 1px solid #222;
      }
      .back-link:hover { border-color: #3b82f6; color: #3b82f6; }
      
      /* Stats Bar */
      .stats-bar {
        background: #050505;
        padding: 8px 16px;
        display: flex;
        gap: 16px;
        font-size: 10px;
        color: #555;
        border-bottom: 1px solid #111;
      }
      .stat { display: flex; align-items: center; gap: 4px; }
      .stat .val { color: #3b82f6; font-weight: 600; }
      .stat.good .val { color: #22c55e; }
      .stat.warn .val { color: #f59e0b; }
      
      /* Camera Container */
      .camera-wrap {
        flex: 1;
        position: relative;
        background: #000;
        overflow: hidden;
        min-height: 0;
      }
      
      #videoElement {
        width: 100%; 
        height: 100%;
        object-fit: cover;
        transform: scaleX(-1);
      }
      
      #canvasElement {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none;
        transform: scaleX(-1);
      }
      
      /* Tracking Info Overlay */
      .tracking-info {
        position: absolute;
        top: 12px;
        left: 12px;
        background: rgba(0,0,0,0.85);
        border: 1px solid #222;
        border-radius: 10px;
        padding: 12px;
        font-size: 11px;
        min-width: 140px;
        z-index: 50;
      }
      .tracking-info .title {
        color: #3b82f6;
        font-weight: 600;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .tracking-info .title::before {
        content: '';
        width: 6px;
        height: 6px;
        background: #3b82f6;
        border-radius: 50%;
        animation: blink 1s infinite;
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      .tracking-row {
        display: flex;
        justify-content: space-between;
        padding: 3px 0;
        color: #666;
      }
      .tracking-row .label { color: #888; }
      .tracking-row .value { 
        color: #fff; 
        font-weight: 500;
        font-family: monospace;
      }
      .tracking-row.highlight .value { color: #3b82f6; }
      .tracking-row.good .value { color: #22c55e; }
      .tracking-row.warn .value { color: #f59e0b; }
      
      /* Legend */
      .legend {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(0,0,0,0.85);
        border: 1px solid #222;
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 10px;
        z-index: 50;
      }
      .legend-title {
        color: #666;
        font-size: 9px;
        text-transform: uppercase;
        margin-bottom: 6px;
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 2px 0;
        color: #888;
      }
      .legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
      .legend-dot.body { background: #3b82f6; }
      .legend-dot.face { background: #06b6d4; }
      .legend-dot.hand { background: #8b5cf6; }
      
      /* Start Screen */
      .start-screen {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.95);
        z-index: 60;
        padding: 20px;
      }
      
      .start-icon {
        width: 80px;
        height: 80px;
        border: 3px solid #3b82f6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        margin-bottom: 20px;
        animation: glow 2s infinite;
      }
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
        50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
      }
      
      .start-title {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 8px;
      }
      .start-subtitle {
        font-size: 12px;
        color: #666;
        margin-bottom: 24px;
        text-align: center;
      }
      
      /* Camera Select */
      .camera-select-group {
        width: 100%;
        max-width: 320px;
        margin-bottom: 16px;
      }
      .camera-select-group label {
        display: block;
        font-size: 11px;
        color: #666;
        margin-bottom: 6px;
      }
      .camera-select {
        width: 100%;
        background: #111;
        border: 1px solid #333;
        color: #fff;
        padding: 12px;
        border-radius: 8px;
        font-size: 13px;
      }
      .camera-select:focus { outline: none; border-color: #3b82f6; }
      
      /* Start Button */
      .start-btn {
        width: 100%;
        max-width: 320px;
        background: #3b82f6;
        color: #fff;
        border: none;
        padding: 16px;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 8px;
        transition: all 0.2s;
      }
      .start-btn:hover:not(:disabled) { background: #2563eb; transform: scale(1.02); }
      .start-btn:disabled { background: #333; color: #666; cursor: not-allowed; }
      
      .start-note {
        font-size: 11px;
        color: #444;
        margin-top: 16px;
        text-align: center;
        max-width: 300px;
      }
      
      .error-box {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid #dc2626;
        color: #fca5a5;
        padding: 12px;
        border-radius: 8px;
        font-size: 11px;
        margin-top: 16px;
        max-width: 320px;
        text-align: left;
      }
      .error-box .error-title {
        font-weight: 600;
        margin-bottom: 6px;
        color: #f87171;
      }
      
      /* Loading */
      .loading-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 70;
      }
      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid #222;
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      .loading-text {
        color: #888;
        font-size: 13px;
      }
      .loading-sub {
        color: #555;
        font-size: 11px;
        margin-top: 6px;
      }
      
      /* Bottom Controls */
      .bottom-controls {
        background: linear-gradient(0deg, rgba(0,0,0,0.95) 0%, transparent 100%);
        padding: 20px 16px 16px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 50;
      }
      .ctrl-row {
        display: flex;
        gap: 10px;
        justify-content: center;
      }
      .ctrl-btn {
        background: rgba(30,30,30,0.9);
        border: 1px solid #333;
        color: #fff;
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 13px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
      }
      .ctrl-btn:hover { border-color: #3b82f6; }
      .ctrl-btn.primary { 
        background: #3b82f6; 
        border-color: #3b82f6;
        flex: 1;
        justify-content: center;
        font-weight: 600;
      }
      .ctrl-btn.stop { 
        background: rgba(127, 29, 29, 0.8); 
        border-color: #991b1b; 
      }
      
      /* Footer */
      .scan-footer {
        background: #050505;
        padding: 12px 16px;
        display: flex;
        gap: 10px;
        border-top: 1px solid #111;
      }
      .footer-btn {
        flex: 1;
        padding: 12px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
      }
      .footer-btn.secondary {
        background: #1a1a1a;
        color: #888;
      }
      .footer-btn.primary {
        background: #3b82f6;
        color: #fff;
      }
      .footer-btn:hover { transform: scale(1.02); }
      
      /* No detection warning */
      .no-detection {
        position: absolute;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(239, 68, 68, 0.9);
        color: #fff;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        z-index: 55;
        display: none;
      }
      .no-detection.show { display: block; }
      
      /* Responsive */
      @media (min-width: 768px) {
        .scan-page { max-width: 500px; margin: 0 auto; }
      }
    </style>
    
    <div class="scan-page">
      <div class="scan-header">
        <a href="/doctor" class="back-link">← Back</a>
        <h1>3D Body Scan</h1>
        <span style="width: 60px;"></span>
      </div>
      
      <div class="stats-bar" id="statsBar">
        <div class="stat">
          <span>FPS:</span>
          <span class="val" id="fpsVal">--</span>
        </div>
        <div class="stat">
          <span>Landmarks:</span>
          <span class="val" id="landmarkCount">0/543</span>
        </div>
        <div class="stat">
          <span>Body:</span>
          <span class="val" id="bodyStatus">--</span>
        </div>
        <div class="stat">
          <span>Face:</span>
          <span class="val" id="faceStatus">--</span>
        </div>
        <div class="stat">
          <span>Hands:</span>
          <span class="val" id="handsStatus">--</span>
        </div>
      </div>
      
      <div class="camera-wrap">
        <video id="videoElement" autoplay playsinline muted></video>
        <canvas id="canvasElement"></canvas>
        
        <!-- Tracking Info -->
        <div class="tracking-info" id="trackingInfo" style="display:none;">
          <div class="title">LIVE TRACKING</div>
          <div class="tracking-row highlight">
            <span class="label">Pose</span>
            <span class="value" id="poseAngle">--</span>
          </div>
          <div class="tracking-row">
            <span class="label">Knee L</span>
            <span class="value" id="kneeL">--°</span>
          </div>
          <div class="tracking-row">
            <span class="label">Knee R</span>
            <span class="value" id="kneeR">--°</span>
          </div>
          <div class="tracking-row">
            <span class="label">Hip</span>
            <span class="value" id="hipAngle">--°</span>
          </div>
          <div class="tracking-row">
            <span class="label">Shoulder</span>
            <span class="value" id="shoulderAngle">--°</span>
          </div>
        </div>
        
        <!-- Legend -->
        <div class="legend" id="legend" style="display:none;">
          <div class="legend-title">Tracking</div>
          <div class="legend-item">
            <div class="legend-dot body"></div>
            <span>Body (33 pts)</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot face"></div>
            <span>Face (468 pts)</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot hand"></div>
            <span>Hands (42 pts)</span>
          </div>
        </div>
        
        <!-- Start Screen -->
        <div class="start-screen" id="startScreen">
          <div class="start-icon">🦴</div>
          <div class="start-title">3D Body Scanner</div>
          <div class="start-subtitle">
            Medical-grade full body tracking<br>
            Face • Body • Hands • Fingers
          </div>
          
          <div class="camera-select-group">
            <label>Select Camera</label>
            <select class="camera-select" id="cameraSelect">
              <option value="">Detecting cameras...</option>
            </select>
          </div>
          
          <button class="start-btn" id="startBtn">
            Start 3D Scan
          </button>
          
          <div class="start-note" id="startNote">
            543 landmarks • Real-time tracking<br>
            Body joints • Facial features • Finger positions
          </div>
          
          <div class="error-box" id="errorBox" style="display:none;">
            <div class="error-title">Camera Access Required</div>
            <div id="errorMsg">Please allow camera access to use the body scanner.</div>
          </div>
        </div>
        
        <!-- Loading -->
        <div class="loading-overlay" id="loadingOverlay" style="display:none;">
          <div class="loading-spinner"></div>
          <div class="loading-text" id="loadingText">Loading AI models...</div>
          <div class="loading-sub" id="loadingSub">This may take 10-20 seconds</div>
        </div>
        
        <!-- No Detection Warning -->
        <div class="no-detection" id="noDetection">
          ⚠ No body detected - Stand in frame
        </div>
        
        <!-- Bottom Controls -->
        <div class="bottom-controls" id="bottomControls" style="display:none;">
          <div class="ctrl-row">
            <button class="ctrl-btn" id="switchCamBtn">🔄 Switch</button>
            <button class="ctrl-btn primary" id="captureBtn">📸 Capture</button>
            <button class="ctrl-btn stop" id="stopBtn">⏹ Stop</button>
          </div>
        </div>
      </div>
      
      <div class="scan-footer">
        <button class="footer-btn secondary" id="restartBtn">Restart</button>
        <button class="footer-btn primary" id="generateBtn">Generate Report</button>
      </div>
    </div>
    
    <!-- MediaPipe Holistic CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js" crossorigin="anonymous"></script>
    
    <script>
      // ============================================================
      // MEDICAL-GRADE 3D BODY SCANNER
      // MediaPipe Holistic: 543 landmarks (33 pose + 468 face + 42 hands)
      // ============================================================
      
      console.log('[3D Scanner] Initializing v6.0...');
      
      // State
      let holistic = null;
      let camera = null;
      let stream = null;
      let isRunning = false;
      let selectedDeviceId = null;
      let availableCameras = [];
      let lastResults = null;
      let frameCount = 0;
      let lastFpsTime = performance.now();
      let currentFps = 0;
      let noDetectionFrames = 0;
      
      // Captured data for report
      let capturedData = {
        poses: [],
        maxAngles: {},
        timestamps: []
      };
      
      // DOM elements
      const videoElement = document.getElementById('videoElement');
      const canvasElement = document.getElementById('canvasElement');
      const ctx = canvasElement.getContext('2d');
      
      // ============================================================
      // CAMERA ENUMERATION
      // ============================================================
      
      async function enumerateCameras() {
        console.log('[3D Scanner] Enumerating cameras...');
        const select = document.getElementById('cameraSelect');
        const startBtn = document.getElementById('startBtn');
        const errorBox = document.getElementById('errorBox');
        
        try {
          // Request permission first
          const tempStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: { ideal: 'environment' } },
            audio: false 
          });
          tempStream.getTracks().forEach(t => t.stop());
          
          // Enumerate devices
          const devices = await navigator.mediaDevices.enumerateDevices();
          availableCameras = devices.filter(d => d.kind === 'videoinput');
          
          console.log('[3D Scanner] Found cameras:', availableCameras.length);
          
          if (availableCameras.length === 0) {
            throw new Error('No cameras found');
          }
          
          // Populate dropdown
          select.innerHTML = availableCameras.map((cam, i) => {
            const label = cam.label || 'Camera ' + (i + 1);
            return '<option value="' + cam.deviceId + '">' + label.substring(0, 40) + '</option>';
          }).join('');
          
          // Select back camera by default if available
          const backIdx = availableCameras.findIndex(c => 
            c.label && (c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('rear'))
          );
          selectedDeviceId = availableCameras[backIdx >= 0 ? backIdx : 0].deviceId;
          select.value = selectedDeviceId;
          
          select.onchange = (e) => { selectedDeviceId = e.target.value; };
          
          startBtn.disabled = false;
          startBtn.textContent = 'Start 3D Scan';
          errorBox.style.display = 'none';
          
        } catch (err) {
          console.error('[3D Scanner] Camera error:', err);
          
          let msg = 'Camera access error: ' + err.message;
          if (err.name === 'NotAllowedError') {
            msg = 'Camera permission denied. Click the lock icon in your address bar and allow camera access, then reload.';
          } else if (err.name === 'NotFoundError') {
            msg = 'No camera found. Please connect a camera and reload.';
          }
          
          document.getElementById('errorMsg').innerHTML = msg;
          errorBox.style.display = 'block';
          startBtn.disabled = true;
          startBtn.textContent = 'Camera Required';
          select.innerHTML = '<option>No camera access</option>';
        }
      }
      
      // ============================================================
      // HOLISTIC MODEL INITIALIZATION
      // ============================================================
      
      async function initHolistic() {
        console.log('[3D Scanner] Initializing MediaPipe Holistic...');
        
        const loadingOverlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        const loadingSub = document.getElementById('loadingSub');
        
        loadingOverlay.style.display = 'flex';
        loadingText.textContent = 'Loading AI models...';
        loadingSub.textContent = 'Pose + Face + Hands (may take 10-20s)';
        
        try {
          holistic = new Holistic({
            locateFile: (file) => {
              return 'https://cdn.jsdelivr.net/npm/@mediapipe/holistic/' + file;
            }
          });
          
          // Configure holistic for medical-grade accuracy
          holistic.setOptions({
            modelComplexity: 2, // Highest accuracy (0, 1, or 2)
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            refineFaceLandmarks: true, // More accurate face mesh
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });
          
          // Set up results callback
          holistic.onResults(onResults);
          
          loadingText.textContent = 'AI models ready!';
          loadingSub.textContent = 'Starting camera...';
          
          console.log('[3D Scanner] Holistic initialized successfully');
          return true;
          
        } catch (err) {
          console.error('[3D Scanner] Holistic init error:', err);
          loadingText.textContent = 'Failed to load AI';
          loadingSub.textContent = err.message;
          return false;
        }
      }
      
      // ============================================================
      // START CAMERA AND TRACKING
      // ============================================================
      
      async function startScanning() {
        console.log('[3D Scanner] Starting scan...');
        
        const startBtn = document.getElementById('startBtn');
        startBtn.disabled = true;
        startBtn.textContent = 'Starting...';
        
        try {
          // Initialize holistic if not done
          if (!holistic) {
            const success = await initHolistic();
            if (!success) {
              startBtn.disabled = false;
              startBtn.textContent = 'Retry';
              return;
            }
          }
          
          // Build constraints
          const constraints = {
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 }
            }
          };
          
          if (selectedDeviceId) {
            constraints.video.deviceId = { exact: selectedDeviceId };
          }
          
          // Get camera stream
          try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
          } catch (e) {
            console.warn('[3D Scanner] Preferred constraints failed, using fallback');
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
          }
          
          videoElement.srcObject = stream;
          
          await new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
              videoElement.play().then(resolve);
            };
          });
          
          // Set canvas size
          canvasElement.width = videoElement.videoWidth;
          canvasElement.height = videoElement.videoHeight;
          
          console.log('[3D Scanner] Video ready:', videoElement.videoWidth, 'x', videoElement.videoHeight);
          
          // Hide start screen, show controls
          document.getElementById('startScreen').style.display = 'none';
          document.getElementById('loadingOverlay').style.display = 'none';
          document.getElementById('trackingInfo').style.display = 'block';
          document.getElementById('legend').style.display = 'block';
          document.getElementById('bottomControls').style.display = 'block';
          
          isRunning = true;
          
          // Start processing loop
          processFrame();
          
        } catch (err) {
          console.error('[3D Scanner] Start error:', err);
          document.getElementById('errorMsg').textContent = err.message;
          document.getElementById('errorBox').style.display = 'block';
          startBtn.disabled = false;
          startBtn.textContent = 'Try Again';
          document.getElementById('loadingOverlay').style.display = 'none';
        }
      }
      
      // ============================================================
      // FRAME PROCESSING LOOP
      // ============================================================
      
      async function processFrame() {
        if (!isRunning || !holistic) return;
        
        // Calculate FPS
        frameCount++;
        const now = performance.now();
        if (now - lastFpsTime >= 1000) {
          currentFps = frameCount;
          frameCount = 0;
          lastFpsTime = now;
          document.getElementById('fpsVal').textContent = currentFps;
        }
        
        // Send frame to holistic
        await holistic.send({ image: videoElement });
        
        // Continue loop
        requestAnimationFrame(processFrame);
      }
      
      // ============================================================
      // RESULTS CALLBACK - Draw Landmarks
      // ============================================================
      
      function onResults(results) {
        lastResults = results;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        
        // Count detected landmarks
        let totalLandmarks = 0;
        let bodyDetected = false;
        let faceDetected = false;
        let handsDetected = false;
        
        const w = canvasElement.width;
        const h = canvasElement.height;
        
        // ================== POSE (33 landmarks) ==================
        if (results.poseLandmarks && results.poseLandmarks.length > 0) {
          bodyDetected = true;
          totalLandmarks += results.poseLandmarks.length;
          
          // Draw pose connections (blue)
          drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
            color: '#3b82f6',
            lineWidth: 3
          });
          
          // Draw pose landmarks (blue dots)
          drawLandmarks(ctx, results.poseLandmarks, {
            color: '#93c5fd',
            fillColor: '#3b82f6',
            lineWidth: 1,
            radius: 4
          });
          
          // Calculate joint angles
          calculateAngles(results.poseLandmarks);
        }
        
        // ================== FACE (468 landmarks) ==================
        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
          faceDetected = true;
          totalLandmarks += results.faceLandmarks.length;
          
          // Draw face mesh (cyan)
          drawConnectors(ctx, results.faceLandmarks, FACEMESH_TESSELATION, {
            color: 'rgba(6, 182, 212, 0.3)',
            lineWidth: 1
          });
          
          // Draw face contours
          drawConnectors(ctx, results.faceLandmarks, FACEMESH_FACE_OVAL, {
            color: '#06b6d4',
            lineWidth: 2
          });
          
          // Draw eyes
          drawConnectors(ctx, results.faceLandmarks, FACEMESH_LEFT_EYE, {
            color: '#06b6d4',
            lineWidth: 1
          });
          drawConnectors(ctx, results.faceLandmarks, FACEMESH_RIGHT_EYE, {
            color: '#06b6d4',
            lineWidth: 1
          });
          
          // Draw lips
          drawConnectors(ctx, results.faceLandmarks, FACEMESH_LIPS, {
            color: '#06b6d4',
            lineWidth: 1
          });
        }
        
        // ================== LEFT HAND (21 landmarks) ==================
        if (results.leftHandLandmarks && results.leftHandLandmarks.length > 0) {
          handsDetected = true;
          totalLandmarks += results.leftHandLandmarks.length;
          
          // Draw hand connections (purple)
          drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
            color: '#8b5cf6',
            lineWidth: 2
          });
          
          // Draw hand landmarks
          drawLandmarks(ctx, results.leftHandLandmarks, {
            color: '#c4b5fd',
            fillColor: '#8b5cf6',
            lineWidth: 1,
            radius: 3
          });
        }
        
        // ================== RIGHT HAND (21 landmarks) ==================
        if (results.rightHandLandmarks && results.rightHandLandmarks.length > 0) {
          handsDetected = true;
          totalLandmarks += results.rightHandLandmarks.length;
          
          // Draw hand connections (purple)
          drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
            color: '#8b5cf6',
            lineWidth: 2
          });
          
          // Draw hand landmarks
          drawLandmarks(ctx, results.rightHandLandmarks, {
            color: '#c4b5fd',
            fillColor: '#8b5cf6',
            lineWidth: 1,
            radius: 3
          });
        }
        
        // Update stats
        document.getElementById('landmarkCount').textContent = totalLandmarks + '/543';
        document.getElementById('bodyStatus').textContent = bodyDetected ? '✓' : '--';
        document.getElementById('faceStatus').textContent = faceDetected ? '✓' : '--';
        document.getElementById('handsStatus').textContent = handsDetected ? '✓' : '--';
        
        // Show/hide no detection warning
        if (!bodyDetected) {
          noDetectionFrames++;
          if (noDetectionFrames > 30) {
            document.getElementById('noDetection').classList.add('show');
          }
        } else {
          noDetectionFrames = 0;
          document.getElementById('noDetection').classList.remove('show');
        }
      }
      
      // ============================================================
      // ANGLE CALCULATIONS
      // ============================================================
      
      function calculateAngles(landmarks) {
        if (!landmarks || landmarks.length < 33) return;
        
        // Pose landmark indices
        const LEFT_SHOULDER = 11, RIGHT_SHOULDER = 12;
        const LEFT_ELBOW = 13, RIGHT_ELBOW = 14;
        const LEFT_WRIST = 15, RIGHT_WRIST = 16;
        const LEFT_HIP = 23, RIGHT_HIP = 24;
        const LEFT_KNEE = 25, RIGHT_KNEE = 26;
        const LEFT_ANKLE = 27, RIGHT_ANKLE = 28;
        
        // Calculate angle between three points
        function calcAngle(a, b, c) {
          const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
          let angle = Math.abs(radians * 180 / Math.PI);
          if (angle > 180) angle = 360 - angle;
          return Math.round(angle);
        }
        
        // Left knee angle
        const kneeL = calcAngle(
          landmarks[LEFT_HIP],
          landmarks[LEFT_KNEE],
          landmarks[LEFT_ANKLE]
        );
        document.getElementById('kneeL').textContent = kneeL + '°';
        
        // Right knee angle
        const kneeR = calcAngle(
          landmarks[RIGHT_HIP],
          landmarks[RIGHT_KNEE],
          landmarks[RIGHT_ANKLE]
        );
        document.getElementById('kneeR').textContent = kneeR + '°';
        
        // Hip angle (average)
        const hipL = calcAngle(
          landmarks[LEFT_SHOULDER],
          landmarks[LEFT_HIP],
          landmarks[LEFT_KNEE]
        );
        const hipR = calcAngle(
          landmarks[RIGHT_SHOULDER],
          landmarks[RIGHT_HIP],
          landmarks[RIGHT_KNEE]
        );
        const hipAvg = Math.round((hipL + hipR) / 2);
        document.getElementById('hipAngle').textContent = hipAvg + '°';
        
        // Shoulder angle
        const shoulderL = calcAngle(
          landmarks[LEFT_ELBOW],
          landmarks[LEFT_SHOULDER],
          landmarks[LEFT_HIP]
        );
        const shoulderR = calcAngle(
          landmarks[RIGHT_ELBOW],
          landmarks[RIGHT_SHOULDER],
          landmarks[RIGHT_HIP]
        );
        const shoulderAvg = Math.round((shoulderL + shoulderR) / 2);
        document.getElementById('shoulderAngle').textContent = shoulderAvg + '°';
        
        // Determine pose state
        let poseState = 'Standing';
        if (kneeL < 130 && kneeR < 130) poseState = 'Squatting';
        else if (hipAvg < 120) poseState = 'Bending';
        else if (shoulderAvg > 140) poseState = 'Arms Raised';
        document.getElementById('poseAngle').textContent = poseState;
        
        // Track max angles
        if (!capturedData.maxAngles.kneeL || kneeL > capturedData.maxAngles.kneeL) {
          capturedData.maxAngles.kneeL = kneeL;
        }
        if (!capturedData.maxAngles.kneeR || kneeR > capturedData.maxAngles.kneeR) {
          capturedData.maxAngles.kneeR = kneeR;
        }
        if (!capturedData.maxAngles.hip || hipAvg > capturedData.maxAngles.hip) {
          capturedData.maxAngles.hip = hipAvg;
        }
        if (!capturedData.maxAngles.shoulder || shoulderAvg > capturedData.maxAngles.shoulder) {
          capturedData.maxAngles.shoulder = shoulderAvg;
        }
      }
      
      // ============================================================
      // CONTROL FUNCTIONS
      // ============================================================
      
      function stopScanning() {
        console.log('[3D Scanner] Stopping...');
        isRunning = false;
        
        if (stream) {
          stream.getTracks().forEach(t => t.stop());
          stream = null;
        }
        
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        
        document.getElementById('startScreen').style.display = 'flex';
        document.getElementById('trackingInfo').style.display = 'none';
        document.getElementById('legend').style.display = 'none';
        document.getElementById('bottomControls').style.display = 'none';
        document.getElementById('noDetection').classList.remove('show');
        
        const startBtn = document.getElementById('startBtn');
        startBtn.disabled = false;
        startBtn.textContent = 'Resume Scan';
      }
      
      function switchCamera() {
        if (availableCameras.length < 2) return;
        
        const currentIdx = availableCameras.findIndex(c => c.deviceId === selectedDeviceId);
        const nextIdx = (currentIdx + 1) % availableCameras.length;
        selectedDeviceId = availableCameras[nextIdx].deviceId;
        document.getElementById('cameraSelect').value = selectedDeviceId;
        
        console.log('[3D Scanner] Switching to camera:', nextIdx + 1);
        
        if (isRunning) {
          stopScanning();
          setTimeout(startScanning, 500);
        }
      }
      
      function captureFrame() {
        if (!lastResults) return;
        
        console.log('[3D Scanner] Capturing frame...');
        
        // Save current state
        capturedData.poses.push({
          timestamp: Date.now(),
          hasBody: !!lastResults.poseLandmarks,
          hasFace: !!lastResults.faceLandmarks,
          hasLeftHand: !!lastResults.leftHandLandmarks,
          hasRightHand: !!lastResults.rightHandLandmarks,
          angles: { ...capturedData.maxAngles }
        });
        
        // Flash effect
        canvasElement.style.opacity = '0.5';
        setTimeout(() => { canvasElement.style.opacity = '1'; }, 100);
        
        alert('Frame captured! ' + capturedData.poses.length + ' frames saved.');
      }
      
      function restartScan() {
        console.log('[3D Scanner] Restarting...');
        capturedData = { poses: [], maxAngles: {}, timestamps: [] };
        
        if (isRunning) {
          stopScanning();
        }
        
        // Reset UI
        document.getElementById('kneeL').textContent = '--°';
        document.getElementById('kneeR').textContent = '--°';
        document.getElementById('hipAngle').textContent = '--°';
        document.getElementById('shoulderAngle').textContent = '--°';
        document.getElementById('poseAngle').textContent = '--';
        document.getElementById('landmarkCount').textContent = '0/543';
      }
      
      function generateReport() {
        console.log('[3D Scanner] Generating report...');
        
        const reportData = {
          scanDate: new Date().toISOString(),
          totalCaptures: capturedData.poses.length,
          maxAngles: capturedData.maxAngles,
          assessment: {
            kneeROM: capturedData.maxAngles.kneeL ? 
              (capturedData.maxAngles.kneeL >= 120 ? 'Normal' : 'Limited') : 'Not measured',
            hipROM: capturedData.maxAngles.hip ? 
              (capturedData.maxAngles.hip >= 100 ? 'Normal' : 'Limited') : 'Not measured',
            shoulderROM: capturedData.maxAngles.shoulder ? 
              (capturedData.maxAngles.shoulder >= 150 ? 'Normal' : 'Limited') : 'Not measured'
          }
        };
        
        // Store for notes page
        sessionStorage.setItem('bodyScanner', JSON.stringify(reportData));
        sessionStorage.setItem('jointAnalysis', JSON.stringify([{
          name: '3D Body Scan',
          maxAngles: capturedData.maxAngles,
          captures: capturedData.poses.length
        }]));
        
        // Navigate to notes
        window.location.href = '/doctor/notes';
      }
      
      // ============================================================
      // INITIALIZATION
      // ============================================================
      
      document.addEventListener('DOMContentLoaded', async () => {
        console.log('[3D Scanner] DOM ready, setting up...');
        
        // Attach event listeners
        document.getElementById('startBtn').addEventListener('click', startScanning);
        document.getElementById('switchCamBtn').addEventListener('click', switchCamera);
        document.getElementById('stopBtn').addEventListener('click', stopScanning);
        document.getElementById('captureBtn').addEventListener('click', captureFrame);
        document.getElementById('restartBtn').addEventListener('click', restartScan);
        document.getElementById('generateBtn').addEventListener('click', generateReport);
        
        // Check for mediaDevices
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          document.getElementById('errorMsg').textContent = 
            'Camera API not available. Use HTTPS and a modern browser.';
          document.getElementById('errorBox').style.display = 'block';
          document.getElementById('startBtn').disabled = true;
          return;
        }
        
        // Enumerate cameras
        await enumerateCameras();
        
        // Listen for device changes
        navigator.mediaDevices.addEventListener('devicechange', enumerateCameras);
        
        console.log('[3D Scanner] Setup complete');
      });
    </script>
  `, '3D Body Scanner - Thrive Ortho EHR'))
})


// MSK Assessment (redirects to joints)
app.get('/doctor/assessment', (c) => c.redirect('/doctor/joints'))
// Voice Intake
app.get('/doctor/intake', (c) => {
  return c.html(html(`
    <div class="demo-bar">
      <span>Voice Medical Intake — AI Pain + Elderly Flag Detection</span>
      <a href="/login">Switch Role</a>
    </div>
    <div class="layout">
      ${sidebar('doctor', 'intake')}
      
      <main class="main">
        <div class="header">
          <div>
            <h1 class="title">Voice Medical Intake</h1>
            <p class="subtitle">AI-powered voice analysis with pain and fall risk detection</p>
          </div>
          <a href="/doctor" class="btn btn-secondary"><i class="fas fa-arrow-left"></i> Back</a>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fas fa-microphone text-accent" style="margin-right: 6px;"></i>Voice Recording</span>
          </div>
          <div class="card-body">
            <div id="micPermissionAlert" style="display: none; background: #fef3c7; border: 1px solid #fcd34d; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 12px; color: #92400e;">
              <i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i>
              <span id="micPermissionText">Checking microphone access...</span>
            </div>
            <div class="voice-area">
              <button class="voice-btn" id="voiceBtn" onclick="toggleRecording()">
                <i class="fas fa-microphone" id="voiceIcon"></i>
              </button>
              <div class="voice-status" id="voiceStatus">Tap microphone to start recording</div>
            </div>
            
            <div style="margin-top: 20px;">
              <div class="form-label">Current Question</div>
              <div style="background: var(--gray-50); padding: 12px; border-radius: var(--radius); font-size: 12px;">
                "Tell me about your symptoms. Have you had any falls, dizziness, or balance problems? Does anything make it better or worse?"
              </div>
            </div>
            
            <div style="margin-top: 14px;">
              <div class="form-label">Transcript</div>
              <div id="transcript" style="background: var(--gray-50); padding: 12px; border-radius: var(--radius); min-height: 80px; font-size: 12px; color: var(--gray-500);">
                Transcript will appear here...
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex gap-1 mt-2">
          <button class="btn btn-secondary btn-lg" style="flex: 1;"><i class="fas fa-arrow-left"></i> Previous</button>
          <button class="btn btn-primary btn-lg" style="flex: 1;" onclick="analyzeVoice()">Analyze <i class="fas fa-arrow-right"></i></button>
        </div>
      </main>
      
      ${rightPanel({ fmsScore: null })}
    </div>
    
    <script>
      let isRecording = false;
      let recognition;
      let transcript = '';
      let micPermissionGranted = false;
      
      // Initialize speech recognition with better error handling
      async function initSpeechRecognition() {
        // Check if Speech Recognition is supported
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
          document.getElementById('voiceStatus').textContent = 'Speech recognition not supported in this browser';
          document.getElementById('voiceStatus').style.color = '#dc2626';
          document.getElementById('voiceBtn').disabled = true;
          return false;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          console.log('Speech recognition started');
          micPermissionGranted = true;
        };
        
        recognition.onresult = (e) => {
          transcript = '';
          for (let i = 0; i < e.results.length; i++) {
            transcript += e.results[i][0].transcript;
          }
          document.getElementById('transcript').textContent = transcript || 'Listening...';
          document.getElementById('transcript').style.color = 'var(--gray-900)';
        };
        
        recognition.onerror = (e) => {
          console.error('Speech recognition error:', e.error);
          
          if (e.error === 'not-allowed' || e.error === 'permission-denied') {
            document.getElementById('voiceStatus').textContent = 'Microphone permission denied. Please allow access.';
            document.getElementById('voiceStatus').style.color = '#dc2626';
            isRecording = false;
            document.getElementById('voiceBtn').classList.remove('recording');
            document.getElementById('voiceIcon').className = 'fas fa-microphone';
          } else if (e.error === 'no-speech') {
            document.getElementById('voiceStatus').textContent = 'No speech detected. Try again.';
          } else if (e.error === 'network') {
            document.getElementById('voiceStatus').textContent = 'Network error. Check connection.';
          } else {
            document.getElementById('voiceStatus').textContent = 'Error: ' + e.error;
          }
        };
        
        recognition.onend = () => {
          if (isRecording) {
            // Restart if still recording (speech recognition auto-stops)
            try {
              recognition.start();
            } catch (e) {
              console.log('Could not restart recognition');
            }
          }
        };
        
        return true;
      }
      
      // Request microphone permission explicitly
      async function requestMicPermission() {
        const alertDiv = document.getElementById('micPermissionAlert');
        const alertText = document.getElementById('micPermissionText');
        
        try {
          // Show requesting state
          if (alertDiv && alertText) {
            alertDiv.style.display = 'block';
            alertDiv.style.background = '#dbeafe';
            alertDiv.style.borderColor = '#93c5fd';
            alertDiv.style.color = '#1e40af';
            alertText.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i>When prompted, tap <strong>"Allow"</strong> to enable microphone';
          }
          
          // This will trigger the permission prompt
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop the stream immediately - we just needed permission
          stream.getTracks().forEach(track => track.stop());
          micPermissionGranted = true;
          
          // Hide alert on success
          if (alertDiv) alertDiv.style.display = 'none';
          return true;
        } catch (err) {
          console.error('Microphone permission error:', err);
          
          if (alertDiv && alertText) {
            alertDiv.style.display = 'block';
            alertDiv.style.background = '#fee2e2';
            alertDiv.style.borderColor = '#fca5a5';
            alertDiv.style.color = '#991b1b';
            
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
              alertText.innerHTML = '<strong>Microphone Permission Denied</strong><br>' +
                '1. Tap the <strong>lock/info icon</strong> in address bar<br>' +
                '2. Find "Microphone" → Set to <strong>Allow</strong><br>' +
                '3. <strong>Reload</strong> this page';
              document.getElementById('voiceStatus').innerHTML = 
                '<span style="color: #dc2626;">Permission denied. See instructions above.</span>';
            } else if (err.name === 'NotFoundError') {
              alertText.innerHTML = '<strong>No Microphone Found</strong><br>Please use a device with a microphone.';
              document.getElementById('voiceStatus').textContent = 'No microphone detected';
            } else {
              alertText.innerHTML = '<strong>Microphone Error</strong><br>' + err.message;
              document.getElementById('voiceStatus').textContent = 'Error: ' + err.name;
            }
          }
          return false;
        }
      }
      
      // Check microphone permission on page load
      async function checkMicPermission() {
        const alertDiv = document.getElementById('micPermissionAlert');
        const alertText = document.getElementById('micPermissionText');
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (alertDiv && alertText) {
            alertDiv.style.display = 'block';
            alertDiv.style.background = '#fee2e2';
            alertDiv.style.borderColor = '#fca5a5';
            alertDiv.style.color = '#991b1b';
            alertText.innerHTML = '<strong>Microphone API not available</strong><br>Page must be accessed via HTTPS.';
          }
          return;
        }
        
        if (navigator.permissions && navigator.permissions.query) {
          try {
            const result = await navigator.permissions.query({ name: 'microphone' });
            if (result.state === 'granted') {
              micPermissionGranted = true;
              if (alertDiv) alertDiv.style.display = 'none';
            } else if (result.state === 'denied') {
              if (alertDiv && alertText) {
                alertDiv.style.display = 'block';
                alertDiv.style.background = '#fee2e2';
                alertDiv.style.borderColor = '#fca5a5';
                alertDiv.style.color = '#991b1b';
                alertText.innerHTML = '<strong>Microphone blocked</strong><br>Go to browser settings → Site permissions → Microphone → Allow';
              }
            }
            // Listen for changes
            result.addEventListener('change', () => checkMicPermission());
          } catch (e) {
            console.log('Microphone permission query not supported');
          }
        }
      }
      
      async function toggleRecording() {
        if (!recognition) {
          const initialized = await initSpeechRecognition();
          if (!initialized) return;
        }
        
        if (isRecording) {
          // Stop recording
          isRecording = false;
          document.getElementById('voiceBtn').classList.remove('recording');
          document.getElementById('voiceIcon').className = 'fas fa-microphone';
          document.getElementById('voiceStatus').textContent = 'Click to start recording';
          document.getElementById('voiceStatus').style.color = '';
          if (recognition) {
            try { recognition.stop(); } catch (e) {}
          }
        } else {
          // Start recording - first ensure we have permission
          if (!micPermissionGranted) {
            document.getElementById('voiceStatus').textContent = 'Requesting microphone access...';
            const hasPermission = await requestMicPermission();
            if (!hasPermission) return;
          }
          
          isRecording = true;
          document.getElementById('voiceBtn').classList.add('recording');
          document.getElementById('voiceIcon').className = 'fas fa-stop';
          document.getElementById('voiceStatus').textContent = 'Recording... Speak now';
          document.getElementById('voiceStatus').style.color = '#dc2626';
          
          try {
            recognition.start();
          } catch (e) {
            console.error('Start error:', e);
            // Already started, ignore
          }
        }
      }
      
      // Initialize on page load
      initSpeechRecognition();
      checkMicPermission();
      
      async function analyzeVoice() {
        if (!transcript) {
          alert('Please record some audio first');
          return;
        }
        
        const flagsContainer = document.getElementById('flagsContainer');
        flagsContainer.innerHTML = '<div class="panel-card text-center"><i class="fas fa-spinner fa-spin"></i> Analyzing...</div>';
        
        try {
          const response = await fetch('/api/ai/analyze-voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript })
          });
          
          const data = await response.json();
          
          let html = '';
          if (data.flags.red.length > 0) {
            html += '<div class="flag flag-red"><i class="fas fa-exclamation-triangle"></i><div><strong>Red:</strong> ' + data.flags.red.join(', ') + '</div></div>';
          }
          if (data.flags.yellow.length > 0) {
            html += '<div class="flag flag-yellow"><i class="fas fa-exclamation-circle"></i><div><strong>Yellow:</strong> ' + data.flags.yellow.join(', ') + '</div></div>';
          }
          if (data.flags.elderly.length > 0) {
            html += '<div class="flag flag-elderly"><i class="fas fa-person-cane"></i><div><strong>Fall Risk:</strong> ' + data.flags.elderly.join(', ') + '</div></div>';
          }
          
          if (!html) {
            html = '<div class="panel-card text-center text-sm" style="color: var(--success);"><i class="fas fa-check-circle"></i> No flags detected</div>';
          }
          
          flagsContainer.innerHTML = html;
          sessionStorage.setItem('intakeTranscript', transcript);
          sessionStorage.setItem('intakeFlags', JSON.stringify(data.flags));
        } catch (err) {
          flagsContainer.innerHTML = '<div class="panel-card text-center text-danger text-sm">Analysis failed</div>';
        }
      }
    </script>
  `, 'Voice Intake - Thrive Ortho EHR'))
})

// Medical Notes
app.get('/doctor/notes', (c) => {
  return c.html(html(`
    <div class="demo-bar">
      <span>Medical Note — Full Body Analysis + DX/CPT</span>
      <a href="/login">Switch Role</a>
    </div>
    <div class="layout">
      ${sidebar('doctor', 'notes')}
      
      <main class="main">
        <div class="header">
          <div>
            <h1 class="title">Medical Note</h1>
            <p class="subtitle">Comprehensive documentation with all joints</p>
          </div>
          <div class="flex gap-1">
            <button class="btn btn-secondary" onclick="window.print()"><i class="fas fa-print"></i> Print</button>
            <button class="btn btn-primary"><i class="fas fa-save"></i> Save</button>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fas fa-file-medical text-accent" style="margin-right: 6px;"></i>Generated Note</span>
            <button class="btn btn-sm btn-secondary" onclick="regenerateNote()"><i class="fas fa-sync"></i></button>
          </div>
          <div class="card-body">
            <div class="medical-note" id="medicalNote">Loading...</div>
          </div>
        </div>
      </main>
      
      <aside class="panel">
        <div class="panel-section">
          <div class="panel-label">Summary</div>
          <div class="panel-card text-sm">
            <strong>Patient:</strong> Sarah Johnson<br>
            <strong>FMS:</strong> <span id="summaryScore">--</span>/21<br>
            <strong>Risk:</strong> <span id="summaryRisk">--</span>
          </div>
        </div>
        
        <div class="panel-section">
          <div class="panel-label">ICD-10</div>
          <div class="panel-card text-sm font-mono">
            M54.5 - LBP<br>
            M54.16 - Radiculopathy<br>
            M62.838 - Spasm<br>
            M99.03 - Dysfunction
          </div>
        </div>
        
        <div class="panel-section">
          <div class="panel-label">CPT</div>
          <div class="panel-card text-sm font-mono">
            97163 - Eval High<br>
            97110 ×2 - Exercise<br>
            97140 ×2 - Manual<br>
            97530 - Activities
          </div>
        </div>
      </aside>
    </div>
    
    <script>
      async function loadNote() {
        const scores = JSON.parse(sessionStorage.getItem('fmsScores') || '{}');
        const flags = JSON.parse(sessionStorage.getItem('intakeFlags') || '{}');
        const jointAnalysis = JSON.parse(sessionStorage.getItem('jointAnalysis') || 'null');
        
        try {
          const response = await fetch('/api/ai/generate-note', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              patient: { name: 'Sarah Johnson' },
              intake: {},
              fmsScores: scores,
              aiFlags: flags,
              jointAnalysis: jointAnalysis
            })
          });
          
          const data = await response.json();
          document.getElementById('medicalNote').textContent = data.note;
          
          let total = 0;
          for (let i = 1; i <= 7; i++) {
            if (scores[i] !== undefined) total += scores[i];
          }
          document.getElementById('summaryScore').textContent = total || '12';
          document.getElementById('summaryRisk').textContent = total <= 11 ? 'HIGH' : total <= 14 ? 'MOD' : 'LOW';
        } catch (err) {
          document.getElementById('medicalNote').textContent = 'Failed to generate.';
        }
      }
      
      function regenerateNote() {
        document.getElementById('medicalNote').textContent = 'Regenerating...';
        loadNote();
      }
      
      loadNote();
    </script>
  `, 'Medical Notes - Thrive Ortho EHR'))
})

// Video, Tasks, Patient, Coach, Admin routes...
app.get('/doctor/video', (c) => c.redirect('/doctor'))
app.get('/doctor/tasks', (c) => c.redirect('/doctor'))
app.get('/doctor/patients', (c) => c.redirect('/doctor'))
app.get('/patient', (c) => c.redirect('/login'))
app.get('/patient/*', (c) => c.redirect('/login'))
app.get('/coach', (c) => c.redirect('/login'))
app.get('/coach/*', (c) => c.redirect('/login'))
app.get('/admin', (c) => c.redirect('/login'))
app.get('/admin/*', (c) => c.redirect('/login'))
app.get('/', (c) => c.redirect('/login'))

export default app
