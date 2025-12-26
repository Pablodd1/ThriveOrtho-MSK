import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { html } from 'hono/html'

// Demo users for skip authentication
const DEMO_USERS = {
  admin: {
    id: 'admin-demo-001',
    email: 'admin@telemed.demo',
    name: 'Demo Admin',
    role: 'admin',
    avatar: '👨‍💼'
  },
  provider: {
    id: 'provider-demo-001',
    email: 'dr.demo@telemed.demo',
    name: 'Dr. Sarah Demo',
    role: 'provider',
    specialization: 'General Practice',
    avatar: '👩‍⚕️'
  },
  patient: {
    id: 'patient-demo-001',
    email: 'patient@telemed.demo',
    name: 'Demo Patient',
    role: 'patient',
    avatar: '👤'
  }
}

// Sample data for dashboards
const SAMPLE_DATA = {
  stats: {
    activeProviders: 12,
    todayConsults: 47,
    aiAnalyses: 156,
    revenue: 3420
  },
  recentActivity: [
    { time: '10:42 AM', event: 'Dr. Smith started consultation #1247', type: 'consultation' },
    { time: '10:41 AM', event: 'AI: Skin analysis completed (conf: 94%)', type: 'ai' },
    { time: '10:40 AM', event: 'New patient registered: John D.', type: 'user' },
    { time: '10:38 AM', event: 'AI: Symptom triage completed (urgent: 3)', type: 'ai' },
    { time: '10:35 AM', event: 'Payment received: $75.00', type: 'payment' }
  ],
  aiServices: [
    { name: 'OpenAI GPT-4o', status: 'online', latency: '234ms' },
    { name: 'Image Analysis', status: 'online', latency: '456ms' },
    { name: 'Video Vitals', status: 'online', latency: '123ms' },
    { name: 'Transcription', status: 'degraded', latency: '892ms' }
  ],
  todaySchedule: [
    { time: '9:00 AM', patient: 'John Doe', type: 'Follow-up', status: 'completed', urgency: 'normal' },
    { time: '9:30 AM', patient: 'Jane Smith', type: 'Skin Consult', status: 'ready', urgency: 'normal' },
    { time: '10:00 AM', patient: 'Mike Wilson', type: 'Diabetes Mgmt', status: 'upcoming', urgency: 'normal' },
    { time: '10:30 AM', patient: 'Lisa Brown', type: 'Urgent Triage', status: 'upcoming', urgency: 'urgent' }
  ],
  patients: [
    { id: 'pat-001', name: 'John Doe', age: 38, lastVisit: '2025-12-20', conditions: ['Hypertension'] },
    { id: 'pat-002', name: 'Jane Smith', age: 34, lastVisit: '2025-12-24', conditions: ['Contact Dermatitis'] },
    { id: 'pat-003', name: 'Mike Wilson', age: 46, lastVisit: '2025-12-18', conditions: ['Type 2 Diabetes', 'High Cholesterol'] }
  ],
  aiAlerts: [
    { patient: 'Lisa Brown', message: 'AI flagged: possible cardiac concern', severity: 'warning' },
    { patient: 'Mike Wilson', message: 'Blood sugar trend requires attention', severity: 'info' }
  ]
}

const app = new Hono()

// Enable CORS
app.use('/api/*', cors())

