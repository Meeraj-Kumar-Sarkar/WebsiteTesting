import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_ROOT = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

export const storageService = {
  getUploadPath(subDir = '') {
    const target = path.join(UPLOAD_ROOT, subDir);
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }
    return target;
  },

  getFileUrl(relativePath) {
    const clean = relativePath.replace(/\\/g, '/');
    return `/uploads/${clean}`;
  }
};
