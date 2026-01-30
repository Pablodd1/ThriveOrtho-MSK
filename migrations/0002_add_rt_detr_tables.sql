-- RT-DETR Analysis Results Table
CREATE TABLE IF NOT EXISTS rt_detr_analysis (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  assessment_id TEXT NOT NULL,
  pose_results TEXT NOT NULL, -- JSON string containing pose data
  medical_report TEXT NOT NULL, -- JSON string containing medical report
  enhanced_analysis TEXT, -- JSON string containing enhanced analysis results
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (assessment_id) REFERENCES msk_assessments(id)
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_rt_detr_patient ON rt_detr_analysis(patient_id);
CREATE INDEX IF NOT EXISTS idx_rt_detr_assessment ON rt_detr_analysis(assessment_id);
CREATE INDEX IF NOT EXISTS idx_rt_detr_created ON rt_detr_analysis(created_at);

-- Table for storing RT-DETR configuration and metrics
CREATE TABLE IF NOT EXISTS rt_detr_metrics (
  id TEXT PRIMARY KEY,
  analysis_id TEXT NOT NULL,
  model_version TEXT NOT NULL,
  landmarks_detected INTEGER NOT NULL,
  confidence REAL NOT NULL,
  uncertainty REAL NOT NULL,
  injury_risk REAL NOT NULL,
  processing_time REAL NOT NULL,
  fps INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (analysis_id) REFERENCES rt_detr_analysis(id)
);

CREATE INDEX IF NOT EXISTS idx_rt_detr_metrics_analysis ON rt_detr_metrics(analysis_id);
CREATE INDEX IF NOT EXISTS idx_rt_detr_metrics_confidence ON rt_detr_metrics(confidence);