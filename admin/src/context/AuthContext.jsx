import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { DEPARTMENTS } from '../config/navigation';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const saved = localStorage.getItem('mm_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    localStorage.removeItem('mm_user');
    return null;
  }
}

/** Pick a valid workspace for the user, honouring their saved preference. */
function resolveDepartment(user, preferred) {
  const depts = user?.departments || [];
  if (!depts.length) return 'SALES';
  const isMaster = depts.includes('MASTER');
  if (preferred && DEPARTMENTS.includes(preferred) && (isMaster || depts.includes(preferred))) return preferred;
  return isMaster ? 'MASTER' : depts[0];
}

function preferredWorkspace() {
  try {
    const p = JSON.parse(localStorage.getItem('mm_prefs') || '{}');
    return p.defaultWorkspace && p.defaultWorkspace !== 'auto' ? p.defaultWorkspace : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('mm_token'));
  const [activeDepartment, setActiveDepartmentState] = useState(
    () => localStorage.getItem('mm_active_dept') || 'MASTER'
  );
  const [loading, setLoading] = useState(true);

  const setActiveDepartment = useCallback((dept) => {
    setActiveDepartmentState(dept);
    localStorage.setItem('mm_active_dept', dept);
  }, []);

  // Keep the active workspace valid for the user's permitted departments
  // (e.g. after a role change, or a stale value left by another account).
  useEffect(() => {
    if (!user?.departments?.length) return;
    const valid = resolveDepartment(user, activeDepartment);
    if (valid !== activeDepartment) setActiveDepartment(valid);
  }, [user, activeDepartment, setActiveDepartment]);

  const clearSession = useCallback(() => {
    localStorage.removeItem('mm_token');
    localStorage.removeItem('mm_user');
    localStorage.removeItem('mm_active_dept');
    setToken(null);
    setUser(null);
  }, []);

  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password });
    localStorage.setItem('mm_token', res.token);
    localStorage.setItem('mm_user', JSON.stringify(res.user));
    // Set the workspace before the user state so the first render uses it
    setActiveDepartment(resolveDepartment(res.user, preferredWorkspace()));
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = useCallback(() => {
    clearSession();
    window.location.replace('/login');
  }, [clearSession]);

  const refreshUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      setUser(res.user);
      localStorage.setItem('mm_user', JSON.stringify(res.user));
    } catch (e) {
      // 401 = invalid token, 403 = account frozen/suspended/blocked → end the session.
      if (e.status === 401 || e.status === 403) {
        clearSession();
      } else {
        console.warn('Failed to refresh user profile:', e.message);
      }
    } finally {
      setLoading(false);
    }
  }, [token, clearSession]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const hasPermission = useCallback(
    (permissionCode) => {
      if (!user) return false;
      if (user.departments?.includes('MASTER') || user.permissions?.includes('*')) return true;
      return Boolean(user.permissions?.includes(permissionCode));
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        activeDepartment,
        setActiveDepartment,
        login,
        logout,
        hasPermission,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
