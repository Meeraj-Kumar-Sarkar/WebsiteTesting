import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { store } from './db.js';
import { config } from '../config/index.js';

export async function seedDatabase() {
  console.log('[Bootstrap] Ensuring baseline organization RBAC and Master Administrator...');

  // 1. Core Departments
  if (!store.get('departments').length) {
    store.data.departments = [
      {
        id: uuidv4(),
        code: 'MASTER',
        name: 'Master / Management',
        description: 'CEO-level oversight, executive approvals, organization configuration and system administration.'
      },
      {
        id: uuidv4(),
        code: 'SALES',
        name: 'Sales & Operations',
        description: 'Customer enquiries, price negotiation, traveller details collection, supplier coordination.'
      },
      {
        id: uuidv4(),
        code: 'FINANCE',
        name: 'Finance & Accounts',
        description: 'Financial feasibility assessment, invoices, payment verification, and refunds.'
      },
      {
        id: uuidv4(),
        code: 'MARKETING',
        name: 'Marketing & Media',
        description: 'Trip photography, videography, customer archives, public gallery, and travel blogs.'
      }
    ];
  }

  // 2. Permissions Catalogue
  if (!store.get('permissions').length) {
    store.data.permissions = [
      { code: 'enquiries.view', category: 'Enquiries', description: 'View customer enquiries' },
      { code: 'enquiries.create', category: 'Enquiries', description: 'Create phone/email enquiries' },
      { code: 'enquiries.update', category: 'Enquiries', description: 'Update enquiry statuses & follow-up notes' },
      { code: 'enquiries.merge', category: 'Enquiries', description: 'Resolve and merge duplicate enquiries' },
      { code: 'enquiries.archive', category: 'Enquiries', description: 'Archive enquiries' },

      { code: 'customers.view', category: 'Customers', description: 'View customer contact information' },
      { code: 'customers.update', category: 'Customers', description: 'Edit customer records' },
      { code: 'travellers.manage', category: 'Customers', description: 'View and manage traveller details' },

      { code: 'trip_requests.view', category: 'Trip Requests', description: 'View trip requests' },
      { code: 'trip_requests.create', category: 'Trip Requests', description: 'Draft and prepare trip requests' },
      { code: 'trip_requests.submit', category: 'Trip Requests', description: 'Submit trip requests to Finance & Master' },

      { code: 'approvals.view', category: 'Approvals', description: 'View executive approval queue' },
      { code: 'approvals.approve', category: 'Approvals', description: 'Authorize trip requests & cancellations' },
      { code: 'approvals.reject', category: 'Approvals', description: 'Reject requests with written reason' },
      { code: 'approvals.request_changes', category: 'Approvals', description: 'Return trip requests to Sales for changes' },

      { code: 'finance.view', category: 'Finance', description: 'View financial queue and metrics' },
      { code: 'finance.report.create', category: 'Finance', description: 'Prepare trip cost and feasibility reports' },
      { code: 'invoices.create', category: 'Finance', description: 'Generate invoices and payment requests' },
      { code: 'payments.verify', category: 'Finance', description: 'Verify customer payments against bank/UPI records' },
      { code: 'refunds.calculate', category: 'Finance', description: 'Calculate refunds per policy' },
      { code: 'refunds.execute', category: 'Finance', description: 'Execute and record approved refunds' },

      { code: 'packages.view', category: 'Packages', description: 'View package catalogue and itineraries' },
      { code: 'packages.create', category: 'Packages', description: 'Create tour packages and itineraries' },
      { code: 'packages.update', category: 'Packages', description: 'Update package details, prices, availability' },
      { code: 'packages.disable', category: 'Packages', description: 'Disable or publish tour packages' },

      { code: 'media.upload', category: 'Media', description: 'Upload trip photos and videos' },
      { code: 'media.edit_metadata', category: 'Media', description: 'Manage metadata, categories, captions' },
      { code: 'media.mark_public', category: 'Media', description: 'Promote assets to public gallery' },
      { code: 'media.archive', category: 'Media', description: 'Prepare customer media delivery archives' },
      { code: 'media.share_customer', category: 'Media', description: 'Share approved archives with customers' },

      { code: 'blogs.create', category: 'Blogs', description: 'Write blog drafts and stories' },
      { code: 'blogs.update_own', category: 'Blogs', description: 'Update own published or draft blogs' },
      { code: 'blogs.publish', category: 'Blogs', description: 'Publish blogs directly to website' },
      { code: 'blogs.hide', category: 'Blogs', description: 'Master power to hide/unpublish blog content' },

      { code: 'employees.view', category: 'Employees', description: 'View employee directory' },
      { code: 'employees.invite', category: 'Employees', description: 'Approve new registrations' },
      { code: 'employees.suspend', category: 'Employees', description: 'Freeze, suspend, or block accounts' },
      { code: 'employees.assign_roles', category: 'Employees', description: 'Assign departments and roles' },

      { code: 'reports.view', category: 'Reports', description: 'View audit logs and business reports' },
      { code: 'reports.export', category: 'Reports', description: 'Export audit and financial data to CSV/Excel' },

      { code: 'departments.manage', category: 'System', description: 'Create and configure departments' },
      { code: 'roles.manage', category: 'System', description: 'Create and configure roles' },
      { code: 'permissions.assign', category: 'System', description: 'Assign permissions to roles' },
      { code: 'system.settings.manage', category: 'System', description: 'Configure UPI, policies, and company info' }
    ];
  }

  // 3. Core Roles
  if (!store.get('roles').length) {
    store.data.roles = [
      {
        id: uuidv4(),
        departmentCode: 'MASTER',
        code: 'MASTER_ADMIN',
        name: 'Master Administrator / CEO',
        description: 'Unrestricted system authority across all departments and workflows.',
        permissions: ['*']
      },
      {
        id: uuidv4(),
        departmentCode: 'SALES',
        code: 'SALES_OFFICER',
        name: 'Sales Specialist',
        description: 'Manages customer enquiries, negotiations, travellers, trip requests and supplier contact after clearance.',
        permissions: [
          'enquiries.view', 'enquiries.create', 'enquiries.update', 'enquiries.merge', 'enquiries.archive',
          'customers.view', 'customers.update', 'travellers.manage',
          'trip_requests.view', 'trip_requests.create', 'trip_requests.submit',
          'packages.view'
        ]
      },
      {
        id: uuidv4(),
        departmentCode: 'FINANCE',
        code: 'FINANCE_OFFICER',
        name: 'Finance Officer',
        description: 'Assesses trip feasibility, generates invoices, verifies payments, and executes approved refunds.',
        permissions: [
          'finance.view', 'finance.report.create', 'invoices.create', 'payments.verify',
          'refunds.calculate', 'refunds.execute', 'trip_requests.view', 'customers.view'
        ]
      },
      {
        id: uuidv4(),
        departmentCode: 'MARKETING',
        code: 'MEDIA_SPECIALIST',
        name: 'Photographer & Media Specialist',
        description: 'Captures and edits trip media, prepares customer delivery archives, and writes travel blogs.',
        permissions: [
          'media.upload', 'media.edit_metadata', 'media.mark_public', 'media.archive', 'media.share_customer',
          'blogs.create', 'blogs.update_own', 'blogs.publish', 'packages.view'
        ]
      }
    ];
  }

  // 4. Initial Master Admin User (from .env)
  if (!store.get('users').length) {
    const passwordHash = await bcrypt.hash(config.masterAdmin.password, 10);
    const adminUser = {
      id: uuidv4(),
      empId: config.masterAdmin.empId,
      fullName: config.masterAdmin.fullName,
      email: config.masterAdmin.email.toLowerCase(),
      phone: config.masterAdmin.phone,
      passwordHash,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.data.users = [adminUser];
    store.data.userDepartmentRoles = [
      { userId: adminUser.id, departmentCode: 'MASTER', roleCode: 'MASTER_ADMIN' }
    ];
  }

  store.save();
  console.log('[Bootstrap] System structure verified.');
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}
