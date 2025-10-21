-- Migration 0003: Add Height and Weight to Patients Table
-- Required for complete patient intake form

-- Add height column (in centimeters)
ALTER TABLE patients ADD COLUMN height_cm REAL;

-- Add weight column (in kilograms)
ALTER TABLE patients ADD COLUMN weight_kg REAL;

-- Note: SQLite doesn't support adding CHECK constraints to existing tables
-- The application layer should validate:
-- - height_cm: 100-250 (reasonable range for adults)
-- - weight_kg: 30-300 (reasonable range for adults)
