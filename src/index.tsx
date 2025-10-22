import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

// Type definitions for Cloudflare D1
type Bindings = {
  DB: D1Database
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
        <title>F-AI bian Assessment System</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'brand-orange': '#FF6B35',
                  'brand-blue': '#004E89'
                }
              }
            }
          }
        </script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/modern-design.css" rel="stylesheet">
    </head>
    <body class="modern-bg"
        <div class="min-h-screen relative z-10">
            <!-- Header -->
            <header class="glass-header text-white shadow-lg">
                <div class="max-w-7xl mx-auto px-4 py-8">
                    <h1 class="text-5xl font-bold fade-in-up">
                        <i class="fas fa-heartbeat mr-3 text-brand-orange"></i>
                        F-AI bian Assessment System
                    </h1>
                    <p class="mt-3 text-xl text-white/90 fade-in-up" style="animation-delay: 0.2s">Elderly Home Rehabilitation Monitoring & Remote Patient Monitoring</p>
                </div>
            </header>

            <!-- Main Content -->
            <main class="max-w-7xl mx-auto px-4 py-16">
                <!-- Quick Actions -->
                <div class="grid md:grid-cols-3 gap-8 mb-16">
                    <!-- Patient Intake -->
                    <a href="/static/intake.html" class="block feature-card text-white group fade-in-up">
                        <div class="flex items-center mb-6">
                            <div class="bg-brand-orange/30 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                <i class="fas fa-user-plus text-white drop-shadow-lg"></i>
                            </div>
                            <h2 class="ml-4 text-3xl font-bold drop-shadow-md">New Patient</h2>
                        </div>
                        <p class="text-white/90 text-lg mb-4">Start patient intake and demographic information collection</p>
                        <div class="mt-6 text-white font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                            Get Started <i class="fas fa-arrow-right ml-2"></i>
                        </div>
                    </a>

                    <!-- Assessment -->
                    <a href="/static/dashboard.html" class="block feature-card text-white group fade-in-up" style="animation-delay: 0.1s">
                        <div class="flex items-center mb-6">
                            <div class="bg-brand-blue/30 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                <i class="fas fa-video text-white drop-shadow-lg"></i>
                            </div>
                            <h2 class="ml-4 text-3xl font-bold drop-shadow-md">Dashboard</h2>
                        </div>
                        <p class="text-white/90 text-lg mb-4">View all patients and manage assessments</p>
                        <div class="mt-6 text-white font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                            View Dashboard <i class="fas fa-arrow-right ml-2"></i>
                        </div>
                    </a>

                    <!-- Reports -->
                    <a href="/static/dashboard.html" class="block feature-card text-white group fade-in-up" style="animation-delay: 0.2s">
                        <div class="flex items-center mb-6">
                            <div class="bg-green-500/30 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                <i class="fas fa-chart-line text-white drop-shadow-lg"></i>
                            </div>
                            <h2 class="ml-4 text-3xl font-bold drop-shadow-md">RPM Monitoring</h2>
                        </div>
                        <p class="text-white/90 text-lg mb-4">Track remote patient monitoring and billing</p>
                        <div class="mt-6 text-white font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                            View Reports <i class="fas fa-arrow-right ml-2"></i>
                        </div>
                    </a>
                </div>

                <!-- Features -->
                <div class="glass-card-solid p-10 mb-16 fade-in-up" style="animation-delay: 0.3s">
                    <h3 class="text-3xl font-bold text-gray-800 mb-8">
                        <span class="text-gradient">System Features</span>
                    </h3>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div class="flex items-start group">
                            <div class="bg-gradient-to-br from-brand-orange to-red-500 w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform flex-shrink-0">
                                <i class="fas fa-camera"></i>
                            </div>
                            <div class="ml-5">
                                <h4 class="font-bold text-gray-800 text-lg mb-2">AI-Powered Movement Analysis</h4>
                                <p class="text-gray-600">Camera-based skeleton tracking with MediaPipe (33 joints) or Femto Mega (32 joints with depth)</p>
                            </div>
                        </div>
                        <div class="flex items-start group">
                            <div class="bg-gradient-to-br from-brand-blue to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform flex-shrink-0">
                                <i class="fas fa-dumbbell"></i>
                            </div>
                            <div class="ml-5">
                                <h4 class="font-bold text-gray-800 text-lg mb-2">Personalized Exercise Programs</h4>
                                <p class="text-gray-600">17 therapeutic exercises across 6 categories targeting identified deficiencies</p>
                            </div>
                        </div>
                        <div class="flex items-start group">
                            <div class="bg-gradient-to-br from-green-500 to-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform flex-shrink-0">
                                <i class="fas fa-clipboard-check"></i>
                            </div>
                            <div class="ml-5">
                                <h4 class="font-bold text-gray-800 text-lg mb-2">Compliance Tracking</h4>
                                <p class="text-gray-600">Monitor patient adherence to exercise programs with detailed session logs</p>
                            </div>
                        </div>
                        <div class="flex items-start group">
                            <div class="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform flex-shrink-0">
                                <i class="fas fa-file-medical"></i>
                            </div>
                            <div class="ml-5">
                                <h4 class="font-bold text-gray-800 text-lg mb-2">RPM Billing Support</h4>
                                <p class="text-gray-600">Automatic CPT code tracking (99453, 99454, 99457, 99458) for reimbursement</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Workflow Overview -->
                <div class="glass-card p-10 fade-in-up" style="animation-delay: 0.4s">
                    <h3 class="text-3xl font-bold text-white mb-10 text-center">
                        <span class="drop-shadow-lg">Assessment Workflow</span>
                    </h3>
                    <div class="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-4">
                        <div class="text-center flex-1 group">
                            <div class="bg-gradient-to-br from-brand-orange to-red-500 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl text-white shadow-xl group-hover:scale-110 transition-transform font-bold">1</div>
                            <h4 class="font-bold mt-4 text-white text-lg drop-shadow-md">Patient Intake</h4>
                            <p class="text-sm text-white/80 mt-1">Demographics & Medical History</p>
                        </div>
                        <i class="fas fa-arrow-right text-white/50 text-3xl hidden md:block"></i>
                        <div class="text-center flex-1 group">
                            <div class="bg-gradient-to-br from-brand-orange to-red-500 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl text-white shadow-xl group-hover:scale-110 transition-transform font-bold">2</div>
                            <h4 class="font-bold mt-4 text-white text-lg drop-shadow-md">Movement Assessment</h4>
                            <p class="text-sm text-white/80 mt-1">Camera-based Skeleton Tracking</p>
                        </div>
                        <i class="fas fa-arrow-right text-white/50 text-3xl hidden md:block"></i>
                        <div class="text-center flex-1 group">
                            <div class="bg-gradient-to-br from-brand-orange to-red-500 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl text-white shadow-xl group-hover:scale-110 transition-transform font-bold">3</div>
                            <h4 class="font-bold mt-4 text-white text-lg drop-shadow-md">AI Analysis</h4>
                            <p class="text-sm text-white/80 mt-1">Biomechanical Deficiencies</p>
                        </div>
                        <i class="fas fa-arrow-right text-white/50 text-3xl hidden md:block"></i>
                        <div class="text-center flex-1 group">
                            <div class="bg-gradient-to-br from-brand-orange to-red-500 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl text-white shadow-xl group-hover:scale-110 transition-transform font-bold">4</div>
                            <h4 class="font-bold mt-4 text-white text-lg drop-shadow-md">Exercise Prescription</h4>
                            <p class="text-sm text-white/80 mt-1">Personalized Programs</p>
                        </div>
                        <i class="fas fa-arrow-right text-white/50 text-3xl hidden md:block"></i>
                        <div class="text-center flex-1 group">
                            <div class="bg-gradient-to-br from-brand-orange to-red-500 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl text-white shadow-xl group-hover:scale-110 transition-transform font-bold">5</div>
                            <h4 class="font-bold mt-4 text-white text-lg drop-shadow-md">RPM Monitoring</h4>
                            <p class="text-sm text-white/80 mt-1">Compliance & Billing</p>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Footer -->
            <footer class="glass-card mt-20 py-10 mx-4 mb-8">
                <div class="max-w-7xl mx-auto px-4 text-center text-white">
                    <p class="text-lg font-semibold drop-shadow-md">&copy; 2025 F-AI bian Assessment System. All rights reserved.</p>
                    <p class="text-white/70 text-sm mt-3">Powered by Hono + Cloudflare Workers</p>
                    <div class="mt-6 flex justify-center space-x-6">
                        <i class="fas fa-heart text-brand-orange text-xl"></i>
                        <i class="fas fa-shield-alt text-brand-blue text-xl"></i>
                        <i class="fas fa-lock text-green-400 text-xl"></i>
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

export default app
