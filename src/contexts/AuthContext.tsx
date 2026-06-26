import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Admin } from '../types';
import { fetchMe } from '../services/auth';

interface AuthContextValue {
  admin: Admin | null;
  loading: boolean;
  setAdmin: (admin: Admin | null) => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const me = await fetchMe();
      setAdmin(me);
    } catch {
      setAdmin(null);
    }
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, setAdmin, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
