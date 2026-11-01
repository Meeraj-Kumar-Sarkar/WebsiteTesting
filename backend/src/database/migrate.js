import pkg from 'pg';
const { Pool } = pkg;
import { config } from '../config/index.js';

export const sqlSchema = `
-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permissions
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL
);

-- Role Permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_code VARCHAR(100) NOT NULL,
  PRIMARY KEY (role_id, permission_code)
);

-- Employees / Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  emp_id VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING_MASTER_APPROVAL',
  otp_hash VARCHAR(255),
  otp_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- User Department Roles
CREATE TABLE IF NOT EXISTS user_department_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  department_code VARCHAR(50) NOT NULL,
  role_code VARCHAR(50) NOT NULL,
  PRIMARY KEY (user_id, department_code, role_code)
);

-- Enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id VARCHAR(50) UNIQUE NOT NULL,
  source VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  whatsapp_number VARCHAR(50),
  email VARCHAR(255),
  selected_package VARCHAR(255),
  travel_dates VARCHAR(100),
  traveller_count INT DEFAULT 1,
  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'NEW',
  is_duplicate BOOLEAN DEFAULT FALSE,
  merged_into VARCHAR(50),
  is_archived BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trip Requests
CREATE TABLE IF NOT EXISTS trip_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_request_id VARCHAR(50) UNIQUE NOT NULL,
  enquiry_id VARCHAR(50),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  package_name VARCHAR(255),
  travel_dates VARCHAR(100),
  traveller_count INT DEFAULT 1,
  agreed_amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  sales_notes TEXT,
  customer_requirements TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
  deposit_allowed BOOLEAN DEFAULT FALSE,
  deposit_amount NUMERIC(12, 2) DEFAULT 0,
  deposit_due_date DATE,
  rejection_reason TEXT,
  change_request_notes TEXT,
  submitted_by VARCHAR(50),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Travellers
CREATE TABLE IF NOT EXISTS travellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_request_id VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  age INT,
  dob DATE,
  gender VARCHAR(20),
  phone VARCHAR(50),
  email VARCHAR(255),
  emergency_contact VARCHAR(50),
  relationship VARCHAR(100),
  special_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id VARCHAR(50) UNIQUE NOT NULL,
  trip_request_id VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_email VARCHAR(255),
  total_amount NUMERIC(12, 2) NOT NULL,
  taxes NUMERIC(12, 2) DEFAULT 0,
  amount_received NUMERIC(12, 2) DEFAULT 0,
  balance_due NUMERIC(12, 2) NOT NULL,
  due_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'UNPAID',
  upi_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id VARCHAR(50) UNIQUE NOT NULL,
  invoice_id VARCHAR(50) NOT NULL,
  trip_request_id VARCHAR(50) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  method VARCHAR(50) DEFAULT 'UPI_QR_MANUAL',
  transaction_ref VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING_VERIFICATION',
  verified_by VARCHAR(50),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Operational Trips
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id VARCHAR(50) UNIQUE NOT NULL,
  trip_request_id VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_email VARCHAR(255),
  travel_dates VARCHAR(100),
  traveller_count INT DEFAULT 1,
  sales_emp_id VARCHAR(50),
  assigned_media_emp_ids TEXT[],
  status VARCHAR(50) NOT NULL DEFAULT 'AWAITING_SUPPLIER_BOOKING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id VARCHAR(50),
  actor_name VARCHAR(255),
  department VARCHAR(50),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(50),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id VARCHAR(50),
  recipient_dept VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  linked_record_type VARCHAR(50),
  linked_record_id VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

export async function runMigrations() {
  if (!config.databaseUrl) {
    console.log('[Migrations] No PostgreSQL DATABASE_URL configured. Local persistence engine is active.');
    return;
  }
  const pool = new Pool({ connectionString: config.databaseUrl });
  try {
    console.log('[Migrations] Running PostgreSQL migrations...');
    await pool.query(sqlSchema);
    console.log('[Migrations] PostgreSQL tables verified / created successfully.');
  } catch (err) {
    console.error('[Migrations] Migration failed:', err.message);
  } finally {
    await pool.end();
  }
}

if (process.argv[1] && process.argv[1].endsWith('migrate.js')) {
  runMigrations();
}
