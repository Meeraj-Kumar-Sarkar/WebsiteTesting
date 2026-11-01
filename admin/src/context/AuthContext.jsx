import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('mm_token'));
  
  const [activeDepartment, setActiveDepartmentState] = useState(() => {
    return localStorage.getItem('mm_active_dept') || 'MASTER';
  });

  const [loading, setLoading] = useState(true);

  // Sync active department with user's permitted departments
  useEffect(() => {
    if (user && user.departments && user.departments.length > 0) {
      if (!user.departments.includes(activeDepartment) && !user.departments.includes('MASTER')) {
        const fallback = user.departments[0];
        setActiveDepartmentState(fallback);
        localStorage.setItem('mm_active_dept', fallback);
      }
    }
  }, [user]);

  const setActiveDepartment = (dept) => {
    setActiveDepartmentState(dept);
    localStorage.setItem('mm_active_dept', dept);
  };

  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password });
    localStorage.setItem('mm_token', res.token);
    localStorage.setItem('mm_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);

    // Default active department to first assigned
    const initialDept = res.user.departments.includes('MASTER') ? 'MASTER' : (res.user.departments[0] || 'SALES');
    setActiveDepartment(initialDept);

    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('mm_token');
    localStorage.removeItem('mm_user');
    localStorage.removeItem('mm_active_dept');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      setUser(res.user);
      localStorage.setItem('mm_user', JSON.stringify(res.user));
    } catch (e) {
      console.warn('Failed to refresh user profile:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const hasPermission = (permissionCode) => {
    if (!user) return false;
    if (user.departments?.includes('MASTER') || user.permissions?.includes('*')) return true;
    return user.permissions?.includes(permissionCode);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      activeDepartment,
      setActiveDepartment,
      login,
      logout,
      hasPermission,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
