import { Bindings, AuditLogEntry } from '../types';

// Helper: Generate UUID
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Log error to D1
export async function logError(db: D1Database, errorData: any) {
  if (!db) {
    console.warn('[ERROR LOG] DB not configured:', errorData);
    return;
  }
  try {
    await db.prepare(`
      INSERT INTO error_logs (id, error_type, message, stack_trace, url, user_agent, user_id, patient_id, assessment_id, context)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      errorData.id, errorData.error_type, errorData.message, errorData.stack_trace,
      errorData.url, errorData.user_agent, errorData.user_id, errorData.patient_id,
      errorData.assessment_id, errorData.context
    ).run();
  } catch (e) {
    console.error('[ERROR LOG] Failed to insert:', e);
  }
}

// Log Audit Event
export async function logAudit(db: D1Database, entry: AuditLogEntry) {
  if (!db) return;
  try {
    await db.prepare(`
      INSERT INTO audit_logs (
        id, timestamp, user_id, user_role, action, resource, resource_id,
        ip_address, user_agent, details, phi_accessed, outcome
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      entry.id, entry.timestamp, entry.userId, entry.userRole, entry.action,
      entry.resource, entry.resourceId, entry.ipAddress, entry.userAgent,
      JSON.stringify(entry.details), entry.phiAccessed ? 1 : 0, entry.outcome
    ).run();
  } catch (e) {
    console.error('[AUDIT LOG] Failed to insert:', e);
  }
}

// Log Red Flag
export async function logRedFlag(db: D1Database, flagData: any) {
  if (!db) return;
  try {
    await db.prepare(`
      INSERT INTO msk_red_flags (
        id, assessment_id, patient_id, flag_type, severity,
        context, exercise_name, detected_keyword
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      flagData.id, flagData.assessmentId, flagData.patientId, flagData.type,
      flagData.severity, flagData.context, flagData.exerciseName, flagData.keyword
    ).run();
  } catch (e) {
    console.error('[RED FLAG] Failed to insert:', e);
  }
}