// ============================================
// SHARED STYLES
// ============================================
const baseStyles = html`
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #f3f4f6; }
    .demo-banner { background: linear-gradient(90deg, #f59e0b, #d97706); color: white; text-align: center; padding: 8px; font-size: 14px; font-weight: 500; }
    .sidebar { width: 260px; background: linear-gradient(180deg, #1e3a5f 0%, #0f2847 100%); min-height: 100vh; color: white; position: fixed; left: 0; top: 0; }
    .sidebar-header { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .sidebar-header h1 { font-size: 20px; display: flex; align-items: center; gap: 10px; }
    .sidebar-nav { padding: 20px 0; }
    .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: rgba(255,255,255,0.7); text-decoration: none; transition: all 0.2s; cursor: pointer; }
    .nav-item:hover, .nav-item.active { background: rgba(255,255,255,0.1); color: white; }
    .nav-item i { width: 20px; text-align: center; }
    .main-content { margin-left: 260px; padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; background: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header h2 { font-size: 24px; color: #1e3a5f; }
    .user-info { display: flex; align-items: center; gap: 12px; }
    .user-avatar { width: 40px; height: 40px; background: #e5e7eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat-card h3 { font-size: 14px; color: #6b7280; margin-bottom: 8px; }
    .stat-card .value { font-size: 32px; font-weight: 700; color: #1e3a5f; }
    .stat-card .change { font-size: 12px; color: #10b981; margin-top: 4px; }
    .card { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px; }
    .card-header { padding: 16px 20px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1e3a5f; display: flex; align-items: center; gap: 8px; }
    .card-body { padding: 20px; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .activity-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
    .activity-item:last-child { border-bottom: none; }
    .activity-time { font-size: 12px; color: #9ca3af; width: 70px; }
    .activity-event { flex: 1; font-size: 14px; }
    .status-badge { padding: 4px 8px; border-radius: 9999px; font-size: 11px; font-weight: 500; }
    .status-online { background: #d1fae5; color: #059669; }
    .status-degraded { background: #fef3c7; color: #d97706; }
    .status-offline { background: #fee2e2; color: #dc2626; }
    .service-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
    .service-item:last-child { border-bottom: none; }
    .progress-bar { height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #1d4ed8); border-radius: 4px; }
    .btn { padding: 10px 20px; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; border: none; }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-primary:hover { background: #2563eb; }
    .btn-secondary { background: #e5e7eb; color: #374151; }
    .btn-secondary:hover { background: #d1d5db; }
    .btn-success { background: #10b981; color: white; }
    .btn-success:hover { background: #059669; }
    .schedule-item { display: flex; align-items: center; padding: 12px; border-radius: 8px; margin-bottom: 8px; background: #f9fafb; }
    .schedule-time { font-weight: 600; color: #1e3a5f; width: 80px; }
    .schedule-patient { flex: 1; }
    .schedule-type { color: #6b7280; font-size: 13px; }
    .schedule-status { padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; }
    .status-ready { background: #d1fae5; color: #059669; }
    .status-completed { background: #e5e7eb; color: #6b7280; }
    .status-upcoming { background: #dbeafe; color: #2563eb; }
    .status-urgent { background: #fee2e2; color: #dc2626; animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    .alert-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px; border-radius: 8px; margin-bottom: 8px; }
    .alert-warning { background: #fef3c7; border-left: 4px solid #f59e0b; }
    .alert-info { background: #dbeafe; border-left: 4px solid #3b82f6; }
    .alert-icon { font-size: 18px; }
    .ai-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; }
    .ai-card h4 { font-size: 14px; opacity: 0.9; margin-bottom: 8px; }
    .ai-card .title { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
    .ai-confidence { background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; display: inline-block; margin-bottom: 12px; }
    .login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e3a5f 0%, #0f2847 100%); }
    .login-card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); width: 400px; max-width: 90%; }
    .login-card h1 { text-align: center; color: #1e3a5f; margin-bottom: 8px; }
    .login-card .subtitle { text-align: center; color: #6b7280; margin-bottom: 32px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 500; color: #374151; }
    .form-group input { width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; }
    .form-group input:focus { outline: none; border-color: #3b82f6; }
    .divider { display: flex; align-items: center; margin: 24px 0; }
    .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #e5e7eb; }
    .divider span { padding: 0 16px; color: #9ca3af; font-size: 14px; }
    .skip-btn { width: 100%; padding: 14px; border: 2px dashed #d1d5db; background: #f9fafb; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 500; color: #374151; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .skip-btn:hover { background: #f3f4f6; border-color: #3b82f6; color: #3b82f6; }
    .role-selector { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
    .role-option { padding: 16px; border: 2px solid #e5e7eb; border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.2s; }
    .role-option:hover { border-color: #3b82f6; }
    .role-option.selected { border-color: #3b82f6; background: #eff6ff; }
    .role-option .icon { font-size: 32px; margin-bottom: 8px; }
    .role-option .title { font-weight: 600; color: #1e3a5f; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; padding: 12px; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #6b7280; }
    .table td { padding: 12px; border-bottom: 1px solid #f3f4f6; }
    .table tr:hover { background: #f9fafb; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; border-radius: 16px; padding: 24px; width: 600px; max-width: 90%; max-height: 90vh; overflow-y: auto; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280; }
    .tabs { display: flex; border-bottom: 2px solid #e5e7eb; margin-bottom: 20px; }
    .tab { padding: 12px 20px; cursor: pointer; color: #6b7280; border-bottom: 2px solid transparent; margin-bottom: -2px; }
    .tab.active { color: #3b82f6; border-bottom-color: #3b82f6; }
    .image-upload { border: 2px dashed #d1d5db; border-radius: 12px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.2s; }
    .image-upload:hover { border-color: #3b82f6; background: #f9fafb; }
    .chat-container { height: 400px; display: flex; flex-direction: column; }
    .chat-messages { flex: 1; overflow-y: auto; padding: 16px; background: #f9fafb; border-radius: 8px; }
    .chat-input { display: flex; gap: 8px; margin-top: 12px; }
    .chat-input input { flex: 1; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; }
    .message { margin-bottom: 12px; }
    .message.user { text-align: right; }
    .message .bubble { display: inline-block; padding: 10px 16px; border-radius: 16px; max-width: 80%; }
    .message.user .bubble { background: #3b82f6; color: white; }
    .message.ai .bubble { background: white; border: 1px solid #e5e7eb; }
  </style>
`

