import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './modules/auth/authRoutes.js';
import employeeRoutes from './modules/employees/employeeRoutes.js';
import departmentRoutes from './modules/departments/departmentRoutes.js';
import enquiryRoutes from './modules/enquiries/enquiryRoutes.js';
import tripRequestRoutes from './modules/trip-requests/tripRequestRoutes.js';
import approvalRoutes from './modules/approvals/approvalRoutes.js';
import financeRoutes from './modules/finance/financeRoutes.js';
import paymentRoutes from './modules/payments/paymentRoutes.js';
import refundRoutes from './modules/refunds/refundRoutes.js';
import packageRoutes from './modules/packages/packageRoutes.js';
import tripRoutes from './modules/trips/tripRoutes.js';
import mediaRoutes from './modules/media/mediaRoutes.js';
import blogRoutes from './modules/blogs/blogRoutes.js';
import notificationRoutes from './modules/notifications/notificationRoutes.js';
import reportRoutes from './modules/reports/reportRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Cross-Origin Resource Sharing
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);
    return callback(null, true); // Dev-friendly permissive CORS
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-active-department']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Mountain and Memories Central Business API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/organization', departmentRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/trip-requests', tripRequestRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/refunds', refundRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);

// 404 Route
app.use((req, res, next) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Central Error Handler
app.use(errorHandler);

export default app;
