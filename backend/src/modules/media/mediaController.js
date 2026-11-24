import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { generateId } from '../../utils/idGenerator.js';
import { storageService } from '../../services/storageService.js';
import { logAudit, notify } from '../../middleware/audit.js';

function normalizeMediaAsset(m) {
  if (!m) return null;
  return {
    ...m,
    title: m.title || m.caption || m.filename || 'Himalayan Photograph',
    image: m.url,
    location: m.location || 'Himalayas',
    galleryCategory: m.galleryCategory || 'landscapes'
  };
}

export const mediaController = {
  // 1. List all media (Admin)
  async listAllMedia(req, res) {
    try {
      const { visibility, category } = req.query;
      let media = store.get('mediaAssets').map(normalizeMediaAsset);

      if (visibility && visibility !== 'ALL') {
        media = media.filter(m => m.visibility === visibility);
      }
      if (category && category !== 'ALL') {
        media = media.filter(m => m.category === category);
      }

      media.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(media);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. List media for a specific trip
  async getTripMedia(req, res) {
    try {
      const { tripId } = req.params;
      const { category, visibility } = req.query;

      const trip = store.findById('trips', tripId);
      const targetTripId = trip ? trip.tripId : tripId;
      const targetUuid = trip ? trip.id : tripId;

      let media = store
        .find('mediaAssets', m => m.tripId === targetTripId || m.tripId === targetUuid || m.tripId === tripId)
        .map(normalizeMediaAsset);

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

  // 3. Upload / Register Media Asset (Supports both multipart file upload and URL)
  async uploadMedia(req, res) {
    try {
      const tripParam = req.params.tripId || req.body.tripId || null;
      let resolvedUrl = req.body.url;
      let resolvedFilename = req.body.filename;

      if (req.file) {
        const subDir = req.params.tripId ? `trips/${req.params.tripId}` : 'general';
        resolvedUrl = storageService.getFileUrl(`${subDir}/${req.file.filename}`);
        resolvedFilename = req.file.originalname || req.file.filename;
      }

      const {
        title,
        category = 'ORIGINAL',
        galleryCategory = 'landscapes',
        visibility = 'PRIVATE',
        caption,
        location = 'Himalayas',
        altitude = '',
        sourceType = 'COMPANY_CAPTURED',
        rightsAttribution,
        consentReference
      } = req.body;

      if (!resolvedUrl) {
        return res.status(400).json({ error: 'A media file or URL is required.' });
      }

      const trip = tripParam ? store.findById('trips', tripParam) : null;
      const tripId = trip ? trip.tripId : (tripParam || 'GENERAL');

      const mediaId = generateId('MED');

      const newAsset = normalizeMediaAsset({
        id: uuidv4(),
        mediaId,
        tripId,
        filename: resolvedFilename || path.basename(resolvedUrl) || `asset-${Date.now()}.jpg`,
        url: resolvedUrl,
        title: title || caption || resolvedFilename || 'Himalayan Photograph',
        category: String(category).toUpperCase(),
        galleryCategory,
        visibility: String(visibility).toUpperCase(),
        caption: caption || title || '',
        location,
        altitude,
        sourceType,
        rightsAttribution: rightsAttribution || 'Mountain and Memories In-House Media Team',
        consentReference: consentReference || store.data.systemSettings?.privacyNotice || '',
        uploadedBy: req.user?.empId || 'SYSTEM',
        createdAt: new Date().toISOString()
      });

      store.insert('mediaAssets', newAsset);
      logAudit(req, 'MEDIA_ASSET_UPLOADED', 'MEDIA', mediaId, { tripId, visibility: newAsset.visibility });

      return res.status(201).json(newAsset);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. Standalone File Upload Helper (for package/blog cover images)
  async uploadFileOnly(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided.' });
      }
      const url = storageService.getFileUrl(`general/${req.file.filename}`);
      return res.status(201).json({
        url,
        filename: req.file.originalname || req.file.filename
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 5. Update Media Visibility / Metadata
  async updateVisibility(req, res) {
    try {
      const { id } = req.params;
      const { visibility, caption, title, location, galleryCategory } = req.body;
      const allowed = ['PRIVATE', 'CUSTOMER_DELIVERY', 'PUBLIC_GALLERY'];

      if (visibility && !allowed.includes(visibility)) {
        return res.status(400).json({ error: `Invalid visibility. Must be one of: ${allowed.join(', ')}` });
      }

      const asset = store.findById('mediaAssets', id);
      if (!asset) {
        return res.status(404).json({ error: 'Media asset not found.' });
      }

      const updates = {};
      if (visibility) updates.visibility = visibility;
      if (caption !== undefined) updates.caption = caption;
      if (title !== undefined) updates.title = title;
      if (location !== undefined) updates.location = location;
      if (galleryCategory !== undefined) updates.galleryCategory = galleryCategory;

      const updated = store.updateById('mediaAssets', asset.id, updates);
      logAudit(req, 'MEDIA_VISIBILITY_UPDATED', 'MEDIA', asset.mediaId, {
        oldVisibility: asset.visibility,
        newVisibility: visibility || asset.visibility
      });

      return res.json({
        message: `Media updated successfully.`,
        asset: normalizeMediaAsset(updated)
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 6. Delete Media Asset
  async deleteMedia(req, res) {
    try {
      const { id } = req.params;
      const asset = store.findById('mediaAssets', id);
      if (!asset) {
        return res.status(404).json({ error: 'Media asset not found.' });
      }

      store.deleteById('mediaAssets', asset.id);
      logAudit(req, 'MEDIA_ASSET_DELETED', 'MEDIA', asset.mediaId);

      return res.json({ message: 'Media asset deleted.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 7. Customer Archive Review & Share Link Generation
  async shareCustomerArchive(req, res) {
    try {
      const { tripId } = req.params;
      const { expiryDays = 14, customerEmail } = req.body;

      const trip = store.findById('trips', tripId);
      if (!trip) {
        return res.status(404).json({ error: 'Trip not found.' });
      }

      const deliveryMedia = store.find(
        'mediaAssets',
        m => (m.tripId === trip.tripId || m.tripId === trip.id) &&
          (m.visibility === 'CUSTOMER_DELIVERY' || m.visibility === 'PUBLIC_GALLERY')
      );

      const shareToken = uuidv4();
      const expiresAt = new Date(Date.now() + expiryDays * 86400000).toISOString();

      const archive = {
        id: uuidv4(),
        tripId: trip.tripId,
        shareToken,
        itemCount: deliveryMedia.length,
        expiresAt,
        sharedWithEmail: customerEmail || trip.customerEmail,
        sharedBy: req.user.empId,
        shareUrl: `/archive/${shareToken}`,
        createdAt: new Date().toISOString()
      };

      store.insert('mediaArchives', archive);

      logAudit(req, 'CUSTOMER_ARCHIVE_SHARED', 'TRIP', trip.tripId, {
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
        deliveryMedia: deliveryMedia.map(normalizeMediaAsset)
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 8. Public Archive Retrieval by Share Token
  async getSharedArchive(req, res) {
    try {
      const { shareToken } = req.params;
      const archive = store.findOne('mediaArchives', a => a.shareToken === shareToken);
      if (!archive) {
        return res.status(404).json({ error: 'Archive not found.' });
      }

      if (new Date() > new Date(archive.expiresAt)) {
        return res.status(410).json({ error: 'This archive share link has expired.' });
      }

      const trip = store.findById('trips', archive.tripId);
      const media = store
        .find('mediaAssets', m => m.tripId === archive.tripId && (m.visibility === 'CUSTOMER_DELIVERY' || m.visibility === 'PUBLIC_GALLERY'))
        .map(normalizeMediaAsset);

      return res.json({
        archive,
        trip: trip ? {
          tripId: trip.tripId,
          customerName: trip.customerName,
          packageName: trip.packageName,
          travelDates: trip.travelDates
        } : null,
        media
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 9. Public Gallery (Accessible without authentication by website)
  async getPublicGallery(req, res) {
    try {
      const assets = store
        .find('mediaAssets', m => m.visibility === 'PUBLIC_GALLERY')
        .map(normalizeMediaAsset);
      assets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(assets);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
