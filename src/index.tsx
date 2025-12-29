import { Hono } from 'hono'
import { cors } from 'hono/cors'

// ============================================================================
// THRIVE ORTHO EHR - Professional MSK Assessment Platform v3.0
// Ultra-Minimal Design | Dashboard RIGHT | Gemini AI Integration
// ============================================================================

type Bindings = {
  GEMINI_API_KEY: string;
  OPENAI_API_KEY: string;
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()
app.use('/api/*', cors())

// ============================================================================
// DATA - FMS + AMA Validated Movements
// ============================================================================

const movements = [
  { id: 1, name: 'Deep Squat', category: 'FMS', joints: ['hip', 'knee', 'ankle'], description: 'Bilateral, symmetrical mobility of hips, knees, and ankles', cpt: '97161', instructions: 'Stand with feet shoulder-width apart, arms overhead. Squat as deep as possible while keeping heels on ground and arms up.' },
  { id: 2, name: 'Hurdle Step', category: 'FMS', joints: ['hip', 'knee'], description: 'Stride mechanics with stance leg stability and stepping leg mobility', cpt: '97161', instructions: 'Stand on one leg, step over hurdle at knee height. Return to start without touching hurdle.' },
  { id: 3, name: 'Inline Lunge', category: 'FMS', joints: ['hip', 'knee', 'ankle'], description: 'Hip mobility/stability, quad flexibility, ankle stability', cpt: '97161', instructions: 'Place feet on line, front foot flat, rear foot on toe. Lower rear knee to touch board behind front heel.' },
  { id: 4, name: 'Shoulder Mobility', category: 'FMS', joints: ['shoulder', 'scapula'], description: 'Bilateral shoulder ROM combining extension and flexion', cpt: '97161', instructions: 'Make fist, one arm reaches overhead behind back, other behind low back. Try to touch fists.' },
  { id: 5, name: 'Active Straight Leg Raise', category: 'FMS', joints: ['hip', 'pelvis'], description: 'Hamstring and gastroc-soleus flexibility with pelvic control', cpt: '97161', instructions: 'Lie flat, raise one leg as high as possible keeping knee straight and opposite leg flat on ground.' },
  { id: 6, name: 'Trunk Stability Push-Up', category: 'FMS', joints: ['spine', 'shoulder'], description: 'Core stabilization in closed kinetic chain movement', cpt: '97161', instructions: 'Lie prone, hands shoulder-width. Push up in one motion, body rising as unit without spine sagging.' },
  { id: 7, name: 'Rotary Stability', category: 'FMS', joints: ['spine', 'hip', 'shoulder'], description: 'Multi-plane pelvis, core and shoulder stability', cpt: '97161', instructions: 'Quadruped position, extend same-side arm and leg. Touch elbow to knee and extend again.' },
  { id: 8, name: 'Cervical ROM', category: 'AMA', joints: ['cervical'], description: 'Flexion, extension, lateral flexion, rotation', cpt: '97162', instructions: 'Assess active range: chin to chest, look up, ear to shoulder both sides, turn head both sides.' },
  { id: 9, name: 'Lumbar ROM', category: 'AMA', joints: ['lumbar'], description: 'Flexion, extension, lateral flexion assessment', cpt: '97162', instructions: 'Assess: touch toes (flexion), bend backward (extension), side bend both directions.' },
  { id: 10, name: 'Gait Analysis', category: 'AMA', joints: ['hip', 'knee', 'ankle'], description: 'Walking pattern, cadence, stride length symmetry', cpt: '97164', instructions: 'Walk naturally for 20 feet. Observe heel strike, push-off, arm swing, trunk rotation.' }
]

const exercises = [
  { id: 'E001', name: 'Hip Flexor Stretch', target: 'hip', difficulty: 'Beginner', sets: 3, reps: '30s hold', frequency: '2x daily', instructions: 'Kneel on affected side, push hips forward, maintain upright posture. Hold 30 seconds.' },
  { id: 'E002', name: 'Piriformis Stretch', target: 'hip', difficulty: 'Beginner', sets: 3, reps: '30s hold', frequency: '2x daily', instructions: 'Cross affected leg over opposite knee, pull knee toward opposite shoulder.' },
  { id: 'E003', name: 'Dead Bug', target: 'core', difficulty: 'Intermediate', sets: 3, reps: '10 each side', frequency: 'daily', instructions: 'Lie supine, extend opposite arm/leg while maintaining neutral spine. Alternate sides.' },
  { id: 'E004', name: 'Bird Dog', target: 'core', difficulty: 'Beginner', sets: 3, reps: '10 each side', frequency: 'daily', instructions: 'Quadruped position, extend opposite arm/leg, maintain level pelvis. Hold 3 seconds.' },
  { id: 'E005', name: 'Cat-Cow Stretch', target: 'spine', difficulty: 'Beginner', sets: 1, reps: '10 cycles', frequency: '2x daily', instructions: 'Quadruped, alternate flexion (cat) and extension (cow) through full spine.' },
  { id: 'E006', name: 'Cervical Retraction', target: 'cervical', difficulty: 'Beginner', sets: 3, reps: '10', frequency: '3x daily', instructions: 'Tuck chin straight back (double chin), hold 5 seconds, return to neutral.' },
  { id: 'E007', name: 'Shoulder ER/IR', target: 'shoulder', difficulty: 'Intermediate', sets: 3, reps: '15', frequency: 'daily', instructions: 'Elbow at 90°, rotate forearm outward/inward against resistance band.' },
  { id: 'E008', name: 'Clamshells', target: 'hip', difficulty: 'Beginner', sets: 3, reps: '15', frequency: 'daily', instructions: 'Sidelying, knees bent at 45°, lift top knee while keeping feet together.' },
  { id: 'E009', name: 'Ankle Alphabet', target: 'ankle', difficulty: 'Beginner', sets: 1, reps: 'A-Z', frequency: '2x daily', instructions: 'Seated with leg extended, draw each letter of alphabet with big toe.' },
  { id: 'E010', name: 'McKenzie Extension', target: 'lumbar', difficulty: 'Beginner', sets: 10, reps: '1', frequency: 'every 2 hours', instructions: 'Prone, press up through arms keeping hips on surface. Hold 2 seconds at top.' },
  { id: 'E011', name: 'Glute Bridge', target: 'hip', difficulty: 'Beginner', sets: 3, reps: '15', frequency: 'daily', instructions: 'Supine, knees bent, squeeze glutes and lift hips. Hold 2 seconds at top.' },
  { id: 'E012', name: 'Side Plank', target: 'core', difficulty: 'Intermediate', sets: 3, reps: '30s hold', frequency: 'daily', instructions: 'Sidelying on elbow, lift hips creating straight line. Hold position.' }
]

const demoUsers = {
  patient: { id: 'P001', name: 'Sarah Johnson', email: 'sarah.j@email.com', avatar: 'SJ', age: 39, gender: 'Female', role: 'patient' },
  doctor: { id: 'D001', name: 'Dr. Michael Torres', email: 'dr.torres@thriveortho.com', avatar: 'MT', credentials: 'MD, Sports Medicine', role: 'doctor' },
  coach: { id: 'C001', name: 'Jessica Martinez', email: 'jessica.m@thriveortho.com', avatar: 'JM', credentials: 'DPT, CSCS, FMS', role: 'coach' },
  admin: { id: 'A001', name: 'Robert Chen', email: 'admin@thriveortho.com', avatar: 'RC', role: 'admin' }
}

const painKeywords = {
  red: ['numbness', 'tingling', 'weakness', 'bowel', 'bladder', 'night pain', 'fever', 'weight loss', 'cancer', 'trauma', 'fall', 'accident', 'bilateral', 'progressive'],
  yellow: ['stress', 'anxiety', 'depression', 'fear', 'catastrophizing', 'work', 'compensation', 'litigation', 'hopeless', 'frustrated'],
  severity: ['severe', 'excruciating', 'unbearable', 'worst', 'intense', 'sharp', 'shooting', 'burning', 'stabbing', 'constant']
}

// ICD-10 and CPT code mappings
const dxCodes = {
  'M54.5': 'Low back pain',
  'M54.16': 'Radiculopathy, lumbar region',
  'M54.2': 'Cervicalgia',
  'M25.561': 'Pain in right knee',
  'M25.562': 'Pain in left knee',
  'M75.101': 'Adhesive capsulitis of right shoulder',
  'M79.3': 'Panniculitis, unspecified',
  'M62.838': 'Muscle spasm, other',
  'M99.03': 'Segmental dysfunction, lumbar'
}

const cptCodes = {
  '97161': 'PT Evaluation - Low Complexity',
  '97162': 'PT Evaluation - Moderate Complexity',
  '97163': 'PT Evaluation - High Complexity',
  '97110': 'Therapeutic Exercise',
  '97140': 'Manual Therapy',
  '97530': 'Therapeutic Activities',
  '97542': 'Wheelchair Management'
}

// ============================================================================
// ULTRA-MINIMAL DESIGN SYSTEM
// ============================================================================

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  /* Monochrome base */
  --gray-50: #fafafa;
  --gray-100: #f4f4f5;
  --gray-200: #e4e4e7;
  --gray-300: #d4d4d8;
  --gray-400: #a1a1aa;
  --gray-500: #71717a;
  --gray-600: #52525b;
  --gray-700: #3f3f46;
  --gray-800: #27272a;
  --gray-900: #18181b;
  
  /* Single accent - medical teal */
  --accent: #0d9488;
  --accent-dark: #0f766e;
  --accent-light: #ccfbf1;
  
  /* Semantic - muted */
  --error: #dc2626;
  --error-light: #fef2f2;
  --warning: #d97706;
  --warning-light: #fffbeb;
  --success: #059669;
  --success-light: #ecfdf5;
  
  /* Layout */
  --sidebar-w: 180px;
  --panel-w: 280px;
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

.layout--no-panel {
  grid-template-columns: var(--sidebar-w) 1fr;
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

.logo-text {
  font-weight: 700;
  font-size: 13px;
  color: var(--gray-900);
}

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

/* Right Panel */
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
  padding: 12px;
}

.panel-card + .panel-card { margin-top: 6px; }

/* Score Display */
.score-display {
  text-align: center;
  padding: 16px;
  background: var(--gray-50);
  border-radius: var(--radius);
}

.score-value {
  font-size: 48px;
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

.card-title {
  font-weight: 600;
  font-size: 12px;
  color: var(--gray-900);
}

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

/* Forms */
.form-group { margin-bottom: 12px; }
.form-label { display: block; font-size: 10px; font-weight: 600; color: var(--gray-600); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.3px; }

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

/* Movement Grid */
.movement-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.movement-card {
  padding: 10px 8px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
  background: white;
  text-align: center;
}

.movement-card:hover { border-color: var(--gray-400); }
.movement-card.active { border-color: var(--accent); background: var(--accent-light); }
.movement-card.scored { border-color: var(--success); }

.movement-num {
  width: 20px;
  height: 20px;
  background: var(--gray-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: var(--gray-600);
  margin: 0 auto 6px;
}

.movement-card.scored .movement-num { background: var(--success); color: white; }
.movement-name { font-weight: 600; font-size: 10px; color: var(--gray-900); margin-bottom: 2px; }
.movement-category { font-size: 9px; color: var(--gray-500); }
.movement-score { font-weight: 700; font-size: 14px; color: var(--gray-400); margin-top: 4px; }
.movement-card.scored .movement-score { color: var(--success); }

/* Score Buttons */
.score-btns { display: flex; gap: 6px; justify-content: center; }

.score-btn {
  width: 40px;
  height: 40px;
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

/* Video */
.video-box {
  background: var(--gray-900);
  border-radius: var(--radius-lg);
  aspect-ratio: 16/9;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-placeholder { text-align: center; color: var(--gray-600); }
.video-placeholder i { font-size: 32px; margin-bottom: 8px; }
.video-placeholder p { font-size: 11px; }

.video-overlay {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-controls { display: flex; gap: 6px; }

.video-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.15s;
}

.video-btn-light { background: rgba(255,255,255,0.2); color: white; }
.video-btn-light:hover { background: rgba(255,255,255,0.3); }
.video-btn-accent { background: var(--accent); color: white; }
.video-btn-danger { background: var(--error); color: white; }

.joint-overlay {
  background: rgba(0,0,0,0.75);
  color: white;
  padding: 8px 10px;
  border-radius: var(--radius);
  font-size: 10px;
  display: none;
}

.joint-overlay.visible { display: block; }
.joint-overlay div { margin-bottom: 2px; }
.joint-overlay strong { color: var(--accent-light); }

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
.flag i { margin-top: 1px; flex-shrink: 0; }
.flag-red i { color: var(--error); }
.flag-yellow i { color: var(--warning); }

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
  background: var(--gray-100);
}

.login-box {
  width: 100%;
  max-width: 360px;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 28px;
}

.login-header { text-align: center; margin-bottom: 20px; }

.login-logo {
  width: 36px;
  height: 36px;
  background: var(--accent);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 12px;
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

.role-btn:hover { border-color: var(--gray-400); }
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
      { id: 'notes', icon: 'fa-file-medical', label: 'Medical Notes', href: '/doctor/notes' },
      { id: 'video', icon: 'fa-video', label: 'Telemedicine', href: '/doctor/video' },
      { id: 'tasks', icon: 'fa-list-check', label: 'Tasks', href: '/doctor/tasks' },
    ],
    coach: [
      { id: 'dashboard', icon: 'fa-grid-2', label: 'Dashboard', href: '/coach' },
      { id: 'clients', icon: 'fa-users', label: 'Clients', href: '/coach/clients' },
      { id: 'assessment', icon: 'fa-person-running', label: 'Assessment', href: '/coach/assessment' },
      { id: 'programs', icon: 'fa-dumbbell', label: 'Programs', href: '/coach/programs' },
      { id: 'tasks', icon: 'fa-list-check', label: 'Tasks', href: '/coach/tasks' },
    ],
    patient: [
      { id: 'dashboard', icon: 'fa-grid-2', label: 'My Dashboard', href: '/patient' },
      { id: 'exercises', icon: 'fa-dumbbell', label: 'Exercises', href: '/patient/exercises' },
      { id: 'appointments', icon: 'fa-calendar', label: 'Appointments', href: '/patient/appointments' },
      { id: 'video', icon: 'fa-video', label: 'Video Visit', href: '/patient/video' },
      { id: 'progress', icon: 'fa-chart-line', label: 'Progress', href: '/patient/progress' },
    ],
    admin: [
      { id: 'dashboard', icon: 'fa-grid-2', label: 'Overview', href: '/admin' },
      { id: 'users', icon: 'fa-users-gear', label: 'Users', href: '/admin/users' },
      { id: 'analytics', icon: 'fa-chart-line', label: 'Analytics', href: '/admin/analytics' },
      { id: 'settings', icon: 'fa-gear', label: 'Settings', href: '/admin/settings' },
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

// Right Panel
const rightPanel = (data: any = {}) => `
  <aside class="panel">
    <div class="panel-section">
      <div class="panel-label">FMS Score</div>
      <div class="score-display">
        <div class="score-value" id="fmsScore">${data.fmsScore ?? '--'}</div>
        <div class="score-label">of 21 points</div>
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
        <div class="text-sm text-muted" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--gray-200);">
          <strong>CC:</strong> LBP w/ radiculopathy<br>
          <strong>Duration:</strong> 6 weeks
        </div>
      </div>
    </div>
    
    <div class="panel-section">
      <div class="panel-label">AI Flags</div>
      <div id="flagsContainer">
        <div class="panel-card text-center text-sm text-muted" style="padding: 14px;">
          <i class="fas fa-shield-halved" style="font-size: 16px; margin-bottom: 4px; display: block;"></i>
          Complete voice intake to detect clinical flags
        </div>
      </div>
    </div>
    
    <div class="panel-section">
      <div class="panel-label">Quick Actions</div>
      <a href="/doctor/intake" class="btn btn-secondary" style="width: 100%; margin-bottom: 6px;">
        <i class="fas fa-microphone"></i> Voice Intake
      </a>
      <a href="/doctor/assessment" class="btn btn-secondary" style="width: 100%; margin-bottom: 6px;">
        <i class="fas fa-person-running"></i> Assessment
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
    services: { gemini: true, openai: true, d1: true }
  })
})

// Gemini AI - Real-time Joint Tracking Analysis
app.post('/api/ai/analyze-joints', async (c) => {
  const { imageBase64, movement } = await c.req.json()
  const geminiKey = c.env?.GEMINI_API_KEY || ''
  
  if (!geminiKey || geminiKey === 'YOUR_GEMINI_API_KEY') {
    // Mock data for demo
    return c.json({
      success: true,
      mock: true,
      analysis: {
        joints: {
          hip_flexion: '92°',
          knee_flexion: '108°',
          ankle_dorsiflexion: '14°',
          trunk_lean: '18°',
          shoulder_angle: '145°'
        },
        score: 2,
        compensations: [
          'Forward trunk lean (>15°)',
          'Heel rise at depth',
          'Knee valgus observed bilaterally'
        ],
        recommendations: [
          'Address ankle dorsiflexion deficit',
          'Hip flexor stretching protocol',
          'Core stability exercises'
        ],
        confidence: 0.87
      }
    })
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: `You are a medical AI specialized in musculoskeletal biomechanics analysis. Analyze this ${movement} movement image and provide clinical assessment.

Return ONLY valid JSON:
{
  "joints": {
    "hip_flexion": "XX°",
    "knee_flexion": "XX°", 
    "ankle_dorsiflexion": "XX°",
    "trunk_lean": "XX°",
    "shoulder_angle": "XX°"
  },
  "score": 0-3,
  "compensations": ["list of observed compensatory movements"],
  "recommendations": ["clinical recommendations"],
  "confidence": 0.0-1.0
}

Scoring: 0=pain during movement, 1=unable to perform, 2=performed with compensation, 3=perfect form` },
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
    
    return c.json({ success: false, error: 'Failed to parse Gemini response' })
  } catch (error: any) {
    return c.json({ success: false, error: error.message })
  }
})

// Voice Analysis with Pain Flag Detection
app.post('/api/ai/analyze-voice', async (c) => {
  const { transcript } = await c.req.json()
  const text = transcript.toLowerCase()
  const geminiKey = c.env?.GEMINI_API_KEY || ''
  
  // Basic keyword detection
  const flags = {
    red: [] as string[],
    yellow: [] as string[],
    severity: [] as string[]
  }
  
  painKeywords.red.forEach(kw => { if (text.includes(kw)) flags.red.push(kw) })
  painKeywords.yellow.forEach(kw => { if (text.includes(kw)) flags.yellow.push(kw) })
  painKeywords.severity.forEach(kw => { if (text.includes(kw)) flags.severity.push(kw) })
  
  // Gemini deep analysis
  let aiAnalysis = null
  
  if (geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY') {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a medical assistant analyzing patient statements for MSK triage. Analyze voice cues and content.

Patient Statement: "${transcript}"

Return ONLY valid JSON:
{
  "redFlags": ["serious concerns requiring immediate attention"],
  "yellowFlags": ["psychosocial factors"],
  "voiceCues": ["detected voice patterns: hesitation, pain sounds, breathing patterns"],
  "potentialDx": [{"code": "ICD-10", "name": "diagnosis"}],
  "painLevel": 1-10,
  "urgency": "routine|urgent|emergent",
  "recommendations": ["clinical recommendations"]
}`
            }]
          }],
          generationConfig: { temperature: 0.3 }
        })
      })
      
      const data = await response.json()
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = data.candidates[0].content.parts[0].text
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) aiAnalysis = JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      console.error('Gemini voice analysis error:', e)
    }
  }
  
  return c.json({ flags, aiAnalysis })
})

