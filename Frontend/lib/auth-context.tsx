'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from './types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phoneNum: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid email or password');
    }

    const data = await response.json();
    const user: User = {
      id: data.userId?.toString() ?? '0',
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
    };
    setCurrentUser(user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, phoneNum: string) => {
    const response = await fetch('http://localhost:8080/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phoneNum }),
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || 'Registration failed');
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: currentUser !== null, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
