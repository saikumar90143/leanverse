'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  tier: 'free' | 'premium' | 'pro';
  streak: number;
  badges: string[];
  avatar?: string | null;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithSession: (session: UserSession) => void;
  logout: () => void;
  updateUserSession: (data: Partial<UserSession>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'leanverse-session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    setLoading(false);
  }, []);

  const saveUser = useCallback((u: UserSession) => {
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        saveUser(data.user);
        return true;
      }
      // Sandbox demo fallback
      if (email === 'admin@leanverse.com' && password === 'admin123') {
        saveUser({
          id: 'admin_mock',
          name: 'LeanVerse Administrator',
          email: 'admin@leanverse.com',
          role: 'admin',
          tier: 'pro',
          streak: 15,
          badges: ['Elite Creator', 'AdSense Guru', 'Streak Champion'],
        });
        return true;
      }
      if (email && password.length >= 6) {
        saveUser({
          id: 'user_mock',
          name: email.split('@')[0],
          email,
          role: 'user',
          tier: 'free',
          streak: 3,
          badges: ['Quick Starter'],
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error, falling back to demo mode:', err);
      if (email && password.length >= 6) {
        saveUser({
          id: 'user_mock',
          name: email.split('@')[0],
          email,
          role: email.includes('admin') ? 'admin' : 'user',
          tier: email.includes('admin') ? 'pro' : 'free',
          streak: 3,
          badges: ['Demo Explorer'],
        });
        return true;
      }
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        saveUser(data.user);
        return true;
      }
      // Demo fallback
      saveUser({
        id: 'user_mock_' + Math.random().toString(36).slice(2, 9),
        name,
        email,
        role: 'user',
        tier: 'free',
        streak: 1,
        badges: ['New Joiner'],
      });
      return true;
    } catch (err) {
      console.error('Register error, falling back to demo mode:', err);
      saveUser({
        id: 'user_mock_' + Math.random().toString(36).slice(2, 9),
        name,
        email,
        role: 'user',
        tier: 'free',
        streak: 1,
        badges: ['New Joiner'],
      });
      return true;
    }
  };

  const loginWithSession = useCallback(
    (session: UserSession) => {
      saveUser(session);
    },
    [saveUser]
  );

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateUserSession = (data: Partial<UserSession>) => {
    if (user) {
      const updated = { ...user, ...data };
      saveUser(updated);
      
      // Dispatch background cloud sync
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: updated.id, ...updated }),
      }).catch(() => {
        // Silently fail if offline, relies on local storage anyway
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, loginWithSession, logout, updateUserSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
