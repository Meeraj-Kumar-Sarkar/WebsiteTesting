import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { store } from './db.js';

export async function seedDatabase() {
  console.log('[Seed] Seeding database with initial organization structure and demo records...');

  // 1. Departments
  const departments = [
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
  store.data.departments = departments;

  // 2. Permissions Catalogue
  const permissions = [
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
  store.data.permissions = permissions;

  // 3. Roles
  const roles = [
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
  store.data.roles = roles;

  // 4. Employees / Users
  const passwordHash = await bcrypt.hash('Password@123', 10);

  const users = [
    {
      id: uuidv4(),
      empId: 'EMP-1001',
      fullName: 'Vikramaditya Rathore',
      email: 'admin@mountainandmemories.com',
      phone: '+91 98160 11001',
      passwordHash,
      status: 'ACTIVE',
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
    },
    {
      id: uuidv4(),
      empId: 'EMP-1002',
      fullName: 'Priya Sharma',
      email: 'priya.sharma@mountainandmemories.com',
      phone: '+91 98160 11002',
      passwordHash,
      status: 'ACTIVE',
      createdAt: new Date(Date.now() - 45 * 86400000).toISOString()
    },
    {
      id: uuidv4(),
      empId: 'EMP-1003',
      fullName: 'Arjun Mehta',
      email: 'arjun.mehta@mountainandmemories.com',
      phone: '+91 98160 11003',
      passwordHash,
      status: 'ACTIVE',
      createdAt: new Date(Date.now() - 40 * 86400000).toISOString()
    },
    {
      id: uuidv4(),
      empId: 'EMP-1004',
      fullName: 'Rohit Verma',
      email: 'rohit.verma@mountainandmemories.com',
      phone: '+91 98160 11004',
      passwordHash,
      status: 'ACTIVE',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
    },
    {
      id: uuidv4(),
      empId: 'EMP-1005',
      fullName: 'Sunita Chauhan',
      email: 'sunita.chauhan@mountainandmemories.com',
      phone: '+91 98160 11005',
      passwordHash,
      status: 'PENDING_MASTER_APPROVAL',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
    }
  ];
  store.data.users = users;

  // Department Memberships
  store.data.userDepartmentRoles = [
    { userId: users[0].id, departmentCode: 'MASTER', roleCode: 'MASTER_ADMIN' },
    { userId: users[1].id, departmentCode: 'SALES', roleCode: 'SALES_OFFICER' },
    { userId: users[2].id, departmentCode: 'FINANCE', roleCode: 'FINANCE_OFFICER' },
    { userId: users[3].id, departmentCode: 'MARKETING', roleCode: 'MEDIA_SPECIALIST' }
  ];

  // 5. Packages
  const packages = [
    {
      id: uuidv4(),
      packageId: 'PKG-SPITI-7D',
      name: 'Spiti Valley High-Pass Circuit',
      shortDescription: '7-day classic circuit covering Shimla, Kalpa, Tabo, Kaza, and Kunzum Pass.',
      duration: '7 Days / 6 Nights',
      states: 'Himachal Pradesh',
      destinations: ['Shimla', 'Kalpa', 'Nako', 'Tabo', 'Kaza', 'Key Monastery', 'Chandra Taal', 'Manali'],
      coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200',
      status: 'PUBLISHED',
      basePrice: 34500,
      currency: 'INR',
      maxCapacity: 12,
      inclusions: ['4x4 Vehicle with expert mountain driver', 'Boutique stay/homestays', 'Breakfast & Dinner', 'Inner line permits'],
      exclusions: ['Airfare to Chandigarh/Delhi', 'Personal expenses', 'Emergency evacuation insurance'],
      accommodationCategories: ['3_STAR', '4_STAR', 'HOMESTAY_PREMIUM'],
      itineraries: [
        { day: 1, title: 'Arrival in Shimla to Narkanda', description: 'Scenic drive through apple orchards with panoramic Himalayan views.' },
        { day: 2, title: 'Narkanda to Kalpa & Sangla Valley', description: 'Drive along the Sutlej river gorge and view Kinnaur Kailash peak.' },
        { day: 3, title: 'Kalpa to Tabo via Nako Lake', description: 'Visit 1000-year old Tabo Monastery (Ajanta of the Himalayas).' },
        { day: 4, title: 'Tabo to Kaza with Dhankar Gompa', description: 'Climb to the cliffside Dhankar Gompa and head into Spiti valley capital.' },
        { day: 5, title: 'Kaza Exploration: Key, Kibber & Hikkim', description: 'World highest post office in Hikkim and fossil village Langza.' },
        { day: 6, title: 'Kaza to Chandra Taal via Kunzum Pass', description: 'Cross 4,551m Kunzum Pass to reach the crescent Moon Lake.' },
        { day: 7, title: 'Chandra Taal to Manali via Atal Tunnel', description: 'Descent into Kullu valley with unforgettable high mountain memories.' }
      ]
    },
    {
      id: uuidv4(),
      packageId: 'PKG-KINNAUR-9D',
      name: 'Kinnaur & Spiti Cultural Deep Dive',
      shortDescription: '9-day exploration of tribal architecture, Buddhist relics, and alpine deserts.',
      duration: '9 Days / 8 Nights',
      states: 'Himachal Pradesh',
      destinations: ['Shimla', 'Sarahan', 'Sangla', 'Chitkul', 'Kalpa', 'Kaza', 'Manali'],
      coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200',
      status: 'PUBLISHED',
      basePrice: 46000,
      currency: 'INR',
      maxCapacity: 10,
      inclusions: ['Private Innova/Scorpio', 'Selected heritage stays', 'All meals', 'Local cultural guide'],
      exclusions: ['Travel to pickup hub', 'Tips and porterage'],
      accommodationCategories: ['3_STAR', '4_STAR'],
      itineraries: [
        { day: 1, title: 'Chandigarh to Sarahan', description: 'Visit the historic Bhimakali Temple.' },
        { day: 2, title: 'Sarahan to Sangla Valley', description: 'Drive into Baspa valley.' },
        { day: 3, title: 'Excursion to Chitkul', description: 'Last inhabited village on Indo-Tibetan border.' },
        { day: 4, title: 'Sangla to Kalpa', description: 'Apple orchards and suicide point views.' }
      ]
    },
    {
      id: uuidv4(),
      packageId: 'PKG-WINTER-8D',
      name: 'Winter Spiti & Snow Leopard Trail',
      shortDescription: '8-day extreme winter expedition for wildlife enthusiasts and intrepid explorers.',
      duration: '8 Days / 7 Nights',
      states: 'Himachal Pradesh',
      destinations: ['Kaza', 'Kibber Wildlife Sanctuary', 'Chicham'],
      coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
      status: 'DRAFT',
      basePrice: 65000,
      currency: 'INR',
      maxCapacity: 6,
      inclusions: ['Heated rooms/homestays', 'Certified local spotters', 'Sub-zero expedition gear guidance'],
      exclusions: ['Camera equipment', 'Insurance'],
      accommodationCategories: ['HOMESTAY_PREMIUM'],
      itineraries: []
    }
  ];
  store.data.packages = packages;

  // 6. Enquiries
  const enquiries = [
    {
      id: uuidv4(),
      enquiryId: 'ENQ-2001',
      source: 'WEBSITE',
      customerName: 'Ananya Deshmukh',
      phone: '+91 98200 45678',
      whatsappNumber: '+91 98200 45678',
      email: 'ananya.deshmukh@gmail.com',
      selectedPackage: 'Spiti Valley High-Pass Circuit',
      travelDates: '15 Dec 2026 - 22 Dec 2026',
      travellerCount: 4,
      message: 'Looking for a private 4x4 group trip with elderly-friendly accommodation in Kaza.',
      status: 'NEGOTIATION',
      isDuplicate: false,
      isArchived: false,
      createdBy: 'SYSTEM',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: uuidv4(),
      enquiryId: 'ENQ-2002',
      source: 'PHONE_CALL',
      customerName: 'Rajesh Kothari',
      phone: '+91 98450 12345',
      whatsappNumber: '+91 98450 12345',
      email: 'rajesh.kothari@techcorp.in',
      selectedPackage: 'Kinnaur & Spiti Cultural Deep Dive',
      travelDates: '20 Dec 2026 - 28 Dec 2026',
      travellerCount: 2,
      message: 'Honeymoon couple trip. Prefers boutique luxury stays and private photographer.',
      status: 'CUSTOMER_ACCEPTED_QUOTE',
      isDuplicate: false,
      isArchived: false,
      createdBy: 'EMP-1002',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: uuidv4(),
      enquiryId: 'ENQ-2003',
      source: 'WEBSITE',
      customerName: 'Rajesh Kothari',
      phone: '+91 98450 12345',
      whatsappNumber: '+91 98450 12345',
      email: 'rajesh.kothari@techcorp.in',
      selectedPackage: 'Kinnaur & Spiti Cultural Deep Dive',
      travelDates: '20 Dec 2026 - 28 Dec 2026',
      travellerCount: 2,
      message: 'Submitting enquiry again to confirm availability for December.',
      status: 'NEW',
      isDuplicate: true,
      duplicateOfEnquiryId: 'ENQ-2002',
      isArchived: false,
      createdBy: 'SYSTEM',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: uuidv4(),
      enquiryId: 'ENQ-2004',
      source: 'EMAIL',
      customerName: 'Kabir Sen',
      phone: '+91 99100 88776',
      whatsappNumber: '+91 99100 88776',
      email: 'kabir.sen@gmail.com',
      selectedPackage: 'Custom Himachal Tour',
      travelDates: '05 Jan 2027 - 12 Jan 2027',
      travellerCount: 5,
      message: 'College reunion trip, adventure focused, camping at Chandra Taal if open.',
      status: 'CONTACTED',
      isDuplicate: false,
      isArchived: false,
      createdBy: 'EMP-1002',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    }
  ];
  store.data.enquiries = enquiries;

  // Enquiry Notes
  store.data.enquiryNotes = [
    {
      id: uuidv4(),
      enquiryId: 'ENQ-2001',
      authorEmpId: 'EMP-1002',
      authorName: 'Priya Sharma',
      contactMethod: 'PHONE_CALL',
      notes: 'Customer inquired about high-altitude acclimatization. Quoted INR 1,48,000 for 4 people with 4-star stays.',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: uuidv4(),
      enquiryId: 'ENQ-2002',
      authorEmpId: 'EMP-1002',
      authorName: 'Priya Sharma',
      contactMethod: 'WHATSAPP',
      notes: 'Agreed on quote of INR 95,000 for 2 travellers including photographer package. Collecting traveller passport/Aadhaar details.',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ];

  // 7. Trip Requests & Travellers
  const tripRequests = [
    {
      id: uuidv4(),
      tripRequestId: 'REQ-3001',
      enquiryId: 'ENQ-2002',
      customerName: 'Rajesh Kothari',
      customerPhone: '+91 98450 12345',
      customerEmail: 'rajesh.kothari@techcorp.in',
      packageName: 'Kinnaur & Spiti Cultural Deep Dive',
      travelDates: '20 Dec 2026 - 28 Dec 2026',
      travellerCount: 2,
      agreedAmount: 95000,
      currency: 'INR',
      salesNotes: 'Agreed customer price includes custom photography arrangement. Full payment upfront.',
      customerRequirements: 'Heated rooms required in Kalpa. Vegetarian food preferences.',
      status: 'PAYMENT_PENDING',
      depositAllowed: false,
      depositAmount: 0,
      submittedBy: 'EMP-1002',
      submittedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
    },
    {
      id: uuidv4(),
      tripRequestId: 'REQ-3002',
      enquiryId: null,
      customerName: 'Siddharth Roy',
      customerPhone: '+91 98111 22334',
      customerEmail: 'siddharth.roy@investments.com',
      packageName: 'Spiti Valley High-Pass Circuit',
      travelDates: '10 Dec 2026 - 17 Dec 2026',
      travellerCount: 4,
      agreedAmount: 142000,
      currency: 'INR',
      salesNotes: 'Customer accepted quotation. Payment verified by Finance. Ready for Master approval.',
      customerRequirements: 'Oxygen cylinder in 4x4 vehicle. Senior citizen traveller included.',
      status: 'MASTER_REVIEW',
      depositAllowed: false,
      depositAmount: 0,
      submittedBy: 'EMP-1002',
      submittedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
      createdAt: new Date(Date.now() - 48 * 3600000).toISOString()
    },
    {
      id: uuidv4(),
      tripRequestId: 'REQ-3003',
      enquiryId: null,
      customerName: 'Dr. Meenakshi Sundaram',
      customerPhone: '+91 94440 55667',
      customerEmail: 'meenakshi.s@chennaiclinic.org',
      packageName: 'Spiti Valley High-Pass Circuit',
      travelDates: '01 Dec 2026 - 07 Dec 2026',
      travellerCount: 3,
      agreedAmount: 110000,
      currency: 'INR',
      salesNotes: 'Finance and Master clearance granted. Sales is currently booking suppliers.',
      customerRequirements: 'Homestay experiences in Langza and Kibber.',
      status: 'APPROVED_FOR_SUPPLIER_BOOKING',
      depositAllowed: false,
      depositAmount: 0,
      submittedBy: 'EMP-1002',
      submittedAt: new Date(Date.now() - 96 * 3600000).toISOString(),
      createdAt: new Date(Date.now() - 96 * 3600000).toISOString()
    }
  ];
  store.data.tripRequests = tripRequests;

  // Travellers
  store.data.travellers = [
    {
      id: uuidv4(),
      tripRequestId: 'REQ-3001',
      fullName: 'Rajesh Kothari',
      age: 31,
      dob: '1995-04-12',
      gender: 'Male',
      phone: '+91 98450 12345',
      email: 'rajesh.kothari@techcorp.in',
      emergencyContact: '+91 98450 99999 (Father)',
      relationship: 'Primary Contact',
      specialNotes: 'No medical conditions'
    },
    {
      id: uuidv4(),
      tripRequestId: 'REQ-3001',
      fullName: 'Neha Kothari',
      age: 29,
      dob: '1997-08-25',
      gender: 'Female',
      phone: '+91 98450 12346',
      email: 'neha.k@techcorp.in',
      emergencyContact: '+91 98450 99999',
      relationship: 'Spouse',
      specialNotes: 'Mild motion sickness on sharp hairpins'
    },
    {
      id: uuidv4(),
      tripRequestId: 'REQ-3002',
      fullName: 'Siddharth Roy',
      age: 42,
      dob: '1984-06-15',
      gender: 'Male',
      phone: '+91 98111 22334',
      emergencyContact: '+91 98111 00000',
      relationship: 'Primary Contact',
      specialNotes: 'None'
    },
    {
      id: uuidv4(),
      tripRequestId: 'REQ-3002',
      fullName: 'Bina Roy',
      age: 68,
      dob: '1958-02-10',
      gender: 'Female',
      emergencyContact: '+91 98111 22334',
      relationship: 'Mother',
      specialNotes: 'Needs low floor room, slight asthma'
    }
  ];

  // 8. Invoices and Payments
  const invoices = [
    {
      id: uuidv4(),
      invoiceId: 'INV-4001',
      tripRequestId: 'REQ-3001',
      customerName: 'Rajesh Kothari',
      customerPhone: '+91 98450 12345',
      customerEmail: 'rajesh.kothari@techcorp.in',
      totalAmount: 95000,
      taxes: 4750,
      amountReceived: 0,
      balanceDue: 95000,
      dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      status: 'UNPAID',
      upiId: 'mountainmemories@bank',
      createdAt: new Date(Date.now() - 20 * 3600000).toISOString()
    },
    {
      id: uuidv4(),
      invoiceId: 'INV-4002',
      tripRequestId: 'REQ-3002',
      customerName: 'Siddharth Roy',
      customerPhone: '+91 98111 22334',
      customerEmail: 'siddharth.roy@investments.com',
      totalAmount: 142000,
      taxes: 7100,
      amountReceived: 142000,
      balanceDue: 0,
      dueDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      status: 'PAID',
      upiId: 'mountainmemories@bank',
      createdAt: new Date(Date.now() - 40 * 3600000).toISOString()
    },
    {
      id: uuidv4(),
      invoiceId: 'INV-4003',
      tripRequestId: 'REQ-3003',
      customerName: 'Dr. Meenakshi Sundaram',
      customerPhone: '+91 94440 55667',
      customerEmail: 'meenakshi.s@chennaiclinic.org',
      totalAmount: 110000,
      taxes: 5500,
      amountReceived: 110000,
      balanceDue: 0,
      dueDate: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      status: 'PAID',
      upiId: 'mountainmemories@bank',
      createdAt: new Date(Date.now() - 90 * 3600000).toISOString()
    }
  ];
  store.data.invoices = invoices;

  // Payments
  const payments = [
    {
      id: uuidv4(),
      paymentId: 'PAY-5001',
      invoiceId: 'INV-4002',
      tripRequestId: 'REQ-3002',
      amount: 142000,
      method: 'UPI_QR_MANUAL',
      transactionRef: 'UPI/HDFC/631109884210',
      status: 'VERIFIED',
      verifiedBy: 'EMP-1003',
      verifiedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
      createdAt: new Date(Date.now() - 38 * 3600000).toISOString()
    },
    {
      id: uuidv4(),
      paymentId: 'PAY-5002',
      invoiceId: 'INV-4003',
      tripRequestId: 'REQ-3003',
      amount: 110000,
      method: 'BANK_TRANSFER_MANUAL',
      transactionRef: 'NEFT/ICIC2288110044',
      status: 'VERIFIED',
      verifiedBy: 'EMP-1003',
      verifiedAt: new Date(Date.now() - 85 * 3600000).toISOString(),
      createdAt: new Date(Date.now() - 88 * 3600000).toISOString()
    }
  ];
  store.data.payments = payments;

  // Financial Reports / Cost Breakdown
  store.data.financialReports = [
    {
      id: uuidv4(),
      tripRequestId: 'REQ-3002',
      agreedCustomerPrice: 142000,
      estimatedSupplierExpense: 92000,
      projectedMargin: 50000,
      marginPercentage: 35.2,
      costBreakdown: [
        { category: 'Transport (4x4 Scorpio)', estimatedCost: 42000, confirmedCost: 40000 },
        { category: 'Hotels & Homestays', estimatedCost: 35000, confirmedCost: 35000 },
        { category: 'Permits & Sanctuary Fees', estimatedCost: 3000, confirmedCost: 3000 },
        { category: 'Meals & Logistics', estimatedCost: 12000, confirmedCost: 11500 }
      ],
      clearedByFinance: true,
      clearedAt: new Date(Date.now() - 36 * 3600000).toISOString()
    }
  ];

  // 9. Operational Trips
  const trips = [
    {
      id: uuidv4(),
      tripId: 'TRP-6001',
      tripRequestId: 'REQ-3003',
      customerName: 'Dr. Meenakshi Sundaram',
      customerPhone: '+91 94440 55667',
      customerEmail: 'meenakshi.s@chennaiclinic.org',
      packageName: 'Spiti Valley High-Pass Circuit',
      travelDates: '01 Dec 2026 - 07 Dec 2026',
      travellerCount: 3,
      salesEmpId: 'EMP-1002',
      assignedMediaEmpIds: ['EMP-1004'],
      status: 'SUPPLIER_CONFIRMED',
      createdAt: new Date(Date.now() - 80 * 3600000).toISOString()
    }
  ];
  store.data.trips = trips;

  // Supplier Arrangements
  store.data.tripSuppliers = [
    {
      id: uuidv4(),
      tripId: 'TRP-6001',
      supplierType: 'TRANSPORT',
      supplierName: 'Himalayan 4x4 Fleet (Driver: Tenzin)',
      contactPhone: '+91 94180 33441',
      quotedCost: 38000,
      confirmedCost: 38000,
      bookingRef: 'HIM-4X4-8891',
      status: 'CONFIRMED'
    },
    {
      id: uuidv4(),
      tripId: 'TRP-6001',
      supplierType: 'HOTEL',
      supplierName: 'Deyzor Boutique Hotel, Kaza',
      contactPhone: '+91 94184 00123',
      roomType: 'Deluxe Mountain View x 2',
      quotedCost: 28000,
      confirmedCost: 27500,
      bookingRef: 'DEY-KZ-104',
      status: 'CONFIRMED'
    }
  ];

  // 10. Media Assets
  const mediaAssets = [
    {
      id: uuidv4(),
      mediaId: 'MED-8001',
      tripId: 'TRP-6001',
      filename: 'key_monastery_sunset.jpg',
      category: 'ORIGINAL',
      url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200',
      visibility: 'PUBLIC_GALLERY',
      caption: 'Golden hour illumination on the cliffside Key Monastery in Spiti.',
      uploadedBy: 'EMP-1004',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      id: uuidv4(),
      mediaId: 'MED-8002',
      tripId: 'TRP-6001',
      filename: 'chandra_taal_reflection.jpg',
      category: 'EDITED',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200',
      visibility: 'CUSTOMER_DELIVERY',
      caption: 'Crystal reflections on the pristine waters of Chandra Taal lake.',
      uploadedBy: 'EMP-1004',
      createdAt: new Date(Date.now() - 9 * 86400000).toISOString()
    },
    {
      id: uuidv4(),
      mediaId: 'MED-8003',
      tripId: 'TRP-6001',
      filename: 'group_at_kunzum_pass.jpg',
      category: 'ORIGINAL',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
      visibility: 'PRIVATE',
      caption: 'Travellers unfurling prayer flags at 4551m Kunzum Pass.',
      uploadedBy: 'EMP-1004',
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
    }
  ];
  store.data.mediaAssets = mediaAssets;

  // 11. Blogs
  const blogPosts = [
    {
      id: uuidv4(),
      blogId: 'BLG-7001',
      title: 'How to Prepare for High-Altitude Acclimatization in Spiti Valley',
      slug: 'how-to-prepare-high-altitude-acclimatization-spiti',
      excerpt: 'Crucial health strategies, gradual ascent schedules, and packing wisdom for traversing passes above 4,000 meters.',
      body: `Crossing over into the high-altitude desert of Spiti Valley is a transformative encounter with geologic majesty. However, at heights exceeding 3,500 meters in Kaza and over 4,500 meters at Kunzum Pass, the air contains nearly 40% fewer oxygen molecules per breath.

## 1. Respect the Shimla-Kaza Ascent Gradient
Our signature itineraries purposely route travellers through the gradual ascent along the Hindustan-Tibet road from Shimla, Sarahan, Sangla, and Kalpa before crossing into Tabo. This allows your autonomic nervous system to produce reticulocytes naturally.

## 2. Hydration Without Cold Shock
Drinking 4–5 litres of warm or electrolyte-infused water daily is vital. Avoid chilled river water which can induce gastrointestinal spasms.

## 3. The Golden Rule
Never exert yourself on your first afternoon in Kaza. Sit quietly, sip warm butter tea, and let the mountain rhythm settle your pulse.`,
      coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200',
      category: 'Travel Advice',
      tags: ['Spiti', 'Health', 'High Altitude', 'Packing Guide'],
      authorEmpId: 'EMP-1004',
      authorName: 'Rohit Verma',
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
    },
    {
      id: uuidv4(),
      blogId: 'BLG-7002',
      title: 'Preserving Sacred Murals: A Pilgrimage to Tabo Monastery',
      slug: 'preserving-sacred-murals-tabo-monastery',
      excerpt: 'Inside the 1000-year-old mud-brick marvel often hailed as the Ajanta of the Himalayas.',
      body: 'Founded in 996 CE by the Tibetan Buddhist lotsawa Rinchen Zangpo, Tabo Monastery stands quietly in the wind-swept lower Spiti valley...',
      coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200',
      category: 'Culture & Heritage',
      tags: ['Culture', 'Tabo', 'Monasteries', 'History'],
      authorEmpId: 'EMP-1004',
      authorName: 'Rohit Verma',
      status: 'DRAFT',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    }
  ];
  store.data.blogPosts = blogPosts;

  // 12. Notifications
  const notifications = [
    {
      id: uuidv4(),
      recipientDept: 'MASTER',
      title: 'Trip Request Awaiting Master Approval',
      message: 'Trip Request REQ-3002 (Siddharth Roy - ₹1,42,000) has been verified by Finance and requires Master sign-off.',
      category: 'APPROVAL',
      linkedRecordType: 'TRIP_REQUEST',
      linkedRecordId: 'REQ-3002',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
    },
    {
      id: uuidv4(),
      recipientDept: 'SALES',
      title: 'Green Signal: Supplier Booking Clearance',
      message: 'Trip Request REQ-3003 (Dr. Meenakshi Sundaram) cleared by Master. You may now book transport and hotels.',
      category: 'TRIP_OPERATION',
      linkedRecordType: 'TRIP_REQUEST',
      linkedRecordId: 'REQ-3003',
      isRead: false,
      createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
    },
    {
      id: uuidv4(),
      recipientDept: 'FINANCE',
      title: 'New Trip Request Submitted for Review',
      message: 'Sales submitted Trip Request REQ-3001 (Rajesh Kothari - ₹95,000) for financial review & invoice generation.',
      category: 'FINANCE',
      linkedRecordType: 'TRIP_REQUEST',
      linkedRecordId: 'REQ-3001',
      isRead: false,
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
    }
  ];
  store.data.notifications = notifications;

  // 13. Audit Logs
  const auditLogs = [
    {
      id: uuidv4(),
      actorId: users[0].id,
      empId: 'EMP-1001',
      actorName: 'Vikramaditya Rathore',
      department: 'MASTER',
      action: 'ORGANIZATION_INITIALIZED',
      entityType: 'SYSTEM',
      entityId: 'SYS-INIT',
      details: { message: 'Organization departments, roles, and baseline permissions configured.' },
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
    },
    {
      id: uuidv4(),
      actorId: users[1].id,
      empId: 'EMP-1002',
      actorName: 'Priya Sharma',
      department: 'SALES',
      action: 'TRIP_REQUEST_SUBMITTED',
      entityType: 'TRIP_REQUEST',
      entityId: 'REQ-3001',
      details: { agreedAmount: 95000, customerName: 'Rajesh Kothari', travellers: 2 },
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
    },
    {
      id: uuidv4(),
      actorId: users[2].id,
      empId: 'EMP-1003',
      actorName: 'Arjun Mehta',
      department: 'FINANCE',
      action: 'PAYMENT_VERIFIED',
      entityType: 'PAYMENT',
      entityId: 'PAY-5001',
      details: { amount: 142000, method: 'UPI_QR_MANUAL', transactionRef: 'UPI/HDFC/631109884210' },
      createdAt: new Date(Date.now() - 36 * 3600000).toISOString()
    },
    {
      id: uuidv4(),
      actorId: users[0].id,
      empId: 'EMP-1001',
      actorName: 'Vikramaditya Rathore',
      department: 'MASTER',
      action: 'TRIP_APPROVED_FOR_SUPPLIER_BOOKING',
      entityType: 'TRIP_REQUEST',
      entityId: 'REQ-3003',
      details: { comment: 'Approved following complete payment receipt and viable margin.' },
      createdAt: new Date(Date.now() - 80 * 3600000).toISOString()
    }
  ];
  store.data.auditLogs = auditLogs;

  store.save();
  console.log('[Seed] Database seeded successfully!');
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}
