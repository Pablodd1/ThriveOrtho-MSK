import { demoUsers, demoPatients } from '../data';

export const html = (content: string, title = 'Thrive Ortho EHR') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <link href="/static/css/main.css" rel="stylesheet">
</head>
<body>${content}</body>
</html>
`

export const sidebar = (role: string, active: string) => {
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

export const rightPanel = (data: any = {}) => {
  const patient = data.patient || demoPatients[0];
  const fmsScore = data.fmsScore ?? patient.fms ?? null;
  const riskLevel = fmsScore <= 11 ? 'High Risk' : fmsScore <= 14 ? 'Moderate' : fmsScore ? 'Low Risk' : 'Not Scored';
  const riskClass = fmsScore <= 11 ? 'badge-danger' : fmsScore <= 14 ? 'badge-warning' : fmsScore ? 'badge-success' : 'badge-neutral';

  return `
  <aside class="panel">
    <div class="panel-section">
      <div class="panel-label">Assessment Score</div>
      <div class="score-display">
        <div class="score-value" id="fmsScore">${fmsScore ?? '--'}</div>
        <div class="score-label">of 21 points (FMS)</div>
      </div>
      <div class="mt-1 text-center">
        <span class="badge ${riskClass}" id="riskBadge">${riskLevel}</span>
      </div>
    </div>

    <div class="panel-section">
      <div class="panel-label">Current Patient</div>
      <div class="panel-card">
        <div class="flex items-center gap-1 mb-1">
          <div class="avatar">${patient.avatar}</div>
          <div>
            <div class="user-name">${patient.name}</div>
            <div class="user-meta">${patient.age} y/o ${patient.gender}</div>
          </div>
        </div>
        <div class="text-sm" style="margin-top: 6px; padding-top: 6px; border-top: 1px solid var(--gray-200);">
          <strong>Condition:</strong> ${patient.condition}<br>
          <strong>CC:</strong> ${patient.cc}
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
`}
