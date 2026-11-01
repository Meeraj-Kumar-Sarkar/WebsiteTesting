import { store } from '../database/db.js';

export function generateId(prefix) {
  const collectionMap = {
    EMP: { col: 'users', key: 'empId', start: 1001 },
    ENQ: { col: 'enquiries', key: 'enquiryId', start: 2001 },
    REQ: { col: 'tripRequests', key: 'tripRequestId', start: 3001 },
    INV: { col: 'invoices', key: 'invoiceId', start: 4001 },
    PAY: { col: 'payments', key: 'paymentId', start: 5001 },
    TRP: { col: 'trips', key: 'tripId', start: 6001 },
    BLG: { col: 'blogPosts', key: 'blogId', start: 7001 },
    MED: { col: 'mediaAssets', key: 'mediaId', start: 8001 },
    REF: { col: 'refundRequests', key: 'refundId', start: 9001 }
  };

  const meta = collectionMap[prefix];
  if (!meta) {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
  }

  const items = store.get(meta.col);
  let highest = meta.start;
  for (const item of items) {
    const val = item[meta.key];
    if (val && val.startsWith(`${prefix}-`)) {
      const num = parseInt(val.split('-')[1], 10);
      if (!isNaN(num) && num >= highest) {
        highest = num + 1;
      }
    }
  }

  return `${prefix}-${highest}`;
}
