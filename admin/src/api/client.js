const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('mm_token');
  const activeDept = localStorage.getItem('mm_active_dept') || 'MASTER';

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(activeDept && { 'x-active-department': activeDept }),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    // Handle CSV or Blob responses
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/csv')) {
      return await res.text();
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('mm_token');
        localStorage.removeItem('mm_user');
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  get: (url, opts) => apiRequest(url, { method: 'GET', ...opts }),
  post: (url, body, opts) => apiRequest(url, { method: 'POST', body: JSON.stringify(body), ...opts }),
  patch: (url, body, opts) => apiRequest(url, { method: 'PATCH', body: JSON.stringify(body), ...opts }),
  delete: (url, opts) => apiRequest(url, { method: 'DELETE', ...opts }),
};
