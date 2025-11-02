import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

// Type definitions for Cloudflare D1 and environment variables
type Bindings = {
  DB: D1Database
  GEMINI_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files from public/static directory
app.use('/static/*', serveStatic({ root: './public' }))

// ============================================
// HOME PAGE
// ============================================
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ThriveOrtho - Made by Humans, Powered by AI</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'brand-blue': '#0066CC',
                  'brand-green': '#00C851'
                }
              }
            }
          }
        </script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/glassmorphism.css" rel="stylesheet">
        <style>
            body {
                background: #ffffff;
                min-height: 100vh;
            }
        </style>
    </head>
    <body>
        <div class="min-h-screen">
            <!-- Header with Glassmorphism -->
            <header class="glass-header sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 py-4 md:py-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <img src="/static/logo.svg" alt="ThriveOrtho" class="h-12 md:h-14 logo-glow">
                        </div>
                        <div class="flex items-center space-x-3">
                            <a href="/static/patient-portal.html" class="glass-btn glass-btn-secondary glass-btn-sm">
                                <i class="fas fa-user mr-2"></i>
                                <span class="hidden md:inline">Patient</span> Login
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="max-w-7xl mx-auto px-4 py-8 md:py-16">
                
                <!-- Hero Section -->
                <div class="text-center mb-12">
                    <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Physical Therapy Platform
                    </h1>
                    <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        AI-powered assessments, automated documentation, and patient engagement
                    </p>
                </div>
                
                <!-- Quick Actions -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <!-- Patient Intake -->
                    <a href="/static/intake.html" class="glass-card glass-lift block">
                        <div class="text-center">
                            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                <i class="fas fa-user-plus text-2xl text-white"></i>
                            </div>
                            <h2 class="text-2xl font-bold text-gray-800 mb-2">New Patient</h2>
                            <p class="text-gray-600 mb-4">Start patient intake and demographic information</p>
                            <button class="glass-btn glass-btn-success glass-btn-sm w-full">
                                Get Started <i class="fas fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    </a>

                    <!-- Dashboard -->
                    <a href="/static/dashboard.html" class="glass-card glass-lift block">
                        <div class="text-center">
                            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                <i class="fas fa-video text-2xl text-white"></i>
                            </div>
                            <h2 class="text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
                            <p class="text-gray-600 mb-4">View all patients and manage assessments</p>
                            <button class="glass-btn glass-btn-primary glass-btn-sm w-full">
                                View Dashboard <i class="fas fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    </a>

                    <!-- RPM Monitoring -->
                    <a href="/static/clinician-analytics.html" class="glass-card glass-lift block">
                        <div class="text-center">
                            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                                <i class="fas fa-chart-line text-2xl text-white"></i>
                            </div>
                            <h2 class="text-2xl font-bold text-gray-800 mb-2">Analytics</h2>
                            <p class="text-gray-600 mb-4">Track patient engagement and outcomes</p>
                            <button class="glass-btn glass-btn-primary glass-btn-sm w-full">
                                View Reports <i class="fas fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    </a>
                </div>

                <!-- Features -->
                <div class="bg-gray-50 rounded-lg p-8 mb-12">
                    <h3 class="text-3xl font-bold text-gray-800 mb-8 text-center">
                        System Features
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="flex items-start">
                            <div class="bg-brand-blue w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
                                <i class="fas fa-camera"></i>
                            </div>
                            <div class="ml-5">
                                <h4 class="font-bold text-gray-800 text-lg mb-2">AI Movement Analysis</h4>
                                <p class="text-gray-600">Camera-based skeleton tracking with MediaPipe (33 joints)</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="bg-brand-green w-12 h-12 rounded-lg flex items-center justify-center text-brand-blue text-xl flex-shrink-0">
                                <i class="fas fa-dumbbell"></i>
                            </div>
                            <div class="ml-5">
                                <h4 class="font-bold text-gray-800 text-lg mb-2">Exercise Programs</h4>
                                <p class="text-gray-600">17 therapeutic exercises targeting identified deficiencies</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="bg-brand-blue w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
                                <i class="fas fa-clipboard-check"></i>
                            </div>
                            <div class="ml-5">
                                <h4 class="font-bold text-gray-800 text-lg mb-2">Compliance Tracking</h4>
                                <p class="text-gray-600">Monitor patient adherence with detailed session logs</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="bg-brand-green w-12 h-12 rounded-lg flex items-center justify-center text-brand-blue text-xl flex-shrink-0">
                                <i class="fas fa-file-medical"></i>
                            </div>
                            <div class="ml-5">
                                <h4 class="font-bold text-gray-800 text-lg mb-2">RPM Billing Support</h4>
                                <p class="text-gray-600">Automatic CPT code tracking for reimbursement</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Workflow Overview -->
                <div class="bg-white border-2 border-gray-200 rounded-lg p-10">
                    <h3 class="text-3xl font-bold text-gray-800 mb-10 text-center">
                        Assessment Workflow
                    </h3>
                    <div class="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-4">
                        <div class="text-center flex-1">
                            <div class="bg-brand-blue w-16 h-16 mx-auto rounded-lg flex items-center justify-center text-2xl text-white font-bold">1</div>
                            <h4 class="font-bold mt-3 text-gray-800 text-base">Patient Intake</h4>
                            <p class="text-sm text-gray-600 mt-1">Demographics & Medical History</p>
                        </div>
                        <i class="fas fa-arrow-right text-gray-400 text-2xl hidden md:block"></i>
                        <div class="text-center flex-1">
                            <div class="bg-brand-green w-16 h-16 mx-auto rounded-lg flex items-center justify-center text-2xl text-brand-blue font-bold">2</div>
                            <h4 class="font-bold mt-3 text-gray-800 text-base">Movement Assessment</h4>
                            <p class="text-sm text-gray-600 mt-1">Camera-based Tracking</p>
                        </div>
                        <i class="fas fa-arrow-right text-gray-400 text-2xl hidden md:block"></i>
                        <div class="text-center flex-1">
                            <div class="bg-brand-blue w-16 h-16 mx-auto rounded-lg flex items-center justify-center text-2xl text-white font-bold">3</div>
                            <h4 class="font-bold mt-3 text-gray-800 text-base">AI Analysis</h4>
                            <p class="text-sm text-gray-600 mt-1">Biomechanical Deficiencies</p>
                        </div>
                        <i class="fas fa-arrow-right text-gray-400 text-2xl hidden md:block"></i>
                        <div class="text-center flex-1">
                            <div class="bg-brand-green w-16 h-16 mx-auto rounded-lg flex items-center justify-center text-2xl text-brand-blue font-bold">4</div>
                            <h4 class="font-bold mt-3 text-gray-800 text-base">Exercise Prescription</h4>
                            <p class="text-sm text-gray-600 mt-1">Personalized Programs</p>
                        </div>
                        <i class="fas fa-arrow-right text-gray-400 text-2xl hidden md:block"></i>
                        <div class="text-center flex-1">
                            <div class="bg-brand-blue w-16 h-16 mx-auto rounded-lg flex items-center justify-center text-2xl text-white font-bold">5</div>
                            <h4 class="font-bold mt-3 text-gray-800 text-base">RPM Monitoring</h4>
                            <p class="text-sm text-gray-600 mt-1">Compliance & Billing</p>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Footer -->
            <footer class="bg-gray-100 mt-20 py-10">
                <div class="max-w-7xl mx-auto px-4 text-center">
                    <p class="text-lg font-semibold text-gray-800">&copy; 2025 ThriveOrtho. All rights reserved.</p>
                    <p class="text-gray-600 text-sm mt-2">Made by Humans, Powered by AI</p>
                    <div class="mt-4 flex justify-center space-x-6">
                        <i class="fas fa-shield-alt text-brand-blue text-xl"></i>
                        <i class="fas fa-lock text-brand-blue text-xl"></i>
                        <i class="fas fa-check-circle text-brand-green text-xl"></i>
                    </div>
                </div>
            </footer>
        </div>
    </body>
    </html>
  `)
})

// ============================================
// API: PATIENTS
// ============================================

// Get all patients
app.get('/api/patients', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM patients ORDER BY created_at DESC
    `).all()
    
    return c.json({ success: true, data: results })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Get single patient
