// Notification Service (Twilio/Resend)

export async function sendTwilioSMS(
  accountSid: string,
  authToken: string,
  fromNumber: string,
  toNumber: string,
  message: string
) {
  const url = 'https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json';
  const credentials = btoa(accountSid + ':' + authToken);
  const formData = new URLSearchParams();
  formData.append('From', fromNumber);
  formData.append('To', toNumber);
  formData.append('Body', message);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  const data = await response.json() as any;
  if (response.ok) {
    return { success: true, messageId: data.sid };
  } else {
    return { success: false, error: data.message || 'SMS send failed' };
  }
}

export async function sendResendEmail(
  apiKey: string,
  fromEmail: string,
  toEmail: string,
  subject: string,
  htmlBody: string,
  textBody?: string
) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: subject,
      html: htmlBody,
      text: textBody || htmlBody.replace(/<[^>]*>/g, ''),
    }),
  });

  const data = await response.json() as any;
  if (response.ok) {
    return { success: true, emailId: data.id };
  } else {
    return { success: false, error: data.message || 'Email send failed' };
  }
}

export function generateEmailHTML(subject: string, body: string, type: string): string {
  const color = type === 'criticalRedFlag' ? '#dc2626' : '#2563eb';
  const icon = type === 'criticalRedFlag' ? '⚠️' : '📋';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;"><div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"><div style="text-align: center; margin-bottom: 20px;"><div style="font-size: 48px;">${icon}</div><h1 style="color: ${color}; margin: 10px 0;">${subject}</h1></div><div style="color: #334155; line-height: 1.6; white-space: pre-wrap;">${body}</div><hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;"><div style="text-align: center; color: #64748b; font-size: 12px;"><p><strong>Thrive Ortho EHR</strong></p><p>This is an automated message. Please do not reply directly to this email.</p><p style="margin-top: 10px;">© 2025 Thrive Ortho. All rights reserved.</p></div></div></body></html>`;
}
