// import { apiFetch } from './api';
import type { UserSession } from '../types';

export const authService = {
  login: async (username: string, password: string): Promise<UserSession> => {
    // API Integration (Uncomment when ASP.NET backend is running):
    /*
    return apiFetch<UserSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    */
    
    // Mock Implementation:
    if (username === 'admin' && password === 'admin123') {
      const mockSession: UserSession = {
        id: 1,
        username: 'admin',
        email: 'admin@ems-enterprise.com',
        token: 'mock-jwt-token-xyz123',
      };
      localStorage.setItem('auth-token', mockSession.token);
      localStorage.setItem('auth-user', JSON.stringify(mockSession));
      return mockSession;
    }
    throw new Error('Invalid username or password (use admin/admin123)');
  },

  logout: async (): Promise<void> => {
    // Optional: notify backend API
    // await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
  },

  getCurrentUser: (): UserSession | null => {
    const userJson = localStorage.getItem('auth-user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as UserSession;
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem('auth-token') !== null;
  }
};
