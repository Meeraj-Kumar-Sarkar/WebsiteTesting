import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Check if PostgreSQL pool should be initialized
let pgPool = null;
if (config.databaseUrl) {
  try {
    pgPool = new Pool({
      connectionString: config.databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    console.log('[Database] PostgreSQL pool initialized');
  } catch (err) {
    console.warn('[Database] PostgreSQL connection initialization failed, using local persistent store fallback:', err.message);
  }
}

// In-Memory & File-backed Store Fallback
class Store {
  constructor() {
    this.data = {
      users: [],
      departments: [],
      roles: [],
      permissions: [],
      userDepartmentRoles: [],
      customers: [],
      enquiries: [],
      enquiryNotes: [],
      travellers: [],
      tripRequests: [],
      tripStatusHistory: [],
      financialReports: [],
      invoices: [],
      payments: [],
      refundRequests: [],
      packages: [],
      itineraries: [],
      trips: [],
      tripSuppliers: [],
      mediaAssets: [],
      mediaArchives: [],
      blogPosts: [],
      auditLogs: [],
      notifications: [],
      systemSettings: {
        companyName: 'Mountain and Memories Travel LLP',
        gstNumber: '02AABCM1234F1Z5',
        registeredAddress: 'Old Manali Road, Manali, Himachal Pradesh - 175131',
        supportEmail: 'contact@mountainandmemories.com',
        supportPhone: '+91 98765 43210',
        upiId: 'mountainmemories@bank',
        upiName: 'Mountain and Memories Travel LLP',
        autoPaymentExpiryDays: 3,
        privacyNotice: 'We store, alter, archive your data.'
      }
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        if (raw.trim()) {
          this.data = { ...this.data, ...JSON.parse(raw) };
        }
      } else {
        this.save();
      }
    } catch (e) {
      console.error('[Database] Error reading store.json, using defaults:', e.message);
    }
  }

  save() {
    try {
      const tempPath = `${STORE_PATH}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, STORE_PATH);
    } catch (e) {
      console.error('[Database] Error writing store.json:', e.message);
    }
  }

  get(collection) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    return this.data[collection];
  }

  find(collection, filterFn = () => true) {
    return this.get(collection).filter(filterFn);
  }

  findOne(collection, filterFn) {
    return this.get(collection).find(filterFn) || null;
  }

  findById(collection, id) {
    return this.get(collection).find(item => item.id === id || item.empId === id || item.enquiryId === id || item.tripRequestId === id || item.invoiceId === id || item.tripId === id) || null;
  }

  insert(collection, item) {
    const list = this.get(collection);
    list.push(item);
    this.save();
    return item;
  }

  update(collection, filterFn, updates) {
    const list = this.get(collection);
    let updatedCount = 0;
    for (let i = 0; i < list.length; i++) {
      if (filterFn(list[i])) {
        list[i] = { ...list[i], ...updates, updatedAt: new Date().toISOString() };
        updatedCount++;
      }
    }
    if (updatedCount > 0) {
      this.save();
    }
    return updatedCount;
  }

  updateById(collection, id, updates) {
    const list = this.get(collection);
    const index = list.findIndex(item => item.id === id || item.empId === id || item.enquiryId === id || item.tripRequestId === id || item.invoiceId === id || item.tripId === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
      this.save();
      return list[index];
    }
    return null;
  }

  delete(collection, filterFn) {
    const originalLength = this.get(collection).length;
    this.data[collection] = this.get(collection).filter(item => !filterFn(item));
    const deletedCount = originalLength - this.data[collection].length;
    if (deletedCount > 0) {
      this.save();
    }
    return deletedCount;
  }
}

export const store = new Store();
export const pool = pgPool;
