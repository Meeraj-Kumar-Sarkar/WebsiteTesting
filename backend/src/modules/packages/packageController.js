import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { logAudit } from '../../middleware/audit.js';

function normalizePackage(pkg) {
  if (!pkg) return null;
  const basePrice = Number(pkg.basePrice ?? pkg.startingPrice ?? 0);
  const states = pkg.states || pkg.destinationName || 'Himachal Pradesh';
  const destinationId = pkg.destinationId || states.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const durationStr = pkg.duration || '7 Days / 6 Nights';
  const daysMatch = String(durationStr).match(/(\d+)\s*Day/i) || String(durationStr).match(/(\d+)/);
  const durationDays = pkg.durationDays || (daysMatch ? parseInt(daysMatch[1], 10) : 7);

  const rawItinerary = Array.isArray(pkg.itineraries) && pkg.itineraries.length > 0
    ? pkg.itineraries
    : (Array.isArray(pkg.itinerary) ? pkg.itinerary : []);

  const itinerary = rawItinerary.map((item, idx) => ({
    day: item.day || idx + 1,
    title: item.title || `Day ${idx + 1}`,
    description: item.description || '',
    meals: item.meals || 'Breakfast & Dinner',
    stay: item.stay || 'Selected Mountain Stay'
  }));

  const defaultAccommodationOptions = [
    {
      tier: '3-star',
      name: 'Standard Heritage & Homestays',
      priceMultiplier: 1.0,
      pricePerPerson: basePrice,
      available: true,
      features: [
        'Verified local homestays & 3-star mountain lodges',
        'Private en-suite bathrooms with hot water',
        'Traditional home-cooked regional meals'
      ],
      description: 'Authentic family-run retreats and comfortable mountain guesthouses.'
    },
    {
      tier: '4-star',
      name: 'Premium Boutique Eco-Lodges',
      priceMultiplier: 1.35,
      pricePerPerson: Math.round(basePrice * 1.35),
      available: true,
      features: [
        'Boutique mountain hotels & eco-resorts',
        'Room heating & panoramic valley views',
        'Multi-cuisine dining with local produce'
      ],
      description: 'Elevated comfort with heated rooms and scenic mountain vistas.'
    },
    {
      tier: '5-star',
      name: 'Luxury Himalayan Retreats',
      priceMultiplier: 1.8,
      pricePerPerson: Math.round(basePrice * 1.8),
      available: Array.isArray(pkg.accommodationCategories) ? pkg.accommodationCategories.includes('5_STAR') : false,
      unavailableReason: '5-star luxury properties are limited in remote high-altitude zones; 4-star boutique lodges provide the highest standard here.',
      features: [
        'Premier luxury mountain resorts & glamping domes',
        'Chauffeured premium SUV & concierge service',
        'Curated fine dining & wellness facilities'
      ],
      description: 'Bespoke luxury mountain resorts and glamping experiences.'
    }
  ];

  const slug = pkg.slug || pkg.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || pkg.id;

  return {
    ...pkg,
    slug,
    basePrice,
    startingPrice: basePrice,
    states,
    destinationId,
    destinationName: pkg.destinationName || states,
    duration: durationStr,
    durationDays,
    tripType: pkg.tripType || 'Adventure',
    label: pkg.label || (pkg.featured ? 'Featured' : null),
    featured: pkg.featured !== undefined ? Boolean(pkg.featured) : true,
    shortDescription: pkg.shortDescription || pkg.shortOverview || pkg.overview || '',
    shortOverview: pkg.shortOverview || pkg.shortDescription || pkg.overview || '',
    overview: pkg.overview || pkg.shortDescription || pkg.shortOverview || '',
    highlights: Array.isArray(pkg.highlights) && pkg.highlights.length > 0
      ? pkg.highlights
      : (Array.isArray(pkg.destinations) && pkg.destinations.length > 0
        ? pkg.destinations.map(d => `Explore ${d}`)
        : ['Private 4x4 / SUV transport', 'Curated mountain stays', 'Local experienced guide']),
    inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions : [],
    exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions : [],
    itineraries: itinerary,
    itinerary,
    accommodationOptions: Array.isArray(pkg.accommodationOptions) && pkg.accommodationOptions.length > 0
      ? pkg.accommodationOptions
      : defaultAccommodationOptions,
    importantNotes: Array.isArray(pkg.importantNotes) ? pkg.importantNotes : [
      'Gradual acclimatization is built into the route schedule.',
      'Please carry valid government photo ID for inner line permits.'
    ]
  };
}

