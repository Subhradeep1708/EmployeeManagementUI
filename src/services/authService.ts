import { apiFetch } from './api';
import type { UserSession } from '../types';

export const authService = {
  login: async (username: string, password: string): Promise<UserSession> => {
    const response = await apiFetch<{
      success: boolean;
      data: {
        token: string;
        username: string;
        role: string;
        userId: number;
      };
      message: string;
      statusCode: number;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.success && response.data) {
      const userSession: UserSession = {
        id: response.data.userId,
        username: response.data.username,
        email: response.data.role === 'HR' ? 'hr@ems-enterprise.com' : 'admin@ems-enterprise.com',
        token: response.data.token,
      };
      localStorage.setItem('auth-token', userSession.token);
      localStorage.setItem('auth-user', JSON.stringify(userSession));
      return userSession;
    } else {
      throw new Error(response.message || 'Invalid username or password.');
    }
  },

  logout: async (): Promise<void> => {
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
