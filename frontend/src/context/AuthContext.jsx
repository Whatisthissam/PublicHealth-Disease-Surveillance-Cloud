import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

// ── Demo accounts (used when backend is unreachable) ─────────────────────────
const DEMO_USERS = {
  admin:        { id: 1, username: 'admin',        email: 'admin@publichealth.in',   role: 'admin',   full_name: 'Dr. Arjun Sharma' },
  manager_mum:  { id: 2, username: 'manager_mum',  email: 'manager@publichealth.in', role: 'manager', full_name: 'Dr. Priya Mehta' },
  staff_mum_1:  { id: 3, username: 'staff_mum_1',  email: 'staff@publichealth.in',   role: 'staff',   full_name: 'Rahul Patil' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ph_token'));
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('ph_token');
      const savedUser  = localStorage.getItem('ph_user');
      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          if (savedToken.startsWith('demo_')) setDemoMode(true);
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    // ── Try real backend first ───────────────────────────────────────────────
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token: newToken, user: newUser } = response.data;
      setToken(newToken);
      setUser(newUser);
      setDemoMode(false);
      localStorage.setItem('ph_token', newToken);
      localStorage.setItem('ph_user', JSON.stringify(newUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return newUser;
    } catch (err) {
      const isNetworkError = !err.response;
      if (isNetworkError) {
        let demoUser = DEMO_USERS[username];
        let isValid = false;

        if (demoUser && password === 'password') {
          isValid = true;
        } else {
          const localUsers = JSON.parse(localStorage.getItem('ph_demo_users') || '[]');
          const found = localUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
          if (found && (password === 'password' || password === found.password)) {
            demoUser = {
              id: found.id,
              username: found.username,
              email: found.email,
              role: found.role,
              full_name: found.full_name
            };
            isValid = true;
          }
        }

        if (isValid && demoUser) {
          const fakeToken = `demo_${username}_${Date.now()}`;
          setToken(fakeToken);
          setUser(demoUser);
          setDemoMode(true);
          localStorage.setItem('ph_token', fakeToken);
          localStorage.setItem('ph_user', JSON.stringify(demoUser));
          return demoUser;
        }
        throw new Error('Demo login: invalid credentials. Check username or use default DEMO accounts with password "password".');
      }
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setDemoMode(false);
    localStorage.removeItem('ph_token');
    localStorage.removeItem('ph_user');
    delete api.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = !!token && !!user;
  const hasRole = (...roles) => roles.includes(user?.role);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated, hasRole, demoMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
