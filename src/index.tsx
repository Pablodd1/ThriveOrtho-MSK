import { Hono } from 'hono'
import { cors } from 'hono/cors'

// ============================================================================
// THRIVE ORTHO EHR - AI-Powered MSK Assessment & Electronic Health Records
// FMS + AMA Validated Movement Assessment Platform
// Voice-Powered Intake | Visual AI Analysis | Comprehensive Medical Notes
// ============================================================================

type Bindings = {
  DB: D1Database;
  OPENAI_API_KEY: string;
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

// ============================================================================
// DATA: USER ROLES & DEMO ACCOUNTS
// ============================================================================

const demoUsers = {
  patient: {
    id: 'patient-001',
    name: 'Sarah Johnson',
    email: 'sarah@patient.demo',
    role: 'patient',
    avatar: 'SJ',
    dob: '1985-03-15',
    phone: '(555) 123-4567',
    insurance: 'Blue Cross PPO',
    conditions: ['Lower back pain', 'Right shoulder impingement']
  },
  doctor: {
    id: 'doctor-001',
    name: 'Dr. Michael Torres',
    email: 'dr.torres@thriveortho.ai',
    role: 'doctor',
    avatar: 'MT',
    title: 'MD, Sports Medicine',
    specialty: 'Orthopedic Medicine',
    npi: '1234567890',
    license: 'CA-MD-123456'
  },
  coach: {
    id: 'coach-001',
    name: 'Jessica Martinez',
    email: 'jessica@thriveortho.ai',
    role: 'coach',
    avatar: 'JM',
    title: 'DPT, CSCS',
    specialty: 'Movement Specialist',
    certifications: ['FMS Certified', 'SFMA', 'DNS']
  },
  admin: {
    id: 'admin-001',
    name: 'Robert Chen',
    email: 'admin@thriveortho.ai',
    role: 'admin',
    avatar: 'RC',
    title: 'System Administrator',
    accessLevel: 'Full Access'
  }
}

// ============================================================================
// DATA: FMS 7-MOVEMENT SCREEN (Functional Movement Systems)
// ============================================================================

const fmsMovements = [
  {
    id: 'fms-1',
    name: 'Deep Squat',
    description: 'Assesses bilateral, symmetrical mobility of hips, knees, and ankles',
    purpose: 'Tests torso & lower extremity mechanics, core stability',
    instructions: [
      'Stand with feet shoulder-width apart, toes forward',
      'Hold dowel overhead with arms extended',
      'Descend as deep as possible while keeping heels on floor',
      'Keep dowel aligned over feet, torso parallel with shins'
    ],
    scoring: {
      3: 'Upper torso parallel with tibia, femur below horizontal, knees aligned over feet',
      2: 'Upper torso parallel with tibia OR femur below horizontal, heels elevated',
      1: 'Unable to complete movement with heels elevated',
      0: 'Pain during any portion of movement'
    },
    compensations: ['Heels rise', 'Knees cave in', 'Forward lean', 'Arms fall forward'],
    targetAreas: ['Hip mobility', 'Ankle dorsiflexion', 'Thoracic extension', 'Core stability'],
    videoUrl: '/videos/fms-deep-squat.mp4',
    duration: 60
  },
  {
    id: 'fms-2',
    name: 'Hurdle Step',
    description: 'Assesses bilateral mobility and stability of hips, knees, and ankles',
    purpose: 'Tests stride mechanics & hip stability in single-leg stance',
    instructions: [
      'Stand with feet together, toes touching hurdle',
      'Hold dowel across shoulders behind neck',
      'Step over hurdle, touch heel to floor',
      'Return to starting position without touching hurdle'
    ],
    scoring: {
      3: 'Hips, knees, ankles remain aligned, minimal movement in lumbar spine',
      2: 'Alignment lost between hips, knees, ankles OR movement in lumbar spine',
      1: 'Contact with hurdle OR loss of balance',
      0: 'Pain during any portion of movement'
    },
    compensations: ['Hip hiking', 'Trunk lean', 'Loss of balance', 'Toe touching first'],
    targetAreas: ['Hip flexion', 'Hip extension', 'Single-leg stability', 'Core control'],
    videoUrl: '/videos/fms-hurdle-step.mp4',
    duration: 90
  },
  {
    id: 'fms-3',
    name: 'Inline Lunge',
    description: 'Assesses hip, knee, ankle, and foot mobility/stability in split stance',
    purpose: 'Tests deceleration & directional change mechanics',
    instructions: [
      'Place dowel behind back touching head, thoracic spine, sacrum',
      'Step onto board with rear foot, front foot at measured distance',
      'Lower rear knee to touch board behind front heel',
      'Return to standing without losing balance'
    ],
    scoring: {
      3: 'Dowel contacts maintained, no torso movement, knee touches board',
      2: 'Dowel contacts maintained, some torso movement OR knee does not touch',
      1: 'Loss of balance OR dowel contacts lost',
      0: 'Pain during any portion of movement'
    },
    compensations: ['Dowel loses contact', 'Torso rotation', 'Knee deviation', 'Loss of balance'],
    targetAreas: ['Hip mobility', 'Ankle stability', 'Quad flexibility', 'Core stabilization'],
    videoUrl: '/videos/fms-inline-lunge.mp4',
    duration: 90
  },
  {
    id: 'fms-4',
    name: 'Shoulder Mobility',
    description: 'Assesses bilateral shoulder range of motion in combined movements',
    purpose: 'Tests scapular mobility, thoracic spine extension, rib mobility',
    instructions: [
      'Make fist with thumb inside fingers',
      'Reach one arm overhead and behind, other behind low back',
      'Attempt to touch fists together',
      'Measure distance between fists'
    ],
    scoring: {
      3: 'Fists within one hand length',
      2: 'Fists within one and a half hand lengths',
      1: 'Fists not within one and a half hand lengths',
      0: 'Pain during any portion of movement'
    },
    compensations: ['Excessive lumbar extension', 'Head forward', 'Shoulder elevation'],
    targetAreas: ['Shoulder flexion', 'Shoulder extension', 'Internal rotation', 'External rotation'],
    clearingTest: 'Impingement Clearing Test',
    videoUrl: '/videos/fms-shoulder-mobility.mp4',
    duration: 60
  },
  {
    id: 'fms-5',
    name: 'Active Straight Leg Raise',
    description: 'Assesses hip flexion while maintaining stable pelvis and core',
    purpose: 'Tests hamstring & gastroc-soleus flexibility, hip mobility',
    instructions: [
      'Lie supine with arms at sides, palms up',
      'Place board under knees for reference',
      'Lift one leg as high as possible keeping knee straight',
      'Keep opposite leg flat on floor, toes up'
    ],
    scoring: {
      3: 'Ankle/malleolus passes mid-thigh of stationary leg',
      2: 'Ankle/malleolus passes knee but not mid-thigh',
      1: 'Ankle/malleolus does not pass knee',
      0: 'Pain during any portion of movement'
    },
    compensations: ['Opposite knee bends', 'Lower back arches', 'Foot externally rotates'],
    targetAreas: ['Hamstring flexibility', 'Hip flexor flexibility', 'Pelvic stability'],
    videoUrl: '/videos/fms-aslr.mp4',
    duration: 60
  },
  {
    id: 'fms-6',
    name: 'Trunk Stability Push-Up',
    description: 'Assesses trunk stability in sagittal plane during pushing movement',
    purpose: 'Tests core stability during symmetrical upper body movement',
    instructions: [
      'Lie prone with hands at appropriate position (gender-specific)',
      'Men: thumbs at forehead level | Women: thumbs at chin level',
      'Perform push-up as single unit, no lag in lumbar spine',
      'Body should lift as one unit'
    ],
    scoring: {
      3: 'One push-up performed with body as single unit (men: forehead, women: chin)',
      2: 'One push-up performed from modified position',
      1: 'Unable to perform push-up from modified position',
      0: 'Pain during any portion of movement'
    },
    compensations: ['Hips sag', 'Hips rise first', 'Lumbar spine lag'],
    targetAreas: ['Core stability', 'Upper body strength', 'Scapular stability'],
    clearingTest: 'Extension Clearing Test',
    videoUrl: '/videos/fms-pushup.mp4',
    duration: 60
  },
  {
    id: 'fms-7',
    name: 'Rotary Stability',
    description: 'Assesses multi-plane trunk stability during combined upper/lower movement',
    purpose: 'Tests pelvis, core & shoulder girdle stability in transverse plane',
    instructions: [
      'Position in quadruped with hands under shoulders, knees under hips',
      'Extend same-side arm and leg parallel to floor',
      'Touch elbow to knee over the board',
      'Return to parallel position'
    ],
    scoring: {
      3: 'Unilateral repetition performed correctly (same side)',
      2: 'Diagonal repetition performed correctly (opposite side)',
      1: 'Unable to perform diagonal repetition',
      0: 'Pain during any portion of movement'
    },
    compensations: ['Trunk rotation', 'Loss of balance', 'Shoulder elevation', 'Hip shift'],
    targetAreas: ['Core stability', 'Hip stability', 'Shoulder stability', 'Coordination'],
    clearingTest: 'Flexion Clearing Test',
    videoUrl: '/videos/fms-rotary.mp4',
    duration: 90
  }
]

// ============================================================================
// DATA: AMA ROM ASSESSMENT MOVEMENTS (3 Additional)
// ============================================================================

const amaMovements = [
  {
    id: 'ama-1',
    name: 'Cervical ROM',
    description: 'AMA Guides cervical spine range of motion assessment',
    purpose: 'Measures neck flexion, extension, lateral bending, rotation',
    instructions: [
      'Sit upright with shoulders relaxed',
      'Flex chin to chest, extend head back',
      'Tilt ear to each shoulder',
      'Rotate head left and right'
    ],
    normalRanges: {
      flexion: '45°',
      extension: '45°',
      lateralFlexion: '45° each side',
      rotation: '60° each side'
    },
    videoUrl: '/videos/ama-cervical.mp4',
    duration: 120
  },
  {
    id: 'ama-2',
    name: 'Lumbar ROM',
    description: 'AMA Guides lumbar spine range of motion assessment',
    purpose: 'Measures lower back flexion, extension, lateral bending',
    instructions: [
      'Stand with feet shoulder width apart',
      'Bend forward reaching toward toes',
      'Extend backwards with hands on hips',
      'Side bend left and right'
    ],
    normalRanges: {
      flexion: '60°',
      extension: '25°',
      lateralFlexion: '25° each side'
    },
    videoUrl: '/videos/ama-lumbar.mp4',
    duration: 120
  },
  {
    id: 'ama-3',
    name: 'Gait Analysis',
    description: 'Functional walking assessment',
    purpose: 'Observes walking pattern, symmetry, compensations',
    instructions: [
      'Walk naturally for 20 feet',
      'Turn and return',
      'Walk on heels',
      'Walk on toes'
    ],
    observations: ['Stride length', 'Arm swing', 'Trunk rotation', 'Foot placement'],
    videoUrl: '/videos/ama-gait.mp4',
    duration: 90
  }
]

// All 10 movements combined
const allMovements = [...fmsMovements, ...amaMovements]

// ============================================================================
// DATA: VOICE INTAKE QUESTIONS
// ============================================================================

const voiceIntakeQuestions = [
  {
    id: 'vi-1',
    category: 'Demographics',
    question: 'Please state your full name and date of birth.',
    followUp: 'And what is your preferred phone number?'
  },
  {
    id: 'vi-2',
    category: 'Chief Complaint',
    question: 'What brings you in today? Please describe your main concern.',
    followUp: 'When did this problem first start?'
  },
  {
    id: 'vi-3',
    category: 'Pain Assessment',
    question: 'On a scale of 0 to 10, where 0 is no pain and 10 is the worst pain imaginable, how would you rate your current pain?',
    followUp: 'Can you describe the quality of the pain? Is it sharp, dull, burning, or aching?'
  },
  {
    id: 'vi-4',
    category: 'Location',
    question: 'Please describe exactly where you feel the pain or discomfort.',
    followUp: 'Does the pain travel or radiate to other areas?'
  },
  {
    id: 'vi-5',
    category: 'Aggravating Factors',
    question: 'What activities or movements make your symptoms worse?',
    followUp: 'What helps relieve your symptoms?'
  },
  {
    id: 'vi-6',
    category: 'Medical History',
    question: 'Do you have any other medical conditions we should know about?',
    followUp: 'Have you had any surgeries or hospitalizations?'
  },
  {
    id: 'vi-7',
    category: 'Medications',
    question: 'What medications are you currently taking, including over-the-counter medicines and supplements?',
    followUp: 'Do you have any known allergies to medications?'
  },
  {
    id: 'vi-8',
    category: 'Functional Impact',
    question: 'How is this condition affecting your daily activities and quality of life?',
    followUp: 'What are your goals for treatment?'
  }
]

// ============================================================================
// DATA: SAMPLE PATIENT RECORDS (EHR)
// ============================================================================

const patientRecords = [
  {
    id: 'rec-001',
    patientId: 'patient-001',
    patientName: 'Sarah Johnson',
    age: 39,
    gender: 'Female',
    chiefComplaint: 'Lower back pain with right leg radiating symptoms',
    icd10: ['M54.5', 'M54.16'],
    onset: '2025-11-15',
    painLevel: 6,
    fmsScore: 12,
    lastVisit: '2025-12-20',
    nextVisit: '2025-12-30',
    status: 'active',
    assignedDoctor: 'doctor-001',
    assignedCoach: 'coach-001',
    visits: 4,
    progressNotes: [
      { date: '2025-12-20', note: 'Patient reports 20% improvement. FMS score improved from 10 to 12.' },
      { date: '2025-12-13', note: 'Initiated home exercise program. Good tolerance to treatment.' }
    ]
  },
  {
    id: 'rec-002',
    patientId: 'patient-002',
    patientName: 'James Williams',
    age: 52,
    gender: 'Male',
    chiefComplaint: 'Right shoulder pain with limited ROM',
    icd10: ['M75.101'],
    onset: '2025-10-01',
    painLevel: 7,
    fmsScore: 9,
    lastVisit: '2025-12-22',
    nextVisit: '2025-12-29',
    status: 'urgent',
    assignedDoctor: 'doctor-001',
    assignedCoach: 'coach-001',
    visits: 6,
    progressNotes: []
  },
  {
    id: 'rec-003',
    patientId: 'patient-003',
    patientName: 'Emily Davis',
    age: 28,
    gender: 'Female',
    chiefComplaint: 'Bilateral knee pain during running',
    icd10: ['M25.561', 'M25.562'],
    onset: '2025-12-01',
    painLevel: 4,
    fmsScore: 15,
    lastVisit: '2025-12-18',
    nextVisit: '2026-01-02',
    status: 'active',
    assignedDoctor: 'doctor-001',
    assignedCoach: 'coach-001',
    visits: 2,
    progressNotes: []
  }
]

// ============================================================================
// DESIGN SYSTEM - Professional Medical EHR Interface
// ============================================================================

const designSystem = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
  
  :root {
    /* Primary - Medical Teal */
    --primary-50: #f0fdfa;
    --primary-100: #ccfbf1;
    --primary-200: #99f6e4;
    --primary-300: #5eead4;
    --primary-400: #2dd4bf;
    --primary-500: #14b8a6;
    --primary-600: #0d9488;
    --primary-700: #0f766e;
    --primary-800: #115e59;
    --primary-900: #134e4a;
    
    /* Secondary - Slate */
    --slate-50: #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-400: #94a3b8;
    --slate-500: #64748b;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1e293b;
    --slate-900: #0f172a;
    
    /* Status Colors */
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    --info: #3b82f6;
    
    /* Role Colors */
    --role-patient: #8b5cf6;
    --role-doctor: #0ea5e9;
    --role-coach: #22c55e;
    --role-admin: #f59e0b;
    
    /* Glass */
    --glass-bg: rgba(255, 255, 255, 0.85);
    --glass-border: rgba(255, 255, 255, 0.3);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    
    /* Typography */
    --font-display: 'Plus Jakarta Sans', sans-serif;
    --font-body: 'Inter', sans-serif;
    
    /* Spacing */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-10: 2.5rem;
    --space-12: 3rem;
    
    /* Radius */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-2xl: 1.5rem;
    --radius-full: 9999px;
  }
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  html { font-size: 15px; }
  
  body {
    font-family: var(--font-body);
    background: linear-gradient(135deg, #f8fafc 0%, #f0fdfa 50%, #f1f5f9 100%);
    min-height: 100vh;
    color: var(--slate-800);
    line-height: 1.5;
  }
  
  /* Layout */
  .app { display: flex; min-height: 100vh; }
  
  /* Sidebar */
  .sidebar {
    width: 260px;
    background: white;
    border-right: 1px solid var(--slate-200);
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    z-index: 100;
  }
  
  .sidebar-header {
    padding: var(--space-6);
    border-bottom: 1px solid var(--slate-100);
  }
  
  .brand {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }
  
  .brand-logo {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 1rem;
  }
  
  .brand-text h1 {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--slate-900);
    letter-spacing: -0.02em;
  }
  
  .brand-text span {
    font-size: 0.7rem;
    color: var(--slate-500);
    font-weight: 500;
  }
  
  .sidebar-nav {
    flex: 1;
    padding: var(--space-4);
    overflow-y: auto;
  }
  
  .nav-section {
    margin-bottom: var(--space-6);
  }
  
  .nav-section-title {
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--slate-400);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0 var(--space-3);
    margin-bottom: var(--space-2);
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-3);
    border-radius: var(--radius-md);
    color: var(--slate-600);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.15s ease;
    cursor: pointer;
    margin-bottom: 2px;
  }
  
  .nav-item:hover { background: var(--slate-50); color: var(--slate-800); }
  
  .nav-item.active {
    background: var(--primary-50);
    color: var(--primary-700);
    font-weight: 600;
  }
  
  .nav-item i { width: 18px; text-align: center; font-size: 0.95rem; }
  
  .nav-badge {
    margin-left: auto;
    background: var(--error);
    color: white;
    font-size: 0.65rem;
    padding: 2px 6px;
    border-radius: var(--radius-full);
    font-weight: 600;
  }
  
  .sidebar-footer {
    padding: var(--space-4);
    border-top: 1px solid var(--slate-100);
  }
  
  .user-card {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    background: var(--slate-50);
    border-radius: var(--radius-lg);
  }
  
  .user-avatar {
    width: 38px;
    height: 38px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 0.8rem;
  }
  
  .user-avatar.patient { background: var(--role-patient); }
  .user-avatar.doctor { background: var(--role-doctor); }
  .user-avatar.coach { background: var(--role-coach); }
  .user-avatar.admin { background: var(--role-admin); }
  
  .user-info { flex: 1; min-width: 0; }
  .user-name { font-weight: 600; font-size: 0.85rem; color: var(--slate-800); }
  .user-role { font-size: 0.7rem; color: var(--slate-500); text-transform: capitalize; }
  
  /* Main Content */
  .main { flex: 1; margin-left: 260px; }
  
  .main-header {
    background: white;
    border-bottom: 1px solid var(--slate-200);
    padding: var(--space-4) var(--space-8);
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .page-title h2 {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--slate-900);
  }
  
  .page-title p { font-size: 0.85rem; color: var(--slate-500); }
  
  .header-actions { display: flex; gap: var(--space-3); align-items: center; }
  
  .main-content { padding: var(--space-8); }
  
  /* Cards */
  .card {
    background: white;
    border-radius: var(--radius-xl);
    border: 1px solid var(--slate-200);
    overflow: hidden;
  }
  
  .card-header {
    padding: var(--space-5) var(--space-6);
    border-bottom: 1px solid var(--slate-100);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-title {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1rem;
    color: var(--slate-800);
  }
  
  .card-body { padding: var(--space-6); }
  
  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-md);
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s ease;
    border: none;
    text-decoration: none;
    font-family: var(--font-body);
  }
  
  .btn-primary {
    background: var(--primary-600);
    color: white;
  }
  .btn-primary:hover { background: var(--primary-700); }
  
  .btn-secondary {
    background: white;
    color: var(--slate-700);
    border: 1px solid var(--slate-200);
  }
  .btn-secondary:hover { background: var(--slate-50); }
  
  .btn-success { background: var(--success); color: white; }
  .btn-warning { background: var(--warning); color: white; }
  .btn-error { background: var(--error); color: white; }
  
  .btn-ghost {
    background: transparent;
    color: var(--slate-600);
  }
  .btn-ghost:hover { background: var(--slate-100); }
  
  .btn-lg { padding: var(--space-4) var(--space-6); font-size: 1rem; }
  .btn-sm { padding: var(--space-2) var(--space-3); font-size: 0.8rem; }
  .btn-icon { width: 38px; height: 38px; padding: 0; }
  
  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-5);
    margin-bottom: var(--space-8);
  }
  
  .stat-card {
    background: white;
    border-radius: var(--radius-xl);
    padding: var(--space-5);
    border: 1px solid var(--slate-200);
  }
  
  .stat-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-3);
  }
  
  .stat-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
  }
  
  .stat-icon.teal { background: var(--primary-100); color: var(--primary-600); }
  .stat-icon.green { background: #dcfce7; color: var(--success); }
  .stat-icon.amber { background: #fef3c7; color: var(--warning); }
  .stat-icon.blue { background: #dbeafe; color: var(--info); }
  .stat-icon.purple { background: #ede9fe; color: var(--role-patient); }
  
  .stat-trend {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 3px 6px;
    border-radius: var(--radius-full);
  }
  .stat-trend.up { background: #dcfce7; color: var(--success); }
  .stat-trend.down { background: #fee2e2; color: var(--error); }
  
  .stat-value {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--slate-900);
  }
  
  .stat-label { font-size: 0.8rem; color: var(--slate-500); margin-top: 2px; }
  
  /* Content Layout */
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: var(--space-6);
  }
  
  /* Tables */
  .table { width: 100%; border-collapse: collapse; }
  
  .table th, .table td {
    padding: var(--space-4);
    text-align: left;
    border-bottom: 1px solid var(--slate-100);
  }
  
  .table th {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--slate-500);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    background: var(--slate-50);
  }
  
  .table td { font-size: 0.9rem; }
  
  .table tbody tr:hover { background: var(--slate-50); }
  
  /* Patient Row */
  .patient-cell {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }
  
  .patient-avatar {
    width: 36px;
    height: 36px;
    background: var(--slate-200);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.75rem;
    color: var(--slate-600);
  }
  
  .patient-name { font-weight: 600; color: var(--slate-800); }
  .patient-complaint { font-size: 0.8rem; color: var(--slate-500); }
  
  /* Status Badges */
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  .status-badge.active { background: #dcfce7; color: var(--success); }
  .status-badge.urgent { background: #fee2e2; color: var(--error); }
  .status-badge.pending { background: #fef3c7; color: var(--warning); }
  .status-badge.completed { background: #dbeafe; color: var(--info); }
  
  /* FMS Score */
  .fms-score {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
  
  .fms-score-value {
    font-weight: 700;
    font-size: 1rem;
    color: var(--slate-800);
  }
  
  .fms-score-bar {
    width: 60px;
    height: 6px;
    background: var(--slate-200);
    border-radius: var(--radius-full);
    overflow: hidden;
  }
  
  .fms-score-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width 0.3s ease;
  }
  
  .fms-score-fill.low { background: var(--error); }
  .fms-score-fill.medium { background: var(--warning); }
  .fms-score-fill.high { background: var(--success); }
  
  /* Movement Assessment */
  .movement-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
  
  .movement-card {
    background: white;
    border: 1px solid var(--slate-200);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    cursor: pointer;
    transition: all 0.15s ease;
  }
  
  .movement-card:hover {
    border-color: var(--primary-300);
    box-shadow: 0 4px 12px rgba(20, 184, 166, 0.1);
  }
  
  .movement-card.active {
    border-color: var(--primary-500);
    background: var(--primary-50);
  }
  
  .movement-card.completed {
    border-color: var(--success);
    background: #f0fdf4;
  }
  
  .movement-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-3);
  }
  
  .movement-number {
    width: 28px;
    height: 28px;
    background: var(--primary-100);
    color: var(--primary-700);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.8rem;
  }
  
  .movement-card.completed .movement-number {
    background: var(--success);
    color: white;
  }
  
  .movement-score {
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--slate-800);
  }
  
  .movement-name {
    font-weight: 600;
    color: var(--slate-800);
    margin-bottom: 4px;
  }
  
  .movement-desc {
    font-size: 0.8rem;
    color: var(--slate-500);
    line-height: 1.4;
  }
  
  /* Voice Intake */
  .voice-intake {
    text-align: center;
    padding: var(--space-8);
  }
  
  .voice-btn {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    border: none;
    color: white;
    font-size: 2.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 8px 24px rgba(20, 184, 166, 0.3);
    margin-bottom: var(--space-6);
  }
  
  .voice-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(20, 184, 166, 0.4);
  }
  
  .voice-btn.recording {
    background: var(--error);
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3); }
    50% { transform: scale(1.05); box-shadow: 0 12px 32px rgba(239, 68, 68, 0.5); }
  }
  
  .voice-status {
    font-size: 1rem;
    font-weight: 500;
    color: var(--slate-600);
    margin-bottom: var(--space-2);
  }
  
  .voice-transcript {
    background: var(--slate-50);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    min-height: 100px;
    text-align: left;
    font-size: 0.9rem;
    color: var(--slate-700);
    margin-top: var(--space-6);
  }
  
  /* Medical Note */
  .medical-note {
    background: var(--slate-50);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    line-height: 1.6;
    white-space: pre-wrap;
    max-height: 400px;
    overflow-y: auto;
  }
  
  .note-section {
    margin-bottom: var(--space-4);
  }
  
  .note-section-title {
    font-weight: 700;
    color: var(--slate-800);
    text-transform: uppercase;
    margin-bottom: var(--space-2);
  }
  
  /* Login Page */
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--slate-900) 0%, var(--primary-900) 100%);
    padding: var(--space-8);
  }
  
  .login-container {
    width: 100%;
    max-width: 480px;
  }
  
  .login-header {
    text-align: center;
    margin-bottom: var(--space-8);
  }
  
  .login-logo {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--primary-400), var(--primary-600));
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-5);
    color: white;
    font-weight: 800;
    font-size: 1.5rem;
    font-family: var(--font-display);
  }
  
  .login-header h1 {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 700;
    color: white;
    margin-bottom: var(--space-2);
  }
  
  .login-header p {
    color: var(--slate-400);
    font-size: 0.95rem;
  }
  
  .login-card {
    background: white;
    border-radius: var(--radius-2xl);
    padding: var(--space-8);
  }
  
  .login-title {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--slate-800);
    margin-bottom: var(--space-5);
    text-align: center;
  }
  
  .role-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }
  
  .role-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-5);
    background: var(--slate-50);
    border: 2px solid var(--slate-200);
    border-radius: var(--radius-xl);
    cursor: pointer;
    transition: all 0.15s ease;
  }
  
  .role-btn:hover { border-color: var(--slate-300); }
  
  .role-btn.selected { border-color: var(--primary-500); background: var(--primary-50); }
  
  .role-icon {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
  }
  
  .role-icon.patient { background: var(--role-patient); }
  .role-icon.doctor { background: var(--role-doctor); }
  .role-icon.coach { background: var(--role-coach); }
  .role-icon.admin { background: var(--role-admin); }
  
  .role-btn h3 {
    font-weight: 600;
    color: var(--slate-800);
    font-size: 0.95rem;
  }
  
  .role-btn p {
    font-size: 0.75rem;
    color: var(--slate-500);
    text-align: center;
  }
  
  /* Video Assessment */
  .video-assessment {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: var(--space-6);
  }
  
  .video-container {
    background: var(--slate-900);
    border-radius: var(--radius-xl);
    aspect-ratio: 16/9;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  
  .video-placeholder {
    text-align: center;
    color: var(--slate-400);
  }
  
  .video-placeholder i { font-size: 4rem; margin-bottom: var(--space-4); }
  
  .video-overlay {
    position: absolute;
    bottom: var(--space-4);
    left: var(--space-4);
    right: var(--space-4);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .video-controls {
    display: flex;
    gap: var(--space-2);
  }
  
  .video-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    transition: all 0.15s ease;
  }
  
  .video-btn.primary { background: var(--primary-500); color: white; }
  .video-btn.secondary { background: rgba(255,255,255,0.2); color: white; }
  .video-btn.danger { background: var(--error); color: white; }
  
  .assessment-sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .score-display {
    background: white;
    border-radius: var(--radius-xl);
    padding: var(--space-5);
    text-align: center;
    border: 1px solid var(--slate-200);
  }
  
  .score-label { font-size: 0.85rem; color: var(--slate-500); margin-bottom: var(--space-2); }
  
  .score-value {
    font-family: var(--font-display);
    font-size: 3rem;
    font-weight: 800;
    color: var(--primary-600);
  }
  
  .score-max { color: var(--slate-400); font-size: 1.5rem; }
  
  .scoring-btns {
    display: flex;
    gap: var(--space-2);
    justify-content: center;
    margin-top: var(--space-4);
  }
  
  .score-btn {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    border: 2px solid var(--slate-200);
    background: white;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  
  .score-btn:hover { border-color: var(--primary-400); }
  .score-btn.selected { background: var(--primary-500); color: white; border-color: var(--primary-500); }
  .score-btn.score-0 { color: var(--error); }
  .score-btn.score-1 { color: var(--warning); }
  .score-btn.score-2 { color: var(--info); }
  .score-btn.score-3 { color: var(--success); }
  
  /* Progress Steps */
  .progress-steps {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-8);
    position: relative;
  }
  
  .progress-steps::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 40px;
    right: 40px;
    height: 2px;
    background: var(--slate-200);
    z-index: 0;
  }
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    position: relative;
    z-index: 1;
  }
  
  .step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--slate-200);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: var(--slate-400);
  }
  
  .step.active .step-circle {
    background: var(--primary-500);
    border-color: var(--primary-500);
    color: white;
  }
  
  .step.completed .step-circle {
    background: var(--success);
    border-color: var(--success);
    color: white;
  }
  
  .step-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--slate-500);
  }
  
  .step.active .step-label { color: var(--primary-700); font-weight: 600; }
  .step.completed .step-label { color: var(--success); }
  
  /* Form Elements */
  .form-group { margin-bottom: var(--space-5); }
  
  .form-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--slate-700);
    margin-bottom: var(--space-2);
  }
  
  .form-input {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--slate-200);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    transition: all 0.15s ease;
  }
  
  .form-input:focus {
    outline: none;
    border-color: var(--primary-400);
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
  }
  
  .form-textarea { min-height: 100px; resize: vertical; }
  
  /* Demo Banner */
  .demo-banner {
    background: linear-gradient(90deg, var(--primary-600), var(--role-coach));
    color: white;
    padding: var(--space-2) var(--space-4);
    font-size: 0.8rem;
    text-align: center;
    font-weight: 500;
  }
  
  .demo-banner a { color: white; text-decoration: underline; margin-left: var(--space-2); }
  
  /* Responsive */
  @media (max-width: 1200px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .content-grid { grid-template-columns: 1fr; }
    .video-assessment { grid-template-columns: 1fr; }
  }
  
  @media (max-width: 768px) {
    .sidebar { display: none; }
    .main { margin-left: 0; }
    .stats-grid { grid-template-columns: 1fr; }
    .movement-grid { grid-template-columns: 1fr; }
    .role-grid { grid-template-columns: 1fr; }
  }