const fontAwesome = html`<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">`

// ============================================
// HOME / ENTRY PAGE
// ============================================
app.get('/', (c) => {
  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TeleMed AI - Telemedicine Platform</title>
      ${fontAwesome}
      ${baseStyles}
      <style>
        .hero { min-height: 100vh; background: linear-gradient(135deg, #1e3a5f 0%, #0f2847 100%); display: flex; flex-direction: column; }
        .hero-nav { padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }
        .hero-logo { color: white; font-size: 24px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
        .hero-content { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .hero-text { max-width: 600px; color: white; }
        .hero-text h1 { font-size: 48px; margin-bottom: 20px; line-height: 1.2; }
        .hero-text p { font-size: 18px; opacity: 0.9; margin-bottom: 32px; line-height: 1.6; }
        .portal-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px; }
        .portal-card { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 30px; border-radius: 16px; text-align: center; transition: all 0.3s; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; text-decoration: none; color: white; }
        .portal-card:hover { background: rgba(255,255,255,0.2); transform: translateY(-5px); }
        .portal-card .icon { font-size: 48px; margin-bottom: 16px; }
        .portal-card h3 { font-size: 20px; margin-bottom: 8px; }
        .portal-card p { font-size: 14px; opacity: 0.8; }
        .features { display: flex; gap: 40px; margin-top: 60px; }
        .feature { display: flex; align-items: center; gap: 12px; }
        .feature i { color: #10b981; font-size: 20px; }
        .feature span { font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="hero">
        <nav class="hero-nav">
          <div class="hero-logo">
            <i class="fas fa-heartbeat"></i>
            TeleMed AI
          </div>
          <div>
            <a href="/login" class="btn btn-primary"><i class="fas fa-sign-in-alt"></i> Login</a>
          </div>
        </nav>
        
        <div class="hero-content">
          <div class="hero-text">
            <h1>AI-Powered Telemedicine Platform</h1>
            <p>Experience the future of healthcare with intelligent diagnostics, video consultations, and AI-assisted medical analysis. Connect with healthcare providers from anywhere.</p>
            
            <div class="features">
              <div class="feature"><i class="fas fa-check-circle"></i><span>AI Diagnostics</span></div>
              <div class="feature"><i class="fas fa-check-circle"></i><span>Video Consultations</span></div>
              <div class="feature"><i class="fas fa-check-circle"></i><span>HIPAA Compliant</span></div>
            </div>
            
            <div class="portal-cards">
              <a href="/admin" class="portal-card">
                <div class="icon">👨‍💼</div>
                <h3>Admin Portal</h3>
                <p>System management & analytics</p>
              </a>
              <a href="/provider" class="portal-card">
                <div class="icon">👩‍⚕️</div>
                <h3>Provider Portal</h3>
                <p>Clinical tools & consultations</p>
              </a>
              <a href="/patient" class="portal-card">
                <div class="icon">👤</div>
                <h3>Patient Portal</h3>
                <p>Book appointments & records</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `)
})

// ============================================
// LOGIN PAGE
// ============================================
app.get('/login', (c) => {
  const role = c.req.query('role') || 'patient'
  
  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login - TeleMed AI</title>
      ${fontAwesome}
      ${baseStyles}
    </head>
    <body>
      <div class="login-container">
        <div class="login-card">
          <h1><i class="fas fa-heartbeat" style="color: #3b82f6;"></i> TeleMed AI</h1>
          <p class="subtitle">Sign in to your account</p>
          
          <div class="role-selector">
            <div class="role-option ${role === 'admin' ? 'selected' : ''}" onclick="selectRole('admin')">
              <div class="icon">👨‍💼</div>
              <div class="title">Admin</div>
            </div>
            <div class="role-option ${role === 'provider' ? 'selected' : ''}" onclick="selectRole('provider')">
              <div class="icon">👩‍⚕️</div>
              <div class="title">Provider</div>
            </div>
            <div class="role-option ${role === 'patient' ? 'selected' : ''}" onclick="selectRole('patient')">
              <div class="icon">👤</div>
              <div class="title">Patient</div>
            </div>
          </div>
          
          <form onsubmit="return handleLogin(event)">
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="email" placeholder="Enter your email">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="password" placeholder="Enter your password">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
              <i class="fas fa-sign-in-alt"></i> Sign In
            </button>
          </form>
          
          <div class="divider"><span>or</span></div>
          
          <button class="skip-btn" onclick="skipLogin()">
            <i class="fas fa-bolt"></i>
            Skip Login (Demo Mode)
          </button>
          
          <p style="text-align: center; margin-top: 20px; font-size: 13px; color: #6b7280;">
            Demo credentials auto-fill when you click Skip Login
          </p>
        </div>
      </div>
      
      <script>
        let selectedRole = '${role}';
        
        function selectRole(role) {
          selectedRole = role;
          document.querySelectorAll('.role-option').forEach(el => el.classList.remove('selected'));
          event.target.closest('.role-option').classList.add('selected');
        }
        
        function skipLogin() {
          // Redirect to appropriate dashboard based on selected role
          window.location.href = '/' + selectedRole;
        }
        
        function handleLogin(e) {
          e.preventDefault();
          // For demo, just redirect
          window.location.href = '/' + selectedRole;
          return false;
        }
      </script>
    </body>
    </html>
  `)
})

// ============================================
// ADMIN DASHBOARD
// ============================================
app.get('/admin', (c) => {
  const user = DEMO_USERS.admin
  const { stats, recentActivity, aiServices } = SAMPLE_DATA
  
  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Dashboard - TeleMed AI</title>
      ${fontAwesome}
      ${baseStyles}
    </head>
    <body>
      <div class="demo-banner">
        <i class="fas fa-flask"></i> DEMO MODE - Data resets periodically
      </div>
      
      <div class="sidebar">
        <div class="sidebar-header">
          <h1><i class="fas fa-heartbeat"></i> TeleMed AI</h1>
          <small style="opacity: 0.7;">Admin Console</small>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item active"><i class="fas fa-chart-pie"></i> Dashboard</a>
          <a class="nav-item" href="/admin/users"><i class="fas fa-users"></i> Users</a>
          <a class="nav-item" href="/admin/providers"><i class="fas fa-user-md"></i> Providers</a>
          <a class="nav-item" href="/admin/appointments"><i class="fas fa-calendar-alt"></i> Appointments</a>
          <a class="nav-item" href="/admin/ai"><i class="fas fa-robot"></i> AI Management</a>
          <a class="nav-item" href="/admin/analytics"><i class="fas fa-chart-line"></i> Analytics</a>
          <a class="nav-item" href="/admin/billing"><i class="fas fa-credit-card"></i> Billing</a>
          <a class="nav-item" href="/admin/audit"><i class="fas fa-file-alt"></i> Audit Logs</a>
          <a class="nav-item"><i class="fas fa-cog"></i> Settings</a>
          <a class="nav-item"><i class="fas fa-tools"></i> System</a>
          <div style="border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;"></div>
          <a class="nav-item" href="/"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </nav>
      </div>
      
      <div class="main-content" style="margin-top: 32px;">
        <div class="header">
          <h2>System Overview</h2>
          <div class="user-info">
            <span style="color: #6b7280;">Welcome back,</span>
            <strong>${user.name}</strong>
            <div class="user-avatar">${user.avatar}</div>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <h3><i class="fas fa-user-md" style="color: #3b82f6;"></i> Active Providers</h3>
            <div class="value">${stats.activeProviders}</div>
            <div class="change">↑ 2 online now</div>
          </div>
          <div class="stat-card">
            <h3><i class="fas fa-video" style="color: #10b981;"></i> Today's Consultations</h3>
            <div class="value">${stats.todayConsults}</div>
            <div class="change">↑ 12% from yesterday</div>
          </div>
          <div class="stat-card">
            <h3><i class="fas fa-brain" style="color: #8b5cf6;"></i> AI Analyses</h3>
            <div class="value">${stats.aiAnalyses}</div>
            <div class="change">↑ 23% this week</div>
          </div>
          <div class="stat-card">
            <h3><i class="fas fa-dollar-sign" style="color: #f59e0b;"></i> Revenue Today</h3>
            <div class="value">$${stats.revenue.toLocaleString()}</div>
            <div class="change">↑ 8% from avg</div>
          </div>
        </div>
        
        <div class="grid-2">
          <div class="card">
            <div class="card-header"><i class="fas fa-stream"></i> Real-Time Activity</div>
            <div class="card-body">
              ${recentActivity.map(activity => html`
                <div class="activity-item">
                  <span class="activity-time">${activity.time}</span>
                  <span class="activity-event">${activity.event}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div>
            <div class="card">
              <div class="card-header"><i class="fas fa-server"></i> AI Service Status</div>
              <div class="card-body">
                ${aiServices.map(service => html`
                  <div class="service-item">
                    <span>${service.name}</span>
                    <span class="status-badge status-${service.status}">${service.status}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="card">
              <div class="card-header"><i class="fas fa-microchip"></i> System Health</div>
              <div class="card-body">
                <div style="margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span>CPU Usage</span><span>67%</span>
                  </div>
                  <div class="progress-bar"><div class="progress-fill" style="width: 67%"></div></div>
                </div>
                <div style="margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span>Memory</span><span>45%</span>
                  </div>
                  <div class="progress-bar"><div class="progress-fill" style="width: 45%"></div></div>
                </div>
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span>Storage</span><span>32%</span>
                  </div>
                  <div class="progress-bar"><div class="progress-fill" style="width: 32%"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header"><i class="fas fa-rocket"></i> AI Upgrade Recommendations</div>
          <div class="card-body">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
              <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 12px;">
                <h4 style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">🔬 Deep Research Agent</h4>
                <p style="font-size: 13px; opacity: 0.8;">Enable AI-powered medical research for providers</p>
                <button class="btn" style="background: rgba(255,255,255,0.2); color: white; margin-top: 12px;">Enable</button>
              </div>
              <div style="background: linear-gradient(135deg, #f093fb, #f5576c); color: white; padding: 20px; border-radius: 12px;">
                <h4 style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">📸 Multi-Model Analysis</h4>
                <p style="font-size: 13px; opacity: 0.8;">Use multiple AI models for higher accuracy</p>
                <button class="btn" style="background: rgba(255,255,255,0.2); color: white; margin-top: 12px;">Configure</button>
              </div>
              <div style="background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 20px; border-radius: 12px;">
                <h4 style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">📊 Auto Reports</h4>
                <p style="font-size: 13px; opacity: 0.8;">Generate automated compliance reports</p>
                <button class="btn" style="background: rgba(255,255,255,0.2); color: white; margin-top: 12px;">Setup</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `)
})

// ============================================
// PROVIDER DASHBOARD
// ============================================
app.get('/provider', (c) => {
  const user = DEMO_USERS.provider
  const { todaySchedule, aiAlerts, patients } = SAMPLE_DATA
  
  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Provider Dashboard - TeleMed AI</title>
      ${fontAwesome}
      ${baseStyles}
    </head>
    <body>
      <div class="demo-banner">
        <i class="fas fa-flask"></i> DEMO MODE - Data resets periodically
      </div>
      
      <div class="sidebar">
        <div class="sidebar-header">
          <h1><i class="fas fa-heartbeat"></i> TeleMed AI</h1>
          <small style="opacity: 0.7;">Provider Console</small>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item active"><i class="fas fa-chart-pie"></i> Dashboard</a>
          <a class="nav-item" href="/provider/patients"><i class="fas fa-users"></i> My Patients</a>
          <a class="nav-item" href="/provider/schedule"><i class="fas fa-calendar-alt"></i> Schedule</a>
          <a class="nav-item" href="/provider/ai-tools"><i class="fas fa-robot"></i> AI Tools</a>
          <a class="nav-item" href="/provider/video"><i class="fas fa-video"></i> Video Consult</a>
          <a class="nav-item" href="/provider/records"><i class="fas fa-file-medical"></i> Records</a>
          <a class="nav-item" href="/provider/rx"><i class="fas fa-prescription"></i> Rx Pad</a>
          <a class="nav-item" href="/provider/stats"><i class="fas fa-chart-line"></i> My Stats</a>
          <a class="nav-item"><i class="fas fa-cog"></i> Settings</a>
          <div style="border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;"></div>
          <a class="nav-item" href="/"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </nav>
      </div>
      
      <div class="main-content" style="margin-top: 32px;">
        <div class="header">
          <h2>Good Morning, ${user.name.split(' ')[1]}! 👋</h2>
          <div class="user-info">
            <span class="status-badge status-online">● Online</span>
            <strong>${user.name}</strong>
            <div class="user-avatar">${user.avatar}</div>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <h3><i class="fas fa-calendar-check" style="color: #3b82f6;"></i> Today's Appointments</h3>
            <div class="value">8</div>
            <div class="change">3 completed, 5 remaining</div>
          </div>
          <div class="stat-card">
            <h3><i class="fas fa-brain" style="color: #8b5cf6;"></i> AI Assists Today</h3>
            <div class="value">12</div>
            <div class="change">4 image, 8 triage</div>
          </div>
          <div class="stat-card">
            <h3><i class="fas fa-clock" style="color: #10b981;"></i> Avg. Consult Time</h3>
            <div class="value">22m</div>
            <div class="change">↓ 3 min from avg</div>
          </div>
          <div class="stat-card">
            <h3><i class="fas fa-star" style="color: #f59e0b;"></i> Patient Rating</h3>
            <div class="value">4.9</div>
            <div class="change">Based on 156 reviews</div>
          </div>
        </div>
        
        <div class="grid-2">
          <div>
            <div class="card">
              <div class="card-header"><i class="fas fa-list-alt"></i> Today's Schedule - Dec 26</div>
              <div class="card-body">
                ${todaySchedule.map(apt => html`
                  <div class="schedule-item">
                    <span class="schedule-time">${apt.time}</span>
                    <div class="schedule-patient">
                      <strong>${apt.patient}</strong>
                      <div class="schedule-type">${apt.type}</div>
                    </div>
                    <span class="schedule-status status-${apt.status} ${apt.urgency === 'urgent' ? 'status-urgent' : ''}">${apt.status}</span>
                    ${apt.status === 'ready' ? html`<button class="btn btn-success" style="margin-left: 8px; padding: 6px 12px;"><i class="fas fa-video"></i> Start</button>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="card">
              <div class="card-header"><i class="fas fa-exclamation-triangle"></i> AI Alerts</div>
              <div class="card-body">
                ${aiAlerts.map(alert => html`
                  <div class="alert-item alert-${alert.severity}">
                    <span class="alert-icon">${alert.severity === 'warning' ? '⚠️' : 'ℹ️'}</span>
                    <div>
                      <strong>${alert.patient}</strong>
                      <div style="font-size: 13px; color: #6b7280;">${alert.message}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <div>
            <div class="ai-card" style="margin-bottom: 24px;">
              <h4>🤖 AI PRE-ANALYSIS READY</h4>
              <div class="title">Next Patient: Jane Smith</div>
              <span class="ai-confidence">Confidence: 87%</span>
              <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                <div style="font-size: 14px; margin-bottom: 8px;">Preliminary Assessment:</div>
                <div style="font-size: 13px; opacity: 0.9;">• Contact Dermatitis (82%)</div>
                <div style="font-size: 13px; opacity: 0.9;">• Eczema (12%)</div>
                <div style="font-size: 13px; opacity: 0.9;">• Other (6%)</div>
              </div>
              <button class="btn" style="background: rgba(255,255,255,0.2); color: white; width: 100%; justify-content: center;">
                <i class="fas fa-eye"></i> View Full Analysis
              </button>
            </div>
            
            <div class="card">
              <div class="card-header"><i class="fas fa-tools"></i> Quick AI Tools</div>
              <div class="card-body">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                  <button class="btn btn-secondary" onclick="openAITool('image')" style="flex-direction: column; padding: 16px;">
                    <i class="fas fa-camera" style="font-size: 24px; margin-bottom: 8px;"></i>
                    Image Analysis
                  </button>
                  <button class="btn btn-secondary" onclick="openAITool('symptom')" style="flex-direction: column; padding: 16px;">
                    <i class="fas fa-stethoscope" style="font-size: 24px; margin-bottom: 8px;"></i>
                    Symptom Check
                  </button>
                  <button class="btn btn-secondary" onclick="openAITool('drug')" style="flex-direction: column; padding: 16px;">
                    <i class="fas fa-pills" style="font-size: 24px; margin-bottom: 8px;"></i>
                    Drug Interaction
                  </button>
                  <button class="btn btn-secondary" onclick="openAITool('research')" style="flex-direction: column; padding: 16px;">
                    <i class="fas fa-book-medical" style="font-size: 24px; margin-bottom: 8px;"></i>
                    Research
                  </button>
                </div>
              </div>
            </div>
            
            <div class="card">
              <div class="card-header"><i class="fas fa-chart-bar"></i> Today's Stats</div>
              <div class="card-body">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span>Consultations</span><span><strong>3</strong> / 8</span>
                </div>
                <div class="progress-bar" style="margin-bottom: 16px;"><div class="progress-fill" style="width: 37.5%"></div></div>
                <div style="display: flex; justify-content: space-between;">
                  <div><span style="color: #6b7280;">Revenue</span><br><strong>$225</strong></div>
                  <div><span style="color: #6b7280;">Avg Duration</span><br><strong>22 min</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- AI Tool Modal -->
      <div id="ai-modal" class="modal-overlay" style="display: none;">
        <div class="modal">
          <div class="modal-header">
            <h3 id="modal-title">AI Tool</h3>
            <button class="modal-close" onclick="closeModal()">×</button>
          </div>
          <div id="modal-content"></div>
        </div>
      </div>
      
      <script>
        function openAITool(tool) {
          const modal = document.getElementById('ai-modal');
          const title = document.getElementById('modal-title');
          const content = document.getElementById('modal-content');
          
          switch(tool) {
            case 'image':
              title.innerHTML = '<i class="fas fa-camera"></i> AI Image Analysis';
              content.innerHTML = \`
                <div class="image-upload" onclick="document.getElementById('image-input').click()">
                  <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: #9ca3af; margin-bottom: 16px;"></i>
                  <div style="font-size: 16px; color: #374151; margin-bottom: 8px;">Drop medical image here or click to upload</div>
                  <div style="font-size: 13px; color: #9ca3af;">Supports: JPG, PNG, DICOM (max 10MB)</div>
                  <input type="file" id="image-input" style="display: none;" accept="image/*">
                </div>
                <div style="margin-top: 20px;">
                  <label style="font-weight: 500; margin-bottom: 8px; display: block;">Analysis Type:</label>
                  <select style="width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    <option>General Medical Analysis</option>
                    <option>Dermatology (Skin Conditions)</option>
                    <option>Radiology (X-Ray/CT)</option>
                    <option>Wound Assessment</option>
                  </select>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 20px; justify-content: center;">
                  <i class="fas fa-brain"></i> Analyze with AI
                </button>
              \`;
              break;
            case 'symptom':
              title.innerHTML = '<i class="fas fa-stethoscope"></i> AI Symptom Checker';
              content.innerHTML = \`
                <div class="chat-container">
                  <div class="chat-messages">
                    <div class="message ai">
                      <div class="bubble">Hello! I'm your AI medical assistant. Please describe the patient's symptoms, and I'll help with a preliminary assessment.</div>
                    </div>
                  </div>
                  <div class="chat-input">
                    <input type="text" placeholder="Describe symptoms..." id="symptom-input">
                    <button class="btn btn-primary"><i class="fas fa-paper-plane"></i></button>
                  </div>
                </div>
              \`;
              break;
            case 'drug':
              title.innerHTML = '<i class="fas fa-pills"></i> Drug Interaction Checker';
              content.innerHTML = \`
                <div style="margin-bottom: 16px;">
                  <label style="font-weight: 500; margin-bottom: 8px; display: block;">Current Medications:</label>
                  <textarea style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; min-height: 80px;" placeholder="Enter current medications, one per line..."></textarea>
                </div>
                <div style="margin-bottom: 16px;">
                  <label style="font-weight: 500; margin-bottom: 8px; display: block;">New Prescription:</label>
                  <input type="text" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;" placeholder="Enter medication to check...">
                </div>
                <button class="btn btn-primary" style="width: 100%; justify-content: center;">
                  <i class="fas fa-search"></i> Check Interactions
                </button>
              \`;
              break;
            case 'research':
              title.innerHTML = '<i class="fas fa-book-medical"></i> AI Research Assistant';
              content.innerHTML = \`
                <div style="margin-bottom: 16px;">
                  <label style="font-weight: 500; margin-bottom: 8px; display: block;">Research Query:</label>
                  <textarea style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; min-height: 100px;" placeholder="E.g., Latest treatment protocols for Type 2 Diabetes with cardiovascular comorbidity..."></textarea>
                </div>
                <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                  <button class="btn btn-secondary" style="flex: 1;">Clinical Studies</button>
                  <button class="btn btn-secondary" style="flex: 1;">Treatment Guidelines</button>
                  <button class="btn btn-secondary" style="flex: 1;">Case Studies</button>
                </div>
                <button class="btn btn-primary" style="width: 100%; justify-content: center;">
                  <i class="fas fa-search"></i> Deep Research
                </button>
              \`;
              break;
          }
          
          modal.style.display = 'flex';
        }
        
        function closeModal() {
          document.getElementById('ai-modal').style.display = 'none';
        }
        
        document.getElementById('ai-modal').addEventListener('click', function(e) {
          if (e.target === this) closeModal();
        });
      </script>
    </body>
    </html>
  `)
})

// ============================================
// PATIENT PORTAL
// ============================================
app.get('/patient', (c) => {
  const user = DEMO_USERS.patient
  
  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Patient Portal - TeleMed AI</title>
      ${fontAwesome}
      ${baseStyles}
    </head>
    <body>
      <div class="demo-banner">
        <i class="fas fa-flask"></i> DEMO MODE - Data resets periodically
      </div>
      
      <div class="sidebar">
        <div class="sidebar-header">
          <h1><i class="fas fa-heartbeat"></i> TeleMed AI</h1>
          <small style="opacity: 0.7;">Patient Portal</small>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item active"><i class="fas fa-home"></i> Dashboard</a>
          <a class="nav-item"><i class="fas fa-calendar-plus"></i> Book Appointment</a>
          <a class="nav-item"><i class="fas fa-calendar-alt"></i> My Appointments</a>
          <a class="nav-item"><i class="fas fa-comment-medical"></i> Symptom Checker</a>
          <a class="nav-item"><i class="fas fa-file-medical"></i> Medical Records</a>
          <a class="nav-item"><i class="fas fa-prescription"></i> Prescriptions</a>
          <a class="nav-item"><i class="fas fa-video"></i> Video Consultation</a>
          <a class="nav-item"><i class="fas fa-user"></i> My Profile</a>
          <a class="nav-item"><i class="fas fa-cog"></i> Settings</a>
          <div style="border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;"></div>
          <a class="nav-item" href="/"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </nav>
      </div>
      
      <div class="main-content" style="margin-top: 32px;">
        <div class="header">
          <h2>Welcome back, ${user.name}! 👋</h2>
          <div class="user-info">
            <strong>${user.name}</strong>
            <div class="user-avatar">${user.avatar}</div>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <h3><i class="fas fa-calendar-check" style="color: #3b82f6;"></i> Next Appointment</h3>
            <div class="value" style="font-size: 20px;">Tomorrow 10AM</div>
            <div class="change">Dr. Sarah Smith</div>
          </div>
          <div class="stat-card">
            <h3><i class="fas fa-file-medical" style="color: #10b981;"></i> Medical Records</h3>
            <div class="value">12</div>
            <div class="change">Last updated Dec 20</div>
          </div>
          <div class="stat-card">
            <h3><i class="fas fa-prescription" style="color: #8b5cf6;"></i> Active Prescriptions</h3>
            <div class="value">3</div>
            <div class="change">1 refill needed</div>
          </div>
          <div class="stat-card">
            <h3><i class="fas fa-heart" style="color: #ef4444;"></i> Health Score</h3>
            <div class="value">85</div>
            <div class="change">↑ 5 from last month</div>
          </div>
        </div>
        
        <div class="grid-2">
          <div class="card">
            <div class="card-header"><i class="fas fa-calendar"></i> Upcoming Appointments</div>
            <div class="card-body">
              <div class="schedule-item" style="background: #eff6ff;">
                <span class="schedule-time">Tomorrow<br>10:00 AM</span>
                <div class="schedule-patient">
                  <strong>Dr. Sarah Smith</strong>
                  <div class="schedule-type">Annual checkup & blood pressure follow-up</div>
                </div>
                <button class="btn btn-primary" style="padding: 6px 12px;"><i class="fas fa-video"></i> Join</button>
              </div>
              <div class="schedule-item">
                <span class="schedule-time">Dec 30<br>2:00 PM</span>
                <div class="schedule-patient">
                  <strong>Dr. Michael Johnson</strong>
                  <div class="schedule-type">Dermatology follow-up</div>
                </div>
                <button class="btn btn-secondary" style="padding: 6px 12px;">Reschedule</button>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header"><i class="fas fa-robot"></i> AI Health Assistant</div>
            <div class="card-body">
              <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                <h4 style="margin-bottom: 8px;">🤖 Quick Symptom Check</h4>
                <p style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">Describe your symptoms and get AI-powered guidance on next steps.</p>
                <button class="btn" style="background: rgba(255,255,255,0.2); color: white;">
                  <i class="fas fa-comment-medical"></i> Start Chat
                </button>
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <button class="btn btn-secondary" style="flex-direction: column; padding: 16px;">
                  <i class="fas fa-camera" style="font-size: 20px; margin-bottom: 4px;"></i>
                  Scan Skin Issue
                </button>
                <button class="btn btn-secondary" style="flex-direction: column; padding: 16px;">
                  <i class="fas fa-heart" style="font-size: 20px; margin-bottom: 4px;"></i>
                  Check Vitals
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header"><i class="fas fa-notes-medical"></i> Recent Health Summary</div>
          <div class="card-body">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
              <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 12px;">
                <div style="font-size: 36px; margin-bottom: 8px;">💉</div>
                <div style="font-weight: 600;">Blood Pressure</div>
                <div style="font-size: 24px; color: #10b981; font-weight: 700;">128/82</div>
                <div style="font-size: 12px; color: #6b7280;">Slightly elevated</div>
              </div>
              <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 12px;">
                <div style="font-size: 36px; margin-bottom: 8px;">🩸</div>
                <div style="font-weight: 600;">Blood Sugar</div>
                <div style="font-size: 24px; color: #10b981; font-weight: 700;">95 mg/dL</div>
                <div style="font-size: 12px; color: #6b7280;">Normal range</div>
              </div>
              <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 12px;">
                <div style="font-size: 36px; margin-bottom: 8px;">⚖️</div>
                <div style="font-weight: 600;">Weight</div>
                <div style="font-size: 24px; color: #3b82f6; font-weight: 700;">172 lbs</div>
                <div style="font-size: 12px; color: #6b7280;">BMI: 24.1 (Normal)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `)
})

// ============================================
// API ENDPOINTS
// ============================================
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/demo-users', (c) => {
  return c.json(DEMO_USERS)
})

app.get('/api/stats', (c) => {
  return c.json(SAMPLE_DATA.stats)
})

app.get('/api/schedule', (c) => {
  return c.json(SAMPLE_DATA.todaySchedule)
})

app.get('/api/patients', (c) => {
  return c.json(SAMPLE_DATA.patients)
})

app.get('/api/ai-services', (c) => {
  return c.json(SAMPLE_DATA.aiServices)
})

// AI Analysis endpoint (placeholder)
app.post('/api/ai/analyze-image', async (c) => {
  return c.json({
    success: true,
    analysis: {
      condition: 'Contact Dermatitis',
      confidence: 0.87,
      differential: ['Eczema', 'Psoriasis', 'Allergic Reaction'],
      recommendations: [
        'Apply topical corticosteroid',
        'Avoid irritants',
        'Consider patch testing if symptoms persist'
      ]
    }
  })
})

app.post('/api/ai/symptom-triage', async (c) => {
  const body = await c.req.json()
  return c.json({
    success: true,
    triage: {
      urgencyScore: 3,
      category: 'routine',
      possibleConditions: ['Tension Headache', 'Stress-related', 'Dehydration'],
      recommendedAction: 'Schedule routine consultation within 48 hours',
      redFlags: false
    }
  })
})

export default app
