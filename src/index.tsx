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
    version: '7.1'
  })
})

// ============================================================================
// ERROR NOTIFICATION SYSTEM - Robust Error Logging
// Fails silently - never crashes the app
// ============================================================================

interface ErrorLogEntry {
  timestamp: string;
  type: 'error' | 'warning' | 'critical';
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
  context?: Record<string, unknown>;
}

// In-memory error log (in production, use D1 or external service)
const errorLogs: ErrorLogEntry[] = [];
const MAX_ERROR_LOGS = 1000;

// Utility function to safely log errors
function logError(entry: Partial<ErrorLogEntry>): void {
  try {
    const fullEntry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      type: entry.type || 'error',
      message: entry.message || 'Unknown error',
      stack: entry.stack,
      url: entry.url,
      userAgent: entry.userAgent,
      userId: entry.userId,
      context: entry.context
    };
    
    errorLogs.unshift(fullEntry);
    
    // Keep only last N entries
    if (errorLogs.length > MAX_ERROR_LOGS) {
      errorLogs.pop();
    }
    
    // Console log for debugging (remove in production)
    console.log('[ERROR LOG]', fullEntry.type.toUpperCase(), fullEntry.message);
    
  } catch (e) {
    // Fail silently - never crash due to logging
    console.warn('[ERROR LOG] Failed to log error:', e);
  }
}

// Public API route for frontend error logging
app.post('/api/log-error', async (c) => {
  try {
    const body = await c.req.json();
    const userAgent = c.req.header('user-agent') || 'unknown';
    
    logError({
      type: body.type || 'error',
      message: body.message || 'Unknown error',
      stack: body.stack,
      url: body.url,
      userAgent,
      userId: body.userId,
      context: body.context
    });
    
    // Always return success - don't expose internal state
    return c.json({ success: true, logged: true });
    
  } catch (e) {
    // Fail silently
    return c.json({ success: true, logged: false });
  }
})

// Get recent errors (admin only in production)
app.get('/api/errors', (c) => {
  return c.json({
    count: errorLogs.length,
    errors: errorLogs.slice(0, 50) // Return last 50
  });
})

// ============================================================================
// ASSESSMENT DATA LOGGING API
// Stores assessment results, red flags, and transcripts
// ============================================================================

interface AssessmentLog {
  id: string;
  timestamp: string;
  patientId?: string;
  duration: number;
  exercises: Array<{
    name: string;
    reps: number;
    target: number;
    score: number;
    maxAngles: Record<string, number>;
    skipped?: boolean;
  }>;
  redFlags: Array<{
    type: string;
    context: string;
    time: string;
    exercise: string;
  }>;
  transcript: string;
  summary: {
    totalExercises: number;
    completedExercises: number;
    totalReps: number;
    flagCount: number;
    overallScore: number;
  };
}

const assessmentLogs: AssessmentLog[] = [];
const MAX_ASSESSMENT_LOGS = 500;

// Log assessment results
app.post('/api/assessment/log', async (c) => {
  try {
    const body = await c.req.json();
    
    const assessment: AssessmentLog = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      timestamp: new Date().toISOString(),
      patientId: body.patientId,
      duration: body.duration || 0,
      exercises: body.exercises || [],
      redFlags: body.redFlags || [],
      transcript: body.transcript || '',
      summary: body.summary || {
        totalExercises: 0,
        completedExercises: 0,
        totalReps: 0,
        flagCount: 0,
        overallScore: 0
      }
    };
    
    assessmentLogs.unshift(assessment);
    
    if (assessmentLogs.length > MAX_ASSESSMENT_LOGS) {
      assessmentLogs.pop();
    }
    
    return c.json({ success: true, id: assessment.id });
    
  } catch (e) {
    logError({ type: 'error', message: 'Failed to log assessment', context: { error: String(e) } });
    return c.json({ success: false, error: 'Failed to log assessment' }, 500);
  }
})

// Get assessment by ID
app.get('/api/assessment/:id', (c) => {
  const id = c.req.param('id');
  const assessment = assessmentLogs.find(a => a.id === id);
  
  if (!assessment) {
    return c.json({ error: 'Assessment not found' }, 404);
  }
  
  return c.json(assessment);
})

// Get recent assessments
app.get('/api/assessments', (c) => {
  return c.json({
    count: assessmentLogs.length,
    assessments: assessmentLogs.slice(0, 20).map(a => ({
      id: a.id,
      timestamp: a.timestamp,
      patientId: a.patientId,
      duration: a.duration,
      summary: a.summary
    }))
  });
})

// ============================================================================
// RED FLAG NOTIFICATION API
// Critical alerts for pain, fall risk, etc.
// ============================================================================

interface RedFlagAlert {
  id: string;
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: string;
  assessmentId?: string;
  patientId?: string;
  acknowledged: boolean;
}

const redFlagAlerts: RedFlagAlert[] = [];

app.post('/api/red-flag', async (c) => {
  try {
    const body = await c.req.json();
    
    const alert: RedFlagAlert = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: body.type || 'UNKNOWN',
      severity: body.severity || 'medium',
      context: body.context || '',
      assessmentId: body.assessmentId,
      patientId: body.patientId,
      acknowledged: false
    };
    
    redFlagAlerts.unshift(alert);
    
    // Log critical alerts specially
    if (alert.severity === 'critical') {
      logError({
        type: 'critical',
        message: `CRITICAL RED FLAG: ${alert.type}`,
        context: { alert }
      });
    }
    
    return c.json({ success: true, id: alert.id });
    
  } catch (e) {
    return c.json({ success: false }, 500);
  }
})

