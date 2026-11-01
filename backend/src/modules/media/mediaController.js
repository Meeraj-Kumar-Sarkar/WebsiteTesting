import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { generateId } from '../../utils/idGenerator.js';
import { logAudit, notify } from '../../middleware/audit.js';

export const mediaController = {
  // 1. List media for a specific trip
  async getTripMedia(req, res) {
    try {
      const { tripId } = req.params;
      const { category, visibility } = req.query;

      let media = store.find('mediaAssets', m => m.tripId === tripId);

      if (category && category !== 'ALL') {
        media = media.filter(m => m.category === category);
      }

      if (visibility && visibility !== 'ALL') {
        media = media.filter(m => m.visibility === visibility);
      }

      media.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(media);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. Upload / Register Media Asset (Private by default)
  async uploadMedia(req, res) {
    try {
      const {
        tripId,
        filename,
        url,
        category = 'ORIGINAL', // 'ORIGINAL', 'EDITED'
        visibility = 'PRIVATE', // 'PRIVATE', 'CUSTOMER_DELIVERY', 'PUBLIC_GALLERY'
        caption,
        sourceType = 'COMPANY_CAPTURED',
        rightsAttribution,
        consentReference
      } = req.body;

      if (!tripId || !url) {
        return res.status(400).json({ error: 'Trip ID and media URL/key are required.' });
      }

      const mediaId = generateId('MED');

      const newAsset = {
        id: uuidv4(),
        mediaId,
        tripId,
        filename: filename || `asset-${Date.now()}.jpg`,
        url,
        category: category.toUpperCase(),
        visibility: visibility.toUpperCase(), // defaults to PRIVATE
        caption: caption || '',
        sourceType,
        rightsAttribution: rightsAttribution || 'Mountain and Memories In-House Media Team',
        consentReference: consentReference || 'Temporary notice: We store, alter, archive your data.',
        uploadedBy: req.user.empId,
        createdAt: new Date().toISOString()
      };

      store.insert('mediaAssets', newAsset);
      logAudit(req, 'MEDIA_ASSET_UPLOADED', 'MEDIA', mediaId, { tripId, visibility: newAsset.visibility });

      return res.status(201).json(newAsset);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3. Update Media Visibility (e.g. mark for Public Gallery or Customer Delivery)
  async updateVisibility(req, res) {
    try {
      const { id } = req.params;
      const { visibility, caption } = req.body;
      const allowed = ['PRIVATE', 'CUSTOMER_DELIVERY', 'PUBLIC_GALLERY'];

      if (!allowed.includes(visibility)) {
        return res.status(400).json({ error: `Invalid visibility. Must be one of: ${allowed.join(', ')}` });
      }

      const asset = store.findById('mediaAssets', id);
      if (!asset) {
        return res.status(404).json({ error: 'Media asset not found.' });
      }

      const updates = { visibility };
      if (caption !== undefined) updates.caption = caption;

      store.updateById('mediaAssets', asset.id, updates);
      logAudit(req, 'MEDIA_VISIBILITY_UPDATED', 'MEDIA', asset.mediaId, {
        oldVisibility: asset.visibility,
        newVisibility: visibility
      });

      return res.json({ message: `Media visibility changed to ${visibility}.`, asset: { ...asset, ...updates } });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. Customer Archive Review & Share Link Generation
  async shareCustomerArchive(req, res) {
    try {
      const { tripId } = req.params;
      const { expiryDays = 14, customerEmail } = req.body;

      const trip = store.findOne('trips', t => t.tripId === tripId);
      if (!trip) {
        return res.status(404).json({ error: 'Trip not found.' });
      }

      // Collect only media marked as CUSTOMER_DELIVERY (or approved originals)
      const deliveryMedia = store.find('mediaAssets', m => m.tripId === tripId && (m.visibility === 'CUSTOMER_DELIVERY' || m.visibility === 'PUBLIC_GALLERY'));

      const shareToken = uuidv4();
      const expiresAt = new Date(Date.now() + expiryDays * 86400000).toISOString();

      const archive = {
        id: uuidv4(),
        tripId,
        shareToken,
        itemCount: deliveryMedia.length,
        expiresAt,
        sharedWithEmail: customerEmail || trip.customerEmail,
        sharedBy: req.user.empId,
        shareUrl: `/archive/${shareToken}`,
        createdAt: new Date().toISOString()
      };

      store.insert('mediaArchives', archive);

      logAudit(req, 'CUSTOMER_ARCHIVE_SHARED', 'TRIP', tripId, {
        itemCount: deliveryMedia.length,
        expiresAt
      });

      notify({
        recipientDept: 'SALES',
        title: 'Customer Trip Media Archive Shared',
        message: `Media team shared private photo/video archive for ${trip.tripId} (${trip.customerName}) containing ${deliveryMedia.length} assets.`,
        category: 'MEDIA',
        linkedType: 'TRIP',
        linkedId: trip.tripId
      });

      return res.json({
        message: 'Customer media archive package generated.',
        archive,
        deliveryMedia
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 5. Public Gallery (Accessible without authentication by website)
  async getPublicGallery(req, res) {
    try {
      const assets = store.find('mediaAssets', m => m.visibility === 'PUBLIC_GALLERY');
      return res.json(assets);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
