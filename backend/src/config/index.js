import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'mountain-memories-super-secret-key-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  databaseUrl: process.env.DATABASE_URL || '',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174').split(','),
  
  // Demonstration UPI Configuration
  upi: {
    id: process.env.UPI_ID || 'mountainmemories@bank',
    name: process.env.UPI_NAME || 'Mountain and Memories Travel LLP',
    note: 'Mountain and Memories Trip Payment',
    qrTemplate: 'upi://pay?pa={upiId}&pn={name}&am={amount}&cu=INR&tn={note}'
  },

  // Media / Storage configuration
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local', // 'local' or 'r2'
    r2Bucket: process.env.R2_BUCKET || 'mountain-memories-media',
    r2Endpoint: process.env.R2_ENDPOINT || '',
    publicBaseUrl: process.env.MEDIA_PUBLIC_URL || '/uploads'
  },

  // Provisional refund schedule baseline
  refundPolicy: {
    version: '1.0-draft',
    rules: [
      { minDaysBefore: 7, refundPercentage: 90, label: '7 or more days before trip (90%)' },
      { minDaysBefore: 3, refundPercentage: 50, label: '3 to 6 days before trip (50% provisional)' },
      { minDaysBefore: 0, refundPercentage: 15, label: 'Trip day / 0-2 days before trip (15% provisional)' }
    ]
  }
};
