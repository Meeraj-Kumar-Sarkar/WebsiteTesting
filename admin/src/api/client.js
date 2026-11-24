const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('mm_token');
  const activeDept = localStorage.getItem('mm_active_dept') || 'MASTER';
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(activeDept && { 'x-active-department': activeDept }),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (networkErr) {
    // fetch only rejects on network failure / CORS / abort
    if (networkErr?.name === 'AbortError') throw networkErr;
    const err = new Error('Unable to reach the server. Please check your connection and try again.');
    err.status = 0;
    err.cause = networkErr;
    console.error(`[API Error] ${endpoint}:`, networkErr);
    throw err;
  }

  // Handle CSV responses
  const contentType = res.headers.get('content-type') || '';
  if (res.ok && contentType.includes('text/csv')) {
    return res.text();
  }

  const data = res.status === 204 ? {} : await res.json().catch(() => ({}));

  if (!res.ok) {
    // Only force a logout when an authenticated session was rejected
    if (res.status === 401 && token) {
      localStorage.removeItem('mm_token');
      localStorage.removeItem('mm_user');
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/register') && !path.includes('/forgot-password')) {
        window.location.href = '/login';
      }
    }
    const err = new Error(data.error || data.message || `Request failed with status ${res.status}`);
    err.status = res.status;
    err.data = data;
    console.error(`[API Error] ${endpoint}:`, err.message);
    throw err;
  }

  return data;
}

const withBody = (body) => (body instanceof FormData ? body : JSON.stringify(body ?? {}));

export const api = {
  get: (url, opts) => apiRequest(url, { method: 'GET', ...opts }),
  post: (url, body, opts) => apiRequest(url, { method: 'POST', body: withBody(body), ...opts }),
  put: (url, body, opts) => apiRequest(url, { method: 'PUT', body: withBody(body), ...opts }),
  patch: (url, body, opts) => apiRequest(url, { method: 'PATCH', body: withBody(body), ...opts }),
  delete: (url, opts) => apiRequest(url, { method: 'DELETE', ...opts }),
};
