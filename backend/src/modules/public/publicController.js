import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { logAudit } from '../../middleware/audit.js';

function buildDerivedDestinationsFromPackages() {
  const publishedPackages = store.find('packages', p => p.status === 'PUBLISHED' || p.status === 'ACTIVE');
  const map = new Map();

  for (const pkg of publishedPackages) {
    const stateName = pkg.states || pkg.destinationName || 'Himachal Pradesh';
    const slug = stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (!map.has(slug)) {
      map.set(slug, {
        id: slug,
        slug,
        name: stateName,
        state: stateName,
        tagline: pkg.shortDescription || `Curated mountain journeys across ${stateName}`,
        description: pkg.overview || pkg.shortDescription || `Explore handpicked routes and stays in ${stateName}.`,
        longDescription: pkg.overview || pkg.shortDescription || '',
        coverImage: pkg.coverImage || '',
        heroImage: pkg.heroImage || pkg.coverImage || '',
        bestTimeToVisit: 'May to October',
        altitude: '1,500m – 4,500m',
        temperatureRange: '5°C to 24°C',
        idealDuration: pkg.duration || '6 to 9 Days',
        featured: true,
        highlights: Array.isArray(pkg.highlights) && pkg.highlights.length > 0
          ? pkg.highlights
          : (Array.isArray(pkg.destinations) ? pkg.destinations.map(d => `Visit ${d}`) : []),
        popularSpots: Array.isArray(pkg.destinations)
          ? pkg.destinations.map(d => ({ name: d, desc: `Key route waypoint in ${stateName}.` }))
          : []
      });
    }
  }

  return Array.from(map.values());
}

export const publicController = {
  // 1. Public Settings & Live Catalogue Summary
  async getPublicSettings(req, res) {
    try {
      const settings = store.data.systemSettings || {};
      const packagesCount = store.find('packages', p => p.status === 'PUBLISHED' || p.status === 'ACTIVE').length;
      const blogsCount = store.find('blogPosts', b => b.status === 'PUBLISHED').length;
      const galleryCount = store.find('mediaAssets', m => m.visibility === 'PUBLIC_GALLERY').length;
      const staysCount = store.get('stays').length;
      const storedDestinations = store.get('destinations');
      const destinationsCount = storedDestinations.length || buildDerivedDestinationsFromPackages().length;

      return res.json({
        companyName: settings.companyName || 'Mountain and Memories Travel LLP',
        gstNumber: settings.gstNumber || '',
        registeredAddress: settings.registeredAddress || 'Manali, Himachal Pradesh, India',
        supportEmail: settings.supportEmail || 'contact@mountainandmemories.com',
        supportPhone: settings.supportPhone || '+91 98765 43210',
        upiId: settings.upiId || '',
        upiName: settings.upiName || '',
        privacyNotice: settings.privacyNotice || '',
        counts: {
          packages: packagesCount,
          blogs: blogsCount,
          gallery: galleryCount,
          stays: staysCount,
          destinations: destinationsCount
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. List Destinations
  async listDestinations(req, res) {
    try {
      const stored = store.get('destinations');
      if (stored.length > 0) {
        return res.json(stored);
      }
      return res.json(buildDerivedDestinationsFromPackages());
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3. Get Single Destination
  async getDestination(req, res) {
    try {
      const { slug } = req.params;
      const stored = store.get('destinations');
      const list = stored.length > 0 ? stored : buildDerivedDestinationsFromPackages();
      const dest = list.find(d => d.id === slug || d.slug === slug);
      if (!dest) {
        return res.status(404).json({ error: 'Destination not found.' });
      }
      return res.json(dest);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. Create Destination (Admin)
  async createDestination(req, res) {
    try {
      const {
        name,
        state,
        tagline,
        description,
        longDescription,
        coverImage,
        heroImage,
        bestTimeToVisit = 'May to October',
        altitude = '1,500m – 4,500m',
        temperatureRange = '5°C to 24°C',
        idealDuration = '6 to 9 Days',
        highlights = [],
        popularSpots = []
      } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Destination name is required.' });
      }

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const newDest = {
        id: slug,
        destinationId: `DST-${Date.now().toString(36).toUpperCase()}`,
        slug,
        name: name.trim(),
        state: state || name.trim(),
        tagline: tagline || '',
        description: description || '',
        longDescription: longDescription || description || '',
        coverImage: coverImage || '',
        heroImage: heroImage || coverImage || '',
        bestTimeToVisit,
        altitude,
        temperatureRange,
        idealDuration,
        featured: true,
        highlights: Array.isArray(highlights) ? highlights : String(highlights || '').split('\n').map(s => s.trim()).filter(Boolean),
        popularSpots: Array.isArray(popularSpots) ? popularSpots : [],
        createdAt: new Date().toISOString()
      };

      store.insert('destinations', newDest);
      logAudit(req, 'DESTINATION_CREATED', 'DESTINATION', slug, { name: newDest.name });

      return res.status(201).json(newDest);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 5. Delete Destination (Admin)
  async deleteDestination(req, res) {
    try {
      const { id } = req.params;
      const deleted = store.deleteById('destinations', id);
      if (!deleted) {
        return res.status(404).json({ error: 'Destination not found.' });
      }
      logAudit(req, 'DESTINATION_DELETED', 'DESTINATION', id);
      return res.json({ message: 'Destination deleted.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 6. List Stays / Properties
  async listStays(req, res) {
    try {
      const stays = store.get('stays');
      return res.json(stays);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 7. Create Stay / Property (Admin)
  async createStay(req, res) {
    try {
      const {
        name,
        destinationId,
        destinationName,
        district = '',
        altitude = '',
        tier = '3-star',
        tierLabel,
        tagline = '',
        pricePerNight = '',
        rating = 4.5,
        reviewsCount = 0,
        coverImage = '',
        overview = '',
        amenities = [],
        bestFor = ''
      } = req.body;

      if (!name || !destinationName) {
        return res.status(400).json({ error: 'Property name and destination name are required.' });
      }

      const tierLabels = {
        '3-star': '3 Star Property',
        '4-star': '4 Star Property',
        '4-star-premium': '4 Star Premium Property',
        '5-star': '5 Star Property'
      };

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const resolvedDestId = destinationId || destinationName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const newStay = {
        id: `${slug}-${Date.now().toString(36)}`,
        stayId: `STY-${Date.now().toString(36).toUpperCase()}`,
        destinationId: resolvedDestId,
        destinationName: destinationName.trim(),
        district,
        altitude,
        tier,
        tierLabel: tierLabel || tierLabels[tier] || 'Boutique Property',
        name: name.trim(),
        tagline,
        pricePerNight: pricePerNight || 'On Request',
        rating: Number(rating) || 4.5,
        reviewsCount: Number(reviewsCount) || 0,
        coverImage,
        overview,
        amenities: Array.isArray(amenities) ? amenities : String(amenities || '').split(',').map(s => s.trim()).filter(Boolean),
        bestFor,
        createdAt: new Date().toISOString()
      };

      store.insert('stays', newStay);
      logAudit(req, 'STAY_CREATED', 'STAY', newStay.stayId, { name: newStay.name, destinationName });

      return res.status(201).json(newStay);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 8. Delete Stay (Admin)
  async deleteStay(req, res) {
    try {
      const { id } = req.params;
      const deleted = store.deleteById('stays', id);
      if (!deleted) {
        return res.status(404).json({ error: 'Stay property not found.' });
      }
      logAudit(req, 'STAY_DELETED', 'STAY', id);
      return res.json({ message: 'Stay property deleted.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
