-- MSK Assessment System - Persistent Storage
-- Migration: 0008_msk_assessments
-- Created: December 2025
-- Purpose: Store MSK assessments, red flags, and error logs for clinical history

-- ============================================
-- MSK ASSESSMENTS TABLE
-- Stores full body assessment sessions
-- ============================================
CREATE TABLE IF NOT EXISTS msk_assessments (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    patient_id TEXT,
    session_id TEXT NOT NULL,
    
    -- Assessment metadata
    start_time TEXT NOT NULL,
    end_time TEXT,
    duration_seconds INTEGER,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned', 'error')),
    
    -- Tracking quality metrics
    avg_fps REAL,
    avg_quality REAL,
    total_frames INTEGER,
    landmarks_detected INTEGER,
    
    -- Exercise results (JSON array)
    exercises TEXT NOT NULL DEFAULT '[]',
    -- Format: [{"name": "Deep Squat", "reps": 5, "target": 5, "score": 3, "maxAngles": {...}, "skipped": false}]
    
    -- Summary metrics
    total_exercises INTEGER DEFAULT 0,
    completed_exercises INTEGER DEFAULT 0,
    total_reps INTEGER DEFAULT 0,
    overall_score REAL DEFAULT 0,
    
    -- Transcript from speech recognition
    transcript TEXT,
    
    -- Device info
    user_agent TEXT,
    camera_device TEXT,
    
    -- Timestamps
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
);

CREATE INDEX idx_msk_assessments_patient ON msk_assessments(patient_id);
CREATE INDEX idx_msk_assessments_session ON msk_assessments(session_id);
CREATE INDEX idx_msk_assessments_status ON msk_assessments(status);
CREATE INDEX idx_msk_assessments_created ON msk_assessments(created_at DESC);

-- ============================================
-- RED FLAGS TABLE
-- Clinical alerts detected during assessment
-- ============================================
CREATE TABLE IF NOT EXISTS msk_red_flags (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    assessment_id TEXT,
    patient_id TEXT,
    
    -- Flag details
    flag_type TEXT NOT NULL CHECK (flag_type IN (
        'pain', 'fall_risk', 'acute', 'numbness', 'weakness', 
        'dizziness', 'swelling', 'instability', 'other'
    )),
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Context
    context TEXT, -- What the patient said or movement that triggered
    exercise_name TEXT,
    detected_keyword TEXT,
    
    -- Clinical response
    acknowledged INTEGER DEFAULT 0,
    acknowledged_by TEXT,
    acknowledged_at TEXT,
    clinical_notes TEXT,
    
    -- Timestamps
    created_at TEXT DEFAULT (datetime('now')),
    
    FOREIGN KEY (assessment_id) REFERENCES msk_assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
);

CREATE INDEX idx_red_flags_assessment ON msk_red_flags(assessment_id);
CREATE INDEX idx_red_flags_patient ON msk_red_flags(patient_id);
CREATE INDEX idx_red_flags_type ON msk_red_flags(flag_type);
CREATE INDEX idx_red_flags_severity ON msk_red_flags(severity);
CREATE INDEX idx_red_flags_unack ON msk_red_flags(acknowledged) WHERE acknowledged = 0;
CREATE INDEX idx_red_flags_created ON msk_red_flags(created_at DESC);

-- ============================================
-- ERROR LOGS TABLE
-- Application error tracking (fails silently)
-- ============================================
CREATE TABLE IF NOT EXISTS error_logs (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    
    -- Error details
    error_type TEXT NOT NULL DEFAULT 'error' CHECK (error_type IN ('error', 'warning', 'critical', 'info')),
    message TEXT NOT NULL,
    stack_trace TEXT,
    
    -- Context
    url TEXT,
    user_agent TEXT,
    user_id TEXT,
    patient_id TEXT,
    assessment_id TEXT,
    
    -- Additional context (JSON)
    context TEXT,
    
    -- Timestamp
    created_at TEXT DEFAULT (datetime('now')),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL,
    FOREIGN KEY (assessment_id) REFERENCES msk_assessments(id) ON DELETE SET NULL
);

CREATE INDEX idx_error_logs_type ON error_logs(error_type);
CREATE INDEX idx_error_logs_created ON error_logs(created_at DESC);
CREATE INDEX idx_error_logs_user ON error_logs(user_id);

-- ============================================
-- JOINT ANGLE HISTORY TABLE
-- Detailed angle measurements per frame (optional, for research)
-- ============================================
CREATE TABLE IF NOT EXISTS msk_angle_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assessment_id TEXT NOT NULL,
    
    -- Frame info
    frame_number INTEGER NOT NULL,
    timestamp_ms INTEGER NOT NULL,
    
    -- Angle measurements (JSON)
    angles TEXT NOT NULL,
    -- Format: {"knee_L": 145, "knee_R": 142, "hip_L": 165, ...}
    
    -- Quality metrics
    confidence REAL,
    landmarks_visible INTEGER,
    
    FOREIGN KEY (assessment_id) REFERENCES msk_assessments(id) ON DELETE CASCADE
);

CREATE INDEX idx_angle_history_assessment ON msk_angle_history(assessment_id);

-- ============================================
-- VIEWS FOR EASY QUERYING
-- ============================================

-- Recent assessments with red flag count
CREATE VIEW IF NOT EXISTS v_recent_assessments AS
SELECT 
    a.id,
    a.patient_id,
    a.session_id,
    a.start_time,
    a.duration_seconds,
    a.status,
    a.total_exercises,
    a.completed_exercises,
    a.overall_score,
    COUNT(rf.id) as red_flag_count,
    SUM(CASE WHEN rf.severity = 'critical' THEN 1 ELSE 0 END) as critical_flags
FROM msk_assessments a
LEFT JOIN msk_red_flags rf ON rf.assessment_id = a.id
GROUP BY a.id
ORDER BY a.created_at DESC;

-- Unacknowledged critical flags
CREATE VIEW IF NOT EXISTS v_critical_flags AS
SELECT 
    rf.*,
    a.session_id,
    p.first_name || ' ' || p.last_name as patient_name
FROM msk_red_flags rf
LEFT JOIN msk_assessments a ON rf.assessment_id = a.id
LEFT JOIN patients p ON rf.patient_id = p.id
WHERE rf.acknowledged = 0 AND rf.severity IN ('high', 'critical')
ORDER BY rf.created_at DESC;
