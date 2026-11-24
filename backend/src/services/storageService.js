import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_ROOT = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = req.params.tripId ? `trips/${req.params.tripId}` : 'general';
    const target = path.join(UPLOAD_ROOT, subDir);
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }
    cb(null, target);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const safeBase = path
      .basename(file.originalname || 'asset', ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50);
    cb(null, `${Date.now()}-${safeBase}${ext}`);
  }
});

export const uploadMiddleware = multer({
  storage: diskStorage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

export const storageService = {
  getUploadPath(subDir = '') {
    const target = path.join(UPLOAD_ROOT, subDir);
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }
    return target;
  },

  getFileUrl(relativePath) {
    const clean = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
    const base = (config.storage.publicBaseUrl || '/uploads').replace(/\/+$/, '');
    return `${base}/${clean}`;
  }
};
