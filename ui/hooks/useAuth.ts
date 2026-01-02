'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMe, logout as apiLogout, login as apiLogin, register as apiRegister } from '@/lib/api';
import type { UserResponse, AuthResponse } from '@/lib/api';

export interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (error: any) {
          // Token invalid or API error, clear it
          console.warn('Login Load failed:', error?.message || 'Failed to verify authentication');
          
          // Only clear token if it's an auth error (401/403), not network errors
          if (error?.status === 401 || error?.status === 403) {
            localStorage.removeItem('auth_token');
            setToken(null);
          } else {
            // For network errors, keep token but log the issue
            console.error('Network error during auth check. Token kept but user not loaded.');
          }
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiLogin(email, password);
    setToken(response.accessToken);
    setUser(response.user as UserResponse);
    return response;
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    name?: string
  ): Promise<AuthResponse> => {
    const response = await apiRegister(email, password, name);
    setToken(response.accessToken);
    setUser(response.user as UserResponse);
    return response;
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setToken(null);
    setUser(null);
  }, []);

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
  };
}