// Generate Comprehensive Medical Note with DX/CPT
app.post('/api/ai/generate-note', async (c) => {
  const { patient, intake, fmsScores, aiFlags, exercises: rxExercises } = await c.req.json()
  
  // Calculate FMS total (movements 1-7)
  let fmsTotal = 0
  for (let i = 1; i <= 7; i++) {
    if (fmsScores?.[i] !== undefined) fmsTotal += fmsScores[i]
  }
  const riskLevel = fmsTotal <= 11 ? 'HIGH' : fmsTotal <= 14 ? 'MODERATE' : 'LOW'
  
  // Select exercises based on scores
  const selectedExercises = rxExercises || exercises.slice(0, 5)
  
  const note = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                   COMPREHENSIVE MUSCULOSKELETAL EVALUATION                    ║
║                              THRIVE ORTHO EHR                                 ║
╚══════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════════════════
ADMINISTRATIVE DATA
═══════════════════════════════════════════════════════════════════════════════
DATE:     ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
PROVIDER: Dr. Michael Torres, MD | Sports Medicine
NPI:      1234567890 | License: CA-MD-123456
FACILITY: Thrive Ortho Clinic

═══════════════════════════════════════════════════════════════════════════════
PATIENT DEMOGRAPHICS
═══════════════════════════════════════════════════════════════════════════════
NAME:      ${patient?.name || 'Sarah Johnson'}
DOB:       03/15/1985 | AGE: 39 | SEX: Female
MRN:       P-2025-001234
INSURANCE: Blue Cross PPO | ID: XYZ123456789

═══════════════════════════════════════════════════════════════════════════════
CHIEF COMPLAINT
═══════════════════════════════════════════════════════════════════════════════
${intake?.chiefComplaint || 'Lower back pain with right leg radiating symptoms × 6 weeks'}

═══════════════════════════════════════════════════════════════════════════════
HISTORY OF PRESENT ILLNESS
═══════════════════════════════════════════════════════════════════════════════
${intake?.hpi || `39 y/o female presents with insidious onset lower back pain progressively 
worsening over 6 weeks. Pain described as dull, aching with intermittent sharp 
episodes rated 6/10 at worst. Radiates to right posterior thigh stopping at 
knee level (L4-L5 dermatomal pattern).

AGGRAVATING: Prolonged sitting (>30 min), forward bending, lifting
ALLEVIATING: Walking, lying supine, ice application
SLEEP: Disrupted 1-2x/night with repositioning
RED FLAGS: NEGATIVE for B/B dysfunction, saddle anesthesia, progressive weakness`}

═══════════════════════════════════════════════════════════════════════════════
AI VOICE ANALYSIS FLAGS
═══════════════════════════════════════════════════════════════════════════════
RED FLAGS:    ${aiFlags?.red?.length > 0 ? aiFlags.red.map((f: string) => f.toUpperCase()).join(', ') : 'None identified'}
YELLOW FLAGS: ${aiFlags?.yellow?.length > 0 ? aiFlags.yellow.join(', ') : 'None identified'}
SEVERITY:     ${aiFlags?.severity?.length > 0 ? aiFlags.severity.join(', ') : 'Moderate (6/10)'}
VOICE CUES:   ${aiFlags?.voiceCues?.length > 0 ? aiFlags.voiceCues.join(', ') : 'Normal speech pattern'}

═══════════════════════════════════════════════════════════════════════════════
FUNCTIONAL MOVEMENT SCREEN (FMS) - 10 MOVEMENT ASSESSMENT
═══════════════════════════════════════════════════════════════════════════════
TOTAL FMS SCORE: ${fmsTotal}/21 | RISK STRATIFICATION: ▶ ${riskLevel} RISK ◀

┌────────────────────────────────────┬───────┬────────────┬─────────────────────┐
│ Movement                           │ Score │ Category   │ CPT Code            │
├────────────────────────────────────┼───────┼────────────┼─────────────────────┤
│ 1. Deep Squat                      │   ${fmsScores?.[1] ?? '-'}   │ FMS        │ 97161               │
│ 2. Hurdle Step (L/R)               │   ${fmsScores?.[2] ?? '-'}   │ FMS        │ 97161               │
│ 3. Inline Lunge (L/R)              │   ${fmsScores?.[3] ?? '-'}   │ FMS        │ 97161               │
│ 4. Shoulder Mobility (L/R)         │   ${fmsScores?.[4] ?? '-'}   │ FMS        │ 97161               │
│ 5. Active Straight Leg Raise (L/R) │   ${fmsScores?.[5] ?? '-'}   │ FMS        │ 97161               │
│ 6. Trunk Stability Push-Up         │   ${fmsScores?.[6] ?? '-'}   │ FMS        │ 97161               │
│ 7. Rotary Stability (L/R)          │   ${fmsScores?.[7] ?? '-'}   │ FMS        │ 97161               │
│ 8. Cervical ROM                    │   ${fmsScores?.[8] ?? '-'}   │ AMA        │ 97162               │
│ 9. Lumbar ROM                      │   ${fmsScores?.[9] ?? '-'}   │ AMA        │ 97162               │
│ 10. Gait Analysis                  │   ${fmsScores?.[10] ?? '-'}   │ AMA        │ 97164               │
└────────────────────────────────────┴───────┴────────────┴─────────────────────┘

Clearing Tests: Impingement ⊝ | Extension ⊝ | Flexion ⊝

═══════════════════════════════════════════════════════════════════════════════
AI JOINT TRACKING ANALYSIS (Gemini Vision)
═══════════════════════════════════════════════════════════════════════════════
DEEP SQUAT ANALYSIS:
  • Hip Flexion:          92° (Limited - Normal >120°)
  • Knee Flexion:         108° (Adequate)
  • Ankle Dorsiflexion:   14° (Limited - Normal >20°)
  • Trunk Lean:           18° (Compensatory pattern)
  • Compensations:        Forward trunk lean, bilateral heel rise
  • AI Confidence:        87%
  
ACTIVE STRAIGHT LEG RAISE:
  • Right:                65° (Limited - asymmetry present)
  • Left:                 82° (Normal)
  • Asymmetry:            >15° difference → unilateral dysfunction
  • Clinical Indication:  R hamstring tightness, possible SI dysfunction

GAIT ANALYSIS:
  • Cadence:              108 steps/min (Normal range)
  • Stride Length:        Shortened on right (antalgic pattern)
  • Arm Swing:            Decreased bilaterally
  • Trendelenburg:        Negative
  • Pattern:              Right antalgic gait, guarded lumbar movement

═══════════════════════════════════════════════════════════════════════════════
ASSESSMENT & DIAGNOSIS (ICD-10)
═══════════════════════════════════════════════════════════════════════════════
PRIMARY DIAGNOSIS:
  1. M54.5   Low back pain

SECONDARY DIAGNOSES:
  2. M54.16  Radiculopathy, lumbar region
  3. M62.838 Muscle spasm, other site
  4. M99.03  Segmental dysfunction, lumbar region
  5. M79.3   Panniculitis, unspecified

CLINICAL IMPRESSION:
Lumbar radiculopathy with associated movement dysfunction. FMS score of 
${fmsTotal}/21 indicates ${riskLevel} injury risk. Primary deficits in hip mobility 
and core stability. Asymmetrical ASLR suggests unilateral flexibility deficit.
No red flags. Appropriate for conservative PT management.

═══════════════════════════════════════════════════════════════════════════════
CPT CODES - BILLING
═══════════════════════════════════════════════════════════════════════════════
┌─────────┬───────────────────────────────────────────┬────────┬─────────────┐
│ Code    │ Description                               │ Units  │ Time        │
├─────────┼───────────────────────────────────────────┼────────┼─────────────┤
│ 97163   │ PT Evaluation - High Complexity           │ 1      │ 45 min      │
│ 97110   │ Therapeutic Exercise                      │ 2      │ 30 min      │
│ 97140   │ Manual Therapy Techniques                 │ 2      │ 30 min      │
│ 97530   │ Therapeutic Activities                    │ 1      │ 15 min      │
└─────────┴───────────────────────────────────────────┴────────┴─────────────┘
TOTAL BILLABLE TIME: 60 minutes

═══════════════════════════════════════════════════════════════════════════════
PLAN OF CARE
═══════════════════════════════════════════════════════════════════════════════
TREATMENT FREQUENCY: 2x/week × 6 weeks (12 visits)

SHORT-TERM GOALS (2 weeks):
  □ Reduce pain from 6/10 → 4/10
  □ Improve ASLR symmetry to <10° difference
  □ Independent with HEP
  □ Sitting tolerance increased to 45 min

LONG-TERM GOALS (6 weeks):
  □ Pain ≤2/10 at rest and activity
  □ FMS score ≥14 (low risk)
  □ Return to full work without restrictions
  □ Independent maintenance program

═══════════════════════════════════════════════════════════════════════════════
HOME EXERCISE PROGRAM
═══════════════════════════════════════════════════════════════════════════════
${selectedExercises.map((e: any, i: number) => `
${i + 1}. ${e.name.toUpperCase()}
   Target: ${e.target} | Difficulty: ${e.difficulty}
   Dosage: ${e.sets} sets × ${e.reps} | Frequency: ${e.frequency}
   Instructions: ${e.instructions}
`).join('')}

PRECAUTIONS:
  ⚠ Avoid prolonged sitting >30 min without standing
  ⚠ No heavy lifting >20 lbs during acute phase
  ⚠ Stop if sharp pain or radiating symptoms increase
  ⚠ No high-impact activities until cleared

═══════════════════════════════════════════════════════════════════════════════
FOLLOW-UP
═══════════════════════════════════════════════════════════════════════════════
Next Appointment:   ${new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString()}
Re-evaluation:      ${new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString()}
Emergency Contact:  Return immediately if red flags develop

═══════════════════════════════════════════════════════════════════════════════
PROVIDER SIGNATURE
═══════════════════════════════════════════════════════════════════════════════

_________________________________    Date: ${new Date().toLocaleDateString()}
Dr. Michael Torres, MD
Sports Medicine | Board Certified
NPI: 1234567890

╔══════════════════════════════════════════════════════════════════════════════╗
║                    GENERATED BY THRIVE ORTHO EHR v3.0                        ║
║           AI-Assisted Documentation | Gemini Vision | HIPAA Compliant        ║
╚══════════════════════════════════════════════════════════════════════════════╝
`.trim()

  return c.json({ note })
})

// Tasks API
app.get('/api/tasks', (c) => {
  const tasks = [
    { id: 1, title: 'Complete Sarah Johnson voice intake', priority: 'high', status: 'pending', due: 'Today', patient: 'Sarah Johnson' },
    { id: 2, title: 'Perform FMS assessment', priority: 'high', status: 'pending', due: 'Today', patient: 'Sarah Johnson' },
    { id: 3, title: 'Generate comprehensive medical note', priority: 'high', status: 'pending', due: 'Today', patient: 'Sarah Johnson' },
    { id: 4, title: 'Review James Williams X-ray results', priority: 'medium', status: 'completed', due: 'Yesterday', patient: 'James Williams' },
    { id: 5, title: 'Telemedicine follow-up: Emily Davis', priority: 'medium', status: 'pending', due: 'Tomorrow', patient: 'Emily Davis' },
    { id: 6, title: 'Update exercise program for Mark T.', priority: 'low', status: 'pending', due: 'This week', patient: 'Mark Thompson' },
  ]
  return c.json({ tasks })
})

// Exercises API
app.get('/api/exercises', (c) => c.json({ exercises }))

// Movements API
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
          <div class="login-subtitle">MSK Assessment Platform v3.0</div>
        </div>
        
        <div style="font-size: 11px; font-weight: 600; color: var(--gray-600); margin-bottom: 6px;">
          Select Role to Continue
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
          FMS + AMA Validated • Gemini AI • HIPAA
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
            <a href="/doctor/video" class="btn btn-secondary"><i class="fas fa-video"></i> Telemedicine</a>
            <a href="/doctor/assessment" class="btn btn-primary"><i class="fas fa-plus"></i> New Assessment</a>
          </div>
        </div>
        
        <div class="stats-row">
          <div class="stat-box">
            <div class="stat-value">8</div>
            <div class="stat-label">Today's Patients</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">3</div>
            <div class="stat-label">Pending Assessments</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">5</div>
            <div class="stat-label">Notes to Complete</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">2</div>
            <div class="stat-label">Video Calls</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title">Today's Patients</span>
            <button class="btn btn-sm btn-secondary">View All</button>
          </div>
          <table class="table">
            <thead>
              <tr><th>Patient</th><th>Chief Complaint</th><th>FMS</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="flex items-center gap-1">
                    <div class="avatar">SJ</div>
                    <div><strong>Sarah Johnson</strong><div class="text-muted text-sm">39 y/o F</div></div>
                  </div>
                </td>
                <td>LBP w/ R leg radiculopathy</td>
                <td><span style="font-weight: 700; color: var(--warning);">12</span>/21</td>
                <td><span class="badge badge-warning">In Progress</span></td>
                <td class="text-right">
                  <a href="/doctor/assessment" class="btn btn-sm btn-ghost"><i class="fas fa-clipboard-check"></i></a>
                  <a href="/doctor/notes" class="btn btn-sm btn-ghost"><i class="fas fa-file-medical"></i></a>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="flex items-center gap-1">
                    <div class="avatar">JW</div>
                    <div><strong>James Williams</strong><div class="text-muted text-sm">52 y/o M</div></div>
                  </div>
                </td>
                <td>R shoulder impingement</td>
                <td><span style="font-weight: 700; color: var(--error);">9</span>/21</td>
                <td><span class="badge badge-danger">High Risk</span></td>
                <td class="text-right">
                  <button class="btn btn-sm btn-ghost"><i class="fas fa-clipboard-check"></i></button>
                  <button class="btn btn-sm btn-ghost"><i class="fas fa-file-medical"></i></button>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="flex items-center gap-1">
                    <div class="avatar">ED</div>
                    <div><strong>Emily Davis</strong><div class="text-muted text-sm">28 y/o F</div></div>
                  </div>
                </td>
                <td>Bilateral knee pain - running</td>
                <td><span style="font-weight: 700; color: var(--success);">16</span>/21</td>
                <td><span class="badge badge-success">Low Risk</span></td>
                <td class="text-right">
                  <button class="btn btn-sm btn-ghost"><i class="fas fa-clipboard-check"></i></button>
                  <button class="btn btn-sm btn-ghost"><i class="fas fa-file-medical"></i></button>
                </td>
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
            <ul class="task-list" id="taskList">
              <li class="task-item">
                <div class="task-priority high"></div>
                <div class="task-check" onclick="toggleTask(this)"><i class="fas fa-check"></i></div>
                <div class="task-content">
                  <div class="task-title">Complete Sarah Johnson intake</div>
                  <div class="task-meta">Due: Today</div>
                </div>
              </li>
              <li class="task-item">
                <div class="task-priority high"></div>
                <div class="task-check" onclick="toggleTask(this)"><i class="fas fa-check"></i></div>
                <div class="task-content">
                  <div class="task-title">Perform FMS assessment</div>
                  <div class="task-meta">Due: Today</div>
                </div>
              </li>
              <li class="task-item completed">
                <div class="task-priority medium"></div>
                <div class="task-check done" onclick="toggleTask(this)"><i class="fas fa-check"></i></div>
                <div class="task-content">
                  <div class="task-title">Review James W. X-rays</div>
                  <div class="task-meta">Completed</div>
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

// Voice Intake
app.get('/doctor/intake', (c) => {
  return c.html(html(`
    <div class="demo-bar">
      <span>Voice Medical Intake — AI Pain Flag Detection</span>
      <a href="/login">Switch Role</a>
    </div>
    <div class="layout">
      ${sidebar('doctor', 'intake')}
      
      <main class="main">
        <div class="header">
          <div>
            <h1 class="title">Voice Medical Intake</h1>
            <p class="subtitle">AI-powered voice analysis with pain flag detection</p>
          </div>
          <a href="/doctor" class="btn btn-secondary"><i class="fas fa-arrow-left"></i> Back</a>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fas fa-microphone text-accent" style="margin-right: 6px;"></i>Voice Recording</span>
          </div>
          <div class="card-body">
            <div class="voice-area">
              <button class="voice-btn" id="voiceBtn" onclick="toggleRecording()">
                <i class="fas fa-microphone" id="voiceIcon"></i>
              </button>
              <div class="voice-status" id="voiceStatus">Click to start recording</div>
            </div>
            
            <div style="margin-top: 20px;">
              <div class="form-label">Current Question</div>
              <div style="background: var(--gray-50); padding: 12px; border-radius: var(--radius); font-size: 12px;">
                "What brings you in today? Please describe your main concern, when it started, and how it affects your daily activities."
              </div>
            </div>
            
            <div style="margin-top: 14px;">
              <div class="form-label">Transcript</div>
              <div id="transcript" style="background: var(--gray-50); padding: 12px; border-radius: var(--radius); min-height: 80px; font-size: 12px; color: var(--gray-500);">
                Transcript will appear here as you speak...
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex gap-1 mt-2">
          <button class="btn btn-secondary btn-lg" style="flex: 1;"><i class="fas fa-arrow-left"></i> Previous</button>
          <button class="btn btn-primary btn-lg" style="flex: 1;" onclick="analyzeVoice()">Analyze & Continue <i class="fas fa-arrow-right"></i></button>
        </div>
      </main>
      
      ${rightPanel({ fmsScore: null })}
    </div>
    
    <script>
      let isRecording = false;
      let recognition;
      let transcript = '';
      
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (e) => {
          transcript = '';
          for (let i = 0; i < e.results.length; i++) {
            transcript += e.results[i][0].transcript;
          }
          document.getElementById('transcript').textContent = transcript || 'Listening...';
          document.getElementById('transcript').style.color = 'var(--gray-900)';
        };
      }
      
      function toggleRecording() {
        if (isRecording) {
          isRecording = false;
          document.getElementById('voiceBtn').classList.remove('recording');
          document.getElementById('voiceIcon').className = 'fas fa-microphone';
          document.getElementById('voiceStatus').textContent = 'Click to start recording';
          if (recognition) recognition.stop();
        } else {
          isRecording = true;
          document.getElementById('voiceBtn').classList.add('recording');
          document.getElementById('voiceIcon').className = 'fas fa-stop';
          document.getElementById('voiceStatus').textContent = 'Recording... Click to stop';
          if (recognition) recognition.start();
        }
      }
      
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
            html += '<div class="flag flag-red"><i class="fas fa-exclamation-triangle"></i><div><strong>Red Flags:</strong> ' + data.flags.red.join(', ') + '</div></div>';
          }
          if (data.flags.yellow.length > 0) {
            html += '<div class="flag flag-yellow"><i class="fas fa-exclamation-circle"></i><div><strong>Yellow Flags:</strong> ' + data.flags.yellow.join(', ') + '</div></div>';
          }
          if (data.aiAnalysis?.potentialDx) {
            html += '<div class="panel-card"><div class="text-sm"><strong>Potential Dx:</strong><br>' + 
              (Array.isArray(data.aiAnalysis.potentialDx) 
                ? data.aiAnalysis.potentialDx.map(d => typeof d === 'object' ? d.code + ' ' + d.name : d).join('<br>') 
                : data.aiAnalysis.potentialDx) + '</div></div>';
          }
          
          if (!html) {
            html = '<div class="panel-card text-center text-sm" style="color: var(--success);"><i class="fas fa-check-circle"></i> No significant flags detected</div>';
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

// MSK Assessment
app.get('/doctor/assessment', (c) => {
  return c.html(html(`
    <div class="demo-bar">
      <span>MSK Assessment — Gemini AI Real-Time Joint Tracking</span>
      <a href="/login">Switch Role</a>
    </div>
    <div class="layout">
      ${sidebar('doctor', 'assessment')}
      
      <main class="main">
        <div class="header">
          <div>
            <h1 class="title">MSK Movement Assessment</h1>
            <p class="subtitle">FMS 7-Movement + AMA ROM • Gemini AI Analysis</p>
          </div>
          <div class="flex gap-1">
            <a href="/doctor" class="btn btn-secondary"><i class="fas fa-arrow-left"></i> Back</a>
            <button class="btn btn-primary" onclick="generateNote()"><i class="fas fa-file-medical"></i> Generate Note</button>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body-sm">
            <div class="video-box" id="videoContainer">
              <div class="video-placeholder">
                <i class="fas fa-camera"></i>
                <p>Camera Feed — Click Start</p>
              </div>
              <video id="videoElement" autoplay playsinline style="display: none; width: 100%; height: 100%; object-fit: cover;"></video>
              <div class="video-overlay">
                <div class="video-controls">
                  <button class="video-btn video-btn-light" onclick="toggleCamera()">
                    <i class="fas fa-camera" id="cameraIcon"></i>
                  </button>
                  <button class="video-btn video-btn-accent" onclick="captureAndAnalyze()" title="AI Analysis">
                    <i class="fas fa-brain"></i>
                  </button>
                </div>
                <div class="joint-overlay" id="jointData">
                  <div><strong>Hip:</strong> <span id="hipAngle">--</span></div>
                  <div><strong>Knee:</strong> <span id="kneeAngle">--</span></div>
                  <div><strong>Ankle:</strong> <span id="ankleAngle">--</span></div>
                  <div><strong>Trunk:</strong> <span id="trunkAngle">--</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title">10-Movement Protocol</span>
            <span class="text-muted text-sm">FMS + AMA Validated</span>
          </div>
          <div class="card-body">
            <div class="movement-grid" id="movementGrid">
              ${movements.map((m, i) => `
                <div class="movement-card" data-id="${m.id}" onclick="selectMovement(${m.id})">
                  <div class="movement-num">${i + 1}</div>
                  <div class="movement-name">${m.name}</div>
                  <div class="movement-category">${m.category}</div>
                  <div class="movement-score" id="score-${m.id}">--</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </main>
      
      <aside class="panel">
        <div class="panel-section">
          <div class="panel-label">FMS Score</div>
          <div class="score-display">
            <div class="score-value" id="totalScore">0</div>
            <div class="score-label">of 21 points</div>
          </div>
          <div class="mt-1 text-center">
            <span class="badge badge-neutral" id="riskBadge">Not Scored</span>
          </div>
        </div>
        
        <div class="panel-section">
          <div class="panel-label">Current Movement</div>
          <div class="panel-card">
            <div style="font-weight: 600; font-size: 12px;" id="currentMovement">Select a movement</div>
            <div class="text-muted text-sm mt-1" id="currentDescription">--</div>
          </div>
          
          <div class="mt-2">
            <div class="form-label">Score (0-3)</div>
            <div class="score-btns">
              <button class="score-btn" onclick="scoreMovement(0)">0</button>
              <button class="score-btn" onclick="scoreMovement(1)">1</button>
              <button class="score-btn" onclick="scoreMovement(2)">2</button>
              <button class="score-btn" onclick="scoreMovement(3)">3</button>
            </div>
            <div class="text-muted text-center text-sm mt-1">
              0=Pain | 1=Unable | 2=Comp | 3=Perfect
            </div>
          </div>
        </div>
        
        <div class="panel-section">
          <div class="panel-label">AI Analysis</div>
          <div class="panel-card" id="aiAnalysis">
            <div class="text-center text-muted text-sm" style="padding: 8px;">
              <i class="fas fa-brain" style="font-size: 18px; margin-bottom: 4px; display: block;"></i>
              Capture image to analyze
            </div>
          </div>
        </div>
        
        <button class="btn btn-primary" style="width: 100%;" onclick="generateNote()">
          <i class="fas fa-file-medical"></i> Generate Medical Note
        </button>
      </aside>
    </div>
    
    <script>
      const movements = ${JSON.stringify(movements)};
      let currentMovementId = null;
      let scores = {};
      let stream = null;
      
      function selectMovement(id) {
        currentMovementId = id;
        const m = movements.find(x => x.id === id);
        
        document.querySelectorAll('.movement-card').forEach(c => c.classList.remove('active'));
        document.querySelector('[data-id="' + id + '"]').classList.add('active');
        
        document.getElementById('currentMovement').textContent = m.name;
        document.getElementById('currentDescription').textContent = m.description;
        
        document.querySelectorAll('.score-btn').forEach(b => b.classList.remove('selected'));
        if (scores[id] !== undefined) {
          document.querySelectorAll('.score-btn')[scores[id]].classList.add('selected');
        }
      }
      
      function scoreMovement(score) {
        if (!currentMovementId) return;
        
        scores[currentMovementId] = score;
        document.getElementById('score-' + currentMovementId).textContent = score;
        document.querySelector('[data-id="' + currentMovementId + '"]').classList.add('scored');
        
        document.querySelectorAll('.score-btn').forEach((b, i) => {
          b.classList.toggle('selected', i === score);
        });
        
        // Calculate FMS total (movements 1-7)
        let total = 0;
        for (let i = 1; i <= 7; i++) {
          if (scores[i] !== undefined) total += scores[i];
        }
        document.getElementById('totalScore').textContent = total;
        
        const badge = document.getElementById('riskBadge');
        if (total <= 11) {
          badge.className = 'badge badge-danger';
          badge.textContent = 'HIGH RISK';
        } else if (total <= 14) {
          badge.className = 'badge badge-warning';
          badge.textContent = 'MODERATE';
        } else {
          badge.className = 'badge badge-success';
          badge.textContent = 'LOW RISK';
        }
        
        // Auto-advance
        const idx = movements.findIndex(m => m.id === currentMovementId);
        if (idx < movements.length - 1) {
          setTimeout(() => selectMovement(movements[idx + 1].id), 300);
        }
      }
      
      async function toggleCamera() {
        const video = document.getElementById('videoElement');
        const placeholder = document.querySelector('.video-placeholder');
        
        if (stream) {
          stream.getTracks().forEach(t => t.stop());
          stream = null;
          video.style.display = 'none';
          placeholder.style.display = 'flex';
          document.getElementById('cameraIcon').className = 'fas fa-camera';
          document.getElementById('jointData').classList.remove('visible');
        } else {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ 
              video: { width: 1280, height: 720, facingMode: 'user' } 
            });
            video.srcObject = stream;
            video.style.display = 'block';
            placeholder.style.display = 'none';
            document.getElementById('cameraIcon').className = 'fas fa-camera-slash';
            document.getElementById('jointData').classList.add('visible');
          } catch (err) {
            alert('Camera access denied: ' + err.message);
          }
        }
      }
      
      async function captureAndAnalyze() {
        if (!stream || !currentMovementId) {
          alert('Start camera and select a movement first');
          return;
        }
        
        const video = document.getElementById('videoElement');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        
        const m = movements.find(x => x.id === currentMovementId);
        document.getElementById('aiAnalysis').innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Analyzing...</div>';
        
        try {
          const response = await fetch('/api/ai/analyze-joints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64, movement: m.name })
          });
          
          const data = await response.json();
          const analysis = data.analysis;
          
          if (analysis?.joints) {
            document.getElementById('hipAngle').textContent = analysis.joints.hip_flexion || '--';
            document.getElementById('kneeAngle').textContent = analysis.joints.knee_flexion || '--';
            document.getElementById('ankleAngle').textContent = analysis.joints.ankle_dorsiflexion || '--';
            document.getElementById('trunkAngle').textContent = analysis.joints.trunk_lean || '--';
          }
          
          let analysisHtml = '<div class="text-sm">';
          analysisHtml += '<div class="mb-1"><strong>Score:</strong> ' + (analysis?.score ?? '--') + '/3';
          if (analysis?.confidence) {
            analysisHtml += ' <span class="text-muted">(' + Math.round(analysis.confidence * 100) + '%)</span>';
          }
          analysisHtml += '</div>';
          
          if (analysis?.compensations?.length > 0) {
            analysisHtml += '<div class="mb-1"><strong>Compensations:</strong></div>';
            analysisHtml += '<ul style="margin: 0; padding-left: 14px; color: var(--gray-600);">';
            analysis.compensations.forEach(c => {
              analysisHtml += '<li style="font-size: 10px;">' + c + '</li>';
            });
            analysisHtml += '</ul>';
          }
          analysisHtml += '</div>';
          
          document.getElementById('aiAnalysis').innerHTML = analysisHtml;
          
          if (analysis?.score !== undefined) {
            scoreMovement(analysis.score);
          }
        } catch (err) {
          document.getElementById('aiAnalysis').innerHTML = '<div class="text-center text-danger text-sm">Analysis failed</div>';
        }
      }
      
      function generateNote() {
        sessionStorage.setItem('fmsScores', JSON.stringify(scores));
        location.href = '/doctor/notes';
      }
      
      selectMovement(1);
    </script>
  `, 'MSK Assessment - Thrive Ortho EHR'))
})

// Medical Notes
app.get('/doctor/notes', (c) => {
  return c.html(html(`
    <div class="demo-bar">
      <span>Medical Note Generator — DX + CPT Codes + Exercises</span>
      <a href="/login">Switch Role</a>
    </div>
    <div class="layout">
      ${sidebar('doctor', 'notes')}
      
      <main class="main">
        <div class="header">
          <div>
            <h1 class="title">Medical Note Generator</h1>
            <p class="subtitle">Comprehensive documentation with ICD-10, CPT codes & exercises</p>
          </div>
          <div class="flex gap-1">
            <button class="btn btn-secondary" onclick="window.print()"><i class="fas fa-print"></i> Print</button>
            <button class="btn btn-primary"><i class="fas fa-save"></i> Save to EHR</button>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fas fa-file-medical text-accent" style="margin-right: 6px;"></i>Generated Note</span>
            <button class="btn btn-sm btn-secondary" onclick="regenerateNote()"><i class="fas fa-sync"></i> Regenerate</button>
          </div>
          <div class="card-body">
            <div class="medical-note" id="medicalNote">Loading...</div>
          </div>
        </div>
      </main>
      
      <aside class="panel">
        <div class="panel-section">
          <div class="panel-label">Note Summary</div>
          <div class="panel-card">
            <div class="text-sm">
              <strong>Patient:</strong> Sarah Johnson<br>
              <strong>FMS Score:</strong> <span id="summaryScore">--</span>/21<br>
              <strong>Risk Level:</strong> <span id="summaryRisk">--</span>
            </div>
          </div>
        </div>
        
        <div class="panel-section">
          <div class="panel-label">ICD-10 Codes</div>
          <div class="panel-card text-sm font-mono">
            <div>M54.5 - Low back pain</div>
            <div>M54.16 - Lumbar radiculopathy</div>
            <div>M62.838 - Muscle spasm</div>
            <div>M99.03 - Segmental dysfunction</div>
          </div>
        </div>
        
        <div class="panel-section">
          <div class="panel-label">CPT Codes</div>
          <div class="panel-card text-sm font-mono">
            <div><strong>97163</strong> - PT Eval High</div>
            <div><strong>97110</strong> ×2 - Ther Exercise</div>
            <div><strong>97140</strong> ×2 - Manual Therapy</div>
            <div><strong>97530</strong> - Ther Activities</div>
          </div>
        </div>
        
        <div class="panel-section">
          <div class="panel-label">HEP Exercises</div>
          <div class="panel-card text-sm">
            <ol style="margin: 0; padding-left: 14px;">
              <li>Hip Flexor Stretch</li>
              <li>Piriformis Stretch</li>
              <li>Dead Bug</li>
              <li>Bird Dog</li>
              <li>McKenzie Extension</li>
            </ol>
          </div>
        </div>
      </aside>
    </div>
    
    <script>
      async function loadNote() {
        const scores = JSON.parse(sessionStorage.getItem('fmsScores') || '{}');
        const flags = JSON.parse(sessionStorage.getItem('intakeFlags') || '{}');
        
        try {
          const response = await fetch('/api/ai/generate-note', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              patient: { name: 'Sarah Johnson' },
              intake: { chiefComplaint: 'Lower back pain with right leg radiating symptoms × 6 weeks' },
              fmsScores: scores,
              aiFlags: flags
            })
          });
          
          const data = await response.json();
          document.getElementById('medicalNote').textContent = data.note;
          
          let total = 0;
          for (let i = 1; i <= 7; i++) {
            if (scores[i] !== undefined) total += scores[i];
          }
          document.getElementById('summaryScore').textContent = total || '12';
          document.getElementById('summaryRisk').textContent = total <= 11 ? 'HIGH' : total <= 14 ? 'MODERATE' : 'LOW';
        } catch (err) {
          document.getElementById('medicalNote').textContent = 'Failed to generate note.';
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

// Telemedicine
app.get('/doctor/video', (c) => {
  return c.html(html(`
    <div class="demo-bar">
      <span>Telemedicine — HIPAA Compliant Video</span>
      <a href="/login">Switch Role</a>
    </div>
    <div class="layout">
      ${sidebar('doctor', 'video')}
      
      <main class="main">
        <div class="header">
          <div>
            <h1 class="title">Telemedicine</h1>
            <p class="subtitle">Secure video consultation with AI-assisted assessment</p>
          </div>
          <button class="btn btn-danger" id="endCallBtn" style="display: none;"><i class="fas fa-phone-slash"></i> End</button>
        </div>
        
        <div class="tele-grid mb-2">
          <div class="tele-video" id="remoteVideo">
            <div class="video-placeholder">
              <i class="fas fa-user" style="font-size: 40px;"></i>
              <p>Patient Video</p>
            </div>
            <div class="tele-label">Sarah Johnson</div>
          </div>
          <div class="tele-video" id="localVideo">
            <div class="video-placeholder">
              <i class="fas fa-user-md" style="font-size: 40px;"></i>
              <p>Your Video</p>
            </div>
            <video id="localVideoEl" autoplay muted playsinline style="display: none; width: 100%; height: 100%; object-fit: cover;"></video>
            <div class="tele-label">Dr. Torres</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body text-center">
            <div class="flex gap-2 justify-between" style="max-width: 280px; margin: 0 auto;">
              <button class="btn btn-secondary btn-icon" onclick="toggleMic()"><i class="fas fa-microphone" id="micIcon"></i></button>
              <button class="btn btn-secondary btn-icon" onclick="toggleCam()"><i class="fas fa-video" id="camIcon"></i></button>
              <button class="btn btn-primary btn-lg" onclick="startCall()" id="startBtn"><i class="fas fa-phone"></i> Start</button>
              <button class="btn btn-secondary btn-icon" onclick="location.href='/doctor/assessment'"><i class="fas fa-clipboard-check"></i></button>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header"><span class="card-title">Session Tools</span></div>
          <div class="card-body">
            <div class="flex gap-1">
              <a href="/doctor/intake" class="btn btn-secondary"><i class="fas fa-microphone"></i> Voice Intake</a>
              <a href="/doctor/assessment" class="btn btn-secondary"><i class="fas fa-person-running"></i> Assessment</a>
              <button class="btn btn-secondary"><i class="fas fa-desktop"></i> Screen Share</button>
              <a href="/doctor/notes" class="btn btn-secondary"><i class="fas fa-file-medical"></i> Generate Note</a>
            </div>
          </div>
        </div>
      </main>
      
      <aside class="panel">
        <div class="panel-section">
          <div class="panel-label">Patient</div>
          <div class="panel-card">
            <div class="flex items-center gap-1">
              <div class="avatar avatar-lg">SJ</div>
              <div>
                <div class="user-name">Sarah Johnson</div>
                <div class="user-meta">39 y/o Female</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="panel-section">
          <div class="panel-label">Session Info</div>
          <div class="panel-card text-sm">
            <div><strong>Type:</strong> Follow-up</div>
            <div><strong>Duration:</strong> <span id="duration">00:00</span></div>
            <div><strong>Status:</strong> <span class="badge badge-neutral" id="callStatus">Ready</span></div>
          </div>
        </div>
        
        <div class="panel-section">
          <div class="panel-label">Chief Complaint</div>
          <div class="panel-card text-sm">
            Lower back pain with right leg radiating symptoms × 6 weeks.
          </div>
        </div>
        
        <div class="panel-section">
          <div class="panel-label">Session Notes</div>
          <textarea class="form-input form-textarea" placeholder="Add notes..."></textarea>
        </div>
      </aside>
    </div>
    
    <script>
      let localStream = null;
      let callStartTime = null;
      
      async function toggleCam() {
        const video = document.getElementById('localVideoEl');
        const placeholder = document.querySelector('#localVideo .video-placeholder');
        
        if (localStream) {
          localStream.getTracks().forEach(t => t.stop());
          localStream = null;
          video.style.display = 'none';
          placeholder.style.display = 'flex';
          document.getElementById('camIcon').className = 'fas fa-video';
        } else {
          try {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            video.srcObject = localStream;
            video.style.display = 'block';
            placeholder.style.display = 'none';
            document.getElementById('camIcon').className = 'fas fa-video-slash';
          } catch (err) {
            alert('Camera access denied');
          }
        }
      }
      
      function toggleMic() {
        if (localStream) {
          const audio = localStream.getAudioTracks()[0];
          if (audio) {
            audio.enabled = !audio.enabled;
            document.getElementById('micIcon').className = audio.enabled ? 'fas fa-microphone' : 'fas fa-microphone-slash';
          }
        }
      }
      
      function startCall() {
        document.getElementById('callStatus').textContent = 'Connected';
        document.getElementById('callStatus').className = 'badge badge-success';
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('endCallBtn').style.display = 'inline-flex';
        
        callStartTime = Date.now();
        setInterval(() => {
          const elapsed = Math.floor((Date.now() - callStartTime) / 1000);
          const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
          const secs = (elapsed % 60).toString().padStart(2, '0');
          document.getElementById('duration').textContent = mins + ':' + secs;
        }, 1000);
        
        if (!localStream) toggleCam();
      }
    </script>
  `, 'Telemedicine - Thrive Ortho EHR'))
})

// Tasks
app.get('/doctor/tasks', (c) => {
  return c.html(html(`
    <div class="demo-bar">
      <span>Tasks — Clinical Workflow</span>
      <a href="/login">Switch Role</a>
    </div>
    <div class="layout">
      ${sidebar('doctor', 'tasks')}
      
      <main class="main">
        <div class="header">
          <div>
            <h1 class="title">Tasks</h1>
            <p class="subtitle">Manage your clinical workflow</p>
          </div>
          <button class="btn btn-primary"><i class="fas fa-plus"></i> Add Task</button>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title">Today's Tasks</span>
            <div class="flex gap-1">
              <button class="btn btn-sm btn-secondary">All</button>
              <button class="btn btn-sm btn-ghost">Pending</button>
              <button class="btn btn-sm btn-ghost">Completed</button>
            </div>
          </div>
          <div class="card-body">
            <ul class="task-list" id="taskList">
              <li class="task-item">
                <div class="task-priority high"></div>
                <div class="task-check" onclick="toggleTask(this)"><i class="fas fa-check"></i></div>
                <div class="task-content">
                  <div class="task-title">Complete Sarah Johnson voice intake</div>
                  <div class="task-meta">Due: Today • Sarah Johnson</div>
                </div>
              </li>
              <li class="task-item">
                <div class="task-priority high"></div>
                <div class="task-check" onclick="toggleTask(this)"><i class="fas fa-check"></i></div>
                <div class="task-content">
                  <div class="task-title">Perform FMS assessment</div>
                  <div class="task-meta">Due: Today • Sarah Johnson</div>
                </div>
              </li>
              <li class="task-item">
                <div class="task-priority high"></div>
                <div class="task-check" onclick="toggleTask(this)"><i class="fas fa-check"></i></div>
                <div class="task-content">
                  <div class="task-title">Generate comprehensive medical note</div>
                  <div class="task-meta">Due: Today • Sarah Johnson</div>
                </div>
              </li>
              <li class="task-item completed">
                <div class="task-priority medium"></div>
                <div class="task-check done" onclick="toggleTask(this)"><i class="fas fa-check"></i></div>
                <div class="task-content">
                  <div class="task-title">Review James Williams X-ray results</div>
                  <div class="task-meta">Completed</div>
                </div>
              </li>
              <li class="task-item">
                <div class="task-priority medium"></div>
                <div class="task-check" onclick="toggleTask(this)"><i class="fas fa-check"></i></div>
                <div class="task-content">
                  <div class="task-title">Telemedicine follow-up: Emily Davis</div>
                  <div class="task-meta">Due: Tomorrow</div>
                </div>
              </li>
              <li class="task-item">
                <div class="task-priority low"></div>
                <div class="task-check" onclick="toggleTask(this)"><i class="fas fa-check"></i></div>
                <div class="task-content">
                  <div class="task-title">Update exercise program for Mark Thompson</div>
                  <div class="task-meta">Due: This week</div>
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
  `, 'Tasks - Thrive Ortho EHR'))
})

// Patient Dashboard
app.get('/patient', (c) => {
  return c.html(html(`
    <div class="demo-bar">
      <span>Patient Portal — Sarah Johnson</span>
      <a href="/login">Switch Role</a>
    </div>
    <div class="layout">
      ${sidebar('patient', 'dashboard')}
      
      <main class="main">
        <div class="header">
          <div>
            <h1 class="title">Welcome, Sarah</h1>
            <p class="subtitle">Your treatment progress overview</p>
          </div>
        </div>
        
        <div class="stats-row">
          <div class="stat-box">
            <div class="stat-value">6</div>
            <div class="stat-label">Visits Completed</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">72%</div>
            <div class="stat-label">HEP Adherence</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">4/10</div>
            <div class="stat-label">Pain Level</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">12</div>
            <div class="stat-label">FMS Score</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title">Today's Exercises</span>
            <span class="badge badge-accent">3 of 5 completed</span>
          </div>
          <div class="card-body">
            <ul class="task-list">
              ${exercises.slice(0, 5).map((e, i) => `
                <li class="task-item ${i < 3 ? 'completed' : ''}">
                  <div class="task-check ${i < 3 ? 'done' : ''}" onclick="toggleTask(this)"><i class="fas fa-check"></i></div>
                  <div class="task-content">
                    <div class="task-title">${e.name}</div>
                    <div class="task-meta">${e.sets} sets × ${e.reps} • ${e.frequency}</div>
                  </div>
                  <button class="btn btn-sm ${i < 3 ? 'btn-ghost' : 'btn-primary'}">${i < 3 ? 'Done' : 'Start'}</button>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title">Upcoming Appointments</span>
          </div>
          <table class="table">
            <thead>
              <tr><th>Date</th><th>Time</th><th>Type</th><th>Provider</th><th></th></tr>
            </thead>
            <tbody>
              <tr>
                <td>${new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString()}</td>
                <td>10:00 AM</td>
                <td>Follow-up</td>
                <td>Dr. Torres</td>
                <td><a href="/patient/video" class="btn btn-sm btn-secondary"><i class="fas fa-video"></i> Join</a></td>
              </tr>
              <tr>
                <td>${new Date(Date.now() + 10*24*60*60*1000).toLocaleDateString()}</td>
                <td>2:30 PM</td>
                <td>Re-evaluation</td>
                <td>Dr. Torres</td>
                <td><button class="btn btn-sm btn-ghost">Reschedule</button></td>
              </tr>
            </tbody>
          </table>
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
  `, 'Patient Portal - Thrive Ortho EHR'))
})

// Coach Dashboard
app.get('/coach', (c) => {
  return c.html(html(`
    <div class="demo-bar">
      <span>Coach Dashboard — Jessica Martinez</span>
      <a href="/login">Switch Role</a>
    </div>
    <div class="layout">
      ${sidebar('coach', 'dashboard')}
      
      <main class="main">
        <div class="header">
          <div>
            <h1 class="title">Coach Dashboard</h1>
            <p class="subtitle">Client management and program oversight</p>
          </div>
          <a href="/coach/assessment" class="btn btn-primary"><i class="fas fa-plus"></i> New Assessment</a>
        </div>
        
        <div class="stats-row">
          <div class="stat-box">
            <div class="stat-value">12</div>
            <div class="stat-label">Active Clients</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">4</div>
            <div class="stat-label">Sessions Today</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">89%</div>
            <div class="stat-label">Avg. Compliance</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">14.2</div>
            <div class="stat-label">Avg. FMS Score</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title">My Clients</span>
            <button class="btn btn-sm btn-secondary">View All</button>
          </div>
          <table class="table">
            <thead>
              <tr><th>Client</th><th>Program</th><th>FMS</th><th>Compliance</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><div class="flex items-center gap-1"><div class="avatar">SJ</div><strong>Sarah Johnson</strong></div></td>
                <td>Corrective Exercise</td>
                <td>12/21</td>
                <td>85%</td>
                <td><span class="badge badge-success">On Track</span></td>
              </tr>
              <tr>
                <td><div class="flex items-center gap-1"><div class="avatar">JW</div><strong>James Williams</strong></div></td>
                <td>Shoulder Rehab</td>
                <td>9/21</td>
                <td>62%</td>
                <td><span class="badge badge-warning">Needs Attention</span></td>
              </tr>
              <tr>
                <td><div class="flex items-center gap-1"><div class="avatar">ED</div><strong>Emily Davis</strong></div></td>
                <td>Running Performance</td>
                <td>16/21</td>
                <td>95%</td>
                <td><span class="badge badge-success">Excellent</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      
      ${rightPanel({ fmsScore: null })}
    </div>
  `, 'Coach Dashboard - Thrive Ortho EHR'))
})

// Admin Dashboard
app.get('/admin', (c) => {
  return c.html(html(`
    <div class="demo-bar">
      <span>Admin Dashboard — Robert Chen</span>
      <a href="/login">Switch Role</a>
    </div>
    <div class="layout">
      ${sidebar('admin', 'dashboard')}
      
      <main class="main">
        <div class="header">
          <div>
            <h1 class="title">System Overview</h1>
            <p class="subtitle">Platform analytics and management</p>
          </div>
        </div>
        
        <div class="stats-row">
          <div class="stat-box">
            <div class="stat-value">8</div>
            <div class="stat-label">Providers</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">248</div>
            <div class="stat-label">Patients</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">1,247</div>
            <div class="stat-label">Assessments</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">99.9%</div>
            <div class="stat-label">Uptime</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title">System Users</span>
            <button class="btn btn-sm btn-secondary">Add User</button>
          </div>
          <table class="table">
            <thead>
              <tr><th>User</th><th>Role</th><th>Status</th><th>Last Active</th></tr>
            </thead>
            <tbody>
              ${Object.values(demoUsers).map(u => `
                <tr>
                  <td>
                    <div class="flex items-center gap-1">
                      <div class="avatar">${u.avatar}</div>
                      <div><strong>${u.name}</strong><div class="text-muted text-sm">${u.email}</div></div>
                    </div>
                  </td>
                  <td style="text-transform: capitalize;">${u.role}</td>
                  <td><span class="badge badge-success">Active</span></td>
                  <td class="text-muted text-sm">Just now</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title">AI Service Status</span>
          </div>
          <table class="table">
            <thead>
              <tr><th>Service</th><th>Status</th><th>Requests (24h)</th><th>Avg. Response</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Gemini Vision</strong></td>
                <td><span class="badge badge-success">Online</span></td>
                <td>342</td>
                <td>1.2s</td>
              </tr>
              <tr>
                <td><strong>Voice Analysis</strong></td>
                <td><span class="badge badge-success">Online</span></td>
                <td>128</td>
                <td>0.8s</td>
              </tr>
              <tr>
                <td><strong>Note Generator</strong></td>
                <td><span class="badge badge-success">Online</span></td>
                <td>89</td>
                <td>2.1s</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      
      ${rightPanel({ fmsScore: null })}
    </div>
  `, 'Admin Dashboard - Thrive Ortho EHR'))
})

// Catch-all routes
app.get('/', (c) => c.redirect('/login'))
app.get('/doctor/patients', (c) => c.redirect('/doctor'))
app.get('/coach/*', (c) => c.redirect('/coach'))
app.get('/patient/*', (c) => c.redirect('/patient'))
app.get('/admin/*', (c) => c.redirect('/admin'))

export default app
