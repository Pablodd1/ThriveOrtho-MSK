// Cloudflare Workers Types
export type Bindings = {
  GEMINI_API_KEY: string;
  OPENAI_API_KEY: string;
  DB: D1Database;
  // Twilio SMS
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_FROM_NUMBER: string;
  // Resend Email
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  // Cloudflare R2 Storage
  R2_BUCKET: R2Bucket;
}

// Audit Log Interface
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  phiAccessed: boolean;
  outcome: 'success' | 'failure';
}

// Notification Configuration
export interface NotificationConfig {
  twilio?: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
  };
  sendgrid?: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  resend?: {
    apiKey: string;
    fromEmail: string;
  };
}