`

// ============================================================================
// HTML TEMPLATES
// ============================================================================

const htmlHead = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thrive Ortho EHR - MSK Assessment Platform</title>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <style>${designSystem}</style>
</head>
`

const renderSidebar = (role: string, activeItem: string) => {
  const user = demoUsers[role as keyof typeof demoUsers]
  
  const navItems: Record<string, Array<{section: string, items: Array<{id: string, icon: string, label: string, badge?: number}>}>> = {
    patient: [
      { section: 'Overview', items: [
        { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
        { id: 'appointments', icon: 'fa-calendar', label: 'Appointments' },
      ]},
      { section: 'Assessment', items: [
        { id: 'intake', icon: 'fa-microphone', label: 'Voice Intake' },
        { id: 'assessment', icon: 'fa-person-running', label: 'Movement Screen' },
        { id: 'exercises', icon: 'fa-dumbbell', label: 'My Exercises' },
      ]},
      { section: 'Records', items: [
        { id: 'records', icon: 'fa-file-medical', label: 'My Records' },
        { id: 'progress', icon: 'fa-chart-line', label: 'Progress' },
      ]},
    ],
    doctor: [
      { section: 'Clinical', items: [
        { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
        { id: 'patients', icon: 'fa-users', label: 'Patients', badge: 3 },
        { id: 'schedule', icon: 'fa-calendar', label: 'Schedule' },
      ]},
      { section: 'Assessment', items: [
        { id: 'intake', icon: 'fa-microphone', label: 'Voice Intake' },
        { id: 'assessment', icon: 'fa-person-running', label: 'FMS Assessment' },
        { id: 'notes', icon: 'fa-notes-medical', label: 'Medical Notes' },
      ]},
      { section: 'Tools', items: [
        { id: 'exercises', icon: 'fa-dumbbell', label: 'Exercise Library' },
        { id: 'reports', icon: 'fa-file-chart-line', label: 'Reports' },
      ]},
    ],
    coach: [
      { section: 'Overview', items: [
        { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
        { id: 'patients', icon: 'fa-users', label: 'My Clients', badge: 8 },
      ]},
      { section: 'Assessment', items: [
        { id: 'assessment', icon: 'fa-person-running', label: 'Movement Screen' },
        { id: 'video', icon: 'fa-video', label: 'Video Analysis' },
      ]},
      { section: 'Programs', items: [
        { id: 'exercises', icon: 'fa-dumbbell', label: 'Exercise Library' },
        { id: 'programs', icon: 'fa-list-check', label: 'Programs' },
        { id: 'progress', icon: 'fa-chart-line', label: 'Progress Tracking' },
      ]},
    ],
    admin: [
      { section: 'Overview', items: [
        { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
        { id: 'analytics', icon: 'fa-chart-pie', label: 'Analytics' },
      ]},
      { section: 'Management', items: [
        { id: 'users', icon: 'fa-users-cog', label: 'User Management' },
        { id: 'providers', icon: 'fa-user-md', label: 'Providers' },
        { id: 'patients', icon: 'fa-hospital-user', label: 'Patients' },
      ]},
      { section: 'System', items: [
        { id: 'settings', icon: 'fa-cog', label: 'Settings' },
        { id: 'audit', icon: 'fa-clipboard-list', label: 'Audit Logs' },
        { id: 'billing', icon: 'fa-credit-card', label: 'Billing' },
      ]},
    ],
  }
  
  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="brand">
          <div class="brand-logo">TO</div>
          <div class="brand-text">
            <h1>Thrive Ortho</h1>
            <span>EHR Platform</span>
          </div>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        ${navItems[role]?.map(section => `
          <div class="nav-section">
            <div class="nav-section-title">${section.section}</div>
            ${section.items.map(item => `
              <a href="/${role}/${item.id === 'dashboard' ? '' : item.id}" 
                 class="nav-item ${activeItem === item.id ? 'active' : ''}">
                <i class="fas ${item.icon}"></i>
                <span>${item.label}</span>
                ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
              </a>
            `).join('')}
          </div>
        `).join('')}
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-card">
          <div class="user-avatar ${role}">${user.avatar}</div>
          <div class="user-info">
            <div class="user-name">${user.name}</div>
            <div class="user-role">${role}</div>
          </div>
        </div>
      </div>
    </aside>
  `
}

// ============================================================================
// API ROUTES
// ============================================================================

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))
app.get('/api/users', (c) => c.json(demoUsers))
app.get('/api/movements', (c) => c.json(allMovements))
app.get('/api/fms', (c) => c.json(fmsMovements))
app.get('/api/intake-questions', (c) => c.json(voiceIntakeQuestions))
app.get('/api/patients', (c) => c.json(patientRecords))

app.post('/api/ai/generate-note', async (c) => {
  const data = await c.req.json()
  
  const note = `
COMPREHENSIVE MUSCULOSKELETAL ASSESSMENT NOTE
=============================================
Date: ${new Date().toLocaleDateString()}
Provider: Dr. Michael Torres, MD

PATIENT INFORMATION
-------------------
Name: ${data.patientName || 'Sarah Johnson'}
DOB: 03/15/1985 | Age: 39 | Sex: Female
MRN: PAT-001

CHIEF COMPLAINT
---------------
${data.chiefComplaint || 'Lower back pain with right leg radiating symptoms'}

HISTORY OF PRESENT ILLNESS
--------------------------
${data.hpiNarrative || 'Patient presents with a 6-week history of progressive lower back pain. Pain described as dull, aching with intermittent sharp episodes. Rates current pain as 6/10. Pain radiates to right posterior thigh. Aggravated by prolonged sitting, forward bending. Relieved by walking, lying down.'}

FUNCTIONAL MOVEMENT SCREEN (FMS) RESULTS
----------------------------------------
Total Score: ${data.fmsTotal || '12'}/21

1. Deep Squat:        ${data.scores?.deepSquat || '2'}
2. Hurdle Step:       ${data.scores?.hurdleStep || '2'} (L) / ${data.scores?.hurdleStepR || '2'} (R)
3. Inline Lunge:      ${data.scores?.inlineLunge || '2'} (L) / ${data.scores?.inlineLungeR || '1'} (R)
4. Shoulder Mobility: ${data.scores?.shoulderMob || '2'} (L) / ${data.scores?.shoulderMobR || '2'} (R)
5. ASLR:              ${data.scores?.aslr || '2'} (L) / ${data.scores?.aslrR || '1'} (R)
6. Trunk Stability:   ${data.scores?.trunkStab || '2'}
7. Rotary Stability:  ${data.scores?.rotaryStab || '1'} (L) / ${data.scores?.rotaryStabR || '1'} (R)

Clearing Tests: Negative for impingement, extension, flexion

KEY FINDINGS
------------
• Asymmetry identified: R ASLR limited (score 1 vs L score 2)
• Inline lunge R side demonstrates hip mobility deficit
• Rotary stability bilateral weakness - core stability deficit
• Deep squat limited by ankle dorsiflexion

MOVEMENT DYSFUNCTION ANALYSIS
-----------------------------
Primary Dysfunction: Hip mobility limitation (R > L)
Secondary Dysfunction: Core stability deficit
Compensatory Pattern: Increased lumbar extension during movement

AMA RANGE OF MOTION ASSESSMENT
------------------------------
Lumbar Spine:
  Flexion: 45° (Normal: 60°) - LIMITED
  Extension: 20° (Normal: 25°)
  Lateral Flexion: R 20° L 25° (Normal: 25°)

Hip (Right):
  Flexion: 100° (Normal: 120°) - LIMITED
  Extension: 20° (Normal: 30°) - LIMITED
  Internal Rotation: 25° (Normal: 45°) - LIMITED

ASSESSMENT & DIAGNOSIS
----------------------
1. M54.5 - Low back pain
2. M54.16 - Radiculopathy, lumbar region
3. M25.551 - Pain in right hip

FUNCTIONAL RISK ASSESSMENT
--------------------------
FMS Score 12/21 indicates MODERATE injury risk
Key risk factors:
  - Asymmetrical movement patterns
  - Core stability deficit
  - Hip mobility restriction

PLAN
----
1. Physical therapy 2x/week for 6 weeks
2. Home exercise program focusing on:
   - Hip mobility (flexor stretching, IR/ER exercises)
   - Core stabilization (dead bug progression, bird dog)
   - Movement pattern correction
3. Avoid aggravating activities: prolonged sitting, heavy lifting
4. Follow-up in 2 weeks to reassess

EXERCISE PRESCRIPTION
---------------------
[  ] Hip Flexor Stretch - 30s hold x 3 reps, 2x daily
[  ] 90/90 Hip Stretch - 30s hold x 3 reps, 2x daily
[  ] Dead Bug - 10 reps x 3 sets, daily
[  ] Bird Dog - 10 reps each side x 3 sets, daily
[  ] Cat-Cow - 10 reps x 3 sets, daily

_____________________________
Dr. Michael Torres, MD
Sports Medicine
NPI: 1234567890
  `.trim()
  
  return c.json({ note })
})

// ============================================================================
// LOGIN PAGE
// ============================================================================

app.get('/login', (c) => {
  return c.html(`
    ${htmlHead}
    <body>
      <div class="login-page">
        <div class="login-container">
          <div class="login-header">
            <div class="login-logo">TO</div>
            <h1>Thrive Ortho EHR</h1>
            <p>AI-Powered MSK Assessment Platform</p>
          </div>
          
          <div class="login-card">
            <h2 class="login-title">Select Your Role to Continue</h2>
            
            <div class="role-grid">
              <button class="role-btn" onclick="selectRole('patient')">
                <div class="role-icon patient"><i class="fas fa-user"></i></div>
                <h3>Patient</h3>
                <p>Complete intake & assessments</p>
              </button>
              
              <button class="role-btn" onclick="selectRole('doctor')">
                <div class="role-icon doctor"><i class="fas fa-user-md"></i></div>
                <h3>Doctor</h3>
                <p>Clinical evaluation & notes</p>
              </button>
              
              <button class="role-btn" onclick="selectRole('coach')">
                <div class="role-icon coach"><i class="fas fa-clipboard-user"></i></div>
                <h3>Coach</h3>
                <p>Movement assessment & training</p>
              </button>
              
              <button class="role-btn" onclick="selectRole('admin')">
                <div class="role-icon admin"><i class="fas fa-shield-alt"></i></div>
                <h3>Administrator</h3>
                <p>System management</p>
              </button>
            </div>
            
            <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="skipLogin()">
              <i class="fas fa-arrow-right"></i>
              Skip Login (Demo Mode)
            </button>
            
            <p style="text-align: center; margin-top: var(--space-5); font-size: 0.8rem; color: var(--slate-500);">
              FMS + AMA Validated Assessment • HIPAA Compliant
            </p>
          </div>
        </div>
      </div>
      
      <script>
        let selectedRole = 'doctor';
        
        function selectRole(role) {
          selectedRole = role;
          document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('selected'));
          event.currentTarget.classList.add('selected');
        }
        
        function skipLogin() {
          window.location.href = '/' + selectedRole;
        }
        
        document.querySelector('.role-btn:nth-child(2)').classList.add('selected');
      </script>
    </body>
    </html>
  `)
})

// ============================================================================
// DOCTOR DASHBOARD
// ============================================================================

app.get('/doctor', (c) => {
  return c.html(`
    ${htmlHead}
    <body>
      <div class="app">
        ${renderSidebar('doctor', 'dashboard')}
        
        <main class="main">
          <div class="demo-banner">
            <i class="fas fa-flask"></i> Demo Mode - Dr. Michael Torres
            <a href="/login">Switch Role</a>
          </div>
          
          <header class="main-header">
            <div class="page-title">
              <h2>Clinical Dashboard</h2>
              <p>${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-secondary" onclick="location.href='/doctor/intake'">
                <i class="fas fa-microphone"></i> Voice Intake
              </button>
              <button class="btn btn-primary" onclick="location.href='/doctor/assessment'">
                <i class="fas fa-person-running"></i> New Assessment
              </button>
            </div>
          </header>
          
          <div class="main-content">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon teal"><i class="fas fa-users"></i></div>
                  <div class="stat-trend up"><i class="fas fa-arrow-up"></i> 12%</div>
                </div>
                <div class="stat-value">24</div>
                <div class="stat-label">Active Patients</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon green"><i class="fas fa-clipboard-check"></i></div>
                  <div class="stat-trend up"><i class="fas fa-arrow-up"></i> 8%</div>
                </div>
                <div class="stat-value">156</div>
                <div class="stat-label">FMS Assessments</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon amber"><i class="fas fa-chart-line"></i></div>
                </div>
                <div class="stat-value">14.2</div>
                <div class="stat-label">Avg FMS Score</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon blue"><i class="fas fa-calendar-check"></i></div>
                </div>
                <div class="stat-value">8</div>
                <div class="stat-label">Today's Appointments</div>
              </div>
            </div>
            
            <div class="content-grid">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Patient Queue</h3>
                  <button class="btn btn-sm btn-secondary">View All</button>
                </div>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Chief Complaint</th>
                      <th>FMS Score</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${patientRecords.map(p => `
                      <tr>
                        <td>
                          <div class="patient-cell">
                            <div class="patient-avatar">${p.patientName.split(' ').map(n => n[0]).join('')}</div>
                            <div>
                              <div class="patient-name">${p.patientName}</div>
                              <div class="patient-complaint">${p.age}yo ${p.gender}</div>
                            </div>
                          </div>
                        </td>
                        <td>${p.chiefComplaint}</td>
                        <td>
                          <div class="fms-score">
                            <span class="fms-score-value">${p.fmsScore}</span>
                            <div class="fms-score-bar">
                              <div class="fms-score-fill ${p.fmsScore < 12 ? 'low' : p.fmsScore < 15 ? 'medium' : 'high'}" 
                                   style="width: ${(p.fmsScore / 21) * 100}%"></div>
                            </div>
                          </div>
                        </td>
                        <td><span class="status-badge ${p.status}">${p.status}</span></td>
                        <td>
                          <button class="btn btn-sm btn-ghost" onclick="location.href='/doctor/assessment?patient=${p.id}'">
                            <i class="fas fa-clipboard-check"></i>
                          </button>
                          <button class="btn btn-sm btn-ghost" onclick="location.href='/doctor/notes?patient=${p.id}'">
                            <i class="fas fa-file-medical"></i>
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              
              <div>
                <div class="card" style="margin-bottom: var(--space-5);">
                  <div class="card-header">
                    <h3 class="card-title">Quick Actions</h3>
                  </div>
                  <div class="card-body">
                    <button class="btn btn-secondary" style="width: 100%; margin-bottom: var(--space-3); justify-content: flex-start;"
                            onclick="location.href='/doctor/intake'">
                      <i class="fas fa-microphone" style="width: 24px;"></i>
                      Voice Medical Intake
                    </button>
                    <button class="btn btn-secondary" style="width: 100%; margin-bottom: var(--space-3); justify-content: flex-start;"
                            onclick="location.href='/doctor/assessment'">
                      <i class="fas fa-person-running" style="width: 24px;"></i>
                      FMS Assessment
                    </button>
                    <button class="btn btn-secondary" style="width: 100%; margin-bottom: var(--space-3); justify-content: flex-start;"
                            onclick="location.href='/doctor/notes'">
                      <i class="fas fa-notes-medical" style="width: 24px;"></i>
                      Generate Medical Note
                    </button>
                    <button class="btn btn-secondary" style="width: 100%; justify-content: flex-start;"
                            onclick="location.href='/doctor/exercises'">
                      <i class="fas fa-dumbbell" style="width: 24px;"></i>
                      Exercise Library
                    </button>
                  </div>
                </div>
                
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">AI Insights</h3>
                  </div>
                  <div class="card-body">
                    <div style="background: var(--primary-50); border-radius: var(--radius-lg); padding: var(--space-4); margin-bottom: var(--space-4);">
                      <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-2);">
                        <i class="fas fa-exclamation-triangle" style="color: var(--warning);"></i>
                        <strong style="font-size: 0.9rem;">Priority Patient</strong>
                      </div>
                      <p style="font-size: 0.85rem; color: var(--slate-600);">
                        James Williams (FMS 9/21) - High injury risk. Recommend immediate intervention.
                      </p>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--slate-600);">
                      <p style="margin-bottom: var(--space-2);">
                        <i class="fas fa-check-circle" style="color: var(--success); margin-right: var(--space-2);"></i>
                        3 patients improved FMS scores this week
                      </p>
                      <p>
                        <i class="fas fa-chart-line" style="color: var(--info); margin-right: var(--space-2);"></i>
                        Average improvement: 2.4 points
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </body>
    </html>
  `)
})

// ============================================================================
// VOICE INTAKE PAGE
// ============================================================================

app.get('/doctor/intake', (c) => {
  return c.html(`
    ${htmlHead}
    <body>
      <div class="app">
        ${renderSidebar('doctor', 'intake')}
        
        <main class="main">
          <div class="demo-banner">
            <i class="fas fa-flask"></i> Demo Mode - Voice Medical Intake
            <a href="/login">Switch Role</a>
          </div>
          
          <header class="main-header">
            <div class="page-title">
              <h2>Voice Medical Intake</h2>
              <p>AI-powered patient history collection</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-secondary" onclick="location.href='/doctor'">
                <i class="fas fa-arrow-left"></i> Back
              </button>
            </div>
          </header>
          
          <div class="main-content">
            <div class="progress-steps">
              <div class="step completed">
                <div class="step-circle"><i class="fas fa-check"></i></div>
                <span class="step-label">Demographics</span>
              </div>
              <div class="step active">
                <div class="step-circle">2</div>
                <span class="step-label">Chief Complaint</span>
              </div>
              <div class="step">
                <div class="step-circle">3</div>
                <span class="step-label">Pain Assessment</span>
              </div>
              <div class="step">
                <div class="step-circle">4</div>
                <span class="step-label">Medical History</span>
              </div>
              <div class="step">
                <div class="step-circle">5</div>
                <span class="step-label">Review</span>
              </div>
            </div>
            
            <div class="content-grid">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">
                    <i class="fas fa-microphone" style="color: var(--primary-500); margin-right: var(--space-2);"></i>
                    Voice Recording
                  </h3>
                </div>
                <div class="card-body voice-intake">
                  <button class="voice-btn" id="voiceBtn" onclick="toggleRecording()">
                    <i class="fas fa-microphone" id="voiceIcon"></i>
                  </button>
                  
                  <div class="voice-status" id="voiceStatus">
                    Click to start recording
                  </div>
                  
                  <div style="background: var(--primary-50); border-radius: var(--radius-lg); padding: var(--space-5); margin: var(--space-6) 0; text-align: left;">
                    <h4 style="font-size: 0.9rem; font-weight: 600; margin-bottom: var(--space-3);">
                      <i class="fas fa-question-circle" style="color: var(--primary-500); margin-right: var(--space-2);"></i>
                      Current Question
                    </h4>
                    <p style="font-size: 1rem; color: var(--slate-700);" id="currentQuestion">
                      "What brings you in today? Please describe your main concern."
                    </p>
                  </div>
                  
                  <div class="voice-transcript" id="transcript">
                    <em style="color: var(--slate-400);">Transcript will appear here as you speak...</em>
                  </div>
                </div>
              </div>
              
              <div>
                <div class="card" style="margin-bottom: var(--space-5);">
                  <div class="card-header">
                    <h3 class="card-title">Patient Info</h3>
                  </div>
                  <div class="card-body">
                    <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
                      <div class="patient-avatar" style="width: 48px; height: 48px; font-size: 1rem;">SJ</div>
                      <div>
                        <div style="font-weight: 600;">Sarah Johnson</div>
                        <div style="font-size: 0.85rem; color: var(--slate-500);">39yo Female</div>
                      </div>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--slate-600);">
                      <p style="margin-bottom: var(--space-2);"><strong>DOB:</strong> 03/15/1985</p>
                      <p style="margin-bottom: var(--space-2);"><strong>Insurance:</strong> Blue Cross PPO</p>
                      <p><strong>Phone:</strong> (555) 123-4567</p>
                    </div>
                  </div>
                </div>
                
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Intake Progress</h3>
                  </div>
                  <div class="card-body">
                    ${voiceIntakeQuestions.map((q, i) => `
                      <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); ${i < 1 ? 'background: var(--primary-50);' : ''} border-radius: var(--radius-md); margin-bottom: var(--space-2);">
                        <div style="width: 24px; height: 24px; border-radius: 50%; ${i < 1 ? 'background: var(--success); color: white;' : i === 1 ? 'background: var(--primary-500); color: white;' : 'background: var(--slate-200); color: var(--slate-500);'} display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 600;">
                          ${i < 1 ? '<i class="fas fa-check"></i>' : i + 1}
                        </div>
                        <span style="font-size: 0.85rem; ${i <= 1 ? 'color: var(--slate-800);' : 'color: var(--slate-400);'}">${q.category}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: var(--space-6);">
              <button class="btn btn-secondary btn-lg">
                <i class="fas fa-arrow-left"></i> Previous
              </button>
              <button class="btn btn-primary btn-lg" onclick="location.href='/doctor/assessment'">
                Continue to FMS Assessment <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </main>
      </div>
      
      <script>
        let isRecording = false;
        let recognition;
        
        const questions = ${JSON.stringify(voiceIntakeQuestions)};
        let currentQuestionIndex = 1;
        
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          
          recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              transcript += event.results[i][0].transcript;
            }
            document.getElementById('transcript').innerHTML = transcript || '<em style="color: var(--slate-400);">Listening...</em>';
          };
          
          recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            stopRecording();
          };
        }
        
        function toggleRecording() {
          if (isRecording) {
            stopRecording();
          } else {
            startRecording();
          }
        }
        
        function startRecording() {
          isRecording = true;
          document.getElementById('voiceBtn').classList.add('recording');
          document.getElementById('voiceIcon').className = 'fas fa-stop';
          document.getElementById('voiceStatus').textContent = 'Recording... Click to stop';
          document.getElementById('transcript').innerHTML = '<em style="color: var(--slate-400);">Listening...</em>';
          
          if (recognition) {
            recognition.start();
          }
        }
        
        function stopRecording() {
          isRecording = false;
          document.getElementById('voiceBtn').classList.remove('recording');
          document.getElementById('voiceIcon').className = 'fas fa-microphone';
          document.getElementById('voiceStatus').textContent = 'Click to start recording';
          
          if (recognition) {
            recognition.stop();
          }
        }
      </script>
    </body>
    </html>
  `)
})

// ============================================================================
// FMS ASSESSMENT PAGE
// ============================================================================

app.get('/doctor/assessment', (c) => {
  return c.html(`
    ${htmlHead}
    <body>
      <div class="app">
        ${renderSidebar('doctor', 'assessment')}
        
        <main class="main">
          <div class="demo-banner">
            <i class="fas fa-flask"></i> Demo Mode - FMS + AMA Assessment
            <a href="/login">Switch Role</a>
          </div>
          
          <header class="main-header">
            <div class="page-title">
              <h2>MSK Movement Assessment</h2>
              <p>FMS 7-Movement Screen + AMA ROM Evaluation</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-secondary" onclick="location.href='/doctor'">
                <i class="fas fa-arrow-left"></i> Back
              </button>
              <button class="btn btn-success" id="generateNoteBtn" onclick="generateNote()">
                <i class="fas fa-file-medical"></i> Generate Note
              </button>
            </div>
          </header>
          
          <div class="main-content">
            <div class="video-assessment">
              <div>
                <div class="video-container" style="margin-bottom: var(--space-5);">
                  <div class="video-placeholder">
                    <i class="fas fa-video"></i>
                    <p>Camera Feed - KinetiSense Style AI Analysis</p>
                  </div>
                  <div class="video-overlay">
                    <div class="video-controls">
                      <button class="video-btn secondary"><i class="fas fa-expand"></i></button>
                      <button class="video-btn primary"><i class="fas fa-camera"></i></button>
                      <button class="video-btn secondary"><i class="fas fa-redo"></i></button>
                    </div>
                  </div>
                </div>
                
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">10-Movement Assessment Protocol</h3>
                    <span style="font-size: 0.8rem; color: var(--slate-500);">FMS + AMA Validated</span>
                  </div>
                  <div class="card-body">
                    <div class="movement-grid" id="movementGrid">
                      ${allMovements.map((m, i) => `
                        <div class="movement-card ${i === 0 ? 'active' : ''}" data-id="${m.id}" onclick="selectMovement('${m.id}')">
                          <div class="movement-header">
                            <div class="movement-number">${i + 1}</div>
                            <div class="movement-score" id="score-${m.id}">--</div>
                          </div>
                          <div class="movement-name">${m.name}</div>
                          <div class="movement-desc">${m.description.substring(0, 60)}...</div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="assessment-sidebar">
                <div class="score-display">
                  <div class="score-label">Total FMS Score</div>
                  <div>
                    <span class="score-value" id="totalScore">0</span>
                    <span class="score-max">/21</span>
                  </div>
                  <div style="margin-top: var(--space-3);">
                    <span class="status-badge" id="riskBadge" style="font-size: 0.8rem;">Complete assessment</span>
                  </div>
                </div>
                
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title" id="currentMovementTitle">Deep Squat</h3>
                  </div>
                  <div class="card-body">
                    <p style="font-size: 0.85rem; color: var(--slate-600); margin-bottom: var(--space-4);" id="currentMovementDesc">
                      Assesses bilateral, symmetrical mobility of hips, knees, and ankles
                    </p>
                    
                    <div style="margin-bottom: var(--space-5);">
                      <label class="form-label">Score This Movement</label>
                      <div class="scoring-btns">
                        <button class="score-btn score-0" onclick="scoreMovement(0)">0</button>
                        <button class="score-btn score-1" onclick="scoreMovement(1)">1</button>
                        <button class="score-btn score-2" onclick="scoreMovement(2)">2</button>
                        <button class="score-btn score-3" onclick="scoreMovement(3)">3</button>
                      </div>
                    </div>
                    
                    <div style="background: var(--slate-50); border-radius: var(--radius-md); padding: var(--space-3); font-size: 0.8rem;">
                      <strong>Scoring Guide:</strong><br>
                      <span style="color: var(--success);">3</span> = Perfect pattern<br>
                      <span style="color: var(--info);">2</span> = Compensation observed<br>
                      <span style="color: var(--warning);">1</span> = Unable to complete<br>
                      <span style="color: var(--error);">0</span> = Pain during movement
                    </div>
                  </div>
                </div>
                
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">AI Analysis</h3>
                  </div>
                  <div class="card-body" id="aiAnalysis">
                    <div style="text-align: center; color: var(--slate-400); padding: var(--space-4);">
                      <i class="fas fa-robot" style="font-size: 2rem; margin-bottom: var(--space-3);"></i>
                      <p>Score movements to see AI analysis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <script>
        const movements = ${JSON.stringify(allMovements)};
        let currentMovementId = 'fms-1';
        const scores = {};
        
        function selectMovement(id) {
          currentMovementId = id;
          const movement = movements.find(m => m.id === id);
          
          document.querySelectorAll('.movement-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.id === id) card.classList.add('active');
          });
          
          document.getElementById('currentMovementTitle').textContent = movement.name;
          document.getElementById('currentMovementDesc').textContent = movement.description;
          
          // Update score buttons
          document.querySelectorAll('.score-btn').forEach(btn => btn.classList.remove('selected'));
          if (scores[id] !== undefined) {
            document.querySelectorAll('.score-btn')[scores[id]].classList.add('selected');
          }
        }
        
        function scoreMovement(score) {
          scores[currentMovementId] = score;
          
          // Update UI
          document.getElementById('score-' + currentMovementId).textContent = score;
          document.querySelectorAll('.score-btn').forEach((btn, i) => {
            btn.classList.toggle('selected', i === score);
          });
          
          // Mark as completed
          document.querySelector('.movement-card[data-id="' + currentMovementId + '"]').classList.add('completed');
          
          // Calculate total (FMS only - first 7)
          let total = 0;
          let fmsCount = 0;
          movements.slice(0, 7).forEach(m => {
            if (scores[m.id] !== undefined) {
              total += scores[m.id];
              fmsCount++;
            }
          });
          
          document.getElementById('totalScore').textContent = total;
          
          // Update risk badge
          const badge = document.getElementById('riskBadge');
          if (fmsCount === 7) {
            if (total <= 11) {
              badge.className = 'status-badge urgent';
              badge.textContent = 'HIGH RISK - Score ≤ 11';
            } else if (total <= 14) {
              badge.className = 'status-badge pending';
              badge.textContent = 'MODERATE RISK';
            } else {
              badge.className = 'status-badge active';
              badge.textContent = 'LOW RISK';
            }
          }
          
          // Update AI analysis
          updateAIAnalysis();
          
          // Auto-advance to next movement
          const currentIndex = movements.findIndex(m => m.id === currentMovementId);
          if (currentIndex < movements.length - 1) {
            setTimeout(() => selectMovement(movements[currentIndex + 1].id), 500);
          }
        }
        
        function updateAIAnalysis() {
          const scoredCount = Object.keys(scores).length;
          if (scoredCount < 3) return;
          
          let findings = [];
          
          // Deep squat analysis
          if (scores['fms-1'] !== undefined && scores['fms-1'] < 2) {
            findings.push('Hip/ankle mobility limitation detected');
          }
          
          // ASLR analysis
          if (scores['fms-5'] !== undefined && scores['fms-5'] < 2) {
            findings.push('Hamstring flexibility deficit');
          }
          
          // Trunk stability
          if (scores['fms-6'] !== undefined && scores['fms-6'] < 2) {
            findings.push('Core stability weakness');
          }
          
          // Rotary stability
          if (scores['fms-7'] !== undefined && scores['fms-7'] < 2) {
            findings.push('Rotational stability deficit');
          }
          
          if (findings.length === 0) {
            findings.push('Movement patterns within normal limits');
          }
          
          document.getElementById('aiAnalysis').innerHTML = \`
            <div style="font-size: 0.85rem;">
              <h4 style="font-size: 0.8rem; color: var(--slate-500); margin-bottom: var(--space-3);">DETECTED PATTERNS</h4>
              \${findings.map(f => \`
                <div style="display: flex; align-items: flex-start; gap: var(--space-2); margin-bottom: var(--space-2);">
                  <i class="fas fa-circle" style="font-size: 0.4rem; margin-top: 6px; color: var(--primary-500);"></i>
                  <span>\${f}</span>
                </div>
              \`).join('')}
            </div>
          \`;
        }
        
        function generateNote() {
          window.location.href = '/doctor/notes?scores=' + encodeURIComponent(JSON.stringify(scores));
        }
      </script>
    </body>
    </html>
  `)
})

// ============================================================================
// MEDICAL NOTES PAGE
// ============================================================================

app.get('/doctor/notes', (c) => {
  return c.html(`
    ${htmlHead}
    <body>
      <div class="app">
        ${renderSidebar('doctor', 'notes')}
        
        <main class="main">
          <div class="demo-banner">
            <i class="fas fa-flask"></i> Demo Mode - AI Medical Note Generation
            <a href="/login">Switch Role</a>
          </div>
          
          <header class="main-header">
            <div class="page-title">
              <h2>Medical Note Generator</h2>
              <p>AI-powered comprehensive documentation</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-secondary" onclick="location.href='/doctor'">
                <i class="fas fa-arrow-left"></i> Back
              </button>
              <button class="btn btn-secondary">
                <i class="fas fa-print"></i> Print
              </button>
              <button class="btn btn-primary">
                <i class="fas fa-save"></i> Save to EHR
              </button>
            </div>
          </header>
          
          <div class="main-content">
            <div class="content-grid">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">
                    <i class="fas fa-file-medical" style="color: var(--primary-500); margin-right: var(--space-2);"></i>
                    Generated Medical Note
                  </h3>
                  <button class="btn btn-sm btn-secondary" onclick="regenerateNote()">
                    <i class="fas fa-sync"></i> Regenerate
                  </button>
                </div>
                <div class="card-body">
                  <div class="medical-note" id="medicalNote">Loading...</div>
                </div>
              </div>
              
              <div>
                <div class="card" style="margin-bottom: var(--space-5);">
                  <div class="card-header">
                    <h3 class="card-title">Patient Summary</h3>
                  </div>
                  <div class="card-body">
                    <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
                      <div class="patient-avatar" style="width: 48px; height: 48px; font-size: 1rem;">SJ</div>
                      <div>
                        <div style="font-weight: 600;">Sarah Johnson</div>
                        <div style="font-size: 0.85rem; color: var(--slate-500);">39yo Female</div>
                      </div>
                    </div>
                    
                    <div style="background: var(--slate-50); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-4);">
                      <div style="font-size: 0.8rem; color: var(--slate-500); margin-bottom: var(--space-2);">FMS Score</div>
                      <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-600);">12/21</div>
                      <span class="status-badge pending" style="margin-top: var(--space-2);">Moderate Risk</span>
                    </div>
                    
                    <div style="font-size: 0.85rem; color: var(--slate-600);">
                      <p style="margin-bottom: var(--space-2);"><strong>Chief Complaint:</strong></p>
                      <p style="margin-bottom: var(--space-3);">Lower back pain with right leg radiating symptoms</p>
                      <p style="margin-bottom: var(--space-2);"><strong>ICD-10 Codes:</strong></p>
                      <p>M54.5, M54.16</p>
                    </div>
                  </div>
                </div>
                
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Note Options</h3>
                  </div>
                  <div class="card-body">
                    <div class="form-group">
                      <label class="form-label">Note Type</label>
                      <select class="form-input">
                        <option>Initial Evaluation</option>
                        <option>Progress Note</option>
                        <option>Re-evaluation</option>
                        <option>Discharge Summary</option>
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Include Sections</label>
                      <div style="font-size: 0.85rem;">
                        <label style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2); cursor: pointer;">
                          <input type="checkbox" checked> FMS Results
                        </label>
                        <label style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2); cursor: pointer;">
                          <input type="checkbox" checked> AMA ROM
                        </label>
                        <label style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2); cursor: pointer;">
                          <input type="checkbox" checked> Exercise Prescription
                        </label>
                        <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                          <input type="checkbox" checked> Risk Assessment
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <script>
        async function loadNote() {
          const response = await fetch('/api/ai/generate-note', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              patientName: 'Sarah Johnson',
              chiefComplaint: 'Lower back pain with right leg radiating symptoms'
            })
          });
          const data = await response.json();
          document.getElementById('medicalNote').textContent = data.note;
        }
        
        function regenerateNote() {
          document.getElementById('medicalNote').textContent = 'Regenerating...';
          loadNote();
        }
        
        loadNote();
      </script>
    </body>
    </html>
  `)
})

// ============================================================================
// COACH DASHBOARD
// ============================================================================

app.get('/coach', (c) => {
  return c.html(`
    ${htmlHead}
    <body>
      <div class="app">
        ${renderSidebar('coach', 'dashboard')}
        
        <main class="main">
          <div class="demo-banner">
            <i class="fas fa-flask"></i> Demo Mode - Coach: Jessica Martinez, DPT
            <a href="/login">Switch Role</a>
          </div>
          
          <header class="main-header">
            <div class="page-title">
              <h2>Movement Coach Dashboard</h2>
              <p>FMS Certified Movement Specialist</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-primary" onclick="location.href='/coach/assessment'">
                <i class="fas fa-person-running"></i> New Assessment
              </button>
            </div>
          </header>
          
          <div class="main-content">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon green"><i class="fas fa-users"></i></div>
                </div>
                <div class="stat-value">18</div>
                <div class="stat-label">Active Clients</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon teal"><i class="fas fa-clipboard-check"></i></div>
                </div>
                <div class="stat-value">89</div>
                <div class="stat-label">Assessments This Month</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon amber"><i class="fas fa-chart-line"></i></div>
                </div>
                <div class="stat-value">+3.2</div>
                <div class="stat-label">Avg FMS Improvement</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon purple"><i class="fas fa-dumbbell"></i></div>
                </div>
                <div class="stat-value">156</div>
                <div class="stat-label">Exercises Assigned</div>
              </div>
            </div>
            
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">My Clients</h3>
              </div>
              <table class="table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Program</th>
                    <th>FMS Score</th>
                    <th>Progress</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${patientRecords.map(p => `
                    <tr>
                      <td>
                        <div class="patient-cell">
                          <div class="patient-avatar">${p.patientName.split(' ').map(n => n[0]).join('')}</div>
                          <div>
                            <div class="patient-name">${p.patientName}</div>
                            <div class="patient-complaint">${p.chiefComplaint.substring(0, 30)}...</div>
                          </div>
                        </div>
                      </td>
                      <td>Corrective Exercise</td>
                      <td>
                        <div class="fms-score">
                          <span class="fms-score-value">${p.fmsScore}</span>
                          <div class="fms-score-bar">
                            <div class="fms-score-fill ${p.fmsScore < 12 ? 'low' : p.fmsScore < 15 ? 'medium' : 'high'}" 
                                 style="width: ${(p.fmsScore / 21) * 100}%"></div>
                          </div>
                        </div>
                      </td>
                      <td><span class="status-badge active">On Track</span></td>
                      <td>
                        <button class="btn btn-sm btn-ghost" onclick="location.href='/coach/assessment'">
                          <i class="fas fa-clipboard-check"></i>
                        </button>
                        <button class="btn btn-sm btn-ghost">
                          <i class="fas fa-dumbbell"></i>
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </body>
    </html>
  `)
})

// Coach assessment redirects to same FMS tool
app.get('/coach/assessment', (c) => c.redirect('/doctor/assessment'))

// ============================================================================
// PATIENT DASHBOARD
// ============================================================================

app.get('/patient', (c) => {
  return c.html(`
    ${htmlHead}
    <body>
      <div class="app">
        ${renderSidebar('patient', 'dashboard')}
        
        <main class="main">
          <div class="demo-banner">
            <i class="fas fa-flask"></i> Demo Mode - Patient: Sarah Johnson
            <a href="/login">Switch Role</a>
          </div>
          
          <header class="main-header">
            <div class="page-title">
              <h2>Welcome, Sarah</h2>
              <p>Your health dashboard</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-primary" onclick="location.href='/patient/intake'">
                <i class="fas fa-microphone"></i> Start Intake
              </button>
            </div>
          </header>
          
          <div class="main-content">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon teal"><i class="fas fa-calendar"></i></div>
                </div>
                <div class="stat-value">Dec 30</div>
                <div class="stat-label">Next Appointment</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon green"><i class="fas fa-dumbbell"></i></div>
                </div>
                <div class="stat-value">5/7</div>
                <div class="stat-label">Exercises Done</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon amber"><i class="fas fa-chart-line"></i></div>
                </div>
                <div class="stat-value">12</div>
                <div class="stat-label">FMS Score</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon purple"><i class="fas fa-heart"></i></div>
                </div>
                <div class="stat-value">72%</div>
                <div class="stat-label">Recovery Progress</div>
              </div>
            </div>
            
            <div class="content-grid">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Today's Exercises</h3>
                  <button class="btn btn-sm btn-primary">Start Workout</button>
                </div>
                <div class="card-body">
                  <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                    ${['Hip Flexor Stretch', '90/90 Hip Stretch', 'Dead Bug', 'Bird Dog', 'Cat-Cow'].map((ex, i) => `
                      <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); background: ${i < 3 ? 'var(--primary-50)' : 'var(--slate-50)'}; border-radius: var(--radius-md);">
                        <div style="width: 32px; height: 32px; border-radius: 50%; ${i < 3 ? 'background: var(--success); color: white;' : 'background: var(--slate-200); color: var(--slate-500);'} display: flex; align-items: center; justify-content: center;">
                          ${i < 3 ? '<i class="fas fa-check"></i>' : '<i class="fas fa-play"></i>'}
                        </div>
                        <div style="flex: 1;">
                          <div style="font-weight: 500; ${i < 3 ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${ex}</div>
                          <div style="font-size: 0.8rem; color: var(--slate-500);">30s hold x 3 reps</div>
                        </div>
                        <button class="btn btn-sm ${i < 3 ? 'btn-ghost' : 'btn-secondary'}">
                          ${i < 3 ? 'Done' : 'Start'}
                        </button>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
              
              <div>
                <div class="card" style="margin-bottom: var(--space-5);">
                  <div class="card-header">
                    <h3 class="card-title">Your Care Team</h3>
                  </div>
                  <div class="card-body">
                    <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
                      <div class="user-avatar doctor" style="width: 40px; height: 40px;">MT</div>
                      <div>
                        <div style="font-weight: 600; font-size: 0.9rem;">Dr. Michael Torres</div>
                        <div style="font-size: 0.8rem; color: var(--slate-500);">Sports Medicine</div>
                      </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                      <div class="user-avatar coach" style="width: 40px; height: 40px;">JM</div>
                      <div>
                        <div style="font-weight: 600; font-size: 0.9rem;">Jessica Martinez</div>
                        <div style="font-size: 0.8rem; color: var(--slate-500);">Movement Coach</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Progress</h3>
                  </div>
                  <div class="card-body">
                    <div style="margin-bottom: var(--space-4);">
                      <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                        <span style="font-size: 0.85rem;">Pain Level</span>
                        <span style="font-weight: 600;">6 → 4</span>
                      </div>
                      <div style="height: 8px; background: var(--slate-200); border-radius: var(--radius-full);">
                        <div style="width: 40%; height: 100%; background: var(--success); border-radius: var(--radius-full);"></div>
                      </div>
                    </div>
                    <div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                        <span style="font-size: 0.85rem;">FMS Score</span>
                        <span style="font-weight: 600;">10 → 12</span>
                      </div>
                      <div style="height: 8px; background: var(--slate-200); border-radius: var(--radius-full);">
                        <div style="width: 57%; height: 100%; background: var(--primary-500); border-radius: var(--radius-full);"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </body>
    </html>
  `)
})

// Patient intake redirects
app.get('/patient/intake', (c) => c.redirect('/doctor/intake'))
app.get('/patient/assessment', (c) => c.redirect('/doctor/assessment'))

// ============================================================================
// ADMIN DASHBOARD
// ============================================================================

app.get('/admin', (c) => {
  return c.html(`
    ${htmlHead}
    <body>
      <div class="app">
        ${renderSidebar('admin', 'dashboard')}
        
        <main class="main">
          <div class="demo-banner">
            <i class="fas fa-flask"></i> Demo Mode - Administrator: Robert Chen
            <a href="/login">Switch Role</a>
          </div>
          
          <header class="main-header">
            <div class="page-title">
              <h2>System Administration</h2>
              <p>EHR Platform Overview</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-secondary">
                <i class="fas fa-download"></i> Export Data
              </button>
              <button class="btn btn-primary">
                <i class="fas fa-cog"></i> Settings
              </button>
            </div>
          </header>
          
          <div class="main-content">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon blue"><i class="fas fa-user-md"></i></div>
                </div>
                <div class="stat-value">8</div>
                <div class="stat-label">Active Providers</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon green"><i class="fas fa-clipboard-user"></i></div>
                </div>
                <div class="stat-value">12</div>
                <div class="stat-label">Coaches</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon purple"><i class="fas fa-users"></i></div>
                </div>
                <div class="stat-value">248</div>
                <div class="stat-label">Total Patients</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-card-header">
                  <div class="stat-icon amber"><i class="fas fa-clipboard-check"></i></div>
                </div>
                <div class="stat-value">1,247</div>
                <div class="stat-label">Total Assessments</div>
              </div>
            </div>
            
            <div class="content-grid">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">User Management</h3>
                  <button class="btn btn-sm btn-primary"><i class="fas fa-plus"></i> Add User</button>
                </div>
                <table class="table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Last Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${Object.values(demoUsers).map(u => `
                      <tr>
                        <td>
                          <div class="patient-cell">
                            <div class="user-avatar ${u.role}">${u.avatar}</div>
                            <div>
                              <div class="patient-name">${u.name}</div>
                              <div class="patient-complaint">${u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><span style="text-transform: capitalize;">${u.role}</span></td>
                        <td><span class="status-badge active">Active</span></td>
                        <td>Today</td>
                        <td>
                          <button class="btn btn-sm btn-ghost"><i class="fas fa-edit"></i></button>
                          <button class="btn btn-sm btn-ghost"><i class="fas fa-trash"></i></button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              
              <div>
                <div class="card" style="margin-bottom: var(--space-5);">
                  <div class="card-header">
                    <h3 class="card-title">System Status</h3>
                  </div>
                  <div class="card-body">
                    <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                      ${['EHR Database', 'AI Services', 'Video Platform', 'Voice Recognition'].map(s => `
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                          <span style="font-size: 0.9rem;">${s}</span>
                          <span class="status-badge active">Online</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
                
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Quick Actions</h3>
                  </div>
                  <div class="card-body">
                    <button class="btn btn-secondary" style="width: 100%; margin-bottom: var(--space-3); justify-content: flex-start;">
                      <i class="fas fa-users-cog" style="width: 24px;"></i> Manage Users
                    </button>
                    <button class="btn btn-secondary" style="width: 100%; margin-bottom: var(--space-3); justify-content: flex-start;">
                      <i class="fas fa-chart-pie" style="width: 24px;"></i> View Analytics
                    </button>
                    <button class="btn btn-secondary" style="width: 100%; margin-bottom: var(--space-3); justify-content: flex-start;">
                      <i class="fas fa-clipboard-list" style="width: 24px;"></i> Audit Logs
                    </button>
                    <button class="btn btn-secondary" style="width: 100%; justify-content: flex-start;">
                      <i class="fas fa-credit-card" style="width: 24px;"></i> Billing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </body>
    </html>
  `)
})

// ============================================================================
// HOME & CATCH-ALL ROUTES
// ============================================================================

app.get('/', (c) => c.redirect('/login'))

// Catch-all for sub-routes
app.get('/doctor/*', (c) => c.redirect('/doctor'))
app.get('/coach/*', (c) => c.redirect('/coach'))
app.get('/patient/*', (c) => c.redirect('/patient'))
app.get('/admin/*', (c) => c.redirect('/admin'))

export default app
