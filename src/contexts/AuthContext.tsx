import React, { useState, type ReactNode } from 'react';
import type { User } from '@/types';
import { authService, type LoginCredentials, type RegisterData } from '@/services/authService';
import { AuthContext } from './authContextDef';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Synchronous initialization from localStorage session
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
