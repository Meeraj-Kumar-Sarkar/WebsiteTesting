export const emailService = {
  async sendOtp(email, otp, purpose = 'Verification') {
    console.log(`[Email Service] ✉️ Sending ${purpose} OTP to ${email}: [ ${otp} ] (Valid for 10 minutes)`);
    return { success: true, email, purpose, message: 'OTP dispatched successfully' };
  },

  async sendNotification(toEmail, subject, text, metadata = {}) {
    console.log(`[Email Service] ✉️ Notification to ${toEmail}: [${subject}]`);
    return { success: true, toEmail, subject };
  }
};
