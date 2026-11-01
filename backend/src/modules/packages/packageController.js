import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { logAudit } from '../../middleware/audit.js';

export const packageController = {
  // 1. List packages
  async listPackages(req, res) {
    try {
      const { status, publicOnly } = req.query;
      let packages = store.get('packages');

      // If called without auth or explicitly publicOnly, filter to PUBLISHED
      if (publicOnly === 'true' || !req.user) {
        packages = packages.filter(p => p.status === 'PUBLISHED');
      } else if (status && status !== 'ALL') {
        packages = packages.filter(p => p.status === status);
      }

      return res.json(packages);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. Get single package
  async getPackage(req, res) {
    try {
      const { id } = req.params;
      const pkg = store.find('packages', p => p.id === id || p.packageId === id)[0];
      if (!pkg) {
        return res.status(404).json({ error: 'Tour package not found.' });
      }
      return res.json(pkg);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3. Create Package (Master)
  async createPackage(req, res) {
    try {
      const {
        name,
        shortDescription,
        duration,
        states = 'Himachal Pradesh',
        destinations = [],
        coverImage,
        basePrice,
        currency = 'INR',
        maxCapacity = 12,
        inclusions = [],
        exclusions = [],
        accommodationCategories = ['3_STAR', '4_STAR'],
        itineraries = []
      } = req.body;

      if (!name || !duration || !basePrice) {
        return res.status(400).json({ error: 'Package name, duration, and base price are required.' });
      }

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const packageId = `PKG-${slug.toUpperCase().slice(0, 10)}-${Date.now().toString(36).toUpperCase()}`;

      const newPackage = {
        id: uuidv4(),
        packageId,
        name: name.trim(),
        slug,
        shortDescription: shortDescription || '',
        duration: duration.trim(),
        states,
        destinations: Array.isArray(destinations) ? destinations : [destinations],
        coverImage: coverImage || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200',
        status: 'DRAFT',
        basePrice: parseFloat(basePrice),
        currency,
        maxCapacity: parseInt(maxCapacity, 10) || 12,
        inclusions: Array.isArray(inclusions) ? inclusions : [],
        exclusions: Array.isArray(exclusions) ? exclusions : [],
        accommodationCategories,
        itineraries: Array.isArray(itineraries) ? itineraries : [],
        createdBy: req.user.empId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      store.insert('packages', newPackage);
      logAudit(req, 'PACKAGE_CREATED', 'PACKAGE', newPackage.packageId, { name: newPackage.name, basePrice });

      return res.status(201).json(newPackage);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. Update Package (Master)
  async updatePackage(req, res) {
    try {
      const { id } = req.params;
      const pkg = store.find('packages', p => p.id === id || p.packageId === id)[0];
      if (!pkg) {
        return res.status(404).json({ error: 'Tour package not found.' });
      }

      const updates = { ...req.body, updatedAt: new Date().toISOString() };
      delete updates.id;
      delete updates.packageId;

      store.updateById('packages', pkg.id, updates);
      logAudit(req, 'PACKAGE_UPDATED', 'PACKAGE', pkg.packageId, { fields: Object.keys(updates) });

      return res.json({ message: 'Package updated successfully.', package: { ...pkg, ...updates } });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 5. Toggle Status (PUBLISHED, DRAFT, DISABLED)
  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const allowed = ['PUBLISHED', 'DRAFT', 'DISABLED'];

      if (!allowed.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
      }

      const pkg = store.find('packages', p => p.id === id || p.packageId === id)[0];
      if (!pkg) {
        return res.status(404).json({ error: 'Tour package not found.' });
      }

      store.updateById('packages', pkg.id, { status });
      logAudit(req, 'PACKAGE_STATUS_CHANGED', 'PACKAGE', pkg.packageId, { oldStatus: pkg.status, newStatus: status });

      return res.json({ message: `Package status updated to ${status}.`, package: { ...pkg, status } });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
