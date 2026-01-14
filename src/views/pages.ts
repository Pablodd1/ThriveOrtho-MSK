import { html, sidebar, rightPanel } from './layout';

export const loginPage = () => html(`
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
  `, 'Login - Thrive Ortho EHR');

export const dashboardPage = () => html(`
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
              <tr><th>Patient</th><th>Condition</th><th>Focus</th><th>FMS</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              <tr>
                <td><div class="flex items-center gap-1"><div class="avatar">MW</div><div><strong>Marcus Williams</strong><div class="text-muted text-sm">52 y/o M</div></div></div></td>
                <td><span class="badge badge-warning">Obesity</span></td>
                <td>Knee, Hip, Gait</td>
                <td><span style="font-weight: 700; color: var(--error);">10</span>/21</td>
                <td><span class="badge badge-danger">High Risk</span></td>
                <td class="text-right"><a href="/doctor/joints?patient=P001" class="btn btn-sm btn-primary"><i class="fas fa-bone"></i></a></td>
              </tr>
              <tr>
                <td><div class="flex items-center gap-1"><div class="avatar">PC</div><div><strong>Patricia Chen</strong><div class="text-muted text-sm">61 y/o F</div></div></div></td>
                <td><span class="badge badge-info">Diabetes</span></td>
                <td>Balance, Feet, Gait</td>
                <td><span style="font-weight: 700; color: var(--error);">11</span>/21</td>
                <td><span class="badge badge-danger">High Risk</span></td>
                <td class="text-right"><a href="/doctor/joints?patient=P002" class="btn btn-sm btn-primary"><i class="fas fa-bone"></i></a></td>
              </tr>
              <tr>
                <td><div class="flex items-center gap-1"><div class="avatar">JR</div><div><strong>James Rodriguez</strong><div class="text-muted text-sm">58 y/o M</div></div></div></td>
                <td><span class="badge badge-warning">Pre-Op Knee</span></td>
                <td>Knee ROM, Quad</td>
                <td><span style="font-weight: 700; color: var(--error);">9</span>/21</td>
                <td><span class="badge badge-warning">Pre-Surgery</span></td>
                <td class="text-right"><a href="/doctor/joints?patient=P003" class="btn btn-sm btn-primary"><i class="fas fa-bone"></i></a></td>
              </tr>
              <tr>
                <td><div class="flex items-center gap-1"><div class="avatar">LT</div><div><strong>Linda Thompson</strong><div class="text-muted text-sm">67 y/o F</div></div></div></td>
                <td><span class="badge badge-success">Post-Op Hip</span></td>
                <td>Hip ROM, Gait, Balance</td>
                <td><span style="font-weight: 700; color: var(--warning);">13</span>/21</td>
                <td><span class="badge badge-info">Rehab</span></td>
                <td class="text-right"><a href="/doctor/joints?patient=P004" class="btn btn-sm btn-primary"><i class="fas fa-bone"></i></a></td>
              </tr>
              <tr>
                <td><div class="flex items-center gap-1"><div class="avatar">DP</div><div><strong>David Park</strong><div class="text-muted text-sm">45 y/o M</div></div></div></td>
                <td><span class="badge badge-neutral">Screening</span></td>
                <td>Full Body, FMS</td>
                <td><span style="font-weight: 700; color: var(--success);">17</span>/21</td>
                <td><span class="badge badge-success">Low Risk</span></td>
                <td class="text-right"><a href="/doctor/joints?patient=P005" class="btn btn-sm btn-ghost"><i class="fas fa-bone"></i></a></td>
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
                  <div class="task-title">Pre-op knee eval - James Rodriguez</div>
                  <div class="task-meta">Due: Today • TKA scheduled 01/15</div>
                </div>
              </li>
              <li class="task-item">
                <div class="task-priority high"></div>
                <div class="task-check" onclick="toggleTask(this)"><i class="fas fa-check"></i></div>
                <div class="task-content">
                  <div class="task-title">Fall risk assessment - Patricia Chen</div>
                  <div class="task-meta">Due: Today • Diabetic neuropathy</div>
                </div>
              </li>
              <li class="task-item">
                <div class="task-priority medium"></div>
                <div class="task-check" onclick="toggleTask(this)"><i class="fas fa-check"></i></div>
                <div class="task-content">
                  <div class="task-title">Post-op hip progress - Linda Thompson</div>
                  <div class="task-meta">Due: Today • 4 weeks post THR</div>
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
  `, 'Dashboard - Thrive Ortho EHR');

