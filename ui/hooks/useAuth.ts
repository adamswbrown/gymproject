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
        } catch (error) {
          // Token invalid, clear it
          localStorage.removeItem('auth_token');
          setToken(null);
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


