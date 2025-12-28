import { Hono } from 'hono'
import { cors } from 'hono/cors'

// ============================================================================
// THRIVE ORTHO MSK - AI-Powered Musculoskeletal Assessment Platform
// Professional Glass Morphism UI with Medical-Grade Design
// ============================================================================

type Bindings = {
  DB: D1Database;
  OPENAI_API_KEY: string;
  DAILY_API_KEY: string;
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

// ============================================================================
// DEMO DATA
// ============================================================================

const demoUsers = {
  admin: {
    id: 'admin-001',
    name: 'Dr. Sarah Mitchell',
    email: 'admin@thriveortho.ai',
    role: 'admin',
    title: 'Chief Medical Officer',
    avatar: 'SM'
  },
  provider: {
    id: 'provider-001',
    name: 'Dr. Fabian Rodriguez',
    email: 'dr.fabian@thriveortho.ai',
    role: 'provider',
    specialty: 'Physical Therapy & Chiropractic',
    title: 'Lead MSK Specialist',
    avatar: 'FR',
    credentials: 'DPT, DC, OCS'
  },
  patient: {
    id: 'patient-001',
    name: 'Michael Chen',
    email: 'michael@patient.com',
    role: 'patient',
    avatar: 'MC'
  }
}

const bodyRegions = [
  { id: 'cervical', name: 'Cervical Spine', area: 'Neck', x: 50, y: 8 },
  { id: 'shoulder-l', name: 'Left Shoulder', area: 'Upper Extremity', x: 30, y: 18 },
  { id: 'shoulder-r', name: 'Right Shoulder', area: 'Upper Extremity', x: 70, y: 18 },
  { id: 'thoracic', name: 'Thoracic Spine', area: 'Mid Back', x: 50, y: 28 },
  { id: 'elbow-l', name: 'Left Elbow', area: 'Upper Extremity', x: 22, y: 38 },
  { id: 'elbow-r', name: 'Right Elbow', area: 'Upper Extremity', x: 78, y: 38 },
  { id: 'lumbar', name: 'Lumbar Spine', area: 'Lower Back', x: 50, y: 42 },
  { id: 'wrist-l', name: 'Left Wrist/Hand', area: 'Upper Extremity', x: 18, y: 52 },
  { id: 'wrist-r', name: 'Right Wrist/Hand', area: 'Upper Extremity', x: 82, y: 52 },
  { id: 'hip-l', name: 'Left Hip', area: 'Lower Extremity', x: 38, y: 52 },
  { id: 'hip-r', name: 'Right Hip', area: 'Lower Extremity', x: 62, y: 52 },
  { id: 'knee-l', name: 'Left Knee', area: 'Lower Extremity', x: 40, y: 70 },
  { id: 'knee-r', name: 'Right Knee', area: 'Lower Extremity', x: 60, y: 70 },
  { id: 'ankle-l', name: 'Left Ankle/Foot', area: 'Lower Extremity', x: 42, y: 90 },
  { id: 'ankle-r', name: 'Right Ankle/Foot', area: 'Lower Extremity', x: 58, y: 90 }
]

const exerciseLibrary = [
  { id: 'ex-001', name: 'Cervical Retraction', region: 'cervical', difficulty: 'beginner', duration: '2 min', reps: '10x3', video: true },
  { id: 'ex-002', name: 'Chin Tucks', region: 'cervical', difficulty: 'beginner', duration: '3 min', reps: '15x3', video: true },
  { id: 'ex-003', name: 'McKenzie Extension', region: 'lumbar', difficulty: 'intermediate', duration: '5 min', reps: '10x2', video: true },
  { id: 'ex-004', name: 'Cat-Cow Stretch', region: 'thoracic', difficulty: 'beginner', duration: '3 min', reps: '10x3', video: true },
  { id: 'ex-005', name: 'Shoulder External Rotation', region: 'shoulder', difficulty: 'beginner', duration: '4 min', reps: '12x3', video: true },
  { id: 'ex-006', name: 'Pendulum Exercise', region: 'shoulder', difficulty: 'beginner', duration: '2 min', reps: '30 sec each', video: true },
  { id: 'ex-007', name: 'Piriformis Stretch', region: 'hip', difficulty: 'beginner', duration: '3 min', reps: '30s hold x3', video: true },
  { id: 'ex-008', name: 'Quad Sets', region: 'knee', difficulty: 'beginner', duration: '3 min', reps: '10x3', video: true },
  { id: 'ex-009', name: 'Ankle Alphabet', region: 'ankle', difficulty: 'beginner', duration: '5 min', reps: 'Full ABC', video: true },
  { id: 'ex-010', name: 'Dead Bug', region: 'lumbar', difficulty: 'intermediate', duration: '4 min', reps: '10 each side', video: true }
]

const assessmentProtocols = [
  { id: 'proto-001', name: 'Cervical ROM Assessment', region: 'cervical', duration: '10 min', aiAssisted: true },
  { id: 'proto-002', name: 'Lumbar Flexion/Extension Test', region: 'lumbar', duration: '15 min', aiAssisted: true },
  { id: 'proto-003', name: 'Shoulder Impingement Screen', region: 'shoulder', duration: '12 min', aiAssisted: true },
  { id: 'proto-004', name: 'Hip Mobility Assessment', region: 'hip', duration: '10 min', aiAssisted: true },
  { id: 'proto-005', name: 'Knee Stability Test', region: 'knee', duration: '8 min', aiAssisted: true },
  { id: 'proto-006', name: 'Posture Analysis', region: 'full-body', duration: '20 min', aiAssisted: true }
]

const patientRecords = [
  {
    id: 'rec-001',
    patientName: 'James Wilson',
    age: 45,
    chiefComplaint: 'Chronic lower back pain',
    region: 'lumbar',
    painLevel: 7,
    duration: '6 months',
    lastVisit: '2025-12-20',
    nextVisit: '2025-12-30',
    status: 'active',
    aiRiskScore: 72
  },
  {
    id: 'rec-002',
    patientName: 'Emily Parker',
    age: 32,
    chiefComplaint: 'Right shoulder rotator cuff strain',
    region: 'shoulder-r',
    painLevel: 5,
    duration: '3 weeks',
    lastVisit: '2025-12-22',
    nextVisit: '2025-12-29',
    status: 'active',
    aiRiskScore: 45
  },
  {
    id: 'rec-003',
    patientName: 'Robert Kim',
    age: 58,
    chiefComplaint: 'Cervical radiculopathy',
    region: 'cervical',
    painLevel: 8,
    duration: '2 months',
    lastVisit: '2025-12-18',
    nextVisit: '2025-12-28',
    status: 'urgent',
    aiRiskScore: 85
  }
]

// ============================================================================
// DESIGN SYSTEM - Professional Medical Glass Morphism
// ============================================================================

const designSystem = `
  /* ========================================
     THRIVE ORTHO MSK - Design System
     Professional Medical Glass Morphism
     ======================================== */
  
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  
  :root {
    /* Primary Medical Colors - Calming & Professional */
    --primary-50: #f0f9ff;
    --primary-100: #e0f2fe;
    --primary-200: #bae6fd;
    --primary-300: #7dd3fc;
    --primary-400: #38bdf8;
    --primary-500: #0ea5e9;
    --primary-600: #0284c7;
    --primary-700: #0369a1;
    --primary-800: #075985;
    --primary-900: #0c4a6e;
    
    /* Accent - Healing Green */
    --accent-50: #f0fdf4;
    --accent-100: #dcfce7;
    --accent-200: #bbf7d0;
    --accent-300: #86efac;
    --accent-400: #4ade80;
    --accent-500: #22c55e;
    --accent-600: #16a34a;
    
    /* Warm Accent - Wellness */
    --warm-50: #fffbeb;
    --warm-100: #fef3c7;
    --warm-200: #fde68a;
    --warm-300: #fcd34d;
    --warm-400: #fbbf24;
    --warm-500: #f59e0b;
    
    /* Neutral Slate - Professional */
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
    
    /* Glass Morphism */
    --glass-bg: rgba(255, 255, 255, 0.7);
    --glass-bg-dark: rgba(15, 23, 42, 0.8);
    --glass-border: rgba(255, 255, 255, 0.2);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    --glass-blur: blur(20px);
    
    /* Typography */
    --font-display: 'Plus Jakarta Sans', sans-serif;
    --font-body: 'Inter', sans-serif;
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    
    /* Border Radius */
    --radius-sm: 0.5rem;
    --radius-md: 0.75rem;
    --radius-lg: 1rem;
    --radius-xl: 1.5rem;
    --radius-full: 9999px;
    
    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-normal: 250ms ease;
    --transition-slow: 350ms ease;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }
  
  body {
    font-family: var(--font-body);
    background: linear-gradient(135deg, var(--slate-50) 0%, var(--primary-50) 50%, var(--slate-100) 100%);
    min-height: 100vh;
    color: var(--slate-800);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  
  /* Glass Card Component */
  .glass-card {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-xl);
    box-shadow: var(--glass-shadow);
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  }
  
  .glass-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  .glass-card-solid {
    background: white;
    border-radius: var(--radius-xl);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--slate-100);
  }
  
  /* Layout */
  .app-container {
    display: flex;
    min-height: 100vh;
  }
  
  /* Sidebar */
  .sidebar {
    width: 280px;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border-right: 1px solid var(--glass-border);
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    z-index: 100;
  }
  
  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md) 0;
    margin-bottom: var(--spacing-xl);
    border-bottom: 1px solid var(--slate-200);
  }
  
  .brand-logo {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 1.25rem;
    font-family: var(--font-display);
  }
  
  .brand-text {
    display: flex;
    flex-direction: column;
  }
  
  .brand-name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--slate-900);
    letter-spacing: -0.02em;
  }
  
  .brand-tagline {
    font-size: 0.75rem;
    color: var(--slate-500);
    font-weight: 500;
  }
  
  .nav-section {
    margin-bottom: var(--spacing-lg);
  }
  
  .nav-section-title {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--slate-400);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: var(--spacing-sm) var(--spacing-md);
    margin-bottom: var(--spacing-xs);
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md) var(--spacing-md);
    border-radius: var(--radius-md);
    color: var(--slate-600);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all var(--transition-fast);
    cursor: pointer;
    margin-bottom: 2px;
  }
  
  .nav-item:hover {
    background: var(--primary-50);
    color: var(--primary-700);
  }
  
  .nav-item.active {
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    color: white;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  }
  
  .nav-item i {
    width: 20px;
    text-align: center;
    font-size: 1rem;
  }
  
  .nav-badge {
    margin-left: auto;
    background: var(--error);
    color: white;
    font-size: 0.7rem;
    padding: 2px 8px;
    border-radius: var(--radius-full);
    font-weight: 600;
  }
  
  /* User Profile in Sidebar */
  .sidebar-user {
    margin-top: auto;
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--slate-200);
  }
  
  .user-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--slate-50);
    border-radius: var(--radius-lg);
  }
  
  .user-avatar {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, var(--primary-400), var(--accent-400));
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .user-info {
    flex: 1;
    min-width: 0;
  }
  
  .user-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--slate-800);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .user-role {
    font-size: 0.75rem;
    color: var(--slate-500);
  }
  
  /* Main Content */
  .main-content {
    flex: 1;
    margin-left: 280px;
    padding: var(--spacing-xl);
    min-height: 100vh;
  }
  
  /* Header */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
  }
  
  .page-title-section h1 {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--slate-900);
    letter-spacing: -0.02em;
    margin-bottom: var(--spacing-xs);
  }
  
  .page-title-section p {
    color: var(--slate-500);
    font-size: 0.9rem;
  }
  
  .header-actions {
    display: flex;
    gap: var(--spacing-md);
  }
  
  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    font-weight: 500;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all var(--transition-fast);
    border: none;
    text-decoration: none;
    font-family: var(--font-body);
  }
  
  .btn-primary {
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    color: white;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  }
  
  .btn-primary:hover {
    background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
  }
  
  .btn-secondary {
    background: white;
    color: var(--slate-700);
    border: 1px solid var(--slate-200);
  }
  
  .btn-secondary:hover {
    background: var(--slate-50);
    border-color: var(--slate-300);
  }
  
  .btn-success {
    background: linear-gradient(135deg, var(--accent-500), var(--accent-600));
    color: white;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  }
  
  .btn-outline {
    background: transparent;
    color: var(--primary-600);
    border: 1px solid var(--primary-200);
  }
  
  .btn-outline:hover {
    background: var(--primary-50);
  }
  
  .btn-icon {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: var(--radius-md);
    background: white;
    border: 1px solid var(--slate-200);
    color: var(--slate-600);
  }
  
  .btn-icon:hover {
    background: var(--slate-50);
    color: var(--primary-600);
  }
  
  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }
  
  .stat-card {
    padding: var(--spacing-lg);
  }
  
  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-md);
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  }
  
  .stat-icon.primary {
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    color: var(--primary-600);
  }
  
  .stat-icon.success {
    background: linear-gradient(135deg, var(--accent-100), var(--accent-200));
    color: var(--accent-600);
  }
  
  .stat-icon.warning {
    background: linear-gradient(135deg, var(--warm-100), var(--warm-200));
    color: var(--warm-500);
  }
  
  .stat-icon.info {
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: var(--info);
  }
  
  .stat-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: var(--radius-full);
  }
  
  .stat-trend.up {
    background: var(--accent-100);
    color: var(--accent-600);
  }
  
  .stat-trend.down {
    background: #fee2e2;
    color: var(--error);
  }
  
  .stat-value {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 700;
    color: var(--slate-900);
    margin-bottom: var(--spacing-xs);
  }
  
  .stat-label {
    font-size: 0.85rem;
    color: var(--slate-500);
    font-weight: 500;
  }
  
  /* Content Grid */
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: var(--spacing-xl);
  }
  
  .content-grid-full {
    grid-template-columns: 1fr;
  }
  
  /* Section */
  .section {
    margin-bottom: var(--spacing-xl);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
  }
  
  .section-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--slate-800);
  }
  
  /* Body Map */
  .body-map-container {
    padding: var(--spacing-xl);
    display: flex;
    gap: var(--spacing-xl);
  }
  
  .body-map {
    position: relative;
    width: 280px;
    height: 500px;
    background: linear-gradient(180deg, var(--slate-50) 0%, white 100%);
    border-radius: var(--radius-xl);
    border: 1px solid var(--slate-200);
    flex-shrink: 0;
  }
  
  .body-outline {
    position: absolute;
    inset: 20px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 200'%3E%3Cellipse cx='50' cy='15' rx='12' ry='14' fill='%23e2e8f0' stroke='%2394a3b8' stroke-width='0.5'/%3E%3Cpath d='M50 29 L50 45 M35 35 L50 35 L65 35 M35 35 L25 55 L20 75 M65 35 L75 55 L80 75 M50 45 L50 85 M50 85 L40 130 L42 180 M50 85 L60 130 L58 180' stroke='%2394a3b8' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") center/contain no-repeat;
    opacity: 0.6;
  }
  
  .body-point {
    position: absolute;
    width: 24px;
    height: 24px;
    background: var(--primary-100);
    border: 2px solid var(--primary-400);
    border-radius: 50%;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);
  }
  
  .body-point:hover {
    background: var(--primary-200);
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  }
  
  .body-point.active {
    background: var(--primary-500);
    border-color: var(--primary-600);
    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.2);
  }
  
  .body-point.pain-high {
    background: var(--error);
    border-color: #dc2626;
  }
  
  .body-point.pain-medium {
    background: var(--warning);
    border-color: #d97706;
  }
  
  .body-point.pain-low {
    background: var(--accent-400);
    border-color: var(--accent-600);
  }
  
  .body-point-label {
    position: absolute;
    left: 100%;
    margin-left: 8px;
    white-space: nowrap;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--slate-600);
    opacity: 0;
    transition: opacity var(--transition-fast);
    pointer-events: none;
  }
  
  .body-point:hover .body-point-label {
    opacity: 1;
  }
  
  .region-details {
    flex: 1;
  }
  
  .region-card {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
  }
  
  .region-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
  }
  
  .region-name {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1rem;
    color: var(--slate-800);
  }
  
  .pain-scale {
    display: flex;
    gap: 4px;
    margin: var(--spacing-md) 0;
  }
  
  .pain-scale-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-weight: 600;
    font-size: 0.8rem;
    transition: all var(--transition-fast);
  }
  
  .pain-scale-btn:nth-child(-n+3) { background: var(--accent-100); color: var(--accent-700); }
  .pain-scale-btn:nth-child(n+4):nth-child(-n+6) { background: var(--warm-100); color: var(--warm-600); }
  .pain-scale-btn:nth-child(n+7) { background: #fee2e2; color: var(--error); }
  
  .pain-scale-btn:hover, .pain-scale-btn.active {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  
  /* Patient List */
  .patient-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .patient-card {
    padding: var(--spacing-lg);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    cursor: pointer;
  }
  
  .patient-avatar {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--slate-200), var(--slate-300));
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: var(--slate-600);
  }
  
  .patient-info {
    flex: 1;
  }
  
  .patient-name {
    font-weight: 600;
    color: var(--slate-800);
    margin-bottom: 2px;
  }
  
  .patient-complaint {
    font-size: 0.85rem;
    color: var(--slate-500);
  }
  
  .patient-meta {
    text-align: right;
  }
  
  .patient-status {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  .patient-status.active {
    background: var(--accent-100);
    color: var(--accent-700);
  }
  
  .patient-status.urgent {
    background: #fee2e2;
    color: var(--error);
  }
  
  .patient-risk {
    font-size: 0.8rem;
    color: var(--slate-500);
    margin-top: 4px;
  }
  
  .patient-risk strong {
    color: var(--slate-700);
  }
  
  /* Exercise Library */
  .exercise-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }
  
  .exercise-card {
    padding: var(--spacing-md);
    display: flex;
    gap: var(--spacing-md);
    cursor: pointer;
  }
  
  .exercise-thumb {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  
  .exercise-info h4 {
    font-weight: 600;
    color: var(--slate-800);
    font-size: 0.9rem;
    margin-bottom: 4px;
  }
  
  .exercise-meta {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }
  
  .exercise-tag {
    font-size: 0.7rem;
    padding: 2px 8px;
    border-radius: var(--radius-full);
    background: var(--slate-100);
    color: var(--slate-600);
  }
  
  /* Assessment Protocols */
  .protocol-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .protocol-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: white;
    border-radius: var(--radius-md);
    border: 1px solid var(--slate-100);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .protocol-item:hover {
    background: var(--primary-50);
    border-color: var(--primary-200);
  }
  
  .protocol-icon {
    width: 40px;
    height: 40px;
    background: var(--primary-100);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
  }
  
  .protocol-info {
    flex: 1;
  }
  
  .protocol-name {
    font-weight: 600;
    color: var(--slate-800);
    font-size: 0.9rem;
  }
  
  .protocol-meta {
    font-size: 0.8rem;
    color: var(--slate-500);
  }
  
  .ai-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: linear-gradient(135deg, var(--primary-100), var(--accent-100));
    border-radius: var(--radius-full);
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--primary-700);
  }
  
  /* EHR Integration Panel */
  .ehr-panel {
    padding: var(--spacing-lg);
  }
  
  .ehr-status {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--accent-50);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-lg);
  }
  
  .ehr-status-icon {
    width: 40px;
    height: 40px;
    background: var(--accent-500);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .ehr-connections {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .ehr-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md);
    background: white;
    border-radius: var(--radius-md);
    border: 1px solid var(--slate-100);
  }
  
  .ehr-item-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }
  
  .ehr-logo {
    width: 36px;
    height: 36px;
    background: var(--slate-100);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.8rem;
    color: var(--slate-600);
  }
  
  .ehr-connection-status {
    font-size: 0.75rem;
    padding: 4px 8px;
    border-radius: var(--radius-full);
  }
  
  .ehr-connection-status.connected {
    background: var(--accent-100);
    color: var(--accent-700);
  }
  
  .ehr-connection-status.pending {
    background: var(--warm-100);
    color: var(--warm-600);
  }
  
  /* AI Analysis Panel */
  .ai-analysis {
    padding: var(--spacing-lg);
  }
  
  .ai-result {
    padding: var(--spacing-lg);
    background: linear-gradient(135deg, var(--primary-50), var(--accent-50));
    border-radius: var(--radius-lg);
    margin-bottom: var(--spacing-lg);
  }
  
  .ai-result-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }
  
  .ai-result-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
  }
  
  .ai-result-title {
    font-family: var(--font-display);
    font-weight: 600;
    color: var(--slate-800);
  }
  
  .ai-result-subtitle {
    font-size: 0.85rem;
    color: var(--slate-500);
  }
  
  .confidence-bar {
    height: 8px;
    background: var(--slate-200);
    border-radius: var(--radius-full);
    overflow: hidden;
    margin: var(--spacing-md) 0;
  }
  
  .confidence-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-500), var(--accent-500));
    border-radius: var(--radius-full);
    transition: width var(--transition-slow);
  }
  
  .ai-findings {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .ai-finding {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
    font-size: 0.9rem;
    color: var(--slate-700);
  }
  
  .ai-finding i {
    color: var(--primary-500);
    margin-top: 4px;
  }
  
  /* Video Consultation */
  .video-container {
    padding: var(--spacing-lg);
  }
  
  .video-preview {
    aspect-ratio: 16/9;
    background: var(--slate-900);
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-lg);
    position: relative;
    overflow: hidden;
  }
  
  .video-placeholder {
    text-align: center;
    color: var(--slate-400);
  }
  
  .video-placeholder i {
    font-size: 4rem;
    margin-bottom: var(--spacing-md);
  }
  
  .video-controls {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
  }
  
  .video-btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    transition: all var(--transition-fast);
  }
  
  .video-btn.primary {
    background: linear-gradient(135deg, var(--accent-500), var(--accent-600));
    color: white;
    box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
  }
  
  .video-btn.secondary {
    background: var(--slate-700);
    color: white;
  }
  
  .video-btn.danger {
    background: var(--error);
    color: white;
  }
  
  .video-btn:hover {
    transform: scale(1.1);
  }
  
  /* Demo Banner */
  .demo-banner {
    background: linear-gradient(135deg, var(--primary-600), var(--accent-600));
    color: white;
    padding: var(--spacing-sm) var(--spacing-lg);
    text-align: center;
    font-size: 0.85rem;
    font-weight: 500;
    position: fixed;
    top: 0;
    left: 280px;
    right: 0;
    z-index: 99;
  }
  
  .demo-banner a {
    color: white;
    text-decoration: underline;
  }
  
  /* Login Page */
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    background: linear-gradient(135deg, var(--slate-900) 0%, var(--primary-900) 50%, var(--slate-800) 100%);
  }
  
  .login-card {
    width: 100%;
    max-width: 420px;
    padding: var(--spacing-2xl);
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border-radius: var(--radius-xl);
    border: 1px solid rgba(255,255,255,0.1);
  }
  
  .login-brand {
    text-align: center;
    margin-bottom: var(--spacing-xl);
  }
  
  .login-logo {
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--spacing-lg);
    color: white;
    font-weight: 700;
    font-size: 1.5rem;
  }
  
  .login-brand h1 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--slate-800);
  }
  
  .login-brand p {
    color: var(--slate-500);
    font-size: 0.9rem;
  }
  
  .role-selector {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }
  
  .role-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background: white;
    border: 2px solid var(--slate-200);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .role-option:hover {
    border-color: var(--primary-300);
    background: var(--primary-50);
  }
  
  .role-option.selected {
    border-color: var(--primary-500);
    background: var(--primary-50);
  }
  
  .role-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  }
  
  .role-icon.admin { background: linear-gradient(135deg, #dbeafe, #bfdbfe); color: var(--info); }
  .role-icon.provider { background: linear-gradient(135deg, var(--accent-100), var(--accent-200)); color: var(--accent-600); }
  .role-icon.patient { background: linear-gradient(135deg, var(--warm-100), var(--warm-200)); color: var(--warm-500); }
  
  .role-info h3 {
    font-weight: 600;
    color: var(--slate-800);
    margin-bottom: 2px;
  }
  
  .role-info p {
    font-size: 0.85rem;
    color: var(--slate-500);
  }
  
  /* Form Elements */
  .form-group {
    margin-bottom: var(--spacing-lg);
  }
  
  .form-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--slate-700);
    margin-bottom: var(--spacing-sm);
  }
  
  .form-input {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid var(--slate-200);
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-family: var(--font-body);
    transition: all var(--transition-fast);
  }
  
  .form-input:focus {
    outline: none;
    border-color: var(--primary-400);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
  
  .form-textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  /* Tables */
  .data-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .data-table th,
  .data-table td {
    padding: var(--spacing-md);
    text-align: left;
    border-bottom: 1px solid var(--slate-100);
  }
  
  .data-table th {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--slate-500);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .data-table td {
    font-size: 0.9rem;
    color: var(--slate-700);
  }
  
  .data-table tr:hover td {
    background: var(--slate-50);
  }
  
  /* Responsive */
  @media (max-width: 1200px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .content-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      height: auto;
      position: relative;
    }
    .main-content {
      margin-left: 0;
    }
    .stats-grid {
      grid-template-columns: 1fr;
    }
    .exercise-grid {
      grid-template-columns: 1fr;
    }
    .demo-banner {
      left: 0;
    }
  }
`

// ============================================================================
// PAGE TEMPLATES
// ============================================================================

const htmlHead = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thrive Ortho MSK - AI-Powered Musculoskeletal Assessment</title>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <style>${designSystem}</style>
</head>
`

const renderSidebar = (activeItem: string, user: any) => `
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-logo">TO</div>
      <div class="brand-text">
        <span class="brand-name">Thrive Ortho</span>
        <span class="brand-tagline">MSK Assessment</span>
      </div>
    </div>
    
    <nav>
      <div class="nav-section">
        <div class="nav-section-title">Main</div>
        <a href="/${user.role}" class="nav-item ${activeItem === 'dashboard' ? 'active' : ''}">
          <i class="fas fa-th-large"></i>
          <span>Dashboard</span>
        </a>
        ${user.role === 'provider' || user.role === 'admin' ? `
        <a href="/${user.role}/patients" class="nav-item ${activeItem === 'patients' ? 'active' : ''}">
          <i class="fas fa-users"></i>
          <span>Patients</span>
          <span class="nav-badge">3</span>
        </a>
        ` : ''}
        <a href="/${user.role}/assessment" class="nav-item ${activeItem === 'assessment' ? 'active' : ''}">
          <i class="fas fa-body"></i>
          <span>MSK Assessment</span>
        </a>
      </div>
      
      ${user.role === 'provider' || user.role === 'admin' ? `
      <div class="nav-section">
        <div class="nav-section-title">Clinical Tools</div>
        <a href="/${user.role}/exercises" class="nav-item ${activeItem === 'exercises' ? 'active' : ''}">
          <i class="fas fa-dumbbell"></i>
          <span>Exercise Library</span>
        </a>
        <a href="/${user.role}/protocols" class="nav-item ${activeItem === 'protocols' ? 'active' : ''}">
          <i class="fas fa-clipboard-list"></i>
          <span>Protocols</span>
        </a>
        <a href="/${user.role}/video" class="nav-item ${activeItem === 'video' ? 'active' : ''}">
          <i class="fas fa-video"></i>
          <span>Video Consult</span>
        </a>
      </div>
      ` : ''}
      
      <div class="nav-section">
        <div class="nav-section-title">AI Features</div>
        <a href="/${user.role}/ai-analysis" class="nav-item ${activeItem === 'ai-analysis' ? 'active' : ''}">
          <i class="fas fa-brain"></i>
          <span>AI Analysis</span>
        </a>
        ${user.role === 'provider' || user.role === 'admin' ? `
        <a href="/${user.role}/ehr" class="nav-item ${activeItem === 'ehr' ? 'active' : ''}">
          <i class="fas fa-file-medical"></i>
          <span>EHR Integration</span>
        </a>
        ` : ''}
      </div>
      
      ${user.role === 'admin' ? `
      <div class="nav-section">
        <div class="nav-section-title">Administration</div>
        <a href="/admin/providers" class="nav-item ${activeItem === 'providers' ? 'active' : ''}">
          <i class="fas fa-user-md"></i>
          <span>Providers</span>
        </a>
        <a href="/admin/analytics" class="nav-item ${activeItem === 'analytics' ? 'active' : ''}">
          <i class="fas fa-chart-line"></i>
          <span>Analytics</span>
        </a>
        <a href="/admin/settings" class="nav-item ${activeItem === 'settings' ? 'active' : ''}">
          <i class="fas fa-cog"></i>
          <span>Settings</span>
        </a>
      </div>
      ` : ''}
    </nav>
    
    <div class="sidebar-user">
      <div class="user-card">
        <div class="user-avatar">${user.avatar}</div>
        <div class="user-info">
          <div class="user-name">${user.name}</div>
          <div class="user-role">${user.title || user.role}</div>
        </div>
      </div>
    </div>
  </aside>
`

const renderDemoBanner = () => `
  <div class="demo-banner">
    <i class="fas fa-flask"></i> Demo Mode - Using simulated data | 
    <a href="/login">Switch Role</a>
  </div>
`

// ============================================================================
// ROUTES
// ============================================================================

// Health Check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      openai: true,
      daily: true,
      d1: true
    }
  })
})

// Demo Users API
app.get('/api/demo-users', (c) => c.json(demoUsers))

// Body Regions API
app.get('/api/body-regions', (c) => c.json(bodyRegions))

// Exercise Library API
app.get('/api/exercises', (c) => c.json(exerciseLibrary))

// Assessment Protocols API
app.get('/api/protocols', (c) => c.json(assessmentProtocols))

// Patient Records API
app.get('/api/patients', (c) => c.json(patientRecords))

// AI Analysis API
app.post('/api/ai/msk-analysis', async (c) => {
  const { region, symptoms, painLevel, imageUrl } = await c.req.json()
  
  // Simulated AI response for demo
  const analysis = {
    region: region,
    confidence: 0.87,
    findings: [
      'Reduced range of motion detected in target area',
      'Muscle tension patterns consistent with chronic strain',
      'Posture compensation observed in adjacent regions',
      'Recommended: Progressive loading protocol'
    ],
    recommendedProtocols: ['proto-001', 'proto-003'],
    recommendedExercises: ['ex-001', 'ex-002', 'ex-004'],
    riskLevel: painLevel > 6 ? 'high' : painLevel > 3 ? 'moderate' : 'low',
    nextSteps: [
      'Complete full ROM assessment',
      'Begin prescribed exercise protocol',
      'Follow up in 1 week'
    ]
  }
  
  return c.json(analysis)
})

// Video Room API
app.post('/api/video/create-room', async (c) => {
  return c.json({
    roomUrl: 'https://thriveortho.daily.co/demo-room',
    roomName: 'demo-room',
    token: 'demo-token'
  })
})

// ============================================================================
// LOGIN PAGE
// ============================================================================

app.get('/login', (c) => {
  return c.html(`
    ${htmlHead}
    <body>
      <div class="login-container">
        <div class="login-card">
          <div class="login-brand">
            <div class="login-logo">TO</div>
            <h1>Thrive Ortho MSK</h1>
            <p>AI-Powered Musculoskeletal Assessment</p>
          </div>
          
          <div class="role-selector">
            <div class="role-option" onclick="selectRole('admin')">
              <div class="role-icon admin"><i class="fas fa-shield-alt"></i></div>
              <div class="role-info">
                <h3>Administrator</h3>
                <p>System management & analytics</p>
              </div>
            </div>
            
            <div class="role-option" onclick="selectRole('provider')">
              <div class="role-icon provider"><i class="fas fa-user-md"></i></div>
              <div class="role-info">
                <h3>Provider (PT/DC)</h3>
                <p>MSK assessment & treatment</p>
              </div>
            </div>
            
            <div class="role-option" onclick="selectRole('patient')">
              <div class="role-icon patient"><i class="fas fa-user"></i></div>
              <div class="role-info">
                <h3>Patient</h3>
                <p>View exercises & progress</p>
              </div>
            </div>
          </div>
          
          <button class="btn btn-primary" style="width: 100%" onclick="skipLogin()">
            <i class="fas fa-arrow-right"></i>
            Skip Login (Demo Mode)
          </button>
        </div>
      </div>
      
      <script>
        let selectedRole = 'provider';
        
        function selectRole(role) {
          selectedRole = role;
          document.querySelectorAll('.role-option').forEach(el => el.classList.remove('selected'));
          event.currentTarget.classList.add('selected');
        }
        
        function skipLogin() {
          window.location.href = '/' + selectedRole;
        }
        
        // Select provider by default
        document.querySelector('.role-option:nth-child(2)').classList.add('selected');
      </script>
    </body>
    </html>
  `)
})

// ============================================================================
// PROVIDER DASHBOARD
// ============================================================================

app.get('/provider', (c) => {
  const user = demoUsers.provider
  
  return c.html(`
    ${htmlHead}
    <body>
      <div class="app-container">
        ${renderSidebar('dashboard', user)}
        ${renderDemoBanner()}
        
        <main class="main-content" style="padding-top: 60px;">
          <div class="page-header">
            <div class="page-title-section">
              <h1>Welcome back, Dr. Fabian</h1>
              <p>MSK Assessment Dashboard • ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-secondary">
                <i class="fas fa-calendar-plus"></i>
                New Assessment
              </button>
              <button class="btn btn-primary" onclick="window.location.href='/provider/video'">
                <i class="fas fa-video"></i>
                Start Consult
              </button>
            </div>
          </div>
          
          <div class="stats-grid">
            <div class="glass-card stat-card">
              <div class="stat-header">
                <div class="stat-icon primary"><i class="fas fa-users"></i></div>
                <div class="stat-trend up"><i class="fas fa-arrow-up"></i> 12%</div>
              </div>
              <div class="stat-value">24</div>
              <div class="stat-label">Active Patients</div>
            </div>
            
            <div class="glass-card stat-card">
              <div class="stat-header">
                <div class="stat-icon success"><i class="fas fa-clipboard-check"></i></div>
                <div class="stat-trend up"><i class="fas fa-arrow-up"></i> 8%</div>
              </div>
              <div class="stat-value">156</div>
              <div class="stat-label">Assessments This Month</div>
            </div>
            
            <div class="glass-card stat-card">
              <div class="stat-header">
                <div class="stat-icon warning"><i class="fas fa-brain"></i></div>
              </div>
              <div class="stat-value">89%</div>
              <div class="stat-label">AI Accuracy Rate</div>
            </div>
            
            <div class="glass-card stat-card">
              <div class="stat-header">
                <div class="stat-icon info"><i class="fas fa-chart-line"></i></div>
                <div class="stat-trend up"><i class="fas fa-arrow-up"></i> 15%</div>
              </div>
              <div class="stat-value">92%</div>
              <div class="stat-label">Patient Recovery Rate</div>
            </div>
          </div>
          
          <div class="content-grid">
            <div class="main-column">
              <div class="section">
                <div class="section-header">
                  <h2 class="section-title">Today's Patients</h2>
                  <button class="btn btn-outline btn-sm">View All</button>
                </div>
                <div class="patient-list">
                  ${patientRecords.map(p => `
                    <div class="glass-card patient-card" onclick="window.location.href='/provider/assessment?patient=${p.id}'">
                      <div class="patient-avatar">${p.patientName.split(' ').map(n => n[0]).join('')}</div>
                      <div class="patient-info">
                        <div class="patient-name">${p.patientName}</div>
                        <div class="patient-complaint">${p.chiefComplaint}</div>
                      </div>
                      <div class="patient-meta">
                        <span class="patient-status ${p.status}">${p.status === 'urgent' ? '<i class="fas fa-exclamation-circle"></i>' : '<i class="fas fa-check-circle"></i>'} ${p.status}</span>
                        <div class="patient-risk">AI Risk: <strong>${p.aiRiskScore}%</strong></div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <div class="section">
                <div class="section-header">
                  <h2 class="section-title">Quick Assessment Protocols</h2>
                </div>
                <div class="glass-card-solid" style="padding: var(--spacing-lg);">
                  <div class="protocol-list">
                    ${assessmentProtocols.slice(0, 4).map(p => `
                      <div class="protocol-item" onclick="window.location.href='/provider/assessment?protocol=${p.id}'">
                        <div class="protocol-icon"><i class="fas fa-clipboard-check"></i></div>
                        <div class="protocol-info">
                          <div class="protocol-name">${p.name}</div>
                          <div class="protocol-meta">${p.duration} • ${p.region}</div>
                        </div>
                        ${p.aiAssisted ? '<span class="ai-badge"><i class="fas fa-robot"></i> AI</span>' : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="side-column">
              <div class="glass-card ai-analysis">
                <div class="section-header">
                  <h2 class="section-title"><i class="fas fa-robot" style="color: var(--primary-500); margin-right: 8px;"></i>AI Insights</h2>
                </div>
                
                <div class="ai-result">
                  <div class="ai-result-header">
                    <div class="ai-result-icon"><i class="fas fa-lightbulb"></i></div>
                    <div>
                      <div class="ai-result-title">Priority Alert</div>
                      <div class="ai-result-subtitle">Robert Kim - Cervical Radiculopathy</div>
                    </div>
                  </div>
                  <p style="font-size: 0.9rem; color: var(--slate-600); margin-bottom: var(--spacing-md);">
                    AI detected progressive symptoms. Recommend urgent reassessment and potential imaging referral.
                  </p>
                  <div class="confidence-bar">
                    <div class="confidence-fill" style="width: 85%"></div>
                  </div>
                  <span style="font-size: 0.8rem; color: var(--slate-500);">Confidence: 85%</span>
                </div>
                
                <div style="margin-top: var(--spacing-lg);">
                  <h4 style="font-size: 0.9rem; font-weight: 600; margin-bottom: var(--spacing-md);">Recent AI Findings</h4>
                  <div class="ai-findings">
                    <div class="ai-finding">
                      <i class="fas fa-check-circle"></i>
                      <span>3 patients showing positive response to prescribed exercises</span>
                    </div>
                    <div class="ai-finding">
                      <i class="fas fa-exclamation-triangle" style="color: var(--warning) !important;"></i>
                      <span>1 patient may need protocol adjustment</span>
                    </div>
                    <div class="ai-finding">
                      <i class="fas fa-chart-line"></i>
                      <span>Overall clinic efficiency up 12% this week</span>
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
// MSK ASSESSMENT PAGE
// ============================================================================

app.get('/provider/assessment', (c) => {
  const user = demoUsers.provider
  
  return c.html(`
    ${htmlHead}
    <body>
      <div class="app-container">
        ${renderSidebar('assessment', user)}
        ${renderDemoBanner()}
        
        <main class="main-content" style="padding-top: 60px;">
          <div class="page-header">
            <div class="page-title-section">
              <h1>MSK Assessment</h1>
              <p>Interactive body map with AI-powered analysis</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-secondary" id="clearBtn">
                <i class="fas fa-undo"></i>
                Clear Selection
              </button>
              <button class="btn btn-primary" id="analyzeBtn">
                <i class="fas fa-brain"></i>
                Run AI Analysis
              </button>
            </div>
          </div>
          
          <div class="glass-card body-map-container">
            <div class="body-map">
              <div class="body-outline"></div>
              ${bodyRegions.map(r => `
                <div class="body-point" 
                     data-region="${r.id}" 
                     style="left: ${r.x}%; top: ${r.y}%;"
                     onclick="selectRegion('${r.id}')">
                  <span class="body-point-label">${r.name}</span>
                </div>
              `).join('')}
            </div>
            
            <div class="region-details">
              <div id="regionInfo" style="display: none;">
                <div class="glass-card-solid region-card">
                  <div class="region-card-header">
                    <h3 class="region-name" id="selectedRegionName">Select a Region</h3>
                    <span class="ai-badge"><i class="fas fa-robot"></i> AI Ready</span>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Pain Level (0-10)</label>
                    <div class="pain-scale">
                      ${[1,2,3,4,5,6,7,8,9,10].map(n => `
                        <button class="pain-scale-btn" data-level="${n}" onclick="setPainLevel(${n})">${n}</button>
                      `).join('')}
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Symptoms</label>
                    <textarea class="form-input form-textarea" id="symptoms" placeholder="Describe symptoms, onset, aggravating factors..."></textarea>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Duration</label>
                    <select class="form-input" id="duration">
                      <option value="acute">Acute (&lt; 2 weeks)</option>
                      <option value="subacute">Subacute (2-6 weeks)</option>
                      <option value="chronic">Chronic (&gt; 6 weeks)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div id="aiResults" style="display: none;">
                <div class="glass-card-solid" style="padding: var(--spacing-lg);">
                  <div class="ai-result-header" style="margin-bottom: var(--spacing-lg);">
                    <div class="ai-result-icon"><i class="fas fa-brain"></i></div>
                    <div>
                      <div class="ai-result-title">AI Analysis Results</div>
                      <div class="ai-result-subtitle" id="analysisRegion">Loading...</div>
                    </div>
                  </div>
                  
                  <div class="confidence-bar">
                    <div class="confidence-fill" id="confidenceFill" style="width: 0%"></div>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--slate-500); margin-bottom: var(--spacing-lg);">
                    Confidence: <span id="confidenceValue">0</span>%
                  </p>
                  
                  <h4 style="font-size: 0.9rem; font-weight: 600; margin-bottom: var(--spacing-md);">Findings</h4>
                  <div class="ai-findings" id="findingsList"></div>
                  
                  <h4 style="font-size: 0.9rem; font-weight: 600; margin: var(--spacing-lg) 0 var(--spacing-md);">Recommended Exercises</h4>
                  <div class="exercise-grid" id="exercisesList"></div>
                </div>
              </div>
              
              <div id="initialPrompt" class="glass-card-solid" style="padding: var(--spacing-2xl); text-align: center;">
                <i class="fas fa-hand-pointer" style="font-size: 3rem; color: var(--primary-300); margin-bottom: var(--spacing-lg);"></i>
                <h3 style="margin-bottom: var(--spacing-sm);">Select a Body Region</h3>
                <p style="color: var(--slate-500);">Click on any point on the body map to begin your assessment</p>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <script>
        let selectedRegion = null;
        let painLevel = 5;
        const regions = ${JSON.stringify(bodyRegions)};
        const exercises = ${JSON.stringify(exerciseLibrary)};
        
        function selectRegion(regionId) {
          selectedRegion = regionId;
          const region = regions.find(r => r.id === regionId);
          
          // Update UI
          document.querySelectorAll('.body-point').forEach(el => {
            el.classList.remove('active');
            if (el.dataset.region === regionId) {
              el.classList.add('active');
            }
          });
          
          document.getElementById('initialPrompt').style.display = 'none';
          document.getElementById('regionInfo').style.display = 'block';
          document.getElementById('aiResults').style.display = 'none';
          document.getElementById('selectedRegionName').textContent = region.name + ' - ' + region.area;
        }
        
        function setPainLevel(level) {
          painLevel = level;
          document.querySelectorAll('.pain-scale-btn').forEach(el => {
            el.classList.remove('active');
            if (parseInt(el.dataset.level) === level) {
              el.classList.add('active');
            }
          });
          
          // Update body point color
          const point = document.querySelector(\`.body-point[data-region="\${selectedRegion}"]\`);
          point.classList.remove('pain-high', 'pain-medium', 'pain-low');
          if (level >= 7) point.classList.add('pain-high');
          else if (level >= 4) point.classList.add('pain-medium');
          else point.classList.add('pain-low');
        }
        
        document.getElementById('analyzeBtn').addEventListener('click', async () => {
          if (!selectedRegion) {
            alert('Please select a body region first');
            return;
          }
          
          const btn = document.getElementById('analyzeBtn');
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
          btn.disabled = true;
          
          try {
            const response = await fetch('/api/ai/msk-analysis', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                region: selectedRegion,
                symptoms: document.getElementById('symptoms').value,
                painLevel: painLevel,
                duration: document.getElementById('duration').value
              })
            });
            
            const data = await response.json();
            
            // Display results
            document.getElementById('regionInfo').style.display = 'none';
            document.getElementById('aiResults').style.display = 'block';
            
            const region = regions.find(r => r.id === selectedRegion);
            document.getElementById('analysisRegion').textContent = region.name;
            document.getElementById('confidenceValue').textContent = Math.round(data.confidence * 100);
            document.getElementById('confidenceFill').style.width = (data.confidence * 100) + '%';
            
            document.getElementById('findingsList').innerHTML = data.findings.map(f => \`
              <div class="ai-finding">
                <i class="fas fa-check-circle"></i>
                <span>\${f}</span>
              </div>
            \`).join('');
            
            const recExercises = exercises.filter(e => data.recommendedExercises.includes(e.id));
            document.getElementById('exercisesList').innerHTML = recExercises.map(e => \`
              <div class="glass-card exercise-card">
                <div class="exercise-thumb"><i class="fas fa-play"></i></div>
                <div class="exercise-info">
                  <h4>\${e.name}</h4>
                  <div class="exercise-meta">
                    <span class="exercise-tag">\${e.difficulty}</span>
                    <span class="exercise-tag">\${e.reps}</span>
                  </div>
                </div>
              </div>
            \`).join('');
            
          } catch (error) {
            alert('Error running analysis. Please try again.');
          }
          
          btn.innerHTML = '<i class="fas fa-brain"></i> Run AI Analysis';
          btn.disabled = false;
        });
        
        document.getElementById('clearBtn').addEventListener('click', () => {
          selectedRegion = null;
          painLevel = 5;
          document.querySelectorAll('.body-point').forEach(el => {
            el.classList.remove('active', 'pain-high', 'pain-medium', 'pain-low');
          });
          document.querySelectorAll('.pain-scale-btn').forEach(el => el.classList.remove('active'));
          document.getElementById('symptoms').value = '';
          document.getElementById('regionInfo').style.display = 'none';
          document.getElementById('aiResults').style.display = 'none';
          document.getElementById('initialPrompt').style.display = 'block';
        });
      </script>
    </body>
    </html>
  `)
})

// ============================================================================
// EXERCISE LIBRARY PAGE
// ============================================================================

app.get('/provider/exercises', (c) => {
  const user = demoUsers.provider
  
  return c.html(`
    ${htmlHead}
    <body>
      <div class="app-container">
        ${renderSidebar('exercises', user)}
        ${renderDemoBanner()}
        
        <main class="main-content" style="padding-top: 60px;">
          <div class="page-header">
            <div class="page-title-section">
              <h1>Exercise Library</h1>
              <p>Prescribe evidence-based exercises for your patients</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-secondary">
                <i class="fas fa-filter"></i>
                Filter
              </button>
              <button class="btn btn-primary">
                <i class="fas fa-plus"></i>
                Add Exercise
              </button>
            </div>
          </div>
          
          <div class="exercise-grid" style="grid-template-columns: repeat(3, 1fr);">
            ${exerciseLibrary.map(e => `
              <div class="glass-card exercise-card" style="flex-direction: column; align-items: flex-start;">
                <div style="width: 100%; aspect-ratio: 16/9; background: linear-gradient(135deg, var(--primary-100), var(--accent-100)); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--spacing-md);">
                  <i class="fas fa-play-circle" style="font-size: 2.5rem; color: var(--primary-500);"></i>
                </div>
                <div class="exercise-info" style="width: 100%;">
                  <h4>${e.name}</h4>
                  <p style="font-size: 0.85rem; color: var(--slate-500); margin: var(--spacing-sm) 0;">Target: ${e.region}</p>
                  <div class="exercise-meta">
                    <span class="exercise-tag">${e.difficulty}</span>
                    <span class="exercise-tag">${e.duration}</span>
                    <span class="exercise-tag">${e.reps}</span>
                  </div>
                </div>
                <div style="width: 100%; display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-md);">
                  <button class="btn btn-outline" style="flex: 1; padding: var(--spacing-sm);">
                    <i class="fas fa-eye"></i> Preview
                  </button>
                  <button class="btn btn-primary" style="flex: 1; padding: var(--spacing-sm);">
                    <i class="fas fa-prescription"></i> Prescribe
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </main>
      </div>
    </body>
    </html>
  `)
})

// ============================================================================
// VIDEO CONSULTATION PAGE
// ============================================================================

app.get('/provider/video', (c) => {
  const user = demoUsers.provider
  
  return c.html(`
    ${htmlHead}
    <body>
      <div class="app-container">
        ${renderSidebar('video', user)}
        ${renderDemoBanner()}
        
        <main class="main-content" style="padding-top: 60px;">
          <div class="page-header">
            <div class="page-title-section">
              <h1>Video Consultation</h1>
              <p>Secure HIPAA-compliant video sessions</p>
            </div>
          </div>
          
          <div class="content-grid">
            <div class="glass-card video-container">
              <div class="video-preview">
                <div class="video-placeholder">
                  <i class="fas fa-video"></i>
                  <p>Camera Preview</p>
                </div>
              </div>
              <div class="video-controls">
                <button class="video-btn secondary"><i class="fas fa-microphone"></i></button>
                <button class="video-btn secondary"><i class="fas fa-video"></i></button>
                <button class="video-btn primary"><i class="fas fa-phone"></i></button>
                <button class="video-btn secondary"><i class="fas fa-desktop"></i></button>
                <button class="video-btn danger"><i class="fas fa-phone-slash"></i></button>
              </div>
            </div>
            
            <div class="glass-card" style="padding: var(--spacing-lg);">
              <h3 style="margin-bottom: var(--spacing-lg);">Waiting Room</h3>
              
              <div class="patient-list">
                ${patientRecords.slice(0, 2).map(p => `
                  <div class="glass-card-solid patient-card">
                    <div class="patient-avatar">${p.patientName.split(' ').map(n => n[0]).join('')}</div>
                    <div class="patient-info">
                      <div class="patient-name">${p.patientName}</div>
                      <div class="patient-complaint">Waiting since 2:30 PM</div>
                    </div>
                    <button class="btn btn-success" style="padding: var(--spacing-sm) var(--spacing-md);">
                      <i class="fas fa-phone"></i> Admit
                    </button>
                  </div>
                `).join('')}
              </div>
              
              <div style="margin-top: var(--spacing-xl);">
                <h4 style="margin-bottom: var(--spacing-md);">Session Tools</h4>
                <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                  <button class="btn btn-outline" style="justify-content: flex-start;">
                    <i class="fas fa-body" style="width: 24px;"></i>
                    Open Body Map
                  </button>
                  <button class="btn btn-outline" style="justify-content: flex-start;">
                    <i class="fas fa-dumbbell" style="width: 24px;"></i>
                    Show Exercises
                  </button>
                  <button class="btn btn-outline" style="justify-content: flex-start;">
                    <i class="fas fa-file-medical" style="width: 24px;"></i>
                    View Records
                  </button>
                  <button class="btn btn-outline" style="justify-content: flex-start;">
                    <i class="fas fa-brain" style="width: 24px;"></i>
                    AI Assistant
                  </button>
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
// EHR INTEGRATION PAGE
// ============================================================================

app.get('/provider/ehr', (c) => {
  const user = demoUsers.provider
  
  return c.html(`
    ${htmlHead}
    <body>
      <div class="app-container">
        ${renderSidebar('ehr', user)}
        ${renderDemoBanner()}
        
        <main class="main-content" style="padding-top: 60px;">
          <div class="page-header">
            <div class="page-title-section">
              <h1>EHR Integration</h1>
              <p>Connect and sync with your electronic health records</p>
            </div>
          </div>
          
          <div class="content-grid">
            <div class="glass-card ehr-panel">
              <div class="ehr-status">
                <div class="ehr-status-icon"><i class="fas fa-check"></i></div>
                <div>
                  <strong>EHR System Connected</strong>
                  <p style="font-size: 0.85rem; color: var(--accent-700);">Last sync: 5 minutes ago</p>
                </div>
              </div>
              
              <h3 style="margin-bottom: var(--spacing-lg);">Connected Systems</h3>
              <div class="ehr-connections">
                <div class="ehr-item">
                  <div class="ehr-item-info">
                    <div class="ehr-logo">Epic</div>
                    <div>
                      <strong>Epic MyChart</strong>
                      <p style="font-size: 0.8rem; color: var(--slate-500);">Patient records & appointments</p>
                    </div>
                  </div>
                  <span class="ehr-connection-status connected">Connected</span>
                </div>
                
                <div class="ehr-item">
                  <div class="ehr-item-info">
                    <div class="ehr-logo">WPT</div>
                    <div>
                      <strong>WebPT</strong>
                      <p style="font-size: 0.8rem; color: var(--slate-500);">PT documentation</p>
                    </div>
                  </div>
                  <span class="ehr-connection-status connected">Connected</span>
                </div>
                
                <div class="ehr-item">
                  <div class="ehr-item-info">
                    <div class="ehr-logo">Jane</div>
                    <div>
                      <strong>Jane App</strong>
                      <p style="font-size: 0.8rem; color: var(--slate-500);">Scheduling & billing</p>
                    </div>
                  </div>
                  <span class="ehr-connection-status pending">Setup Required</span>
                </div>
              </div>
              
              <button class="btn btn-primary" style="width: 100%; margin-top: var(--spacing-lg);">
                <i class="fas fa-plus"></i>
                Add EHR Connection
              </button>
            </div>
            
            <div class="glass-card" style="padding: var(--spacing-lg);">
              <h3 style="margin-bottom: var(--spacing-lg);">Recent Sync Activity</h3>
              <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                <div style="display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--slate-50); border-radius: var(--radius-md);">
                  <i class="fas fa-arrow-down" style="color: var(--accent-500);"></i>
                  <div style="flex: 1;">
                    <strong style="font-size: 0.9rem;">Patient records imported</strong>
                    <p style="font-size: 0.8rem; color: var(--slate-500);">3 new patients from Epic</p>
                  </div>
                  <span style="font-size: 0.75rem; color: var(--slate-400);">2 min ago</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--slate-50); border-radius: var(--radius-md);">
                  <i class="fas fa-arrow-up" style="color: var(--primary-500);"></i>
                  <div style="flex: 1;">
                    <strong style="font-size: 0.9rem;">Assessment exported</strong>
                    <p style="font-size: 0.8rem; color: var(--slate-500);">James Wilson → WebPT</p>
                  </div>
                  <span style="font-size: 0.75rem; color: var(--slate-400);">15 min ago</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--slate-50); border-radius: var(--radius-md);">
                  <i class="fas fa-sync" style="color: var(--warning);"></i>
                  <div style="flex: 1;">
                    <strong style="font-size: 0.9rem;">Bi-directional sync</strong>
                    <p style="font-size: 0.8rem; color: var(--slate-500);">All systems synchronized</p>
                  </div>
                  <span style="font-size: 0.75rem; color: var(--slate-400);">1 hour ago</span>
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
// ADMIN DASHBOARD
// ============================================================================

app.get('/admin', (c) => {
  const user = demoUsers.admin
  
  return c.html(`
    ${htmlHead}
    <body>
      <div class="app-container">
        ${renderSidebar('dashboard', user)}
        ${renderDemoBanner()}
        
        <main class="main-content" style="padding-top: 60px;">
          <div class="page-header">
            <div class="page-title-section">
              <h1>Admin Dashboard</h1>
              <p>System overview and management</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-secondary">
                <i class="fas fa-download"></i>
                Export Report
              </button>
              <button class="btn btn-primary">
                <i class="fas fa-cog"></i>
                Settings
              </button>
            </div>
          </div>
          
          <div class="stats-grid">
            <div class="glass-card stat-card">
              <div class="stat-header">
                <div class="stat-icon primary"><i class="fas fa-user-md"></i></div>
                <div class="stat-trend up"><i class="fas fa-arrow-up"></i> 5%</div>
              </div>
              <div class="stat-value">8</div>
              <div class="stat-label">Active Providers</div>
            </div>
            
            <div class="glass-card stat-card">
              <div class="stat-header">
                <div class="stat-icon success"><i class="fas fa-users"></i></div>
                <div class="stat-trend up"><i class="fas fa-arrow-up"></i> 18%</div>
              </div>
              <div class="stat-value">156</div>
              <div class="stat-label">Total Patients</div>
            </div>
            
            <div class="glass-card stat-card">
              <div class="stat-header">
                <div class="stat-icon warning"><i class="fas fa-brain"></i></div>
                <div class="stat-trend up"><i class="fas fa-arrow-up"></i> 3%</div>
              </div>
              <div class="stat-value">1,247</div>
              <div class="stat-label">AI Analyses</div>
            </div>
            
            <div class="glass-card stat-card">
              <div class="stat-header">
                <div class="stat-icon info"><i class="fas fa-dollar-sign"></i></div>
                <div class="stat-trend up"><i class="fas fa-arrow-up"></i> 22%</div>
              </div>
              <div class="stat-value">$45.2K</div>
              <div class="stat-label">Monthly Revenue</div>
            </div>
          </div>
          
          <div class="content-grid">
            <div class="glass-card" style="padding: var(--spacing-lg);">
              <div class="section-header">
                <h2 class="section-title">Provider Performance</h2>
              </div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Patients</th>
                    <th>Assessments</th>
                    <th>AI Usage</th>
                    <th>Recovery Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">FR</div>
                        <div>
                          <strong>Dr. Fabian Rodriguez</strong>
                          <p style="font-size: 0.75rem; color: var(--slate-500);">DPT, DC, OCS</p>
                        </div>
                      </div>
                    </td>
                    <td>24</td>
                    <td>156</td>
                    <td>89%</td>
                    <td><span style="color: var(--accent-600);">92%</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">AJ</div>
                        <div>
                          <strong>Dr. Amanda Johnson</strong>
                          <p style="font-size: 0.75rem; color: var(--slate-500);">PT, DPT</p>
                        </div>
                      </div>
                    </td>
                    <td>18</td>
                    <td>98</td>
                    <td>76%</td>
                    <td><span style="color: var(--accent-600);">88%</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">MK</div>
                        <div>
                          <strong>Dr. Michael Kim</strong>
                          <p style="font-size: 0.75rem; color: var(--slate-500);">DC, CCSP</p>
                        </div>
                      </div>
                    </td>
                    <td>21</td>
                    <td>134</td>
                    <td>94%</td>
                    <td><span style="color: var(--accent-600);">91%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="glass-card" style="padding: var(--spacing-lg);">
              <div class="section-header">
                <h2 class="section-title">AI System Status</h2>
              </div>
              
              <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md); background: var(--accent-50); border-radius: var(--radius-md);">
                  <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                    <div style="width: 10px; height: 10px; background: var(--accent-500); border-radius: 50%;"></div>
                    <span>MSK Analysis Engine</span>
                  </div>
                  <span style="color: var(--accent-600); font-weight: 500;">Online</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md); background: var(--accent-50); border-radius: var(--radius-md);">
                  <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                    <div style="width: 10px; height: 10px; background: var(--accent-500); border-radius: 50%;"></div>
                    <span>OpenAI GPT-4o</span>
                  </div>
                  <span style="color: var(--accent-600); font-weight: 500;">Online</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md); background: var(--accent-50); border-radius: var(--radius-md);">
                  <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                    <div style="width: 10px; height: 10px; background: var(--accent-500); border-radius: 50%;"></div>
                    <span>Video Consultation</span>
                  </div>
                  <span style="color: var(--accent-600); font-weight: 500;">Online</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md); background: var(--accent-50); border-radius: var(--radius-md);">
                  <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                    <div style="width: 10px; height: 10px; background: var(--accent-500); border-radius: 50%;"></div>
                    <span>EHR Sync Service</span>
                  </div>
                  <span style="color: var(--accent-600); font-weight: 500;">Online</span>
                </div>
              </div>
              
              <div style="margin-top: var(--spacing-xl); padding: var(--spacing-lg); background: linear-gradient(135deg, var(--primary-50), var(--accent-50)); border-radius: var(--radius-lg);">
                <h4 style="margin-bottom: var(--spacing-sm);">AI Usage This Month</h4>
                <div class="stat-value" style="font-size: 1.5rem;">12,847</div>
                <p style="font-size: 0.85rem; color: var(--slate-500);">API calls • 89% accuracy rate</p>
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
// PATIENT DASHBOARD
// ============================================================================

app.get('/patient', (c) => {
  const user = demoUsers.patient
  
  return c.html(`
    ${htmlHead}
    <body>
      <div class="app-container">
        ${renderSidebar('dashboard', user)}
        ${renderDemoBanner()}
        
        <main class="main-content" style="padding-top: 60px;">
          <div class="page-header">
            <div class="page-title-section">
              <h1>Welcome, ${user.name}</h1>
              <p>Your MSK health dashboard</p>
            </div>
          </div>
          
          <div class="stats-grid">
            <div class="glass-card stat-card">
              <div class="stat-header">
                <div class="stat-icon primary"><i class="fas fa-calendar-check"></i></div>
              </div>
              <div class="stat-value">Dec 30</div>
              <div class="stat-label">Next Appointment</div>
            </div>
            
            <div class="glass-card stat-card">
              <div class="stat-header">
                <div class="stat-icon success"><i class="fas fa-dumbbell"></i></div>
              </div>
              <div class="stat-value">5/7</div>
              <div class="stat-label">Exercises Completed</div>
            </div>
            
            <div class="glass-card stat-card">
              <div class="stat-header">
                <div class="stat-icon warning"><i class="fas fa-chart-line"></i></div>
              </div>
              <div class="stat-value">72%</div>
              <div class="stat-label">Recovery Progress</div>
            </div>
            
            <div class="glass-card stat-card">
              <div class="stat-header">
                <div class="stat-icon info"><i class="fas fa-star"></i></div>
              </div>
              <div class="stat-value">4/10</div>
              <div class="stat-label">Current Pain Level</div>
            </div>
          </div>
          
          <div class="content-grid">
            <div class="glass-card" style="padding: var(--spacing-lg);">
              <div class="section-header">
                <h2 class="section-title">Today's Exercises</h2>
                <button class="btn btn-primary">
                  <i class="fas fa-play"></i>
                  Start Workout
                </button>
              </div>
              
              <div class="exercise-grid">
                ${exerciseLibrary.slice(0, 4).map((e, i) => `
                  <div class="glass-card-solid exercise-card">
                    <div class="exercise-thumb">
                      ${i < 2 ? '<i class="fas fa-check" style="color: var(--accent-500);"></i>' : '<i class="fas fa-play"></i>'}
                    </div>
                    <div class="exercise-info">
                      <h4 style="${i < 2 ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${e.name}</h4>
                      <div class="exercise-meta">
                        <span class="exercise-tag">${e.reps}</span>
                        <span class="exercise-tag">${e.duration}</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="glass-card" style="padding: var(--spacing-lg);">
              <div class="section-header">
                <h2 class="section-title">Your Progress</h2>
              </div>
              
              <div style="margin-bottom: var(--spacing-xl);">
                <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                  <span style="font-size: 0.9rem; color: var(--slate-600);">Pain Reduction</span>
                  <span style="font-weight: 600;">60%</span>
                </div>
                <div class="confidence-bar">
                  <div class="confidence-fill" style="width: 60%; background: var(--accent-500);"></div>
                </div>
              </div>
              
              <div style="margin-bottom: var(--spacing-xl);">
                <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                  <span style="font-size: 0.9rem; color: var(--slate-600);">Mobility Improvement</span>
                  <span style="font-weight: 600;">72%</span>
                </div>
                <div class="confidence-bar">
                  <div class="confidence-fill" style="width: 72%; background: var(--primary-500);"></div>
                </div>
              </div>
              
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                  <span style="font-size: 0.9rem; color: var(--slate-600);">Exercise Adherence</span>
                  <span style="font-weight: 600;">85%</span>
                </div>
                <div class="confidence-bar">
                  <div class="confidence-fill" style="width: 85%; background: var(--warning);"></div>
                </div>
              </div>
              
              <div style="margin-top: var(--spacing-xl); padding: var(--spacing-lg); background: var(--primary-50); border-radius: var(--radius-lg);">
                <div style="display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
                  <div class="ai-result-icon" style="width: 40px; height: 40px; font-size: 1rem;"><i class="fas fa-robot"></i></div>
                  <strong>AI Insight</strong>
                </div>
                <p style="font-size: 0.9rem; color: var(--slate-600);">
                  Great progress! Your mobility has improved 15% this week. Keep up with the stretching exercises for best results.
                </p>
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
// HOME PAGE
// ============================================================================

app.get('/', (c) => {
  return c.html(`
    ${htmlHead}
    <body style="background: linear-gradient(135deg, var(--slate-900) 0%, var(--primary-900) 50%, var(--slate-800) 100%);">
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--spacing-xl); text-align: center;">
        <div class="login-logo" style="width: 100px; height: 100px; font-size: 2rem; margin-bottom: var(--spacing-xl);">TO</div>
        
        <h1 style="font-family: var(--font-display); font-size: 3rem; font-weight: 700; color: white; margin-bottom: var(--spacing-md); letter-spacing: -0.02em;">
          Thrive Ortho MSK
        </h1>
        
        <p style="font-size: 1.25rem; color: var(--slate-300); max-width: 600px; margin-bottom: var(--spacing-2xl);">
          AI-Powered Musculoskeletal Assessment Platform for Physical Therapy & Chiropractic Care
        </p>
        
        <div style="display: flex; gap: var(--spacing-lg); flex-wrap: wrap; justify-content: center;">
          <a href="/login" class="btn btn-primary" style="padding: var(--spacing-lg) var(--spacing-2xl); font-size: 1rem;">
            <i class="fas fa-sign-in-alt"></i>
            Get Started
          </a>
          <a href="/provider" class="btn btn-secondary" style="padding: var(--spacing-lg) var(--spacing-2xl); font-size: 1rem;">
            <i class="fas fa-user-md"></i>
            Provider Demo
          </a>
        </div>
        
        <div style="margin-top: var(--spacing-2xl); display: flex; gap: var(--spacing-2xl); flex-wrap: wrap; justify-content: center;">
          <div style="text-align: center;">
            <div style="font-size: 2rem; font-weight: 700; color: var(--primary-400);">89%</div>
            <div style="color: var(--slate-400); font-size: 0.9rem;">AI Accuracy</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 2rem; font-weight: 700; color: var(--accent-400);">50+</div>
            <div style="color: var(--slate-400); font-size: 0.9rem;">Exercises</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 2rem; font-weight: 700; color: var(--warm-400);">HIPAA</div>
            <div style="color: var(--slate-400); font-size: 0.9rem;">Compliant</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `)
})

// Catch-all redirects
app.get('/admin/*', (c) => c.redirect('/admin'))
app.get('/provider/*', (c) => {
  const path = c.req.path
  if (path === '/provider/assessment' || path === '/provider/exercises' || path === '/provider/video' || path === '/provider/ehr') {
    return c.redirect(path)
  }
  return c.redirect('/provider')
})
app.get('/patient/*', (c) => c.redirect('/patient'))

export default app