export const intakePage = () => html(`
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

    <script src="/static/js/intake.js"></script>
  `, 'Voice Intake - Thrive Ortho EHR');

export const notesPage = () => html(`
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
            <strong>Patient:</strong> <span id="summaryPatient">Select Patient</span><br>
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
              patient: JSON.parse(sessionStorage.getItem('currentPatient') || '{}'),
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
  `, 'Medical Notes - Thrive Ortho EHR');

export const jointsPage = () => html(`
    <div class="app">
      <!-- HEADER -->
      <header class="header">
        <div class="header-left">
          <a href="/doctor" class="back-btn">← Back</a>
          <div class="logo">🦴 MSK Assessment</div>
        </div>

        <div class="header-center">
          <div class="exercise-badge" id="exerciseBadge">Ready</div>
          <div class="progress-pills" id="progressPills">
            <div class="progress-pill"></div>
            <div class="progress-pill"></div>
            <div class="progress-pill"></div>
            <div class="progress-pill"></div>
            <div class="progress-pill"></div>
            <div class="progress-pill"></div>
          </div>
        </div>

        <div class="header-right">
          <div class="mic-status">
            <div class="mic-dot" id="micDot"></div>
            <span id="micLabel">MIC OFF</span>
          </div>
        </div>
      </header>

      <!-- CAMERA SECTION -->
      <section class="camera-section">
        <video id="video" autoplay playsinline muted></video>
        <canvas id="canvas"></canvas>

        <!-- Rep Counter -->
        <div class="rep-overlay" id="repOverlay" style="display:none;">
          <div class="rep-label">REPS</div>
          <div class="rep-count" id="repCount">0</div>
          <div class="rep-target" id="repTarget">/ 5</div>
          <div class="rep-bar">
            <div class="rep-fill" id="repFill" style="width:0%"></div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="instruction-overlay" id="instructionOverlay" style="display:none;">
          <div class="instruction-title" id="instructionTitle">Deep Squat</div>
          <div class="instruction-desc" id="instructionDesc">Squat down keeping heels on ground, then stand up</div>
        </div>

        <!-- Alerts -->
        <div class="alerts-container" id="alertsContainer"></div>

        <!-- Start Screen -->
        <div class="start-screen" id="startScreen">
          <div class="start-icon">🎯</div>
          <div class="start-title">MSK Assessment</div>
          <div class="start-desc">
            6 guided exercises with real-time joint tracking.
            Voice instructions will guide you through each movement.
          </div>
        </div>

        <!-- Complete Screen -->
        <div class="complete-screen" id="completeScreen">
          <div class="complete-icon">✅</div>
          <div class="complete-title">Assessment Complete!</div>
          <div class="complete-stats">
            <div class="stat-box">
              <div class="stat-value" id="statExercises">0</div>
              <div class="stat-label">Exercises</div>
            </div>
            <div class="stat-box">
              <div class="stat-value" id="statReps">0</div>
              <div class="stat-label">Total Reps</div>
            </div>
            <div class="stat-box">
              <div class="stat-value" id="statFlags">0</div>
              <div class="stat-label">Red Flags</div>
            </div>
          </div>
          <button class="btn btn-success" id="generateBtn" style="width:300px;">
            📋 Generate Medical Report
          </button>
        </div>
      </section>

      <!-- ANGLES DASHBOARD - Real-Time Clinical Data -->
      <aside class="dashboard">
        <div class="dashboard-header">
          <div class="dashboard-title">📊 Joint Angles</div>
          <div class="fps-badge" id="fpsBadge">-- FPS</div>
        </div>

        <!-- Live Data Indicator -->
        <div class="live-data-indicator" id="liveIndicator" style="display: none;">
          <div class="live-dot"></div>
          <span>LIVE DATA - Recording for Medical Note</span>
          <span class="record-timestamp" id="recordTime">00:00</span>
        </div>

        <div class="angles-grid" id="anglesGrid">
          <!-- Primary tracked joint (large) -->
          <div class="angle-card primary" id="primaryAngle">
            <span class="range-status-badge" id="primaryRangeBadge">--</span>
            <div class="angle-name" id="primaryName">KNEE</div>
            <div>
              <span class="angle-value" id="primaryValue">--</span>
              <span class="angle-unit">°</span>
            </div>
            <div class="angle-lr">
              <span id="primaryL">L: --°</span>
              <span id="primaryR">R: --°</span>
              <span class="angle-delta ok" id="primaryDelta">Δ 0°</span>
            </div>
            <div class="rom-range-bar">
              <div class="rom-range-fill" id="primaryRangeFill" style="width: 0%"></div>
            </div>
            <div class="rom-range-text" id="primaryRangeText">Normal: --° | Min: --°</div>
            <div class="angle-status">
              <div class="status-dot stable" id="primaryStatus"></div>
              <span id="primaryStatusText">Stable</span>
            </div>
          </div>

          <!-- Secondary joints with ROM indicators -->
          <div class="angle-card" id="kneeCard">
            <span class="range-status-badge" id="kneeRangeBadge">--</span>
            <div class="angle-name">KNEE FLEX</div>
            <div>
              <span class="angle-value" id="kneeValue">--</span>
              <span class="angle-unit">°</span>
            </div>
            <div class="rom-range-bar">
              <div class="rom-range-fill" id="kneeRangeFill" style="width: 0%"></div>
            </div>
            <div class="rom-range-text" id="kneeRangeText">Normal: 140° | Min: 120°</div>
          </div>

          <div class="angle-card" id="hipCard">
            <span class="range-status-badge" id="hipRangeBadge">--</span>
            <div class="angle-name">HIP FLEX</div>
            <div>
              <span class="angle-value" id="hipValue">--</span>
              <span class="angle-unit">°</span>
            </div>
            <div class="rom-range-bar">
              <div class="rom-range-fill" id="hipRangeFill" style="width: 0%"></div>
            </div>
            <div class="rom-range-text" id="hipRangeText">Normal: 120° | Min: 90°</div>
          </div>

          <div class="angle-card" id="shoulderCard">
            <span class="range-status-badge" id="shoulderRangeBadge">--</span>
            <div class="angle-name">SHOULDER</div>
            <div>
              <span class="angle-value" id="shoulderValue">--</span>
              <span class="angle-unit">°</span>
            </div>
            <div class="rom-range-bar">
              <div class="rom-range-fill" id="shoulderRangeFill" style="width: 0%"></div>
            </div>
            <div class="rom-range-text" id="shoulderRangeText">Normal: 180° | Min: 150°</div>
          </div>

          <div class="angle-card" id="elbowCard">
            <span class="range-status-badge" id="elbowRangeBadge">--</span>
            <div class="angle-name">ELBOW</div>
            <div>
              <span class="angle-value" id="elbowValue">--</span>
              <span class="angle-unit">°</span>
            </div>
            <div class="rom-range-bar">
              <div class="rom-range-fill" id="elbowRangeFill" style="width: 0%"></div>
            </div>
            <div class="rom-range-text" id="elbowRangeText">Normal: 150° | Min: 130°</div>
          </div>
        </div>

        <div class="controls">
          <div class="error-display" id="errorDisplay"></div>

          <select id="cameraSelect">
            <option value="">Loading cameras...</option>
          </select>

          <div class="control-row">
            <button class="btn btn-primary" id="startBtn" disabled>
              🎬 Start Assessment
            </button>
          </div>

          <div class="control-row" id="activeControls" style="display:none;">
            <button class="btn btn-secondary" id="skipBtn">⏭ Skip</button>
            <button class="btn btn-secondary" id="muteBtn">🔊 Mute</button>
            <button class="btn btn-danger" id="stopBtn">⏹ Stop</button>
          </div>

          <div class="control-row" id="completeControls" style="display:none;">
            <button class="btn btn-secondary" id="restartBtn">🔄 Restart</button>
            <button class="btn btn-success" id="reportBtn">📋 Report</button>
          </div>
        </div>
      </aside>
    </div>

    <!-- MediaPipe Holistic -->
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
    <script src="/static/js/assessment.js"></script>
  `, 'MSK Assessment - Thrive Ortho EHR');