app.get('/api/patients/:id', async (c) => {
  try {
    const patientId = c.req.param('id')
    const patient = await c.env.DB.prepare(`
      SELECT * FROM patients WHERE id = ?
    `).bind(patientId).first()
    
    if (!patient) {
      return c.json({ success: false, error: 'Patient not found' }, 404)
    }
    
    return c.json({ success: true, data: patient })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Create patient
app.post('/api/patients', async (c) => {
  try {
    const patient = await c.req.json()
    
    const result = await c.env.DB.prepare(`
      INSERT INTO patients (
        first_name, last_name, date_of_birth, gender, email, phone,
        address_line1, address_line2, city, state, zip_code,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
        primary_physician, insurance_provider, insurance_policy_number,
        medical_history, current_medications, allergies,
        assessment_reason, chief_complaint, pain_scale, activity_level,
        height_cm, weight_kg
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      patient.first_name,
      patient.last_name,
      patient.date_of_birth,
      patient.gender?.toLowerCase() || null,
      patient.email || null,
      patient.phone || null,
      patient.address_line1 || null,
      patient.address_line2 || null,
      patient.city || null,
      patient.state || null,
      patient.zip_code || null,
      patient.emergency_contact_name || null,
      patient.emergency_contact_phone || null,
      patient.emergency_contact_relationship || null,
      patient.primary_physician || null,
      patient.insurance_provider || null,
      patient.insurance_policy_number || null,
      JSON.stringify(patient.medical_history || {}),
      JSON.stringify(patient.current_medications || []),
      JSON.stringify(patient.allergies || []),
      patient.assessment_reason || null,
      patient.chief_complaint || null,
      patient.pain_scale || null,
      patient.activity_level || null,
      patient.height_cm || null,
      patient.weight_kg || null
    ).run()
    
    return c.json({ 
      success: true, 
      data: { 
        id: result.meta.last_row_id,
        ...patient 
      } 
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ============================================
// API: ASSESSMENTS
// ============================================

// Get all assessments for a patient
app.get('/api/patients/:id/assessments', async (c) => {
  try {
    const patientId = c.req.param('id')
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM assessments WHERE patient_id = ? ORDER BY assessment_date DESC
    `).bind(patientId).all()
    
    return c.json({ success: true, data: results })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Get single assessment with all details
app.get('/api/assessments/:id', async (c) => {
  try {
    const assessmentId = c.req.param('id')
    
    const assessment = await c.env.DB.prepare(`
      SELECT * FROM assessments WHERE id = ?
    `).bind(assessmentId).first()
    
    if (!assessment) {
      return c.json({ success: false, error: 'Assessment not found' }, 404)
    }
    
    const { results: tests } = await c.env.DB.prepare(`
      SELECT * FROM movement_tests WHERE assessment_id = ? ORDER BY test_order
    `).bind(assessmentId).all()
    
    return c.json({ 
      success: true, 
      data: {
        assessment,
        tests
      }
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Create assessment
app.post('/api/assessments', async (c) => {
  try {
    const assessment = await c.req.json()
    
    const result = await c.env.DB.prepare(`
      INSERT INTO assessments (
        patient_id, clinician_id, assessment_type, status
      ) VALUES (?, ?, ?, ?)
    `).bind(
      assessment.patient_id,
      assessment.clinician_id || 1,
      assessment.assessment_type || 'initial',
      'in_progress'
    ).run()
    
    return c.json({ 
      success: true, 
      data: { 
        id: result.meta.last_row_id,
        ...assessment,
        status: 'in_progress'
      } 
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Complete assessment
app.put('/api/assessments/:id/complete', async (c) => {
  try {
    const assessmentId = c.req.param('id')
    const { overall_score, clinical_notes, recommendations } = await c.req.json()
    
    await c.env.DB.prepare(`
      UPDATE assessments 
      SET status = 'completed', 
          completed_at = CURRENT_TIMESTAMP,
          overall_score = ?,
          clinical_notes = ?,
          recommendations = ?
      WHERE id = ?
    `).bind(
      overall_score,
      clinical_notes,
      JSON.stringify(recommendations),
      assessmentId
    ).run()
    
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ============================================
// API: MOVEMENT TESTS
// ============================================

// Create movement test
app.post('/api/assessments/:id/tests', async (c) => {
  try {
    const assessmentId = c.req.param('id')
    const test = await c.req.json()
    
    const result = await c.env.DB.prepare(`
      INSERT INTO movement_tests (
        assessment_id, test_name, test_category, test_order, instructions, status
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      assessmentId,
      test.test_name,
      test.test_category,
      test.test_order || 1,
      test.instructions,
      'pending'
    ).run()
    
    return c.json({ 
      success: true, 
      data: { id: result.meta.last_row_id } 
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Update test with skeleton data and analysis
app.put('/api/tests/:id/analyze', async (c) => {
  try {
    const testId = c.req.param('id')
    const { skeleton_data, camera_type } = await c.req.json()
    
    await c.env.DB.prepare(`
      UPDATE movement_tests 
      SET skeleton_data = ?, 
          camera_type = ?,
          status = 'completed', 
          completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      JSON.stringify(skeleton_data),
      camera_type || 'webcam',
      testId
    ).run()
    
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ============================================
// API: EXERCISES
// ============================================

// Get all exercises
app.get('/api/exercises', async (c) => {
  try {
    const category = c.req.query('category')
    
    let query = 'SELECT * FROM exercises'
    const params: any[] = []
    
    if (category) {
      query += ' WHERE category = ?'
      params.push(category)
    }
    
    query += ' ORDER BY category, name'
    
    const { results } = await c.env.DB.prepare(query).bind(...params).all()
    
    return c.json({ success: true, data: results })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Get single exercise
app.get('/api/exercises/:id', async (c) => {
  try {
    const exerciseId = c.req.param('id')
    const exercise = await c.env.DB.prepare(`
      SELECT * FROM exercises WHERE id = ?
    `).bind(exerciseId).first()
    
    if (!exercise) {
      return c.json({ success: false, error: 'Exercise not found' }, 404)
    }
    
    return c.json({ success: true, data: exercise })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ============================================
// API: PRESCRIPTIONS
// ============================================

// Get all prescriptions for a patient
app.get('/api/patients/:id/prescriptions', async (c) => {
  try {
    const patientId = c.req.param('id')
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY created_at DESC
    `).bind(patientId).all()
    
    return c.json({ success: true, data: results })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Get single prescription with exercises
app.get('/api/prescriptions/:id', async (c) => {
  try {
    const prescriptionId = c.req.param('id')
    
    const prescription = await c.env.DB.prepare(`
      SELECT * FROM prescriptions WHERE id = ?
    `).bind(prescriptionId).first()
    
    if (!prescription) {
      return c.json({ success: false, error: 'Prescription not found' }, 404)
    }
    
    const { results: prescribedExercises } = await c.env.DB.prepare(`
      SELECT pe.*, e.name, e.description, e.instructions, e.category
      FROM prescribed_exercises pe
      JOIN exercises e ON pe.exercise_id = e.id
      WHERE pe.prescription_id = ?
      ORDER BY e.category, e.name
    `).bind(prescriptionId).all()
    
    return c.json({ 
      success: true, 
      data: {
        prescription,
        exercises: prescribedExercises
      }
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Create prescription
app.post('/api/prescriptions', async (c) => {
  try {
    const prescription = await c.req.json()
    
    const result = await c.env.DB.prepare(`
      INSERT INTO prescriptions (
        patient_id, assessment_id, clinician_id,
        program_name, program_goals, frequency_per_week,
        estimated_duration_minutes, start_date,
        clinician_notes, patient_instructions, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      prescription.patient_id,
      prescription.assessment_id,
      prescription.clinician_id || 1,
      prescription.program_name,
      JSON.stringify(prescription.program_goals || []),
      prescription.frequency_per_week || 3,
      prescription.estimated_duration_minutes || 30,
      prescription.start_date || new Date().toISOString().split('T')[0],
      prescription.clinician_notes,
      prescription.patient_instructions,
      'active'
    ).run()
    
    return c.json({ 
      success: true, 
      data: { id: result.meta.last_row_id } 
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ============================================
// API: PRESCRIBED EXERCISES
// ============================================

// Add exercise to prescription
app.post('/api/prescribed-exercises', async (c) => {
  try {
    const prescribed = await c.req.json()
    
    const result = await c.env.DB.prepare(`
      INSERT INTO prescribed_exercises (
        prescription_id, exercise_id, sets, reps, 
        hold_time, rest_time, frequency_per_week,
        clinical_reason, target_deficiency, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      prescribed.prescription_id,
      prescribed.exercise_id,
      prescribed.sets || 3,
      prescribed.reps || 10,
      prescribed.hold_time || null,
      prescribed.rest_time || 60,
      prescribed.frequency_per_week || 3,
      prescribed.clinical_reason,
      prescribed.target_deficiency,
      'active'
    ).run()
    
    return c.json({ 
      success: true, 
      data: { id: result.meta.last_row_id } 
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ============================================
// API: RPM MONITORING
// ============================================

// Get RPM data for patient and month
app.get('/api/patients/:id/rpm/:month', async (c) => {
  try {
    const patientId = c.req.param('id')
    const month = c.req.param('month')
    
    const rpm = await c.env.DB.prepare(`
      SELECT * FROM rpm_monitoring 
      WHERE patient_id = ? AND billing_month = ?
    `).bind(patientId, month).first()
    
    if (!rpm) {
      return c.json({ success: true, data: null })
    }
    
    return c.json({ success: true, data: rpm })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Update RPM monitoring data
app.post('/api/rpm', async (c) => {
  try {
    const rpm = await c.req.json()
    
    const result = await c.env.DB.prepare(`
      INSERT INTO rpm_monitoring (
        patient_id, billing_month, total_monitoring_minutes,
        total_sessions_recorded, days_with_data, eligible_for_billing
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(patient_id, billing_month) DO UPDATE SET
        total_monitoring_minutes = total_monitoring_minutes + excluded.total_monitoring_minutes,
        total_sessions_recorded = total_sessions_recorded + excluded.total_sessions_recorded,
        days_with_data = excluded.days_with_data,
        eligible_for_billing = excluded.eligible_for_billing,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      rpm.patient_id,
      rpm.billing_month,
      rpm.total_monitoring_minutes || 0,
      rpm.total_sessions_recorded || 1,
      rpm.days_with_data || 1,
      rpm.eligible_for_billing || 0
    ).run()
    
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ============================================
// API: PATIENT PORTAL (HEP)
// ============================================

// Patient authentication
app.post('/api/patient/auth', async (c) => {
  try {
    const { patientId, lastName } = await c.req.json()
    
    // Query database for patient with portal access
    const result = await c.env.DB.prepare(`
      SELECT 
        p.id,
        p.first_name,
        p.last_name,
        ppa.portal_patient_id,
        ppa.last_name_hash,
        pr.start_date as program_start_date,
        pr.program_name,
        cl.first_name || ' ' || cl.last_name as therapist_name
      FROM patient_portal_access ppa
      JOIN patients p ON ppa.patient_id = p.id
      LEFT JOIN prescriptions pr ON p.id = pr.patient_id AND pr.status = 'active'
      LEFT JOIN clinicians cl ON pr.clinician_id = cl.id
      WHERE ppa.portal_patient_id = ? 
        AND ppa.portal_enabled = 1
        AND LOWER(ppa.last_name_hash) = LOWER(?)
      ORDER BY pr.start_date DESC
      LIMIT 1
    `).bind(patientId, lastName).first()
    
    if (!result) {
      // Log failed login attempt
      await c.env.DB.prepare(`
        INSERT INTO patient_activity_log (patient_id, activity_type, notes)
        SELECT p.id, 'login_failed', 'Invalid credentials'
        FROM patients p
        JOIN patient_portal_access ppa ON p.id = ppa.patient_id
        WHERE ppa.portal_patient_id = ?
      `).bind(patientId).run().catch(() => {})
      
      return c.json({
        success: false,
        error: 'Invalid patient ID or last name'
      }, 401)
    }
    
    // Update last login time and count
    await c.env.DB.prepare(`
      UPDATE patient_portal_access 
      SET last_login = CURRENT_TIMESTAMP,
          login_count = login_count + 1
      WHERE portal_patient_id = ?
    `).bind(patientId).run()
    
    // Log successful login
    await c.env.DB.prepare(`
      INSERT INTO patient_activity_log (patient_id, activity_type)
      VALUES (?, 'login')
    `).bind(result.id).run()
    
    return c.json({
      success: true,
      patient: {
        id: result.portal_patient_id,
        patientDbId: result.id,
        name: `${result.first_name} ${result.last_name}`,
        therapist: result.therapist_name || 'Your Physical Therapist',
        programStartDate: result.program_start_date || new Date().toISOString().split('T')[0],
        programName: result.program_name || 'Exercise Program',
        loginTime: new Date().toISOString()
      }
    })
  } catch (error: any) {
    console.error('Patient auth error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Get patient's exercises
app.get('/api/patient/:id/exercises', async (c) => {
  try {
    const portalPatientId = c.req.param('id')
    
    // Get patient's database ID from portal ID
    const patient = await c.env.DB.prepare(`
      SELECT p.id
      FROM patients p
      JOIN patient_portal_access ppa ON p.id = ppa.patient_id
      WHERE ppa.portal_patient_id = ?
    `).bind(portalPatientId).first()
    
    if (!patient) {
      return c.json({ success: false, error: 'Patient not found' }, 404)
    }
    
    // Get assigned exercises using the view
    const { results } = await c.env.DB.prepare(`
      SELECT 
        prescribed_exercise_id,
        exercise_id,
        exercise_name,
        category,
        description,
        instructions,
        sets,
        reps,
        hold_time,
        frequency_per_week,
        clinical_reason,
        target_deficiency
      FROM vw_patient_active_exercises
      WHERE patient_id = ?
      ORDER BY category, exercise_name
    `).bind(patient.id).all()
    
    // Log view activity
    await c.env.DB.prepare(`
      INSERT INTO patient_activity_log (patient_id, activity_type)
      VALUES (?, 'exercise_view')
    `).bind(patient.id).run()
    
    // Transform to match frontend format
    const exercises = results.map((ex: any) => ({
      id: `ex${ex.exercise_id}`,
      prescribedId: ex.prescribed_exercise_id,
      name: ex.exercise_name,
      category: ex.category,
      description: ex.description,
      instructions: ex.instructions || 'No instructions available',
      sets: ex.sets,
      reps: ex.reps,
      holdTime: ex.hold_time,
      frequency: `${ex.frequency_per_week}x weekly`,
      clinicalReason: ex.clinical_reason,
      targetDeficiency: ex.target_deficiency
    }))
    
    return c.json({
      success: true,
      exercises
    })
  } catch (error: any) {
    console.error('Get exercises error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Record exercise completion
app.post('/api/patient/:id/complete', async (c) => {
  try {
    const portalPatientId = c.req.param('id')
    const { prescribedExerciseId, exerciseName, sets, reps, duration, painLevel, difficulty, notes } = await c.req.json()
    
    // Get patient's database ID
    const patient = await c.env.DB.prepare(`
      SELECT p.id
      FROM patients p
      JOIN patient_portal_access ppa ON p.id = ppa.patient_id
      WHERE ppa.portal_patient_id = ?
    `).bind(portalPatientId).first()
    
    if (!patient) {
      return c.json({ success: false, error: 'Patient not found' }, 404)
    }
    
    // Log completion in activity log
    await c.env.DB.prepare(`
      INSERT INTO patient_activity_log (
        patient_id,
        prescribed_exercise_id,
        activity_type,
        exercise_name,
        sets_completed,
        reps_completed,
        duration_seconds,
        pain_level,
        difficulty_rating,
        notes
      ) VALUES (?, ?, 'exercise_complete', ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      patient.id,
      prescribedExerciseId || null,
      exerciseName,
      sets || null,
      reps || null,
      duration || null,
      painLevel || null,
      difficulty || null,
      notes || null
    ).run()
    
    // Calculate streak and today's progress
    const today = new Date().toISOString().split('T')[0]
    
    // Get today's completions
    const todayStats = await c.env.DB.prepare(`
      SELECT COUNT(DISTINCT exercise_name) as completed_today
      FROM patient_activity_log
      WHERE patient_id = ?
        AND activity_type = 'exercise_complete'
        AND DATE(activity_date) = ?
    `).bind(patient.id, today).first()
    
    // Get total assigned exercises
    const totalExercises = await c.env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM vw_patient_active_exercises
      WHERE patient_id = ?
    `).bind(patient.id).first()
    
    // Calculate streak (consecutive days with activity)
    const streakResult = await c.env.DB.prepare(`
      WITH RECURSIVE dates AS (
        SELECT DATE('now') as date
        UNION ALL
        SELECT DATE(date, '-1 day')
        FROM dates
        WHERE date > DATE('now', '-30 days')
      ),
      daily_activity AS (
        SELECT DISTINCT DATE(activity_date) as activity_date
        FROM patient_activity_log
        WHERE patient_id = ?
          AND activity_type = 'exercise_complete'
      )
      SELECT COUNT(*) as streak
      FROM dates d
      LEFT JOIN daily_activity da ON d.date = da.activity_date
      WHERE da.activity_date IS NOT NULL
        AND d.date <= DATE('now')
      ORDER BY d.date DESC
    `).bind(patient.id).first()
    
    return c.json({
      success: true,
      streak: streakResult?.streak || 0,
      todayCompleted: todayStats?.completed_today || 0,
      todayTotal: totalExercises?.total || 0
    })
  } catch (error: any) {
    console.error('Complete exercise error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Get patient progress
app.get('/api/patient/:id/progress', async (c) => {
  try {
    const portalPatientId = c.req.param('id')
    const days = parseInt(c.req.query('days') || '30')
    
    // Get patient's database ID
    const patient = await c.env.DB.prepare(`
      SELECT p.id
      FROM patients p
      JOIN patient_portal_access ppa ON p.id = ppa.patient_id
      WHERE ppa.portal_patient_id = ?
    `).bind(portalPatientId).first()
    
    if (!patient) {
      return c.json({ success: false, error: 'Patient not found' }, 404)
    }
    
    // Get daily progress for specified period
    const { results } = await c.env.DB.prepare(`
      SELECT 
        DATE(activity_date) as date,
        COUNT(DISTINCT exercise_name) as completed,
        COUNT(*) as total_sessions,
        AVG(pain_level) as avg_pain,
        AVG(difficulty_rating) as avg_difficulty
      FROM patient_activity_log
      WHERE patient_id = ?
        AND activity_type = 'exercise_complete'
        AND activity_date >= DATE('now', '-' || ? || ' days')
      GROUP BY DATE(activity_date)
      ORDER BY date DESC
    `).bind(patient.id, days).all()
    
    // Get total assigned exercises
    const totalEx = await c.env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM vw_patient_active_exercises
      WHERE patient_id = ?
    `).bind(patient.id).first()
    
    const total = totalEx?.total || 1
    
    // Format progress data
    const progress = results.map((row: any) => ({
      date: row.date,
      completed: row.completed,
      total: total,
      percentage: Math.round((row.completed / total) * 100),
      avgPain: row.avg_pain ? Math.round(row.avg_pain * 10) / 10 : null,
      avgDifficulty: row.avg_difficulty ? Math.round(row.avg_difficulty * 10) / 10 : null,
      sessions: row.total_sessions
    }))
    
    return c.json({
      success: true,
      progress,
      summary: {
        totalAssignedExercises: total,
        activeDays: results.length,
        periodDays: days
      }
    })
  } catch (error: any) {
    console.error('Get progress error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ============================================
// PROGRESS PHOTOS API
// ============================================

// Get patient progress photos
app.get('/api/patient/:id/photos', async (c) => {
  try {
    const portalPatientId = c.req.param('id')
    
    // Get patient's database ID from portal ID
    const patient = await c.env.DB.prepare(`
      SELECT p.id FROM patients p
      JOIN patient_portal_access ppa ON p.id = ppa.patient_id
      WHERE ppa.portal_patient_id = ?
    `).bind(portalPatientId).first()
    
    if (!patient) {
      return c.json({ success: false, error: 'Patient not found' }, 404)
    }
    
    // Get all photos for this patient
    const { results } = await c.env.DB.prepare(`
      SELECT 
        id,
        photo_type,
        photo_category,
        photo_data,
        photo_format,
        thumbnail_data,
        body_area,
        notes,
        taken_by,
        photo_date,
        created_at
      FROM progress_photos
      WHERE patient_id = ?
      ORDER BY photo_date DESC, created_at DESC
    `).bind(patient.id).all()
    
    // Log view activity
    await c.env.DB.prepare(`
      INSERT INTO patient_activity_log (patient_id, activity_type)
      VALUES (?, 'photo_view')
    `).bind(patient.id).run()
    
    return c.json({ success: true, photos: results })
  } catch (error: any) {
    console.error('Error fetching photos:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Upload new progress photo
app.post('/api/patient/:id/photos', async (c) => {
  try {
    const portalPatientId = c.req.param('id')
    const { photoData, photoType, photoCategory, bodyArea, notes } = await c.req.json()
    
    // Validate required fields
    if (!photoData || !photoType) {
      return c.json({ success: false, error: 'Photo data and type required' }, 400)
    }
    
    // Get patient's database ID
    const patient = await c.env.DB.prepare(`
      SELECT p.id FROM patients p
      JOIN patient_portal_access ppa ON p.id = ppa.patient_id
      WHERE ppa.portal_patient_id = ?
    `).bind(portalPatientId).first()
    
    if (!patient) {
      return c.json({ success: false, error: 'Patient not found' }, 404)
    }
    
    // Determine format from data URL
    const formatMatch = photoData.match(/^data:image\/(\w+);base64,/)
    const photoFormat = formatMatch ? formatMatch[1] : 'jpeg'
    
    // Create thumbnail (first 1000 chars of base64 as a simple approach)
    const thumbnailData = photoData.substring(0, Math.min(photoData.length, 1000))
    
    // Insert photo
    const result = await c.env.DB.prepare(`
      INSERT INTO progress_photos (
        patient_id, photo_type, photo_category, photo_data, photo_format,
        thumbnail_data, body_area, notes, taken_by, visible_to_patient
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'patient', 1)
    `).bind(
      patient.id,
      photoType,
      photoCategory || null,
      photoData,
      photoFormat,
      thumbnailData,
      bodyArea || null,
      notes || null
    ).run()
    
    // Log upload activity
    await c.env.DB.prepare(`
      INSERT INTO patient_activity_log (patient_id, activity_type)
      VALUES (?, 'photo_upload')
    `).bind(patient.id).run()
    
    return c.json({ 
      success: true, 
      photoId: result.meta.last_row_id,
      message: 'Photo uploaded successfully'
    })
  } catch (error: any) {
    console.error('Error uploading photo:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ============================================
// MESSAGING API
// ============================================

// Get patient messages
app.get('/api/patient/:id/messages', async (c) => {
  try {
    const portalPatientId = c.req.param('id')
    
    // Get patient's database ID
    const patient = await c.env.DB.prepare(`
      SELECT p.id FROM patients p
      JOIN patient_portal_access ppa ON p.id = ppa.patient_id
      WHERE ppa.portal_patient_id = ?
    `).bind(portalPatientId).first()
    
    if (!patient) {
      return c.json({ success: false, error: 'Patient not found' }, 404)
    }
    
    // Get messages with clinician info
    const { results } = await c.env.DB.prepare(`
      SELECT 
        pm.id,
        pm.sender_type,
        pm.message_subject,
        pm.message_text,
        pm.is_read,
        pm.is_priority,
        pm.sent_at,
        pm.thread_id,
        pm.parent_message_id,
        c.first_name || ' ' || c.last_name as clinician_name
      FROM patient_messages pm
      JOIN clinicians c ON pm.clinician_id = c.id
      WHERE pm.patient_id = ?
      ORDER BY pm.thread_id, pm.sent_at ASC
    `).bind(patient.id).all()
    
    // Group by threads
    const threads: any = {}
    results.forEach((msg: any) => {
      const threadId = msg.thread_id || msg.id
      if (!threads[threadId]) {
        threads[threadId] = []
      }
      threads[threadId].push(msg)
    })
    
    return c.json({ success: true, messages: results, threads })
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Send message to therapist
app.post('/api/patient/:id/messages', async (c) => {
  try {
    const portalPatientId = c.req.param('id')
    const { subject, message, parentMessageId } = await c.req.json()
    
    if (!message) {
      return c.json({ success: false, error: 'Message text required' }, 400)
    }
    
    // Get patient and clinician IDs
    const patient = await c.env.DB.prepare(`
      SELECT 
        p.id as patient_id,
        pr.clinician_id
      FROM patients p
      JOIN patient_portal_access ppa ON p.id = ppa.patient_id
      JOIN prescriptions pr ON p.id = pr.patient_id
      WHERE ppa.portal_patient_id = ? AND pr.status = 'active'
      LIMIT 1
    `).bind(portalPatientId).first()
    
    if (!patient) {
      return c.json({ success: false, error: 'Patient not found or no active prescription' }, 404)
    }
    
    // Get thread_id from parent if replying
    let threadId = null
    if (parentMessageId) {
      const parentMsg = await c.env.DB.prepare(`
        SELECT thread_id FROM patient_messages WHERE id = ?
      `).bind(parentMessageId).first()
      threadId = parentMsg?.thread_id || parentMessageId
    }
    
    // Insert message
    const result = await c.env.DB.prepare(`
      INSERT INTO patient_messages (
        patient_id, clinician_id, sender_type, message_subject, 
        message_text, parent_message_id, thread_id
      ) VALUES (?, ?, 'patient', ?, ?, ?, ?)
    `).bind(
      patient.patient_id,
      patient.clinician_id,
      subject || 'Message from patient',
      message,
      parentMessageId || null,
      threadId
    ).run()
    
    // If this is a new thread, update thread_id to be the message id
    const messageId = result.meta.last_row_id
    if (!threadId) {
      await c.env.DB.prepare(`
        UPDATE patient_messages SET thread_id = ? WHERE id = ?
      `).bind(messageId, messageId).run()
    }
    
    // Log activity
    await c.env.DB.prepare(`
      INSERT INTO patient_activity_log (patient_id, activity_type)
      VALUES (?, 'message_sent')
    `).bind(patient.patient_id).run()
    
    return c.json({ 
      success: true, 
      messageId,
      message: 'Message sent to your therapist'
    })
  } catch (error: any) {
    console.error('Error sending message:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Mark message as read
app.put('/api/patient/:id/messages/:messageId/read', async (c) => {
  try {
    const portalPatientId = c.req.param('id')
    const messageId = c.req.param('messageId')
    
    // Get patient ID
    const patient = await c.env.DB.prepare(`
      SELECT p.id FROM patients p
      JOIN patient_portal_access ppa ON p.id = ppa.patient_id
      WHERE ppa.portal_patient_id = ?
    `).bind(portalPatientId).first()
    
    if (!patient) {
      return c.json({ success: false, error: 'Patient not found' }, 404)
    }
    
    // Mark as read
    await c.env.DB.prepare(`
      UPDATE patient_messages 
      SET is_read = 1, read_at = CURRENT_TIMESTAMP
      WHERE id = ? AND patient_id = ?
    `).bind(messageId, patient.id).run()
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Error marking message as read:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ============================================
// APPOINTMENTS API
// ============================================

// Get patient appointments
app.get('/api/patient/:id/appointments', async (c) => {
  try {
    const portalPatientId = c.req.param('id')
    
    // Get patient ID
    const patient = await c.env.DB.prepare(`
      SELECT p.id FROM patients p
      JOIN patient_portal_access ppa ON p.id = ppa.patient_id
      WHERE ppa.portal_patient_id = ?
    `).bind(portalPatientId).first()
    
    if (!patient) {
      return c.json({ success: false, error: 'Patient not found' }, 404)
    }
    
    // Get appointments with clinician info
    const { results } = await c.env.DB.prepare(`
      SELECT 
        a.id,
        a.appointment_type,
        a.appointment_date,
        a.appointment_time,
        a.duration_minutes,
        a.location_type,
        a.location_address,
        a.status,
        a.notes,
        c.first_name || ' ' || c.last_name as clinician_name
      FROM appointments a
      JOIN clinicians c ON a.clinician_id = c.id
      WHERE a.patient_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `).bind(patient.id).all()
    
    // Separate upcoming and past
    const today = new Date().toISOString().split('T')[0]
    const upcoming = results.filter((apt: any) => apt.appointment_date >= today && apt.status !== 'cancelled')
    const past = results.filter((apt: any) => apt.appointment_date < today || apt.status === 'completed')
    
    return c.json({ success: true, upcoming, past, all: results })
  } catch (error: any) {
    console.error('Error fetching appointments:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ============================================
// PATIENT GOALS API
// ============================================

// Get patient goals
app.get('/api/patient/:id/goals', async (c) => {
  try {
    const portalPatientId = c.req.param('id')
    
    // Get patient ID
    const patient = await c.env.DB.prepare(`
      SELECT p.id FROM patients p
      JOIN patient_portal_access ppa ON p.id = ppa.patient_id
      WHERE ppa.portal_patient_id = ?
    `).bind(portalPatientId).first()
    
    if (!patient) {
      return c.json({ success: false, error: 'Patient not found' }, 404)
    }
    
    // Get all goals
    const { results } = await c.env.DB.prepare(`
      SELECT 
        id,
        goal_type,
        goal_description,
        baseline_value,
        target_value,
        current_value,
        measurement_unit,
        target_date,
        status,
        progress_percentage,
        achievement_date,
        created_at
      FROM patient_goals
      WHERE patient_id = ?
      ORDER BY 
        CASE status 
          WHEN 'active' THEN 1 
          WHEN 'achieved' THEN 2 
          ELSE 3 
        END,
        target_date ASC
    `).bind(patient.id).all()
    
    return c.json({ success: true, goals: results })
  } catch (error: any) {
    console.error('Error fetching goals:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ============================================
// ENHANCED ANALYTICS API
// ============================================

// Get patient engagement metrics
app.get('/api/analytics/engagement', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM vw_patient_engagement
      ORDER BY days_active_7d DESC, exercises_completed_30d DESC
    `).all()
    
    return c.json({ success: true, patients: results })
  } catch (error: any) {
    console.error('Error fetching engagement metrics:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Get clinician dashboard summary
app.get('/api/analytics/clinician/:id', async (c) => {
  try {
    const clinicianId = c.req.param('id')
    
    const result = await c.env.DB.prepare(`
      SELECT * FROM vw_clinician_dashboard
      WHERE clinician_id = ?
    `).bind(clinicianId).first()
    
    if (!result) {
      return c.json({ success: false, error: 'Clinician not found' }, 404)
    }
    
    // Get detailed patient engagement for this clinician
    const { results: patients } = await c.env.DB.prepare(`
      SELECT 
        pe.*,
        p.first_name || ' ' || p.last_name as patient_name
      FROM vw_patient_engagement pe
      JOIN patients p ON pe.patient_id = p.id
      JOIN prescriptions pr ON p.id = pr.patient_id
      WHERE pr.clinician_id = ? AND pr.status = 'active'
      ORDER BY pe.days_active_7d DESC
    `).bind(clinicianId).all()
    
    return c.json({ 
      success: true, 
      summary: result,
      patients
    })
  } catch (error: any) {
    console.error('Error fetching clinician dashboard:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Get exercise effectiveness metrics
app.get('/api/analytics/exercises', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM vw_exercise_effectiveness
      ORDER BY effectiveness_score DESC, total_completions DESC
    `).all()
    
    return c.json({ success: true, exercises: results })
  } catch (error: any) {
    console.error('Error fetching exercise effectiveness:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ============================================
// GEMINI AI API ROUTES
// ============================================

// Generate SOAP note from complaints (Medical Scribe)
app.post('/api/ai/generate-soap', async (c) => {
  try {
    const { complaints, patientInfo } = await c.req.json()
    
    const prompt = `You are a licensed physical therapist writing a professional SOAP note.

Patient Information:
- Age: ${patientInfo.age || 'N/A'}
- Gender: ${patientInfo.gender || 'N/A'}
- BMI: ${patientInfo.bmi || 'N/A'}

Patient Complaints (from medical scribe):
${complaints.map((c: any, i: number) => `${i + 1}. "${c.text}" (${c.timestamp})`).join('\n')}

Generate a professional SUBJECTIVE section for the SOAP note. Include:
1. Chief complaint summary
2. Pain characteristics (location, quality, severity if mentioned)
3. Onset and duration
4. Aggravating/alleviating factors if mentioned
5. Patient's functional limitations if mentioned

Write in professional medical terminology. Keep it concise but comprehensive.`

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + c.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500
        }
      })
    })

    const data = await response.json() as any
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API error')
    }
    
    const soapText = data.candidates[0].content.parts[0].text
    
    return c.json({ success: true, soapNote: soapText })
  } catch (error: any) {
    console.error('Gemini SOAP generation error:', error)
    return c.json({ 
      success: false, 
      error: error.message,
      fallback: true // Signal to use fallback
    }, 500)
  }
})

// Generate HEP recommendations from deficiencies
app.post('/api/ai/generate-hep', async (c) => {
  try {
    const { deficiencies, patientInfo } = await c.req.json()
    
    const prompt = `You are a licensed physical therapist creating a home exercise program (HEP).

Patient Information:
- Age: ${patientInfo.age || 'N/A'}
- BMI: ${patientInfo.bmi || 'N/A'}
- Gender: ${patientInfo.gender || 'N/A'}

Assessment Deficiencies Identified:
${deficiencies.map((d: any, i: number) => `${i + 1}. ${d.area}: ${d.description} (Severity: ${d.severity})`).join('\n')}

Based on these deficiencies, recommend 3-5 therapeutic exercises. For each exercise, provide:
1. Exercise name (choose from: Bodyweight Squats, Plank Hold, Shoulder Raises, Calf Raises, Hip Bridges, Leg Raises, or similar standard exercises)
2. Recommended sets (1-5)
3. Recommended reps (5-20) or duration in seconds for holds
4. Intensity (Light/Moderate/Heavy)
5. Speed/tempo (e.g., "Slow and controlled", "2-1-2", "Static hold")
6. Clinical reasoning (why this exercise addresses the specific deficiency)
7. Priority level (1=high priority, 2=recommended, 3=optional)

Consider the patient's age and BMI when making recommendations. Start conservative for older/deconditioned patients.

Output ONLY valid JSON in this exact format:
{
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": 3,
      "reps": 10,
      "intensity": "Moderate",
      "speed": "Controlled (2-1-2)",
      "reasoning": "Clinical reasoning here",
      "priority": 1
    }
  ]
}`

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + c.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1000
        }
      })
    })

    const data = await response.json() as any
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API error')
    }
    
    let jsonText = data.candidates[0].content.parts[0].text
    
    // Clean JSON (remove markdown code blocks if present)
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const recommendations = JSON.parse(jsonText)
    
    return c.json({ success: true, recommendations })
  } catch (error: any) {
    console.error('Gemini HEP generation error:', error)
    return c.json({ 
      success: false, 
      error: error.message,
      fallback: true
    }, 500)
  }
})

// Analyze MRI report
app.post('/api/ai/analyze-mri', async (c) => {
  try {
    const { reportText } = await c.req.json()
    
    const prompt = `You are a radiologist and physical therapist analyzing an MRI report.

MRI Report:
${reportText}

Analyze this report and provide:

1. KEY FINDINGS: Extract the most important pathological findings with severity (high/moderate/mild/normal)

2. ANATOMY: List all anatomical structures mentioned in the report

3. PATHOLOGY: Identify all pathological conditions with their medical terms

4. DOCTOR EXPLANATION: Write a technical explanation for medical professionals (2-3 sentences)

5. PATIENT EXPLANATION: Write a simple, non-technical explanation a patient can understand (2-3 sentences)

6. CLINICAL IMPLICATIONS: What does this mean for treatment? What should be done next?

7. ICD-10 CODES: Suggest appropriate ICD-10 diagnosis codes with descriptions

Output ONLY valid JSON in this exact format:
{
  "keyFindings": [
    {"finding": "Description", "severity": "high|moderate|mild|normal"}
  ],
  "anatomy": ["Structure 1", "Structure 2"],
  "pathology": [
    {"term": "Medical term", "description": "Plain English", "severity": "high|moderate|mild"}
  ],
  "doctorExplanation": "Technical explanation...",
  "patientExplanation": "Simple explanation...",
  "clinicalImplications": [
    "Implication 1",
    "Implication 2"
  ],
  "icd10Codes": [
    {"code": "M25.561", "description": "Pain in right knee"}
  ]
}`

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + c.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1500
        }
      })
    })

    const data = await response.json() as any
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API error')
    }
    
    let jsonText = data.candidates[0].content.parts[0].text
    
    // Clean JSON
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const analysis = JSON.parse(jsonText)
    
    return c.json({ success: true, analysis })
  } catch (error: any) {
    console.error('Gemini MRI analysis error:', error)
    return c.json({ 
      success: false, 
      error: error.message,
      fallback: true
    }, 500)
  }
})

// Smart ICD-10 Suggestions based on SOAP note
app.post('/api/ai/suggest-icd10', async (c) => {
  try {
    const { soapNote, patientInfo } = await c.req.json()
    
    const prompt = `You are an expert medical coder analyzing a physical therapy SOAP note to suggest appropriate ICD-10 diagnosis codes.

Patient Information:
- Age: ${patientInfo?.age || 'N/A'}
- Gender: ${patientInfo?.gender || 'N/A'}
- BMI: ${patientInfo?.bmi || 'N/A'}

SOAP Note:
${soapNote}

Based on this SOAP note, suggest the 3 most appropriate ICD-10 diagnosis codes for billing and documentation purposes.

For each code, provide:
1. ICD-10 code (e.g., "M54.5")
2. Full description (e.g., "Low back pain")
3. Confidence score (0.0 to 1.0, where 1.0 is most confident)
4. Clinical reasoning (brief explanation of why this code is appropriate)
5. Billing priority (primary, secondary, or tertiary)

Focus on:
- Movement dysfunction codes (M codes)
- Pain codes (M25.5xx series)
- ROM limitation codes
- Weakness codes (M62.81)
- Balance/gait codes (R26.xx series)
- Age-related codes if applicable (R54)

Output ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "suggestions": [
    {
      "code": "M54.5",
      "description": "Low back pain",
      "confidence": 0.95,
      "reasoning": "Patient reports chronic low back pain with movement limitations",
      "priority": "primary"
    },
    {
      "code": "M62.81",
      "description": "Muscle weakness (generalized)",
      "confidence": 0.85,
      "reasoning": "Assessment shows bilateral weakness in hip extensors and core musculature",
      "priority": "secondary"
    },
    {
      "code": "R26.81",
      "description": "Unsteadiness on feet",
      "confidence": 0.75,
      "reasoning": "Balance testing reveals reduced postural stability",
      "priority": "tertiary"
    }
  ]
}`

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + c.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2, // Low temperature for consistent medical coding
          maxOutputTokens: 800
        }
      })
    })

    const data = await response.json() as any
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API error')
    }
    
    let jsonText = data.candidates[0].content.parts[0].text
    
    // Clean JSON (remove markdown code blocks if present)
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const result = JSON.parse(jsonText)
    
    return c.json({ success: true, suggestions: result.suggestions })
  } catch (error: any) {
    console.error('Gemini ICD-10 suggestion error:', error)
    return c.json({ 
      success: false, 
      error: error.message,
      fallback: true,
      suggestions: [] // Return empty array on error
    }, 500)
  }
})

export default app
