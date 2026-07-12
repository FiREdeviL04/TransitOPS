import React, { createContext, useState, useEffect, useContext } from 'react';

export interface UserSession {
  email: string;
  name: string;
  role: 'Admin' | 'Driver';
  driverId?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoggedIn: boolean;
  login: (email: string, role: 'Admin' | 'Driver', name?: string, driverId?: string) => void;
  logout: () => void;
  hasPermission: (action: 'create' | 'read' | 'update' | 'delete', resource: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Restore session from localStorage
    const savedSession = localStorage.getItem('to_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setUser(parsed);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem('to_session');
      }
    }
  }, []);

  const login = (email: string, role: 'Admin' | 'Driver', name?: string, driverId?: string) => {
    const displayName = name || (role === 'Admin' ? 'James Donovan' : 'Alex Rivera');
    const actualDriverId = driverId || (role === 'Driver' ? 'd-alex' : undefined);
    const session: UserSession = {
      email,
      name: displayName,
      role,
      driverId: actualDriverId,
    };
    localStorage.setItem('to_session', JSON.stringify(session));
    setUser(session);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('to_session');
    setUser(null);
    setIsLoggedIn(false);
  };

  const hasPermission = (action: 'create' | 'read' | 'update' | 'delete', resource: string) => {
    if (!isLoggedIn || !user) return false;
    if (user.role === 'Admin') return true;
    
    if (user.role === 'Driver') {
      // Driver can only read: vehicles, trips, profile, fuel, notifications
      if (action === 'read') {
        return ['vehicles', 'trips', 'profile', 'fuel', 'notifications', 'dashboard'].includes(resource);
      }
      // Driver can only create fuel logs
      if (action === 'create' && resource === 'fuel') {
        return true;
      }
      return false;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, hasPermission }}>
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