export const packageController = {
  // 1. List packages
  async listPackages(req, res) {
    try {
      const { status, publicOnly } = req.query;
      let packages = store.get('packages').map(normalizePackage);

      if (publicOnly === 'true' || !req.user) {
        packages = packages.filter(p => p.status === 'PUBLISHED' || p.status === 'ACTIVE');
      } else if (status && status !== 'ALL') {
        packages = packages.filter(p => p.status === status);
      }

      packages.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return res.json(packages);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. Get single package by id, packageId, or slug
  async getPackage(req, res) {
    try {
      const { id } = req.params;
      const pkg = store.findOne('packages', p =>
        p.id === id ||
        p.packageId === id ||
        p.slug === id ||
        (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === id)
      );
      if (!pkg) {
        return res.status(404).json({ error: 'Tour package not found.' });
      }
      return res.json(normalizePackage(pkg));
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
        overview,
        duration,
        states = 'Himachal Pradesh',
        destinationId,
        destinationName,
        destinations = [],
        highlights = [],
        tripType = 'Adventure',
        label = '',
        featured = true,
        coverImage,
        heroImage,
        basePrice,
        startingPrice,
        currency = 'INR',
        maxCapacity = 12,
        inclusions = [],
        exclusions = [],
        accommodationCategories = ['3_STAR', '4_STAR'],
        accommodationOptions = [],
        itineraries = [],
        itinerary = [],
        importantNotes = [],
        status = 'PUBLISHED'
      } = req.body;

      const resolvedPrice = parseFloat(basePrice ?? startingPrice);
      if (!name || !duration || isNaN(resolvedPrice)) {
        return res.status(400).json({ error: 'Package name, duration, and base price are required.' });
      }

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const packageId = `PKG-${slug.toUpperCase().slice(0, 8)}-${Date.now().toString(36).toUpperCase().slice(-4)}`;

      const parsedDestinations = Array.isArray(destinations)
        ? destinations
        : String(destinations || '').split(',').map(s => s.trim()).filter(Boolean);

      const parsedHighlights = Array.isArray(highlights) && highlights.length > 0
        ? highlights
        : parsedDestinations.map(d => `Explore ${d}`);

      const rawItin = Array.isArray(itineraries) && itineraries.length > 0 ? itineraries : itinerary;

      const newPackage = normalizePackage({
        id: uuidv4(),
        packageId,
        name: name.trim(),
        slug,
        shortDescription: shortDescription || overview || '',
        overview: overview || shortDescription || '',
        duration: duration.trim(),
        states: states || destinationName || 'Himachal Pradesh',
        destinationId: destinationId || (states || 'Himachal Pradesh').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        destinationName: destinationName || states || 'Himachal Pradesh',
        destinations: parsedDestinations,
        highlights: parsedHighlights,
        tripType,
        label,
        featured: Boolean(featured),
        coverImage: coverImage || '',
        heroImage: heroImage || coverImage || '',
        status: status === 'ACTIVE' ? 'PUBLISHED' : (status || 'PUBLISHED'),
        basePrice: resolvedPrice,
        startingPrice: resolvedPrice,
        currency,
        maxCapacity: parseInt(maxCapacity, 10) || 12,
        inclusions: Array.isArray(inclusions) ? inclusions : [],
        exclusions: Array.isArray(exclusions) ? exclusions : [],
        accommodationCategories,
        accommodationOptions: Array.isArray(accommodationOptions) ? accommodationOptions : [],
        itineraries: Array.isArray(rawItin) ? rawItin : [],
        importantNotes: Array.isArray(importantNotes) ? importantNotes : [],
        createdBy: req.user?.empId || 'MASTER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      store.insert('packages', newPackage);
      logAudit(req, 'PACKAGE_CREATED', 'PACKAGE', newPackage.packageId, { name: newPackage.name, basePrice: resolvedPrice });

      return res.status(201).json(newPackage);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. Update Package (Master)
  async updatePackage(req, res) {
    try {
      const { id } = req.params;
      const pkg = store.findById('packages', id);
      if (!pkg) {
        return res.status(404).json({ error: 'Tour package not found.' });
      }

      const updates = { ...req.body, updatedAt: new Date().toISOString() };
      delete updates.id;
      delete updates.packageId;

      if (updates.basePrice !== undefined) {
        updates.basePrice = parseFloat(updates.basePrice);
        updates.startingPrice = updates.basePrice;
      }

      const merged = normalizePackage({ ...pkg, ...updates });
      store.updateById('packages', pkg.id, merged);
      logAudit(req, 'PACKAGE_UPDATED', 'PACKAGE', pkg.packageId, { fields: Object.keys(updates) });

      return res.json({ message: 'Package updated successfully.', package: merged });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 5. Toggle Status (PUBLISHED, DRAFT, DISABLED)
  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      let { status } = req.body;
      if (status === 'ACTIVE') status = 'PUBLISHED';
      if (status === 'ARCHIVED') status = 'DISABLED';

      const allowed = ['PUBLISHED', 'DRAFT', 'DISABLED'];
      if (!allowed.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
      }

      const pkg = store.findById('packages', id);
      if (!pkg) {
        return res.status(404).json({ error: 'Tour package not found.' });
      }

      const updated = store.updateById('packages', pkg.id, { status });
      logAudit(req, 'PACKAGE_STATUS_CHANGED', 'PACKAGE', pkg.packageId, { oldStatus: pkg.status, newStatus: status });

      return res.json({ message: `Package status updated to ${status}.`, package: normalizePackage(updated) });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 6. Delete Package (Master)
  async deletePackage(req, res) {
    try {
      const { id } = req.params;
      const pkg = store.findById('packages', id);
      if (!pkg) {
        return res.status(404).json({ error: 'Tour package not found.' });
      }

      store.deleteById('packages', pkg.id);
      logAudit(req, 'PACKAGE_DELETED', 'PACKAGE', pkg.packageId, { name: pkg.name });

      return res.json({ message: 'Package deleted successfully.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
