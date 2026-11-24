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

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let pgPool = null;
if (config.databaseUrl) {
  try {
    pgPool = new Pool({
      connectionString: config.databaseUrl,
      ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
    });
    console.log('[Database] PostgreSQL connection pool initialized');
  } catch (err) {
    console.warn('[Database] PostgreSQL pool initialization warning:', err.message);
  }
}

const matchesRecordId = (item, id) => {
  if (!item || !id) return false;
  return (
    item.id === id ||
    item.empId === id ||
    item.enquiryId === id ||
    item.tripRequestId === id ||
    item.invoiceId === id ||
    item.paymentId === id ||
    item.refundId === id ||
    item.packageId === id ||
    item.tripId === id ||
    item.blogId === id ||
    item.mediaId === id ||
    item.destinationId === id ||
    item.stayId === id ||
    item.slug === id
  );
};

class Store {
  constructor() {
    this.data = this.getDefaultState();
    this.load();
  }

  getDefaultState() {
    return {
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
      destinations: [],
      stays: [],
      itineraries: [],
      trips: [],
      tripSuppliers: [],
      mediaAssets: [],
      mediaArchives: [],
      blogPosts: [],
      auditLogs: [],
      notifications: [],
      systemSettings: {
        companyName: config.upi.name || 'Mountain and Memories Travel LLP',
        gstNumber: '',
        registeredAddress: 'Manali, Himachal Pradesh, India',
        supportEmail: config.masterAdmin.email || 'contact@mountainandmemories.com',
        supportPhone: config.masterAdmin.phone || '+91 98765 43210',
        upiId: config.upi.id,
        upiName: config.upi.name,
        autoPaymentExpiryDays: 3,
        privacyNotice: 'Customer travel and media data is securely managed in accordance with company privacy policy.'
      }
    };
  }

  load() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        if (raw.trim()) {
          const parsed = JSON.parse(raw);
          this.data = {
            ...this.getDefaultState(),
            ...parsed,
            systemSettings: {
              ...this.getDefaultState().systemSettings,
              ...(parsed.systemSettings || {})
            }
          };
        }
      } else {
        this.save();
      }
    } catch (e) {
      console.error('[Database] Error reading store.json, using defaults:', e.message);
    }
  }

  async syncFromPostgres() {
    if (!pgPool) return;
    try {
      await pgPool.query(`
        CREATE TABLE IF NOT EXISTS app_collections (
          collection_name VARCHAR(100) PRIMARY KEY,
          payload JSONB NOT NULL,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      const { rows } = await pgPool.query('SELECT collection_name, payload FROM app_collections');
      if (rows.length > 0) {
        for (const row of rows) {
          this.data[row.collection_name] = row.payload;
        }
        this.saveFileOnly();
      } else {
        await this.syncToPostgres();
      }
    } catch (err) {
      console.warn('[Database] PostgreSQL sync skipped:', err.message);
    }
  }

  async syncToPostgres(collectionName = null) {
    if (!pgPool) return;
    try {
      const keys = collectionName ? [collectionName] : Object.keys(this.data);
      for (const key of keys) {
        await pgPool.query(
          `INSERT INTO app_collections (collection_name, payload, updated_at)
           VALUES ($1, $2::jsonb, NOW())
           ON CONFLICT (collection_name)
           DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
          [key, JSON.stringify(this.data[key])]
        );
      }
    } catch (err) {
      console.warn('[Database] PostgreSQL write warning:', err.message);
    }
  }

  saveFileOnly() {
    try {
      const tempPath = `${STORE_PATH}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, STORE_PATH);
    } catch (e) {
      console.error('[Database] Error writing store.json:', e.message);
    }
  }

  save(collectionName = null) {
    this.saveFileOnly();
    if (pgPool) {
      this.syncToPostgres(collectionName);
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
    if (!id) return null;
    return this.get(collection).find(item => matchesRecordId(item, id)) || null;
  }

  insert(collection, item) {
    const list = this.get(collection);
    list.push(item);
    this.save(collection);
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
      this.save(collection);
    }
    return updatedCount;
  }

  updateById(collection, id, updates) {
    if (!id) return null;
    const list = this.get(collection);
    const index = list.findIndex(item => matchesRecordId(item, id));
    if (index !== -1) {
      list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
      this.save(collection);
      return list[index];
    }
    return null;
  }

  delete(collection, filterFn) {
    const originalLength = this.get(collection).length;
    this.data[collection] = this.get(collection).filter(item => !filterFn(item));
    const deletedCount = originalLength - this.data[collection].length;
    if (deletedCount > 0) {
      this.save(collection);
    }
    return deletedCount;
  }

  deleteById(collection, id) {
    if (!id) return false;
    const deleted = this.delete(collection, item => matchesRecordId(item, id));
    return deleted > 0;
  }
}

export const store = new Store();
export const pool = pgPool;
