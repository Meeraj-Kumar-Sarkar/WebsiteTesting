import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'mountain-memories-super-secret-key-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  databaseUrl: process.env.DATABASE_URL || '',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean),

  masterAdmin: {
    empId: process.env.MASTER_ADMIN_EMP_ID || 'EMP-1001',
    fullName: process.env.MASTER_ADMIN_NAME || 'Master Administrator',
    email: process.env.MASTER_ADMIN_EMAIL || 'admin@mountainandmemories.com',
    phone: process.env.MASTER_ADMIN_PHONE || '+91 98765 43210',
    password: process.env.MASTER_ADMIN_PASSWORD || 'Password@123'
  },

  email: {
    resendApiKey: process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY || '',
    from: process.env.EMAIL_FROM || 'no-reply@mountainandmemories.com'
  },

  upi: {
    id: process.env.UPI_ID || 'mountainmemories@bank',
    name: process.env.UPI_NAME || 'Mountain and Memories Travel LLP',
    note: 'Mountain and Memories Trip Payment',
    qrTemplate: 'upi://pay?pa={upiId}&pn={name}&am={amount}&cu=INR&tn={note}'
  },

  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    r2Bucket: process.env.R2_BUCKET || 'mountain-memories-media',
    r2Endpoint: process.env.R2_ENDPOINT || '',
    r2AccessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    publicBaseUrl: process.env.MEDIA_PUBLIC_URL || '/uploads'
  },

  refundPolicy: {
    version: '1.0',
    rules: [
      { minDaysBefore: 7, refundPercentage: 90, label: '7 or more days before trip (90%)' },
      { minDaysBefore: 3, refundPercentage: 50, label: '3 to 6 days before trip (50%)' },
      { minDaysBefore: 0, refundPercentage: 15, label: 'Trip day / 0-2 days before trip (15%)' }
    ]
  }
};