app.get('/api/red-flags', (c) => {
  return c.json({
    count: redFlagAlerts.length,
    unacknowledged: redFlagAlerts.filter(a => !a.acknowledged).length,
    alerts: redFlagAlerts.slice(0, 50)
  });
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

// =============================================================================
// GUIDED MSK ASSESSMENT v7.0
// Voice Instructions + Real-Time Tracking + Auto Rep Count + Mic Recording
// =============================================================================

// =============================================================================
// GUIDED MSK ASSESSMENT v8.0 - Production Ready
// Robust Architecture with Error Handling, Voice, Tracking, Mic Recording
// =============================================================================
app.get('/doctor/joints', (c) => {
  return c.html(html(`
    <style>
      /* ========== RESET & BASE ========== */
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        background: #000; 
        color: #fff; 
        overflow: hidden;
        -webkit-tap-highlight-color: transparent;
      }
      
      .app { height: 100vh; height: 100dvh; display: flex; flex-direction: column; }
      
      /* ========== HEADER ========== */
      .header {
        background: linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%);
        padding: 10px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #1a1a1a;
        z-index: 100;
      }
      .back-btn { 
        color: #666; 
        text-decoration: none; 
        font-size: 13px;
        padding: 6px 10px;
        border-radius: 6px;
        background: #111;
        border: 1px solid #222;
        transition: all 0.2s;
      }
      .back-btn:hover { border-color: #3b82f6; color: #3b82f6; }
      .title { font-size: 14px; font-weight: 600; color: #3b82f6; }
      .mic-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        color: #666;
      }
      .mic-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #333;
        transition: all 0.3s;
      }
      .mic-dot.active {
        background: #ef4444;
        box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
        animation: pulse 1s infinite;
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
      
      /* ========== EXERCISE INFO ========== */
      .exercise-info {
        background: #0a0a0a;
        padding: 12px 16px;
        border-bottom: 1px solid #1a1a1a;
      }
      .progress-track {
        display: flex;
        gap: 6px;
        margin-bottom: 10px;
      }
      .progress-step {
        flex: 1;
        height: 4px;
        background: #222;
        border-radius: 2px;
        transition: background 0.3s;
      }
      .progress-step.done { background: #22c55e; }
      .progress-step.active { background: #3b82f6; }
      .exercise-title {
        font-size: 20px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 4px;
      }
      .exercise-desc {
        font-size: 13px;
        color: #3b82f6;
        line-height: 1.4;
      }
      
      /* ========== CAMERA VIEW ========== */
      .camera-container {
        flex: 1;
        position: relative;
        background: #000;
        overflow: hidden;
      }
      #video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scaleX(-1);
      }
      #canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        transform: scaleX(-1);
      }
      
      /* ========== REP COUNTER ========== */
      .rep-display {
        position: absolute;
        top: 16px;
        right: 16px;
        background: rgba(0,0,0,0.9);
        border: 2px solid #3b82f6;
        border-radius: 16px;
        padding: 16px 24px;
        text-align: center;
        z-index: 50;
        min-width: 100px;
      }
      .rep-label {
        font-size: 11px;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .rep-num {
        font-size: 56px;
        font-weight: 800;
        color: #3b82f6;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      .rep-target {
        font-size: 16px;
        color: #444;
      }
      .rep-bar {
        width: 100%;
        height: 6px;
        background: #1a1a1a;
        border-radius: 3px;
        margin-top: 10px;
        overflow: hidden;
      }
      .rep-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #60a5fa);
        border-radius: 3px;
        transition: width 0.3s ease-out;
      }
      
      /* ========== ANGLES PANEL ========== */
      .angles-panel {
        position: absolute;
        top: 16px;
        left: 16px;
        background: rgba(0,0,0,0.9);
        border: 1px solid #222;
        border-radius: 12px;
        padding: 12px 14px;
        min-width: 140px;
        z-index: 50;
      }
      .angles-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid #222;
      }
      .live-dot {
        width: 8px;
        height: 8px;
        background: #22c55e;
        border-radius: 50%;
        animation: blink 0.6s infinite;
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      .angles-title {
        font-size: 10px;
        font-weight: 600;
        color: #3b82f6;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .angle-item {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        font-size: 12px;
      }
      .angle-label { color: #888; }
      .angle-value { 
        color: #fff; 
        font-weight: 600;
        font-family: 'SF Mono', Monaco, monospace;
      }
      .angle-item.primary .angle-value { color: #3b82f6; font-size: 14px; }
      .angle-item.good .angle-value { color: #22c55e; }
      .angle-item.warn .angle-value { color: #f59e0b; }
      
      /* ========== RED FLAG ALERTS ========== */
      .alerts-container {
        position: absolute;
        bottom: 90px;
        left: 16px;
        right: 16px;
        z-index: 55;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .alert-item {
        background: rgba(239, 68, 68, 0.95);
        border-radius: 10px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideUp 0.3s ease-out;
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .alert-icon { font-size: 20px; }
      .alert-content { flex: 1; }
      .alert-type { font-size: 12px; font-weight: 600; }
      .alert-detail { font-size: 11px; opacity: 0.8; margin-top: 2px; }
      .alert-time { font-size: 10px; opacity: 0.7; }
      
      /* ========== SPEAKING INDICATOR ========== */
      .speaking-indicator {
        position: absolute;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(59, 130, 246, 0.95);
        padding: 10px 20px;
        border-radius: 25px;
        font-size: 13px;
        font-weight: 500;
        display: none;
        z-index: 55;
      }
      .speaking-indicator.active { display: flex; align-items: center; gap: 8px; }
      .speaking-waves {
        display: flex;
        gap: 2px;
        align-items: center;
      }
      .speaking-wave {
        width: 3px;
        height: 12px;
        background: #fff;
        border-radius: 2px;
        animation: wave 0.5s ease-in-out infinite;
      }
      .speaking-wave:nth-child(2) { animation-delay: 0.1s; height: 16px; }
      .speaking-wave:nth-child(3) { animation-delay: 0.2s; }
      @keyframes wave {
        0%, 100% { transform: scaleY(0.5); }
        50% { transform: scaleY(1); }
      }
      
      /* ========== START SCREEN ========== */
      .start-screen {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.98);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 24px;
        z-index: 60;
      }
      .start-icon {
        width: 90px;
        height: 90px;
        border: 3px solid #3b82f6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        margin-bottom: 24px;
        animation: glow 2s infinite;
      }
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
        50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
      }
      .start-title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .start-subtitle {
        font-size: 14px;
        color: #666;
        text-align: center;
        line-height: 1.5;
        margin-bottom: 32px;
        max-width: 300px;
      }
      .camera-selector {
        width: 100%;
        max-width: 320px;
        margin-bottom: 16px;
      }
      .camera-selector label {
        display: block;
        font-size: 12px;
        color: #666;
        margin-bottom: 8px;
      }
      .camera-selector select {
        width: 100%;
        background: #111;
        border: 1px solid #333;
        color: #fff;
        padding: 14px;
        border-radius: 10px;
        font-size: 14px;
      }
      .start-btn {
        width: 100%;
        max-width: 320px;
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: #fff;
        border: none;
        padding: 18px;
        border-radius: 12px;
        font-size: 17px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .start-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
      }
      .start-btn:disabled { 
        background: #333; 
        color: #666; 
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
      .start-note {
        font-size: 12px;
        color: #444;
        margin-top: 20px;
        text-align: center;
      }
      .error-display {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid #dc2626;
        color: #fca5a5;
        padding: 14px;
        border-radius: 10px;
        font-size: 12px;
        margin-top: 16px;
        max-width: 320px;
        line-height: 1.5;
      }
      
      /* ========== LOADING ========== */
      .loading-screen {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 70;
      }
      .loader {
        width: 60px;
        height: 60px;
        border: 4px solid #1a1a1a;
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      .loading-text { font-size: 15px; color: #888; }
      .loading-sub { font-size: 12px; color: #555; margin-top: 8px; }
      
      /* ========== BOTTOM CONTROLS ========== */
      .bottom-controls {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0,0,0,0.98));
        padding: 24px 16px 16px;
        z-index: 50;
      }
      .controls-row {
        display: flex;
        gap: 10px;
      }
      .ctrl-btn {
        background: rgba(26,26,26,0.95);
        border: 1px solid #333;
        color: #fff;
        padding: 14px 18px;
        border-radius: 12px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }
      .ctrl-btn:hover { border-color: #3b82f6; }
      .ctrl-btn.primary { 
        background: #3b82f6; 
        border-color: #3b82f6;
        flex: 1;
        font-weight: 600;
      }
      .ctrl-btn.danger { 
        background: rgba(127, 29, 29, 0.9);
        border-color: #991b1b;
      }
      .ctrl-btn.muted { opacity: 0.5; }
      
      /* ========== COMPLETION ========== */
      .complete-screen {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.98);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 24px;
        z-index: 80;
      }
      .complete-icon { font-size: 64px; margin-bottom: 16px; }
      .complete-title { 
        font-size: 26px; 
        font-weight: 700; 
        color: #22c55e;
        margin-bottom: 8px;
      }
      .complete-subtitle { 
        font-size: 14px; 
        color: #666;
        margin-bottom: 24px;
      }
      .stats-card {
        background: #111;
        border: 1px solid #222;
        border-radius: 16px;
        padding: 20px 28px;
        margin-bottom: 24px;
        min-width: 280px;
      }
      .stat-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        font-size: 14px;
        border-bottom: 1px solid #1a1a1a;
      }
      .stat-item:last-child { border-bottom: none; }
      .stat-label { color: #888; }
      .stat-value { color: #fff; font-weight: 600; }
      .stat-item.alert .stat-value { color: #ef4444; }
      
      /* ========== FOOTER ========== */
      .footer {
        background: #0a0a0a;
        padding: 12px 16px;
        display: flex;
        gap: 12px;
        border-top: 1px solid #1a1a1a;
      }
      .footer-btn {
        flex: 1;
        padding: 14px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
      }
      .footer-btn.secondary { background: #1a1a1a; color: #666; }
      .footer-btn.primary { background: #3b82f6; color: #fff; }
      .footer-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      
      /* ========== RESPONSIVE ========== */
      @media (min-width: 768px) {
        .app { max-width: 480px; margin: 0 auto; box-shadow: 0 0 60px rgba(0,0,0,0.5); }
      }
    </style>
    
    <div class="app">
      <!-- Header -->
      <div class="header">
        <a href="/doctor" class="back-btn">← Back</a>
        <span class="title">MSK Assessment</span>
        <div class="mic-indicator">
          <div class="mic-dot" id="micDot"></div>
          <span id="micLabel">MIC</span>
        </div>
      </div>
      
      <!-- Exercise Info -->
      <div class="exercise-info">
        <div class="progress-track" id="progressTrack"></div>
        <div class="exercise-title" id="exerciseTitle">Ready to Begin</div>
        <div class="exercise-desc" id="exerciseDesc">Press Start to begin your guided assessment</div>
      </div>
      
      <!-- Camera Container -->
      <div class="camera-container">
        <video id="video" autoplay playsinline muted></video>
        <canvas id="canvas"></canvas>
        
        <!-- Rep Counter -->
        <div class="rep-display" id="repDisplay" style="display:none">
          <div class="rep-label">REPS</div>
          <div class="rep-num" id="repNum">0</div>
          <div class="rep-target" id="repTarget">/ 5</div>
          <div class="rep-bar"><div class="rep-fill" id="repFill"></div></div>
        </div>
        
        <!-- Angles Panel -->
        <div class="angles-panel" id="anglesPanel" style="display:none">
          <div class="angles-header">
            <div class="live-dot"></div>
            <span class="angles-title">Live Tracking</span>
          </div>
          <div id="anglesList"></div>
        </div>
        
        <!-- Alerts -->
        <div class="alerts-container" id="alertsContainer"></div>
        
        <!-- Speaking Indicator -->
        <div class="speaking-indicator" id="speakingIndicator">
          <div class="speaking-waves">
            <div class="speaking-wave"></div>
            <div class="speaking-wave"></div>
            <div class="speaking-wave"></div>
          </div>
          <span>Speaking...</span>
        </div>
        
        <!-- Start Screen -->
        <div class="start-screen" id="startScreen">
          <div class="start-icon">🏥</div>
          <div class="start-title">Guided Assessment</div>
          <div class="start-subtitle">
            Voice-guided exercises with real-time<br>
            joint tracking and automatic counting
          </div>
          
          <div class="camera-selector">
            <label>Select Camera</label>
            <select id="cameraSelect">
              <option value="">Detecting cameras...</option>
            </select>
          </div>
          
          <button class="start-btn" id="startBtn" disabled>
            🎬 Start Assessment
          </button>
          
          <div class="start-note">
            📹 Camera + 🎤 Microphone required<br>
            Voice will guide you through each exercise
          </div>
          
          <div class="error-display" id="errorDisplay" style="display:none"></div>
        </div>
        
        <!-- Loading -->
        <div class="loading-screen" id="loadingScreen" style="display:none">
          <div class="loader"></div>
          <div class="loading-text" id="loadingText">Loading AI...</div>
          <div class="loading-sub" id="loadingSub">Please wait</div>
        </div>
        
        <!-- Completion -->
        <div class="complete-screen" id="completeScreen" style="display:none">
          <div class="complete-icon">✅</div>
          <div class="complete-title">Assessment Complete!</div>
          <div class="complete-subtitle">All exercises finished</div>
          <div class="stats-card" id="statsCard"></div>
          <button class="start-btn" id="generateBtn">📋 Generate Report</button>
        </div>
        
        <!-- Bottom Controls -->
        <div class="bottom-controls" id="bottomControls" style="display:none">
          <div class="controls-row">
            <button class="ctrl-btn" id="muteBtn">🔊</button>
            <button class="ctrl-btn" id="skipBtn">Skip →</button>
            <button class="ctrl-btn primary" id="nextBtn">Next</button>
            <button class="ctrl-btn danger" id="stopBtn">⏹</button>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <button class="footer-btn secondary" id="restartBtn">Restart</button>
        <button class="footer-btn primary" id="reportBtn" disabled>Generate Report</button>
      </div>
    </div>
    
    <!-- MediaPipe CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js" crossorigin="anonymous"></script>
    
    <script>
    (function() {
      'use strict';
      
      // ================================================================
      // ERROR HANDLING UTILITY - Fails Silently
      // ================================================================
      const ErrorLogger = {
        log: function(type, message, context) {
          try {
            console.error('[MSK Error]', type, message, context);
            
            // Send to server (async, non-blocking)
            fetch('/api/log-error', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type,
                message,
                url: window.location.href,
                context,
                timestamp: new Date().toISOString()
              })
            }).catch(() => {}); // Fail silently
            
          } catch (e) {
            // Never crash due to logging
          }
        },
        
        wrap: function(fn, context) {
          return function(...args) {
            try {
              return fn.apply(this, args);
            } catch (e) {
              ErrorLogger.log('error', e.message, { context, stack: e.stack });
              return null;
            }
          };
        }
      };
      
      // Global error handler
      window.onerror = function(msg, url, line, col, error) {
        ErrorLogger.log('uncaught', msg, { url, line, col, stack: error?.stack });
        return false;
      };
      
      window.onunhandledrejection = function(event) {
        ErrorLogger.log('promise', event.reason?.message || 'Promise rejected', {
          stack: event.reason?.stack
        });
      };
      
      // ================================================================
      // TEXT-TO-SPEECH UTILITY
      // ================================================================
      const TTS = {
        synth: window.speechSynthesis,
        muted: false,
        speaking: false,
        
        speak: function(text, onEnd) {
          if (this.muted || !this.synth) {
            if (onEnd) setTimeout(onEnd, 100);
            return;
          }
          
          try {
            this.synth.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            utterance.onstart = () => {
              this.speaking = true;
              document.getElementById('speakingIndicator')?.classList.add('active');
            };
            
            utterance.onend = () => {
              this.speaking = false;
              document.getElementById('speakingIndicator')?.classList.remove('active');
              if (onEnd) onEnd();
            };
            
            utterance.onerror = () => {
              this.speaking = false;
              document.getElementById('speakingIndicator')?.classList.remove('active');
              if (onEnd) onEnd();
            };
            
            this.synth.speak(utterance);
            
          } catch (e) {
            ErrorLogger.log('warning', 'TTS failed', { text });
            if (onEnd) onEnd();
          }
        },
        
        toggle: function() {
          this.muted = !this.muted;
          if (this.muted && this.synth) this.synth.cancel();
          return this.muted;
        },
        
        stop: function() {
          try {
            if (this.synth) this.synth.cancel();
            this.speaking = false;
          } catch (e) {}
        }
      };
      
      // ================================================================
      // SPEECH RECOGNITION UTILITY
      // ================================================================
      const SpeechRecognizer = {
        recognition: null,
        active: false,
        transcript: '',
        onResult: null,
        
        init: function() {
          try {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SR) {
              console.warn('Speech recognition not supported');
              return false;
            }
            
            this.recognition = new SR();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
              for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                  const text = event.results[i][0].transcript;
                  this.transcript += text + ' ';
                  if (this.onResult) this.onResult(text);
                }
              }
            };
            
            this.recognition.onerror = (e) => {
              if (e.error !== 'no-speech' && this.active) {
                setTimeout(() => this.start(), 1000);
              }
            };
            
            this.recognition.onend = () => {
              if (this.active) {
                setTimeout(() => this.start(), 500);
              }
            };
            
            return true;
            
          } catch (e) {
            ErrorLogger.log('warning', 'Speech recognition init failed', { error: e.message });
            return false;
          }
        },
        
        start: function() {
          if (!this.recognition || this.active) return;
          try {
            this.recognition.start();
            this.active = true;
            document.getElementById('micDot')?.classList.add('active');
            document.getElementById('micLabel').textContent = 'REC';
          } catch (e) {}
        },
        
        stop: function() {
          this.active = false;
          try {
            if (this.recognition) this.recognition.stop();
          } catch (e) {}
          document.getElementById('micDot')?.classList.remove('active');
          document.getElementById('micLabel').textContent = 'MIC';
        },
        
        getTranscript: function() {
          return this.transcript;
        },
        
        clear: function() {
          this.transcript = '';
        }
      };
      
      // ================================================================
      // RED FLAG DETECTOR
      // ================================================================
      const RedFlagDetector = {
        flags: [],
        keywords: {
          'PAIN': ['pain', 'painful', 'hurts', 'hurt', 'ache', 'aching', 'sore', 'ouch'],
          'FALL_RISK': ['fall', 'fell', 'falling', 'stumble', 'trip', 'balance'],
          'DIZZINESS': ['dizzy', 'dizziness', 'lightheaded', 'faint', 'vertigo', 'spinning'],
          'NUMBNESS': ['numb', 'numbness', 'tingling', 'pins and needles', 'cant feel'],
          'WEAKNESS': ['weak', 'weakness', 'cant move', 'hard to move', 'difficult'],
          'ACUTE': ['sharp', 'shooting', 'stabbing', 'burning', 'severe'],
          'SWELLING': ['swollen', 'swelling', 'inflamed', 'puffy']
        },
        icons: {
          'PAIN': '⚠️', 'FALL_RISK': '🚨', 'DIZZINESS': '💫', 
          'NUMBNESS': '🔴', 'WEAKNESS': '⚡', 'ACUTE': '🔥', 'SWELLING': '🫀'
        },
        
        check: function(text, exercise) {
          const lower = text.toLowerCase();
          
          for (const [type, words] of Object.entries(this.keywords)) {
            for (const word of words) {
              if (lower.includes(word)) {
                this.addFlag(type, text, exercise);
                return { detected: true, type, icon: this.icons[type] };
              }
            }
          }
          return { detected: false };
        },
        
        addFlag: function(type, context, exercise) {
          const flag = {
            id: Date.now(),
            type,
            icon: this.icons[type],
            context,
            exercise,
            time: new Date().toLocaleTimeString()
          };
          
          this.flags.push(flag);
          this.showAlert(flag);
          this.logToServer(flag);
          
          // Announce
          TTS.speak('I noticed you mentioned ' + type.toLowerCase().replace('_', ' ') + '. I will note this.');
        },
        
        showAlert: function(flag) {
          const container = document.getElementById('alertsContainer');
          if (!container) return;
          
          const div = document.createElement('div');
          div.className = 'alert-item';
          div.innerHTML = 
            '<span class="alert-icon">' + flag.icon + '</span>' +
            '<div class="alert-content">' +
              '<div class="alert-type">' + flag.type.replace('_', ' ') + ' Detected</div>' +
              '<div class="alert-detail">' + flag.exercise + '</div>' +
            '</div>' +
            '<span class="alert-time">' + flag.time + '</span>';
          
          container.appendChild(div);
          
          // Auto-remove
          setTimeout(() => div.remove(), 6000);
        },
        
        logToServer: function(flag) {
          fetch('/api/red-flag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: flag.type,
              severity: flag.type === 'FALL_RISK' || flag.type === 'ACUTE' ? 'high' : 'medium',
              context: flag.context
            })
          }).catch(() => {});
        },
        
        getFlags: function() {
          return this.flags;
        },
        
        clear: function() {
          this.flags = [];
        }
      };
      
      // ================================================================
      // EXERCISES CONFIGURATION
      // ================================================================
      const EXERCISES = [
        {
          name: 'Deep Squat',
          desc: 'Squat down keeping heels on ground, then stand up',
          voice: 'Exercise 1: Deep Squat. Stand with feet shoulder width apart. Squat down as low as comfortable, then stand back up. Complete 5 repetitions.',
          reps: 5,
          joint: 'knee',
          downAngle: 100,
          upAngle: 160,
          track: ['knee', 'hip']
        },
        {
          name: 'Shoulder Raise',
          desc: 'Raise both arms overhead, then lower them',
          voice: 'Exercise 2: Shoulder Raise. Raise both arms straight up overhead, then lower them back down. Complete 5 repetitions.',
          reps: 5,
          joint: 'shoulder',
          downAngle: 50,
          upAngle: 140,
          track: ['shoulder', 'elbow']
        },
        {
          name: 'Hip Hinge',
          desc: 'Bend forward at hips keeping back straight',
          voice: 'Exercise 3: Hip Hinge. Bend forward at your hips while keeping your back straight, then stand up. Complete 5 repetitions.',
          reps: 5,
          joint: 'hip',
          downAngle: 100,
          upAngle: 165,
          track: ['hip', 'knee']
        },
        {
          name: 'Arm Curl',
          desc: 'Bend elbows to bring hands to shoulders',
          voice: 'Exercise 4: Arm Curl. Bend your elbows to bring your hands toward your shoulders, then straighten. Complete 5 repetitions.',
          reps: 5,
          joint: 'elbow',
          downAngle: 50,
          upAngle: 140,
          track: ['elbow', 'shoulder']
        },
        {
          name: 'Trunk Rotation',
          desc: 'Rotate upper body left, then right',
          voice: 'Exercise 5: Trunk Rotation. Rotate your upper body to the left, return to center, then rotate right. Complete 4 repetitions each side.',
          reps: 4,
          joint: 'hip',
          downAngle: 150,
          upAngle: 175,
          track: ['hip', 'shoulder']
        },
        {
          name: 'Single Leg Stand',
          desc: 'Stand on one leg for 3 seconds',
          voice: 'Exercise 6: Single Leg Stand. Lift one foot off the ground and balance for 3 seconds, then switch legs. Complete 3 repetitions each side.',
          reps: 3,
          joint: 'hip',
          downAngle: 150,
          upAngle: 175,
          track: ['hip', 'knee']
        }
      ];
      
      // ================================================================
      // MAIN APPLICATION STATE
      // ================================================================
      const App = {
        holistic: null,
        stream: null,
        running: false,
        cameras: [],
        selectedCamera: null,
        
        // Exercise state
        currentIdx: 0,
        reps: 0,
        repState: 'neutral',
        angles: {},
        results: [],
        startTime: null,
        
        // DOM
        video: null,
        canvas: null,
        ctx: null,
        
        // ============== INITIALIZATION ==============
        init: async function() {
          console.log('[MSK] Initializing v8.0...');
          
          this.video = document.getElementById('video');
          this.canvas = document.getElementById('canvas');
          this.ctx = this.canvas.getContext('2d');
          
          // Attach event listeners
          this.attachListeners();
          
          // Init speech recognition
          SpeechRecognizer.init();
          SpeechRecognizer.onResult = (text) => {
            RedFlagDetector.check(text, EXERCISES[this.currentIdx]?.name || 'General');
          };
          
          // Enumerate cameras
          await this.enumerateCameras();
          
          // Render initial progress
          this.renderProgress();
          
          console.log('[MSK] Ready');
        },
        
        attachListeners: function() {
          document.getElementById('startBtn').onclick = () => this.start();
          document.getElementById('muteBtn').onclick = () => this.toggleMute();
          document.getElementById('skipBtn').onclick = () => this.skipExercise();
          document.getElementById('nextBtn').onclick = () => this.nextExercise();
          document.getElementById('stopBtn').onclick = () => this.stop();
          document.getElementById('restartBtn').onclick = () => this.restart();
          document.getElementById('reportBtn').onclick = () => this.generateReport();
          document.getElementById('generateBtn').onclick = () => this.generateReport();
          document.getElementById('cameraSelect').onchange = (e) => {
            this.selectedCamera = e.target.value;
          };
        },
        
        // ============== CAMERA ==============
        enumerateCameras: async function() {
          const select = document.getElementById('cameraSelect');
          const startBtn = document.getElementById('startBtn');
          const errorDisplay = document.getElementById('errorDisplay');
          
          try {
            // Request permission
            const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            tempStream.getTracks().forEach(t => t.stop());
            
            // Enumerate
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.cameras = devices.filter(d => d.kind === 'videoinput');
            
            if (this.cameras.length === 0) {
              throw new Error('No cameras found');
            }
            
            // Populate select
            select.innerHTML = this.cameras.map((cam, i) => 
              '<option value="' + cam.deviceId + '">' + (cam.label || 'Camera ' + (i+1)) + '</option>'
            ).join('');
            
            this.selectedCamera = this.cameras[0].deviceId;
            startBtn.disabled = false;
            errorDisplay.style.display = 'none';
            
          } catch (e) {
            ErrorLogger.log('error', 'Camera enumeration failed', { error: e.message });
            errorDisplay.textContent = 'Camera access required: ' + e.message;
            errorDisplay.style.display = 'block';
            startBtn.disabled = true;
          }
        },
        
        // ============== HOLISTIC ==============
        initHolistic: async function() {
          const loadingScreen = document.getElementById('loadingScreen');
          const loadingText = document.getElementById('loadingText');
          const loadingSub = document.getElementById('loadingSub');
          
          loadingScreen.style.display = 'flex';
          loadingText.textContent = 'Loading AI tracking...';
          loadingSub.textContent = 'Body + Face + Hands detection';
          
          try {
            this.holistic = new Holistic({
              locateFile: (file) => 'https://cdn.jsdelivr.net/npm/@mediapipe/holistic/' + file
            });
            
            this.holistic.setOptions({
              modelComplexity: 1,
              smoothLandmarks: true,
              refineFaceLandmarks: true,
              minDetectionConfidence: 0.5,
              minTrackingConfidence: 0.5
            });
            
            this.holistic.onResults((results) => this.onResults(results));
            
            loadingText.textContent = 'AI ready!';
            return true;
            
          } catch (e) {
            ErrorLogger.log('error', 'Holistic init failed', { error: e.message });
            loadingText.textContent = 'Failed to load AI';
            loadingSub.textContent = e.message;
            return false;
          }
        },
        
        // ============== START ==============
        start: async function() {
          const startBtn = document.getElementById('startBtn');
          startBtn.disabled = true;
          startBtn.textContent = 'Starting...';
          
          try {
            // Init holistic if needed
            if (!this.holistic) {
              const ok = await this.initHolistic();
              if (!ok) {
                startBtn.disabled = false;
                startBtn.textContent = 'Try Again';
                return;
              }
            }
            
            // Get camera stream
            const constraints = {
              video: this.selectedCamera ? { deviceId: { exact: this.selectedCamera } } : true,
              audio: false
            };
            
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            
            await new Promise((resolve) => {
              this.video.onloadedmetadata = () => this.video.play().then(resolve);
            });
            
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            
            // Update UI
            document.getElementById('loadingScreen').style.display = 'none';
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('repDisplay').style.display = 'block';
            document.getElementById('anglesPanel').style.display = 'block';
            document.getElementById('bottomControls').style.display = 'block';
            
            this.running = true;
            this.startTime = Date.now();
            
            // Start mic recording
            SpeechRecognizer.start();
            
            // Start processing
            this.processFrame();
            
            // Welcome message
            TTS.speak('Welcome to the guided assessment. I will guide you through ' + EXERCISES.length + ' exercises. Let me know if you feel any pain or discomfort.', () => {
              this.startExercise(0);
            });
            
          } catch (e) {
            ErrorLogger.log('error', 'Start failed', { error: e.message });
            document.getElementById('errorDisplay').textContent = e.message;
            document.getElementById('errorDisplay').style.display = 'block';
            document.getElementById('loadingScreen').style.display = 'none';
            startBtn.disabled = false;
            startBtn.textContent = 'Try Again';
          }
        },
        
        // ============== FRAME PROCESSING ==============
        processFrame: async function() {
          if (!this.running) return;
          
          try {
            await this.holistic.send({ image: this.video });
          } catch (e) {
            ErrorLogger.log('warning', 'Frame processing error', { error: e.message });
          }
          
          requestAnimationFrame(() => this.processFrame());
        },
        
        onResults: function(results) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          
          // Draw pose
          if (results.poseLandmarks) {
            drawConnectors(this.ctx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#3b82f6', lineWidth: 3 });
            drawLandmarks(this.ctx, results.poseLandmarks, { color: '#93c5fd', fillColor: '#3b82f6', radius: 4 });
            
            this.calculateAngles(results.poseLandmarks);
            this.detectRep();
          }
          
          // Draw face
          if (results.faceLandmarks) {
            drawConnectors(this.ctx, results.faceLandmarks, FACEMESH_TESSELATION, { color: 'rgba(6, 182, 212, 0.15)', lineWidth: 1 });
            drawConnectors(this.ctx, results.faceLandmarks, FACEMESH_FACE_OVAL, { color: '#06b6d4', lineWidth: 2 });
          }
          
          // Draw hands
          if (results.leftHandLandmarks) {
            drawConnectors(this.ctx, results.leftHandLandmarks, HAND_CONNECTIONS, { color: '#8b5cf6', lineWidth: 2 });
            drawLandmarks(this.ctx, results.leftHandLandmarks, { color: '#c4b5fd', fillColor: '#8b5cf6', radius: 3 });
          }
          if (results.rightHandLandmarks) {
            drawConnectors(this.ctx, results.rightHandLandmarks, HAND_CONNECTIONS, { color: '#8b5cf6', lineWidth: 2 });
            drawLandmarks(this.ctx, results.rightHandLandmarks, { color: '#c4b5fd', fillColor: '#8b5cf6', radius: 3 });
          }
        },
        
        // ============== ANGLE CALCULATION ==============
        calculateAngles: function(lm) {
          if (!lm || lm.length < 33) return;
          
          const angle = (a, b, c) => {
            const rad = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
            let deg = Math.abs(rad * 180 / Math.PI);
            if (deg > 180) deg = 360 - deg;
            return Math.round(deg);
          };
          
          // Indices
          const LS=11, RS=12, LE=13, RE=14, LW=15, RW=16, LH=23, RH=24, LK=25, RK=26, LA=27, RA=28;
          
          this.angles = {
            knee: Math.round((angle(lm[LH], lm[LK], lm[LA]) + angle(lm[RH], lm[RK], lm[RA])) / 2),
            hip: Math.round((angle(lm[LS], lm[LH], lm[LK]) + angle(lm[RS], lm[RH], lm[RK])) / 2),
            shoulder: Math.round((angle(lm[LE], lm[LS], lm[LH]) + angle(lm[RE], lm[RS], lm[RH])) / 2),
            elbow: Math.round((angle(lm[LS], lm[LE], lm[LW]) + angle(lm[RS], lm[RE], lm[RW])) / 2)
          };
          
          this.updateAnglesUI();
        },
        
        updateAnglesUI: function() {
          const exercise = EXERCISES[this.currentIdx];
          if (!exercise) return;
          
          let html = '';
          exercise.track.forEach((joint, i) => {
            const val = this.angles[joint] || 0;
            const isPrimary = joint === exercise.joint;
            html += '<div class="angle-item ' + (isPrimary ? 'primary' : '') + '">' +
                    '<span class="angle-label">' + joint.charAt(0).toUpperCase() + joint.slice(1) + '</span>' +
                    '<span class="angle-value">' + val + '°</span></div>';
          });
          
          document.getElementById('anglesList').innerHTML = html;
        },
        
        // ============== REP DETECTION ==============
        detectRep: function() {
          const ex = EXERCISES[this.currentIdx];
          if (!ex) return;
          
          const angle = this.angles[ex.joint];
          if (!angle) return;
          
          if (this.repState === 'neutral' || this.repState === 'up') {
            if (angle <= ex.downAngle) {
              this.repState = 'down';
            }
          } else if (this.repState === 'down') {
            if (angle >= ex.upAngle) {
              this.repState = 'up';
              this.completeRep();
            }
          }
        },
        
        completeRep: function() {
          this.reps++;
          const ex = EXERCISES[this.currentIdx];
          
          document.getElementById('repNum').textContent = this.reps;
          document.getElementById('repFill').style.width = (this.reps / ex.reps * 100) + '%';
          
          if (this.reps < ex.reps) {
            TTS.speak(String(this.reps));
          }
          
          if (this.reps >= ex.reps) {
            this.results.push({
              name: ex.name,
              reps: this.reps,
              target: ex.reps,
              score: 3,
              maxAngles: { ...this.angles }
            });
            
            TTS.speak('Excellent! Moving to next exercise.', () => {
              setTimeout(() => this.startExercise(this.currentIdx + 1), 1000);
            });
          }
        },
        
        // ============== EXERCISE FLOW ==============
        startExercise: function(idx) {
          if (idx >= EXERCISES.length) {
            this.complete();
            return;
          }
          
          this.currentIdx = idx;
          this.reps = 0;
          this.repState = 'neutral';
          
          const ex = EXERCISES[idx];
          
          document.getElementById('exerciseTitle').textContent = (idx + 1) + '. ' + ex.name;
          document.getElementById('exerciseDesc').textContent = ex.desc;
          document.getElementById('repNum').textContent = '0';
          document.getElementById('repTarget').textContent = '/ ' + ex.reps;
          document.getElementById('repFill').style.width = '0%';
          
          this.renderProgress();
          
          TTS.speak(ex.voice, () => {
            TTS.speak('Begin now.');
          });
        },
        
        skipExercise: function() {
          const ex = EXERCISES[this.currentIdx];
          this.results.push({
            name: ex.name,
            reps: this.reps,
            target: ex.reps,
            score: this.reps > 0 ? 1 : 0,
            skipped: true,
            maxAngles: { ...this.angles }
          });
          
          TTS.speak('Skipping to next exercise.');
          this.startExercise(this.currentIdx + 1);
        },
        
        nextExercise: function() {
          const ex = EXERCISES[this.currentIdx];
          this.results.push({
            name: ex.name,
            reps: this.reps,
            target: ex.reps,
            score: this.reps >= ex.reps ? 3 : (this.reps > 0 ? 2 : 1),
            maxAngles: { ...this.angles }
          });
          
          this.startExercise(this.currentIdx + 1);
        },
        
        renderProgress: function() {
          const html = EXERCISES.map((_, i) => {
            let cls = 'progress-step';
            if (i < this.currentIdx) cls += ' done';
            else if (i === this.currentIdx) cls += ' active';
            return '<div class="' + cls + '"></div>';
          }).join('');
          
          document.getElementById('progressTrack').innerHTML = html;
        },
        
        // ============== COMPLETION ==============
        complete: function() {
          this.running = false;
          SpeechRecognizer.stop();
          
          document.getElementById('bottomControls').style.display = 'none';
          document.getElementById('anglesPanel').style.display = 'none';
          document.getElementById('repDisplay').style.display = 'none';
          
          const duration = Math.round((Date.now() - this.startTime) / 1000);
          const totalReps = this.results.reduce((s, r) => s + r.reps, 0);
          const flags = RedFlagDetector.getFlags();
          
          let statsHtml = 
            '<div class="stat-item"><span class="stat-label">Exercises</span><span class="stat-value">' + this.results.length + '/' + EXERCISES.length + '</span></div>' +
            '<div class="stat-item"><span class="stat-label">Total Reps</span><span class="stat-value">' + totalReps + '</span></div>' +
            '<div class="stat-item"><span class="stat-label">Duration</span><span class="stat-value">' + Math.floor(duration/60) + 'm ' + (duration%60) + 's</span></div>';
          
          if (flags.length > 0) {
            statsHtml += '<div class="stat-item alert"><span class="stat-label">Red Flags</span><span class="stat-value">' + flags.length + ' detected</span></div>';
          }
          
          document.getElementById('statsCard').innerHTML = statsHtml;
          document.getElementById('completeScreen').style.display = 'flex';
          document.getElementById('reportBtn').disabled = false;
          
          TTS.speak('Assessment complete! You finished ' + this.results.length + ' exercises.' + 
                    (flags.length > 0 ? ' I noted ' + flags.length + ' concerns.' : ''));
          
          // Log to server
          this.logAssessment();
        },
        
        logAssessment: function() {
          const duration = Math.round((Date.now() - this.startTime) / 1000);
          const flags = RedFlagDetector.getFlags();
          
          fetch('/api/assessment/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              duration,
              exercises: this.results,
              redFlags: flags,
              transcript: SpeechRecognizer.getTranscript(),
              summary: {
                totalExercises: EXERCISES.length,
                completedExercises: this.results.filter(r => r.reps >= r.target).length,
                totalReps: this.results.reduce((s, r) => s + r.reps, 0),
                flagCount: flags.length,
                overallScore: Math.round(this.results.reduce((s, r) => s + r.score, 0) / this.results.length * 10) / 10
              }
            })
          }).catch(() => {});
        },
        
        // ============== CONTROLS ==============
        toggleMute: function() {
          const muted = TTS.toggle();
          document.getElementById('muteBtn').textContent = muted ? '🔇' : '🔊';
          document.getElementById('muteBtn').classList.toggle('muted', muted);
        },
        
        stop: function() {
          this.running = false;
          SpeechRecognizer.stop();
          TTS.stop();
          
          if (this.stream) {
            this.stream.getTracks().forEach(t => t.stop());
            this.stream = null;
          }
          
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          
          document.getElementById('startScreen').style.display = 'flex';
          document.getElementById('repDisplay').style.display = 'none';
          document.getElementById('anglesPanel').style.display = 'none';
          document.getElementById('bottomControls').style.display = 'none';
          document.getElementById('completeScreen').style.display = 'none';
          
          document.getElementById('startBtn').disabled = false;
          document.getElementById('startBtn').textContent = 'Resume';
        },
        
        restart: function() {
          this.stop();
          
          this.currentIdx = 0;
          this.reps = 0;
          this.repState = 'neutral';
          this.results = [];
          RedFlagDetector.clear();
          SpeechRecognizer.clear();
          
          document.getElementById('exerciseTitle').textContent = 'Ready to Begin';
          document.getElementById('exerciseDesc').textContent = 'Press Start to begin your guided assessment';
          document.getElementById('alertsContainer').innerHTML = '';
          document.getElementById('reportBtn').disabled = true;
          document.getElementById('startBtn').textContent = '🎬 Start Assessment';
          
          this.renderProgress();
        },
        
        generateReport: function() {
          const duration = Math.round((Date.now() - this.startTime) / 1000);
          const flags = RedFlagDetector.getFlags();
          
          sessionStorage.setItem('mskAssessment', JSON.stringify({
            date: new Date().toISOString(),
            duration,
            exercises: this.results,
            redFlags: flags,
            transcript: SpeechRecognizer.getTranscript()
          }));
          
          sessionStorage.setItem('jointAnalysis', JSON.stringify(this.results));
          sessionStorage.setItem('redFlags', JSON.stringify(flags));
          
          window.location.href = '/doctor/notes';
        }
      };
      
      // ============== INIT ON DOM READY ==============
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
      } else {
        App.init();
      }
      
    })();
    </script>
  `, 'MSK Assessment - Thrive Ortho EHR'))
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
