import { config } from '../config/index.js';

export const emailService = {
  async sendEmail({ to, subject, text, html }) {
    if (config.email.resendApiKey) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.email.resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: config.email.from,
            to: Array.isArray(to) ? to : [to],
            subject,
            text,
            html: html || `<p>${text}</p>`
          })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || `Email API error (${res.status})`);
        }
        return { success: true, id: data.id, to, subject };
      } catch (err) {
        console.error('[Email Service] Error sending email via Resend API:', err.message);
        return { success: false, error: err.message };
      }
    }

    console.log(`[Email Service] ✉️ To: ${to} | Subject: ${subject} | Body: ${text}`);
    return { success: true, to, subject, simulated: true };
  },

  async sendOtp(email, otp, purpose = 'Verification') {
    const subject = `${purpose} OTP — Mountain & Memories`;
    const text = `Your ${purpose} verification code is: ${otp}. This code expires in 10 minutes.`;
    const html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="margin-top: 0; color: #1e293b;">Mountain &amp; Memories</h2>
        <p style="color: #475569; font-size: 14px;">Your one-time verification code for <strong>${purpose}</strong> is:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 16px; background: #f8fafc; text-align: center; border-radius: 8px; color: #0f172a; margin: 16px 0;">
          ${otp}
        </div>
        <p style="color: #64748b; font-size: 12px;">This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
      </div>
    `;
    return this.sendEmail({ to: email, subject, text, html });
  },

  async sendNotification(toEmail, subject, text, metadata = {}) {
    return this.sendEmail({ to: toEmail, subject, text });
  }
};
