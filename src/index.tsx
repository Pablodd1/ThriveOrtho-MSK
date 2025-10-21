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
    </head>
    <body class="bg-gray-50">
        <div class="min-h-screen">
            <!-- Header -->
            <header class="bg-gradient-to-r from-brand-blue to-brand-orange text-white shadow-lg">
                <div class="max-w-7xl mx-auto px-4 py-6">
                    <h1 class="text-4xl font-bold">
                        <i class="fas fa-heartbeat mr-3"></i>
                        F-AI bian Assessment System
                    </h1>
                    <p class="mt-2 text-blue-100">Elderly Home Rehabilitation Monitoring & Remote Patient Monitoring</p>
                </div>
            </header>

            <!-- Main Content -->
            <main class="max-w-7xl mx-auto px-4 py-12">
                <!-- Quick Actions -->
                <div class="grid md:grid-cols-3 gap-6 mb-12">
                    <!-- Patient Intake -->
                    <a href="/static/intake.html" class="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border-t-4 border-brand-orange">
                        <div class="flex items-center mb-4">
                            <div class="bg-brand-orange text-white w-12 h-12 rounded-full flex items-center justify-center text-xl">
                                <i class="fas fa-user-plus"></i>
                            </div>
                            <h2 class="ml-4 text-2xl font-bold text-gray-800">New Patient</h2>
                        </div>
                        <p class="text-gray-600">Start patient intake and demographic information collection</p>
                        <div class="mt-4 text-brand-orange font-semibold">
                            Get Started <i class="fas fa-arrow-right ml-2"></i>
                        </div>
                    </a>

                    <!-- Assessment -->
                    <a href="/static/dashboard.html" class="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border-t-4 border-brand-blue">
                        <div class="flex items-center mb-4">
                            <div class="bg-brand-blue text-white w-12 h-12 rounded-full flex items-center justify-center text-xl">
                                <i class="fas fa-video"></i>
                            </div>
                            <h2 class="ml-4 text-2xl font-bold text-gray-800">Dashboard</h2>
                        </div>
                        <p class="text-gray-600">View all patients and manage assessments</p>
                        <div class="mt-4 text-brand-blue font-semibold">
                            View Dashboard <i class="fas fa-arrow-right ml-2"></i>
                        </div>
                    </a>

                    <!-- Reports -->
                    <a href="/static/dashboard.html" class="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border-t-4 border-green-500">
                        <div class="flex items-center mb-4">
                            <div class="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <h2 class="ml-4 text-2xl font-bold text-gray-800">RPM Monitoring</h2>
                        </div>
                        <p class="text-gray-600">Track remote patient monitoring and billing</p>
                        <div class="mt-4 text-green-500 font-semibold">
                            View Reports <i class="fas fa-arrow-right ml-2"></i>
                        </div>
                    </a>
                </div>

                <!-- Features -->
                <div class="bg-white rounded-lg shadow-md p-8 mb-12">
                    <h3 class="text-2xl font-bold text-gray-800 mb-6">System Features</h3>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="flex items-start">
                            <i class="fas fa-camera text-brand-orange text-2xl mt-1"></i>
                            <div class="ml-4">
                                <h4 class="font-bold text-gray-800">AI-Powered Movement Analysis</h4>
                                <p class="text-gray-600 text-sm">Camera-based skeleton tracking with MediaPipe (33 joints) or Femto Mega (32 joints with depth)</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <i class="fas fa-dumbbell text-brand-blue text-2xl mt-1"></i>
                            <div class="ml-4">
                                <h4 class="font-bold text-gray-800">Personalized Exercise Programs</h4>
                                <p class="text-gray-600 text-sm">17 therapeutic exercises across 6 categories targeting identified deficiencies</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <i class="fas fa-clipboard-check text-green-500 text-2xl mt-1"></i>
                            <div class="ml-4">
                                <h4 class="font-bold text-gray-800">Compliance Tracking</h4>
                                <p class="text-gray-600 text-sm">Monitor patient adherence to exercise programs with detailed session logs</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <i class="fas fa-file-medical text-purple-500 text-2xl mt-1"></i>
                            <div class="ml-4">
                                <h4 class="font-bold text-gray-800">RPM Billing Support</h4>
                                <p class="text-gray-600 text-sm">Automatic CPT code tracking (99453, 99454, 99457, 99458) for reimbursement</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Workflow Overview -->
                <div class="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-8">
                    <h3 class="text-2xl font-bold text-gray-800 mb-6">Assessment Workflow</h3>
                    <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                        <div class="text-center flex-1">
                            <div class="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl text-brand-orange shadow-md">1</div>
                            <h4 class="font-bold mt-3 text-gray-800">Patient Intake</h4>
                            <p class="text-sm text-gray-600">Demographics & Medical History</p>
                        </div>
                        <i class="fas fa-arrow-right text-gray-400 text-2xl hidden md:block"></i>
                        <div class="text-center flex-1">
                            <div class="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl text-brand-orange shadow-md">2</div>
                            <h4 class="font-bold mt-3 text-gray-800">Movement Assessment</h4>
                            <p class="text-sm text-gray-600">Camera-based Skeleton Tracking</p>
                        </div>
                        <i class="fas fa-arrow-right text-gray-400 text-2xl hidden md:block"></i>
                        <div class="text-center flex-1">
                            <div class="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl text-brand-orange shadow-md">3</div>
                            <h4 class="font-bold mt-3 text-gray-800">AI Analysis</h4>
                            <p class="text-sm text-gray-600">Biomechanical Deficiencies</p>
                        </div>
                        <i class="fas fa-arrow-right text-gray-400 text-2xl hidden md:block"></i>
                        <div class="text-center flex-1">
                            <div class="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl text-brand-orange shadow-md">4</div>
                            <h4 class="font-bold mt-3 text-gray-800">Exercise Prescription</h4>
                            <p class="text-sm text-gray-600">Personalized Programs</p>
                        </div>
                        <i class="fas fa-arrow-right text-gray-400 text-2xl hidden md:block"></i>
                        <div class="text-center flex-1">
                            <div class="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl text-brand-orange shadow-md">5</div>
                            <h4 class="font-bold mt-3 text-gray-800">RPM Monitoring</h4>
                            <p class="text-sm text-gray-600">Compliance & Billing</p>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Footer -->
            <footer class="bg-gray-800 text-white mt-20 py-8">
                <div class="max-w-7xl mx-auto px-4 text-center">
                    <p>&copy; 2025 F-AI bian Assessment System. All rights reserved.</p>
                    <p class="text-gray-400 text-sm mt-2">Powered by Hono + Cloudflare Workers</p>
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
