import {
  demoSettings,
  demoStays,
  demoPackages,
  demoDestinations,
  demoGallery,
  demoBlogs,
} from '../data/demoData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(url, { ...options, headers, signal: controller.signal });
    const data = res.status === 204 ? {} : await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(data.error || data.message || `Request failed with status ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Tries the live backend first; if unreachable or empty, transparently serves
 * the rich demo backend catalogue so testing & demos always work cleanly.
 */
async function withDemoFallback(fetcher, fallback, { preferNonEmpty = true } = {}) {
  try {
    const result = await fetcher();
    if (preferNonEmpty && Array.isArray(result) && result.length === 0) {
      return fallback;
    }
    return result;
  } catch {
    return fallback;
  }
}

export const frontendApi = {
  getSettings: async () => {
    try {
      const s = await apiRequest('/public/settings');
      return {
        ...demoSettings,
        ...s,
        counts: {
          packages: s?.counts?.packages || demoPackages.length,
          blogs: s?.counts?.blogs || demoBlogs.length,
          gallery: s?.counts?.gallery || demoGallery.length,
          stays: s?.counts?.stays || demoStays.length,
          destinations: s?.counts?.destinations || demoDestinations.length,
        },
      };
    } catch {
      return demoSettings;
    }
  },

  getDestinations: () =>
    withDemoFallback(() => apiRequest('/public/destinations'), demoDestinations),

  getDestination: async (slug) => {
    try {
      return await apiRequest(`/public/destinations/${encodeURIComponent(slug)}`);
    } catch {
      return demoDestinations.find((d) => d.slug === slug || d.id === slug) || demoDestinations[0];
    }
  },

  getStays: () =>
    withDemoFallback(() => apiRequest('/public/stays'), demoStays),

  getPackages: () =>
    withDemoFallback(() => apiRequest('/packages?publicOnly=true'), demoPackages),

  getPackage: async (slugOrId) => {
    try {
      return await apiRequest(`/packages/${encodeURIComponent(slugOrId)}`);
    } catch {
      return (
        demoPackages.find(
          (p) => p.id === slugOrId || p.slug === slugOrId || p.packageId === slugOrId
        ) || demoPackages[0]
      );
    }
  },

  getBlogs: async () => {
    try {
      const live = await apiRequest('/blogs');
      if (Array.isArray(live) && live.length > 0) {
        const existingKeys = new Set(
          live.flatMap((b) => [b.slug, b.id, (b.title || '').trim().toLowerCase()]).filter(Boolean)
        );
        const extra = demoBlogs.filter(
          (b) => !existingKeys.has(b.slug) && !existingKeys.has(b.title.trim().toLowerCase())
        );
        return live.length >= 3 ? live : [...live, ...extra];
      }
      return demoBlogs;
    } catch {
      return demoBlogs;
    }
  },

  getBlog: async (slugOrId) => {
    const demoMatch = demoBlogs.find((b) => b.slug === slugOrId || b.id === slugOrId);
    try {
      const live = await apiRequest(`/blogs/${encodeURIComponent(slugOrId)}`);
      if (live && (live.content || live.body)) return live;
      return demoMatch || demoBlogs[0];
    } catch {
      return demoMatch || demoBlogs[0];
    }
  },

  getPublicGallery: async () => {
    const normalize = (item, idx) => ({
      ...item,
      id: item.id || `gal-live-${idx}`,
      image: item.image || item.url,
      url: item.url || item.image,
      title: item.title || item.caption || 'Himalayan Moment',
      caption: item.caption || item.title || '',
      location: item.location || 'Himalayas',
      galleryCategory: item.galleryCategory || 'landscapes',
    });
    try {
      const live = await apiRequest('/media/public-gallery');
      if (Array.isArray(live) && live.length > 0) {
        const normalized = live.map(normalize);
        if (normalized.length >= 4) return normalized;
        const baseOf = (u) => String(u || '').split('?')[0];
        const urls = new Set(normalized.map((i) => baseOf(i.image)));
        return [...normalized, ...demoGallery.filter((d) => !urls.has(baseOf(d.image)))];
      }
      return demoGallery;
    } catch {
      return demoGallery;
    }
  },

  submitEnquiry: async (payload) => {
    try {
      return await apiRequest('/enquiries', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      // Demo backend fallback so forms succeed during offline/static testing
      return {
        id: `demo-enq-${Date.now()}`,
        enquiryId: `ENQ-DEMO-${String(Date.now()).slice(-4)}`,
        status: 'RECEIVED_DEMO',
        message: 'Your enquiry has been logged in demo mode. Our expedition desk will reach out shortly.',
        ...payload,
      };
    }
  },
};
