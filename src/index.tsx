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

// Full Body Joint Scan Page - Advanced Real-Time Tracking with Camera Selection
app.get('/doctor/joints', (c) => {
  return c.html(html(`
    <style>
      /* Advanced MSK Assessment - Real-Time Tracking */
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, sans-serif; background: #000; color: #fff; overflow: hidden; }
      
      .msk-page { height: 100vh; display: flex; flex-direction: column; }
      
      /* Header */
      .msk-header {
        background: #0a0a0a;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 100;
      }
      .msk-header h1 { font-size: 13px; font-weight: 500; color: #666; }
      .back-link { color: #3b82f6; text-decoration: none; font-size: 12px; }
      
      /* Exercise Info */
      .exercise-bar {
        background: #0a0a0a;
        padding: 10px 16px;
        border-bottom: 1px solid #1a1a1a;
      }
      .exercise-name { font-size: 15px; font-weight: 600; color: #fff; }
      .exercise-hint { font-size: 11px; color: #555; margin-top: 2px; }
      
      /* Camera Container */
      .camera-wrap {
        flex: 1;
        position: relative;
        background: #000;
        overflow: hidden;
      }
      #videoElement {
        width: 100%; height: 100%;
        object-fit: cover;
      }
      #canvasElement {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none;
      }
      
      /* Camera Selection */
      .camera-select-wrap {
        margin-bottom: 16px;
        text-align: left;
        width: 100%;
        max-width: 300px;
      }
      .camera-select-wrap label {
        display: block;
        font-size: 11px;
        color: #888;
        margin-bottom: 6px;
      }
      .camera-select {
        width: 100%;
        background: #1a1a1a;
        border: 1px solid #333;
        color: #fff;
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 13px;
        cursor: pointer;
      }
      .camera-select:focus { outline: none; border-color: #3b82f6; }
      .camera-select option { background: #1a1a1a; }
      
      /* Model Quality Selector */
      .model-select-wrap {
        margin-top: 12px;
        text-align: left;
        width: 100%;
        max-width: 300px;
      }
      .model-options {
        display: flex;
        gap: 8px;
        margin-top: 6px;
      }
      .model-opt {
        flex: 1;
        padding: 8px;
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 6px;
        text-align: center;
        cursor: pointer;
        font-size: 11px;
        color: #888;
      }
      .model-opt.active {
        border-color: #3b82f6;
        color: #3b82f6;
        background: rgba(59, 130, 246, 0.1);
      }
      .model-opt .name { font-weight: 600; }
      .model-opt .desc { font-size: 9px; margin-top: 2px; opacity: 0.7; }
      
      /* REP COUNTER */
      .rep-box {
        position: absolute;
        top: 12px; right: 12px;
        background: rgba(0,0,0,0.9);
        padding: 10px 16px;
        border-radius: 10px;
        text-align: center;
        z-index: 50;
        border: 2px solid #3b82f6;
        min-width: 80px;
      }
      .rep-label { font-size: 9px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
      .rep-count { font-size: 36px; font-weight: 700; color: #3b82f6; line-height: 1; }
      .rep-target { font-size: 12px; color: #555; }
      .rep-progress { width: 100%; height: 3px; background: #222; border-radius: 2px; margin-top: 6px; }
      .rep-fill { height: 100%; background: #3b82f6; transition: width 0.2s; border-radius: 2px; }
      
      /* Joint Angles Display */
      .angles-box {
        position: absolute;
        top: 12px; left: 12px;
        background: rgba(0,0,0,0.9);
        padding: 8px 12px;
        border-radius: 8px;
        z-index: 50;
        font-size: 11px;
        min-width: 120px;
      }
      .angles-box .title { color: #3b82f6; font-weight: 600; margin-bottom: 6px; font-size: 10px; }
      .angle-row { display: flex; justify-content: space-between; padding: 2px 0; color: #888; }
      .angle-row .val { color: #fff; font-weight: 500; }
      .angle-row.warn .val { color: #f59e0b; }
      .angle-row.good .val { color: #22c55e; }
      
      /* Loading Indicator */
      .loading-ml {
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        text-align: center; z-index: 60;
      }
      .loading-ml .spinner {
        width: 40px; height: 40px;
        border: 3px solid #333;
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 12px;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      .loading-ml .text { color: #666; font-size: 12px; }
      
      /* Start Button */
      .camera-start {
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        text-align: center; z-index: 55;
        width: 90%;
        max-width: 320px;
      }
      .start-btn {
        background: #3b82f6; color: #fff; border: none;
        padding: 16px 32px; border-radius: 10px;
        font-size: 16px; font-weight: 600; cursor: pointer;
        width: 100%;
      }
      .start-btn:disabled { background: #333; color: #555; }
      .perm-note { font-size: 11px; color: #555; margin-top: 12px; }
      .error-msg { 
        background: rgba(220, 38, 38, 0.2);
        border: 1px solid #dc2626;
        color: #fca5a5;
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 11px;
        margin-top: 12px;
        text-align: left;
      }
      .error-msg .title { font-weight: 600; margin-bottom: 4px; }
      .no-cameras { color: #f59e0b; font-size: 12px; margin-top: 8px; }
      
      /* Bottom Controls */
      .bottom-bar {
        position: absolute; bottom: 0; left: 0; right: 0;
        background: linear-gradient(transparent, rgba(0,0,0,0.95));
        padding: 20px 16px 16px; z-index: 50;
      }
      .ctrl-row { display: flex; gap: 10px; justify-content: center; }
      .ctrl-btn {
        background: #1a1a1a; border: 1px solid #333; color: #fff;
        padding: 12px 16px; border-radius: 8px; font-size: 13px; cursor: pointer;
      }
      .ctrl-btn.primary { background: #3b82f6; border-color: #3b82f6; flex: 1; font-weight: 600; }
      .ctrl-btn.stop { background: #7f1d1d; border-color: #991b1b; }
      
      /* Task List */
      .task-panel { background: #0a0a0a; padding: 10px 16px; max-height: 25vh; overflow-y: auto; }
      .task-row {
        display: flex; align-items: center; gap: 8px;
        padding: 6px 0; border-bottom: 1px solid #1a1a1a;
        font-size: 12px; color: #666;
      }
      .task-row.active { color: #fff; }
      .task-row.done { color: #22c55e; }
      .task-num {
        width: 20px; height: 20px; border-radius: 50%;
        background: #222; color: #555;
        display: flex; align-items: center; justify-content: center;
        font-size: 10px; font-weight: 600;
      }
      .task-row.active .task-num { background: #3b82f6; color: #fff; }
      .task-row.done .task-num { background: #22c55e; color: #fff; }
      .task-row .reps { margin-left: auto; font-size: 10px; }
      
      /* Footer */
      .action-footer {
        background: #0a0a0a; padding: 10px 16px;
        display: flex; gap: 8px; border-top: 1px solid #1a1a1a;
      }
      .action-footer .btn {
        flex: 1; padding: 12px; border-radius: 8px;
        font-size: 13px; font-weight: 600; cursor: pointer; border: none;
      }
      .action-footer .btn.primary { background: #3b82f6; color: #fff; }
      .action-footer .btn.secondary { background: #1a1a1a; color: #666; }
      
      @media (min-width: 768px) { .msk-page { max-width: 500px; margin: 0 auto; } }
    </style>
    
    <div class="msk-page">
      <div class="msk-header">
        <a href="/doctor" class="back-link">← Back</a>
        <h1>MSK Assessment</h1>
        <span style="width:40px;"></span>
      </div>
      
      <div class="exercise-bar">
        <div class="exercise-name" id="exerciseName">1. Deep Squat</div>
        <div class="exercise-hint" id="exerciseHint">Squat down fully - tracking knee, hip, ankle</div>
      </div>
      
      <div class="camera-wrap">
        <video id="videoElement" autoplay playsinline muted></video>
        <canvas id="canvasElement"></canvas>
        
        <!-- Joint Angles Display -->
        <div class="angles-box" id="anglesBox" style="display:none;">
          <div class="title">LIVE JOINT ANGLES</div>
          <div id="anglesList"></div>
        </div>
        
        <!-- Rep Counter -->
        <div class="rep-box" id="repBox" style="display:none;">
          <div class="rep-label">REPS</div>
          <div class="rep-count" id="repCount">0</div>
          <div class="rep-target" id="repTarget">/ 5</div>
          <div class="rep-progress"><div class="rep-fill" id="repFill"></div></div>
        </div>
        
        <!-- Loading ML Model -->
        <div class="loading-ml" id="loadingML" style="display:none;">
          <div class="spinner"></div>
          <div class="text">Loading AI Model...</div>
        </div>
        
        <!-- Start Button with Camera Selection -->
        <div class="camera-start" id="cameraStart">
          <!-- Camera Selection Dropdown -->
          <div class="camera-select-wrap">
            <label>Select Camera</label>
            <select id="cameraSelect" class="camera-select">
              <option value="">Loading cameras...</option>
            </select>
          </div>
          
          <!-- Model Quality Selection -->
          <div class="model-select-wrap">
            <label>Tracking Quality</label>
            <div class="model-options">
              <div class="model-opt active" data-model="heavy" onclick="selectModel('heavy')">
                <div class="name">Heavy</div>
                <div class="desc">Most Accurate</div>
              </div>
              <div class="model-opt" data-model="full" onclick="selectModel('full')">
                <div class="name">Full</div>
                <div class="desc">Balanced</div>
              </div>
              <div class="model-opt" data-model="lite" onclick="selectModel('lite')">
                <div class="name">Lite</div>
                <div class="desc">Fastest</div>
              </div>
            </div>
          </div>
          
          <button class="start-btn" id="startBtn" onclick="startAssessment()" style="margin-top: 16px;">
            Start Camera
          </button>
          
          <div class="perm-note" id="permNote">Real-time 33-point joint tracking with MediaPipe AI</div>
          <div id="errorMsg"></div>
        </div>
        
        <!-- Bottom Controls -->
        <div class="bottom-bar" id="bottomBar" style="display:none;">
          <div class="ctrl-row">
            <button class="ctrl-btn" onclick="switchCamera()">Switch Cam</button>
            <button class="ctrl-btn primary" id="nextBtn" onclick="nextExercise()">Next Exercise →</button>
            <button class="ctrl-btn stop" onclick="stopAssessment()">Stop</button>
          </div>
        </div>
      </div>
      
      <div class="task-panel" id="taskPanel"></div>
      
      <div class="action-footer">
        <button class="btn secondary" onclick="restartAll()">Restart</button>
        <button class="btn primary" onclick="generateNote()">Generate Note</button>
      </div>
    </div>
    
    <!-- MediaPipe Tasks Vision -->
    <script type="module">
      import { PoseLandmarker, FilesetResolver, DrawingUtils } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/vision_bundle.mjs';
      
      // ==========================================
      // ADVANCED MSK ASSESSMENT WITH MEDIAPIPE
      // Camera selection + Model quality + Real-time tracking
      // ==========================================
      
      let poseLandmarker = null;
      let webcamRunning = false;
      let stream = null;
      let selectedDeviceId = null;
      let selectedModel = 'heavy'; // heavy, full, lite
      let animationId = null;
      let availableCameras = [];
      
      // State
      let currentTaskIdx = 0;
      let currentReps = 0;
      let lastAngles = {};
      let repState = 'up';
      let assessmentData = [];
      
      // Model URLs - Heavy is most accurate for medical use
      const MODEL_URLS = {
        heavy: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task',
        full: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task',
        lite: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
      };
      
      // Medical-grade ROM thresholds (degrees)
      const ROM_STANDARDS = {
        knee_flexion: { normal: 135, limited: 100, label: 'Knee' },
        hip_flexion: { normal: 120, limited: 90, label: 'Hip' },
        ankle_dorsiflexion: { normal: 20, limited: 10, label: 'Ankle' },
        shoulder_flexion: { normal: 180, limited: 150, label: 'Shoulder' },
        elbow_flexion: { normal: 145, limited: 120, label: 'Elbow' }
      };
      
      // Exercises with rep requirements
      const exercises = [
        { name: 'Deep Squat', hint: 'Squat down fully - tracking knee, hip, ankle', reps: 5, joints: ['knee_flexion', 'hip_flexion', 'ankle_dorsiflexion'], detectKey: 'knee_flexion', threshold: 90, done: 0, maxAngles: {} },
        { name: 'Shoulder Raise', hint: 'Raise arms overhead', reps: 5, joints: ['shoulder_flexion'], detectKey: 'shoulder_flexion', threshold: 150, done: 0, maxAngles: {} },
        { name: 'Arm Curl', hint: 'Bend elbows, curl arms up', reps: 5, joints: ['elbow_flexion'], detectKey: 'elbow_flexion', threshold: 120, done: 0, maxAngles: {} },
        { name: 'Hip Hinge', hint: 'Bend forward at hips, keep back straight', reps: 5, joints: ['hip_flexion'], detectKey: 'hip_flexion', threshold: 80, done: 0, maxAngles: {} },
        { name: 'Calf Raise', hint: 'Rise up on toes', reps: 10, joints: ['ankle_dorsiflexion'], detectKey: 'ankle_dorsiflexion', threshold: 30, done: 0, maxAngles: {} },
        { name: 'Sit to Stand', hint: 'Stand up from imaginary chair', reps: 5, joints: ['knee_flexion', 'hip_flexion'], detectKey: 'knee_flexion', threshold: 100, done: 0, maxAngles: {} },
        { name: 'Single Leg Balance', hint: 'Lift one foot, balance 3 sec', reps: 4, joints: ['hip_flexion', 'knee_flexion'], detectKey: 'hip_flexion', threshold: 30, done: 0, maxAngles: {} }
      ];
      
      // MediaPipe landmark indices
      const LANDMARKS = {
        LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12,
        LEFT_ELBOW: 13, RIGHT_ELBOW: 14,
        LEFT_WRIST: 15, RIGHT_WRIST: 16,
        LEFT_HIP: 23, RIGHT_HIP: 24,
        LEFT_KNEE: 25, RIGHT_KNEE: 26,
        LEFT_ANKLE: 27, RIGHT_ANKLE: 28
      };
      
      // ==========================================
      // CAMERA ENUMERATION & SELECTION
      // Supports: Built-in, External USB, Virtual cameras
      // ==========================================
      
      let cameraPermissionGranted = false;
      let debugMode = true; // Enable console logging
      
      function log(msg, data) {
        if (debugMode) {
          console.log('[MSK Camera]', msg, data || '');
        }
      }
      
      // Update status indicator
      function updateStatus(msg, isError = false) {
        const noteEl = document.getElementById('permNote');
        if (noteEl) {
          noteEl.textContent = msg;
          noteEl.style.color = isError ? '#f87171' : '#888';
        }
        log(msg);
      }
      
      async function enumerateCameras() {
        const select = document.getElementById('cameraSelect');
        const errorDiv = document.getElementById('errorMsg');
        const startBtn = document.getElementById('startBtn');
        
        log('Starting camera enumeration...');
        updateStatus('Detecting cameras...');
        
        try {
          // Step 1: Check if mediaDevices API exists
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('MediaDevices API not available. Use HTTPS and modern browser.');
          }
          
          // Step 2: Try to enumerate first (may work without permission in some browsers)
          let devices = await navigator.mediaDevices.enumerateDevices();
          let videoInputs = devices.filter(d => d.kind === 'videoinput');
          log('Initial enumeration found:', videoInputs.length + ' cameras');
          
          // Step 3: If no labels or no cameras, we need permission
          const needsPermission = videoInputs.length === 0 || videoInputs.every(d => !d.label);
          
          if (needsPermission) {
            log('Requesting camera permission...');
            updateStatus('Requesting camera access...');
            
            // Request with flexible constraints - try facingMode first, then any camera
            let tempStream = null;
            
            // Try back camera first (better for medical assessment)
            try {
              tempStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: { ideal: 'environment' } },
                audio: false 
              });
              log('Got stream with environment-facing camera');
            } catch (e1) {
              log('environment camera failed, trying any camera', e1.message);
              // Try any camera
              try {
                tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                log('Got stream with default camera');
              } catch (e2) {
                log('All camera access failed', e2);
                throw e2;
              }
            }
            
            // Stop the temp stream
            if (tempStream) {
              tempStream.getTracks().forEach(t => {
                log('Stopping temp track:', t.label);
                t.stop();
              });
            }
            
            cameraPermissionGranted = true;
            
            // Re-enumerate with permission - now we get labels
            devices = await navigator.mediaDevices.enumerateDevices();
            videoInputs = devices.filter(d => d.kind === 'videoinput');
            log('After permission, found:', videoInputs.length + ' cameras');
          }
          
          availableCameras = videoInputs;
          
          // Step 4: Check if we found any cameras
          if (availableCameras.length === 0) {
            log('No cameras found after enumeration');
            select.innerHTML = '<option value="">No cameras found</option>';
            errorDiv.innerHTML = '<div class="error-msg"><div class="title">No Cameras Detected</div>Connect a camera (built-in, USB, or virtual) and reload the page.<br><br>If using external camera, ensure it\'s properly connected.</div>';
            startBtn.disabled = true;
            updateStatus('No cameras detected', true);
            return;
          }
          
          // Step 5: Populate dropdown with camera names
          log('Populating camera list:', availableCameras.map(c => c.label));
          
          select.innerHTML = availableCameras.map((cam, i) => {
            // Generate meaningful label
            let label = cam.label || '';
            if (!label) {
              label = 'Camera ' + (i + 1);
            }
            // Shorten long labels
            if (label.length > 40) {
              label = label.substring(0, 37) + '...';
            }
            return '<option value="' + cam.deviceId + '">' + label + '</option>';
          }).join('');
          
          // Select first camera by default (or back camera if available)
          const backCamIdx = availableCameras.findIndex(c => 
            c.label && (c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('rear'))
          );
          const defaultIdx = backCamIdx >= 0 ? backCamIdx : 0;
          selectedDeviceId = availableCameras[defaultIdx].deviceId;
          select.value = selectedDeviceId;
          
          // Listen for selection change
          select.addEventListener('change', (e) => {
            selectedDeviceId = e.target.value;
            log('Camera selected:', selectedDeviceId);
          });
          
          // Enable start button
          startBtn.disabled = false;
          startBtn.textContent = 'Start Camera';
          errorDiv.innerHTML = '';
          
          const cameraCount = availableCameras.length;
          updateStatus(cameraCount + ' camera' + (cameraCount > 1 ? 's' : '') + ' ready • Select and start to begin');
          
          log('Camera setup complete');
          
        } catch (err) {
          log('Camera enumeration error:', err);
          
          let errorHtml = '<div class="error-msg"><div class="title">📷 Camera Access Required</div>';
          
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorHtml += 'Camera permission was denied.<br><br>';
            errorHtml += '<strong>How to fix:</strong><br>';
            errorHtml += '1. Click the 🔒 lock icon in your browser address bar<br>';
            errorHtml += '2. Find "Camera" and change to "Allow"<br>';
            errorHtml += '3. Reload this page<br><br>';
            errorHtml += '<strong>On iPhone Safari:</strong> Settings → Safari → Camera → Allow<br>';
            errorHtml += '<strong>On Android:</strong> Tap lock icon → Permissions → Camera → Allow';
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            errorHtml += 'No camera was found on this device.<br><br>';
            errorHtml += '• Ensure your camera is connected and powered on<br>';
            errorHtml += '• For external USB cameras, try unplugging and reconnecting<br>';
            errorHtml += '• Check that other apps can access your camera';
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            errorHtml += 'Camera is in use by another application.<br><br>';
            errorHtml += '• Close Zoom, Skype, Teams, or other video apps<br>';
            errorHtml += '• Close other browser tabs using the camera<br>';
            errorHtml += '• Try restarting your browser';
          } else if (err.name === 'OverconstrainedError') {
            errorHtml += 'Camera does not support required settings.<br>Trying alternative configuration...';
          } else if (err.name === 'SecurityError') {
            errorHtml += 'Security error. This page must be loaded over HTTPS.<br>';
            errorHtml += 'Current: ' + window.location.protocol;
          } else {
            errorHtml += (err.message || 'Unknown error') + '<br><br>';
            errorHtml += 'Error type: ' + (err.name || 'Unknown') + '<br>';
            errorHtml += 'Try refreshing the page or using a different browser.';
          }
          
          errorHtml += '</div>';
          errorDiv.innerHTML = errorHtml;
          
          select.innerHTML = '<option value="">⚠️ Camera access needed</option>';
          startBtn.disabled = true;
          startBtn.textContent = 'Camera Unavailable';
          updateStatus('Camera access required - see instructions above', true);
        }
      }
      
      // Model selection
      window.selectModel = function(model) {
        selectedModel = model;
        document.querySelectorAll('.model-opt').forEach(el => {
          el.classList.toggle('active', el.dataset.model === model);
        });
        // Reset landmarker so it reloads with new model
        poseLandmarker = null;
      };
      
      // ==========================================
      // ANGLE CALCULATIONS
      // ==========================================
      
      function calcAngle(a, b, c) {
        const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
        let angle = Math.abs(radians * 180 / Math.PI);
        if (angle > 180) angle = 360 - angle;
        return Math.round(angle);
      }
      
      function calculateAngles(landmarks) {
        if (!landmarks || landmarks.length < 33) return {};
        
        const angles = {};
        
        // Knee flexion (hip-knee-ankle)
        const kneeL = calcAngle(landmarks[LANDMARKS.LEFT_HIP], landmarks[LANDMARKS.LEFT_KNEE], landmarks[LANDMARKS.LEFT_ANKLE]);
        const kneeR = calcAngle(landmarks[LANDMARKS.RIGHT_HIP], landmarks[LANDMARKS.RIGHT_KNEE], landmarks[LANDMARKS.RIGHT_ANKLE]);
        angles.knee_flexion = Math.round((kneeL + kneeR) / 2);
        
        // Hip flexion (shoulder-hip-knee)
        const hipL = calcAngle(landmarks[LANDMARKS.LEFT_SHOULDER], landmarks[LANDMARKS.LEFT_HIP], landmarks[LANDMARKS.LEFT_KNEE]);
        const hipR = calcAngle(landmarks[LANDMARKS.RIGHT_SHOULDER], landmarks[LANDMARKS.RIGHT_HIP], landmarks[LANDMARKS.RIGHT_KNEE]);
        angles.hip_flexion = Math.round((hipL + hipR) / 2);
        
        // Shoulder flexion (elbow-shoulder-hip)
        const shoulderL = calcAngle(landmarks[LANDMARKS.LEFT_ELBOW], landmarks[LANDMARKS.LEFT_SHOULDER], landmarks[LANDMARKS.LEFT_HIP]);
        const shoulderR = calcAngle(landmarks[LANDMARKS.RIGHT_ELBOW], landmarks[LANDMARKS.RIGHT_SHOULDER], landmarks[LANDMARKS.RIGHT_HIP]);
        angles.shoulder_flexion = Math.round((shoulderL + shoulderR) / 2);
        
        // Elbow flexion (shoulder-elbow-wrist)
        const elbowL = calcAngle(landmarks[LANDMARKS.LEFT_SHOULDER], landmarks[LANDMARKS.LEFT_ELBOW], landmarks[LANDMARKS.LEFT_WRIST]);
        const elbowR = calcAngle(landmarks[LANDMARKS.RIGHT_SHOULDER], landmarks[LANDMARKS.RIGHT_ELBOW], landmarks[LANDMARKS.RIGHT_WRIST]);
        angles.elbow_flexion = Math.round((elbowL + elbowR) / 2);
        
        // Ankle (simplified)
        angles.ankle_dorsiflexion = Math.round(180 - angles.knee_flexion * 0.15);
        
        return angles;
      }
      
      // ==========================================
      // MEDIAPIPE INITIALIZATION
      // ==========================================
      
      async function initPoseLandmarker() {
        const loadingEl = document.getElementById('loadingML');
        loadingEl.style.display = 'block';
        document.getElementById('cameraStart').style.display = 'none';
        
        const modelUrl = MODEL_URLS[selectedModel];
        log('Loading MediaPipe model:', selectedModel);
        log('Model URL:', modelUrl);
        updateStatus('Loading AI model (' + selectedModel + ')...');
        
        // Update loading text
        loadingEl.innerHTML = '<div class="spinner"></div><div class="text">Loading ' + selectedModel.toUpperCase() + ' AI model...<br><small>This may take 5-10 seconds</small></div>';
        
        try {
          log('Initializing FilesetResolver...');
          const vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
          );
          log('FilesetResolver ready');
          
          loadingEl.innerHTML = '<div class="spinner"></div><div class="text">Initializing pose tracker...<br><small>Downloading model weights</small></div>';
          
          // Configure pose landmarker with higher confidence for medical accuracy
          const config = {
            baseOptions: {
              modelAssetPath: modelUrl,
              delegate: 'GPU' // Try GPU first
            },
            runningMode: 'VIDEO',
            numPoses: 1,
            minPoseDetectionConfidence: 0.6, // Slightly higher for medical use
            minPosePresenceConfidence: 0.6,
            minTrackingConfidence: 0.6
          };
          
          try {
            poseLandmarker = await PoseLandmarker.createFromOptions(vision, config);
            log('MediaPipe loaded with GPU delegate');
          } catch (gpuErr) {
            // Fallback to CPU if GPU fails
            log('GPU delegate failed, trying CPU:', gpuErr.message);
            loadingEl.innerHTML = '<div class="spinner"></div><div class="text">GPU unavailable, using CPU...<br><small>May be slower on this device</small></div>';
            
            config.baseOptions.delegate = 'CPU';
            poseLandmarker = await PoseLandmarker.createFromOptions(vision, config);
            log('MediaPipe loaded with CPU delegate');
          }
          
          log('MediaPipe Pose Landmarker ready:', selectedModel);
          loadingEl.style.display = 'none';
          updateStatus('AI tracking active • 33-point body detection');
          return true;
          
        } catch (err) {
          log('MediaPipe load failed:', err);
          
          // Try a lighter model as fallback
          if (selectedModel !== 'lite') {
            log('Attempting fallback to lite model...');
            loadingEl.innerHTML = '<div class="spinner"></div><div class="text">Trying lighter model...<br><small>Heavy model failed</small></div>';
            
            try {
              const vision = await FilesetResolver.forVisionTasks(
                'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
              );
              
              poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                  modelAssetPath: MODEL_URLS.lite,
                  delegate: 'CPU'
                },
                runningMode: 'VIDEO',
                numPoses: 1,
                minPoseDetectionConfidence: 0.5,
                minPosePresenceConfidence: 0.5,
                minTrackingConfidence: 0.5
              });
              
              log('Fallback to lite model successful');
              selectedModel = 'lite';
              document.querySelectorAll('.model-opt').forEach(el => {
                el.classList.toggle('active', el.dataset.model === 'lite');
              });
              
              loadingEl.style.display = 'none';
              updateStatus('AI tracking active (lite mode)');
              return true;
              
            } catch (fallbackErr) {
              log('Fallback also failed:', fallbackErr);
            }
          }
          
          loadingEl.innerHTML = '<div class="text" style="color:#f87171;">❌ AI Model failed to load<br><small>Error: ' + (err.message || 'Unknown') + '</small><br><br><button onclick="location.reload()" style="background:#3b82f6;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;">Reload Page</button></div>';
          document.getElementById('cameraStart').style.display = 'none';
          return false;
        }
      }
      
      // Start camera with selected device
      // Supports: Built-in, External USB, Virtual cameras
      async function startCamera() {
        const video = document.getElementById('videoElement');
        const errorDiv = document.getElementById('errorMsg');
        
        log('Starting camera with device:', selectedDeviceId);
        updateStatus('Connecting to camera...');
        
        // Build constraints based on selected device
        const constraints = {
          video: {
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
            frameRate: { ideal: 30, min: 15 }
          },
          audio: false
        };
        
        // Use exact device ID if selected
        if (selectedDeviceId && selectedDeviceId.length > 0) {
          constraints.video.deviceId = { exact: selectedDeviceId };
          log('Using exact deviceId constraint');
        }
        
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
          attempts++;
          log('Camera start attempt:', attempts);
          
          try {
            // Try with current constraints
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            log('Camera stream obtained:', {
              tracks: stream.getVideoTracks().map(t => ({
                label: t.label,
                enabled: t.enabled,
                readyState: t.readyState
              }))
            });
            break; // Success!
            
          } catch (e) {
            log('Attempt ' + attempts + ' failed:', e.name, e.message);
            
            if (attempts === 1 && selectedDeviceId) {
              // Try without exact deviceId (use ideal instead)
              log('Retrying with ideal deviceId...');
              constraints.video.deviceId = { ideal: selectedDeviceId };
            } else if (attempts === 2) {
              // Try with minimal constraints
              log('Retrying with minimal constraints...');
              delete constraints.video.deviceId;
              delete constraints.video.width;
              delete constraints.video.height;
              delete constraints.video.frameRate;
            } else {
              // All attempts failed
              let errorMsg = 'Could not access camera. ';
              if (e.name === 'NotReadableError') {
                errorMsg += 'Camera may be in use by another app.';
              } else if (e.name === 'NotAllowedError') {
                errorMsg += 'Permission denied.';
              } else {
                errorMsg += e.message || 'Unknown error.';
              }
              errorDiv.innerHTML = '<div class="error-msg"><div class="title">Camera Error</div>' + errorMsg + '</div>';
              throw e;
            }
          }
        }
        
        // Set video source
        video.srcObject = stream;
        
        // Wait for video to be ready
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Video load timeout - camera may not be responding'));
          }, 10000); // 10 second timeout
          
          video.onloadedmetadata = () => {
            log('Video metadata loaded:', {
              width: video.videoWidth,
              height: video.videoHeight
            });
            
            video.play().then(() => {
              clearTimeout(timeout);
              
              const canvas = document.getElementById('canvasElement');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              
              log('Camera started successfully:', video.videoWidth + 'x' + video.videoHeight);
              updateStatus('Camera active • AI tracking loading...');
              resolve();
              
            }).catch(err => {
              clearTimeout(timeout);
              log('Video play failed:', err);
              reject(err);
            });
          };
          
          video.onerror = (e) => {
            clearTimeout(timeout);
            log('Video element error:', e);
            reject(new Error('Video element error'));
          };
        });
      }
      
      // Stop camera
      function stopCamera() {
        if (stream) {
          stream.getTracks().forEach(t => t.stop());
          stream = null;
        }
        webcamRunning = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
      
      // Switch to different camera
      window.switchCamera = async function() {
        if (availableCameras.length < 2) return;
        
        const currentIdx = availableCameras.findIndex(c => c.deviceId === selectedDeviceId);
        const nextIdx = (currentIdx + 1) % availableCameras.length;
        selectedDeviceId = availableCameras[nextIdx].deviceId;
        
        document.getElementById('cameraSelect').value = selectedDeviceId;
        
        if (stream) {
          stopCamera();
          await startCamera();
          webcamRunning = true;
          predictWebcam();
        }
      };
      
      // Main prediction loop
      let lastVideoTime = -1;
      let frameCount = 0;
      let lastFpsTime = performance.now();
      let currentFps = 0;
      let noDetectionCount = 0;
      
      function predictWebcam() {
        if (!webcamRunning || !poseLandmarker) {
          log('Prediction stopped:', !webcamRunning ? 'webcam off' : 'no landmarker');
          return;
        }
        
        const video = document.getElementById('videoElement');
        const canvas = document.getElementById('canvasElement');
        const ctx = canvas.getContext('2d');
        
        // Ensure canvas matches video
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          log('Canvas resized:', canvas.width + 'x' + canvas.height);
        }
        
        const startTimeMs = performance.now();
        
        // Calculate FPS
        frameCount++;
        if (startTimeMs - lastFpsTime >= 1000) {
          currentFps = frameCount;
          frameCount = 0;
          lastFpsTime = startTimeMs;
        }
        
        // Only process if video time changed (new frame)
        if (video.currentTime !== lastVideoTime && video.readyState >= 2) {
          lastVideoTime = video.currentTime;
          
          try {
            const results = poseLandmarker.detectForVideo(video, startTimeMs);
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (results.landmarks && results.landmarks.length > 0) {
              const landmarks = results.landmarks[0];
              noDetectionCount = 0; // Reset no-detection counter
              
              // Calculate average visibility (tracking quality indicator)\n              const avgVisibility = landmarks.reduce((sum, l) => sum + (l.visibility || 0), 0) / landmarks.length;
              
              // Draw skeleton with blue color
              drawBlueSkeleton(ctx, landmarks, canvas.width, canvas.height);
              
              // Calculate angles
              const angles = calculateAngles(landmarks);
              lastAngles = angles;
              
              // Update angles display with FPS and quality
              updateAnglesDisplay(angles, currentFps, avgVisibility);
              
              // Check for rep completion
              checkRepCompletion(angles);
              
              // Track max angles for current exercise
              trackMaxAngles(angles);
              
            } else {
              noDetectionCount++;
              
              // Show \"no person detected\" hint after 30 frames (~1 second)
              if (noDetectionCount > 30) {
                ctx.fillStyle = 'rgba(0,0,0,0.5)';\n                ctx.fillRect(0, canvas.height/2 - 40, canvas.width, 80);\n                ctx.fillStyle = '#f87171';\n                ctx.font = '16px sans-serif';\n                ctx.textAlign = 'center';\n                ctx.fillText('⚠ No person detected', canvas.width/2, canvas.height/2 - 10);\n                ctx.fillStyle = '#888';\n                ctx.font = '12px sans-serif';\n                ctx.fillText('Stand in frame with full body visible', canvas.width/2, canvas.height/2 + 15);\n              }\n            }\n          } catch (e) {\n            log('Detection error:', e.message);\n          }\n        }\n        \n        animationId = requestAnimationFrame(predictWebcam);\n      }
      
      // Draw blue skeleton
      function drawBlueSkeleton(ctx, landmarks, w, h) {
        const connections = PoseLandmarker.POSE_CONNECTIONS;
        
        // Draw connections (blue lines)
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        
        connections.forEach(([start, end]) => {
          const p1 = landmarks[start];
          const p2 = landmarks[end];
          if (p1 && p2 && p1.visibility > 0.5 && p2.visibility > 0.5) {
            ctx.beginPath();
            ctx.moveTo(p1.x * w, p1.y * h);
            ctx.lineTo(p2.x * w, p2.y * h);
            ctx.stroke();
          }
        });
        
        // Draw landmarks (blue dots)
        landmarks.forEach((landmark, i) => {
          if (landmark.visibility > 0.5) {
            ctx.beginPath();
            ctx.arc(landmark.x * w, landmark.y * h, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#3b82f6';
            ctx.fill();
            ctx.strokeStyle = '#93c5fd';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      }
      
      // Update angles display with FPS and tracking quality
      function updateAnglesDisplay(angles, fps = 0, quality = 0) {
        const exercise = exercises[currentTaskIdx];
        if (!exercise) return;
        
        let html = '';
        
        // Add FPS and quality indicator
        const qualityPercent = Math.round(quality * 100);
        const qualityColor = qualityPercent > 70 ? '#22c55e' : (qualityPercent > 40 ? '#f59e0b' : '#ef4444');
        html += '<div class="angle-row" style="border-bottom:1px solid #333;margin-bottom:4px;padding-bottom:4px;">';
        html += '<span style="font-size:9px;">FPS: ' + fps + '</span>';
        html += '<span style="font-size:9px;color:' + qualityColor + '">Quality: ' + qualityPercent + '%</span>';
        html += '</div>';
        
        // Joint angles
        exercise.joints.forEach(joint => {
          const val = angles[joint] || 0;
          const std = ROM_STANDARDS[joint];
          let cls = '';
          if (std) {
            if (val >= std.normal * 0.9) cls = 'good';
            else if (val < std.limited) cls = 'warn';
          }
          html += '<div class="angle-row ' + cls + '"><span>' + (std?.label || joint) + '</span><span class="val">' + val + '°</span></div>';
        });
        
        document.getElementById('anglesList').innerHTML = html;
      }
      
      // Track max angles reached during exercise
      function trackMaxAngles(angles) {
        const exercise = exercises[currentTaskIdx];
        if (!exercise) return;
        
        exercise.joints.forEach(joint => {
          const val = angles[joint] || 0;
          if (!exercise.maxAngles[joint] || val > exercise.maxAngles[joint]) {
            exercise.maxAngles[joint] = val;
          }
        });
      }
      
      // Check for rep completion based on movement
      function checkRepCompletion(angles) {
        const exercise = exercises[currentTaskIdx];
        if (!exercise || exercise.done >= exercise.reps) return;
        
        const key = exercise.detectKey;
        const val = angles[key] || 0;
        const threshold = exercise.threshold;
        
        // Simple state machine for rep detection
        if (repState === 'up' && val >= threshold) {
          repState = 'down';
        } else if (repState === 'down' && val < threshold - 20) {
          repState = 'up';
          currentReps++;
          updateRepDisplay();
          
          // Check if exercise complete
          if (currentReps >= exercise.reps) {
            exercise.done = currentReps;
            renderTaskList();
          }
        }
      }
      
      // Update rep display
      function updateRepDisplay() {
        const exercise = exercises[currentTaskIdx];
        const target = exercise ? exercise.reps : 0;
        
        document.getElementById('repCount').textContent = currentReps;
        document.getElementById('repTarget').textContent = '/ ' + target;
        document.getElementById('repFill').style.width = (target > 0 ? (currentReps / target * 100) : 0) + '%';
      }
      
      // Update exercise display
      function updateExerciseDisplay() {
        const exercise = exercises[currentTaskIdx];
        if (exercise) {
          document.getElementById('exerciseName').textContent = (currentTaskIdx + 1) + '. ' + exercise.name;
          document.getElementById('exerciseHint').textContent = exercise.hint;
        } else {
          document.getElementById('exerciseName').textContent = 'Assessment Complete';
          document.getElementById('exerciseHint').textContent = 'All exercises finished';
        }
      }
      
      // Render task list
      function renderTaskList() {
        let html = '';
        exercises.forEach((ex, i) => {
          let cls = '';
          if (ex.done >= ex.reps) cls = 'done';
          else if (i === currentTaskIdx) cls = 'active';
          
          const repsShow = ex.done >= ex.reps ? ex.done : (i === currentTaskIdx ? currentReps : 0);
          html += '<div class="task-row ' + cls + '">' +
            '<div class="task-num">' + (ex.done >= ex.reps ? '✓' : (i + 1)) + '</div>' +
            '<span>' + ex.name + '</span>' +
            '<span class="reps">' + repsShow + '/' + ex.reps + '</span>' +
          '</div>';
        });
        document.getElementById('taskPanel').innerHTML = html;
      }
      
      // Next exercise
      window.nextExercise = function() {
        const exercise = exercises[currentTaskIdx];
        if (exercise) {
          exercise.done = Math.max(exercise.done, currentReps);
        }
        
        currentTaskIdx++;
        currentReps = 0;
        repState = 'up';
        
        if (currentTaskIdx >= exercises.length) {
          document.getElementById('nextBtn').textContent = 'Done ✓';
          document.getElementById('nextBtn').disabled = true;
        }
        
        updateExerciseDisplay();
        updateRepDisplay();
        renderTaskList();
      };
      
      // Start assessment
      window.startAssessment = async function() {
        const btn = document.getElementById('startBtn');
        btn.textContent = 'Starting...';
        btn.disabled = true;
        
        try {
          // Init MediaPipe if not done
          if (!poseLandmarker) {
            const loaded = await initPoseLandmarker();
            if (!loaded) {
              btn.textContent = 'Model Failed';
              return;
            }
          }
          
          await startCamera();
          
          document.getElementById('cameraStart').style.display = 'none';
          document.getElementById('anglesBox').style.display = 'block';
          document.getElementById('repBox').style.display = 'block';
          document.getElementById('bottomBar').style.display = 'block';
          
          webcamRunning = true;
          currentReps = 0;
          repState = 'up';
          updateExerciseDisplay();
          updateRepDisplay();
          renderTaskList();
          
          predictWebcam();
          
        } catch (err) {
          console.error('Start error:', err);
          btn.textContent = 'Try Again';
          btn.disabled = false;
          document.getElementById('permNote').textContent = 'Camera access required';
        }
      };
      
      // Stop assessment
      window.stopAssessment = function() {
        stopCamera();
        
        document.getElementById('cameraStart').style.display = 'block';
        document.getElementById('anglesBox').style.display = 'none';
        document.getElementById('repBox').style.display = 'none';
        document.getElementById('bottomBar').style.display = 'none';
        
        const ctx = document.getElementById('canvasElement').getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        document.getElementById('startBtn').textContent = 'Resume';
        document.getElementById('startBtn').disabled = false;
      };
      
      // Restart all
      window.restartAll = function() {
        exercises.forEach(ex => { ex.done = 0; ex.maxAngles = {}; });
        currentTaskIdx = 0;
        currentReps = 0;
        repState = 'up';
        
        updateExerciseDisplay();
        updateRepDisplay();
        renderTaskList();
        
        document.getElementById('nextBtn').textContent = 'Next Exercise →';
        document.getElementById('nextBtn').disabled = false;
      };
      
      // Generate note
      window.generateNote = function() {
        const scores = {};
        const jointData = [];
        
        exercises.forEach(ex => {
          if (ex.done > 0) {
            // Score: 3 = complete, 2 = partial, 1 = attempted
            scores[ex.name] = ex.done >= ex.reps ? 3 : (ex.done >= ex.reps / 2 ? 2 : 1);
            jointData.push({
              name: ex.name,
              reps: ex.done,
              target: ex.reps,
              maxAngles: ex.maxAngles
            });
          }
        });
        
        sessionStorage.setItem('fmsScores', JSON.stringify(scores));
        sessionStorage.setItem('jointAnalysis', JSON.stringify(jointData));
        location.href = '/doctor/notes';
      };
      
      // Initialize on load
      document.addEventListener('DOMContentLoaded', async () => {
        log('=== MSK Assessment v5.2 Initializing ===');
        log('Protocol:', window.location.protocol);
        log('User Agent:', navigator.userAgent);
        
        renderTaskList();
        updateExerciseDisplay();
        
        const startBtn = document.getElementById('startBtn');
        const errorDiv = document.getElementById('errorMsg');
        
        // Check HTTPS (required for camera on most browsers)
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          log('WARNING: Not HTTPS');
          // Still allow - some browsers work on http for testing
        }
        
        // Check for mediaDevices API
        if (!navigator.mediaDevices) {
          log('ERROR: navigator.mediaDevices not available');
          startBtn.textContent = 'Camera Not Available';
          startBtn.disabled = true;
          errorDiv.innerHTML = '<div class="error-msg"><div class="title">Browser Not Supported</div>navigator.mediaDevices API not available.<br><br>Possible causes:<br>• Not using HTTPS<br>• Old browser version<br>• Private/incognito mode restrictions<br><br>Try: Chrome, Firefox, Safari, or Edge on HTTPS</div>';
          updateStatus('Browser does not support camera access', true);
          return;
        }
        
        if (!navigator.mediaDevices.getUserMedia) {
          log('ERROR: getUserMedia not available');
          startBtn.textContent = 'Camera Not Available';
          startBtn.disabled = true;
          errorDiv.innerHTML = '<div class="error-msg"><div class="title">Camera API Missing</div>getUserMedia not supported.<br><br>Use a modern browser (Chrome 53+, Firefox 36+, Safari 11+, Edge 12+)</div>';
          updateStatus('getUserMedia not available', true);
          return;
        }
        
        log('MediaDevices API available');
        updateStatus('Initializing camera detection...');
        
        // Enumerate available cameras
        await enumerateCameras();
        
        // Listen for device changes (camera plugged in/out)
        navigator.mediaDevices.addEventListener('devicechange', async () => {
          log('Device change detected - re-enumerating cameras');
          await enumerateCameras();
        });
        
        log('=== Initialization complete ===');
      });
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
